# State Management (React)

Client + server state for React / Next.js — written for seniors who know **Vuex / Pinia**, with explicit bridges.

---

## Table of Contents

1. [Layers of state](#221-layers-of-state)

2. [Redux Toolkit vs Zustand vs Jotai](#222-redux-toolkit-vs-zustand-vs-jotai)

3. [State flow](#223-state-flow)

4. [Local vs Context vs store vs server cache](#224-local-vs-context-vs-store-vs-server-cache)

5. [Server state: TanStack Query / SWR](#225-server-state-tanstack-query--swr)

6. [Next.js state patterns](#226-nextjs-state-patterns)

7. [Vuex / Pinia → React map](#227-vuex--pinia--react-map)

8. [Interview pitfalls](#228-interview-pitfalls)

---

## 22. State Management (React)

### 22.1. Layers of state

**Senior-level Answer:**

In React (especially Next), don’t put everything in one global store. Separate by **lifetime and source of truth**:

| Layer | Lives where | Examples | Vue analogy |
|---|---|---|---|
| **Local UI** | Component `useState` / `useReducer` | Modal open, input draft | Local `ref` |
| **URL** | `searchParams` / path | Filters, tab, page | `route.query` |
| **Context** | Provider tree | Theme, locale, auth session (low churn) | `provide` / `inject` |
| **Client store** | Zustand / Redux / Jotai | Cart, wizard multi-step, complex UI graph | Pinia / Vuex |
| **Server cache** | TanStack Query / SWR | Lists, detail, mutations + invalidate | `useAsyncData` cache mindset |
| **Server / RSC** | Next Server Components, cookies | Initial page data, session | Nuxt server `useFetch` |

**Rule:** Prefer the **narrowest** layer that still shares correctly. Global store is not the default.

---

### 22.2. Redux Toolkit vs Zustand vs Jotai

#### **1. Setup**

- **Redux Toolkit (RTK):** `configureStore` + `createSlice` — structured, more files.
- **Zustand:** `create((set, get) => …)` — one small store module.
- **Jotai:** `atom` + `useAtom` — compose small pieces.

#### **2. Access state**

- **RTK:** `useSelector` / `useDispatch` (or RTK Query hooks).
- **Zustand:** `useStore(s => s.x)` — select narrowly to avoid re-renders.
- **Jotai:** subscribe per atom.

#### **3. Change data**

- **RTK:** reducers (Immer under the hood) + thunks / RTK Query for async.
- **Zustand:** `set({ … })` or `set(state => …)` — mutate-style via Immer optional.
- **Jotai:** `setAtom` / write atoms.

#### **4. Mental model vs Vue**

| Vue | Closest React default |
|---|---|
| **Vuex** (mutations + actions, strict flow) | **Redux Toolkit** |
| **Pinia** (simple stores, good DX) | **Zustand** |
| Fine-grained / many small pieces | **Jotai** (atoms) |

#### **5. TypeScript**

- All three are strong with TS today; Zustand/Jotai often feel lighter to type for small apps. RTK scales better for large teams + conventions.

#### **Summary:**

- **RTK** — large apps, many contributors, need predictable architecture + DevTools.
- **Zustand** — default “Pinia-like” choice for most SPA/Next client islands.
- **Jotai** — when derived/atomic graphs beat one fat store.

---

### 22.3. State flow

#### **Redux Toolkit (Flux-like)**

1. Component → `dispatch(action)`
2. Slice reducer updates state (sync, Immer)
3. Async: thunk / listener / RTK Query
4. Selectors → component re-render

→ Pros: clear, debuggable, team conventions.  
→ Cons: more boilerplate than Zustand.

#### **Zustand (Pinia-like)**

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

→ Pros: tiny API, easy migration from Pinia mental model.  
→ Cons: discipline required (selectors, store boundaries) as app grows.

#### **Comparison**

| Feature | Redux Toolkit | Zustand | Jotai |
|---|---|---|---|
| Boilerplate | Medium | Low | Low–medium |
| Structure | Strong conventions | You define | Atom graph |
| DevTools | Excellent | Good | Good |
| Vue bridge | Vuex | Pinia | “many small refs” |

---

### 22.4. Local vs Context vs store vs server cache

#### **Use local state for:**

- One component / short tree
- Ephemeral UI (open/close, hover)
- Uncontrolled drafts until submit

#### **Use Context for:**

- Rarely changing shared values (theme, i18n, auth user object)
- Dependency injection (feature flags, services)

#### **Use a client store for:**

- Cross-route client UI state
- High-frequency updates Context would thrash
- Complex client workflows (multi-step editor)

#### **Use server cache (Query/SWR) for:**

- Remote data that can be stale
- Deduped fetches, retries, focus refetch
- Mutations + cache invalidation

→ **Easy rule (interview-ready):**  
UI local → `useState`. Share rarely → Context. Share often / complex → Zustand/RTK. From API → TanStack Query. From URL → `searchParams`.

---

### 22.5. Server state: TanStack Query / SWR

**Senior-level Answer:**

Fetching with `useEffect` + `useState` recreates what Query already solves: loading/error, race conditions, cache keys, invalidation.

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

#### **Vue / Nuxt bridge:**

| Concern | Vue / Nuxt | React |
|---|---|---|
| Cached async data | `useAsyncData` / `useFetch` | TanStack Query / SWR |
| Invalidate after write | `refreshNuxtData` / custom | `invalidateQueries` |
| Keyed cache | key string | `queryKey` array |

**Don’t put API lists in Redux/Zustand by default** — put them in Query unless you have a strong reason (offline sync engine, etc.).

---

### 22.6. Next.js state patterns

**Senior-level Answer:**

Next App Router changes the default:

1. **Server Components** hold and fetch **server data** — no `useState` there.
2. **Client Components** (`'use client'`) hold interactive state.
3. Prefer **URL state** for shareable UI (`searchParams`).
4. Prefer **cookies / server session** for auth — not a giant client store.
5. After mutations: **revalidatePath / revalidateTag** (server) and/or Query invalidation (client).
6. Lift only the small client island that needs hooks — not the whole page.

#### **Nuxt parallel:**

| Nuxt | Next |
|---|---|
| `useState` (SSR-friendly shared) | careful client store + cookies / URL |
| `useAsyncData` | RSC fetch + optional Query on client |
| `refreshNuxtData` | `revalidatePath` / `revalidateTag` |
| Pinia plugin SSR | hydrate carefully; prefer server source of truth |

See also [Next.js](./nextjs.md).

---

### 22.7. Vuex / Pinia → React map

| Vue | React / Next |
|---|---|
| Component `ref` | `useState` / `useReducer` |
| `computed` | derive in render / `useMemo` |
| `provide` / `inject` | Context |
| Vuex module | Redux slice |
| Pinia `defineStore` | Zustand `create` |
| Pinia action async | Zustand action / RTK thunk / Query mutation |
| Nuxt `useAsyncData` | RSC fetch + TanStack Query |
| Route query state | `useSearchParams` |

Deep Vue store notes remain in [State Management](./state-management.md) (Vue). Core hooks live in [React](./react.md).

---

### 22.8. Interview pitfalls

1. **Everything in Context** → unnecessary re-renders; split or use a store with selectors.
2. **Everything in Redux** → server data belongs in Query/RSC.
3. **Fetch in `useEffect` without cleanup** → races; prefer Query.
4. **Store mirrors URL** → pick one source of truth (usually URL for filters).
5. **Hydration bugs in Next** → don’t init client-only state during SSR inconsistently.
6. **Giant “user” Context updated every keystroke** → separate session vs form draft.

#### **One-liner for seniors:**

Pinia taught you small intentional stores; in React, add an extra axis — **server cache vs client UI state** — and in Next, prefer **server + URL** before another global store.

---

[← Back to Overview](../../README-en.md)
