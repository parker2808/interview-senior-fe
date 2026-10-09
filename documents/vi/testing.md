# Testing

Senior không được hire để viết test `sum(2, 3)`. Ở vòng frontend, họ chấm **strategy**: tầng nào bắt failure nào, thứ bạn từ chối test, cách giữ CI xanh khi flake, và cách nhét test vào app Vue legacy mà không đóng băng delivery.

Hình thường thắng: **testing trophy**, không phải pyramid giáo khoa. Nhiều **integration test quanh hành vi user** (Vue component thật + Pinia thật + MSW). **Vài path Playwright** ra tiền hoặc chặn auth. **Unit test cho domain thuần** (tiền, permission, thuế, parser). Static analysis (TS, ESLint, axe) làm đáy rẻ. Vue 3 + TypeScript trước; cùng philosophy là React Testing Library / Playwright trên Next.

---

## Table of Contents

1. [Unit Testing với Vitest](#81-unit-testing-với-vitest)

2. [Component Testing với Vue Test Utils](#82-component-testing-với-vue-test-utils)

3. [E2E Testing với Playwright](#83-e2e-testing-với-playwright)

4. [Test Coverage](#84-test-coverage)

5. [Phương pháp TDD/BDD](#85-phương-pháp-tddbdd)

6. [Contract test, visual regression và Vue legacy](#86-contract-test-visual-regression-và-vue-legacy)

---

## III. Development Practices

## 8. Testing

### 8.1. Unit Testing với Vitest

**Họ thực sự hỏi gì**

- “Bạn unit-test app Vue thế nào?”
- “Test composable ra sao?”
- “Có mock API / Vue Router / Pinia không?”
- Họ nghe **strategy**, không phải walkthrough config Vitest.

**Cách senior trả lời**

- **Quyết định:** Unit-test **domain thuần** và composable nhỏ mà contract là một function, không phải component tree. Integration-test thứ gì mount Vue, đụng HTTP, hoặc nói chuyện với router. HTTP để sau **MSW**, không `vi.mock` từng module.
- **Ràng buộc:** Composable kéo Vue Router, Pinia, `useFetch`, và toast plugin thì không còn là unit. Coi là integration, hoặc tách core thuần ra.
- **Failure mode:** Mock “cả thế giới” (Vue internals, nguyên axios, child component, timer quên restore). Test vẫn xanh trong khi checkout gãy. Snapshot markup khổng lồ thối rồi bị `-u`.
- **Đo:** Test fail khi **contract user thấy hoặc domain** đổi. Không fail khi bạn rename `ref` nội bộ. Track flake rate và time-to-signal trên CI, không phải line coverage.

**Không test những gì**

- Implementation detail: `ref` nội bộ, helper private, CSS class dùng làm selector.
- Vue internals: plumbing `nextTick`, output compiler, sổ sách reactivity.
- Snapshot cả page markup.
- Wrapper mỏng quanh library bạn không viết.
- Test “nó render” mà không assert hành vi.

**Vitest trên production (Vue 3 + TS)**

- **Composable + async:** sau khi trigger việc, `await flushPromises()` (hoặc `waitFor` của Vue Testing Library) để microtask queue rút hết. Quên cái này là false-red số 1.
- **Fake timer:** debounce, retry backoff, session hết hạn. `vi.useFakeTimers()` + `advanceTimersByTimeAsync`, rồi restore. Trộn timer thật và fake là nhà máy flake.
- **HTTP:** MSW ở network boundary. Một nguồn sự thật cho “API trả gì.” Đừng `vi.mock('@/api')` mọi file trừ khi bạn đang isolate một mapper thuần.
- **Pinia:** `setActivePinia(createPinia())` và lái store thật bằng fixture. Mock store chỉ khi unit đang test **không phải** store.

```ts
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { flushPromises } from "@vue/test-utils";
import { useCatalogSearch } from "@/composables/useCatalogSearch";

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

Giữ logic tiền thành function thuần mà composable gọi. Đó mới là unit thật:

```ts
export function invoiceTotalCents(lines: Line[], taxBps: number): number {
  const sub = lines.reduce((sum, l) => sum + l.qty * l.unitCents, 0);
  return sub + Math.round((sub * taxBps) / 10_000);
}
```

**Tradeoff**

| Approach | Được | Mất |
| --- | --- | --- |
| Unit thuần + MSW integration | Nhanh, deterministic, test contract | Cần seam (domain fn / API module) |
| `vi.mock` mọi thứ | Dễ viết | Test dính internals; tự tin giả |
| Testing trophy | Bắt bug “user không thanh toán được” | Integration chậm hơn `sum()` |

**Gotcha production**

- `globals: true` giấu import thiếu và đánh nhau với ESLint. Prefer `import { describe, it, expect, vi } from "vitest"` tường minh.
- jsdom không phải browser: không layout, `IntersectionObserver` / `ResizeObserver` hạn chế. Đừng unit-test virtualizer hay focus trap ở đó — Playwright.
- Fake timer rò sang file khác nếu `afterEach` không restore.
- MSW phải cùng origin/path mà composable thực sự gọi (kể cả Nuxt `/api` proxy).

**Câu hỏi nối**

- Test composable dùng `onMounted` thế nào? (Tách fetch; hoặc mount một harness component.)
- Khác React: Vitest + Vue Testing Library ≈ Jest/Vitest + React Testing Library. Cùng rule “by role / by text”.
- Sao không lấy Cypress component test làm default năm 2026? (Playwright + Vitest phủ trophy; runner thứ ba là cost.)

---

### 8.2. Component Testing với Vue Test Utils

**Họ thực sự hỏi gì**

- `mount` vs `shallowMount`?
- Đợi UI async thế nào?
- Họ có thể đưa một form và hỏi bạn assert cái gì.

**Cách senior trả lời**

- **Quyết định:** Prefer **philosophy Testing Library** kể cả khi runner là Vue Test Utils: query **theo role, label, và text**, click như user, assert thứ user thấy. Vue Testing Library (`@testing-library/vue`) là default tôi introduce trên Vue 3 greenfield. Trên React/Next, đây là React Testing Library — cùng contract.
- **Ràng buộc:** `shallowMount` stub children. Bạn không còn test integration bạn ship (slot, provide/inject, Teleport, form lồng). Chỉ dùng khi isolate một leaf mà child là chart đắt, map, hoặc widget third-party không kiểm soát được.
- **Failure mode:** `wrapper.find('.btn-primary')` + snapshot cả HTML. Refactor không đổi hành vi đốt một ngày `-u`. `shallowMount` giấu bug `PayButton` chưa bao giờ wire `emit('paid')`.
- **Đo:** Component test fail khi **accessible name hoặc user flow** gãy. Async: `await wrapper.find('button').trigger('click')` chưa đủ nếu handler `await` — `flushPromises()` / `waitFor`.

```ts
import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import PayButton from "@/components/PayButton.vue";

it("disables Pay while the payment intent is in flight", async () => {
  const user = userEvent.setup();
  render(PayButton, {
    props: { amountCents: 1999, currency: "USD" },
  });

  await user.click(screen.getByRole("button", { name: /pay \$19\.99/i }));

  expect(screen.getByRole("button", { name: /processing/i })).toBeDisabled();
});
```

Tương đương VTU của cùng quyết định: `getByRole` qua `wrapper.get('[aria-label=…]')` vẫn hơn `.btn-pay`. Prefer Testing Library.

**mount vs shallow**

- **`mount`:** children thật. Bắt bug provide/inject, slot, Teleport ra `body`. Default cho thứ có hành vi.
- **`shallowMount`:** tốc độ và isolation. Giấu bug integration; stub thường miss attrs/listeners. Nếu cần nó thường xuyên, component đang làm quá nhiều.

**Update async**

Vue flush DOM update bất đồng bộ. Sau khi Pinia ghi, `await` cái click, rồi `flushPromises()` (và `nextTick` nếu bạn assert DOM phụ thuộc watcher). List lớn dần thì assert bằng `waitFor(() => expect(screen.getByRole('listitem')).toBeTruthy())`.

**Pinia / router**

Install plugin thật với fixture store hoặc `createTestingPinia({ initialState, stubActions: false })`. Stub mọi action là test mock, không phải checkout. Vue Router: prefer `createRouter` với memory history hơn mock `$router.push`.

**Tradeoff**

| Tool | Dùng khi |
| --- | --- |
| Vue Testing Library | Component user-facing (form, dialog, table) |
| Vue Test Utils `mount` | Cần emitted event, `vm`, hoặc slot ở mức thấp |
| `shallowMount` | Child là canvas/map bạn không chịu nổi render |
| Playwright component test | Cần layout thật / focus thật (hiếm; thường E2E cái path) |

**Gotcha production**

- Teleport / `<dialog>` render ngoài root component — query `document.body`.
- `v-if` vs `v-show`: `v-if` không có trong DOM; `v-show` thì ẩn. Query accessible state, đừng lẫn `exists()` vs `isVisible()`.
- `defineAsyncComponent` + Suspense: test phải `await` fallback → resolved, không thì bạn assert spinner mãi.
- Stub `console.error` để giấu Vue warning là cách team miss extra fragment / hydration.

**Câu hỏi nối**

- Test listbox kiểu Headless UI / Radix thế nào? (Keyboard + role, không phải `ref` open nội bộ.)
- Song song React: `userEvent` + `getByRole` là ngôn ngữ senior chung giữa Vue và Next.

---

### 8.3. E2E Testing với Playwright

**Họ thực sự hỏi gì**

- “E2E cái gì?”
- “Chặn flake thế nào?”
- “POM hay không?”
- Auth, parallel trên CI, trace.

**Cách senior trả lời**

- **Quyết định:** Playwright chỉ trên **critical path**: login, permission-denied, checkout/pay, refund, SSO. Còn lại đắt quá. Selector: **role và name**, không CSS. Assertion auto-wait; **không bao giờ `waitForTimeout`**.
- **Ràng buộc:** E2E chậm, dính env, và là thứ CI skip đầu tiên khi đỏ. Budget một nắm spec mỗi app, cộng một smoke mỗi deploy.
- **Failure mode:** Sleep tùy hứng, đua animation, test user dùng chung và mutate, click trước hydration, `networkidle` trên app giữ websocket. Worker parallel đụng cùng email.
- **Đo:** p95 duration, flake rate (retry rồi pass), và **trace-on-retry** để job đỏ chẩn đoán được mà không SSH.

**Kiểm soát flake**

- Locator assertion (`toBeVisible`, `toHaveURL`) retry. Timeout nằm trên expect, không `sleep`.
- Tắt animation trong CSS test / `prefers-reduced-motion`.
- Đợi **response cụ thể** (`page.waitForResponse`) khi UI không expose ready state — vẫn hơn timeout.
- Isolate data: email unique, fixture seed qua API, không “xóa hết rồi tạo lại” trên staging DB dùng chung.
- Hydration: Nuxt/Next, click sau khi element interactive đã enabled, không sau `load`.

**POM vs fixture**

- **Fixture** (Playwright `test.extend`): auth, org đã seed, feature flag. Đây là default của senior.
- **Page Object Model:** chỉ khi cùng locator lặp across spec. POM bọc mọi click trong class là Java 2014. Prefer helper function nhỏ + fixture.
- **`storageState`:** login một lần trong `globalSetup` (hoặc setup project), tái sử dụng cookie / local session cho suite. Đừng UI-login mọi test. Auth cookie-httpOnly thì đây là path duy nhất còn tỉnh.

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

**Parallel trên CI**

Shard theo project hoặc `--shard=1/4`. Workers > 1 đòi user isolated. Tắt fail-fast trên full suite để thấy flake thứ hai. Upload trace làm artifact; retry không có trace là đốt tiền.

**Tradeoff**

| Choice | Cost |
| --- | --- |
| Nhiều E2E | Bắt integration mà trophy miss; chậm, flake, đói env |
| UI login mọi test | Realistic; phá runtime |
| `storageState` | Nhanh; có thể giấu regression login — giữ **một** spec login riêng |
| `networkidle` | Ổn trên site tĩnh; treo trên SPA analytics/websocket |

**Gotcha production**

- Script third-party (Stripe.js, map, CMP): route chúng hoặc dùng test key; đừng đụng live payment.
- Clock: `page.clock` cho expiry; đừng phụ thuộc TZ local.
- Logout multi-tab / BroadcastChannel: Playwright **hai page** trong một context — đó là E2E, không phải unit.
- Visual diff trong E2E mà không lock font/OS = flake (xem 8.6).

**Câu hỏi nối**

- Sao Playwright hơn Cypress năm 2026? (Nhiều context, trace, `storageState`, không implicit retry magic trên click, CI story tốt hơn.)
- E2E SSO thế nào? (Seed session qua IdP test API, hoặc storageState từ một lần login interactive trong setup.)

---

### 8.4. Test Coverage

**Họ thực sự hỏi gì**

- “Bạn require coverage bao nhiêu?”
- Nếu bạn nói **80%** làm gate, nhiều interviewer đánh junior.

**Cách senior trả lời**

- **Quyết định:** Cover **risk**, không phải line. Tiền, auth, permission, PII, payment idempotent, refund, default của feature flag. Gate 80% trên app Vue thường bị game bằng snapshot và nhánh tầm thường.
- **Ràng buộc:** v8 coverage không thấy path Playwright. Report unit 90% xanh vẫn có thể nghĩa “chưa ai test checkout trong browser.”
- **Failure mode:** Team thêm `/* istanbul ignore */`, test rỗng, và file generated để bảo vệ con số. Coverage theater. Trong khi `canRefund()` không được test.
- **Đo:** (1) E2E critical-path xanh. (2) Domain function gần 100% **branch** coverage. (3) Test ma trận permission. Optional mutation testing (`vitest` + Stryker) trên money module khi blast radius đủ lớn.

Instrument Vitest để *nhìn*, không phải làm gậy:

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

**Tradeoff**

- Line coverage rẻ để tính và dễ hiểu sai.
- Branch coverage trên domain code đáng một CI check.
- Global threshold phạt file UI đầy template noise.

**Gotcha production**

- Nuxt/Vite virtual module và generated route thổi phồng “uncovered.”
- Nhánh `v-if` trong SFC thường không hiện như người ta tưởng.
- Coverage của test mock mọi thứ là dối: mock được cover, production thì không.

**Câu hỏi nối**

- Bạn fail build khi coverage tụt không? (Trên `src/domain` có; trên `pages/` không.)
- Khác gì trên Next? (Cùng rule; đừng để RSC wrapper và generated type pha loãng con số.)

---

### 8.5. Phương pháp TDD/BDD

**Họ thực sự hỏi gì**

- “Bạn có practice TDD không?”
- Họ muốn judgment, không phải manifesto.

**Cách senior trả lời**

- **Quyết định:** **TDD cho logic thuần và contract** (pricing, RBAC, parser, adapter chống OpenAPI fixture đã đóng băng). **Không TDD cho UI exploration** — bạn không red/green padding của modal. Spike UI, rồi khóa hành vi bằng Testing Library.
- **Ràng buộc:** TDD cần contract ổn. PM còn đổi bước checkout thì viết test trước chỉ encode đoán của hôm qua.
- **Failure mode:** TDD theater (test viết sau, đề ngày hôm qua) hoặc TDD giáo điều khiến flow nặng designer mất 3×. Tool BDD (Cucumber, `Given` 40 tầng) chỉ toolchain QA hiểu, trong khi spec là copy tên test.
- **Đo:** Thời gian từ bug production fail → test reproduce → fix. Nếu TDD đang chạy, regression money module chết trên CI, không trên Slack.

**BDD là giao tiếp, không phải framework**

`Given / When / Then` là cách nói với QA và PM. Nó sống được trong test title. Không cần Cucumber trừ khi org đã chạy Gherkin làm acceptance artifact.

```ts
describe("refund eligibility", () => {
  it("Given a captured card payment, When it is within 24h, Then the cashier may refund in full", () => {
    expect(
      canRefund({ status: "captured", method: "card", ageHours: 6 })
    ).toEqual({ allowed: true, maxCents: 6_00 });
  });
});
```

Đó là quyết định production: rule chính là product spec. Demo `Cart.addItem` thì không.

**Tradeoff**

| Practice | Giúp | Hại |
| --- | --- | --- |
| TDD | Parser, adapter, domain | CSS, UI exploratory, UX chưa rõ |
| BDD title | Ngôn ngữ chung với QA/PM | Cucumber glue không ai own |
| Test-after | Spike nhanh | Dễ quên nhánh xấu |

**Gotcha production**

- Contract test (8.6) mới là TDD trưởng thành: frontend và backend đóng băng một fixture cùng nhau.
- QA own Cypress, dev own Vitest thì BDD chết ở khe — chọn một ngôn ngữ cho critical path.
- “Chúng tôi TDD” cộng 0% coverage trên permission là tín hiệu.

**Câu hỏi nối**

- Lần gần nhất TDD làm bạn chậm? (Trả lời thật: visual work design-system, hoặc spike một Nuxt route mới.)
- Review PR TDD thế nào? (Đọc tên test như spec; reject test assert internals.)

---

### 8.6. Contract test, visual regression và Vue legacy

**Họ thực sự hỏi gì**

- “API đổi mà UI vẫn ship — chặn thế nào?”
- “Bạn có làm visual regression không?”
- “App Vue 2/3 này không có test. Bắt đầu từ đâu?”

**Cách senior trả lời**

- **Quyết định:** Coi HTTP boundary là **contract**. Consumer test (Pact) hoặc **type generate từ OpenAPI + MSW handler generate từ cùng spec**. Visual regression chỉ trên **design system và vài màn marketing/checkout**, font lock, animation tắt. Legacy: **characterization test trên path tiền/auth trước**, rồi lấp xuống. Đừng ôm đồm cả app.
- **Ràng buộc:** Contract test cần partner backend hoặc spec committed trong repo. Visual test cần OS runner ổn (hoặc hosted service). App legacy không có seam — wrap trước khi rewrite.
- **Failure mode:** Type TS viết tay lệch API. Percy/Chromatic mọi page → 200 diff flake vì font smoothing. “Thêm test sau khi rewrite” — rewrite không bao giờ xong, production vẫn không test.
- **Đo:** Breaking OpenAPI change fail CI **trước** merge. Visual: review diff, không auto-approve. Legacy: số critical path có Playwright spec, rồi list module “no-go” co lại.

**Contract / API test**

- Generate TS client từ OpenAPI; fail build nếu spec đổi mà không review.
- MSW handler phải khớp spec đó (hoặc được generate). Component test rồi đụng MSW — bạn test UI chống contract, không chống mock tưởng tượng.
- Pact / tương tự: hữu ích khi nhiều consumer (Vue web + React Native) và API deploy riêng. Overkill cho Nuxt monolith đơn với `/server/api` colocated.
- Schema validation trên client (`zod` parse response) là contract runtime; ghép với test nhồi payload bất hợp pháp và expect UI lỗi an toàn.

**Visual regression**

- Playwright `toHaveScreenshot` hoặc Chromatic/Percy cho Storybook.
- Scope: atom design-system + header/footer checkout, không phải mọi chart dashboard.
- Đóng băng theme, viewport, timezone, `animations: disabled`. Chấp nhận `maxDiffPixelRatio` nhỏ. Review diff trong PR, như code.
- Đừng nhầm visual test với a11y test (xem accessibility 11.5).

**Nhét test vào app Vue legacy**

1. **Cầm máu:** Playwright trên login + path doanh thu cao nhất. Seed qua API nếu setup UI bất khả thi.
2. **Characterization:** bọc checkout composable rối bằng test khóa hành vi **hiện tại** (kể cả bug sprint này chưa fix được). Rồi refactor.
3. **Seam:** tách function thuần từ Options API `methods`; thêm Vitest ở đó. Để `this.$parent` yên đến khi có harness.
4. **MSW ở Axios/fetch interceptor** để component test không cần backend đang chạy.
5. **Đừng** bắt đầu bằng coverage 80% hay rewrite Composition API “cho dễ test.” Test app bạn đang có.
6. Vue 2 → 3: giữ E2E xanh xuyên migration; chúng là test duy nhất sống sót thay đổi compiler.

**Tradeoff**

- Contract generate: trung thực, nhưng bạn phải own pipeline spec.
- HAR mock ghi lại: nhanh, rồi thối.
- Visual CI full-page: tin CSS cao, flake cao nếu không scope design-system.

**Gotcha production**

- OpenAPI `additionalProperties` bất ngờ — generate với `additionalProperties: false` chỉ trong test.
- Visual test CI vs local retina = false diff; chạy trong một container image.
- Vue legacy + Jest + Vue Test Utils v1: migrate runner (sang Vitest) là một project; làm sau khi lưới Playwright đầu tiên đã vào chỗ.

**Câu hỏi nối**

- Version contract thế nào? (Cửa sổ back-compat, feature flag trên field, consumer-driven test.)
- Storybook vs Playwright cho visual? (Storybook/Chromatic cho PR DS; Playwright cho page cần routing/auth thật.)

---

[← Back to Overview](../../README.md)
