# JavaScript

Tổng hợp kiến thức JavaScript từ core đến advanced cho Senior Frontend Developer.

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

Các hàm mảng hiện đại đều **không mutate** mảng gốc (trừ nhóm mutate). Dưới đây là phiên bản rút gọn – dễ nhớ – chuẩn Senior.

#### **Không làm thay đổi mảng gốc**

- **map** → tạo mảng mới bằng transform phần tử.
- **filter** → lọc theo điều kiện.
- **reduce** → gom thành 1 giá trị.
- **slice** → cắt, không mutate.
- **concat** → nối mảng.
- **flat** → làm phẳng.
- **find / findIndex** → tìm phần tử.
- **every / some** → kiểm tra.
- **toReversed / toSorted / toSpliced (ES2023)** → phiên bản immutable.

#### **Làm thay đổi mảng gốc (cẩn trọng khi dùng)**

- **push / pop / shift / unshift** → thêm/xóa đầu/cuối.
- **splice** → thêm/xóa giữa mảng.
- **sort / reverse** → mutate trực tiếp.
- **fill / copyWithin** → ghi đè dữ liệu.

**Ghi nhớ nhanh:**

- Nếu tên bắt đầu bằng **toX** → immutable.
- Nếu là phương thức "ngắn, phổ thông" (push/pop/splice/sort) → mutate.
- Với FE hiện đại (Vue/React), ưu tiên **immutable** để tránh re-render thừa.

---

#### 1.1.2. Promise vs Async/Await

#### **Promise**

- Đại diện cho một giá trị _trong tương lai_ (pending → fulfilled/rejected).
- Dễ bị chaining `.then().then()` → khó đọc nếu logic dài.
- Các utility quan trọng:
  - `Promise.all()` → chạy song song, fail nếu 1 cái fail.
  - `Promise.race()` → trả về kết quả nhanh nhất.
  - `Promise.allSettled()` → không fail cả nhóm.
  - `Promise.any()` → lấy promise thành công đầu tiên.

#### **Async/Await**

- Syntactic sugar của Promise.
- Giúp code trông như đồng bộ nhưng thực chất chạy bất đồng bộ.
- `await` chỉ block trong phạm vi hàm async, **không** block event loop.
- Dễ kết hợp try/catch để xử lý lỗi.

**Ví dụ chuẩn Senior:**

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

**Tóm gọn:**

- Promise cho khả năng xử lý bất đồng bộ linh hoạt.
- Async/await giúp code dễ đọc, nhưng vẫn dựa trên Promise.

---

#### 1.1.3. Event Loop, Microtask, Macrotask

**Câu trả lời chuẩn Senior:**

JavaScript chạy đơn luồng (single-threaded) nên cần **Event Loop** để điều phối việc thực thi. Khi call stack trống, event loop sẽ lấy công việc từ các hàng đợi:

- **Microtask queue**: chứa Promise callbacks, queueMicrotask, MutationObserver. _Được ưu tiên chạy trước mọi loại task khác._
- **Macrotask queue**: setTimeout, setInterval, setImmediate, I/O, DOM events.

**Event Loop thực thi theo chu trình:**

1. Thực thi code đồng bộ vào call stack.
2. Khi stack rỗng → xử lý _tất cả_ microtask trước.
3. Sau khi microtask rỗng → lấy một macrotask và chạy.
4. Lặp lại.

`async/await` thực chất chỉ là syntactic sugar của Promise:

- `await` tạm dừng việc thực thi hàm async.
- Giá trị trả về được wrap thành một Promise.
- Phần phía sau `await` được đưa vào microtask queue nên vẫn theo đúng nguyên tắc ưu tiên microtask.

---

#### 1.1.4. var vs let vs const

**Câu trả lời chuẩn Senior:**

