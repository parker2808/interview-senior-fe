# State Management (React)

You already know Vuex/Pinia. This file is the **store-shaped** part of a senior React/Next round: **which layer owns the data** (URL vs cookies/RSC vs Query vs Zustand), why **server lists do not belong in Redux**, and the production bugs interviewers reuse (hydration, Context thrash, store mirroring the URL). Libraries are a **team-scale** choice, not a personality test. Answer **decision → constraint → failure mode → measure**. Hooks/re-render model: [react.md](./react.md). Cache/RSC: [nextjs.md](./nextjs.md). Vue-first stores: [state-management.md](./state-management.md).

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

**What they actually ask**

- “Where should this live — Redux, Context, or Query?”
- “How do you think about state in Next App Router?”
- “Is the URL a store?”

**How a senior answers**

**Decision.** Split by **source of truth and lifetime**, not by “global vs local” as a moral category. Put state in the **narrowest** layer that still shares correctly. A Vue senior’s failure mode is a **Pinia dump** of everything because Pinia was pleasant. React/Next punishes that: re-renders, hydration, stale lists, SEO URLs that don’t match the store.

| Layer | Source of truth | Lifetime | Examples | Vue / Nuxt analogy |
|---|---|---|---|---|
| **Local UI** | `useState` / `useReducer` | This mount | Modal open, hover, input caret-adjacent draft | Component `ref` |
| **URL** | path / `searchParams` | Shareable, back-button, reload | Filters, tab, pagination, selected id | `route.query` |
| **Cookies / session** | httpOnly cookie + server session | Auth lifetime | Who is logged in, CSRF, tenant | Nuxt `useCookie` / `useState` *only if* you understand SSR |
| **RSC / server render** | Server Components, `fetch` cache | Request + Next data cache | Initial page data, serialized DTO to children | Nuxt `useAsyncData` on server |
| **Server cache (client)** | TanStack Query / SWR | App session, keyed, stale-while-revalidate | **Lists, details, mutations** | “async data cache,” not Pinia |
| **Context** | Provider value | Subtree | Theme, locale, `QueryClient`, low-churn user **id** | `provide` / `inject` |
| **Client store** | Zustand / RTK / Jotai | Cross-route **client** graph | Cart (guest), multi-step editor, complex UI selection | Pinia / Vuex |

**The interview ranking (Next):** URL and **cookies/session** beat a client store for anything that must survive reload, be shareable, or be trusted. **Query/RSC** beat Redux for server lists. Zustand/RTK beat Context for **high-frequency** client state.

**Constraint.** One fact, one owner. Filters in the URL **or** in Zustand, not both (unless Zustand is a derived view you throw away). Auth user in **session** **or** you will hydrate-mismatch and XSS-copy tokens into `localStorage`.

**Failure mode.** “Everything in Redux because the Vuex app was everything in Vuex.” Users list in a slice, filters in the slice, `user` in the slice, modal flags in the slice. Next: hydrating that slice from `localStorage` before the cookie session is known.

**Measure.** For a screen, fill this in under 30s: *URL owns ___. Query key is ___. Server session is ___. Client store is ___ (or empty).* If two layers claim the same field, you already have a bug.

**Tradeoffs**

More layers look “complicated” in a junior answer. A senior’s diagram is **smaller**: most screens are URL + Query + a few `useState`s. Stores appear when client workflow is actually a graph.

**Production gotchas**

- Restoring filters from Zustand on load **after** the URL already had them → flicker and fights with back button.
- RSC fetched the list **and** Query fetches it again with a different shape — pick a handoff (`initialData` + same key) or don’t use Query on that page.

**Follow-ups**

- They will pick a feature (product table, cart, auth, theme) and make you place it. Practice all four.
- Next-specific: §22.6.

---

### 22.2. Redux Toolkit vs Zustand vs Jotai

**What they actually ask**

- “Which store would you pick for a team of 20?”
- “Is Redux dead?”
- “Atoms vs slices?”

