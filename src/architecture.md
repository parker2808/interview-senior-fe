# Architecture & Design Patterns

Các mẫu kiến trúc phần mềm và nguyên tắc thiết kế cho scalable frontend applications.

---

## V. Professional Skills

## 15. Architecture & Design Patterns

## Table of Contents

1. [Các mẫu Component](#151-các-mẫu-component)

2. [Các mẫu thiết kế](#152-các-mẫu-thiết-kế)

3. [Nguyên tắc SOLID trong Frontend](#153-nguyên-tắc-solid-trong-frontend)

4. [Module Federation & Micro-frontends](#154-module-federation--micro-frontends)

---

### 15.1. Các mẫu Component

**Câu trả lời chuẩn Senior:**

#### **1. Presentational vs Container**

| Type               | Vai trò                        | Ví dụ                      |
| ------------------ | ------------------------------ | -------------------------- |
| **Presentational** | Hiển thị UI, nhận props        | `Button`, `Card`, `Avatar` |
| **Container**      | Xử lý logic, fetch data, state | `UserListContainer`        |

```vue
<!-- Presentational: UserCard.vue -->
<script setup>
defineProps({
  user: Object,
  onEdit: Function,
});
</script>

<template>
  <div class="user-card">
    <h3>{{ user.name }}</h3>
    <button @click="onEdit">Edit</button>
  </div>
</template>

<!-- Container: UserListContainer.vue -->
<script setup>
import { ref, onMounted } from "vue";
import UserCard from "./UserCard.vue";

const users = ref([]);

onMounted(async () => {
  users.value = await fetchUsers();
});

const handleEdit = (user) => {
  // business logic
};
</script>

<template>
  <UserCard
    v-for="user in users"
    :key="user.id"
    :user="user"
    :on-edit="() => handleEdit(user)"
  />
</template>
```

#### **2. Render Props Pattern**

```vue
<!-- DataProvider.vue -->
<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  url: String,
});

const data = ref(null);
const loading = ref(true);

onMounted(async () => {
  data.value = await fetch(props.url).then((r) => r.json());
  loading.value = false;
});
</script>

<template>
  <slot :data="data" :loading="loading" />
</template>

<!-- Usage -->
<DataProvider url="/api/users">
  <template #default="{ data, loading }">
    <div v-if="loading">Loading...</div>
    <div v-else>{{ data }}</div>
  </template>
</DataProvider>
```

#### **3. Compound Components**

```vue
<!-- Tabs.vue -->
<script setup>
import { provide, ref } from "vue";

const activeTab = ref(0);
provide("activeTab", activeTab);
</script>

<template>
  <div class="tabs">
    <slot />
  </div>
</template>

<!-- Tab.vue -->
<script setup>
import { inject } from "vue";

const props = defineProps({ index: Number, label: String });
const activeTab = inject("activeTab");
</script>

<template>
  <button @click="activeTab = index" :class="{ active: activeTab === index }">
    {{ label }}
  </button>
</template>

<!-- Usage -->
<Tabs>
  <Tab :index="0" label="Home" />
  <Tab :index="1" label="Profile" />
</Tabs>
```

---

### 15.2. Các mẫu thiết kế

**Câu trả lời chuẩn Senior:**

#### **1. Singleton Pattern**

```js
// apiClient.js - chỉ có 1 instance duy nhất
class ApiClient {
  static instance = null;

  constructor() {
    if (ApiClient.instance) {
      return ApiClient.instance;
    }

    this.baseURL = "/api";
    ApiClient.instance = this;
  }

  async get(url) {
    return fetch(`${this.baseURL}${url}`);
  }
}

export default new ApiClient();
```

#### **2. Factory Pattern**

```js
// Tạo components động
class ComponentFactory {
  static create(type, props) {
    const components = {
      button: ButtonComponent,
      input: InputComponent,
      select: SelectComponent,
    };

    return components[type] || null;
  }
}

// Usage
const component = ComponentFactory.create("button", { text: "Click me" });
```

#### **3. Observer Pattern**

```js
// Event Bus
class EventBus {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((cb) => cb(data));
    }
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }
  }
}

export default new EventBus();

// Usage
eventBus.on("user:login", (user) => {
  console.log("User logged in:", user);
});

eventBus.emit("user:login", { id: 1, name: "Alice" });
```

#### **4. Decorator Pattern**

```js
// Higher-Order Function
function withLogging(fn) {
  return function (...args) {
    console.log(`Calling ${fn.name} with`, args);
    const result = fn(...args);
    console.log(`Result:`, result);
    return result;
  };
}

// Usage
const add = (a, b) => a + b;
const addWithLogging = withLogging(add);

addWithLogging(2, 3); // Logs input & output
```

#### **5. Strategy Pattern**

```js
// Payment strategies
class PaymentProcessor {
  constructor(strategy) {
    this.strategy = strategy;
  }

  process(amount) {
    return this.strategy.pay(amount);
  }
}

const strategies = {
  creditCard: {
    pay: (amount) => `Paid ${amount} via Credit Card`,
  },
  paypal: {
    pay: (amount) => `Paid ${amount} via PayPal`,
  },
  crypto: {
    pay: (amount) => `Paid ${amount} via Crypto`,
  },
};

// Usage
const processor = new PaymentProcessor(strategies.creditCard);
processor.process(100);
```

---

### 15.3. Nguyên tắc SOLID trong Frontend

**Câu trả lời chuẩn Senior:**

#### **S - Single Responsibility Principle**

Mỗi component/function chỉ làm **1 việc**.

```vue
❌ Bad - Component làm quá nhiều thứ
<script setup>
// UserProfile: fetch data + render + validation + submit
const user = ref(null);
const errors = ref({});

const fetchUser = async () => {
  /* ... */
};
const validateForm = () => {
  /* ... */
};
const submitForm = () => {
  /* ... */
};
</script>

✅ Good - Tách thành nhiều components
<!-- UserProfile.vue: chỉ render -->
<!-- useUser.js: composable cho data fetching -->
<!-- useFormValidation.js: composable cho validation -->
```

#### **O - Open/Closed Principle**

Open for extension, closed for modification.

```js
// Base Button - không sửa code này
const BaseButton = {
  props: ["label"],
  template: "<button><slot /></button>",
};

// Extend thay vì modify
const PrimaryButton = {
  extends: BaseButton,
  template: '<button class="primary"><slot /></button>',
};
```

#### **L - Liskov Substitution Principle**

Subclass phải thay thế được parent class.

```js
// Parent
class Animal {
  makeSound() {
    return "Some sound";
  }
}

// Child - có thể thay thế Animal
class Dog extends Animal {
  makeSound() {
    return "Woof!"; // Override nhưng vẫn return string
  }
}
```

#### **I - Interface Segregation Principle**

Không ép component implement interface không dùng.

```ts
❌ Bad
interface User {
  login(): void;
  logout(): void;
  updateProfile(): void;
  deleteAccount(): void; // Guest không cần
}

✅ Good - Tách nhỏ
interface Authenticatable {
  login(): void;
  logout(): void;
}

interface ProfileManageable {
  updateProfile(): void;
  deleteAccount(): void;
}
```

#### **D - Dependency Inversion Principle**

Depend on abstractions, not concrete implementations.

```js
❌ Bad - Depend vào concrete class
class UserService {
  constructor() {
    this.api = new AxiosClient(); // Hard-coded
  }
}

✅ Good - Inject dependency
class UserService {
  constructor(apiClient) {
    this.api = apiClient; // Có thể swap với FetchClient, MockClient
  }
}

// Usage
const service = new UserService(new AxiosClient());
```

---

### 15.4. Module Federation & Micro-frontends

**Câu trả lời chuẩn Senior:**

#### **Micro-frontends là gì?**

Chia frontend thành nhiều apps độc lập, mỗi team sở hữu 1 phần.

```
┌─────────────────────────────────┐
│      Shell App (Container)      │
├─────────┬──────────┬────────────┤
│ Header  │ Products │  Checkout  │
│ (Team A)│ (Team B) │  (Team C)  │
└─────────┴──────────┴────────────┘
```

#### **Module Federation (Webpack 5):**

**Host App (Shell):**

```js
// webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      remotes: {
        products: "products@http://localhost:3001/remoteEntry.js",
        checkout: "checkout@http://localhost:3002/remoteEntry.js",
      },
      shared: {
        vue: { singleton: true },
        "vue-router": { singleton: true },
      },
    }),
  ],
};
```

**Remote App (Products):**

```js
// webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "products",
      filename: "remoteEntry.js",
      exposes: {
        "./ProductList": "./src/components/ProductList.vue",
      },
      shared: {
        vue: { singleton: true },
      },
    }),
  ],
};
```

**Usage trong Host:**

```vue
<script setup>
import { defineAsyncComponent } from "vue";

const ProductList = defineAsyncComponent(() => import("products/ProductList"));
</script>

<template>
  <Suspense>
    <ProductList />
  </Suspense>
</template>
```

#### **Khi nào dùng Micro-frontends:**

✅ **Dùng khi:**

- Large team (50+ devs)
- Multiple teams, mỗi team 1 domain
- Muốn deploy độc lập
- Tech stack khác nhau (Vue + React)

❌ **Không dùng khi:**

- Small team (< 10 devs)
- Simple app
- Overhead > benefit

#### **Challenges:**

- **Shared state**: Dùng event bus, query params
- **Styling conflicts**: CSS modules, scoped styles
- **Performance**: Lazy load, code splitting
- **Testing**: Integration tests phức tạp hơn

---

[← Quay lại Tổng quan](../README.md)
