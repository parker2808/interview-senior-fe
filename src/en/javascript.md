# JavaScript

Comprehensive JavaScript knowledge from core to advanced for Senior Frontend Developer.

---

## Table of Contents

1. **Core Concepts**

   1.1. [High-order Array Functions](#111-high-order-array-functions)

   1.2. [Promise vs Async/Await](#112-promise-vs-asyncawait)

   1.3. [Event Loop, Microtask, Macrotask](#113-event-loop-microtask-macrotask)

   1.4. [var vs let vs const](#114-var-vs-let-vs-const)

2. **Advanced Concepts**

   2.1. [Closure & Scope](#121-closure--scope)

   2.2. [Prototypes & Inheritance](#122-prototypes--inheritance)

   2.3. [`this` Keyword](#123-this-keyword)

   2.4. [ES6+ Modern Features](#124-es6-modern-features)

   2.5. [Memory Management & Garbage Collection](#125-memory-management--garbage-collection)

   2.6. [Hoisting & Temporal Dead Zone](#126-hoisting--temporal-dead-zone)

---

## I. Core Web Technologies

## 1. JavaScript

### 1.1. Core Concepts

#### 1.1.1. High-order Array Functions

Modern array functions **don't mutate** original array (except mutating group). Here's the concise Senior-level version.

#### **Non-mutating**

- **map** → create new array by transforming elements
- **filter** → filter by condition
- **reduce** → combine into single value
- **slice** → cut, no mutation
- **concat** → join arrays
- **flat** → flatten
- **find / findIndex** → find element
- **every / some** → check conditions
- **toReversed / toSorted / toSpliced (ES2023)** → immutable versions

#### **Mutating (use carefully)**

- **push / pop / shift / unshift** → add/remove start/end
- **splice** → add/remove middle
- **sort / reverse** → mutate directly
- **fill / copyWithin** → overwrite data

**Quick memory:**

- If name starts with **toX** → immutable
- If "short, common" method (push/pop/splice/sort) → mutates
- Modern FE (Vue/React) prefer **immutable** to avoid unnecessary re-renders

---

#### 1.1.2. Promise vs Async/Await

#### **Promise**

- Represents a _future_ value (pending → fulfilled/rejected)
- Can lead to chaining `.then().then()` → hard to read
- Key utilities:
  - `Promise.all()` → run parallel, fail if one fails
  - `Promise.race()` → return fastest result
  - `Promise.allSettled()` → doesn't fail entire group
  - `Promise.any()` → get first successful

#### **Async/Await**

- Syntactic sugar for Promise
- Makes async code look synchronous
- `await` only blocks within async function, **not** event loop
- Easy try/catch for error handling

**Senior example:**

```ts
async function loadData() {
  try {
    const [user, posts] = await Promise.all([api.getUser(), api.getPosts()]);
    return { user, posts };
  } catch (err) {
    console.error("Load failed:", err);
  }
}
```

---

#### 1.1.3. Event Loop, Microtask, Macrotask

**Senior-level Answer:**

JavaScript is single-threaded, needs **Event Loop** to coordinate execution.

- **Microtask queue**: Promise callbacks, queueMicrotask, MutationObserver. _Priority execution before other tasks._
- **Macrotask queue**: setTimeout, setInterval, setImmediate, I/O, DOM events.

**Event Loop cycle:**

1. Execute synchronous code on call stack
2. When stack empty → process _all_ microtasks first
3. After microtasks empty → take one macrotask and run
4. Repeat

`async/await` is just syntactic sugar for Promise - `await` pauses async function execution and queued as microtask.

---

#### 1.1.4. var vs let vs const

**Senior-level Answer:**

| Feature           | `var`                         | `let`            | `const`      |
| ----------------- | ----------------------------- | ---------------- | ------------ |
| **Scope**         | Function-scoped               | Block-scoped     | Block-scoped |
| **Hoisting**      | ✅ Hoisted, init = `undefined` | ✅ Hoisted, TDZ   | ✅ Hoisted, TDZ |
| **Re-declare**    | ✅ Allowed                     | ❌ Error          | ❌ Error      |
| **Re-assign**     | ✅ Allowed                     | ✅ Allowed        | ❌ Error      |
| **Global Object** | ✅ Adds to `window`            | ❌ Doesn't add    | ❌ Doesn't add |
| **Best Practice** | ❌ Avoid                       | ✅ When reassign  | ✅✅ Default  |

**Quick examples:**

```js
// var: function-scoped
if (true) {
  var x = 10;
}
console.log(x); // 10

// let/const: block-scoped
if (true) {
  let y = 20;
}
console.log(y); // ReferenceError

// Classic loop problem
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}
```

**When to use:**

- `const` → default (90% cases)
- `let` → when need reassignment
- `var` → never use (legacy only)

---

### 1.2. Advanced Concepts

#### 1.2.1. Closure & Scope

**Senior-level Answer:**

**Closure** is a function that has access to variables from outer scope (lexical scope) even after outer function returned.

```js
function outer() {
  const outerVar = "I'm outside";
  return function inner() {
    console.log(outerVar); // Access outer scope
  };
}

const closureFunc = outer();
closureFunc(); // "I'm outside" - closure still has access!
```

**Practical Use Cases:**

**1. Data Privacy**

```js
function createCounter() {
  let count = 0; // Private
  return {
    increment: () => ++count,
    getCount: () => count,
  };
}

const counter = createCounter();
console.log(counter.count); // undefined - can't access directly!
```

**2. Function Factory**

```js
function makeMultiplier(multiplier) {
  return (number) => number * multiplier;
}

const double = makeMultiplier(2);
console.log(double(5)); // 10
```

---

#### 1.2.2. Prototypes & Inheritance

**Senior-level Answer:**

JavaScript is **prototype-based**. Every object has an internal link to another object called **prototype**.

```js
function Person(name) {
  this.name = name;
}

// Add methods to prototype (shared across instances)
Person.prototype.greet = function () {
  return `Hi, I'm ${this.name}`;
};

const john = new Person("John");
console.log(john.greet === new Person("Jane").greet); // true - same reference!
```

**ES6 Classes (Syntactic Sugar):**

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  eat() {
    return `${this.name} is eating`;
  }
}

class Dog extends Animal {
  bark() {
    return "Woof!";
  }
}
```

---

#### 1.2.3. `this` Keyword

**Senior-level Answer:**

`this` in JavaScript is **runtime binding**, not compile-time. Value depends on **how function is called**.

**4 Rules:**

**1. Default Binding**

```js
function showThis() {
  console.log(this);
}
showThis(); // Window/global (non-strict) / undefined (strict)
```

**2. Implicit Binding**

```js
const user = {
  name: "John",
  greet() {
    console.log(this.name);
  },
};
user.greet(); // "John"
```

**3. Explicit Binding (call, apply, bind)**

```js
function introduce(greeting) {
  return `${greeting}, I'm ${this.name}`;
}

const person = { name: "Alice" };
introduce.call(person, "Hello"); // "Hello, I'm Alice"
introduce.apply(person, ["Hi"]); // "Hi, I'm Alice"
const bound = introduce.bind(person);
```

**4. `new` Binding**

```js
function User(name) {
  this.name = name;
}
const user = new User("Bob");
```

**Arrow Functions:**

Arrow functions **don't have own `this`**, inherit from enclosing scope (lexical this).

```js
const obj = {
  name: "Alice",
  arrowFunc() {
    setTimeout(() => {
      console.log(this.name); // "Alice" - inherits this
    }, 100);
  },
};
```

---

#### 1.2.4. ES6+ Modern Features

**Senior-level Answer:**

**Destructuring:**

```js
const { name, age } = user;
const [first, ...rest] = [1, 2, 3, 4];
```

**Spread & Rest:**

```js
const arr2 = [...arr1, 4, 5];
const obj2 = { ...obj1, c: 3 };
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b);
}
```

**Optional Chaining & Nullish Coalescing:**

```js
const city = user?.profile?.address?.city;
const value = data ?? "default"; // Only null/undefined trigger default
```

**Template Literals:**

```js
const message = `Hello ${name}, you are ${age} years old`;
```

**Enhanced Object Literals:**

```js
const user = { name, age }; // Shorthand
const obj = {
  sayHi() {
    return "Hi";
  }, // Method shorthand
  [propName]: "value", // Computed property
};
```

---

#### 1.2.5. Memory Management & Garbage Collection

**Senior-level Answer:**

**Common Memory Leaks:**

**1. Global Variables**

```js
// ❌ Accidental global
function leak() {
  leakyVar = "Creates global!";
}

// ✅ Use strict mode
("use strict");
```

**2. Forgotten Timers**

```js
// ❌ Leak
const timerId = setInterval(() => console.log(data), 1000);

// ✅ Clear when done
clearInterval(timerId);
```

**3. Detached DOM References**

```js
// ❌ Element removed but still referenced
const button = document.querySelector("#btn");
document.body.removeChild(button);

// ✅ Nullify
button = null;
```

**4. Event Listeners Not Removed**

```js
// ✅ Vue 3: auto cleanup
import { onMounted, onUnmounted } from "vue";

onMounted(() => window.addEventListener("resize", handleResize));
onUnmounted(() => window.removeEventListener("resize", handleResize));
```

**WeakMap & WeakSet:**

```js
// Regular Map prevents GC
const map = new Map();
map.set(obj, "data");

// WeakMap allows GC
const weakMap = new WeakMap();
weakMap.set(obj, "data");
obj = null; // Can be garbage collected!
```

---

#### 1.2.6. Hoisting & Temporal Dead Zone

**Senior-level Answer:**

JavaScript moves declarations to top of scope during compilation.

**Function Hoisting:**

```js
// ✅ Works: function declarations fully hoisted
sayHello();
function sayHello() {
  console.log("Hello");
}

// ❌ Error: function expressions NOT hoisted
sayHi(); // ReferenceError
const sayHi = () => console.log("Hi");
```

**Variable Hoisting:**

```js
// var: hoisted and initialized with undefined
console.log(x); // undefined
var x = 5;

// let/const: hoisted but in TDZ
console.log(y); // ReferenceError
let y = 10;
```

**Temporal Dead Zone (TDZ):**

Time between entering scope and declaration where variables cannot be accessed.

```js
{
  // TDZ starts
  console.log(a); // ReferenceError
  let a = 1; // TDZ ends
  console.log(a); // 1 ✅
}
```

---

[← Back to Overview](../../README-en.md)