**How a senior answers**

**Decision.** This is a **team-scale / problem-shape** choice, not Twitter.

| | **Redux Toolkit** | **Zustand** | **Jotai** |
|---|---|---|---|
| Shape | One store, slices, conventions | One or few stores, hook API | Many atoms, compose |
| Vue analog | Vuex (discipline, DevTools) | Pinia | “many small refs” |
| Team of 15–40 | **Default** if you need one way to do things, reviewers, time-travel, middleware | Works if you **write conventions** (selectors, folders) | Works if the domain is a **graph**; chaos if everyone invents atoms |
| Solo / small product | Heavy | **Default** | If derived state is the product |
| Async / lists | RTK Query (if you’re already in RTK) | **Don’t** — use TanStack Query | Don’t — Query |
| TS | Excellent, more types to learn | Light, infer from `create` | Excellent per atom; graphs get clever |
| Next client island | Possible; more provider ceremony | **Fits** | Fits; watch SSR hydration per atom |

**Redux is not dead.** It is **optional**. You pick RTK when the **organization** needs a paved road (onboarding, DevTools, RTK Query already there, event logging middleware). You pick Zustand when you want Pinia DX and you will **enforce selectors**. You pick Jotai when a **single store becomes a god object** and derived/atomic updates are the actual model (editors, node graphs, spreadsheet-like UI).

**Constraint.** **Do not put server lists in Redux/Zustand/Jotai by default.** Cache, stale time, dedupe, retries, identity (`queryKey`) are Query’s job. A slice that `fetchUsers` + stores `users[]` is a 2018 answer. Exception: you are building an **offline sync engine** with its own replication log — then you know why, and Query isn’t enough.

**Failure mode.** Introducing Jotai because it’s trendy, then recreating a global store with `atom` soup and no ownership. Introducing RTK for a 6-component SPA. Zustand **without selectors** (`useStore()` whole store) → Context-class thrash.

**Measure.** Time for a new engineer to add a field + DevTools story. Profiler on a typed input: who re-renders. Count of duplicated lists in Query **and** a slice (should be 0).

**Setup (mental, not a tutorial)**

- RTK: `configureStore` + `createSlice` + `useSelector`/`useDispatch` (or RTK Query hooks).
- Zustand: `create((set, get) => …)` + **narrow** `useCart(s => s.items)`.
- Jotai: `atom` + `useAtom`; derived atoms instead of fat `get()`.

**Tradeoffs**

RTK: more files, fewer arguments in code review. Zustand: less boilerplate, entropy without lint/review. Jotai: fine-grained updates (closer to Vue), harder to *see* the data model in one file.

**Production gotchas**

- RTK `useSelector` without equality / returning a new object every time → render storm.
- Zustand persist middleware + Next SSR → hydration mismatch (§22.8).
- Jotai Provider missing in tests/SSR → silent wrong values.

**Follow-ups**

- “RTK Query vs TanStack Query?” — don’t run both. RTK Query if the team is all-in Redux; TanStack Query is the ecosystem default and pairs with Zustand.
- Context vs these: §22.4.

---

### 22.3. State flow

**What they actually ask**

- “Draw Redux data flow.”
- “How is Zustand different from Pinia?”
- “Where do side effects live?”

**How a senior answers**

**Decision.** All three are **client UI** flows. Server side effects (HTTP GET lists) should **exit this diagram** into Query/RSC.

**Redux Toolkit (Flux-like)**

1. UI `dispatch(action)`.
2. Slice reducer updates **immutably** (Immer in RTK).
3. Async: thunk / listener middleware / **RTK Query**.
4. `useSelector` → re-render.

**Pros:** replay, middleware, explicit events. **Cons:** ceremony; people stuff server cache into slices.

**Zustand (Pinia-like)**

1. UI calls `useCart(s => s.add)(id)`.
2. `set` replaces a slice of the store (Immer optional).
3. Subscribers whose **selected** slice `Object.is`-changed re-render.

