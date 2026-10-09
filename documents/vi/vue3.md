# Vue 3

Phỏng vấn Senior Vue coi API là chuyện đã thuộc lòng. Họ soi **hành vi compiler**, **điểm mép reactivity**, và **kiến trúc**: cái gì hoist vs fetch, cái gì provide vs store, cái gì giữ client-only. Câu trả lời mạnh là một **quyết định** dưới **ràng buộc**, **failure mode** bạn đã gặp, và cách bạn **đo**. Thuộc lòng cú pháp mà không có judgment production sẽ bị đọc là mid-level.

---

## Table of Contents

1. **Core Concepts**

   1.1. [Virtual DOM](#511-virtual-dom)

   1.2. [Options API vs Composition API](#512-options-api-vs-composition-api)

   1.3. [Auto-import Components](#513-auto-import-components)

   1.4. [v-bind vs v-model](#514-v-bind-vs-v-model)

   1.5. [Props: Parent → Child](#515-props-truyền-dữ-liệu-từ-parent--child)

   1.6. [Computed vs Method](#516-computed-vs-method)

   1.7. [Computed vs Watch](#517-computed-vs-watch)

   1.8. [nextTick Use Cases](#518-nexttick-use-cases)

   1.9. [Debug & Fix Component Bugs](#519-debug--fix-component-bugs)

   1.10. [Reactivity System](#5110-reactivity-setup-computed-watch)

   1.11. [Lifecycle Hooks](#5111-lifecycle-vue-2-vs-vue-3)

   1.12. [created vs mounted: Khi Nào Call API?](#5112-created-vs-mounted-khi-nào-call-api)

2. **Advanced Features**

   2.1. [Teleport](#521-teleport)

   2.2. [Suspense](#522-suspense)

   2.3. [Custom Directives](#523-custom-directives)

   2.4. [Plugins](#524-plugins)

   2.5. [Render Functions & JSX](#525-render-functions--jsx)

   2.6. [Provide / Inject](#526-provide--inject)

   2.7. [Router Navigation Guards (middleware SPA)](#527-router-navigation-guards-middleware-spa)

   2.8. [Slot và scoped slot](#528-slot-và-scoped-slot)

   2.9. [keep-alive](#529-keep-alive)

   2.10. [Async component](#5210-async-component)

   2.11. [Hydration mismatch](#5211-hydration-mismatch)

---

## 5. Vue 3

### 5.1. Core Concepts

Interviewer dùng block này để xem bạn giải thích runtime Vue như **compiler + scheduler + Proxy graph**, không phải danh sách options. Họ bỏ qua “computed là gì” và nhảy sang **vì sao child re-render**, **vì sao ref ngừng update**, hoặc **cách migrate Vue 2 monolith mà không rewrite**.

#### 5.1.1. Virtual DOM

**Họ thực sự hỏi gì**

“Walk through chuyện gì xảy ra khi state đổi.” Nếu bạn dừng ở “diff hai tree rồi patch DOM,” họ đẩy tiếp: *compiler Vue 3 đổi câu chuyện đó như thế nào?* Họ muốn **patch flags, static hoisting, và block tree** — và khi nào VDOM **không** phải bottleneck.

**Cách senior trả lời**

- **Quyết định:** Coi VDOM Vue 3 là **compiler-informed**, không phải walk full-tree ngây thơ mỗi update. Compiler hoist static VNode, đóng **patch flags** lên node dynamic, và gom dynamic children vào **block tree** để runtime chỉ patch những binding đã gắn flag.
- **Ràng buộc:** Chỉ có ích khi template ổn định. `v-if`/`v-for` ở root của một block, `v-bind="obj"` fully dynamic, và `v-html` buộc flag thô hơn (`FULL_PROPS`, unkeyed fragment).
- **Failure mode:** Team “optimize VDOM” trong khi cost thật là **layout/reflow**, **network waterfall**, hoặc **tạo hàng nghìn reactive effect**. Thời gian patch VDOM hiếm khi nằm top trên dashboard sản phẩm.
- **Đo:** Vue DevTools performance + panel Performance của browser. Tách **JS (render + reactivity)** vs **Recalculate style / Layout** vs **network**. Nếu INP bị layout-bound, `v-once` và patch flags không cứu được.

Static node được hoist ra khỏi render function. Dynamic node mang flag như `TEXT`, `CLASS`, `STYLE`, `PROPS`, `HYDRATE_EVENTS`. Một **block** (`openBlock`) chụp cấu trúc child ổn định để Vue bỏ qua walk subtree tĩnh lúc update. `v-once` / `v-memo` là lối thoát tường minh khi compiler không chứng minh được sự ổn định (ví dụ khối legal text khổng lồ, hoặc hàng list mà bạn biết props không đổi).

**Tradeoff**

| Cách làm | Khi nào dùng | Giá |
|---|---|---|
| Tin compiler + template | Gần như toàn bộ UI app | Cần template, không phải `innerHTML` ad-hoc |
| `v-memo` / `v-once` | List rất lớn / subtree biết chắc ổn định | UI stale nếu điều kiện memo sai |
| Render function / JSX | Children hoàn toàn dynamic, headless lib | Mất nhiều compiler hint nếu không cẩn thận |
| Virtualize list | Hàng nghìn row | Thêm complexity; VDOM chưa bao giờ là đúng tầng |

**Gotcha production**

- `v-for` không key trên object đổi identity → Vue patch tại chỗ, **state (input, transition) dính nhầm hàng**.
- Truyền object/array literal mới làm prop mỗi render (`:style="{}"`, `:options="[]"`) khiến child trông dynamic dù value bằng nhau.
- Force layout trong `onUpdated` (đọc `offsetHeight` sau khi write) át cả cost diff VNode.

**Câu hỏi nối**

- Khác biệt **patch flags** và **block tree**.
- Vì sao Vue 3 skip được static subtree mà Vue 2 không skip được.
- Khi nào virtualize vs `v-memo` vs paginate.
- Hydration SSR dùng chung metadata block/patch như thế nào.

---

#### 5.1.2. Options API vs Composition API

**Họ thực sự hỏi gì**

Không phải “cái nào mới hơn.” Họ hỏi cách bạn **migrate app Vue 2 lớn**, xử lý **mixin** ra sao, và có **cấm Options API** không. Senior nói về **tách logic**, **TypeScript**, và **rủi ro team**, không nói mốt.

**Cách senior trả lời**

- **Quyết định:** Composition API là default cho code mới và cho feature **cắt ngang** `data` / `computed` / `methods` / lifecycle. Options API vẫn ổn cho **component presentational nhỏ, local** (bọc icon, chrome layout tĩnh) nơi composable chỉ là nghi lễ.
- **Ràng buộc:** Codebase 200 SFC Vue 2 với mixin, filter, và teammate chỉ Options không rewrite được trong một quý. Migrate **theo feature**: extract composable cạnh mixin nó thay, rồi xóa mixin khi hết call site.
- **Failure mode:** Mixin + composable trong cùng component — `this.foo` đụng nhau ngầm, lifecycle nhân đôi, “property này từ đâu ra?” Cũng: rewrite hết sang `<script setup>` không có test, rồi ship thay đổi thầm trong `beforeDestroy` vs `onBeforeUnmount` + keep-alive.
- **Đo:** Thời gian thêm feature cắt ngang (permissions, tracking, feature flag) mà không đụng options unrelated; số vụ mixin collision; coverage TS trên module bạn thực sự sửa.

Mixin gãy ở **namespace** (hai mixin ship `data()` cùng key), **origin** (DevTools không nói mixin nào inject `loading`), và **thứ tự merge lifecycle**. Composable trả **binding tường minh**, **tree-shakeable**, và compose không cần `this`. `script setup` là default production; giữ Options chỉ khi component là leaf và sẽ mãi là leaf.

**Tradeoff**

| | Options | Composition |
|---|---|---|
| Discoverability | `data`/`methods` là một map | Logic gom theo concern; có thể giấu trong `useX` |
| Reuse | Mixin, extend | Composable, không đụng tên |
| TypeScript | `this` đau | First-class |
| Tree-shaking | Object options luôn bị giữ | Composable không dùng thì drop |
| Leaf nhỏ | Đọc nhanh | Hơi nhiều import |

**Gotcha production**

- `this` trong Options `data()` chưa setup xong — copy pattern Vue 2 đọc data key khác bên trong `data()` vẫn gãy.
- Mix `setup()` **và** Options `data`/`methods` là hợp lệ và là cách migrate dần; đừng coi là mùi cho tới khi file ổn định.
- Composable đóng over instance (`getCurrentInstance()`) là mixin phiên bản mới: khó test, thù SSR.

**Câu hỏi nối**

- Bạn thay `authMixin` 400 dòng như thế nào.
- Có cho Options trong Vue 3 greenfield không (thường: có, chỉ dumb leaf).
- Filter → method/computed; `$listeners` → `attrs`; `.sync` → `v-model:foo`.

---

#### 5.1.3. Auto-import Components

**Họ thực sự hỏi gì**

“Bạn auto-import hết à?” Họ muốn **DX vs public API tường minh**, **circular dep**, và **tree-shaking** — nhất là khi bạn ship **component library** hoặc **design system**.

**Cách senior trả lời**

- **Quyết định:** Auto-import UI **nội bộ app** (`components/`, composable, Vue API) trong product app. **Import tường minh** mọi thứ là **public API**: package publish, module xuyên domain, plugin có side-effect, và thứ resolver tham lam không được kéo vào.
- **Ràng buộc:** Nuxt / `unplugin-vue-components` giấu dependency graph. Tuyệt cho tới khi hai feature auto-import lẫn nhau, hoặc barrel file re-export util Node-only vào client component.
- **Failure mode:** Composable circular chỉ nổ ở production chunk; barrel design-system re-export mọi component từ một `index` (**phá tree-shaking**); tên auto-import đụng nhau (`Modal` từ hai folder).
- **Đo:** Bundle analyzer client trên một route, `vite-bundle-visualizer` / rollup-plugin-visualizer; soi chart/map/editor lib lọt vào page chưa bao giờ import chúng.

Nuxt prefix thư mục lồng (`components/form/Input.vue` → `FormInput`) và có thể path-prefix để tránh collision. `app.component()` global là tệ nhất hai thế giới: luôn trong bundle, không colocation. Library bạn publish thì **đừng** dựa auto-import của consumer — export named component, để resolver của họ map nếu họ muốn.

**Tradeoff**

- Auto-import: DX local nhanh, ít dòng import, “go to definition” kém hơn khi xuyên repo, cycle bị giấu.
- Import tường minh: graph grep được, tốt cho public API, SFC ồn hơn.
- Lazy/async component: vẫn cần `defineAsyncComponent` tường minh (hoặc prefix `Lazy` của Nuxt) khi bạn quan tâm **lúc nào** chunk load.

**Gotcha production**

- Auto-import không phá cycle — nó **giấu** cycle. Nếu `useCart` → `useUser` → `useCart`, bạn nhận store `undefined` lúc init hoặc lỗi TDZ chỉ xuất hiện theo thứ tự cold load.
- Type generation (`components.d.ts`) có thể lệch CI nếu plugin không chạy; coi là build artifact hoặc commit kèm check.
- Resolver import từ `lodash` hoặc cả icon pack theo từng tên component sẽ phá tree-shaking.

**Câu hỏi nối**

- Có auto-import Pinia store không? (Trong app thì thường có, xuyên package thì không.)
- Cách ngăn hai file `Button.vue` đụng nhau.
- Khác biệt auto-import vs global registration về kích thước payload SSR.

---

#### 5.1.4. v-bind vs v-model

**Họ thực sự hỏi gì**

Họ đã biết `v-model` là `:modelValue` + `@update:modelValue`. Họ muốn **nhiều v-model**, **modifier**, **`defineModel`**, và rule **đừng v-model một prop**. Chọn form library xuất hiện ở team product.

**Cách senior trả lời**

- **Quyết định:** `v-bind` cho data one-way. `v-model` / `v-model:foo` cho **single source of truth thuộc về parent** (hoặc form library). Trong child, emit update hoặc dùng `defineModel()` — không bao giờ gán vào prop.
- **Ràng buộc:** Vue 3 bỏ default `value`/`input` của Vue 2 trừ native element. Tác giả component phải document tên model. Native modifier (`.trim`, `.number`, `.lazy`) không tự áp lên custom component trừ khi bạn đọc `modelModifiers`.
- **Failure mode:** `v-model="props.user"` (hoặc mutate field lồng trong object prop) — chạy tới khi parent re-fetch đè bản đang sửa, hoặc warning strict thành error. Vòng `watch` two-way (`watch(a, setB); watch(b, setA)`) trên field tiền tệ/ngày.
- **Đo:** Ticket “mất keystroke” trên form, warning Vue “mutation of prop” trong CI (coi là fail), số cầu `watch` trong SFC form (phải giảm).

`v-model:firstName` và `v-model:lastName` chỉ là hai named model. `defineModel()` (3.4+) là cách production khai contract đó không boilerplate. Fallthrough attrs (`v-bind="$attrs"`) là cách giữ headless input accessible mà không khai lại mọi native attribute.

**Tradeoff**

| Pattern | Khi nào | Rủi ro |
|---|---|---|
| `v-model` do parent sở hữu | Filter, settings, field đơn | Parent re-render mỗi phím trừ khi debounce emit |
| Bản local, emit lúc blur/submit | Form nặng, parent đắt | Lệch so với truth phía server |
| Form library (VeeValidate, FormKit, TanStack Form) | Validate xuyên field, UX lỗi | Thêm abstraction; vẫn không được mutate prop |
| Chỉ `v-bind` | Read-only / presentational | Người ta sẽ hack `watch` để ghi ngược |

**Gotcha production**

- `v-model` lên **prop** của child mà cùng object còn tới từ store: hai writer, last write wins.
- `.number` trên input rỗng → `0` vs `''` làm validation bất ngờ.
- Bind `v-model` thẳng field **Pinia** từ nhiều input không có draft local sẽ broadcast mọi keystroke tới mọi subscriber.

**Câu hỏi nối**

- `modelModifiers` hoạt động thế nào trên custom input.
- `defineModel` vs props/emits tường minh cho library bạn publish (tường minh tương thích và document được hơn).
- Native `v-model` luôn là component state; không có mode “uncontrolled input” để núp.

---

#### 5.1.5. Props: Truyền dữ liệu từ Parent → Child

**Họ thực sự hỏi gì**

One-way data flow là vạch junior. Senior gặp **object identity gây update**, **unwrap / boolean cast**, **fallthrough attrs**, và **provide vs props vs store**.

**Cách senior trả lời**

- **Quyết định:** Props cho **contract có cấu hình, có type** giữa parent và child bạn sở hữu. Provide/inject cho giá trị **ambient cả cây** (theme, form context, i18n) nếu không sẽ drill xuyên tầng presentational. Pinia cho **client state toàn app** với nhiều subtree không liên quan. Đừng chọn một cây búa.
- **Ràng buộc:** Props là one-way. Object và array truyền **theo reference** — child có thể mutate lúc runtime và Vue không phải lúc nào cũng warn nếu bạn mutate field lồng. Coi props là **snapshot read-only**; child muốn sửa thì emit giá trị mới.
- **Failure mode:** Parent viết `:user="getUser()"` hoặc `:filters="{ ...filters, page }"` tạo **object mới mỗi render** → child `watch(() => props.filters, ...)` hoặc setup đắt chạy lại dù value bằng. Failure ngược: mutate `props.filters.page++` khiến ba page share một object rồi “tự nhiên” đồng bộ.
- **Đo:** Vue DevTools “why did this component update”; đếm `watch(() => props.x, { deep: true })` trong codebase (thường là mùi); child render thừa trên form có type.

Boolean attribute vẫn **cast** (`<Comp disabled />` → `disabled: true`). `defineProps` + TypeScript là contract; `withDefaults` cho default. `inheritAttrs: false` + bind `$attrs` lên `<input>` thật là pattern production cho wrapper (a11y + native listener).

**Tradeoff**

| Kênh | Coupling | Độ mịn update | Testability |
|---|---|---|---|
| Props | Tường minh | Theo parent render + identity | Dễ |
| Provide/inject | Ngầm, theo cây | Ai `provide` | Cần wrapper |
| Pinia | App-global | Subscriber của store | Mock store |

**Gotcha production**

- Destructure `const { user } = defineProps<...>()` **mất reactivity** trừ khi dùng `toRefs` / `toRef` hoặc giữ `props.user` (trong `<script setup>`, compiler macro có thể bù — đừng dựa vào đó ở file TS thuần).
- List lớn làm prop: ưu tiên `shallowRef` ở parent rồi truyền list; Proxy sâu trên 10k row là thuế reactivity, không phải thuế VDOM.
- `v-bind="object"` vừa props vừa native attrs có thể đụng (`id`, `class`, `style` và rule merge).

**Câu hỏi nối**

- Khi nào `markRaw` một prop (class instance third-party).
- Version prop design-system mà không gãy mười app (`union` + thời gian deprecation).
- Attrs vs props vs slot cho `Button` phải giữ native-clickable.

---

#### 5.1.6. Computed vs Method

**Họ thực sự hỏi gì**

Họ muốn **cache và tính thuần (purity)**, không phải “computed để hiển thị.” Bẫy là **gọi method trong template** filter 20k row, hoặc nhét **side effect** vào computed vì “phải luôn sync.”

**Cách senior trả lời**

- **Quyết định:** Giá trị derived, sync, **pure** → `computed`. Event handler, việc imperative, và thứ cần **đối số** → method. Cần derivation có tham số thì dùng computed của `Map` / cấu trúc đã index sẵn, không phải method gọi từ mọi hàng.
- **Ràng buộc:** Computed cache theo **identity dependency reactive**. Nếu bạn đọc `list.filter(...)` mà `list` là array mới mỗi lần, cache không bao giờ hit. Computed phải **sync**; không có `async computed` — đó là `watch` + state, hoặc query library.
- **Failure mode:** Template `{{ format(user) }}` trên 500 hàng với formatter nặng; hoặc computed ghi `localStorage` / tăng counter (re-run giấu trong DevTools, lệch SSR).
- **Đo:** `onRenderTracked` khi isolate, hoặc profiler: số lần eval computed vs số render. Computed eval lại mỗi render là method giả trang (thường vì dependency không ổn định).

**Tradeoff**

- Computed: đọc nhiều lần trong một render thì rẻ, **track dependency**, không nhận đối số.
- Method: linh hoạt, **chạy mỗi lần gọi**, dễ vô tình O(n) mỗi hàng.
- Computed ghi “deps” trong comment nhưng đọc thêm reactive state là đang nói dối — graph là cái nó **đọc**, không phải cái bạn định.

**Gotcha production**

- Viết `computed(() => props.items.sort())` **mutate prop** (sort tại chỗ). Copy trước, không thì list của parent tự reorder.
- Computed trả object/array literal là **identity mới** mỗi lần invalidate — child watch nó luôn fire. Đôi khi bạn muốn thế; thường bạn muốn filtered list ổn định.
- Debug bằng `console.log` trong computed: đó là side effect và sẽ nói dối bạn về tần suất chạy trên prod.

**Câu hỏi nối**

- Writable computed làm adapter `v-model` tới field store lồng.
- Vì sao `computed` là chỗ sai để fetch.
- Debugger option computed Vue 3.4+ (`onTrack` / `onTrigger`) giúp gì.

---

#### 5.1.7. Computed vs Watch

**Họ thực sự hỏi gì**

“Khi nào dùng `watch` thay `computed`?” Vạch senior: **watch cho side effect**. Rồi họ hỏi `watch` vs `watchEffect`, timing `flush`, và **over-collection**.

**Cách senior trả lời**

- **Quyết định:** UI diễn được thành **data suy ra từ data** thì là computed. Nếu thứ **ngoài graph** phải xảy ra (fetch, analytics, sync URL, điều khiển widget third-party) thì là `watch` / `watchEffect` / lifecycle hook. Ưu tiên **source `watch` tường minh** hơn `watchEffect` trong component lớn.
- **Ràng buộc:** `watchEffect` chạy lại khi **bất kỳ** reactive read trong body đổi, kể cả read tình cờ (`if (debug) console.log(store)`). Đó là over-collection. `watch` với getter là contract: đây là source.
- **Failure mode:** Fetch trong computed (hoặc `watchEffect` không abort) → bão request, race, SSR fetch đôi. `watch` với `{ deep: true }` trên graph reactive lớn → mỗi phím trong form chạy việc đắt.
- **Đo:** Waterfall network cho GET trùng; timeline Vue DevTools cho số watcher; test abort/unmount.

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

**Tradeoff**

| | computed | watch | watchEffect |
|---|---|---|---|
| Purity | Bắt buộc | Side effect | Side effect |
| Source | Ngầm, được track | Tường minh | Ngầm, dễ over-collect |
| Giá trị cũ | n/a | Có | Không |
| SSR | Ổn nếu pure | Có thể chạy đôi nếu bạn cũng fetch trong setup | Dễ đụng `window` |

**Gotcha production**

- `watch` một object `reactive` không getter thì watch **thay thế proxy**, không phải field lồng, trừ khi `deep`. Ưu tiên `() => state.query`.
- `flush: 'post'` khi side effect cần DOM; default `'pre'` chạy trước component update — đo layout trong watch default đọc **DOM stale**.
- `watchEffect` trong composable được gọi từ nhiều component nhân subscription; đó là cách “app chậm sau khi thêm analytics.”

**Câu hỏi nối**

- `watchPostEffect` vs `nextTick`.
- Vì sao `immediate: true` trên fetch watch vẫn race với unmount.
- Thay `watch(route, fetch)` bằng `useAsyncData` / query library có key.

---

#### 5.1.8. nextTick Use Cases

**Họ thực sự hỏi gì**

Không phải “đợi DOM.” Họ muốn **scheduler flush vs microtask**, **đo đạc**, và bạn có dùng `nextTick` như **miếng dán race-condition** không.

**Cách senior trả lời**

- **Quyết định:** Dùng `nextTick` khi cần **DOM mà Vue đã schedule** (focus input `v-if`, đo list sau `push`, đưa node cho chart lib). **Đừng** dùng để “cho store ổn” hay sắp thứ tự hai async call.
- **Ràng buộc:** Vue batch update. Đổi state xếp một job; DOM được patch trong flush đó. `nextTick` resolve sau flush hiện tại (dựa Promise; Vue dùng microtask). `queueMicrotask` / `Promise.then` có thể chạy **trước** flush của Vue nếu bạn đã ở trong microtask.
- **Failure mode:** Chuỗi `await nextTick(); await nextTick()` để giấu child chưa mount — bug thật là thiếu `onMounted`, một `v-if`, hoặc target Teleport. Cũng: đo trong `nextTick` rồi ghi layout → vòng forced reflow.
- **Đo:** Bug biến mất khi bọc `nextTick` thì bạn chưa có fix — bạn có **phụ thuộc timing**. Thêm test fail tick clock / flush Vue (`flushPromises` + `await wrapper.vm.$nextTick()`) rồi thay miếng dán bằng lifecycle hoặc `watch(..., { flush: 'post' })`.

**Tradeoff**

- `nextTick`: đúng cho “DOM của Vue, tick này.”
- `watch` + `flush: 'post'`: đúng cho “mỗi khi X đổi, sau render.”
- `requestAnimationFrame` / `ResizeObserver`: đúng cho layout không thuộc scheduler Vue (font, image, CSS transition).

**Gotcha production**

- SSR: `nextTick` tồn tại; **không có DOM browser**. Init chart trong `nextTick` từ `setup` vẫn cần `onMounted` / `ClientOnly`.
- Gọi `nextTick` lúc render (trong computed/setup render) là mùi và có thể warn.
- Widget third-party: một `nextTick` không đủ nếu child async; đợi `onMounted` của child qua callback hoặc `watch` template ref thành non-null.

**Câu hỏi nối**

- Pre vs post flush, `watchPostEffect`.
- Scheduler Vue 3 gom nhiều lần ghi `ref` trong cùng tick thế nào.
- Vì sao `await props.x` không thay `nextTick`.

---

#### 5.1.9. Debug & Fix Component Bugs

**Họ thực sự hỏi gì**

Câu hỏi war-story: component “ngẫu nhiên” không update, hoặc keep-alive hiện data stale. Họ muốn **phương pháp**, không phải “em `console.log`.”

**Cách senior trả lời**

- **Quyết định:** Reproduce bằng **đường reactive tối thiểu** (props → computed → DOM). Phân loại: **mất reactivity**, **closure/cache stale**, **race**, **identity**, **lệch SSR**. Sửa class, không sửa instance.
- **Ràng buộc:** Proxy Vue 3 nghĩa là `===` với raw object fail, DevTools có thể hiện Proxy, và destructure im lặng cắt tracking.
- **Failure mode:** Ship workaround `nextTick` / `key="Date.now()"` reset state child mỗi lần parent render.
- **Đo:** Inspector + timeline Vue DevTools; `onRenderTracked` / `onRenderTriggered` local; regression test quanh đường reactive.

Mất reactivity vì destructure:

```ts
const state = reactive({ count: 0 })
const { count } = state          // number, not tracked
const { count: countRef } = toRefs(state) // Ref, tracked
```

Proxy vs raw: `watch(obj, ...)` mà `obj` là `toRaw(store.item)` sẽ **không** thấy store update. Map/Set từ library, hoặc class instance, nên `markRaw` nếu không bạn sẽ proxy nội bộ và gãy `instanceof` / identity map.

**Bug cache keep-alive:** instance không bị destroy; `onMounted` không chạy lại. Fetch data thuộc `onActivated` (hoặc `watch` param route) nếu không bạn hiện record của customer trước. `max` + LRU sẽ im lặng drop rồi remount — coi đó là feature, không phải leak.

**Tradeoff**

- DevTools trước vs thêm log: DevTools ít nói dối hơn về **dependency nào** trigger. Log trong computed/watch đổi timing.
- Remount bằng `key` vs sửa state: remount hợp lệ khi **identity của entity** đổi (`:key="userId"`); không hợp lệ như “reset Vue” generic.

**Gotcha production**

- `reactive` + `v-for` cùng object trên hai list: edit bị alias.
- `ref` unwrap trong template nhưng không unwrap trong callback `setTimeout` — người ta “fix” bằng bọc hết `nextTick`.
- Production build cắt warning; bug mutate prop chỉ hiện ở staging.

**Câu hỏi nối**

- Debug update **mỗi frame** (thường watcher ghi giá trị tự invalidate mình).
- Pinia `$patch` vs thay cả `$state`.
- Hydration mismatch vs “trắng sau load” (xem [5.2.11](#5211-hydration-mismatch)).

---

#### 5.1.10. Reactivity: setup(), computed, watch

**Họ thực sự hỏi gì**

Vue 2 `Object.defineProperty` vs Vue 3 `Proxy`, **ref vs reactive**, rồi núm production: **`markRaw`**, **`shallowRef`**, **`triggerRef`**. Đây là chỗ tách senior khỏi người thuộc `.value`.

**Cách senior trả lời**

- **Quyết định:** `ref` cho primitive và cho giá trị bạn **thay cả cục**. `reactive` cho túi field local mutate tại chỗ. `shallowRef` cho **list immutable lớn** / trang API bạn swap một assignment. `markRaw` cho **instance third-party** (Mapbox, Chart, router, class model có identity riêng).
- **Ràng buộc:** Proxy chặn được property mới và ghi theo index (Vue 2 không). Không wrap primitive, và **không** thấy mutation trong target `markRaw` / `shallow`. SSR + reactivity: `reactive` mức module **share giữa request** trừ khi tạo per app.
- **Failure mode:** `reactive()` sâu trên table 50k row; wrap WebSocket / map instance rồi gãy nội bộ; `ref(reactiveObj)` rối double-wrap; destructure (xem [5.1.9](#519-debug--fix-component-bugs)).
- **Đo:** Thời gian interact với grid lớn trước/sau `shallowRef`; heap snapshot cho reactive object leak (watcher không stop lúc unmount).

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

**Tradeoff**

| API | Track gì | Cost | Dùng điển hình |
|---|---|---|---|
| `ref` | Thay `.value` + sâu nếu object | Ổn | Primitive, object bị swap |
| `reactive` | Mutation sâu | Proxy cả cây | Form, object nhỏ |
| `shallowRef` | Chỉ thay `.value` | Rẻ | List lớn, trang immutable |
| `shallowReactive` | Key tầng một | Rẻ | Túi kiểu store chứa field đã reactive |
| `markRaw` | Không gì | Zero cost Vue | Third-party / nhạy identity |
| `readonly` / `shallowReadonly` | Đọc, chặn ghi | Thêm proxy | Contract provide/inject |

**Gotcha production**

- `reactive` **unwrap** nested ref. `reactive({ count: ref(0) }).count` là number trong template và JS — tới khi bạn nest sai trong `ref`.
- Migrate Vue 2: `Vue.set` mất; Proxy lo key mới. Array vẫn cần ý thức **index/length** với vài trick (`length = 0` được track; set index trực tiếp được track ở Vue 3).
- Nhét reactive object làm key `Set`/`Map` dùng **identity Proxy**, không phải raw object. Dùng `toRaw` khi interop map third-party.
- `const store = reactive({})` phạm vi module trong app Nuxt/SSR là **leak xuyên request**.

**Câu hỏi nối**

- `toRef` / `toRefs` / `toValue` / `unref`.
- Vì sao `watch(reactiveObj, cb)` cần `deep` hoặc getter.
- Effect scope: vì sao composable ngừng track lúc unmount (`onScopeDispose`).

---

#### 5.1.11. Lifecycle: Vue 2 vs Vue 3

**Họ thực sự hỏi gì**

Họ phác tên Vue 2 vs Vue 3, rồi nhảy sang **`setup` vs `onMounted` vs SSR** và **`onScopeDispose`**. `onMounted` **không chạy trên server**. Câu đó là interview.

**Cách senior trả lời**

- **Quyết định:** Tạo state và subscription **pure** trong `setup`. Chạm **DOM / `window` / widget third-party** trong `onMounted`. Dừng chúng trong `onBeforeUnmount` **hoặc** `onScopeDispose` nếu bạn viết composable có thể gọi ngoài component (Pinia action, helper share).
- **Ràng buộc:** SSR render chạy `setup` + `onServerPrefetch` (và async data của Nuxt). **Không** chạy `onMounted` / `onUpdated`. Client hydration chạy lại `setup` rồi `onBeforeMount` / `onMounted`. Code “chạy trong SPA” có thể no-op first paint trên Nuxt.
- **Failure mode:** `window.addEventListener` trong `setup` (chạy server → crash, hoặc chạy hai lần không cleanup). Composable `watch` nhưng không dispose khi dùng trong `computed` / `if (flag) useFoo()` có điều kiện — composable phải gọi **sync và không điều kiện** trong `setup`, không thì instance/scope sai.
- **Đo:** “Cái này chạy trong `nuxi build` SSR không?” Đụng `document` thì sai hook. Screenshot Playwright HTML đầu vs UI đã hydrate.

Map Composition Vue 3: `setup` phủ `beforeCreate`/`created` của Vue 2. `onBeforeUnmount` / `onUnmounted` thay `beforeDestroy` / `destroyed`. keep-alive thêm `onActivated` / `onDeactivated`. Bắt lỗi là `onErrorCaptured` (parent), không phải lifecycle của thằng throw.

**Tradeoff**

- `onServerPrefetch` vs fetch `onMounted` phía client: prefetch cho **HTML đủ**; fetch lúc mount cho widget **client-only**. Làm cả hai không có key là fetch đôi (xem [5.1.12](#5112-created-vs-mounted-khi-nào-call-api)).
- `onScopeDispose` vs `onUnmounted`: scope dispose fire khi **effect scope** kết thúc (unmount component, `store.$dispose`, `scope.stop()` tay). Dùng trong composable để chúng chạy được cả trong store.

**Gotcha production**

- `onMounted` trong child `v-if`: chạy khi child được tạo, không phải khi parent mount. Teleport không đổi điều đó — logical parent vẫn sở hữu instance.
- `onUpdated` để log: chạy rất nhiều; ưu tiên `watch` với source cụ thể.
- `setup` async hoãn mount tới khi promise resolve và **cần `<Suspense>`** — dễ quên trong SPA, rồi component không bao giờ hiện.

**Câu hỏi nối**

- Thứ tự: parent setup → child setup → child mount → parent mount (SPA). SSR không có mount.
- `getCurrentInstance()` trong lifecycle — vì sao gần như không nên.
- keep-alive: hook nào fire khi đổi tab ([5.2.9](#529-keep-alive)).

---

#### 5.1.12. created vs mounted: Khi Nào Call API?

**Họ thực sự hỏi gì**

Vue 2: `created` vs `mounted`. Vue 3: **top-level `await` trong `setup` + Suspense** vs **`onMounted`**. Họ muốn **race** và **abort lúc unmount**, cộng SSR: mounted không chạy trên server nên **bạn sẽ không có data trong HTML**.

**Cách senior trả lời**

- **Quyết định:** Data cần cho **first paint / SEO / SSR** → fetch trong `setup` (hoặc Nuxt `useAsyncData` / `useFetch`). Data hoặc API cần **DOM hoặc `window`** (feature-detect, chart, WebSocket tới endpoint chỉ user, không muốn trong HTML) → `onMounted`. Không bao giờ “gọi cả hai cho chắc.”
- **Ràng buộc:** Top-level `await` trong `<script setup>` biến component thành async; parent **phải** bọc `<Suspense>` (hoặc Nuxt phải lo). Không có thì lỗ trống hoặc warning. App SPA-only thường bỏ Suspense và fetch trong `onMounted`, chấp nhận spinner.
- **Failure mode:** Race: `userId` đổi nhanh hơn network; response chậm hơn thắng. Unmount: `setState` trên component đã unmount, hoặc interceptor leak. Fetch SPA trong `onMounted` + Nuxt SSR = **flash client-only**, không payload.
- **Đo:** Request trùng trên network panel lúc first load (SSR + client); request abort khi navigate nhanh; time-to-data vs TTFB.

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

Vue 3.4+ bạn cũng có thể `watch(id, ..., { immediate: true })` với `onCleanup(abort)` (xem [5.1.7](#517-computed-vs-watch)). Trong Nuxt, ưu tiên `useAsyncData` có key để payload **dedupe** replay phía client.

**Tradeoff**

| Chỗ fetch | HTML có data | DOM sẵn | Xử lý race |
|---|---|---|---|
| `setup` + await + Suspense | Có (kèm SSR) | Không | Vẫn phải cancel nếu param đổi |
| `onMounted` | Không | Có | “Client only” tự nhiên; SEO kém hơn |
| Nuxt `useAsyncData` | Có | Không | Key + abort + payload |

**Gotcha production**

- `created` trong Options API **có** chạy trên server; `mounted` thì không. Port component Vue 2 từng fetch trong `mounted` sang Nuxt im lặng mất data SSR.
- Top-level await không handle lỗi: 500 trong setup **giết cả Suspense boundary**, không chỉ một field.
- Fetch trong `setup` không cache key: parent tạo lại khi reuse route → GET lặp. Đó là lý do Nuxt/query library tồn tại.

**Câu hỏi nối**

- Cancel in-flight khi keep-alive deactivate (abort vs để xong rồi ignore).
- Tương tác với navigation guard cũng fetch user.
- `callOnce` / payload Nuxt vs cache tự viết.

---

### 5.2. Advanced Features

Các topic này xuất hiện khi interviewer chuyển từ “biết Vue” sang “đã ship UI lộn xộn”: overlay, cây async, plugin không leak trên SSR, và cổng router không phải security giả.

#### 5.2.1. Teleport

**Họ thực sự hỏi gì**

Modal/toast là đề bài. Senior được kỳ vọng nói **focus**, **target SSR có tồn tại**, và **stacking** — không phải cú pháp `to="#id"`.

**Cách senior trả lời**

- **Quyết định:** Teleport overlay (modal, dialog, toast, popover) tới **host ổn định** (`body` hoặc `#overlays` riêng) để `overflow: hidden` / `transform` trên ancestor không clip hay tạo stacking context. **State giữ ở logical component** (chỗ nút open sống) để permission và teardown đúng.
- **Ràng buộc:** Trên SSR, `document.querySelector` của target phải khớp cái client hydrate. Target **phải có trong HTML server**. Teleport tới `#modal` chỉ render trong `onMounted` sẽ lệch.
- **Failure mode:** Hai modal, không focus trap, Tab đi vòng page phía sau; hoặc `Teleport` + `position: fixed` trong parent `transform` **mà không** teleport — “fix” bằng teleport `body` rồi đánh nhau `z-index` số ngày càng lớn.
- **Đo:** Pass chỉ bàn phím (focus vào, vòng Tab, Escape, trả focus về opener). axe trên dialog. Stacking visual khi toast + modal + select dropdown mở cùng lúc.

**Tradeoff**

- `to="body"`: đơn giản, stacking global, CSS reset không được giả định `#app` là root overlay.
- Overlay root riêng: layer đoán được (toast > modal > popover), thêm contract DOM.
- `disabled` trên Teleport: hữu ích lúc test hoặc muốn modal in-flow trên mobile.

**Gotcha production**

- a11y: `role="dialog"`, `aria-modal`, focus ban đầu, **trả focus** lúc close. Teleport chuyển DOM, không chuyển Vue parent — `aria-controls` / labelled-by id vẫn chạy nếu chúng nằm trong cây đã teleport.
- SSR: Vue 3 teleport được trên server **nếu target nằm cùng render**. Target client rỗng → mất content hoặc warning.
- Thứ tự: nhiều teleport cùng target append theo **thứ tự mount**, không phải z-index. Toast muộn có thể nằm dưới modal sớm hơn trong DOM.
- `<Transition>` bọc `<Teleport>` vs bên trong: bọc **content**, không bọc Teleport, không thì leave hook không chạy.

**Câu hỏi nối**

- Teleport vs global modal store (thường muốn cả hai: store cho “modal nào,” Teleport cho DOM).
- Select/dropdown trong modal cũng teleport — chiến tranh stacking context.
- Pattern defer / disabled Vue 3.5+.

---

#### 5.2.2. Suspense

**Họ thực sự hỏi gì**

Họ biết fallback slot. Họ muốn **caveat experimental**, **lỗi**, và **Suspense lồng**. Team Nuxt thì câu đúng có thể là “chúng tôi hiếm khi tự dùng Vue Suspense.”

**Cách senior trả lời**

- **Quyết định:** Dùng Vue `<Suspense>` khi có **`setup` async / async component** cần chặn một cây. Dùng **`onErrorCaptured`** (và error component riêng) vì Suspense **không** thay error boundary. Ưu tiên **pending/error của Nuxt `useAsyncData`** cho data cấp route — đó là bản productionized của ý này.
- **Ràng buộc:** Component Suspense của Vue vẫn **experimental**; API có thể đổi. Nested Suspense: boundary trong lo fallback trong; throw thoát ra vẫn bubble. Không có API chính thức “reset boundary này” — remount bằng `key` hoặc navigate đi.
- **Failure mode:** Một Suspense top-level bọc cả app → một widget fail làm trắng page. Async setup không có boundary khớp → component không bao giờ render. Lỗi trong fallback vs default slot: dễ mất error gốc.
- **Đo:** Time-to-fallback vs time-to-content; error-rate async component; 500 ở widget có hạ route không.

**Tradeoff**

- Suspense: loading khai báo cho async setup; thô, experimental.
- `pending` ref từng component: dài dòng, tường minh, dễ test.
- Nuxt/query: key, cache, payload SSR, retry — thường là default tốt hơn.

**Gotcha production**

- Nested Suspense có thể **giấu** fallback parent (inner resolve, outer vẫn pending vì async child khác). Interviewer thích điểm này.
- SSR: server và client phải resolve cùng cây async không thì hydrate vào mismatch.
- `onErrorCaptured` phải `return false` nếu handle xong; không thì tiếp tục propagate.

**Câu hỏi nối**

- Quan hệ với loading/error slot của `defineAsyncComponent` (sống chung được; đừng spinner đôi).
- Nuxt 3 dùng Suspense nội bộ cho page thế nào.
- Timeout / pending delay để response nhanh không nháy skeleton.

---

#### 5.2.3. Custom Directives

**Họ thực sự hỏi gì**

Họ kỳ vọng bạn **ưu tiên composable**. Directive cho hành vi **chỉ DOM** kèm **cleanup**. `v-focus` là junior; cleanup `v-click-outside` và `getSSRProps` trên SSR là senior.

**Cách senior trả lời**

- **Quyết định:** Cần Vue state, lifecycle, hoặc testability → composable + template ref. Nếu là **annotation DOM thuần** (observe visibility, gắn class, đo) và nên attach như HTML → directive. Luôn unbind trong `unmounted` (và `beforeUnmount` nếu el đã mất).
- **Ràng buộc:** Directive không có typed instance như component; dễ viết listener leak. SSR: `created`/`mounted` không chạy trên server; dùng `getSSRProps` nếu directive phải emit HTML attr cho first paint.
- **Failure mode:** `document.addEventListener` trong `mounted` không `removeEventListener`; click-outside fire cùng click vừa mở menu; directive gọi `binding.instance` rồi gãy dưới `<script setup>`.
- **Đo:** Số listener trong DevTools sau open/close 50 lần; HTML SSR chứa attribute kỳ vọng.

**Tradeoff**

- Composable `useClickOutside(el, cb)`: test được, thân thiện TS, cleanup qua `onScopeDispose`.
- Directive `v-click-outside`: template đẹp hơn cho consumer design-system không viết setup.
- Component `<ClickOutside>`: bọc slot, thêm DOM.

**Gotcha production**

- Hook directive Vue 3: `beforeMount`, `mounted`, `beforeUpdate`, `updated`, `beforeUnmount`, `unmounted`. Tên Vue 2 `bind`/`inserted` đã mất.
- `binding.value` đổi: xử trong `updated`, đừng register listener thứ hai.
- Directive trên component lắng nghe **root element** của component đó (fragment: cần cẩn `inheritAttrs`).

**Câu hỏi nối**

- Vì sao `v-memo` là compiler directive, không phải custom.
- IntersectionObserver dạng directive vs composable cho infinite scroll.
- Quyền dùng directive trong codebase cấm chúng (nhiều senior cấm trừ a11y/DOM).

---

#### 5.2.4. Plugins

**Họ thực sự hỏi gì**

`app.use` vs `provide`, và plugin có **SSR-safe** không. `app.config.globalProperties.$http` là câu Vue 2; senior nói **context per-app** và **không mutable module state share**.

**Cách senior trả lời**

- **Quyết định:** Plugin để **cài capability vào app instance**: `install(app, options)` register component, `provide` một client, hoặc thêm directive. Ưu tiên **`app.provide` + `inject`** (`InjectionKey` có type) hơn `globalProperties` cho thứ mới. `app.use` một lần trong `main.ts` / Nuxt plugin, không từ SFC linh tinh.
- **Ràng buộc:** SSR tạo **một app mỗi request**. Plugin `let cache = {}` ở module scope **leak user A sang user B**. Plugin chỉ browser thuộc `.client` Nuxt plugin hoặc sau `import.meta.client`.
- **Failure mode:** Install plugin hai lần; plugin đọc `window` lúc import (gãy SSR build); provide mutable singleton store thay Pinia (test và SSR cùng thua).
- **Đo:** Hai SSR request song song user khác nhau — state plugin không được xuyên. Bundle: plugin client-only không được lọt server chunk.

**Tradeoff**

| Cơ chế | Discoverability | SSR | TS |
|---|---|---|---|
| `provide` / `inject` | Ngầm | Per-app nếu tạo trong `install` | `InjectionKey` |
| `globalProperties` | `this.$x` (Options) | Dễ dùng sai | Yếu |
| Pinia | `useX()` tường minh | Module Nuxt chính thức | Mạnh |
| Import module | Tường minh | Không được singleton-cache | Mạnh |

**Gotcha production**

- Plugin Vue 3 không được giả định `this` ở consumer chỉ Options.
- Nuxt: `defineNuxtPlugin` + `nuxtApp.vueApp.use` — thứ tự vs plugin khác quan trọng với i18n/auth.
- `app.config.errorHandler` trong plugin: compose với handler sẵn có, đừng thay im lặng.

**Câu hỏi nối**

- Bọc analytics SDK third-party (client-only, queue tới khi consent).
- Plugin vs composable: không cần `app` thì không phải plugin.
- Test: `createApp` + `use` + `provide` trong harness.

---

#### 5.2.5. Render Functions & JSX

**Họ thực sự hỏi gì**

Khi nào template **tốt hơn**, và khi nào xuống `h()` / JSX cho component **headless** hoặc **children dynamic**. “JSX nhanh hơn” là câu sai trong Vue.

**Cách senior trả lời**

- **Quyết định:** Template là default — bạn muốn **compiler** (hoist, patch flags, `v-model`, directive). Render function / JSX cho library **headless** (props vào, slot/default VNode ra), map tag chọn lúc runtime, hoặc khi children đã là data structure VNode.
- **Ràng buộc:** `h()` viết tay thường **mất patch flags** trừ khi bạn bắt chước output compiler. Vue JSX là Vue-specific: `v-model`, `v-show`, và `onUpdate:modelValue` là compiler transform, không phải HTML `onclick`.
- **Failure mode:** Rewrite design system sang JSX vì quen rồi regress perf update / gãy `inheritAttrs`. Hoặc dựng table bằng `innerHTML` vì `h()` thấy dài.
- **Đo:** Cùng list, template vs `h()`: thời gian update trên profiler. Bằng nhau thì giữ template cho team.

**Tradeoff**

- Template: tối ưu compiler, thân thiện designer, tooling SFC.
- `h()`: control tối đa, xấu cho UI thật, tuyệt cho wrapper mỏng (`h(resolvedTag, attrs, slots)`).
- JSX: dễ chịu hơn `h()` lồng, thêm toolchain, semantics Vue-specific phải dạy.

**Gotcha production**

- `slots.default?.()` trong render function: gọi slot sai chỗ phá tối ưu slot đã compile / `v-if` trong slot.
- Functional component Vue 3 chỉ là function trả VNode — không còn myth perf `functional: true` đời 2.x.
- Pattern headless: renderless component với scoped slot (`{ open, close }`) thường **rõ hơn** JSX.

**Câu hỏi nối**

- Implement `<Component :is="tag">` vs `h(tag)`.
- Tương đương compiler `v-memo` trong `h()` (phần lớn là không).
- Publish library: SFC vs render function cho consumer không dùng Vue compiler (giờ hiếm).

---

#### 5.2.6. Provide / Inject

**Họ thực sự hỏi gì**

**`InjectionKey`** có type, **mutability**, **vs Pinia**, và **testing**. Prop drilling là đề bài; topic thật là **ai sở hữu quyền ghi**.

**Cách senior trả lời**

- **Quyết định:** Provide/inject cho **contract một subtree** (form context, tabs, map instance, theme design-system). Pinia cho **client state toàn app** sống lâu hơn một subtree. Provide **readonly ref + method tường minh** (`setTheme`), không phải raw reactive object mutable, trừ khi child là writer được chỉ định.
- **Ràng buộc:** Inject **không** reactive nếu bạn provide giá trị không reactive. Provide trong `setup`; inject trong `setup`. String key đụng nhau xuyên library — dùng symbol `InjectionKey`. Không có DevTools “provide từ đâu?” rõ như props.
- **Failure mode:** Dùng provide như **global store** (provide từ `App.vue`, inject khắp nơi) rồi phát hiện leak SSR, test bất khả thi, update vòng. Mutate injected reactive object từ leaf xa owner.
- **Đo:** Số inject site cho một key; storybook/test mount được child với fake provide không; ghi nhầm (readonly warning).

```ts
export const FormKey: InjectionKey<{
  register: (id: string) => void
  disabled: Readonly<Ref<boolean>>
}> = Symbol('form')
```

**Tradeoff**

| | Provide/inject | Pinia | Props |
|---|---|---|---|
| Phạm vi | Cây Vue | App (hoặc SSR request) | Parent–child |
| Hidden dep | Có | Import tường minh | Không |
| SSR | Per app nếu tạo trong setup | Câu chuyện chính thức | Dễ |
| Test | Phải wrap | `setActivePinia` | Truyền props |

**Gotcha production**

- Default trong `inject(key, default)`: default là object thì **đừng** share một mutable default xuyên instance — dùng factory (`inject(key, () => ..., true)`).
- Provide `reactive(state)` rồi `readonly` ở biên là contract production.
- Nuxt: `useState` thường là “provide theo request” tốt hơn tự roll.

**Câu hỏi nối**

- Headless `Listbox` dùng provide nội bộ thế nào.
- Vì sao Pinia không phải “provide/inject thêm vài bước” (devtools, payload SSR, identity store, HMR).
- Optional inject cho component chạy standalone hoặc trong group.

---

#### 5.2.7. Router Navigation Guards (middleware SPA)

**Họ thực sự hỏi gì**

Cách bạn chặn route trong Vue SPA (không Nuxt). Họ muốn **hydrate auth một lần**, **`meta` roles**, câu **guard là UX không phải auth thật**, và Vue Router 4 **return vs `next()`**. Nuxt bọc thành `middleware/` — xem [Nuxt · Middleware](./nuxt.md#64-middleware).

**Cách senior trả lời**

- **Quyết định:** Một `beforeEach` global (1) **đợi một lần hydrate auth**, (2) đọc `to.meta.requiresAuth` / `roles`, (3) **return** location redirect hoặc `false`. `beforeEnter` per-route chỉ cho case thật sự độc. `onBeforeRouteLeave` in-component cho **việc chưa save**, không phải auth.
- **Ràng buộc:** Guard chạy trên client (và trên SSR nếu dùng Vue Router với SSR / Nuxt). Chúng **không** phải biên security — API vẫn phải authorize. Token `localStorage` không có trên server; cookie thì có.
- **Failure mode:** Hit `/me` mọi navigation (flash + rate limit). Kiểu Vue Router 3 `next()` **gọi hai lần** (vòng vô hạn, hoặc navigation bị hủy kèm warning). Coi `meta.roles` là security trong khi admin API để mở.
- **Đo:** Số HTTP auth mỗi session (nên ~1 + refresh). Time to first authenticated paint. Vòng redirect trong log (`/login` → guard → `/login`).

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

Vue Router 4: **return** route location, `false`, hoặc không gì. Đừng mix `next()` với return. `afterEach` không cancel được — dùng cho title, analytics (một lần, không trên SSR nếu sẽ đếm đôi).

**Tradeoff**

- Guard global: nhất quán, dễ audit, có thể thành god function — tách helper, không năm cái global.
- `meta` trên route record: data-driven, chạy với nested route (check `to.matched`).
- Auth cấp component: quá muộn, flash UI được bảo vệ.

**Gotcha production**

- Nested route: child có `requiresAuth` dưới layout không có — walk `to.matched`.
- Hydrate trong guard **và** trong `App.vue` không lock → `/me` đôi.
- `next({ ...to, replace: true })` loop; return `{ path, query }` cùng location cũng thế — so `to.fullPath`.
- Guard không phải middleware nghĩa Node: không có raw request trừ khi bạn ở Nuxt/SSR.

**Câu hỏi nối**

- `onBeforeRouteUpdate` vs remount `:key="route.params.id"`.
- Feature-flag một route mà không ship chunk (vẫn không phải security).
- Map model này sang Nuxt route middleware và Nitro `server/middleware`.

---

#### 5.2.8. Slot và scoped slot

**Họ thực sự hỏi gì**

Cách bạn thiết kế **table / listbox / form field** để consumer sở hữu UI ô. Họ muốn **scoped slot vs render prop**, **forward slot**, và hệ quả compile — không phải `slot="header"`.

**Cách senior trả lời**

- **Quyết định:** Default slot cho case phổ thông; **named slot** cho vùng layout; **scoped slot** khi parent cần **data child sở hữu** (row, `open`, `error`). Headless component là “scoped slot + provide.” Ưu tiên hơn rừng boolean prop (`showAvatar`, `avatarRounded`, …).
- **Ràng buộc:** Prop scoped slot là **contract của child**. Đổi shape là breaking API. Slot được compile; wrapper thừa có thể phá `v-if` trên slot và nội dung `fallback`.
- **Failure mode:** Đẩy object row khổng lồ qua scoped slot rồi mutate; hoặc check `$slots.foo` sai để SSR và client bất đồng về slot có tồn tại (`$slots.foo` vs `$slots.foo()`).
- **Đo:** Consumer thay ô mà không fork được không? Bundle: `Table` khổng lồ 40 props vs table nhỏ + slot.

**Tradeoff**

- Props cho variant: đơn giản, design đóng.
- Slot: mở, khó theme nhất quán, dễ gãy a11y (consumer quên label).
- Gọi slot bằng render function vs `<slot :row="row">`: template giữ tối ưu compiler.

**Gotcha production**

- Vue 3: `v-slot` / `#` trên component; attribute `slot=` deprecated.
- Forward: `v-bind="$attrs"` **không** forward slot — dùng `<slot name="x" v-bind="..."/>` hoặc `v-for` trên `$slots`.
- `v-if` trên slot outlet: fallback slot rỗng vs không render — chọn một và test SSR.

**Câu hỏi nối**

- Scoped slot vs `provide` cho ô table lồng sâu.
- `defineSlots<T>()` cho API library có type.
- Vì sao design system vẫn offer variant **pre-styled không slot**.

---

#### 5.2.9. keep-alive

**Họ thực sự hỏi gì**

Wizard theo tab và route được cache. Họ muốn **cache identity**, **`onActivated`**, **memory**, và **data stale**.

**Cách senior trả lời**

- **Quyết định:** `keep-alive` khi teardown đắt (map, form nặng, tab panel) **và** user kỳ vọng state sống sót. Key instance cache theo **entity id** khi cùng component type tái dùng cho record khác. Fetch/refresh trong `onActivated` nếu data có thể stale; đừng giả định `onMounted` chạy lại.
- **Ràng buộc:** Cache là **Vue instance trong memory** (`include` / `exclude` / `max`). `max` là LRU. keep-alive lồng + router-view cần chiến lược `key` không thì cache nhầm page.
- **Failure mode:** Profile user A, navigate sang user B, vẫn thấy user A vì instance cache theo tên component. Hoặc WebSocket mở trong `onMounted` không bao giờ đóng vì unmount không chạy.
- **Đo:** Heap sau 50 record với `max` không set. Incident “nhầm customer.” Số listener.

**Tradeoff**

- Remount (`:key`): luôn tươi, mất local UI state, trả setup cost.
- keep-alive: back-navigation nhanh, rủi ro stale + leak.
- Store tường minh cho draft: sống ngay cả không keep-alive; thêm code.

**Gotcha production**

- Router: `<keep-alive><router-view v-slot="{ Component }"><component :is="Component" :key="route.fullPath"/></keep-alive>` — `fullPath` có thể quá mạnh (query string); `params.id` có thể đúng.
- `onDeactivated` phải pause timer, video, và poll; `onActivated` resume.
- `include` khớp **tên component** — `<script setup>` cần `defineOptions({ name: 'Foo' })` không thì không bao giờ cache.

**Câu hỏi nối**

- Tương tác với Suspense và async setup.
- Vì sao `max` làm mất form draft.
- vs Nuxt `keepalive` trong `definePageMeta`.

---

#### 5.2.10. Async component

**Họ thực sự hỏi gì**

Cách bạn tách widget nặng (chart, editor, admin panel) mà không lỗi trắng. Loading/error/timeout và **nó ngồi đâu so với code splitting cấp route**.

**Cách senior trả lời**

- **Quyết định:** Tách cấp route qua router/Nuxt pages là default. `defineAsyncComponent` cho đảo nặng **trong page** (editor trong modal). Set `timeout` / `errorComponent` trên production; `delay` để load nhanh không nháy spinner.
- **Ràng buộc:** Async component là một **component type**; keep-alive và DevTools dùng wrapper đó. Kết hợp Suspense, bạn có thể được **hai** UI loading nếu không cẩn.
- **Failure mode:** Import lib nặng ở top parent SFC “chỉ để lấy type” → chunk không tách. Hoặc không có error UI nên CDN giật một cái làm trắng widget dashboard mãi.
- **Đo:** Coverage JS thêm trên critical route (phải giảm); impression error-component.

**Tradeoff**

- Router lazy `() => import('./Page.vue')`: granularity tách tốt nhất cho app.
- Async component: mịn hơn, nhiều wrapper hơn.
- Prefix `Lazy` Nuxt / delayed hydration: xem [Nuxt · Hydration](./nuxt.md#68-hydration-clientonly-lazy-hydration).

**Gotcha production**

- Vite/Rollup: type-only import là `import type`.
- SSR: async component vẫn phải resolve trên server nếu HTML nên gồm chúng; không thì `ClientOnly`.
- `loader` throw: không `errorComponent` thì parent lỗi.

**Câu hỏi nối**

- Prefetch lúc hover vs đợi open.
- Share chunk giữa hai async component (`manualChunks`).
- vs islands / server component trong Nuxt.

---

#### 5.2.11. Hydration mismatch

**Họ thực sự hỏi gì**

“DOM không khớp.” Họ muốn **nguyên nhân**, **cách debug**, và **ClientOnly vs sửa HTML**. Đây là topic senior production, không phải thẻ trivia Vue.

**Cách senior trả lời**

- **Quyết định:** HTML first paint phải **deterministic** khớp first render phía client của cùng cây. Mọi thứ từ `Date.now()`, `Math.random()`, `window`, locale, auth chỉ có trên client, hoặc **HTML không hợp lệ** (`<div>` trong `<p>`, `<table>` lồng sai) sẽ lệch. Sửa nguồn; `ClientOnly` cho subtree **thật sự client-only** (map, chart), không để giấu bug.
- **Ràng buộc:** Vue hydrate tại chỗ. Mismatch vứt DOM server của subtree đó (Vue 3 warn lúc dev; prod bạn trả thêm client render và có thể flicker / listener event gãy).
- **Failure mode:** `v-if="isMobile"` với `isMobile` default false trên server và true trên client sau sniff user-agent trong `onMounted`. Hoặc format date theo **TZ server** vs TZ browser.
- **Đo:** Warning hydration trên staging với data giống prod; visual diff HTML SSR vs client; regress INP/LCP khi Vue re-render cả subtree.

Vue 3.4+ `data-allow-mismatch` là lối thoát **phẫu thuật** cho khác biệt text đã biết, không phải giấy phép bỏ qua bug cấu trúc.

**Tradeoff**

- Làm deterministic (cùng locale, cùng flag trong payload): tốt nhất.
- `ClientOnly` / `<client-only>`: zero hydration cho đảo đó; SEO/content subtree đó mất.
- Delayed / lazy hydration (Nuxt): HTML còn đó, interactivity sau — vẫn phải khớp.

**Gotcha production**

- HTML không hợp lệ là ticket “Vue hỏng” phổ biến nhất. Browser “sửa” HTML SSR; cây VNode của Vue thì không.
- Collision `id` từ `useId()` vs counter viết tay reset sai mỗi request (hoặc **không** reset — đụng xuyên user).
- Script third-party mutate DOM trước hydration (A/B, chat widget).
- `v-html` nội dung user khác sau sanitize phía client.

**Câu hỏi nối**

- Payload Nuxt ngăn mismatch “fetch lại, JSON khác” thế nào.
- Vì sao `data-allow-mismatch` là last resort, không default trên mọi text node.
- Chart: render image/SVG tĩnh trên server hoặc đừng SSR chúng.

---

[← Back to Overview](../../README.md)
