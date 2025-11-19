# TypeScript

Kiến thức TypeScript từ cơ bản đến nâng cao cho Senior Frontend Developer.

---

## Table of Contents

1. [Interface vs Type](#1-interface-vs-type)
2. [Generics](#2-generics)
3. [Type Narrowing](#3-type-narrowing)
4. [Utility Types](#4-utility-types)
5. [Type Guards & Predicates](#5-type-guards--predicates)
6. [Mapped Types](#6-mapped-types)
7. [Conditional Types](#7-conditional-types)
8. [Template Literal Types](#8-template-literal-types)

---
## 2. TypeScript

### 2.1. Interface vs Type

**Câu trả lời chuẩn Senior:**

`interface` và `type` đều dùng để khai báo kiểu dữ liệu trong TypeScript nhưng có sự khác nhau về mục đích và khả năng mở rộng.

#### **Interface**

Phù hợp cho mô tả **shape của object**, thiết kế API, hoặc định nghĩa cho class.

- Có khả năng **mở rộng (extend/merge)** mạnh mẽ.
- TS cho phép _declaration merging_ giữa nhiều interface cùng tên.

**Ví dụ:**

```ts
interface User {
  id: number;
  name: string;
}
interface User {
  // merge
  age: number;
}
// Result: User có id, name, age
```

#### **Type Alias**

Dùng để đặt tên cho **bất kỳ kiểu gì**, linh hoạt hơn interface.

- Hỗ trợ union, intersection, primitive, function type…
- Không hỗ trợ declaration merging.

**Ví dụ:**

```ts
type Response = { success: boolean } | { error: string };
```

#### **Khi nào dùng gì?**

- **interface**: khi mô tả object + muốn extend hoặc dùng với class.
- **type**: khi cần union, utility types, hoặc các cấu trúc phức tạp.

Trong TS hiện đại, `type` được dùng nhiều hơn vì đa năng hơn, nhưng interface vẫn rất mạnh cho mô tả object rõ ràng.

---

### 2.2. Generics

Giúp tạo kiểu dữ liệu tái sử dụng và đảm bảo type safety.

**Ví dụ:**

```ts
function wrap<T>(value: T): { data: T } {
  return { data: value };
}
const result = wrap<string>("Hello");
```

**Use cases phổ biến:**

- Reusable utility functions
- API response wrappers
- Component props với kiểu động
- Custom hooks/composables

---

### 2.3. Type Narrowing

Giúp thu hẹp kiểu từ rộng → chính xác hơn dựa trên runtime checks.

**Các kỹ thuật thường dùng:**

- **typeof**: kiểm tra primitive
- **instanceof**: kiểm tra class instance
- **in**: kiểm tra key tồn tại trong object
- **discriminated unions**: dùng chung một trường phân biệt

**Ví dụ:**

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };

function area(s: Shape) {
  if (s.kind === "circle") return Math.PI * s.radius ** 2; // narrowed to circle
  return s.size * s.size; // narrowed to square
}
```

---

## 2. TypeScript Advanced

### 2.1. Utility Types

**Câu trả lời chuẩn Senior:**

TypeScript cung cấp built-in utility types để transform types.

#### **Partial\<T>** - Tất cả properties thành optional

```ts
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// All properties optional
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number; }

// Use case: Update functions
function updateUser(id: number, updates: Partial<User>) {
  // Can update any subset of properties
}

updateUser(1, { name: "Alice" }); // ✅
updateUser(1, { age: 30, email: "new@email.com" }); // ✅
```

#### **Required\<T>** - Tất cả properties thành required

```ts
interface Config {
  host?: string;
  port?: number;
  ssl?: boolean;
}

type RequiredConfig = Required<Config>;
// { host: string; port: number; ssl: boolean; }

function validateConfig(config: Required<Config>) {
  // All properties must be present
}
```

#### **Readonly\<T>** - Tất cả properties thành readonly

```ts
interface Mutable {
  x: number;
  y: number;
}

type Immutable = Readonly<Mutable>;
// { readonly x: number; readonly y: number; }

const point: Immutable = { x: 10, y: 20 };
point.x = 30; // ❌ Error: Cannot assign to 'x' because it is read-only
```

#### **Pick\<T, K>** - Chọn subset of properties

```ts
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

// Only pick specific properties
type UserPreview = Pick<User, "id" | "name" | "email">;
// { id: number; name: string; email: string; }

// Use case: API responses
function getUserPreview(id: number): UserPreview {
  // Return user without sensitive data
}
```

#### **Omit\<T, K>** - Loại bỏ properties

```ts
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Omit sensitive fields
type PublicUser = Omit<User, "password">;
// { id: number; name: string; email: string; }

// Use case: Form data (omit auto-generated fields)
type UserForm = Omit<User, "id">;
```

#### **Record\<K, T>** - Tạo object type với keys cố định

```ts
type Role = "admin" | "user" | "guest";

// Create object with specific keys
type Permissions = Record<Role, string[]>;
// {
//   admin: string[];
//   user: string[];
//   guest: string[];
// }

const permissions: Permissions = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"],
};

// Use case: Map/Dictionary types
type UserMap = Record<number, User>; // { [userId: number]: User }
```

#### **Exclude\<T, U>** - Loại bỏ types từ union

```ts
type AllRoles = "admin" | "user" | "guest" | "superadmin";
type RegularRoles = Exclude<AllRoles, "superadmin">;
// "admin" | "user" | "guest"

// Use case: Filter types
type NonNullable<T> = Exclude<T, null | undefined>;
```

#### **Extract\<T, U>** - Giữ lại types có trong union

```ts
type AllTypes = string | number | boolean | null;
type PrimitiveTypes = Extract<AllTypes, string | number>;
// string | number
```

#### **NonNullable\<T>** - Loại bỏ null & undefined

```ts
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// string

// Use case: Filtering arrays
function filterNulls<T>(arr: T[]): NonNullable<T>[] {
  return arr.filter((item) => item != null) as NonNullable<T>[];
}
```

#### **ReturnType\<T>** - Lấy return type của function

```ts
function getUser() {
  return { id: 1, name: "Alice" };
}

type User = ReturnType<typeof getUser>;
// { id: number; name: string; }

// Use case: Type từ API response
const fetchData = async () => {
  return { data: [], total: 0 };
};

type ApiResponse = ReturnType<typeof fetchData>;
// Promise<{ data: any[]; total: number; }>

type UnwrappedResponse = Awaited<ApiResponse>;
// { data: any[]; total: number; }
```

#### **Parameters\<T>** - Lấy parameters type của function

```ts
function createUser(name: string, age: number, active: boolean) {
  // ...
}

type CreateUserParams = Parameters<typeof createUser>;
// [string, number, boolean]

// Use case: Re-use function params
function logUserCreation(...args: CreateUserParams) {
  console.log("Creating user with:", args);
  createUser(...args);
}
```

#### **Awaited\<T>** - Unwrap Promise type

```ts
type AsyncString = Promise<string>;
type UnwrappedString = Awaited<AsyncString>;
// string

type NestedPromise = Promise<Promise<number>>;
type UnwrappedNumber = Awaited<NestedPromise>;
// number (recursively unwraps)
```

#### **Combining Utility Types**

```ts
interface ApiUser {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create user form (omit auto-generated fields, make email optional)
type UserForm = Partial<Pick<ApiUser, "email">> &
  Omit<ApiUser, "id" | "createdAt" | "updatedAt" | "email">;

// Update user (all fields optional except id)
type UpdateUserDto = Pick<ApiUser, "id"> &
  Partial<Omit<ApiUser, "id" | "password" | "createdAt" | "updatedAt">>;
```

---

### 2.2. Type Guards & Predicates

**Câu trả lời chuẩn Senior:**

Type guards giúp TypeScript narrow types trong conditional blocks.

#### **typeof Type Guard**

```ts
function processValue(value: string | number) {
  if (typeof value === "string") {
    // TypeScript knows value is string here
    return value.toUpperCase();
  } else {
    // TypeScript knows value is number here
    return value.toFixed(2);
  }
}
```

#### **instanceof Type Guard**

```ts
class Dog {
  bark() {
    return "Woof!";
  }
}

class Cat {
  meow() {
    return "Meow!";
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    return animal.bark(); // TypeScript knows it's Dog
  } else {
    return animal.meow(); // TypeScript knows it's Cat
  }
}
```

#### **in Operator Type Guard**

```ts
interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

function move(animal: Bird | Fish) {
  if ("fly" in animal) {
    animal.fly(); // TypeScript knows it's Bird
  } else {
    animal.swim(); // TypeScript knows it's Fish
  }
}
```

#### **Custom Type Predicates**

```ts
interface User {
  type: "user";
  name: string;
}

interface Admin {
  type: "admin";
  name: string;
  permissions: string[];
}

// Custom type guard with 'is' keyword
function isAdmin(user: User | Admin): user is Admin {
  return user.type === "admin";
}

function processUser(user: User | Admin) {
  if (isAdmin(user)) {
    // TypeScript knows user is Admin
    console.log(user.permissions);
  } else {
    // TypeScript knows user is User
    console.log(user.name);
  }
}
```

#### **Discriminated Unions**

```ts
interface SuccessResponse {
  status: "success";
  data: any;
}

interface ErrorResponse {
  status: "error";
  error: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

function handleResponse(response: ApiResponse) {
  // Discriminant: 'status' field
  if (response.status === "success") {
    console.log(response.data); // ✅ TypeScript knows it's SuccessResponse
  } else {
    console.log(response.error); // ✅ TypeScript knows it's ErrorResponse
  }
}
```

#### **Assertion Functions**

```ts
function assert(condition: any, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

function processUser(user: User | null) {
  assert(user !== null, "User must be defined");
  // After this line, TypeScript knows user is NOT null
  console.log(user.name); // ✅ No error
}

// Specific type assertion
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Not a string");
  }
}

function handleValue(value: unknown) {
  assertIsString(value);
  // After this, TypeScript knows value is string
  console.log(value.toUpperCase());
}
```

---

### 2.3. Mapped Types

**Câu trả lời chuẩn Senior:**

Mapped types cho phép transform tất cả properties của type.

#### **Basic Mapped Type**

```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};
```

#### **Adding Modifiers**

```ts
interface User {
  readonly id: number;
  name?: string;
}

// Remove readonly
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

type MutableUser = Mutable<User>;
// { id: number; name?: string; }

// Remove optional
type Required<T> = {
  [P in keyof T]-?: T[P];
};

type RequiredUser = Required<User>;
// { readonly id: number; name: string; }
```

#### **Conditional Property Types**

```ts
// Make all properties nullable
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

interface User {
  name: string;
  age: number;
}

type NullableUser = Nullable<User>;
// { name: string | null; age: number | null; }
```

#### **Key Remapping (as clause)**

```ts
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

interface User {
  name: string;
  age: number;
}

type UserGetters = Getters<User>;
// {
//   getName: () => string;
//   getAge: () => number;
// }
```

#### **Filtering Properties**

```ts
// Remove specific properties
type OmitType<T, K> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

// Keep only function properties
type FunctionProperties<T> = {
  [P in keyof T as T[P] extends Function ? P : never]: T[P];
};

interface Example {
  name: string;
  age: number;
  greet(): void;
  calculate(): number;
}

type OnlyFunctions = FunctionProperties<Example>;
// { greet: () => void; calculate: () => number; }
```

---

### 2.4. Conditional Types

**Câu trả lời chuẩn Senior:**

Conditional types cho phép type logic: `T extends U ? X : Y`

#### **Basic Conditional Types**

```ts
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// Practical example: Extract array element type
type Flatten<T> = T extends Array<infer U> ? U : T;

type NumArray = number[];
type Num = Flatten<NumArray>; // number

type Str = Flatten<string>; // string (not array)
```

#### **infer Keyword**

```ts
// Extract return type
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { id: 1, name: "Alice" };
}

type UserType = GetReturnType<typeof getUser>;
// { id: number; name: string; }

// Extract Promise value
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type AsyncNumber = Promise<number>;
type SyncNumber = UnwrapPromise<AsyncNumber>; // number
```

#### **Distributive Conditional Types**

```ts
type ToArray<T> = T extends any ? T[] : never;

// When T is union, it distributes over each member
type StringOrNumber = string | number;
type Arrays = ToArray<StringOrNumber>;
// string[] | number[] (distributes over union)

// Prevent distribution with tuple
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;
type SingleArray = ToArrayNonDist<StringOrNumber>;
// (string | number)[] (single array, not distributed)
```

#### **Complex Conditional Example**

```ts
// Extract all property names that match specific type
type PropertiesOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

interface User {
  id: number;
  name: string;
  age: number;
  active: boolean;
  email: string;
}

type StringKeys = PropertiesOfType<User, string>;
// "name" | "email"

type NumberKeys = PropertiesOfType<User, number>;
// "id" | "age"
```

---

### 2.5. Template Literal Types

**Câu trả lời chuẩn Senior:**

Template literal types cho phép manipulate string types.

#### **Basic Template Literals**

```ts
type World = "world";
type Greeting = `hello ${World}`;
// "hello world"

type EmailAddress = `${string}@${string}.${string}`;
// Any string matching email pattern
```

#### **String Manipulation Utilities**

```ts
type Uppercase<S extends string> = intrinsic;
type Lowercase<S extends string> = intrinsic;
type Capitalize<S extends string> = intrinsic;
type Uncapitalize<S extends string> = intrinsic;

type Loud = Uppercase<"hello">; // "HELLO"
type Quiet = Lowercase<"HELLO">; // "hello"
type Capitalized = Capitalize<"hello">; // "Hello"
type Uncapped = Uncapitalize<"Hello">; // "hello"
```

#### **Event Handler Types**

```ts
type PropEventSource<T> = {
  on<K extends string & keyof T>(
    eventName: `${K}Changed`,
    callback: (newValue: T[K]) => void
  ): void;
};

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;

const person = makeWatchedObject({
  firstName: "John",
  age: 30,
});

person.on("firstNameChanged", (newName) => {
  // newName is string
  console.log(newName.toUpperCase());
});

person.on("ageChanged", (newAge) => {
  // newAge is number
  console.log(newAge.toFixed());
});
```

#### **API Route Types**

```ts
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type Route = "/users" | "/posts" | "/comments";
type APIEndpoint = `${HTTPMethod} ${Route}`;

// "GET /users" | "GET /posts" | ... | "DELETE /comments"
```

---


---

[← Back to Overview](../README.md)
