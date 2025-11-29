# TypeScript

TypeScript knowledge from basic to advanced for Senior Frontend Developer.

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

---

## 2. TypeScript

### 2.1. Core Concepts

#### 2.1.1. Interface vs Type

**Senior-level Answer:**

`interface` and `type` are both used to declare types in TypeScript but have differences in purpose and extensibility.

#### **Interface**

Suitable for describing **object shape**, API design, or class definitions.

- Can **extend/merge** powerfully.
- TS allows _declaration merging_ between interfaces with same name.

```ts
interface User {
  id: number;
  name: string;
}
interface User {
  age: number; // merge
}
// Result: User has id, name, age
```

#### **Type Alias**

Used to name **any type**, more flexible than interface.

- Supports union, intersection, primitive, function types.
- Does not support declaration merging.

```ts
type Response = { success: boolean } | { error: string };
```

#### **When to use what?**

- **interface**: for object shapes + when need to extend or use with classes.
- **type**: for unions, utility types, or complex structures.

In modern TS, `type` is used more often due to versatility, but interface is still powerful for clear object descriptions.

---

#### 2.1.2. Generics

Helps create reusable types and ensure type safety.

```ts
function wrap<T>(value: T): { data: T } {
  return { data: value };
}
const result = wrap<string>("Hello");
```

**Common use cases:**

- Reusable utility functions
- API response wrappers
- Component props with dynamic types
- Custom hooks/composables

---

#### 2.1.3. Type Narrowing

Helps narrow types from broad → more specific based on runtime checks.

**Common techniques:**

- **typeof**: check primitive
- **instanceof**: check class instance
- **in**: check key exists in object
- **discriminated unions**: use common discriminant field

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };

function area(s: Shape) {
  if (s.kind === "circle") return Math.PI * s.radius ** 2;
  return s.size * s.size;
}
```

---

### 2.2. Advanced Types

#### 2.2.1. Utility Types

**Senior-level Answer:**

TypeScript provides built-in utility types to transform types.

#### **Partial\<T>** - All properties optional

```ts
type PartialUser = Partial<User>;
// { id?: number; name?: string; ... }

function updateUser(id: number, updates: Partial<User>) {}
```

#### **Required\<T>** - All properties required

```ts
type RequiredConfig = Required<Config>;
```

#### **Readonly\<T>** - All properties readonly

```ts
type Immutable = Readonly<Mutable>;
```

#### **Pick\<T, K>** - Select subset of properties

```ts
type UserPreview = Pick<User, "id" | "name" | "email">;
```

#### **Omit\<T, K>** - Remove properties

```ts
type PublicUser = Omit<User, "password">;
```

#### **Record\<K, T>** - Create object type with fixed keys

```ts
type Role = "admin" | "user" | "guest";
type Permissions = Record<Role, string[]>;
```

#### **Exclude\<T, U>** - Remove types from union

```ts
type RegularRoles = Exclude<AllRoles, "superadmin">;
```

#### **Extract\<T, U>** - Keep types in union

```ts
type PrimitiveTypes = Extract<AllTypes, string | number>;
```

#### **NonNullable\<T>** - Remove null & undefined

```ts
type DefiniteString = NonNullable<MaybeString>;
```

#### **ReturnType\<T>** - Get function return type

```ts
function getUser() {
  return { id: 1, name: "Alice" };
}
type User = ReturnType<typeof getUser>;
```

#### **Parameters\<T>** - Get function parameters type

```ts
type CreateUserParams = Parameters<typeof createUser>;
```

#### **Awaited\<T>** - Unwrap Promise type

```ts
type UnwrappedString = Awaited<Promise<string>>; // string
```

---

#### 2.2.2. Type Guards & Predicates

**Senior-level Answer:**

Type guards help TypeScript narrow types in conditional blocks.

#### **typeof Type Guard**

```ts
function processValue(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else {
    return value.toFixed(2);
  }
}
```

#### **instanceof Type Guard**

```ts
function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    return animal.bark();
  } else {
    return animal.meow();
  }
}
```

#### **in Operator Type Guard**

```ts
function move(animal: Bird | Fish) {
  if ("fly" in animal) {
    animal.fly();
  } else {
    animal.swim();
  }
}
```

#### **Custom Type Predicates**

```ts
function isAdmin(user: User | Admin): user is Admin {
  return user.type === "admin";
}
```

#### **Discriminated Unions**

```ts
type ApiResponse = SuccessResponse | ErrorResponse;

function handleResponse(response: ApiResponse) {
  if (response.status === "success") {
    console.log(response.data);
  } else {
    console.log(response.error);
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
  console.log(user.name); // ✅ No error
}
```

---

#### 2.2.3. Mapped Types

**Senior-level Answer:**

Mapped types allow transforming all properties of a type.

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
// Remove readonly
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// Remove optional
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

#### **Conditional Property Types**

```ts
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};
```

#### **Key Remapping (as clause)**

```ts
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

// UserGetters = { getName: () => string; getAge: () => number; }
```

#### **Filtering Properties**

```ts
// Keep only function properties
type FunctionProperties<T> = {
  [P in keyof T as T[P] extends Function ? P : never]: T[P];
};
```

---

#### 2.2.4. Conditional Types

**Senior-level Answer:**

Conditional types allow type logic: `T extends U ? X : Y`

#### **Basic Conditional Types**

```ts
type IsString<T> = T extends string ? true : false;

// Extract array element type
type Flatten<T> = T extends Array<infer U> ? U : T;
```

#### **infer Keyword**

```ts
// Extract return type
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Extract Promise value
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
```

#### **Distributive Conditional Types**

```ts
type ToArray<T> = T extends any ? T[] : never;

// When T is union, it distributes over each member
type Arrays = ToArray<string | number>;
// string[] | number[]
```

#### **Complex Conditional Example**

```ts
// Extract all property names that match specific type
type PropertiesOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

type StringKeys = PropertiesOfType<User, string>;
// "name" | "email"
```

---

#### 2.2.5. Template Literal Types

**Senior-level Answer:**

Template literal types allow manipulating string types.

#### **Basic Template Literals**

```ts
type World = "world";
type Greeting = `hello ${World}`; // "hello world"

type EmailAddress = `${string}@${string}.${string}`;
```

#### **String Manipulation Utilities**

```ts
type Loud = Uppercase<"hello">; // "HELLO"
type Quiet = Lowercase<"HELLO">; // "hello"
type Capitalized = Capitalize<"hello">; // "Hello"
```

#### **Event Handler Types**

```ts
type PropEventSource<T> = {
  on<K extends string & keyof T>(
    eventName: `${K}Changed`,
    callback: (newValue: T[K]) => void
  ): void;
};

const person = makeWatchedObject({ firstName: "John", age: 30 });

person.on("firstNameChanged", (newName) => {
  console.log(newName.toUpperCase()); // newName is string
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

[← Back to Overview](../../README-en.md)

