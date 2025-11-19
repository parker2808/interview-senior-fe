# Architecture & Design Patterns

Software architecture patterns và design principles cho scalable frontend applications.

---

## Table of Contents

1. [Component Patterns](#1-component-patterns)
2. [Design Patterns](#2-design-patterns)
3. [SOLID Principles in Frontend](#3-solid-principles-in-frontend)
4. [Module Federation & Micro-frontends](#4-module-federation--micro-frontends)

---
## 9. Architecture & Design Patterns

### 9.1. Component Patterns

#### **1. Renderless Components (Scoped Slots)**

```vue
<!-- MouseTracker.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const x = ref(0);
const y = ref(0);

const updatePosition = (e) => {
  x.value = e.pageX;
  y.value = e.pageY;
};

onMounted(() => {
  window.addEventListener("mousemove", updatePosition);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", updatePosition);
});
</script>

<template>
  <slot :x="x" :y="y" />
</template>

<!-- Usage -->
<MouseTracker v-slot="{ x, y }">
  <p>Mouse position: {{ x }}, {{ y }}</p>
</MouseTracker>
```

#### **2. Higher-Order Components (Composables)**

```ts
// composables/useAuth.ts
export function useAuth() {
  const user = ref(null);
  const isAuthenticated = computed(() => !!user.value);

  const login = async (credentials) => {
    const response = await api.login(credentials);
    user.value = response.user;
  };

  const logout = () => {
    user.value = null;
  };

  return { user, isAuthenticated, login, logout };
}

// Component
<script setup>
  import {useAuth} from '@/composables/useAuth' const{" "}
  {(user, isAuthenticated, login, logout)} = useAuth()
</script>;
```

#### **3. Provider Pattern (Provide/Inject)**

```vue
<!-- ThemeProvider.vue -->
<script setup>
import { provide, ref } from "vue";

const theme = ref("light");
const toggleTheme = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
};

provide("theme", { theme, toggleTheme });
</script>

<template>
  <slot />
</template>

<!-- Child component -->
<script setup>
import { inject } from "vue";

const { theme, toggleTheme } = inject("theme");
</script>
```

#### **4. Compound Components**

```vue
<!-- Tabs.vue -->
<script setup>
import { provide, ref } from "vue";

const activeTab = ref(0);
provide("tabs", { activeTab });
</script>

<template>
  <div class="tabs">
    <slot />
  </div>
</template>

<!-- Tab.vue -->
<script setup>
import { inject, computed } from "vue";

const props = defineProps<{ index: number }>();
const { activeTab } = inject("tabs");
const isActive = computed(() => activeTab.value === props.index);
</script>

<!-- Usage -->
<Tabs>
  <Tab :index="0">Content 1</Tab>
  <Tab :index="1">Content 2</Tab>
</Tabs>
```

---

### 9.2. Design Patterns

#### **Factory Pattern**

```ts
interface Button {
  render(): string;
}

class PrimaryButton implements Button {
  render() {
    return '<button class="primary">Click</button>';
  }
}

class SecondaryButton implements Button {
  render() {
    return '<button class="secondary">Click</button>';
  }
}

class ButtonFactory {
  createButton(type: "primary" | "secondary"): Button {
    switch (type) {
      case "primary":
        return new PrimaryButton();
      case "secondary":
        return new SecondaryButton();
      default:
        throw new Error("Unknown button type");
    }
  }
}

// Usage
const factory = new ButtonFactory();
const btn = factory.createButton("primary");
```

#### **Observer Pattern (Event Bus)**

```ts
type Callback = (...args: any[]) => void;

class EventBus {
  private events: Map<string, Callback[]> = new Map();

  on(event: string, callback: Callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }

  off(event: string, callback: Callback) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event: string, ...args: any[]) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(...args));
    }
  }
}

export const eventBus = new EventBus();

// Usage
eventBus.on("user:login", (user) => {
  console.log("User logged in:", user);
});

eventBus.emit("user:login", { id: 1, name: "Alice" });
```

#### **Singleton Pattern (Pinia Store)**

```ts
// stores/app.ts
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {
  const theme = ref("light");

  // This store instance is singleton
  return { theme };
});

// Always returns same instance
const store1 = useAppStore();
const store2 = useAppStore();
console.log(store1 === store2); // true
```

#### **Strategy Pattern**

```ts
interface PaymentStrategy {
  pay(amount: number): void;
}

class CreditCardPayment implements PaymentStrategy {
  pay(amount: number) {
    console.log(`Paid $${amount} with credit card`);
  }
}

class PayPalPayment implements PaymentStrategy {
  pay(amount: number) {
    console.log(`Paid $${amount} with PayPal`);
  }
}

class CryptoPayment implements PaymentStrategy {
  pay(amount: number) {
    console.log(`Paid $${amount} with crypto`);
  }
}

class PaymentProcessor {
  constructor(private strategy: PaymentStrategy) {}

  setStrategy(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  processPayment(amount: number) {
    this.strategy.pay(amount);
  }
}

// Usage
const processor = new PaymentProcessor(new CreditCardPayment());
processor.processPayment(100);

processor.setStrategy(new PayPalPayment());
processor.processPayment(200);
```

---

### 9.3. SOLID Principles in Frontend

#### **S - Single Responsibility**

```ts
// ❌ BAD: Component does too much
<script setup>
const user = ref(null)
const loading = ref(false)
const error = ref(null)

const fetchUser = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/user')
    user.value = await response.json()
    // Also handle analytics
    trackEvent('user_loaded')
    // And update localStorage
    localStorage.setItem('user', JSON.stringify(user.value))
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
}
</script>

// ✅ GOOD: Separate concerns
// composables/useUserApi.ts
export function useUserApi() {
  const fetchUser = async () => {
    const response = await fetch('/api/user')
    return response.json()
  }
  return { fetchUser }
}

// composables/useAnalytics.ts
export function useAnalytics() {
  const track = (event) => trackEvent(event)
  return { track }
}

// composables/useStorage.ts
export function useStorage() {
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value))
  return { save }
}

// Component
<script setup>
const { fetchUser } = useUserApi()
const { track } = useAnalytics()
const { save } = useStorage()

const loadUser = async () => {
  const user = await fetchUser()
  track('user_loaded')
  save('user', user)
}
</script>
```

#### **O - Open/Closed (Open for extension, closed for modification)**

```ts
// Base notification
class Notification {
  show(message: string) {
    console.log(message);
  }
}

// Extend without modifying base
class ToastNotification extends Notification {
  show(message: string) {
    // Custom toast logic
    showToast(message);
  }
}

class EmailNotification extends Notification {
  show(message: string) {
    // Send email
    sendEmail(message);
  }
}
```

#### **L - Liskov Substitution**

```ts
// Parent type can be replaced by child type
interface Bird {
  fly(): void;
}

class Sparrow implements Bird {
  fly() {
    console.log("Sparrow flying");
  }
}

class Eagle implements Bird {
  fly() {
    console.log("Eagle flying");
  }
}

function makeBirdFly(bird: Bird) {
  bird.fly(); // Works with any Bird implementation
}
```

#### **I - Interface Segregation**

```ts
// ❌ BAD: Fat interface
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

class Robot implements Worker {
  work() {
    /* ... */
  }
  eat() {
    /* Robot doesn't eat! */
  }
  sleep() {
    /* Robot doesn't sleep! */
  }
}

// ✅ GOOD: Segregated interfaces
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

class Human implements Workable, Eatable, Sleepable {
  work() {
    /* ... */
  }
  eat() {
    /* ... */
  }
  sleep() {
    /* ... */
  }
}

class Robot implements Workable {
  work() {
    /* ... */
  }
}
```

#### **D - Dependency Inversion**

```ts
// ❌ BAD: High-level depends on low-level
class MySQLDatabase {
  save(data: any) {
    /* MySQL specific */
  }
}

class UserService {
  private db = new MySQLDatabase(); // Direct dependency

  saveUser(user: User) {
    this.db.save(user);
  }
}

// ✅ GOOD: Depend on abstraction
interface Database {
  save(data: any): void;
}

class MySQLDatabase implements Database {
  save(data: any) {
    /* MySQL specific */
  }
}

class MongoDatabase implements Database {
  save(data: any) {
    /* Mongo specific */
  }
}

class UserService {
  constructor(private db: Database) {} // Inject dependency

  saveUser(user: User) {
    this.db.save(user);
  }
}

// Usage
const mysqlService = new UserService(new MySQLDatabase());
const mongoService = new UserService(new MongoDatabase());
```

---

### 9.4. Module Federation & Micro-frontends

**Câu trả lời chuẩn Senior:**

Module Federation (Webpack 5) cho phép chia app thành nhiều independent builds.

#### **Host App**

```ts
// webpack.config.js (Host)
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      remotes: {
        app1: "app1@http://localhost:3001/remoteEntry.js",
        app2: "app2@http://localhost:3002/remoteEntry.js",
      },
      shared: {
        vue: { singleton: true },
        "vue-router": { singleton: true },
        pinia: { singleton: true },
      },
    }),
  ],
};
```

#### **Remote App**

```ts
// webpack.config.js (Remote)
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "app1",
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./src/components/Button.vue",
        "./Dashboard": "./src/pages/Dashboard.vue",
      },
      shared: {
        vue: { singleton: true },
      },
    }),
  ],
};
```

#### **Usage in Host**

```vue
<script setup>
import { defineAsyncComponent } from "vue";

const RemoteButton = defineAsyncComponent(() => import("app1/Button"));
const RemoteDashboard = defineAsyncComponent(() => import("app2/Dashboard"));
</script>

<template>
  <RemoteButton />
  <RemoteDashboard />
</template>
```

---


---

[← Back to Overview](../README.md)