| Đặc điểm          | `var`                          | `let`               | `const`         |
| ----------------- | ------------------------------ | ------------------- | --------------- |
| **Scope**         | Function-scoped                | Block-scoped        | Block-scoped    |
| **Hoisting**      | ✅ Hoisted, init = `undefined` | ✅ Hoisted, TDZ     | ✅ Hoisted, TDZ |
| **Re-declare**    | ✅ Cho phép                    | ❌ Error            | ❌ Error        |
| **Re-assign**     | ✅ Cho phép                    | ✅ Cho phép         | ❌ Error        |
| **Global Object** | ✅ Thêm vào `window`           | ❌ Không thêm       | ❌ Không thêm   |
| **Best Practice** | ❌ Tránh dùng                  | ✅ Khi cần reassign | ✅✅ Mặc định   |

#### **Scope Differences**

```js
// var: function-scoped
function testVar() {
  if (true) {
    var x = 10;
  }
  console.log(x); // 10 - accessible outside block
}

// let/const: block-scoped
function testLet() {
  if (true) {
    let y = 20;
    const z = 30;
  }
  console.log(y); // ReferenceError
  console.log(z); // ReferenceError
}
```

#### **Hoisting Behavior**

```js
// var: hoisted and initialized with undefined
console.log(a); // undefined
var a = 5;

// let/const: hoisted but in TDZ
console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 10;

console.log(c); // ReferenceError
const c = 15;
```

#### **Re-declaration & Re-assignment**

```js
// var: can re-declare
var x = 1;
var x = 2; // ✅ OK

// let: cannot re-declare, can re-assign
let y = 1;
let y = 2; // ❌ SyntaxError
y = 3; // ✅ OK

// const: cannot re-declare or re-assign
const z = 1;
const z = 2; // ❌ SyntaxError
z = 3; // ❌ TypeError

// ⚠️ const with objects/arrays - reference is immutable, content is not
const obj = { name: "Alice" };
obj.name = "Bob"; // ✅ OK - modifying content
obj = {}; // ❌ TypeError - reassigning reference

const arr = [1, 2, 3];
arr.push(4); // ✅ OK - modifying content
arr = []; // ❌ TypeError - reassigning reference
```

#### **Loop Scope Problem**

```js
// ❌ Classic var problem
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 (all share same 'i')

// ✅ let creates new binding per iteration
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2 (each iteration has own 'i')
```

#### **Global Object Pollution**

```js
// var adds to global object
var globalVar = "I'm global";
console.log(window.globalVar); // "I'm global" (browser)

// let/const don't add to global object
let blockVar = "I'm block-scoped";
console.log(window.blockVar); // undefined
```

#### **Khi nào dùng cái gì?**

```js
// ✅ Mặc định: dùng const
const API_URL = "https://api.example.com";
const user = { name: "Alice" };

// ✅ Khi cần reassign: dùng let
let count = 0;
for (let i = 0; i < 10; i++) {
  count += i;
}

// ❌ Tránh var: chỉ dùng khi support IE cũ
// var hasIssues = true;
```

**Ghi nhớ nhanh:**

- `const` → mặc định (90% cases)
- `let` → khi cần thay đổi giá trị
- `var` → không dùng (legacy code only)

---

### 1.2. Advanced Concepts

#### 1.2.1. Closure & Scope

**Câu trả lời chuẩn Senior:**

**Closure** là function có quyền truy cập vào variables của outer scope (lexical scope) ngay cả khi outer function đã return.

#### **Lexical Scope**

JavaScript dùng **lexical scoping** (static scoping) - scope được xác định tại thời điểm viết code, không phải runtime.

```js
function outer() {
  const outerVar = "I'm outside";

  function inner() {
    console.log(outerVar); // Access outer scope
  }

  return inner;
}

const closureFunc = outer();
closureFunc(); // "I'm outside" - closure still has access!
```

#### **Practical Use Cases**

**1. Data Privacy (Private Variables)**

```js
function createCounter() {
  let count = 0; // Private variable

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    },
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
console.log(counter.count); // undefined - can't access directly!
```

**2. Function Factory**

```js
function makeMultiplier(multiplier) {
  return function (number) {
    return number * multiplier;
  };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

**3. Event Handlers & Callbacks**

```js
function setupButtons() {
  const buttons = document.querySelectorAll(".btn");

  buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      // Closure captures 'index'
      console.log(`Button ${index} clicked`);
    });
  });
}
```

#### **Common Pitfall: Loop Closure**

```js
// ❌ Classic mistake with var
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i); // 3, 3, 3 (all print 3!)
  }, 1000);
}

