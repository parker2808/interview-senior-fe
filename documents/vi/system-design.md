# System Design

Đây là vòng **system design frontend 45 phút**, không phải quiz folder structure. Interviewer xem bạn có **làm rõ product**, chọn **SPA vs SSR vs hybrid**, vẽ **hộp kèm failure mode**, và nói **cache invalidation** — phần khó.

Chạy mọi câu trả lời theo **decision → constraint → failure mode → measure.** Vue 3 / Nuxt-first; Next.js khi họ hỏi hybrid React hoặc bạn cần so sánh RSC.

---

## Table of Contents

1. [Quyết định Kiến trúc Frontend](#161-quyết-định-kiến-trúc-frontend)

2. [Chiến lược Caching](#162-chiến-lược-caching)

3. [Thiết kế Component Library](#163-thiết-kế-component-library)

4. [Ví dụ: Thiết kế dashboard lớn](#164-ví-dụ-thiết-kế-dashboard-lớn)

5. [Ví dụ: Thiết kế hybrid marketing + app traffic cao](#165-ví-dụ-thiết-kế-hybrid-marketing--app-traffic-cao)

---

## 16. System Design

### 16.1. Quyết định Kiến trúc Frontend

**Họ thực sự hỏi gì**

“Design frontend cho X.” Nếu bạn bắt đầu bằng `src/components/base/`, bạn đã lạc đề.

**Cách senior trả lời**

- **Quyết định:** Dành **5–8 phút đầu cho constraint**, rồi chọn **mô hình render**, rồi vẽ **hộp runtime**, rồi API/state, rồi delivery (CDN, flag, observability). Folder structure là **chú thích cuối**.
- **Ràng buộc:** Architecture là boundary, SLA, và chuyện gì xảy ra khi một hộp chết — không phải composable có nằm trong `/composables`.
- **Failure mode:** Design platform microfrontend cho team 6 người; SSR dashboard đã auth không cần SEO; SPA không crawl được cho site content; bỏ quên auth, region, và realtime đến phút 40.
- **Đo:** bạn nên **đề xuất** thước đo: LCP/INP, TTFB, error budget, p95 thời gian API của màn, thời gian rollback deploy, time-to-interactive trên máy mid-tier ở region tệ nhất.

#### Cách chạy vòng phỏng vấn (nói to)

Làm rõ, đừng giả định:

| Hỏi | Vì sao nó đổi design |
| --- | --- |
| **User là ai?** Ops nội bộ vs consumer ẩn danh vs cả hai | Auth, SEO, mật độ UI, thanh a11y |
| **SEO / URL share / OG?** | SSR/SSG vs SPA + prerender |
| **Realtime?** Tick, collab, không | WS/SSE vs poll vs không (13.1) |
| **Region / latency?** Một DC vs global | CDN, edge, API multi-region, i18n |
| **Auth?** Cookie session, SSO, public | BFF, CSRF, SSR user payload |
| **Scale?** Tool văn phòng 100 DAU vs marketing 10M | Caching, chi phí SSR, virtualization |
| **Team / deploy?** Một team vs nhiều | Package vs MF (15.4) — default **một app** |
| **Offline / mobile WebView?** | SW, payload size |
| **SLA?** “Search vẫn chạy nếu recs chết” | Isolation, error boundary, timeout BFF |

Rồi **nêu lựa chọn**:

- **SPA (Vite + Vue):** tool đã login, nhu cầu SEO yếu, nhiều interaction. Hosting rẻ. Bạn vẫn cần **shell + CDN** và BFF.
- **SSR (Nuxt):** first paint + SEO + personalization mỗi request. Tốn Node/Nitro, cache cẩn thận.
- **SSG / ISR:** marketing, docs, catalog chịu stale N giây.
- **Hybrid:** câu trả lời người lớn thường gặp — **route rules**. Marketing SSR/SSG, app CSR sau auth, một phần ISR. Nuxt `routeRules` / Next `revalidate` + client island.

**Đừng** chọn microfrontend trừ khi họ ép constraint team/deploy (15.4).

#### Vẽ hộp (whiteboard)

```
[User] → [CDN / edge] → [HTML: Nuxt/Nitro or static]
                           ├─ hashed JS/CSS
                           ├─ BFF (same origin /api)
                           │    ├─ product APIs
                           │    ├─ auth / session
                           │    └─ aggregate DTOs
                           ├─ WS/SSE gateway (optional)
                           └─ flag service (short timeout, fail-safe)
         Browser cache ← → Service worker (optional, mostly static)
```

Nói **một failure mỗi hộp**: CDN HTML stale, BFF timeout, WS drop, flag service down, JS 404 sau deploy. Nêu **kết quả user thấy** và mitigation (stale-while-revalidate, widget error, flag fail-closed, cache-bust HTML).

#### Folder structure không phải architecture

Bạn có thể show cây feature-folder 10 dòng ([15.5](./architecture.md#155-kiến-trúc-thư-mục-và-feature)) để chứng minh đã ship Vue. Rồi pivot:

- **Boundary:** feature không deep-import nhau; BFF sở hữu aggregation; DS là package.
- **SLA:** p95 checkout, dashboard “dùng được nếu một widget fail,” TTFB marketing.
- **Failure mode:** session hết hạn (18.1), failover region, poison message trên WS, rollback deploy (14.1).
- **Data:** server state (TanStack Query / `useAsyncData`) vs client UI state vs URL state.

**Tradeoff**

- CPU SSR vs SEO/LCP.
- BFF vs waterfall FE. BFF gần như luôn cho dashboard.
- Edge rendering vs origin SSR (personalization vs cache hit ratio).

**Gotcha production**

- Hydration mismatch từ `Date.now()`, `Math.random()`, flag, `window`.
- SPA fallback nuốt 404 `/api`.
- Pinia “global” cho server data lẽ ra phải là query cache.

**Câu hỏi nối**

- Theming multi-tenant?
- Trông thế nào trên Next App Router? (RSC cho content, client cho dashboard widget — cùng ý hybrid)

---

### 16.2. Chiến lược Caching

**Họ thực sự hỏi gì**

“Cache thế nào?” Junior liệt kê `localStorage`. Senior nói **tầng và invalidation**.

**Cách senior trả lời**

- **Quyết định:** Cache ở **tầng ngoài cùng an toàn**: static hashed trên CDN mãi; HTML/JSON với TTL tường minh + **tag**; browser HTTP cache cho GET public; memory app / TanStack Query cho session; SW chỉ khi có câu chuyện purge. Không bao giờ cache HTML cá nhân hóa như `public`.
- **Ràng buộc:** **Invalidation là phần khó.** Ai cũng set `max-age`. Ít người trả lời được “user đổi avatar — cache nào còn nói dối?”
- **Failure mode:** `Cache-Control: public` trên `/api/me`; SW serve `index.html` một năm tuổi trỏ hashed file đã xóa; Redis TTL 24h trên giá; client cache không key theo tenant/user; “hard refresh” như strategy invalidation.
- **Đo:** cache hit ratio ở CDN, **incident nội dung stale**, LCP vs TTL, origin QPS sau deploy, độ trễ purge.

#### Các tầng (browser → origin)

| Tầng | Thứ thuộc về đây | Invalidation |
| --- | --- | --- |
| **Browser HTTP** | `/_nuxt/x.js` hashed `immutable`; một số GET JSON | Đổi hash / URL; ETag cho thứ chưa hash |
| **Memory / Query** | Data màn hình, 10s–vài phút | Query key + `invalidateQueries` lúc mutation |
| **`localStorage` / IDB** | Preference, draft, offline queue — **không** auth token nếu tránh được | Version key; wipe lúc logout |
| **CDN / edge** | HTML, JSON public, image | **Surrogate key / tag**, purge lúc publish, HTML TTL ngắn |
| **App / Nitro cache** | SSR payload, BFF aggregate | Tag theo entity (`order:123`), request-scoped vs shared |
| **API / Redis** | Join đắt | Cùng tag; đừng double-cache không có plan |
| **Service worker** | Precache hashed asset; network-first cho HTML | Kill switch (`skipWaiting` + version `max`); không cache HTML mãi |

#### Pattern invalidation bạn nên nêu tên

- **Hash filename** (content-addressed). Cache tốt nhất. Deploy = tên mới. HTML không được cache lâu bằng JS.
- **TTL:** chấp nhận được cho “đủ tốt” (marketing ISR 60s). Sai cho inventory.
- **ETag / `If-None-Match`:** polling rẻ (13.1).
- **Surrogate-Key / cache tag:** “purge mọi thứ tagged `product:9`.” Đây là cách còn tỉnh. Nuxt/Nitro và CDN (Fastly, Cloudflare Cache Tags) hỗ trợ ý này.
- **Event-driven purge:** lúc publish, BFF emit “invalidate `sku:9`.”
- **Key cache:** `userId`, `locale`, `flag-bucket`, `currency`. Thiếu một key là **bug security**, không phải bug performance.

Nuxt cụ thể: key `useAsyncData`, `cachedEventHandler`, SWR (`stale-if-error` / `stale-while-revalidate`). Next: `revalidate`, `revalidateTag`. Cùng design.

**Tradeoff**

- Độ tươi vs chi phí origin vs độ phức tạp của tag.
- SW offline vs tai tiếng “user kẹt app cũ.” Nhiều senior **không** gắn SW lên SaaS ship nhanh.

**Gotcha production**

- `index.html` `max-age=31536000`.
- CDN bỏ qua page `Set-Cookie` bị cache nhầm.
- Query cache hiện order của user A cho user B sau login mà không đổi key (18.1).
- Clock skew và `max-age`.

**Câu hỏi nối**

- Cache GraphQL thế nào? (persisted query + GET, hoặc phần lớn đừng cache ở CDN)
- Cache gì trong service worker vs HTTP cache? (ưu tiên HTTP cho static)

---

### 16.3. Thiết kế Component Library

**Họ thực sự hỏi gì**

“Design component library cho 4 product team.”

**Cách senior trả lời**

- **Quyết định:** Ship **token + primitive accessible + composition được document**, như **package có version** với peer `vue`. Ownership là một team (hoặc guild) với roadmap public. App consume pin semver; họ không fork button. Domain widget ở lại app (15.6).
- **Ràng buộc:** DS là một **product**. A11y, theming, và compatibility quan trọng hơn Storybook đẹp.
- **Failure mode:** Library bundle Vue; không token (hex trong mọi SFC); Icon button không phải `<button>` thật; major bump mỗi tháng; không owner nên tồn tại ba `Button.vue`; visual test chỉ Chrome desktop.
- **Đo:** adoption, vi phạm a11y trên primitive, thời gian thêm variant, breakage mỗi release, byte bundle mỗi component import (tree-shake).

**Token**

- Color, type, space, radius, elevation, motion — CSS variable, tên semantic (`--color-danger`), không `--blue-500` trong app.
- Dark mode: swap token, đừng duplicate component. SSR: class trên `<html>` từ cookie để tránh flash.

**A11y (không thương lượng cho DS)**

- Keyboard, focus order, name, focus trap `Dialog`, pattern listbox `Select`, contrast màu trên token.
- Đừng ship widget `div` click. Primitive API nên làm **việc sai trở nên khó**.
- Test: axe trên story, cộng keyboard e2e cho overlay widget.

**Versioning và app consume**

- Semver: breaking visual = **major** (padding làm lệch layout là breaking).
- Map `exports`, entrypoint per-component, `sideEffects` cho CSS.
- Changelog + codemod cho major.
- Pin trong app; Renovate; đừng `workspace:*` mãi nếu lịch deploy tách.

**Ownership**

- RFC cho primitive mới; request “app-specific” nhận **không** kèm composition thay thế.
- Mô hình contribution: team PR được, DS owner merge.

**Dark launching**

- `Button` v2 như `ButtonNext` hoặc flag trong package, migrate một app, rồi chuyển export. Cùng ý product flag (14.4) nhưng **cấp library**.

**Tradeoff**

- Headless (logic) + app styling vs styled kit. Styled + token nhanh hơn cho một brand; headless nếu brand lệch mạnh.
- Một package vs `@acme/ui-button`. Bắt đầu mono, tách nếu build đau.

**Gotcha production**

- CSS order: utility app đánh nhau với DS.
- Icon duplicate 3 cách.
- Component chỉ sống trên Storybook, không chạy Nuxt SSR.

**Câu hỏi nối**

- Visual-regression test thế nào? (Playwright/Chromatic, token như fixture)
- DS React + Vue? (share token, primitive native mỗi framework — đừng wrap Vue trong React)

---

### 16.4. Ví dụ: Thiết kế dashboard lớn

**Họ thực sự hỏi gì**

“Design analytics / ops dashboard.” Dùng đây như **dàn bài 45 phút đã làm.**

**Cách senior trả lời**

- **Quyết định:** **SPA hoặc Nuxt nặng CSR** (SEO thường không liên quan), **BFF aggregation**, **filter trong URL**, **virtualization** cho table/chart lớn, **permission trên server** với UI vừa ẩn **vừa** không gọi được, failure cấp widget, SSE/WS tùy chọn cho vài ô live — không phải socket cho cả JSON blob.
- **Ràng buộc:** Power user, UI dày, 10k–100k hàng, 20 widget, API chậm, role chặt (xem PII vs không). First load phải hiện **cái gì đó**; widget chậm độc lập.
- **Failure mode:** 12 waterfall từ browser; filter chỉ trong Pinia (không share, back button gãy); render 50k DOM row; giấu nút nhưng để endpoint; một chart throw whitescreen cả app; WS push thay cả table.
- **Đo:** time-to-first-widget, p95 DTO dashboard BFF, INP khi scroll, query param đúng, tỷ lệ API 403 unauthorized, memory trên tab sống lâu.

**Làm rõ (2 phút)**

User nội bộ? Live mức nào? Bao nhiêu hàng? Export? Multi-region? Saved view?

**Rendering**

- Shell + nav SSR tùy chọn; widget client. `<ClientOnly>` cho chart.
- Layout: lưới widget, mỗi cái `useAsyncData` / query riêng **hoặc** một BFF payload tách phía client nếu backend là một join đắt. Đừng mix không nghĩ: N widget × N API là bẫy kinh điển → **BFF `GET /bff/dashboard?…`**.

**Filter trong URL**

- `?from=&to=&status=&q=` là source of truth. Vue Router query ↔ helper typed. Back button chạy, link share được, SSR/bookmark chạy.
- Đừng nhét secret vào URL. Có nhét **view state** không personal-private.
- Debounce search; abort in-flight (13.5). Pagination cursor: thường **không** trong URL cho infinite grid; page index **có** cho table phân trang.

**Virtualization**

- Table: TanStack Virtual / `vue-virtual-scroller`. Chart: đừng vẽ 100k điểm — downsample trong BFF.
- Đo số DOM node. Để ý INP: virtualization + cell nặng (sparkline) vẫn jank.

**Permission**

- Role từ session; **BFF lột field** (email, cost). FE ẩn cột vì UX, không bao giờ như security.
- Widget catalog: user không xem billing thì BFF không trả billing, route không được register.
- Audit: export đi qua endpoint có log.

**Realtime**

- Default: poll 30s + ETag, hoặc SSE cho “job xong / count badge.”
- WS nếu nhiều người edit ops queue. Identity trên event; reconnect với cursor (13.1).

**Failure isolation**

- Error boundary **mỗi widget** (19.2). Header dashboard vẫn chạy.
- Timeout mỗi widget; hiện last good data + marker stale.

**Delivery**

- Đã auth, không CDN cho JSON. Bundle: split chart vendor (12.3). Flag cho widget mới.

**Tradeoff**

- Một DTO BFF béo vs gọi widget song song với budget timeout gateway.
- URL cho mọi filter vs saved view như server resource (URL giữ `?view=id`).

**Gotcha production**

- Timezone trong filter (`Z` vs local).
- Thao tác “select all 40k hàng.”
- Memory leak trong chart lib lúc widget unmount.

**Câu hỏi nối**

- Export CSV tập đã filter thế nào? (server-side, cùng query, không phải DOM)
- Mobile? (thường surface khác, giảm)

---

### 16.5. Ví dụ: Thiết kế hybrid marketing + app traffic cao

**Họ thực sự hỏi gì**

“Có marketing site và product đã login. Một codebase hay hai? Nuxt hay Next?”

**Cách senior trả lời**

- **Quyết định:** **Một app Nuxt (hoặc Next) với hybrid route rules**, một design system, hai **runtime profile**: content public ở **edge/CDN** (SSG/ISR/SSR cache cao), app sau auth là **CSR/SSR-with-no-store**. Cùng repo, cùng token, **caching và auth khác**. Tách hai deploy chỉ khi org/lịch release đòi — không vì folder cảm giác khác.
- **Ràng buộc:** Marketing quan tâm **CWV, SEO, OG, i18n, peak traffic (campaign)**. App quan tâm **auth, correctness, INP**. Một `Cache-Control` global sẽ hoặc **leak personalization** hoặc **giết performance SEO**.
- **Failure mode:** SSR cả app đã login mỗi request lúc Super Bowl ad; cache HTML có tên user đã login; SPA cho blog (zero SEO); load `echarts` trên `/`; preview CMS draft công khai; cookie trên `.com` phá cache.
- **Đo:** LCP/INP trên `/` từ RUM (không chỉ Lighthouse), TTFB cache hit ratio, CPU origin lúc campaign, auth error rate, crawl success, bundle của `/` vs `/app`.

**Làm rõ**

Traffic campaign gấp mấy? CMS? Personalization trên homepage (“Hi Ada”)? Region/language? App trên subdomain `app.` vs `/app`?

**Hộp**

```
CDN (HTML cache keyed by path + locale, NOT cookie)
  ├─ /          ISR/SSG  (CMS)     — long cache, purge on publish
  ├─ /pricing   SSR/ISR            — A/B via edge bucket cookie carefully
  ├─ /blog/:id  ISR + OG
  └─ /app/**    no-store HTML      — shell + client app, BFF /api
Auth cookies: host-only on app host, or path-scoped — never cacheable pages
```

**Nuxt vs Next (nói cả hai, chọn theo team)**

- **Nuxt:** team Vue, `routeRules` (`isr`, `ssr: false` cho `/app/**`), Nitro BFF, payload `useAsyncData`. Tự nhiên nếu product là Vue.
- **Next:** team React, App Router: RSC cho content, client component cho app, `revalidateTag` lúc CMS publish. Cùng hybrid.
- Đừng chạy **hai framework** trừ khi hai org đã tồn tại. Token + DS vẫn share được.

**Auth và caching**

- Homepage ẩn danh: **không user cookie trên request** nếu muốn CDN hit. Personalization qua **edge fragment** hoặc client sau paint (“hydrate name”).
- Login: bounce sang origin `/app`. Session cookie `Secure; HttpOnly; SameSite=Lax`.
- CMS preview: route đã auth, `noindex`, không CDN.

**Asset**

- JS marketing: nhỏ. Split app chunk để `/` không tải dashboard (12.3).
- Image: Nuxt Image / CDN, size tường minh (CLS).

**Realtime / BFF**

- Marketing: không. App: như 16.4 / 13.1.
- Form (lead gen): POST tới BFF, idempotency, bot protection — UX vẫn do FE sở hữu.

**Flag**

- Campaign kill switch ở edge. Đừng chờ full rebuild nếu copy legal sai — CMS + purge.

**Tradeoff**

- Subdomain (`app.`) vs path (`/app`): subdomain đơn giản hóa **cách ly cookie/cache**; path đơn giản hóa absolute link và một CSP origin. Senior chọn isolation khi incident cache làm họ sợ.
- ISR 30s vs on-demand purge: purge lúc publish tốt hơn; TTL là lưới an toàn.

**Gotcha production**

- `Vary: Cookie` trên `/` → cache hit ratio ~0.
- OG image generate mỗi request làm chảy origin.
- i18n URL duplicate không canonical.
- App navigation dùng marketing layout (script analytics nặng trên mọi route `/app`).

**Câu hỏi nối**

- A/B hero mà không nổ cache thế nào? (edge bucket, `Vary` trên **một** cookie bucketing, hoặc experiment chỉ client cho element không SEO)
- Rollback CMS publish xấu thế nào? (revision content trước + purge tag)

---

[← Back to Overview](../../README.md)