**Pros:** tiny, Vue-senior friendly. **Cons:** side effects in actions become an ungoverned `fetch` unless you forbid it.

**Jotai**

1. UI `setAtom`.
2. Derived atoms recompute.
3. Only components subscribed to those atoms re-render.

**Pros:** granularity. **Cons:** the graph *is* the architecture — undocumented graphs don’t scale.

```ts
// Selector discipline is the production constraint (whole-store subscribe = thrash)
const qty = useCart((s) => s.items.length)
const add = useCart((s) => s.add)
```

**Constraint.** Actions should be **pure store updates** or call Query mutations. Mixing `fetch` inside Zustand actions recreates thunks without the cache.

**Failure mode.** Dispatching into Redux from a Server Component (you can’t — no hooks, wrong runtime). Using Jotai atoms as a network cache.

**Measure.** Redux DevTools action log vs “we have no idea why the cart emptied.” Zustand: log in `subscribe`. If you need the log to ship, maybe you needed RTK.

**Vue bridge**

| Feature | RTK | Zustand | Jotai |
|---|---|---|---|
| Boilerplate | Medium | Low | Low–medium |
| Structure | Strong conventions | You define | Atom graph |
| DevTools | Excellent | Good | Good |
| Vue bridge | Vuex | Pinia | many refs |
| Side effects | thunks / RTK Query | actions (keep thin) + Query | write atoms (keep thin) + Query |

**Tradeoffs**

Flux is easier to **audit**. Pinia-like is easier to **write**. Pick for the failure mode you cannot afford (audit vs speed).

**Production gotchas**

- Zustand `set({ items })` mutating `items` in place first — React/Zustand may bail out; always new references for the fields you select.
- RTK `createAsyncThunk` for GET lists — that’s a Query-shaped problem.

**Follow-ups**

