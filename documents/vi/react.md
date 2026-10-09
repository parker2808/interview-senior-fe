# React

Bạn đã biết Vue 3. File này không phải tutorial React — đây là **cầu nối Vue → React** cộng với **phán đoán** mà vòng senior React/Next thực sự chấm: re-render vs fine-grained reactivity, khi nào effect là bug, khi nào memo chỉ là diễn, data nên load ở đâu (Query vs RSC vs `useEffect`), và composition/perf/auth khác thói Nuxt thế nào. Interviewer nghe **quyết định → ràng buộc → failure mode → cách đo**, không phải một Counter. Map instinct Composition API sang đây, rồi trả lời như người đang chịu production.

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

   2.9. [Route guards / middleware (SPA)](#2029-route-guards--middleware-spa)

   2.10. [Tính năng concurrent: transition và useDeferredValue](#20210-tính-năng-concurrent-transition-và-usedeferredvalue)

---

## 20. React

### 20.1. Core Concepts

#### 20.1.1. Virtual DOM & Reconciliation

**Họ thực sự hỏi gì**

- “React quyết định update cái gì?”
- “Vue fine-grained — sao cả cây React của tôi re-render?”
- “Bật React Compiler rồi thì còn cần `memo` không?”
- “Key thực sự làm gì?”

**Cách senior trả lời**

**Quyết định.** Model React là **UI = f(state)**: khi state/props/context đổi, **function component chạy lại**, trả về element tree mới, rồi **reconcile** với tree trước và **commit** mutation lên DOM. Model Vue 3 là **reactivity graph**: mutate một `ref`, chỉ effect/computed/component bị track mới chạy lại. Contrast đó *chính là* câu phỏng vấn. React không “patch một dependency” như Vue patch getter — bạn re-execute, rồi diff.

**Ràng buộc.** Reconciliation match theo **element type + position**, list thì theo **`key`**. Cùng type + cùng key → update tại chỗ (giữ state). Khác type hoặc khác key → unmount/remount (reset state). Child re-render vì parent re-render, **trừ khi** nó bail out (`React.memo` so sánh props nông, `useState`/`useReducer` `Object.is` cùng value, Compiler chèn memo, hoặc nó không phải React child của parent đó). Context consumer **không** bail out khi value đổi, kể cả đã bọc `memo`.

**Failure mode.** Key = index trên list reorder được (input giữ nhầm DOM của hàng khác). Tưởng “chỉ đổi `count` thì `<ExpensiveChild />` miễn phí” — React không miễn phí trừ khi bạn trả giá bailout. `memo` tràn mọi component (thêm shallow compare, vẫn vỡ nếu props là object/function identity mới mỗi render). Coi Compiler là phép thuật xóa lỗi kiến trúc (state đặt quá cao, Context làm event bus).

**Cách đo.** React Profiler: *why did this render* (props, hooks, context, parent). Production: INP / long task, không phải cảm giác. Compiler: `react-compiler-healthcheck` / compiled output — nếu Compiler đã memo path đó, xóa `memo` viết tay mới là nước đi senior.

**Tradeoff**

| | Vue 3 | React (classic + Compiler) |
|---|---|---|
| Trigger update | Proxy/dep tracking | `setState` tường minh → re-render |
| Work mặc định | Chạy lại subscriber bị ảnh hưởng | Chạy lại component, rồi children |
| Bỏ work | Compiler flag, `v-once`, computed cache | Bailout, `memo`, Compiler auto-memo |
| Mental model | Graph | Snapshot UI từ props+state |

Vue thường *cảm giác* rẻ hơn khi viết. React đơn giản hơn khi lý luận như snapshot, và ecosystem (RSC, Compiler, concurrent) tồn tại vì re-render mặc định đắt khi scale.

**Gotcha production**

- Đổi **type** component lúc runtime (`isCondition ? Foo : Bar` làm element type, hoặc remount bằng `key={user.id}` trên form) **phá state**. Đó là feature khi bạn muốn reset; là bug khi bạn không muốn.
- `memo` so **props**, không phải “business data có đổi không.” `style={{ margin: 0 }}` hoặc `onClick={() => ...}` vẫn phá bailout.
- React Compiler đổi **câu trả lời mặc định** từ “bọc `memo`/`useCallback`” thành “đo, giữ render pure, để Compiler memo, chỉ hand-memoize interop hoặc lỗ Profiler đã chứng minh.”

**Câu hỏi nối**

- Walk list reorder có và không có key ổn định (xem [20.1.6](#2016-lists--keys)).
- “`memo` có skip reconciliation của descendant không?” — nó skip **chạy function đó**; nếu nó render, children vẫn chạy trừ khi chúng cũng bail out.
- “Fiber / concurrent” — reconciliation có thể **interrupt được**; điều đó không đổi model update Vue-vs-React (xem [20.2.10](#20210-tính-năng-concurrent-transition-và-usedeferredvalue)).

---

#### 20.1.2. Class vs Function Components + Hooks

**Họ thực sự hỏi gì**

- “Sao không được gọi Hook trong `if`?”
- “Class component chết chưa? Vậy Error Boundary hoạt động thế nào?”
- “Map tư duy Options API sang Hooks ra sao?”

**Cách senior trả lời**

**Quyết định.** Code mới là **function component + Hooks**. Class là diện tích legacy: codebase cũ, và **Error Boundary**, historically (và vẫn, trong core React) **chỉ class** (`componentDidCatch` / `getDerivedStateFromError`). Dùng `react-error-boundary` chứ đừng invent class trong mọi app — nhưng phải biết *vì sao* class còn tồn tại.

**Ràng buộc.** Hook là **positional**. React lưu Hook state thành list trên fiber và pair lời gọi **theo thứ tự**. Call order phải giống nhau mọi render. Vì vậy `eslint-plugin-react-hooks` (`rules-of-hooks`, `exhaustive-deps`) là **linter correctness**, không phải style. Đặt tên custom Hook `useX` để linter nhìn thấy.

**Failure mode.** `if (enabled) useEffect(...)` → sau khi toggle, mọi Hook phía sau lệch hàng (sai state, crash). Helper tên `onlineStatus()` gọi `useState` — linter im, rule vẫn vỡ. “Nhét Hook vào loop theo cột” — cùng bug.

**Cách đo.** Plugin Hooks trong CI ở mức `error`. Review: bất kỳ `use*` đứng sau condition là reject. Đừng “chứng minh chạy được” bằng click một lần.

**Cầu nối Vue**

| Vue | React |
|---|---|
| Options API | Class component (song song lịch sử) |
| Composition API / `<script setup>` | Function component + Hooks |
| `ref` / `reactive` | `useState` / `useReducer` |
| `onMounted` / `watch` | `useEffect` (không map lifecycle 1:1 — xem [20.1.7](#2017-effects-useeffect-vs-watch--lifecycle-vue)) |
| `onErrorCaptured` | Error Boundary class / library |

**Tradeoff**

Class cho `componentDidCatch` và một `this`. Hooks cho composition không mixin hell (cùng lý do bạn bỏ mixin Options API). Đừng “class cho mọi thứ vì Error Boundary” — cô lập boundary, giữ tree là function.

**Gotcha production**

- Warning exhaustive-deps bị `eslint-disable` là cách stale closure lên production.
- `useEffectEvent` (khi version React của bạn có) là lối thoát có cấu trúc cho “đọc props mới nhất mà không re-subscribe” — không phải comment ignore tràn lan.

**Câu hỏi nối**

- Implement Error Boundary — họ muốn class method, và thứ nó **không** bắt (event handler, async, SSR). Xem [20.2.4](#2024-error-boundaries).
- “Gọi Hook trong class được không?” — không.

---

#### 20.1.3. JSX & mô hình render

**Họ thực sự hỏi gì**

- “`return null` khác `false` khác `undefined` thế nào?”
- “Sao UI in ra `0`?”
- “Khi nào cần Fragment, và Fragment có `key` được không?”

**Cách senior trả lời**

**Quyết định.** JSX là `React.createElement` / `jsx()`. Component trả về **mô tả** UI, không phải DOM node. Bạn không `v-if` template — bạn `return null` hoặc bỏ child.

**Ràng buộc.** Trong `{cond && <X />}`, những cái này render **không gì**: `false`, `null`, `undefined`. Những cái này **render text**: `0`, `NaN`, `''` (empty string vẫn là text node). Boolean bị bỏ qua; number thì không. Fragment nhóm mà không tạo DOM node: `<>...</>` hoặc `<Fragment key={id}>`. **Chỉ `Fragment` nhận `key`** — cú pháp ngắn `<>` không được.

**Failure mode.** `{count && <Badge />}` khi `count === 0` vẽ **0**. `{items.length && <List />}` cùng bug. Map hai sibling không có Fragment có key thì remount hoặc warn. HTML lồng sai (`<p><div>`) hydrate lệch (đặc biệt Next).

**Cách đo.** React DevTools + text node trên DOM thật. Hydration warning trên console là tín hiệu, không phải nhiễu.

**Cầu nối Vue**

- Vue SFC: template + script + style. React: JS/TS + JSX (style qua module / Tailwind / CSS-in-JS).
- `v-if` / `v-else-if` → ternary hoặc early `return null`.
- `v-show` không có primitive — CSS `hidden` / unmount tường minh; đừng giả bằng `&&` nếu bạn cần toggle display.

```tsx
{count && <Badge />}           // pitfall: count=0 renders "0"
{count > 0 ? <Badge /> : null} // explicit
{count ? <Badge /> : null}
```

**Tradeoff**

`&&` ngắn và không an toàn với number. Ternary dài hơn và trung thực. Ưu tiên `null` cho “không render gì” trong API bạn kiểm soát (`return null` từ component).

**Gotcha production**

- `undefined` như **prop** vs như child: missing prop vs default; children `undefined` là empty.
- Array child bị flatten; nested array vẫn cần key trên **element mà React nhìn thấy**.

**Câu hỏi nối**

- “Sao Fragment hơn wrapper `div`?” — layout/CSS (flex/grid children), HTML hợp lệ (`<tr>`), a11y.
- Fragment có key khi một list item là nhiều sibling (xem [20.1.6](#2016-lists--keys)).

---

#### 20.1.4. Props vs State

**Họ thực sự hỏi gì**

- “Child mutate props được không?”
- “Sao `items.push` là bug React trong khi Vue thì bình thường?”
- “State này nên sống ở đâu?”

**Cách senior trả lời**

**Quyết định.** **Props** là data của parent chảy xuống — contract read-only. **State** do component này sở hữu (hoặc store/URL/server cache — xem [state-management-react.md](./state-management-react.md)). Update **thay** value. `setState` của React bail out nếu `Object.is` nói cùng reference.

**Ràng buộc.** Proxy Vue **thấy mutation tại chỗ**. React thì không. `user.name = 'x'; setUser(user)` là no-op. Bạn copy: `setUser({ ...user, name: 'x' })` hoặc reducer/Immer. Child không bao giờ “own” props; chúng gọi `onChange` và owner update.

**Failure mode.** Mutate props rồi hỏi sao parent stale. Copy props vào state rồi quên sync (có lẽ bạn muốn derivation, không phải effect). Lift state quá cao đến mức mỗi phím gõ re-render cả dashboard.

**Cách đo.** Profiler: ai own state vs ai re-render. Nếu input ở lá re-render cả page, state đang ở sai chỗ.

**Cầu nối Vue**

| Vue | React |
|---|---|
| `defineProps` (readonly-ish; mutation là mùi) | function args; **đừng mutate** |
| `emit('update:modelValue')` / `v-model` | `value` + `onChange` (controlled) |
| `ref` / `reactive` local | `useState` / `useReducer` |
| mutate `state.list.push` | array mới: `[...list, item]` |

**Tradeoff**

Immutability làm `memo` và `Object.is` rẻ, time-travel/debug được. Ceremony nhiều hơn Pinia. Immer (trong RTK hoặc tự dùng) là thỏa hiệp scale theo team.

**Gotcha production**

- Structural sharing quan trọng với tree lớn; clone **root của table 10k hàng** mỗi lần sửa cell là bug perf — localize state hoặc dùng atomic store.
- Props là object mới mỗi lần parent render (`config={{}}`) trông như “state đổi” với child đã `memo`.

**Câu hỏi nối**

- Controlled vs uncontrolled ([20.1.5](#2015-controlled-input-tương-đương-v-model)).
- “Single source of truth” khi URL, server, và local đều muốn cùng field — [state-management-react.md](./state-management-react.md).

---

#### 20.1.5. Controlled input (tương đương `v-model`)

**Họ thực sự hỏi gì**

- “Controlled vs uncontrolled — khi nào cái nào?”
- “Sao không control được file input?”
- “Dùng React Hook Form hay `useState` từng field?”

**Cách senior trả lời**

**Quyết định.** **Controlled**: React state là source of truth (`value` + `onChange`). **Uncontrolled**: DOM mới là (`defaultValue` / `defaultChecked` + ref / form `FormData`). **File input uncontrolled theo platform** — browser không cho `value={file}`; bạn đọc `e.target.files`. Đó không phải quirk React.

**Ràng buộc.** Không được **lật** field từ uncontrolled sang controlled (hoặc ngược) giữa các render — React warn và cursor/value giật. Form controlled đủ 80 field trong một parent re-render cả form mỗi phím gõ trừ khi bạn isolate field hoặc thôi dùng React state làm draft.

**Failure mode.** `<input value={x} />` không `onChange` → input đóng băng. `value={possibleUndefined}` sau đó thành string → warning uncontrolled→controlled. Formik-style “một object values khổng lồ trong Context” rồi hỏi sao gõ bị jank.

**Cách đo.** Gõ 60fps: Profiler trên form, INP. Nếu RHF/`register` (uncontrolled) hết jank, vấn đề là **React own mọi keystroke**, không phải “React chậm.”

**Cầu nối Vue**

`v-model` là sugar cho value + emit. React core không có sugar. Vue có thể mutate ref bind `v-model`; React phải `setState` string mới.

**Tradeoff**

| Approach | Dùng khi | Cost |
|---|---|---|
| Controlled `useState` | Một field, UI validate tức thì, mask | Re-render mỗi lần đổi |
| Uncontrolled + `FormData` | Form native đơn giản, upload file, progressive enhancement | UI theo từng phím yếu hơn |
| **React Hook Form** | Form production: `register` (uncontrolled), `Controller` cho input design system, Zod/Yup resolver | Dependency team; vẫn isolate `Controller` |
| Next **Server Actions** + `useActionState` | Mutation nhỏ, progressive enhancement | Khó cho UX client giàu |

Default senior cho form app thật: **RHF (hoặc tương đương)**, schema validation, uncontrolled nơi design system cho phép, `Controller` chỉ ở lá. Đừng reinvent RHF bằng 40 `useState`. Đừng nhét draft vào Zustand/Redux trừ khi draft phải sống sót đổi route **và** URL là chỗ sai.

**Gotcha production**

- File input: `onChange` → `FileList`; không bao giờ `value={file}`. Reset bằng `inputRef.current.value = ''` hoặc remount `key`.
- Controlled `<select>` / `<input type="date">` empty string vs `undefined` vẫn dính warning lật mode.
- Debounce **state** đánh server thì ổn; debounce **`value` của input** làm field cảm giác hỏng.

**Câu hỏi nối**

- Wire shadcn/MUI `TextField` thế nào (phải `Controller`).
- Lỗi validate server map lại từng field vs chỉ Zod phía client.

---

#### 20.1.6. Lists & Keys

**Họ thực sự hỏi gì**

- “Sao không `key={index}`?”
- “Tôi dùng Fragment trong `map` rồi React warn — vì sao?”
- “Dùng key để reset component được không?”

**Cách senior trả lời**

**Quyết định.** `key` là **identity** giữa các lần render, không phải gợi ý performance. Ưu tiên **id nghiệp vụ ổn định**. Key = index chấp nhận được **chỉ** với list tĩnh không insert, delete, filter, hay reorder.

**Ràng buộc.** Key nằm trên **element trong array**, không phải prop bình thường để child dùng. Thiếu key → React fallback index nội bộ và warn. Hai child trong `map` cần `<Fragment key={id}>` (`<>` ngắn không nhận key).

**Failure mode.** Reorder/sort với key index: **uncontrolled input và component state dính vị trí DOM**, không dính item — bug kinh điển “sửa nhầm hàng”. `key={Math.random()}` remount mỗi render (mất focus, effect thừa). `key={item.id}` trên form khi `id` đi `undefined → 123` remount giữa lúc submit.

**Cách đo.** Nhét uncontrolled `<input>` vào mỗi hàng, reorder, xem text nào ở lại. Profiler: remount vs update (`mount` vs `update` trên flamegraph).

**Cầu nối Vue**

Cùng contract với Vue `:key`. Vue cũng warn key = index vì cùng lý do reuse state. React **ít khoan dung hơn** vì UI nhiều “state trong component” hơn một object reactive duy nhất.

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

**Tradeoff**

`key={user.id}` trên wizard/stepper **cố ý remount** và xóa local state — reset API hợp lệ. Document nó; đừng dùng như búa để “fix” state stale (thường là bug closure/effect).

**Gotcha production**

- Key trùng (hai hàng `id: 0`) → update thiếu/sai, khó debug.
- Virtualization (`react-window` / TanStack Virtual): key vẫn phải ổn định; index + window offset là footgun.

**Câu hỏi nối**

- “Sao đổi key lại chạy cleanup + setup `useEffect`?” — remount là fiber mới.
- Reconciliation type+key từ [20.1.1](#2011-virtual-dom--reconciliation).

---

#### 20.1.7. Effects: `useEffect` vs `watch` / lifecycle Vue

**Họ thực sự hỏi gì**

- “You Probably Don’t Need an Effect — vậy *khi nào* cần?”
- “Sao Strict Mode chạy effect hai lần?”
- “Fetch ở đâu?”

**Cách senior trả lời**

**Quyết định.** `useEffect` để **đồng bộ hệ thống bên ngoài** sau paint: subscription, DOM API không-React, analytics phải thấy UI đã commit, widget bên thứ ba. Nó **không** phải `onMounted`, không phải `watch` cho data suy diễn, và **không** phải fetch API mặc định. Giá trị suy diễn thuộc về render. Logic sự kiện user thuộc event handler. Data: **RSC hoặc TanStack Query/SWR**, không phải effect tự chế, trừ khi bạn ở SPA trần không lib và không server renderer.

**Ràng buộc.** Effect chạy **sau paint**. Dependency array là khóa subscription: `[]` là “sau mount + Strict Mode remount,” không phải “một lần trong đời tab.” Cleanup phải undo setup (**setup/cleanup idempotent**) vì Strict Mode ở development **mount → cleanup → mount lại** để lắc leak. Fetch trong effect không abort thì race response cuối.

**Failure mode.** `useEffect(() => setX(transform(y)), [y])` — thêm một render, tearing, bạn muốn `const x = transform(y)` trong render. Fetch trong effect trong khi team đã có Query hoặc Next Server Component. Thiếu deps → **stale closure**. `setState` trong effect kích lại chính effect đó → loop. Coi double-invoke là bug React rồi tắt Strict Mode.

**Cách đo.** “Effect ran” của React trong Strict Mode là expected. Network tab: GET trùng ở dev vs prod. Race: request A chậm, B nhanh, A thắng — nếu không abort. Ưu tiên `queryKey` + cancel của Query làm lời giải đã đo.

**Cầu nối Vue**

| Nhu cầu | Vue | React |
|---|---|---|
| Sync hệ thống *ngoài* | `watch` / `watchEffect` + `onUnmounted` | `useEffect` + cleanup |
| Sau mount (đọc DOM) | `onMounted` | `useEffect` hoặc `useLayoutEffect` nếu phải đọc layout |
| Data suy diễn | `computed` | tính trong render / `useMemo` |
| Watch value để fetch | `watch(id, fetch)` (vẫn race) | Query / RSC; effect + `AbortController` chỉ khi bắt buộc |

Vue `watch` cảm giác “khi ref này đổi.” React `useEffect` là “sau khi snapshot này commit, căn thế giới bên ngoài.” Không có thế giới bên ngoài thì không cần effect.

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

Nếu fetch effect này là kiến trúc production của bạn, bạn đang chậm — xem [20.1.12](#20112-khi-nào-fetch-data).

**Tradeoff**

Effect là escape hatch khiến Hooks đủ bộ. Chúng cũng là nguồn bug production #1 trong codebase React do người Vue train (vì map `onMounted` + `watch` quá literal).

**Gotcha production**

- Strict Mode double-invoke: subscription phải unsubscribe; fetch phải abort hoặc ignore `id` stale.
- `void fetch()` trong render (không trong effect) còn tệ hơn — render phải pure.
- Event handler không nên “làm trong effect vì tôi không muốn truyền argument.”

**Câu hỏi nối**

- `useLayoutEffect` vs `useEffect` ([20.1.11](#20111-lifecycle-theo-góc-nhìn-react)).
- “Test cái này thế nào?” — đừng; extract phần sync, hoặc dùng Query và test queryFn.

---

#### 20.1.8. Giá trị suy diễn: `useMemo` vs `computed`

**Họ thực sự hỏi gì**

- “Có nên `useMemo` cái này không?”
- “Có giống `computed` không?”
- “React Compiler đổi gì?”

**Cách senior trả lời**

**Quyết định.** Trước hết **derive trong render** (`const total = items.reduce(...)`). `useMemo` cho (1) work **đã chứng minh đắt** hoặc (2) **ổn định reference** của object/array đưa vào child `memo` hoặc làm dep của effect. Nó **không** phải Vue `computed`. Vue `computed` lazy, auto-track, và mặc định cho derived state. React `useMemo` là cache opt-in khóa theo **dependency array bạn khai báo**.

**Ràng buộc.** Sai deps → memo stale. Deps là object mới mỗi lần → memo không bao giờ hit. Compiler (khi bật) **đã memo** nhiều path này; chồng thêm `useMemo` tay có thể là nhiễu.

**Failure mode.** Bọc mọi hằng trong `useMemo` “cho perf” (gọi Hook + compare có thể đắt hơn phép toán). Dùng `useMemo` để giấu effect không nên tồn tại. Memo hóa một boolean rẻ.

**Cách đo.** Profile parent **trước** khi thêm `useMemo`. Nếu Compiler đang bật, nhìn compiled output / Profiler lại sau khi xóa memo.

**Cầu nối Vue**

| | Vue `computed` | React `useMemo` |
|---|---|---|
| Deps | Auto-track | Array thủ công |
| Mặc định? | Có, cho derived state | Không — render trước |
| Lazy | Có | Chạy lúc render nếu deps đổi (không phải lazy getter kiểu Vue) |

**Tradeoff**

Memo tay là documentation “identity này quan trọng.” Lạm dụng là dấu junior. Thiếu memo đến mức phá child đã memo (mỗi lần một `[]` mới) là bug thật — sửa identity chỗ đó, không phải memo cả page.

**Gotcha production**

- `useMemo(() => ({ width }), [width])` để `memo(Child)` vui — hợp lệ, hoặc lift object, hoặc Compiler.
- Memo JSX (`useMemo(() => <Child />)`) thường sai primitive (`memo` / composition).

**Câu hỏi nối**

- Ổn định reference cho [useCallback](#2019-callback-ổn-định-usecallback).
- “2026 còn dạy `useMemo` không?” — có, như **concept** (purity, identity); **thói quen** phụ thuộc team đã adopt Compiler chưa.

---

#### 20.1.9. Callback ổn định: `useCallback`

**Họ thực sự hỏi gì**

- “Function đã rẻ, sao còn `useCallback`?”
- “Vue không cần cái này — sao React cần?”

**Cách senior trả lời**

**Quyết định.** `useCallback(fn, deps)` giữ **function identity** ổn định khi identity đó là **contract**: prop của child `memo`, dep của `useEffect`, context value, register với lib bên thứ ba. Nó **không** làm thân function rẻ hơn.

**Ràng buộc.** Child Vue update vì **reactive data của chúng đổi**, không vì `onClick` của parent là function mới. Child React đã `memo` **sẽ** re-render nếu `onClick` identity mới mỗi lần. Đó là toàn bộ lý do `useCallback` tồn tại.

**Failure mode.** `useCallback` quanh mọi handler “cho perf.” Deps không ổn định (`useCallback(() => do(x), [])` với `x` stale). Truyền `useCallback` vào DOM node chưa từng memo — lãng phí.

**Cách đo.** Profiler trên **child đã memo**, không phải parent. Nếu child là `<button>` native, bỏ `useCallback` trừ khi thứ khác phụ thuộc identity.

**Cầu nối Vue**

Hiếm khi cần. Nỗi gần nhất bên Vue là truyền object prop mới phá `v-once` / cache tay, không phải function identity.

**Tradeoff**

React Compiler thường auto-memo callback. Câu senior trong shop đã Compiler: **đừng rải `useCallback` theo policy**; giữ handler trong scope event; thêm khi Profiler hoặc child chưa compile đòi identity. Shop pre-Compiler: `useCallback` ở biên child `memo`.

**Gotcha production**

- Context `value={{ onLogin: useCallback(...) }}` — bạn vẫn cần **value object ổn định** hoặc tách function sang context riêng ([20.2.1](#2021-context-vs-provide--inject)).
- Liệt kê `setState` trong deps thì ổn (React đảm bảo identity); liệt kê `state` khi có thể dùng functional update là cách callback churn.

**Câu hỏi nối**

- `startTransition` trong callback vs memo hóa nó ([20.2.10](#20210-tính-năng-concurrent-transition-và-usedeferredvalue)).

---

#### 20.1.10. Refs: `useRef` vs `ref` Vue

**Họ thực sự hỏi gì**

- “`useRef` có giống Vue `ref` không?”
- “Sao đổi `.current` không re-render?”
- “Ref vs state cho timer id / callback mới nhất?”

**Cách senior trả lời**

**Quyết định.** `useRef` là **hộp mutable** (`{ current }`) **sống qua render và không báo React**. Nó **không** phải Vue `ref()`. Vue `ref()` là reactive state. React `useRef` là instance field. **Template ref** Vue (DOM/component instance) mới gần analog với React DOM `useRef`.

**Ràng buộc.** Gán `ref.current = x` vô hình với rendering. Đọc ref trong **effect và handler**, không lấy làm nguồn output render (UI sẽ stale). Đừng dùng ref để “tránh” state khi user phải thấy thay đổi.

**Failure mode.** Dùng `useRef` cho `count` rồi hỏi sao view đứng im. Đọc `ref.current` lúc render để phân nhánh (không nhất quán với concurrent rendering). Người Vue train `const x = ref(0)` dịch thành `useRef(0)` thay vì `useState`.

**Cách đo.** UI phải update → state. Lưu node, timeout id, AbortController, hoặc “value mới nhất cho subscription” → ref.

**Cầu nối Vue**

| Use | Vue | React |
|---|---|---|
| Giá trị reactive | `ref(0)` / `reactive` | `useState` / `useReducer` |
| DOM node | template `ref="el"` | `useRef<HTMLDivElement>(null)` |
| Timer / WS / “fn mới nhất” | `let` không reactive trong `setup` | `useRef` |
| Child component instance | template ref | thường đừng; lift state hoặc `forwardRef`/`useImperativeHandle` (escape hatch) |

**Tradeoff**

`useImperativeHandle` là tương đương React của việc thọc tay vào child — hợp pháp với video player/focus manager; mùi khi truyền data lẽ ra phải là props.

**Gotcha production**

- Callback ref vs object ref: callback ref chạy lại khi node attach; cần cho list/virtualization.
- Trong concurrent render, **đừng ghi** ref trong thân render (side effect). Ghi trong effect/handler.

**Câu hỏi nối**

- “Giữ event listener ổn định nhưng đọc props mới nhất thế nào?” — ref tới latest + effect subscribe một lần (hoặc `useEffectEvent`).

---

#### 20.1.11. Lifecycle theo góc nhìn React

**Họ thực sự hỏi gì**

- “Map `componentDidMount` sang Hooks.”
- “Sao render phải pure?”
- “Khi nào `useLayoutEffect`?”

**Cách senior trả lời**

**Quyết định.** Đừng đặt tên class lifecycle lên trước. Nghĩ **phase**:

1. **Render (pure):** cho props/state/context, trả JSX. Không network, không `setState`, không ghi DOM. Concurrent React có thể **render hai lần** (hoặc vứt một render) — purity là correctness.
2. **Commit:** React chạm DOM.
3. **Layout effects** (`useLayoutEffect`): sau DOM update, **trước paint** — đo, restore scroll, sync widget không-React không được flash.
4. **Passive effects** (`useEffect`): sau paint — subscription, logging, sync không gấp.

**Ràng buộc.** `useLayoutEffect` **chặn paint**. Dùng nó `setState` từ `getBoundingClientRect` có thể **thrash** (layout → setState → layout). Ưu tiên CSS, ResizeObserver, hoặc đo một lần.

**Failure mode.** `useEffect` cho derived state (thêm một paint UI sai). `useLayoutEffect` trên server (warning: không chạy được SSR — gate hoặc `useEffect`). Render impure (`Math.random()` / `Date.now()` trong JSX) → lệch hydration trên Next.

**Cách đo.** Layout thrash: Performance panel (forced reflow). Hydration: overlay Next / console mismatch.

**Cầu nối Vue**

| Class | Hooks (xấp xỉ, không bằng) |
|---|---|
| `componentDidMount` | `useEffect(..., [])` (Strict Mode: setup+cleanup+setup ở dev) |
| `componentDidUpdate` | `useEffect(..., [deps])` |
| `componentWillUnmount` | cleanup của effect |
| `shouldComponentUpdate` | `memo` / bailout / Compiler |
| `getSnapshotBeforeUpdate` | `useLayoutEffect` (hiếm) |

Vue `onBeforeUpdate` / `onUpdated` không map sạch; đừng ép.

**Tradeoff**

Layout effect bỏ flicker (vị trí tooltip) với giá INP. Default `useEffect`. Thấy flash rồi mới layout-effect **phần đo**, không phải cả business logic.

**Gotcha production**

```tsx
// Thrash: measure → setState → new layout → measure ...
useLayoutEffect(() => {
  setHeight(el.current.getBoundingClientRect().height)
}, [items, height]) // height in deps is a loop waiting to happen
```

**Câu hỏi nối**

- Strict Mode double render ở dev — purity, không phải “React hỏng.”
- RSC: **không có** componentDidMount trên server tree; effect chỉ tồn tại trên Client Component.

---

#### 20.1.12. Khi nào fetch data

**Họ thực sự hỏi gì**

- “Fetch trong `useEffect`?”
- “TanStack Query vs Next Server Component?”
- “Cancel request đang bay thế nào?”

**Cách senior trả lời**

**Quyết định.** Chọn **source of truth và runtime**:

| Tình huống | Default |
|---|---|
| Next App Router, data cho document, SEO, secret, DB | **async Server Component** `fetch` / data layer |
| Interactivity client trên data server đã cache (filter, polling, mutation, cache share giữa island) | **TanStack Query / SWR** |
| Vite SPA trần, chưa có Query | Effect + abort là *tối thiểu*; vẫn nên Query |
| Sau mutation | Query `invalidateQueries` và/hoặc Next `revalidatePath` / `revalidateTag` |

**Đừng** fetch trong `useEffect` khi project đã có Query hoặc RSC. Đó là lằn ranh senior.

**Ràng buộc.** RSC fetch chạy trên server (bundle + secret không xuống client) nhưng **scope theo request/cache**, không phải live client cache. Query là **client cache** (stale-while-revalidate, dedupe, retry). Effect không có cả hai trừ khi bạn tự dựng.

**Failure mode.** Waterfall effect phía client (layout fetch → child fetch). List cùng một thứ vừa Redux **vừa** Query. Chuỗi RSC `await` lẽ ra `Promise.all` ([nextjs.md](./nextjs.md) §21.12).

**Cách đo.** Screenshot network waterfall, TTFB vs time-to-interactive, cache hit rate (Query Devtools / Next cache log theo version).

**Cầu nối Vue**

| Vue / Nuxt | React / Next |
|---|---|
| `onMounted` + `fetch` | cái bẫy; giống fetch `useEffect` |
| Nuxt `useAsyncData` / `useFetch` | RSC `await` + Query tùy chọn phía client |
| Pinia giữ list | thường **sai** — Query/RSC |

**Tradeoff**

RSC thắng first paint và bundle size; thua “typeahead share cache với widget cách ba route” trừ khi thêm Query. Query thắng UX data live phía client; ship JS và cần provider. Effect không thắng gì ở mức senior ngoài sự trung thực trong SPA nhỏ.

**Gotcha production**

- Race + `AbortController` nếu bạn thực sự ở trong effect ([20.1.7](#2017-effects-useeffect-vs-watch--lifecycle-vue)).
- Đừng chặn navigation vì client fetch mà server đã có sẵn.

**Câu hỏi nối**

- Các tầng cache Next ([nextjs.md](./nextjs.md) §21.10).
- Vì sao list server không thuộc Redux ([state-management-react.md](./state-management-react.md)).

---

### 20.2. Advanced Features

#### 20.2.1. Context vs Provide / Inject

**Họ thực sự hỏi gì**

- “Tránh prop drilling thế nào?”
- “Sao app re-render mỗi phím gõ trong Context?”
- “Context vs Zustand?”

**Cách senior trả lời**

**Quyết định.** Context là **dependency injection** cho value **tần suất thấp**: theme, locale, **id/session snapshot** user hiện tại, feature flag, query client. Nó **không** phải store cho update tần suất cao (chuột, draft text, animation frame, cart qty nếu tick thường xuyên).

**Ràng buộc.** Mọi đổi `value` của `Provider` (`Object.is`) re-render **mọi** consumer bên dưới, và `memo` trên consumer **không** skip đổi context. Tách provider (**theme vs user vs form**) để tick một cây không sơn cây kia. Ổn định `value` (tách context state/dispatch — pattern Redux).

**Failure mode.** Một `AppContext` với `{ user, theme, cart, setCart, searchQuery }`. Draft form trong Context. Dùng Context vì “không muốn thêm lib” với 200 consumer.

**Cách đo.** Profiler: click, nhìn cả tree highlight. Nếu có, tách hoặc chuyển Zustand/Jotai kèm selector.

**Cầu nối Vue**

≈ `provide` / `inject`. Provide Vue không fan-out render cùng cách (consumer được track). React Context là **broadcast re-render**. Khác biệt đó làm Vue senior bất ngờ.

**Tradeoff**

| | Context | Zustand / Jotai |
|---|---|---|
| API | built-in | thêm lib |
| Re-render | mọi consumer của provider đó | slice đã select |
| SSR/RSC | dễ với value tĩnh | hydrate cẩn thận |

**Gotcha production**

- `value={{ theme }}` object mới mỗi render → consumer luôn update.
- Object user auth reference mới mỗi fetch — memoize hoặc truyền `userId` + Query.

**Câu hỏi nối**

- Layer đầy đủ: [state-management-react.md](./state-management-react.md).
- “Nhét Query data vào Context được không?” — Query đã có cache; đừng nhân đôi.

---

#### 20.2.2. Portals vs Teleport

**Họ thực sự hỏi gì**

- “Modal thoát `overflow: hidden` thế nào?”
- “Event portal bubble ra `document` hay ra React parent?”

**Cách senior trả lời**

**Quyết định.** `createPortal(child, domNode)` **sơn** vào `domNode` (thường `document.body`) nhưng **React tree parent vẫn vậy**. Dùng cho modal, toast, popover phải thoát clipping/stacking.

**Ràng buộc.** **Event vẫn bubble theo React tree**, không theo DOM tree. Click trong modal portal vẫn tới React parent của lời gọi `createPortal`. `stopPropagation` trên DOM parent **ngoài** React subtree đó sẽ không thấy click như bạn nghĩ.

**Failure mode.** Giả định bubbling DOM kiểu Teleport cho click-outside. `overflow` lồng + portal vào node vẫn nằm trong ancestor clipping. Nhiều modal không có plan stacking / focus trap.

**Cách đo.** Test click-outside trên overlay container thật. A11y: focus trap, `aria-modal`, Esc — Portal không cho sẵn.

**Cầu nối Vue**

≈ `<Teleport to="body">`. Event Vue cũng theo **cây Vue** hơn người ta nghĩ; dù vậy interviewer đặc biệt thọc “event bubble xuyên portal trong React.”

**Tradeoff**

Portal ra `body` thắng stacking; bạn mất “DOM parent này là containing block” cho `position: absolute` trừ khi portal vào overlay root local (pattern design system).

**Gotcha production**

- SSR: target node phải tồn tại; Next thì portal chỉ trong Client Component sau mount hoặc vào `#modal-root` đã biết trong `layout`.
- Hydration: server phải render nội dung portal ở chỗ nhất quán — mismatch nếu `return null` trên server rồi portal trên client không có strategy.

**Câu hỏi nối**

- Kết hợp [Error Boundaries](#2024-error-boundaries) và [Suspense](#2023-suspense) — chúng theo **cây React**, kể cả child đã portal.

---

#### 20.2.3. Suspense

**Họ thực sự hỏi gì**

- “Suspense cho data vs cho `lazy()`?”
- “Ghép Suspense với Error Boundary thế nào?”
- “Vue Suspense có cùng nghĩa không?”

**Cách senior trả lời**

**Quyết định.** `<Suspense fallback={...}>` bắt **children đang suspend** (throw thenable): **code-split** (`lazy` / `React.lazy`) và **data** (RSC, `use()`, Relay, một số mode Query + Suspense). Nó là **boundary cho loading UI**, không phải error handler.

**Ràng buộc.** Đặt boundary **nơi fallback có nghĩa** (page shell vs panel trong). Cao quá → cả page nhấp nháy. Thấp quá → soup spinner. **Error Boundary ngoài/quanh** Suspense: load fail không được trông như fallback vô tận. SSR/RSC: stream HTML + hydrate client; cây Client Component vẫn cần boundary để hiện fallback.

**Failure mode.** Suspense không Error Boundary (fetch fail trông như spinner treo). Dùng Suspense thay Query khi team cần retry/cache. `lazy()` không boundary (runtime error).

**Cách đo.** Core Web Vitals khi stream vs spinner chỉ client. Segment nào `loading.tsx` (Next) nổ vs `<Suspense>` local của bạn.

**Cầu nối Vue**

Vue `<Suspense>` cùng **ý sản phẩm** (async setup / async component). Wiring ecosystem khác: Nuxt giấu nhiều; Next `loading.tsx` là Suspense mức route quanh segment.

**Tradeoff**

Suspense code-split là bàn thắng tối thiểu. Data Suspense mạnh với RSC/`use()` và sắc với client cache ad-hoc. Đừng bật Query suspense mode “vì hiện đại” khi chưa thiết kế error + cache.

**Gotcha production**

- Nested Suspense lộ content từng mảnh — tốt cho PPR/streaming, xấu nếu layout nhảy (giữ size skeleton).
- Fallback tự suspend — bạn lồng sai.

**Câu hỏi nối**

- Next `loading.tsx` / `error.tsx` vs boundary tay ([nextjs.md](./nextjs.md)).
- Concurrent: Suspense và transition tương tác (transition có thể giữ UI cũ thay vì fallback — [20.2.10](#20210-tính-năng-concurrent-transition-và-usedeferredvalue)).

---

#### 20.2.4. Error Boundaries

**Họ thực sự hỏi gì**

- “Sao cái này là class?”
- “Nó bắt được lỗi `fetch` của tôi không?”
- “Đặt chúng ở đâu?”

**Cách senior trả lời**

**Quyết định.** Error Boundary bắt **lỗi render / lifecycle / constructor của descendant** và render fallback UI. Trong core React chúng là **class**. Hook component không implement `componentDidCatch`. Production: `react-error-boundary` + sink báo cáo (Sentry).

**Ràng buộc.** Chúng **không** bắt: event handler, `async`/`setTimeout`, I/O Server Component trừ khi framework map sang `error.tsx`, lỗi render **của chính** Error Boundary. Vẫn cần `try/catch` trong handler và state `error` của Query.

**Failure mode.** Một boundary ở `App` → tooltip crash whitescreen cả product. Không reset (`key` / `resetKeys`) sau khi user sửa state. Chỉ log trong `componentDidCatch`, không bao giờ `window.onerror` / `createRoot(onUncaughtError)` cho phần còn lại.

**Cách đo.** Chaos: throw trong render một widget, xác nhận phần còn lại của page sống. Throw trong `onClick`, xác nhận **không** bị bắt (đó là bài quiz).

**Cầu nối Vue**

≈ `onErrorCaptured` + `app.config.errorHandler`. Vue làm được trong composition; React core thì không.

**Tradeoff**

Boundary theo segment (Next `error.tsx`) vs boundary theo component. Cả hai. Mức route cho “page này chết”; mức widget cho embed/chart.

**Gotcha production**

- Error Boundary + Suspense: lazy import fail phải error, không treo.
- SSR: một số lỗi recover qua `error.tsx`; hydration error là class khác (sửa mismatch, đừng nuốt).

**Câu hỏi nối**

- “Reset thế nào?” — `resetErrorBoundary()`, hoặc `key={location.pathname}` cẩn thận (đừng remount cả app mỗi lần nav).

---

#### 20.2.5. Custom Hooks vs Composables

**Họ thực sự hỏi gì**

- “Custom Hook khác helper chỗ nào?”
- “Share logic không dùng HOC thế nào?”
- “Rules of Hooks vẫn apply?”

**Cách senior trả lời**

**Quyết định.** Custom Hook (`useX`) là **composable**: logic **stateful** tái sử dụng, gọi Hook khác. Nếu không gọi Hook, nó là function thường — đừng prefix `use` cho mốt (bạn nói dối linter).

**Ràng buộc.** Cùng rule: top level, chỉ React function, thứ tự ổn định. Hook nhận callback phải document identity (`useCallback` phía caller) hoặc giữ callback mới nhất trong ref.

**Failure mode.** `useX` có điều kiện trong consumer. Hook fetch bằng `useEffect` khi app đã có Query (`useUsers` nên wrap `useQuery`, không reinvent). `useX()` trả object identity mới mỗi render rồi truyền props vào child `memo`.

**Cách đo.** Hook được test qua harness nhỏ (`renderHook`) cho cleanup subscription, không qua component test 200 dòng.

**Cầu nối Vue**

```ts
// Vue composable ≈ React custom hook — same extraction instinct
export function useOnlineStatus() { /* Vue: ref + onMounted | React: useState + useEffect */ }
```

Đặt tên `use*` là **load-bearing** trong React (lint). Vue thì là convention.

**Tradeoff**

HOC và render-props vẫn xuất hiện ở lib cũ; custom Hook là composition API. Đừng bọc mọi component `withAuth` khi `useAuth()` + route guard rõ hơn.

**Gotcha production**

- SSR: `useMediaQuery` / `useWindowSize` phải có **server snapshot** (default + `useEffect`) nếu không lệch hydrate.
- Đừng giấu ranh giới Server/Client trong Hook import `window` ở module scope.

**Câu hỏi nối**

- Composition vs boolean props ([20.2.6](#2026-children--tư-duy-slot)).
- Share fetch: Hook bọc Query, không Hook bọc `useEffect`.

---

#### 20.2.6. Children / tư duy slot

**Họ thực sự hỏi gì**

- “Slot trong React hoạt động thế nào?”
- “Component này 12 boolean props — sai chỗ nào?”
- “Render props vs `children` là function?”

**Cách senior trả lời**

**Quyết định.** `children` ≈ **default slot** Vue. Truyền component/render function ≈ **named / scoped slot**. Ưu tiên **composition** (`<Card><Card.Header/>…`) hơn **soup boolean** (`showHeader`, `isCompact`, `hasFooter`, `variant="modal-like"`). Nếu parent biết cấu trúc, parent nên **truyền JSX**, không lật flag.

**Ràng buộc.** `React.Children.map` / `cloneElement` để inject props là giòn (vỡ với wrapper, Fragment, memo). Props tường minh hoặc context cho compound component (`Tabs` + `Tabs.List`) scale tốt hơn.

**Failure mode.** `<Button showIcon showSpinner isFullWidth isDanger asLink>` — không đọc được, test tổ hợp. Dùng `children` làm API ngầm không document shape. Instinct scoped-slot dịch thành `cloneElement` mọi child.

**Cách đo.** Caller có dựng layout dị được mà không cần boolean mới không? Nếu họ phải chờ bạn, API đóng; composition mở.

**Cầu nối Vue**

| Vue | React |
|---|---|
| Default slot | `children` |
| Named slot | props kiểu `header={...}` / compound component |
| Scoped slot | `children(props)` render function, hoặc render-prop `renderItem` |
| `v-bind="$attrs"` | extra DOM props + `...rest` (biết mình filter gì) |

**Tradeoff**

Compound component + context: thanh lịch, nhiều moving part. Render props: linh hoạt, JSX xấu, phần lớn bị Hooks thay cho **logic**, vẫn hợp lệ cho **tiêm view** (`renderItem` trong List).

**Gotcha production**

- Type `children` `ReactNode` vs `ReactElement` — string/array/false len lỏi vào.
- Truyền `children` xuyên Client Component từ Server Component là **cách đúng** để lồng Server child dưới client wrapper — đừng import server child vào client module ([nextjs.md](./nextjs.md) §21.5).

**Câu hỏi nối**

- “Design Modal API thế nào?” — `open` controlled/uncontrolled, portal, composition cho body/footer, không `showCloseButton` nếu họ chỉ cần omit.

---

#### 20.2.7. Tổng quan state library (Redux, Zustand, Jotai)

**Họ thực sự hỏi gì**

- “Redux hay Zustand?”
- “Mọi thứ đều vào store à?”

**Cách senior trả lời**

Giữ ngắn trong vòng React; độ sâu nằm ở [State Management (React)](./state-management-react.md).

**Quyết định.** Default store **client UI** cho Vue senior là **Zustand** (dáng Pinia). **RTK** khi team cần convention, DevTools, nhiều contributor, hoặc đã own RTK Query. **Jotai** khi bài toán là **atomic graph**, không phải một store béo. **Không cái nào** là chỗ cho list server — đó là Query/RSC.

**Ràng buộc.** Context đủ cho DI ít churn. URL đủ cho filter share được. Cookie/session là source of truth auth trên Next.

**Failure mode.** “Dùng Redux nên users list nằm trong slice.” Câu đó trượt thanh senior.

**Cách đo.** Bao nhiêu store, cái gì trong Query, cái gì trên URL — vẽ các tầng trong 30 giây.

**Cầu nối Vue**

| Vue | Analog mặc định React |
|---|---|
| Vuex | Redux Toolkit |
| Pinia | Zustand |
| Nhiều `ref` nhỏ | Jotai atom |

**Tradeoff / Câu hỏi nối**

Đưa họ tới [state-management-react.md](./state-management-react.md) cho RTK vs Zustand vs Jotai scale team, cookie Next, hydration, Context thrash.

---

#### 20.2.8. Checklist performance cho senior

**Họ thực sự hỏi gì**

- “Làm page này nhanh hơn thế nào?”
- “Bạn đã đo chưa?”

**Cách senior trả lời**

**Quyết định.** Architecture trước (locality của state, data server, bundle), không folklore `useMemo`.

**Ràng buộc.** Không tối ưu một phỏng đoán. Fine-grained update của Vue giấu một số tội; React trừng phạt ngay state-sai-chỗ.

**Failure mode.** Memo cả thế giới, bỏ Profiler, ship table 5k hàng không virtualize, fetch waterfall ở parent.

**Cách đo.** React Profiler (commit duration, why-did-you-render). Field: INP, LCP, CLS. Bundle: phân tích split theo route. List: FPS lúc scroll.

Checklist:

1. **Profiler trước** — ai re-render và vì sao (parent, context, hook).
2. **State locality** — đẩy state xuống; đừng chứa keystroke trong Context/Redux.
3. **Bailout / Compiler** — `memo` ở biên đã chứng minh; đừng đánh Compiler.
4. **Virtualize** list dài (`content-visibility` / TanStack Virtual / `react-window`).
5. **Code-split** route và widget nặng (`lazy` + Suspense).
6. **Fetch đúng runtime** — RSC/Query, không waterfall effect.
7. **Bundle / image / font** — cùng kỷ luật Vue/Vite; Next có `next/image` nhưng không tự là đức hạnh.
8. **Concurrent extras** — `useDeferredValue` / transition cho **stale-while-type**, không thay O(n²) ([20.2.10](#20210-tính-năng-concurrent-transition-và-usedeferredvalue)).

**Cầu nối Vue một câu**

Vue thường cảm giác “đã tối ưu sẵn.” Senior React kiếm cùng UX bằng **state sống ở đâu + Profiler + khả năng framework (RSC, Compiler)**.

**Tradeoff**

Virtualization tốn độ phức tạp a11y/đo. Split quá sớm thì waterfall spinner. Memo quá sớm thì đóng băng props stale.

**Gotcha production**

- Double-render `React.StrictMode` không phải bug perf production.
- Profiler nhanh ở dev với extra check ≠ prod; xác nhận bằng production profiling khi stake cao.

**Câu hỏi nối**

- Kể story screenshot Profiler trước/sau.
- Cache/PPR riêng Next: [nextjs.md](./nextjs.md).

---

#### 20.2.9. Route guards / middleware (SPA)

**Họ thực sự hỏi gì**

- “Bảo vệ route trong React thế nào?”
- “Có giống Nuxt middleware không?”
- “Sao redirect phía client chưa đủ?”

**Cách senior trả lời**

**Quyết định.** React **SPA không có Edge middleware**. “Guard” là:

1. **Layout / wrapper** (`RequireAuth` + `<Outlet />`) — cổng UX sau khi JS load.
2. **React Router loader** (`redirect()`) — gần `beforeEnter`, vẫn **sau** request với app CSR.
3. **Next `middleware.ts`** — **Edge, trước HTML**. Cookie presence, rewrite, locale. **Không phải authorization.** Authz thật là server (RSC / Route Handler / Server Action). Xem [Next.js · Middleware](./nextjs.md#218-middleware).

**Ràng buộc.** Client guard **không** giấu được data đã ship trong JS hoặc JSON API không auth. Chúng ngăn flash màn hình sai **nếu** bạn đợi `ready` (session đã hydrate). Redirect trước hydration là cách bị flicker login hoặc loop.

**Failure mode.** Coi `<Navigate to="/login">` là security. Middleware “check chữ ký JWT bằng lib khổng lồ trên Edge” rồi không bao giờ đụng DB để revoke. Matcher loại trừ đúng page bạn định bảo vệ.

**Cách đo.** Request không auth tới endpoint **data** (phải 401). Lighthouse/SEO nếu bạn kỳ vọng HTML server. Quan sát session fetch chậm: không flash admin.

**Cầu nối Vue / Nuxt**

| Vue / Nuxt | React SPA | Next.js |
|---|---|---|
| `router.beforeEach` | `RequireAuth` / loader | — |
| Nuxt `middleware/` | không có file convention | `middleware.ts` (Edge) |
| `meta.requiresAuth` | route config / loader | matcher + cookie |
| Server `useFetch` + 401 | Query + redirect | RSC/session + `redirect()` |

**Tradeoff**

SPA + Vite trung thực với **dashboard auth** (không SEO, API sẵn). Next middleware thêm cổng cookie **trước paint** — UX tốt hơn, vẫn không phải RBAC.

**Gotcha production**

- Redirect loop: `/login` bị cùng rule “có cookie” với `/app`.
- `ready === false` `return null` không skeleton → layout pop.
- Role trong JWT ở localStorage — diễn XSS; cookie `httpOnly` + check server.

```tsx
// Production pitfall: redirect before session is known → bounce/flicker
if (!user) return <Navigate to="/login" replace />
// Need an explicit ready/pending state from the session source of truth
if (!ready) return <ShellSkeleton />
if (!user) return <Navigate to="/login" replace state={{ from: location }} />
```

**Câu hỏi nối**

- “Authorization enforce ở đâu?” — API/RSC, luôn luôn. UI là gợi ý.
- Next vs Vite SPA: [nextjs.md §21.11](./nextjs.md#2111-khi-nào-chọn-next-vs-spa-react).

---

#### 20.2.10. Tính năng concurrent: transition và useDeferredValue

**Họ thực sự hỏi gì**

- “Concurrent rendering là gì?”
- “`useTransition` vs `useDeferredValue` vs debounce?”
- “Chúng thay `memo` được không?”

**Cách senior trả lời**

**Quyết định.** Concurrent React có thể **interrupt** một render để update **khẩn** (gõ, click) không bị UI **nặng** chặn. Bạn đánh dấu update nặng:

- `startTransition` / `useTransition` — “`setState` này không khẩn” (đổi tab, apply filter, UI giống route). Flag pending cho spinner ở phần **deferred**.
- `useDeferredValue(value)` — tiếp tục hiện **value trước** trong child đắt trong khi `value` (thường là input) vẫn tức thì.
- `useOptimistic` — hiện trạng thái success, rồi reconcile với server (form/action).

Chúng **hạ ưu tiên work**. Chúng **không** làm cây O(n²) rẻ.

**Ràng buộc.** Transition + Suspense: transition có thể **giữ UI cũ** thay vì lật sang `fallback` (đó là mục đích). Debounce **trì hoãn** value; `useDeferredValue` **render ngay** ưu tiên cao cho input và làm view đắt chậm lại. Đừng nhầm hai thứ.

**Failure mode.** Bọc mọi `setState` trong `startTransition`. Dùng `useDeferredValue` thay vì virtualize list 20k. Kỳ vọng child không re-render.

**Cách đo.** Gõ vào filter: INP, input có lag không. Profiler lane (urgent vs transition). Nếu input vẫn lag, work đắt đang nằm trên **cùng** update khẩn — bạn chưa tách state.

**Cầu nối Vue**

Vue hiếm khi cần cái này vì fine-grained update không chạy lại cả thế giới mỗi phím gõ. Đây là React **bắt kịp UX**, không phải feature Vue bạn đang thiếu.

**Tradeoff**

| Tool | Bạn muốn |
|---|---|
| Debounce/throttle | Ít **network** call hơn |
| `useDeferredValue` | Input tức thì, list stale một frame |
| `useTransition` | Click tức thì, panel nặng sau + `isPending` |
| `memo` / Compiler | Bỏ work hẳn |
| Virtualize | Đừng render 20k hàng |

**Gotcha production**

- `isPending` từ `useTransition` là false nếu thứ khác đã suspend — biết boundary của mình.
- Đừng start transition trong render.

**Câu hỏi nối**

- Ghép Query: transition trên `setSearchParams`, Query vẫn cache.
- Next: `useOptimistic` + Server Actions.

---

## Cheat sheet Vue → React

| Vue 3 | React |
|---|---|
| SFC `.vue` | `.tsx` component |
| Fine-grained reactivity | Re-render + reconcile (+ Compiler bailout) |
| `ref` / `reactive` | `useState` / `useReducer` (không phải `useRef`) |
| `computed` | derive trong render / `useMemo` |
| `watch` / `watchEffect` | `useEffect` **chỉ** để sync hệ thống ngoài |
| `onMounted` | `useEffect(..., [])` (Strict Mode double-invoke) |
| `provide` / `inject` | Context (broadcast re-render) |
| `<Teleport>` | `createPortal` (event vẫn theo React tree) |
| composable | custom hook (`use*`, rules of Hooks) |
| `v-model` | controlled input; file uncontrolled; RHF khi scale |
| `v-for` + `:key` | `.map` + `key` ổn định (Fragment key) |
| Pinia | Zustand / Redux Toolkit — không cho list server |
| Router guards / Nuxt middleware | SPA wrapper/loader · Next Edge middleware (không phải authz) |

---

[← Back to Overview](../../README.md)
