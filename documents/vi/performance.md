# Performance & Optimization

Senior không mở đầu bằng “tôi dùng debounce và lazy-load ảnh.” Interviewer muốn vòng **measure-first**: chọn metric user thấy, tìm constraint (network, main thread, memory, cache), gọi tên failure mode, rồi đổi một thứ và **đo lại**. Vue 3 + TypeScript trước; cùng câu chuyện CWV / splitting áp cho Next.

Câu default mất điểm: **access token trong `localStorage`**, `computed`/memo sớm khắp nơi, và trích score Lighthouse lab như thể đó là field data.

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

   2.5. [Core Web Vitals năm 2026](#925-core-web-vitals-năm-2026)

---

## 9. Performance & Optimization

### 9.1. Core Performance

#### 9.1.1. Storage: localStorage vs sessionStorage vs Cookie

**Họ thực sự hỏi gì**

- “JWT để đâu?”
- “localStorage vs cookie vs memory?”
- Câu đầu là “token trong `localStorage`” thì bạn đã trượt thanh senior.

**Cách senior trả lời**

- **Quyết định:** **Đừng để access token trong `localStorage` làm default.** Prefer **cookie httpOnly + Secure + SameSite** cho session, hoặc **access token trong memory + refresh cookie httpOnly**. `localStorage` cho preference không nhạy (theme, locale) mà mất được. `sessionStorage` cho state wizard **theo tab**. Cookie khi server phải thấy value ở request tiếp **và** payload nhỏ.
- **Ràng buộc:** ~5–10 MB cho Web Storage (quota origin, không phải bảo đảm). Cookie ~4 KB mỗi cái và **đi theo mọi matching request** — chúng không phải cache. Safari **ITP** và partitioning liên quan khiến cookie set từ client sống ngắn, third-party storage không đáng tin.
- **Failure mode:** XSS đọc `localStorage.token` rồi exfiltrate session. QuotaExceededError trên cache nặng. Cookie thổi header request. Cho rằng `localStorage` bền trong private mode / WebView. Dùng `sessionStorage` cho auth rồi thắc mắc tab hai logout (hoặc tệ hơn, copy token vào `localStorage` “để sync tab”).
- **Đo:** Threat model auth (XSS vs CSRF — xem security). Dung lượng storage qua Application panel. Size cookie trên API critical. Session sống trên Safari sau 7 ngày với cookie **set từ client**.

| Mechanism | Lifetime | Size | JS access | Cross-tab | Senior dùng |
| --- | --- | --- | --- | --- | --- |
| Memory | Đến refresh/navigate đi | RAM | Có | Không (trừ khi broadcast) | Access token |
| httpOnly cookie | Server định | ~4 KB | Không | Có | Refresh / session |
| `localStorage` | Đến khi xóa / eviction | ~5–10 MB | Có | Có | Theme, non-secret, cache có version key |
| `sessionStorage` | Tab | ~5 MB | Có | Không | Draft wizard, filter theo tab |

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

**Safari ITP / partitioning (nói to điều này)**

- Cookie JS phía client bị khóa đồng hồ ngắn (ITP); đừng thiết kế “remember me” trên cookie JS set.
- Third-party cookie coi như chết; SSO popup cần quan hệ first-party.
- Storage trong iframe bị partition. Widget origin khác không thấy `localStorage` của bạn.
- Private browsing: quota bé, eviction hung hãn.

**Tradeoff**

- Session cookie httpOnly: XSS không cắp được cookie; bạn giờ own CSRF (SameSite=Lax thường đủ cho SPA; xem security 10.2).
- Access memory + refresh cookie: posture XSS tốt nhất cho access token; hard refresh nghĩa là một round-trip refresh (thiết kế cho nó).
- Token `localStorage`: tầm thường và **sai** làm default.

**Gotcha production**

- Nuxt/SSR: `localStorage` không tồn tại trên server — gate bằng `import.meta.client` / `onMounted`.
- Đừng lưu PII hay card data trong Web Storage (PCI / GDPR). `localStorage` “encrypted” vẫn XSS-readable cùng origin.
- Version cache key (`catalog:v3`) không thì deploy phục vụ JSON stale mãi.
- `QuotaExceededError`: catch; LRU cache; đừng để nó crash checkout.

**Câu hỏi nối**

- Tab share memory access token thế nào? (`BroadcastChannel` hoặc `lock` + refresh; đừng sync access token vào `localStorage`.)
- IndexedDB vs `localStorage` cho catalog offline lớn? (IndexedDB; `localStorage` synchronous và block main thread.)

---

#### 9.1.2. Performance Optimization

**Họ thực sự hỏi gì**

- “Tối ưu app Vue thế nào?”
- Họ muốn **Profiler + Core Web Vitals trước**, không phải laundry list.

**Cách senior trả lời**

- **Quyết định:** Đo **field CWV** (CrUX / RUM) và **performance profile trên máy mid-tier** trước khi đổi code. **INP thay FID** làm vital tương tác (FID đã biến khỏi CWV). Rồi đánh constraint thật: TTFB, JS béo, long task, list khổng lồ, ảnh, hydration.
- **Ràng buộc:** Vue đã batch update và compile static tree. `shallowRef` / `v-memo` / React `useMemo` sớm là nhiễu đến khi profiler chỉ ra component nóng. Bạn không memo được ra khỏi API 400 ms hay hero PNG 2 MB.
- **Failure mode:** Tối ưu DevTools “chậm” trên laptop M3. Virtualize table 20 hàng. Bọc mọi child trong `computed`. Ship cả `lodash` để tiết helper 3 dòng. Hydrate dashboard user chưa thấy.
- **Đo:** LCP / INP / CLS (9.2.5), long task (>50 ms), phần con INP (input delay, processing, presentation), thời gian main-thread trong Vue/React profiler, byte bundle mỗi route (`rollup-plugin-visualizer` / Vite inspect).

**Thứ tự đánh**

1. **Network?** TTFB, size payload, waterfall. Cache SSR/Nuxt, HTTP cache, CDN.
2. **JS?** Split route/vendor, bỏ dep chết, defer third-party.
3. **Main thread?** Long task, parse sync JSON khổng lồ vào `reactive()`, watcher đắt trên input.
4. **DOM?** Virtualize (tanstack-vue-virtual / `content-visibility` cho case đơn). `key` ổn định. Đừng `v-for` 5k hàng.
5. **Hydration?** Nuxt `<ClientOnly>` cho chart; island / lazy hydration khi stack hỗ trợ.

**Núm Vue-specific (sau khi có evidence)**

- `shallowRef` / `shallowReactive` cho blob lớn, ít mutate (API document, map GeoJSON).
- `computed` cho derived state (có cache); `watch` cho side effect. `watchEffect` ghi DOM mỗi keystroke là bug INP.
- `<KeepAlive>` cho UI tab — cost memory; cap `max`.
- `defineAsyncComponent` / Nuxt automatic route split cho widget nặng.
- `v-once` / `v-memo` trên list nóng khi profiler nói chính list là cost.

**Song song React / Next:** `memo` / `useMemo` / `useCallback` chỉ nơi profiler chỉ. RSC / `dynamic(() => import(), { ssr: false })` cùng quyết định với Nuxt `ClientOnly` + async component.

**SSR (Nuxt)**

- Đừng SSR chart WebGL. Payload: đừng đổ 2 MB JSON vào `__NUXT__`.
- `useAsyncData` với `getCachedData` / cửa sổ SWR thật; Nitro cache cho page anonymous.
- Hydration mismatch là bug **correctness và CLS**, không phải warning để ignore.

**Tradeoff**

- Virtualization: list 60 fps; find-in-page gãy, a11y, và đau height biến thiên.
- KeepAlive: đổi tab tức thì; subscription rò nếu skip `onDeactivated`.
- Widget client-only: TTI tốt hơn; SEO/LCP tệ nếu bạn client-only cái hero.

**Gotcha production**

- Pinia/Vuex đổ cả catalog vào global state → mọi subscriber không liên quan phải trả.
- Script analytics/CMP trên `load` cướp INP.
- `JSON.parse` report 5 MB trên main thread — worker hoặc stream.
- Memo sớm giấu bug stale-closure.

**Câu hỏi nối**

- Chứng minh fix thế nào? (RUM field trước/sau, không một lần chạy Lighthouse.)
- Long task là gì và sao 50 ms? (Budget một frame ~16 ms; 50 ms là ngưỡng LoAF/long-task làm trễ input.)

---

#### 9.1.3. Code Review Checklist

**Họ thực sự hỏi gì**

- “Bạn nhìn gì trong PR?”
- Senior review **risk**, không phải style (linter đã own style).

**Cách senior trả lời**

- **Quyết định:** Đọc ticket và **user flow** của diff trước. Rồi đi checklist cố định: **security, a11y, bundle, API contract, feature flag**, cộng correctness Vue. Chạy path, đừng chỉ đọc.
- **Ràng buộc:** Thời gian review có hạn. Chi cho authz UI, tiền, dependency mới, và thay đổi public API — không import order.
- **Failure mode:** Nitpick sort class Tailwind trong khi `v-html` đáp xuống, date library 200 KB vào vendor chunk, hoặc flag default **on** trên production.
- **Đo:** Defect thoát theo category (sec, a11y, perf). Turnaround review trên critical path. Bundle delta trên PR (sizebot / comment vite-plugin-inspect).

**Checklist senior**

1. **Context** — Bug, feature, hay refactor? Tên feature flag và **default**? Rollback plan?
2. **Security** — `v-html` / `innerHTML` / href `javascript:`; token trong storage; secret trong `VITE_` / log; CSRF trên cookie call mới; permission chỉ check như UX (server vẫn source of truth). Xem security.md.
3. **Accessibility** — Native control vs `div role="button"` giả; focus dialog mới; name/role/value; contrast. Xem accessibility.md.
4. **API contract** — Type khớp OpenAPI; error/empty/loading; idempotency lúc pay; không drop field im lặng; pagination.
5. **Bundle / perf** — Weight dependency mới và `sideEffects`; import route vs global; ảnh có dimension; list virtualize nếu lớn; không barrel import `lodash` tình cờ.
6. **Feature flag** — Off by default; không PII trong flag key; ticket cleanup không thì flag *là* product mãi.
7. **Correctness Vue / TS** — Key, watch vs computed, không mutate prop, SSR guard, error/empty state.
8. **A11y của chính review** — chuỗi i18n không concat; date/timezone.

Giữ thanh nhàm nữa: tên, không nest sâu, không secret trong screenshot, Conventional Commits nếu đó là rule repo. Đó là hygiene, không phải tín hiệu senior.

**Tradeoff**

- Checklist 40 mục không ai dùng vs 8 mục team thực sự chạy.
- Block bundle +5 KB cho date formatter vs cho vào “chỉ lần này” (nó không bao giờ ra).

**Gotcha production**

- File generated và thay đổi lockfile-only vẫn cần liếc (supply chain).
- “PR tí” thêm một composable import cloud SDK.
- Review chỉ file Vue, miss `nuxt.config` / CSP / header.

**Câu hỏi nối**

- Review PR design-system thế nào? (A11y + visual regression + bundle; xem 11.5 / 8.6.)
- Approve kèm ticket follow-up? (Có cho polish; không bao giờ cho lỗ auth/tiền.)

---

#### 9.1.4. Performance Case Studies

_Format: Problem → Cause → Solution → Result. Số bên dưới là **minh họa**. Trong interview, nói bạn sẽ **verify bằng trace** (RUM + Performance profile + network waterfall), không trích chúng như fact từ blog._

**Case 1 — UI chậm với list lớn**

- **Problem:** Grid catalog/admin hàng nghìn row giật khi scroll và filter.
- **Cause:** Render full DOM; mỗi row là component giàu; không windowing. Vue tốn frame patch node offscreen.
- **Solution:** Virtualize (`@tanstack/vue-virtual` hoặc tương đương). Flatten row component. Filter/sort trong worker hoặc function thuần, không mount 5k watcher. Path export “print / a11y dump” riêng, không virtualize.
- **Result (minh họa):** INP/long task lúc scroll giảm; frame gần 60 fps; initial render từ vài giây xuống chục ms cho window. **Verify** bằng Performance panel (long task lúc scroll) và attribution INP, không folklore FPS.

**Case 2 — API call thừa**

- **Problem:** Đổi tab và focus-refetch đập cùng endpoint; search bắn mỗi keystroke.
- **Cause:** Không client cache; không in-flight dedupe; không abort; debounce thiếu hoặc bind sai.
- **Solution:** TanStack Query / `useAsyncData` với `staleTime` và request dedupe. Debounce **query**, abort in-flight (`AbortController`). Cache theo tab bằng store chỉ khi stack không có Query.
- **Result (minh họa):** 60–80% GET giống nhau ít hơn, đổi tab thấy tức thì khi data còn tươi. **Verify** bằng Network waterfall và QPS server, không “cảm giác mượt hơn.”

**Case 3 — JS bundle béo**

- **Problem:** First load tải megabyte JS; TTI/LCP khổ trên 4G.
- **Cause:** Chart eager, full `lodash`, barrel file, một vendor chunk, ảnh không nén bị đổ lỗi cho “JS.”
- **Solution:** Route split; `defineAsyncComponent` cho chart; `lodash-es` hoặc native; giết barrel; visualizer để tìm thủ phạm thật; việc ảnh/font ở 9.2.4.
- **Result (minh họa):** Main chunk 3 MB → ~900 KB, LCP 4 s → ~1.2 s trên lab profile mid-tier. **Verify** bằng transfer size mỗi route và field LCP, không chỉ số “bundle” gzip marketing.

**Case 4 — Reactivity invalidate quá đà**

- **Problem:** Gõ filter re-render dashboard widget không liên quan.
- **Cause:** Global store béo; pass object identity mới mỗi lần; `watch` trên `reactive` document khổng lồ; (React) context value không ổn định.
- **Solution:** Colocate state. Tách store. `shallowRef` cho blob read-mostly. Pass primitive. Profile trước `v-memo` / `React.memo`.
- **Result (minh họa):** ~70% ít component update lúc gõ; thời gian processing INP giảm. **Verify** bằng Vue/React profiler + breakdown INP.

**Case 5 — SSR hydration mismatch**

- **Problem:** “Hydration node mismatch,” flash/jump, CLS spike.
- **Cause:** `Date.now()` / `Math.random()` / locale trong render; markup client-only trong SSR HTML; UI gated auth render khác server vs first client paint.
- **Solution:** ID ổn định. `<ClientOnly>` / `ClientOnly` cho UI thật sự browser-only. Cùng data server và client (payload `useAsyncData`). Format date với timezone tường minh sau mount nếu phải local.
- **Result:** Warning biến; CLS/LCP thôi ăn layout hit vì re-render. **Verify** bằng hydration log trên staging và CLS trace, không “console sạch trên máy tôi.”

---

### 9.2. Advanced Optimization

#### 9.2.1. Code Splitting Strategies

**Họ thực sự hỏi gì**

- Split route vs component vs vendor; prefetch; user thấy gì trong lúc chunk load.

**Cách senior trả lời**

- **Quyết định:** **Split theo route làm default** (Vue Router `() => import()`, Nuxt pages, Next `app/` segment). **Split component** widget nặng, below-the-fold, hoặc hiếm (chart, editor, admin). **Split vendor** chỉ khi shared chunk cacheable thực sự giúp (chunk `vue`+`pinia` ổn định) — không đồ spaghetti 40 vendor. **Prefetch** route kế tiếp có khả năng sau idle (`router` prefetch / `<Link prefetch>` trên Next) khi bandwidth không phải constraint.
- **Ràng buộc:** Mỗi chunk thêm là một request và loading state bạn phải thiết kế. HTTP/2 giúp; 80 chunk tí hon trên 3G vẫn đau. SSR phải biết cái gì inline vs defer.
- **Failure mode:** Split button 2 KB. Không split markdown editor 400 KB trên mọi page. Prefetch cả admin trên landing marketing. Màn trắng không skeleton (cảm giác chậm hơn bundle lớn hơn).
- **Đo:** Byte JS **mỗi route**, LCP/INP mỗi landing, waterfall chunk, cache hit rate trên vendor hash sau deploy.

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

**Loading UX** là một phần của split: skeleton với height dành sẵn (CLS), `aria-busy`, timeout + retry, không spinner làm nhảy page.

**Tradeoff**

| Split | Tốt cho | Cost |
| --- | --- | --- |
| Route | Page user không phải lúc nào cũng vào | Waterfall lần navigate đầu |
| Component | Widget tùy chọn | Thiết kế Suspense/skeleton |
| Vendor | Runtime share cache lâu | Hash stale, over-split |

**Gotcha production**

- Magic comment (`webpackChunkName`) vs tên hash của Vite — đừng copy folklore Webpack mù.
- Prefetch trên `saveData` / mạng chậm nên back off.
- Nuxt/Next đều auto-split route; **import tay** một page vào `main` là hoàn tác.

**Câu hỏi nối**

- Split design system thế nào? (Đừng nhét cả DS vào app entry; import từng component, coi barrel — 9.2.2.)
- Module federation vs split? (Ranh giới org/team, không phải nước cờ perf đầu.)

---

#### 9.2.2. Tree Shaking

**Họ thực sự hỏi gì**

- Sao `lodash` vẫn trong bundle nếu bạn import một function?
- `sideEffects` làm gì?

**Cách senior trả lời**

- **Quyết định:** ESM + `sideEffects: false` (hoặc glob chính xác) để Rollup/Vite drop export không dùng. Import **leaf module**, không barrel. Prefer **native** (`Array.toSorted`, `structuredClone`) rồi `lodash-es` từng function, không default `lodash`.
- **Ràng buộc:** Tree shaking chỉ thấy ESM tĩnh. CJS, `import(variable)` động, và file side effect không đánh dấu thì ở lại. SFC Vue có CSS side effect cần `sideEffects` đúng.
- **Failure mode:** `export * from './components'` trong design system. Barrel `index.ts` import mọi icon. `sideEffects: false` trên package mà CSS được import như side effect — production mất style.
- **Đo:** Visualizer trước/sau. Fail CI nếu package cấm xuất hiện trong main chunk.

```ts
// Decision: named ESM path, not the CJS barrel
import debounce from "lodash-es/debounce";
```

```json
{
  "sideEffects": ["**/*.css", "**/*.vue"]
}
```

Library utility `ts` thuần có thể `"sideEffects": false`. Vue component library thì thường không.

**lodash vs lodash-es vs native**

- `lodash` (CJS): thường **không** shake; kéo graph lớn.
- `lodash-es`: ESM, import theo file thì shake — vẫn nặng hơn native.
- Native: zero byte, nhưng check baseline (browser thật, không chỉ “ES2023 trên laptop tôi”).

**Tradeoff**

- Micro-import (`lodash-es/get`) vs một `radash` shake tốt — đo, đừng ý thức hệ.
- Cấm barrel vs DX. Một số team `eslint-plugin-import` cấm root import `antd` / `@mui`; cùng ý cho DS nội bộ.

**Gotcha production**

- Re-export component từ `index.ts` **và** chạy `console.log` / CSS import lúc load.
- Moment.js / full icon pack. `import { Foo } from '@icons'` kéo 1k SVG component.
- Nuxt auto-import có thể giấu import nặng trong composable dùng trên home.

**Câu hỏi nối**

- Tree-shake Vue plugin `app.use` mọi thứ thế nào? (Không được — tách plugin hoặc `import { createX }` tree-shakeable.)
- Annotation `pure` / `#__PURE__` — gợi ý compiler, không thay ESM sạch.

---

#### 9.2.3. Debounce vs Throttle

**Họ thực sự hỏi gì**

- Khác nhau; leading vs trailing; search box đua nhau.

**Cách senior trả lời**

- **Quyết định:** **Debounce** khi bạn quan tâm **khoảng im** (search, hết resize, validate form sau pause). **Throttle** khi cần **sample đều** trong một stream (vị trí scroll, drag). Search: debounce request **và abort in-flight** để response cũ chậm không ghi đè query mới. Prefer VueUse (`useDebounceFn`, `useThrottleFn`, `watchDebounced`) hơn closure tự viết sẽ sai lúc unmount.
- **Ràng buộc:** Debounce thêm latency (delay chính là UX). Throttle có thể skip event **cuối** trừ khi trailing-call. Cả hai phải cancel lúc unmount.
- **Failure mode:** Debounce **giá trị input** khiến field lag. Không abort: “s” xong sau “sql” và list flash kết quả sai. Leading-edge throttle không bao giờ fire vị trí scroll cuối. Test không dùng fake timer (8.1).
- **Đo:** Request thừa mỗi session, INP lúc gõ (việc debounce phải để keystroke rẻ), incident race trong log.

| Event | Default | Notes |
| --- | --- | --- |
| Typeahead search | Debounce **trailing** 200–400 ms + abort | Leading chỉ khi muốn hit đầu ngay |
| Window resize | Debounce trailing, hoặc `ResizeObserver` | Throttle nếu paint trong lúc resize |
| Scroll spy | Throttle / rAF | Trailing để end state đúng |
| Drag / pointermove | Throttle theo rAF | |
| Autosave | Debounce trailing | Flush lúc `visibilitychange` / unmount |

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

- **Trailing:** fire sau im lặng (search).
- **Leading:** fire ngay, rồi ignore (chặn double-submit).
- **Both:** click đầu trả, event cuối cũng trả (một số case resize). VueUse expose cái này; `setTimeout` một dòng thì không.

**Tradeoff**

- Debounce 300 ms vs “cảm giác chết.” Tune bằng analytics search bỏ dở, không cargo cult.
- Throttle vs `requestAnimationFrame`: rAF là throttle đúng cho follow visual.

**Gotcha production**

- VueUse vs lodash: lodash debounce có `cancel`/`flush` — phải gọi `cancel` trong `onUnmounted`. VueUse gắn owner scope nếu dùng dạng composable.
- Server vẫn cần rate limit; debounce không phải security control.
- IME composition (CJK): đừng search giữa composition; watch `isComposing`.

**Câu hỏi nối**

- Test thế nào? (Fake timer + MSW; assert abort.)
- Khác **request coalescing** (TanStack Query) — thường muốn cả hai.

---

#### 9.2.4. Image & Font Optimization

**Họ thực sự hỏi gì**

- CLS từ ảnh/font; ảnh LCP; `font-display`; Nuxt Image.

**Cách senior trả lời**

- **Quyết định:** Cho **mọi ảnh width/height (hoặc aspect-ratio)** để CLS bằng không. **Ảnh LCP** không `loading="lazy"` — nó là **priority** (`fetchpriority="high"`, NuxtImg `preload` / `priority`, Next `priority`). Format hiện đại (AVIF/WebP) có fallback. Font: **subset**, `font-display: optional` hoặc `swap` với fallback metric gần, preload **một** family critical. Prefer **NuxtImg / `ipx`** (hoặc Next `Image`) hơn `picture` viết tay mọi page.
- **Ràng buộc:** CDN/image optimizer phải tồn tại trên prod; PNG local trong `/public` bypass nó. Preload ba file font đánh LCP.
- **Failure mode:** Lazy-load hero. Web font swap muộn (CLS + FOIT). Banner không size do CMP inject. Asset retina 4× không có `sizes`.
- **Đo:** Element LCP trong trace (có phải hero image?). Attribution CLS (font hay ad muộn?). Byte trên request LCP.

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

**Đừng** `loading="lazy"` hero đó. Ảnh below-the-fold: lazy + `decoding="async"`.

```css
@font-face {
  font-family: InterVar;
  src: url("/fonts/inter-subset.woff2") format("woff2");
  font-display: optional;
  unicode-range: U+0000-00FF;
}
```

**Tradeoff**

- `font-display: swap` → text nhanh, có thể CLS. `optional` → không swap muộn, có thể kẹt system font trên mạng chậm (thường là lựa chọn senior cho body text).
- AVIF: nhỏ hơn, encode chậm, một số WebView cũ khổ — luôn fallback.

**Gotcha production**

- CLS từ **cookies banner / top alert** sau hydration — dành height hoặc chấp nhận hit CWV trong quyết định product.
- SVG icon inline vs sprite vs URL — inline illustration 200-path trong HTML LCP là bẫy.
- `background-image` không dễ LCP-priority như `<img>`; prefer `<img>` thật cho hero.
- Allowlist domain ảnh Next/Nuxt: thiếu remote pattern gãy ảnh **chỉ** trên prod.

**Câu hỏi nối**

- Art direction thế nào? (`<picture>` / NuxtImg `sizes` + densities.)
- Ảnh third-party (UGC): constrain max dimension trên optimizer không thì một upload 20 MB hủy LCP.

---

#### 9.2.5. Core Web Vitals năm 2026

**Họ thực sự hỏi gì**

- “Core Web Vitals bây giờ là gì?”
- “FID vs INP?”
- Debug regression thế nào?

**Cách senior trả lời**

- **Quyết định:** Field vital quan trọng năm 2026 là **LCP, INP, và CLS**. **INP thay FID** (FID là trivia lịch sử). Debug **field data trước** (CrUX, RUM với attribution `web-vitals`), rồi **lab** (Lighthouse, Performance panel, CPU throttle) để reproduce. Fix element/task mà attribution chỉ — không `v-once` ngẫu nhiên.
- **Ràng buộc:** Lab là desktop hình điện thoại. Field gồm Android mid-tier, 4G, extension, CMP, và flag A/B. Lighthouse 100 hoàn hảo với p75 INP xấu nghĩa bạn tối ưu nhầm thứ.
- **Failure mode:** Báo FID năm 2026. Đuổi TBT trên lab trong khi INP là một click handler chậm. “Cải thiện LCP” bằng lazy-load hero (bạn làm tệ hơn). Bỏ TTFB vì “chỉ frontend.”
- **Đo:** p75 mỗi vital mỗi **route template**, mobile vs desktop, có và không CMP. Budget: ví dụ LCP < 2.5 s, INP < 200 ms, CLS < 0.1 — là **field p75**, không run local.

**Ba vital**

| Vital | Nó bắt | Typical frontend cause | Debug senior |
| --- | --- | --- | --- |
| **LCP** | Khi hero lớn nhất (ảnh/text) paint | TTFB chậm, hero chưa tối ưu, chờ JS/CSS, lazy hero, font trễ | Performance: marker LCP; Resource Timing; LCP là `<img>`, `<h1>`, hay banner muộn? Priority hint, SSR HTML, preload **đúng** asset đó |
| **INP** | Latency tương tác tệ nhất (gần như) | Long task, listener khổng lồ, render sync lúc input, third-party, hydration | Event Timing / LoAF; breakdown INP (input delay vs processing vs presentation); Vue profiler lúc click; tách long task (`scheduler.yield`) |
| **CLS** | Layout shift bất ngờ | Media không size, font muộn, ad/banner inject, hydration swap | Layout Shift Regions; node nào? Dành chỗ; `font-display`; đừng chèn phía trên nội dung sẵn có |

**Cách senior debug (playbook)**

1. **Xác nhận thật:** RUM p75 của route, 28 ngày gần, mobile. Segment country/device nếu cần.
2. **Attribute:** `web-vitals` `{attribution: true}` — element LCP, INP event target và next paint, node shift CLS lớn nhất.
3. **Reproduce lab** với CPU throttle 4× + 4G chậm. Không được thì khả năng third-party chỉ trên field — vẫn là vấn đề của bạn nếu nó nằm trên page.
4. **Đổi một đòn bẩy**, ship sau flag, nhìn cùng board RUM. Có trace hoặc nó không xảy ra.

**Ghi chú Vue / Nuxt**

- Hydration là INP: click đầu lúc hydrate cạnh tranh với Vue. Giảm island; delay plugin không critical.
- Store `reactive` khổng lồ làm processing time nổ lúc input — Case 4.
- Đổi route: LCP restart; announce và quản lý focus (a11y) mà không thêm CLS.

**Tradeoff**

- Preload mọi thứ → đánh bandwidth LCP. Preload **đúng** ảnh LCP + critical CSS.
- Wrapper third-party hung hãn (tag manager) vs marketing. Làm cost hiện trên RUM không thì bạn thua tranh luận.

**Gotcha production**

- Navigate SPA: vẫn đo; hỗ trợ soft-nav CWV đang tiến hóa — biết RUM vendor thực sự ghi gì.
- Restore bfcache trông như “LCP tức thì” — đừng trộn mù vào average.
- INP là latency **tương tác**, không “page bận lúc load.” Page im với click Pay 400 ms vẫn fail.

**Câu hỏi nối**

- Cái gì thay FID và vì sao? (FID chỉ đo delay tương tác đầu, không đo processing; INP quan sát suốt session.)
- Debug INP Safari vs Chrome thế nào? (Chrome có LoAF + Performance giàu; Safari yếu hơn — dựa field + profile đơn giản hơn.)

---

[← Back to Overview](../../README.md)