// ✅ Fix 1: Use let (block scope)
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i); // 0, 1, 2
  }, 1000);
}

// ✅ Fix 2: IIFE (Immediately Invoked Function Expression)
for (var i = 0; i < 3; i++) {
  (function (captured) {
    setTimeout(() => {
      console.log(captured); // 0, 1, 2
    }, 1000);
  })(i);
}
```

#### **Memory Implications**

```js
function heavyClosure() {
  const hugeArray = new Array(1000000).fill("data");

  return function () {
    // This closure keeps hugeArray in memory!
    console.log(hugeArray[0]);
  };
}

// ✅ Better: Only keep what you need
function optimizedClosure() {
  const hugeArray = new Array(1000000).fill("data");
  const firstItem = hugeArray[0]; // Extract only needed data

  return function () {
    console.log(firstItem); // hugeArray can be garbage collected
  };
}
```

---

#### 1.2.2. Prototypes & Inheritance

**Câu trả lời chuẩn Senior:**

JavaScript là **prototype-based language**. Mọi object đều có một internal link đến object khác gọi là **prototype**.

#### **Prototype Chain**

```js
const obj = { a: 1 };

// obj.__proto__ → Object.prototype → null

obj.toString(); // Inherited from Object.prototype
```

#### **Constructor Functions & Prototypes**

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Add methods to prototype (shared across all instances)
Person.prototype.greet = function () {
  return `Hi, I'm ${this.name}`;
};

Person.prototype.getAge = function () {
  return this.age;
};

const john = new Person("John", 30);
const jane = new Person("Jane", 25);

console.log(john.greet()); // "Hi, I'm John"
console.log(john.greet === jane.greet); // true - same reference!
```

#### **Prototype vs Instance Properties**

```js
function Car(brand) {
  this.brand = brand; // Instance property (unique per instance)
  this.drive = function () {
    // ❌ Bad: creates new function for each instance
    console.log("Driving");
  };
}

Car.prototype.stop = function () {
  // ✅ Good: shared across all instances
  console.log("Stopping");
};

const car1 = new Car("Toyota");
const car2 = new Car("Honda");

console.log(car1.drive === car2.drive); // false - different functions
console.log(car1.stop === car2.stop); // true - same reference
```

#### **Inheritance Patterns**

**1. Prototypal Inheritance**

```js
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function () {
  return `${this.name} is eating`;
};

function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function () {
  return "Woof!";
};

const dog = new Dog("Buddy", "Golden Retriever");
console.log(dog.eat()); // "Buddy is eating"
console.log(dog.bark()); // "Woof!"
```

**2. ES6 Classes (Syntactic Sugar)**

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
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  bark() {
    return "Woof!";
  }
}

const dog = new Dog("Buddy", "Golden Retriever");
```

#### **Object.create() Pattern**

```js
const animalMethods = {
  eat() {
    return `${this.name} is eating`;
  },
  sleep() {
    return `${this.name} is sleeping`;
  },
};

function createAnimal(name) {
  const animal = Object.create(animalMethods);
  animal.name = name;
  return animal;
}

const cat = createAnimal("Whiskers");
console.log(cat.eat()); // "Whiskers is eating"
```

#### **Checking Prototype Chain**

```js
const dog = new Dog("Buddy", "Golden");

// Check prototype chain
console.log(dog instanceof Dog); // true
console.log(dog instanceof Animal); // true
console.log(dog instanceof Object); // true

// Check own properties
console.log(dog.hasOwnProperty("name")); // true
console.log(dog.hasOwnProperty("eat")); // false (inherited)

// Get prototype
console.log(Object.getPrototypeOf(dog) === Dog.prototype); // true
```

---

#### 1.2.3. `this` Keyword

**Câu trả lời chuẩn Senior:**

`this` trong JavaScript **không phải compile-time binding** mà là **runtime binding**. Giá trị của `this` phụ thuộc vào **cách function được gọi**.

#### **4 Rules xác định `this`**

