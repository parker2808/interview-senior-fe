# Next.js

You already know Nuxt. This file is the **Nuxt → Next App Router** bridge plus the **senior React/Next judgment** interviewers actually score: where `'use client'` belongs, what **caching** does on *this* major version, why middleware is not authorization, and how Server Actions fail in production. Caching is the **#1 Next footgun** — defaults have flipped across versions, so a senior names the version, states the *intent* (static vs dynamic vs tagged), and **verifies docs** instead of reciting folklore. Answer **decision → constraint → failure mode → measure**.

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

12. [Common production failures](#2112-common-production-failures)

---

## 21. Next.js

### 21.1. What is Next.js?

**What they actually ask**

- “What does Next give you that React doesn’t?”
- “App Router or Pages Router in 2026?”

**How a senior answers**

**Decision.** Next.js is a **production framework on React**: file routing, rendering modes, data/cache conventions, Server Components, Route Handlers, Server Actions, and deploy adapters. React is the UI library. You choose Next when you want **the server in the same app** (HTML, cache, mutations, images) with conventions — the same reason you chose Nuxt over a raw Vue SPA.

**Constraint.** Interview bar is **App Router** (`app/`). Pages Router is legacy maintenance. Features that matter in a senior round: **RSC default**, streaming, caching (version-specific), middleware at the Edge, Server Actions. Vercel is the reference host, not the only one (Node/Docker/adapters).

**Failure mode.** Describing Next as “SSR for React” (too small) or as “a host” (too vendor). Shipping Pages Router patterns (`getServerSideProps`) as if they were App Router.

**Measure.** For a given URL: what ran on the server vs what shipped as client JS; what was cached; what cookie made it dynamic.

**Tradeoffs**

Convention speed vs framework coupling (cache semantics, upgrade pain). Nuxt seniors already made this trade.

**Production gotchas**

- `pages/` and `app/` can coexist during migration — know which URL won.
- Image/font/script helpers are real wins only if you use them correctly (`next/image` domains, sizes, CLS).

**Follow-ups**

- Draw the request: middleware → layout(s) RSC → page RSC → client islands hydrate.

---

### 21.2. Next.js vs React

**What they actually ask**

- “Could we just use Vite + React?”
- “Is Next full-stack?”

**How a senior answers**

**Decision.** React (Vite SPA) is **client runtime + a separate API**. Next is **React + server rendering/RSC + routing + optional backend in-repo**. Full-stack *capability* is not a mandate to put your domain in `app/api`.

**Constraint.** Anything you import into a Client Component **ships to the browser** (minus compiler dead-code). Next does not magically keep secrets if you pass them across the RSC boundary or import server modules into `'use client'` files.

**Failure mode.** “Next is slower than Vite” without saying *which* metric (dev boot, TTFB, TTI). Wrapping the app in `'use client'` so it “feels like Vite” — you paid Next’s complexity and kept SPA costs.

**Measure.** JS shipped for the route (RSC should shrink it). TTFB for first content. Auth dashboard: time-to-interactive vs SEO (often SEO is irrelevant — §21.11).

| Feature | React (SPA / Vite) | Next.js App Router |
|---|---|---|
| Routing | `react-router` (you own it) | File-based `app/` |
| Default render | CSR | RSC + optional SSR/SSG/PPR |
| SEO | Extra work | Server HTML by default |
| Data | Query / effects | Server `fetch` + cache model + client Query |
| Backend | Separate | Route Handlers / Server Actions (optional) |
| Guards | Client wrappers / loaders | Middleware (Edge) + server `redirect` |

**Tradeoffs**

Next: better first content and colocation of data with UI; worse “I just want a dashboard talking to an existing API” unless you stay disciplined about client leaves.

**Production gotchas**

- Route Handlers are an HTTP surface — they need the same authz as any API.
- SPA mental model + Next cache = stale personalized pages (see §21.10).

**Follow-ups**

- Same table as Vue vs Nuxt. If they know Nuxt, use §21.3.

---

### 21.3. Nuxt ↔ Next mental map

**What they actually ask**

- “What’s the Nuxt equivalent of X?”
- “Where do I put `useFetch`?”

**How a senior answers**

**Decision.** Map folders, then map **the default component runtime**. Nuxt: Vue component, SSR data via `useAsyncData` / `useFetch`. Next App Router: **Server Component by default**; interactivity is an explicit `'use client'` **leaf**.

**Constraint.** `'use client'` is a **module boundary**, not a “this function is client” annotation. That file and its imports become part of the client graph (you still **compose** Server children as `children` from a server parent — you do **not** import a Server Component into a client module).

**Failure mode.** Marking `page.tsx` `'use client'` so you can `useState` — the whole page’s dependency graph tends to follow. Reaching for `useEffect` fetch because `useAsyncData` isn’t there.

**Measure.** In the Next bundle analyzer / “Client component boundary” in DevTools: is the page a leaf or the root of a client continent?

| Nuxt | Next.js (App Router) |
|---|---|
| `pages/` | `app/**/page.tsx` |
| `layouts/` | nested `layout.tsx` |
| `middleware/` | `middleware.ts` (**Edge**, different semantics) |
| `server/api` | `app/api/**/route.ts` |
| `useFetch` / `useAsyncData` | `await` in Server Components; client Query if live |
| `refreshNuxtData` | `revalidatePath` / `revalidateTag` |
| `definePageMeta` | segment conventions / `export const dynamic` / cache APIs |
| Nitro presets | Next runtime (Node/Edge) + host adapters |
| `.client` / `.server` | `'use client'` boundary; `server-only` import |
| Nuxt modules | `next/image`, community packages — less “module magic” |

**Tradeoffs**

Nuxt hides SSR data in composables that work on both sides. Next **splits the world** — that split is the job.

**Production gotchas**

- Nuxt middleware runs in a **navigation** mental model (SSR + client). Next middleware runs **on the Edge before the response** — no Vue/React tree, no Node APIs unless your version/runtime says so.
- `useState` in Nuxt (SSR-friendly shared state) is **not** React `useState`. Don’t invent a Pinia clone on the client for session — cookies/server session first ([state-management-react.md](./state-management-react.md)).

**Follow-ups**

- “Show me a modal with `useState`.” — Client **leaf**, page stays server, modal passed as child or imported only in a small client wrapper.

---

### 21.4. CSR vs SSR vs SSG vs SPA (and RSC)

**What they actually ask**

- “ISR vs SSR vs SSG — when?”
- “What is PPR / partial?”
- “Is RSC SSR?”

**How a senior answers**

**Decision.** Pick by **freshness, personalization, and who can see the data**:

| Mode | When | Constraint |
|---|---|---|
| **SSG** | Marketing, docs, rare changes | Stale until rebuild |
| **ISR / time or tag revalidate** | Product catalog, CMS pages | Stale window / invalidation bugs |
| **SSR (dynamic)** | Per-request, personalized, behind cookies | Server cost, TTFB, cache *must not* store user HTML under a public key |
| **CSR / SPA island** | Highly interactive dashboards, no SEO | Weaker first content; you own the loading story |
| **RSC** | Default composition: data + UI on server, **no component JS** to the client for that node | Not interactive; not a cache strategy by itself |
| **PPR / partial** | **Awareness:** static shell + dynamic holes streamed in | API/name moved (experimental → Cache Components / partial prerender). Say “static shell, dynamic holes,” then verify current docs |

**Constraint.** RSC can participate in **static or dynamic** routes. RSC ≠ “always SSR.” A Server Component on a fully static route is closer to **SSG of a React tree that never hydrates those nodes**. Hydration is for Client Components.

**Failure mode.** Calling everything “SSR.” Caching a page that called `cookies()` and leaking one user’s HTML. Treating PPR as a buzzword without the **shell vs hole** picture.

**Measure.** `x-nextjs-cache` / your host’s cache headers (names change). For a logged-in URL: is the HTML `Cache-Control` private/no-store? For a product URL: did tag invalidation actually drop the CDN page?

**Vue / Nuxt bridge**

Same menu as Nuxt CSR/SSR/SSG. Nuxt `swr` / `isr` nitro presets ≈ ISR. RSC has **no honest Nuxt 3 twin** — closest is “server-only data composables + smaller client,” not “components that never ship.”

**Tradeoffs**

Static is cheap and cacheable; personalization punches a hole. PPR tries to get **both** (shell from CDN, hole from server). Complexity is the price.

**Production gotchas**

- ISR + on-demand revalidate: forget to `revalidateTag` after CMS webhook → customers see yesterday’s price.
- SPA navigation inside Next still uses a **client router cache** — back-button can show a stale client snapshot even when server cache is fine (version-dependent; know it exists).

**Follow-ups**

- Caching details: §21.10.
- “Why is my ‘static’ page dynamic?” — `cookies()`, `headers()`, `searchParams`, uncached fetch, `connection()` / `noStore` — §21.10 / §21.12.

---

### 21.5. App Router fundamentals

**What they actually ask**

- “Where do you put `'use client'`?”
- “Why can’t I pass a function prop from a Server Component?”
- “Can a Client Component import a Server Component?”

**How a senior answers**

**Decision.** `app/` is nested **layouts + pages + loading/error/not-found**. **Server Components are default.** Push `'use client'` to **leaves** (buttons, charts, forms that need hooks or browser APIs). Keep `layout.tsx` / `page.tsx` server unless the *entire* surface is a client app (usually a smell — §21.11).

**Constraint.** Props that cross the **RSC → client** boundary must be **serializable** (plain data the Flight protocol can send). **No** class instances, functions (except **Server Actions**), `Map`/`Set` unless your version explicitly supports them — treat extra types as unsafe until docs say otherwise. Client Components **cannot import** Server Components. They **can render** `children` that the server passed in — that is the composition pattern.

**Failure mode.** `'use client'` at the page root. Passing a function `onClick` from server page to client child (not an action). Importing a `db` module into a client file. Spreading a Prisma model / `Decimal` across the boundary.

**Measure.** Bundle: did `page.js` client chunk explode after one directive? Runtime: “Event handlers cannot be passed…” / serialization errors in the server log.

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

**Tradeoffs**

More files (tiny client islands) vs one client continent. Islands win bundle and secrets.

**Production gotchas**

- `'use client'` is **opt-in to the client bundle for that module graph**, not “this one function.”
- Shared `components/Button.tsx` without the directive can be imported from both; add `'use client'` only when it needs hooks. A server parent importing a client Button is fine; the Button becomes a client island.
- Don’t pass `children` through so many client wrappers that you accidentally recreate a client page.

**Follow-ups**

- Secrets leaked as props: §21.12.
- Server Actions as the legal “function across the boundary”: §21.9.

---

### 21.6. Data fetching patterns

**What they actually ask**

- “Where do you fetch in App Router?”
- “`useEffect` vs server `fetch` vs Query?”
- “What does `cookies()` do to caching?”

**How a senior answers**

**Decision.**

1. **Default:** `await` in a Server Component (or a server-only data function). Colocate with the UI that needs it; parallelize independent awaits (`Promise.all`).
2. **Live client cache** (search-as-you-type, shared mutations across islands, polling): **TanStack Query / SWR** in a Client leaf.
3. **Effect fetch:** last resort (see [react.md §20.1.12](./react.md#20112-when-to-fetch-data)).

**Constraint.** In App Router, `fetch` is **instrumented**. Semantics **changed across major versions** (Next 14: many `fetch`es cached by default; Next 15+: `fetch` default moved toward **no cache**; later lines push **explicit** `use cache` / Cache Components). Interview answer: *“I set cache policy on purpose for this data, and I re-read the docs for our Next major.”*

`cookies()`, `headers()`, `searchParams` (and APIs like `connection()` / `noStore` depending on version) **opt the route into dynamic** — personalized, not a static CDN page. That is a feature for session HTML and a footgun for a product listing you meant to ISR.

**Failure mode.** Sequential `await getA(); await getB()` when they are independent → **server waterfall**. Client waterfall: server page with no data, every widget fetches on mount. `cache: 'force-cache'` on a per-user endpoint. Forgetting that a single `cookies()` in a shared `layout.tsx` can dynamize **everything below**.

**Measure.** Trace the server timeline (Next / OpenTelemetry). Network: one HTML with data vs 12 client GETs. Confirm with cache headers whether you got the mode you named.

```tsx
// Version-sensitive: always pair fetch with an explicit policy
const res = await fetch(url, { next: { revalidate: 60, tags: ['product'] } })
// or: cache: 'no-store' when it must be per-request

// Dynamic opt-in — do this in the *leaf* that needs the session, not the root layout
import { cookies } from 'next/headers'
const session = (await cookies()).get('session')?.value
```

**Nuxt bridge**

| Nuxt | Next |
|---|---|
| `useAsyncData` on server | `await` in Server Component |
| `useFetch` | server `fetch` or client Query |
| `refreshNuxtData` | `revalidatePath` / `revalidateTag` |
| keyed cache | `tags` / `queryKey` |

**Tradeoffs**

Server fetch: smaller client, secrets stay, harder to share live state. Query: UX and dedupe, more JS, hydration of dehydrated state if you pass initial data.

**Production gotchas**

- Request memoization: same `fetch` URL in one RSC request is deduped — good; don’t invent a second cache by accident.
- `POST` / non-GET are not your ISR hammer.
- Passing server data into Query `initialData` without a matching `queryKey` → stale client forever.

**Follow-ups**

- Cheat sheet: §21.10.
- Waterfalls vs `Promise.all`: §21.12.

---

### 21.7. Routing, layouts, and navigation

**What they actually ask**

- “How do nested layouts work?”
- “`loading.tsx` vs `<Suspense>`?”
- “Client navigation vs full reload?”

**How a senior answers**

**Decision.** Folders are URL segments. `layout.tsx` **wraps** children and **does not remount** on navigation within that segment (state in a client layout **survives** — don’t put a one-shot wizard there unless you mean it). `page.tsx` is the leaf. `loading.tsx` is a **route-level Suspense fallback** for that segment. `error.tsx` is a **route-level Error Boundary** (Client Component). Navigation: `<Link>` / `useRouter` from `next/navigation` (not `next/router` — that’s Pages).

**Constraint.** Dynamic segments: `[id]`, catch-all `[...slug]`, optional `[[...slug]]`. `searchParams` / `params` are async in modern App Router (`await params`) — older examples were sync; **match your version**.

**Failure mode.** Putting auth-only chrome in the root layout that all marketing pages inherit. Client `useRouter().push` in an effect as a fake redirect (waterfall + flash) instead of server `redirect()`. Using `<a>` for internal routes (full reload, lose prefetch).

**Measure.** Layout state persistence: type in a shared client search box, navigate sibling pages, did it keep text? Prefetch: hover a `Link`, did the RSC payload load?

**Nuxt bridge**

Nested `layout.tsx` ≈ Nuxt nested layouts. `loading.tsx` ≈ Nuxt `loadingIndicator` / Suspense around pages, but **per segment**. `definePageMeta({ layout })` is replaced by **folder structure** — moving a file **is** the API.

**Tradeoffs**

Hard-to-change URL trees vs explicit React Router graphs. Prefetch is free-ish on desktop and costly on mobile data — know `prefetch={false}`.

**Production gotchas**

- Root `loading.tsx` replacing the **whole** shell including nav — users think the app crashed. Keep chrome in `layout`, suspense the **page** hole.
- `error.tsx` must be a Client Component; it still doesn’t catch event-handler errors ([react.md §20.2.4](./react.md#2024-error-boundaries)).
- Parallel / intercepting routes (`@slot`, `(.)`) — interview **awareness** for modals-as-URLs; easy to overuse.

**Follow-ups**

- Middleware matcher vs layout-level `redirect()`: §21.8.
- Hydration mismatch from `Date` in a layout: §21.12.

---

### 21.8. Middleware

**What they actually ask**

- “How do you auth-gate App Router?”
- “Is Next middleware like Nuxt middleware?”
- “Why did we get a redirect loop?”

**How a senior answers**

**Decision.** `middleware.ts` runs on the **Edge before** RSC/SSR HTML. Use it as a **thin gate**: cookie *presence*, locale prefix, geo, A/B rewrite, light headers. Closest Nuxt analog is **route middleware + some server middleware**, but the runtime is **not** your Node app and **not** the React tree.

**Constraint.** **Not authorization.** Middleware can see a cookie **exists**; it should not be the only check that the session is valid, not revoked, and allowed to `DELETE /api/users`. Real authz: Server Component / Route Handler / Server Action against the session store. Keep the Edge bundle **small** (no ORM, no huge JWT libs if you can avoid them). `matcher` is production config — a wrong matcher **skips** the gate or **runs** on every static asset.

**Failure mode.** DB in middleware. Secrets baked into the Edge bundle. Matcher that misses `/admin` vs `/admin/users`. Redirect `/login` ↔ `/app` loops. Using middleware to “hide” an RSC page that still has a public Route Handler.

**Measure.** curl the HTML **without** JS: did you get 307 to login? curl the API with a garbage cookie: did you still get 200? Log Edge CPU/duration — middleware on `_next/static` is a self-inflicted outage.

```ts
export const config = {
  matcher: ['/admin/:path*', '/app/:path*', '/login'],
}
// Pitfall: forgetting :path* → /admin/users never matches
// Pitfall: matcher too broad → Edge runs on every image
```

Redirect loop sketch: `isProtected && !token → /login` **and** `isAuthPage && token → /app` is fine **until** “token” is a **stale cookie** that login always sets, or `/login` is accidentally in `isProtected`.

**Do / don’t**

| Do | Don’t |
|---|---|
| Cookie presence → redirect/rewrite | Treat as RBAC |
| Locale, geo, feature flag rewrite | ORM / heavy CPU |
| Tight `matcher` | Run on `_next/static`, images |
| Pass a header downstream if needed | Put long-lived secrets in the middleware bundle |

**Compared to Nuxt / React SPA**

| | Nuxt `middleware/` | Next `middleware.ts` | React SPA guard |
|---|---|---|---|
| Runtime | SSR + client nav | **Edge** before body | After JS (hydrate) |
| Input | `to` / `from` | `NextRequest` (URL, cookies, headers) | location + client session |
| Output | `navigateTo` | `NextResponse` redirect/rewrite/next | `<Navigate />` / loader `redirect` |
| Security | still not enough | still not enough | UX only |

**Interview one-liner:** Next middleware = **Edge cookie gate before HTML**; Nuxt middleware = **SSR-aware navigation gate**; SPA guard = **after hydrate**. Authorization still lives on the server that reads the session.

**Tradeoffs**

Early redirect improves UX (no admin flash) and leaks less HTML. It cannot replace server checks and it can DDoS yourself with a greedy matcher.

**Production gotchas**

- `NextResponse.next()` vs `rewrite` vs `redirect` — rewrite keeps the URL, easy to confuse with auth.
- Internationalized routing + matcher = off-by-one locales (`/en/login`).
- Middleware + CDN: know whether the **redirect** is cached.

**Follow-ups**

- SPA `RequireAuth`: [react.md §20.2.9](./react.md#2029-route-guards--middleware-spa).
- Session as cookies, not Zustand: [state-management-react.md](./state-management-react.md) §22.6.

---

### 21.9. Server Actions & mutations

**What they actually ask**

- “What is `'use server'`?”
- “Are Server Actions safe? CSRF?”
- “How do you refresh data after a POST?”

**How a senior answers**

**Decision.** Server Actions are **RPC from forms/buttons to a server function** without a hand-written Route Handler for every mutation. They are **public entry points** (the client can call whatever you exported). Treat them like POST endpoints: **authenticate, authorize, validate, then mutate, then revalidate**.

**Constraint.**

- Validation: schema (Zod) on the **server**. Never trust `FormData`.
- Authz: session from cookies **inside the action**, not “the page was behind middleware.”
- Cache: `revalidatePath` / `revalidateTag` (and/or Query `invalidateQueries` on the client).
- Progressive enhancement: `<form action={createItem}>` should work **without** JS when the UX allows.
- Origin: Next performs **CSRF-ish origin / host checks** on actions — know they exist, don’t invent a false sense of safety, still require **same-site cookies + authz**.
- Serializable arguments; file uploads have size/runtime limits.

**Failure mode.** Action that `db.item.create` with no session. Revalidate the wrong path (`/` vs `/products/[id]`). Client-only `onClick` fetch that skips the action’s validation. Returning internal errors to the client.

**Measure.** Unauthenticated POST to the action (framework POST URL) → 401/redirect, not a write. After a successful write, the **next view** (RSC payload or Query) shows new data — if not, you missed revalidation.

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

**Nuxt bridge**

Spirit of `server/api` + form actions / `useFetch` POST, with a tighter UI binding. Still not “skip validation because it’s a function, not HTTP.”

**Tradeoffs**

Fewer API files, harder to see the HTTP surface (security reviews miss it). Route Handlers are better for **public webhooks / non-Next clients**. Actions are better for **first-party forms**.

**Production gotchas**

- Every exported async function from a `'use server'` file is invocable — don’t export helpers next to actions.
- `revalidatePath('/blog/[slug]')` is not a wildcard for all posts — use **tags**.
- `useOptimistic` without a server source of truth → stuck optimistic row on failure.
- Passing the whole `process.env` into an action return “for debugging” → client leak.

**Follow-ups**

- `useActionState` / `useFormStatus` for pending/errors.
- When you’d still write `route.ts` (webhooks, third-party POST, streaming uploads).

---

### 21.10. Rendering & caching cheat sheet

**What they actually ask**

- “Explain Next’s caches.”
- “`revalidate` vs `no-store` vs cookies.”
- “Why is this page stale / why is it always dynamic?”

**How a senior answers**

**Decision.** Speak in **layers**, then admit **names and defaults move between majors**. A safe 2024–2026 mental model:

| Layer | Role |
|---|---|
| **Request memoization** | Dedupe identical `fetch` inside **one** server render |
| **Data cache** | Persist `fetch` / cached functions across requests (time or tags) |
| **Full route cache** | Cached **RSC/HTML** for a static/ISR route |
| **Client router cache** | Back/forward / prefetch on the **browser** |

Intent vs knobs (verify against **your** Next version):

| Goal | Typical knobs |
|---|---|
| CDN-static | no `cookies()`/`headers()`, cacheable fetch, or explicit `use cache` / force-static |
| Fresh every request | `no-store` / `dynamic = 'force-dynamic'` / read `cookies()` / `connection()` |
| Mostly static, update on write | `revalidate: n` **or** `tags` + `revalidateTag` from the action/webhook |
| Personalized shell | PPR/partial: static chrome, dynamic hole that reads cookies |
| Smaller JS | more Server Components, `'use client'` only at leaves |

**Constraint.** **Reading cookies/headers is a dynamic opt-in.** Putting `cookies()` in the root layout to “just get theme” can disable static rendering for the **whole app**. Cache keys that ignore the user on a personalized fetch are a **security bug**, not a perf win.

**Failure mode.** Folklore: “fetch is always cached” or “fetch is never cached” without a version. ISR page that reads `cookies()` and silently went dynamic. Tag never emitted on the `fetch`, so `revalidateTag` is a no-op.

**Measure.** For one URL, in prod: cache HIT/MISS headers, whether HTML contains user-specific strings, whether a webhook actually moved the needle. In an interview, say *how* you would look, not a fake default.

**Senior warning.** Next caching is the topic where confident wrong answers ship incidents. **Name the major. Verify docs. Prefer explicit policy on every fetch / cached function.**

**Tradeoffs**

Implicit cache (old App Router) was magical and hostile. Explicit `use cache` / tags is more verbose and reviewable. Time-based revalidate is easy and wrong for money/inventory; **on-demand tags** are the adult mode.

**Production gotchas**

- Draft mode / preview cookies punching a hole you forgot to close.
- Multi-region: tag revalidation lag.
- `unstable_*` APIs in old blog posts — don’t quote them as current.

**Follow-ups**

- Walk a product page: SSG + `tags: ['product', id]` + CMS webhook `revalidateTag`.
- Walk an account page: `cookies()` + no-store + never CDN-cache HTML.

---

### 21.11. When to choose Next vs SPA React

**What they actually ask**

- “We have an authenticated dashboard — Next or Vite?”
- “Migration from Nuxt/Vue?”

**How a senior answers**

**Decision.**

**Choose Next when** SEO/social previews matter, you want **server data next to UI**, hybrid rendering, streaming, or one deployable full-stack surface. Marketing + app in one repo with **server session cookies** is a good Next fit.

**Choose Vite + React SPA when** it is an **auth dashboard** behind a login, SEO is irrelevant, a **mature API gateway** already exists, and the team wants Client Components without fighting RSC/cache. That is a legitimate senior choice, not a cop-out.

**Constraint.** “We’re already on Vercel / we like `next/image`” is not a product requirement. Next as a **hosted SPA** (`'use client'` on every page) is usually the **worst** of both worlds — unless you are mid-migration and honest about it.

**Failure mode.** Rewriting a closed-admin Vue app into App Router and spending the quarter on hydration and cache. Or the opposite: public content site as a Vite SPA and bolting SSR later.

**Measure.** Traffic that needs crawlers / OG images. % of routes that are personalized. Existing API vs desire to colocate mutations.

**Nuxt parallel**

Same decision as **Nuxt vs pure Vue SPA**. If you would not have used Nuxt, don’t use Next out of résumé pressure.

**Tradeoffs**

| | Next | Vite SPA |
|---|---|---|
| First content / SEO | Wins | Loses unless you add a renderer |
| Auth dashboard DX | Cache/RSC footguns | Simple Query + router |
| Mutations | Server Actions colocate | Your API already exists |
| Hiring | RSC skill required | React SPA skill is wider |

**Production gotchas**

- Hybrid: Next for public marketing, SPA for the app, **two** auth cookies / CORS — a real architecture, not an accident.
- Don’t “just add middleware” to a Vite app; that’s when Next starts to earn its keep.

**Follow-ups**

- Layers of state once you chose Next: [state-management-react.md](./state-management-react.md).
- Auth: cookies as source of truth, not a hydrated Zustand user (§22.6).

---

### 21.12. Common production failures

**What they actually ask**

- “Have you shipped a hydration bug?”
- “How do secrets leak in RSC?”
- “Why is TTFB 2s on a page with three fetches?”

**How a senior answers**

**Decision.** The incidents that show up in Next on-calls cluster into three families: **hydration mismatch**, **server data crossing the client boundary**, **await waterfalls**. A senior has seen all three and has a default fix.

**Constraint.** Server HTML must **text-match** the first client render of Client Components. Anything you pass to a Client Component is **in the RSC payload** (the user can see it). Independent data must be fetched **in parallel**.

**Failure mode.** Branching on `typeof window` (not `'undefined'`) to read `localStorage` during **render**. `new Date().toLocaleString()` in a shared layout. Importing a server-only `stripeSecret` into a file that later gained `'use client'`. `const u = await getUser(); const o = await getOrders(u.id); const n = await getNotifs(u.id)` when orders and notifs are independent.

**Measure.** Hydration overlay / “did not match” text. View-source / Network RSC payload for secrets (Ctrl-F the key). Server trace: serial awaits vs `Promise.all`.

#### Hydration mismatch

Causes: `Date.now()` / `Math.random()` / `toLocale*` (server UTC vs user TZ), `window` / `localStorage` in render, invalid HTML (`<p><div>`), browser extensions injecting DOM, CSS-in-JS class order, `useId` mismatches across versions.

Fix: **pure render**; format dates with an explicit timezone or only on the client after mount (`useEffect` / `suppressHydrationWarning` **only** on the one text node that must differ, e.g. a clock). Theme from `localStorage`: inline script in `layout` **before** paint, or class on `<html>` from a cookie (cookie = server-visible).

```tsx
// Pitfall: server HTML "en-US 10/08" vs client "vi-VN 08/10"
<span>{createdAt.toLocaleDateString()}</span>
// Prefer a serialized ISO string + explicit locale, or a Client clock after mount
```

#### Leaking server secrets to the client

Causes: `NEXT_PUBLIC_*` on a real secret; passing `process.env` / tokens / internal URLs as props to a Client Component; importing a module that reads secrets into a `'use client'` graph; returning too much from a Server Action; logging user PII into client error boundaries.

Fix: `import 'server-only'` on secret modules (build fails if a client file imports them). Pass **minimal DTOs** (`{ id, name }`, not the Prisma row). Session stays in **httpOnly cookies**, not in a client store dump. Review the RSC Flight payload in Network.

```ts
import 'server-only'
export const dbUrl = process.env.DATABASE_URL! // must never enter a client module
```

#### Waterfalls of awaits

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

Component waterfalls: page awaits A, child Server Component awaits B that didn’t start until A’s tree rendered. **Start** B in the parent (`Promise.all` / preload) or use the `fetch` cache/dedupe so the child hit is free — don’t blindly `await` in every leaf “because RSC.” Client waterfalls: empty RSC shell + five `useEffect` fetches — you used Next as a SPA.

**Tradeoffs**

Parallel fetch uses more origin concurrency; still better than 3× TTFB. Defer non-critical holes with Suspense (stream) instead of blocking the whole page.

**Production gotchas (adjacent)**

- `'use client'` on the page (secret graph + no RSC benefit).
- Non-serializable props (functions, class instances) — runtime error at the boundary.
- Middleware matcher holes (§21.8).
- Cache folklore (§21.10).
- `searchParams` in a client page used as the only auth check.

**Follow-ups (system design)**

1. Server vs Client: where does a modal with `useState` live?
2. Product page cache/revalidate + webhook tags.
3. Nuxt `useAsyncData` vs async Server Component — and when Query still wins.
4. Middleware vs layout `redirect` vs SPA guard — who is security.
5. Draw URL / cookies / RSC / Query / Zustand — [state-management-react.md](./state-management-react.md).

---

[← Back to Overview](../../README-en.md)
