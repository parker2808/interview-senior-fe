# Nuxt.js

Senior Nuxt interviews are not “SSR vs SPA” flashcards. They ask you to **design a hybrid rendering policy** under SEO, auth, TTFB, and server-cost constraints — then explain **payload, hydration, and data keys** when that policy fails in production. Interviewers assume Vue 3. They probe **routeRules**, **when not to SSR**, and whether you treat middleware as real auth (it is not). A strong answer names the **decision**, the **constraint**, the **failure mode**, and how you would **measure** it.

---

## Table of Contents

1. [What is Nuxt.js?](#61-what-is-nuxtjs)

2. [Nuxt vs Vue](#62-nuxt-vs-vue)

3. [CSR vs SSR vs SSG vs SPA](#63-csr-vs-ssr-vs-ssg-vs-spa)

4. [Middleware](#64-middleware)

5. [useAsyncData vs useFetch vs $fetch](#65-useasyncdata-vs-usefetch-vs-fetch)

6. [Plugins, runtimeConfig, env](#66-plugins-runtimeconfig-env)

7. [Nitro server routes vs BFF](#67-nitro-server-routes-vs-bff)

8. [Hydration, ClientOnly, lazy hydration](#68-hydration-clientonly-lazy-hydration)

---

## 6. Nuxt.js

### 6.1. What is Nuxt.js?

**What they actually ask**

“Why Nuxt instead of Vue + Vite + vue-router?” They want **conventions that encode production decisions** (rendering mode, data, env, server), not a feature list.

**How a senior answers**

- **Decision:** Nuxt is the **application framework** on top of Vue 3: file routing, hybrid rendering, Nitro, first-class data fetching with a **serializable payload**, modules, and deploy presets. Use it when you need **SSR/SSG/hybrid**, SEO, or a BFF. Stay on Vue SPA when the product is an authenticated shell behind a CDN with no SEO surface and a separate API.
- **Constraint:** Nuxt’s value is the **happy path**. You pay for it when you fight the defaults (fully custom routing, non-Nitro backends, leaking `window` in plugins).
- **Failure mode:** Treating Nuxt as “Vue with folders” and fetching in `onMounted` everywhere — you keep SPA behavior and still pay SSR complexity.
- **Measure:** Time to first **useful HTML** on a marketing URL vs TTI on an app URL; operational cost of Nitro vs a SPA on object storage.

Nuxt is not a Vue replacement. It is Vue + **routing + rendering policy + server**. Nitro is the deployable server (Node, serverless, edge presets). Pinia, Vue Router, and Vite are underneath; Nuxt wires their SSR story.

**Tradeoffs**

- Vue SPA: simpler mental model, cheaper static host, you own every SSR footgun if you add it later.
- Nuxt: faster to a correct hybrid app, more magic (auto-import, payload), harder to debug when the magic is wrong.

**Production gotchas**

- `ssr: false` globally is a Vue SPA with extra framework — justify it.
- Modules (`nuxt-auth`, image, i18n) save months and can **own your request path**; read what they put in cookies and headers.
- Auto-imports hide cycles — same interview point as Vue ([vue3 auto-import](./vue3.md#513-auto-import-components)).

**Follow-ups**

- What Nitro buys you vs “Express next to Vite.”
- When you would still split a real API out of the Nuxt process.
- How you would migrate a Vue 2 + Nuxt 2 app (bridge vs rewrite).

---

### 6.2. Nuxt vs Vue

**What they actually ask**

A comparison table is the junior answer. Seniors map **which layer owns which problem**, especially vs a Vue SPA the company already has.

**How a senior answers**

- **Decision:** Vue owns **UI and reactivity**. Nuxt owns **when HTML is produced, how data is fetched for that HTML, how env is split, and how the server runs**. If the interview is “we have a Vue 3 SPA,” you add Nuxt for **public routes + hybrid**, not to rewrite the design system.
- **Constraint:** Nuxt routing is file-based (`pages/`). Exotic URL designs (all-in-one query-driven shells) fight `pages/` and `routeRules`. Vue Router guards still exist; Nuxt middleware is the SSR-aware version.
- **Failure mode:** Duplicating vue-router config beside `pages/`, or using Nuxt as a component library host.
- **Measure:** Number of routes that must be SEO-visible; whether auth cookies work on first request; bundle of `node_modules/.cache/nuxt` vs a Vite SPA.

| Layer | Vue SPA | Nuxt |
|---|---|---|
| UI | Vue 3 | Vue 3 |
| Routing | Manual vue-router | `pages/` + optional `router.options` |
| Rendering | Client only | Hybrid: SSR / SSG / SWR / CSR per route |
| Data | You invent cache | `useAsyncData` / `useFetch` + payload |
| Env | `import.meta.env` | `runtimeConfig` public vs private |
| Server | None | Nitro `server/` |
| State | Pinia you wire | Pinia module + SSR serialization |

**Tradeoffs**

- Vue SPA + separate BFF: clear process boundary, two deploys, you must invent the payload/hydration story if you later SSR.
- Nuxt monolith: one deploy, BFF in-process, easier cookies, easier to accidentally put CPU-heavy work on the page server.

**Production gotchas**

- `useFetch` in a Vue SPA **without** Nuxt does not exist — people copy snippets into Vite apps.
- Pinia in Vue SPA has no SSR payload; Nuxt’s Pinia module does. Do not assume they are identical.
- Client plugins that import Node-only modules will fail the server build even if “the page is CSR.”

**Follow-ups**

- Nuxt vs VitePress/SSG for a docs site.
- How much vue-router knowledge still matters (a lot: `meta`, navigation failures, scroll).
- Islands / server components vs “just Vue SFCs.”

---

### 6.3. CSR vs SSR vs SSG vs SPA

**What they actually ask**

They will let you define the four terms, then: **“How do you mix them in one app?”** That is `routeRules`, **payload**, **islands**, and **when not to SSR**. Hybrid rendering is the senior topic; the table is the warmup.

**How a senior answers**

- **Decision:** Pick the **cheapest correct HTML** per route. Public, cacheable, SEO-sensitive → SSG or SWR. Personalized but crawlable → SSR with cache keys that **do not** include secrets. Authenticated app chrome, chart-heavy dashboards, editors → **CSR (`ssr: false`)** or **client-only islands**. Do not SSR the world.
- **Constraint:** One Node/serverless process has a CPU budget. SSR of a 50-series dashboard for every navigation **will** melt TTFB under load. SSG cannot see per-user cookies at build time. SWR/ISR can serve **stale personalized HTML** if you key the cache wrong.
- **Failure mode:** Default SSR on `/dashboard/**` with Recharts/ECharts → hydration mismatch + huge HTML + server CPU. Or SSG for a prices page that must be fresh every minute with no revalidation. Or “SPA because SSR is hard” on the marketing site.
- **Measure:** TTFB and HTML bytes per route class; cache hit ratio on CDN; hydration warnings; origin CPU vs RPS; LCP on a cold cache vs warm.

**Rendering modes (the 30-second version)**

| Mode | HTML when | Good for | Wrong for |
|---|---|---|---|
| **CSR / SPA** | After JS | Auth shells, heavy widgets | Landing SEO, social crawlers |
| **SSR** | Each request | Personalized SEO, session-aware public pages | Expensive, user-specific canvases |
| **SSG** | At build | Docs, marketing, changelog | Per-user or rapidly changing catalog without rebuild |
| **SWR / ISR-like** | Build or first request, then revalidate | Catalog, blogs, semi-static | Strictly real-time / per-user |

SPA vs CSR: SPA is a **navigation architecture** (client router, no full reload). CSR is **where the HTML is built**. Nuxt can be an SPA (`ssr: false`) or a hybrid app that still **navigates like an SPA** after the first response.

**Hybrid: `routeRules`**

This is the production control plane. Example policy, not a recipe to copy blindly:

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

- **prerender / SSG:** HTML at build, CDN, no origin on hit.
- **swr:** serve cached HTML, revalidate in the background. Confirm your Nitro/CDN preset actually honors it.
- **ssr: true, cache: false:** per-request HTML (search with unique query strings).
- **ssr: false:** skip server render; send a shell; Vue runs only on the client.

Rules are **path policies**. They do not replace `useAsyncData` keys. A SWR page that fetches with a cookie-derived user id will **cache user A’s HTML for user B** unless you vary the cache or you did not SSR that page.

**When not to SSR**

- **Auth dashboards** behind login: crawlers do not see them; HTML is personalized; hydration cost is high; a SPA shell + client fetch is honest.
- **Charts / maps / canvas / WebGL:** server HTML is an empty box or a mismatch. SSR a heading + `ClientOnly` the widget (or `ssr: false` the route).
- **Rich text editors, design canvases:** same — no SEO value, hostile to hydration.
- **A/B or feature flags that only exist in `window`:** you will mismatch; decide on the server or don’t SSR the branch.
- **Highly fan-out pages** where origin CPU is the bill (infinite filter combinations) — cache at the data layer or CSR.

**Payload**

SSR is useless if the client **re-fetches and re-renders** the same tree. Nuxt extracts async data into a **payload** (`__NUXT__` / `_payload.json`) so hydration reuses server results.

- Keys (`useAsyncData('product:id')`) **are** the cache identity. Colliding keys mix pages; unique-per-instance keys destroy dedupe.
- `useNuxtData(key)` reads that cache without refetch.
- Payload size **is** your TBT/HTML budget. Returning a 2 MB search blob “because we have it” is a production incident.
- `pick` / `transform` exist to **shrink** what you serialize.

**Islands (Nuxt Island / server components)**

Islands render a **server snippet** that the client does not need to hydrate as a full Vue tree (or hydrates later). Use them for **mostly static, expensive-to-hydrate** blocks (markdown article body, pricing table) inside an otherwise interactive page. Do not island a component that is all `v-model`.

Constraint: islands have a **tighter data story** (props must be serializable; no leaking of request-only objects). Failure mode: island + client state that disagrees after a client navigation.

**Tradeoffs**

| Policy | TTFB | Server CPU | SEO | Hydration |
|---|---|---|---|---|
| Global SSR | Depends on origin | High | Strong | You pay it |
| Global CSR | Fast shell, slow content | Low | Weak | Only client |
| Hybrid `routeRules` | Tunable | Tunable | Tunable | Tunable |
| SSG + client islands | Best for static | Build-time | Strong | Small |

**Production gotchas**

- `routeRules` + middleware redirects: first request may still hit SSR before the client nav cache.
- Prerender crawling may miss authenticated or query-only URLs — they are not “SSG by accident.”
- `swr` + `Set-Cookie` on the page = **do not cache** or you leak sessions. Personalized HTML belongs in `private` cache or CSR.
- Payload vs CDN: if HTML is cached at the CDN and payload is not (or vice versa), you hydrate with the **wrong** data.

**Follow-ups**

- How you would run a **logged-in** account page and a **public** product page in one deploy.
- Incremental static regeneration vs “just SSR + Redis.”
- Nuxt vs Next mental map: `routeRules` ≈ segment config + caching headers; islands ≈ server components (not identical). See [Next.js](./nextjs.md) if the loop goes there.

---

### 6.4. Middleware

**What they actually ask**

Auth redirects. Seniors are graded on **SSR vs client execution**, **cookies vs localStorage**, and the line: **middleware is UX gating, not authorization**.

**How a senior answers**

- **Decision:** Use **route middleware** to redirect unauthenticated users and to choose layouts **before a page renders**. Hydrate auth **once** (cookie session → server-readable). Put **real** authorization on Nitro/API (`server/middleware` or the upstream service). Never read `localStorage` in middleware that runs on the server.
- **Constraint:** The same `defineNuxtRouteMiddleware` file can run on the **server** (first request) and on the **client** (subsequent navigations). It must be **idempotent**. It has `to` / `from`, not a raw Node `req`, unless you `useRequestEvent()` carefully (server-only).
- **Failure mode:** `localStorage.getItem('token')` → always logged-out on SSR → flash of login → client redirect the other way. Or middleware that POSTs analytics on every run (double fire). Or treating `abortNavigation(403)` as security while `server/api` is open.
- **Measure:** Redirect loops in server logs; extra `/me` calls per navigation; pages whose first HTML is the login shell for a logged-in cookie (wrong) or the dashboard for a logged-out user (worse).

**Three kinds**

| Kind | Declaration | Scope |
|---|---|---|
| **Global** | `middleware/auth.global.ts` | Every navigation |
| **Named** | `middleware/admin.ts` | `definePageMeta({ middleware: 'admin' })` |
| **Inline / route** | `definePageMeta({ middleware: [...] })` | That page |

Order: **global → named/route (array order)** → render. Keep globals tiny. A global that fetches is how you freeze TTFB.

**SSR vs client**

1. First hit: middleware runs **on the server** with cookies/headers. Return `navigateTo('/login')` and the user never sees the protected SFC HTML.
2. Client nav: middleware runs **in the browser**. You already have Pinia / `useState` if you hydrated correctly.
3. Branch with `import.meta.server` / `import.meta.client` for the rare side effect (never for the auth **decision** if cookies are available).
4. Do not `window` / `document` / `localStorage`. Session belongs in **httpOnly cookies** (XSS-resistant) or a payload-hydrated store filled on the server.
5. Heavy DB work belongs in **API / Nitro `server/middleware`**, not UI route middleware.

**Cookies vs localStorage**

| | Cookie (`httpOnly`, `Secure`, `SameSite`) | `localStorage` |
|---|---|---|
| SSR middleware | Visible as `Cookie` header | Invisible |
| XSS | httpOnly not readable by JS | Stolen easily |
| CSRF | `SameSite` + anti-CSRF on mutations | Bearer in JS, different CSRF profile |
| Interview line | Default for sessions | Not an auth source of truth |

If a third-party IdP forces a JS token, copy it into a **server-set cookie** via a BFF route; do not make middleware depend on `localStorage`.

**Not real auth**

Hiding `/admin` with middleware is **defense in depth + UX**. The admin API must check the session. Client-only role checks are bypassable. Interview one-liner: *middleware decides what HTML to try; the server decides what data exists.*

**Route middleware vs Nitro `server/middleware`**

| | Route middleware (`middleware/`) | Nitro `server/middleware` |
|---|---|---|
| Runs on | Navigating to a Nuxt page | Matching HTTP requests (pages + `/api`) |
| Purpose | Redirects, feature flags, UX | CORS, authn of APIs, rate limit, logging |
| Context | `to` / `from` | H3 `event` |
| Can protect `server/api` | No | Yes |

**Tradeoffs**

- Global auth middleware: no forgotten page; easy to accidentally wrap `/login` and loop (always exclude).
- Named per-page: easy to forget on a new admin route — lint `definePageMeta` or use a path prefix global.
- `ssr: false` routes: server middleware for `/api` still runs; route middleware may only run on client for that page’s navigation.

**Production gotchas**

- `navigateTo` in middleware during SSR should use `redirectCode` (302 vs 301) deliberately; 301-caching a login redirect is a support nightmare.
- `abortNavigation(createError({ statusCode: 404 }))` vs redirect: 404 is for “this id does not exist,” not for unauthenticated.
- Middleware that `await useFetch` creates **waterfalls** and can deadlock with payload. Read a **already hydrated** `useState` / Pinia.
- Vue Router guards still exist for SPA-only plugins; do not install a second auth gate that disagrees with Nuxt middleware.

**Follow-ups**

- How you hydrate the user once for SSR + client (Pinia plugin, `useState('user')`, `callOnce`).
- `definePageMeta({ middleware })` is compiled at build — it cannot be fully dynamic per user.
- Next `middleware.ts` is an **edge gate before the response** — closest Nuxt map is this route middleware plus some Nitro `server/middleware` concerns.

---

### 6.5. useAsyncData vs useFetch vs $fetch

**What they actually ask**

“Which one do you use?” They want **dedupe, keys, refresh, and client vs server** — and why `$fetch` in `setup` is a footgun on SSR.

**How a senior answers**

- **Decision:** `$fetch` for **imperative** calls (event handlers, Nitro handlers, plugins) with **no** payload integration. `useAsyncData` when you own the key and the handler (non-HTTP, compose two calls, custom cache). `useFetch` when it is an HTTP GET/POST that should participate in SSR payload — it is `useAsyncData` + `$fetch` with the **URL as default key**.
- **Constraint:** On SSR, composable fetches run on the server, results go into the payload, the client **must not refetch** unless `refresh` / the key changes. Duplicate keys share state (that is the feature). Missing keys or `$fetch` in `setup` **double-fetch** or **mismatch**.
- **Failure mode:** `$fetch('/api/x')` in `<script setup>` — runs on server **and** again on client, no dedupe, possible mismatch. `useFetch('/api/user/' + id)` without a stable key when `id` is empty then filled. `refresh()` storms on window focus you did not ask for (that is TanStack Query behavior — Nuxt does not unless you add it).
- **Measure:** Network panel on first load (one GET, not two). Payload size. In-flight abort on route change. Error/pending flags that survive client nav.

| API | SSR payload | Dedupe | Typical call site |
|---|---|---|---|
| `$fetch` | No | No (unless you wrap it) | `click`, plugins, `server/api` |
| `useAsyncData(key, handler)` | Yes | By **key** | Non-REST, composed, custom |
| `useFetch(url, opts)` | Yes | By URL + opts key | REST in SFCs |

**Keys**

- `useAsyncData('product:' + route.params.id, ...)` — explicit, greppable.
- `useFetch` default key includes URL and selected options. Changing `query` changes the key (good) unless you mutated an object in place (bad).
- Same key in parent and child: **one** request, shared `data`. That is how you avoid waterfalls **or** how you accidentally share the wrong product.
- `getCachedData` / `useNuxtData` for “read if warm.”

**Refresh, watch, lazy, server**

- `refresh()` / `refreshNuxtData(key)` — explicit. Use after mutations.
- `watch: [() => route.params.id]` (or `watch: true` on `useFetch` with reactive URL) — refetch when the source changes. Pair with abort.
- `lazy: true` — don’t block navigation; you will paint pending. Good for secondary widgets, bad for SEO-critical H1.
- `server: false` — client only; no HTML data, no payload. Charts, user-only widgets.
- `immediate: false` — wait for a submit.

**Client vs server**

- Handler should use `$fetch` / `event.$fetch` so it works in both. `window.fetch` to a relative URL can surprise you on the server (needs a host).
- Cookies: on server, `$fetch` in a composable **forwards the request cookies** when used correctly; a raw `fetch('https://api.internal')` may not. BFF routes exist for this.
- Do not touch `document` in the handler.

**Tradeoffs**

- Thin `useFetch` everywhere: fast DX, keys get messy, easy to over-fetch POST as GET.
- `useAsyncData` + repository function: testable handlers, you must name keys well.
- TanStack Query inside Nuxt: better stale-while-revalidate on the **client**; you must still not break SSR payload (or run Query client-only).

**Production gotchas**

- Deduped pending: two components with one key share `pending` — unmounting one should not cancel the other if the second still needs it. Know the version’s cancel semantics.
- `transform` / `pick` run before serialization — use them to drop fields (PII, huge nested includes).
- `useFetch` of a **POST** in setup will **replay** unless you `server: false` / call it in an event. Mutations do not belong in `setup`.
- Error is **not** thrown into Vue error boundaries by default; you must read `error` or `showError`.

**Follow-ups**

- `callOnce` vs `useAsyncData` for one-shot inits (auth hydrate, feature flags).
- `clearNuxtData` on logout so the next user on a shared browser does not see payload leftovers (usually process-isolated, but client cache is not).
- Parallel `useAsyncData` vs one handler with `Promise.all` (one key vs waterfall of components).

---

### 6.6. Plugins, runtimeConfig, env

**What they actually ask**

Where secrets live, and whether a plugin is **`.server` / `.client`**. They will ask you to leak a private key on purpose conceptually — they want you to refuse.

**How a senior answers**

- **Decision:** `runtimeConfig.public` for values the **browser may see** (CDN host, feature flags that are not secrets, Sentry DSN if you accept that risk). `runtimeConfig` private for **server-only** (API keys, DB, session secret). Env: `NUXT_PUBLIC_*` maps to public; `NUXT_*` to private. Plugins: default = both; `.server.ts` / `.client.ts` for environment; `provide` from the plugin instead of module-scope singletons.
- **Constraint:** `runtimeConfig` is **built into the server snapshot** and public keys are serialized to the client. Private keys in `public` are a security incident. `process.env.FOO` in a Vue SFC may be inlined at build — do not use it for per-deploy secrets; use runtimeConfig so **runtime** env on the host wins.
- **Failure mode:** `const secret = useRuntimeConfig().stripeSecret` in a composable called from a page → bundled or leaked via payload if you returned it. A plugin that `import`s `fs` without `.server`. Analytics plugin firing on SSR (fake pageviews).
- **Measure:** Search the client bundle for the secret string in CI. Plugin order tests (auth before API). Confirm preview/staging env vars actually override (runtime, not rebuild) if that is a requirement.

**Plugins**

- `defineNuxtPlugin` — `nuxtApp.provide('api', client)` then `useNuxtApp().$api`, or better a composable that `inject`s a typed key.
- Order: filename prefixes / `enforce` / `dependsOn` (version-dependent). Auth hydrate before stores that need the user.
- Vue plugin vs Nuxt plugin: `nuxtApp.vueApp.use(pinia)` is already done by the Pinia module; your job is **request-scoped** setup.
- SSR-safe: create clients **inside** `defineNuxtPlugin`, not at import. No global `cache = new Map()` for user data.

**Tradeoffs**

- Public runtimeConfig: inspectable, easy, easy to overshare.
- Private + BFF: client never sees the key; extra hop.
- Compile-time `import.meta.env`: fast, wrong for secrets that change without rebuild.

**Production gotchas**

- Logging `useRuntimeConfig()` in a client plugin dumps **public** config into logs — still can include internal URLs.
- `ssr: false` does not mean “private config is safe in the browser.” Private is **server**. No server, no private.
- Different env for Nitro vs Vite: if a var is only in `.env` and not available on the host, production silently falls back to the build-time default.
- Feature flags in public config are **not** access control.

**Follow-ups**

- How you would inject a per-request header (correlation id) into `$fetch`.
- Layers: `.env` < `.env.[env]` < real environment on the process.
- Why `useRuntimeConfig()` in `server/api` vs `useRuntimeConfig(event)` (request-aware overrides).

---

### 6.7. Nitro server routes vs BFF

**What they actually ask**

“Do you put the API in Nuxt?” Seniors talk **BFF**: aggregate, cookie session, hide upstream, vs when Nitro is the **wrong** place for the domain.

**How a senior answers**

- **Decision:** Use Nitro `server/api` / `server/routes` as a **BFF** for the UI: session cookies, aggregating 3 upstreams, stripping fields, mapping errors to 4xx the UI understands. Keep **domain of record** (billing, inventory, identity) in the services that own the data. Do not grow a second monolith inside `server/` because it was convenient on day one.
- **Constraint:** Nitro shares the **page origin** — cookies are easy (`same-site`), CORS often disappears. It also shares **CPU with SSR**. A 200 ms upstream waterfall on the BFF is a 200 ms TTFB on the page if you call it during render.
- **Failure mode:** Calling five microservices from `useFetch` in the browser (CORS, tokens in JS, waterfalls) instead of one BFF route. Or putting a batch job / websocket fan-out on the same process that renders HTML.
- **Measure:** RPS and p95 of `/api/*` vs page SSR; origin CPU; size of `server/` as a fraction of product logic; number of secrets in `runtimeConfig` vs upstream.

`server/api/users.get.ts` → `/api/users`. `server/routes/health.ts` → `/health`. `server/middleware` for CORS/auth on those handlers. `event.context` for the decoded session.

**Tradeoffs**

| | Browser → upstream | Nuxt BFF | Separate BFF |
|---|---|---|---|
| Cookies | Painful / CORS | Easy | Easy if same site |
| Token in JS | Often yes | No | No |
| Scale independently | Upstream only | Coupled to Nuxt | Yes |
| Local DX | Many mocks | One process | Two processes |

**Production gotchas**

- `$fetch('/api/x')` from SSR needs an internal URL; Nitro usually handles **same-app** routing without a loop through the public internet. Accidentally fetching `https://prod` from the server is a classic latency bug.
- Caching GET BFF routes that vary on cookie — **don’t**, or vary by session.
- File uploads / long SSE: serverless Nitro presets will time out; pick a Node preset or a dedicated service.
- `server/api` is still public HTTP. Middleware auth belongs here, not only in `pages/middleware`.

**Follow-ups**

- When to extract `server/` into its own service (CPU, team boundary, non-HTTP workloads).
- GraphQL BFF vs REST aggregators.
- How `routeRules` on `/api/**` (`cors`, `swr`) interact with authenticated endpoints.

---

### 6.8. Hydration, ClientOnly, lazy hydration

**What they actually ask**

A mismatch screenshot, or “why is this page interactive so late?” They want **causes**, **ClientOnly**, and **lazy/delayed hydration** — not “turn off SSR.”

**How a senior answers**

- **Decision:** Hydration must reuse SSR HTML. Make the tree **deterministic** (payload, same flags, valid HTML). Use `<ClientOnly>` for **true client-only** islands (maps, charts, widgets that touch `window` at render). Use **lazy hydration** (`hydrate-on-visible` / idle / interaction, `Lazy` components) for below-fold interactivity so you **keep HTML** but **defer JS**.
- **Constraint:** `ClientOnly` means crawlers and first paint **do not** see that subtree (placeholder slot only). Lazy hydration still **must match**; it only delays the Vue runtime attaching listeners.
- **Failure mode:** Wrapping the whole page in `ClientOnly` to silence warnings — you deleted SSR. Or hydrating a 3 MB dashboard at once so INP tanks. Or `v-if="mounted"` patterns that always mismatch unless the server rendered the same `false`.
- **Measure:** Hydration warnings in staging; TBT/INP; HTML vs visual for above-fold; how much JS runs before the user scrolls.

**Mismatch sources (Nuxt-specific extras)**

- Fetching again on the client with different results (`$fetch` in setup, no key).
- Date/time/locale (server UTC vs browser).
- Auth UI: server had cookie, client store not yet hydrated (or the reverse).
- Invalid HTML the browser repaired.
- Random IDs, `Date.now()` in template.
- Third-party scripts mutating DOM before Vue hydrates.

Fix data with **payload keys**. Fix auth with **server-readable session**. Fix widgets with **ClientOnly**. Surgical text: Vue `data-allow-mismatch` — last resort.

**ClientOnly**

```vue
<ClientOnly>
  <HeavyChart :series="series" />
  <template #fallback>
    <div class="chart-skeleton" />
  </template>
</ClientOnly>
```

The chart is not in SSR HTML. The skeleton is. No hydration of ECharts. SEO on the chart itself is zero — acceptable for dashboards; not for a price that must be crawlable (then SSR a number, client-only the canvas).

**Lazy hydration**

Nuxt can delay hydrating a component until **visible**, **idle**, or **interaction**. Combined with `LazyChart` async import, below-fold widgets do not compete with the LCP element.

Constraint: until hydrated, the island is **not interactive** (a carousel will not swipe). Do not lazy-hydrate the primary CTA. Server HTML should still look complete (real text, not empty).

**Tradeoffs**

| Technique | HTML content | JS cost | Interactivity |
|---|---|---|---|
| Full SSR + hydrate | Full | Immediate | Immediate |
| Lazy hydrate | Full | Deferred | Deferred |
| ClientOnly | Placeholder | After load | After load |
| `ssr: false` route | Shell | Whole page client | After load |

**Production gotchas**

- `ClientOnly` children still run `setup` on the **client** only; don’t assume `useAsyncData` inside ran on the server.
- Nested `ClientOnly` inside a lazy island: order of attach can surprise focus management.
- Hydration mismatch in **dev only** because of HMR / extra comments — verify with production build.
- Images: wrong dimensions cause layout shift that looks like a hydration bug and isn’t.

**Follow-ups**

- How this maps to Vue’s hydration mismatch notes ([vue3](./vue3.md#5211-hydration-mismatch)).
- Islands vs ClientOnly (server HTML without client Vue vs no server HTML).
- Why INP got worse after you “fixed SEO with SSR” on an internal tool.

---

[← Back to Overview](../../README-en.md)
