# Next.js

Next.js — meta-framework trên React (App Router, SSR/SSG, RSC, deploy production). Viết cho senior đã quen **Nuxt**, kèm cầu nối Nuxt ↔ Next.

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

---

## 21. Next.js

### 21.1. Next.js là gì?

Next.js là **framework dựng trên React**, chuẩn hóa **routing, chế độ render, data fetching và deploy** cho app production.

**Điểm mạnh chính:**

- **File-based routing** với `app/` (App Router) hoặc `pages/` legacy.
- **SSR / SSG / ISR / streaming** sẵn.
- **React Server Components (RSC)** — compose UI phía server.
- **Route Handlers** API trong cùng project.
- Tối ưu **image / font / script**.
- Deploy tốt trên **Vercel** (vẫn self-host được).

**Tóm tắt:** _Next = React + Routing + Server rendering/RSC + Convention + Tooling production._

---

### 21.2. Next.js vs React

| Khía cạnh | React (SPA/Vite) | Next.js |
|---|---|---|
| **Routing** | Tự setup (`react-router`) | File-based (`app/`) |
| **Rendering** | CSR mặc định | SSR/SSG/RSC/hybrid |
| **SEO** | Phải làm thêm | HTML server mạnh hơn |
| **Data fetching** | Client lib / thủ công | Server fetch + cache model |
| **Cấu trúc** | Tự tổ chức | Opinionated |
| **Backend** | API riêng | Route Handlers / Server Actions |

**Tóm tắt:** React là thư viện UI; Next là full-stack React framework (giống Vue vs Nuxt).

---

### 21.3. Bản đồ tư duy Nuxt ↔ Next

| Nuxt | Next.js (App Router) |
|---|---|
| `pages/` | `app/**/page.tsx` |
| `layouts/` | `layout.tsx` lồng nhau |
| `middleware/` | `middleware.ts` |
| `server/api` | `app/api/**/route.ts` |
| `useFetch` / `useAsyncData` | `fetch` / `async` Server Component |
| `definePageMeta` | convention theo segment |
| Nitro presets | adapter Node / Edge |
| Modules (`@nuxt/image`) | `next/image`, package ecosystem |
| `.client` / `.server` | ranh giới `'use client'` |

**Đổi mindset lớn nhất với Vue/Nuxt senior:**

- Nuxt: “Vue component + SSR data tùy chọn”.
- Next App Router: **Server Component mặc định**; đánh dấu **`'use client'`** khi cần Hooks, browser API, hoặc tương tác.

---

### 21.4. CSR vs SSR vs SSG vs SPA (và RSC)

#### **1. CSR**

- Browser tải JS rồi render.
- **Ưu:** SPA tương tác mạnh.
- **Nhược:** SEO/TTFB yếu nếu không SSR.

#### **2. SSR**

- Server render HTML mỗi request, rồi hydrate.
- **Ưu:** SEO, nội dung động.
- **Nhược:** tốn tài nguyên server.

#### **3. SSG**

- HTML build sẵn, phục vụ CDN.
- **Ưu:** nhanh/rẻ.
- **Nhược:** data đổi nhiều phải rebuild/revalidate.

#### **4. ISR**

- Trang tĩnh nhưng revalidate theo thời gian/on-demand — nằm giữa SSG và SSR.

#### **5. SPA**

- Điều hướng client không reload full page (Next vẫn hỗ trợ qua client router).

#### **6. RSC – React Server Components**

- Component chạy trên server, **không ship toàn bộ code xuống client**.
- Tốt cho truy cập data + giảm bundle.
- Phần tương tác vẫn cần Client Component.

**Tóm tắt nhanh:** CSR/SPA cho island tương tác; SSR cho SEO động; SSG/ISR cho content; RSC cho compose server + JS client mỏng.

---

### 21.5. Nền tảng App Router

```text
app/
  layout.tsx
  page.tsx
  blog/
    page.tsx
    [slug]/page.tsx
  api/health/route.ts
```

#### **Server Component (mặc định)**

```tsx
async function PostsPage() {
  const posts = await getPosts()
  return <PostList posts={posts} />
}
```

#### **Client Component**

```tsx
'use client'

import { useState } from 'react'

export function LikeButton() {
  const [likes, setLikes] = useState(0)
  return <button onClick={() => setLikes((n) => n + 1)}>{likes}</button>
}
```

**Nguyên tắc:** đẩy `'use client'` xuống **lá** (button/form); giữ page/layout là Server Component khi có thể.

---

### 21.6. Pattern fetch dữ liệu

#### **Fetch trong Server Component**

