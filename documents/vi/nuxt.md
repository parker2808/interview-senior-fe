# Nuxt.js

Phỏng vấn Senior Nuxt không phải flashcard “SSR vs SPA.” Họ bảo bạn **thiết kế hybrid rendering policy** dưới ràng buộc SEO, auth, TTFB, và chi phí server — rồi giải thích **payload, hydration, và data key** khi policy đó gãy trên production. Interviewer giả định Vue 3. Họ soi **routeRules**, **khi nào không SSR**, và bạn có coi middleware là auth thật không (không phải). Câu trả lời mạnh gọi tên **quyết định**, **ràng buộc**, **failure mode**, và cách bạn **đo**.

---

## Table of Contents

1. [What is Nuxt.js?](#61-what-is-nuxtjs)

2. [Nuxt vs Vue](#62-nuxt-vs-vue)

3. [CSR vs SSR vs SSG vs SPA](#63-csr-vs-ssr-vs-ssg-vs-spa)

4. [Middleware](#64-middleware)

5. [useAsyncData vs useFetch vs $fetch](#65-useasyncdata-vs-usefetch-vs-fetch)

6. [Plugin, runtimeConfig, env](#66-plugin-runtimeconfig-env)

7. [Nitro server route vs BFF](#67-nitro-server-route-vs-bff)

8. [Hydration, ClientOnly, lazy hydration](#68-hydration-clientonly-lazy-hydration)

---

## 6. Nuxt.js

### 6.1. What is Nuxt.js?

**Họ thực sự hỏi gì**

“Vì sao Nuxt thay vì Vue + Vite + vue-router?” Họ muốn **convention mã hóa quyết định production** (rendering mode, data, env, server), không phải danh sách feature.

**Cách senior trả lời**

- **Quyết định:** Nuxt là **application framework** trên Vue 3: file routing, hybrid rendering, Nitro, fetch data first-class với **payload serialize được**, module, và deploy preset. Dùng khi cần **SSR/SSG/hybrid**, SEO, hoặc BFF. Ở lại Vue SPA khi product là shell đã auth sau CDN, không bề mặt SEO, API tách riêng.
- **Ràng buộc:** Giá trị Nuxt nằm ở **happy path**. Bạn trả giá khi đánh với default (routing custom hết cỡ, backend không Nitro, leak `window` trong plugin).
- **Failure mode:** Coi Nuxt là “Vue có folder” rồi fetch trong `onMounted` khắp nơi — giữ hành vi SPA mà vẫn trả complexity SSR.
- **Đo:** Time to first **HTML hữu ích** trên URL marketing vs TTI trên URL app; chi phí vận hành Nitro vs SPA trên object storage.

Nuxt không thay Vue. Nó là Vue + **routing + rendering policy + server**. Nitro là server deploy được (Node, serverless, edge preset). Pinia, Vue Router, và Vite nằm dưới; Nuxt nối câu chuyện SSR của chúng.

**Tradeoff**

- Vue SPA: mental model đơn giản, host static rẻ, bạn tự sở hữu mọi footgun SSR nếu thêm sau.
- Nuxt: tới hybrid app đúng nhanh hơn, nhiều magic (auto-import, payload), khó debug khi magic sai.

**Gotcha production**

- `ssr: false` global là Vue SPA cộng thêm framework — phải justify.
- Module (`nuxt-auth`, image, i18n) tiết kiệm tháng và có thể **sở hữu request path**; đọc chúng nhét gì vào cookie và header.
- Auto-import giấu cycle — cùng điểm phỏng vấn với Vue ([vue3 auto-import](./vue3.md#513-auto-import-components)).

**Câu hỏi nối**

- Nitro mang lại gì so với “Express cạnh Vite.”
- Khi nào vẫn tách API thật ra khỏi process Nuxt.
- Migrate Vue 2 + Nuxt 2 thế nào (bridge vs rewrite).

---

### 6.2. Nuxt vs Vue

**Họ thực sự hỏi gì**

Bảng so sánh là câu junior. Senior map **tầng nào sở hữu vấn đề nào**, nhất là vs Vue SPA công ty đã có.

**Cách senior trả lời**

- **Quyết định:** Vue sở hữu **UI và reactivity**. Nuxt sở hữu **HTML được sinh lúc nào, data fetch cho HTML đó thế nào, env tách ra sao, server chạy ra sao**. Nếu interview là “chúng tôi có Vue 3 SPA,” bạn thêm Nuxt cho **route public + hybrid**, không phải rewrite design system.
- **Ràng buộc:** Routing Nuxt theo file (`pages/`). Thiết kế URL dị (shell all-in-one theo query) đánh với `pages/` và `routeRules`. Vue Router guard vẫn tồn tại; Nuxt middleware là bản SSR-aware.
- **Failure mode:** Nhân bản config vue-router cạnh `pages/`, hoặc dùng Nuxt làm host component library.
- **Đo:** Số route phải SEO-visible; cookie auth chạy được trên first request không; bundle `node_modules/.cache/nuxt` vs Vite SPA.

| Tầng | Vue SPA | Nuxt |
|---|---|---|
| UI | Vue 3 | Vue 3 |
| Routing | vue-router tay | `pages/` + `router.options` tùy chọn |
| Rendering | Chỉ client | Hybrid: SSR / SSG / SWR / CSR theo route |
| Data | Bạn tự invent cache | `useAsyncData` / `useFetch` + payload |
| Env | `import.meta.env` | `runtimeConfig` public vs private |
| Server | Không | Nitro `server/` |
| State | Pinia bạn tự wire | Module Pinia + serialize SSR |

**Tradeoff**

- Vue SPA + BFF tách: biên process rõ, hai deploy, bạn phải invent câu chuyện payload/hydration nếu SSR sau.
- Nuxt monolith: một deploy, BFF in-process, cookie dễ hơn, dễ vô tình nhét việc CPU-nặng lên page server.

**Gotcha production**

- `useFetch` trong Vue SPA **không** Nuxt thì không tồn tại — người ta copy snippet vào app Vite.
- Pinia trong Vue SPA không có payload SSR; module Pinia của Nuxt thì có. Đừng giả định chúng giống nhau.
- Client plugin import module Node-only sẽ gãy server build dù “page là CSR.”

**Câu hỏi nối**

- Nuxt vs VitePress/SSG cho docs site.
- Kiến thức vue-router còn quan trọng bao nhiêu (rất: `meta`, navigation failure, scroll).
- Islands / server component vs “chỉ Vue SFC.”

---

### 6.3. CSR vs SSR vs SSG vs SPA

**Họ thực sự hỏi gì**

Họ để bạn định nghĩa bốn term, rồi: **“Trộn chúng trong một app thế nào?”** Đó là `routeRules`, **payload**, **islands**, và **khi nào không SSR**. Hybrid rendering là topic senior; bảng là warmup.

**Cách senior trả lời**

- **Quyết định:** Chọn **HTML đúng rẻ nhất** từng route. Public, cache được, nhạy SEO → SSG hoặc SWR. Personalized nhưng crawl được → SSR với cache key **không** gồm secret. Chrome app đã auth, dashboard nặng chart, editor → **CSR (`ssr: false`)** hoặc **island client-only**. Đừng SSR cả thế giới.
- **Ràng buộc:** Một process Node/serverless có ngân sách CPU. SSR dashboard 50 series mỗi navigation **sẽ** nát TTFB dưới load. SSG không thấy cookie per-user lúc build. SWR/ISR có thể phục vụ **HTML personalized stale** nếu bạn key cache sai.
- **Failure mode:** Default SSR trên `/dashboard/**` với Recharts/ECharts → hydration mismatch + HTML khổng lồ + CPU server. Hoặc SSG trang giá phải tươi mỗi phút không revalidate. Hoặc “SPA vì SSR khó” trên marketing site.
- **Đo:** TTFB và byte HTML theo class route; cache hit ratio trên CDN; warning hydration; CPU origin vs RPS; LCP cache lạnh vs ấm.

**Rendering mode (bản 30 giây)**

| Mode | HTML khi nào | Hợp | Sai cho |
|---|---|---|---|
| **CSR / SPA** | Sau JS | Auth shell, widget nặng | Landing SEO, social crawler |
| **SSR** | Mỗi request | SEO personalized, page public biết session | Canvas đắt, theo user |
| **SSG** | Lúc build | Docs, marketing, changelog | Catalog per-user hoặc đổi rất nhanh không rebuild |
| **SWR / kiểu ISR** | Build hoặc first request, rồi revalidate | Catalog, blog, bán-tĩnh | Real-time chặt / per-user |

SPA vs CSR: SPA là **kiến trúc navigation** (client router, không full reload). CSR là **chỗ HTML được dựng**. Nuxt có thể là SPA (`ssr: false`) hoặc hybrid app vẫn **navigate như SPA** sau response đầu.

**Hybrid: `routeRules`**

Đây là control plane production. Ví dụ policy, không phải recipe copy mù:

```ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
    '/blog/**': { swr: 3600 },
    '/product/**': { swr: 60 },
    '/search': { ssr: true, cache: false },
    '/account/**': { ssr: false },
    '/editor/**': { ssr: false },
  },
})
```

- **prerender / SSG:** HTML lúc build, CDN, không origin khi hit.
- **swr:** phục vụ HTML cache, revalidate nền. Xác nhận Nitro/CDN preset thực sự tôn trọng nó.
- **ssr: true, cache: false:** HTML mỗi request (search với query string độc).
- **ssr: false:** bỏ server render; gửi shell; Vue chỉ chạy trên client.

Rule là **policy theo path**. Chúng không thay key `useAsyncData`. Page SWR fetch theo user id suy từ cookie sẽ **cache HTML user A cho user B** trừ khi bạn vary cache hoặc bạn không SSR page đó.

**Khi nào không SSR**

- **Dashboard auth** sau login: crawler không thấy; HTML personalized; cost hydration cao; SPA shell + client fetch là thành thật.
- **Chart / map / canvas / WebGL:** HTML server là hộp rỗng hoặc mismatch. SSR heading + `ClientOnly` widget (hoặc `ssr: false` route).
- **Rich text editor, design canvas:** tương tự — không giá trị SEO, thù hydration.
- **A/B hoặc feature flag chỉ tồn tại trên `window`:** bạn sẽ lệch; quyết trên server hoặc đừng SSR nhánh đó.
- **Page fan-out mạnh** nơi CPU origin là hóa đơn (vô hạn tổ hợp filter) — cache ở tầng data hoặc CSR.

**Payload**

SSR vô dụng nếu client **fetch lại và render lại** cùng cây. Nuxt rút async data vào **payload** (`__NUXT__` / `_payload.json`) để hydration tái dùng kết quả server.

- Key (`useAsyncData('product:id')`) **chính là** identity cache. Key đụng nhau trộn page; key unique-per-instance phá dedupe.
- `useNuxtData(key)` đọc cache đó không refetch.
- Size payload **là** ngân sách TBT/HTML. Trả blob search 2 MB “vì đã có” là incident production.
- `pick` / `transform` tồn tại để **co** cái bạn serialize.

**Islands (Nuxt Island / server component)**

Island render **snippet server** mà client không cần hydrate như cây Vue đầy đủ (hoặc hydrate sau). Dùng cho khối **phần lớn tĩnh, hydrate đắt** (thân bài markdown, bảng giá) trong page vốn interactive. Đừng island component toàn `v-model`.

Ràng buộc: island có **câu chuyện data chặt hơn** (props phải serialize được; không leak object chỉ-request). Failure mode: island + client state bất đồng sau client navigation.

**Tradeoff**

| Policy | TTFB | CPU server | SEO | Hydration |
|---|---|---|---|---|
| SSR global | Phụ thuộc origin | Cao | Mạnh | Bạn trả |
| CSR global | Shell nhanh, content chậm | Thấp | Yếu | Chỉ client |
| Hybrid `routeRules` | Chỉnh được | Chỉnh được | Chỉnh được | Chỉnh được |
| SSG + client island | Tốt nhất cho static | Lúc build | Mạnh | Nhỏ |

**Gotcha production**

- `routeRules` + redirect middleware: first request vẫn có thể hit SSR trước client nav cache.
- Prerender crawl có thể miss URL authenticated hoặc chỉ-query — chúng không “SSG tình cờ.”
- `swr` + `Set-Cookie` trên page = **đừng cache** không thì leak session. HTML personalized thuộc `private` cache hoặc CSR.
- Payload vs CDN: HTML cache ở CDN mà payload không (hoặc ngược) thì bạn hydrate **data sai**.

**Câu hỏi nối**

- Chạy page account **đã login** và page product **public** trong một deploy thế nào.
- Incremental static regeneration vs “chỉ SSR + Redis.”
- Bản đồ tư duy Nuxt vs Next: `routeRules` ≈ segment config + caching header; islands ≈ server component (không ident). Xem [Next.js](./nextjs.md) nếu vòng hỏi đi đó.

---

### 6.4. Middleware

**Họ thực sự hỏi gì**

Redirect auth. Senior được chấm ở **SSR vs client execution**, **cookie vs localStorage**, và ranh giới: **middleware là UX gating, không phải authorization**.

**Cách senior trả lời**

- **Quyết định:** Dùng **route middleware** để redirect user chưa auth và chọn layout **trước khi page render**. Hydrate auth **một lần** (session cookie → server đọc được). **Authorization thật** đặt trên Nitro/API (`server/middleware` hoặc service upstream). Không bao giờ đọc `localStorage` trong middleware chạy trên server.
- **Ràng buộc:** Cùng file `defineNuxtRouteMiddleware` có thể chạy trên **server** (first request) và trên **client** (navigation sau). Nó phải **idempotent**. Có `to` / `from`, không có raw Node `req`, trừ khi bạn `useRequestEvent()` cẩn thận (chỉ server).
- **Failure mode:** `localStorage.getItem('token')` → luôn logged-out trên SSR → flash login → client redirect ngược. Hoặc middleware POST analytics mọi lần chạy (fire đôi). Hoặc coi `abortNavigation(403)` là security trong khi `server/api` để mở.
- **Đo:** Vòng redirect trong server log; thêm call `/me` mỗi navigation; page mà HTML đầu là login shell dù cookie đã login (sai) hoặc dashboard cho user logged-out (tệ hơn).

**Ba loại**

| Loại | Khai báo | Phạm vi |
|---|---|---|
| **Global** | `middleware/auth.global.ts` | Mọi navigation |
| **Named** | `middleware/admin.ts` | `definePageMeta({ middleware: 'admin' })` |
| **Inline / route** | `definePageMeta({ middleware: [...] })` | Page đó |

Thứ tự: **global → named/route (thứ tự array)** → render. Giữ global mỏng. Global đi fetch là cách đóng băng TTFB.

**SSR vs client**

1. Hit đầu: middleware chạy **trên server** với cookie/header. Return `navigateTo('/login')` và user không bao giờ thấy HTML SFC được bảo vệ.
2. Client nav: middleware chạy **trong browser**. Bạn đã có Pinia / `useState` nếu hydrate đúng.
3. Nhánh `import.meta.server` / `import.meta.client` cho side effect hiếm (không bao giờ cho **quyết định** auth nếu cookie sẵn).
4. Đừng `window` / `document` / `localStorage`. Session thuộc **httpOnly cookie** (chống XSS) hoặc store hydrate từ payload, đổ trên server.
5. Việc DB nặng thuộc **API / Nitro `server/middleware`**, không phải UI route middleware.

**Cookie vs localStorage**

| | Cookie (`httpOnly`, `Secure`, `SameSite`) | `localStorage` |
|---|---|---|
| SSR middleware | Thấy được dưới header `Cookie` | Vô hình |
| XSS | httpOnly JS không đọc được | Ăn cắp dễ |
| CSRF | `SameSite` + anti-CSRF trên mutation | Bearer trong JS, CSRF profile khác |
| Câu interview | Default cho session | Không phải source of truth auth |

Nếu IdP third-party ép token JS, copy vào **cookie server set** qua BFF route; đừng để middleware phụ thuộc `localStorage`.

**Không phải auth thật**

Giấu `/admin` bằng middleware là **defense in depth + UX**. Admin API phải check session. Check role chỉ client bypass được. One-liner interview: *middleware quyết HTML nào sẽ thử; server quyết data nào tồn tại.*

**Route middleware vs Nitro `server/middleware`**

| | Route middleware (`middleware/`) | Nitro `server/middleware` |
|---|---|---|
| Chạy lúc | Navigate tới Nuxt page | HTTP request khớp (page + `/api`) |
| Mục đích | Redirect, feature flag, UX | CORS, authn API, rate limit, logging |
| Context | `to` / `from` | H3 `event` |
| Bảo vệ `server/api` | Không | Có |

**Tradeoff**

- Auth middleware global: không quên page; dễ vô tình bọc `/login` rồi loop (luôn exclude).
- Named per-page: dễ quên trên admin route mới — lint `definePageMeta` hoặc global theo path prefix.
- Route `ssr: false`: server middleware cho `/api` vẫn chạy; route middleware có thể chỉ chạy client cho navigation page đó.

**Gotcha production**

- `navigateTo` trong middleware lúc SSR nên dùng `redirectCode` (302 vs 301) có chủ đích; 301-cache redirect login là ác mộng support.
- `abortNavigation(createError({ statusCode: 404 }))` vs redirect: 404 cho “id này không tồn tại,” không cho unauthenticated.
- Middleware `await useFetch` tạo **waterfall** và có thể deadlock với payload. Đọc `useState` / Pinia **đã hydrate**.
- Vue Router guard vẫn tồn tại cho plugin SPA-only; đừng cài cổng auth thứ hai bất đồng với Nuxt middleware.

**Câu hỏi nối**

- Hydrate user một lần cho SSR + client (Pinia plugin, `useState('user')`, `callOnce`).
- `definePageMeta({ middleware })` compile lúc build — không fully dynamic theo user.
- Next `middleware.ts` là **cổng edge trước response** — map Nuxt gần nhất là route middleware này cộng một phần concern Nitro `server/middleware`.

---

### 6.5. useAsyncData vs useFetch vs $fetch

**Họ thực sự hỏi gì**

“Dùng cái nào?” Họ muốn **dedupe, key, refresh, và client vs server** — và vì sao `$fetch` trong `setup` là footgun trên SSR.

**Cách senior trả lời**

- **Quyết định:** `$fetch` cho call **imperative** (event handler, Nitro handler, plugin) **không** gắn payload. `useAsyncData` khi bạn sở hữu key và handler (không HTTP, compose hai call, cache custom). `useFetch` khi là HTTP GET/POST nên tham gia payload SSR — nó là `useAsyncData` + `$fetch` với **URL làm default key**.
- **Ràng buộc:** Trên SSR, composable fetch chạy trên server, kết quả vào payload, client **không được refetch** trừ khi `refresh` / key đổi. Key trùng share state (đó là feature). Thiếu key hoặc `$fetch` trong `setup` thì **fetch đôi** hoặc **mismatch**.
- **Failure mode:** `$fetch('/api/x')` trong `<script setup>` — chạy server **và** lại trên client, không dedupe, có thể lệch. `useFetch('/api/user/' + id)` không key ổn định khi `id` rỗng rồi được điền. Bão `refresh()` lúc window focus bạn không xin (đó là hành vi TanStack Query — Nuxt không trừ khi bạn thêm).
- **Đo:** Network panel first load (một GET, không hai). Size payload. Abort in-flight lúc đổi route. Flag error/pending sống sót client nav.

| API | Payload SSR | Dedupe | Call site điển hình |
|---|---|---|---|
| `$fetch` | Không | Không (trừ khi bạn wrap) | `click`, plugin, `server/api` |
| `useAsyncData(key, handler)` | Có | Theo **key** | Non-REST, compose, custom |
| `useFetch(url, opts)` | Có | Theo URL + opts key | REST trong SFC |

**Key**

- `useAsyncData('product:' + route.params.id, ...)` — tường minh, grep được.
- Default key `useFetch` gồm URL và option được chọn. Đổi `query` đổi key (tốt) trừ khi bạn mutate object tại chỗ (xấu).
- Cùng key ở parent và child: **một** request, `data` share. Đó là cách tránh waterfall **hoặc** cách vô tình share nhầm product.
- `getCachedData` / `useNuxtData` cho “đọc nếu ấm.”

**Refresh, watch, lazy, server**

- `refresh()` / `refreshNuxtData(key)` — tường minh. Dùng sau mutation.
- `watch: [() => route.params.id]` (hoặc `watch: true` trên `useFetch` với URL reactive) — refetch khi source đổi. Ghép abort.
- `lazy: true` — không block navigation; bạn sẽ paint pending. Tốt cho widget phụ, xấu cho H1 SEO-critical.
- `server: false` — chỉ client; không data HTML, không payload. Chart, widget chỉ-user.
- `immediate: false` — đợi submit.

**Client vs server**

- Handler nên dùng `$fetch` / `event.$fetch` để chạy cả hai. `window.fetch` tới relative URL có thể bất ngờ trên server (cần host).
- Cookie: trên server, `$fetch` trong composable **forward cookie request** khi dùng đúng; `fetch('https://api.internal')` thô có thể không. BFF route tồn tại vì chuyện này.
- Đừng chạm `document` trong handler.

**Tradeoff**

- `useFetch` mỏng khắp nơi: DX nhanh, key rối, dễ over-fetch POST như GET.
- `useAsyncData` + hàm repository: handler test được, bạn phải đặt tên key tốt.
- TanStack Query trong Nuxt: stale-while-revalidate tốt hơn trên **client**; vẫn không được phá payload SSR (hoặc chạy Query chỉ-client).

**Gotcha production**

- Pending đã dedupe: hai component một key share `pending` — unmount một không nên cancel cái kia nếu cái thứ hai vẫn cần. Biết semantics cancel của version.
- `transform` / `pick` chạy trước serialize — dùng để bỏ field (PII, include lồng khổng lồ).
- `useFetch` một **POST** trong setup sẽ **replay** trừ khi `server: false` / gọi trong event. Mutation không thuộc `setup`.
- Error **không** throw vào Vue error boundary mặc định; bạn phải đọc `error` hoặc `showError`.

**Câu hỏi nối**

- `callOnce` vs `useAsyncData` cho init one-shot (hydrate auth, feature flag).
- `clearNuxtData` lúc logout để user sau trên browser share không thấy payload leftover (thường process-isolated, nhưng client cache thì không).
- `useAsyncData` song song vs một handler `Promise.all` (một key vs waterfall component).

---

### 6.6. Plugin, runtimeConfig, env

**Họ thực sự hỏi gì**

Secret sống ở đâu, và plugin có phải **`.server` / `.client`** không. Họ sẽ bảo bạn leak private key có chủ đích trên khái niệm — họ muốn bạn từ chối.

**Cách senior trả lời**

- **Quyết định:** `runtimeConfig.public` cho giá trị **browser được thấy** (host CDN, feature flag không phải secret, Sentry DSN nếu bạn chấp nhận rủi ro đó). `runtimeConfig` private cho **chỉ server** (API key, DB, session secret). Env: `NUXT_PUBLIC_*` map public; `NUXT_*` map private. Plugin: default = cả hai; `.server.ts` / `.client.ts` theo môi trường; `provide` từ plugin thay vì singleton phạm vi module.
- **Ràng buộc:** `runtimeConfig` được **build vào snapshot server** và public key serialize ra client. Private key trong `public` là incident bảo mật. `process.env.FOO` trong Vue SFC có thể bị inline lúc build — đừng dùng cho secret per-deploy; dùng runtimeConfig để env **runtime** trên host thắng.
- **Failure mode:** `const secret = useRuntimeConfig().stripeSecret` trong composable gọi từ page → bị bundle hoặc leak qua payload nếu bạn return nó. Plugin `import` `fs` không `.server`. Analytics plugin fire trên SSR (pageview giả).
- **Đo:** Search client bundle tìm chuỗi secret trong CI. Test thứ tự plugin (auth trước API). Confirm env preview/staging thực sự override (runtime, không rebuild) nếu đó là requirement.

**Plugin**

- `defineNuxtPlugin` — `nuxtApp.provide('api', client)` rồi `useNuxtApp().$api`, hoặc tốt hơn composable `inject` typed key.
- Thứ tự: prefix filename / `enforce` / `dependsOn` (phụ thuộc version). Hydrate auth trước store cần user.
- Vue plugin vs Nuxt plugin: `nuxtApp.vueApp.use(pinia)` module Pinia đã làm; việc bạn là setup **theo request**.
- SSR-safe: tạo client **bên trong** `defineNuxtPlugin`, không lúc import. Không `cache = new Map()` global cho user data.

**Tradeoff**

- Public runtimeConfig: inspect được, dễ, dễ overshare.
- Private + BFF: client không bao giờ thấy key; thêm hop.
- `import.meta.env` compile-time: nhanh, sai cho secret đổi không rebuild.

**Gotcha production**

- Log `useRuntimeConfig()` trong client plugin đổ **public** config vào log — vẫn có thể gồm URL nội bộ.
- `ssr: false` không nghĩa “private config an toàn trong browser.” Private là **server**. Không server, không private.
- Env khác cho Nitro vs Vite: biến chỉ trong `.env` mà host không có thì production im lặng fallback default lúc build.
- Feature flag trong public config **không** phải access control.

**Câu hỏi nối**

- Inject header per-request (correlation id) vào `$fetch`.
- Layer: `.env` < `.env.[env]` < environment thật trên process.
- Vì sao `useRuntimeConfig()` trong `server/api` vs `useRuntimeConfig(event)` (override theo request).

---

### 6.7. Nitro server route vs BFF

**Họ thực sự hỏi gì**

“Bạn nhét API vào Nuxt à?” Senior nói **BFF**: aggregate, session cookie, giấu upstream, vs khi Nitro là chỗ **sai** cho domain.

**Cách senior trả lời**

- **Quyết định:** Dùng Nitro `server/api` / `server/routes` như **BFF** cho UI: session cookie, gộp 3 upstream, strip field, map lỗi thành 4xx UI hiểu. Giữ **domain of record** (billing, inventory, identity) ở service sở hữu data. Đừng lớn thành monolith thứ hai trong `server/` vì ngày một tiện.
- **Ràng buộc:** Nitro share **origin của page** — cookie dễ (`same-site`), CORS thường biến mất. Nó cũng share **CPU với SSR**. Waterfall upstream 200 ms trên BFF là TTFB 200 ms trên page nếu bạn gọi lúc render.
- **Failure mode:** Gọi năm microservice từ `useFetch` trên browser (CORS, token trong JS, waterfall) thay vì một BFF route. Hoặc nhét batch job / websocket fan-out cùng process render HTML.
- **Đo:** RPS và p95 `/api/*` vs page SSR; CPU origin; size `server/` như phân số logic product; số secret trong `runtimeConfig` vs upstream.

`server/api/users.get.ts` → `/api/users`. `server/routes/health.ts` → `/health`. `server/middleware` cho CORS/auth trên handler đó. `event.context` cho session đã decode.

**Tradeoff**

| | Browser → upstream | Nuxt BFF | BFF tách |
|---|---|---|---|
| Cookie | Đau / CORS | Dễ | Dễ nếu same site |
| Token trong JS | Thường có | Không | Không |
| Scale độc lập | Chỉ upstream | Dính Nuxt | Có |
| DX local | Nhiều mock | Một process | Hai process |

**Gotcha production**

- `$fetch('/api/x')` từ SSR cần URL internal; Nitro thường lo routing **cùng app** không vòng internet public. Lỡ fetch `https://prod` từ server là bug latency kinh điển.
- Cache GET BFF route vary theo cookie — **đừng**, hoặc vary theo session.
- Upload file / SSE dài: serverless Nitro preset sẽ timeout; chọn Node preset hoặc service riêng.
- `server/api` vẫn là HTTP public. Auth middleware thuộc đây, không chỉ `pages/middleware`.

**Câu hỏi nối**

- Khi nào extract `server/` thành service riêng (CPU, biên team, workload không HTTP).
- GraphQL BFF vs REST aggregator.
- `routeRules` trên `/api/**` (`cors`, `swr`) tương tác endpoint authenticated thế nào.

---

### 6.8. Hydration, ClientOnly, lazy hydration

**Họ thực sự hỏi gì**

Screenshot mismatch, hoặc “sao page này interactive muộn vậy?” Họ muốn **nguyên nhân**, **ClientOnly**, và **lazy/delayed hydration** — không phải “tắt SSR.”

**Cách senior trả lời**

- **Quyết định:** Hydration phải tái dùng HTML SSR. Làm cây **deterministic** (payload, cùng flag, HTML hợp lệ). Dùng `<ClientOnly>` cho đảo **thật sự client-only** (map, chart, widget chạm `window` lúc render). Dùng **lazy hydration** (`hydrate-on-visible` / idle / interaction, component `Lazy`) cho interactivity dưới fold để **giữ HTML** nhưng **hoãn JS**.
- **Ràng buộc:** `ClientOnly` nghĩa crawler và first paint **không** thấy subtree đó (chỉ placeholder slot). Lazy hydration **vẫn phải khớp**; nó chỉ hoãn Vue runtime gắn listener.
- **Failure mode:** Bọc cả page `ClientOnly` để im warning — bạn xóa SSR. Hoặc hydrate dashboard 3 MB một lúc khiến INP sụp. Hoặc pattern `v-if="mounted"` luôn lệch trừ khi server render cùng `false`.
- **Đo:** Warning hydration trên staging; TBT/INP; HTML vs visual above-fold; bao nhiêu JS chạy trước khi user scroll.

**Nguồn mismatch (thêm Nuxt-specific)**

- Fetch lại trên client kết quả khác (`$fetch` trong setup, không key).
- Date/time/locale (server UTC vs browser).
- Auth UI: server có cookie, client store chưa hydrate (hoặc ngược).
- HTML không hợp lệ browser đã “sửa.”
- ID random, `Date.now()` trong template.
- Script third-party mutate DOM trước khi Vue hydrate.

Sửa data bằng **payload key**. Sửa auth bằng **session server đọc được**. Sửa widget bằng **ClientOnly**. Text phẫu thuật: Vue `data-allow-mismatch` — last resort.

**ClientOnly**

```vue
<ClientOnly>
  <HeavyChart :series="series" />
  <template #fallback>
    <div class="chart-skeleton" />
  </template>
</ClientOnly>
```

Chart không nằm trong HTML SSR. Skeleton thì có. Không hydrate ECharts. SEO trên chính chart là zero — chấp nhận được cho dashboard; không cho giá phải crawl được (khi đó SSR một số, client-only canvas).

**Lazy hydration**

Nuxt có thể hoãn hydrate component tới khi **visible**, **idle**, hoặc **interaction**. Kết hợp import async `LazyChart`, widget dưới fold không tranh với phần tử LCP.

Ràng buộc: tới khi hydrate, đảo **không interactive** (carousel không swipe). Đừng lazy-hydrate CTA chính. HTML server vẫn phải trông đủ (text thật, không rỗng).

**Tradeoff**

| Kỹ thuật | Nội dung HTML | Cost JS | Interactivity |
|---|---|---|---|
| SSR đầy + hydrate | Đầy | Ngay | Ngay |
| Lazy hydrate | Đầy | Hoãn | Hoãn |
| ClientOnly | Placeholder | Sau load | Sau load |
| Route `ssr: false` | Shell | Cả page client | Sau load |

**Gotcha production**

- Children `ClientOnly` vẫn chạy `setup` **chỉ client**; đừng giả định `useAsyncData` bên trong đã chạy trên server.
- `ClientOnly` lồng trong lazy island: thứ tự attach có thể bất ngờ với focus management.
- Hydration mismatch **chỉ dev** vì HMR / comment thừa — verify bằng production build.
- Image: dimension sai gây layout shift trông như bug hydration mà không phải.

**Câu hỏi nối**

- Map sang ghi chú hydration mismatch của Vue ([vue3](./vue3.md#5211-hydration-mismatch)).
- Islands vs ClientOnly (HTML server không client Vue vs không HTML server).
- Vì sao INP tệ hơn sau khi bạn “fix SEO bằng SSR” trên internal tool.

---

[← Back to Overview](../../README.md)
