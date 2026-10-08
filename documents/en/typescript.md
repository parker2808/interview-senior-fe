# TypeScript

Senior TypeScript interviews are not a quiz of `Partial` vs `Pick`. They watch whether you can make illegal states unrepresentable: a `UserId` that cannot be passed where an `OrderId` belongs, a UI that cannot be `loading` and `error` at once, a PATCH DTO that cannot send `passwordHash`. You are judged on the domain model, the `tsconfig` you would actually ship, and whether you lie to the compiler with `as` / `any`.

Prefer Vue 3 + `script setup` examples; React shows up when the same type problem is a hook vs a composable. Speak in tradeoffs: what the type prevents, what it still allows at runtime, and how you would catch the rest with a test or a parser.

---

## Table of Contents

1. **Core Concepts**

   1.1. [Interface vs Type](#211-interface-vs-type)

   1.2. [Generics](#212-generics)

   1.3. [Type Narrowing](#213-type-narrowing)

2. **Advanced Types**

   2.1. [Utility Types](#221-utility-types)

   2.2. [Type Guards & Predicates](#222-type-guards--predicates)

   2.3. [Mapped Types](#223-mapped-types)

   2.4. [Conditional Types](#224-conditional-types)

   2.5. [Template Literal Types](#225-template-literal-types)

   2.6. [Branded and Opaque IDs](#226-branded-and-opaque-ids)

   2.7. [`satisfies`](#227-satisfies)

   2.8. [unknown vs any](#228-unknown-vs-any)

   2.9. [tsconfig: strict and isolatedModules](#229-tsconfig-strict-and-isolatedmodules)

   2.10. [Typing Vue props and emits](#2210-typing-vue-props-and-emits)

---

## 2. TypeScript

### 2.1. Core Concepts

#### 2.1.1. Interface vs Type

**What they actually ask**

A teammate opened a PR that `interface`s a union of API states “for consistency.” Another refuses `interface` because “types are more modern.” The interviewer wants to know if you have a **team rule with reasons**, not a Twitter preference.

**How a senior answers**

I use **`type` for unions, intersections, mapped/conditional aliases, and function types.** I use **`interface` when I want declaration merging** — especially to augment a third-party module (`vue`, `express`, env, a design-system button). Object shapes can be either; I follow the repo convention because mixed style in one file is the real cost. Constraint: `interface` merge is a feature and a footgun — two `interface User` in different files silently become one. Failure mode: an `interface` you cannot make a union, so people add optional `data?` and `error?` and the UI compiles in an impossible state. Measure: `tsc --noEmit` in CI, and a convention documented in the eslint `consistent-type-definitions` rule so the debate dies.

**Tradeoffs**

- Don’t fight a codebase that standardized on `interface` for objects. Convert on touch, not in a 400-file cosmetic PR.
- Don’t use `interface` for `type Id = string & { __brand: 'User' }` — that’s a `type`.
- Declaration merging is why you *can* patch `process.env` and Vue module types. It is also why a global `interface Window` in two features collides. Prefer `declare global` in one `env.d.ts`.
- `extends` vs `&`: interface extends fails loudly on conflicts; intersection becomes `never` on incompatible properties and the error is worse. Pick the one whose failure you can read.

**Production gotchas**

- Merging `interface` from a `.d.ts` and a `.ts` with the same name — you “lost” a field that was never in the file you are reading.
- `interface` of a union-like API (`status` plus optional bags) re-creates the boolean-flag state machine you should have discriminated.
- Vue: `defineProps<{…}>()` wants a type literal / `type` alias in several compiler versions; a locally declared `interface` is fine, an imported one has historically needed extra care with `defineProps<Imported>()`. Know the compiler version you ship.
- React: `interface Props extends HTMLAttributes<HTMLDivElement>` is the right merge. A `type Props = { className?: string }` that forgets native attrs is how you block `data-*` and `aria-*`.

**Follow-ups**

1. When *must* you use `interface`? (module augmentation / declaration merging)
2. When *must* you use `type`? (union of UI states, branded id, mapped alias)
3. Why is “interfaces for objects, types for everything else” a fine team rule even if it is not a language law?
4. What happens if two packages merge `interface Window { analytics?: … }` with incompatible types?
5. `extends` conflict vs intersection `never` — which error would you rather get in a design-system PR?
6. How do you augment Vue’s `ComponentCustomProperties` for a plugin, and why is that an interface?

---

#### 2.1.2. Generics

**What they actually ask**

You are wrapping `fetch` or writing `useAsyncData`-style composable. A mid-level candidate writes `function wrap<T>(value: T)` and calls it a day. They want **constraints, defaults, and when not to generic at all**.

**How a senior answers**

Generics are for **callers who know a type you cannot**. An API client is generic in the response: `api.get<User>('/me')`. A Vue composable is generic in the source: `usePagedList<User>()`. I add a constraint (`T extends { id: string }`) when the implementation needs `id`, and a default (`T = unknown`) when inference would otherwise become `{}`. I do **not** generic a function whose `T` appears once as a return annotation — that is a return type. Failure mode: `useFetch<T>()` with no parser, so `T` is a lie you passed in. Measure: inference at the call site without a manual parameter; if callers always write `<Foo>`, the generic failed.

**Tradeoffs**

- Over-generic (`Fn<T, U, V, W>`) means nobody can infer and everyone `as`s. Two type params is already a smell unless they are `TData` and `TError`.
- Don’t generic the HTTP method and the path and the body in one helper if the team will only ever call JSON REST. A few named functions beat a DSL.
- `T extends any` is an any-pipe. `T extends unknown` is the distributive trick you actually meant.
- Vue `useAsyncData<T>` without a runtime schema (Zod, Valibot) is still `any` with extra steps. The generic documents intent; the parser enforces it.

**Production gotchas**

- Inference from empty array: `useList([])` becomes `never[]` unless you default `T` or pass the type argument.
- Constraining to `T extends object` rejects arrays/functions inconsistently; prefer a named shape.
- Generic Vue components: `defineComponent` + `generic="T extends Row"` in Vue 3.3 — callers must still pass a typed `items`. If they pass `ref([])`, you got `never`.
- React `useState<T>(null)` without `T | null` is a classic. Same bug in `ref<T>()`.
- Don’t return `T | undefined` from a generic `get` and then forget to handle `undefined` at every call. `noUncheckedIndexedAccess` makes this visible.

```ts
type JsonParser<T> = (data: unknown) => T

export function useApi<T>(url: string, parse: JsonParser<T>) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)

  async function reload(signal?: AbortSignal) {
    const raw: unknown = await api.get(url, { signal })
    data.value = parse(raw) // T is earned, not asserted
  }

  return { data, error, reload }
}

// Need id in the implementation — constrain. Don't generic "just in case".
function upsertById<T extends { id: string }>(rows: T[], row: T): T[] {
  const i = rows.findIndex((r) => r.id === row.id)
  if (i === -1) return [...rows, row]
  return rows.with(i, row)
}
```

**Follow-ups**

1. When is a generic a mistake? (T used once, or T never inferred)
2. How do you type a Vue composable that returns `{ data, error, reload }` without becoming `any`?
3. `T extends { id: string }` vs passing a `getId` callback — which extends to `UserId` branded types?
4. Why did `useState([])` / `ref([])` infer `never[]`?
5. Default type parameters: when do they hide a bug by making everything `unknown`?
6. How would you prevent `get<User>()` from compiling if the runtime JSON is not a `User`?

---

#### 2.1.3. Type Narrowing

**What they actually ask**

A spinner, a form, and an error banner can all show at once because the state is `{ loading: boolean; data?: T; error?: Error }`. They want a **discriminated union as a UI state machine**, not `typeof` on a string.

**How a senior answers**

I model async UI as `idle | loading | success | error` with a shared `status` (or `kind`) tag. After `if (state.status === 'success')`, `data` is required — no `data!`. Constraint: narrowing is control-flow at **compile** time; JSON from the network is still `unknown` until a parser or a guard. Failure mode: optional fields on one object, which make `loading && error` legal. Measure: a Vue template that cannot read `state.data` without `v-if="state.status === 'success'"` (use a type guard function if the template compiler loses the narrow), plus a unit test of the reducer/transitions.

**Tradeoffs**

- A boolean `isLoading` is fine for a one-line button. It is wrong for a page with retry, abort, and stale-while-revalidate.
- Don’t add `status: 'empty'` if `success` + `data.length === 0` is the same state. Extra tags that don’t change transitions are noise.
- React `useReducer` with this union is the same pattern as a Vue `ref<AsyncState<T>>`. Don’t switch stacks just to get a state machine.
- `in` narrowing on optional keys is weak (`'data' in state` is true for `{ data: undefined }`). Prefer the discriminant.

**Production gotchas**

- Vue templates don’t always retain TS control-flow. Extract `isSuccess(state)` or a child component that takes `T`, not the union.
- Discriminant must be a literal type (`'error'`), not `string`. A missing `as const` on the producer widens it and kills narrowing.
- SSR: `idle` on the server and `success` on the client without matching markup → hydration mismatch. Start in `loading` if the data is fetched in `setup`.
- `error` that still holds previous `data` is a **different** state (`{ status: 'error'; data: T; error }` vs without data). Stale-while-revalidate needs that extra variant — don’t smash it into optional `data?`.

```ts
type AsyncState<T, E = Error> =
  | { status: 'idle' }
  | { status: 'loading'; abort: AbortController }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E; data?: T } // data present = stale

function label(state: AsyncState<User>) {
  if (state.status === 'success') return state.data.name
  if (state.status === 'error') return state.error.message
  return '…'
}
```

**Follow-ups**

1. Why can’t `{ loading: boolean; data?: T }` make `data` required after `if (!loading)`?
2. How do you keep narrowing in a Vue SFC template?
3. When do you add a `revalidating` variant vs reuse `success` + a separate `isFetching`?
4. What breaks if the discriminant is typed `string`?
5. How would you model a multi-step wizard so you cannot submit step 3 fields on step 1?
6. `switch` + `never` exhaustiveness check — show it, and what happens when a new status is added.

---

### 2.2. Advanced Types

#### 2.2.1. Utility Types

**What they actually ask**

You need a PATCH body for `User`. Someone writes `Partial<User>` and ships `id` + `passwordHash` as optional writes. Someone else `Omit<User, 'password'>` and thinks nested `credentials.password` is gone.

**How a senior answers**

Compose **explicit** DTO types: `Partial<Pick<User, 'name' | 'email' | 'role'>>` for PATCH, `Pick` for list rows, `Omit` only for **shallow** keys you control. `Readonly<T>` is a compile-time flag; `Object.freeze` is a shallow runtime one; Vue `readonly()` is a proxy. They are not interchangeable. Constraint: all of these are **structural and shallow**. Failure mode: `Omit<User, 'password'>` still has `password` on a nested object; `Partial` makes `id?` which your API will still require. Measure: the DTO is the type the HTTP function accepts — if you can pass a full `User`, the DTO failed.

**Tradeoffs**

- Don’t maintain three hand-written twins of `User` if a `Pick` union would do. Do hand-write when the wire format is different (snake_case, ISO strings).
- `Record<string, T>` is an index signature that hides missing keys. `Record<Role, T>` with a union of roles is the useful one.
- `Awaited<ReturnType<typeof fn>>` is good glue. Don’t unwrap three layers of Axios wrappers — type the client once.
- `Required<T>` on a type with optional nested objects does not deep-require. Same shallow trap as `Partial`.

**Production gotchas**

- `Omit` is `{ [K in Exclude<keyof T, Keys>]: T[K] }` — discriminants can collapse a union the wrong way. `Omit<A | B, 'k'>` distributes and can lose the union.
- `Readonly` does not freeze arrays’ methods in the way people think; `readonly T[]` vs `Readonly<T[]>` vs Vue `readonly`.
- Spreading a `Partial<User>` into a `User` compiles if you `as User`. That’s how PATCH empties fields.
- `Pick` of a generic component props type can drop variants (`class` vs `className` in Vue/React wrappers).

```ts
type User = {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  passwordHash: string
  profile: { bio: string; passwordHint: string }
}

type UserPatch = Partial<Pick<User, 'name' | 'email' | 'role'>>
type UserPublic = Omit<User, 'passwordHash'> // profile.passwordHint is STILL there
```

**Follow-ups**

1. Why is `Partial<User>` a bad PATCH type?
2. Show a nested secret that `Omit<User, 'password'>` does not remove. How do you actually strip it?
3. `Readonly<T>` vs `Object.freeze` vs Vue `readonly()` — which one throws at runtime on set?
4. What does `Omit` do to a discriminated union? When do you use `Exclude` instead?
5. `Record<string, V>` vs `Map<K, V>` vs `Record<K, V>` for a role→permission table.
6. How do you type a JSON merge patch (`null` deletes a field) vs a HTTP PATCH of optionals?

---

#### 2.2.2. Type Guards & Predicates

**What they actually ask**

A `isUser(x: unknown): x is User` that returns `true` if `'id' in x`. It compiles. It is a lie. They want **predicates and assertion functions you would sign**, and the discipline not to `as User` at a trust boundary.

**How a senior answers**

User-defined predicates (`x is T`) and asserts (`asserts x is T`) are how you teach control-flow. I write them only where I check **enough** fields (or I delegate to Zod/Valibot and infer `T` from the schema). I never write `return true as x is T`. At the network/storage boundary the type is `unknown`; inside the app after parse, it is `User`. Failure mode: a guard that checks `typeof x === 'object'` and then the UI crashes on `x.name.toUpperCase()`. Measure: a fixture of extra/missing keys in tests; the guard must reject.

**Tradeoffs**

- Runtime schema > hand-rolled guards for anything that crossed the wire. Guards are for your own unions (`isAbortError`, `isSuccess`).
- Assertion functions throw. Use them in app startup (`assert(env.API_URL, 'missing')`), not in a render path.
- `instanceof` fails across realms and bundler duplicates. Prefer a `kind` discriminant you own.
- Don’t `as const` a guard’s return to force a narrow you didn’t prove.

**Production gotchas**

- Predicates that return `x is T` where `T` has optional fields — extra keys pass, and that’s OK structurally, but missing required fields must not.
- `Array.isArray` is a built-in guard; `x is User[]` that only checks `Array.isArray(x)` is a lie about the element type. Check elements, or parse.
- Vue `watch` callbacks and axios interceptors lose narrowing unless you re-guard.
- `asserts x` with a body that doesn’t throw on failure — TS trusts you, runtime doesn’t. This is how you get production-only crashes.

```ts
function isAbortError(e: unknown): e is DOMException {
  return e instanceof DOMException && e.name === 'AbortError'
}

function assertUnreachable(x: never): never {
  throw new Error(`unreachable: ${String(x)}`)
}

function parseUser(data: unknown): User {
  const parsed = UserSchema.parse(data) // throw → caller’s error state
  return parsed
}
```

**Follow-ups**

1. Why is `'id' in x` not enough for `x is User`?
2. Predicate vs assertion function — when does each belong in a composable?
3. How do you type `catch (e)` under `useUnknownInCatchVariables`?
4. Why can `instanceof ApiError` fail between app and a shared package?
5. How do you keep a Zod schema as the single source of `User` for both Vue props and the API client?
6. What does a lying predicate do to `noUncheckedIndexedAccess` and the rest of the file?

---

#### 2.2.3. Mapped Types

**What they actually ask**

They don’t want you to reimplement `Readonly`. They want one production mapping: **form errors keyed by the form**, or a “all flags boolean” object, without a parallel list of keys that can drift.

**How a senior answers**

A mapped type is `for each key of T, produce a property`. I use it so a form and its error map cannot disagree: `Partial<Record<keyof T, string>>`, or `{ [K in keyof T]: T[K] | null }` for a draft. `-?` / `-readonly` when a DTO must be fully present. Failure mode: a hand-maintained `email?: string; name?: string` error type that forgets `phone` after a field is added. Measure: adding a field to `T` must break the form component until the UI handles it — that’s the point.

**Tradeoffs**

- If the mapping is `Partial<Record<keyof T, string>>`, use that. Don’t write a custom mapped type to look senior.
- Key remapping (`as`) is justified for `update:${K}` emits and for dropping keys with `never`. It is overkill for renaming `id` → `userId` once.
- Mapped types are shallow. Deep-partial is a separate, easy-to-get-wrong type; pull a well-known helper if you really need it.

**Production gotchas**

- `keyof` a union distributes poorly; `keyof (A | B)` is the intersection of keys. Map over each member if you meant a union of forms.
- Homomorphic mapped types preserve modifiers (`readonly`, optional) — until you write `[K in keyof T]: …` in a way that resets them. Know whether you kept optionality.
- Vue `v-for` over `Object.keys(errors)` types keys as `string`. Pair with `satisfies` / a typed helper.

```ts
type FormErrors<T> = Partial<Record<keyof T, string>>

type Profile = { name: string; email: string; age: number }
type ProfileErrors = FormErrors<Profile>
// adding `phone` to Profile makes ProfileErrors require a decision in the UI
```

**Follow-ups**

1. Why not maintain a parallel `ProfileErrors` interface by hand?
2. How do you drop keys in a mapped type (`as never`) for a public DTO?
3. What does `keyof (A | B)` return, and why did that break a union of two forms?
4. Homomorphic vs non-homomorphic mapped types — when do optional flags vanish?
5. How would you type “touched” as `Record<keyof T, boolean>` with every key required?

---

#### 2.2.4. Conditional Types

**What they actually ask**

One production fork: a function that returns `void` vs `{ data: T }` depending on `T`, or extracting a Vue emit payload. They do **not** want you to reinvent `NonNullable` on a whiteboard unless they are probing `infer`.

**How a senior answers**

`T extends U ? X : Y` is how libraries branch. I reach for it when one function has two honest return shapes (`T extends void ? { ok: true } : { ok: true; data: T }`), or when I `infer` an unwrap (`Awaited`, payload of an event). I keep it off app pages — a named overload or two functions is kinder in Vue SFCs. Failure mode: accidental distribution over unions (`ToArray<string | number>` → `string[] | number[]`) when you wanted `[string | number][]`. Measure: a type test file (`expectTypeOf`) for the union case.

**Tradeoffs**

- Distributive conditionals (`T extends any ? …`) are a feature. Wrap with `[T] extends [U]` when you must not distribute.
- If you need `infer` more than once in app code, you probably wanted the standard library (`ReturnType`, `Parameters`, `Awaited`).
- Overloads are often clearer than a conditional return for JSDoc and Vue inference.

**Production gotchas**

- `never` extends everything; empty unions collapse. A generic that got `never` from `[]` silently matches the wrong branch.
- Axios-style `T = any` defaults make the false branch unreachable. Default to `unknown`.
- Conditional types + `undefined` from `exactOptionalPropertyTypes` — `?` vs `| undefined` matter.

```ts
type ApiOk<T> = T extends void ? { ok: true } : { ok: true; data: T }

async function mutate<T>(path: string, body: unknown): Promise<ApiOk<T>> {
  const data = await api.post(path, body)
  return (data === undefined ? { ok: true } : { ok: true, data }) as ApiOk<T>
}
```

Use a parser instead of `as` at the boundary; the conditional type is for the **caller’s** contract.

**Follow-ups**

1. When does a conditional distribute over a union, and how do you stop it?
2. `infer R` in a function type vs `ReturnType` — when do you still write `infer`?
3. Why did `T extends undefined ? A : B` mis-fire on a generic with no constraint?
4. Overload vs conditional return — which does Vue `script setup` infer better?
5. How do you write a type-level test for this without running code?

---

#### 2.2.5. Template Literal Types

**What they actually ask**

Event names, i18n keys, or CSS vars that must match a source of truth. One example is enough: **`update:${keyof props}`** or `on${Capitalize<K>}`.

**How a senior answers**

Template literals let the type checker concatenate literals. I use them so `emit('update:modelValue', v)` cannot emit `'update:modelvalue'` or a field that isn’t a prop. Constraint: they explode combinatorially (`HTTP × Route` is fine; `string × string` is `string` and buys nothing). Failure mode: typing `event: string` on a bus, which compiles `user:created` vs `userCreated` mismatches. Measure: rename a prop, watch emits and listeners fail in `tsc`.

**Tradeoffs**

- Don’t type the entire URL router as template literals if you have a real router with params. Use the router’s typed helpers (Vue Router 4 `RouteMap`, Nuxt `typedPages`).
- `Uppercase`/`Capitalize` are for protocol-ish names, not for display strings. UI copy belongs in i18n, not in types.
- Huge unions of templates slow `tsc`. Split by feature.

**Production gotchas**

- `as const` on the source object is required or you interpolate `string`.
- Vue `v-on` / `emits` option vs `defineEmits<{ 'update:foo': [string] }>()` — keep one source, generate the other with a mapped+template type if you have many v-models.
- Path templates `` `/users/${string}` `` do not validate IDs; branded ids still belong in params.

```ts
type UpdateEmits<T> = {
  [K in keyof T & string as `update:${K}`]: [value: T[K]]
}

type UserForm = { name: string; email: string }
type UserFormEmits = UpdateEmits<UserForm>
// 'update:name' | 'update:email' — not 'update:Name', not 'change:name'
```

**Follow-ups**

1. Why does `` `${keyof T}Changed` `` need `T & string`?
2. When do template unions become a compile-time performance problem?
3. How would you type `provide/inject` keys so a magic string cannot collide?
4. Vue Router: typed `name` vs a template of paths — which do you trust?
5. Why is `` `${string}@${string}` `` a weak email type, and what do you do instead?

---

#### 2.2.6. Branded and Opaque IDs

**What they actually ask**

`getUser(orderId)` compiles because both are `string`. A production outage. How do you make that a type error without a runtime wrapper object?

**How a senior answers**

Brand the id: `type UserId = string & { readonly __brand: 'UserId' }`. At the boundary (route param, JSON), parse with a function that returns `UserId`. Inside the app, `getUser` only accepts `UserId`. Constraint: this is **erased** — the wire is still a string; you can `as UserId` and lie. Failure mode: branding at the type level but concatenating ids in URLs without the constructor, or using `string` in a Map key “for convenience.” Measure: a forbidden call `getUser(order.id)` in a type test.

**Tradeoffs**

- Don’t brand every `string` (`Email`, `Url`, `CssColor`) on day one. Brand **IDs that are mixed constantly** (`UserId`, `OrgId`, `OrderId`).
- A class `UserId` with a private field is a runtime brand (can `instanceof`) but is painful in JSON. Stick to type brands + parse for FE.
- Zod `.brand<'UserId'>()` is the version I actually ship.

```ts
type UserId = string & { readonly __brand: 'UserId' }
type OrderId = string & { readonly __brand: 'OrderId' }

const asUserId = (s: string) => s as UserId // only inside parseUserId()

function getUser(id: UserId) { /* … */ }
function getOrder(id: OrderId) { /* … */ }

declare const orderId: OrderId
// getUser(orderId) // error — this is the whole feature
```

**Production gotchas**

- `UserId | OrderId` widens in a `Set<string>` if you pass `.add(id)` into a string set. Keep collections generic.
- Template literals `` `/users/${id}` `` widen to `string`. That’s OK; the function that fetches should still take `UserId`.
- `as UserId` next to `JSON.parse` reintroduces the original bug. Branding lives in `parseUserId`, not at every call site.

**Follow-ups**

1. Where is `as UserId` allowed, and who reviews those lines?
2. How do you serialize a branded id to JSON without extra keys?
3. Why not `uuid` branded vs `string` branded — do you validate RFC shape?
4. Can two brands accidentally be compatible if they share `__brand: string`?
5. How do Vue route params (`string`) get into `UserId` without spreading `as` through the component tree?

---

#### 2.2.7. `satisfies`

**What they actually ask**

`as const` made a routes object too narrow to pass where `Record<string, string>` is required, or `as Record<…>` widened values and lost literal keys. What does `satisfies` change?

**How a senior answers**

`satisfies` **checks** a value against a type **without widening** the value’s inferred type. I use it for route maps, design tokens, and feature-flag tables: the object must match a contract, but `typeof routes.home` stays `'/'`. Failure mode: `as const` alone doesn’t prove you implemented every key; `as Record<…>` lies about literals. Measure: add a required key to the contract, watch `satisfies` fail; rename a value, watch call sites still see the literal.

**Tradeoffs**

- `satisfies` is TS 4.9+. Don’t polyfill it with double assertions in a 4.7 codebase — upgrade.
- It does not deep-freeze at runtime. Pair with `as const satisfies T` when you want both literals and a check.
- Don’t `satisfies` every object; use it at module boundaries (config, catalogs).

```ts
const flags = {
  newCheckout: false,
  betaNav: true,
} as const satisfies Record<string, boolean>

type Flag = keyof typeof flags // 'newCheckout' | 'betaNav'
```

**Production gotchas**

- `satisfies` is compile-time only. A flags JSON from remote config is still `unknown` — parse it; don’t `satisfies` a `JSON.parse` result.
- Extra keys are allowed unless you used a type that forbids them. `satisfies Record<string, boolean>` does not catch a typo’d flag name; `satisfies Record<KnownFlag, boolean>` does if `KnownFlag` is the union of names you intended — or invert: `as const satisfies` and derive `KnownFlag` from the object.
- Vue SFCs: `satisfies` on a `defineProps` argument is the wrong tool; use the generic on `defineProps<T>()`.

**Follow-ups**

1. `as const` vs `satisfies` vs both — what type is `flags.newCheckout` in each?
2. How do you force every `ThemeToken` key to exist without losing literal color values?
3. Why is `as Record<Flag, boolean>` worse here?
4. Can `satisfies` catch a missing Vue `emits` key? When would you still use `defineEmits<T>()`?
5. Why doesn’t `satisfies` help at an IndexedDB / `postMessage` boundary?

---

#### 2.2.8. unknown vs any

**What they actually ask**

`data: any` from `JSON.parse`, axios, `event.data`, IndexedDB, `postMessage`. Why is `unknown` the senior default, and when is `any` a prudential exception?

**How a senior answers**

`unknown` is “I must narrow.” `any` is “this infects every expression it touches.” JSON, `catch (e)`, `MessageEvent.data`, `localStorage` — start as `unknown`, parse. I allow `any` only at a documented escape hatch (a broken `.d.ts` you will delete, or a `// eslint-disable` with a ticket). Failure mode: a single `any` from axios `response.data` turns the next 40 lines into a non-typed program. Measure: `noImplicitAny` + `useUnknownInCatchVariables` + a ban-types lint on `any`.

**Tradeoffs**

- `unknown` is not a runtime check. You still write the guard/schema.
- `object` is almost never what you wanted (`null` is not `object` wait — `typeof null === 'object'`; TS `object` excludes primitives). Prefer `unknown` then narrow.
- Don’t type internal Vue refs as `unknown` after you’ve parsed. Narrow once at the edge.

**Production gotchas**

- `JSON.parse` returns `any` in lib.dom / a wrapper should return `unknown`.
- `any[]` vs `unknown[]`: `map` on `any[]` stays `any`.
- Generic default `<T = any>` poisons inference. Default `unknown`.
- Vue `ref()` without annotation is `ref<any>` in some versions if initialized with `null`. Write `ref<User | null>(null)`.

**Follow-ups**

1. Why is `unknown` assignable **to** only a few things, and `any` assignable **everywhere**?
2. How do you type `window.onmessage` without `any`?
3. Is `eslint @typescript-eslint/no-explicit-any` enough? What about implicit any from JS files?
4. `unknown` vs `Record<string, unknown>` for a JSON object — which, and why still parse?
5. When would you temporarily `any` a third-party widget, and what is the exit criteria?

---

#### 2.2.9. tsconfig: strict and isolatedModules

**What they actually ask**

What’s in your `tsconfig` for a Vue 3 + Vite app, and which flags are non-negotiable in 2026? They are checking whether you have shipped `strict` or only talked about it.

**How a senior answers**

`strict: true` is the floor (`strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, …). I also want `noUncheckedIndexedAccess` (index → `T | undefined`), `exactOptionalPropertyTypes` if the team can bear it, `useUnknownInCatchVariables`, `noImplicitOverride`, `verbatimModuleSyntax`, and **`isolatedModules`: true** because Vite/esbuild transpile files in isolation — `const enum` and non-module files break. `skipLibCheck` is a pragmatic yes for app repos. Failure mode: `strict` off in a Nuxt layer that “temporarily” shipped, then `undefined` hits a `.value.toFixed`. Measure: `vue-tsc --noEmit` in CI, not just `tsc`, so SFCs are included.

**Tradeoffs**

- Turning on `noUncheckedIndexedAccess` in a 200k-line app is a week of `?.` noise. Do it for new packages first; don’t pretend you have it if you don’t.
- `isolatedModules` forbids `const enum` and `export { type }` issues depending on version — `verbatimModuleSyntax` makes import kind explicit. That’s good.
- `strict: true` with `any` everywhere is theater. Pair with a lint ban.
- Path aliases (`@/`) must match Vite and `tsconfig`. Two sources of truth is a class of “works in IDE, fails in build.”

**Production gotchas**

- Vue: `strictTemplates: true` in `vue-tsc` / `vueCompilerOptions` — this is the thing that catches wrong props. Many teams never enable it.
- `isolatedModules` + `const enum` from a component library = runtime `undefined`. Use union types.
- Project references vs one big `tsconfig` — Nuxt generates its own; don’t fight it, extend it.
- `target`/`lib` too old: no `AbortSignal.any` types. Too new: you ship syntax the browser cannot run without transpile (usually fine with Vite).

**Follow-ups**

1. Why does `isolatedModules` ban `const enum`?
2. `vue-tsc` vs `tsc` — who type-checks `.vue` files?
3. What does `noUncheckedIndexedAccess` change about `rows[0]` and `Map.get`?
4. `skipLibCheck`: when did it hide a real bug for you?
5. How do `verbatimModuleSyntax` and `import type` prevent a type-only import from becoming a runtime cycle?
6. Which `strict*` flag would you turn on first in a loose repo, and why?

---

#### 2.2.10. Typing Vue props and emits

**What they actually ask**

Type this component: `v-model`, a branded `userId`, a discriminated `variant`, and an emit the parent must handle. Compare briefly to React props. No `defineProps` untyped runtime object.

**How a senior answers**

In Vue 3.3+ I type **compiler macros**: `defineProps<T>()` and `defineEmits<{ change: [id: UserId] }>()`. `v-model` is `modelValue` + `'update:modelValue'`. Defaults go in `withDefaults`. I do **not** duplicate a runtime `props: { userId: String }` unless I need runtime validation for not-TS consumers. Constraint: props are one-way; mutating a prop object’s field is still a type-legal runtime bug — type with `readonly` / pass primitives / emit. Failure mode: `emit('update:modelValue')` with no payload, or a prop `string` where `UserId` was required so every parent `as`s. Measure: `vue-tsc` on the parent: missing listener and wrong `userId` type both fail.

**Tradeoffs**

- Runtime props (`Boolean`, `String`) still matter for native custom elements and JS-only usage. In a TS-only app, the type is the contract.
- React: props are a single object type; emits are callbacks (`onChange: (id: UserId) => void`). Vue splits props/emits — that’s why `v-model` typing is a special case, not a React “controlled component” clone.
- `defineModel<UserId>()` is the 3.4+ shortcut. Use it, but know it is still `modelValue` on the wire.
- Don’t type emits as `(e: string, ...args: any[])`. You threw away the feature.

**Production gotchas**

- Optional boolean props: `visible?: boolean` vs default `false` — `withDefaults` vs `??` in script. Unpassed vs `false` vs `undefined` in Vue is a FAQ; `Boolean` runtime prop casts empty attr to `true`.
- `defineProps<Imported>()` historically required a local alias in some Vue versions. If CI fails only on imported interfaces, this is why.
- `emits` not declared → fallthrough as native events / `vnode` attrs, and the parent listener isn’t typed.
- Hydration: default props that use `Date.now()` or `Math.random()` in the factory desync SSR.
- React comparison: `forwardRef` + `ComponentProps<'button'>` is the analog of `inheritAttrs`. Vue 3 `inheritAttrs: false` + typed `$attrs` is the senior control.

```ts
const props = withDefaults(
  defineProps<{
    userId: UserId
    variant: 'idle' | 'loading' | 'success' | 'error'
    modelValue: string
    disabled?: boolean
  }>(),
  { disabled: false }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  select: [id: UserId]
}>()
```

**Follow-ups**

1. How do you type multiple `v-model`s (`modelValue` + `modelModifiers`)?
2. Why is mutating `props.user.role` both a Vue anti-pattern and still type-legal? How do you make it illegal?
3. `defineModel` vs explicit props/emits — when do you avoid the sugar?
4. How do React `ComponentProps<typeof Button>` and Vue `InstanceType` compare for wrapping a design-system button?
5. Where should a branded `UserId` be parsed: parent route, or the child prop validator?
6. What does `vue-tsc` report if the parent listens to `@Select` instead of `@select`?

---

[← Back to Overview](../../README-en.md)
