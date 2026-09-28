# React

Kiến thức React từ cơ bản đến nâng cao cho Senior Frontend — viết cho engineer đã vững **Vue 3**, kèm cầu nối Vue ↔ React rõ ràng.

---

## Table of Contents

1. **Core Concepts**

   1.1. [Virtual DOM & Reconciliation](#2011-virtual-dom--reconciliation)

   1.2. [Class vs Function Components + Hooks](#2012-class-vs-function-components--hooks)

   1.3. [JSX & mô hình render](#2013-jsx--mô-hình-render)

   1.4. [Props vs State](#2014-props-vs-state)

   1.5. [Controlled input (tương đương `v-model`)](#2015-controlled-input-tương-đương-v-model)

   1.6. [Lists & Keys](#2016-lists--keys)

   1.7. [Effects: `useEffect` vs `watch` / lifecycle Vue](#2017-effects-useeffect-vs-watch--lifecycle-vue)

   1.8. [Giá trị suy diễn: `useMemo` vs `computed`](#2018-giá-trị-suy-diễn-usememo-vs-computed)

   1.9. [Callback ổn định: `useCallback`](#2019-callback-ổn-định-usecallback)

   1.10. [Refs: `useRef` vs `ref` Vue](#20110-refs-useref-vs-ref-vue)

   1.11. [Lifecycle theo góc nhìn React](#20111-lifecycle-theo-góc-nhìn-react)

   1.12. [Khi nào fetch data](#20112-khi-nào-fetch-data)

2. **Advanced Features**

   2.1. [Context vs Provide / Inject](#2021-context-vs-provide--inject)

   2.2. [Portals vs Teleport](#2022-portals-vs-teleport)

   2.3. [Suspense](#2023-suspense)

   2.4. [Error Boundaries](#2024-error-boundaries)

   2.5. [Custom Hooks vs Composables](#2025-custom-hooks-vs-composables)

   2.6. [Children / tư duy slot](#2026-children--tư-duy-slot)

   2.7. [Tổng quan state library (Redux, Zustand, Jotai)](#2027-tổng-quan-state-library-redux-zustand-jotai)

   2.8. [Checklist performance cho senior](#2028-checklist-performance-cho-senior)

---

## 20. React

### 20.1. Core Concepts

#### 20.1.1. Virtual DOM & Reconciliation

**Senior-level Answer:**

React giữ một **Virtual DOM** (cây React elements) và **reconcile** với cây trước đó để tính toán cập nhật Real DOM tối thiểu.

#### **Cách hoạt động:**

1. Component function/`render` trả về cây element mới (JSX → `React.createElement`).
2. React **diff** cây cũ vs mới (reconciliation).
3. Commit thay đổi lên Real DOM.

#### **Cầu nối Vue:**

| Ý tưởng | Vue 3 | React |
|---|---|---|
| Cây UI trung gian | VNode / Virtual DOM | React element tree |
| Khi nào update | Dependency tracking | `setState` → re-render |
| Bỏ qua phần tĩnh | Compiler hints / `v-once` | `memo`, bailout, React Compiler |

#### **Khác biệt then chốt:**

- **Vue** theo dõi dependency, chỉ chạy lại phần bị ảnh hưởng.
- **React** (mô hình cổ điển) **chạy lại function component** khi props/state đổi, rồi reconcile children. Tối ưu thường thủ công (`memo`, `useMemo`) trừ khi dùng React Compiler.

**Tóm tắt:** Cả hai đều có virtual tree; Vue tối ưu bằng reactivity graph, React bằng re-render + reconcile (+ memoization).

---

#### 20.1.2. Class vs Function Components + Hooks

**Senior-level Answer:**

React hiện đại = **function components + Hooks**. Class chủ yếu còn trong legacy và Error Boundaries (lịch sử).

#### **Cầu nối Vue:**

| Vue | React |
|---|---|
| Options API | Class (tương đồng lịch sử) |
| Composition API | Function + Hooks |
| `ref` / `reactive` | `useState` / `useReducer` |
| `onMounted` / `watch` | `useEffect` |

```tsx
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>
}
```

**Rules of Hooks (phải thuộc):**

1. Chỉ gọi Hook ở **top level** (không trong if/loop).
2. Chỉ gọi từ **React function** (component hoặc custom hook).

**Tóm tắt:** Map thói quen Composition API sang Hooks gần như 1:1.

---

#### 20.1.3. JSX & mô hình render

**Senior-level Answer:**

JSX là đường tắt của `React.createElement`. Component là function trả về mô tả UI.

#### **Cầu nối Vue:**

- Vue SFC: template + script (+ style).
- React: thường **JS/TS + JSX một file**.

```tsx
{isOpen && <Modal />}
{items.map((item) => <Row key={item.id} item={item} />)}
```

`return null` = không render gì (giống `v-if="false"`).

---

#### 20.1.4. Props vs State

**Senior-level Answer:**

- **Props**: input từ parent (child coi như read-only).
- **State**: data do component sở hữu, thay đổi theo thời gian.

#### **Cầu nối Vue:**

| Vue | React |
|---|---|
| `defineProps` | tham số function / `props` |
| `emit` / `v-model` | callback (`onChange`) / controlled pattern |
| `ref` local | `useState` |

**Immutability:** coi state là bất biến — thay object/array bằng bản mới (khác kiểu mutate reactive của Vue).

---

#### 20.1.5. Controlled input (tương đương `v-model`)

**Senior-level Answer:**

Form React thường **controlled**: `value` lấy từ state, `onChange` cập nhật state.

```tsx
function NameField() {
  const [value, setValue] = useState('')
  return (
    <input value={value} onChange={(e) => setValue(e.target.value)} />
  )
}
```

#### **Cầu nối Vue:**

```vue
<input v-model="value" />
```

≈ React controlled input ở trên.

Input **uncontrolled** dùng ref/`defaultValue` — hữu ích với file input / form đơn giản.

---

#### 20.1.6. Lists & Keys

**Senior-level Answer:**

`key` giúp React nhận diện item qua các lần re-render. Ưu tiên **id ổn định**, tránh dùng index khi list insert/reorder.

#### **Cầu nối Vue:**

Cùng ý với `:key`.

---

#### 20.1.7. Effects: `useEffect` vs `watch` / lifecycle Vue

**Senior-level Answer:**

`useEffect` chạy **sau paint** để đồng bộ hệ thống bên ngoài (network, DOM API, subscription).

```tsx
useEffect(() => {
  const id = setInterval(() => setTick((t) => t + 1), 1000)
  return () => clearInterval(id)
}, [])
```

#### **Cầu nối Vue:**

| Nhu cầu | Vue | React |
|---|---|---|
| Mount | `onMounted` | `useEffect(..., [])` |
| Unmount | `onUnmounted` | cleanup của effect |
| Watch giá trị | `watch` | `useEffect(..., [deps])` |

**Bẫy senior:** thiếu dependency → loop/stale closure; dùng effect cho derived state; fetch trong effect bị race → AbortController hoặc React Query.

---

#### 20.1.8. Giá trị suy diễn: `useMemo` vs `computed`

**Senior-level Answer:**

```tsx
const total = useMemo(
  () => items.reduce((sum, i) => sum + i.price, 0),
  [items],
)
```

- Vue `computed`: lazy + cache + auto-track.
- React `useMemo`: cache theo **dependency array** bạn khai báo.

Tính toán rẻ → derive ngay trong render; `useMemo` khi đắt hoặc cần giữ reference.

---

#### 20.1.9. Callback ổn định: `useCallback`

**Senior-level Answer:**

`useCallback(fn, deps)` giữ identity function — hữu ích khi truyền callback vào child đã `memo`.

Vue ít cần hơn vì update theo reactivity, không phụ thuộc identity function của parent.

---

#### 20.1.10. Refs: `useRef` vs `ref` Vue

**Senior-level Answer:**

`useRef` giữ `.current` **mutable** và **không gây re-render**.

| Mục đích | Vue | React |
|---|---|---|
| Giá trị reactive | `ref(0)` | `useState` |
| DOM node | template ref | `useRef<HTMLDivElement>(null)` |
| Timer id / bag | biến thường | `useRef` |

---

#### 20.1.11. Lifecycle theo góc nhìn React

**Senior-level Answer:**

1. Render (pure): tính UI từ props/state.
2. Commit: áp DOM.
3. Effects: `useEffect` / `useLayoutEffect`.

| Class lifecycle | Hooks |
|---|---|
| `componentDidMount` | `useEffect(..., [])` |
| `componentDidUpdate` | `useEffect(..., [deps])` |
| `componentWillUnmount` | cleanup |
| `shouldComponentUpdate` | `React.memo` |

`useLayoutEffect` chạy trước paint — dùng thận trọng (đo DOM).

---

#### 20.1.12. Khi nào fetch data

**Senior-level Answer:**

- **SPA client:** `useEffect` + state, hoặc tốt hơn **TanStack Query / SWR**.
- **Next SSR/RSC:** fetch trên server / Server Components — xem [Next.js](./nextjs.md).

#### **Cầu nối Vue:**

Nuxt `useAsyncData` / `useFetch` ≈ data library / server fetch của React+Next.

---

### 20.2. Advanced Features

#### 20.2.1. Context vs Provide / Inject

**Senior-level Answer:**

Context truyền data sâu mà không prop drilling — tương đương `provide`/`inject`. Tránh nhồi state đổi liên tục vào Context rộng.

---

#### 20.2.2. Portals vs Teleport

**Senior-level Answer:**

`createPortal(child, domNode)` render ra ngoài hierarchy (modal/toast) ≈ `<Teleport>`.

---

#### 20.2.3. Suspense

**Senior-level Answer:**

Suspense hiện fallback khi child đang load (lazy / data / RSC). Vue cũng có `<Suspense>` — cùng ý sản phẩm, khác ecosystem.

---

#### 20.2.4. Error Boundaries

**Senior-level Answer:**

Bắt lỗi render của descendant và hiện fallback. Thường class-based; không bắt lỗi trong event handler/async một cách tự động. Vue có `onErrorCaptured`.

---

#### 20.2.5. Custom Hooks vs Composables

**Senior-level Answer:**

Tách logic stateful vào `useX` — cùng vai trò composable Vue. Luôn đặt tên bắt đầu bằng `use` để lint enforce Rules of Hooks.

---

#### 20.2.6. Children / tư duy slot

**Senior-level Answer:**

- `children` ≈ default slot.
- Truyền component qua props / render props ≈ named/scoped slot (API khác, mục tiêu tương tự).

---

#### 20.2.7. Tổng quan state library (Redux, Zustand, Jotai)

| Library | Mental model | Gần với Vue |
|---|---|---|
| **Redux Toolkit** | Store trung tâm + slices | Vuex-style |
| **Zustand** | Store hook nhỏ gọn | Pinia nhẹ |
| **Jotai** | Atomic state | Fine-grained atoms |

Context đủ cho theme/locale/auth ít đổi. Store khi state cross-route / tần suất cao / cần debug mạnh.

Xem thêm [State Management](./state-management.md) (thiên Vue) và đối chiếu khi phỏng vấn.

---

#### 20.2.8. Checklist performance cho senior

1. Đo trước (Profiler, Web Vitals).
2. Thu hẹp state; `memo` khi cần.
3. Không lạm dụng `useMemo`/`useCallback`.
4. Virtualize list dài.
5. Code-split (`lazy` + `Suspense`).
6. Data nặng → server/RSC (Next).
7. Kiểm soát bundle size.

**Một câu cầu nối:** Vue dễ “tối ưu sẵn” nhờ fine-grained update; React senior tối ưu bằng kiến trúc + memo + khả năng framework.

---

## Cheat sheet Vue → React

| Vue 3 | React |
|---|---|
| `.vue` SFC | `.tsx` |
| `ref` / `reactive` | `useState` / `useReducer` |
| `computed` | derive / `useMemo` |
| `watch` | `useEffect` |
| `onMounted` | `useEffect(..., [])` |
| `provide` / `inject` | Context |
| `<Teleport>` | `createPortal` |
| composable | custom hook |
| `v-model` | controlled input |
| `v-for` + `:key` | `.map` + `key` |
| Pinia | Zustand / Redux Toolkit |

---

[← Back to Overview](../../README.md)
