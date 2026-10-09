# Browser & Web APIs

Phỏng vấn Web API senior là cuộc nói chuyện kiến trúc có giá. IndexedDB, worker, và service worker không phải “HTML5 nâng cao.” Chúng là **chỗ đặt work và data** để UI thread còn interactive, kèm cost: quota, serialization, cache poisoning, race multi-tab, và UX update bạn phải product-manage. Nếu bạn thuộc snippet `indexedDB.open` mà không nói version upgrade hoặc abort, bạn vẫn mid.

Ưu tiên Vue 3 + TS khi nối observer và abort signal. Nhắc React chỉ khi cùng primitive hiện như hook vs composable. Offline, prefetch, và logout multi-tab là quyết định product trước.

---

## 4. Browser & Web APIs

## Table of Contents

1. [IndexedDB](#41-indexeddb)

2. [Web Workers](#42-web-workers)

3. [Service Workers & PWA](#43-service-workers--pwa)

4. [Intersection Observer](#44-intersection-observer)

5. [Các API hiện đại khác](#45-các-api-hiện-đại-khác)

6. [BroadcastChannel và Storage Events (multi-tab auth)](#46-broadcastchannel-và-storage-events-multi-tab-auth)

---

### 4.1. IndexedDB

**Họ thực sự hỏi gì**

PWA sales field phải chạy dưới hầm, rồi sync. Hoặc editor autosave document khổng lồ. Vì sao không `localStorage`? Chuyện gì khi vượt quota, khi version 12 gặp tab v11 vẫn mở, và khi hai tab cùng server bất đồng?

**Cách senior trả lời**

IndexedDB là store **structured, async, origin-quota** cho data lớn hoặc có index (draft, catalog, outbox). Quyết định: IDB cho megabyte và index; `localStorage`/`sessionStorage` cho flag sync nhỏ bạn chịu block; Cache API cho HTTP response. Tôi không hand-roll IDB năm 2026 — **Dexie** (hoặc tương tự) cho schema, live query, và transaction. Constraint: IDB async nhưng **không miễn phí** — scan khổng lồ trên main thread vẫn jank; đọc nặng trong worker. Failure mode: `onupgradeneeded` drop store trên production, hoặc `versionchange` để một tab với DB đã đóng. Đo: `navigator.storage.estimate()`, test migration từ vN−1, và UI không bao giờ await full table scan trước first paint.

**Tradeoff**

- Đừng IDB object preference 20 item. `localStorage` (hoặc cookie nếu server cần) đơn giản và inspect được.
- Đừng `localStorage` dump JSON 4MB. Sync, chỉ string, ~5MB, freeze tab lúc parse.
- Dexie vs raw IDB: Dexie là default. Raw IDB cho wrapper nhỏ bạn sở hữu hết, hoặc constraint platform cấm dep. Không phải huy hiệu seniority.
- Persistence (`navigator.storage.persist()`) là “xin đừng evict” có permission. Coi eviction là bình thường trên mobile Safari.
- Sync: last-write-wins với `updatedAt` thật thà và ship được. CRDT cho editor cộng tác, không todo list. Không mô tả được conflict UI thì chưa sẵn sàng cache write.

**Gotcha production**

- Quota: `QuotaExceededError` lúc write. Catch, xóa LRU, nói user. Số Chrome vs Safari khác; đừng hard-code 50MB.
- Version upgrade: bump `open('app', 13)` chạy `onupgradeneeded` chỉ tab đó. Tab khác nhận `versionchange` và **phải close** không thì upgrade block (`onblocked`). Vue app giữ Dexie instance sống lâu phải listen và reload.
- Đừng block first paint trên IDB. Hiện shell, hydrate từ IDB, rồi network (stale-while-revalidate).
- Index: bạn chỉ query cái đã index. Scan mọi record trên UI thread “filter in memory” là lý do người ta ghét IDB.
- SSR/Nuxt: IDB chỉ browser. Guard `window`, đừng import Dexie module scope trên server.
- Security: IDB origin-scoped, không user-scoped. XSS đọc được. Đừng store refresh token đó; cookie `httpOnly` vẫn là auth store senior.
- Vue reactivity: wrap cả collection Dexie trong `reactive()` là footgun. Copy ra rows bạn render; liveQuery (Dexie) vào `ref`.

```ts
// Outbox: write bền, UI không đợi cả catalog.
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

**Câu hỏi nối**

1. `localStorage` vs IDB vs Cache API vs cookie — chọn một cho (a) theme, (b) catalog 30MB, (c) session, (d) hashed static asset.
2. Tab mở v11, bạn deploy v12 có index mới. Event nào fire, tab cũ phải làm gì?
3. Sync offline outbox không double-POST thế nào? (idempotency key + server 409 + conflict UI)
4. Vì sao Dexie `liveQuery` trong `onMounted` vẫn leak nếu không unsubscribe lúc unmount?
5. Chứng minh vấn đề quota ngoài field thế nào (estimate API, error telemetry)?
6. IDB có nên giữ PII? Câu chuyện eviction + XSS của bạn?

---

### 4.2. Web Workers

**Họ thực sự hỏi gì**

Parse JSON 8MB / CSV / resize ảnh freeze input. Đồng nghiệp spin worker cho sort 3ms. Họ muốn **khi nào worker trả giá được**, `postMessage` tốn gì, transferable vs structured clone, SharedWorker, và Comlink.

**Cách senior trả lời**

Worker cho **CPU** sẽ nổ long task 50ms: parse, crypto, codec, tessellation — không cho “async.” Quyết định: profile trước (Performance panel). Work ~5ms thì để main thread; clone `postMessage` có thể đắt hơn work. Constraint: worker không DOM; bạn gửi DTO. Structured clone **copy**. `transfer` `ArrayBuffer` zero copy phía sender — cách chuyển decoded frame rẻ. Failure mode: post Vue `reactive` proxy (clone throw hoặc strip), hoặc echo object 20MB mỗi phím. Đo: long task biến khỏi main thread **và** tổng duration (clone + worker + clone về) vs in-place.

**Tradeoff**

- Đừng worker việc tí. Đừng main-thread parse 200ms vì “worker phức tạp.”
- **Comlink** làm RPC trông sync-async. DX tốt; debug kém hơn và cám dỗ API nói nhiều. Tôi dùng cho module béo; raw `postMessage` cho một job / một result.
- `SharedWorker` (một worker, nhiều tab) đúng model cho connection share hoặc helper IDB share. Lịch sử Safari là lý do nhiều team vẫn dedicated worker + BroadcastChannel.
- `SharedArrayBuffer` cần header COOP/COEP. Đó là cuộc nói chuyện product/security, không flag một dòng.
- React `useWorker` / VueUse `useWebWorkerFn` giấu lifetime. Bạn vẫn terminate lúc unmount.

**Gotcha production**

- Serialization: function, DOM, class prototype, Vue proxy không clone. `toRaw` + DTO. Date thành Date (structured clone) — khác JSON.
- Transfer list: sau `postMessage(buf, [buf])`, `buf.byteLength === 0` trên main thread. Vue render sau đọc nó là bug.
- Module worker (`new Worker(url, { type: 'module' })`) và Vite `?worker` / `new URL('./x.ts', import.meta.url)` — bundler story phải đúng không thì ship 404 production.
- Error handling: `worker.onerror` vs promise reject bên trong; thiếu thì UI treo “loading.”
- Pooling: một worker mỗi component instance là cách có 40 thread trên dashboard. Share pool.
- Hydration/SSR: không worker trên server. Như IDB — client-only, `onMounted`.

```ts
// Trả giá worker chỉ khi parse là long task. Transfer buffer.
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
    worker.postMessage({ type: 'parse', buf }, [buf]) // buf giờ neutered
  })
}
```

**Câu hỏi nối**

1. Quyết định worker vs `scheduler.yield()` vs `requestIdleCallback` thế nào?
2. Structured clone vs transfer vs JSON — cost và mỗi cái drop gì.
3. Khi nào Comlink là sai (nói nhiều, hoặc bạn cần transfer)?
4. Dedicated vs SharedWorker vs service worker — ai sở hữu WebSocket?
5. Vì sao `postMessage(vueState)` throw, và bạn gửi gì thay?
6. Abort work worker in-flight khi Vue route đổi thế nào?

---

### 4.3. Service Workers & PWA

**Họ thực sự hỏi gì**

Không phải checklist PWA. Họ muốn **cache poisoning**, `skipWaiting`, user nhận update thế nào, Workbox vs `fetch` handler viết tay, và câu: **offline là quyết định product**, không phải bảng strategy.

**Cách senior trả lời**

Service worker là **network proxy có cache**. Quyết định: cache hashed static asset (Cache First / Workbox precache); API GET chỉ với policy product hiểu (stale-while-revalidate cho news feed, Network First cho số dư, không cache authenticated mutating API). Constraint: SW sống lâu hơn tab và phục vụ **JS cũ** nói chuyện API mới, hoặc cache error/HTML 200 từ captive portal. Failure mode: `skipWaiting()` + `clients.claim()` giữa session nên hai tab chạy hai bundle; hoặc không bao giờ update vì không dựng UX “Refresh to update.” Đo: header kill-switch, Workbox filename có revision, và canary `/api/me` logged-in **không** nằm Cache Storage.

**Tradeoff**

- Workbox (precache + runtime strategy) là thứ tôi ship. Hand-roll là cách quên `ignoreVary`, range request, và opaque response.
- `skipWaiting` ngay thì nhanh và nguy hiểm. Wait + Vue banner “Update available” là default senior cho app có form in-flight.
- Offline-first là product: write nào queue, user thấy gì khi sync fail, giải thích “saved on device” thế nào. PM không hỏi thì SW cache shell đủ — đừng giả local-first app.
- App shell PWA vs “chỉ install được” — installability không offline là listing store, không phải architecture.
- Đừng SW marketing site A/B test HTML. Bạn sẽ cache nhầm variant.

**Gotcha production**

- Cache poisoning: cache `GET /api/user` theo URL trong khi cookie khác; cache `GET /search?q=` không bound; cache opaque CDN fail; cache `index.html` mãi nên user không nhận hashed bundle mới (precache + `NavigationRoute` phải revision `index.html`).
- `skipWaiting`: waiting worker activate, `clients.claim()` lấy page mở. In-memory Vue state thuộc thế giới cũ; POST in-flight có thể complete với code không còn khớp. Banner + reload là UX thật thà.
- `fetch` handler `cache.put` POST/PUT — đừng. Chỉ cache GET idempotent bạn hiểu.
- Bypass dev: SW đánh nhau với Vite HMR nếu register local. Disable development.
- HTTPS only (trừ localhost). Mixed content và third-party script bạn không cache được.
- iOS PWA: storage eviction, push historically không tin cậy, quirk standalone display. Đừng hứa “native.”
- Security: SW là MITM bền trên origin bạn. XSS register SW thù địch là ác mộng. Restrict `scope`, và có cách unregister (trang kill-switch support).

```ts
// UX update: để waiting worker đợi. Vue listen và prompt.
navigator.serviceWorker.addEventListener('controllerchange', () => {
  // chỉ reload nếu ta chủ động hỏi — reload ngây thơ sẽ loop
})

async function promptAndActivate() {
  const reg = await navigator.serviceWorker.getRegistration()
  await reg?.waiting?.postMessage({ type: 'SKIP_WAITING' })
}
```

Tương đương Workbox: `registerSW({ onNeedRefresh() { showBanner() } })` — vẫn là bề mặt product, không phải one-liner.

**Câu hỏi nối**

1. Strategy Workbox nào cho (a) hashed JS, (b) ảnh product, (c) `/api/account`, (d) checkout POST? Bảo vệ từng cái.
2. Cache poisoning trong SW là gì, và 200 HTML login page thay API JSON của bạn thế nào?
3. Vì sao `skipWaiting` trong `install` thành sự cố support?
4. Ship kill switch unregister SW thế nào?
5. Offline outbox vs SW background sync vs periodic background sync — thực tế platform vs lời hứa product.
6. Hashed `index.html` vs CDN `no-cache` trên document tương tác precache thế nào?

---

### 4.4. Intersection Observer

**Họ thực sự hỏi gì**

Infinite scroll, ad viewability, hoặc “prefetch route kế khi link còn 200px.” Vì sao không listener `scroll`? Khi nào Intersection Observer **không** phải virtualization? Ai `unobserve`?

**Cách senior trả lời**

IO nói khi target cắt **root + margin + threshold**. Quyết định: lazy ảnh, sentinel infinite-list, impression analytics, route prefetch (`rootMargin: '200px'`). Tôi **không** gắn `scroll` trên `window` để toggle class — cái đó layout-thrash. Constraint: IO async và batched; không pixel-accurate cho game 16ms. Failure mode: observe mãi sau khi ảnh load (listener + element retain), hoặc dùng IO như virtualizer rẻ (bạn vẫn mount 10k Vue node). Đo: drop scroll handler trên Performance, `unobserve` trong callback, và lib virtualization (TanStack Virtual, `vue-virtual-scroller`) khi list lớn.

**Tradeoff**

- Prefetch `rootMargin` là cược network: bạn fetch thứ user không mở. Cap (N link đầu, chỉ nav visible).
- Threshold `[0, 0.25, 0.5, 1]` cho ads/viewability là business contract, không phải CSS đẹp. Document chúng.
- Listener `scroll` với `passive: true` vẫn OK cho parallax bạn đã hối. Không OK cho “cái này in view chưa.”
- Lib virtualization có thể dùng IO, `resize`, và absolute positioning. Đừng reimplement lúc interview ngoài ý tưởng.

**Gotcha production**

- Luôn `unobserve` (hoặc `observer.disconnect()` lúc unmount). Vue `onUnmounted` + `WeakMap` element.
- `root: null` là viewport. `div` scroll được phải pass làm `root` không thì bạn nghĩ IO “hỏng.”
- iframe / overflow / CSS `contain`: target không bao giờ intersect. Check scrollport thật.
- SSR: không IO trên server. Render placeholder; observe trong `onMounted`. Ảnh vẫn cần `width`/`height` cho CLS (xem CSS layout).
- Hydration: đừng `v-if` content chỉ sau intersect nếu SEO/SSR cần nó trong HTML. Lazy **dưới** fold, không ảnh LCP.
- React: thiếu deps vs Vue: `IntersectionObserver` mới mỗi render nếu nhét vào `watch` không cẩn.

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

**Câu hỏi nối**

1. Vì sao listener `scroll` trên window là bug performance ở đây? `passive` không sửa gì?
2. `rootMargin: '400px'` tương tác data cost trên mobile thế nào?
3. Vì sao IO không phải virtualization? `v-for` 50k row “nhưng lazy-render ảnh” sai ở đâu?
4. `root` là ai trong modal có scroller trong?
5. Viewability: 50% visible 1s — IO một mình làm time được không? (vẫn cần timer)
6. Test IO không đợi viewport thật thế nào? (mock `boundingClientRect`, hoặc sentinel trong fixture)

---

### 4.5. Các API hiện đại khác

**Họ thực sự hỏi gì**

Awareness kèm sẹo production: **Clipboard** permission và transient user activation, loop **ResizeObserver**, **AbortSignal** ngoài `fetch`, **View Transitions** như thứ bạn đã nghe và không bật mù trong Vue Router. Họ không muốn hello-world Geolocation.

**Cách senior trả lời**

Tôi coi modern platform API là **capability + permission + lifetime**. Clipboard write thường chạy trong click handler; read có permission và fail trong `watch` không user gesture. ResizeObserver là cách Vue chart size theo container (hơn window `resize`); failure mode là loop (`ResizeObserver loop completed with undelivered notifications`) khi bạn ghi style làm node đang observe resize. AbortSignal là primitive cancellation (fetch, `addEventListener({ signal })`, stream, `AbortSignal.timeout` / `.any`). View Transitions API là progressive enhancement cho same-document navigation — tôi không hứa nó như strategy animation Vue Router thiếu fallback và path reduced-motion. Đo: permission state, warning loop console, request aborted trên Network, và `prefers-reduced-motion`.

**Tradeoff**

- Clipboard: `execCommand('copy')` cũ vẫn xuất hiện code intranet đời IE. API hiện đại là default; nó **fail** không gesture và một số embedded WebView. Luôn state “copied” / “failed” nhìn thấy, đừng assume.
- ResizeObserver vs window resize vs container query: CSS làm được (CQ) thì prefer CSS. RO cho JS layout (canvas, virtual list, third-party).
- Đừng `new MutationObserver` để bắt chước Vue. Đó là cách đánh nhau với framework. MO để integrate DOM không-Vue (widget legacy).
- View Transitions: vẫn mục tiêu động với virtual DOM Vue. Awareness đủ trừ khi team có spike. Đừng bán làm nền design-system.

**Gotcha production**

- Clipboard: `navigator.clipboard.writeText` Safari không user activation thì reject. `readText` là privacy prompt. Đừng để secret lên clipboard mà không nói user.
- ResizeObserver loop: observe `document.body`, rồi set class đổi height. Observe inner el dành riêng, hoặc set `box: 'border-box'` cẩn; debounce write sang frame sau.
- `AbortSignal.timeout(8_000)` trên fetch tốt; gộp user abort qua `AbortSignal.any` (xem JavaScript 1.2.7).
- Permissions-Policy / iframe: geolocation, clipboard, camera fail trong iframe không `allow=`.
- Notification API: prompt permission visit đầu là cách bị denied-forever. Hỏi trong context.
- Hydration: `window.matchMedia` / `innerWidth` trong `setup` desync SSR. Gate `onMounted` hoặc CSS.

```ts
async function copyId(id: string) {
  try {
    await navigator.clipboard.writeText(id) // phải nằm stack click/keydown
    toast('Copied')
  } catch {
    toast('Copy failed — select the id manually')
  }
}

const ro = new ResizeObserver((entries) => {
  const { width } = entries[0]!.contentBoxSize[0]!
  // ghi canvas, không ghi height của element đang observe
  draw(width)
})
ro.observe(el, { box: 'content-box' })
onUnmounted(() => ro.disconnect())
```

**Câu hỏi nối**

1. Vì sao clipboard fail trong `watch` nhưng chạy trong button click?
2. ResizeObserver loop do đâu, và phá thế nào?
3. API nào nhận `AbortSignal` ngoài `fetch`? Vì sao pass vào `addEventListener`?
4. View Transitions vs Vue `<Transition>` — khi nào thậm chí cân nhắc platform API?
5. Permissions-Policy và iframe đổi câu Geolocation/Clipboard thế nào?
6. MutationObserver vs Vue reactivity — khi nào MO thật sự justified?

---

### 4.6. BroadcastChannel và Storage Events (multi-tab auth)

**Họ thực sự hỏi gì**

User logout tab A; tab B vẫn hiện dashboard và tiếp tục PATCH với user đó. Hoặc login A nên refresh B. Đây là thiết kế **multi-tab session**, không trivia API.

**Cách senior trả lời**

`BroadcastChannel` là message bus same-origin xuyên tab/window (và dedicated worker). Quyết định: lúc logout, broadcast `{ type: 'session:end' }` và mọi tab clear in-memory state + route login. Constraint: **không** fire xuyên browser hay device; không phải server push. Event `storage` cũ trên `localStorage` fire ở tab **khác** thôi, và chỉ khi value **đổi** — không fire tab vừa viết, và là auth bus kém (store XSS đọc được, stringify, quota). Failure mode: token trong `localStorage` + polling, hoặc giả định `storage` notify cùng tab. Đo: hai tab test tay và e2e mở page thứ hai; sau logout không tab nào còn user trong Pinia.

**Tradeoff**

- Auth tốt nhất: **cookie httpOnly** + server invalidation + BroadcastChannel bảo tab drop **memory** (Pinia user, Vue Query cache). Vẫn cần broadcast vì cookie không emit sang JS lúc đổi.
- Token `localStorage` tiện và XSS-complete. Nếu thừa kế, `storage` event sync logout được, nhưng tôi vẫn wrap `BroadcastChannel` để payload không phải “parse JSON từ storage key.”
- `SharedWorker` có thể sở hữu một session socket. Nhiều moving part hơn BroadcastChannel cho hầu hết Vue app.
- Đừng dùng event `localStorage` cho pub/sub cùng tab. Đó là `mitt`, Pinia, hoặc emitter nhỏ.

**Gotcha production**

- Safari / private mode quirk trên storage; BroadcastChannel là bus đoán được hơn nơi nó có.
- Duplicate event: tab logout phải handle path của nó **và** ignore echo nếu cũng ghi storage.
- Race: tab B có POST in-flight sau logout broadcast. Abort in-flight (`AbortController` mỗi Vue scope) và ignore 401 sau `session:end`.
- `storage` event `event.newValue === null` nghĩa là removeItem. Đừng `JSON.parse(null)`.
- Vue/Pinia: channel module-level không close thì ổn; channel per-component không close lúc unmount thì leak. Một composable app-level `useSessionBus()`.
- Security: tên channel không phải secret. Mọi script trên origin listen được. XSS vẫn sở hữu session; BC là UX consistency, không phải security boundary.

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

// storage event: chỉ tab khác, và chỉ nếu bạn cố sync key legacy
window.addEventListener('storage', (e) => {
  if (e.key === 'token' && e.newValue === null) {
    /* tab khác clear token — vẫn không thay BroadcastChannel */
  }
})
```

**Câu hỏi nối**

1. Vì sao `window.addEventListener('storage', …)` không fire ở tab gọi `removeItem`?
2. Auth cookie: BroadcastChannel vẫn làm gì đúng lúc logout?
3. Abort Vue Query / Dexie write in-flight sau `session:end` thế nào?
4. Cross-tab login: bạn broadcast user object? Vì sao tệ hơn “refetch `/me`.”
5. `BroadcastChannel` vs `SharedWorker` vs ping `localStorage` — chọn một cho admin 3 tab và bảo vệ cost.
6. Cái *không* giải: hai device, hoặc Chrome + Firefox trên cùng máy.

---

[← Back to Overview](../../README.md)
