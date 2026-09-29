# Next.js

Next.js — React meta-framework for App Router, SSR/SSG, RSC, and production deployment. Written for seniors who know **Nuxt**, with Nuxt ↔ Next bridges.

---

## Table of Contents

1. [What is Next.js?](#211-what-is-nextjs)

2. [Next.js vs React](#212-nextjs-vs-react)

3. [Nuxt ↔ Next mental map](#213-nuxt--next-mental-map)

4. [CSR vs SSR vs SSG vs SPA (and RSC)](#214-csr-vs-ssr-vs-ssg-vs-spa-and-rsc)

5. [App Router fundamentals](#215-app-router-fundamentals)

6. [Data fetching patterns](#216-data-fetching-patterns)

7. [Routing, layouts, and navigation](#217-routing-layouts-and-navigation)

8. [Middleware](#218-middleware)

9. [Server Actions & mutations](#219-server-actions--mutations)

10. [Rendering & caching cheat sheet](#2110-rendering--caching-cheat-sheet)

11. [When to choose Next vs SPA React](#2111-when-to-choose-next-vs-spa-react)

---

## 21. Next.js

### 21.1. What is Next.js?

Next.js is a **framework built on React** that standardizes **routing, rendering modes, data fetching, and deployment** for production apps.

**Main strengths:**

- **File-based routing** via `app/` (App Router) or legacy `pages/`.
- **SSR / SSG / ISR / streaming** out of the box.
- **React Server Components (RSC)** — server-first UI composition.
- **API routes / Route Handlers** on the same project.
- **Image, font, script optimizations**.
- First-class **Vercel** deploy (also self-hostable via Node/Docker).

**In short:** _Next = React + Routing + Server rendering/RSC + Conventions + Production tooling._

---

### 21.2. Next.js vs React

| Feature | React (SPA/Vite) | Next.js |
|---|---|---|
| **Routing** | Manual (`react-router`) | File-based (`app/`) |
| **Rendering** | CSR by default | SSR/SSG/RSC/hybrid |
| **SEO** | Needs extra work | Strong defaults (server HTML) |
| **Data fetching** | Client libraries / manual | Server fetch + cache model + client hooks |
| **Structure** | DIY | Opinionated folders & conventions |
| **Backend** | Separate API | Route Handlers / Server Actions |

**In short:** React is the UI library; Next is the full-stack React framework (similar to Vue vs Nuxt).

---

### 21.3. Nuxt ↔ Next mental map

| Nuxt | Next.js (App Router) |
|---|---|
| `pages/` | `app/**/page.tsx` |
| `layouts/` | `layout.tsx` nesting |
| `middleware/` | `middleware.ts` |
| `server/api` | `app/api/**/route.ts` |
| `useFetch` / `useAsyncData` | server `fetch` / `async` Server Components |
| `definePageMeta` | segment `config` / conventions |
| Nitro presets | Next adapters / Node / Edge runtimes |
| Modules (`@nuxt/image`) | `next/image`, ecosystem packages |
| `.client` / `.server` components | `'use client'` boundary |

**Biggest mindset shift for Vue/Nuxt seniors:**

- In Nuxt you often think “Vue component + optional SSR data”.
- In Next App Router you must understand **Server Components by default** and mark **Client Components** with `'use client'` when you need hooks, browser APIs, or interactivity.

---

### 21.4. CSR vs SSR vs SSG vs SPA (and RSC)

#### **1. CSR – Client-Side Rendering**

- Browser downloads JS and renders UI.
- **Pros:** highly interactive SPAs.
- **Cons:** weaker SEO/TTFB without SSR.

#### **2. SSR – Server-Side Rendering**

- HTML rendered per request on the server, then hydrated.
- **Pros:** SEO, faster first content for dynamic pages.
- **Cons:** server cost/latency.

#### **3. SSG – Static Site Generation**

- HTML built at build time, served from CDN.
- **Pros:** fastest/cheapest for mostly static content.
- **Cons:** rebuild/revalidate needed for fresh data.

#### **4. ISR – Incremental Static Regeneration**

- Static pages that revalidate on a schedule/on-demand.
- Middle ground between SSG and SSR.

#### **5. SPA**

- Client navigates without full reloads (Next still supports app-like navigation via client router).

#### **6. RSC – React Server Components**

- Components can render on the server **without shipping their code to the client**.
- Great for data access and reducing bundle size.
- Interactivity still needs Client Components.

**In short:**

- **CSR/SPA**: interaction-heavy islands.
- **SSR**: dynamic SEO-sensitive pages.
- **SSG/ISR**: content sites / marketing / docs.
- **RSC**: server composition + smaller client JS.

---

### 21.5. App Router fundamentals

```text
app/
  layout.tsx          # shared chrome
  page.tsx            # /
  blog/
    page.tsx          # /blog
    [slug]/
      page.tsx        # /blog/:slug
  api/
    health/
      route.ts        # GET /api/health
```

#### **Server Component (default)**

```tsx
// app/posts/page.tsx
async function PostsPage() {
  const posts = await getPosts() // server-side
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

**Rule of thumb:** push `'use client'` to the **leaves** (buttons, forms), keep pages/layouts as Server Components when possible.

---

### 21.6. Data fetching patterns

#### **Server Component fetch**

```tsx
async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const res = await fetch(`https://api.example.com/products/${id}`, {
    next: { revalidate: 60 }, // ISR-style revalidate
  })
  const product = await res.json()
  return <ProductView product={product} />
}
```

#### **Client-side fetching**

Use when data depends on browser-only state (auth widgets, live filters). Prefer **TanStack Query** over ad-hoc `useEffect` for cache/races.

#### **Nuxt bridge:**

| Nuxt | Next |
|---|---|
| `useAsyncData` on server | `await` in Server Component |
| `useFetch` | server `fetch` or client Query |
| `refreshNuxtData` | `revalidatePath` / `revalidateTag` |

---

### 21.7. Routing, layouts, and navigation

- Nested `layout.tsx` wraps child segments (like Nuxt nested layouts).
- `loading.tsx` / `error.tsx` for segment-level UX.
- Navigation: `next/link`, `useRouter` from `next/navigation` (App Router).

```tsx
import Link from 'next/link'

export function Nav() {
  return <Link href="/docs">Docs</Link>
}
```

**Dynamic routes:** `[id]`, catch-alls `[...slug]`, optional `[[...slug]]`.

---

### 21.8. Middleware

**Senior-level Answer:**

Next.js Middleware runs on the **Edge** **before** the request finishes (before RSC/SSR HTML). Use it for rewrites, redirects, cookies/headers, and cookie-based auth gates — closest map to **Nuxt route middleware** plus some Nitro server-middleware concerns.

File: `middleware.ts` (or `src/middleware.ts`) at the project root.

#### **Auth redirect example**

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
  res.headers.set('x-pathname', pathname) // optional: pass context downstream
  return res
}

export const config = {
  matcher: ['/admin/:path*', '/app/:path*', '/login'],
}
```

#### **`matcher` — decide before you ship**

- Middleware runs on the Edge for every matched path → **keep it thin**.
- Exclude static assets (`_next/static`, images) to avoid latency / cold-start cost.
- A wrong matcher means auth leaks or redirect loops.

#### **Do / don’t**

| Do | Don’t |
|---|---|
| Cookie-based redirect/rewrite | Heavy DB / ORM work |
| A/B flags, geo, locale prefix | Put large secrets in the middleware bundle |
| Light security headers | Replace API authorization |
| Early UX gating | Depend on Node-only APIs |

#### **Compared to Nuxt / React SPA**

| | Nuxt `middleware/` | Next `middleware.ts` | React SPA guard |
|---|---|---|---|
| Runtime | Server (SSR) + client nav | **Edge** before response | Client (after JS loads) |
| Input | `to` / `from` | `NextRequest` (URL, cookies, headers) | Router location + auth state |
| Output | `navigateTo` / abort | `NextResponse` redirect/rewrite/next | `<Navigate />` / loader `redirect` |

**Interview one-liner:** _Next middleware = edge gate before HTML; Nuxt middleware = SSR-aware navigation gate; React SPA “middleware” = component/loader after hydrate. Real auth still lives on the server._

---

### 21.9. Server Actions & mutations

**Senior-level Answer:**

Server Actions let you call server functions from forms/buttons without hand-writing an API endpoint for every mutation (similar spirit to Nuxt server utilities + form flows).

```tsx
async function createItem(formData: FormData) {
  'use server'
  await db.item.create({ data: { title: String(formData.get('title')) } })
}
```

**Interview tip:** discuss validation, auth checks, revalidation (`revalidatePath`), and progressive enhancement with forms.

---

### 21.10. Rendering & caching cheat sheet

| Goal | Approach |
|---|---|
| Always fresh personalized HTML | Dynamic SSR / no store |
| Mostly static, updates sometimes | `revalidate` seconds / tags |
| Fully static | build-time generation |
| Reduce client JS | more Server Components |
| Interactive island | small `'use client'` leaf |

**Senior warning:** Next caching semantics evolve — always verify against the current docs for your major version (caching has been a frequent interview + production footgun).

---

### 21.11. When to choose Next vs SPA React

**Choose Next when:**

- SEO / social previews matter.
- You want server data access close to UI.
- You need hybrid rendering and one deployable app.

**Choose Vite + React SPA when:**

- Authenticated dashboard with little SEO need.
- You already have a separate API gateway and want maximal client freedom.
- Team wants minimal framework constraints.

#### **Nuxt parallel:**

Same decision as **Nuxt vs pure Vue SPA**.

---

## Interview talking points (Vue → React/Next)

1. Explain **Server vs Client Components** and where you’d put a modal with `useState`.
2. Compare **Nuxt `useAsyncData`** vs **async Server Component fetch**.
3. Discuss **cache/revalidate** strategy for a product page.
4. Map your Vue Composition skills to **Hooks** (see [React](./react.md)).
5. Separate **URL / RSC / Query / Zustand** — see [State Management (React)](./state-management-react.md).
6. Compare **Nuxt middleware** vs **Next `middleware.ts`** (SSR nav gate vs Edge).
7. Describe a migration plan: Vue SPA → keep API, rewrite UI in React/Next incrementally.

---

[← Back to Overview](../../README-en.md)
