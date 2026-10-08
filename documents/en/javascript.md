# JavaScript

Senior interviews almost never ask you to recite `map` vs `filter`. They watch whether you can keep a Vue/React UI correct under races, mutation, and memory pressure: a table of 100k rows, a dashboard that waterfalls four APIs, a leak that only shows up after an hour in DevTools. The bar is judgment — what you mutate, what you cancel, what you measure — not fluency with textbook snippets.

Treat every JS question as a production debug: name the constraint (main thread, identity, GC), the failure mode (stale UI, freeze, leak), and how you would prove the fix (Profiler, Performance panel, a failing test).

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

   2.7. [AbortController, Concurrency, and Cancellation](#127-abortcontroller-concurrency-and-cancellation)

---

## I. Core Web Technologies

## 1. JavaScript

### 1.1. Core Concepts

#### 1.1.1. High-order Array Functions

**What they actually ask**

You own a Vue 3 table (or a React list) bound to `rows`. A teammate writes `rows.sort(byName).filter(isActive).map(toView)`. The original order is gone, a child that received `rows` as a prop mutates the parent, and the page hitchs on 100k records. Why, and what would you ship instead?

**How a senior answers**

Decision first: **mutate the reactive source you own; copy when the array is shared, is a prop, or is a derived view.** Vue 3’s proxy already observes index/length changes, so an in-place `push`/`splice` on state you own is often the cheaper, correct update. React compares identity, so in-place `sort` then `setRows(rows)` is a silent no-op. The failure mode is accidental aliasing: `sort`, `reverse`, and `splice` mutate and return the same reference, so “I sorted a copy” is a lie. Measure with the Profiler (unnecessary copies vs missed updates) and with a unit test that asserts the source array’s order after rendering a derived view. On large lists, prefer one pass (`for…of` or a real `reduce` fold) over `filter + map + sort` that allocates three arrays; virtualize the DOM, don’t micro-optimize the fold until the flame chart says the fold is the problem.

**Tradeoffs**

- Do **not** clone 100k rows on every keystroke “for immutability.” That is a React habit applied blindly in Vue, and it will lose to an in-place update plus a keyed `v-for`.
- Do **not** use `reduce` as a clever `for` loop. If the accumulator is an object you mutate across branches, a named `for…of` is clearer in review and easier to breakpoint.
- `toSorted` / `toReversed` / `toSpliced` are the right default for **derived** views. They are not a reason to copy inside a hot Pinia action that already owns the array.
- Chained `filter+map` is the better documentation when the dataset is small and the pipeline *is* the spec. Reach for a single pass when you need counts, groups, and a list without walking the data three times.

**Production gotchas**

- Default `sort()` is lexical: `[10, 2, 1].sort()` → `[1, 10, 2]`. Always pass a comparator, and never sort in a `computed` that mutates its dependency.
- Sparse arrays: `map`/`filter`/`forEach` skip holes; `[...arr]` and `Array.from` materialize `undefined`; `for…of` yields `undefined` for holes. API payloads with deleted indexes bite CSV/export code.
- Vue: mutating a **prop** array (or `readonly()` Pinia state) either warns or silently desyncs the parent. Treat props as owned by the caller; emit or copy.
- React: `list.sort()` mutates the state array in the same fiber render — concurrent features make this a real heisenbug, not a style nit.
- `find` vs `filter[0]`: `find` stops early; both are wrong if the predicate matches the wrong row because you compared with `==` on branded ids.

```ts
// Derived view: copy. Source of truth: leave it alone.
const visible = computed(() =>
  rows.value.toSorted((a, b) => a.name.localeCompare(b.name)).filter((r) => r.active)
)

// One-pass index when 100k rows feed a lookup AND a count — not a reduce puzzle.
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

**Follow-ups**

1. `const next = items.sort(cmp)` — what is `next === items`? What does Vue vs React do on that assignment?
2. Why is `toSorted` in a `computed` safe, and why is `sort` in a `computed` a state bug?
3. When do you virtualize (`content-visibility`, TanStack Virtual, `vue-virtual-scroller`) instead of faster array methods?
4. How do you sort a 100k list without blocking input? (chunk, worker, or sort on the server)
5. Sparse vs empty: how would you compact holes before sending a PATCH of “removed indexes”?
6. Why might `rows.filter(Boolean)` drop valid `0` / `''` cells in a spreadsheet UI?

---

#### 1.1.2. Promise vs Async/Await

**What they actually ask**

A dashboard `setup()` does `const user = await getUser(); const posts = await getPosts(user.id); const flags = await getFlags()`. Flags do not depend on user. One of the three 500s and the page hangs on a spinner. Walk through parallelism, failure policy, cancellation, and retries.

**How a senior answers**

`async/await` is the control-flow syntax; the decision is **which combinator and which abort signal**. Independent calls go in `Promise.all` (fail-fast: one reject aborts the group, which is what you want if the page cannot render without all of them). If the UI can show partials (flags optional), use `allSettled` or split the critical path from the optional one. Waterfall only on true data dependence (`posts` needs `user.id`). Constraint: `await` yields to the microtask queue — it does **not** block the event loop, but a chain of already-resolved awaits still starves rendering. Failure mode: an empty `catch { console.error }` that returns `undefined` and paints an empty state that looks like “no data.” Measure: waterfall in the Network panel (initiator chain), TTFB vs compute, and an integration test that rejects one branch and asserts the user-visible error — not a log line.

**Tradeoffs**

- `Promise.all` is the wrong hammer when 9 of 10 widgets can render without the 10th. Fail-fast there is a worse UX than a per-widget error.
- `allSettled` hides a systemic outage unless you still count rejections and trip a page-level banner.
- `race` is for timeouts, not “whichever CDN is faster” without a cancel of the loser (you will double-charge the backend).
- `any` ignores early failures; you still need a timeout or you wait for the last pending reject.
- Don’t `await` in a loop of independent ids — that’s a self-inflicted waterfall. Don’t `Promise.all` 10k ids either — bound concurrency (pool of 4–8).

**Production gotchas**

- `await` in `forEach` does not wait. Use `for…of` or `Promise.all` on a mapped array. This still ships in PRs.
- Retry with naive `catch { return fetch() }` duplicates non-idempotent POSTs. Backoff only on GET/PUT-idempotent, 429/503, and never on 400/401/403.
- SSR (Nuxt): a promise that rejects after unmount, or a client fetch that races the payload, hydrates as empty then flashes. Tie fetches to `AbortSignal` from `onUnmounted` / `effectScope`.
- `Promise.all` of fetches without abort: the first reject throws, the others still complete and call `setState` on an unmounted component (React) or write to a torn-down scope (Vue).
- Swallowing: `catch (e) { console.error(e) }` with no rethrow and no user path is how you get “works on my machine” dashboards.

```ts
async function loadDashboard(userId: string, signal: AbortSignal) {
  try {
    const [user, flags] = await Promise.all([
      api.getUser(userId, { signal }),
      api.getFlags({ signal }),
    ])
    const posts = await api.getPosts(user.id, { signal }) // real dependency
    return { user, flags, posts }
  } catch (err) {
    if (signal.aborted) return null
    reportError(err) // Sentry / otel — then fail the UI contract
    throw err
  }
}
```

**Follow-ups**

1. `all` vs `allSettled` vs `all` + per-call `try` — which matches a widget dashboard vs a checkout page?
2. How do you bound concurrency to 6 without a library? What happens to abort in that pool?
3. Why does retry-on-error for a payment intent double-charge? What header or idempotency key do you want?
4. Does `await Promise.resolve()` run before or after `queueMicrotask`? Why does that matter for Vue `nextTick`?
5. How do you test a failed `getFlags` without failing `getUser`?
6. Where does React 18 `use` / `Suspense` change this answer vs Vue `async setup` + `<Suspense>`?

---

#### 1.1.3. Event Loop, Microtask, Macrotask

**What they actually ask**

They may open with `console.log` / `Promise` / `setTimeout` order. That is a 20-second warmup. The real question is: you set a ref, immediately read `el.offsetHeight`, and get the old value; or the page freezes while you `await` in a tight parse loop. How do Vue `nextTick`, Promises, and `setTimeout` differ, and why does the UI not paint?

**How a senior answers**

Call stack runs to empty. Then **all** microtasks (Promise jobs, `queueMicrotask`, MutationObserver, Vue’s scheduler flush) run before the browser can paint or take a macrotask (`setTimeout`, I/O, input). Vue 3 queues DOM updates as a microtask; `nextTick` waits for that flush, so it is the API for “read layout after my refs commit.” `Promise.resolve().then` is also a microtask — it may run *before* Vue’s job if it was queued first, so it is not a substitute. `setTimeout(0)` is a macrotask: you have yielded to paint and to input, which is what you want to break a long task, not to measure a just-updated node. Failure mode: microtask starvation — a chain of `await` on already-resolved promises, or a `Promise.then` that immediately queues another, never returns to the renderer. Measure: Performance panel (long tasks >50ms, INP), and “total blocking time,” not the puzzle output.

**Tradeoffs**

- Don’t reach for `setTimeout(0)` to “fix” Vue timing. You will flake on slow devices and fight layout.
- Don’t recursively `queueMicrotask` to process a huge queue; you will look concurrent and still freeze paint. Chunk with `scheduler.yield()`, `await new Promise(r => setTimeout(r))`, or `requestAnimationFrame` depending on whether you need input or a frame.
- `nextTick` is not “after paint.” If you need to wait for CSS transition start, use `rAF` (twice if you need after layout).
- Interview puzzles that nest `Promise` inside `setTimeout` inside `Promise` only prove you memorized the queue. Pivot to long tasks in 20 seconds.

**Production gotchas**

- Vue: mutating then reading DOM in the same tick is the classic “why is height 0?” Prefer `nextTick` then read, or flush with `flush: 'sync'` only when you own the cost.
- React 18: `flushSync` is the equivalent hammer; using it in a list is how you wreck INP.
- A `watch` that `await`s and then writes another ref can loop microtasks across ticks; cap it or compare previous values.
- `alert` / sync XHR / a huge JSON `JSON.parse` on the main thread are macrotask-era freezes. Parse in a worker or stream it.
- Hydration: a microtask that writes DOM before Vue/React hydrate will desync and throw hydration mismatches.

```ts
rows.value = next

await nextTick()          // Vue has patched. Layout may still be dirty.
const h = el.value?.offsetHeight  // this read forces layout — batch reads

// Break a 200ms parse so input can run. Not a microtask loop.
async function parseChunks(chunks: string[]) {
  for (const chunk of chunks) {
    consume(JSON.parse(chunk))
    await new Promise((r) => setTimeout(r, 0))
  }
}
```

**Follow-ups**

1. Order: `nextTick(cb)` vs `Promise.resolve().then(cb)` vs `setTimeout(cb, 0)` after a ref write. Who sees the new DOM?
2. What is microtask starvation, and how would it show up in a Performance trace?
3. Why can `watchEffect` + `await` miss a dependency or loop?
4. How does this change under Vue `flush: 'post'` vs `'sync'`?
5. INP: where would you yield in a paste-handler that parses a 5MB CSV?
6. Why is `MutationObserver` a microtask source, and when does that surprise you in a contenteditable?

---

#### 1.1.4. var vs let vs const

**What they actually ask**

They want a 20-second table, then whether you know that `const` does not freeze objects, that TDZ exists in ES modules, and that `await` in a `for (var …)` loop is a different bug than the classic `setTimeout` puzzle.

**How a senior answers**

| | `var` | `let` | `const` |
| --- | --- | --- | --- |
| Scope | function | block | block |
| TDZ | no (initialized `undefined`) | yes | yes |
| Rebind | yes | yes | no |
| `window` binding (sloppy scripts) | yes | no | no |

Default `const`. Use `let` when the binding must move (index, retry count). Never `var` in new code. Constraint: `const` is a **binding** guarantee, not deep immutability — `const user = { role: 'admin' }; user.role = 'guest'` is legal. Failure mode: treating `const` as `Object.freeze`, or using `var` in a shared loop with `await` so every iteration sees the last id and you fire N requests for the same resource. Measure: a lint rule (`no-var`, `prefer-const`) plus a review of objects that actually need `readonly` / `structuredClone` / Vue `readonly()`.

**Tradeoffs**

- `Object.freeze` is shallow and can break Vue 3 proxies (they expect to intercept sets). Use Vue `readonly()` or copy-on-write, not freeze on reactive state.
- Rebinding with `let result` in a 40-line function is often worse than early returns with `const`.
- `var` in a `catch (var …)` era codebase is not worth a rewrite in the same PR as a product fix — unless it is in a loop with async.

**Production gotchas**

- TDZ in modules: `import { store } from './store'` where `store.ts` imports this file and reads an export at top level → `ReferenceError` at load, not a mysterious `undefined` like `var`.
- `for (let i = 0; i < n; i++) { await go(i) }` is correct (per-iteration binding). `for (var i …)` plus a closure still captures one `i`.
- `const state = reactive({…})` then `state = …` is illegal; `state.x =` is fine. Candidates mix these up constantly.
- Destructuring `const { items } = props` then expecting `items` to stay live — in Vue 3 you lost reactivity unless you use `toRefs` / `storeToRefs`. That’s a `const` binding gotcha, not a Vue trivia question.

**Follow-ups**

1. Does `const` prevent `array.push`? Why did a reviewer still flag it?
2. Show a circular-import TDZ crash and how you’d break the cycle (function, lazy getter, third module).
3. `for (const x of xs) { setTimeout(() => log(x)) }` vs `var` — explain without reciting “block scope.”
4. Why is `let` in a Vue `script setup` top-level not reactive? What is actually reactive?
5. What does `no-unsafe-finally` have to do with rebinding `let` in `try/finally` with `await`?

---

### 1.2. Advanced Concepts

#### 1.2.1. Closure & Scope

**What they actually ask**

A search box still fetches for the previous query. A `watch` logs yesterday’s `page`. A debounce helper sends stale args. A module-level Map still holds the last user’s 20MB export. They are testing whether you see **stale closures** and **retainers**, not whether you can write `createCounter`.

**How a senior answers**

A closure keeps the **bindings** it closed over, not a snapshot of their values — unless you copied the value into a local `const` at schedule time. In Vue, read latest refs **inside** the async callback (`page.value`), not outside before the `await`. In React, `useEffect` / `useCallback` with `[]` is the same bug; `useRef` for latest, or include the dep and abort. Constraint: whatever the closure retains is ineligible for GC until the function is released — event listeners, `setInterval`, Pinia subscriptions, module singletons. Failure mode: a debounce that closes over `args` from the first call, or a `window` listener added in `onMounted` that captures `props.user` once. Measure: Memory panel retainers, and a test that fires a second query before the first resolves and asserts the first result is dropped.

**Tradeoffs**

- Module-level singletons (API clients, caches) are the right performance move until they retain per-user data across logouts. Then they are a security bug.
- “Always latest ref” (`let latest = x; latest = x` on each call) is simpler than aborting, but you still waste the network. Prefer abort **and** ignore stale.
- React Compiler / Vue reactivity reduce some stale-closure classes; they do not save a listener you registered yourself.

**Production gotchas**

- Vue `watch(() => props.q, async (q) => { const p = page.value; await search(q, p) })` — if `page` should be a dependency, it isn’t, unless you read it in the source getter. Stale page.
- `watch` in a utility called from `setup` without `onScopeDispose(stop)` leaks for the rest of the session.
- Debounce holding latest args: store `args` on the object, not in the timeout closure from call #1.
- Fetch response kept in a closure “for retry”: you retained a 30MB `ArrayBuffer`. Retry against the URL, not the body.
- Large `rows` closed over by a `window` `'resize'` handler in a chart lib — classic detached-but-still-retained.

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

// Vue: read latest inside; abort the previous in-flight.
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

**Follow-ups**

1. Why does a React `useEffect(() => fetch(id), [])` ignore later `id`? What is the Vue equivalent mistake?
2. How do you debounce a search so the late response cannot win? (abort, sequence number, or both)
3. When is a module-level cache a product feature, and when is it cross-tenant leakage?
4. `onMounted(() => window.addEventListener('click', handler))` — what does `handler` retain, and who removes it on keep-alive deactivate?
5. Why is `watchEffect(async () => …)` extra dangerous compared to `watch`?
6. How would you prove a leak with a retainer path in Chrome DevTools?

---

#### 1.2.2. Prototypes & Inheritance

**What they actually ask**

Almost nobody wants you to implement `new` with `Object.create`. They want: **class is constructor + prototype sugar**, and they want the production hits — `instanceof` across an iframe, a library that extends `Array`, or a Vue component that broke because someone copied methods onto a reactive object.

**How a senior answers**

I use `class` for types with identity and a prototype-shared API (Error subclasses, domain models that `instanceof` in a catch). I do not build app UI on prototype inheritance — Vue components and composables are functions + data. Constraint: methods on `.prototype` are shared (good for memory); class **fields** are per-instance (arrows on fields duplicate functions). Failure mode: `el instanceof HTMLElement` is `false` for a node from another realm (iframe, pop-out, jsdom vs window). Same for `data instanceof Array` from an iframe. Measure: fix with `Array.isArray`, `node.nodeType`, or `Object.prototype.toString`, and a test that runs in a second window if you actually embed iframes.

**Tradeoffs**

- Don’t reach for prototypes to share behavior in Vue; a composable is the reuse mechanism and types correctly.
- Don’t `class Store extends Vue` in 2026. That’s Options-API archaeology.
- Subclassing `Array` / `Promise` / `Error` is justified for `Error` (name, stack, `instanceof` in `catch`). Subclassing `Array` still surprises `map` species and Vue’s array interceptors — don’t.

**Production gotchas**

- `structuredClone` / `postMessage` drop the prototype. You send a `User` and receive a plain object. Rehydrate explicitly.
- Vue `reactive` on a class instance can wrap it in a proxy; `instanceof` still works, `this` in a prototype method may see the proxy. Prefer `markRaw` for class instances you do not want proxied (map libs, chart instances).
- Multiple copies of a package (two `Error` classes, two Vue runtimes) → `instanceof` fails. That’s a bundler issue, not a JS trivia one.
- `Object.create(null)` has no `toString` / `__proto__`. Spread into it or use as a dictionary — don’t assume `hasOwnProperty`.

**Follow-ups**

1. Why is `iframe.contentWindow.Array !== Array`? What API do you use instead of `instanceof Array`?
2. When would you still put a method on a prototype in library code rather than a class field arrow?
3. What does `markRaw` fix for a Google Map or a Monaco instance in Vue?
4. How do you preserve `instanceof AppError` across `worker.postMessage`? (you don’t — you send a discriminant)
5. Why did adding a method on `Object.prototype` break `for…in` in a partner’s SDK?

---

#### 1.2.3. `this` Keyword

**What they actually ask**

A Vue Options-API method works until someone converts it to an arrow. A class field works as a listener until someone puts the method on the prototype to save memory. React isn’t immune: a bare `onClick={this.handle}` in a class component. They want the binding rule **and** the framework mapping.

**How a senior answers**

`this` is call-site binding for `function`; arrows close over lexical `this`. In Vue **Options API**, `methods` are bound to the instance — write `onClick() { this.save() }`. An arrow in `methods` captures module `this` (`undefined` in ESM) and is a bug. In **Composition API** you almost never use `this`; you close over refs. Class public fields `onClick = () => this.save()` bind per instance so you can pass them as listeners; prototype methods need `.bind` or a wrapper. Failure mode: `addEventListener('click', obj.method)` detaches the receiver; `removeEventListener` then fails if you bound a new wrapper each time. Measure: a test that the listener can be removed, and that Options-API `this.$emit` still fires after extracting a helper.

**Tradeoffs**

- Class-field arrows cost a function per instance. On 10k row widgets, put the method on the prototype and bind once in the constructor — or don’t use classes.
- Don’t mix Options `this` with Composition in the same component without a rule. Teams that do lose an hour per bug.
- `call`/`apply`/`bind` still matter when you wrap third-party jQuery-era callbacks. They should not appear in new Vue 3 code.

**Production gotchas**

- Vue 3 `script setup` has no `this`. A migrated mixin that reads `this.foo` is undefined, not a reactive miss.
- Destructure `const { save } = this` in Options — you lost the receiver unless `save` was already an arrow.
- Event listeners on `window` with a bound function: store the **same** reference for remove. Anonymous `() => this.x()` cannot be removed.
- React class: `this.setState` in an unbound method is the museum exhibit; still shows up in brownfield interviews.
- Strict-mode standalone call: `this === undefined`, which turns `this.state.x` into a throw instead of a silent global write. That’s a feature.

```ts
// Options API: method, not arrow.
export default defineComponent({
  methods: {
    onSubmit() {
      this.$emit('save', this.form)
    },
  },
})

// Listener you can actually remove.
const onKey = (e: KeyboardEvent) => { /* uses refs, not this */ }
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
```

**Follow-ups**

1. Why does an arrow in Vue `methods` break, while an arrow in `setup()` is correct?
2. How do you remove a listener if you `bind` on every render?
3. Prototype method vs class field: memory vs `this` safety. Which do you pick for a canvas tool with 50k instances?
4. What does `'this'` in a TS `noImplicitThis` error tell you about a jQuery plugin wrapper?
5. Can you explain `super.method()` and `this` in a subclass without drawing the prototype chain for 10 minutes?

---

#### 1.2.4. ES6+ Modern Features

**What they actually ask**

Not “what is destructuring.” They plant a bug: `user.age || 18` when age is `0`; `JSON.parse(JSON.stringify(state))` that drops a `Date` and a `Map`; a barrel `import` that pulled in a 200kb chart on the login page. Optional chaining, nullish coalescing, clone, iterators, modules.

**How a senior answers**

`?.` is for **honest optionality**, not to hide a broken contract. `??` defaults only on `null`/`undefined`; `||` also treats `0`, `''`, `false` as missing — fatal for counts, prices, and feature flags. `structuredClone` is the in-process deep copy that keeps `Date`, `Map`, `Set`, `ArrayBuffer`; `JSON.parse(JSON.stringify)` is a lossy serializer (no `undefined`, no functions, Dates become strings, Vue proxies become plain but also explode on cycles). Dynamic `import()` is a **bundle boundary**; static `import` is a live binding. Failure mode: `data.items?.map(…)` that silently skips a 500 payload, or `structuredClone(vueProxy)` throwing. Measure: a table of flags with `false`, and a bundle analyzer on the dynamic import.

**Tradeoffs**

- Don’t `?.` every field from an API you control. If `user` is always present after 200, a throw is better than an empty dashboard.
- Don’t `structuredClone` a 50MB table every keystroke. Clone the patch.
- Don’t dynamic-import a 2kb helper; you paid a round trip and a waterfall for nothing. Do dynamic-import the admin chart route.
- Iterators (`for…of`, generators) are the right API for lazy streams; they are not faster than a `for` over an array you already have.

**Production gotchas**

- `??` vs `||` on `v-model` numbers and on `page=0`.
- `user?.profile?.email ?? 'unknown'` masks `profile: null` from a partial endpoint; your support team will not find it.
- `JSON.stringify` on reactive state: cycle through parent refs, or `toRaw` first. `undefined` keys disappear; `NaN` becomes `null`.
- `structuredClone` cannot clone functions, DOM nodes, or some Host objects. Workers need a DTO, not your class.
- ESM live bindings + TDZ: see hoisting. `export default` is not a live binding in the same way as `export let`.
- `Object.entries` + numeric keys: insertion order vs the order you think a `for…in` had in IE. Don’t depend on object key order for ranking; use an array.

```ts
const page = Number(route.query.page ?? 0) // 0 is a real page
const enabled = flag ?? true              // false must win over ||

const copy = structuredClone(toRaw(doc))  // Dates, Map stay
// JSON.stringify(doc) would turn createdAt into a string and drop undefined
```

**Follow-ups**

1. When is `?.` a product bug? Give an API field that must not be optional after login.
2. Why clone with `structuredClone(toRaw(x))` in Vue instead of `JSON` or `{...x}`?
3. Static vs dynamic import: how do you keep a feature flag from downloading the flagged-out module?
4. Why is `for…of` on a `NodeList` fine, but spreading 50k nodes into an array before filter is not?
5. What does `verbatimModuleSyntax` change about `import type` vs value imports?
6. Iterator vs array: when would you expose a generator from a composable?

---

#### 1.2.5. Memory Management & Garbage Collection

**What they actually ask**

The SPA is fine at minute 0 and at 1.5GB after a day of client-side routing. They want retainers: detached DOM, listeners, Vue `watch` without `stop`, closures over fetch bodies, a `Map` of metadata that should have been a `WeakMap`.

**How a senior answers**

GC collects objects that are **unreachable from roots** (stack, globals, DOM, closures still registered). Leaks are forgotten roots. Decision: every `addEventListener`, `setInterval`, `IntersectionObserver`, `watch`, Pinia `$subscribe`, and module cache needs a lifetime paired with the component/effect scope. Constraint: Chrome will not free a DOM node if a JS closure still points at it — “I removed it from the document” is not enough. Failure mode: keep-alive caches, chart instances without `dispose`, and a global event bus. Measure: Memory → heap snapshot → **Retainers** on a known object (the user’s 20MB `exportBlob`); take two snapshots and compare. Look for `Detached HTMLElement`.

**Tradeoffs**

- `WeakMap` / `WeakRef` / `FinalizationRegistry` are for metadata keyed by objects you do not own. They are not a cache with a SLA — weak entries vanish under pressure, so don’t put auth tokens there.
- Don’t null every local in `onUnmounted` as ritual. Null the things that **escape** (globals, registries, listeners).
- Vue’s `effectScope` / component unmount already stops watches created in `setup`. Watches created in **plain modules** or in `setTimeout` callbacks do not.

**Production gotchas**

- Detached DOM: a Vue ref still holding `$el` after a `v-if`, or a 3rd-party tooltip that cached the node.
- Forgotten listeners: `resize`, `scroll`, `popstate`, `matchMedia`, WebSocket `onmessage`.
- `watch` / `watchEffect` in a Pinia action or a router guard — no `onScopeDispose`, lives forever.
- Closures over `await res.arrayBuffer()` stored in a module `lastResult` for debugging.
- React: `useEffect` missing cleanup; Vue: `useEventListener` from VueUse is the pattern because it disposes.
- SSR: allocating a `new Map()` at module scope on the server is a cross-request leak in some runtimes. Per-request, not per-module.

```ts
const meta = new WeakMap<HTMLElement, { rowId: string }>()
// when the element dies, metadata can die. A Map<HTMLElement, …> would pin the node.

onMounted(() => {
  const stop = watch(filters, fetchList, { deep: true })
  onScopeDispose(stop)
})
```

**Follow-ups**

1. How do you confirm a detached node in DevTools? What typically retains it in Vue?
2. Why is `WeakMap` correct for “extra data on a DOM node” and wrong for “LRU of API responses”?
3. Keep-alive: what do you dispose on `onDeactivated` vs `onUnmounted`?
4. Why can a Vue `ref` to a canvas leak a WebGL context?
5. How would you find a listener leak without reading the whole codebase? (Performance event listener count, or a debug hook)
6. SSR module-scope cache: when is it a performance win, and when is it user A seeing user B?

---

#### 1.2.6. Hoisting & Temporal Dead Zone

**What they actually ask**

Twenty seconds: `function` declarations are hoisted fully; `var` is hoisted and set to `undefined`; `let`/`const`/`class` are hoisted into TDZ until init. Then they want the production version: **circular ESM imports** that throw `Cannot access X before initialization`, not the `console.log(a)` puzzle.

**How a senior answers**

I treat hoisting as a load-order problem. In a cycle, `a.ts` imports `b.ts` which imports `a.ts`; whichever executes second reads a `const` export still in TDZ. Failure mode: a composable imported by a Pinia store imported by the composable — works in tests (different graph) and dies in the app. Measure: the exact TDZ `ReferenceError` at startup, then break the cycle with a function (`getStore()`), a third module, or `import()` after init. I do not “use `var` to avoid TDZ.”

**Tradeoffs**

- Circular types (`import type`) are free under `verbatimModuleSyntax`; circular **values** are not. Don’t flatten a whole domain into one file just to dodge a cycle — split the shared constants.
- Function declarations as cycle-breakers work because they hoist; they also hide the cycle from reviewers. Prefer an explicit lazy getter.
- Barrel files (`index.ts` re-exports) make cycles easier. Import leaves directly in hot paths.

**Production gotchas**

- `class` in TDZ: `export class X extends Y` where `Y` isn’t initialized yet.
- `const store = useFooStore()` at module top in a util — Pinia isn’t installed yet, plus TDZ if the store module imports the util.
- Vue SFCs: importing from a component file that runs `useRouter()` at top level during SSR.
- `typeof x` for `let x` in TDZ still throws. That surprises people who learned `typeof undeclared === 'undefined'`.

**Follow-ups**

1. Why does a circular import print `undefined` with `var`/`function` but throw with `const`?
2. How do you structure Pinia stores + composables to avoid TDZ without a god-module?
3. `import type { Foo }` vs `import { type Foo }` — which can still emit a runtime import?
4. Why are default exports worse for cycles than named live bindings?
5. What’s the 20-second answer if they only want hoisting, and how do you steer to circular imports?

---

#### 1.2.7. AbortController, Concurrency, and Cancellation

**What they actually ask**

Typeahead: five in-flight GETs, the slowest wins and overwrites the input. Route change: a `watch` still writes into the previous page. “We used `let seq++`.” Why is `AbortController` the primitive, and how does it compose with `Promise.all`?

**How a senior answers**

Cancellation is part of the API contract, not an afterthought. Every fetch, every `addEventListener` `{ signal }`, every Vue `watch` `onCleanup` should share one `AbortSignal`. Decision: abort on unmount, on query change, and on timeout (`AbortSignal.timeout` or `AbortSignal.any`). Constraint: abort is **cooperative** — your `fetch` must pass `signal`, and `axios` must use the same; a forgotten inner call still completes. Failure mode: treating `AbortError` as a user-facing failure (toast “network error” on every keystroke) or ignoring it and applying stale data. Measure: Network panel shows cancelled (red) requests when the query changes; a test that the first response cannot write `results` after abort.

**Tradeoffs**

- Sequence numbers (`if (id !== latest) return`) are a fine extra guard when a library cannot abort. They still waste the server. Prefer both.
- `Promise.all([…], { signal })` isn’t built-in — pass the same signal into each call, and abort the controller in `catch` so siblings stop.
- Don’t abort a mutation the user already confirmed (pay, delete) unless they left the page *and* the operation is unsafe to apply blindly. Product call.
- A global axios cancel token from 2018 is not an `AbortSignal`. Wrap it.

**Production gotchas**

- `AbortError` / `DOMException` name `'AbortError'` — filter before Sentry or you alert on every cancelled typeahead.
- Vue `watch` without `onCleanup(() => ac.abort())` races. React `useEffect` return must abort.
- `Promise.all` + one abort: the others keep running unless they received the same signal.
- HTTP/2 cancellation is good for the server; HTTP/1.1 may not actually stop work. Don’t assume abort saves DB CPU.
- Combining user abort and timeout: `AbortSignal.any([userSignal, AbortSignal.timeout(8_000)])` — polyfill in older browsers.
- Retry after abort is wrong; retry after 503 is right. Check `signal.aborted` first.

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

**Follow-ups**

1. Why is a sequence number insufficient if the response handler still touches IndexedDB?
2. How do you abort a `Promise.all` of 3 calls when the first fails? Should you?
3. `AbortSignal.any` vs nested controllers — who owns `abort()`?
4. Where do you put the timeout: client signal, HTTP gateway, or both?
5. How does this interact with Vue `<Suspense>` and Nuxt `useAsyncData` cancellation?
6. Should a `POST /checkout` be aborted on unmount? Defend the product answer.

---

[← Back to Overview](../../README-en.md)
