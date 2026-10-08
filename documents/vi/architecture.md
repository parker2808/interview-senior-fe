# Architecture & Design Patterns

Đây là tài liệu ôn phỏng vấn senior frontend. Họ không chấm bạn thuộc SOLID với `Animal` / `Dog`. Họ muốn biết bạn **cấu trúc app Vue 3 để team còn sửa được**: composable vs God component, state sống ở đâu, khi nào “pattern” chỉ là ngôn ngữ, và **khi nào microfrontend là nước cờ org kèm thuế performance**.

Giữ câu trả lời theo **decision → constraint → failure mode → measure.** Stack mặc định: Vue 3 + TS + Pinia + Nuxt khi SSR/routing/BFF quan trọng.

---

## Table of Contents

1. [Các mẫu Component](#151-các-mẫu-component)

2. [Các mẫu thiết kế](#152-các-mẫu-thiết-kế)

3. [Nguyên tắc SOLID trong Frontend](#153-nguyên-tắc-solid-trong-frontend)

4. [Module Federation & Micro-frontends](#154-module-federation--micro-frontends)

5. [Kiến trúc thư mục và Feature](#155-kiến-trúc-thư-mục-và-feature)

6. [Design System vs Component của App](#156-design-system-vs-component-của-app)

---

## V. Professional Skills

## 15. Architecture & Design Patterns

### 15.1. Các mẫu Component

**Họ thực sự hỏi gì**

- “Presentational vs container — bạn còn làm vậy không?”
- “Share behavior giữa Vue component thế nào?”
- “Slot vs renderless vs composable?”

**Cách senior trả lời**

- **Quyết định:** **Composition + composable + feature folder** là default Vue 3. Component render; composable sở hữu một **use-case** (fetch, permission, form). Bạn vẫn dùng **compound component** (`Tabs`, `Select`, `DataTable.Root`) khi UI là một control với nhiều phần cộng tác. Bạn **không** invent cặp `UserListContainer.vue` + `UserListView.vue` như architecture.
- **Ràng buộc:** Presentational/container là workaround React-Redux 2015 (connect vs dumb). `<script setup>` + composable của Vue đã tách “trông thế nào” khỏi “chạy thế nào” **không cần tầng container**. File thừa chỉ pass props là nghi lễ.
- **Failure mode:** SFC 400 dòng vừa fetch, cache, validate, vừa vẽ chart; global event bus để “decouple” sibling; renderless component lẽ ra phải là composable; design-system `Button` bọc `Button` khác rồi bọc `NuxtLink`.
- **Đo:** thời gian hire mới tìm luồng order-status; kích thước SFC trung bình trong feature; logic fetch bị duplicate; bundle size của barrel “shared components.”

**Presentational vs container đã cũ — cái thay thế**

| Nước cờ cũ | Nước cờ Vue 3 |
| --- | --- |
| `UserListContainer` fetch, pass props | `useUserList()` trong page/feature; page compose UI |
| Mixin để reuse | Composable với **giá trị return tường minh** |
| HOC / render-props | **Slot** (named, scoped) và composable |
| `mapState` khắp nơi | Pinia trong composable, không trong từng button |

Component mỏng vẫn tốt: `OrderStatusBadge` nhận status rồi render. Đó là **lá**, không phải “presentational architecture.” Để cạnh feature hoặc trong design system tùy reuse (15.6).

**Compound component — vẫn hữu ích**

Khi các phần phải share state (tab nào mở, highlight listbox) và **caller** nên compose DOM vì a11y/layout:

```vue
<!-- Decision: state in the root via provide; parts are not independent widgets. -->
<FilterBar>
  <FilterBar.Search v-model="q" />
  <FilterBar.Facet field="status" />
  <FilterBar.Clear />
</FilterBar>
```

Implement bằng typed key `provide`/`inject`, không `this.$parent`. Đừng dùng compound component cho `Card` tĩnh chỉ là markup — đó là slot.

**Slot vs renderless**

- **Slot:** composition native của Vue. Default slot, named slot, scoped slot (`#cell="{ row }"`). Đây là cách table, dialog, và layout shell còn mở để mở rộng (OCP) không cần subclass.
- **Renderless / headless:** chỉ logic (focus trap, listbox keyboard, floating UI) **zero** ý kiến DOM. Trong Vue hôm nay đó là **composable** (`useListbox`) hoặc thư viện headless (Reka UI / kiểu Radix). Renderless component chỉ `slot` ra 12 binding thường là composable bạn mặc áo XML.
- **Đừng** dựng `DataProvider.vue` fetch URL rồi slot `data`/`loading` — đó là `useAsyncData` / TanStack Query.

**Tradeoff**

- Thêm composable vs “40 dòng, để trong SFC.” Extract khi consumer thứ hai xuất hiện **hoặc** SFC không còn đọc được — không phải trên nguyên tắc.
- Compound `provide/inject` vs một `Tabs` với prop `items`. Props thắng khi tập tab là data-driven; compound thắng khi layout đổi theo màn hình.

**Gotcha production**

- Scoped slot tạo closure mới mỗi render → child luôn update (thường ổn trong Vue; vẫn đừng nhét việc nặng vào slot vnode factory).
- Inject không default: `undefined` thầm trong test mount.
- Dùng `Teleport`/`Dialog` không focus trap rồi coi đó là “pattern.”

**Câu hỏi nối**

- Mixin vs composable? (đụng tên, data implicit, untyped — mixin xong rồi)
- Routing sống ở đâu? (page sở hữu composable, không phải badge)

---

### 15.2. Các mẫu thiết kế

**Họ thực sự hỏi gì**

“Bạn dùng design pattern nào trên frontend?” Nếu bắt đầu bằng class diagram Singleton, bạn nghe như junior cầm sách.

**Cách senior trả lời**

- **Quyết định:** Dùng **ngôn ngữ và framework**. Observer là **Vue reactivity** (và query). Strategy là **map các function** (payment, tax, thuật toán feature-flag). “Singleton” là **module scope hoặc Pinia store**. Factory là **CMS type → component**, không phải `AnimalFactory`.
- **Ràng buộc:** Pattern GoF map lên Vue bằng class đi ngược thớ (không, bạn không cần `class EventBus`). Pattern vẫn giúp khi bạn **đặt tên một quyết định** team reuse được.
- **Failure mode:** Global event bus (`mitt` trên `app.config.globalProperties.$bus`) tạo hành động ma từ xa; class Singleton thật sự phá test và SSR (share cart giữa user trên server); cây Strategy với một implementer.
- **Đo:** số event global pub/sub còn sống; store fake được trong test không; thời gian thêm payment method mới.

**Observer = reactivity, không phải event bus**

- Props xuống, emit lên, Pinia, `provide/inject`, query invalidation: những thứ này **là** Observer.
- **Global event bus** là thói quen Vue 2. Vue 3 gỡ `$on`/`$off` khỏi instance **có chủ đích**. `mitt` chấp nhận được như **plugin boundary** (toast design-system từ remote MF, analytics). Không phải cách `OrderTable` nói với `HeaderCart`.
- Nếu cần notification xuyên feature: **domain event trong BFF**, hoặc Pinia store với action tường minh, hoặc query key. Bus event tên `'update'` không search được.

**Strategy = payment, flag, formatter**

```ts
// Decision: add Apple Pay without editing Checkout.vue's 200-line switch.
const processors: Record<PaymentKind, PayFn> = {
  card: payWithCard,
  paypal: payWithPaypal,
  apple: payWithApplePay,
};
export function pay(kind: PaymentKind, input: PayInput) {
  const fn = processors[kind];
  if (!fn) throw new Error(`Unsupported payment: ${kind}`);
  return fn(input);
}
```

Cùng shape cho implementation **feature-flag** (`useCheckout = flag ? useCheckoutV2 : useCheckoutV1`) — nhưng xóa cái cũ (14.4).

**Đừng implement class Singleton**

```ts
// This is the singleton. The module is evaluated once per realm.
export const api = createApiClient();

// Server: create per request / per Nitro event. Never a process-wide "current user".
```

Pinia store là **singleton scoped theo app trên client** và **per-request** trên Nuxt SSR nếu dùng đúng (`useOrderStore()` trong setup). `class Foo { static instance }` sẽ leak user data trên SSR. Test: truyền **fake api** (DIP), đừng reset static giấu.

**Factory thực sự là frontend**

Dynamic Vue component từ **CMS / page builder / form schema**:

```ts
const blocks = {
  hero: () => import("./blocks/Hero.vue"),
  faq: () => import("./blocks/Faq.vue"),
} as const;

export function resolveBlock(type: string) {
  return blocks[type as keyof typeof blocks] ?? fallbackBlock;
}
```

Whitelist type. Không bao giờ `new Function` component từ CMS JSON.

**Analog Decorator**

Vue 3 không decorate class. Wrap composable: `useLoggedFetch`, `useAuthorizedQuery`, `withTimeout`. Đó là pattern; đừng viết `class LoggerDecorator extends HttpClient`.

**Tradeoff**

- Pattern có tên vs “cứ extract function.” Trong phỏng vấn, **chỉ đặt tên khi nó làm rõ quyết định**.
- Pinia vs `ref` cấp module — module `ref` là singleton vụng trên SSR; ưu tiên Pinia hoặc `useState` trong Nuxt.

**Gotcha production**

- Event bus + keep-alive: listener register kép.
- Strategy object đóng over state Pinia stale.
- CMS factory import **tất cả** block tĩnh (main 3MB — 12.3).

**Câu hỏi nối**

- Dùng `EventTarget` thật ở đâu? (browser API, không phải app feature)
- Test strategy map thế nào? (bảng kind → mock gateway kỳ vọng)

---

### 15.3. Nguyên tắc SOLID trong Frontend

**Họ thực sự hỏi gì**

“Áp SOLID vào Vue.” Nếu bạn nhắc animal, họ ngừng nghe.

**Cách senior trả lời**

- **Quyết định:** Coi SOLID là **test cho sự thay đổi**. SRP = extract composable khi component có hai lý do để đổi. DIP = **inject API client** để test và Storybook không đụng network. OCP = slot, registry, flag — không `extends BaseButton`. LSP = đừng ship `FilterSelect` không thực sự là form control. ISP = đừng đổ 40 props lên `Table`.
- **Ràng buộc:** Đây là nguyên tắc OO. JS module và Vue SFC đã cho bạn đường may. Over-apply (20 file cho một badge) mới là thất bại, không phải “chưa đủ SOLID.”
- **Failure mode:** God page; `fetch` hard-code trong 15 component; thang `v-if` cho mọi client mới; cây subclass `BaseWidget`; props mà nửa call site bỏ qua.
- **Đo:** số file đụng mỗi ticket điển hình, mock được `useOrders` không, số prop trên shared component, defect tụ trong một SFC.

**S — Single Responsibility**

`Checkout.vue` không nên fetch cart, validate VAT, nói chuyện payment, và vẽ stepper.

- `useCart()`, `useVat(country)`, `usePayment(strategy)`, presentational `OrderSummary`.
- Một composable, một lý do đổi: luật thuế vs Stripe API vs layout.

**O — Open/Closed**

Mở để mở rộng qua **slot, registry, variant**, đóng với “sửa switch 800 dòng.”

- CMS block mới: thêm vào factory map (15.2), đừng sửa ruột `Renderer.vue`.
- Look button mới: variant design-token, không subclass qua Options API `extends` (Vue `extends` là bẫy; composition hơn inheritance).

**L — Liskov Substitution**

Nếu app nhận `MenuButton`, thứ bạn truyền phải **cư xử như button**: keyboard, disabled, form submit, accessibility name.

- Anti-LSP: `<div @click>` style như button, rồi dùng trong form.
- Anti-LSP: `VirtualTable` throw trừ khi bạn pass `getRowId`, trong khi `Table` thì không — chúng không cùng type; đừng share interface sai.
- Nuxt: component chỉ chạy trên client (`window`) nhưng dùng trong SSR page không `<ClientOnly>` — không substitutable trong cây.

**I — Interface Segregation**

- Đừng bắt mọi `ListItem` implement prop drag, multi-select, và swipe-archive.
- Tách `useListQuery` vs `useListSelection` vs `useListDnd`.
- TS: nhiều type nhỏ (`Pick`, props interface riêng), không `User` 60 field mà badge chỉ cần `name`.

**D — Dependency Inversion**

```ts
export function useOrders(api: OrderApi = defaultApi) {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => api.listOrders(),
  });
}

// tests: useOrders(fakeApi)
// Nuxt: provide/inject or plugin $api — never `new AxiosClient()` inside the composable
```

Abstraction là **function/interface**, không phải abstract class. Storybook: inject fixture client.

**Tradeoff**

- Thêm đường may vs YAGNI. Senior extract **ở consumer thứ hai hoặc test đầu tiên bị đau**.
- DIP mọi thứ vs hard-code `$fetch` trong app một backend — vẫn inject trong test qua Nuxt mock.

**Gotcha production**

- “SRP” dùng để biện minh 1:1 file:function không public API, nên không gì move được.
- DIP qua service locator (`container.get('x')`) là Singleton trên server.

**Câu hỏi nối**

- Tương tác Pinia thế nào? (store gọi injected api, không `fetch` trong action)
- Vuex có vi phạm SRP không? (god store — có, vì vậy module/Pinia store theo domain)

---

### 15.4. Module Federation & Micro-frontends

**Họ thực sự hỏi gì**

“Có nên làm microfrontend không?” Default của senior là **không**, cho đến khi independent deploy **và** ranh giới team **ép** phải làm.

**Cách senior trả lời**

- **Quyết định:** Microfrontend là giải pháp **tổ chức**: nhiều team, lịch release khác, đôi khi stack khác. Không phải pattern scale cho 8 developer Vue. Ưu tiên **monorepo với package** (design system, `ui`, `domain-orders`) và một deploy cho đến khi cái đó cháy.
- **Ràng buộc:** User vẫn có **một document, một tab order, một auth cookie, một ngôn ngữ design**. Tách build không tách những bài toán đó — nó nhân chúng.
- **Failure mode:** Hai runtime Vue; CSS leak; design token duplicate; vòng SSO auth; nested app inaccessible; tải JS 4×; team “độc lập” vẫn bị kẹt ở shell.
- **Đo:** số independent deploy mỗi tuần **không** cần phối hợp shell, LCP/INP vs monolith, byte framework duplicate, số incident ở đường may (auth, routing, a11y).

**Chi phí bạn phải nêu tên**

- **Perf:** thêm runtime, thêm round trip cho `remoteEntry`, cache tệ hơn nếu shared dep không singleton.
- **Versioning:** host Vue 3.4, remote 3.5, Pinia lệch — crash runtime.
- **A11y:** focus khi route xuyên remote, title, skip link, live region — không ai sở hữu document.
- **Auth:** cookie, refresh (18.1), CSRF, iframe third-party cookie.
- **Design system:** phải là **package có version** (hoặc remote mọi người pin). Nếu không Button mỗi team trôi.

**Lựa chọn (không chỉ Module Federation)**

| Approach | Independent deploy | Isolation | Cost |
| --- | --- | --- | --- |
| **Monorepo package** | Không (trừ khi publish) | Shared runtime | Thấp nhất. Default. |
| **Module Federation** (Webpack/Rspack; Vite qua plugin) | Có | Shared runtime nếu `shared` đúng | Cao. Coupling runtime thật. |
| **Web component** | Có | Style isolation tốt hơn; vẫn một thế giới JS | API vụng với Vue; đau a11y/form |
| **iframe** | Có | Isolation mạnh nhất (CSS, JS, crash) | UX/a11y/SEO/resize/auth tệ nhất; dùng cho **untrusted** hoặc admin legacy |
| **SPA tách** + hard navigation | Có | Toàn bộ | Chấp nhận được cho product thực sự tách (`/careers` vs `/app`) |

Vite + MF tồn tại dạng **plugin**; MF production quy mô org vẫn là cuộc nói chuyện **Webpack/Rspack** ([12.1](./build-tools.md#121-vite-vs-webpack)). Đừng pitch Vite MF như đã xong.

**Khi bạn nói có**

- Nhiều product team (hàng chục engineer), ranh giới org **cứng**, cadence release khác, và platform team sở hữu **shell, auth, observability, design system**.
- App React thâu tóm bạn không rewrite năm nay: iframe hoặc hard navigation trước; MF sau.

**Tradeoff**

- Tự chủ team vs cohesion phía user.
- Vue singleton share (nhỏ hơn, khóa version) vs Vue duplicate (to hơn, team “tự do”).

**Gotcha production**

- `shared: { vue: { singleton: true } }` trong khi remote vẫn bundle Vue riêng.
- CSS order đánh nhau; Shadow DOM phá form participation.
- Shell routing và remote routing đều nghĩ mình sở hữu history.
- Sentry không có câu chuyện **common release**.

**Câu hỏi nối**

- Share type thế nào? (package contract published)
- Test thế nào? (contract + shell e2e; đừng unit-test URL remoteEntry)

---

### 15.5. Kiến trúc thư mục và Feature

**Họ thực sự hỏi gì**

“Cho xem folder structure.” Họ nghĩ đó là architecture. Đưa **cây ngắn**, rồi nói **boundary**.

**Cách senior trả lời**

- **Quyết định:** **Feature folder** là trục chính (`features/orders/`, `features/auth/`), không phải bãi rác `components/`, `helpers/`, `services/`. Mỗi feature expose **public API nhỏ** (`index.ts`: route, vài component, composable). Shared kernel mỏng: primitive design-system, `lib/http`, `lib/dates`.
- **Ràng buộc:** Folder structure là công cụ **discoverability**. Architecture là **ai import được ai, cái gì deploy độc lập, cái gì fail một mình**. Xem [16.1](./system-design.md#161-quyết-định-kiến-trúc-frontend).
- **Failure mode:** `components/common/utils` bị mọi thứ import (nam châm cycle); feature import **ruột sâu** của feature khác; Nuxt `auto-import` 200 composable đụng tên; “layer” chỉ là thêm folder.
- **Đo:** cạnh trên dependency graph (madge / ngr), % PR ở lại trong một feature, circular import.

Phác thảo (thân thiện Nuxt):

```
app/
  features/
    orders/
      components/          # OrderTable, not Button
      composables/useOrders.ts
      api/orders.api.ts
      types.ts
      index.ts             # public API
    checkout/
  shared/
    ui/                    # app-level composites, not the DS package
    lib/http.ts
  pages/                   # thin: compose features
packages/ui/               # design system (15.6)
```

Rule bạn thực sự enforce (ESLint `import/no-restricted-paths` hoặc Nx tag):

- `pages` được import public API `features/*`.
- `orders` không được import ruột `checkout/components/Foo.vue`.
- `shared` không được import feature.

Nuxt **layer** (hoặc pnpm package) cho: white-label brand, “admin vs public,” hoặc extract design system. Không phải cho mọi feature.

**Tradeoff**

- Feature folder vs atomic design (`atoms/molecules`) — atomic design như **scheme folder** fail khi scale; token/primitive thuộc package DS.
- Colocate test/story cạnh SFC vs `__tests__/`. Colocation thắng cho feature.

**Gotcha production**

- Barrel `features/orders/index.ts` re-export widget nặng → sync import tình cờ (12.3).
- Auto-imported composable tên generic (`useUser`) từ hai feature.

**Câu hỏi nối**

- Pinia store sống ở đâu? (trong feature, không `/stores` cho domain state)
- Tách feature quá lớn thế nào? (subdomain, không “chuyển sang microfrontend”)

---

### 15.6. Design System vs Component của App

**Họ thực sự hỏi gì**

“`OrderTable` có nằm trong design system không?”

**Cách senior trả lời**

- **Quyết định:** **Design system** = token + primitive accessible + pattern **không có product domain** (`Button`, `TextField`, `Dialog`, vỏ `DataTable`). **App component** = domain (`OrderTable`, `VatField`, `CheckoutStepper`). Nếu cần order id, đó không phải DS component.
- **Ràng buộc:** Nhiều app (Nuxt marketing, Vue admin, có thể React sau) nên consume **một package có version**. DS cố ý đổi chậm hơn.
- **Failure mode:** Publish cả app như “library”; DS kéo Pinia hoặc `$fetch`; phá padding Button trong bản patch; theme bằng deep selector vào ruột.
- **Đo:** thời gian update token xuyên app, vi phạm a11y trên primitive, breakage downstream mỗi DS release, adoption (% button không phải local fork).

Ownership: **platform hoặc DS team** (hoặc guild luân phiên) với process published: RFC, visual test, semver, changelog. App consume pin version; họ không sửa `node_modules`. **Dark launch** `Button` v2 sau class/flag trong DS, migrate app, rồi xóa v1 — đừng phá mọi người vào Friday.

Chi tiết versioning, token, và a11y thuộc [16.3](./system-design.md#163-thiết-kế-component-library); ở đây điểm phỏng vấn là **boundary**.

**Tradeoff**

- Một mega DS vs primitive nhỏ + app pattern. Bắt đầu nhỏ.
- CSS variable vs TS theme object — variable thắng cho dark mode và SSR.

**Gotcha production**

- Vue duplicate trong bundle DS (peerDependency `vue`, đừng bundle nó).
- App “wrapper component” đóng băng DS props và chặn upgrade.

**Câu hỏi nối**

- DS có được gồm `NuxtLink` đặc thù Nuxt không? (adapter package, không phải core primitive)
- Chặn fork thế nào? (lint, code review, inventory)

---

[← Back to Overview](../../README.md)
