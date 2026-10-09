# State Management

Pinia is the default answer for Vue 3. Vuex still appears in **legacy interviews** and migration stories; treat it as a dialect you can speak, not the architecture you would start today. Seniors are graded on **where state lives** (component, URL, Pinia, server cache), **SSR hydration**, and **store boundaries** — not on memorizing `commit` vs `dispatch`. A strong answer is a **decision** under a **constraint**, the **failure mode** you have already shipped, and how you would **measure** it.

React / Next twin (Zustand, Redux Toolkit, TanStack Query, RSC): [State Management (React)](./state-management-react.md).

---

## Table of Contents

1. [Vuex vs Pinia](#71-vuex-vs-pinia)

2. [State Flow](#72-state-flow)

3. [When to Use Global vs Local State](#73-when-to-use-global-vs-local-state)

4. [Vuex: commit vs dispatch](#74-vuex-commit-vs-dispatch)

5. [Dispatch vs Actions (Vuex)](#75-dispatch-vs-actions-vuex)

6. [SSR hydration of stores](#76-ssr-hydration-of-stores)

7. [Server cache vs client store](#77-server-cache-vs-client-store)

---

## 7. State Management

### 7.1. Vuex vs Pinia

**What they actually ask**

“Why Pinia?” is the warmup. The senior thread is **migrating a Vuex app**, **SSR plugins**, and **stores as modules, not a god object**. They may still require Vuex vocabulary for a monolith that cannot move this quarter.

**How a senior answers**

- **Decision:** Pinia for Vue 3 greenfield and for any module you touch in a migration. Vuex 4 if the app is Vuex-everywhere, the team has mutation discipline, and you cannot pause delivery for a rewrite. Do not run **two** global clients longer than a transition window.
- **Constraint:** Vuex is one store with **namespaced modules**. Pinia is **many stores** that you compose at call time. SSR: both need a **per-request** instance; Pinia’s Nuxt module is the path of least regret. Vuex plugins that hang state on the module singleton will leak users.
- **Failure mode:** One `useMainStore` with 80 fields (the Vuex root module copied into Pinia). Or a “perfect” rewrite that maps every mutation 1:1 and keeps the god object. Or installing Pinia at module scope so request A sees request B’s cart.
- **Measure:** Time to add a feature without editing an unrelated store; SSR cross-request tests; bundle of unused Vuex modules (they rarely tree-shake cleanly).

**Migration story (what they want to hear)**

1. Install Pinia **beside** Vuex. New features get Pinia stores. Do not dual-write unless a screen must.
2. Extract a Vuex module that already has a clear boundary (cart, feature flags) into `defineStore('cart', ...)`. Components switch `mapGetters` → `storeToRefs`.
3. Cross-talk: Pinia actions may `useVuexStore()` temporarily; delete the bridge when the Vuex module dies.
4. SSR: switch the app to `createPinia()` per request (Nuxt module) before you delete Vuex, or you will debug the wrong layer.
5. Drop Vuex when no `mapState` remains. Keep a cheat sheet of mutation names for on-call, not for new code.

**SSR Pinia plugins**

Plugins (`pinia.use(({ store }) => ...)`) must be **pure per install**. Subscribe, persist, and DevTools are fine. A plugin that `fetch`es the user at import, or writes to a module-level `cache`, is an SSR leak. Persist-to-localStorage plugins are **`.client`** in Nuxt. If you persist, persist **UI preferences**, not server lists (see [7.7](#77-server-cache-vs-client-store)).

**Stores as modules, not god objects**

| Smell | Why it hurts | Split |
|---|---|---|
| `useAppStore` | Every SFC subscribes too widely | `auth`, `ui`, `checkout` |
| Copying the entire REST model in | Stale + duplicated server cache | Query / `useAsyncData` |
| Store importing 12 other stores at top level | Circular init | Call `useX()` **inside actions** |
| Everything is `$patch` from components | No invariant | Actions with names |

Pinia stores are cheap. Prefer **more stores with small public surfaces** over one store with a 40-method API.

**Tradeoffs**

| | Vuex 4 | Pinia |
|---|---|---|
| Shape | Single store, modules | Many stores |
| Writes | mutations (sync) + actions | actions (or direct in setup, with discipline) |
| TS | Fight `this`, typed modules | Inference that actually works |
| SSR | `createStore` per request | `createPinia` per request |
| DevTools | Time-travel via mutations | Excellent; no mutation log unless you add it |
| When | Legacy interviews, frozen apps | Default |

Direct `store.count++` is legal in Pinia. Teams that need an audit log still wrap writes in **actions** (and optionally a plugin that records them). That is discipline, not a missing framework feature.

**Production gotchas**

- Vuex `strict` mode in prod is a performance tax; Pinia has no equivalent gate — invariants live in actions/tests.
- `store.$dispose()` matters for tests and for stores tied to a session; forgetting it in unit tests is how order-dependent specs happen.
- HMR: Pinia handles it; hand-rolled singletons do not.

**Follow-ups**

- Would you use Vuex 5? (Pinia is the official successor; do not bet a new app on Vuex.)
- How you would map Vuex namespaced `dispatch('cart/add')` to `useCartStore().add()`.
- Persist plugins vs cookies for auth (cookies win for SSR).

---

### 7.2. State Flow

**What they actually ask**

They expect a 20-second Flux sketch, then: **where does this piece of state actually live?** Seniors **colocate** first, and they split **server state** from **client UI state**. Dumping `useFetch` results into Pinia “so DevTools can see it” is the wrong default.

**How a senior answers**

- **Decision:** Colocate state with the nearest owner. **Server state** (lists, details, anything with a cache key and a TTL) lives in **TanStack Query** or **Nuxt `useAsyncData` / `useFetch`**. **Client UI state** (which modal is open, wizard step, optimistic overlay that is not the server’s) lives in the component, the URL, or Pinia if it must be shared. Pinia is not a REST cache.
- **Constraint:** Vuex flow is `dispatch → action → commit → mutation → state → getter → view`. Pinia flow is `action (or assignment) → reactive state → view`. The constraint that actually bites is **lifetime**: server data goes stale; UI drafts should not.
- **Failure mode:** `onMounted` → `store.fetchProducts()` → products in Pinia forever, never invalidated, duplicated with a page that also `useFetch`s. Or every keystroke in a filter bar writing Pinia and re-rendering the app shell.
- **Measure:** Duplicate GETs vs stale UI after a mutation; number of Pinia stores that are just `items: []` + `fetch`; render counts of layout when a table paginates.

**Vuex (legacy 30s)**

Component `dispatch`es an **action**. The action does I/O, then `commit`s a **mutation**. Mutations are synchronous and are the only writers. Getters are cached derived state. That log is why Vuex DevTools can time-travel.

**Pinia (what you ship)**

Component calls an **action** (or, for trivial fields, assigns). State is a reactive object. Getters are store-level `computed`. There is no mutation layer unless you add policy.

**Colocation vs “flow”**

Flow diagrams do not tell you **which store**. Rules that do:

1. If only one SFC needs it → `ref` / `reactive`.
2. If the URL already represents it (page, tab, sort, filters) → **router query / params**, not Pinia.
3. If several components on a view share ephemeral UI → provide/inject or a **view-scoped** store you dispose.
4. If it is session-wide client state (auth, theme, cart) → Pinia.
5. If a server owns it → query / `useAsyncData`, invalidate on mutation.

**Tradeoffs**

| Home | Freshness | Sharing | SSR |
|---|---|---|---|
| Component | You own it | None | Easy |
| URL | Bookmarkable | Across refresh | Natural |
| Pinia | Until you write | App-wide | Must hydrate ([7.6](#76-ssr-hydration-of-stores)) |
| Query / `useAsyncData` | TTL / refresh | By key | Payload |

**Production gotchas**

- Getters that return new arrays every time (`state.list.filter(...)`) force extra updates; same as Vue `computed` identity issues.
- Vuex `subscribe` / Pinia `$subscribe` for persistence can write on **every** patch including SSR — gate on client and debounce.
- “Single flow” zealots who `dispatch` to toggle a tooltip.

**Follow-ups**

- How you invalidate server cache after a Pinia action that POSTs (you call `refreshNuxtData` / `queryClient.invalidateQueries`, you do not `store.items.push` as the source of truth).
- Optimistic UI: overlay in the component/store, rollback on error, server cache is still authoritative.
- See [7.7](#77-server-cache-vs-client-store).

---

### 7.3. When to Use Global vs Local State

**What they actually ask**

Not “if many components need it → global.” They want **auth/theme vs form drafts**, and **URL as source of truth for filters**.

**How a senior answers**

- **Decision:** Global (Pinia / `useState`) for **session-shaped** data: auth identity, theme, locale, cart, feature flags. Local (`ref`) for **form drafts, hover, temporary flags**. Filters, pagination, selected tab, sort → **the URL** unless they are truly secret or too large. If a refresh should reset it, it was not global.
- **Constraint:** Global subscriptions are **fan-out**. A chatty global store is a render-performance bug. URL length and encoding limit filter serialization; some UIs need a “saved view” in Pinia/server instead.
- **Failure mode:** Form draft in Pinia so a keep-alive miss does not lose it — then two tabs overwrite each other and logout must remember to `$reset`. Filters only in component state → back button fights the table. Auth only in memory → F5 logged out.
- **Measure:** Accidental re-renders of `App.vue` (Pinia `storeToRefs` of a fat store). Support tickets: “my filters disappeared” vs “the link doesn’t open the same view.”

**Auth / theme**

- Auth: Pinia + **cookie session** (SSR). The store holds the **hydrated user**, not the access token if it can be httpOnly.
- Theme: Pinia or `useState` + a class on `<html>`, persist to localStorage **on the client** after paint to avoid mismatch (or set a cookie so SSR matches).

**Form drafts**

- Local first. `keep-alive` if the user expects tab-back. Pinia only for **multi-route wizards** (`useCheckoutDraftStore`) with an explicit discard and a `max` age. Do not put every `<input>` in the global store.

**URL as source of truth**

Search, filters, page, `sort`, selected entity id: `route.query` / `route.params`. Components read the router, they do not mirror it into Pinia unless you need derived client-only bits. Shareable links and back-button for free.

```ts
// Filters live in the URL; Pinia is not in this path.
const router = useRouter()
const route = useRoute()
const page = computed(() => Number(route.query.page ?? 1))
function setPage(p: number) {
  router.replace({ query: { ...route.query, page: String(p) } })
}
```

**Tradeoffs**

| Kind | Local | URL | Pinia |
|---|---|---|---|
| Modal open | Default | Rare (`?modal=`) | If many distant triggers |
| Table filters | No | Default | Saved views |
| Wizard draft | If one page | Ugly | Multi-route |
| Auth user | No | No | Default |

**Production gotchas**

- Writing URL on every keystroke in a typeahead: debounce `replace`, or keep local draft and commit on submit.
- `router.push` vs `replace` for filters — `push` fills history with page=1,2,3.
- Global “loading” boolean in Pinia: every fetch toggles the whole app spinner. Prefer **per-query** pending.

**Follow-ups**

- How you would restore a form after OAuth redirect (sessionStorage, not Pinia).
- `provide/inject` vs a tiny Pinia store for a subtree (prefer provide; see [vue3 provide](./vue3.md#526-provide--inject)).
- Why `useState('x')` in Nuxt is request-scoped global, not “Pinia-lite for everything.”

---

### 7.4. Vuex: commit vs dispatch

**What they actually ask**

A 30-second Vuex answer, then whether you still split that way. The senior close is: **in Pinia we don’t split mutations and actions.**

**How a senior answers**

- **Decision (Vuex):** `commit` **mutations** for synchronous state changes; `dispatch` **actions** for async, I/O, and anything that might fail. Components almost always `dispatch`. Mutations must not `await`.
- **Constraint:** Vuex DevTools time-travel depends on **pure, sync mutations**. Async in a mutation breaks the log and races. This is why the split existed — not because JavaScript needed two function types.
- **Failure mode:** `async FETCH` inside `mutations` (the classic junior bug). Or components `commit` from five places so invariants (e.g. “cart line qty ≥ 1”) scatter.
- **Measure:** In a Vuex app: mutation purity in code review; in a Pinia app: you **do not** recreate this split unless you need an audit plugin.

**30-second Vuex**

```
dispatch('fetchUser') → action (async) → commit('SET_USER', user) → mutation (sync) → state
```

`commit` returns nothing useful. `dispatch` returns the action’s Promise. Nested `dispatch` is how Vuex orchestrates.

**In Pinia we don’t split**

```ts
export const useUserStore = defineStore('user', {
  state: () => ({ user: null as User | null, error: null as string | null }),
  actions: {
    async fetchUser(id: string) {
      this.error = null
      this.user = await api.getUser(id)
    },
  },
})
```

There is no `commit`. The action **is** the writer. If the team wants traceability, use named actions + a Pinia plugin, not a fake mutation layer.

**Tradeoffs**

- Vuex split: better time-travel, more boilerplate, TS pain.
- Pinia actions: less ceremony, you can still write messy components that patch state directly — **convention** replaces the compiler.

**Production gotchas**

- Vuex 4 + Vue 3: people still copy Vue 2 `this.$store.commit` in `setup` without `useStore()`.
- Pinia: `store.$patch` in a component to “avoid an action” is fine for one-liners; it is not fine for multi-field invariants.
- Returning data from Vuex actions vs always reading state — be consistent or callers race.

**Follow-ups**

- Why Vuex mutations cannot be async (devtools + predictability), not “because Vue said so.”
- How you would implement undo in Pinia without mutations (command stack in a store).
- Cross-store writes: next section.

---

### 7.5. Dispatch vs Actions (Vuex)

**What they actually ask**

The heading is Vuex trivia (`dispatch` **calls** an `action`). Do not repeat [7.4](#74-vuex-commit-vs-dispatch). The senior version is **orchestrating multiple stores**: who calls whom, and **circular store dependencies**.

**How a senior answers**

- **Decision:** Vuex: `dispatch('cart/add')` / `dispatch('user/logout', null, { root: true })` is how modules talk. Pinia: call `useOtherStore()` **inside an action**, not at store setup top level. Own a **direction**: `auth` may reset `cart`; `cart` must not hydrate `auth`. For app-wide events (logout), a dedicated action on the **owner** store that other stores **register** for, or an explicit `resetAll()` in one composer, beats a web of imports.
- **Constraint:** Pinia allows `useFooStore()` during `defineStore` setup, but if `foo` imports `bar` and `bar` imports `foo`, **one of them is `undefined` on first call**. Vuex namespaced modules have the same cycle via `dispatch`. Cycles are an architecture bug, not a library bug.
- **Failure mode:** `useCartStore()` at the top of `useUserStore` setup, and vice versa — works in tests that import cart first, explodes in production chunk order. Or every store `dispatch`es `loading/start` on a god UI store.
- **Measure:** A dependency graph of `useXStore` calls (even a grep). Logout must clear **all** user-scoped stores in one test. Circular import warnings in the bundler.

**Vuex one-liner (so you don’t sound lost)**

`dispatch` is the **invocation**; an **action** is the **function**. That is the whole distinction. Orchestration is `dispatch`ing other actions, including other modules.

**Pinia orchestration**

```ts
export const useAuthStore = defineStore('auth', {
  actions: {
    async logout() {
      await api.logout()
      this.user = null
      // Inside the action — not at setup top-level
      const cart = useCartStore()
      cart.$reset()
      const ui = useUiStore()
      ui.closeAllOverlays()
    },
  },
})
```

If `useCartStore` also called `useAuthStore()` at **setup**, you would have a cycle. Keep **setup functions side-effect free**. Use `storeToRefs` in components; in stores, call the other store **lazily**.

**Breaking cycles**

1. Invert: both stores receive a command from a **component** or a third `useSessionStore` that already owned the workflow.
2. Events: `auth.$onAction` in a plugin registered **after** both exist (still easy to overuse).
3. Shared **pure** module (`resetClientState(pinia)`) that `$reset`s a known list — ugly, explicit, testable.
4. Do not hide the cycle behind Vuex `root` dispatch; you only made it stringly typed.

**Tradeoffs**

- Direct `useOtherStore()` in actions: simple, can weave a graph.
- Composer/facade store: one place to read, extra layer.
- Domain events: decoupled, harder to trace in an interview whiteboard.

**Production gotchas**

- Calling `useXStore()` outside `setup` / `pinia` active context (plain TS module, a `setTimeout` after tests) throws. Pass `pinia` or call from an action.
- `$reset()` does not run your custom teardown (websockets). Pair with an action `dispose()` that the composer calls.
- Vuex `subscribeAction` vs Pinia `$onAction` — both can recurse if the hook dispatches the same action.

**Follow-ups**

- How you test a logout that touches four stores (`setActivePinia(createPinia())`, then assert each).
- Whether stores should import API clients (yes) or Vue Router (sparingly; navigation from stores surprises people).
- Circular Pinia + auto-import: the cycle is still there ([vue3 auto-import](./vue3.md#513-auto-import-components)).

---

### 7.6. SSR hydration of stores

**What they actually ask**

“How does Pinia get from the server to the client?” They want **per-request instances**, **payload**, and **what you must not persist**.

**How a senior answers**

- **Decision:** Create **one Pinia per SSR request**. Serialize the stores you still need on the client into the Nuxt/Vue payload. On the client, **install the same state before the first paint** so hydration matches. Prefer the **official Nuxt Pinia module** over a hand-rolled `window.__PINIA__`.
- **Constraint:** Anything in the store at the end of SSR can be **in the HTML**. Do not put tokens, PII dumps, or 2 MB lists there. Client plugins that re-fetch auth before hydrate can **overwrite** server state and mismatch.
- **Failure mode:** `const pinia = createPinia()` at module scope — User A’s cart in User B’s response. Or hydrating after `onMounted` — Vue already hydrated the DOM with defaults. Or `localStorage` overwrite of the payload (theme flash, logged-out flash).
- **Measure:** Two concurrent SSR requests with different sessions in a test. Payload keys/size. Hydration warnings on pages that read the store in `setup`.

**SPA vs Nuxt**

- Vite SPA: no SSR, no hydrate story. `createPinia()` once in `main.ts`.
- Custom SSR: `renderToString(app)` with a fresh pinia; send `pinia.state.value`; client `pinia.state.value = window.__STATE__`.
- Nuxt: `@pinia/nuxt` does this. You still must not leak.

**What to put in the serialized store**

- Yes: user **public** profile already used in HTML, feature flags that gated SSR, cart **ids** if the header rendered a count.
- No: refresh tokens, full ACL matrices, duplicated `useAsyncData` lists (the payload already has them — see [7.7](#77-server-cache-vs-client-store)).

**Tradeoffs**

- Serialize everything: easy mismatch-free, huge HTML, secret-prone.
- Serialize nothing, refetch on client: simple, flashes, extra RTT, possible mismatch if HTML assumed data.
- Serialize a **minimal** session + let queries own the rest: the production default.

**Production gotchas**

- `store.$state` includes functions? It should not — if you stuffed a class instance in state, serialization dies or hydrates as a plain object (`markRaw` + do not SSR it).
- Date objects become strings. Decode in a hydrate hook or store ISO strings.
- Client-only Pinia plugins (persist) must run **after** payload apply or they will clobber.

**Follow-ups**

- `useState` vs Pinia for a single SSR flag (useState is lighter; Pinia if there is behavior).
- How Vuex `replaceState` maps to Pinia `state.value =`.
- Testing: `createTestingPinia({ initialState })` vs a real payload round-trip.

---

### 7.7. Server cache vs client store

**What they actually ask**

The punchline of the whole topic: **do not use Pinia as your HTTP cache.** They want a crisp split and a mutation story.

**How a senior answers**

- **Decision:** **Server cache** (`useAsyncData` / `useFetch` / TanStack Query / SWR) owns **data that a server would recognize**: entities, lists, permissions that can be refetched, with a **key**, **staleness**, and **invalidation**. **Client store** (Pinia) owns **client-only meaning**: session UX, drafts, selection that is not in the URL yet, optimistic overlays. After a POST, **invalidate the cache**; do not “keep Pinia in sync” as the architecture.
- **Constraint:** Two copies of `Product` (query + Pinia) **will** diverge. SSR payload already is a server cache. Putting the same blob in Pinia doubles memory and hydration cost.
- **Failure mode:** `fetchProducts` into Pinia on every page, never `refreshNuxtData('products')` after an admin edit, users see stale prices. Or TanStack Query **and** Pinia both listing the cart.
- **Measure:** After a mutation, time until every surface shows the new value (should be one invalidate, not three hand-synced arrays). Count of stores named `useXListStore`.

| Question | Server cache | Pinia |
|---|---|---|
| Can the backend return this? | Yes | No (or not as source of truth) |
| Key + TTL? | Yes | Rarely |
| Needed with JS disabled HTML? | `useAsyncData` | Only if serialized ([7.6](#76-ssr-hydration-of-stores)) |
| Survives navigation without refetch? | Cache hit | Until `$reset` |
| Example | Product detail | “compare tray” of ids |

Cart is the usual argument. A **cart id list** in Pinia (or a cookie) plus **product details** from the server cache is coherent. A Pinia cart that embeds full product objects is a stale-price machine.

**Invalidation**

```ts
async function renameProduct(id: string, name: string) {
  await $fetch(`/api/products/${id}`, { method: 'PATCH', body: { name } })
  await refreshNuxtData(`product:${id}`)
  await refreshNuxtData('product-list')
}
```

Pinia might set `ui.lastSavedAt`. It does not store the product.

**Tradeoffs**

- Query-only: excellent freshness, more loading UI, must learn keys.
- Store-only: simple mental model, stale by default, SSR pain.
- Both, with a rule: extra concepts, scales.

**Production gotchas**

- Optimistic Pinia update + failed POST + cache never used → you invented a third state. Prefer optimistic updates **in the cache library** (Query) or overlay flags in Pinia, not a second entity graph.
- `useFetch` with a colliding key across pages is a cache bug; it is not a reason to move data into Pinia.
- Prefetch into Pinia in a navigation guard duplicates what `useAsyncData` + payload already do on the next page.

**Follow-ups**

- TanStack Query in Nuxt: client cache vs payload — who wins on first paint?
- Which cart fields you would still keep in Pinia on an e-commerce SSR site.
- How this maps to the React twin ([Query vs Zustand](./state-management-react.md)).

---

[← Back to Overview](../../README-en.md)