**1. Default Binding (Global Context)**

```js
function showThis() {
  console.log(this);
}

showThis(); // Window (browser) / global (Node) trong non-strict mode
// undefined trong strict mode
```

**2. Implicit Binding (Object Method)**

```js
const user = {
  name: "John",
  greet() {
    console.log(this.name);
  },
};

user.greet(); // "John" - this = user

// ❌ Pitfall: Lost context
const greet = user.greet;
greet(); // undefined - this = global/undefined
```

**3. Explicit Binding (call, apply, bind)**

```js
function introduce(greeting, punctuation) {
  return `${greeting}, I'm ${this.name}${punctuation}`;
}

const person = { name: "Alice" };

// call: arguments individually
console.log(introduce.call(person, "Hello", "!")); // "Hello, I'm Alice!"

// apply: arguments as array
console.log(introduce.apply(person, ["Hi", "."])); // "Hi, I'm Alice."

// bind: returns new function with bound this
const boundIntroduce = introduce.bind(person);
console.log(boundIntroduce("Hey", "!!")); // "Hey, I'm Alice!!"
```

**4. `new` Binding (Constructor)**

```js
function User(name) {
  this.name = name;
  this.greet = function () {
    return `Hi, I'm ${this.name}`;
  };
}

const user = new User("Bob");
console.log(user.greet()); // "Hi, I'm Bob"
```

#### **Arrow Functions & `this`**

Arrow functions **không có `this` riêng**, inherit `this` từ enclosing scope (lexical this).

```js
const obj = {
  name: "Alice",
  regularFunc() {
    console.log(this.name); // "Alice"

    setTimeout(function () {
      console.log(this.name); // undefined - this = global
    }, 100);
  },
  arrowFunc() {
    console.log(this.name); // "Alice"

    setTimeout(() => {
      console.log(this.name); // "Alice" - arrow function inherits this
    }, 100);
  },
};
```

#### **Common Pitfalls & Solutions**

**Pitfall 1: Event Handlers**

```js
class Button {
  constructor() {
    this.count = 0;
  }

  // ❌ Problem: lost context
  handleClick() {
    this.count++;
    console.log(this.count);
  }

  setupWrong() {
    document.querySelector(".btn").addEventListener("click", this.handleClick);
    // this.handleClick called without object context
  }

  // ✅ Solution 1: Arrow function
  setupArrow() {
    document
      .querySelector(".btn")
      .addEventListener("click", () => this.handleClick());
  }

  // ✅ Solution 2: bind
  setupBind() {
    document
      .querySelector(".btn")
      .addEventListener("click", this.handleClick.bind(this));
  }

  // ✅ Solution 3: Class field arrow function
  handleClickArrow = () => {
    this.count++;
    console.log(this.count);
  };
}
```

**Pitfall 2: Method Extraction**

```js
const calculator = {
  value: 0,
  add(n) {
    this.value += n;
    return this;
  },
  multiply(n) {
    this.value *= n;
    return this;
  },
};

// ❌ Lost context
const add = calculator.add;
add(5); // Error: cannot read property 'value' of undefined

// ✅ Bind context
const boundAdd = calculator.add.bind(calculator);
boundAdd(5);

// ✅ Method chaining works fine
calculator.add(5).multiply(2); // this preserved in chain
```

#### **Vue 3 Context**

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);

// ✅ Arrow function preserves component context
const increment = () => {
  count.value++;
};

// ✅ Regular function in setup also works (setup scope)
function decrement() {
  count.value--;
}

// ❌ Don't need to worry about 'this' in Composition API!
// (Unlike Options API where 'this' refers to component instance)
</script>
```

---

#### 1.2.4. ES6+ Modern Features

**Câu trả lời chuẩn Senior:**

#### **1. Destructuring**

```js
// Object destructuring
const user = { name: "Alice", age: 30, city: "NYC" };
const { name, age } = user;

// Renaming
const { name: userName, age: userAge } = user;

// Default values
const { country = "USA" } = user;

// Nested destructuring
const data = {
  user: { profile: { email: "alice@example.com" } },
};
const {
  user: {
    profile: { email },
  },
} = data;

// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(rest); // [3, 4, 5]

// Swapping variables
let a = 1,
  b = 2;
[a, b] = [b, a];
```

