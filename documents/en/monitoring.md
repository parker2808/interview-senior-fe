# Monitoring & Error Handling

This is senior frontend interview prep for **what you know about production after it ships**. They are not asking you to paste `Sentry.init`. They want **sampling, PII, releases, signal vs noise, what Vue actually catches, INP not FID, and whether you would page a human**.

Decision → constraint → failure mode → measure. Vue 3 / Nuxt-first; the telemetry ideas are framework-agnostic.

---

## Table of Contents

1. [Error Tracking with Sentry](#191-error-tracking-with-sentry)

2. [Error Boundaries in Vue](#192-error-boundaries-in-vue)

3. [Performance Monitoring](#193-performance-monitoring)

4. [Logging Strategy](#194-logging-strategy)

5. [Alerting](#195-alerting)

6. [Feature-Flag + Error Spike Playbook](#196-feature-flag-error-spike-playbook)

---

## 19. Monitoring & Error Handling

### 19.1. Error Tracking with Sentry

**What they actually ask**

- “How do you use Sentry in production?”
- “Why is this issue 50k events and nobody cares?”
- “We have no readable stacks in prod — why?”

**How a senior answers**

- **Decision:** Sentry (or equivalent) is a **product**: **release-aware**, **sampled**, **PII-scrubbed**, **owned**. You upload **hidden source maps** for that git SHA (12.1), set `release` + `environment` + `dist`, tag **feature flags**, and route issues to **codeowners** — not a `#frontend` firehose.
- **Constraint:** Browsers generate infinite junk (extensions, network blips, ad blockers). Unlimited events cost money **and attention**. Unsampled 100% traces will melt the quota on a campaign (16.5).
- **Failure mode:** DSN in the repo with no `beforeSend`; email in `setUser`; maps on the public CDN; `release: 'prod'` forever so maps never match; grouping 20 bugs as one; capturing handled 401s as fatal; Replay at 100% with PII in the DOM.
- **Measure:** % of prod errors **with a mapped stack**, issue **age to owner**, **actionable** vs ignored, quota burn, correlation of a release with a spike.

**Sampling**

- **Errors:** often 100% of *events* is fine at modest traffic; at scale, sample **repeat** clients, keep **all** of a new issue’s first N. Don’t sample away Sev-1 uniqueness — sample **volume**.
- **Traces / `tracesSampleRate`:** 0.1–0.2 typical; raise on a bad release. Transactions are not “more debugging,” they are a **budget**.
- **Session Replay:** low for healthy sessions (`replaysSessionSampleRate: 0.01`), **1.0 on error** maybe — **mask all text/media** unless you have a legal story. Replay is how you leak addresses.

**PII scrubbing**

Assume the SDK will see it. `beforeSend`: strip `email`, `Authorization`, tokens in URLs, form bodies, `user.name`. Prefer **opaque user id**. Don’t put the access token in a breadcrumb. Nuxt server: don’t `captureException` the whole `event.node.req` headers.

Legal: DPA, where the data lives, Replay = potentially **special category** data if health/finance is on screen.

**Releases and source maps**

- `Sentry.init({ release: SHA })` **equals** the GitOps digest you deployed (14.1).
- Build `sourcemap: 'hidden'`, CI uploads, maps **not** on nginx.
- `dist` / build id when you ship multiple artifacts per SHA (SSR server vs client).
- If stacks say `chunk-7a2.js:1:20483`, the interview answer is **maps + release mismatch**, not “Vue minifies too hard.”

**Noise vs signal**

- Inbox: **regressions on this release**, new issues, spikes — not the 3-year-old `ResizeObserver` loop from an extension.
- `denyUrls` for chrome-extension, `ignoreErrors` for known bot/network strings — **carefully**, review the list.
- Don’t `captureException` on every `console.error` or every rejected `$fetch` 404.
- **Grouping:** fingerprint by **stable message + route + feature**, not by user id. Custom fingerprint when minification groups unrelated bugs.

**Ownership**

- `CODEOWNERS` → Sentry ownership / team routing (`checkout` tag vs `marketing`).
- An issue without an owner is a **process bug**. Alerting (19.5) pages the **service owner**, not Slack-at-everyone.

```ts
Sentry.init({
  app,
  dsn: dsnFromRuntimeConfig, // not a hardcoded secret in a public gist
  release: import.meta.env.VITE_COMMIT_SHA,
  environment: "production",
  tracesSampleRate: 0.15,
  replaysOnErrorSampleRate: 1,
  beforeSend(event) {
    // Decision: drop network 401s; scrub email; keep stack.
    if (event.tags?.http_status === "401") return null;
    return scrubPii(event);
  },
});
```

**Tradeoffs**

- Verbose breadcrumbs vs PII.
- One project vs split marketing/app (quota and ownership vs duplicate DSNs).

**Production gotchas**

- Ad blocker kills the DSN — you need a **first-party proxy** (`/ingest`) if you care about those users.
- SSR double-init, or capturing Node errors with the browser SDK.
- `sampleRate` on errors hiding a rare IE/WebView crash you still support.

**Follow-ups**

- How do you tie a Sentry issue to a PR? (release → git SHA → PR)
- Why did grouping merge two bugs? (fingerprints)

---

### 19.2. Error Boundaries in Vue

**What they actually ask**

“Do you have error boundaries?” If you stop at `onErrorCaptured`, they will ask what it **misses**.

**How a senior answers**

- **Decision:** Vue **does not** have React-style error boundaries that wrap everything. `onErrorCaptured` / `app.config.errorHandler` catch **render/lifecycle/setup sync errors in the child tree**. You still need **`window.onunhandledrejection`**, **`errorHandler`**, and **local try/catch around async** (event handlers, `watch`, `$fetch`). Isolate **widgets** so one chart doesn’t white-screen the shell.
- **Constraint:** Most production FE bugs are **async** (API, click handler, `router.beforeEach`). Those **bypass** `onErrorCaptured`.
- **Failure mode:** One `ErrorBoundary` at `App.vue` that returns `false` and swallows everything with no Sentry; “try again” that remounts into the same poison route; believing `onErrorCaptured` catches `submitOrder()`.
- **Measure:** unhandledrejection count, white-screen RUM (`pageshow` + empty root), widget-level recovery rate.

**What `onErrorCaptured` / errorHandler get**

- Render function throws, `computed` throws, hook in setup throws **synchronously**.
- Custom `errorHandler` in `main.ts` / Nuxt `vue:error` — **always** send to Sentry, then show a fallback.

**What they don’t catch**

| Miss | What you pair |
| --- | --- |
| `async` setup / `await $fetch` without handling | `try/catch`, `useAsyncData` error, TanStack Query `isError` |
| `@click` / native listeners | `try/catch` in the handler or a wrapper |
| `setTimeout` / `requestAnimationFrame` | same |
| Promises without `await` | `unhandledrejection` |
| Errors in **other** Vue apps / MF remotes | each runtime needs its own handler |
| Plugin / native code | window `error` event |

```ts
// Decision: three layers. None of them is optional in prod.
app.config.errorHandler = (err, _instance, info) => {
  Sentry.captureException(err, { extra: { info } });
};

window.addEventListener("unhandledrejection", (e) => {
  Sentry.captureException(e.reason);
});

window.addEventListener("error", (e) => {
  Sentry.captureException(e.error ?? e.message);
});
```

Widget boundary: `onErrorCaptured` → log → `return false` to **stop** the white-screen, show the widget fallback (13.3). **Don’t** return false at the root and hide the bug from Nuxt’s handler unless you already captured it.

Nuxt: `app.config.errorHandler` + `showError` / `error.vue` for **route-level** fatal; keep widget boundaries for dashboards (16.4).

**Tradeoffs**

- Granular boundaries (more UI surviving) vs user continuing in a **corrupt** state (checkout with a dead totals widget — sometimes you **should** block).
- React error boundaries vs Vue: don’t claim they are the same in a mixed-stack interview; explain the async gap in **both** (React boundaries also miss event handlers).

**Production gotchas**

- `return false` + no Sentry = silent failure, worst of all worlds.
- Recursion: fallback component throws.
- Teleported dialogs outside the boundary tree.

**Follow-ups**

- How do you test a boundary? (a child that throws in render; assert fallback **and** a mock capture)
- Suspense errors? (async setup — handle as data errors, not only render errors)

---

### 19.3. Performance Monitoring

**What they actually ask**

“How do you track Core Web Vitals?” If you lead with **FID**, you are dated.

**How a senior answers**

- **Decision:** Track **LCP, INP, CLS** (and TTFB/FCP as diagnostics) with **RUM** as the source of truth, **lab** (Lighthouse/WebPageTest CI) as a **budget/regression** gate. Set numeric budgets on templates (`/` vs `/app`), not a vanity 100 score.
- **Constraint:** Lab is a median laptop with simulated throttle. RUM is real devices, real cache, real third-parties. They **will disagree**. You need both.
- **Failure mode:** Optimizing FID forever; celebrating Lighthouse 98 while INP on mobile is 400ms; no attribution (element, route, country); injecting three analytics tags that **cause** the INP problem; gating PRs on noisy scores.
- **Measure:** **p75 INP / LCP / CLS per route** (CrUX + your RUM), lab budgets on JS bytes and LCP, long-task attribution.

**FID is outdated — use INP**

- **FID** (First Input Delay) only measured the **first** interaction, often a lucky one. **Deprecated.**
- **INP** (Interaction to Next Paint) looks at **responsiveness across the page life** — closer to “UI feels janky.” Fix: reduce main-thread work, break up long tasks, don’t do heavy work on input (filter 50k rows on each keystroke — debounce + worker/virtualize, 16.4).
- **LCP:** largest paint — image, hero text, or SSR HTML. Marketing hybrid (16.5) lives or dies here.
- **CLS:** fonts, images without dimensions, injected banners, ads. Skeletons should **reserve space** (13.3).

**RUM vs lab**

| | Lab (Lighthouse CI) | RUM (web-vitals → your backend / Sentry / Datadog) |
| --- | --- | --- |
| Good for | PR budgets, reproducible | Reality, segments, regressions after ads |
| Lies when | Cache, CPU, extensions, geography | Sampling, ad blockers, SPAs need **route** listeners |

SPA/Nuxt: report vitals **per route**, not only first load. Soft navigations matter for INP/LCP (where supported).

```ts
import { onINP, onLCP, onCLS } from "web-vitals";

function report(m: { name: string; value: number; id: string }) {
  sendToRum({ ...m, route: route.name, release: SHA });
}

onINP(report);
onLCP(report);
onCLS(report);
```

**Budgets**

- CI: **bytes** (gzip entry, total JS on `/`) + maybe LCP screenshot lab — see 12.2.
- Prod: p75 thresholds (good INP < 200ms, LCP < 2.5s, CLS < 0.1) **sliced** by route. Alert on **regression vs last week**, not a single bad session.

**Tradeoffs**

- Third-party tags (GTM, chat) vs INP. Seniors load them **after** interaction or on idle, and can **kill** them with a flag (19.6).
- Field data delay (CrUX is lagged) vs first-party RUM.

**Production gotchas**

- Measuring LCP on a logged-in shell that isn’t the user’s LCP element.
- `web-vitals` without `attribution` when you need the element.
- Hydration at 3s destroying INP on first click.

**Follow-ups**

- How do you debug INP? (Profiler, long tasks, INP attribution, interaction)
- TBT vs INP? (TBT is lab-only-ish; INP is the field metric)

---

### 19.4. Logging Strategy

**What they actually ask**

“What do you log on the client?”

**How a senior answers**

- **Decision:** **No `console.log` in prod.** Client sends **structured events** to a collector (or Sentry breadcrumbs with a budget). **PII minimized**. **Correlation ids** come from the **BFF** (`x-request-id`) and are attached to `$fetch` failures so FE + API + traces stitch together. Debug verbosity is **not** on by default.
- **Constraint:** The browser is hostile (quota, adblock, PII, untrusted). Server (Nitro) logs are the right place for secrets-adjacent context.
- **Failure mode:** logging access tokens; `JSON.stringify(user)` including email; 200 logs per scroll handler; `console.log` left in a Pinia store; correlating nothing so a 500 is three tickets.
- **Measure:** % of 5xx with a matching `request_id` in Sentry extra, log volume $, PII audit findings.

**Levels**

- DEBUG: local / `?debug=` gated, never sampled in prod by default.
- INFO: rare on the client (nav to checkout, payment **attempt id** not card).
- WARN: recovered problems (retry succeeded).
- ERROR: captured exception path — **once**, with context, not in a loop.

**Structured events**

```ts
logger.error("checkout.pay_failed", {
  requestId: lastRequestId, // from BFF header
  code: err.code,           // QUOTE_EXPIRED, not the raw Axios object
  flag: flags.checkoutV2,
  release: SHA,
});
```

Do not log the payload of the order if it contains PII. Do log **ids**.

**Correlation**

- BFF generates `x-request-id` (or W3C `traceparent`). FE stores the last N ids per tab, attaches on error.
- Sentry `trace` integration + OpenTelemetry if the org is there — don’t invent a second id.
- Session id ≠ user id.

**Tradeoffs**

- First-party log pipeline vs “Sentry is enough.” Sentry is for **exceptions + traces**; product analytics is a different sink. Don’t dual-write everything to both.

**Production gotchas**

- Source of `console` in Vue warnings in prod — `app.config.warnHandler`.
- Logging full GraphQL queries with variables (passwords, tokens).
- SSR printing user records to **pod stdout**.

**Follow-ups**

- Where do you look first, Sentry or logs? (Sentry for unknown throw; logs/traces for known business failures)
- How do you avoid leaking PII in Replay + logs together?

---

### 19.5. Alerting

**What they actually ask**

“Would you page someone for this?”

**How a senior answers**

- **Decision:** **Page** (wake a human) only for **user-visible, currently happening, actionable** pain on a **critical path**, with a **runbook**. Everything else is a **ticket / Slack / next-business-day** issue. FE pages on **symptoms** (checkout conversion cliff, error rate on `/pay`, 404 chunk spike after deploy), not on a single `TypeError`.
- **Constraint:** Alert fatigue is how you miss the real Sev-1. Quota and sample rates mean **raw event count** is a bad pager.
- **Failure mode:** `#alerts` with 400 messages/day; paging on `window is not defined` from a crawler; no owner; paging at 3am for CLS 0.12 on the blog.
- **Measure:** pages per week, **% that were real**, time-to-ack, time-to-mitigate, after-hours pages (should be rare for FE).

| Page (on-call) | Ticket / Slack |
| --- | --- |
| Spike in **checkout/pay/login** JS errors vs baseline, same release | New non-critical issue in Sentry |
| **Chunk 404** / white screen RUM on `/` after deploy | Slow INP on a rare admin route |
| Error rate × flag **checkout_v2** (19.6) | Single-user bugs |
| SSR **5xx** / pod crash loop on Nitro | Lighthouse score dip 4 points |
| Auth **refresh storm** / logout loop (18.1) | Noise from a new browser version — investigate next day |

**How you’d wire it**

- Base on **rate + baseline** (z-score / same weekday), not absolute “> 50 events.”
- Attach **release**, **route**, **flag**.
- Page goes to **checkout owner** at 2am, not the intern who last touched CSS.
- Every pageable alert has a **runbook link**: rollback, flag off, purge CDN.

**Tradeoffs**

- Sensitivity vs sleep. Start **too quiet**, then tighten — not the reverse.
- Synthetic canary (login + pay in prod every 5 min) is often better than error-count paging.

**Production gotchas**

- Deploy causes a **brief** error blip (old HTML + new clients) — wait 2–3 minutes or page on **sustained** spike.
- Sampling change looks like a drop in errors (false health).

**Follow-ups**

- SLOs for FE? (availability of critical journeys, INP budget as a **soft** SLO)
- Who is on-call for a static SPA? (still someone — CDN/GitOps)

---

### 19.6. Feature-Flag + Error Spike Playbook

**What they actually ask**

“You rolled a flag to 10% and Sentry exploded. Walk me through it.”

**How a senior answers**

- **Decision:** **Kill the flag first** if the spike is on a critical path and tracks the flag. Confirm with **sliced** telemetry (error rate **by flag variant**, release, route). Don’t debug for 20 minutes at 30% rollout. After mitigate: keep the flag off, **don’t delete evidence**, then RCA (maps, replay **if** PII-safe, HAR).
- **Constraint:** Correlation isn’t causation — deploys, flags, and traffic often move together. You need **dimensions**. Fail-safe: if the flag service is itself down, the app must **default closed** for payments (14.4).
- **Failure mode:** Raising the flag to 50% “to get more signal”; turning **all** flags off; fixing forward on `main` without disabling; blaming a random Sentry issue that existed last month; hydrating two variants (SSR/client mismatch) that **is** the bug.
- **Measure:** time-to-disable, % of flagged users in the error set vs control, repeat incidents per flag, leftover flags at 100%.

**Playbook**

1. **Graph:** errors / INP / conversion **split by flag key**. If treatment >> control, you’ve got it.
2. **Mitigate:** set flag to 0% (or to the previous implementation). Announce (17.7).
3. **Stabilize:** confirm control is healthy; watch for **cached HTML** still showing the new UI (16.2).
4. **Preserve:** Sentry issue links, release SHA, flag evaluation payload, a Replay **without** PII if possible.
5. **RCA:** true root cause (null in a composable, 3MB extra on `/`, 401 loop). Add a **test** and a **gate** (budget, unit on the composable).
6. **Re-roll:** 1% staff → 5% → 25%, same dashboards. Don’t jump to 100% because “we fixed it.”
7. **Cleanup:** ticket to remove the flag when it graduates (14.4).

**SSR / Nuxt extra**

Bucket **once**, send the variant in the payload, use it on client. A spike that is “Hydration node mismatch” after a flag is often **this**, not the feature logic.

**Tradeoffs**

- Fast kill vs gathering 10 more minutes of Replays — kill first on pay/login.
- Experiment vs kill switch: experiments **must** have a kill path that isn’t “wait for a scientist.”

**Production gotchas**

- Flag evaluated in GTM, not your BFF — you can’t slice Sentry.
- Sticky bucketing by `anonymousId` that resets, so “10%” is a blender.
- Turning the flag off doesn’t unload a **already-downloaded** poisonous chunk until refresh — tell users / force reload on fatal.

**Follow-ups**

- How do you test both variants in CI? (14.4)
- What if the spike is CLS not errors? (still a flag kill if it’s the campaign hero)

---

[← Back to Overview](../../README-en.md)
