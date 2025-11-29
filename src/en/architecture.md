# Architecture & Design Patterns

Software architecture patterns and design principles for scalable frontend applications.

---

## V. Professional Skills

## 15. Architecture & Design Patterns

## Table of Contents

1. [Component Patterns](#151-component-patterns)

2. [Design Patterns](#152-design-patterns)

3. [SOLID Principles in Frontend](#153-solid-principles-in-frontend)

4. [Module Federation & Micro-frontends](#154-module-federation--micro-frontends)

---

### 15.1. Component Patterns

**Senior-level Answer:**

#### **1. Presentational vs Container**

| Type               | Role                     | Example                    |
| ------------------ | ------------------------ | -------------------------- |
| **Presentational** | Display UI, receive props | `Button`, `Card`, `Avatar` |
| **Container**      | Handle logic, fetch data  | `UserListContainer`        |

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

const props = defineProps({ url: String });
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
```

---

### 15.2. Design Patterns

**Senior-level Answer:**

#### **1. Singleton Pattern**

```js
// apiClient.js - only one instance
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
// Create components dynamically
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
```

#### **3. Observer Pattern**

```js
// Event Bus
class EventBus {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) this.events[event] = [];
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
```

#### **4. Decorator Pattern**

```js
// Higher-Order Function
function withLogging(fn) {
  return function (...args) {
    console.log(`Calling ${fn.name} with`, args);
    const result = fn(...args);
    return result;
  };
}

const add = (a, b) => a + b;
const addWithLogging = withLogging(add);
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
  creditCard: { pay: (amount) => `Paid ${amount} via Credit Card` },
  paypal: { pay: (amount) => `Paid ${amount} via PayPal` },
  crypto: { pay: (amount) => `Paid ${amount} via Crypto` },
};
```

---

### 15.3. SOLID Principles in Frontend

**Senior-level Answer:**

#### **S - Single Responsibility Principle**

Each component/function should do **one thing**.

```vue
❌ Bad - Component does too much
<script setup>
// UserProfile: fetch + render + validation + submit
</script>

✅ Good - Split into multiple components
<!-- UserProfile.vue: only renders -->
<!-- useUser.js: composable for data fetching -->
<!-- useFormValidation.js: composable for validation -->
```

#### **O - Open/Closed Principle**

Open for extension, closed for modification.

```js
// Base Button - don't modify this
const BaseButton = {
  props: ["label"],
  template: "<button><slot /></button>",
};

// Extend instead of modify
const PrimaryButton = {
  extends: BaseButton,
  template: '<button class="primary"><slot /></button>',
};
```

#### **L - Liskov Substitution Principle**

Subclass must be replaceable with parent class.

```js
class Animal {
  makeSound() {
    return "Some sound";
  }
}

// Can replace Animal
class Dog extends Animal {
  makeSound() {
    return "Woof!"; // Override but still returns string
  }
}
```

#### **I - Interface Segregation Principle**

Don't force component to implement unused interface.

```ts
❌ Bad
interface User {
  login(): void;
  logout(): void;
  updateProfile(): void;
  deleteAccount(): void; // Guest doesn't need
}

✅ Good - Split into smaller interfaces
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
❌ Bad - Depend on concrete class
class UserService {
  constructor() {
    this.api = new AxiosClient(); // Hard-coded
  }
}

✅ Good - Inject dependency
class UserService {
  constructor(apiClient) {
    this.api = apiClient; // Can swap with FetchClient, MockClient
  }
}
```

---

### 15.4. Module Federation & Micro-frontends

**Senior-level Answer:**

#### **What is Micro-frontends?**

Split frontend into multiple independent apps, each team owns one part.

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
      },
      shared: {
        vue: { singleton: true },
      },
    }),
  ],
};
```

**Remote App (Products):**

```js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "products",
      filename: "remoteEntry.js",
      exposes: {
        "./ProductList": "./src/components/ProductList.vue",
      },
      shared: { vue: { singleton: true } },
    }),
  ],
};
```

#### **When to use Micro-frontends:**

✅ **Use when:**

- Large team (50+ devs)
- Multiple teams, each owns a domain
- Want independent deployment
- Different tech stacks (Vue + React)

❌ **Don't use when:**

- Small team (< 10 devs)
- Simple app
- Overhead > benefit

#### **Challenges:**

- **Shared state**: Use event bus, query params
- **Styling conflicts**: CSS modules, scoped styles
- **Performance**: Lazy load, code splitting
- **Testing**: Integration tests more complex

---

[← Back to Overview](../../README-en.md)

