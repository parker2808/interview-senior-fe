# State Management (React)

Client + server state cho React / Next.js — viết cho senior đã quen **Vuex / Pinia**, kèm cầu nối rõ.

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

**Senior-level Answer:**

Với React (đặc biệt Next), đừng nhét mọi thứ vào một global store. Tách theo **vòng đời và nguồn sự thật**:

| Tầng | Nằm ở đâu | Ví dụ | Gần với Vue |
|---|---|---|---|
| **Local UI** | `useState` / `useReducer` | Mở modal, draft input | `ref` local |
| **URL** | `searchParams` / path | Filter, tab, page | `route.query` |
| **Context** | Provider tree | Theme, locale, auth (ít đổi) | `provide` / `inject` |
| **Client store** | Zustand / Redux / Jotai | Cart, wizard nhiều bước | Pinia / Vuex |
| **Server cache** | TanStack Query / SWR | List/detail, mutation + invalidate | Tư duy cache `useAsyncData` |
| **Server / RSC** | Server Components, cookies | Data trang, session | Nuxt server `useFetch` |

**Quy tắc:** chọn tầng **hẹp nhất** vẫn share đúng. Global store không phải mặc định.

---

### 22.2. Redux Toolkit vs Zustand vs Jotai

#### **1. Setup**

- **Redux Toolkit (RTK):** `configureStore` + `createSlice` — có cấu trúc, nhiều file hơn.
- **Zustand:** `create((set, get) => …)` — một module store gọn.
- **Jotai:** `atom` + `useAtom` — ghép mảnh nhỏ.

#### **2. Đọc state**

- **RTK:** `useSelector` / `useDispatch` (hoặc hook RTK Query).
- **Zustand:** `useStore(s => s.x)` — select hẹp để tránh re-render thừa.
- **Jotai:** subscribe theo atom.

#### **3. Đổi data**

- **RTK:** reducer (Immer) + thunk / RTK Query cho async.
- **Zustand:** `set({ … })` hoặc updater.
- **Jotai:** `setAtom` / write atom.

#### **4. Mental model vs Vue**

| Vue | Gần nhất bên React |
|---|---|
| **Vuex** (mutation + action, flow chặt) | **Redux Toolkit** |
| **Pinia** (store đơn giản, DX tốt) | **Zustand** |
| Nhiều mảnh fine-grained | **Jotai** (atoms) |

#### **5. TypeScript**

Cả ba đều ổn với TS; Zustand/Jotai nhẹ hơn cho app nhỏ. RTK mạnh khi team lớn cần convention.

#### **Tóm tắt:**

- **RTK** — app lớn, nhiều người, cần kiến trúc + DevTools.
- **Zustand** — lựa chọn “giống Pinia” mặc định cho SPA / client island Next.
- **Jotai** — khi đồ thị atom/derived thắng một store béo.

---

### 22.3. State flow

#### **Redux Toolkit (giống Flux)**

1. Component → `dispatch(action)`
2. Slice reducer cập nhật state (sync, Immer)
3. Async: thunk / listener / RTK Query
4. Selector → component re-render

→ Ưu: rõ, dễ debug, convention team.  
→ Nhược: boilerplate hơn Zustand.

#### **Zustand (gần Pinia)**

```ts
import { create } from 'zustand'

type CartState = {
  items: string[]
  add: (id: string) => void
}

export const useCart = create<CartState>((set) => ({
  items: [],
  add: (id) => set((s) => ({ items: [...s.items, id] })),
}))

// Component
const items = useCart((s) => s.items)
const add = useCart((s) => s.add)
```

→ Ưu: API nhỏ, map tư duy Pinia dễ.  
→ Nhược: app lớn cần kỷ luật selector / ranh giới store.

#### **So sánh**

| Tiêu chí | Redux Toolkit | Zustand | Jotai |
|---|---|---|---|
| Boilerplate | Trung bình | Thấp | Thấp–TB |
| Cấu trúc | Convention mạnh | Tự định nghĩa | Atom graph |
| DevTools | Rất tốt | Tốt | Tốt |
| Cầu nối Vue | Vuex | Pinia | “nhiều ref nhỏ” |

---

### 22.4. Local vs Context vs store vs server cache