- Immutability vs Vue mutation: [react.md §20.1.4](./react.md#2014-props-vs-state).

---

### 22.4. Local vs Context vs store vs server cache

**What they actually ask**

- “When is Context enough?”
- “Why not one React Context for the app?”
- “What’s ‘state locality’?”

**How a senior answers**

**Decision — interview-ready rule**

| If… | Then |
|---|---|
| One component / short tree, ephemeral | `useState` / `useReducer` |
| Shareable / back-button / bookmark | **URL** |
| Trusted identity / session | **Cookies + server** |
| Remote data that can be stale | **TanStack Query / SWR** (or RSC for the document) |
| Low-churn DI (theme, locale, flags, query client) | **Context** (split providers) |
| High-frequency or complex **client** workflow | **Zustand / RTK / Jotai** with selectors |

**Constraint.** Context **broadcasts** to all consumers on `value` change — `memo` does not skip it ([react.md §20.2.1](./react.md#2021-context-vs-vue-provide--inject)). A store with selectors is how you share **often-changing** client state. “State locality” means **push state down** until a sibling needs it; don’t lift to Redux for convenience.

**Failure mode.** Keystrokes in Context. Theme + cart + user in one Provider. Query result copied into Context “so I don’t import Query.” Store as a mirror of `searchParams`.

**Measure.** Profiler while typing. If the app shell highlights, the layer is wrong.

**Use local state for:** one tree, hover/open, uncontrolled drafts until submit.

**Use Context for:** rarely changing shared values; **injecting** services (QueryClient, i18n). Split **state** vs **dispatch** if the value would otherwise be a new object every render.

**Use a client store for:** cross-route UI that is **not** URL-worthy and **not** server data (guest cart, design-tool selection, wizard that must not be in the URL for size/privacy).

**Use server cache for:** lists, details, mutation + invalidate.

**Tradeoffs**

URL for filters is slightly more plumbing than Zustand and wins share/reload/analytics. Context is zero deps and becomes a footgun at frequency. Stores are explicit about client-only — dangerous on Next if you persist them blindly.

**Production gotchas**

- `value={{ user, setUser }}` new object every render.
- Giant `user` Context updated when a profile form types (session vs **draft** must be split — §22.8).

**Follow-ups**

- They will ask you to refactor a Context-shaped cart to Zustand and explain **what didn’t move** (item catalog stays Query).

---

### 22.5. Server state: TanStack Query / SWR

**What they actually ask**

- “Why not `useEffect` + `useState`?”
- “Why not Redux for the users list?”
- “How do you invalidate after a POST?”

**How a senior answers**

**Decision.** Server state is **async, stale, keyed, shared**. Query/SWR already implement loading/error, **races**, dedupe, retries, focus refetch, `queryKey` identity, mutation → `invalidateQueries`. `useEffect` fetch recreates a worse version ([react.md §20.1.7](./react.md#2017-effects-useeffect-vs-vue-watch--lifecycle)). **Redux lists** recreate a worse version without stale-while-revalidate.

**Constraint.** The **queryKey** is the cache identity (`['users', { page, q }]`) — same as Nuxt’s key string, but you will mess up object identity in the key. Mutations must declare **what they invalidate** (or update the cache). In Next, pair with `revalidateTag` when the **RSC** tree also shows that data.

**Failure mode.** `queryKey: ['users']` for every filter. Putting `data` into Zustand in `onSuccess` “for convenience.” Fetching in both RSC and Query with **different** keys/shapes and no `initialData` contract. Disabling refetch so hard the UI never recovers.

**Measure.** Query Devtools: hit vs miss, number of in-flight, who subscribed. Network: two components, one GET (dedupe) vs two.

```ts
// Invalidation is the production contract — not "setUsers" in a store
const qc = useQueryClient()
useMutation({
  mutationFn: createUser,
  onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
})
```

**Don’t put API lists in Redux/Zustand by default.** Strong reasons only: offline-first replication, collaborative CRDT, or you *are* the cache (you’re not).

**Vue / Nuxt bridge**

| Concern | Vue / Nuxt | React |
|---|---|---|
| Cached async data | `useAsyncData` / `useFetch` | TanStack Query / SWR |
| Invalidate after write | `refreshNuxtData` | `invalidateQueries` + maybe `revalidateTag` |
| Keyed cache | key string | `queryKey` array |
| Deduped SSR fetch | Nuxt payload | RSC fetch cache **or** Query hydrate (`dehydrate`/`HydrationBoundary`) |

**Tradeoffs**

Query is a **client** cache: after a full reload, RSC can be faster for first paint. Pattern: **RSC for the document**, Query for **client interactions** on that data (pagination that shouldn’t drop the shell, polling, optimistic rows).

SWR vs Query: same layer. Query wins features/team default; SWR is smaller. Don’t run both.

**Production gotchas**

- Hydrating Query with server data that included **user-specific** rows into a **shared** cache key.
- `staleTime: Infinity` as a substitute for understanding invalidation.
- Error/retry vs Error Boundaries — Query errors are **not** render throws unless you opt into suspense.

**Follow-ups**

- Optimistic updates vs `useOptimistic` + Server Actions ([nextjs.md §21.9](./nextjs.md#219-server-actions--mutations)).
- Abort / race: Query cancels; your effect must `AbortController`.

---

### 22.6. Next.js state patterns

**What they actually ask**

- “How does App Router change state management?”
- “Where is the current user stored?”
- “Zustand persist + Next?”

**How a senior answers**

**Decision.** App Router **moves the default source of truth to the server**:

1. **Server Components** fetch and render **server data** — no `useState`, no Zustand inside them.
2. **Client islands** (`'use client'`) hold interactive state — smallest island that needs hooks ([nextjs.md §21.5](./nextjs.md#215-app-router-fundamentals)).
3. **URL** (`searchParams`) for shareable UI.
4. **Cookies / server session** for **auth** — not a giant client `user` store. The cookie is what middleware and RSC can see; Zustand cannot be trusted as login truth.
5. After mutations: **`revalidatePath` / `revalidateTag`** (server tree) and/or Query invalidation (client cache). Often **both** if both trees show the data.
6. Pass **DTOs** across the RSC boundary, not class instances or secrets.

**Constraint.** `cookies()` in a layout dynamizes rendering ([nextjs.md §21.10](./nextjs.md#2110-rendering--caching-cheat-sheet)). Client stores **must hydrate consistently** with server HTML. `localStorage` is **not** available during SSR — persist middleware that reads it in `create` will mismatch.

**Failure mode.** `useUserStore.getState().setUser(localStorage)` in a module body. Root `'use client'` + Redux Provider wrapping the **RSC** children incorrectly (Providers are client; **compose children** from the server). Session in Query **without** `staleTime` refetch flashing logged-out chrome. Duplicating the cookie into Zustand and using **only** Zustand in UI while RSC used cookies — two truths.

**Measure.** View-source of an authed page: is PII in HTML intentionally? Login/logout: does RSC HTML change, or only a client store? Hydration warnings on first load with persist.

**Nuxt parallel**

| Nuxt | Next |
|---|---|
| `useState` (SSR-shared) | usually **don’t** clone; cookie + RSC + small client island |
| `useAsyncData` | RSC `fetch` + optional Query |
| `refreshNuxtData` | `revalidatePath` / `revalidateTag` |
| Pinia + SSR plugin | persist/hydrate **carefully** or skip; prefer server truth |
| `useCookie` | `cookies()` server-side; client `document.cookie` only for non-httpOnly |

**Tradeoffs**

Server session is secure and cache-hostile (dynamic). A client user blob is cache-friendly and **wrong**. PPR/partial: static shell + session in the **hole**.

**Production gotchas**

- Hydration: `useEffect` to load persistor, `useState` default matching server (`undefined` / empty), then fill — or `skipHydration` + `hasHydrated` gate before painting authed chrome.
- Theme: prefer a **cookie** (server can class `html`) over `localStorage` to avoid flash/mismatch.
- Don’t `JSON.stringify` the session into a Client Component prop if it includes tokens.

**Follow-ups**

- Middleware cookie gate vs RSC `redirect` vs client `Navigate` — [nextjs.md §21.8](./nextjs.md#218-middleware), [react.md §20.2.9](./react.md#2029-route-guards--middleware-spa).
- Production failures: [nextjs.md §21.12](./nextjs.md#2112-common-production-failures).

---

### 22.7. Vuex / Pinia → React map

**What they actually ask**

- “I know Pinia — where do I look in React?”
- “What happened to mutations vs actions?”

**How a senior answers**

**Decision.** Map **habits**, then **drop** the parts that Query/RSC replaced. Vuex mutations-vs-actions is RTK reducers-vs-thunks. Pinia “just call the action” is Zustand. Neither should own **server lists** the way many Vuex apps did.

| Vue | React / Next |
|---|---|
| Component `ref` | `useState` / `useReducer` |
| `computed` | derive in render / `useMemo` / Compiler |
| `provide` / `inject` | Context (broadcast — split it) |
| Vuex module | Redux slice |
| Vuex mutation (sync) | RTK reducer |
| Vuex action (async) | thunk / listener / **Query mutation** |
| Pinia `defineStore` | Zustand `create` |
| Pinia action async | Zustand action **or** Query |
| Nuxt `useAsyncData` | RSC fetch + TanStack Query |
| Route query | `useSearchParams` / `searchParams` |
| `useCookie` | server `cookies()` + httpOnly session |

Deep Vue store notes: [State Management](./state-management.md). Core hooks: [React](./react.md).

**Constraint.** The map is **not** 1:1 for data fetching. A Pinia store that `async fetchOrders()` should become **`useOrders()` wrapping `useQuery`**, not `useOrderStore`.

**Failure mode.** Recreating Vuex modules 1:1 in RTK including `state.loading` / `state.error` per list — that’s Query’s `isPending` / `error`.

**Measure.** After a migration, grep for `fetch(` inside store files — should be rare.

**Tradeoffs**

1:1 store ports ship faster and keep the old bugs (lists in global state, SSR persist). Layered ports take a sprint and match how Next actually works.

**Production gotchas**

- Pinia `$patch` mutation style in Zustand without new refs.
- Vuex persist plugins → Zustand persist → Next hydration (don’t port the plugin until you have a hydration story).

**Follow-ups**

- Ask them to migrate **one** Pinia store live: split URL / Query / leftover UI flags.

---

### 22.8. Interview pitfalls

**What they actually ask**

- “What mistakes do you see in React state?”
- “Hydration — what did you break?”
- They drop a snippet: Context on every keystroke, users in Redux, `useEffect` fetch, filters in two places.

**How a senior answers**

**Decision.** Pitfalls are **layer violations**. Name the layer, name the failure, name the measure.

**Constraint.** Vue-trained teams recreate Pinia/Vuex gravity. Next-trained juniors recreate “everything RSC” and then hide client state in module singletons.

**Failure mode / catalog** (expand in the room from the snippet they give):

1. **Everything in Context** → broadcast re-renders. Split providers or use a store with **selectors**. Measure: Profiler on type.

2. **Everything in Redux/Zustand** → server lists belong in **Query/RSC**. `loading` flags per resource are Query. Measure: count of duplicated caches.

3. **Fetch in `useEffect` without abort** → races, Strict Mode double-fire. Prefer Query. If you must: `AbortController` ([react.md §20.1.7](./react.md#2017-effects-useeffect-vs-vue-watch--lifecycle)).

4. **Store mirrors URL** → two sources; back button fights the store. URL wins for filters. Derive UI from `searchParams`.

5. **Hydration bugs in Next** → `localStorage` / `Date` / `window` / persist middleware in `create()` during SSR. Server HTML ≠ client first paint. Fix: same default on both sides, then `useEffect` fill; theme cookie; `suppressHydrationWarning` only on a known clock node ([nextjs.md §21.12](./nextjs.md#2112-common-production-failures)).

6. **Giant `user` Context updated every keystroke** → session (rare) vs **form draft** (local/RHF). Split. Measure: shell re-rendering on input.

7. **Context thrash via unstable `value`** — `value={{ theme, setTheme }}` new identity every parent render. Memoize or split state/dispatch contexts.

8. **Zustand `useStore()` without selector** → every field update re-renders this component. Same class of bug as Context.

9. **Auth in `localStorage` + client store as truth** → XSS, middleware can’t see it, RSC HTML is logged-out. Cookies/session win.

10. **RSC data copied into a module-level `let cache`** → leaks across users on a long-lived server. Use the framework cache with keys, or Query on the client.

11. **Optimistic UI with no rollback** → Query `onMutate`/`onError` or `useOptimistic` + server error.

12. **Boolean prop / store flag soup for UI** → composition ([react.md §20.2.6](./react.md#2026-children-slots-mindset-and-composition)), not `modalOpen` in Redux.

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

**Measure (how you talk about incidents)**

- Profiler + why-did-you-render for thrash.
- Next hydration overlay / mismatch diff.
- Network: one list GET vs the store *and* Query.
- Security: cookie on the wire, not token in Redux DevTools.

**Tradeoffs**

A “simple” global store ships the feature and the incident. Layers look like over-engineering until the first hydration or stale-price bug.

**Vue one-liner**

Pinia taught **small intentional stores**. In React, add **server cache vs client UI**. In Next, prefer **server + URL + cookies** before another global store.

**Follow-ups**

- Place: product filters, current user, cart, toast queue, CMS-backed article, websocket presence — six different layers.
- “Compiler / `memo` vs store choice” — wrong layer costs more than missing `useCallback` ([react.md §20.2.8](./react.md#2028-performance-checklist-for-seniors)).

---

[← Back to Overview](../../README-en.md)
