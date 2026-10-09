# Next.js

Bạn đã biết Nuxt. File này là **cầu nối Nuxt → Next App Router** cộng với **phán đoán senior React/Next** mà interviewer thực sự chấm: `'use client'` thuộc về đâu, **caching** làm gì trên *major version này*, vì sao middleware không phải authorization, và Server Actions fail production thế nào. Caching là **footgun #1 của Next** — default đã lật qua các version, nên senior gọi tên version, nói *ý định* (static vs dynamic vs tagged), và **đối chiếu docs** thay vì thuộc folklore. Trả lời **quyết định → ràng buộc → failure mode → cách đo**.

---

## Table of Contents

1. [Next.js là gì?](#211-nextjs-là-gì)

2. [Next.js vs React](#212-nextjs-vs-react)

3. [Bản đồ tư duy Nuxt ↔ Next](#213-bản-đồ-tư-duy-nuxt--next)

4. [CSR vs SSR vs SSG vs SPA (và RSC)](#214-csr-vs-ssr-vs-ssg-vs-spa-và-rsc)

5. [Nền tảng App Router](#215-nền-tảng-app-router)

6. [Pattern fetch dữ liệu](#216-pattern-fetch-dữ-liệu)

7. [Routing, layout, navigation](#217-routing-layout-navigation)

8. [Middleware](#218-middleware)

9. [Server Actions & mutation](#219-server-actions--mutation)

10. [Cheat sheet render & cache](#2110-cheat-sheet-render--cache)

11. [Khi nào chọn Next vs SPA React](#2111-khi-nào-chọn-next-vs-spa-react)

12. [Lỗi production thường gặp](#2112-lỗi-production-thường-gặp)

---

## 21. Next.js

### 21.1. Next.js là gì?

**Họ thực sự hỏi gì**

- “Next cho cái gì mà React không có?”
- “App Router hay Pages Router năm 2026?”

**Cách senior trả lời**

**Quyết định.** Next.js là **production framework trên React**: file routing, chế độ render, convention data/cache, Server Component, Route Handler, Server Action, và adapter deploy. React là thư viện UI. Bạn chọn Next khi muốn **server nằm trong cùng app** (HTML, cache, mutation, image) với convention — cùng lý do bạn chọn Nuxt thay vì Vue SPA trần.

**Ràng buộc.** Thanh phỏng vấn là **App Router** (`app/`). Pages Router là bảo trì legacy. Feature quan trọng vòng senior: **RSC mặc định**, streaming, caching (theo version), middleware trên Edge, Server Actions. Vercel là host tham chiếu, không phải host duy nhất (Node/Docker/adapter).

**Failure mode.** Mô tả Next là “SSR cho React” (quá hẹp) hoặc “một host” (quá vendor). Ship pattern Pages Router (`getServerSideProps`) như thể chúng là App Router.

**Cách đo.** Với một URL: cái gì chạy trên server vs cái gì ship JS client; cái gì bị cache; cookie nào khiến nó dynamic.

**Tradeoff**

Tốc độ convention vs coupling framework (semantics cache, đau upgrade). Senior Nuxt đã đánh đổi kiểu này.

**Gotcha production**

- `pages/` và `app/` có thể sống chung lúc migrate — biết URL nào thắng.
- Helper image/font/script chỉ thắng thật nếu dùng đúng (`next/image` domain, sizes, CLS).

**Câu hỏi nối**

- Vẽ request: middleware → layout(s) RSC → page RSC → client island hydrate.

---

### 21.2. Next.js vs React

**Họ thực sự hỏi gì**

- “Chỉ Vite + React được không?”
- “Next có phải full-stack không?”

**Cách senior trả lời**

**Quyết định.** React (Vite SPA) là **client runtime + API riêng**. Next là **React + server rendering/RSC + routing + backend tùy chọn trong repo**. *Khả năng* full-stack không phải lệnh nhét domain vào `app/api`.

**Ràng buộc.** Thứ gì import vào Client Component **ship xuống browser** (trừ dead-code compiler). Next không magically giữ secret nếu bạn đưa chúng qua biên RSC hoặc import module server vào file `'use client'`.

**Failure mode.** “Next chậm hơn Vite” mà không nói *metric nào* (dev boot, TTFB, TTI). Bọc app `'use client'` cho “cảm giác Vite” — bạn trả giá phức tạp Next rồi giữ cost SPA.

**Cách đo.** JS ship cho route (RSC phải làm mỏng). TTFB cho first content. Dashboard auth: time-to-interactive vs SEO (thường SEO không liên quan — §21.11).

| Feature | React (SPA / Vite) | Next.js App Router |
|---|---|---|
| Routing | `react-router` (bạn own) | File-based `app/` |
| Render mặc định | CSR | RSC + SSR/SSG/PPR tùy chọn |
| SEO | Làm thêm | HTML server mặc định |
| Data | Query / effect | Server `fetch` + cache model + Query client |
| Backend | Tách riêng | Route Handler / Server Action (tùy chọn) |
| Guard | Client wrapper / loader | Middleware (Edge) + `redirect` server |

**Tradeoff**

Next: first content tốt hơn và data nằm cạnh UI; tệ hơn “tôi chỉ muốn dashboard nói chuyện với API sẵn” trừ khi kỷ luật client leaf.

**Gotcha production**

- Route Handler là HTTP surface — cần cùng authz như mọi API.
- Mental model SPA + cache Next = page cá nhân hóa stale (xem §21.10).

**Câu hỏi nối**

- Cùng bảng Vue vs Nuxt. Nếu họ biết Nuxt, dùng §21.3.

---

### 21.3. Bản đồ tư duy Nuxt ↔ Next

**Họ thực sự hỏi gì**

- “Nuxt equivalent của X là gì?”
- “`useFetch` để đâu?”

**Cách senior trả lời**

**Quyết định.** Map folder, rồi map **runtime mặc định của component**. Nuxt: Vue component, SSR data qua `useAsyncData` / `useFetch`. Next App Router: **Server Component mặc định**; interactivity là `'use client'` **lá** tường minh.

**Ràng buộc.** `'use client'` là **biên module**, không phải annotation “function này là client”. File đó và import của nó vào client graph (bạn vẫn **compose** Server children như `children` từ server parent — bạn **không** import Server Component vào client module).

**Failure mode.** Đánh `'use client'` lên `page.tsx` để `useState` — dependency graph cả page thường đi theo. Với tới `useEffect` fetch vì không có `useAsyncData`.

**Cách đo.** Next bundle analyzer / “Client component boundary” trong DevTools: page là lá hay gốc một lục địa client?

| Nuxt | Next.js (App Router) |
|---|---|
| `pages/` | `app/**/page.tsx` |
| `layouts/` | `layout.tsx` lồng nhau |
| `middleware/` | `middleware.ts` (**Edge**, semantics khác) |
| `server/api` | `app/api/**/route.ts` |
| `useFetch` / `useAsyncData` | `await` trong Server Component; Query client nếu live |
| `refreshNuxtData` | `revalidatePath` / `revalidateTag` |
| `definePageMeta` | convention segment / `export const dynamic` / cache API |
| Nitro presets | Next runtime (Node/Edge) + adapter host |
| `.client` / `.server` | biên `'use client'`; import `server-only` |
| Nuxt modules | `next/image`, package community — ít “module magic” hơn |

**Tradeoff**

Nuxt giấu SSR data trong composable chạy được cả hai phía. Next **tách thế giới** — tách đó là việc của bạn.

**Gotcha production**

- Nuxt middleware chạy theo mental model **navigation** (SSR + client). Next middleware chạy **trên Edge trước response** — không có cây Vue/React, không Node API trừ khi version/runtime nói vậy.
- `useState` Nuxt (state share thân thiện SSR) **không** phải React `useState`. Đừng invent clone Pinia phía client cho session — cookie/server session trước ([state-management-react.md](./state-management-react.md)).

**Câu hỏi nối**

- “Cho xem modal có `useState`.” — **lá** client, page vẫn server, modal truyền như child hoặc import chỉ trong client wrapper nhỏ.

---

### 21.4. CSR vs SSR vs SSG vs SPA (và RSC)

**Họ thực sự hỏi gì**

- “ISR vs SSR vs SSG — khi nào?”
- “PPR / partial là gì?”
- “RSC có phải SSR không?”

**Cách senior trả lời**

**Quyết định.** Chọn theo **độ tươi, personalization, và ai được thấy data**:

| Mode | Khi | Ràng buộc |
|---|---|---|
| **SSG** | Marketing, docs, ít đổi | Stale đến khi rebuild |
| **ISR / revalidate theo thời gian hoặc tag** | Catalog sản phẩm, trang CMS | Cửa sổ stale / bug invalidation |
| **SSR (dynamic)** | Theo request, cá nhân hóa, sau cookie | Cost server, TTFB, cache *không được* lưu HTML user dưới public key |
| **CSR / SPA island** | Dashboard tương tác mạnh, không SEO | First content yếu hơn; bạn own câu chuyện loading |
| **RSC** | Composition mặc định: data + UI trên server, **không ship JS component** xuống client cho node đó | Không interactive; bản thân không phải chiến lược cache |
| **PPR / partial** | **Awareness:** shell tĩnh + lỗ dynamic stream vào | API/tên đã dời (experimental → Cache Components / partial prerender). Nói “static shell, dynamic holes,” rồi đối chiếu docs hiện tại |

**Ràng buộc.** RSC tham gia được route **static hoặc dynamic**. RSC ≠ “luôn SSR.” Server Component trên route fully static gần **SSG một cây React không hydrate những node đó**. Hydration dành cho Client Component.

**Failure mode.** Gọi mọi thứ là “SSR.” Cache một page đã gọi `cookies()` rồi leak HTML của một user. Coi PPR là buzzword mà không có hình **shell vs hole**.

**Cách đo.** `x-nextjs-cache` / cache header của host (tên đổi). URL đã login: HTML `Cache-Control` có private/no-store? URL sản phẩm: tag invalidation có thực sự drop trang CDN?

**Cầu nối Vue / Nuxt**

Cùng menu CSR/SSR/SSG của Nuxt. Nuxt `swr` / `isr` nitro presets ≈ ISR. RSC **không có twin Nuxt 3 trung thực** — gần nhất là “composable data chỉ-server + client mỏng hơn,” không phải “component không bao giờ ship.”

**Tradeoff**

Static rẻ và cache được; personalization đục một lỗ. PPR cố lấy **cả hai** (shell từ CDN, hole từ server). Complexity là giá.

**Gotcha production**

- ISR + on-demand revalidate: quên `revalidateTag` sau CMS webhook → khách thấy giá hôm qua.
- Navigation SPA trong Next vẫn dùng **client router cache** — back-button có thể hiện snapshot client stale dù server cache ổn (phụ thuộc version; biết nó tồn tại).

**Câu hỏi nối**

- Chi tiết cache: §21.10.
- “Sao page ‘static’ của tôi thành dynamic?” — `cookies()`, `headers()`, `searchParams`, fetch không cache, `connection()` / `noStore` — §21.10 / §21.12.

---

### 21.5. Nền tảng App Router

**Họ thực sự hỏi gì**

- “`'use client'` để đâu?”
- “Sao không truyền function prop từ Server Component?”
- “Client Component import Server Component được không?”

**Cách senior trả lời**

**Quyết định.** `app/` là **layout + page + loading/error/not-found** lồng nhau. **Server Component là mặc định.** Đẩy `'use client'` xuống **lá** (button, chart, form cần hook hoặc browser API). Giữ `layout.tsx` / `page.tsx` server trừ khi *cả* bề mặt là client app (thường là mùi — §21.11).

**Ràng buộc.** Props vượt biên **RSC → client** phải **serialize được** (data thuần protocol Flight gửi được). **Không** class instance, function (trừ **Server Action**), `Map`/`Set` trừ khi version của bạn nói rõ hỗ trợ — coi type lạ là không an toàn đến khi docs nói khác. Client Component **không import** Server Component. Chúng **có thể render** `children` mà server đã truyền — đó là pattern composition.

**Failure mode.** `'use client'` ở root page. Truyền function `onClick` từ server page xuống client child (không phải action). Import module `db` vào file client. Spread Prisma model / `Decimal` qua biên.

**Cách đo.** Bundle: `page.js` client chunk có nổ sau một directive? Runtime: “Event handlers cannot be passed…” / lỗi serialize trên server log.

```text
app/
  layout.tsx          # server chrome (keep it server)
  page.tsx            # server: fetch + compose
  blog/[slug]/page.tsx
  api/health/route.ts
```

```tsx
// leaf — the directive stays here, not on page.tsx
'use client'
export function LikeButton({ id }: { id: string }) { /* useState, fetch action */ }
```

**Tradeoff**

Nhiều file (island client nhỏ) vs một lục địa client. Island thắng bundle và secret.

**Gotcha production**

- `'use client'` là **opt-in vào client bundle cho module graph đó**, không phải “một function này.”
- `components/Button.tsx` share không directive có thể import từ cả hai phía; thêm `'use client'` chỉ khi cần hook. Server parent import client Button thì ổn; Button thành client island.
- Đừng truyền `children` qua quá nhiều client wrapper đến mức vô tình tạo lại một client page.

**Câu hỏi nối**

- Secret leak qua props: §21.12.
- Server Action là “function hợp pháp xuyên biên”: §21.9.

---

### 21.6. Pattern fetch dữ liệu

**Họ thực sự hỏi gì**

- “Fetch ở đâu trong App Router?”
- “`useEffect` vs server `fetch` vs Query?”
- “`cookies()` làm gì với caching?”

**Cách senior trả lời**

**Quyết định.**

1. **Default:** `await` trong Server Component (hoặc function data chỉ-server). Colocate với UI cần nó; parallelize các await độc lập (`Promise.all`).
2. **Live client cache** (search-as-you-type, mutation share giữa island, polling): **TanStack Query / SWR** trong Client leaf.
3. **Effect fetch:** phương án cuối (xem [react.md §20.1.12](./react.md#20112-khi-nào-fetch-data)).

**Ràng buộc.** Trong App Router, `fetch` bị **instrument**. Semantics **đổi qua major version** (Next 14: nhiều `fetch` cache mặc định; Next 15+: default `fetch` nghiêng **no cache**; dòng sau đẩy `use cache` / Cache Components **tường minh**). Câu phỏng vấn: *“Tôi set cache policy có chủ đích cho data này, và đọc lại docs đúng major Next của team.”*

`cookies()`, `headers()`, `searchParams` (và API như `connection()` / `noStore` tùy version) **opt route vào dynamic** — cá nhân hóa, không phải trang CDN tĩnh. Đó là feature cho HTML session và footgun cho product listing bạn định ISR.

**Failure mode.** `await getA(); await getB()` tuần tự khi chúng độc lập → **server waterfall**. Client waterfall: server page không data, mọi widget fetch lúc mount. `cache: 'force-cache'` trên endpoint theo user. Quên rằng một `cookies()` trong `layout.tsx` share có thể dynamize **mọi thứ bên dưới**.

**Cách đo.** Trace timeline server (Next / OpenTelemetry). Network: một HTML có data vs 12 GET client. Xác nhận cache header có đúng mode bạn gọi tên.

```tsx
// Version-sensitive: always pair fetch with an explicit policy
const res = await fetch(url, { next: { revalidate: 60, tags: ['product'] } })
// or: cache: 'no-store' when it must be per-request

// Dynamic opt-in — do this in the *leaf* that needs the session, not the root layout
import { cookies } from 'next/headers'
const session = (await cookies()).get('session')?.value
```

**Cầu nối Nuxt**

| Nuxt | Next |
|---|---|
| `useAsyncData` trên server | `await` trong Server Component |
| `useFetch` | server `fetch` hoặc Query client |
| `refreshNuxtData` | `revalidatePath` / `revalidateTag` |
| keyed cache | `tags` / `queryKey` |

**Tradeoff**

Server fetch: client mỏng hơn, secret ở lại, khó share live state. Query: UX và dedupe, thêm JS, hydrate dehydrated state nếu bạn truyền initial data.

**Gotcha production**

- Request memoization: cùng URL `fetch` trong một RSC request bị dedupe — tốt; đừng invent cache thứ hai tình cờ.
- `POST` / non-GET không phải búa ISR của bạn.
- Đưa server data vào Query `initialData` không khớp `queryKey` → client stale mãi.

**Câu hỏi nối**

- Cheat sheet: §21.10.
- Waterfall vs `Promise.all`: §21.12.

---

### 21.7. Routing, layout, navigation

**Họ thực sự hỏi gì**

- “Nested layout hoạt động thế nào?”
- “`loading.tsx` vs `<Suspense>`?”
- “Client navigation vs full reload?”

**Cách senior trả lời**

**Quyết định.** Folder là URL segment. `layout.tsx` **bọc** children và **không remount** khi navigate trong segment đó (state trong client layout **sống sót** — đừng để wizard one-shot ở đó trừ khi cố ý). `page.tsx` là lá. `loading.tsx` là **Suspense fallback mức route** cho segment đó. `error.tsx` là **Error Boundary mức route** (Client Component). Navigation: `<Link>` / `useRouter` từ `next/navigation` (không phải `next/router` — cái đó là Pages).

**Ràng buộc.** Dynamic segment: `[id]`, catch-all `[...slug]`, optional `[[...slug]]`. `searchParams` / `params` là async ở App Router hiện đại (`await params`) — ví dụ cũ là sync; **khớp version của bạn**.

**Failure mode.** Nhét chrome chỉ-auth vào root layout mà mọi trang marketing inherit. Client `useRouter().push` trong effect làm redirect giả (waterfall + flash) thay vì `redirect()` server. Dùng `<a>` cho route nội bộ (full reload, mất prefetch).

**Cách đo.** Persistence state layout: gõ ô search client share, navigate sibling page, text còn không? Prefetch: hover `Link`, RSC payload có load không?

**Cầu nối Nuxt**

`layout.tsx` lồng ≈ nested layout Nuxt. `loading.tsx` ≈ Nuxt `loadingIndicator` / Suspense quanh page, nhưng **theo segment**. `definePageMeta({ layout })` được thay bằng **cấu trúc folder** — dời file **chính là** API.

**Tradeoff**

Cây URL khó đổi vs graph React Router tường minh. Prefetch gần như miễn phí trên desktop và đắt trên mobile data — biết `prefetch={false}`.

**Gotcha production**

- Root `loading.tsx` thay **cả** shell kể cả nav — user tưởng app crash. Giữ chrome trong `layout`, suspense **lỗ page**.
- `error.tsx` phải là Client Component; nó vẫn không bắt lỗi event handler ([react.md §20.2.4](./react.md#2024-error-boundaries)).
- Parallel / intercepting routes (`@slot`, `(.)`) — **awareness** phỏng vấn cho modal-as-URL; dễ lạm dụng.

**Câu hỏi nối**

- Middleware matcher vs `redirect()` mức layout: §21.8.
- Lệch hydration từ `Date` trong layout: §21.12.

---

### 21.8. Middleware

**Họ thực sự hỏi gì**

- “Auth-gate App Router thế nào?”
- “Next middleware có giống Nuxt middleware không?”
- “Sao bị redirect loop?”

**Cách senior trả lời**

**Quyết định.** `middleware.ts` chạy trên **Edge trước** HTML RSC/SSR. Dùng như **cổng mỏng**: cookie *có mặt*, prefix locale, geo, rewrite A/B, header nhẹ. Analog Nuxt gần nhất là **route middleware + một phần server middleware**, nhưng runtime **không** phải Node app của bạn và **không** phải cây React.

**Ràng buộc.** **Không phải authorization.** Middleware thấy cookie **tồn tại**; nó không nên là check duy nhất rằng session còn valid, chưa revoke, và được `DELETE /api/users`. Authz thật: Server Component / Route Handler / Server Action đối chiếu session store. Giữ Edge bundle **nhỏ** (không ORM, không lib JWT khổng lồ nếu tránh được). `matcher` là config production — matcher sai **bỏ sót** cổng hoặc **chạy** trên mọi static asset.

**Failure mode.** DB trong middleware. Secret nướng vào Edge bundle. Matcher miss `/admin` vs `/admin/users`. Loop redirect `/login` ↔ `/app`. Dùng middleware “giấu” page RSC vẫn còn Route Handler public.

**Cách đo.** curl HTML **không** JS: có 307 về login? curl API với cookie rác: vẫn 200? Log Edge CPU/duration — middleware trên `_next/static` là outage tự gây.

```ts
export const config = {
  matcher: ['/admin/:path*', '/app/:path*', '/login'],
}
// Pitfall: forgetting :path* → /admin/users never matches
// Pitfall: matcher too broad → Edge runs on every image
```

Phác thảo redirect loop: `isProtected && !token → /login` **và** `isAuthPage && token → /app` ổn **cho đến khi** “token” là **cookie stale** mà login luôn set, hoặc `/login` vô tình nằm trong `isProtected`.

**Nên / không nên**

| Nên | Không nên |
|---|---|
| Cookie presence → redirect/rewrite | Coi như RBAC |
| Locale, geo, rewrite feature flag | ORM / CPU nặng |
| `matcher` chặt | Chạy trên `_next/static`, image |
| Truyền header xuống nếu cần | Nhét secret sống lâu vào bundle middleware |

**So với Nuxt / React SPA**

| | Nuxt `middleware/` | Next `middleware.ts` | React SPA guard |
|---|---|---|---|
| Runtime | SSR + client nav | **Edge** trước body | Sau JS (hydrate) |
| Input | `to` / `from` | `NextRequest` (URL, cookie, header) | location + client session |
| Output | `navigateTo` | `NextResponse` redirect/rewrite/next | `<Navigate />` / loader `redirect` |
| Security | vẫn chưa đủ | vẫn chưa đủ | chỉ UX |

**Interview one-liner:** Next middleware = **cổng cookie Edge trước HTML**; Nuxt middleware = **cổng navigation biết SSR**; SPA guard = **sau hydrate**. Authorization vẫn sống trên server đọc session.

**Tradeoff**

Redirect sớm cải UX (không flash admin) và leak ít HTML hơn. Nó không thay check server và có thể DDoS chính mình bằng matcher tham.

**Gotcha production**

- `NextResponse.next()` vs `rewrite` vs `redirect` — rewrite giữ URL, dễ nhầm với auth.
- Routing i18n + matcher = lệch locale (`/en/login`).
- Middleware + CDN: biết **redirect** có bị cache không.

**Câu hỏi nối**

- SPA `RequireAuth`: [react.md §20.2.9](./react.md#2029-route-guards--middleware-spa).
- Session là cookie, không Zustand: [state-management-react.md](./state-management-react.md) §22.6.

---

### 21.9. Server Actions & mutation

**Họ thực sự hỏi gì**

- “`'use server'` là gì?”
- “Server Action có an toàn không? CSRF?”
- “Refresh data sau POST thế nào?”

**Cách senior trả lời**

**Quyết định.** Server Action là **RPC từ form/button tới server function** không cần viết tay Route Handler cho mọi mutation. Chúng là **public entry point** (client gọi được thứ bạn export). Coi như POST endpoint: **authenticate, authorize, validate, rồi mutate, rồi revalidate**.

**Ràng buộc.**

- Validation: schema (Zod) trên **server**. Không tin `FormData`.
- Authz: session từ cookie **bên trong action**, không phải “page đã nằm sau middleware.”
- Cache: `revalidatePath` / `revalidateTag` (và/hoặc Query `invalidateQueries` phía client).
- Progressive enhancement: `<form action={createItem}>` nên chạy **không cần** JS khi UX cho phép.
- Origin: Next làm **check origin / host kiểu CSRF** trên action — biết chúng tồn tại, đừng tạo cảm giác an toàn giả, vẫn cần **cookie same-site + authz**.
- Argument serialize được; upload file có giới hạn size/runtime.

**Failure mode.** Action `db.item.create` không session. Revalidate sai path (`/` vs `/products/[id]`). `onClick` fetch chỉ-client bỏ qua validation của action. Trả internal error về client.

**Cách đo.** POST không auth tới action (POST URL của framework) → 401/redirect, không phải ghi. Sau write thành công, **view kế** (RSC payload hoặc Query) hiện data mới — nếu không, bạn sót revalidation.

```tsx
'use server'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

const Input = z.object({ title: z.string().min(1).max(200) })

export async function createItem(formData: FormData) {
  const session = await getSession() // cookies()
  if (!session) throw new Error('Unauthorized') // or redirect('/login')
  if (!can(session, 'item:create')) throw new Error('Forbidden')

  const parsed = Input.safeParse({ title: formData.get('title') })
  if (!parsed.success) return { ok: false as const, error: 'Invalid title' }

  await db.item.create({ data: { title: parsed.data.title, userId: session.id } })
  revalidateTag('items')
  return { ok: true as const }
}
```

**Cầu nối Nuxt**

Tinh thần `server/api` + form action / `useFetch` POST, bind UI chặt hơn. Vẫn không “bỏ validation vì đây là function, không phải HTTP.”

**Tradeoff**

Ít file API hơn, khó nhìn HTTP surface (security review bỏ sót). Route Handler tốt hơn cho **webhook public / client không-Next**. Action tốt hơn cho **form first-party**.

**Gotcha production**

- Mọi async function export từ file `'use server'` đều gọi được — đừng export helper cạnh action.
- `revalidatePath('/blog/[slug]')` không phải wildcard mọi post — dùng **tags**.
- `useOptimistic` không có source of truth server → hàng optimistic kẹt khi fail.
- Truyền cả `process.env` trong return của action “để debug” → leak client.

**Câu hỏi nối**

- `useActionState` / `useFormStatus` cho pending/error.
- Khi nào vẫn viết `route.ts` (webhook, POST bên thứ ba, upload stream).

---

### 21.10. Cheat sheet render & cache

**Họ thực sự hỏi gì**

- “Giải thích các cache của Next.”
- “`revalidate` vs `no-store` vs cookie.”
- “Sao page này stale / sao nó luôn dynamic?”

**Cách senior trả lời**

**Quyết định.** Nói theo **tầng**, rồi thừa nhận **tên và default dời giữa các major**. Mental model an toàn 2024–2026:

| Tầng | Vai trò |
|---|---|
| **Request memoization** | Dedupe `fetch` giống nhau trong **một** server render |
| **Data cache** | Persist `fetch` / cached function giữa các request (thời gian hoặc tag) |
| **Full route cache** | **RSC/HTML** đã cache cho route static/ISR |
| **Client router cache** | Back/forward / prefetch trên **browser** |

Ý định vs núm (đối chiếu **version Next của bạn**):

| Mục tiêu | Núm điển hình |
|---|---|
| CDN-static | không `cookies()`/`headers()`, fetch cache được, hoặc `use cache` / force-static tường minh |
| Tươi mỗi request | `no-store` / `dynamic = 'force-dynamic'` / đọc `cookies()` / `connection()` |
| Phần lớn tĩnh, cập nhật lúc ghi | `revalidate: n` **hoặc** `tags` + `revalidateTag` từ action/webhook |
| Shell cá nhân hóa | PPR/partial: chrome tĩnh, lỗ dynamic đọc cookie |
| JS mỏng hơn | nhiều Server Component, `'use client'` chỉ ở lá |

**Ràng buộc.** **Đọc cookie/header là opt-in dynamic.** Nhét `cookies()` vào root layout để “lấy theme” có thể tắt static render cho **cả app**. Cache key bỏ qua user trên fetch cá nhân hóa là **bug security**, không phải thắng perf.

**Failure mode.** Folklore: “fetch luôn cache” hoặc “fetch không bao giờ cache” mà không nêu version. Page ISR đọc `cookies()` rồi lặng lẽ thành dynamic. Tag không bao giờ emit trên `fetch`, nên `revalidateTag` là no-op.

**Cách đo.** Một URL, trên prod: header cache HIT/MISS, HTML có chuỗi riêng user không, webhook có thực sự nhúc nhích kim. Trong phỏng vấn, nói *cách* bạn sẽ nhìn, không bịa default.

**Cảnh báo senior.** Cache Next là chủ đề mà câu trả lời sai tự tin ship incident. **Gọi tên major. Đối chiếu docs. Ưu tiên policy tường minh trên mọi fetch / cached function.**

**Tradeoff**

Cache ngầm (App Router cũ) thần kỳ và thù địch. `use cache` / tags tường minh dài dòng hơn và review được. Revalidate theo thời gian dễ và sai với tiền/tồn kho; **tag on-demand** mới là mode người lớn.

**Gotcha production**

- Draft mode / preview cookie đục lỗ bạn quên đóng.
- Multi-region: lag revalidation theo tag.
- API `unstable_*` trong blog post cũ — đừng trích như hiện hành.

**Câu hỏi nối**

- Walk trang product: SSG + `tags: ['product', id]` + CMS webhook `revalidateTag`.
- Walk trang account: `cookies()` + no-store + không bao giờ CDN-cache HTML.

---

### 21.11. Khi nào chọn Next vs SPA React

**Họ thực sự hỏi gì**

- “Dashboard đã auth — Next hay Vite?”
- “Migrate từ Nuxt/Vue?”

**Cách senior trả lời**

**Quyết định.**

**Chọn Next khi** SEO/social preview quan trọng, bạn muốn **data server cạnh UI**, hybrid rendering, streaming, hoặc một bề mặt full-stack deploy được. Marketing + app một repo với **cookie session server** là fit Next tốt.

**Chọn Vite + React SPA khi** đây là **dashboard auth** sau login, SEO không liên quan, **API gateway chín** đã có, và team muốn Client Component không đánh RSC/cache. Đó là lựa chọn senior chính đáng, không phải trốn.

**Ràng buộc.** “Đã trên Vercel / thích `next/image`” không phải yêu cầu sản phẩm. Next như **SPA hosted** (`'use client'` mọi page) thường là **tệ nhất cả hai thế giới** — trừ khi đang giữa migrate và nói thẳng.

**Failure mode.** Viết lại Vue admin kín thành App Router rồi mất cả quý cho hydration và cache. Hoặc ngược lại: site content public là Vite SPA rồi sau đó gắn SSR.

**Cách đo.** Traffic cần crawler / OG image. % route cá nhân hóa. API sẵn vs muốn colocate mutation.

**Song song Nuxt**

Cùng quyết định **Nuxt vs Vue SPA thuần**. Nếu bạn đã không dùng Nuxt, đừng dùng Next vì áp lực résumé.

**Tradeoff**

| | Next | Vite SPA |
|---|---|---|
| First content / SEO | Thắng | Thua trừ khi thêm renderer |
| DX dashboard auth | Footgun cache/RSC | Query + router đơn giản |
| Mutation | Server Action colocate | API của bạn đã có |
| Hiring | Cần skill RSC | Skill React SPA rộng hơn |

**Gotcha production**

- Hybrid: Next cho marketing public, SPA cho app, **hai** cookie auth / CORS — kiến trúc thật, không phải tai nạn.
- Đừng “chỉ thêm middleware” vào Vite app; đó là lúc Next bắt đầu đáng giá.

**Câu hỏi nối**

- Các tầng state sau khi chọn Next: [state-management-react.md](./state-management-react.md).
- Auth: cookie là source of truth, không phải user Zustand đã hydrate (§22.6).

---

### 21.12. Lỗi production thường gặp

**Họ thực sự hỏi gì**

- “Bạn đã ship bug hydration chưa?”
- “Secret leak trong RSC thế nào?”
- “Sao TTFB 2s trên page ba fetch?”

**Cách senior trả lời**

**Quyết định.** Incident hiện trên on-call Next gom thành ba họ: **lệch hydration**, **data server vượt biên client**, **waterfall await**. Senior đã thấy cả ba và có fix mặc định.

**Ràng buộc.** HTML server phải **khớp text** với lần client render đầu của Client Component. Thứ bạn truyền vào Client Component nằm **trong RSC payload** (user đọc được). Data độc lập phải fetch **song song**.

**Failure mode.** Nhánh `typeof window` (so với `'undefined'`) để đọc `localStorage` lúc **render**. `new Date().toLocaleString()` trong layout share. Import `stripeSecret` server-only vào file sau này gắn `'use client'`. `const u = await getUser(); const o = await getOrders(u.id); const n = await getNotifs(u.id)` khi orders và notifs độc lập.

**Cách đo.** Overlay hydration / text “did not match”. View-source / Network RSC payload cho secret (Ctrl-F key). Trace server: await tuần tự vs `Promise.all`.

#### Hydration mismatch

Nguyên nhân: `Date.now()` / `Math.random()` / `toLocale*` (server UTC vs TZ user), `window` / `localStorage` trong render, HTML không hợp lệ (`<p><div>`), extension browser inject DOM, thứ tự class CSS-in-JS, `useId` lệch giữa các version.

Fix: **render pure**; format date với timezone tường minh hoặc chỉ trên client sau mount (`useEffect` / `suppressHydrationWarning` **chỉ** trên một text node buộc phải khác, ví dụ đồng hồ). Theme từ `localStorage`: inline script trong `layout` **trước** paint, hoặc class trên `<html>` từ cookie (cookie = server nhìn thấy).

```tsx
// Pitfall: server HTML "en-US 10/08" vs client "vi-VN 08/10"
<span>{createdAt.toLocaleDateString()}</span>
// Prefer a serialized ISO string + explicit locale, or a Client clock after mount
```

#### Leak secret server xuống client

Nguyên nhân: `NEXT_PUBLIC_*` trên secret thật; truyền `process.env` / token / URL nội bộ làm props Client Component; import module đọc secret vào graph `'use client'`; return quá nhiều từ Server Action; log PII user vào error boundary phía client.

Fix: `import 'server-only'` trên module secret (build fail nếu file client import chúng). Truyền **DTO tối thiểu** (`{ id, name }`, không phải hàng Prisma). Session ở **cookie httpOnly**, không dump store client. Review RSC Flight payload trên Network.

```ts
import 'server-only'
export const dbUrl = process.env.DATABASE_URL! // must never enter a client module
```

#### Waterfall các await

```tsx
// Pitfall: serial — getOrders did not need getNotifs to finish
const user = await getUser(id)          // necessary if others need user.id
const orders = await getOrders(user.id)
const notifs = await getNotifs(user.id)

// Fix independent work
const user = await getUser(id)
const [orders, notifs] = await Promise.all([
  getOrders(user.id),
  getNotifs(user.id),
])
```

Waterfall component: page await A, child Server Component await B không bắt đầu đến khi tree của A render. **Start** B ở parent (`Promise.all` / preload) hoặc dùng cache/dedupe `fetch` để hit của child miễn phí — đừng `await` mù ở mọi lá “vì RSC.” Waterfall client: RSC shell rỗng + năm `useEffect` fetch — bạn dùng Next như SPA.

**Tradeoff**

Fetch song song tốn concurrency origin hơn; vẫn hơn 3× TTFB. Hoãn lỗ không critical bằng Suspense (stream) thay vì chặn cả page.

**Gotcha production (lân cận)**

- `'use client'` trên page (graph secret + không lợi RSC).
- Props không serialize (function, class instance) — runtime error ở biên.
- Lỗ matcher middleware (§21.8).
- Folklore cache (§21.10).
- `searchParams` trên client page dùng làm check auth duy nhất.

**Câu hỏi nối (system design)**

1. Server vs Client: modal có `useState` sống ở đâu?
2. Cache/revalidate trang product + webhook tags.
3. Nuxt `useAsyncData` vs async Server Component — và khi nào Query vẫn thắng.
4. Middleware vs layout `redirect` vs SPA guard — ai là security.
5. Vẽ URL / cookie / RSC / Query / Zustand — [state-management-react.md](./state-management-react.md).

---

[← Back to Overview](../../README.md)
