# TypeScript

Phỏng vấn TypeScript senior không phải quiz `Partial` vs `Pick`. Họ xem bạn có biến trạng thái bất hợp pháp thành không biểu diễn được không: `UserId` không truyền vào chỗ `OrderId`, UI không thể vừa `loading` vừa `error`, PATCH DTO không gửi `passwordHash`. Bạn bị chấm trên domain model, `tsconfig` thật sự ship, và việc có lừa compiler bằng `as` / `any` hay không.

Ưu tiên ví dụ Vue 3 + `script setup`; React xuất hiện khi cùng bài type là hook vs composable. Nói bằng tradeoff: type chặn gì, runtime vẫn cho phép gì, và phần còn lại bắt bằng test hay parser thế nào.

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

   2.6. [Branded và Opaque ID](#226-branded-và-opaque-id)

   2.7. [`satisfies`](#227-satisfies)

   2.8. [unknown vs any](#228-unknown-vs-any)

   2.9. [tsconfig: strict và isolatedModules](#229-tsconfig-strict-và-isolatedmodules)

   2.10. [Typing Vue props và emits](#2210-typing-vue-props-và-emits)

---

## 2. TypeScript

### 2.1. Core Concepts

#### 2.1.1. Interface vs Type

**Họ thực sự hỏi gì**

Đồng nghiệp mở PR `interface` một union trạng thái API “cho consistency.” Người khác từ chối `interface` vì “type hiện đại hơn.” Interviewer muốn **rule team có lý do**, không phải preference Twitter.

**Cách senior trả lời**

Tôi dùng **`type` cho union, intersection, alias mapped/conditional, và function type.** Tôi dùng **`interface` khi muốn declaration merging** — đặc biệt augment module third-party (`vue`, `express`, env, button design-system). Object shape dùng được cả hai; theo convention repo vì mixed style trong một file mới là cost thật. Constraint: merge `interface` vừa feature vừa footgun — hai `interface User` file khác nhau im lặng thành một. Failure mode: `interface` không làm union được, nên người ta thêm `data?` và `error?` optional rồi UI compile ở state không thể tồn tại. Đo: `tsc --noEmit` trong CI, và convention ghi trong eslint `consistent-type-definitions` để cuộc tranh chết.

**Tradeoff**

- Đừng đánh nhau với codebase đã chuẩn hóa `interface` cho object. Convert lúc đụng, không phải PR 400 file cosmetic.
- Đừng dùng `interface` cho `type Id = string & { __brand: 'User' }` — đó là `type`.
- Declaration merging là lý do bạn *có thể* patch `process.env` và Vue module type. Cũng là lý do global `interface Window` ở hai feature đụng nhau. Prefer `declare global` trong một `env.d.ts`.
- `extends` vs `&`: interface extends fail ồn trên conflict; intersection thành `never` trên property incompatible và error khó đọc hơn. Chọn cái fail bạn đọc được.

**Gotcha production**

- Merge `interface` từ `.d.ts` và `.ts` cùng tên — bạn “mất” field chưa bao giờ có trong file đang đọc.
- `interface` kiểu API giống union (`status` cộng túi optional) tái tạo state machine boolean-flag lẽ ra phải discriminated.
- Vue: `defineProps<{…}>()` muốn type literal / alias `type` ở vài phiên bản compiler; `interface` khai báo local thì ổn, cái import historically cần extra care với `defineProps<Imported>()`. Biết compiler version bạn ship.
- React: `interface Props extends HTMLAttributes<HTMLDivElement>` là merge đúng. `type Props = { className?: string }` quên native attr là cách chặn `data-*` và `aria-*`.

**Câu hỏi nối**

1. Khi nào *bắt buộc* `interface`? (module augmentation / declaration merging)
2. Khi nào *bắt buộc* `type`? (union UI state, branded id, mapped alias)
3. Vì sao “interface cho object, type cho phần còn lại” là rule team ổn dù không phải luật ngôn ngữ?
4. Hai package merge `interface Window { analytics?: … }` type incompatible thì sao?
5. Conflict `extends` vs intersection `never` — error nào bạn thà nhận trong PR design-system?
6. Augment Vue `ComponentCustomProperties` cho plugin thế nào, và vì sao đó là interface?

---

#### 2.1.2. Generics

**Họ thực sự hỏi gì**

Bạn wrap `fetch` hoặc viết composable kiểu `useAsyncData`. Candidate mid viết `function wrap<T>(value: T)` rồi nghỉ. Họ muốn **constraint, default, và khi nào đừng generic**.

**Cách senior trả lời**

Generic cho **caller biết type bạn không biết**. API client generic theo response: `api.get<User>('/me')`. Composable Vue generic theo source: `usePagedList<User>()`. Tôi thêm constraint (`T extends { id: string }`) khi implementation cần `id`, và default (`T = unknown`) khi inference không thì thành `{}`. Tôi **không** generic hàm mà `T` xuất hiện một lần như return annotation — đó là return type. Failure mode: `useFetch<T>()` không parser, nên `T` là lời nói dối bạn truyền vào. Đo: inference tại call site không cần type param tay; nếu caller luôn viết `<Foo>`, generic thất bại.

**Tradeoff**

- Over-generic (`Fn<T, U, V, W>`) nghĩa là không ai infer được và ai cũng `as`. Hai type param đã là mùi trừ khi chúng là `TData` và `TError`.
- Đừng generic HTTP method và path và body trong một helper nếu team chỉ gọi JSON REST. Vài named function thắng DSL.
- `T extends any` là ống any. `T extends unknown` mới là trick distributive bạn định viết.
- Vue `useAsyncData<T>` không runtime schema (Zod, Valibot) vẫn là `any` thêm bước. Generic ghi intent; parser enforce.

**Gotcha production**

- Infer từ array rỗng: `useList([])` thành `never[]` trừ khi default `T` hoặc pass type argument.
- Constraint `T extends object` reject array/function không nhất quán; prefer shape đặt tên.
- Generic Vue component: `defineComponent` + `generic="T extends Row"` Vue 3.3 — caller vẫn phải pass `items` typed. Pass `ref([])` thì bạn được `never`.
- React `useState<T>(null)` thiếu `T | null` là classic. Cùng bug `ref<T>()`.
- Đừng return `T | undefined` từ generic `get` rồi quên handle `undefined` mọi call. `noUncheckedIndexedAccess` làm cái này lộ.

```ts
type JsonParser<T> = (data: unknown) => T

export function useApi<T>(url: string, parse: JsonParser<T>) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)

  async function reload(signal?: AbortSignal) {
    const raw: unknown = await api.get(url, { signal })
    data.value = parse(raw) // T kiếm được, không assert
  }

  return { data, error, reload }
}

// Implementation cần id — constrain. Đừng generic "phòng hờ".
function upsertById<T extends { id: string }>(rows: T[], row: T): T[] {
  const i = rows.findIndex((r) => r.id === row.id)
  if (i === -1) return [...rows, row]
  return rows.with(i, row)
}
```

**Câu hỏi nối**

1. Khi nào generic là sai? (T dùng một lần, hoặc T không bao giờ infer)
2. Type composable Vue trả `{ data, error, reload }` mà không thành `any` thế nào?
3. `T extends { id: string }` vs pass callback `getId` — cái nào extend được branded `UserId`?
4. Vì sao `useState([])` / `ref([])` infer `never[]`?
5. Default type param: khi nào giấu bug bằng cách biến mọi thứ thành `unknown`?
6. Chặn `get<User>()` compile nếu runtime JSON không phải `User` thế nào?

---

#### 2.1.3. Type Narrowing

**Họ thực sự hỏi gì**

Spinner, form, và error banner hiện cùng lúc vì state là `{ loading: boolean; data?: T; error?: Error }`. Họ muốn **discriminated union như UI state machine**, không phải `typeof` trên string.

**Cách senior trả lời**

Tôi model async UI là `idle | loading | success | error` với tag `status` (hoặc `kind`) chung. Sau `if (state.status === 'success')`, `data` required — không `data!`. Constraint: narrowing là control-flow lúc **compile**; JSON từ network vẫn `unknown` đến khi parser hoặc guard. Failure mode: field optional trên một object, biến `loading && error` thành hợp lệ. Đo: template Vue không đọc `state.data` nếu không `v-if="state.status === 'success'"` (type guard function nếu template compiler mất narrow), cộng unit test reducer/transition.

**Tradeoff**

- Boolean `isLoading` ổn cho button một dòng. Sai cho page có retry, abort, và stale-while-revalidate.
- Đừng thêm `status: 'empty'` nếu `success` + `data.length === 0` là cùng state. Tag thừa không đổi transition là nhiễu.
- React `useReducer` với union này cùng pattern Vue `ref<AsyncState<T>>`. Đừng đổi stack chỉ để có state machine.
- Narrowing `in` trên optional key yếu (`'data' in state` true với `{ data: undefined }`). Prefer discriminant.

**Gotcha production**

- Template Vue không luôn giữ TS control-flow. Extract `isSuccess(state)` hoặc child component nhận `T`, không nhận union.
- Discriminant phải là literal type (`'error'`), không phải `string`. Thiếu `as const` trên producer làm widen và giết narrowing.
- SSR: `idle` trên server và `success` trên client không khớp markup → hydration mismatch. Bắt đầu `loading` nếu data fetch trong `setup`.
- `error` vẫn giữ `data` trước là state **khác** (`{ status: 'error'; data: T; error }` vs không data). Stale-while-revalidate cần variant đó — đừng nhét vào `data?` optional.

```ts
type AsyncState<T, E = Error> =
  | { status: 'idle' }
  | { status: 'loading'; abort: AbortController }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E; data?: T } // có data = stale

function label(state: AsyncState<User>) {
  if (state.status === 'success') return state.data.name
  if (state.status === 'error') return state.error.message
  return '…'
}
```

**Câu hỏi nối**

1. Vì sao `{ loading: boolean; data?: T }` không làm `data` required sau `if (!loading)`?
2. Giữ narrowing trong Vue SFC template thế nào?
3. Khi nào thêm variant `revalidating` vs tái dùng `success` + `isFetching` riêng?
4. Discriminant typed `string` phá gì?
5. Model wizard nhiều bước để không submit field step 3 ở step 1 thế nào?
6. `switch` + check exhaustiveness `never` — chỉ ra, và chuyện gì khi thêm status mới.

---

### 2.2. Advanced Types

#### 2.2.1. Utility Types

**Họ thực sự hỏi gì**

Bạn cần PATCH body cho `User`. Ai đó viết `Partial<User>` rồi ship `id` + `passwordHash` như write optional. Người khác `Omit<User, 'password'>` nghĩ nested `credentials.password` đã biến mất.

**Cách senior trả lời**

Compose DTO type **tường minh**: `Partial<Pick<User, 'name' | 'email' | 'role'>>` cho PATCH, `Pick` cho list row, `Omit` chỉ cho key **nông** bạn control. `Readonly<T>` là flag compile-time; `Object.freeze` nông lúc runtime; Vue `readonly()` là proxy. Chúng không thay thế lẫn nhau. Constraint: tất cả đều **structural và nông**. Failure mode: `Omit<User, 'password'>` vẫn còn `password` trên object lồng; `Partial` làm `id?` trong khi API vẫn require. Đo: DTO là type hàm HTTP nhận — nếu pass được full `User`, DTO thất bại.

**Tradeoff**

- Đừng maintain ba twin viết tay của `User` nếu `Pick` union làm được. Viết tay khi wire format khác (snake_case, ISO string).
- `Record<string, T>` là index signature giấu key thiếu. `Record<Role, T>` với union role mới hữu ích.
- `Awaited<ReturnType<typeof fn>>` là keo tốt. Đừng unwrap ba lớp Axios wrapper — type client một lần.
- `Required<T>` trên type có nested object optional không deep-require. Cùng bẫy nông như `Partial`.

**Gotcha production**

- `Omit` là `{ [K in Exclude<keyof T, Keys>]: T[K] }` — discriminant có thể sập union sai hướng. `Omit<A | B, 'k'>` distribute và có thể mất union.
- `Readonly` không freeze array method như người ta nghĩ; `readonly T[]` vs `Readonly<T[]>` vs Vue `readonly`.
- Spread `Partial<User>` vào `User` compile nếu bạn `as User`. Đó là cách PATCH empty field.
- `Pick` generic component props type có thể drop variant (`class` vs `className` trong wrapper Vue/React).

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
type UserPublic = Omit<User, 'passwordHash'> // profile.passwordHint VẪN còn
```

**Câu hỏi nối**

1. Vì sao `Partial<User>` là PATCH type tệ?
2. Chỉ nested secret mà `Omit<User, 'password'>` không gỡ. Strip thật thế nào?
3. `Readonly<T>` vs `Object.freeze` vs Vue `readonly()` — cái nào throw runtime lúc set?
4. `Omit` làm gì với discriminated union? Khi nào dùng `Exclude`?
5. `Record<string, V>` vs `Map<K, V>` vs `Record<K, V>` cho bảng role→permission.
6. Type JSON merge patch (`null` xóa field) vs HTTP PATCH optional thế nào?

---

#### 2.2.2. Type Guards & Predicates

**Họ thực sự hỏi gì**

Một `isUser(x: unknown): x is User` trả `true` nếu `'id' in x`. Compile được. Là nói dối. Họ muốn **predicate và assertion function bạn dám ký**, và kỷ luật không `as User` ở trust boundary.

**Cách senior trả lời**

User-defined predicate (`x is T`) và assert (`asserts x is T`) là cách dạy control-flow. Tôi chỉ viết chỗ check **đủ** field (hoặc ủy thác Zod/Valibot rồi infer `T` từ schema). Không bao giờ `return true as x is T`. Tại ranh network/storage type là `unknown`; trong app sau parse là `User`. Failure mode: guard check `typeof x === 'object'` rồi UI crash `x.name.toUpperCase()`. Đo: fixture key thừa/thiếu trong test; guard phải reject.

**Tradeoff**

- Runtime schema > guard viết tay cho thứ đã vượt dây. Guard cho union của bạn (`isAbortError`, `isSuccess`).
- Assertion function throw. Dùng lúc app startup (`assert(env.API_URL, 'missing')`), không trên render path.
- `instanceof` fail xuyên realm và bundler duplicate. Prefer discriminant `kind` bạn sở hữu.
- Đừng `as const` return của guard để ép narrow bạn chưa chứng minh.

**Gotcha production**

- Predicate trả `x is T` mà `T` có field optional — extra key pass, structural OK, nhưng thiếu required field thì không được.
- `Array.isArray` là guard built-in; `x is User[]` chỉ check `Array.isArray(x)` là nói dối element type. Check phần tử, hoặc parse.
- Vue `watch` callback và axios interceptor mất narrowing trừ khi re-guard.
- `asserts x` với body không throw lúc fail — TS tin bạn, runtime không. Đây là crash chỉ production.

```ts
function isAbortError(e: unknown): e is DOMException {
  return e instanceof DOMException && e.name === 'AbortError'
}

function assertUnreachable(x: never): never {
  throw new Error(`unreachable: ${String(x)}`)
}

function parseUser(data: unknown): User {
  const parsed = UserSchema.parse(data) // throw → error state của caller
  return parsed
}
```

**Câu hỏi nối**

1. Vì sao `'id' in x` không đủ cho `x is User`?
2. Predicate vs assertion function — cái nào thuộc composable khi nào?
3. Type `catch (e)` dưới `useUnknownInCatchVariables` thế nào?
4. Vì sao `instanceof ApiError` fail giữa app và shared package?
5. Giữ Zod schema làm single source của `User` cho cả Vue props và API client thế nào?
6. Predicate nói dối làm gì với `noUncheckedIndexedAccess` và phần còn lại của file?

---

#### 2.2.3. Mapped Types

**Họ thực sự hỏi gì**

Họ không muốn bạn reimplement `Readonly`. Họ muốn một mapping production: **form error keyed theo form**, hoặc object “mọi flag đều boolean”, không list key song song có thể drift.

**Cách senior trả lời**

Mapped type là `với mỗi key của T, sinh một property`. Tôi dùng để form và error map không bất đồng: `Partial<Record<keyof T, string>>`, hoặc `{ [K in keyof T]: T[K] | null }` cho draft. `-?` / `-readonly` khi DTO phải có đủ. Failure mode: error type `email?: string; name?: string` viết tay quên `phone` sau khi thêm field. Đo: thêm field vào `T` phải phá form component đến khi UI handle — đó là mục đích.

**Tradeoff**

- Mapping là `Partial<Record<keyof T, string>>` thì dùng cái đó. Đừng viết mapped type custom để trông senior.
- Key remapping (`as`) justified cho emit `update:${K}` và drop key bằng `never`. Overkill để rename `id` → `userId` một lần.
- Mapped type nông. Deep-partial là type riêng, dễ sai; kéo helper nổi tiếng nếu thật sự cần.

**Gotcha production**

- `keyof` trên union distribute kém; `keyof (A | B)` là intersection của keys. Map từng member nếu bạn muốn union of forms.
- Homomorphic mapped type giữ modifier (`readonly`, optional) — đến khi bạn viết `[K in keyof T]: …` kiểu reset chúng. Biết mình còn optionality không.
- Vue `v-for` trên `Object.keys(errors)` type key là `string`. Pair với `satisfies` / helper typed.

```ts
type FormErrors<T> = Partial<Record<keyof T, string>>

type Profile = { name: string; email: string; age: number }
type ProfileErrors = FormErrors<Profile>
// thêm `phone` vào Profile buộc ProfileErrors quyết định trên UI
```

**Câu hỏi nối**

1. Vì sao không maintain song song `ProfileErrors` interface viết tay?
2. Drop key trong mapped type (`as never`) cho public DTO thế nào?
3. `keyof (A | B)` trả gì, và vì sao phá union hai form?
4. Homomorphic vs non-homomorphic mapped type — khi nào optional flag biến mất?
5. Type “touched” là `Record<keyof T, boolean>` mọi key required thế nào?

---

#### 2.2.4. Conditional Types

**Họ thực sự hỏi gì**

Một fork production: hàm trả `void` vs `{ data: T }` tùy `T`, hoặc extract Vue emit payload. Họ **không** muốn bạn phát minh lại `NonNullable` trên whiteboard trừ khi probing `infer`.

**Cách senior trả lời**

`T extends U ? X : Y` là cách lib rẽ nhánh. Tôi với tới khi một hàm có hai return shape thật (`T extends void ? { ok: true } : { ok: true; data: T }`), hoặc khi `infer` unwrap (`Awaited`, payload của event). Tôi để nó khỏi page app — named overload hoặc hai hàm tử tế hơn trong Vue SFC. Failure mode: distribute nhầm trên union (`ToArray<string | number>` → `string[] | number[]`) khi bạn muốn `[string | number][]`. Đo: file type test (`expectTypeOf`) cho case union.

**Tradeoff**

- Distributive conditional (`T extends any ? …`) là feature. Wrap `[T] extends [U]` khi không được distribute.
- Cần `infer` hơn một lần trong app code thì có lẽ bạn muốn standard library (`ReturnType`, `Parameters`, `Awaited`).
- Overload thường rõ hơn conditional return cho JSDoc và Vue inference.

**Gotcha production**

- `never` extends mọi thứ; empty union sập. Generic nhận `never` từ `[]` im lặng match nhánh sai.
- Default Axios-style `T = any` làm false branch unreachable. Default `unknown`.
- Conditional type + `undefined` từ `exactOptionalPropertyTypes` — `?` vs `| undefined` quan trọng.

```ts
type ApiOk<T> = T extends void ? { ok: true } : { ok: true; data: T }

async function mutate<T>(path: string, body: unknown): Promise<ApiOk<T>> {
  const data = await api.post(path, body)
  return (data === undefined ? { ok: true } : { ok: true, data }) as ApiOk<T>
}
```

Dùng parser thay `as` ở ranh giới; conditional type là contract của **caller**.

**Câu hỏi nối**

1. Conditional distribute trên union khi nào, và dừng thế nào?
2. `infer R` trong function type vs `ReturnType` — khi nào vẫn viết `infer`?
3. Vì sao `T extends undefined ? A : B` bắn nhầm trên generic không constraint?
4. Overload vs conditional return — Vue `script setup` infer cái nào tốt hơn?
5. Viết type-level test cho cái này mà không chạy code thế nào?

---

#### 2.2.5. Template Literal Types

**Họ thực sự hỏi gì**

Event name, i18n key, hoặc CSS var phải khớp source of truth. Một ví dụ đủ: **`update:${keyof props}`** hoặc `on${Capitalize<K>}`.

**Cách senior trả lời**

Template literal cho type checker nối literal. Tôi dùng để `emit('update:modelValue', v)` không emit `'update:modelvalue'` hoặc field không phải prop. Constraint: chúng nổ tổ hợp (`HTTP × Route` ổn; `string × string` là `string` và chẳng mua gì). Failure mode: type `event: string` trên bus, compile mismatch `user:created` vs `userCreated`. Đo: rename prop, xem emit và listener fail trong `tsc`.

**Tradeoff**

- Đừng type cả URL router bằng template literal nếu bạn có router thật với params. Dùng typed helper của router (Vue Router 4 `RouteMap`, Nuxt `typedPages`).
- `Uppercase`/`Capitalize` cho tên kiểu protocol, không cho copy UI. Copy thuộc i18n, không thuộc type.
- Union template khổng lồ làm chậm `tsc`. Tách theo feature.

**Gotcha production**

- `as const` trên source object bắt buộc không thì interpolate `string`.
- Vue `v-on` / option `emits` vs `defineEmits<{ 'update:foo': [string] }>()` — một source, generate cái kia bằng mapped+template type nếu nhiều v-model.
- Path template `` `/users/${string}` `` không validate ID; branded id vẫn thuộc params.

```ts
type UpdateEmits<T> = {
  [K in keyof T & string as `update:${K}`]: [value: T[K]]
}

type UserForm = { name: string; email: string }
type UserFormEmits = UpdateEmits<UserForm>
// 'update:name' | 'update:email' — không 'update:Name', không 'change:name'
```

**Câu hỏi nối**

1. Vì sao `` `${keyof T}Changed` `` cần `T & string`?
2. Khi nào union template thành vấn đề compile-time performance?
3. Type key `provide/inject` để magic string không collide thế nào?
4. Vue Router: typed `name` vs template of paths — tin cái nào?
5. Vì sao `` `${string}@${string}` `` là email type yếu, và bạn làm gì thay?

---

#### 2.2.6. Branded và Opaque ID

**Họ thực sự hỏi gì**

`getUser(orderId)` compile vì cả hai là `string`. Outage production. Làm type error mà không runtime wrapper object thế nào?

**Cách senior trả lời**

Brand id: `type UserId = string & { readonly __brand: 'UserId' }`. Ở ranh giới (route param, JSON), parse bằng hàm trả `UserId`. Trong app, `getUser` chỉ nhận `UserId`. Constraint: cái này **erased** — dây vẫn là string; bạn có thể `as UserId` và nói dối. Failure mode: brand ở type level nhưng concatenate id trong URL không qua constructor, hoặc dùng `string` làm Map key “cho tiện.” Đo: call cấm `getUser(order.id)` trong type test.

**Tradeoff**

- Đừng brand mọi `string` (`Email`, `Url`, `CssColor`) ngày một. Brand **ID bị trộn liên tục** (`UserId`, `OrgId`, `OrderId`).
- Class `UserId` với private field là runtime brand (`instanceof` được) nhưng đau với JSON. FE bám type brand + parse.
- Zod `.brand<'UserId'>()` là bản tôi thật sự ship.

```ts
type UserId = string & { readonly __brand: 'UserId' }
type OrderId = string & { readonly __brand: 'OrderId' }

const asUserId = (s: string) => s as UserId // chỉ trong parseUserId()

function getUser(id: UserId) { /* … */ }
function getOrder(id: OrderId) { /* … */ }

declare const orderId: OrderId
// getUser(orderId) // error — đây là cả feature
```

**Gotcha production**

- `UserId | OrderId` widen trong `Set<string>` nếu `.add(id)` vào string set. Giữ collection generic.
- Template literal `` `/users/${id}` `` widen thành `string`. OK; hàm fetch vẫn nhận `UserId`.
- `as UserId` cạnh `JSON.parse` đưa lại bug gốc. Brand sống trong `parseUserId`, không mọi call site.

**Câu hỏi nối**

1. `as UserId` được phép ở đâu, và ai review những dòng đó?
2. Serialize branded id ra JSON không thêm key thế nào?
3. Vì sao không brand `uuid` vs brand `string` — bạn validate hình RFC không?
4. Hai brand vô tình compatible nếu cùng `__brand: string`?
5. Vue route param (`string`) vào `UserId` mà không rải `as` xuyên component tree thế nào?

---

#### 2.2.7. `satisfies`

**Họ thực sự hỏi gì**

`as const` làm object routes hẹp quá không pass chỗ cần `Record<string, string>`, hoặc `as Record<…>` widen value và mất literal key. `satisfies` đổi gì?

**Cách senior trả lời**

`satisfies` **check** value với một type **mà không widen** inferred type của value. Tôi dùng cho route map, design token, và bảng feature-flag: object phải khớp contract, nhưng `typeof routes.home` vẫn `'/'`. Failure mode: `as const` một mình không chứng minh bạn implement mọi key; `as Record<…>` nói dối literal. Đo: thêm required key vào contract, xem `satisfies` fail; rename value, xem call site vẫn thấy literal.

**Tradeoff**

- `satisfies` là TS 4.9+. Đừng polyfill bằng double assertion trên codebase 4.7 — upgrade.
- Không deep-freeze runtime. Pair `as const satisfies T` khi muốn cả literal lẫn check.
- Đừng `satisfies` mọi object; dùng ở ranh module (config, catalog).

```ts
const flags = {
  newCheckout: false,
  betaNav: true,
} as const satisfies Record<string, boolean>

type Flag = keyof typeof flags // 'newCheckout' | 'betaNav'
```

**Gotcha production**

- `satisfies` chỉ compile-time. Flags JSON từ remote config vẫn `unknown` — parse; đừng `satisfies` kết quả `JSON.parse`.
- Extra key được phép trừ khi type cấm. `satisfies Record<string, boolean>` không bắt tên flag typo; `satisfies Record<KnownFlag, boolean>` bắt nếu `KnownFlag` là union tên bạn định — hoặc đảo: `as const satisfies` rồi derive `KnownFlag` từ object.
- Vue SFC: `satisfies` trên argument `defineProps` là tool sai; dùng generic `defineProps<T>()`.

**Câu hỏi nối**

1. `as const` vs `satisfies` vs cả hai — type của `flags.newCheckout` mỗi trường hợp?
2. Ép mọi key `ThemeToken` tồn tại mà không mất literal color thế nào?
3. Vì sao `as Record<Flag, boolean>` tệ hơn ở đây?
4. `satisfies` bắt missing Vue `emits` key được không? Khi nào vẫn dùng `defineEmits<T>()`?
5. Vì sao `satisfies` không giúp ở ranh IndexedDB / `postMessage`?

---

#### 2.2.8. unknown vs any

**Họ thực sự hỏi gì**

`data: any` từ `JSON.parse`, axios, `event.data`, IndexedDB, `postMessage`. Vì sao `unknown` là default senior, và khi nào `any` là ngoại lệ có chủ đích?

**Cách senior trả lời**

`unknown` là “tôi phải narrow.” `any` là “cái này lây mọi expression nó chạm.” JSON, `catch (e)`, `MessageEvent.data`, `localStorage` — bắt đầu `unknown`, parse. Tôi cho `any` chỉ tại escape hatch có document (`.d.ts` gãy bạn sẽ xóa, hoặc `// eslint-disable` kèm ticket). Failure mode: một `any` từ axios `response.data` biến 40 dòng sau thành chương trình không type. Đo: `noImplicitAny` + `useUnknownInCatchVariables` + lint ban-types trên `any`.

**Tradeoff**

- `unknown` không phải runtime check. Bạn vẫn viết guard/schema.
- `object` gần như không phải thứ bạn muốn (`null` không phải `object` chờ đã — `typeof null === 'object'`; TS `object` loại primitive). Prefer `unknown` rồi narrow.
- Đừng type Vue ref nội bộ `unknown` sau khi đã parse. Narrow một lần ở mép.

**Gotcha production**

- `JSON.parse` trả `any` trong lib.dom / wrapper nên trả `unknown`.
- `any[]` vs `unknown[]`: `map` trên `any[]` vẫn `any`.
- Generic default `<T = any>` đầu độc inference. Default `unknown`.
- Vue `ref()` không annotation là `ref<any>` ở vài version nếu init `null`. Viết `ref<User | null>(null)`.

**Câu hỏi nối**

1. Vì sao `unknown` assignable **tới** chỉ vài thứ, còn `any` assignable **mọi nơi**?
2. Type `window.onmessage` không `any` thế nào?
3. `eslint @typescript-eslint/no-explicit-any` đủ chưa? Còn implicit any từ file JS?
4. `unknown` vs `Record<string, unknown>` cho JSON object — cái nào, và vì sao vẫn parse?
5. Khi nào tạm `any` widget third-party, và tiêu chí thoát là gì?

---

#### 2.2.9. tsconfig: strict và isolatedModules

**Họ thực sự hỏi gì**

`tsconfig` của bạn cho app Vue 3 + Vite có gì, flag nào non-negotiable năm 2026? Họ check bạn đã ship `strict` hay chỉ nói.

**Cách senior trả lời**

`strict: true` là sàn (`strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, …). Tôi còn muốn `noUncheckedIndexedAccess` (index → `T | undefined`), `exactOptionalPropertyTypes` nếu team chịu được, `useUnknownInCatchVariables`, `noImplicitOverride`, `verbatimModuleSyntax`, và **`isolatedModules`: true** vì Vite/esbuild transpile file cô lập — `const enum` và file non-module gãy. `skipLibCheck` là yes thực dụng cho app repo. Failure mode: tắt `strict` trong Nuxt layer “tạm,” rồi `undefined` đụng `.value.toFixed`. Đo: `vue-tsc --noEmit` trong CI, không chỉ `tsc`, để SFC được include.

**Tradeoff**

- Bật `noUncheckedIndexedAccess` trên app 200k dòng là một tuần nhiễu `?.`. Làm package mới trước; đừng giả vờ có nếu không có.
- `isolatedModules` cấm `const enum` và issue `export { type }` tùy version — `verbatimModuleSyntax` làm kind import tường minh. Tốt.
- `strict: true` với `any` khắp nơi là diễn. Pair lint ban.
- Path alias (`@/`) phải khớp Vite và `tsconfig`. Hai source of truth là class “IDE chạy, build fail.”

**Gotcha production**

- Vue: `strictTemplates: true` trong `vue-tsc` / `vueCompilerOptions` — thứ bắt prop sai. Nhiều team không bật.
- `isolatedModules` + `const enum` từ component library = runtime `undefined`. Dùng union type.
- Project references vs một `tsconfig` lớn — Nuxt generate của nó; đừng đánh, extend nó.
- `target`/`lib` quá cũ: không type `AbortSignal.any`. Quá mới: bạn ship syntax browser không chạy nếu không transpile (thường ổn với Vite).

**Câu hỏi nối**

1. Vì sao `isolatedModules` cấm `const enum`?
2. `vue-tsc` vs `tsc` — ai type-check file `.vue`?
3. `noUncheckedIndexedAccess` đổi gì về `rows[0]` và `Map.get`?
4. `skipLibCheck`: khi nào giấu bug thật với bạn?
5. `verbatimModuleSyntax` và `import type` ngăn type-only import thành runtime cycle thế nào?
6. Flag `strict*` nào bạn bật trước trong repo lỏng, vì sao?

---

#### 2.2.10. Typing Vue props và emits

**Họ thực sự hỏi gì**

Type component này: `v-model`, branded `userId`, discriminated `variant`, và emit parent phải handle. So nhanh với React props. Không runtime object `defineProps` không type.

**Cách senior trả lời**

Vue 3.3+ tôi type **compiler macro**: `defineProps<T>()` và `defineEmits<{ change: [id: UserId] }>()`. `v-model` là `modelValue` + `'update:modelValue'`. Default đi `withDefaults`. Tôi **không** nhân đôi runtime `props: { userId: String }` trừ khi cần runtime validation cho consumer không-TS. Constraint: prop one-way; mutate field của prop object vẫn là runtime bug type-legal — type `readonly` / pass primitive / emit. Failure mode: `emit('update:modelValue')` không payload, hoặc prop `string` chỗ cần `UserId` nên mọi parent `as`. Đo: `vue-tsc` trên parent: thiếu listener và sai type `userId` đều fail.

**Tradeoff**

- Runtime props (`Boolean`, `String`) vẫn quan trọng cho native custom element và usage JS-only. App TS-only thì type là contract.
- React: props là một object type; emit là callback (`onChange: (id: UserId) => void`). Vue tách props/emits — vì thế type `v-model` là special case, không clone “controlled component” React.
- `defineModel<UserId>()` là shortcut 3.4+. Dùng, nhưng biết trên dây vẫn là `modelValue`.
- Đừng type emit `(e: string, ...args: any[])`. Bạn vứt feature.

**Gotcha production**

- Optional boolean prop: `visible?: boolean` vs default `false` — `withDefaults` vs `??` trong script. Unpassed vs `false` vs `undefined` trong Vue là FAQ; runtime prop `Boolean` cast empty attr thành `true`.
- `defineProps<Imported>()` historically cần local alias ở vài version Vue. CI fail chỉ trên imported interface thì đây là lý do.
- Không declare `emits` → fallthrough native event / `vnode` attr, listener parent không typed.
- Hydration: default prop dùng `Date.now()` hoặc `Math.random()` trong factory desync SSR.
- So React: `forwardRef` + `ComponentProps<'button'>` analog của `inheritAttrs`. Vue 3 `inheritAttrs: false` + `$attrs` typed là control senior.

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

**Câu hỏi nối**

1. Type nhiều `v-model` (`modelValue` + `modelModifiers`) thế nào?
2. Vì sao mutate `props.user.role` vừa anti-pattern Vue vừa vẫn type-legal? Làm illegal thế nào?
3. `defineModel` vs props/emits tường minh — khi nào tránh sugar?
4. React `ComponentProps<typeof Button>` và Vue `InstanceType` so thế nào khi wrap design-system button?
5. Branded `UserId` parse ở đâu: parent route, hay child prop validator?
6. `vue-tsc` báo gì nếu parent listen `@Select` thay `@select`?

---

[← Back to Overview](../../README.md)
