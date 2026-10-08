# State Management

Pinia là câu default cho Vue 3. Vuex vẫn xuất hiện trong **interview legacy** và chuyện migrate; coi nó là dialect bạn nói được, không phải kiến trúc bạn khởi đầu hôm nay. Senior được chấm ở **state sống ở đâu** (component, URL, Pinia, server cache), **SSR hydration**, và **biên store** — không phải thuộc `commit` vs `dispatch`. Câu trả lời mạnh là **quyết định** dưới **ràng buộc**, **failure mode** bạn đã ship, và cách bạn **đo**.

Bản đôi React / Next (Zustand, Redux Toolkit, TanStack Query, RSC): [State Management (React)](./state-management-react.md).

---

## Table of Contents

1. [Vuex vs Pinia](#71-vuex-vs-pinia)

2. [State Flow](#72-state-flow)

3. [When to Use Global vs Local State](#73-when-to-use-global-vs-local-state)

4. [Vuex: commit vs dispatch](#74-vuex-commit-vs-dispatch)

5. [Dispatch vs Actions (Vuex)](#75-dispatch-vs-actions-vuex)

6. [SSR hydration của store](#76-ssr-hydration-của-store)

7. [Server cache vs client store](#77-server-cache-vs-client-store)

---

## 7. State Management

### 7.1. Vuex vs Pinia

**Họ thực sự hỏi gì**

“Vì sao Pinia?” là warmup. Sợi senior là **migrate app Vuex**, **plugin SSR**, và **store như module, không phải god object**. Họ vẫn có thể đòi vocabulary Vuex cho monolith quý này chưa nhúc nhích được.

**Cách senior trả lời**

- **Quyết định:** Pinia cho Vue 3 greenfield và cho mọi module bạn đụng trong migration. Vuex 4 nếu app là Vuex-everywhere, team có kỷ luật mutation, và bạn không dừng delivery để rewrite. Đừng chạy **hai** global client lâu hơn cửa sổ chuyển tiếp.
- **Ràng buộc:** Vuex là một store với **module có namespace**. Pinia là **nhiều store** bạn compose lúc gọi. SSR: cả hai cần instance **per-request**; module Pinia của Nuxt là đường hối tiếc ít nhất. Plugin Vuex treo state trên singleton module sẽ leak user.
- **Failure mode:** Một `useMainStore` 80 field (root module Vuex copy sang Pinia). Hoặc rewrite “hoàn hảo” map 1:1 mọi mutation rồi giữ god object. Hoặc install Pinia ở module scope để request A thấy cart request B.
- **Đo:** Thời gian thêm feature không sửa store unrelated; test SSR xuyên request; bundle module Vuex không dùng (chúng hiếm khi tree-shake sạch).

**Chuyện migrate (họ muốn nghe)**

1. Install Pinia **cạnh** Vuex. Feature mới nhận Pinia store. Đừng dual-write trừ khi màn hình bắt buộc.
2. Extract module Vuex đã có biên rõ (cart, feature flag) thành `defineStore('cart', ...)`. Component chuyển `mapGetters` → `storeToRefs`.
3. Nói chuyện chéo: action Pinia có thể `useVuexStore()` tạm; xóa cầu khi module Vuex chết.
4. SSR: chuyển app sang `createPinia()` per request (module Nuxt) trước khi xóa Vuex, không thì bạn debug nhầm tầng.
5. Drop Vuex khi hết `mapState`. Giữ cheat sheet tên mutation cho on-call, không cho code mới.

**Plugin Pinia SSR**

Plugin (`pinia.use(({ store }) => ...)`) phải **pure mỗi lần install**. Subscribe, persist, và DevTools thì ổn. Plugin `fetch` user lúc import, hoặc ghi `cache` mức module, là leak SSR. Plugin persist-to-localStorage là **`.client`** trong Nuxt. Nếu persist, persist **UI preference**, không phải list server (xem [7.7](#77-server-cache-vs-client-store)).

**Store như module, không god object**

| Mùi | Vì sao đau | Tách |
|---|---|---|
| `useAppStore` | Mọi SFC subscribe quá rộng | `auth`, `ui`, `checkout` |
| Copy cả REST model vào | Stale + nhân đôi server cache | Query / `useAsyncData` |
| Store import 12 store khác ở top level | Init vòng | Gọi `useX()` **trong action** |
| Mọi thứ `$patch` từ component | Không invariant | Action có tên |

Store Pinia rẻ. Ưu tiên **nhiều store, public surface nhỏ** hơn một store API 40 method.

**Tradeoff**

| | Vuex 4 | Pinia |
|---|---|---|
| Shape | Một store, module | Nhiều store |
| Ghi | mutation (sync) + action | action (hoặc gán trực tiếp trong setup, có kỷ luật) |
| TS | Đánh với `this`, module typed | Inference thực sự chạy |
| SSR | `createStore` per request | `createPinia` per request |
| DevTools | Time-travel qua mutation | Xuất sắc; không có mutation log trừ khi bạn thêm |
| Khi nào | Interview legacy, app đóng băng | Default |

`store.count++` trực tiếp là hợp lệ trong Pinia. Team cần audit log vẫn bọc ghi trong **action** (và tùy chọn plugin ghi lại). Đó là kỷ luật, không phải thiếu feature framework.

**Gotcha production**

- Vuex `strict` trên prod là thuế perf; Pinia không có cổng tương đương — invariant sống trong action/test.
- `store.$dispose()` quan trọng cho test và store dính session; quên trong unit test là cách spec phụ thuộc thứ tự.
- HMR: Pinia lo; singleton tự roll thì không.

**Câu hỏi nối**

- Có dùng Vuex 5 không? (Pinia là successor chính thức; đừng cược app mới vào Vuex.)
- Map Vuex namespaced `dispatch('cart/add')` sang `useCartStore().add()`.
- Persist plugin vs cookie cho auth (cookie thắng cho SSR).

---

### 7.2. State Flow

**Họ thực sự hỏi gì**

Họ kỳ vọng phác Flux 20 giây, rồi: **mảnh state này thực sự sống ở đâu?** Senior **colocate** trước, và tách **server state** khỏi **client UI state**. Đổ kết quả `useFetch` vào Pinia “để DevTools thấy” là default sai.

**Cách senior trả lời**

- **Quyết định:** Colocate state với owner gần nhất. **Server state** (list, detail, thứ có cache key và TTL) sống trong **TanStack Query** hoặc **Nuxt `useAsyncData` / `useFetch`**. **Client UI state** (modal nào mở, bước wizard, overlay optimistic không phải của server) sống trong component, URL, hoặc Pinia nếu phải share. Pinia không phải REST cache.
- **Ràng buộc:** Flow Vuex là `dispatch → action → commit → mutation → state → getter → view`. Flow Pinia là `action (hoặc assignment) → reactive state → view`. Ràng buộc thực sự cắn là **lifetime**: data server stale; draft UI thì không nên.
- **Failure mode:** `onMounted` → `store.fetchProducts()` → product trong Pinia mãi, không invalidate, nhân đôi với page cũng `useFetch`. Hoặc mỗi phím thanh filter ghi Pinia rồi re-render app shell.
- **Đo:** GET trùng vs UI stale sau mutation; số Pinia store chỉ là `items: []` + `fetch`; số render layout khi table paginate.

**Vuex (legacy 30s)**

Component `dispatch` một **action**. Action làm I/O, rồi `commit` một **mutation**. Mutation sync và là writer duy nhất. Getter là derived state được cache. Log đó là lý do Vuex DevTools time-travel được.

**Pinia (cái bạn ship)**

Component gọi **action** (hoặc, field tầm thường, gán). State là reactive object. Getter là `computed` cấp store. Không có tầng mutation trừ khi bạn thêm policy.

**Colocation vs “flow”**

Sơ đồ flow không nói **store nào**. Rule thì có:

1. Chỉ một SFC cần → `ref` / `reactive`.
2. URL đã biểu diễn (page, tab, sort, filter) → **router query / params**, không Pinia.
3. Nhiều component trên một view share UI ephemeral → provide/inject hoặc store **phạm vi view** bạn dispose.
4. Client state cả session (auth, theme, cart) → Pinia.
5. Server sở hữu → query / `useAsyncData`, invalidate lúc mutation.

**Tradeoff**

| Nhà | Độ tươi | Share | SSR |
|---|---|---|---|
| Component | Bạn sở hữu | Không | Dễ |
| URL | Bookmark được | Xuyên refresh | Tự nhiên |
| Pinia | Tới khi bạn ghi | Cả app | Phải hydrate ([7.6](#76-ssr-hydration-của-store)) |
| Query / `useAsyncData` | TTL / refresh | Theo key | Payload |

**Gotcha production**

- Getter trả array mới mỗi lần (`state.list.filter(...)`) buộc update thừa; giống vấn đề identity `computed` Vue.
- Vuex `subscribe` / Pinia `$subscribe` cho persist có thể ghi **mọi** patch kể cả SSR — gate client và debounce.
- Người cuồng “single flow” `dispatch` để toggle tooltip.

**Câu hỏi nối**

- Invalidate server cache sau Pinia action POST (bạn gọi `refreshNuxtData` / `queryClient.invalidateQueries`, không lấy `store.items.push` làm source of truth).
- Optimistic UI: overlay trong component/store, rollback lúc lỗi, server cache vẫn authoritative.
- Xem [7.7](#77-server-cache-vs-client-store).

---

### 7.3. When to Use Global vs Local State

**Họ thực sự hỏi gì**

Không phải “nhiều component cần → global.” Họ muốn **auth/theme vs form draft**, và **URL làm source of truth cho filter**.

**Cách senior trả lời**

- **Quyết định:** Global (Pinia / `useState`) cho data **hình session**: identity auth, theme, locale, cart, feature flag. Local (`ref`) cho **form draft, hover, flag tạm**. Filter, pagination, tab chọn, sort → **URL** trừ khi thật sự secret hoặc quá lớn. Refresh nên reset thì nó không phải global.
- **Ràng buộc:** Subscription global là **fan-out**. Store global nói nhiều là bug perf render. Độ dài URL và encoding giới hạn serialize filter; một số UI cần “saved view” trên Pinia/server.
- **Failure mode:** Form draft trong Pinia để keep-alive miss không mất — rồi hai tab đè nhau và logout phải nhớ `$reset`. Filter chỉ trong component state → nút back đánh nhau với table. Auth chỉ trong memory → F5 logged out.
- **Đo:** Re-render tình cờ `App.vue` (`storeToRefs` store béo). Ticket support: “filter biến mất” vs “link không mở cùng view.”

**Auth / theme**

- Auth: Pinia + **session cookie** (SSR). Store giữ **user đã hydrate**, không phải access token nếu token có thể httpOnly.
- Theme: Pinia hoặc `useState` + class trên `<html>`, persist localStorage **trên client** sau paint để tránh mismatch (hoặc set cookie để SSR khớp).

**Form draft**

- Local trước. `keep-alive` nếu user kỳ vọng tab-back. Pinia chỉ cho **wizard nhiều route** (`useCheckoutDraftStore`) với discard tường minh và tuổi `max`. Đừng nhét mọi `<input>` vào global store.

**URL làm source of truth**

Search, filter, page, `sort`, entity id đang chọn: `route.query` / `route.params`. Component đọc router, không mirror vào Pinia trừ khi cần bit derived chỉ-client. Link share được và nút back miễn phí.

```ts
// Filters live in the URL; Pinia is not in this path.
const router = useRouter()
const route = useRoute()
const page = computed(() => Number(route.query.page ?? 1))
function setPage(p: number) {
  router.replace({ query: { ...route.query, page: String(p) } })
}
```

**Tradeoff**

| Loại | Local | URL | Pinia |
|---|---|---|---|
| Modal mở | Default | Hiếm (`?modal=`) | Nếu nhiều trigger xa |
| Filter table | Không | Default | Saved view |
| Draft wizard | Nếu một page | Xấu | Nhiều route |
| Auth user | Không | Không | Default |

**Gotcha production**

- Ghi URL mỗi phím typeahead: debounce `replace`, hoặc giữ draft local rồi commit lúc submit.
- `router.push` vs `replace` cho filter — `push` nhồi history page=1,2,3.
- Boolean “loading” global trong Pinia: mọi fetch bật spinner cả app. Ưu tiên pending **per-query**.

**Câu hỏi nối**

- Restore form sau OAuth redirect (sessionStorage, không Pinia).
- `provide/inject` vs Pinia store nhỏ cho subtree (ưu tiên provide; xem [vue3 provide](./vue3.md#526-provide--inject)).
- Vì sao `useState('x')` trong Nuxt là global theo request, không phải “Pinia-lite cho mọi thứ.”

---

### 7.4. Vuex: commit vs dispatch

**Họ thực sự hỏi gì**

Câu Vuex 30 giây, rồi bạn còn tách vậy không. Kết senior: **trong Pinia ta không tách mutation và action.**

**Cách senior trả lời**

- **Quyết định (Vuex):** `commit` **mutation** cho đổi state sync; `dispatch` **action** cho async, I/O, và thứ có thể fail. Component gần như luôn `dispatch`. Mutation không được `await`.
- **Ràng buộc:** Time-travel Vuex DevTools phụ thuộc **mutation thuần, sync**. Async trong mutation gãy log và race. Đó là lý do tách tồn tại — không phải vì JavaScript cần hai loại hàm.
- **Failure mode:** `async FETCH` trong `mutations` (bug junior kinh điển). Hoặc component `commit` từ năm chỗ nên invariant (ví dụ “cart line qty ≥ 1”) rải rác.
- **Đo:** App Vuex: độ thuần mutation lúc code review; app Pinia: bạn **không** tái tạo tách này trừ khi cần plugin audit.

**Vuex 30 giây**

```
dispatch('fetchUser') → action (async) → commit('SET_USER', user) → mutation (sync) → state
```

`commit` không trả gì hữu ích. `dispatch` trả Promise của action. `dispatch` lồng là cách Vuex orchestrate.

**Trong Pinia ta không tách**

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

Không có `commit`. Action **chính là** writer. Team muốn traceability thì dùng named action + Pinia plugin, không phải tầng mutation giả.

**Tradeoff**

- Tách Vuex: time-travel tốt hơn, boilerplate nhiều hơn, TS đau.
- Action Pinia: ít nghi lễ, bạn vẫn viết được component lộn xộn patch state trực tiếp — **convention** thay compiler.

**Gotcha production**

- Vuex 4 + Vue 3: người ta vẫn copy Vue 2 `this.$store.commit` trong `setup` không `useStore()`.
- Pinia: `store.$patch` trong component để “tránh action” ổn cho one-liner; không ổn cho invariant nhiều field.
- Return data từ Vuex action vs luôn đọc state — nhất quán không thì caller race.

**Câu hỏi nối**

- Vì sao Vuex mutation không async được (devtools + predictability), không phải “vì Vue bảo vậy.”
- Implement undo trong Pinia không mutation (command stack trong store).
- Ghi xuyên store: section sau.

---

### 7.5. Dispatch vs Actions (Vuex)

**Họ thực sự hỏi gì**

Heading là trivia Vuex (`dispatch` **gọi** một `action`). Đừng lặp [7.4](#74-vuex-commit-vs-dispatch). Bản senior là **orchestrate nhiều store**: ai gọi ai, và **circular store dependency**.

**Cách senior trả lời**

- **Quyết định:** Vuex: `dispatch('cart/add')` / `dispatch('user/logout', null, { root: true })` là cách module nói chuyện. Pinia: gọi `useOtherStore()` **trong action**, không ở top level setup store. Sở hữu một **hướng**: `auth` được reset `cart`; `cart` không được hydrate `auth`. Event cả app (logout): action riêng trên store **owner** mà store khác **register**, hoặc `resetAll()` tường minh trong một composer, thắng mạng import.
- **Ràng buộc:** Pinia cho `useFooStore()` lúc `defineStore` setup, nhưng nếu `foo` import `bar` và `bar` import `foo`, **một trong hai là `undefined` lần gọi đầu**. Module Vuex có namespace cùng cycle qua `dispatch`. Cycle là bug kiến trúc, không phải bug library.
- **Failure mode:** `useCartStore()` ở top setup `useUserStore`, và ngược lại — chạy trong test import cart trước, nổ theo thứ tự production chunk. Hoặc mọi store `dispatch` `loading/start` trên god UI store.
- **Đo:** Graph dependency lời gọi `useXStore` (kể cả grep). Logout phải clear **mọi** store theo user trong một test. Warning circular import ở bundler.

**One-liner Vuex (để không lạc)**

`dispatch` là **lời gọi**; **action** là **hàm**. Đó là toàn bộ khác biệt. Orchestration là `dispatch` action khác, kể cả module khác.

**Orchestration Pinia**

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

Nếu `useCartStore` cũng gọi `useAuthStore()` lúc **setup**, bạn có cycle. Giữ **setup function không side-effect**. Dùng `storeToRefs` trong component; trong store, gọi store kia **lazily**.

**Phá cycle**

1. Invert: cả hai store nhận lệnh từ **component** hoặc `useSessionStore` thứ ba đã sở hữu workflow.
2. Event: `auth.$onAction` trong plugin register **sau** khi cả hai tồn tại (vẫn dễ lạm dụng).
3. Module **pure** share (`resetClientState(pinia)`) `$reset` list đã biết — xấu, tường minh, test được.
4. Đừng giấu cycle sau Vuex `root` dispatch; bạn chỉ biến nó thành stringly typed.

**Tradeoff**

- `useOtherStore()` trực tiếp trong action: đơn giản, có thể dệt graph.
- Store composer/facade: một chỗ đọc, thêm tầng.
- Domain event: decouple, khó trace trên whiteboard interview.

**Gotcha production**

- Gọi `useXStore()` ngoài `setup` / context `pinia` active (module TS thuần, `setTimeout` sau test) thì throw. Truyền `pinia` hoặc gọi từ action.
- `$reset()` không chạy teardown custom (websocket). Ghép action `dispose()` mà composer gọi.
- Vuex `subscribeAction` vs Pinia `$onAction` — cả hai recurse nếu hook dispatch cùng action.

**Câu hỏi nối**

- Test logout đụng bốn store (`setActivePinia(createPinia())`, rồi assert từng cái).
- Store có nên import API client (có) hay Vue Router (tiết chế; navigation từ store bất ngờ người ta).
- Pinia circular + auto-import: cycle vẫn đó ([vue3 auto-import](./vue3.md#513-auto-import-components)).

---

### 7.6. SSR hydration của store

**Họ thực sự hỏi gì**

“Pinia đi từ server sang client thế nào?” Họ muốn **instance per-request**, **payload**, và **cái bạn không được persist**.

**Cách senior trả lời**

- **Quyết định:** Tạo **một Pinia mỗi SSR request**. Serialize store client vẫn cần vào payload Nuxt/Vue. Trên client, **install cùng state trước first paint** để hydration khớp. Ưu tiên **module Pinia Nuxt chính thức** hơn `window.__PINIA__` tự roll.
- **Ràng buộc:** Mọi thứ trong store cuối SSR có thể **nằm trong HTML**. Đừng nhét token, dump PII, hoặc list 2 MB. Client plugin re-fetch auth trước hydrate có thể **đè** server state và lệch.
- **Failure mode:** `const pinia = createPinia()` ở module scope — cart user A trong response user B. Hoặc hydrate sau `onMounted` — Vue đã hydrate DOM với default. Hoặc `localStorage` đè payload (flash theme, flash logged-out).
- **Đo:** Hai SSR request song song session khác trong test. Key/size payload. Warning hydration trên page đọc store trong `setup`.

**SPA vs Nuxt**

- Vite SPA: không SSR, không chuyện hydrate. `createPinia()` một lần trong `main.ts`.
- SSR custom: `renderToString(app)` với pinia tươi; gửi `pinia.state.value`; client `pinia.state.value = window.__STATE__`.
- Nuxt: `@pinia/nuxt` làm việc này. Bạn vẫn không được leak.

**Nhét gì vào store serialize**

- Có: profile user **public** đã dùng trong HTML, feature flag đã gate SSR, **id** cart nếu header render count.
- Không: refresh token, full ACL matrix, list `useAsyncData` nhân đôi (payload đã có — xem [7.7](#77-server-cache-vs-client-store)).

**Tradeoff**

- Serialize hết: dễ khỏi mismatch, HTML khổng lồ, dễ dính secret.
- Serialize không gì, refetch client: đơn giản, flash, thêm RTT, có thể lệch nếu HTML đã giả định data.
- Serialize **session tối thiểu** + để query sở hữu phần còn lại: default production.

**Gotcha production**

- `store.$state` gồm function? Không nên — nhét class instance vào state thì serialize chết hoặc hydrate thành plain object (`markRaw` + đừng SSR nó).
- Date object thành string. Decode trong hydrate hook hoặc store ISO string.
- Pinia plugin chỉ-client (persist) phải chạy **sau** apply payload không thì chúng clobber.

**Câu hỏi nối**

- `useState` vs Pinia cho một flag SSR (useState nhẹ hơn; Pinia nếu có behavior).
- Vuex `replaceState` map sang Pinia `state.value =` thế nào.
- Test: `createTestingPinia({ initialState })` vs round-trip payload thật.

---

### 7.7. Server cache vs client store

**Họ thực sự hỏi gì**

Punchline cả topic: **đừng dùng Pinia làm HTTP cache.** Họ muốn tách sắc và câu chuyện mutation.

**Cách senior trả lời**

- **Quyết định:** **Server cache** (`useAsyncData` / `useFetch` / TanStack Query / SWR) sở hữu **data server nhận ra được**: entity, list, permission refetch được, với **key**, **staleness**, và **invalidation**. **Client store** (Pinia) sở hữu **ý nghĩa chỉ-client**: UX session, draft, selection chưa vào URL, overlay optimistic. Sau POST, **invalidate cache**; đừng “giữ Pinia sync” làm kiến trúc.
- **Ràng buộc:** Hai bản copy `Product` (query + Pinia) **sẽ** lệch. Payload SSR đã là server cache. Nhét cùng blob vào Pinia nhân đôi memory và cost hydration.
- **Failure mode:** `fetchProducts` vào Pinia mọi page, không bao giờ `refreshNuxtData('products')` sau admin edit, user thấy giá stale. Hoặc TanStack Query **và** Pinia cùng list cart.
- **Đo:** Sau mutation, thời gian mọi bề mặt hiện giá trị mới (nên một invalidate, không ba array sync tay). Đếm store tên `useXListStore`.

| Câu hỏi | Server cache | Pinia |
|---|---|---|
| Backend trả cái này được không? | Có | Không (hoặc không phải source of truth) |
| Key + TTL? | Có | Hiếm |
| Cần khi JS tắt HTML? | `useAsyncData` | Chỉ nếu serialize ([7.6](#76-ssr-hydration-của-store)) |
| Sống sót navigation không refetch? | Cache hit | Tới `$reset` |
| Ví dụ | Product detail | “compare tray” các id |

Cart là tranh luận thường. **List id cart** trong Pinia (hoặc cookie) cộng **product detail** từ server cache thì coherent. Cart Pinia nhúng full product object là máy giá stale.

**Invalidation**

```ts
async function renameProduct(id: string, name: string) {
  await $fetch(`/api/products/${id}`, { method: 'PATCH', body: { name } })
  await refreshNuxtData(`product:${id}`)
  await refreshNuxtData('product-list')
}
```

Pinia có thể set `ui.lastSavedAt`. Nó không store product.

**Tradeoff**

- Chỉ query: freshness xuất sắc, loading UI nhiều hơn, phải học key.
- Chỉ store: mental model đơn, stale mặc định, đau SSR.
- Cả hai, có rule: thêm concept, scale được.

**Gotcha production**

- Optimistic update Pinia + POST fail + cache không dùng → bạn invent state thứ ba. Ưu tiên optimistic **trong cache library** (Query) hoặc overlay flag trong Pinia, không phải entity graph thứ hai.
- `useFetch` key đụng xuyên page là bug cache; không phải lý do chuyển data vào Pinia.
- Prefetch vào Pinia trong navigation guard nhân đôi việc `useAsyncData` + payload đã làm trên page sau.

**Câu hỏi nối**

- TanStack Query trong Nuxt: client cache vs payload — ai thắng first paint?
- Field cart nào bạn vẫn giữ trong Pinia trên site e-commerce SSR.
- Map sang bản đôi React ([Query vs Zustand](./state-management-react.md)).

---

[← Back to Overview](../../README.md)
