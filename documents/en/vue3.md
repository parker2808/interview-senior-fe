# Vue 3

Senior Vue interviews assume the API is already in muscle memory. They probe **compiler behavior**, **reactivity edges**, and **architecture**: what you hoist vs fetch, what you provide vs store, what you keep client-only. A strong answer is a **decision** under a **constraint**, the **failure mode** you have already seen, and how you would **measure** it. Syntax recitation without production judgment reads as mid-level.

---

## Table of Contents

1. **Core Concepts**

   1.1. [Virtual DOM](#511-virtual-dom)

   1.2. [Options API vs Composition API](#512-options-api-vs-composition-api)

   1.3. [Auto-import Components](#513-auto-import-components)

   1.4. [v-bind vs v-model](#514-v-bind-vs-v-model)

   1.5. [Props: Parent → Child](#515-props-parent--child)

   1.6. [Computed vs Method](#516-computed-vs-method)

   1.7. [Computed vs Watch](#517-computed-vs-watch)

   1.8. [nextTick Use Cases](#518-nexttick-use-cases)

   1.9. [Debug & Fix Component Bugs](#519-debug--fix-component-bugs)

   1.10. [Reactivity System](#5110-reactivity-system)

   1.11. [Lifecycle Hooks](#5111-lifecycle-hooks)

   1.12. [created vs mounted: When to Call API?](#5112-created-vs-mounted-when-to-call-api)

2. **Advanced Features**

   2.1. [Teleport](#521-teleport)

   2.2. [Suspense](#522-suspense)

   2.3. [Custom Directives](#523-custom-directives)

   2.4. [Plugins](#524-plugins)

   2.5. [Render Functions & JSX](#525-render-functions--jsx)

   2.6. [Provide / Inject](#526-provide--inject)

   2.7. [Router Navigation Guards (SPA middleware)](#527-router-navigation-guards-spa-middleware)

   2.8. [Slots & scoped slots](#528-slots--scoped-slots)

   2.9. [keep-alive](#529-keep-alive)

   2.10. [Async components](#5210-async-components)

   2.11. [Hydration mismatch](#5211-hydration-mismatch)

---

## 5. Vue 3

### 5.1. Core Concepts

Interviewers use this block to see whether you can **explain Vue’s runtime as a compiler + scheduler + Proxy graph**, not as a list of options. They will skip “what is a computed” and jump to **why a child re-rendered**, **why a ref stopped updating**, or **how you would migrate a Vue 2 monolith without a rewrite**.

#### 5.1.1. Virtual DOM

**What they actually ask**

“Walk through what happens when state changes.” If you stop at “diff the trees and patch the DOM,” they will push: *what does the Vue 3 compiler change about that story?* They want **patch flags, static hoisting, and the block tree** — and when VDOM is **not** the bottleneck.

**How a senior answers**

- **Decision:** Treat Vue 3’s VDOM as **compiler-informed**, not a naive full-tree walk on every update. The compiler hoists static VNodes, stamps **patch flags** on dynamic nodes, and groups dynamic children into a **block tree** so the runtime patches only flagged bindings.
- **Constraint:** That only helps if the template is stable. `v-if`/`v-for` at the root of a block, fully dynamic `v-bind="obj"`, and `v-html` force coarser flags (`FULL_PROPS`, unkeyed fragments).
- **Failure mode:** Teams “optimize the VDOM” while the real cost is **layout/reflow**, **network waterfalls**, or **creating thousands of reactive effects**. VDOM patch time is rarely the top line on a product dashboard.
- **Measure:** Vue DevTools performance + browser Performance panel. Split **JS (render + reactivity)** vs **Recalculate style / Layout** vs **network**. If INP is layout-bound, `v-once` and patch flags will not save you.

Static nodes are hoisted out of the render function. Dynamic nodes carry flags such as `TEXT`, `CLASS`, `STYLE`, `PROPS`, `HYDRATE_EVENTS`. A **block** (`openBlock`) snapshots a stable child structure so Vue can skip walking static subtrees on updates. `v-once` / `v-memo` are explicit escapes when the compiler cannot prove stability (e.g. huge static legal text, or a list row whose props you know are unchanged).

**Tradeoffs**

| Approach | Use when | Cost |
|---|---|---|
| Trust compiler + templates | Almost all app UI | Need templates, not ad-hoc `innerHTML` |
| `v-memo` / `v-once` | Huge lists / known-stable subtrees | Stale UI if the memo condition is wrong |
| Render function / JSX | Fully dynamic children, headless libs | You lose a lot of compiler hints unless you are careful |
| Virtualize the list | Thousands of rows | Extra complexity; VDOM was never the right layer |

**Production gotchas**

- Unkeyed `v-for` on objects that swap identity → Vue patches in place, **state (inputs, transitions) sticks to the wrong row**.
- Passing a new object/array literal as a prop every render (`:style="{}"`, `:options="[]"`) makes the child look dynamic even if values are equal.
- Forcing layout in `onUpdated` (read `offsetHeight` after writes) dwarfs VNode diff cost.

**Follow-ups**

- Difference between **patch flags** and **block tree**.
- Why Vue 3 can skip static subtrees that Vue 2 could not.
- When you would virtualize vs `v-memo` vs paginate.
- How SSR hydration uses the same block/patch metadata.

---

#### 5.1.2. Options API vs Composition API

**What they actually ask**

Not “which is newer.” They ask how you would **migrate a large Vue 2 app**, what you do with **mixins**, and whether you would **ban Options API**. Seniors talk about **extraction of logic**, **TypeScript**, and **team risk**, not fashion.

**How a senior answers**

- **Decision:** Composition API is the default for new code and for any feature that **cuts across** `data` / `computed` / `methods` / lifecycle. Options API is still fine for **tiny local presentational components** (icon wrapper, static layout chrome) where a composable would be ceremony.
- **Constraint:** A 200-SFC Vue 2 codebase with mixins, filters, and Options-only teammates cannot be rewritten in a quarter. Migrate **by feature**: extract a composable next to the mixin it replaces, then delete the mixin when call sites are gone.
- **Failure mode:** Mixins + composables in the same component — implicit `this.foo` collisions, duplicated lifecycle, “where did this property come from?” Also: rewriting everything to `<script setup>` without tests, then shipping a silent behavior change in `beforeDestroy` vs `onBeforeUnmount` + keep-alive.
- **Measure:** Time to add a cross-cutting feature (permissions, tracking, feature flag) without touching unrelated options; mixin collision incidents; TS coverage on the modules you actually change.

Mixins fail at **namespace** (two mixins ship `data()` keys with the same name), **origin** (DevTools does not tell you which mixin injected `loading`), and **lifecycle merge order**. Composables return **explicit** bindings, are **tree-shakeable**, and compose without `this`. `script setup` is the production default; keep Options only where the component is a leaf and will stay a leaf.

**Tradeoffs**

| | Options | Composition |
|---|---|---|
| Discoverability | `data`/`methods` are a map | Logic grouped by concern; can hide in `useX` |
| Reuse | Mixins, extend | Composables, no name clash |
| TypeScript | Painful `this` | First-class |
| Tree-shaking | Options object always retained | Unused composables drop |
| Tiny leaves | Fast to read | Slightly more imports |

**Production gotchas**

- `this` in Options `data()` is not fully set up — copying Vue 2 patterns that read other data keys inside `data()` still breaks.
- Mixing `setup()` **and** Options `data`/`methods` is legal and is how you migrate incrementally; do not treat it as a smell until the file is stable.
- Composables that close over component instance (`getCurrentInstance()`) are the new mixin: untestable, SSR-hostile.

**Follow-ups**

- How you would replace a 400-line `authMixin`.
- Whether you allow Options in a new Vue 3 greenfield (usually: yes, only for dumb leaves).
- Filters → methods/computed; `$listeners` → `attrs`; `.sync` → `v-model:foo`.

---

#### 5.1.3. Auto-import Components

**What they actually ask**

“Do you auto-import everything?” They want **DX vs explicit public API**, **circular deps**, and **tree-shaking** — especially if you ship a **component library** or a **design system**.

**How a senior answers**

- **Decision:** Auto-import **app-local** UI (`components/`, composables, Vue APIs) in the product app. **Explicitly import** anything that is a **public API**: published packages, cross-domain modules, side-effectful plugins, and anything that must not be pulled in by a greedy resolver.
- **Constraint:** Nuxt / `unplugin-vue-components` hide the dependency graph. That is great until two features auto-import each other or a barrel file re-exports a Node-only util into a client component.
- **Failure mode:** Circular composables that only blow up in production chunks; a design-system barrel (`export * from './components'`) that **defeats tree-shaking**; auto-imported names colliding (`Modal` from two folders).
- **Measure:** Client bundle analyzer on a route, `vite-bundle-visualizer` / rollup-plugin-visualizer; watch for surprise inclusion of chart/map/editor libs on pages that never import them.

Nuxt prefixes nested dirs (`components/form/Input.vue` → `FormInput`) and can path-prefix to avoid collisions. Global `app.component()` registration is the worst of both worlds: always in the bundle, no colocation. For libraries you publish, **do not** rely on the consumer’s auto-import — export named components and let their resolver map them if they want.

**Tradeoffs**

- Auto-import: faster local DX, fewer import lines, worse “go to definition” across repos, hidden cycles.
- Explicit imports: greppable graph, better for public APIs, noisier SFCs.
- Lazy/async components: still need an explicit `defineAsyncComponent` (or Nuxt `Lazy` prefix) when you care about **when** the chunk loads.

**Production gotchas**

- Auto-import does not break cycles — it **hides** them. If `useCart` → `useUser` → `useCart`, you get `undefined` store at init or a TDZ error that only appears on a cold load order.
- Type generation (`components.d.ts`) can drift in CI if the plugin does not run; treat it as a build artifact or commit it with a check.
- Resolvers that import from `lodash` or a whole icon pack per component name will wreck tree-shaking.

**Follow-ups**

- Would you auto-import Pinia stores? (Usually yes in-app, never across packages.)
- How you prevent two `Button.vue` files from colliding.
- Difference between auto-import and global registration for SSR payload size.

---

#### 5.1.4. v-bind vs v-model

**What they actually ask**

They already know `v-model` is `:modelValue` + `@update:modelValue`. They want **multiple v-models**, **modifiers**, **`defineModel`**, and the rule **do not v-model a prop**. Form-library choice shows up on product teams.

**How a senior answers**

- **Decision:** `v-bind` for one-way data. `v-model` / `v-model:foo` for a **single source of truth owned by the parent** (or by the form library). Inside the child, emit updates or use `defineModel()` — never assign to the prop.
- **Constraint:** Vue 3 dropped Vue 2’s default `value`/`input` except on native elements. Component authors must document the model name. Native modifiers (`.trim`, `.number`, `.lazy`) are not automatically applied to custom components unless you read `modelModifiers`.
- **Failure mode:** `v-model="props.user"` (or mutating a nested field on a prop object) — works until the parent re-fetches and overwrites in-progress edits, or until strict warnings become errors. Two-way sync `watch` loops (`watch(a, setB); watch(b, setA)`) on currency/date fields.
- **Measure:** Form “lost keystrokes” tickets, Vue “mutation of prop” warnings in CI (treat as fail), number of `watch` bridges in form SFCs (should trend down).

`v-model:firstName` and `v-model:lastName` are just two named models. `defineModel()` (3.4+) is the production way to declare that contract without boilerplate. Fallthrough attrs (`v-bind="$attrs"`) are how you keep a headless input accessible without re-declaring every native attribute.

**Tradeoffs**

| Pattern | When | Risk |
|---|---|---|
| Parent-owned `v-model` | Filters, settings, simple fields | Parent re-renders on every keystroke unless you debounce the emit |
| Local copy, emit on blur/submit | Heavy forms, expensive parents | Divergence from server truth |
| Form library (VeeValidate, FormKit, TanStack Form) | Cross-field validation, error UX | Another abstraction; still must not mutate props |
| `v-bind` only | Read-only / presentational | People will hack a `watch` to write back |

**Production gotchas**

- `v-model` on a **prop** of a child that also receives the same object from a store: two writers, last write wins.
- `.number` on empty input → `0` vs `''` surprises in validation.
- Binding `v-model` to a **Pinia** field from many inputs without a local draft will broadcast every keystroke to every subscriber.

**Follow-ups**

- How `modelModifiers` work on a custom input.
- `defineModel` vs explicit props/emits for a library you publish (explicit is more compatible and documentable).
- Native `v-model` is always component state; there is no separate “uncontrolled input” mode to hide behind.

---

#### 5.1.5. Props: Parent → Child

**What they actually ask**

One-way data flow is the junior bar. Seniors get **object identity causing updates**, **unwrap / boolean casts**, **fallthrough attrs**, and **provide vs props vs store**.

**How a senior answers**

- **Decision:** Props for **configured, typed contracts** between a parent and a child you own. Provide/inject for **tree-wide ambient** values (theme, form context, i18n) that would otherwise be drilled through presentational layers. Pinia for **app-wide client state** with multiple unrelated subtrees. Do not pick one hammer.
- **Constraint:** Props are one-way. Objects and arrays are passed **by reference** — the child can mutate them at runtime and Vue will not always warn if you mutate a nested field. Treat props as **read-only snapshots**; if the child must edit, emit a new value.
- **Failure mode:** Parent does ` :user="getUser()"` or `:filters="{ ...filters, page }"` creating a **new object every render** → child `watch(() => props.filters, ...)` or expensive setup re-runs even when values are equal. Opposite failure: mutating `props.filters.page++` so three pages share one object and “mysteriously” stay in sync.
- **Measure:** Vue DevTools “why did this component update”; count of `watch(() => props.x, { deep: true })` in the codebase (usually a smell); unnecessary child renders on a typed form.

Boolean attributes still **cast** (`<Comp disabled />` → `disabled: true`). `defineProps` + TypeScript is the contract; `withDefaults` for defaults. `inheritAttrs: false` + bind `$attrs` onto the real `<input>` is the production pattern for wrapper components (a11y + native listeners).

**Tradeoffs**

| Channel | Coupling | Update granularity | Testability |
|---|---|---|---|
| Props | Explicit | Per parent render + identity | Easy |
| Provide/inject | Implicit, tree-scoped | Who `provide`s | Need a wrapper |
| Pinia | App-global | Store subscribers | Mock the store |

**Production gotchas**

- Destructure `const { user } = defineProps<...>()` **loses reactivity** unless you use `toRefs` / `toRef` or keep `props.user` (in `<script setup>`, compiler macros can compensate — do not rely on that in plain TS files).
- Large lists as props: prefer `shallowRef` on the parent and pass the list; deep Proxy on 10k rows is a reactivity tax, not a VDOM tax.
- `v-bind="object"` as props + native attrs can collide (`id`, `class`, `style` merge rules).

**Follow-ups**

- When you would `markRaw` a prop (third-party class instance).
- How you version a design-system prop without breaking ten apps (`union` + deprecation period).
- Attrs vs props vs slots for a `Button` that must stay native-clickable.

---

#### 5.1.6. Computed vs Method

**What they actually ask**

They want **caching and purity**, not “computed is for display.” The trap is **calling a method in the template** that filters 20k rows, or putting a **side effect** in a computed because “it has to stay in sync.”

**How a senior answers**

- **Decision:** Derived, synchronous, **pure** values → `computed`. Event handlers, imperative work, and anything that needs **arguments** → methods. If you need a parameterized derivation, use a computed of a `Map` / pre-indexed structure, not a method called from every row.
- **Constraint:** Computed caches on **reactive dependency identity**. If you read `list.filter(...)` where `list` is a new array every time, the cache never hits. Computed must be **synchronous**; `async computed` is not a thing — that is `watch` + state, or a query library.
- **Failure mode:** Template `{{ format(user) }}` on 500 rows with a heavy formatter; or a computed that writes to `localStorage` / increments a counter (hidden re-run in DevTools, SSR mismatch).
- **Measure:** `onRenderTracked` in isolation, or profiler: computed eval count vs render count. A computed that re-evaluates every render is a method in disguise (usually because a dependency is unstable).

**Tradeoffs**

- Computed: cheap to read many times per render, **dependency-tracked**, cannot take arguments.
- Method: flexible, **runs every call**, easy to accidentally do O(n) per row.
- A computed that lists “deps” in a comment but reads extra reactive state is lying — the graph is what it **reads**, not what you intended.

**Production gotchas**

- Writing `computed(() => props.items.sort())` **mutates the prop** (sort in place). Copy first, or the parent list reorders itself.
- Computed that returns an object/array literal is a **new identity** every invalidation — children watching it will always fire. Sometimes you want that; often you wanted a stable filtered list.
- Debugging with `console.log` inside computed: that is a side effect and will lie to you about how often it runs in prod.

**Follow-ups**

- Writable computed as a `v-model` adapter to a nested store field.
- Why `computed` is the wrong place to fetch.
- How Vue 3.4+ computed debugger options (`onTrack` / `onTrigger`) help.

---

#### 5.1.7. Computed vs Watch

**What they actually ask**

“When do you use `watch` instead of `computed`?” The senior bar is: **watch is for side effects**. Then they ask `watch` vs `watchEffect`, `flush` timing, and **over-collection**.

**How a senior answers**

- **Decision:** If the UI can be expressed as **data derived from data**, it is a computed. If something **outside the graph** must happen (fetch, analytics, sync to URL, drive a third-party widget), it is a `watch` / `watchEffect` / lifecycle hook. Prefer **explicit `watch` sources** over `watchEffect` in large components.
- **Constraint:** `watchEffect` re-runs when **any** reactive read in its body changes, including accidental reads (`if (debug) console.log(store)`). That is over-collection. `watch` with a getter is a contract: these are the sources.
- **Failure mode:** Fetching in a computed (or in `watchEffect` without abort) → request storms, races, SSR double-fetch. `watch` with `{ deep: true }` on a large reactive graph → every keystroke in a form re-runs expensive work.
- **Measure:** Network waterfall for duplicate GETs; Vue DevTools timeline for watcher count; abort/unmount tests.

```ts
// Side effect + race: watch the id, abort the in-flight request.
watch(
  () => props.userId,
  async (id, _prev, onCleanup) => {
    const ac = new AbortController()
    onCleanup(() => ac.abort())
    user.value = await api.getUser(id, { signal: ac.signal })
  },
  { immediate: true },
)
```

**Tradeoffs**

| | computed | watch | watchEffect |
|---|---|---|---|
| Purity | Required | Side effects | Side effects |
| Sources | Implicit, tracked | Explicit | Implicit, easy to over-collect |
| Old value | n/a | Yes | No |
| SSR | Fine if pure | Can double-run if you also fetch in setup | Easy to touch `window` |

**Production gotchas**

- `watch` on a `reactive` object without a getter watches **replacement of the proxy**, not nested fields, unless `deep`. Prefer `() => state.query`.
- `flush: 'post'` when the side effect needs DOM; default `'pre'` runs before component update — measuring layout in a default watch reads **stale DOM**.
- `watchEffect` in a composable that is called from many components multiplies subscriptions; that is how “the app got slow after we added analytics.”

**Follow-ups**

- `watchPostEffect` vs `nextTick`.
- Why `immediate: true` on a fetch watch can still race with unmount.
- Replacing `watch(route, fetch)` with a keyed `useAsyncData` / query library.

---

#### 5.1.8. nextTick Use Cases

**What they actually ask**

Not “wait for the DOM.” They want **scheduler flush vs microtasks**, **measuring**, and whether you use `nextTick` as a **race-condition bandage**.

**How a senior answers**

- **Decision:** Use `nextTick` when you need the **DOM that Vue has already scheduled** (focus a `v-if` input, measure a list after push, hand a node to a chart lib). Do **not** use it to “let the store settle” or to order two async calls.
- **Constraint:** Vue batches updates. State changes queue a job; the DOM is patched in that flush. `nextTick` resolves after the current flush (Promise-based; Vue uses microtasks). `queueMicrotask` / `Promise.then` can run **before** Vue’s flush if you are already inside a microtask.
- **Failure mode:** `await nextTick(); await nextTick()` chains to hide a child that has not mounted yet — the real bug is missing `onMounted`, a `v-if`, or a Teleport target. Also: measuring in `nextTick` then writing layout → forced reflow loops.
- **Measure:** If a bug disappears when you wrap it in `nextTick`, you do not have a fix — you have a **timing dependency**. Add a failing test that ticks the clock / flushes Vue (`flushPromises` + `await wrapper.vm.$nextTick()`) and then replace the bandage with a lifecycle or `watch(..., { flush: 'post' })`.

**Tradeoffs**

- `nextTick`: correct for “Vue’s DOM, this tick.”
- `watch` + `flush: 'post'`: correct for “whenever X changes, after render.”
- `requestAnimationFrame` / `ResizeObserver`: correct for layout that is not Vue’s scheduler (fonts, images, CSS transitions).

**Production gotchas**

- SSR: `nextTick` exists; **there is no browser DOM**. Chart init in `nextTick` from `setup` still needs `onMounted` / `ClientOnly`.
- Calling `nextTick` during render (inside computed/setup render) is a smell and can warn.
- Third-party widgets: one `nextTick` is not enough if the child is async; wait for the child’s `onMounted` via a callback or `watch` on a template ref becoming non-null.

**Follow-ups**

- Pre vs post flush, `watchPostEffect`.
- How Vue 3’s scheduler coalesces multiple `ref` writes in the same tick.
- Why `await props.x` is not a substitute for `nextTick`.

---

#### 5.1.9. Debug & Fix Component Bugs

**What they actually ask**

A war-story question: a component “randomly” does not update, or keep-alive shows stale data. They want a **method**, not “I console.log.”

**How a senior answers**

- **Decision:** Reproduce with a **minimal reactive path** (props → computed → DOM). Classify: **lost reactivity**, **stale closure/cache**, **race**, **identity**, **SSR mismatch**. Fix the class, not the instance.
- **Constraint:** Vue 3 Proxies mean `===` with a raw object fails, DevTools may show a Proxy, and destructuring silently drops tracking.
- **Failure mode:** Shipping a `nextTick` / `key="Date.now()"` workaround that resets child state on every parent render.
- **Measure:** Vue DevTools component inspector + timeline; `onRenderTracked` / `onRenderTriggered` locally; a regression test around the reactive path.

Lost reactivity from destructure:

```ts
const state = reactive({ count: 0 })
const { count } = state          // number, not tracked
const { count: countRef } = toRefs(state) // Ref, tracked
```

Proxy vs raw: `watch(obj, ...)` where `obj` is `toRaw(store.item)` will **not** see store updates. Map/Set from a library, or a class instance, should be `markRaw` or you will proxy internals and break `instanceof` / identity maps.

**keep-alive cache bugs:** the instance is not destroyed; `onMounted` will not re-run. Data fetches belong in `onActivated` (or a `watch` on the route param) or you will show the previous customer’s record. `max` + LRU will silently drop and remount — treat that as a feature, not a leak.

**Tradeoffs**

- DevTools first vs adding logs: DevTools lie less about **which** dependency triggered. Logs in computed/watch change timing.
- `key` remount vs fixing state: remount is valid when the **identity of the entity** changed (`:key="userId"`); it is not valid as a generic “reset Vue.”

**Production gotchas**

- `reactive` + `v-for` of the same object in two lists: edits alias.
- `ref` unwrapped in template but not in `setTimeout` callbacks — people “fix” it by wrapping everything in `nextTick`.
- Production builds strip warnings; the prop-mutation bug only appeared in staging.

**Follow-ups**

- How you debug a update that happens **every frame** (usually a watcher writing a value that invalidates itself).
- Pinia `$patch` vs replacing the whole `$state`.
- Hydration mismatch vs “blank after load” (see [5.2.11](#5211-hydration-mismatch)).

---

#### 5.1.10. Reactivity System

**What they actually ask**

Vue 2 `Object.defineProperty` vs Vue 3 `Proxy`, **ref vs reactive**, then the production knobs: **`markRaw`**, **`shallowRef`**, **`triggerRef`**. This is where seniors separate from people who memorized `.value`.

**How a senior answers**

- **Decision:** `ref` for primitives and for values you **replace as a whole**. `reactive` for a local bag of fields you mutate in place. `shallowRef` for **large immutable lists** / API pages you swap in one assignment. `markRaw` for **third-party instances** (Mapbox, Chart, router, class models with their own identity).
- **Constraint:** Proxy can intercept new properties and index writes (Vue 2 could not). It cannot wrap primitives, and it **cannot** see mutations inside `markRaw` / `shallow` targets. SSR + reactivity: the same module-level `reactive` is **shared across requests** unless you create it per app.
- **Failure mode:** Deep `reactive()` on a 50k-row table; wrapping a WebSocket / map instance and breaking its internals; `ref(reactiveObj)` double-wrap confusion; destructuring (see [5.1.9](#519-debug--fix-component-bugs)).
- **Measure:** Time to interact with a large grid before/after `shallowRef`; heap snapshots for leaked reactive objects (watchers not stopped on unmount).

```ts
const rows = shallowRef<Row[]>([])
function setPage(next: Row[]) {
  rows.value = next          // one trigger
}
function patchHidden(i: number, row: Row) {
  rows.value[i] = row        // NOT tracked (shallow)
  triggerRef(rows)           // explicit signal when you must mutate in place
}

const map = markRaw(new MapboxMap(el))
```

**Tradeoffs**

| API | Tracks | Cost | Typical use |
|---|---|---|---|
| `ref` | `.value` replace + deep if object | Fine | Primitives, swapped objects |
| `reactive` | Deep mutations | Proxies the tree | Forms, small objects |
| `shallowRef` | Only `.value` replace | Cheap | Big lists, immutable pages |
| `shallowReactive` | First-level keys | Cheap | Store-like bags of already-reactive fields |
| `markRaw` | Nothing | Zero Vue cost | Third-party / identity-sensitive |
| `readonly` / `shallowReadonly` | Reads, blocks writes | Extra proxy | Provide/inject contracts |

**Production gotchas**

- `reactive` **unwraps** nested refs. `reactive({ count: ref(0) }).count` is a number in templates and in JS — until you nest it in a `ref` incorrectly.
- Vue 2 migration: `Vue.set` is gone; Proxy handles new keys. Arrays still need **index/length** awareness for some tricks (`length = 0` is tracked; direct index set is tracked in Vue 3).
- Putting a reactive object in a `Set`/`Map` as a key uses **Proxy identity**, not the raw object. Use `toRaw` for interop with third-party maps.
- Module-scope `const store = reactive({})` in a Nuxt/SSR app is a **cross-request leak**.

**Follow-ups**

- `toRef` / `toRefs` / `toValue` / `unref`.
- Why `watch(reactiveObj, cb)` needs `deep` or a getter.
- Effect scope: why composables stop tracking on unmount (`onScopeDispose`).

---

#### 5.1.11. Lifecycle Hooks

**What they actually ask**

They will sketch Vue 2 vs Vue 3 names, then jump to **`setup` vs `onMounted` vs SSR** and **`onScopeDispose`**. `onMounted` **does not run on the server**. That sentence is the interview.

**How a senior answers**

- **Decision:** Create state and **pure** subscriptions in `setup`. Touch the **DOM / `window` / third-party widgets** in `onMounted`. Stop them in `onBeforeUnmount` **or** `onScopeDispose` if you are writing a composable that may be called outside a component (Pinia action, shared helper).
- **Constraint:** SSR render runs `setup` + `onServerPrefetch` (and Nuxt’s async data). It does **not** run `onMounted` / `onUpdated`. Client hydration re-runs `setup` then `onBeforeMount` / `onMounted`. Code that “works in SPA” can no-op on first paint in Nuxt.
- **Failure mode:** Registering `window.addEventListener` in `setup` (runs on server → crash, or runs twice with no cleanup). Composables that `watch` but never dispose when used inside `computed` / conditional `if (flag) useFoo()` — composables must be called **synchronously and unconditionally** in `setup`, or the instance/scope is wrong.
- **Measure:** “Does this run in `nuxi build` SSR?” If it touches `document`, it is in the wrong hook. Playwright screenshot of first HTML vs hydrated UI.

Vue 3 Composition mapping: `setup` covers Vue 2 `beforeCreate`/`created`. `onBeforeUnmount` / `onUnmounted` replace `beforeDestroy` / `destroyed`. keep-alive adds `onActivated` / `onDeactivated`. Error handling is `onErrorCaptured` (parent), not a lifecycle of the thrower.

**Tradeoffs**

- `onServerPrefetch` vs client `onMounted` fetch: prefetch is for **HTML completeness**; mounted fetch is for **client-only** widgets. Doing both without a key is a double fetch (see [5.1.12](#5112-created-vs-mounted-when-to-call-api)).
- `onScopeDispose` vs `onUnmounted`: scope dispose fires when the **effect scope** ends (component unmount, `store.$dispose`, manual `scope.stop()`). Use it in composables so they work in stores too.

**Production gotchas**

- `onMounted` inside `v-if` child: it runs when the child is created, not when the parent mounts. Teleport does not change that — the logical parent still owns the instance.
- `onUpdated` for logging: it runs a lot; prefer `watch` with a specific source.
- Async `setup` delays mount until the promise resolves and **requires `<Suspense>`** — easy to forget in a SPA, then the component never appears.

**Follow-ups**

- Order: parent setup → child setup → child mount → parent mount (SPA). SSR has no mount.
- `getCurrentInstance()` in a lifecycle — why you should almost never.
- keep-alive: which hooks fire on tab switch ([5.2.9](#529-keep-alive)).

---

#### 5.1.12. created vs mounted: When to Call API?

**What they actually ask**

Vue 2: `created` vs `mounted`. Vue 3: **top-level `await` in `setup` + Suspense** vs **`onMounted`**. They want **races** and **abort on unmount**, plus SSR: mounted never runs on the server so **you will not have data in the HTML**.

**How a senior answers**

- **Decision:** Data needed for **first paint / SEO / SSR** → fetch in `setup` (or Nuxt `useAsyncData` / `useFetch`). Data or APIs that need **DOM or `window`** (feature-detect, chart, WebSocket to a user-only endpoint you do not want in HTML) → `onMounted`. Never “call it in both to be safe.”
- **Constraint:** Top-level `await` in `<script setup>` makes the component async; the parent **must** wrap `<Suspense>` (or Nuxt must handle it). Without that, you get an empty hole or a warning. SPA-only apps often skip Suspense and fetch in `onMounted`, accepting a spinner.
- **Failure mode:** Race: `userId` changes faster than the network; the slower response wins. Unmount: `setState` on an unmounted component, or a leaked interceptor. SPA fetch in `onMounted` + Nuxt SSR = **client-only flash**, no payload.
- **Measure:** Duplicate requests in the network panel on first load (SSR + client); aborted requests on fast navigation; time-to-data vs TTFB.

```ts
onMounted(() => {
  const ac = new AbortController()
  void (async () => {
    try {
      user.value = await api.getUser(props.id, { signal: ac.signal })
    } catch (e) {
      if ((e as { name?: string }).name === 'AbortError') return
      error.value = e
    }
  })()
  onBeforeUnmount(() => ac.abort())
})
```

In Vue 3.4+ you can also `watch(id, ..., { immediate: true })` with `onCleanup(abort)` (see [5.1.7](#517-computed-vs-watch)). In Nuxt, prefer keyed `useAsyncData` so the payload **dedupes** the client replay.

**Tradeoffs**

| Where | HTML has data | DOM available | Race handling |
|---|---|---|---|
| `setup` + await + Suspense | Yes (with SSR) | No | You still must cancel if params change |
| `onMounted` | No | Yes | Natural “client only”; worse SEO |
| Nuxt `useAsyncData` | Yes | No | Key + abort + payload |

**Production gotchas**

- `created` in Options API **does** run on the server; `mounted` does not. Porting a Vue 2 component that fetched in `mounted` to Nuxt silently drops SSR data.
- Top-level await without error handling: a 500 in setup **kills the whole Suspense boundary**, not just a field.
- Fetching in `setup` without a cache key: parent re-created on route reuse → repeat GET. That is why Nuxt/query libraries exist.

**Follow-ups**

- How you cancel in-flight work when `keep-alive` deactivates (abort vs let it finish and ignore).
- Interaction with navigation guards that also fetch the user.
- `callOnce` / payload in Nuxt vs hand-rolled cache.

---

### 5.2. Advanced Features

These topics show up when the interviewer moves from “you know Vue” to “you have shipped messy UI”: overlays, async trees, plugins that do not leak on SSR, and router gates that are not fake security.

#### 5.2.1. Teleport

**What they actually ask**

Modals/toasts are the prompt. Seniors are expected to talk about **focus**, **SSR target existence**, and **stacking** — not the `to="#id"` syntax.

**How a senior answers**

- **Decision:** Teleport overlays (modals, dialogs, toasts, popovers) to a **stable host** (`body` or a dedicated `#overlays`) so `overflow: hidden` / `transform` on ancestors do not clip or create a stacking context. Keep **state in the logical component** (where the open button lives) so permissions and teardown stay correct.
- **Constraint:** On SSR, `document.querySelector` of the target must match what the client hydrates. The target **must exist in the server HTML**. Teleporting to `#modal` that is only rendered in `onMounted` mismatches.
- **Failure mode:** Two modals, no focus trap, Tab walks the page behind; or `Teleport` + `position: fixed` inside a `transform` parent **without** teleporting — the “fix” of teleporting to `body` then fighting `z-index` with ever-larger numbers.
- **Measure:** Keyboard-only pass (focus in, Tab cycle, Escape, restore focus to the opener). axe on the dialog. Visual stacking with a toast + modal + select dropdown open together.

**Tradeoffs**

- `to="body"`: simple, stacking is global, your CSS reset must not assume `#app` as root for overlays.
- Dedicated overlay root: predictable layers (toast > modal > popover), extra DOM contract.
- `disabled` on Teleport: useful in tests or when you want the modal in-flow on mobile.

**Production gotchas**

- a11y: `role="dialog"`, `aria-modal`, initial focus, **restore focus** on close. Teleport moves DOM, not the Vue parent — `aria-controls` / labelled-by ids still work if they are in the teleported tree.
- SSR: Vue 3 can teleport on the server **if the target is in the same render**. Empty client target → content missing or warning.
- Order: multiple teleports to the same target append in **mount order**, not z-index. A late toast can sit under an earlier modal in the DOM.
- `<Transition>` wrapping `<Teleport>` vs inside: wrap the **content**, not the Teleport, or leave hooks will not run.

**Follow-ups**

- Teleport vs a global modal store (you often want both: store for “which modal,” Teleport for DOM).
- Select/dropdown in a modal that also teleports — stacking context wars.
- Vue 3.5+ defer / disabled patterns.

---

#### 5.2.2. Suspense

**What they actually ask**

They know the fallback slot. They want **experimental caveats**, **errors**, and **nested Suspense**. On a Nuxt team, the right answer may be “we rarely use Vue Suspense ourselves.”

**How a senior answers**

- **Decision:** Use Vue `<Suspense>` when you have **async `setup` / async components** that should gate a tree. Use **`onErrorCaptured`** (and a dedicated error component) because Suspense **does not** replace error boundaries. Prefer **Nuxt `useAsyncData` pending/error** for route-level data — it is the productionized version of this idea.
- **Constraint:** Vue’s component Suspense is still **experimental**; the API can change. Nested Suspense: the inner boundary handles inner fallbacks; a throw that escapes still bubbles. There is no official “reset this boundary” API — remount with a `key` or navigate away.
- **Failure mode:** One top-level Suspense around the whole app → a single failing widget blanks the page. Async setup without a matching boundary → never-rendering component. Errors in fallback vs default slot: easy to lose the original error.
- **Measure:** Time-to-fallback vs time-to-content; error-rate of async components; whether a 500 in a widget takes down the route.

**Tradeoffs**

- Suspense: declarative loading for async setup; coarse, experimental.
- Per-component `pending` refs: verbose, explicit, easy to test.
- Nuxt/query: keys, cache, SSR payload, retries — usually the better default.

**Production gotchas**

- Nested Suspense can **hide** a parent fallback (inner resolves, outer still pending on another async child). Interviewers like this.
- SSR: both server and client must resolve the same async tree or you hydrate into a mismatch.
- `onErrorCaptured` must return `false` if you fully handle; otherwise it keeps propagating.

**Follow-ups**

- Relationship to `defineAsyncComponent` loading/error slots (can coexist; do not double-spinner).
- How Nuxt 3 uses Suspense internally for pages.
- Timeout / pending delay so fast responses do not flash a skeleton.

---

#### 5.2.3. Custom Directives

**What they actually ask**

They expect you to **prefer composables**. Directives are for **DOM-only** behavior with **cleanup**. `v-focus` is junior; `v-click-outside` cleanup and SSR `getSSRProps` is senior.

**How a senior answers**

- **Decision:** If it needs Vue state, lifecycle, or testability → composable + template ref. If it is a **pure DOM annotation** (observe visibility, trap a class, measure) and should attach like HTML → directive. Always unbind in `unmounted` (and `beforeUnmount` if the el is already gone).
- **Constraint:** Directives do not get a typed instance the way components do; they are easy to write with leaked listeners. SSR: `created`/`mounted` do not run on the server; use `getSSRProps` if the directive must emit HTML attrs for the first paint.
- **Failure mode:** `document.addEventListener` in `mounted` without `removeEventListener`; a click-outside that fires on the same click that opened the menu; directives that call `binding.instance` and break under `<script setup>`.
- **Measure:** Listener count in DevTools after open/close 50 times; SSR HTML contains the expected attribute.

**Tradeoffs**

- Composable `useClickOutside(el, cb)`: testable, TS-friendly, cleanup via `onScopeDispose`.
- Directive `v-click-outside`: nicer templates for design-system consumers who will not write setup code.
- Component `<ClickOutside>`: slot wrapper, more DOM.

**Production gotchas**

- Vue 3 directive hooks: `beforeMount`, `mounted`, `beforeUpdate`, `updated`, `beforeUnmount`, `unmounted`. Vue 2 `bind`/`inserted` names are gone.
- `binding.value` changing: handle in `updated`, do not re-register a second listener.
- Directives on components listen on the **root element** of that component (fragments: you need `inheritAttrs` care).

**Follow-ups**

- Why `v-memo` is a compiler directive, not a custom one.
- IntersectionObserver as a directive vs composable for infinite scroll.
- Permission to use directives in a codebase that bans them (many seniors do ban them except a11y/DOM).

---

#### 5.2.4. Plugins

**What they actually ask**

`app.use` vs `provide`, and whether the plugin is **SSR-safe**. Global `app.config.globalProperties.$http` is the Vue 2 answer; seniors talk **per-app context** and **no shared mutable module state**.

**How a senior answers**

- **Decision:** A plugin is for **installing a capability into an app instance**: `install(app, options)` registers components, `provide`s a client, or adds a directive. Prefer **`app.provide` + `inject`** (typed `InjectionKey`) over `globalProperties` for anything new. Use `app.use` once in `main.ts` / a Nuxt plugin, not from random SFCs.
- **Constraint:** SSR creates **one app per request**. A plugin that does `let cache = {}` at module scope **leaks user A into user B**. Browser-only plugins belong in a `.client` Nuxt plugin or behind `import.meta.client`.
- **Failure mode:** Installing a plugin twice; a plugin that reads `window` at import time (breaks SSR build); providing a mutable singleton store instead of Pinia (testing and SSR both lose).
- **Measure:** Two concurrent SSR requests with different users — plugin state must not cross. Bundle: client-only plugin must not land in the server chunk.

**Tradeoffs**

| Mechanism | Discoverability | SSR | TS |
|---|---|---|---|
| `provide` / `inject` | Implicit | Per-app if created in `install` | `InjectionKey` |
| `globalProperties` | `this.$x` (Options) | Easy to misuse | Weak |
| Pinia | Explicit `useX()` | Official Nuxt module | Strong |
| Import a module | Explicit | You must not singleton-cache | Strong |

**Production gotchas**

- Vue 3 plugins should not assume `this` in Options-only consumers.
- Nuxt: `defineNuxtPlugin` + `nuxtApp.vueApp.use` — order vs other plugins matters for i18n/auth.
- `app.config.errorHandler` in a plugin: compose with the existing handler, do not replace it silently.

**Follow-ups**

- How you would wrap a third-party analytics SDK (client-only, queue until consent).
- Plugin vs composable: if it does not need `app`, it is not a plugin.
- Testing: `createApp` + `use` + `provide` in a harness.

---

#### 5.2.5. Render Functions & JSX

**What they actually ask**

When templates are **better**, and when you drop to `h()` / JSX for **headless** components or **dynamic children**. “JSX is faster” is a wrong answer in Vue.

**How a senior answers**

- **Decision:** Templates by default — you want the **compiler** (hoists, patch flags, `v-model`, directives). Render functions / JSX for **headless** libraries (props in, slots/default VNodes out), runtime-chosen tag maps, or when children are a data structure you already have as VNodes.
- **Constraint:** Hand-written `h()` usually **loses patch flags** unless you replicate compiler output. Vue JSX is Vue-specific: `v-model`, `v-show`, and `onUpdate:modelValue` are compiler transforms, not HTML `onclick`.
- **Failure mode:** Rewriting a design system to JSX for familiarity and regressing update performance / breaking `inheritAttrs`. Or building a table with `innerHTML` because `h()` felt verbose.
- **Measure:** Same list, template vs `h()`: update time in profiler. If they are equal, keep the template for the team.

**Tradeoffs**

- Template: compiler opts, designer-friendly, SFC tooling.
- `h()`: maximum control, ugly for real UI, great for thin wrappers (`h(resolvedTag, attrs, slots)`).
- JSX: nicer than nested `h()`, extra toolchain, Vue-specific semantics to teach.

**Production gotchas**

- `slots.default?.()` in a render function: calling slots in the wrong place breaks compiled slot optimizations / `v-if` inside the slot.
- Functional components in Vue 3 are just functions returning VNodes — no 2.x `functional: true` performance myth.
- Headless pattern: renderless component with a scoped slot (`{ open, close }`) is often **clearer** than JSX.

**Follow-ups**

- How you would implement `<Component :is="tag">` vs `h(tag)`.
- Vue compiler `v-memo` equivalent in `h()` (you mostly do not).
- Publishing a library: SFC vs render function for consumers who do not use the Vue compiler (rare now).

---

#### 5.2.6. Provide / Inject

**What they actually ask**

Typed **`InjectionKey`**, **mutability**, **vs Pinia**, and **testing**. Prop drilling is the prompt; the real topic is **who owns writes**.

**How a senior answers**

- **Decision:** Provide/inject for **a subtree contract** (form context, tabs, map instance, design-system theme). Pinia for **app-wide client state** that outlives a subtree. Provide a **readonly ref + explicit methods** (`setTheme`), not a raw mutable reactive object, unless the child is the designated writer.
- **Constraint:** Inject is **not** reactive if you provide a non-reactive value. Provide in `setup`; inject in `setup`. String keys collide across libraries — use `InjectionKey` symbols. There is no DevTools “where was this provided?” as clear as props.
- **Failure mode:** Using provide as a **global store** (provide from `App.vue`, inject everywhere) then discovering SSR leaks, impossible tests, and circular updates. Mutating an injected reactive object from a leaf far from the owner.
- **Measure:** Number of inject sites for a key; whether a storybook/test can mount the child with a fake provide; accidental writes (readonly warnings).

```ts
export const FormKey: InjectionKey<{
  register: (id: string) => void
  disabled: Readonly<Ref<boolean>>
}> = Symbol('form')
```

**Tradeoffs**

| | Provide/inject | Pinia | Props |
|---|---|---|---|
| Scope | Vue tree | App (or SSR request) | Parent–child |
| Hidden deps | Yes | Import is explicit | No |
| SSR | Per app if created in setup | Official story | Easy |
| Tests | Must wrap | `setActivePinia` | Pass props |

**Production gotchas**

- Default values in `inject(key, default)`: if the default is an object, **do not** share one mutable default across instances — use a factory (`inject(key, () => ..., true)`).
- Providing `reactive(state)` then `readonly` at the boundary is the production contract.
- Nuxt: `useState` is often a better “request-scoped provide” than rolling your own.

**Follow-ups**

- How a headless `Listbox` uses provide internally.
- Why Pinia is not “just provide/inject with extra steps” (devtools, SSR payload, store identity, HMR).
- Optional inject for a component that works standalone or inside a group.

---

#### 5.2.7. Router Navigation Guards (SPA middleware)

**What they actually ask**

How you gate routes in a Vue SPA (no Nuxt). They want **hydrate auth once**, **`meta` roles**, the sentence **guards are UX not real auth**, and Vue Router 4 **return vs `next()`**. Nuxt wraps this as `middleware/` — see [Nuxt · Middleware](./nuxt.md#64-middleware).

**How a senior answers**

- **Decision:** One global `beforeEach` that (1) **waits for a single auth hydrate**, (2) reads `to.meta.requiresAuth` / `roles`, (3) **returns** a redirect location or `false`. Per-route `beforeEnter` only for truly unique cases. In-component `onBeforeRouteLeave` for **unsaved work**, not auth.
- **Constraint:** Guards run on the client (and on SSR if you use Vue Router with SSR / Nuxt). They **cannot** be the security boundary — APIs still authorize. `localStorage` tokens are not available on the server; cookies are.
- **Failure mode:** Hitting `/me` on every navigation (flash + rate limit). Vue Router 3-style `next()` **called twice** (infinite loop, or navigation cancelled with a warning). Treating `meta.roles` as security while the admin API is open.
- **Measure:** Count of auth HTTP calls per session (should be ~1 + refresh). Time to first authenticated paint. Redirect loops in logs (`/login` → guard → `/login`).

```ts
router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.ready) await auth.hydrate()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  const roles = to.meta.roles as string[] | undefined
  if (roles?.length && !roles.some((r) => auth.roles.includes(r))) {
    return { path: '/403' }
  }
})
```

Vue Router 4: **return** a route location, `false`, or nothing. Do not mix `next()` with returns. `afterEach` cannot cancel — use it for title, analytics (once, not in SSR if it would double-count).

**Tradeoffs**

- Global guard: consistent, easy to audit, can become a god function — split helpers, not five globals.
- `meta` on route records: data-driven, works with nested routes (check `to.matched`).
- Component-level auth: too late, flashes protected UI.

**Production gotchas**

- Nested routes: a child with `requiresAuth` under a layout that does not have it — walk `to.matched`.
- Hydrate in the guard **and** in `App.vue` without a lock → duplicate `/me`.
- `next({ ...to, replace: true })` loops; returning `{ path, query }` with the same location does too — compare `to.fullPath`.
- Guards are not middleware in the Node sense: no access to raw request unless you are on Nuxt/SSR.

**Follow-ups**

- `onBeforeRouteUpdate` vs remounting with `:key="route.params.id"`.
- How you would feature-flag a route without shipping the chunk (still not security).
- Mapping this model to Nuxt route middleware and Nitro `server/middleware`.

---

#### 5.2.8. Slots & scoped slots

**What they actually ask**

How you would design a **table / listbox / form field** so the consumer owns the cell UI. They want **scoped slots vs render props**, **forwarding slots**, and compile implications — not `slot="header"`.

**How a senior answers**

- **Decision:** Default slot for the common case; **named slots** for layout regions; **scoped slots** when the parent needs **data the child owns** (row, `open`, `error`). Headless components are “scoped slots + provide.” Prefer this over a forest of boolean props (`showAvatar`, `avatarRounded`, …).
- **Constraint:** Scoped slot props are **the child’s contract**. Changing the shape is a breaking API. Slots are compiled; extra wrappers can break `v-if` on a slot and `fallback` content.
- **Failure mode:** Passing huge row objects through scoped slots and mutating them; or using `$slots.foo` checks incorrectly so SSR and client disagree on whether a slot exists (`$slots.foo` vs `$slots.foo()`).
- **Measure:** Can a consumer replace the cell without a fork? Bundle: a mega-`Table` with 40 props vs a small table + slots.

**Tradeoffs**

- Props for variants: simple, closed design.
- Slots: open, harder to theme consistently, easier to a11y-break (consumer forgets a label).
- Render function slot call vs `<slot :row="row">`: templates keep compiler optimizations.

**Production gotchas**

- Vue 3: `v-slot` / `#` on components; deprecated `slot=` attribute.
- Forwarding: `v-bind="$attrs"` does not forward slots — use `<slot name="x" v-bind="..."/>` or `v-for` on `$slots`.
- `v-if` on a slot outlet: empty slot fallback vs not rendering — pick one and test SSR.

**Follow-ups**

- Scoped slot vs `provide` for deeply nested table cells.
- `defineSlots<T>()` for typed library APIs.
- Why a design system might still offer a **pre-styled** slotless variant.

---

#### 5.2.9. keep-alive

**What they actually ask**

Tabbed wizards and cached routes. They want **cache identity**, **`onActivated`**, **memory**, and **stale data**.

**How a senior answers**

- **Decision:** `keep-alive` when teardown is expensive (maps, heavy forms, tab panels) **and** the user expects state to survive. Key the cached instance by **entity id** when the component type is reused for different records. Fetch/refresh in `onActivated` if the data can go stale; do not assume `onMounted` runs again.
- **Constraint:** Cache is **in-memory Vue instances** (`include` / `exclude` / `max`). `max` is LRU. Nested keep-alive + router-view needs a `key` strategy or you cache the wrong page.
- **Failure mode:** User A’s profile, navigate to user B, see user A because the instance was cached by component name. Or a WebSocket opened in `onMounted` never closed because unmount never ran.
- **Measure:** Heap after visiting 50 records with `max` unset. “Wrong customer” incidents. Listener counts.

**Tradeoffs**

- Remount (`:key`) : always fresh, lose local UI state, pay setup cost.
- keep-alive: fast back-navigation, stale + leak risk.
- Explicit store for drafts: survives even without keep-alive; more code.

**Production gotchas**

- Router: `<keep-alive><router-view v-slot="{ Component }"><component :is="Component" :key="route.fullPath"/></keep-alive>` — `fullPath` may be too aggressive (query string); `params.id` may be right.
- `onDeactivated` must pause timers, videos, and polls; `onActivated` resumes.
- `include` matches **component name** — `<script setup>` needs `defineOptions({ name: 'Foo' })` or it never caches.

**Follow-ups**

- Interaction with Suspense and async setup.
- Why `max` dropped your form draft.
- vs Nuxt `keepalive` in `definePageMeta`.

---

#### 5.2.10. Async components

**What they actually ask**

How you split a heavy widget (chart, editor, admin panel) without a blank error. Loading/error/timeout and **where it sits vs route-level code splitting**.

**How a senior answers**

- **Decision:** Route-level splitting via the router/Nuxt pages is the default. `defineAsyncComponent` for **in-page** heavy islands (editor in a modal). Set `timeout` / `errorComponent` in production; `delay` so a fast load does not flash a spinner.
- **Constraint:** The async component is a **component type**; keep-alive and DevTools use that wrapper. Combined with Suspense, you can get **two** loading UIs if you are not careful.
- **Failure mode:** Importing the heavy lib at the top of the parent SFC “just for a type” → the chunk is not split. Or no error UI so a CDN blip blanks a dashboard widget forever.
- **Measure:** Coverage of the extra JS on the critical route (should drop); error-component impressions.

**Tradeoffs**

- Router lazy `() => import('./Page.vue')`: best split granularity for apps.
- Async component: finer, more wrappers.
- Nuxt `Lazy` prefix / delayed hydration: see [Nuxt · Hydration](./nuxt.md#68-hydration-clientonly-lazy-hydration).

**Production gotchas**

- Vite/Rollup: treat type-only imports as `import type`.
- SSR: async components must still resolve on the server if the HTML should include them; otherwise `ClientOnly`.
- `loader` throwing: without `errorComponent`, the parent errors.

**Follow-ups**

- Prefetch on hover vs wait for open.
- Sharing a chunk between two async components (`manualChunks`).
- vs islands / server components in Nuxt.

---

#### 5.2.11. Hydration mismatch

**What they actually ask**

“The DOM did not match.” They want **causes**, **how you debug**, and **ClientOnly vs fix the HTML**. This is a production senior topic, not a Vue trivia card.

**How a senior answers**

- **Decision:** First paint HTML must **deterministically** match the client’s first render of the same tree. Anything from `Date.now()`, `Math.random()`, `window`, locale, auth that only exists on the client, or **invalid HTML** (`<div>` inside `<p>`, `<table>` mis-nested) will mismatch. Fix the source; `ClientOnly` is for **true client-only** subtrees (maps, charts), not for hiding bugs.
- **Constraint:** Vue hydrates in place. Mismatch discards server DOM for that subtree (Vue 3 warns in dev; in prod you pay extra client render and can get flicker / broken event listeners).
- **Failure mode:** `v-if="isMobile"` with `isMobile` defaulting false on server and true on client after a user-agent sniff in `onMounted`. Or formatting dates with the **server TZ** vs browser TZ.
- **Measure:** Hydration warnings in staging with prod-like data; visual diffs of SSR HTML vs client; INP/LCP regression when Vue re-renders the whole subtree.

Vue 3.4+ `data-allow-mismatch` is a **surgical** escape for a known text difference, not a license to ignore structure bugs.

**Tradeoffs**

- Make it deterministic (same locale, same flags in payload): best.
- `ClientOnly` / `<client-only>`: zero hydration for that island; SEO/content for that subtree is gone.
- Delayed / lazy hydration (Nuxt): HTML is there, interactivity later — still must match.

**Production gotchas**

- Invalid HTML is the most common “Vue is broken” ticket. Browser “fixes” the SSR HTML; Vue’s VNode tree does not.
- `id` collisions from `useId()` vs hand-rolled counters that reset per request incorrectly (or **don’t** reset — collide across users).
- Third-party scripts that mutate DOM before hydration (A/B, chat widgets).
- `v-html` of user content that differs after sanitize on client.

**Follow-ups**

- How Nuxt payload prevents “fetch again, different JSON” mismatches.
- Why `data-allow-mismatch` is last resort, not a default on every text node.
- Charts: render a static image/SVG on the server or don’t SSR them.

---

[← Back to Overview](../../README-en.md)