#### **2. Spread & Rest Operators**

```js
// Spread operator (...)
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// Shallow clone
const clone = { ...original };

// Merge objects (later properties override)
const merged = { ...defaults, ...userOptions };

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4); // 10
```

#### **3. Optional Chaining (?.) & Nullish Coalescing (??)**

```js
const user = {
  profile: {
    address: {
      city: "NYC",
    },
  },
};

// ❌ Old way
const city =
  user && user.profile && user.profile.address && user.profile.address.city;

// ✅ Optional chaining
const city = user?.profile?.address?.city; // "NYC"
const zipCode = user?.profile?.address?.zipCode; // undefined (no error!)

// Optional chaining with functions
obj.method?.(); // Call only if method exists

// Optional chaining with arrays
const firstItem = arr?.[0];

// Nullish coalescing (??) - only null/undefined trigger default
const value = data ?? "default"; // Use 'default' only if data is null/undefined

// vs OR operator (|| triggers on any falsy value)
const count = 0;
console.log(count || 10); // 10 (0 is falsy)
console.log(count ?? 10); // 0 (0 is not null/undefined)
```

#### **4. Template Literals**

```js
const name = "Alice";
const age = 30;

// Multi-line strings
const message = `
  Hello ${name},
  You are ${age} years old.
  Next year you'll be ${age + 1}.
`;

// Tagged templates
function highlight(strings, ...values) {
  return strings.reduce(
    (result, str, i) =>
      result + str + (values[i] ? `<mark>${values[i]}</mark>` : ""),
    ""
  );
}

const html = highlight`Hello ${name}, you are ${age} years old`;
// "Hello <mark>Alice</mark>, you are <mark>30</mark> years old"
```

#### **5. Enhanced Object Literals**

```js
const name = "Alice";
const age = 30;

// Shorthand property names
const user = { name, age }; // { name: "Alice", age: 30 }

// Shorthand method syntax
const obj = {
  // Old way
  sayHello: function () {
    return "Hello";
  },
  // New way
  sayHi() {
    return "Hi";
  },
};

// Computed property names
const propName = "dynamicKey";
const obj = {
  [propName]: "value",
  [`${propName}_2`]: "value2",
};
```

#### **6. Modules (import/export)**

```js
// Named exports
export const PI = 3.14159;
export function sum(a, b) {
  return a + b;
}
export class Calculator {}

// Default export
export default function main() {
  // ...
}

// Importing
import main from "./main.js"; // default import
import { PI, sum } from "./math.js"; // named imports
import { sum as add } from "./math.js"; // rename
import * as Math from "./math.js"; // namespace import

// Re-exporting
export { PI, sum } from "./math.js";
export * from "./utils.js";
```

---

#### 1.2.5. Memory Management & Garbage Collection

**Câu trả lời chuẩn Senior:**

#### **Memory Lifecycle**

1. **Allocate** memory
2. **Use** memory (read/write)
3. **Release** memory (garbage collection)

#### **Common Memory Leaks**

**1. Global Variables**

```js
// ❌ Accidental globals
function leak() {
  leakyVar = "This creates a global!"; // No 'var', 'let', or 'const'
}

// ✅ Use strict mode
("use strict");
function noLeak() {
  leakyVar = "This will throw an error";
}
```

**2. Forgotten Timers & Callbacks**

```js
// ❌ Memory leak
const data = fetchHugeData();
setInterval(() => {
  console.log(data); // data never released
}, 1000);

// ✅ Clear timers when done
const data = fetchHugeData();
const timerId = setInterval(() => {
  console.log(data);
}, 1000);

// Later...
clearInterval(timerId);
```

**3. Detached DOM References**

```js
// ❌ Leak: element removed from DOM but still referenced
const button = document.querySelector("#myButton");
document.body.removeChild(button); // Element removed but 'button' still holds reference

// ✅ Nullify references
button = null;
```

**4. Closures Holding Large Objects**

