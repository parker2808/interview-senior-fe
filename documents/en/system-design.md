# System Design

This is a **45-minute frontend system design** round, not a folder-structure quiz. Interviewers watch whether you **clarify the product**, pick **SPA vs SSR vs hybrid**, draw **boxes with failure modes**, and talk **caching invalidation** — the hard part.

Run every answer as **decision → constraint → failure mode → measure.** Vue 3 / Nuxt-first; Next.js when they ask hybrid React or you need an RSC comparison.

---

## Table of Contents

1. [Frontend Architecture Decisions](#161-frontend-architecture-decisions)

2. [Caching Strategy](#162-caching-strategy)

3. [Component Library Design](#163-component-library-design)

4. [Example: Design a Large Dashboard](#164-example-design-a-large-dashboard)

5. [Example: Design a High-Traffic Marketing + App Hybrid](#165-example-design-a-high-traffic-marketing-app-hybrid)

---

## 16. System Design

### 16.1. Frontend Architecture Decisions

**What they actually ask**

“Design the frontend for X.” If you start with `src/components/base/`, you already lost the plot.

**How a senior answers**

- **Decision:** Spend the first **5–8 minutes on constraints**, then pick a **rendering model**, then draw **runtime boxes**, then APIs/state, then delivery (CDN, flags, observability). Folder structure is a **footnote**.
- **Constraint:** Architecture is boundaries, SLAs, and what happens when a box dies — not whether composables live in `/composables`.
- **Failure mode:** Designing a microfrontend platform for a 6-person team; SSR’ing an authenticated dashboard that didn’t need SEO; a SPA that cannot be crawled for a content site; ignoring auth, regions, and realtime until minute 40.
- **Measure:** you should **propose** measures: LCP/INP, TTFB, error budget, p95 API time for the screen, deploy rollback time, time-to-interactive on a mid-tier phone in the worst region.

#### How to run the interview (out loud)

Clarify, don’t assume:

| Ask | Why it changes the design |
| --- | --- |
| **Who is the user?** Internal ops vs anonymous consumer vs both | Auth, SEO, density of UI, a11y bar |
| **SEO / shareable URLs / OG?** | SSR/SSG vs SPA + prerender |
| **Realtime?** Ticks, collab, none | WS/SSE vs poll vs none (13.1) |
| **Regions / latency?** One DC vs global | CDN, edge, multi-region API, i18n |
| **Auth?** Cookie session, SSO, public | BFF, CSRF, SSR user payload |
| **Scale?** 100 DAU office tool vs 10M marketing | Caching, SSR cost, virtualization |
| **Team / deploy?** One team vs many | Packages vs MF (15.4) — default **one app** |
| **Offline / mobile WebView?** | SW, payload size |
| **SLAs?** “Search works if recs die” | Isolation, error boundaries, BFF timeouts |

Then **state the choice**:

- **SPA (Vite + Vue):** logged-in tools, weak SEO need, lots of interaction. Cheap hosting. You still need a **shell + CDN** and a BFF.
- **SSR (Nuxt):** first paint + SEO + personalization per request. Costs Node/Nitro, cache carefully.
- **SSG / ISR:** marketing, docs, catalogs that can be stale for N seconds.
- **Hybrid:** the usual adult answer — **route rules**. Marketing SSR/SSG, app CSR after auth, some ISR. Nuxt `routeRules` / Next `revalidate` + client islands.

Do **not** pick microfrontends unless they forced team/deploy constraints (15.4).

#### Draw boxes (whiteboard)

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

Talk through **one failure each**: CDN stale HTML, BFF timeout, WS drop, flag service down, JS 404 after deploy. Name the **user-visible** result and the mitigation (stale-while-revalidate, widget errors, flag fail-closed, cache-bust HTML).

#### Folder structure is not architecture

You may show a 10-line feature-folder tree ([15.5](./architecture.md#155-folder-and-feature-architecture)) to show you have shipped Vue. Then pivot:

- **Boundaries:** features cannot deep-import each other; BFF owns aggregation; DS is a package.
- **SLAs:** checkout p95, dashboard “usable if one widget fails,” marketing TTFB.
- **Failure modes:** session expiry (18.1), region failover, poison message on WS, deploy rollback (14.1).
- **Data:** server state (TanStack Query / `useAsyncData`) vs client UI state vs URL state.

**Tradeoffs**

- SSR CPU vs SEO/LCP.
- BFF vs FE waterfall. BFF almost always for dashboards.
- Edge rendering vs origin SSR (personalization vs cache hit ratio).

**Production gotchas**

- Hydration mismatch from `Date.now()`, `Math.random()`, flags, `window`.
- SPA fallback swallowing `/api` 404s.
- “Global” Pinia for server data that should be a query cache.

**Follow-ups**

- Multi-tenant theming?
- How would this look on Next App Router? (RSC for content, client for dashboard widgets — same hybrid idea)

---

### 16.2. Caching Strategy

**What they actually ask**

“How do you cache?” Juniors list `localStorage`. Seniors talk **layers and invalidation**.

**How a senior answers**

- **Decision:** Cache at the **outermost safe layer**: hashed statics on CDN forever; HTML/JSON with explicit TTL + **tags**; browser HTTP cache for public GETs; app memory / TanStack Query for session; SW only with a purge story. Never cache personalized HTML as `public`.
- **Constraint:** **Invalidation is the hard part.** Anyone can set `max-age`. Few can answer “user changed their avatar — which caches still lie?”
- **Failure mode:** `Cache-Control: public` on `/api/me`; SW serving a year-old `index.html` that points at deleted hashed files; Redis TTL 24h on prices; client cache not keyed by tenant/user; “hard refresh” as the invalidation strategy.
- **Measure:** cache hit ratio at CDN, **stale content incidents**, LCP vs TTL, origin QPS after deploy, purge latency.

#### Layers (browser → origin)

| Layer | What belongs | Invalidation |
| --- | --- | --- |
| **Browser HTTP** | Hashed `/_nuxt/x.js` `immutable`; some GET JSON | Change the hash / URL; ETag for unhashed |
| **Memory / Query** | Screen data, 10s–few min | Query key + `invalidateQueries` on mutation |
| **`localStorage` / IDB** | Preferences, draft, offline queue — **not** auth tokens if you can avoid it | Version key; wipe on logout |
| **CDN / edge** | HTML, public JSON, images | **Surrogate keys / tags**, purge on publish, short HTML TTL |
| **App / Nitro cache** | SSR payload, BFF aggregates | Tag per entity (`order:123`), request-scoped vs shared |
| **API / Redis** | Expensive joins | Same tags; don’t double-cache without a plan |
| **Service worker** | Precache hashed assets; network-first for HTML | Kill switch (`skipWaiting` + `max` version); never cache HTML forever |

#### Invalidation patterns you should name

- **Hash the filename** (content-addressed). Best cache. Deploy = new names. HTML must not be cached as long as the JS.
- **TTL:** acceptable for “good enough” (marketing ISR 60s). Wrong for inventory.
- **ETag / `If-None-Match`:** cheap polling (13.1).
- **Surrogate-Key / cache tags:** “purge everything tagged `product:9`.” This is how you stay sane. Nuxt/Nitro and CDNs (Fastly, Cloudflare Cache Tags) support the idea.
- **Event-driven purge:** on publish, BFF emits “invalidate `sku:9`.”
- **Key the cache:** `userId`, `locale`, `flag-bucket`, `currency`. Missing a key is a **security bug**, not a performance bug.

Nuxt specifics: `useAsyncData` keys, `cachedEventHandler`, SWR (`stale-if-error` / `stale-while-revalidate`). Next: `revalidate`, `revalidateTag`. Same design.

**Tradeoffs**

- Freshness vs origin cost vs complexity of tags.
- SW offline vs the infamous “users stuck on old app.” Many seniors **don’t** put a SW on a rapidly shipping SaaS.

**Production gotchas**

- `index.html` `max-age=31536000`.
- CDN ignoring `Set-Cookie` pages that were accidentally cached.
- Query cache showing user A’s orders to user B after login without key change (18.1).
- Clock skew and `max-age`.

**Follow-ups**

- How do you cache GraphQL? (persisted queries + GET, or mostly don’t at CDN)
- What do you cache in the service worker vs HTTP cache? (prefer HTTP for static)

---

### 16.3. Component Library Design

**What they actually ask**

“Design a component library for 4 product teams.”

**How a senior answers**

- **Decision:** Ship **tokens + accessible primitives + documented composition**, as a **versioned package** with peer `vue`. Ownership is a team (or guild) with a public roadmap. Consuming apps pin semver; they don’t fork buttons. Domain widgets stay in apps (15.6).
- **Constraint:** The DS is a **product**. A11y, theming, and compatibility matter more than a pretty Storybook.
- **Failure mode:** Library bundles Vue; no tokens (hex in every SFC); Icon button isn’t a real `<button>`; major bump every month; no owner so three “Button.vue” exist; visual tests only on Chrome desktop.
- **Measure:** adoption, a11y violations on primitives, time to add a variant, breakages per release, bundle bytes per imported component (tree-shake).

**Tokens**

- Color, type, space, radius, elevation, motion — CSS variables, semantic names (`--color-danger`), not `--blue-500` in apps.
- Dark mode: swap tokens, don’t duplicate components. SSR: class on `<html>` from cookie to avoid flash.

**A11y (non-negotiable for a DS)**

- Keyboard, focus order, names, `Dialog` focus trap, `Select` listbox pattern, color contrast on tokens.
- Don’t ship `div` click-widgets. Primitive APIs should make the **wrong thing hard**.
- Test: axe on stories, plus keyboard e2e for overlay widgets.

**Versioning and consuming apps**

- Semver: visual breaking change = **major** (padding that shifts layout is breaking).
- `exports` map, per-component entrypoints, `sideEffects` for CSS.
- Changelog + codemods for majors.
- Pin in apps; Renovate; don’t `workspace:*` forever if you have separate deploy clocks.

**Ownership**

- RFC for new primitives; “app-specific” requests get a **no** with an alternative composition.
- Contribution model: teams can PR, DS owners merge.

**Dark launching**

- `Button` v2 as `ButtonNext` or a flag inside the package, migrate one app, then switch the export. Same idea as product flags (14.4) but **library-level**.

**Tradeoffs**

- Headless (logic) + app styling vs styled kit. Styled + tokens is faster for one brand; headless if brands diverge hard.
- Mono package vs `@acme/ui-button`. Start mono, split if builds hurt.

**Production gotchas**

- CSS order: app utilities fighting DS.
- Duplicate icons 3 ways.
- Storybook-only components that don’t work in Nuxt SSR.

**Follow-ups**

- How do you visual-regression test? (Playwright/Chromatic, tokens as fixtures)
- React + Vue DS? (tokens shared, primitives native per framework — don’t wrap Vue in React)

---

### 16.4. Example: Design a Large Dashboard

**What they actually ask**

“Design an analytics / ops dashboard.” Use this as a **worked 45-minute outline**.

**How a senior answers**

- **Decision:** **SPA or CSR-heavy Nuxt** (SEO is usually irrelevant), **BFF aggregation**, **filters in the URL**, **virtualization** for large tables/charts, **permissions on the server** with UI that hides **and** cannot call, widget-level failure, optional SSE/WS for a few live cells — not a socket for the whole JSON blob.
- **Constraint:** Power users, dense UI, 10k–100k rows, 20 widgets, slow APIs, strict roles (view PII vs not). First load must show **something**; widgets are independently slow.
- **Failure mode:** 12 waterfalls from the browser; filters only in Pinia (unshareable, broken back button); rendering 50k DOM rows; hiding a button but leaving the endpoint; one thrown chart whitescreens the app; WS pushing full table replacements.
- **Measure:** time-to-first-widget, p95 of the BFF dashboard DTO, INP while scrolling, query param correctness, unauthorized API 403 rate, memory on a long-lived tab.

**Clarify (2 minutes)**

Internal users? How live? How many rows? Export? Multi-region? Saved views?

**Rendering**

- Shell + nav SSR optional; widgets client. `<ClientOnly>` for charts.
- Layout: grid of widgets, each with its own `useAsyncData` / query **or** one BFF payload split client-side if the backend is one expensive join. Don’t mix without thinking: N widgets × N APIs is the classic trap → **BFF `GET /bff/dashboard?…`**.

**Filters in the URL**

- `?from=&to=&status=&q=` as the source of truth. Vue Router query ↔ typed helper. Back button works, links are shareable, SSR/bookmark works.
- Don’t put secrets in the URL. Do put **view state** that isn’t personal-private.
- Debounce search; abort in-flight (13.5). Pagination cursor: usually **not** in the URL for infinite grids; page index **is** for paginated tables.

**Virtualization**

- Tables: TanStack Virtual / `vue-virtual-scroller`. Charts: don’t draw 100k points — downsample in the BFF.
- Measure DOM node count. Watch INP: virtualization + heavy cells (sparklines) still janks.

**Permissions**

- Roles from the session; **BFF strips fields** (email, cost). FE hides columns for UX, never as security.
- Widget catalog: if the user cannot see billing, the BFF doesn’t return billing, the route isn’t registered.
- Audit: exports go through an endpoint that logs.

**Realtime**

- Default: 30s poll + ETag, or SSE for “job done / count badges.”
- WS if multiple people edit ops queues. Identity on events; reconnect with cursor (13.1).

**Failure isolation**

- Error boundary **per widget** (19.2). Dashboard header still works.
- Timeouts per widget; show last good data + stale marker.

**Delivery**

- Auth’d, no CDN for JSON. Bundle: split chart vendor (12.3). Flags for new widgets.

**Tradeoffs**

- One fat BFF DTO vs parallel widget calls with a gateway timeout budget.
- URL for all filters vs saved views as server resources (URL holds `?view=id`).

**Production gotchas**

- Timezone in filters (`Z` vs local).
- “Select all 40k rows” operations.
- Memory leaks in chart libs on widget unmount.

**Follow-ups**

- How do you export CSV of the filtered set? (server-side, same query, not DOM)
- Mobile? (usually a different, reduced surface)

---

### 16.5. Example: Design a High-Traffic Marketing + App Hybrid

**What they actually ask**

“We have a marketing site and a logged-in product. One codebase or two? Nuxt or Next?”

**How a senior answers**

- **Decision:** **One Nuxt app (or Next) with hybrid route rules**, one design system, two **runtime profiles**: public content at the **edge/CDN** (SSG/ISR/SSR with high cache), app behind auth as **CSR/SSR-with-no-store**. Same repo, same tokens, different **caching and auth**. Split into two deploys only if org/release clocks demand it — not because the folders feel different.
- **Constraint:** Marketing cares about **CWV, SEO, OG, i18n, peak traffic (campaigns)**. App cares about **auth, correctness, INP**. A single global `Cache-Control` will either **leak personalization** or **kill SEO performance**.
- **Failure mode:** SSR’ing the entire logged-in app per request during a Super Bowl ad; caching HTML with a logged-in name; SPA for the blog (zero SEO); loading `echarts` on `/`; preview of CMS drafts publicly; cookie on `.com` breaking cache.
- **Measure:** LCP/INP on `/` from RUM (not only Lighthouse), TTFB cache hit ratio, origin CPU during a campaign, auth error rate, crawl success, bundle of `/` vs `/app`.

**Clarify**

Campaign traffic multiple? CMS? Personalization on the homepage (“Hi Ada”)? Regions/languages? App on `app.` subdomain vs `/app`?

**Boxes**

```
CDN (HTML cache keyed by path + locale, NOT cookie)
  ├─ /          ISR/SSG  (CMS)     — long cache, purge on publish
  ├─ /pricing   SSR/ISR            — A/B via edge bucket cookie carefully
  ├─ /blog/:id  ISR + OG
  └─ /app/**    no-store HTML      — shell + client app, BFF /api
Auth cookies: host-only on app host, or path-scoped — never cacheable pages
```

**Nuxt vs Next (say both, pick based on team)**

- **Nuxt:** Vue team, `routeRules` (`isr`, `ssr: false` for `/app/**`), Nitro BFF, `useAsyncData` payload. Natural if the product is Vue.
- **Next:** React team, App Router: RSC for content, client components for the app, `revalidateTag` on CMS publish. Same hybrid.
- Don’t run **two frameworks** unless two orgs already exist. Tokens + DS can still be shared.

**Auth and caching**

- Anonymous homepage: **no user cookie on the request** if you want CDN hits. Personalization via **edge fragment** or client after paint (“hydrate name”).
- Login: bounce to `/app` origin. Session cookie `Secure; HttpOnly; SameSite=Lax`.
- CMS preview: auth’d route, `noindex`, no CDN.

**Assets**

- Marketing JS: tiny. Split the app chunk so `/` does not download the dashboard (12.3).
- Images: Nuxt Image / CDN, explicit sizes (CLS).

**Realtime / BFF**

- Marketing: none. App: as 16.4 / 13.1.
- Forms (lead gen): POST to BFF, idempotency, bot protection — still FE-owned UX.

**Flags**

- Campaign kill switch at edge. Don’t wait for a full rebuild if the legal copy is wrong — CMS + purge.

**Tradeoffs**

- Subdomain (`app.`) vs path (`/app`): subdomain simplifies **cookie/cache isolation**; path simplifies absolute links and one CSP origin. Seniors pick isolation when cache incidents scare them.
- ISR 30s vs on-demand purge: purge on publish is better; TTL is the safety net.

**Production gotchas**

- `Vary: Cookie` on `/` → cache hit ratio ~0.
- OG images generated per request melting origin.
- i18n duplicate URLs without canonicals.
- App navigation using marketing layout (heavy analytics scripts on every `/app` route).

**Follow-ups**

- How do you A/B the hero without blowing cache? (edge bucket, `Vary` on a **single** bucketing cookie, or client-only experiment for non-SEO elements)
- How do you roll back a bad CMS publish? (previous content revision + purge tags)

---

[← Back to Overview](../../README-en.md)
