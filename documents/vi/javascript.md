# JavaScript

Phỏng vấn senior gần như không bao giờ bắt bạn thuộc lòng `map` vs `filter`. Họ xem bạn có giữ UI Vue/React đúng khi có race, mutation, và áp lực memory không: bảng 100k rows, dashboard waterfall bốn API, leak chỉ lộ sau một giờ trong DevTools. Thước đo là judgment — mutate cái gì, cancel cái gì, đo cái gì — không phải thuộc snippet giáo trình.

Coi mỗi câu hỏi JS như một lần debug production: nêu constraint (main thread, identity, GC), failure mode (UI stale, freeze, leak), và cách chứng minh fix (Profiler, Performance panel, test fail trước).

---

## Table of Contents

1. **Core Concepts**

   1.1. [High-order Array Functions](#111-high-order-array-functions)

   1.2. [Promise vs Async/Await](#112-promise-vs-asyncawait)

   1.3. [Event Loop, Microtask, Macrotask](#113-event-loop-microtask-macrotask)

   1.4. [var vs let vs const](#114-var-vs-let-vs-const)

2. **Advanced Concepts**

   2.1. [Closure & Scope](#121-closure--scope)

   2.2. [Prototypes & Inheritance](#122-prototypes--inheritance)

   2.3. [`this` Keyword](#123-this-keyword)

   2.4. [ES6+ Modern Features](#124-es6-modern-features)

   2.5. [Memory Management & Garbage Collection](#125-memory-management--garbage-collection)

   2.6. [Hoisting & Temporal Dead Zone](#126-hoisting--temporal-dead-zone)

   2.7. [AbortController, Concurrency và Cancellation](#127-abortcontroller-concurrency-và-cancellation)

---

## I. Core Web Technologies

## 1. JavaScript

### 1.1. Core Concepts

#### 1.1.1. High-order Array Functions

**Họ thực sự hỏi gì**

Bạn sở hữu một bảng Vue 3 (hoặc list React) bind vào `rows`. Đồng nghiệp viết `rows.sort(byName).filter(isActive).map(toView)`. Thứ tự gốc mất, child nhận `rows` qua prop mutate parent, page giật trên 100k records. Vì sao, và bạn ship cái gì thay thế?

**Cách senior trả lời**

Quyết định trước: **mutate reactive source bạn sở hữu; copy khi mảng shared, là prop, hoặc là view suy ra.** Proxy Vue 3 đã observe thay đổi index/length, nên `push`/`splice` in-place trên state bạn sở hữu thường rẻ và đúng hơn. React so identity, nên `sort` in-place rồi `setRows(rows)` là no-op im lặng. Failure mode là aliasing tình cờ: `sort`, `reverse`, và `splice` mutate rồi trả cùng reference, nên “tôi đã sort một bản copy” là nói dối. Đo bằng Profiler (copy thừa vs miss update) và unit test assert thứ tự mảng nguồn sau khi render view suy ra. List lớn: một pass (`for…of` hoặc `reduce` fold thật) hơn `filter + map + sort` cấp phát ba mảng; virtualize DOM, đừng micro-optimize fold cho đến khi flame chart nói fold mới là vấn đề.

**Tradeoff**

- **Đừng** clone 100k rows mỗi phím “cho immutability.” Đó là thói quen React áp vào Vue, và sẽ thua update in-place cộng `v-for` có key.
- **Đừng** dùng `reduce` như `for` khoe. Nếu accumulator là object bạn mutate qua nhiều nhánh, `for…of` đặt tên rõ hơn khi review và dễ breakpoint.
- `toSorted` / `toReversed` / `toSpliced` là default đúng cho view **suy ra**. Không phải lý do copy trong Pinia action nóng đã sở hữu mảng.
- Chain `filter+map` là documentation tốt khi dataset nhỏ và pipeline *chính là* spec. Một pass khi bạn cần count, group, và list mà không đi data ba lần.

**Gotcha production**

- Default `sort()` là lexical: `[10, 2, 1].sort()` → `[1, 10, 2]`. Luôn truyền comparator, và đừng sort trong `computed` mà mutate dependency.
- Sparse array: `map`/`filter`/`forEach` bỏ lỗ; `[...arr]` và `Array.from` materialize `undefined`; `for…of` yield `undefined` cho lỗ. Payload API có index bị xóa cắn code CSV/export.
- Vue: mutate mảng **prop** (hoặc Pinia `readonly()`) hoặc warn hoặc desync parent im lặng. Prop thuộc caller; emit hoặc copy.
- React: `list.sort()` mutate state array trong cùng fiber render — concurrent feature biến đây thành heisenbug thật, không phải nit style.
- `find` vs `filter[0]`: `find` dừng sớm; cả hai sai nếu predicate match nhầm row vì so `==` trên branded id.

```ts
// View suy ra: copy. Source of truth: để yên.
const visible = computed(() =>
  rows.value.toSorted((a, b) => a.name.localeCompare(b.name)).filter((r) => r.active)
)

// One-pass: 100k rows vừa lookup vừa đếm — không phải bài reduce.
function indexById(rows: readonly Row[]) {
  const byId = new Map<string, Row>()
  let active = 0
  for (const row of rows) {
    byId.set(row.id, row)
    if (row.active) active++
  }
  return { byId, active }
}
```

**Câu hỏi nối**

1. `const next = items.sort(cmp)` — `next === items` là gì? Vue vs React làm gì với assignment đó?
2. Vì sao `toSorted` trong `computed` an toàn, còn `sort` trong `computed` là bug state?
3. Khi nào virtualize (`content-visibility`, TanStack Virtual, `vue-virtual-scroller`) thay vì array method nhanh hơn?
4. Sort list 100k mà không block input thế nào? (chunk, worker, hoặc sort trên server)
5. Sparse vs empty: compact lỗ trước khi PATCH “removed indexes” ra sao?
6. Vì sao `rows.filter(Boolean)` có thể drop cell `0` / `''` hợp lệ trong UI spreadsheet?

---

#### 1.1.2. Promise vs Async/Await

**Họ thực sự hỏi gì**

Dashboard `setup()` làm `const user = await getUser(); const posts = await getPosts(user.id); const flags = await getFlags()`. Flags không phụ thuộc user. Một trong ba 500 và page treo spinner. Walk through parallelism, failure policy, cancellation, và retry.

**Cách senior trả lời**

`async/await` là syntax control-flow; quyết định là **combinator nào và abort signal nào**. Call độc lập đi `Promise.all` (fail-fast: một reject hủy cả nhóm — đúng nếu page không render thiếu cái nào). UI hiện được partial (flags optional) thì `allSettled` hoặc tách critical path khỏi optional. Waterfall chỉ khi data phụ thuộc thật (`posts` cần `user.id`). Constraint: `await` yield sang microtask queue — **không** block event loop, nhưng chuỗi await đã resolve vẫn đói paint. Failure mode: `catch { console.error }` rỗng trả `undefined` rồi vẽ empty state trông như “không có data.” Đo: waterfall Network panel (initiator chain), TTFB vs compute, integration test reject một nhánh rồi assert error user thấy — không phải một dòng log.

**Tradeoff**

- `Promise.all` là búa sai khi 9/10 widget render được thiếu cái thứ 10. Fail-fast lúc đó UX tệ hơn error từng widget.
- `allSettled` giấu outage hệ thống trừ khi bạn vẫn đếm reject và bật banner page-level.
- `race` cho timeout, không phải “CDN nào nhanh hơn” mà không cancel thằng thua (bạn double-charge backend).
- `any` bỏ qua fail sớm; vẫn cần timeout kẻo đợi reject pending cuối.
- Đừng `await` trong loop id độc lập — waterfall tự rước. Đừng `Promise.all` 10k id — bound concurrency (pool 4–8).

**Gotcha production**

- `await` trong `forEach` không wait. Dùng `for…of` hoặc `Promise.all` trên mảng map. Vẫn lọt PR.
- Retry kiểu `catch { return fetch() }` nhân đôi POST không idempotent. Backoff chỉ GET/PUT-idempotent, 429/503, không bao giờ 400/401/403.
- SSR (Nuxt): promise reject sau unmount, hoặc client fetch race payload, hydrate empty rồi flash. Gắn fetch vào `AbortSignal` từ `onUnmounted` / `effectScope`.
- `Promise.all` fetch không abort: reject đầu tiên throw, cái còn lại vẫn xong rồi `setState` trên component unmounted (React) hoặc ghi vào scope đã teardown (Vue).
- Swallow: `catch (e) { console.error(e) }` không rethrow, không path user — dashboard “chạy trên máy tôi.”

```ts
async function loadDashboard(userId: string, signal: AbortSignal) {
  try {
    const [user, flags] = await Promise.all([
      api.getUser(userId, { signal }),
      api.getFlags({ signal }),
    ])
    const posts = await api.getPosts(user.id, { signal }) // dependency thật
    return { user, flags, posts }
  } catch (err) {
    if (signal.aborted) return null
    reportError(err) // Sentry / otel — rồi fail UI contract
    throw err
  }
}
```

**Câu hỏi nối**

1. `all` vs `allSettled` vs `all` + `try` từng call — cái nào khớp widget dashboard vs trang checkout?
2. Bound concurrency 6 không cần lib thế nào? Abort trong pool đó ra sao?
3. Vì sao retry-on-error payment intent bị double-charge? Header hoặc idempotency key nào bạn muốn?
4. `await Promise.resolve()` chạy trước hay sau `queueMicrotask`? Việc đó liên quan Vue `nextTick` thế nào?
5. Test `getFlags` fail mà không fail `getUser` ra sao?
6. React 18 `use` / `Suspense` đổi câu trả lời này thế nào so với Vue `async setup` + `<Suspense>`?

---

#### 1.1.3. Event Loop, Microtask, Macrotask

**Họ thực sự hỏi gì**

Có thể mở bằng thứ tự `console.log` / `Promise` / `setTimeout`. Đó là warmup 20 giây. Câu thật: bạn set ref, đọc ngay `el.offsetHeight`, nhận giá trị cũ; hoặc page freeze khi `await` trong vòng parse chặt. Vue `nextTick`, Promise, và `setTimeout` khác nhau thế nào, và vì sao UI không paint?

**Cách senior trả lời**

Call stack chạy đến trống. Rồi **toàn bộ** microtask (Promise job, `queueMicrotask`, MutationObserver, scheduler flush của Vue) chạy trước khi browser paint hoặc lấy macrotask (`setTimeout`, I/O, input). Vue 3 queue DOM update như microtask; `nextTick` đợi flush đó, nên đây là API “đọc layout sau khi ref commit.” `Promise.resolve().then` cũng là microtask — có thể chạy *trước* job Vue nếu queue trước, nên không phải substitute. `setTimeout(0)` là macrotask: bạn đã yield cho paint và input — đúng để cắt long task, không phải để đo node vừa update. Failure mode: microtask starvation — chuỗi `await` trên promise đã resolve, hoặc `Promise.then` lập tức queue cái nữa, không bao giờ về renderer. Đo: Performance panel (long task >50ms, INP), và “total blocking time,” không phải output puzzle.

**Tradeoff**

- Đừng `setTimeout(0)` để “fix” timing Vue. Flake trên máy chậm và đánh nhau với layout.
- Đừng `queueMicrotask` đệ quy xử queue khổng lồ; nhìn concurrent mà vẫn freeze paint. Chunk bằng `scheduler.yield()`, `await new Promise(r => setTimeout(r))`, hoặc `requestAnimationFrame` tùy bạn cần input hay một frame.
- `nextTick` không phải “sau paint.” Cần đợi CSS transition start thì `rAF` (hai lần nếu cần sau layout).
- Puzzle lồng `Promise` trong `setTimeout` trong `Promise` chỉ chứng minh bạn thuộc queue. 20 giây pivot sang long task.

**Gotcha production**

- Vue: mutate rồi đọc DOM cùng tick là classic “sao height = 0?” Prefer `nextTick` rồi đọc, hoặc flush `flush: 'sync'` chỉ khi bạn chịu cost.
- React 18: `flushSync` là búa tương đương; dùng trong list là phá INP.
- `watch` `await` rồi ghi ref khác có thể loop microtask qua tick; cap hoặc so previous value.
- `alert` / sync XHR / `JSON.parse` JSON khổng lồ trên main thread là freeze kiểu macrotask. Parse trong worker hoặc stream.
- Hydration: microtask ghi DOM trước khi Vue/React hydrate sẽ desync và throw hydration mismatch.

```ts
rows.value = next

await nextTick()          // Vue đã patch. Layout có thể vẫn dirty.
const h = el.value?.offsetHeight  // read này force layout — batch các read

// Cắt parse 200ms để input chạy. Không phải vòng microtask.
async function parseChunks(chunks: string[]) {
  for (const chunk of chunks) {
    consume(JSON.parse(chunk))
    await new Promise((r) => setTimeout(r, 0))
  }
}
```

**Câu hỏi nối**

1. Thứ tự: `nextTick(cb)` vs `Promise.resolve().then(cb)` vs `setTimeout(cb, 0)` sau khi ghi ref. Ai thấy DOM mới?
2. Microtask starvation là gì, hiện trên Performance trace ra sao?
3. Vì sao `watchEffect` + `await` miss dependency hoặc loop?
4. Đổi thế nào với Vue `flush: 'post'` vs `'sync'`?
5. INP: yield ở đâu trong paste-handler parse CSV 5MB?
6. Vì sao `MutationObserver` là nguồn microtask, và khi nào bất ngờ trong contenteditable?

---

#### 1.1.4. var vs let vs const

**Họ thực sự hỏi gì**

Họ muốn bảng 20 giây, rồi bạn có biết `const` không freeze object, TDZ tồn tại trong ES module, và `await` trong `for (var …)` là bug khác puzzle `setTimeout` cổ điển.

**Cách senior trả lời**

| | `var` | `let` | `const` |
| --- | --- | --- | --- |
| Scope | function | block | block |
| TDZ | không (init `undefined`) | có | có |
| Rebind | có | có | không |
| Bind `window` (script sloppy) | có | không | không |

Default `const`. `let` khi binding phải dịch (index, retry count). Không `var` trong code mới. Constraint: `const` là bảo đảm **binding**, không phải immutability sâu — `const user = { role: 'admin' }; user.role = 'guest'` hợp lệ. Failure mode: coi `const` như `Object.freeze`, hoặc `var` trong loop shared với `await` nên mọi iteration thấy id cuối và bạn bắn N request cùng resource. Đo: lint (`no-var`, `prefer-const`) cộng review object thật sự cần `readonly` / `structuredClone` / Vue `readonly()`.

**Tradeoff**

- `Object.freeze` nông và có thể phá proxy Vue 3 (chúng expect intercept set). Dùng Vue `readonly()` hoặc copy-on-write, đừng freeze reactive state.
- Rebind `let result` trong hàm 40 dòng thường tệ hơn early return với `const`.
- `var` trong codebase đời `catch (var …)` không đáng rewrite cùng PR product — trừ khi nằm trong loop async.

**Gotcha production**

- TDZ trong module: module `store` mà file này import, trong khi `store.ts` import ngược file này và đọc export ở top level → `ReferenceError` lúc load, không phải `undefined` bí ẩn như `var`.
- `for (let i = 0; i < n; i++) { await go(i) }` đúng (binding từng iteration). `for (var i …)` cộng closure vẫn capture một `i`.
- `const state = reactive({…})` rồi `state = …` illegal; `state.x =` thì ổn. Candidate trộn hai cái này liên tục.
- Destructure `const { items } = props` rồi expect `items` sống — Vue 3 mất reactivity trừ khi `toRefs` / `storeToRefs`. Đó là gotcha binding `const`, không phải trivia Vue.

**Câu hỏi nối**

1. `const` có chặn `array.push` không? Vì sao reviewer vẫn flag?
2. Chỉ circular-import TDZ crash và cách phá cycle (function, lazy getter, module thứ ba).
3. `for (const x of xs) { setTimeout(() => log(x)) }` vs `var` — giải thích không thuộc “block scope.”
4. Vì sao `let` top-level trong Vue `script setup` không reactive? Cái nào reactive thật?
5. `no-unsafe-finally` liên quan rebind `let` trong `try/finally` với `await` thế nào?

---

### 1.2. Advanced Concepts

#### 1.2.1. Closure & Scope

**Họ thực sự hỏi gì**

Ô search vẫn fetch query trước. `watch` log `page` hôm qua. Debounce helper gửi args stale. Map module-level vẫn giữ export 20MB của user trước. Họ test bạn thấy **stale closure** và **retainer**, không phải viết `createCounter`.

**Cách senior trả lời**

Closure giữ **binding** nó đóng, không phải snapshot value — trừ khi bạn copy value vào `const` local lúc schedule. Vue: đọc ref mới nhất **trong** async callback (`page.value`), không ngoài trước `await`. React: `useEffect` / `useCallback` với `[]` cùng bug; `useRef` cho latest, hoặc thêm dep và abort. Constraint: cái closure retain không đủ điều kiện GC tới khi function được thả — event listener, `setInterval`, Pinia subscription, module singleton. Failure mode: debounce đóng `args` từ call đầu, hoặc listener `window` add trong `onMounted` capture `props.user` một lần. Đo: Memory panel retainers, và test bắn query thứ hai trước khi cái đầu resolve rồi assert kết quả đầu bị drop.

**Tradeoff**

- Singleton module-level (API client, cache) là nước đi performance đúng đến khi chúng retain data theo user qua logout. Lúc đó là bug bảo mật.
- “Luôn latest ref” (`let latest = x; latest = x` mỗi call) đơn giản hơn abort, nhưng vẫn tốn network. Prefer abort **và** ignore stale.
- React Compiler / Vue reactivity giảm một số class stale-closure; chúng không cứu listener bạn tự register.

**Gotcha production**

- Vue `watch(() => props.q, async (q) => { const p = page.value; await search(q, p) })` — nếu `page` phải là dependency thì không phải, trừ khi đọc trong source getter. Page stale.
- `watch` trong util gọi từ `setup` mà không `onScopeDispose(stop)` leak hết session.
- Debounce giữ latest args: store `args` trên object, không trong timeout closure từ call #1.
- Response fetch giữ trong closure “để retry”: bạn retain `ArrayBuffer` 30MB. Retry theo URL, không theo body.
- `rows` lớn đóng bởi handler `window` `'resize'` trong chart lib — classic detached-nhưng-vẫn-retain.

```ts
function debounceLatest<T extends unknown[]>(fn: (...args: T) => void, ms: number) {
  let timer = 0
  let last: T
  return (...args: T) => {
    last = args
    clearTimeout(timer)
    timer = window.setTimeout(() => fn(...last), ms)
  }
}

// Vue: đọc latest bên trong; abort in-flight trước.
watch(
  () => props.query,
  async (query, _prev, onCleanup) => {
    const ac = new AbortController()
    onCleanup(() => ac.abort())
    const page = currentPage.value
    results.value = await search(query, page, { signal: ac.signal })
  }
)
```

**Câu hỏi nối**

1. Vì sao React `useEffect(() => fetch(id), [])` bỏ qua `id` sau? Tương đương Vue sai ở đâu?
2. Debounce search để response muộn không thắng thế nào? (abort, sequence number, hoặc cả hai)
3. Khi nào cache module-level là feature, khi nào là leak cross-tenant?
4. `onMounted(() => window.addEventListener('click', handler))` — `handler` retain gì, ai gỡ khi keep-alive deactivate?
5. Vì sao `watchEffect(async () => …)` nguy hiểm hơn `watch`?
6. Chứng minh leak bằng retainer path trong Chrome DevTools thế nào?

---

#### 1.2.2. Prototypes & Inheritance

**Họ thực sự hỏi gì**

Gần như không ai muốn bạn implement `new` bằng `Object.create`. Họ muốn: **class là constructor + prototype sugar**, và hit production — `instanceof` xuyên iframe, lib extend `Array`, hoặc Vue component gãy vì ai đó copy method lên reactive object.

**Cách senior trả lời**

Tôi dùng `class` cho type có identity và API share trên prototype (Error subclass, domain model `instanceof` trong catch). Không dựng UI app trên prototype inheritance — Vue component và composable là function + data. Constraint: method trên `.prototype` được share (tốt cho memory); class **field** là per-instance (arrow trên field nhân đôi function). Failure mode: `el instanceof HTMLElement` là `false` với node từ realm khác (iframe, pop-out, jsdom vs window). Tương tự `data instanceof Array` từ iframe. Đo: fix bằng `Array.isArray`, `node.nodeType`, hoặc `Object.prototype.toString`, và test chạy cửa sổ thứ hai nếu bạn thật sự embed iframe.

**Tradeoff**

- Đừng dùng prototype để share behavior trong Vue; composable là cơ chế reuse và type đúng.
- Đừng `class Store extends Vue` năm 2026. Đó là khảo cổ Options API.
- Subclass `Array` / `Promise` / `Error`: `Error` thì justified (name, stack, `instanceof` trong `catch`). Subclass `Array` vẫn bất ngờ `map` species và array interceptor của Vue — đừng.

**Gotcha production**

- `structuredClone` / `postMessage` bỏ prototype. Gửi `User` nhận plain object. Rehydrate tường minh.
- Vue `reactive` trên class instance có thể bọc proxy; `instanceof` vẫn đúng, `this` trong prototype method có thể thấy proxy. Prefer `markRaw` cho class instance không muốn proxy (map lib, chart instance).
- Nhiều bản copy một package (hai class `Error`, hai Vue runtime) → `instanceof` fail. Đó là bundler, không phải trivia JS.
- `Object.create(null)` không có `toString` / `__proto__`. Spread vào hoặc dùng làm dictionary — đừng giả định `hasOwnProperty`.

**Câu hỏi nối**

1. Vì sao `iframe.contentWindow.Array !== Array`? API nào thay `instanceof Array`?
2. Khi nào vẫn đặt method trên prototype trong lib thay vì class field arrow?
3. `markRaw` sửa gì cho Google Map hoặc Monaco instance trong Vue?
4. Giữ `instanceof AppError` qua `worker.postMessage` thế nào? (không giữ — gửi discriminant)
5. Vì sao thêm method lên `Object.prototype` phá `for…in` trong SDK đối tác?

---

#### 1.2.3. `this` Keyword

**Họ thực sự hỏi gì**

Method Options API Vue chạy đến khi ai đó đổi thành arrow. Class field chạy làm listener đến khi ai đó đưa method lên prototype để tiết kiệm memory. React không miễn dịch: `onClick={this.handle}` trần trong class component. Họ muốn rule binding **và** mapping framework.

**Cách senior trả lời**

`this` là binding theo call-site với `function`; arrow đóng lexical `this`. Vue **Options API**: `methods` bind vào instance — viết `onClick() { this.save() }`. Arrow trong `methods` capture `this` module (`undefined` trong ESM) và là bug. **Composition API** gần như không dùng `this`; đóng trên refs. Class public field `onClick = () => this.save()` bind per instance để pass làm listener; prototype method cần `.bind` hoặc wrapper. Failure mode: `addEventListener('click', obj.method)` tách receiver; `removeEventListener` fail nếu mỗi lần bind wrapper mới. Đo: test listener gỡ được, và Options-API `this.$emit` vẫn fire sau khi extract helper.

**Tradeoff**

- Class-field arrow tốn một function mỗi instance. Widget 10k row: method trên prototype, bind một lần trong constructor — hoặc đừng dùng class.
- Đừng trộn Options `this` với Composition cùng component mà không có rule. Team làm vậy mất một giờ mỗi bug.
- `call`/`apply`/`bind` vẫn quan trọng khi wrap callback jQuery-era. Không nên xuất hiện trong Vue 3 mới.

**Gotcha production**

- Vue 3 `script setup` không có `this`. Mixin migrate đọc `this.foo` là undefined, không phải miss reactive.
- Destructure `const { save } = this` trong Options — mất receiver trừ khi `save` đã là arrow.
- Listener `window` với function đã bind: lưu **cùng** reference để remove. Anonymous `() => this.x()` không gỡ được.
- React class: `this.setState` trong method unbound là hiện vật bảo tàng; vẫn ra interview brownfield.
- Standalone call strict-mode: `this === undefined`, biến `this.state.x` thành throw thay vì ghi global im lặng. Đó là feature.

```ts
// Options API: method, không phải arrow.
export default defineComponent({
  methods: {
    onSubmit() {
      this.$emit('save', this.form)
    },
  },
})

// Listener gỡ được thật.
const onKey = (e: KeyboardEvent) => { /* dùng refs, không dùng this */ }
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
```

**Câu hỏi nối**

1. Vì sao arrow trong Vue `methods` gãy, còn arrow trong `setup()` đúng?
2. Gỡ listener nếu `bind` mỗi lần render thế nào?
3. Prototype method vs class field: memory vs an toàn `this`. Chọn gì cho canvas tool 50k instance?
4. `'this'` trong lỗi TS `noImplicitThis` nói gì về wrapper jQuery plugin?
5. Giải thích `super.method()` và `this` trong subclass mà không vẽ prototype chain 10 phút?

---

#### 1.2.4. ES6+ Modern Features

**Họ thực sự hỏi gì**

Không phải “destructuring là gì.” Họ cài bug: `user.age || 18` khi age là `0`; `JSON.parse(JSON.stringify(state))` drop `Date` và `Map`; barrel `import` kéo chart 200kb vào trang login. Optional chaining, nullish coalescing, clone, iterator, module.

**Cách senior trả lời**

`?.` cho **optional thật**, không để giấu contract gãy. `??` default chỉ `null`/`undefined`; `||` còn coi `0`, `''`, `false` là thiếu — chết với count, giá, feature flag. `structuredClone` là deep copy in-process giữ `Date`, `Map`, `Set`, `ArrayBuffer`; `JSON.parse(JSON.stringify)` là serializer mất mát (không `undefined`, không function, Date thành string, Vue proxy thành plain nhưng nổ trên cycle). Dynamic `import()` là **ranh giới bundle**; static `import` là live binding. Failure mode: `data.items?.map(…)` skip im lặng payload 500, hoặc `structuredClone(vueProxy)` throw. Đo: bảng flag có `false`, và bundle analyzer trên dynamic import.

**Tradeoff**

- Đừng `?.` mọi field từ API bạn control. Nếu `user` luôn có sau 200, throw tốt hơn dashboard trống.
- Đừng `structuredClone` bảng 50MB mỗi phím. Clone patch.
- Đừng dynamic-import helper 2kb; bạn trả round trip và waterfall không vì gì. Có dynamic-import route chart admin.
- Iterator (`for…of`, generator) là API đúng cho lazy stream; không nhanh hơn `for` trên array đã có.

**Gotcha production**

- `??` vs `||` trên số `v-model` và `page=0`.
- `user?.profile?.email ?? 'unknown'` che `profile: null` từ endpoint partial; support sẽ không tìm ra.
- `JSON.stringify` trên reactive state: cycle qua parent ref, hoặc `toRaw` trước. Key `undefined` biến mất; `NaN` thành `null`.
- `structuredClone` không clone function, DOM node, hoặc một số Host object. Worker cần DTO, không phải class của bạn.
- ESM live binding + TDZ: xem hoisting. `export default` không phải live binding giống `export let`.
- `Object.entries` + numeric key: insertion order vs thứ tự bạn nghĩ `for…in` có thời IE. Đừng dựa object key order để rank; dùng array.

```ts
const page = Number(route.query.page ?? 0) // 0 là page thật
const enabled = flag ?? true              // false phải thắng ||

const copy = structuredClone(toRaw(doc))  // Date, Map giữ
// JSON.stringify(doc) biến createdAt thành string và drop undefined
```

**Câu hỏi nối**

1. Khi nào `?.` là bug product? Cho một field API không được optional sau login.
2. Vì sao clone `structuredClone(toRaw(x))` trong Vue thay vì `JSON` hoặc `{...x}`?
3. Static vs dynamic import: giữ feature flag khỏi download module bị tắt thế nào?
4. Vì sao `for…of` trên `NodeList` ổn, nhưng spread 50k node vào array trước filter thì không?
5. `verbatimModuleSyntax` đổi gì về `import type` vs value import?
6. Iterator vs array: khi nào expose generator từ composable?

---

#### 1.2.5. Memory Management & Garbage Collection

**Họ thực sự hỏi gì**

SPA ổn phút 0 và 1.5GB sau một ngày client-side routing. Họ muốn retainer: DOM detached, listener, Vue `watch` không `stop`, closure trên fetch body, `Map` metadata lẽ ra phải là `WeakMap`.

**Cách senior trả lời**

GC thu object **không reach được từ root** (stack, global, DOM, closure còn register). Leak là root quên. Quyết định: mỗi `addEventListener`, `setInterval`, `IntersectionObserver`, `watch`, Pinia `$subscribe`, và cache module cần lifetime cặp với component/effect scope. Constraint: Chrome không free DOM node nếu JS closure vẫn trỏ tới — “tôi đã gỡ khỏi document” chưa đủ. Failure mode: keep-alive cache, chart instance không `dispose`, và global event bus. Đo: Memory → heap snapshot → **Retainers** trên object biết trước (`exportBlob` 20MB của user); hai snapshot rồi so. Tìm `Detached HTMLElement`.

**Tradeoff**

- `WeakMap` / `WeakRef` / `FinalizationRegistry` cho metadata keyed theo object bạn không sở hữu. Không phải cache có SLA — entry yếu biến mất khi áp lực, đừng để auth token đó.
- Đừng null mọi local trong `onUnmounted` như nghi lễ. Null thứ **thoát ra** (global, registry, listener).
- `effectScope` / unmount component Vue đã stop watch tạo trong `setup`. Watch tạo trong **module trần** hoặc callback `setTimeout` thì không.

**Gotcha production**

- DOM detached: Vue ref vẫn giữ `$el` sau `v-if`, hoặc tooltip 3rd-party cache node.
- Listener quên: `resize`, `scroll`, `popstate`, `matchMedia`, WebSocket `onmessage`.
- `watch` / `watchEffect` trong Pinia action hoặc router guard — không `onScopeDispose`, sống mãi.
- Closure trên `await res.arrayBuffer()` cất trong module `lastResult` để debug.
- React: `useEffect` thiếu cleanup; Vue: `useEventListener` từ VueUse là pattern vì nó dispose.
- SSR: `new Map()` module scope trên server là leak xuyên request ở một số runtime. Per-request, không per-module.

```ts
const meta = new WeakMap<HTMLElement, { rowId: string }>()
// element chết thì metadata chết được. Map<HTMLElement, …> sẽ pin node.

onMounted(() => {
  const stop = watch(filters, fetchList, { deep: true })
  onScopeDispose(stop)
})
```

**Câu hỏi nối**

1. Xác nhận detached node trong DevTools thế nào? Vue thường retain bằng gì?
2. Vì sao `WeakMap` đúng cho “data phụ trên DOM node” và sai cho “LRU response API”?
3. Keep-alive: dispose gì ở `onDeactivated` vs `onUnmounted`?
4. Vì sao Vue `ref` tới canvas leak WebGL context?
5. Tìm listener leak mà không đọc cả codebase thế nào? (Performance event listener count, hoặc debug hook)
6. Cache module-scope SSR: khi nào thắng performance, khi nào user A thấy user B?

---

#### 1.2.6. Hoisting & Temporal Dead Zone

**Họ thực sự hỏi gì**

Hai mươi giây: `function` declaration hoist đầy đủ; `var` hoist rồi gán `undefined`; `let`/`const`/`class` hoist vào TDZ đến lúc init. Rồi họ muốn bản production: **circular ESM import** throw `Cannot access X before initialization`, không phải puzzle `console.log(a)`.

**Cách senior trả lời**

Tôi coi hoisting là vấn đề thứ tự load. Trong cycle, `a.ts` import `b.ts` import `a.ts`; cái execute sau đọc `const` export còn trong TDZ. Failure mode: composable bị Pinia store import, store bị composable import — chạy test (graph khác) rồi chết trên app. Đo: đúng `ReferenceError` TDZ lúc startup, rồi phá cycle bằng function (`getStore()`), module thứ ba, hoặc `import()` sau init. Tôi không “dùng `var` để tránh TDZ.”

**Tradeoff**

- Circular type (`import type`) miễn phí với `verbatimModuleSyntax`; circular **value** thì không. Đừng dồn cả domain vào một file chỉ để né cycle — tách constant shared.
- Function declaration phá cycle vì chúng hoist; chúng cũng giấu cycle khỏi reviewer. Prefer lazy getter tường minh.
- Barrel file (`index.ts` re-export) làm cycle dễ hơn. Import leaf trực tiếp trên hot path.

**Gotcha production**

- `class` trong TDZ: `export class X extends Y` khi `Y` chưa init.
- `const store = useFooStore()` top module trong util — Pinia chưa install, cộng TDZ nếu store module import util.
- Vue SFC: import từ file component chạy `useRouter()` top level lúc SSR.
- `typeof x` với `let x` trong TDZ vẫn throw. Bất ngờ người học `typeof undeclared === 'undefined'`.

**Câu hỏi nối**

1. Vì sao circular import in `undefined` với `var`/`function` nhưng throw với `const`?
2. Cấu trúc Pinia store + composable tránh TDZ mà không god-module thế nào?
3. `import type { Foo }` vs `import { type Foo }` — cái nào vẫn emit runtime import?
4. Vì sao default export tệ hơn với cycle so với named live binding?
5. Câu 20 giây nếu họ chỉ muốn hoisting, và bạn lái sang circular import thế nào?

---

#### 1.2.7. AbortController, Concurrency và Cancellation

**Họ thực sự hỏi gì**

Typeahead: năm GET in-flight, cái chậm nhất thắng và overwrite input. Đổi route: `watch` vẫn ghi vào page trước. “Bọn mình dùng `let seq++`.” Vì sao `AbortController` là primitive, và nó compose với `Promise.all` thế nào?

**Cách senior trả lời**

Cancellation là một phần API contract, không phải nghĩ sau. Mỗi fetch, mỗi `addEventListener` `{ signal }`, mỗi Vue `watch` `onCleanup` nên share một `AbortSignal`. Quyết định: abort lúc unmount, lúc query đổi, và lúc timeout (`AbortSignal.timeout` hoặc `AbortSignal.any`). Constraint: abort **hợp tác** — `fetch` phải pass `signal`, `axios` phải dùng cùng; inner call quên vẫn complete. Failure mode: coi `AbortError` là fail user-facing (toast “network error” mỗi phím) hoặc ignore rồi apply data stale. Đo: Network panel hiện request cancelled (đỏ) khi query đổi; test response đầu không được ghi `results` sau abort.

**Tradeoff**

- Sequence number (`if (id !== latest) return`) là guard phụ ổn khi lib không abort được. Vẫn tốn server. Prefer cả hai.
- `Promise.all([…], { signal })` không built-in — pass cùng signal vào từng call, và abort controller trong `catch` để sibling dừng.
- Đừng abort mutation user đã confirm (pay, delete) trừ khi họ rời page *và* operation không an toàn apply mù. Gọi product.
- Axios cancel token global đời 2018 không phải `AbortSignal`. Wrap nó.

**Gotcha production**

- `AbortError` / `DOMException` name `'AbortError'` — filter trước Sentry kẻo alert mọi typeahead cancelled.
- Vue `watch` không `onCleanup(() => ac.abort())` thì race. React `useEffect` return phải abort.
- `Promise.all` + một abort: cái kia vẫn chạy trừ khi nhận cùng signal.
- HTTP/2 cancellation tốt cho server; HTTP/1.1 có thể không dừng work thật. Đừng giả định abort tiết kiệm CPU DB.
- Gộp user abort và timeout: `AbortSignal.any([userSignal, AbortSignal.timeout(8_000)])` — polyfill browser cũ.
- Retry sau abort là sai; retry sau 503 là đúng. Check `signal.aborted` trước.

```ts
watch(
  () => route.query.q,
  async (q, _p, onCleanup) => {
    const ac = new AbortController()
    onCleanup(() => ac.abort())
    try {
      const [hits, nextFacets] = await Promise.all([
        search(q, { signal: ac.signal }),
        getFacets(q, { signal: ac.signal }),
      ])
      results.value = hits
      facetCounts.value = nextFacets
    } catch (err) {
      if ((err as DOMException).name === 'AbortError') return
      throw err
    }
  }
)
```

**Câu hỏi nối**

1. Vì sao sequence number không đủ nếu response handler vẫn đụng IndexedDB?
2. Abort `Promise.all` 3 call khi cái đầu fail thế nào? Có nên không?
3. `AbortSignal.any` vs nested controller — ai sở hữu `abort()`?
4. Timeout để đâu: client signal, HTTP gateway, hay cả hai?
5. Tương tác với Vue `<Suspense>` và Nuxt `useAsyncData` cancellation thế nào?
6. `POST /checkout` có nên abort lúc unmount? Bảo vệ câu trả lời product.

---

[← Back to Overview](../../README.md)
