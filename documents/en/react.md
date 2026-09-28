# React

React knowledge from basic to advanced for Senior Frontend Developer — written for engineers who already know **Vue 3**, with explicit Vue ↔ React bridges.

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

   1.10. [Refs: `useRef` vs Vue `ref` / `template ref`](#20110-refs-useref-vs-vue-ref--template-ref)

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

---

## 20. React

### 20.1. Core Concepts

#### 20.1.1. Virtual DOM & Reconciliation

**Senior-level Answer:**

React keeps a **Virtual DOM** (tree of React elements) and **reconciles** it against the previous tree to compute the minimal Real DOM updates.

#### **How it works:**

1. `render` / function component returns a new element tree (JSX → `React.createElement`).
2. React **diffs** old tree vs new tree (reconciliation).
3. React commits changes to the Real DOM (commit phase).

#### **Vue bridge:**

| Idea | Vue 3 | React |
|---|---|---|
| Intermediate UI tree | VNode / Virtual DOM | React element tree |
| Update trigger | Reactive dependency tracking | Explicit state/`setState` → re-render |
| Skip static work | Compiler hints / `v-once` | `memo`, bailouts, React Compiler (newer) |

#### **Key difference:**

- **Vue** tracks dependencies and re-runs only affected effects/computed.
- **React** (classic model) **re-renders the component function** when state/props change, then reconciles children. Optimization is often manual (`memo`, `useMemo`) unless using React Compiler.

**Summary:** Both use a virtual tree; Vue optimizes via reactivity graph, React via re-render + reconcile (+ memoization).

---

#### 20.1.2. Class Components vs Function Components + Hooks

**Senior-level Answer:**

Modern React is **function components + Hooks**. Class components are legacy for new code but still appear in older codebases and Error Boundaries (historically).

#### **Vue bridge:**

| Vue | React |
|---|---|
| Options API | Class components (historical parallel) |
| Composition API (`setup`, composables) | Function components + Hooks |
| `ref` / `reactive` | `useState` / `useReducer` |
| `onMounted` / `watch` | `useEffect` |

```tsx
// Function component + state (think: script setup + ref)
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>
}
```

**Rules of Hooks (must memorize):**

1. Only call Hooks at the **top level** (not inside conditions/loops).
2. Only call Hooks from **React functions** (components or custom hooks).

**Summary:** Prefer function components + Hooks; map Vue Composition API habits to Hooks 1:1 mentally.

---

#### 20.1.3. JSX & Rendering Model

**Senior-level Answer:**

JSX is syntactic sugar for `React.createElement`. A component is a function that returns a description of UI.

#### **Vue bridge:**

- Vue SFC: template + script (+ style).
- React: usually **JS/TS + JSX in one file** (CSS via modules/Tailwind/CSS-in-JS).

```tsx
// JSX conditionals / lists (Vue: v-if / v-for)
{isOpen && <Modal />}
{items.map((item) => <Row key={item.id} item={item} />)}
```

**Important:** Returning `null` means “render nothing” (like `v-if="false"`).

---

#### 20.1.4. Props vs State

**Senior-level Answer:**

- **Props**: inputs from parent (read-only in child).
- **State**: data owned by the component that can change over time.

#### **Vue bridge:**

| Vue | React |
|---|---|
| `defineProps` | function args / `props` |
| `emit` update / `v-model` | callback props (`onChange`) or controlled pattern |
| local `ref` | `useState` |

```tsx
type UserCardProps = {
  name: string
  onRename?: (name: string) => void
}

function UserCard({ name, onRename }: UserCardProps) {
  return (
    <div>
      <span>{name}</span>
      <button onClick={() => onRename?.(`${name}!`)}>Rename</button>
    </div>
  )
}
```

**Immutability:** treat state as immutable — replace objects/arrays instead of mutating (unlike Vue’s reactive mutation style).

---

#### 20.1.5. Controlled Inputs (Vue `v-model` equivalent)

**Senior-level Answer:**

React forms are usually **controlled**: value comes from state; `onChange` updates state.

```tsx
function NameField() {
  const [value, setValue] = useState('')
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
```

#### **Vue bridge:**

```vue
<!-- Vue -->
<input v-model="value" />
```

```tsx
<!-- React equivalent -->
<input value={value} onChange={(e) => setValue(e.target.value)} />
```

**Uncontrolled** inputs use refs (`defaultValue`) — useful for simple forms/file inputs, less common for complex UI state.

---

#### 20.1.6. Lists & Keys

**Senior-level Answer:**

`key` tells React which item is which across re-renders. Prefer **stable ids**, not array index (index keys break on insert/reorder).

#### **Vue bridge:**

Same idea as Vue `:key` — identity for efficient patching.

---

#### 20.1.7. Effects: `useEffect` vs Vue `watch` / lifecycle

**Senior-level Answer:**

`useEffect` runs **after paint** for synchronization with external systems (network, DOM APIs, subscriptions).

```tsx
useEffect(() => {
  const id = setInterval(() => setTick((t) => t + 1), 1000)
  return () => clearInterval(id) // cleanup = onUnmounted + stop watch
}, []) // [] ≈ run once after mount
```

#### **Vue bridge:**

| Need | Vue | React |
|---|---|---|
| On mount | `onMounted` | `useEffect(() => {...}, [])` |
| On unmount | `onUnmounted` | cleanup function returned by effect |
| Watch a value | `watch(source, cb)` | `useEffect(() => {...}, [source])` |
| Watch deep object | `watch(() => obj, ..., { deep: true })` | depend on specific fields / serialize carefully |

**Senior pitfalls:**

- Missing dependency array → infinite loops or stale closures.
- Using `useEffect` for derived state → prefer calculating during render / `useMemo`.
- Fetch-in-effect races → abort controllers or libraries (React Query, etc.).

---

#### 20.1.8. Derived values: `useMemo` vs Vue `computed`

**Senior-level Answer:**

```tsx
const total = useMemo(
  () => items.reduce((sum, i) => sum + i.price, 0),
  [items],
)
```

#### **Vue bridge:**

- Vue `computed` is **lazy + cached** and auto-tracks deps.
- React `useMemo` caches by **dependency array** you declare.

Prefer plain derivation during render when cheap; use `useMemo` for expensive work or referential stability for children.

---

#### 20.1.9. Stable callbacks: `useCallback`

**Senior-level Answer:**

`useCallback(fn, deps)` memoizes a function identity — useful when passing callbacks to memoized children.

#### **Vue bridge:**

Less needed in Vue because child updates are driven by reactivity, not by parent function identity. In React, unstable inline functions can break `memo` bailouts.

---

#### 20.1.10. Refs: `useRef` vs Vue `ref` / template ref

**Senior-level Answer:**

`useRef` holds a mutable `.current` that **does not trigger re-render**.

| Use | Vue | React |
|---|---|---|
| Reactive value | `ref(0)` | `useState` |
| DOM node | template `ref="el"` | `useRef<HTMLDivElement>(null)` |
| Instance bag / timer id | `let` in closure / non-reactive | `useRef` |

---

#### 20.1.11. Component lifecycle mental model

**Senior-level Answer:**

Think in **render phases**, not only class lifecycle names:

1. Render (pure): compute UI from props/state.
2. Commit: apply DOM updates.
3. Effects: run `useEffect` / `useLayoutEffect`.

| Class lifecycle | Hooks approximation |
|---|---|
| `componentDidMount` | `useEffect(..., [])` |
| `componentDidUpdate` | `useEffect(..., [deps])` |
| `componentWillUnmount` | effect cleanup |
| `shouldComponentUpdate` | `React.memo` / bailouts |

`useLayoutEffect` runs before paint (closer to measuring DOM) — use sparingly.

---

#### 20.1.12. When to fetch data

**Senior-level Answer:**

- **SPA client fetch:** `useEffect` + local state, or better **TanStack Query / SWR**.
- **Framework SSR/RSC (Next.js):** fetch on server / in Server Components — see [Next.js](./nextjs.md).

#### **Vue bridge:**

- Vue SPA: `onMounted` + Pinia, or Nuxt `useAsyncData` / `useFetch`.
- React SPA: Query libraries ≈ Nuxt data fetching ergonomics.

**Summary:** Avoid reinventing cache/dedupe/race handling; prefer a data library for senior-level apps.

---

### 20.2. Advanced Features

#### 20.2.1. Context vs Vue Provide / Inject

**Senior-level Answer:**

Context passes data deeply without prop drilling.

```tsx
const ThemeContext = createContext<'light' | 'dark'>('light')

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Page />
    </ThemeContext.Provider>
  )
}

function Page() {
  const theme = useContext(ThemeContext)
  return <div data-theme={theme} />
}
```

#### **Vue bridge:**

≈ `provide` / `inject`. Same warning: overusing global context makes updates broad and hard to trace. Prefer local state or a store for high-frequency updates.

---

#### 20.2.2. Portals vs Vue Teleport

**Senior-level Answer:**

`createPortal(child, domNode)` renders children into a DOM node outside the parent hierarchy (modals, toasts).

#### **Vue bridge:**

≈ `<Teleport to="body">`.

---

#### 20.2.3. Suspense

**Senior-level Answer:**

Suspense lets you declaratively show fallback UI while a child is loading (used with lazy components / data frameworks / RSC in Next).

```tsx
<Suspense fallback={<Spinner />}>
  <LazyPanel />
</Suspense>
```

#### **Vue bridge:**

Vue also has `<Suspense>` — same product intent, different ecosystem wiring.

---

#### 20.2.4. Error Boundaries

**Senior-level Answer:**

Error Boundaries catch render errors in descendants and show fallback UI. Historically class-based; libraries exist for hook-style APIs.

#### **Vue bridge:**

≈ `onErrorCaptured` + app-level error handling. React does **not** catch event handler / async errors via Error Boundaries automatically.

---

#### 20.2.5. Custom Hooks vs Vue Composables

**Senior-level Answer:**

Extract reusable stateful logic into `useX` functions (same job as Vue composables).

```tsx
function useOnlineStatus() {
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  )
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return online
}
```

#### **Vue bridge:**

```ts
// Vue composable ≈ React custom hook
export function useOnlineStatus() { /* ref + onMounted/onUnmounted */ }
```

**Naming:** always start with `use` so Hook rules can be enforced by lint.

---

#### 20.2.6. Children, slots mindset, and composition

**Senior-level Answer:**

- `children` prop ≈ Vue default slot.
- Pass components as props ≈ named slots / scoped slots (patterns differ; React prefers explicit render props or `children` as function).

```tsx
function Dialog({ children }: { children: React.ReactNode }) {
  return <div className="dialog">{children}</div>
}
```

---

#### 20.2.7. State libraries overview (Redux, Zustand, Jotai)

**Senior-level Answer:**

| Library | Mental model | Vue analogy |
|---|---|---|
| **Redux Toolkit** | Central store + slices + immutable updates | Vuex-style predictable store |
| **Zustand** | Small store hook API | Lightweight Pinia-like |
| **Jotai / Recoil** | Atomic state | Fine-grained atoms |

**When Context is enough:** low-frequency theme/locale/auth session.  
**When you need a store:** high-frequency client cache, complex cross-route state, time-travel/debug needs.

Also see shared notes in [State Management](./state-management.md) (Vue-first) and compare concepts when interviewing.

---

#### 20.2.8. Performance checklist for seniors

**Senior-level Answer:**

1. Measure first (React Profiler, Core Web Vitals).
2. Avoid unnecessary re-renders: state locality, `memo`, stable props.
3. Don’t overuse `useMemo`/`useCallback` — they have cost.
4. Virtualize long lists.
5. Code-split routes/components (`lazy` + `Suspense`).
6. Prefer server fetching / RSC (Next) for data-heavy pages.
7. Watch bundle size (like Vue/Vite discipline).

#### **Vue bridge one-liner:**

Vue often “feels faster to write optimized UI” because of fine-grained updates; React seniors earn performance with architecture + memoization + framework features.

---

## Quick Vue → React cheat sheet

| Vue 3 | React |
|---|---|
| SFC `.vue` | `.tsx` component |
| `ref` / `reactive` | `useState` / `useReducer` |
| `computed` | derive in render / `useMemo` |
| `watch` / `watchEffect` | `useEffect` |
| `onMounted` | `useEffect(..., [])` |
| `provide` / `inject` | Context |
| `<Teleport>` | `createPortal` |
| composables | custom hooks |
| `v-model` | controlled input |
| `v-for` + `:key` | `.map` + `key` |
| Pinia | Zustand / Redux Toolkit |

---

[← Back to Overview](../../README-en.md)
