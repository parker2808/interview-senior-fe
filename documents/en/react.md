# React

You already know Vue 3. This file is not a React tutorial — it is a **Vue → React bridge** plus the **judgment** a senior React/Next round actually scores: re-render vs fine-grained reactivity, when an effect is a bug, when memo is theater, where data should load (Query vs RSC vs `useEffect`), and how composition/perf/auth differ from Nuxt habits. Interviewers are listening for **decision → constraint → failure mode → measure**, not a Counter. Map Composition API instincts here, then answer as if you own production.

---

## Table of Contents

1. **Core Concepts**

   1.1. [Virtual DOM & Reconciliation](#2011-virtual-dom--reconciliation)

   1.2. [Class Components vs Function Components + Hooks](#2012-class-components-vs-function-components--hooks)

   1.3. [JSX & Rendering Model](#2013-jsx--rendering-model)

   1.4. [Props vs State](#2014-props-vs-state)

   1.5. [Controlled Inputs (Vue `v-model` equivalent)](#2015-controlled-inputs-vue-v-model-equivalent)

   1.6. [Lists & Keys](#2016-lists--keys)

   1.7. [Effects: `useEffect` vs Vue `watch` / lifecycle](#2017-effects-useeffect-vs-vue-watch--lifecycle)

   1.8. [Derived values: `useMemo` vs Vue `computed`](#2018-derived-values-usememo-vs-vue-computed)

   1.9. [Stable callbacks: `useCallback`](#2019-stable-callbacks-usecallback)

   1.10. [Refs: `useRef` vs Vue `ref` / template ref](#20110-refs-useref-vs-vue-ref--template-ref)

   1.11. [Component lifecycle mental model](#20111-component-lifecycle-mental-model)

   1.12. [When to fetch data](#20112-when-to-fetch-data)

2. **Advanced Features**

   2.1. [Context vs Vue Provide / Inject](#2021-context-vs-vue-provide--inject)

   2.2. [Portals vs Vue Teleport](#2022-portals-vs-vue-teleport)

   2.3. [Suspense](#2023-suspense)

   2.4. [Error Boundaries](#2024-error-boundaries)

   2.5. [Custom Hooks vs Vue Composables](#2025-custom-hooks-vs-vue-composables)

   2.6. [Children, slots mindset, and composition](#2026-children-slots-mindset-and-composition)

   2.7. [State libraries overview (Redux, Zustand, Jotai)](#2027-state-libraries-overview-redux-zustand-jotai)

   2.8. [Performance checklist for seniors](#2028-performance-checklist-for-seniors)

   2.9. [Route guards / middleware (SPA)](#2029-route-guards--middleware-spa)

   2.10. [Concurrent features: transitions and useDeferredValue](#20210-concurrent-features-transitions-and-usedeferredvalue)

---

## 20. React

### 20.1. Core Concepts

#### 20.1.1. Virtual DOM & Reconciliation

**What they actually ask**

- “How does React decide what to update?”
- “Vue is fine-grained — why does my whole React tree re-render?”
- “Do I still need `memo` if we turn on React Compiler?”
- “What do keys actually do?”

**How a senior answers**

**Decision.** React’s model is **UI = f(state)**: when state/props/context change, the component **function runs again**, returns a new element tree, then **reconciles** against the previous tree and **commits** DOM mutations. Vue 3’s model is a **reactivity graph**: mutate a `ref`, and only tracked effects/computed/components re-run. That contrast *is* the interview. You do not “patch a dependency” in React the way Vue patches a getter — you re-execute, then diff.

**Constraint.** Reconciliation matches by **element type + position**, and for lists by **`key`**. Same type + same key → update in place (state preserved). Different type or different key → unmount/remount (state reset). A child re-renders because its parent re-rendered, **unless** it bails out (`React.memo` shallow-equal props, `useState`/`useReducer` `Object.is` same value, Compiler-inserted memo, or it is not a React child of that parent). Context consumers **do not** bail out of a value change even if wrapped in `memo`.

**Failure mode.** Index keys on a reorderable list (inputs keep the wrong row’s DOM). Assuming “I only changed `count`, so `<ExpensiveChild />` is free” — in React it is not free unless you paid for a bailout. Blanket `memo` on every component (extra shallow compares, still broken if props are new object/function identities every render). Treating Compiler as magic that erases architectural mistakes (state too high, Context as a event bus).

**Measure.** React Profiler: *why did this render* (props, hooks, context, parent). Production: INP / long tasks, not a hunch. Compiler: `react-compiler-healthcheck` / compiled output — if the Compiler already memoizes a path, deleting hand-rolled `memo` can be the senior move.

**Tradeoffs**

| | Vue 3 | React (classic + Compiler) |
|---|---|---|
| Update trigger | Proxy/dep tracking | Explicit `setState` → re-render |
| Default work | Re-run affected subscribers | Re-run the component, then children |
| Skip work | Compiler flags, `v-once`, computed cache | Bailout, `memo`, Compiler auto-memo |
| Mental model | Graph | Snapshot of UI from props+state |

Vue often *feels* cheaper to write. React is simpler to reason about as a snapshot, and the ecosystem (RSC, Compiler, concurrent) exists because the default re-render is expensive at scale.

**Production gotchas**

- Changing a component’s **type** at runtime (`isCondition ? Foo : Bar` as the element type, or remounting via `key={user.id}` on a form) **destroys state**. That is a feature when you want a reset; a bug when you did not.
- `memo` compares **props**, not “did business data change.” `style={{ margin: 0 }}` or `onClick={() => ...}` still break bailout.
- React Compiler changes the **default answer** from “wrap it in `memo`/`useCallback`” to “measure, keep render pure, let the Compiler memoize, only hand-memoize interop or Profiler-proven holes.”

**Follow-ups**

- Walk a list reorder with and without stable keys (see [20.1.6](#2016-lists--keys)).
- “Does `memo` skip reconciliation of descendants?” — it skips **rendering that function**; if it renders, children still run unless they bail out too.
- “Fiber / concurrent” — reconciliation can be **interruptible**; that does not change the Vue-vs-React update model (see [20.2.10](#20210-concurrent-features-transitions-and-usedeferredvalue)).

---

#### 20.1.2. Class Components vs Function Components + Hooks

**What they actually ask**

- “Why can’t I call a Hook inside `if`?”
- “Are class components dead? Then how do Error Boundaries work?”
- “How do you migrate Options API thinking to Hooks?”

**How a senior answers**

**Decision.** New code is **function components + Hooks**. Classes are legacy surface area: old codebases, and **Error Boundaries**, which historically (and still, in core React) are **class-only** (`componentDidCatch` / `getDerivedStateFromError`). Use `react-error-boundary` rather than inventing a class in every app — but know *why* the class exists.

**Constraint.** Hooks are **positional**. React stores Hook state in a list on the fiber and pairs calls **by order**. Call order must be identical every render. That is why `eslint-plugin-react-hooks` (`rules-of-hooks`, `exhaustive-deps`) is a **correctness linter**, not style. Name custom Hooks `useX` so the linter can see them.

**Failure mode.** `if (enabled) useEffect(...)` → after a toggle, every later Hook is mis-aligned (wrong state, crash). A helper named `onlineStatus()` that calls `useState` — linter silent, rules still broken. “I’ll put the Hook in a loop over columns” — same bug.

**Measure.** Hooks plugin in CI on `error`. Review: any `use*` behind a condition is a reject. Do not “prove it works” by clicking once.

**Vue bridge**

| Vue | React |
|---|---|
| Options API | Class components (historical parallel) |
| Composition API / `<script setup>` | Function components + Hooks |
| `ref` / `reactive` | `useState` / `useReducer` |
| `onMounted` / `watch` | `useEffect` (not a 1:1 lifecycle map — see [20.1.7](#2017-effects-useeffect-vs-vue-watch--lifecycle)) |
| `onErrorCaptured` | Error Boundary class / library |

**Tradeoffs**

Classes give `componentDidCatch` and a single `this`. Hooks give composition without mixin hell (the same reason you left Options API mixins). Do not mix “class for everything because Error Boundaries” — isolate the boundary, keep the tree functions.

**Production gotchas**

- Exhaustive-deps warnings silenced with `eslint-disable` are how stale closures ship.
- `useEffectEvent` (when available in your React version) is the structured escape for “read latest props without re-subscribing” — not a blanket ignore comment.

**Follow-ups**

- Implement an Error Boundary — they want the class methods, and what it **does not** catch (event handlers, async, SSR). See [20.2.4](#2024-error-boundaries).
- “Can I call Hooks in a class?” — no.

---

#### 20.1.3. JSX & Rendering Model

**What they actually ask**

- “What does returning `null` do vs `false` vs `undefined`?”
- “Why did my UI print `0`?”
- “When do I need a Fragment, and can it have a key?”

**How a senior answers**

**Decision.** JSX is `React.createElement` / `jsx()`. A component returns a **description** of UI, not DOM nodes. You do not `v-if` a template — you return `null` or omit the child.

**Constraint.** In `{cond && <X />}`, these render **nothing**: `false`, `null`, `undefined`. These **render text**: `0`, `NaN`, `''` (empty string is a text node). Booleans are ignored; numbers are not. Fragments group without a DOM node: `<>...</>` or `<Fragment key={id}>`. **Only `Fragment` accepts `key`** — short syntax `<>` cannot.

**Failure mode.** `{count && <Badge />}` with `count === 0` paints **0**. `{items.length && <List />}` same bug. Mapping two siblings without a keyed Fragment remounts or warns. Invalid HTML nesting (`<p><div>`) hydrates wrong (especially in Next).

**Measure.** React DevTools + the real DOM text node. Hydration warnings in the console are signal, not noise.

**Vue bridge**

- Vue SFC: template + script + style. React: JS/TS + JSX (styles via modules / Tailwind / CSS-in-JS).
- `v-if` / `v-else-if` → ternary or early `return null`.
- `v-show` has no primitive — CSS `hidden` / unmount explicitly; don’t fake it with `&&` if you needed display toggle.

```tsx
{count && <Badge />}           // pitfall: count=0 renders "0"
{count > 0 ? <Badge /> : null} // explicit
{count ? <Badge /> : null}
```

**Tradeoffs**

`&&` is terse and unsafe for numbers. Ternary is noisier and honest. Prefer `null` for “render nothing” in APIs you control (`return null` from the component).

**Production gotchas**

- `undefined` as a **prop** vs as a child: missing prop vs default; children `undefined` is empty.
- Arrays as children flatten; nested arrays still need keys on the **elements React sees**.

**Follow-ups**

- “Why Fragments over a wrapper `div`?” — layout/CSS (flex/grid children), valid HTML (`<tr>`), a11y.
- Keyed Fragment when a list item is multiple siblings (see [20.1.6](#2016-lists--keys)).

---

#### 20.1.4. Props vs State

**What they actually ask**

- “Can the child mutate props?”
- “Why is `items.push` a React bug when it is normal Vue?”
- “Where should this state live?”

**How a senior answers**

**Decision.** **Props** are the parent’s data flowing down — read-only contract. **State** is owned by this component (or a store/URL/server cache — see [state-management-react.md](./state-management-react.md)). Updates **replace** values. React’s `setState` bails out if `Object.is` says the same reference.

**Constraint.** Vue’s proxy **sees in-place mutation**. React does not. `user.name = 'x'; setUser(user)` is a no-op. You copy: `setUser({ ...user, name: 'x' })` or a reducer/Immer. Children never “own” props; they call `onChange` and the owner updates.

**Failure mode.** Mutating props and wondering why the parent is stale. Storing a copy of props in state and forgetting to sync (you probably wanted derivation, not an effect). Lifting state so high that every keystroke re-renders a dashboard.

**Measure.** Profiler: who owns the state vs who re-renders. If a leaf input re-renders a page, the state is in the wrong place.

**Vue bridge**

| Vue | React |
|---|---|
| `defineProps` (readonly-ish; mutation is a smell) | function args; **do not mutate** |
| `emit('update:modelValue')` / `v-model` | `value` + `onChange` (controlled) |
| local `ref` / `reactive` | `useState` / `useReducer` |
| mutate `state.list.push` | new array: `[...list, item]` |

**Tradeoffs**

Immutability makes `memo` and `Object.is` cheap and time-travel/debug possible. It is more ceremony than Pinia. Immer (in RTK or by hand) is the team-scale compromise.

**Production gotchas**

- Structural sharing matters for large trees; cloning the **root of a 10k-row table** on each cell edit is a perf bug — localize state or use an atomic store.
- Props that are new objects every parent render (`config={{}}`) look like “state changed” to `memo` children.

**Follow-ups**

- Controlled vs uncontrolled ([20.1.5](#2015-controlled-inputs-vue-v-model-equivalent)).
- “Single source of truth” when URL, server, and local all want the same field — [state-management-react.md](./state-management-react.md).

---

#### 20.1.5. Controlled Inputs (Vue `v-model` equivalent)

**What they actually ask**

- “Controlled vs uncontrolled — when each?”
- “Why can’t I control a file input?”
- “Would you use React Hook Form or `useState` per field?”

**How a senior answers**

**Decision.** **Controlled**: React state is the source of truth (`value` + `onChange`). **Uncontrolled**: the DOM is (`defaultValue` / `defaultChecked` + ref / form `FormData`). **File inputs are uncontrolled by platform** — the browser will not let you `value={file}`; you read `e.target.files`. That is not a React quirk.

**Constraint.** You must not **flip** a field from uncontrolled to controlled (or the reverse) across renders — React warns and the cursor/value glitches. A fully controlled form with 80 fields in one parent re-renders the whole form every keystroke unless you isolate fields or stop using React state as the draft.

**Failure mode.** `<input value={x} />` with no `onChange` → frozen input. `value={possibleUndefined}` that later becomes a string → uncontrolled→controlled warning. Building Formik-style “one big values object in Context” and then asking why typing janks.

**Measure.** Type at 60fps: Profiler on the form, INP. If RHF/`register` (uncontrolled) kills the jank, the problem was **React owning every keystroke**, not “React is slow.”

**Vue bridge**

`v-model` is sugar for value + emit. React has no sugar in core. Vue can mutate a ref bound with `v-model`; React must `setState` a new string.

**Tradeoffs**

| Approach | Use when | Cost |
|---|---|---|
| Controlled `useState` | Single field, immediate validation UI, masks | Re-render on each change |
| Uncontrolled + `FormData` | Simple native forms, file uploads, progressive enhancement | Weaker per-keystroke UI |
| **React Hook Form** | Production forms: `register` (uncontrolled), `Controller` for design-system inputs, Zod/Yup resolver | Team dependency; still isolate `Controller` |
| Next **Server Actions** + `useActionState` | Small mutations, progressive enhancement | Awkward for rich client UX |

Senior default for a real app form: **RHF (or similar)**, schema validation, uncontrolled where the design system allows, `Controller` only at the leaf. Do not reinvent RHF with 40 `useState`s. Do not put the draft in Zustand/Redux unless the draft must survive route changes **and** URL is the wrong place.

**Production gotchas**

- File input: `onChange` → `FileList`; never `value={file}`. Reset via `inputRef.current.value = ''` or `key` remount.
- Controlled `<select>` / `<input type="date">` empty string vs `undefined` still trips the flip warning.
- Debouncing the **state** that hits the server is fine; debouncing the **input `value`** makes the field feel broken.

**Follow-ups**

- How you’d wire a shadcn/MUI `TextField` (must be `Controller`).
- Server-side validation errors mapped back onto fields vs only client Zod.

---

#### 20.1.6. Lists & Keys

**What they actually ask**

- “Why not `key={index}`?”
- “I used a Fragment in `map` and React warned — why?”
- “Can I use key to reset a component?”

**How a senior answers**

**Decision.** `key` is **identity** across renders, not a performance hint. Prefer a **stable business id**. Index keys are acceptable **only** for static lists that never insert, delete, filter, or reorder.

**Constraint.** Key is on the **element in the array**, not a normal prop the child should use. Missing keys → React falls back to index internally and warns. Two children in a `map` need `<Fragment key={id}>` (short `<>` cannot take a key).

**Failure mode.** Reorder/sort with index keys: **uncontrolled inputs and component state stick to the DOM position**, not the item — the classic “wrong row edited” bug. `key={Math.random()}` remounts every render (lost focus, extra effects). `key={item.id}` on a form when `id` goes `undefined → 123` remounts mid-submit.

**Measure.** Put an uncontrolled `<input>` in each row, reorder, watch which text stays. Profiler: remount vs update (`mount` vs `update` in the flamegraph).

**Vue bridge**

Same contract as Vue `:key`. Vue also warns on index keys for the same state-reuse reason. React is **less forgiving** because more UI is “state in the component” rather than a single reactive object.

```tsx
// Pitfall: index keys + reorder → input state follows the row index
{todos.map((t, i) => (
  <li key={i}>
    <input defaultValue={t.title} />
  </li>
))}

// Pitfall: Fragment short syntax cannot carry identity
{items.map((item) => (
  <>
    <dt>{item.term}</dt>
    <dd>{item.def}</dd>
  </>
))}

{items.map((item) => (
  <Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.def}</dd>
  </Fragment>
))}
```

**Tradeoffs**

Using `key={user.id}` on a wizard/stepper **intentionally remounts** and clears local state — a valid reset API. Document it; don’t use it as a hammer to “fix” stale state (that’s usually a closure/effect bug).

**Production gotchas**

- Duplicate keys (two rows with `id: 0`) → missing/wrong updates, hard to debug.
- Virtualization (`react-window` / TanStack Virtual): keys still must be stable; index + window offset is a footgun.

**Follow-ups**

- “Why did changing key run `useEffect` cleanup + setup again?” — remount is a new fiber.
- Reconciliation type+key from [20.1.1](#2011-virtual-dom--reconciliation).

---

#### 20.1.7. Effects: `useEffect` vs Vue `watch` / lifecycle

**What they actually ask**

- “You Probably Don’t Need an Effect — so when *do* you?”
- “Why does Strict Mode run my effect twice?”
- “Where should I fetch?”

**How a senior answers**

**Decision.** `useEffect` is for **synchronizing with an external system** after paint: subscriptions, non-React DOM APIs, analytics that must see committed UI, a third-party widget. It is **not** `onMounted`, not `watch` for derived data, and **not** the default fetch API. Derived values belong in render. User-event logic belongs in event handlers. Data: **RSC or TanStack Query/SWR**, not a hand-rolled effect, unless you are in a dumb SPA with no library and no server renderer.

**Constraint.** Effects run **after paint**. Dependency array is the subscription key: `[]` is “after mount + Strict Mode remount,” not “once in the lifetime of the tab.” Cleanup must undo the setup (**idempotent setup/cleanup**) because Strict Mode in development **mounts → cleanup → mounts again** to shake out leaks. Fetch-in-effect without abort races the last response.

**Failure mode.** `useEffect(() => setX(transform(y)), [y])` — extra render, tearing, you wanted `const x = transform(y)` in render. Fetch in effect while the team has Query or Next Server Components. Missing deps → **stale closures**. `setState` in effect that retriggers the same effect → loop. Treating double-invoke as a React bug and disabling Strict Mode.

**Measure.** React’s “effect ran” in Strict Mode is expected. Network tab: duplicate GETs in dev vs prod. Race: slow request A, fast request B, A wins — without abort. Prefer Query’s `queryKey` + cancel as the measured solution.

**Vue bridge**

| Need | Vue | React |
|---|---|---|
| Sync *external* system | `watch` / `watchEffect` + `onUnmounted` | `useEffect` + cleanup |
| After mount (DOM read) | `onMounted` | `useEffect` or `useLayoutEffect` if you must read layout |
| Derived data | `computed` | calculate in render / `useMemo` |
| Watch a value to fetch | `watch(id, fetch)` (still racy) | Query / RSC; effect + `AbortController` only if you must |

Vue `watch` feels like “when this ref changes.” React `useEffect` is “after this snapshot commits, align the outside world.” If there is no outside world, you do not need an effect.

```tsx
// Stale closure: interval always sees count from the first render
useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000)
  return () => clearInterval(id)
}, []) // missing count — or use setCount(c => c + 1)

// Race: without abort, an older fetch can win
useEffect(() => {
  const ac = new AbortController()
  fetch(`/api/items/${id}`, { signal: ac.signal })
    .then((r) => r.json())
    .then((data) => setItems(data))
    .catch((e) => {
      if (e.name === 'AbortError') return
      setError(e)
    })
  return () => ac.abort()
}, [id])
```

If this fetch effect is your production architecture, you are behind — see [20.1.12](#20112-when-to-fetch-data).

**Tradeoffs**

Effects are the escape hatch that made Hooks complete. They are also the #1 source of production bugs in Vue-trained React codebases (because `onMounted` + `watch` mapped too literally).

**Production gotchas**

- Strict Mode double-invoke: subscriptions must unsubscribe; fetches must abort or ignore stale `id`.
- `void fetch()` in render (not in an effect) is worse — render must stay pure.
- Event handlers should not be “done in an effect because I don’t want to pass arguments.”

**Follow-ups**

- `useLayoutEffect` vs `useEffect` ([20.1.11](#20111-component-lifecycle-mental-model)).
- “How do you test this?” — don’t; extract the sync, or use Query and test the queryFn.

---

#### 20.1.8. Derived values: `useMemo` vs Vue `computed`

**What they actually ask**

- “Should I `useMemo` this?”
- “Is this like `computed`?”
- “What does React Compiler change?”

**How a senior answers**

**Decision.** First **derive in render** (`const total = items.reduce(...)`). `useMemo` is for (1) **proven expensive** work or (2) **referential stability** of an object/array passed to a `memo` child or as a dep of an effect. It is **not** Vue `computed`. Vue `computed` is lazy, auto-tracked, and the default for derived state. React `useMemo` is an opt-in cache keyed by a **dependency array you declared**.

**Constraint.** Wrong deps → stale memo. Deps that are new objects every time → memo never hits. Compiler (when enabled) **already memoizes** many of these; stacking hand-`useMemo` can be noise.

**Failure mode.** Wrapping every constant in `useMemo` “for performance” (the Hook call + compare can cost more than the math). Using `useMemo` to hide an effect that should not exist. Memoizing a cheap boolean.

**Measure.** Profile the parent **before** adding `useMemo`. If the Compiler is on, look at compiled output / Profiler again after deleting memos.

**Vue bridge**

| | Vue `computed` | React `useMemo` |
|---|---|---|
| Deps | Auto-track | Manual array |
| Default? | Yes for derived state | No — render first |
| Lazy | Yes | Runs on render if deps changed (not a Vue-style lazy getter) |

**Tradeoffs**

Manual memo is documentation of “this identity matters.” Overuse is a junior tell. Underuse that breaks a memoized child (new `[]` every time) is a real bug — fix identity there, not by memoizing the entire page.

**Production gotchas**

- `useMemo(() => ({ width }), [width])` to keep `memo(Child)` happy — valid, or lift the object, or Compiler.
- Memoizing JSX (`useMemo(() => <Child />)`) is usually the wrong primitive (`memo` / composition).

**Follow-ups**

- Referential stability for [useCallback](#2019-stable-callbacks-usecallback).
- “Would you still teach `useMemo` in 2026?” — yes as a **concept** (purity, identity); the **habit** depends on Compiler adoption on that team.

---

#### 20.1.9. Stable callbacks: `useCallback`

**What they actually ask**

- “Why `useCallback` if functions are cheap?”
- “Vue doesn’t need this — why does React?”

**How a senior answers**

**Decision.** `useCallback(fn, deps)` keeps **function identity** stable when that identity is a **contract**: a `memo` child’s prop, a dep of `useEffect`, a context value, a register in a third-party lib. It does **not** make the function body cheaper.

**Constraint.** Vue children update because **their reactive data changed**, not because the parent’s `onClick` was a new function. React `memo` children **will** re-render if `onClick` is a new identity every time. That is the whole reason `useCallback` exists.

**Failure mode.** `useCallback` around every handler “for perf.” Unstable deps (`useCallback(() => do(x), [])` with stale `x`). Passing `useCallback` to a DOM node that was never memoized — wasted.

**Measure.** Profiler on the **memoized child**, not the parent. If the child is a native `<button>`, skip `useCallback` unless something else depends on identity.

**Vue bridge**

Rarely needed. Closest pain in Vue is passing new object props that break `v-once` / manual caching, not function identity.

**Tradeoffs**

React Compiler often auto-memoizes callbacks. Senior answer in a Compiler shop: **don’t sprinkle `useCallback` by policy**; keep handlers in event scope; add it when Profiler or a non-compiled child demands identity. In a pre-Compiler shop: `useCallback` at the boundary of `memo` leaves.

**Production gotchas**

- Context `value={{ onLogin: useCallback(...) }}` — you still need a **stable value object** or split functions into their own context ([20.2.1](#2021-context-vs-vue-provide--inject)).
- Listing `setState` in deps is fine (React guarantees identity); listing `state` when you could use a functional update is how callbacks churn.

**Follow-ups**

- `startTransition` in a callback vs memoizing it ([20.2.10](#20210-concurrent-features-transitions-and-usedeferredvalue)).

---

#### 20.1.10. Refs: `useRef` vs Vue `ref` / template ref

**What they actually ask**

- “Is `useRef` like Vue `ref`?”
- “Why doesn’t changing `.current` re-render?”
- “Refs vs state for a timer id / latest callback?”

**How a senior answers**

**Decision.** `useRef` is a **mutable box** (`{ current }`) that **survives renders and does not notify React**. It is **not** Vue `ref()`. Vue `ref()` is reactive state. React `useRef` is an instance field. Vue **template ref** (DOM/component instance) is the close analog of React DOM `useRef`.

**Constraint.** Assigning `ref.current = x` is invisible to rendering. Read refs in **effects and handlers**, not as the source of rendered output (you’ll show stale UI). Don’t use a ref to “avoid” state when the user should see the change.

**Failure mode.** Using `useRef` for `count` then wondering why the view is stuck. Reading `ref.current` during render for branching (inconsistent with concurrent rendering). Vue-trained `const x = ref(0)` translated to `useRef(0)` instead of `useState`.

**Measure.** If the UI must update, it is state. If you are storing a node, timeout id, AbortController, or “latest value for a subscription,” it is a ref.

**Vue bridge**

| Use | Vue | React |
|---|---|---|
| Reactive value | `ref(0)` / `reactive` | `useState` / `useReducer` |
| DOM node | template `ref="el"` | `useRef<HTMLDivElement>(null)` |
| Timer / WS / “latest fn” | non-reactive `let` in `setup` | `useRef` |
| Child component instance | template ref | usually don’t; lift state or `forwardRef`/`useImperativeHandle` (escape hatch) |

**Tradeoffs**

`useImperativeHandle` is the React equivalent of poking a child — legal for video players/focus managers; a smell for passing data that should have been props.

**Production gotchas**

- Callback refs vs object refs: callback refs re-run when the node attaches; needed for lists/virtualization.
- During concurrent render, **don’t write** to refs in the render body (side effect). Write in effects/handlers.

**Follow-ups**

- “How do you keep an event listener stable but read latest props?” — ref to latest + effect that subscribes once (or `useEffectEvent`).

---

#### 20.1.11. Component lifecycle mental model

**What they actually ask**

- “Map `componentDidMount` to Hooks.”
- “Why must render be pure?”
- “When `useLayoutEffect`?”

**How a senior answers**

**Decision.** Stop naming class lifecycle first. Think **phases**:

1. **Render (pure):** given props/state/context, return JSX. No network, no `setState`, no DOM writes. Concurrent React may **render twice** (or discard a render) — purity is correctness.
2. **Commit:** React touches the DOM.
3. **Layout effects** (`useLayoutEffect`): after DOM updates, **before paint** — measure, restore scroll, sync a non-React widget that must not flash.
4. **Passive effects** (`useEffect`): after paint — subscriptions, logging, non-urgent sync.

**Constraint.** `useLayoutEffect` **blocks paint**. Using it to `setState` from `getBoundingClientRect` can **thrash** (layout → setState → layout). Prefer CSS, ResizeObserver, or measure once.

**Failure mode.** `useEffect` for derived state (extra paint of wrong UI). `useLayoutEffect` on the server (warning: it cannot run on SSR — gate or `useEffect`). Impure render (`Math.random()` / `Date.now()` in JSX) → hydration mismatch in Next.

**Measure.** Layout thrashing: Performance panel (forced reflow). Hydration: Next overlay / console mismatch.

**Vue bridge**

| Class | Hooks (approximate, not equal) |
|---|---|
| `componentDidMount` | `useEffect(..., [])` (Strict Mode: setup+cleanup+setup in dev) |
| `componentDidUpdate` | `useEffect(..., [deps])` |
| `componentWillUnmount` | effect cleanup |
| `shouldComponentUpdate` | `memo` / bailout / Compiler |
| `getSnapshotBeforeUpdate` | `useLayoutEffect` (rare) |

Vue `onBeforeUpdate` / `onUpdated` do not map cleanly; don’t force them.

**Tradeoffs**

Layout effects remove flicker (tooltip position) at the cost of INP. Default to `useEffect`. If you see a flash, then layout-effect the **measurement**, not your entire business logic.

**Production gotchas**

```tsx
// Thrash: measure → setState → new layout → measure ...
useLayoutEffect(() => {
  setHeight(el.current.getBoundingClientRect().height)
}, [items, height]) // height in deps is a loop waiting to happen
```

**Follow-ups**

- Strict Mode double render in dev — purity, not “React is broken.”
- RSC: there is **no** componentDidMount on the server tree; effects only exist on Client Components.

---

#### 20.1.12. When to fetch data

**What they actually ask**

- “Fetch in `useEffect`?”
- “TanStack Query vs Next Server Components?”
- “How do you cancel in-flight requests?”

**How a senior answers**

**Decision.** Pick the **source of truth and the runtime**:

| Situation | Default |
|---|---|
| Next App Router, data for the document, SEO, secrets, DB | **async Server Component** `fetch` / data layer |
| Client interactivity on cached server data (filters, polling, mutations, shared cache across islands) | **TanStack Query / SWR** |
| Dumb Vite SPA, no Query yet | Effect + abort is the *minimum*; still prefer Query |
| After a mutation | Query `invalidateQueries` and/or Next `revalidatePath` / `revalidateTag` |

Do **not** fetch in `useEffect` when Query or RSC already exists on the project. That is the senior line.

**Constraint.** RSC fetch runs on the server (bundle + secrets stay off the client) but is **request/cache scoped**, not a live client cache. Query is a **client cache** (stale-while-revalidate, dedupe, retries). Effects have neither unless you build them.

**Failure mode.** Waterfall of client effects (layout fetch → child fetch). Duplicate of the same list in Redux **and** Query. RSC `await` chain that could be `Promise.all` ([nextjs.md](./nextjs.md) §21.12).

**Measure.** Network waterfall screenshots, TTFB vs time-to-interactive, cache hit rates (Query Devtools / Next cache logs for your version).

**Vue bridge**

| Vue / Nuxt | React / Next |
|---|---|
| `onMounted` + `fetch` | the trap; same as `useEffect` fetch |
| Nuxt `useAsyncData` / `useFetch` | RSC `await` + optional Query on the client |
| Pinia holding the list | usually **wrong** — Query/RSC |

**Tradeoffs**

RSC wins first paint and bundle size; it loses “typeahead that shares cache with a widget three routes away” unless you add Query. Query wins UX for live client data; it ships JS and needs a provider. Effects win nothing at senior level except honesty in a tiny SPA.

**Production gotchas**

- Race + `AbortController` if you truly are in an effect ([20.1.7](#2017-effects-useeffect-vs-vue-watch--lifecycle)).
- Don’t block navigation on a client fetch that the server already had.

**Follow-ups**

- Cache layers in Next ([nextjs.md](./nextjs.md) §21.10).
- Why server lists do not belong in Redux ([state-management-react.md](./state-management-react.md)).

---

### 20.2. Advanced Features

#### 20.2.1. Context vs Vue Provide / Inject

**What they actually ask**

- “How do you avoid prop drilling?”
- “Why is my app re-rendering on every keystroke in Context?”
- “Context vs Zustand?”

**How a senior answers**

**Decision.** Context is **dependency injection** for **low-frequency** values: theme, locale, current user **id/session snapshot**, feature flags, a query client. It is **not** a store for high-frequency updates (mouse, draft text, animation frame, cart qty if it ticks often).

**Constraint.** Any `Provider` `value` change (`Object.is`) re-renders **all** consumers below, and `memo` on the consumer **does not** skip context changes. Split providers (**theme vs user vs form**) so a tick in one tree does not paint the other. Stabilize `value` (split state/dispatch contexts — the Redux pattern).

**Failure mode.** One `AppContext` with `{ user, theme, cart, setCart, searchQuery }`. A form draft in Context. Using Context because “we don’t want another library” at 200 consumers.

**Measure.** Profiler: click, watch the whole tree highlight. If yes, split or move to Zustand/Jotai with selectors.

**Vue bridge**

≈ `provide` / `inject`. Vue’s provide is not a render-fanout in the same way (consumers are tracked). React Context is **broadcast re-render**. That difference surprises Vue seniors.

**Tradeoffs**

| | Context | Zustand / Jotai |
|---|---|---|
| API | built-in | extra lib |
| Re-render | all consumers of that provider | selected slice |
| SSR/RSC | easy for static values | hydrate carefully |

**Production gotchas**

- `value={{ theme }}` new object every render → consumers always update.
- Auth user object that is a new reference every fetch — memoize or pass `userId` + Query.

**Follow-ups**

- Full layering: [state-management-react.md](./state-management-react.md).
- “Can I put Query data in Context?” — Query already has a cache; don’t duplicate.

---

#### 20.2.2. Portals vs Vue Teleport

**What they actually ask**

- “How do modals escape `overflow: hidden`?”
- “Do portal events bubble to `document` or to React parents?”

**How a senior answers**

**Decision.** `createPortal(child, domNode)` **paints** into `domNode` (usually `document.body`) but the **React tree parent stays the same**. Use it for modals, toasts, popovers that must escape clipping/stacking.

**Constraint.** **Events still bubble in the React tree**, not the DOM tree. A click inside a portal modal still reaches React parents of the `createPortal` call. `stopPropagation` on a DOM parent **outside** that React subtree will not see the click the way you think.

**Failure mode.** Assuming Teleport-like DOM bubbling for click-outside. Nested `overflow` + portal to a node that is still inside the clipping ancestor. Multiple modals without a stacking / focus trap plan.

**Measure.** Click-outside tests in the actual overlay container. A11y: focus trap, `aria-modal`, Esc — Portals don’t give you this.

**Vue bridge**

≈ `<Teleport to="body">`. Vue event bubbling also follows the **Vue** tree more than people expect; still, interviewers specifically poke React’s “events bubble through portals in React.”

**Tradeoffs**

Portal to `body` wins stacking; you lose “this DOM parent is my containing block” for `position: absolute` unless you portal to a local overlay root (design-system pattern).

**Production gotchas**

- SSR: the target node must exist; in Next, portal only in a Client Component after mount or to a known `#modal-root` in `layout`.
- Hydration: server must render the portal content in a consistent place — mismatch if you `return null` on server and portal on client without a strategy.

**Follow-ups**

- Combine with [Error Boundaries](#2024-error-boundaries) and [Suspense](#2023-suspense) — they follow the **React** tree, including portaled children.

---

#### 20.2.3. Suspense

**What they actually ask**

- “Suspense for data vs for `lazy()`?”
- “How do you pair Suspense with Error Boundaries?”
- “Does Vue Suspense mean the same thing?”

**How a senior answers**

**Decision.** `<Suspense fallback={...}>` catches **children that suspend** (throw a thenable): **code-split** (`lazy` / `React.lazy`) and **data** (RSC, `use()`, Relay, some Query + Suspense modes). It is a **boundary for loading UI**, not an error handler.

**Constraint.** Place boundaries **where a fallback makes sense** (page shell vs inner panel). Too high → the whole page flickers. Too low → spinner soup. **Error Boundary outside/around** Suspense: load failures should not look like infinite fallbacks. SSR/RSC: streaming HTML + client hydration; Client Component trees still need a boundary to show fallback.

**Failure mode.** Suspense without an Error Boundary (a failed fetch looks like a hung spinner). Using Suspense as a substitute for Query when the team needs retries/cache. `lazy()` without a boundary (runtime error).

**Measure.** Core Web Vitals on streaming vs client-only spinners. Which segment’s `loading.tsx` (Next) fired vs your local `<Suspense>`.

**Vue bridge**

Vue `<Suspense>` is the same **product** idea (async setup / async components). Ecosystem wiring differs: Nuxt hides a lot; Next `loading.tsx` is a route-level Suspense around the segment.

**Tradeoffs**

Code-split Suspense is table stakes. Data Suspense is powerful with RSC/`use()` and sharp-edged with ad-hoc client caches. Don’t enable Query suspense mode “because it’s modern” without error + cache design.

**Production gotchas**

- Nested Suspense reveals content in pieces — good for PPR/streaming, bad if layout jumps (reserve skeleton size).
- Fallback that itself suspends — you nested wrong.

**Follow-ups**

- Next `loading.tsx` / `error.tsx` vs manual boundaries ([nextjs.md](./nextjs.md)).
- Concurrent: Suspense and transitions interact (a transition can show old UI instead of fallback — [20.2.10](#20210-concurrent-features-transitions-and-usedeferredvalue)).

---

#### 20.2.4. Error Boundaries

**What they actually ask**

- “Why is this a class?”
- “Will it catch my `fetch` error?”
- “Where do you put them?”

**How a senior answers**

**Decision.** Error Boundaries catch **render / lifecycle / constructor errors in descendants** and render fallback UI. In core React they are **classes**. Hook components cannot implement `componentDidCatch`. Production: `react-error-boundary` + a reporting sink (Sentry).

**Constraint.** They **do not** catch: event handlers, `async`/`setTimeout`, Server Component I/O unless the framework maps it to `error.tsx`, the Error Boundary’s **own** render errors. You still need `try/catch` in handlers and Query `error` state.

**Failure mode.** One boundary at `App` → a tooltip crash whitescreens the product. No reset (`key` / `resetKeys`) after the user fixes state. Logging in `componentDidCatch` only, never in `window.onerror` / `createRoot(onUncaughtError)` for the rest.

**Measure.** Chaos: throw in render of a widget, confirm the rest of the page lives. Throw in `onClick`, confirm it is **not** caught (that’s the quiz).

**Vue bridge**

≈ `onErrorCaptured` + `app.config.errorHandler`. Vue can do this in composition; React core cannot.

**Tradeoffs**

Segment boundaries (Next `error.tsx`) vs component boundaries. Both. Route-level for “this page died”; widget-level for embeds/charts.

**Production gotchas**

- Error Boundary + Suspense: failed lazy import should error, not hang.
- SSR: some errors recover via `error.tsx`; hydration errors are a different class (fix the mismatch, don’t swallow).

**Follow-ups**

- “How do you reset?” — `resetErrorBoundary()`, or `key={location.pathname}` with care (don’t remount the whole app on every nav).

---

#### 20.2.5. Custom Hooks vs Vue Composables

**What they actually ask**

- “What’s a custom Hook vs a helper?”
- “How do you share logic without HOCs?”
- “Rules of Hooks still apply?”

**How a senior answers**

**Decision.** A custom Hook (`useX`) is a **composable**: reusable **stateful** logic that calls other Hooks. If it doesn’t call Hooks, it is a plain function — don’t prefix `use` just for fashion (you’d lie to the linter).

**Constraint.** Same rules: top level, React function only, stable order. A Hook that takes a callback must document identity (`useCallback` on the caller) or store the latest callback in a ref.

**Failure mode.** Conditional `useX` inside the consumer. Hooks that fetch with `useEffect` when the app already has Query (`useUsers` should wrap `useQuery`, not reinvent it). Returning new object identity every render from `useX()` and passing it as props to `memo` children.

**Measure.** The Hook is tested via a small harness (`renderHook`) for subscription cleanup, not via a 200-line component test.

**Vue bridge**

```ts
// Vue composable ≈ React custom hook — same extraction instinct
export function useOnlineStatus() { /* Vue: ref + onMounted | React: useState + useEffect */ }
```

Naming `use*` is **load-bearing** in React (lint). In Vue it is convention.

**Tradeoffs**

HOCs and render-props still appear in old libs; custom Hooks are the composition API. Don’t wrap every component in `withAuth` when `useAuth()` + a route guard is clearer.

**Production gotchas**

- SSR: `useMediaQuery` / `useWindowSize` must have a **server snapshot** (default + `useEffect`) or you hydrate-mismatch.
- Don’t hide Server/Client boundaries inside a Hook that imports `window` at module scope.

**Follow-ups**

- Composition vs boolean props ([20.2.6](#2026-children-slots-mindset-and-composition)).
- Sharing fetch: Hook over Query, not Hook over `useEffect`.

---

#### 20.2.6. Children, slots mindset, and composition

**What they actually ask**

- “How do slots work in React?”
- “This component has 12 boolean props — what’s wrong?”
- “Render props vs `children` as a function?”

**How a senior answers**

**Decision.** `children` ≈ Vue **default slot**. Passing a component/render function ≈ **named / scoped slots**. Prefer **composition** (`<Card><Card.Header/>…`) over **boolean soup** (`showHeader`, `isCompact`, `hasFooter`, `variant="modal-like"`). If the parent knows the structure, the parent should **pass JSX**, not flip flags.

**Constraint.** `React.Children.map` / `cloneElement` to inject props is brittle (breaks on wrappers, Fragments, memo). Explicit props or context for a compound component (`Tabs` + `Tabs.List`) scales better.

**Failure mode.** `<Button showIcon showSpinner isFullWidth isDanger asLink>` — unreadable, combinatorial tests. Using `children` as an implicit API with undocumented shape. Scoped-slot instinct translated to `cloneElement` on every child.

**Measure.** Can a caller build a weird layout without a new boolean? If they had to wait on you, the API is closed; composition opens it.

**Vue bridge**

| Vue | React |
|---|---|
| Default slot | `children` |
| Named slot | props like `header={...}` / compound components |
| Scoped slot | `children(props)` render function, or render-prop `renderItem` |
| `v-bind="$attrs"` | extra DOM props + `...rest` (know what you filter) |

**Tradeoffs**

Compound components + context: elegant, more moving parts. Render props: flexible, ugly JSX, mostly replaced by Hooks for **logic**, still valid for **view injection** (`renderItem` in a List).

**Production gotchas**

- `children` type `ReactNode` vs `ReactElement` — strings/arrays/false sneak in.
- Passing `children` through a Client Component from a Server Component is the **correct** way to nest Server children under a client wrapper — do not import the server child into the client module ([nextjs.md](./nextjs.md) §21.5).

**Follow-ups**

- “How would you design a Modal API?” — `open` controlled/uncontrolled, portal, composition for body/footer, no `showCloseButton` if they can just omit it.

---

#### 20.2.7. State libraries overview (Redux, Zustand, Jotai)

**What they actually ask**

- “Redux or Zustand?”
- “Does everything go in the store?”

**How a senior answers**

Keep this short in a React round; the depth lives in [State Management (React)](./state-management-react.md).

**Decision.** Default **client UI** store for a Vue senior is **Zustand** (Pinia-shaped). **RTK** when the team needs conventions, DevTools, many contributors, or already owns RTK Query. **Jotai** when the problem is an **atomic graph**, not one fat store. **None of them** are the place for server lists — that is Query/RSC.

**Constraint.** Context is enough for low-churn DI. URL is enough for shareable filters. Cookies/session are the auth source of truth on Next.

**Failure mode.** “We use Redux so the users list lives in a slice.” That answer fails the senior bar.

**Measure.** How many stores, what is in Query, what is in the URL — draw the layers in 30 seconds.

**Vue bridge**

| Vue | React default analog |
|---|---|
| Vuex | Redux Toolkit |
| Pinia | Zustand |
| Many small refs | Jotai atoms |

**Tradeoffs / Follow-ups**

Send them to [state-management-react.md](./state-management-react.md) for team-scale RTK vs Zustand vs Jotai, Next cookies, hydration, Context thrash.

---

#### 20.2.8. Performance checklist for seniors

**What they actually ask**

- “How would you make this page faster?”
- “Did you measure?”

**How a senior answers**

**Decision.** Architecture first (state locality, server data, bundle), not `useMemo` folklore.

**Constraint.** You cannot optimize a guess. Vue’s fine-grained updates hide some sins; React will punish state-in-the-wrong-place immediately.

**Failure mode.** Memoizing the world, skipping Profiler, shipping a 5k-row table without virtualization, fetching in a parent waterfall.

**Measure.** React Profiler (commit duration, why-did-you-render). Field: INP, LCP, CLS. Bundle: route-level split analysis. Lists: FPS while scrolling.

Checklist:

1. **Profiler first** — who re-renders and why (parent, context, hook).
2. **State locality** — push state down; don’t store keystrokes in Context/Redux.
3. **Bailout / Compiler** — `memo` at proven boundaries; don’t fight the Compiler.
4. **Virtualize** long lists (`content-visibility` / TanStack Virtual / `react-window`).
5. **Code-split** routes and heavy widgets (`lazy` + Suspense).
6. **Fetch on the right runtime** — RSC/Query, not effect waterfalls.
7. **Bundle / images / fonts** — same discipline as Vue/Vite; Next has `next/image` but it is not automatic virtue.
8. **Concurrent extras** — `useDeferredValue` / transitions for **stale-while-type**, not as a substitute for O(n²) work ([20.2.10](#20210-concurrent-features-transitions-and-usedeferredvalue)).

**Vue bridge one-liner**

Vue often feels “already optimized.” React seniors earn the same UX with **where state lives + Profiler + framework features (RSC, Compiler)**.

**Tradeoffs**

Virtualization costs a11y/measure complexity. Split too early and you waterfall spinners. Memo too early and you freeze stale props.

**Production gotchas**

- `React.StrictMode` double-render is not a prod perf bug.
- A fast Profiler in dev with extra checks ≠ prod; confirm with production profiling when the stake is high.

**Follow-ups**

- Show a before/after Profiler screenshot story.
- Next-specific cache/PPR: [nextjs.md](./nextjs.md).

---

#### 20.2.9. Route guards / middleware (SPA)

**What they actually ask**

- “How do you protect routes in React?”
- “Is that like Nuxt middleware?”
- “Why isn’t client redirect enough?”

**How a senior answers**

**Decision.** A React **SPA has no Edge middleware**. “Guards” are:

1. **Layout / wrapper** (`RequireAuth` + `<Outlet />`) — UX gate after JS loads.
2. **React Router loaders** (`redirect()`) — closer to `beforeEnter`, still **after** the request for a CSR app.
3. **Next `middleware.ts`** — **Edge, before HTML**. Cookie presence, rewrites, locale. **Not authorization.** Real authz is server (RSC / Route Handler / Server Action). See [Next.js · Middleware](./nextjs.md#218-middleware).

**Constraint.** Client guards **cannot** hide data that already shipped in JS or in a JSON API without auth. They prevent a flash of the wrong screen **if** you wait for `ready` (session hydrated). Redirecting before hydration is how you get login flicker or loops.

**Failure mode.** Treat `<Navigate to="/login">` as security. Middleware that “checks JWT signature with a huge library on the Edge” and still never hits the DB for revocation. Matcher that excludes the page you meant to protect.

**Measure.** Unauthenticated request to the **data** endpoint (must 401). Lighthouse/SEO if you expected server HTML. Watch a slow session fetch: no admin flash.

**Vue / Nuxt bridge**

| Vue / Nuxt | React SPA | Next.js |
|---|---|---|
| `router.beforeEach` | `RequireAuth` / loader | — |
| Nuxt `middleware/` | no file convention | `middleware.ts` (Edge) |
| `meta.requiresAuth` | route config / loader | matcher + cookies |
| Server `useFetch` + 401 | Query + redirect | RSC/session + `redirect()` |

**Tradeoffs**

SPA + Vite is honest for **auth dashboards** (no SEO, existing API). Next middleware adds a cookie gate **before paint** — better UX, still not RBAC.

**Production gotchas**

- Redirect loop: `/login` protected by the same “has cookie” rule as `/app`.
- `ready === false` returning `null` without a skeleton → layout pop.
- Roles in JWT in localStorage — XSS theater; cookies `httpOnly` + server check.

```tsx
// Production pitfall: redirect before session is known → bounce/flicker
if (!user) return <Navigate to="/login" replace />
// Need an explicit ready/pending state from the session source of truth
if (!ready) return <ShellSkeleton />
if (!user) return <Navigate to="/login" replace state={{ from: location }} />
```

**Follow-ups**

- “Where is authorization enforced?” — API/RSC, always. UI is a hint.
- Next vs Vite SPA: [nextjs.md §21.11](./nextjs.md#2111-when-to-choose-next-vs-spa-react).

---

#### 20.2.10. Concurrent features: transitions and useDeferredValue

**What they actually ask**

- “What is concurrent rendering?”
- “`useTransition` vs `useDeferredValue` vs debounce?”
- “Do these replace `memo`?”

**How a senior answers**

**Decision.** Concurrent React can **interrupt** a render so **urgent** updates (typing, click) are not blocked by **heavy** UI. You mark the heavy update:

- `startTransition` / `useTransition` — “this `setState` is not urgent” (tab switch, filter apply, route-like UI). Pending flag for a spinner on the **deferred** part.
- `useDeferredValue(value)` — keep showing the **previous** value in an expensive child while `value` (usually the input) stays instant.
- `useOptimistic` — show the success state, then reconcile with the server (forms/actions).

They **deprioritize work**. They do **not** make an O(n²) tree cheap.

**Constraint.** Transitions + Suspense: a transition can **keep old UI** rather than flipping to `fallback` (that’s the point). Debounce **delays** the value; `useDeferredValue` **renders immediately** at high priority for the input and lags the expensive view. Don’t confuse them.

**Failure mode.** Wrapping every `setState` in `startTransition`. Using `useDeferredValue` instead of virtualizing a 20k list. Expecting no re-render of the child.

**Measure.** Type into a filter: INP, whether the input lags. Profiler lanes (urgent vs transition). If the input still lags, the expensive work is on the **same** urgent update — you didn’t split the state.

**Vue bridge**

Vue rarely needs this because fine-grained updates don’t re-run the world on each keystroke. This is React **catching up in UX**, not a Vue feature you were missing.

**Tradeoffs**

| Tool | You want |
|---|---|
| Debounce/throttle | Fewer **network** calls |
| `useDeferredValue` | Instant input, stale list for a frame |
| `useTransition` | Instant click, heavy panel later + `isPending` |
| `memo` / Compiler | Skip work entirely |
| Virtualize | Don’t render 20k rows |

**Production gotchas**

- `isPending` from `useTransition` is false if something else already suspended — know your boundary.
- Don’t start a transition in render.

**Follow-ups**

- Pair with Query: transition on `setSearchParams`, Query still caches.
- Next: `useOptimistic` + Server Actions.

---

## Quick Vue → React cheat sheet

| Vue 3 | React |
|---|---|
| SFC `.vue` | `.tsx` component |
| Fine-grained reactivity | Re-render + reconcile (+ Compiler bailout) |
| `ref` / `reactive` | `useState` / `useReducer` (not `useRef`) |
| `computed` | derive in render / `useMemo` |
| `watch` / `watchEffect` | `useEffect` **only** to sync externals |
| `onMounted` | `useEffect(..., [])` (Strict Mode double-invoke) |
| `provide` / `inject` | Context (broadcast re-renders) |
| `<Teleport>` | `createPortal` (events still React-tree) |
| composables | custom hooks (`use*`, rules of Hooks) |
| `v-model` | controlled input; files uncontrolled; RHF at scale |
| `v-for` + `:key` | `.map` + stable `key` (Fragment keys) |
| Pinia | Zustand / Redux Toolkit — not for server lists |
| Router guards / Nuxt middleware | SPA wrapper/loader · Next Edge middleware (not authz) |

---

[← Back to Overview](../../README-en.md)
