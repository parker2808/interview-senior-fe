# Architecture & Design Patterns

This is senior frontend interview prep. They are not scoring you on reciting SOLID with `Animal` / `Dog`. They want to know whether you **structure Vue 3 apps so teams can change them**: composables vs God components, where state lives, when a “pattern” is just the language, and **when microfrontends are an org move with a performance tax**.

Keep answers in **decision → constraint → failure mode → measure.** Default stack: Vue 3 + TS + Pinia + Nuxt when SSR/routing/BFF matter.

---

## Table of Contents

1. [Component Patterns](#151-component-patterns)

2. [Design Patterns](#152-design-patterns)

3. [SOLID Principles in Frontend](#153-solid-principles-in-frontend)

4. [Module Federation & Micro-frontends](#154-module-federation-micro-frontends)

5. [Folder and Feature Architecture](#155-folder-and-feature-architecture)

6. [Design System vs App Components](#156-design-system-vs-app-components)

---

## V. Professional Skills

## 15. Architecture & Design Patterns

### 15.1. Component Patterns

**What they actually ask**

- “Presentational vs container — do you still do that?”
- “How do you share behavior between Vue components?”
- “Slots vs renderless vs composables?”

**How a senior answers**

- **Decision:** **Composition + composables + feature folders** is the Vue 3 default. A component renders; a composable owns a **use-case** (fetch, permissions, form). You still use **compound components** (`Tabs`, `Select`, `DataTable.Root`) when the UI is one control with multiple collaborating parts. You do **not** invent `UserListContainer.vue` + `UserListView.vue` pairs as architecture.
- **Constraint:** Presentational/container was a React-Redux 2015 workaround (connect vs dumb). Vue’s `<script setup>` + composables already split “how it looks” from “how it works” **without a container layer**. Extra files that only pass props are ceremony.
- **Failure mode:** 400-line SFCs that fetch, cache, validate, and draw charts; global event bus to “decouple” siblings; renderless components that should have been a composable; a design-system `Button` wrapping another `Button` wrapping `NuxtLink`.
- **Measure:** time for a new hire to find the order-status flow; average SFC size in a feature; duplicated fetch logic; bundle size of a “shared components” barrel.

**Presentational vs container is dated — what replaced it**

| Old move | Vue 3 move |
| --- | --- |
| `UserListContainer` fetches, passes props | `useUserList()` in the page/feature; page composes UI |
| Mixins for reuse | Composables with **explicit return values** |
| HOC / render-props | **Slots** (named, scoped) and composables |
| `mapState` everywhere | Pinia in the composable, not in every button |

Thin components are still good: `OrderStatusBadge` receives a status and renders. That is a **leaf**, not a “presentational architecture.” Put it next to the feature or in the design system depending on reuse (15.6).

**Compound components — still useful**

When parts must share state (which tab is open, listbox highlight) and the **caller** should compose the DOM for a11y/layout:

```vue
<!-- Decision: state in the root via provide; parts are not independent widgets. -->
<FilterBar>
  <FilterBar.Search v-model="q" />
  <FilterBar.Facet field="status" />
  <FilterBar.Clear />
</FilterBar>
```

Implement with `provide`/`inject` typed keys, not `this.$parent`. Don’t use compound components for a static `Card` that is just markup — that’s a slot.

**Slots vs renderless**

- **Slots:** Vue’s native composition. Default slot, named slots, scoped slots (`#cell="{ row }"`). This is how tables, dialogs, and layout shells stay open for extension (OCP) without subclasses.
- **Renderless / headless:** logic-only (focus trap, listbox keyboard, floating UI) with **zero** DOM opinion. In Vue today that is a **composable** (`useListbox`) or a headless library (Reka UI / Radix-style). A renderless component that only `slot`s out 12 bindings is usually a composable you dressed as XML.
- **Don’t** build a `DataProvider.vue` that fetches a URL and slots `data`/`loading` — that is `useAsyncData` / TanStack Query.

**Tradeoffs**

- Extra composable vs “it’s 40 lines, leave it in the SFC.” Extract when a second consumer appears **or** the SFC is no longer readable — not on principle.
- Compound `provide/inject` vs a single `Tabs` with a `items` prop. Props win when the set of tabs is data-driven; compound wins when layout varies per screen.

**Production gotchas**

- Scoped slots creating new closures every render → child always updates (usually fine in Vue; still don’t put heavy work in the slot vnode factory).
- Inject without default: silent `undefined` in a test mount.
- Using `Teleport`/`Dialog` without a focus trap and treating it as a “pattern.”

**Follow-ups**

- Mixins vs composables? (name clashes, implicit data, untyped — mixins are done)
- Where does routing live? (page owns the composable, not the badge)

---

### 15.2. Design Patterns

**What they actually ask**

“Which design patterns do you use in frontend?” If you start with Singleton class diagrams, you sound junior-with-a-book.

**How a senior answers**

- **Decision:** Use the **language and framework**. Observer is **Vue reactivity** (and queries). Strategy is **a map of functions** (payments, tax, feature-flagged algorithms). “Singleton” is **module scope or a Pinia store**. Factory is **CMS type → component**, not `AnimalFactory`.
- **Constraint:** GoF patterns mapped onto Vue as classes fight the grain (no, you don’t need `class EventBus`). Patterns still help when you **name a decision** the team can reuse.
- **Failure mode:** Global event bus (`mitt` on `app.config.globalProperties.$bus`) creating spooky action at a distance; true Singleton class that breaks tests and SSR (shared cart across users on the server); Strategy hierarchy with one implementer.
- **Measure:** number of global pub/sub events still alive; whether stores are fakeable in tests; time to add a new payment method.

**Observer = reactivity, not an event bus**

- Props down, emits up, Pinia, `provide/inject`, query invalidation: these **are** Observer.
- A **global event bus** was a Vue 2 habit. Vue 3 removed `$on`/`$off` from the instance **on purpose**. `mitt` is acceptable as a **plugin boundary** (design-system toast from a remote MF, analytics). It is not how `OrderTable` talks to `HeaderCart`.
- If you need cross-feature notification: **domain event in the BFF**, or a Pinia store with a explicit action, or a query key. Bus events named `'update'` are unsearchable.

**Strategy = payments, flags, formatters**

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

Same shape for **feature-flagged** implementations (`useCheckout = flag ? useCheckoutV2 : useCheckoutV1`) — but delete the old one (14.4).

**Don’t implement a Singleton class**

```ts
// This is the singleton. The module is evaluated once per realm.
export const api = createApiClient();

// Server: create per request / per Nitro event. Never a process-wide "current user".
```

Pinia stores are **app-scoped singletons on the client** and **per-request** on Nuxt SSR if you use them correctly (`useOrderStore()` inside setup). A `class Foo { static instance }` will leak user data on SSR. Tests: pass a **fake api** (DIP), don’t reset a hidden static.

**Factory that is actually frontend**

Dynamic Vue components from a **CMS / page builder / form schema**:

```ts
const blocks = {
  hero: () => import("./blocks/Hero.vue"),
  faq: () => import("./blocks/Faq.vue"),
} as const;

export function resolveBlock(type: string) {
  return blocks[type as keyof typeof blocks] ?? fallbackBlock;
}
```

Whitelist types. Never `new Function` a component from CMS JSON.

**Decorator analog**

Vue 3 doesn’t decorate classes. Wrap composables: `useLoggedFetch`, `useAuthorizedQuery`, `withTimeout`. That is the pattern; don’t write `class LoggerDecorator extends HttpClient`.

**Tradeoffs**

- Named patterns vs “we just extract functions.” In interviews, **name them only when it clarifies the decision**.
- Pinia vs module-level `ref` — module `ref` is a singleton that is awkward on SSR; prefer Pinia or `useState` in Nuxt.

**Production gotchas**

- Event bus + keep-alive: listeners double-register.
- Strategy objects closing over stale pinia state.
- CMS factory importing **all** blocks statically (3MB main — 12.3).

**Follow-ups**

- Where would you use an actual `EventTarget`? (browser APIs, not app features)
- How do you test a strategy map? (table of kind → expected gateway mock)

---

### 15.3. SOLID Principles in Frontend

**What they actually ask**

“Apply SOLID to Vue.” If you mention animals, they stop listening.

**How a senior answers**

- **Decision:** Treat SOLID as **tests for change**. SRP = extract a composable when a component has two reasons to change. DIP = **inject the API client** so tests and Storybook don’t hit the network. OCP = slots, registries, flags — not `extends BaseButton`. LSP = don’t ship a `FilterSelect` that isn’t actually a form control. ISP = don’t dump 40 props on `Table`.
- **Constraint:** These are OO principles. JS modules and Vue SFCs already give you seams. Over-applying (20 files for a badge) is the failure, not “not SOLID enough.”
- **Failure mode:** God page; hard-coded `fetch` in 15 components; `v-if` ladders for every new client; a `BaseWidget` subclass tree; props that half the call sites ignore.
- **Measure:** files touched per typical ticket, mockability of `useOrders`, prop-count on shared components, defect clustering in one SFC.

**S — Single Responsibility**

`Checkout.vue` should not fetch cart, validate VAT, talk to payments, and draw the stepper.

- `useCart()`, `useVat(country)`, `usePayment(strategy)`, presentational `OrderSummary`.
- One composable, one reason to change: tax law vs Stripe API vs layout.

**O — Open/Closed**

Open to extension via **slots, registries, variants**, closed to “edit the 800-line switch.”

- New CMS block: add to the factory map (15.2), don’t edit `Renderer.vue` internals.
- New button look: design-token variant, not a subclass via Options API `extends` (Vue `extends` is a trap; composition over inheritance).

**L — Liskov Substitution**

If the app accepts a `MenuButton`, anything you pass must **behave like a button**: keyboard, disabled, form submit, accessibility name.

- Anti-LSP: `<div @click>` styled as a button, then used inside forms.
- Anti-LSP: `VirtualTable` that throws unless you pass `getRowId`, while `Table` doesn’t — they are not the same type; don’t share an incorrect interface.
- Nuxt: a component that only works on client (`window`) but is used in SSR pages without `<ClientOnly>` — not substitutable in the tree.

**I — Interface Segregation**

- Don’t require every `ListItem` to implement drag, multi-select, and swipe-archive props.
- Split `useListQuery` vs `useListSelection` vs `useListDnd`.
- TS: many small types (`Pick`, dedicated props interfaces), not `User` with 60 fields of which the badge needs `name`.

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

The abstraction is a **function/interface**, not an abstract class. Storybook: inject a fixture client.

**Tradeoffs**

- Extra seams vs YAGNI. Seniors extract **at the second consumer or the first test that hurts**.
- DIP everything vs hard-coding `$fetch` in one app that has a single backend — still inject in tests via Nuxt mock.

**Production gotchas**

- “SRP” used to justify 1:1 file:function with no public API, so nothing can move.
- DIP via a service locator (`container.get('x')`) that is a Singleton on the server.

**Follow-ups**

- How does this interact with Pinia? (store calls injected api, not `fetch` in actions)
- Is Vuex a violation of SRP? (god store — yes, that’s why modules/Pinia stores per domain)

---

### 15.4. Module Federation & Micro-frontends

**What they actually ask**

“Should we do microfrontends?” The senior default is **no**, until independent deploy **and** team boundaries **force** it.

**How a senior answers**

- **Decision:** Microfrontends are an **organizational** solution: multiple teams, different release clocks, sometimes different stacks. They are not a scalability pattern for 8 Vue developers. Prefer a **monorepo with packages** (design system, `ui`, `domain-orders`) and one deploy until that burns.
- **Constraint:** The user still has **one document, one tab order, one auth cookie, one design language**. Splitting the build does not split those problems — it multiplies them.
- **Failure mode:** Two Vue runtimes; CSS leaks; duplicate design tokens; auth SSO loops; inaccessible nested apps; 4× JS download; “independent” teams blocked on the shell anyway.
- **Measure:** independent deploys per week **without** shell coordination, LCP/INP vs the monolith, duplicate-framework bytes, incident count at the seams (auth, routing, a11y).

**Costs you must name**

- **Perf:** extra runtime, extra round trips for `remoteEntry`, worse caching if shared deps aren’t singleton.
- **Versioning:** host on Vue 3.4, remote on 3.5, Pinia mismatch — runtime crashes.
- **A11y:** focus when routing across remotes, title, skip links, live regions — nobody owns the document.
- **Auth:** cookies, refresh (18.1), CSRF, iframe third-party cookies.
- **Design system:** must be a **versioned package** (or a remote everyone pins). Otherwise every team’s Button drifts.

**Options (not just Module Federation)**

| Approach | Independent deploy | Isolation | Cost |
| --- | --- | --- | --- |
| **Monorepo packages** | No (unless you publish) | Shared runtime | Lowest. Default. |
| **Module Federation** (Webpack/Rspack; Vite via plugins) | Yes | Shared runtime if `shared` is right | High. Real coupling at runtime. |
| **Web components** | Yes | Style isolation better; still one JS world | API is awkward for Vue; a11y/forms pain |
| **iframes** | Yes | Strongest isolation (CSS, JS, crashes) | Worst UX/a11y/SEO/resize/auth; use for **untrusted** or legacy admin |
| **Separate SPAs** + hard navigations | Yes | Total | Acceptable for truly separate products (`/careers` vs `/app`) |

Vite + MF exists as **plugins**; production MF at org scale is still a **Webpack/Rspack** conversation ([12.1](./build-tools.md#121-vite-vs-webpack)). Don’t pitch Vite MF as solved.

**When you would say yes**

- Multiple product teams (dozens of engineers), **hard** org boundaries, different release cadences, and a platform team to own the **shell, auth, observability, design system**.
- Acquired React app you will not rewrite this year: iframe or hard navigation first; MF second.

**Tradeoffs**

- Team autonomy vs user-facing cohesion.
- Shared Vue singleton (smaller, version-locked) vs duplicate Vue (bigger, teams “free”).

**Production gotchas**

- `shared: { vue: { singleton: true } }` while remotes bundled their own Vue anyway.
- CSS order fights; Shadow DOM breaking form participation.
- Shell routing and remote routing both thinking they own history.
- Sentry without a **common release** story.

**Follow-ups**

- How do you share types? (published contract package)
- How do you test? (contract + shell e2e; don’t unit-test the remoteEntry URL)

---

### 15.5. Folder and Feature Architecture

**What they actually ask**

“Show me the folder structure.” They think that’s architecture. Give a **short** tree, then talk **boundaries**.

**How a senior answers**

- **Decision:** **Feature folders** as the primary axis (`features/orders/`, `features/auth/`), not `components/`, `helpers/`, `services/` dumping grounds. Each feature exposes a **small public API** (`index.ts`: routes, a couple of components, composables). Shared kernel stays thin: design-system primitives, `lib/http`, `lib/dates`.
- **Constraint:** Folder structure is a **discoverability** tool. Architecture is **who can import whom, what can deploy independently, what fails alone**. See [16.1](./system-design.md#161-frontend-architecture-decisions).
- **Failure mode:** `components/common/utils` imported by everything (a cycle magnet); features importing **deep internals** of other features; Nuxt `auto-import` of 200 composables with name clashes; “layers” that are just more folders.
- **Measure:** edges on a dependency graph (madge / ngr), % of PRs that stay inside one feature, circular imports.

Sketch (Nuxt-friendly):

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

Rules you actually enforce (ESLint `import/no-restricted-paths` or Nx tags):

- `pages` may import `features/*` public API.
- `orders` may not import `checkout/components/Foo.vue` internals.
- `shared` must not import features.

Nuxt **layers** (or pnpm packages) for: white-label brands, “admin vs public,” or extracting the design system. Not for every feature.

**Tradeoffs**

- Feature folders vs atomic design (`atoms/molecules`) — atomic design as a **folder scheme** fails at scale; tokens/primitives belong in the DS package.
- Colocate tests/stories next to the SFC vs `__tests__/`. Colocation wins for features.

**Production gotchas**

- Barrel `features/orders/index.ts` re-exporting heavy widgets → accidental sync import (12.3).
- Auto-imported composables with generic names (`useUser`) from two features.

**Follow-ups**

- Where do Pinia stores live? (inside the feature, not `/stores` for domain state)
- How do you split a feature that’s too big? (subdomains, not “move to microfrontend”)

---

### 15.6. Design System vs App Components

**What they actually ask**

“Is `OrderTable` in the design system?”

**How a senior answers**

- **Decision:** **Design system** = tokens + accessible primitives + patterns with **no product domain** (`Button`, `TextField`, `Dialog`, `DataTable` shell). **App components** = domain (`OrderTable`, `VatField`, `CheckoutStepper`). If it needs an order id, it is not a DS component.
- **Constraint:** Multiple apps (Nuxt marketing, Vue admin, maybe React later) should consume **one versioned package**. The DS is slower to change on purpose.
- **Failure mode:** Publishing the whole app as a “library”; DS pulling Pinia or `$fetch`; breaking Button padding in a patch; theming via deep selectors into internals.
- **Measure:** time to update a token across apps, a11y violations on primitives, downstream breakages per DS release, adoption (% of buttons that aren’t local forks).

Ownership: a **platform or DS team** (or a rotating guild) with a published process: RFC, visual tests, semver, changelog. Consuming apps pin versions; they don’t edit `node_modules`. **Dark launch** a `Button` v2 behind a class/flag inside the DS, migrate apps, then delete v1 — don’t break everyone on Friday.

Details of versioning, tokens, and a11y belong in [16.3](./system-design.md#163-component-library-design); here the interview point is the **boundary**.

**Tradeoffs**

- One mega DS vs small primitives + app patterns. Start small.
- CSS variables vs TS theme objects — variables win for dark mode and SSR.

**Production gotchas**

- Duplicate Vue in the DS bundle (peerDependency `vue`, don’t bundle it).
- App “wrapper components” that freeze DS props and prevent upgrades.

**Follow-ups**

- Can the DS include Nuxt-specific `NuxtLink`? (adapter package, not the core primitives)
- How do you stop forks? (lint, code review, inventory)

---

[← Back to Overview](../../README-en.md)
