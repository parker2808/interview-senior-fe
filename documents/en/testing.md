# Testing

Seniors are not hired to write `sum(2, 3)` tests. In a frontend interview you are being scored on **strategy**: which layers catch which failures, what you refuse to test, how you keep CI green under flake, and how you would introduce tests into a legacy Vue app without freezing delivery.

The shape that usually wins: a **testing trophy**, not a textbook pyramid. Lots of **integration tests around user behavior** (real Vue components + real Pinia + MSW). A **few Playwright paths** that print money or gate auth. **Unit tests for pure domain** (money, permissions, tax, parsers). Static analysis (TS, ESLint, axe) as the cheap base. Vue 3 + TypeScript first; the same philosophy is React Testing Library / Playwright in a Next app.

---

## Table of Contents

1. [Unit Testing with Vitest](#81-unit-testing-with-vitest)

2. [Component Testing with Vue Test Utils](#82-component-testing-with-vue-test-utils)

3. [E2E Testing with Playwright](#83-e2e-testing-with-playwright)

4. [Test Coverage](#84-test-coverage)

5. [TDD/BDD Methodology](#85-tddbdd-methodology)

6. [Contract Tests, Visual Regression, and Legacy Vue](#86-contract-tests-visual-regression-and-legacy-vue)

---

## III. Development Practices

## 8. Testing

### 8.1. Unit Testing with Vitest

**What they actually ask**

- “How do you unit-test a Vue app?”
- “How do you test composables?”
- “Do you mock the API / Vue Router / Pinia?”
- They are listening for strategy, not a Vitest config walkthrough.

**How a senior answers**

- **Decision:** Unit-test **pure domain** and small composables whose contract is a function, not a component tree. Integration-test anything that mounts Vue, hits HTTP, or talks to the router. Put HTTP behind **MSW**, not `vi.mock` of every module.
- **Constraint:** A composable that pulls Vue Router, Pinia, `useFetch`, and a toast plugin is not a unit. Treat it as integration or split the pure core out.
- **Failure mode:** Mocking “the world” (Vue internals, entire axios, child components, timers you forgot to restore). Tests stay green while checkout breaks. Snapshots of huge markup rot and get `-u`’d.
- **Measure:** Tests fail when the **user-visible or domain contract** changes. They do not fail when you rename an internal `ref`. Track flake rate and time-to-signal on CI, not line coverage.

**What not to test**

- Implementation details: internal refs, private helpers, CSS class names used as selectors.
- Vue internals: `nextTick` plumbing, compiler output, reactivity bookkeeping.
- Snapshots of whole page markup.
- Thin wrappers around libraries you did not write.
- “It renders” tests with no assertion about behavior.

**Vitest in production (Vue 3 + TS)**

- **Composables + async:** after triggering work, `await flushPromises()` (or Vue Testing Library’s `waitFor`) so the microtask queue drains. Forgetting this is the #1 false-red.
- **Fake timers:** debounce, retry backoff, session expiry. `vi.useFakeTimers()` + `advanceTimersByTimeAsync`, then restore. Mixing real and fake timers is a flake factory.
- **HTTP:** MSW at the network boundary. One source of truth for “what the API returns.” Do not `vi.mock('@/api')` in every file unless you are isolating a pure mapper.
- **Pinia:** `setActivePinia(createPinia())` and drive the real store with fixtures. Mock a store only when the unit under test is not the store.

```ts
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { flushPromises } from "@vue/test-utils";
import { useCatalogSearch } from "./useCatalogSearch";

const server = setupServer(
  http.get("/api/catalog", ({ request }) => {
    const q = new URL(request.url).searchParams.get("q") ?? "";
    return HttpResponse.json({ items: q ? [{ sku: "A", name: q }] : [] });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it("surfaces results after the request settles", async () => {
  vi.useFakeTimers();
  const { query, items } = useCatalogSearch({ debounceMs: 300 });
  query.value = "sku-9";
  await vi.advanceTimersByTimeAsync(300);
  await flushPromises();
  expect(items.value).toEqual([{ sku: "A", name: "sku-9" }]);
  vi.useRealTimers();
});
```

Keep money logic as a pure function the composable calls. That is the actual unit:

```ts
export function invoiceTotalCents(lines: Line[], taxBps: number): number {
  const sub = lines.reduce((sum, l) => sum + l.qty * l.unitCents, 0);
  return sub + Math.round((sub * taxBps) / 10_000);
}
```

**Tradeoffs**

| Approach | Wins | Loses |
| --- | --- | --- |
| Pure unit + MSW integration | Fast, deterministic, tests contracts | Requires a seam (domain fn / API module) |
| `vi.mock` everything | Easy to write | Couples tests to internals; false confidence |
| Testing trophy | Catches “user cannot pay” bugs | Integration tests are slower than `sum()` |

**Production gotchas**

- `globals: true` hides missing imports and fights ESLint. Prefer explicit `import { describe, it, expect, vi } from "vitest"`.
- jsdom is not a browser: no layout, limited `IntersectionObserver` / `ResizeObserver`. Do not unit-test virtualizers or focus traps there — Playwright.
- Fake timers leak across files if `afterEach` does not restore.
- MSW must use the same origin/path the composable actually calls (including Nuxt `/api` proxies).

**Follow-ups**

- How do you test a composable that uses `onMounted`? (Extract the fetch; or mount a harness component.)
- Difference vs React: Vitest + Vue Testing Library ≈ Jest/Vitest + React Testing Library. Same “by role / by text” rule.
- Why not Cypress component tests as the default in 2026? (Playwright + Vitest cover the trophy; a third runner is cost.)

---

### 8.2. Component Testing with Vue Test Utils

**What they actually ask**

- `mount` vs `shallowMount`?
- How do you wait for async UI?
- They may hand you a form and ask what you would assert.

**How a senior answers**

- **Decision:** Prefer the **Testing Library philosophy** even when the runner is Vue Test Utils: query **by role, label, and text**, click like a user, assert what the user sees. Vue Testing Library (`@testing-library/vue`) is the default I would introduce on a greenfield Vue 3 app. On React/Next, this is React Testing Library — same contract.
- **Constraint:** `shallowMount` stubs children. You are no longer testing the integration you ship (slots, provide/inject, Teleport, nested forms). Use it only to isolate a leaf when a child is an expensive chart, a map, or an uncontrolled third-party widget.
- **Failure mode:** `wrapper.find('.btn-primary')` + snapshot of the whole HTML. Refactors that do not change behavior burn a day of `-u`. `shallowMount` hides the bug where `PayButton` never wired `emit('paid')`.
- **Measure:** A component test fails when the **accessible name or user flow** breaks. Async: `await wrapper.find('button').trigger('click')` is not enough if the handler `await`s — `flushPromises()` / `waitFor`.

```ts
import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import PayButton from "./PayButton.vue";

it("disables Pay while the payment intent is in flight", async () => {
  const user = userEvent.setup();
  render(PayButton, {
    props: { amountCents: 1999, currency: "USD" },
  });

  await user.click(screen.getByRole("button", { name: /pay \$19\.99/i }));

  expect(screen.getByRole("button", { name: /processing/i })).toBeDisabled();
});
```

VTU equivalent of the same decision: `getByRole` via `wrapper.get('[aria-label=…]')` is still better than `.btn-pay`. Prefer Testing Library.

**mount vs shallow**

- **`mount`:** real children. Finds provide/inject bugs, slot bugs, Teleport to `body`. Default for anything with behavior.
- **`shallowMount`:** speed and isolation. Hides integration bugs; stubs often miss attrs/listeners. If you need it often, the component is doing too much.

**Async updates**

Vue flushes DOM updates asynchronously. After Pinia writes, `await` the click, then `flushPromises()` (and `nextTick` if you are asserting DOM that depends on a watcher). For lists that grow, assert with `waitFor(() => expect(screen.getByRole('listitem')).toBeTruthy())`.

**Pinia / router**

Install the real plugin with a fixture store or `createTestingPinia({ initialState, stubActions: false })`. Stubbing every action tests a mock, not checkout. For Vue Router, prefer `createRouter` with a memory history over mocking `$router.push`.

**Tradeoffs**

| Tool | Use when |
| --- | --- |
| Vue Testing Library | User-facing components (forms, dialogs, tables) |
| Vue Test Utils `mount` | You need emitted events, `vm`, or slots at a low level |
| `shallowMount` | Child is a canvas/map you cannot afford to render |
| Playwright component tests | Need real layout / real focus (rare; usually E2E the path) |

**Production gotchas**

- Teleport / `<dialog>` render outside the component root — query `document.body`.
- `v-if` vs `v-show`: `v-if` is absent from DOM; `v-show` is hidden. Query the accessible state, not `exists()` vs `isVisible()` mixups.
- `defineAsyncComponent` + Suspense: tests must `await` fallback → resolved, or you assert a spinner forever.
- Stubbing `console.error` to hide Vue warnings is how teams miss extra fragment / hydration issues.

**Follow-ups**

- How do you test a Headless UI / Radix-style listbox? (Keyboard + roles, not internal open ref.)
- React parallel: `userEvent` + `getByRole` is the shared senior language across Vue and Next.

---

### 8.3. E2E Testing with Playwright

**What they actually ask**

- “What do you E2E?”
- “How do you stop flakes?”
- “POM or not?”
- Auth, CI parallelism, traces.

**How a senior answers**

- **Decision:** Playwright only on **critical paths**: login, permission-denied, checkout/pay, refund, SSO. Everything else is too expensive. Selectors: **role and name**, not CSS. Auto-waiting assertions; **never `waitForTimeout`**.
- **Constraint:** E2E is slow, coupled to env, and the first thing CI skips when it is red. Budget a handful of specs per app, plus one smoke per deploy.
- **Failure mode:** Arbitrary sleeps, racing animations, shared mutable test users, clicking before hydration, `networkidle` on apps that keep websockets open. Parallel workers colliding on the same email.
- **Measure:** p95 duration, flake rate (retries that then pass), and **trace-on-retry** so a red job is diagnosable without SSH.

**Flake control**

- Locator assertions (`toBeVisible`, `toHaveURL`) retry. Timeouts belong on the expect, not `sleep`.
- Disable animations in test CSS / `prefers-reduced-motion`.
- Wait for **specific responses** (`page.waitForResponse`) when the UI does not expose ready state — still better than timeout.
- Isolate data: unique emails, API-seeded fixtures, no “delete all then recreate” on a shared staging DB.
- Hydration: in Nuxt/Next, click after the interactive element is enabled, not after `load`.

**POM vs fixtures**

- **Fixtures** (Playwright `test.extend`): auth, seeded org, feature flags. This is the senior default.
- **Page Object Model:** only when the same locators repeat across specs. A POM that wraps every click in a class is Java 2014. Prefer small helper functions + fixtures.
- **`storageState`:** log in once in `globalSetup` (or a setup project), reuse cookies / local session for the suite. Do not UI-login every test. For cookie-httpOnly auth this is the only sane path.

```ts
// playwright.config.ts — evidence on failure, reuse auth
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    storageState: "playwright/.auth/user.json",
  },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    { name: "chromium", dependencies: ["setup"] },
  ],
});
```

```ts
test("checkout completes with a saved card", async ({ page }) => {
  await page.goto("/checkout");
  await page.getByRole("button", { name: "Pay now" }).click();
  await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
});
```

**CI parallelism**

Shard by project or `--shard=1/4`. Workers > 1 require isolated users. Fail-fast off on the full suite so you see the second flake. Upload traces as artifacts; a retry without a trace is wasted money.

**Tradeoffs**

| Choice | Cost |
| --- | --- |
| More E2E | Catches integration the trophy missed; slow, flaky, env-hungry |
| UI login every test | Realistic; destroys runtime |
| `storageState` | Fast; can hide login regressions — keep **one** dedicated login spec |
| `networkidle` | Works on static sites; hangs on analytics/websocket SPAs |

**Production gotchas**

- Third-party scripts (Stripe.js, maps, CMP): route them or use test keys; never hit live payments.
- Clock: `page.clock` for expiry; do not depend on local TZ.
- Multi-tab logout / BroadcastChannel: Playwright **two pages** in one context — that is an E2E, not a unit.
- Visual diffs in E2E without a locked font/OS = flake (see 8.6).

**Follow-ups**

- Why Playwright over Cypress in 2026? (Multiple contexts, traces, `storageState`, no implicit retry magic on clicks, better CI story.)
- How do you E2E SSO? (Seed session via IdP test API or storageState from a one-time interactive login in setup.)

---

### 8.4. Test Coverage

**What they actually ask**

- “What coverage do you require?”
- If you say **80%** as a gate, many interviewers mark you junior.

**How a senior answers**

- **Decision:** Cover **risk**, not lines. Money, auth, permissions, PII, idempotent payments, refunds, feature-flag defaults. An 80% gate on a Vue app is usually gamed with snapshots and trivial branches.
- **Constraint:** v8 coverage cannot see Playwright paths. A green 90% unit report can still mean “nobody tested checkout in a browser.”
- **Failure mode:** Teams add `/* istanbul ignore */`, empty tests, and generated files to protect the number. Coverage theater. Meanwhile `canRefund()` is untested.
- **Measure:** (1) Critical-path E2E green. (2) Domain functions at or near 100% **branch** coverage. (3) Permission matrix tests. Optionally mutation testing (`vitest` + Stryker) on the money module when the blast radius justifies it.

Instrument Vitest for *insight*, not a club:

```ts
// vitest coverage — include risk, do not gate the repo on 80%
coverage: {
  provider: "v8",
  include: [
    "src/domain/**",
    "src/composables/useAuth.ts",
    "src/composables/useCheckout.ts",
  ],
  exclude: ["**/*.spec.ts", "src/generated/**"],
}
```

**Tradeoffs**

- Line coverage is cheap to compute and easy to misunderstand.
- Branch coverage on domain code is worth a CI check.
- Global thresholds punish UI files full of template noise.

**Production gotchas**

- Nuxt/Vite virtual modules and generated routes inflate “uncovered.”
- `v-if` branches in SFCs often do not show up the way people expect.
- Coverage of tests that mock everything is a lie: the mock is covered, production is not.

**Follow-ups**

- Would you fail the build on coverage drop? (On `src/domain` yes; on `pages/` no.)
- How does this differ on Next? (Same rule; don’t let RSC wrappers and generated types dilute the number.)

---

### 8.5. TDD/BDD Methodology

**What they actually ask**

- “Do you practice TDD?”
- They want judgment, not a manifesto.

**How a senior answers**

- **Decision:** **TDD for pure logic and contracts** (pricing, RBAC, parsers, adapters against a frozen OpenAPI fixture). **Not TDD for UI exploration** — you do not red/green a modal’s padding. Spike the UI, then lock behavior with Testing Library.
- **Constraint:** TDD requires a stable contract. If PM is still changing the checkout steps, writing tests first just encodes yesterday’s guess.
- **Failure mode:** TDD theater (tests written after, dated yesterday) or TDD dogma that makes a designer-heavy flow take 3×. BDD tools (Cucumber, 40-layer `Given`) that only the QA toolchain understands, while the spec is a copy of the test names.
- **Measure:** Time from failing production bug → reproducing test → fix. If TDD is working, regressions in the money module die in CI, not in Slack.

**BDD as communication, not a framework**

`Given / When / Then` is how you talk to QA and PM. It can live in the test title. You do not need Cucumber unless the org already runs Gherkin as the acceptance artifact.

```ts
describe("refund eligibility", () => {
  it("Given a captured card payment, When it is within 24h, Then the cashier may refund in full", () => {
    expect(
      canRefund({ status: "captured", method: "card", ageHours: 6 })
    ).toEqual({ allowed: true, maxCents: 6_00 });
  });
});
```

That is a production decision: the rule is the product spec. A `Cart.addItem` demo is not.

**Tradeoffs**

| Practice | Helps | Hurts |
| --- | --- | --- |
| TDD | Parsers, adapters, domain | CSS, exploratory UI, unclear UX |
| BDD titles | Shared language with QA/PM | Cucumber glue that nobody owns |
| Test-after | Fast spikes | Easy to forget the ugly branch |

**Production gotchas**

- Contract tests (8.6) are the grown-up TDD: frontend and backend freeze a fixture together.
- If QA owns Cypress and dev owns Vitest, BDD dies in the gap — pick one language for critical paths.
- “We TDD” plus 0% coverage on permissions is a tell.

**Follow-ups**

- When did TDD slow you down last? (Honest answer: design-system visual work, or a spike on a new Nuxt route.)
- How do you review a TDD PR? (Read the test names as the spec; reject tests that assert internals.)

---

### 8.6. Contract Tests, Visual Regression, and Legacy Vue

**What they actually ask**

- “The API changed and the UI shipped anyway — how do you prevent that?”
- “Do you do visual regression?”
- “This Vue 2/3 app has no tests. Where do you start?”

**How a senior answers**

- **Decision:** Treat the HTTP boundary as a **contract**. Consumer tests (Pact) or **OpenAPI-generated types + MSW handlers generated from the same spec**. Visual regression only on a **design-system and a few marketing/checkout screens**, with locked fonts and disabled animations. For legacy: **characterization tests on the money/auth paths first**, then fill downward. Do not boil the ocean.
- **Constraint:** Contract tests need a backend partner or a committed spec in the repo. Visual tests need a stable runner OS (or a hosted service). Legacy apps have no seams — you wrap before you rewrite.
- **Failure mode:** Hand-written TS types that drift from the API. Percy/Chromatic on every page → 200 flaky diffs from font smoothing. “We’ll add tests after the rewrite” — the rewrite never ends, production stays untested.
- **Measure:** A breaking OpenAPI change fails CI **before** merge. Visual: reviewed diffs, not auto-approve. Legacy: number of critical paths with a Playwright spec, then a shrinking “no-go” module list.

**Contract / API tests**

- Generate TS clients from OpenAPI; fail the build if the spec changes without a review.
- MSW handlers should match that spec (or be generated). Component tests then hit MSW — you are testing the UI against the contract, not against a fantasy mock.
- Pact / similar: useful when multiple consumers (Vue web + React Native) and a separately deployed API. Overkill for a single Nuxt monolith with colocated `/server/api`.
- Schema validation on the client (`zod` parse of responses) is a runtime contract; pair it with tests that feed illegal payloads and expect a safe error UI.

**Visual regression**

- Playwright `toHaveScreenshot` or Chromatic/Percy for Storybook.
- Scope: design-system atoms + checkout header/footer, not every dashboard chart.
- Freeze theme, viewport, timezone, `animations: disabled`. Accept a small `maxDiffPixelRatio`. Review diffs in the PR, same as code.
- Do not confuse visual tests with a11y tests (see accessibility 11.5).

**Introducing tests to a legacy Vue app**

1. **Stop the bleeding:** Playwright on login + the highest-revenue path. Seed via API if the UI setup is impossible.
2. **Characterization:** wrap the tangled checkout composable with tests that lock **current** behavior (including bugs you cannot fix this sprint). Then refactor.
3. **Seams:** extract pure functions from Options API `methods`; add Vitest there. Leave `this.$parent` alone until it has a harness.
4. **MSW at the Axios/fetch interceptor** so you do not need a running backend for component tests.
5. **Do not** start with 80% coverage or rewriting in Composition API “so it’s testable.” Test the app you have.
6. Vue 2 → 3: keep E2E green across the migration; they are the only tests that survive the compiler change.

**Tradeoffs**

- Generated contracts: truthful, but you must own the spec pipeline.
- Recorded HAR mocks: fast, then they rot.
- Full-page visual CI: high confidence on CSS, high flake without a design-system scope.

**Production gotchas**

- OpenAPI `additionalProperties` surprises — generate with `additionalProperties: false` in tests only.
- Visual tests on CI vs local retina = false diffs; run them in one container image.
- Legacy Vue + Jest + Vue Test Utils v1: migrating the runner (to Vitest) is a project; do it after the first Playwright net is in place.

**Follow-ups**

- How do you version the contract? (Back-compat window, feature flags on fields, consumer-driven tests.)
- Storybook vs Playwright for visuals? (Storybook/Chromatic for DS PRs; Playwright for pages that need real routing/auth.)

---

[← Back to Overview](../../README-en.md)
