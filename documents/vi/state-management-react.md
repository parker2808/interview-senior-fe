# State Management (React)

Bạn đã biết Vuex/Pinia. File này là phần **dáng store** của vòng senior React/Next: **tầng nào own data** (URL vs cookie/RSC vs Query vs Zustand), vì sao **list server không thuộc Redux**, và bug production interviewer tái sử dụng (hydration, Context thrash, store soi gương URL). Library là lựa chọn **scale theo team**, không phải bài test tính cách. Trả lời **quyết định → ràng buộc → failure mode → cách đo**. Model Hooks/re-render: [react.md](./react.md). Cache/RSC: [nextjs.md](./nextjs.md). Store thiên Vue: [state-management.md](./state-management.md).

---

## Table of Contents

1. [Các tầng state](#221-các-tầng-state)

2. [Redux Toolkit vs Zustand vs Jotai](#222-redux-toolkit-vs-zustand-vs-jotai)

3. [State flow](#223-state-flow)

4. [Local vs Context vs store vs server cache](#224-local-vs-context-vs-store-vs-server-cache)

5. [Server state: TanStack Query / SWR](#225-server-state-tanstack-query--swr)

6. [Pattern state trên Next.js](#226-pattern-state-trên-nextjs)

7. [Bản đồ Vuex / Pinia → React](#227-bản-đồ-vuex--pinia--react)

8. [Bẫy phỏng vấn](#228-bẫy-phỏng-vấn)

---

## 22. State Management (React)

### 22.1. Các tầng state

**Họ thực sự hỏi gì**

- “Cái này sống ở đâu — Redux, Context, hay Query?”
- “Nghĩ về state trong Next App Router thế nào?”
- “URL có phải một store không?”

**Cách senior trả lời**

**Quyết định.** Tách theo **source of truth và vòng đời**, không theo “global vs local” như phạm trù đạo đức. Đặt state vào tầng **hẹp nhất** vẫn share đúng. Failure mode của Vue senior là **dump Pinia** mọi thứ vì Pinia dễ chịu. React/Next trừng phạt: re-render, hydration, list stale, URL SEO không khớp store.

| Tầng | Source of truth | Vòng đời | Ví dụ | Analog Vue / Nuxt |
|---|---|---|---|---|
| **Local UI** | `useState` / `useReducer` | Mount này | Modal mở, hover, draft sát caret | `ref` component |
| **URL** | path / `searchParams` | Share được, back-button, reload | Filter, tab, pagination, id đang chọn | `route.query` |
| **Cookie / session** | cookie httpOnly + server session | Vòng đời auth | Ai đang login, CSRF, tenant | Nuxt `useCookie` / `useState` *chỉ khi* bạn hiểu SSR |
| **RSC / server render** | Server Component, cache `fetch` | Request + Next data cache | Data trang ban đầu, DTO serialize xuống children | Nuxt `useAsyncData` trên server |
| **Server cache (client)** | TanStack Query / SWR | Session app, theo key, stale-while-revalidate | **List, detail, mutation** | “async data cache,” không phải Pinia |
| **Context** | Provider value | Subtree | Theme, locale, `QueryClient`, **id** user ít churn | `provide` / `inject` |
| **Client store** | Zustand / RTK / Jotai | Graph **client** cross-route | Cart (guest), editor nhiều bước, selection UI phức tạp | Pinia / Vuex |

**Thứ tự ưu tiên khi phỏng vấn (Next):** URL và **cookie/session** thắng client store cho mọi thứ phải sống sót reload, share được, hoặc được tin. **Query/RSC** thắng Redux cho list server. Zustand/RTK thắng Context cho state client **tần suất cao**.

**Ràng buộc.** Một sự thật, một owner. Filter trên URL **hoặc** trong Zustand, không cả hai (trừ khi Zustand là view suy diễn bạn vứt đi). User auth trong **session** **nếu không** bạn sẽ lệch hydrate và copy token XSS vào `localStorage`.

**Failure mode.** “Hết vào Redux vì app Vuex hết vào Vuex.” Users list trong slice, filter trong slice, `user` trong slice, flag modal trong slice. Next: hydrate slice đó từ `localStorage` trước khi cookie session được biết.

**Cách đo.** Với một màn hình, điền trong 30s: *URL own ___. Query key là ___. Server session là ___. Client store là ___ (hoặc trống).* Nếu hai tầng nhận cùng field, bạn đã có bug.

**Tradeoff**

Nhiều tầng trông “phức tạp” trong câu junior. Diagram của senior **nhỏ hơn**: hầu hết màn hình là URL + Query + vài `useState`. Store xuất hiện khi workflow client thực sự là graph.

**Gotcha production**

- Restore filter từ Zustand lúc load **sau** khi URL đã có chúng → flicker và đánh nhau với back button.
- RSC đã fetch list **và** Query fetch lại với shape khác — chọn handoff (`initialData` + cùng key) hoặc đừng dùng Query trên page đó.

**Câu hỏi nối**

- Họ sẽ chọn một feature (bảng product, cart, auth, theme) và bắt bạn đặt chỗ. Practice cả bốn.
- Riêng Next: §22.6.

---

### 22.2. Redux Toolkit vs Zustand vs Jotai

**Họ thực sự hỏi gì**

- “Store nào cho team 20 người?”
- “Redux đã chết chưa?”
- “Atom vs slice?”

**Cách senior trả lời**

**Quyết định.** Đây là lựa chọn **scale team / hình bài toán**, không phải Twitter.

| | **Redux Toolkit** | **Zustand** | **Jotai** |
|---|---|---|---|
| Shape | Một store, slices, convention | Một hoặc vài store, hook API | Nhiều atom, compose |
| Analog Vue | Vuex (kỷ luật, DevTools) | Pinia | “nhiều ref nhỏ” |
| Team 15–40 | **Default** nếu cần một cách làm, reviewer, time-travel, middleware | Ổn nếu bạn **viết convention** (selector, folder) | Ổn nếu domain là **graph**; loạn nếu ai cũng invent atom |
| Solo / product nhỏ | Nặng | **Default** | Nếu derived state là sản phẩm |
| Async / list | RTK Query (nếu đã ở trong RTK) | **Đừng** — dùng TanStack Query | Đừng — Query |
| TS | Xuất sắc, nhiều type phải học | Nhẹ, infer từ `create` | Xuất sắc từng atom; graph sẽ khôn lỏi |
| Client island Next | Được; ceremony provider nhiều hơn | **Fit** | Fit; coi hydration SSR từng atom |

**Redux không chết.** Nó **tùy chọn**. Chọn RTK khi **tổ chức** cần đường đã lát (onboarding, DevTools, RTK Query đã có, middleware log event). Chọn Zustand khi muốn DX Pinia và bạn sẽ **enforce selector**. Chọn Jotai khi **một store thành god object** và update derived/atomic mới là model thật (editor, node graph, UI kiểu spreadsheet).

**Ràng buộc.** **Đừng nhét list server vào Redux/Zustand/Jotai mặc định.** Cache, stale time, dedupe, retry, identity (`queryKey`) là việc của Query. Slice `fetchUsers` + chứa `users[]` là câu trả lời 2018. Ngoại lệ: bạn đang dựng **offline sync engine** với replication log riêng — lúc đó bạn biết vì sao, và Query không đủ.

**Failure mode.** Đưa Jotai vì trendy, rồi tái tạo global store bằng soup `atom` không ownership. Đưa RTK cho SPA 6 component. Zustand **không selector** (`useStore()` cả store) → thrash hạng Context.

**Cách đo.** Thời gian engineer mới thêm một field + story DevTools. Profiler trên input đang gõ: ai re-render. Số list nhân đôi trong Query **và** một slice (phải là 0).

**Setup (mental model, không phải tutorial)**

- RTK: `configureStore` + `createSlice` + `useSelector`/`useDispatch` (hoặc hook RTK Query).
- Zustand: `create((set, get) => …)` + `useCart(s => s.items)` **hẹp**.
- Jotai: `atom` + `useAtom`; derived atom thay vì `get()` béo.

**Tradeoff**

RTK: nhiều file hơn, ít cãi trong code review. Zustand: ít boilerplate, entropy nếu không lint/review. Jotai: update fine-grained (gần Vue), khó *nhìn* data model trong một file.

**Gotcha production**

- RTK `useSelector` không equality / trả object mới mỗi lần → bão render.
- Zustand persist middleware + Next SSR → lệch hydration (§22.8).
- Thiếu Jotai Provider trong test/SSR → value sai im lặng.

**Câu hỏi nối**

- “RTK Query vs TanStack Query?” — đừng chạy cả hai. RTK Query nếu team all-in Redux; TanStack Query là default ecosystem và đi cặp Zustand.
- Context vs những cái này: §22.4.

---

### 22.3. State flow

**Họ thực sự hỏi gì**

- “Vẽ data flow Redux.”
- “Zustand khác Pinia chỗ nào?”
- “Side effect sống ở đâu?”

**Cách senior trả lời**

**Quyết định.** Cả ba là flow **client UI**. Side effect server (HTTP GET list) phải **ra khỏi diagram này** vào Query/RSC.

**Redux Toolkit (kiểu Flux)**

1. UI `dispatch(action)`.
2. Slice reducer update **immutable** (Immer trong RTK).
3. Async: thunk / listener middleware / **RTK Query**.
4. `useSelector` → re-render.

**Ưu:** replay, middleware, event tường minh. **Nhược:** ceremony; người ta nhét server cache vào slice.

**Zustand (kiểu Pinia)**

1. UI gọi `useCart(s => s.add)(id)`.
2. `set` thay một slice của store (Immer tùy chọn).
3. Subscriber có slice **đã select** đổi `Object.is` thì re-render.

**Ưu:** nhỏ, thân thiện Vue senior. **Nhược:** side effect trong action thành `fetch` không quản trừ khi bạn cấm.

**Jotai**

1. UI `setAtom`.
2. Derived atom tính lại.
3. Chỉ component subscribe atom đó re-render.

**Ưu:** granularity. **Nhược:** graph *chính là* architecture — graph không document không scale.

```ts
// Selector discipline is the production constraint (whole-store subscribe = thrash)
const qty = useCart((s) => s.items.length)
const add = useCart((s) => s.add)
```

**Ràng buộc.** Action nên là **update store thuần** hoặc gọi Query mutation. Mix `fetch` trong action Zustand tái tạo thunk không có cache.

**Failure mode.** Dispatch vào Redux từ Server Component (không được — không hook, sai runtime). Dùng Jotai atom làm network cache.

**Cách đo.** Redux DevTools action log vs “không biết sao cart trống.” Zustand: log trong `subscribe`. Nếu cần log mới ship được, có lẽ bạn cần RTK.

**Cầu nối Vue**

| Feature | RTK | Zustand | Jotai |
|---|---|---|---|
| Boilerplate | Trung bình | Thấp | Thấp–TB |
| Cấu trúc | Convention mạnh | Bạn định nghĩa | Atom graph |
| DevTools | Xuất sắc | Tốt | Tốt |
| Cầu nối Vue | Vuex | Pinia | nhiều ref |
| Side effects | thunks / RTK Query | action (giữ mỏng) + Query | write atom (giữ mỏng) + Query |

**Tradeoff**

Flux dễ **audit**. Kiểu Pinia dễ **viết**. Chọn theo failure mode bạn không chịu nổi (audit vs tốc độ).

**Gotcha production**

- Zustand `set({ items })` mutate `items` tại chỗ trước — React/Zustand có thể bail out; luôn reference mới cho field bạn select.
- RTK `createAsyncThunk` cho GET list — đó là bài toán dáng Query.

**Câu hỏi nối**

- Immutability vs mutation Vue: [react.md §20.1.4](./react.md#2014-props-vs-state).

---

### 22.4. Local vs Context vs store vs server cache

**Họ thực sự hỏi gì**

- “Khi nào Context đủ?”
- “Sao không một React Context cho cả app?”
- “‘State locality’ là gì?”

**Cách senior trả lời**

**Quyết định — rule mang vào phòng vấn**

| Nếu… | Thì |
|---|---|
| Một component / cây ngắn, ephemeral | `useState` / `useReducer` |
| Share được / back-button / bookmark | **URL** |
| Identity / session được tin | **Cookie + server** |
| Data remote có thể stale | **TanStack Query / SWR** (hoặc RSC cho document) |
| DI ít churn (theme, locale, flag, query client) | **Context** (tách provider) |
| Workflow **client** tần suất cao hoặc phức tạp | **Zustand / RTK / Jotai** kèm selector |

**Ràng buộc.** Context **broadcast** tới mọi consumer khi `value` đổi — `memo` không skip ([react.md §20.2.1](./react.md#2021-context-vs-provide--inject)). Store có selector là cách share state client **đổi thường xuyên**. “State locality” nghĩa là **đẩy state xuống** đến khi sibling cần; đừng lift lên Redux cho tiện.

**Failure mode.** Keystroke trong Context. Theme + cart + user một Provider. Copy kết quả Query vào Context “để khỏi import Query.” Store soi gương `searchParams`.

**Cách đo.** Profiler lúc gõ. Nếu app shell highlight, tầng sai.

**Dùng local state cho:** một cây, hover/open, draft uncontrolled đến lúc submit.

**Dùng Context cho:** value share ít đổi; **inject** service (QueryClient, i18n). Tách **state** vs **dispatch** nếu value nếu không sẽ là object mới mỗi render.

**Dùng client store cho:** UI cross-route **không** đáng URL và **không** phải data server (guest cart, selection design-tool, wizard không được lên URL vì size/privacy).

**Dùng server cache cho:** list, detail, mutation + invalidate.

**Tradeoff**

URL cho filter plumbing hơi nhiều hơn Zustand và thắng share/reload/analytics. Context zero deps và thành footgun theo tần suất. Store nói rõ client-only — nguy hiểm trên Next nếu persist mù.

**Gotcha production**

- `value={{ user, setUser }}` object mới mỗi render.
- Context `user` khổng lồ update khi form profile gõ (session vs **draft** phải tách — §22.8).

**Câu hỏi nối**

- Họ sẽ bắt refactor cart dáng Context sang Zustand và giải thích **cái gì không chuyển** (catalog item vẫn Query).

---

### 22.5. Server state: TanStack Query / SWR

**Họ thực sự hỏi gì**

- “Sao không `useEffect` + `useState`?”
- “Sao không Redux cho users list?”
- “Invalidate sau POST thế nào?”

**Cách senior trả lời**

**Quyết định.** Server state là **async, stale, keyed, shared**. Query/SWR đã implement loading/error, **race**, dedupe, retry, focus refetch, identity `queryKey`, mutation → `invalidateQueries`. Fetch `useEffect` tái tạo bản tệ hơn ([react.md §20.1.7](./react.md#2017-effects-useeffect-vs-watch--lifecycle-vue)). **List Redux** tái tạo bản tệ hơn không stale-while-revalidate.

**Ràng buộc.** **queryKey** là identity cache (`['users', { page, q }]`) — giống key string Nuxt, nhưng bạn sẽ làm hỏng object identity trong key. Mutation phải khai **chúng invalidate gì** (hoặc update cache). Trên Next, cặp `revalidateTag` khi cây **RSC** cũng hiện data đó.

**Failure mode.** `queryKey: ['users']` cho mọi filter. Nhét `data` vào Zustand trong `onSuccess` “cho tiện.” Fetch cả RSC lẫn Query với key/shape **khác** và không có contract `initialData`. Tắt refetch đến mức UI không bao giờ hồi.

**Cách đo.** Query Devtools: hit vs miss, số in-flight, ai subscribe. Network: hai component, một GET (dedupe) vs hai.

```ts
// Invalidation is the production contract — not "setUsers" in a store
const qc = useQueryClient()
useMutation({
  mutationFn: createUser,
  onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
})
```

**Đừng nhét list API vào Redux/Zustand mặc định.** Chỉ lý do mạnh: replication offline-first, CRDT cộng tác, hoặc *bạn* là cache (bạn không phải).

**Cầu nối Vue / Nuxt**

| Nhu cầu | Vue / Nuxt | React |
|---|---|---|
| Async data có cache | `useAsyncData` / `useFetch` | TanStack Query / SWR |
| Invalidate sau ghi | `refreshNuxtData` | `invalidateQueries` + có thể `revalidateTag` |
| Cache theo key | key string | `queryKey` array |
| SSR fetch dedupe | Nuxt payload | cache fetch RSC **hoặc** hydrate Query (`dehydrate`/`HydrationBoundary`) |

**Tradeoff**

Query là cache **client**: sau full reload, RSC có thể nhanh hơn cho first paint. Pattern: **RSC cho document**, Query cho **tương tác client** trên data đó (pagination không được drop shell, polling, hàng optimistic).

SWR vs Query: cùng tầng. Query thắng feature/default team; SWR nhỏ hơn. Đừng chạy cả hai.

**Gotcha production**

- Hydrate Query với data server gồm hàng **riêng user** vào cache key **share**.
- `staleTime: Infinity` thay cho hiểu invalidation.
- Error/retry vs Error Boundary — lỗi Query **không** throw lúc render trừ khi bạn opt-in suspense.

**Câu hỏi nối**

- Optimistic update vs `useOptimistic` + Server Action ([nextjs.md §21.9](./nextjs.md#219-server-actions--mutation)).
- Abort / race: Query cancel; effect của bạn phải `AbortController`.

---

### 22.6. Pattern state trên Next.js

**Họ thực sự hỏi gì**

- “App Router đổi state management thế nào?”
- “Current user lưu ở đâu?”
- “Zustand persist + Next?”

**Cách senior trả lời**

**Quyết định.** App Router **dời source of truth mặc định sang server**:

1. **Server Component** fetch và render **server data** — không `useState`, không Zustand bên trong chúng.
2. **Client island** (`'use client'`) giữ state tương tác — island nhỏ nhất cần hook ([nextjs.md §21.5](./nextjs.md#215-nền-tảng-app-router)).
3. **URL** (`searchParams`) cho UI share được.
4. **Cookie / server session** cho **auth** — không phải store `user` client khổng lồ. Cookie là thứ middleware và RSC thấy được; Zustand không được tin làm sự thật login.
5. Sau mutation: **`revalidatePath` / `revalidateTag`** (cây server) và/hoặc invalidate Query (client cache). Thường **cả hai** nếu cả hai cây hiện data.
6. Truyền **DTO** qua biên RSC, không class instance hay secret.

**Ràng buộc.** `cookies()` trong layout dynamize render ([nextjs.md §21.10](./nextjs.md#2110-cheat-sheet-render--cache)). Client store **phải hydrate nhất quán** với HTML server. `localStorage` **không** có lúc SSR — persist middleware đọc nó trong `create` sẽ lệch.

**Failure mode.** `useUserStore.getState().setUser(localStorage)` trong thân module. Root `'use client'` + Redux Provider bọc **RSC** children sai cách (Provider là client; **compose children** từ server). Session trong Query **không** `staleTime` refetch flash chrome logged-out. Nhân đôi cookie vào Zustand rồi UI dùng **chỉ** Zustand trong khi RSC dùng cookie — hai sự thật.

**Cách đo.** View-source trang đã auth: PII trong HTML có chủ đích không? Login/logout: HTML RSC có đổi, hay chỉ client store? Hydration warning lúc load đầu với persist.

**Song song Nuxt**

| Nuxt | Next |
|---|---|
| `useState` (SSR-shared) | thường **đừng** clone; cookie + RSC + island client nhỏ |
| `useAsyncData` | RSC `fetch` + Query tùy chọn |
| `refreshNuxtData` | `revalidatePath` / `revalidateTag` |
| Pinia + plugin SSR | persist/hydrate **cẩn thận** hoặc bỏ; ưu tiên sự thật server |
| `useCookie` | `cookies()` phía server; client `document.cookie` chỉ cho non-httpOnly |

**Tradeoff**

Server session an toàn và thù cache (dynamic). Blob user phía client thân thiện cache và **sai**. PPR/partial: shell tĩnh + session trong **lỗ**.

**Gotcha production**

- Hydration: `useEffect` load persistor, `useState` default khớp server (`undefined` / empty), rồi fill — hoặc `skipHydration` + cổng `hasHydrated` trước khi sơn chrome đã auth.
- Theme: ưu tiên **cookie** (server class được `html`) hơn `localStorage` để tránh flash/mismatch.
- Đừng `JSON.stringify` session vào prop Client Component nếu có token.

**Câu hỏi nối**

- Cổng cookie middleware vs RSC `redirect` vs client `Navigate` — [nextjs.md §21.8](./nextjs.md#218-middleware), [react.md §20.2.9](./react.md#2029-route-guards--middleware-spa).
- Failure production: [nextjs.md §21.12](./nextjs.md#2112-lỗi-production-thường-gặp).

---

### 22.7. Bản đồ Vuex / Pinia → React

**Họ thực sự hỏi gì**

- “Tôi biết Pinia — nhìn đâu bên React?”
- “Mutation vs action đi đâu?”

**Cách senior trả lời**

**Quyết định.** Map **thói quen**, rồi **bỏ** phần Query/RSC đã thay. Vuex mutation-vs-action là RTK reducer-vs-thunk. Pinia “chỉ gọi action” là Zustand. Không cái nào nên own **list server** như nhiều app Vuex đã làm.

| Vue | React / Next |
|---|---|
| `ref` component | `useState` / `useReducer` |
| `computed` | derive trong render / `useMemo` / Compiler |
| `provide` / `inject` | Context (broadcast — tách nó) |
| Vuex module | Redux slice |
| Vuex mutation (sync) | RTK reducer |
| Vuex action (async) | thunk / listener / **Query mutation** |
| Pinia `defineStore` | Zustand `create` |
| Pinia action async | action Zustand **hoặc** Query |
| Nuxt `useAsyncData` | RSC fetch + TanStack Query |
| Route query | `useSearchParams` / `searchParams` |
| `useCookie` | `cookies()` server + session httpOnly |

Ghi chú store Vue sâu: [State Management](./state-management.md). Hooks cốt lõi: [React](./react.md).

**Ràng buộc.** Map **không** 1:1 cho data fetching. Pinia store `async fetchOrders()` nên thành **`useOrders()` bọc `useQuery`**, không phải `useOrderStore`.

**Failure mode.** Tái tạo Vuex module 1:1 trong RTK kể cả `state.loading` / `state.error` từng list — đó là `isPending` / `error` của Query.

**Cách đo.** Sau migrate, grep `fetch(` trong file store — phải hiếm.

**Tradeoff**

Port store 1:1 ship nhanh và giữ bug cũ (list trong global state, persist SSR). Port theo tầng tốn một sprint và khớp cách Next thực sự chạy.

**Gotcha production**

- Style mutation Pinia `$patch` trong Zustand không reference mới.
- Plugin persist Vuex → Zustand persist → hydration Next (đừng port plugin đến khi có story hydration).

**Câu hỏi nối**

- Bắt họ migrate **một** Pinia store live: tách URL / Query / flag UI còn lại.

---

### 22.8. Bẫy phỏng vấn

**Họ thực sự hỏi gì**

- “Bạn thấy sai lầm nào trong React state?”
- “Hydration — bạn phá gì?”
- Họ thả snippet: Context mỗi phím gõ, users trong Redux, fetch `useEffect`, filter ở hai chỗ.

**Cách senior trả lời**

**Quyết định.** Bẫy là **vi phạm tầng**. Gọi tên tầng, gọi failure, gọi cách đo.

**Ràng buộc.** Team train Vue tái tạo trọng lực Pinia/Vuex. Junior train Next tái tạo “mọi thứ RSC” rồi giấu client state trong module singleton.

**Failure mode / catalog** (mở rộng trong phòng từ snippet họ đưa):

1. **Hết vào Context** → broadcast re-render. Tách provider hoặc dùng store có **selector**. Đo: Profiler lúc gõ.

2. **Hết vào Redux/Zustand** → list server thuộc **Query/RSC**. Flag `loading` từng resource là Query. Đo: số cache nhân đôi.

3. **Fetch trong `useEffect` không abort** → race, Strict Mode bắn đôi. Ưu tiên Query. Nếu phải: `AbortController` ([react.md §20.1.7](./react.md#2017-effects-useeffect-vs-watch--lifecycle-vue)).

4. **Store soi gương URL** → hai nguồn; back button đánh store. URL thắng cho filter. Derive UI từ `searchParams`.

5. **Bug hydration Next** → `localStorage` / `Date` / `window` / persist middleware trong `create()` lúc SSR. HTML server ≠ first paint client. Fix: cùng default hai phía, rồi `useEffect` fill; cookie theme; `suppressHydrationWarning` chỉ trên node đồng hồ đã biết ([nextjs.md §21.12](./nextjs.md#2112-lỗi-production-thường-gặp)).

6. **Context `user` khổng lồ update mỗi phím gõ** → session (hiếm) vs **form draft** (local/RHF). Tách. Đo: shell re-render lúc input.

7. **Context thrash qua `value` không ổn định** — `value={{ theme, setTheme }}` identity mới mỗi lần parent render. Memoize hoặc tách context state/dispatch.

8. **Zustand `useStore()` không selector** → mọi field update re-render component này. Cùng hạng bug với Context.

9. **Auth trong `localStorage` + client store làm sự thật** → XSS, middleware không thấy, HTML RSC logged-out. Cookie/session thắng.

10. **Data RSC copy vào `let cache` mức module** → leak giữa user trên server sống lâu. Dùng cache framework có key, hoặc Query phía client.

11. **Optimistic UI không rollback** → Query `onMutate`/`onError` hoặc `useOptimistic` + lỗi server.

12. **Soup boolean prop / store flag cho UI** → composition ([react.md §20.2.6](./react.md#2026-children--tư-duy-slot)), không `modalOpen` trong Redux.

```tsx
// Hydration pitfall: persist reads localStorage during SSR vs client
const useCart = create(
  persist(() => ({ items: [] }), { name: 'cart' }),
)
// First client paint may already have items; server HTML was []
// Gate UI on hasHydrated, or don't persist until after mount
```

```tsx
// Context thrash
<UserContext.Provider value={{ user, setUser, draft, setDraft }}>
  {/* typing in draft re-renders every consumer of user too */}
</UserContext.Provider>
```

**Cách đo (cách nói về incident)**

- Profiler + why-did-you-render cho thrash.
- Overlay hydration Next / diff mismatch.
- Network: một GET list vs store *và* Query.
- Security: cookie trên dây, không token trong Redux DevTools.

**Tradeoff**

Một global store “đơn giản” ship feature và incident. Tầng trông như over-engineering đến bug hydration hay giá stale đầu tiên.

**Một câu Vue**

Pinia dạy **store nhỏ có chủ đích**. Sang React, thêm **server cache vs client UI**. Sang Next, ưu tiên **server + URL + cookie** trước global store nữa.

**Câu hỏi nối**

- Đặt chỗ: filter product, current user, cart, hàng đợi toast, article CMS, presence websocket — sáu tầng khác nhau.
- “Compiler / `memo` vs chọn store” — tầng sai đắt hơn thiếu `useCallback` ([react.md §20.2.8](./react.md#2028-checklist-performance-cho-senior)).

---

[← Back to Overview](../../README.md)