```tsx
async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const res = await fetch(`https://api.example.com/products/${id}`, {
    next: { revalidate: 60 },
  })
  const product = await res.json()
  return <ProductView product={product} />
}
```

#### **Fetch phía client**

Khi phụ thuộc state browser. Ưu tiên **TanStack Query** hơn `useEffect` tự chế.

#### **Cầu nối Nuxt:**

| Nuxt | Next |
|---|---|
| `useAsyncData` | `await` trong Server Component |
| `useFetch` | server `fetch` hoặc client Query |
| `refreshNuxtData` | `revalidatePath` / `revalidateTag` |

---

### 21.7. Routing, layout, navigation

- `layout.tsx` lồng segment (giống nested layout Nuxt).
- `loading.tsx` / `error.tsx` theo segment.
- Điều hướng: `next/link`, `useRouter` từ `next/navigation`.

```tsx
import Link from 'next/link'
export function Nav() {
  return <Link href="/docs">Docs</Link>
}
```

Dynamic: `[id]`, `[...slug]`, `[[...slug]]`.

---

### 21.8. Middleware

**Senior-level Answer:**

Next.js Middleware chạy trên **Edge** **trước khi** request hoàn tất (trước RSC/SSR HTML). Dùng để rewrite, redirect, set cookie/header, gate auth theo cookie — map gần với **Nuxt route middleware** + một phần concern của Nitro server middleware.

File: `middleware.ts` (hoặc `src/middleware.ts`) ở root project.

#### **Ví dụ auth redirect**

```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value
  const { pathname } = request.nextUrl

  const isAuthPage = pathname.startsWith('/login')
  const isProtected = pathname.startsWith('/admin') || pathname.startsWith('/app')

  if (isProtected && !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/app', request.url))
  }

  const res = NextResponse.next()
  res.headers.set('x-pathname', pathname) // optional: truyền context xuống server
  return res
}

export const config = {
  matcher: ['/admin/:path*', '/app/:path*', '/login'],
}
```

#### **`matcher` — bắt buộc nghĩ trước khi ship**

- Middleware chạy trên Edge cho mọi path khớp matcher → **giữ mỏng**.
- Exclude static assets (`_next/static`, images) để khỏi tốn cold start / latency.
- Matcher sai = auth leak hoặc redirect loop.

#### **Nên / không nên**

| Nên | Không nên |
|---|---|
| Redirect/rewrite theo cookie | Query DB nặng / ORM |
| A/B flag, geo, locale prefix | Secret nặng trong bundle middleware |
| Set security headers nhẹ | Thay authorization API |
| Gate UX sớm | Logic phụ thuộc Node-only APIs |

#### **So với Nuxt / React SPA**

| | Nuxt `middleware/` | Next `middleware.ts` | React SPA guard |
|---|---|---|---|
| Runtime | Server (SSR) + client nav | **Edge** trước response | Client (sau khi JS load) |
| Input | `to` / `from` | `NextRequest` (URL, cookies, headers) | Router location + auth state |
| Output | `navigateTo` / abort | `NextResponse` redirect/rewrite/next | `<Navigate />` / loader `redirect` |

**Interview one-liner:** _Next middleware = edge gate trước HTML; Nuxt middleware = navigation gate SSR-aware; React SPA “middleware” = component/loader sau hydrate. Auth thật vẫn ở server._

---

### 21.9. Server Actions & mutation

**Senior-level Answer:**

Server Actions cho phép gọi hàm server từ form/button mà không phải viết API endpoint cho mọi mutation (tinh thần gần utility server Nuxt + form flow).

```tsx
async function createItem(formData: FormData) {
  'use server'
  await db.item.create({ data: { title: String(formData.get('title')) } })
}
```

**Interview:** validation, auth, `revalidatePath`, progressive enhancement.

---

### 21.10. Cheat sheet render & cache

| Mục tiêu | Cách làm |
|---|---|
| HTML cá nhân hóa luôn mới | Dynamic SSR |
| Gần tĩnh, thỉnh thoảng cập nhật | `revalidate` / tags |
| Fully static | generate lúc build |
| Giảm JS client | nhiều Server Components |
| Island tương tác | `'use client'` nhỏ |

**Cảnh báo senior:** semantics cache của Next thay đổi theo major version — luôn đối chiếu docs đúng version (hay thành footgun production + interview).

---

### 21.11. Khi nào chọn Next vs SPA React

**Chọn Next khi:**

- Cần SEO / social preview.
- Muốn data server gần UI.
- Cần hybrid rendering + một app deploy.

**Chọn Vite + React SPA khi:**

- Dashboard auth, SEO ít quan trọng.
- Đã có API gateway riêng, muốn client tối đa tự do.
- Team muốn ít ràng buộc framework.

#### **Song song Nuxt:**

Cùng bài toán **Nuxt vs Vue SPA thuần**.

---

## Gợi ý trả lời phỏng vấn (Vue → React/Next)

1. Phân biệt **Server vs Client Components**; modal `useState` đặt ở đâu.
2. So **Nuxt `useAsyncData`** với **async Server Component fetch**.
3. Chiến lược **cache/revalidate** cho trang product.
4. Map Composition API → **Hooks** (xem [React](./react.md)).
5. Tách **URL / RSC / Query / Zustand** — xem [State Management (React)](./state-management-react.md).
6. So **Nuxt middleware** vs **Next `middleware.ts`** (SSR nav gate vs Edge).
7. Kế hoạch migrate dần: giữ API, viết lại UI React/Next theo module.

---

[← Back to Overview](../../README.md)