#### **Dùng local khi:**

- Một component / cây ngắn
- UI tạm (mở/đóng, hover)
- Draft form chưa submit

#### **Dùng Context khi:**

- Giá trị share ít đổi (theme, i18n, user session)
- Dependency injection (flag, service)

#### **Dùng client store khi:**

- State UI cross-route
- Update dày mà Context sẽ thrash
- Workflow client phức tạp (editor nhiều bước)

#### **Dùng server cache (Query/SWR) khi:**

- Data remote có thể stale
- Cần dedupe, retry, refetch
- Mutation + invalidate cache

→ **Rule phỏng vấn:**  
UI local → `useState`. Share ít → Context. Share nhiều / phức tạp → Zustand/RTK. Từ API → TanStack Query. Từ URL → `searchParams`.

---

### 22.5. Server state: TanStack Query / SWR

**Senior-level Answer:**

`useEffect` + `useState` để fetch tự tái tạo những gì Query đã giải: loading/error, race, cache key, invalidation.

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function Users() {
  const qc = useQueryClient()
  const { data, isPending, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then((r) => r.json()),
  })

  const mutation = useMutation({
    mutationFn: (body: unknown) =>
      fetch('/api/users', { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })

  // …
}
```

#### **Cầu nối Vue / Nuxt:**

| Nhu cầu | Vue / Nuxt | React |
|---|---|---|
| Async data có cache | `useAsyncData` / `useFetch` | TanStack Query / SWR |
| Invalidate sau ghi | `refreshNuxtData` / custom | `invalidateQueries` |
| Cache theo key | key string | `queryKey` array |

**Đừng nhét list API vào Redux/Zustand mặc định** — để Query, trừ khi có lý do mạnh (offline sync, …).

---

### 22.6. Pattern state trên Next.js

**Senior-level Answer:**

App Router đổi mặc định:

1. **Server Components** giữ/fetch **server data** — không `useState`.
2. **Client Components** (`'use client'`) giữ state tương tác.
3. Ưu tiên **URL state** cho UI shareable (`searchParams`).
4. Auth ưu tiên **cookie / server session** — không store client khổng lồ.
5. Sau mutation: **revalidatePath / revalidateTag** (server) và/hoặc invalidate Query (client).
6. Chỉ `'use client'` island nhỏ cần hooks — không cả trang.

#### **Song song Nuxt:**

| Nuxt | Next |
|---|---|
| `useState` (SSR-friendly share) | client store thận trọng + cookie / URL |
| `useAsyncData` | fetch RSC + Query phía client khi cần |
| `refreshNuxtData` | `revalidatePath` / `revalidateTag` |
| Pinia SSR plugin | hydrate cẩn thận; ưu tiên server là source of truth |

Xem thêm [Next.js](./nextjs.md).

---

### 22.7. Bản đồ Vuex / Pinia → React

| Vue | React / Next |
|---|---|
| `ref` component | `useState` / `useReducer` |
| `computed` | derive / `useMemo` |
| `provide` / `inject` | Context |
| Vuex module | Redux slice |
| Pinia `defineStore` | Zustand `create` |
| Pinia action async | action Zustand / thunk RTK / mutation Query |
| Nuxt `useAsyncData` | fetch RSC + TanStack Query |
| Route query | `useSearchParams` |

Chi tiết store Vue: [State Management](./state-management.md). Hooks cốt lõi: [React](./react.md).

---

### 22.8. Bẫy phỏng vấn

1. **Nhét hết vào Context** → re-render thừa; tách hoặc dùng store + selector.
2. **Nhét hết vào Redux** → data server thuộc Query/RSC.
3. **Fetch trong `useEffect` không cleanup** → race; ưu tiên Query.
4. **Store mirror URL** → chọn một source of truth (thường là URL cho filter).
5. **Hydration bug Next** → đừng init state client-only lệch SSR.
6. **Context `user` cập nhật mỗi keystroke** → tách session vs draft form.

#### **Một câu cho senior:**

Pinia dạy store nhỏ có chủ đích; sang React thêm trục **server cache vs client UI**, sang Next ưu tiên **server + URL** trước khi thêm global store.

---

[← Quay lại Tổng quan](../../README.md)