```js
// ❌ Entire largeData stays in memory
function createClosure() {
  const largeData = new Array(1000000);
  return function () {
    console.log(largeData[0]);
  };
}

// ✅ Only keep what you need
function createOptimizedClosure() {
  const largeData = new Array(1000000);
  const firstItem = largeData[0];
  return function () {
    console.log(firstItem); // largeData can be GC'd
  };
}
```

**5. Event Listeners Not Removed**

```js
// ❌ Leak in SPA when component unmounts
const element = document.querySelector("#btn");
element.addEventListener("click", handleClick);
// Component destroyed but listener remains

// ✅ Remove listeners
element.removeEventListener("click", handleClick);

// ✅ Vue 3: auto cleanup in onUnmounted
import { onMounted, onUnmounted } from "vue";

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
```

#### **WeakMap & WeakSet**

```js
// Regular Map prevents garbage collection
const map = new Map();
let obj = { data: "large object" };
map.set(obj, "metadata");
obj = null; // Object still in memory (Map holds reference)

// WeakMap allows garbage collection
const weakMap = new WeakMap();
let obj2 = { data: "large object" };
weakMap.set(obj2, "metadata");
obj2 = null; // Object can be garbage collected!

// Use case: Private data
const privateData = new WeakMap();

class User {
  constructor(name) {
    privateData.set(this, { secretKey: Math.random() });
    this.name = name;
  }

  getSecret() {
    return privateData.get(this).secretKey;
  }
}
```

#### **Memory Profiling (Chrome DevTools)**

```
1. Open DevTools → Memory tab
2. Take Heap Snapshot
3. Interact with app
4. Take another snapshot
5. Compare snapshots to find leaks
6. Check Detached DOM nodes
7. Look for unexpected large objects
```

---

#### 1.2.6. Hoisting & Temporal Dead Zone

**Câu trả lời chuẩn Senior:**

#### **Hoisting**

JavaScript moves declarations to the top of their scope during compilation phase.

**Function Hoisting**

```js
// ✅ Works: function declarations are fully hoisted
sayHello(); // "Hello"

function sayHello() {
  console.log("Hello");
}

// ❌ Error: function expressions are NOT hoisted
sayHi(); // ReferenceError

const sayHi = function () {
  console.log("Hi");
};
```

**Variable Hoisting**

```js
// var: hoisted and initialized with undefined
console.log(x); // undefined (not ReferenceError)
var x = 5;

// Equivalent to:
var x;
console.log(x);
x = 5;

// let/const: hoisted but NOT initialized (TDZ)
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;
```

#### **Temporal Dead Zone (TDZ)**

The time between entering scope and declaration where variables cannot be accessed.

```js
{
  // TDZ starts
  console.log(a); // ReferenceError
  console.log(b); // ReferenceError

  let a = 1; // TDZ ends for 'a'
  const b = 2; // TDZ ends for 'b'

  console.log(a); // 1 ✅
}
```

**TDZ with typeof**

```js
// ❌ ReferenceError (TDZ)
console.log(typeof x);
let x;

// ✅ Works with var
console.log(typeof y); // "undefined"
var y;

// ✅ Works with undeclared variables
console.log(typeof undeclaredVar); // "undefined"
```

#### **Block Scope vs Function Scope**

```js
// var: function-scoped
function testVar() {
  if (true) {
    var x = 10;
  }
  console.log(x); // 10 (accessible outside block)
}

// let/const: block-scoped
function testLet() {
  if (true) {
    let y = 20;
  }
  console.log(y); // ReferenceError
}

// Classic var problem in loops
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
} // Prints: 3, 3, 3

// let creates new binding per iteration
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
} // Prints: 0, 1, 2
```

#### **Best Practices**

```js
// ✅ Always declare variables before use
// ✅ Prefer const (immutable binding)
const API_URL = "https://api.example.com";

// ✅ Use let when reassignment needed
let count = 0;
count++;

// ❌ Avoid var
// var has function scope and hoisting issues

// ✅ Declare functions before use (even though hoisted)
function calculate() {
  // ...
}
calculate();
```

---

---

[← Back to Overview](../README.md)
