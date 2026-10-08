# Browser & Web APIs

Senior Web API interviews are architecture conversations with a price tag. IndexedDB, workers, and service workers are not “advanced HTML5.” They are **where you put work and data** so the UI thread stays interactive, with costs: quota, serialization, cache poisoning, multi-tab races, and an update UX you have to product-manage. If you recite a `indexedDB.open` snippet and cannot talk about version upgrades or abort, you are still mid.

Prefer Vue 3 + TS when wiring observers and abort signals. Mention React only when the same primitive shows up as a hook vs a composable. Offline, prefetch, and multi-tab logout are product decisions first.

---

## 4. Browser & Web APIs

## Table of Contents

1. [IndexedDB](#41-indexeddb)

2. [Web Workers](#42-web-workers)

3. [Service Workers & PWA](#43-service-workers--pwa)

4. [Intersection Observer](#44-intersection-observer)

5. [Modern APIs](#45-modern-apis)

6. [BroadcastChannel and Storage Events (multi-tab auth)](#46-broadcastchannel-and-storage-events-multi-tab-auth)

---

### 4.1. IndexedDB

**What they actually ask**

A field sales PWA must work in a basement, then sync. Or an editor autosaves huge documents. Why not `localStorage`? What happens when quota is exceeded, when version 12 meets a v11 tab still open, and when two tabs and the server disagree?

**How a senior answers**

IndexedDB is the **structured, async, origin-quota** store for large or indexed data (drafts, catalogs, outbox). Decision: IDB for megabytes and indexes; `localStorage`/`sessionStorage` for tiny sync flags you can afford to block on; Cache API for HTTP responses. I would not hand-roll IDB in 2026 — **Dexie** (or similar) for schema, live queries, and transactions. Constraint: IDB is async but **not free** — a giant scan on the main thread still janks; do heavy reads in a worker. Failure mode: `onupgradeneeded` that drops a store in production, or a `versionchange` that leaves one tab with a closed DB. Measure: `navigator.storage.estimate()`, a migration test from vN−1, and UI that never awaits a full table scan before first paint.

**Tradeoffs**

- Don’t IDB a 20-item preferences object. `localStorage` (or a cookie if the server needs it) is simpler and inspectable.
- Don’t `localStorage` a 4MB JSON dump. It is sync, string-only, ~5MB, and will freeze the tab on parse.
- Dexie vs raw IDB: Dexie is the default. Raw IDB is for a tiny wrapper you fully own, or when a platform constraint forbids the dep. It is not a badge of seniority.
- Persistence (`navigator.storage.persist()`) is a permissioned “please don’t evict me.” Treat eviction as normal on mobile Safari.
- Sync: last-write-wins with a `updatedAt` is honest and shippable. CRDTs are for collaborative editors, not a todo list. If you cannot describe the conflict UI, you are not ready to cache writes.

**Production gotchas**

- Quota: `QuotaExceededError` on write. Catch it, delete LRU, tell the user. Chrome vs Safari numbers differ; never hard-code 50MB.
- Version upgrades: bumping `open('app', 13)` runs `onupgradeneeded` only in that tab. Other tabs get `versionchange` and **must close** or the upgrade blocks (`onblocked`). A Vue app that keeps a long-lived Dexie instance must listen and reload.
- Never block first paint on IDB. Show the shell, then hydrate from IDB, then network (stale-while-revalidate).
- Indexes: you only query what you indexed. Scanning all records in the UI thread to “filter in memory” is why people hate IDB.
- SSR/Nuxt: IDB is browser-only. Guard `window`, don’t import Dexie at module scope on the server.
- Security: IDB is origin-scoped, not user-scoped. XSS reads it. Don’t store refresh tokens there; `httpOnly` cookies remain the senior auth store.
- Vue reactivity: wrapping a whole Dexie collection in `reactive()` is a footgun. Copy out the rows you render; liveQuery (Dexie) into a `ref`.

```ts
// Outbox: durable write, UI never waits on the full catalog.
type Draft = { id: string; rev: number; body: unknown; dirty: boolean }

async function saveDraft(db: Dexie, draft: Draft, signal: AbortSignal) {
  if (signal.aborted) return
  try {
    await db.transaction('rw', db.drafts, async () => {
      const prev = await db.drafts.get(draft.id)
      if (prev && prev.rev > draft.rev) throw new ConflictError(prev)
      await db.drafts.put(draft)
    })
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      await evictLru(db)
      throw e
    }
    throw e
  }
}
```

**Follow-ups**

1. `localStorage` vs IDB vs Cache API vs cookies — pick one for (a) theme, (b) 30MB catalog, (c) session, (d) hashed static assets.
2. A tab is open on v11, you deploy v12 with a new index. What events fire, and what should the old tab do?
3. How do you sync an offline outbox without double-POST? (idempotency key + server 409 + conflict UI)
4. Why is a Dexie `liveQuery` in `onMounted` still a leak if you don’t unsubscribe on unmount?
5. How would you prove a quota problem in the field (estimate API, error telemetry)?
6. Should IDB hold PII? What’s your eviction + XSS story?

---

### 4.2. Web Workers

**What they actually ask**

A 8MB JSON parse / CSV / image resize freezes input. A teammate spins a worker for a 3ms sort. They want **when the worker pays for itself**, what `postMessage` costs, transferables vs structured clone, SharedWorker, and Comlink.

**How a senior answers**

Workers are for **CPU** that would blow a 50ms long task: parse, crypto, codecs, tessellation — not for “async.” Decision: profile first (Performance panel). If the work is ~5ms, keep it on the main thread; the `postMessage` clone can cost more than the work. Constraint: workers have no DOM; you send DTOs. Structured clone **copies**. `transfer` of `ArrayBuffer` zeros the sender’s copy — that’s how you move a decoded frame cheaply. Failure mode: posting a Vue `reactive` proxy (clone throws or strips), or echoing a 20MB object every keystroke. Measure: long tasks gone from the main thread **and** total duration (clone + worker + clone back) vs in-place.

**Tradeoffs**

- Don’t worker tiny work. Don’t main-thread a 200ms parse because “workers are complicated.”
- **Comlink** makes an RPC that looks sync-async. Great DX; worse debuggability and a temptation to chatty APIs. I use it for a fat module; I use raw `postMessage` for one job / one result.
- `SharedWorker` (one worker, many tabs) is the right model for a shared connection or a shared IDB helper. Safari history here is why many teams still use a dedicated worker + BroadcastChannel.
- `SharedArrayBuffer` needs COOP/COEP headers. That’s a product/security conversation, not a one-line flag.
- React `useWorker` / VueUse `useWebWorkerFn` hide lifetime. You still terminate on unmount.

**Production gotchas**

- Serialization: functions, DOM, class prototypes, Vue proxies don’t clone. `toRaw` + a DTO. Dates become Dates (structured clone) — unlike JSON.
- Transfer list: after `postMessage(buf, [buf])`, the main thread’s `buf.byteLength === 0`. The next Vue render that reads it is a bug.
- Module workers (`new Worker(url, { type: 'module' })`) and Vite’s `?worker` / `new URL('./x.ts', import.meta.url)` — get the bundler story right or you ship a 404 in production.
- Error handling: `worker.onerror` vs a rejected promise inside; without it the UI hangs on “loading.”
- Pooling: one worker per component instance is how you have 40 threads on a dashboard. Share a pool.
- Hydration/SSR: no workers on the server. Same as IDB — client-only, `onMounted`.

```ts
// Pay for a worker only when parse is a long task. Transfer the buffer.
const worker = new Worker(new URL('./parse-csv.worker.ts', import.meta.url), { type: 'module' })

function parseOnWorker(buf: ArrayBuffer, signal: AbortSignal) {
  return new Promise<Row[]>((resolve, reject) => {
    const onAbort = () => worker.postMessage({ type: 'abort' })
    signal.addEventListener('abort', onAbort, { once: true })
    worker.addEventListener('message', (e: MessageEvent) => {
      signal.removeEventListener('abort', onAbort)
      if (e.data.type === 'ok') resolve(e.data.rows)
      else reject(e.data.error)
    }, { once: true })
    worker.postMessage({ type: 'parse', buf }, [buf]) // buf is now neutered
  })
}
```

**Follow-ups**

1. How do you decide worker vs `scheduler.yield()` vs `requestIdleCallback`?
2. Structured clone vs transfer vs JSON — cost and what each drops.
3. When is Comlink a mistake (chatty, or you needed transfer)?
4. Dedicated vs SharedWorker vs service worker — who owns a WebSocket?
5. Why did `postMessage(vueState)` throw, and what do you send instead?
6. How do you abort in-flight worker work when a Vue route changes?

---

### 4.3. Service Workers & PWA

**What they actually ask**

Not the PWA checklist. They want **cache poisoning**, `skipWaiting`, how users get an update, Workbox vs a hand-rolled `fetch` handler, and the sentence: **offline is a product decision**, not a strategy table.

**How a senior answers**

A service worker is a **network proxy with a cache**. Decision: cache hashed static assets (Cache First / Workbox precache); API GETs only with a policy the product understands (stale-while-revalidate for a news feed, Network First for a balance, no cache for authenticated mutating APIs). Constraint: the SW can outlive the tab and serve **old JS** that talks to a new API, or cache an error/HTML 200 from a captive portal. Failure mode: `skipWaiting()` + `clients.claim()` mid-session so two tabs run two bundles; or never updating because you didn’t build an “Refresh to update” UX. Measure: a kill-switch header, Workbox revisioned filenames, and a canary that a logged-in `/api/me` is **not** in Cache Storage.

**Tradeoffs**

- Workbox (precache + runtime strategies) is what I ship. Hand-rolling is how you forget `ignoreVary`, range requests, and opaque responses.
- `skipWaiting` immediately is snappy and dangerous. Waiting + a Vue banner “Update available” is the senior default for apps with in-flight forms.
- Offline-first is a product: which writes queue, what the user sees when sync fails, how you explain “saved on device.” If PM didn’t ask for that, a SW that caches the shell is enough — don’t fake a local-first app.
- App shell PWA vs “just installable” — installability without offline is a store listing, not architecture.
- Don’t SW a marketing site that A/B tests HTML. You will cache the wrong variant.

**Production gotchas**

- Cache poisoning: caching `GET /api/user` by URL while the cookie differs; caching `GET /search?q=` without a bound; caching opaque CDN failures; caching `index.html` forever so users never receive a new hashed bundle (precaching + `NavigationRoute` must revision `index.html`).
- `skipWaiting`: the waiting worker activates, `clients.claim()` takes open pages. In-memory Vue state is from the old world; in-flight POSTs may complete against code that no longer matches. Banner + reload is the honest UX.
- `fetch` handler that `cache.put`s POST/PUT — don’t. Only cache idempotent GETs you understand.
- Bypass in dev: your SW will fight Vite HMR if you register it locally. Disable in development.
- HTTPS only (localhost excepted). Mixed content and third-party scripts you cannot cache.
- iOS PWA: storage eviction, no reliable push historically, standalone display quirks. Don’t promise “native.”
- Security: an SW is a persistent MITM on your origin. XSS that registers a hostile SW is a nightmare. Restrict `scope`, and have a way to unregister (support kill-switch page).

```ts
// Update UX: let the waiting worker wait. Vue listens and prompts.
navigator.serviceWorker.addEventListener('controllerchange', () => {
  // only reload if we asked for it — naive reload loops
})

async function promptAndActivate() {
  const reg = await navigator.serviceWorker.getRegistration()
  await reg?.waiting?.postMessage({ type: 'SKIP_WAITING' })
}
```

Workbox equivalent: `registerSW({ onNeedRefresh() { showBanner() } })` — still a product surface, not a one-liner.

**Follow-ups**

1. Which Workbox strategy for (a) hashed JS, (b) product images, (c) `/api/account`, (d) checkout POST? Defend each.
2. What is cache poisoning in a SW, and how did a 200 HTML login page replace your API JSON?
3. Why is `skipWaiting` in `install` a support incident?
4. How do you ship a kill switch that unregisters SWs?
5. Offline outbox vs SW background sync vs periodic background sync — platform reality vs product promise.
6. How does a hashed `index.html` vs a CDN `no-cache` on the document interact with precache?

---

### 4.4. Intersection Observer

**What they actually ask**

Infinite scroll, ad viewability, or “prefetch the next route when the link is 200px away.” Why not `scroll` listeners? When is Intersection Observer **not** virtualization? Who `unobserve`s?

**How a senior answers**

IO tells you when a target crosses a **root + margin + threshold**. Decision: lazy images, infinite-list sentinels, impression analytics, route prefetch (`rootMargin: '200px'`). I do **not** attach `scroll` on `window` to toggle classes — that layout-thrashes. Constraint: IO is async and batched; it is not pixel-accurate for 16ms games. Failure mode: observing forever after the image loaded (listener + element retained), or using IO as a cheap virtualizer (you still mounted 10k Vue nodes). Measure: dropped scroll handlers in Performance, `unobserve` in the callback, and a virtualization lib (TanStack Virtual, `vue-virtual-scroller`) when the list is large.

**Tradeoffs**

- `rootMargin` prefetch is a network bet: you will fetch things the user never opens. Cap it (first N links, visible nav only).
- Thresholds `[0, 0.25, 0.5, 1]` for ads/viewability are a business contract, not a CSS nicety. Document them.
- `scroll` listeners with `passive: true` are still OK for parallax you already regret. They are not OK for “is this in view.”
- Virtualization libraries may use IO, `resize`, and absolute positioning. Don’t reimplement them in an interview beyond the idea.

**Production gotchas**

- Always `unobserve` (or `observer.disconnect()` on unmount). Vue `onUnmounted` + a `WeakMap` of elements.
- `root: null` is the viewport. A scrollable `div` must be passed as `root` or you will think IO is “broken.”
- iframe / overflow / CSS `contain`: the target never intersects. Check the actual scrollport.
- SSR: no IO on the server. Render a placeholder; observe in `onMounted`. Images still need `width`/`height` for CLS (see CSS layout).
- Hydration: don’t `v-if` content only after intersect if SEO/SSR needed it in HTML. Lazy **below** the fold, not the LCP image.
- React: missing deps vs Vue: a new `IntersectionObserver` every render if you put it in a `watch` without care.

```ts
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue
      prefetch(e.target.getAttribute('href')!)
      io.unobserve(e.target)
    }
  },
  { rootMargin: '200px 0px', threshold: 0 }
)

onMounted(() => {
  for (const a of links.value) io.observe(a)
})
onUnmounted(() => io.disconnect())
```

**Follow-ups**

1. Why is a window `scroll` listener a performance bug here? What does `passive` not fix?
2. How does `rootMargin: '400px'` interact with data cost on mobile?
3. Why is IO not virtualization? What goes wrong if you `v-for` 50k rows “but lazy-render images”?
4. Who is `root` in a modal with an inner scroller?
5. Viewability: 50% visible for 1s — can IO alone do time? (you still need a timer)
6. How do you test IO without waiting on a real viewport? (`boundingClientRect` mocks, or a sentinel in a fixture)

---

### 4.5. Modern APIs

**What they actually ask**

Awareness with production scars: **Clipboard** permissions and transient user activation, **ResizeObserver** loops, **AbortSignal** on more than `fetch`, **View Transitions** as something you’ve heard of and would not blindly turn on in Vue Router. They do not want a Geolocation hello-world.

**How a senior answers**

I treat modern platform APIs as **capability + permission + lifetime**. Clipboard write often works in a click handler; read is permissioned and will fail in a `watch` without user gesture. ResizeObserver is how a Vue chart sizes to a container (better than window `resize`); the failure mode is a loop (`ResizeObserver loop completed with undelivered notifications`) when you write styles that resize the observed node. AbortSignal is the cancellation primitive (fetch, `addEventListener({ signal })`, streams, `AbortSignal.timeout` / `.any`). View Transitions API is a progressive enhancement for same-document navigations — I would not promise it as a Vue Router animation strategy without a fallback and a reduced-motion path. Measure: permission states, loop warnings in console, aborted requests in Network, and `prefers-reduced-motion`.

**Tradeoffs**

- Clipboard: the old `execCommand('copy')` still appears in intranet IE-era code. The modern API is the default; it **fails** without a gesture and in some embedded WebViews. Always a visible “copied” / “failed” state, never assume.
- ResizeObserver vs window resize vs container queries: if CSS can do it (CQ), prefer CSS. RO is for JS layout (canvas, virtual lists, third-party).
- Don’t `new MutationObserver` to mimic Vue. That’s how you fight the framework. MO is for integrating non-Vue DOM (a legacy widget).
- View Transitions: still a moving target with Vue’s virtual DOM. Awareness is enough unless the team has a spike. Don’t sell it as a design-system foundation.

**Production gotchas**

- Clipboard: `navigator.clipboard.writeText` in Safari without user activation rejects. `readText` is a privacy prompt. Never put secrets on the clipboard without telling the user.
- ResizeObserver loops: observing `document.body`, then setting a class that changes height. Observe a dedicated inner el, or set `box: 'border-box'` carefully; debounce writes to the next frame.
- `AbortSignal.timeout(8_000)` on fetch is good; combining with a user abort via `AbortSignal.any` (see JavaScript 1.2.7).
- Permissions-Policy / iframe: geolocation, clipboard, camera will fail in an iframe without `allow=`.
- Notification API: a permission prompt on first visit is how you get denied-forever. Ask in context.
- Hydration: `window.matchMedia` / `innerWidth` in `setup` desyncs SSR. Gate on `onMounted` or CSS.

```ts
async function copyId(id: string) {
  try {
    await navigator.clipboard.writeText(id) // must be in a click/keydown stack
    toast('Copied')
  } catch {
    toast('Copy failed — select the id manually')
  }
}

const ro = new ResizeObserver((entries) => {
  const { width } = entries[0]!.contentBoxSize[0]!
  // write to a canvas, not to the observed element's height
  draw(width)
})
ro.observe(el, { box: 'content-box' })
onUnmounted(() => ro.disconnect())
```

**Follow-ups**

1. Why did clipboard fail in a `watch` but work in a button click?
2. What causes a ResizeObserver loop, and how do you break it?
3. Which APIs accept `AbortSignal` besides `fetch`? Why pass it to `addEventListener`?
4. View Transitions vs Vue `<Transition>` — when would you even consider the platform API?
5. How do Permissions-Policy and iframes change Geolocation/Clipboard answers?
6. MutationObserver vs Vue reactivity — when is MO actually justified?

---

### 4.6. BroadcastChannel and Storage Events (multi-tab auth)

**What they actually ask**

User logs out in tab A; tab B still shows the dashboard and keeps PATCHing as that user. Or login in A should refresh B. This is **multi-tab session** design, not a trivia API.

**How a senior answers**

`BroadcastChannel` is a same-origin message bus across tabs/windows (and dedicated workers). Decision: on logout, broadcast `{ type: 'session:end' }` and every tab clears in-memory state + routes to login. Constraint: it does **not** fire across browsers or devices; it is not a server push. The older `storage` event on `localStorage` fires in **other** tabs only, and only if the value **changes** — it does not fire in the tab that wrote, and it is a poor auth bus (XSS-readable store, stringify, quota). Failure mode: token in `localStorage` + polling, or assuming `storage` will notify the same tab. Measure: two tabs in a manual test and an e2e that opens a second page; after logout, no tab still has the user in Pinia.

**Tradeoffs**

- Best auth: **httpOnly cookie** + server invalidation + BroadcastChannel to tell tabs to drop **memory** (Pinia user, Vue Query cache). You still need the broadcast because cookies don’t emit to JS on change.
- Token in `localStorage` is convenient and XSS-complete. If you inherited it, `storage` events can sync logout, but I would still wrap a `BroadcastChannel` so the payload isn’t “please parse this JSON from a storage key.”
- `SharedWorker` can own a single session socket. More moving parts than BroadcastChannel for most Vue apps.
- Don’t use `localStorage` events for same-tab pub/sub. That’s `mitt`, Pinia, or a tiny emitter.

**Production gotchas**

- Safari / private mode quirks on storage; BroadcastChannel is the more predictable bus where it exists.
- Duplicate events: the tab that logs out should handle its own path **and** ignore its echo if you also write storage.
- Race: tab B has an in-flight POST after logout broadcast. Abort in-flight (`AbortController` per Vue scope) and ignore 401s after `session:end`.
- `storage` event `event.newValue === null` means removeItem. Don’t `JSON.parse(null)`.
- Vue/Pinia: a module-level channel you never close is fine; a per-component channel you don’t close on unmount leaks. One app-level composable `useSessionBus()`.
- Security: a channel name is not a secret. Any script on the origin can listen. XSS still owns the session; BC is UX consistency, not a security boundary.

```ts
const sessionBus = new BroadcastChannel('session')

export function useSessionBus() {
  function logoutHere() {
    piniaUser.reset()
    queryClient.clear()
    sessionBus.postMessage({ type: 'session:end' as const })
    router.replace('/login')
  }

  onMounted(() => {
    sessionBus.onmessage = (e: MessageEvent) => {
      if (e.data?.type === 'session:end') logoutHere()
    }
  })

  return { logoutHere }
}

// storage event: other tabs only, and only if you insist on syncing a legacy key
window.addEventListener('storage', (e) => {
  if (e.key === 'token' && e.newValue === null) {
    /* other tab cleared token — still not a substitute for BroadcastChannel */
  }
})
```

**Follow-ups**

1. Why doesn’t `window.addEventListener('storage', …)` fire in the tab that called `removeItem`?
2. Cookie-based auth: what, exactly, does BroadcastChannel still do on logout?
3. How do you abort in-flight Vue Query / Dexie writes after `session:end`?
4. Cross-tab login: do you broadcast the user object? Why that is a bad idea vs “refetch `/me`.”
5. `BroadcastChannel` vs `SharedWorker` vs `localStorage` ping — pick one for a 3-tab admin and defend cost.
6. What is *not* solved: two devices, or Chrome + Firefox on the same machine.

---

[← Back to Overview](../../README-en.md)
