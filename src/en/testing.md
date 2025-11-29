# Testing

Comprehensive testing strategy for Vue applications.

---

## Table of Contents

1. [Unit Testing with Vitest](#81-unit-testing-with-vitest)

2. [Component Testing with Vue Test Utils](#82-component-testing-with-vue-test-utils)

3. [E2E Testing with Playwright](#83-e2e-testing-with-playwright)

4. [Test Coverage](#84-test-coverage)

5. [TDD/BDD Methodology](#85-tddbdd-methodology)

---

## III. Development Practices

## 8. Testing

### 8.1. Unit Testing with Vitest

**Senior-level Answer:**

#### **Installing Vitest**

```bash
npm install -D vitest @vitejs/plugin-vue jsdom
```

```ts
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
  },
});
```

#### **Basic Test Structure**

```ts
// utils.test.ts
import { describe, it, expect } from "vitest";
import { sum, multiply } from "./utils";

describe("Math utilities", () => {
  it("should add two numbers", () => {
    expect(sum(2, 3)).toBe(5);
  });

  it("should multiply two numbers", () => {
    expect(multiply(3, 4)).toBe(12);
  });
});
```

#### **Testing Composables**

```ts
// composables/useCounter.ts
import { ref } from "vue";

export function useCounter(initial = 0) {
  const count = ref(initial);
  const increment = () => count.value++;
  const decrement = () => count.value--;
  const reset = () => (count.value = initial);

  return { count, increment, decrement, reset };
}

// composables/useCounter.test.ts
import { describe, it, expect } from "vitest";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  it("should initialize with default value", () => {
    const { count } = useCounter();
    expect(count.value).toBe(0);
  });

  it("should increment count", () => {
    const { count, increment } = useCounter(5);
    increment();
    expect(count.value).toBe(6);
  });
});
```

#### **Mocking**

```ts
import { vi, describe, it, expect } from "vitest";

// Mock module
vi.mock("./api", () => ({
  fetchUser: vi.fn(() => Promise.resolve({ id: 1, name: "Alice" })),
}));

// Mock function
const mockFn = vi.fn();
mockFn("hello");
expect(mockFn).toHaveBeenCalledWith("hello");
```

---

### 8.2. Component Testing with Vue Test Utils

**Senior-level Answer:**

#### **Installation**

```bash
npm install -D @vue/test-utils
```

#### **mount vs shallowMount**

```ts
import { mount, shallowMount } from "@vue/test-utils";

// mount: renders child components
const wrapper = mount(MyComponent);

// shallowMount: stubs child components (faster, more isolated)
const wrapper = shallowMount(MyComponent);
```

#### **Basic Component Test**

```vue
<!-- Counter.vue -->
<template>
  <div>
    <p class="count">{{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
const count = ref(0);
const increment = () => count.value++;
</script>
```

```ts
// Counter.test.ts
import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import Counter from "./Counter.vue";

describe("Counter.vue", () => {
  it("renders initial count", () => {
    const wrapper = mount(Counter);
    expect(wrapper.find(".count").text()).toBe("0");
  });

  it("increments count when button clicked", async () => {
    const wrapper = mount(Counter);
    await wrapper.find("button").trigger("click");
    expect(wrapper.find(".count").text()).toBe("1");
  });
});
```

#### **Testing Props**

```ts
const wrapper = mount(MyComponent, {
  props: {
    title: "Test Title",
    count: 5,
  },
});

expect(wrapper.props("title")).toBe("Test Title");
```

#### **Testing Events**

```ts
it("emits event when button clicked", async () => {
  const wrapper = mount(MyComponent);
  await wrapper.find("button").trigger("click");

  expect(wrapper.emitted()).toHaveProperty("submit");
  expect(wrapper.emitted("submit")[0]).toEqual([{ id: 1 }]);
});
```

#### **Testing with Pinia**

```ts
import { setActivePinia, createPinia } from "pinia";

describe("Component with Pinia", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("uses store correctly", () => {
    const wrapper = mount(MyComponent);
    const store = useMyStore();
    store.count = 5;
    expect(wrapper.text()).toContain("5");
  });
});
```

---

### 8.3. E2E Testing with Playwright

**Senior-level Answer:**

#### **Installation**

```bash
npm init playwright@latest
```

#### **Basic Test**

```ts
// tests/example.spec.ts
import { test, expect } from "@playwright/test";

test("homepage has title", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page).toHaveTitle(/My App/);
});

test("login flow", async ({ page }) => {
  await page.goto("http://localhost:3000/login");

  await page.fill('[name="email"]', "user@example.com");
  await page.fill('[name="password"]', "password123");
  await page.click('button[type="submit"]');

  await page.waitForURL("**/dashboard");
  await expect(page.locator("h1")).toContainText("Dashboard");
});
```

#### **Page Object Model**

```ts
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.page.fill('[name="email"]', email);
    await this.page.fill('[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}

// tests/login.spec.ts
test("user can login", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("user@example.com", "password123");
  await expect(page).toHaveURL("/dashboard");
});
```

---

### 8.4. Test Coverage

**Senior-level Answer:**

#### **Enable Coverage**

```ts
// vite.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "tests/"],
    },
  },
});
```

```bash
npm run test -- --coverage
```

#### **Coverage Metrics**

```
- Statements: % of statements executed
- Branches: % of if/else branches executed
- Functions: % of functions called
- Lines: % of code lines executed
```

#### **Set Coverage Thresholds**

```ts
export default defineConfig({
  test: {
    coverage: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
});
```

---

### 8.5. TDD/BDD Methodology

**TDD (Test-Driven Development):**

1. Write test first (fail)
2. Write minimal code to pass
3. Refactor
4. Repeat

```ts
// 1. Write test first (fails)
it("should calculate total price", () => {
  const cart = new Cart();
  cart.addItem({ price: 10, quantity: 2 });
  expect(cart.getTotal()).toBe(20);
});

// 2. Implement minimal code
class Cart {
  items = [];
  addItem(item) {
    this.items.push(item);
  }
  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
```

**BDD (Behavior-Driven Development):**

```ts
describe("Shopping Cart", () => {
  describe("when adding items", () => {
    it("should increase total", () => {
      // Given
      const cart = new Cart();

      // When
      cart.addItem({ price: 10 });

      // Then
      expect(cart.getTotal()).toBe(10);
    });
  });
});
```

---

[← Back to Overview](../../README-en.md)

