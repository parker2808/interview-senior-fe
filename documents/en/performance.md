# Performance & Optimization

Seniors do not open with “I use debounce and lazy-load images.” Interviewers want a **measure-first** loop: pick a user-visible metric, find the constraint (network, main thread, memory, cache), name the failure mode, then change one thing and **re-measure**. Vue 3 + TypeScript first; the same CWV / splitting story applies to Next.

Default answers that lose points: putting **access tokens in `localStorage`**, premature `computed`/memo everywhere, and quoting lab Lighthouse scores as if they were field data.

---

## Table of Contents

1. **Core Performance**

   1.1. [Storage: localStorage vs sessionStorage vs Cookie](#911-storage-localstorage-vs-sessionstorage-vs-cookie)

   1.2. [Performance Optimization](#912-performance-optimization)

   1.3. [Code Review Checklist](#913-code-review-checklist)

   1.4. [Performance Case Studies](#914-performance-case-studies)

2. **Advanced Optimization**

   2.1. [Code Splitting Strategies](#921-code-splitting-strategies)

   2.2. [Tree Shaking](#922-tree-shaking)

   2.3. [Debounce vs Throttle](#923-debounce-vs-throttle)

   2.4. [Image & Font Optimization](#924-image--font-optimization)

   2.5. [Core Web Vitals in 2026](#925-core-web-vitals-in-2026)

---

## 9. Performance & Optimization

### 9.1. Core Performance

#### 9.1.1. Storage: localStorage vs sessionStorage vs Cookie

**What they actually ask**

- “Where do you store the JWT?”
- “localStorage vs cookie vs memory?”
- If your first sentence is “token in `localStorage`,” you have already failed the senior bar.

**How a senior answers**

- **Decision:** **Do not put access tokens in `localStorage` as the default.** Prefer **httpOnly + Secure + SameSite cookies** for the session, or **access token in memory + httpOnly refresh cookie**. Use `localStorage` for non-sensitive preferences (theme, locale) you can afford to lose. Use `sessionStorage` for **tab-scoped** wizard state. Use cookies when the server must see the value on the next request **and** the payload is tiny.
- **Constraint:** ~5–10 MB for Web Storage (origin quota, not a guarantee). Cookies ~4 KB each and **ride on every matching request** — they are not a cache. Safari **ITP** and related partitioning make client-set cookies short-lived and third-party storage unreliable.
- **Failure mode:** XSS reads `localStorage.token` and exfiltrates the session. QuotaExceededError on a heavy cache. Cookies blowing up request headers. Assuming `localStorage` is durable in private mode / WebView. Using `sessionStorage` for auth and wondering why a second tab is logged out (or worse, copying tokens into `localStorage` “to sync tabs”).
- **Measure:** Auth threat model (XSS vs CSRF — see security). Storage usage via Application panel. Cookie size on the critical API. Session survival on Safari after 7 days for **client-set** cookies.

| Mechanism | Lifetime | Size | JS access | Cross-tab | Senior use |
| --- | --- | --- | --- | --- | --- |
| Memory | Until refresh/navigation away | RAM | Yes | No (unless you broadcast) | Access token |
| httpOnly cookie | Server-defined | ~4 KB | No | Yes | Refresh / session |
| `localStorage` | Until cleared / eviction | ~5–10 MB | Yes | Yes | Theme, non-secrets, cache with version key |
| `sessionStorage` | Tab | ~5 MB | Yes | No | Wizard draft, per-tab filters |

```ts
// Production decision: access token never hits Web Storage
let accessToken: string | null = null;

export const tokenMemory = {
  get: () => accessToken,
  set: (t: string | null) => {
    accessToken = t;
  },
};
// Refresh cookie is Set-Cookie from the API (httpOnly, Secure, SameSite=Lax).
```

**Safari ITP / partitioning (say this out loud)**

- Client-side JS cookies have been capped on a short clock (ITP); do not design “remember me” on a JS-set cookie.
- Third-party cookies are effectively gone; SSO popups need first-party relationships.
- Storage in iframes is partitioned. A widget on another origin does not see your `localStorage`.
- Private browsing: tiny quotas, aggressive eviction.

**Tradeoffs**

- httpOnly cookie session: XSS cannot steal the cookie; you now own CSRF (SameSite=Lax is often enough for SPAs; see security 10.2).
- Memory access + refresh cookie: best XSS posture for the access token; hard refresh means a refresh round-trip (design for it).
- `localStorage` token: trivial and **wrong** as a default.

**Production gotchas**

- Nuxt/SSR: `localStorage` does not exist on the server — gate with `import.meta.client` / `onMounted`.
- Do not store PII or card data in Web Storage (PCI / GDPR). Encrypted `localStorage` is still XSS-readable in the same origin.
- Version your cache keys (`catalog:v3`) or a deploy will serve stale JSON forever.
- `QuotaExceededError`: catch it; LRU the cache; never let it crash checkout.

**Follow-ups**

- How do tabs share a memory access token? (`BroadcastChannel` or `lock` + refresh; do not sync the access token into `localStorage`.)
- IndexedDB vs `localStorage` for a large offline catalog? (IndexedDB; `localStorage` is synchronous and blocks the main thread.)

---

#### 9.1.2. Performance Optimization

**What they actually ask**

- “How do you optimize a Vue app?”
- They want **Profiler + Core Web Vitals first**, not a laundry list.

**How a senior answers**

- **Decision:** Measure **field CWV** (CrUX / RUM) and a **performance profile on a mid-tier device** before changing code. **INP replaced FID** as the interactivity vital (FID is gone from CWV). Then attack the actual constraint: TTFB, fat JS, long tasks, huge lists, images, hydration.
- **Constraint:** Vue already batches updates and compiles static trees. Premature `shallowRef` / `v-memo` / React `useMemo` is noise until the profiler shows a hot component. You cannot memo your way out of a 400 ms API or a 2 MB hero PNG.
- **Failure mode:** Optimizing DevTools “slow” on a M3 laptop. Virtualizing a 20-row table. Wrapping every child in `computed`. Shipping all of `lodash` to save a 3-line helper. Hydrating a dashboard the user cannot see yet.
- **Measure:** LCP / INP / CLS (9.2.5), long tasks (>50 ms), INP sub-parts (input delay, processing, presentation), main-thread time in the Vue/React profiler, bundle bytes per route (`rollup-plugin-visualizer` / Vite inspect).

**Order of attack**

1. **Is it the network?** TTFB, payload size, waterfalls. SSR/Nuxt caching, HTTP cache, CDN.
2. **Is it the JS?** Route/vendor split, drop dead deps, defer third parties.
3. **Is it the main thread?** Long tasks, sync parse of giant JSON into `reactive()`, expensive watchers on input.
4. **Is it the DOM?** Virtualize (tanstack-vue-virtual / `content-visibility` for simpler cases). Stable `key`s. Do not `v-for` 5k rows.
5. **Is it hydration?** Nuxt `<ClientOnly>` for charts; islands / lazy hydration where the stack supports it.

**Vue-specific knobs (after evidence)**

- `shallowRef` / `shallowReactive` for large, rarely mutated blobs (API documents, map GeoJSON).
- `computed` for derived state (cached); `watch` for side effects. `watchEffect` that writes to the DOM on every keystroke is an INP bug.
- `<KeepAlive>` for tab UIs — memory cost; cap `max`.
- `defineAsyncComponent` / Nuxt automatic route split for heavy widgets.
- `v-once` / `v-memo` on hot lists when the profiler says the list itself is the cost.

**React / Next parallel:** `memo` / `useMemo` / `useCallback` only where the profiler shows. RSC / `dynamic(() => import(), { ssr: false })` is the same decision as Nuxt `ClientOnly` + async components.

**SSR (Nuxt)**

- Do not SSR a WebGL chart. Payload: do not dump 2 MB of JSON into `__NUXT__`.
- `useAsyncData` with a real `getCachedData` / SWR window; Nitro cache for anonymous pages.
- Hydration mismatch is a **correctness and CLS** bug, not a warning to ignore.

**Tradeoffs**

- Virtualization: 60 fps lists; broken find-in-page, a11y, and variable-height pain.
- KeepAlive: instant tab switch; leaked subscriptions if you skip `onDeactivated`.
- Client-only widgets: better TTI; worse SEO/LCP if you client-only the hero.

**Production gotchas**

- Pinia/Vuex dumping the entire catalog into global state → every unrelated subscriber pays.
- Analytics/CMP scripts on `load` stealing INP.
- `JSON.parse` of a 5 MB report on the main thread — worker or stream it.
- Premature memo hiding a stale-closure bug.

**Follow-ups**

- How do you prove a fix? (Before/after field RUM, not one Lighthouse run.)
- What is a long task and why 50 ms? (One frame budget ~16 ms; 50 ms is the LoAF/long-task threshold that delays input.)

---

#### 9.1.3. Code Review Checklist

**What they actually ask**

- “What do you look for in a PR?”
- Seniors review **risk**, not style (the linter already owns style).

**How a senior answers**

- **Decision:** Read the ticket and the diff’s **user flow** first. Then walk a fixed checklist: **security, a11y, bundle, API contract, feature flags**, plus Vue correctness. Run the path, do not only read it.
- **Constraint:** Review time is limited. Spend it on authz UI, money, new dependencies, and public API changes — not import order.
- **Failure mode:** Nitpicking Tailwind class sort while a `v-html` lands, a 200 KB date library joins the vendor chunk, or a flag defaults **on** in production.
- **Measure:** Escaped defects by category (sec, a11y, perf). Review turnaround on critical paths. Bundle delta on the PR (sizebot / vite-plugin-inspect comment).

**Senior checklist**

1. **Context** — Bug, feature, or refactor? Feature flag name and **default**? Rollback plan?
2. **Security** — `v-html` / `innerHTML` / `javascript:` hrefs; tokens in storage; secrets in `VITE_` / logs; CSRF on new cookie calls; permissions checked as UX only (server remains source of truth). See security.md.
3. **Accessibility** — Native control vs fake `div role="button"`; focus on new dialogs; name/role/value; contrast. See accessibility.md.
4. **API contract** — Types match OpenAPI; error/empty/loading; idempotency on pay; no silent drop of fields; pagination.
5. **Bundle / perf** — New dependency weight and `sideEffects`; route vs global import; images have dimensions; list virtualized if large; no accidental barrel import of `lodash`.
6. **Feature flags** — Off by default; no PII in flag keys; cleanup ticket or the flag *is* the product forever.
7. **Vue / TS correctness** — Keys, watch vs computed, no mutating props, SSR guards, error/empty states.
8. **A11y of the review itself** — i18n strings not concatenated; dates/timezone.

Keep the boring bar too: names, no deep nesting, no secrets in screenshots, Conventional Commits if that is the repo rule. That is hygiene, not the senior signal.

**Tradeoffs**

- A 40-item checklist nobody uses vs a 8-item one the team actually runs.
- Blocking on bundle +5 KB for a date formatter vs letting it in “just this once” (it never leaves).

**Production gotchas**

- Generated files and lockfile-only changes still need a glance (supply chain).
- “Tiny PR” that adds one composable importing a cloud SDK.
- Reviewing only the Vue file and missing `nuxt.config` / CSP / headers.

**Follow-ups**

- How do you review a design-system PR? (A11y + visual regression + bundle; see 11.5 / 8.6.)
- Would you approve with a follow-up ticket? (Yes for polish; never for auth/money holes.)

---

#### 9.1.4. Performance Case Studies

_Format: Problem → Cause → Solution → Result. Numbers below are **illustrative**. In an interview, say you would **verify with traces** (RUM + Performance profile + network waterfall), not quote them as facts from a blog._

**Case 1 — Slow UI with a large list**

- **Problem:** Catalog/admin grid with thousands of rows stutters on scroll and filter.
- **Cause:** Full DOM render; each row a rich component; no windowing. Vue spends frames patching nodes offscreen.
- **Solution:** Virtualize (`@tanstack/vue-virtual` or equivalent). Flatten row components. Filter/sort in a worker or as a pure function, not by mounting 5k watchers. For “print / a11y dump,” a separate unvirtualized export path.
- **Result (illustrative):** Scroll INP/long tasks drop; frames closer to 60 fps; initial render from seconds to tens of ms for the window. **Verify** with Performance panel (long tasks on scroll) and INP attribution, not FPS folklore.

**Case 2 — Redundant API calls**

- **Problem:** Tab switches and focus-refetch hammer the same endpoint; search fires per keystroke.
- **Cause:** No client cache; no in-flight dedupe; no abort; debounce missing or bound wrong.
- **Solution:** TanStack Query / `useAsyncData` with `staleTime` and request dedupe. Debounce the **query**, abort in-flight (`AbortController`). Cache per tab with a store only if Query is not in the stack.
- **Result (illustrative):** 60–80% fewer identical GETs, tab switches feel instant while data is fresh. **Verify** with Network waterfall and server QPS, not “it feels smoother.”

**Case 3 — Fat JS bundle**

- **Problem:** First load downloads megabytes of JS; TTI/LCP suffer on 4G.
- **Cause:** Eager charts, full `lodash`, barrel files, one vendor chunk, uncompressed images blamed on “JS.”
- **Solution:** Route split; `defineAsyncComponent` for charts; `lodash-es` or native; kill barrels; visualizer to find the real offender; image/font work in 9.2.4.
- **Result (illustrative):** Main chunk 3 MB → ~900 KB, LCP 4 s → ~1.2 s on a lab mid-tier profile. **Verify** with transfer size per route and field LCP, not only gzipped “bundle” marketing numbers.

**Case 4 — Reactivity over-invalidating**

- **Problem:** Typing in a filter re-renders a dashboard of unrelated widgets.
- **Cause:** Fat global store; passing new object identity each time; `watch` on a giant `reactive` document; (React) unstable context value.
- **Solution:** Colocate state. Split stores. `shallowRef` for read-mostly blobs. Pass primitives. Profile before `v-memo` / `React.memo`.
- **Result (illustrative):** ~70% fewer component updates on keypress; INP processing time down. **Verify** with Vue/React profiler + INP breakdown.

**Case 5 — SSR hydration mismatch**

- **Problem:** “Hydration node mismatch,” flash/jump, CLS spike.
- **Cause:** `Date.now()` / `Math.random()` / locale in render; client-only markup in SSR HTML; auth-gated UI rendered differently on server vs first client paint.
- **Solution:** Stable IDs. `<ClientOnly>` / `ClientOnly` for truly browser-only UI. Same data on server and client (`useAsyncData` payload). Format dates with an explicit timezone after mount if they must be local.
- **Result:** Warnings gone; CLS/LCP stop taking a layout hit from re-render. **Verify** with hydration logs in staging and CLS traces, not “console is clean on my machine.”

---

### 9.2. Advanced Optimization

#### 9.2.1. Code Splitting Strategies

**What they actually ask**

- Route vs component vs vendor split; prefetch; what the user sees while the chunk loads.

**How a senior answers**

- **Decision:** **Route-level split by default** (Vue Router `() => import()`, Nuxt pages, Next `app/` segments). **Component split** heavy, below-the-fold, or rare widgets (charts, editors, admin). **Vendor split** only when a cacheable shared chunk actually helps (a stable `vue`+`pinia` chunk) — not a 40-vendor spaghetti graph. **Prefetch** the next likely route after idle (`router` prefetch / `<Link prefetch>` in Next) when bandwidth is not the constraint.
- **Constraint:** Each extra chunk is a request and a loading state you must design. HTTP/2 helps; 80 tiny chunks on 3G still hurt. SSR must know what to inline vs defer.
- **Failure mode:** Splitting a 2 KB button. Not splitting a 400 KB markdown editor on every page. Prefetching the entire admin on a marketing landing page. Blank screen with no skeleton (feels slower than a bigger bundle).
- **Measure:** JS bytes **per route**, LCP/INP per landing, chunk waterfall, cache hit rate on vendor hashes after deploys.

```ts
const routes = [
  { path: "/", component: () => import("@/pages/Home.vue") },
  { path: "/dashboard", component: () => import("@/pages/Dashboard.vue") },
];
```

```vue
<script setup lang="ts">
import { defineAsyncComponent } from "vue";

const HeavyChart = defineAsyncComponent({
  loader: () => import("@/components/HeavyChart.vue"),
  delay: 150,
  timeout: 15_000,
});
</script>

<template>
  <Suspense>
    <HeavyChart />
    <template #fallback>
      <div class="chart-skeleton" aria-busy="true">Loading chart</div>
    </template>
  </Suspense>
</template>
```

**Loading UX** is part of the split: skeleton with reserved height (CLS), `aria-busy`, timeout + retry, not a spinner that jumps the page.

**Tradeoffs**

| Split | Good for | Cost |
| --- | --- | --- |
| Route | Pages users do not always visit | Waterfall on first navigation |
| Component | Optional widgets | Suspense/skeleton design |
| Vendor | Long-cache shared runtime | Stale hashing, over-splitting |

**Production gotchas**

- Magic comments (`webpackChunkName`) vs Vite’s hashed names — do not copy Webpack folklore blindly.
- Prefetch on `saveData` / slow networks should back off.
- Nuxt/Next both auto-split routes; **manually** importing a page into `main` undoes it.

**Follow-ups**

- How do you split a design system? (Do not put the whole DS in the app entry; import per component, watch barrels — 9.2.2.)
- Module federation vs split? (Org/team boundary, not a perf first move.)

---

#### 9.2.2. Tree Shaking

**What they actually ask**

- Why is `lodash` in the bundle if you imported one function?
- What does `sideEffects` do?

**How a senior answers**

- **Decision:** ESM + `sideEffects: false` (or a precise glob) lets Rollup/Vite drop unused exports. Import **leaf modules**, not barrels. Prefer **native** (`Array.toSorted`, `structuredClone`) then `lodash-es` per-function, never default `lodash`.
- **Constraint:** Tree shaking only sees static ESM. CJS, dynamic `import(variable)`, and files with unmarked side effects stay. Vue SFCs with CSS side effects need accurate `sideEffects`.
- **Failure mode:** A design-system barrel that re-exports every component from one `index`. An `index.ts` that imports every icon. `sideEffects: false` on a package whose CSS is imported as a side effect — production loses styles.
- **Measure:** Visualizer before/after. Fail CI if a forbidden package appears in the main chunk.

```ts
// Decision: named ESM path, not the CJS barrel
import debounce from "lodash-es/debounce";
```

```json
{
  "sideEffects": ["**/*.css", "**/*.vue"]
}
```

A library of pure `ts` utilities can use `"sideEffects": false`. A Vue component library usually cannot.

**lodash vs lodash-es vs native**

- `lodash` (CJS): often **not** shaken; pulls large graphs.
- `lodash-es`: ESM, per-file imports shake — still heavier than native.
- Native: zero bytes, but check the baseline (your actual browsers, not only “ES2023 on my laptop”).

**Tradeoffs**

- Micro-imports (`lodash-es/get`) vs one well-shaken `radash` — measure, do not ideology.
- Forbidding barrels vs DX. Some teams `eslint-plugin-import` ban `antd` / `@mui` root imports; same idea for an internal DS.

**Production gotchas**

- Re-exporting a component from `index.ts` **and** running its `console.log` / CSS import at load time.
- Moment.js / full icon packs. `import { Foo } from '@icons'` pulling 1k SVG components.
- Nuxt auto-import can hide a heavy import in a composable used on the home page.

**Follow-ups**

- How do you tree-shake a Vue plugin that `app.use`s everything? (You don’t — split plugins or tree-shakeable `import { createX }`).
- `pure` annotations / `#__PURE__` — compiler hint, not a substitute for clean ESM.

---

#### 9.2.3. Debounce vs Throttle

**What they actually ask**

- Difference; leading vs trailing; search boxes that race.

**How a senior answers**

- **Decision:** **Debounce** when you care about the **quiet period** (search, resize-end, form validate-after-pause). **Throttle** when you need **regular samples** during a stream (scroll position, drag). For search: debounce the request **and abort in-flight** so a slow older response cannot overwrite a newer query. Prefer VueUse (`useDebounceFn`, `useThrottleFn`, `watchDebounced`) over a hand-rolled closure you will get wrong under unmount.
- **Constraint:** Debounce adds latency (the delay is UX). Throttle can skip the **last** event unless you trailing-call. Both must cancel on unmount.
- **Failure mode:** Debouncing the **input value** so the field lags. Not aborting: “s” finishes after “sql” and the list flashes the wrong results. Leading-edge throttle that never fires on the last scroll position. Fake timers not used in tests (8.1).
- **Measure:** Extra requests per session, INP on keypress (debounce work must leave the keystroke cheap), race incidents in logs.

| Event | Default | Notes |
| --- | --- | --- |
| Typeahead search | Debounce **trailing** 200–400 ms + abort | Leading only if you want an immediate first hit |
| Window resize | Debounce trailing, or `ResizeObserver` | Throttle if you paint during resize |
| Scroll spy | Throttle / rAF | Trailing so the end state is correct |
| Drag / pointermove | Throttle to rAF | |
| Autosave | Debounce trailing | Flush on `visibilitychange` / unmount |

```ts
import { watchDebounced } from "@vueuse/core";

watchDebounced(
  query,
  async (q, _prev, onCleanup) => {
    const ac = new AbortController();
    onCleanup(() => ac.abort());
    results.value = await searchCatalog(q, { signal: ac.signal });
  },
  { debounce: 300 }
);
```

**Leading vs trailing**

- **Trailing:** fire after silence (search).
- **Leading:** fire immediately, then ignore (prevent double-submit).
- **Both:** first click pays, last event also pays (some resize cases). VueUse exposes this; a one-liner `setTimeout` does not.

**Tradeoffs**

- 300 ms debounce vs “feels dead.” Tune with analytics on abandoned searches, not cargo cult.
- Throttle vs `requestAnimationFrame`: rAF is the right throttle for visual follow.

**Production gotchas**

- VueUse vs lodash: lodash debounce has `cancel`/`flush` — you must call `cancel` in `onUnmounted`. VueUse ties to owner scope if you use the composable form.
- Server still needs rate limits; debounce is not a security control.
- IME composition (CJK): do not search mid-composition; watch `isComposing`.

**Follow-ups**

- How do you test it? (Fake timers + MSW; assert abort.)
- Distinct from **request coalescing** (TanStack Query) — you often want both.

---

#### 9.2.4. Image & Font Optimization

**What they actually ask**

- CLS from images/fonts; LCP image; `font-display`; Nuxt Image.

**How a senior answers**

- **Decision:** Give **every image width/height (or aspect-ratio)** so CLS is zero. The **LCP image** is not `loading="lazy"` — it is **priority** (`fetchpriority="high"`, NuxtImg `preload` / `priority`, Next `priority`). Modern formats (AVIF/WebP) with a fallback. Fonts: **subset**, `font-display: optional` or `swap` with a close fallback metric, preload **one** critical family. Prefer **NuxtImg / `ipx`** (or Next `Image`) over hand-rolled `picture` on every page.
- **Constraint:** CDN/image optimizer must exist in prod; local PNG in `/public` bypasses it. Preloading three font files fights LCP.
- **Failure mode:** Lazy-loading the hero. Web fonts that swap late (CLS + FOIT). Unsized banners injected by CMP. 4× retina assets without `sizes`.
- **Measure:** LCP element in traces (is it the hero image?). CLS attribution (was it a font or a late ad?). Bytes on the LCP request.

```vue
<NuxtImg
  src="/hero.jpg"
  width="1200"
  height="630"
  format="webp"
  densities="1 2"
  sizes="100vw"
  preload
  alt="Product hero"
/>
```

Do **not** `loading="lazy"` that hero. Below-the-fold images: lazy + `decoding="async"`.

```css
@font-face {
  font-family: InterVar;
  src: url("/fonts/inter-subset.woff2") format("woff2");
  font-display: optional;
  unicode-range: U+0000-00FF;
}
```

**Tradeoffs**

- `font-display: swap` → fast text, possible CLS. `optional` → no late swap, may stay system font on slow networks (often the senior choice for body text).
- AVIF: smaller, slower encode, some old WebViews struggle — always fallback.

**Production gotchas**

- CLS from **cookies banner / top alert** after hydration — reserve height or accept the CWV hit in the product decision.
- SVG icons inlined vs sprite vs URL — inlining a 200-path illustration in the LCP HTML is a trap.
- `background-image` cannot be LCP-priority’d as easily as `<img>`; prefer real `<img>` for heroes.
- Next/Nuxt image domains allowlist: missing remote patterns break prod images only.

**Follow-ups**

- How do you handle art direction? (`<picture>` / NuxtImg `sizes` + densities.)
- Third-party images (UGC): constrain max dimensions on the optimizer or one 20 MB upload nukes LCP.

---

#### 9.2.5. Core Web Vitals in 2026

**What they actually ask**

- “What are Core Web Vitals now?”
- “FID vs INP?”
- How would you debug a regression?

**How a senior answers**

- **Decision:** The field vitals that matter in 2026 are **LCP, INP, and CLS**. **INP replaced FID** (FID is historical trivia). Debug with **field data first** (CrUX, RUM with `web-vitals` attribution), then **lab** (Lighthouse, Performance panel, throttled CPU) to reproduce. Fix the element/task the attribution points at — not a random `v-once`.
- **Constraint:** Lab is a phone-shaped desktop. Field includes mid-tier Android, 4G, extensions, CMP, and A/B flags. A perfect Lighthouse 100 with bad p75 INP means you optimized the wrong thing.
- **Failure mode:** Reporting FID in 2026. Chasing TBT in lab while INP is a single slow click handler. “We improved LCP” by lazy-loading the hero (you made it worse). Ignoring TTFB because “frontend-only.”
- **Measure:** p75 per vital per **route template**, mobile vs desktop, with and without the CMP. Budget: e.g. LCP < 2.5 s, INP < 200 ms, CLS < 0.1 — as **field p75**, not a local run.

**The three vitals**

| Vital | What it captures | Typical frontend causes | Senior debug |
| --- | --- | --- | --- |
| **LCP** | When the largest hero (image/text) paints | Slow TTFB, unoptimized hero, waiting on JS/CSS, lazy hero, font delay | Performance: LCP marker; Resource Timing; is LCP the `<img>`, `<h1>`, or a late banner? Priority hints, SSR HTML, preload **that** asset |
| **INP** | Worst (almost) interaction latency | Long tasks, huge listeners, sync rendering on input, third-party, hydration | Event Timing / LoAF; INP breakdown (input delay vs processing vs presentation); Vue profiler on the click; split long tasks (`scheduler.yield`) |
| **CLS** | Unexpected layout shift | Unsized media, late fonts, injected ads/banners, hydration swap | Layout Shift Regions; which node? Reserve space; `font-display`; do not insert above existing content |

**How a senior debugs (playbook)**

1. **Confirm it is real:** RUM p75 for the route, last 28 days, mobile. Segment by country/device if needed.
2. **Attribute:** `web-vitals` `{attribution: true}` — LCP element, INP event target and next paint, CLS largest shift node.
3. **Reproduce in lab** with 4× CPU throttle + slow 4G. If you cannot, it is likely a field-only third party — still your problem if it is on the page.
4. **Change one lever**, ship behind a flag, watch the same RUM board. Traces or it did not happen.

**Vue / Nuxt notes**

- Hydration is INP: the first click during hydrate competes with Vue. Reduce island size; delay non-critical plugins.
- Giant `reactive` stores make processing time explode on input — Case 4.
- Route changes: LCP restarts; announce and manage focus (a11y) without adding CLS.

**Tradeoffs**

- Preload everything → fights LCP bandwidth. Preload **the** LCP image + critical CSS.
- Aggressive third-party wrappers (tag manager) vs marketing. Make the cost visible in RUM or you will lose the argument.

**Production gotchas**

- Single-page navigations: still measure; soft-nav CWV support is evolving — know what your RUM vendor actually records.
- bfcache restores can look like “instant LCP” — do not mix them blindly into averages.
- INP is **interaction** latency, not “page is busy on load.” A quiet page with a 400 ms Pay click still fails.

**Follow-ups**

- What replaced FID and why? (FID only measured the first interaction’s delay, not processing; INP observes throughout the session.)
- How do you debug INP in Safari vs Chrome? (Chrome has LoAF + rich Performance; Safari is weaker — lean on field + simpler profiles.)

---

[← Back to Overview](../../README-en.md)
