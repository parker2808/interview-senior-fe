# Testing

Comprehensive testing strategies cho Vue applications.

---

## Table of Contents

1. [Unit Testing with Vitest](#1-unit-testing-with-vitest)
2. [Component Testing with Vue Test Utils](#2-component-testing-with-vue-test-utils)
3. [E2E Testing with Playwright](#3-e2e-testing-with-playwright)
4. [Test Coverage](#4-test-coverage)
5. [TDD/BDD Approach](#5-tddbdd-approach)

---
## 4. Testing

### 4.1. Unit Testing with Vitest

**Câu trả lời chuẩn Senior:**

#### **Setup Vitest**

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
import { describe, it, expect, beforeEach, afterEach } from "vitest";
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

  it("should initialize with custom value", () => {
    const { count } = useCounter(10);
    expect(count.value).toBe(10);
  });

  it("should increment count", () => {
    const { count, increment } = useCounter(5);
    increment();
    expect(count.value).toBe(6);
  });

  it("should reset to initial value", () => {
    const { count, increment, reset } = useCounter(0);
    increment();
    increment();
    reset();
    expect(count.value).toBe(0);
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

// Spy on method
const obj = { method: () => "original" };
const spy = vi.spyOn(obj, "method");
obj.method();
expect(spy).toHaveBeenCalled();
```

#### **Testing Async Code**

```ts
import { describe, it, expect } from "vitest";

describe("Async tests", () => {
  it("should resolve promise", async () => {
    const data = await fetchData();
    expect(data).toEqual({ success: true });
  });

  it("should reject promise", async () => {
    await expect(fetchInvalidData()).rejects.toThrow("Invalid");
  });
});
```

---

### 4.2. Component Testing with Vue Test Utils

**Câu trả lời chuẩn Senior:**

#### **Setup**

```bash
npm install -D @vue/test-utils
```

#### **mount vs shallowMount**

```ts
import { mount, shallowMount } from "@vue/test-utils";
import MyComponent from "./MyComponent.vue";

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
  expect(wrapper.emitted("submit")).toHaveLength(1);
  expect(wrapper.emitted("submit")[0]).toEqual([{ id: 1 }]);
});
```

#### **Testing v-model**

```ts
it("updates value with v-model", async () => {
  const wrapper = mount(Input, {
    props: {
      modelValue: "",
      "onUpdate:modelValue": (e) => wrapper.setProps({ modelValue: e }),
    },
  });

  await wrapper.find("input").setValue("new value");
  expect(wrapper.props("modelValue")).toBe("new value");
});
```

#### **Mocking Composables**

```ts
vi.mock("@/composables/useAuth", () => ({
  useAuth: () => ({
    user: ref({ id: 1, name: "Test User" }),
    isAuthenticated: ref(true),
    logout: vi.fn(),
  }),
}));
```

#### **Testing with Pinia**

```ts
import { setActivePinia, createPinia } from "pinia";
import { mount } from "@vue/test-utils";

describe("Component with Pinia", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("uses store correctly", () => {
    const wrapper = mount(MyComponent);
    const store = useMyStore();

    store.count = 5;
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("5");
  });
});
```

---

### 4.3. E2E Testing with Playwright

**Câu trả lời chuẩn Senior:**

#### **Setup**

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

  // Fill form
  await page.fill('[name="email"]', "user@example.com");
  await page.fill('[name="password"]', "password123");

  // Click button
  await page.click('button[type="submit"]');

  // Wait for navigation
  await page.waitForURL("**/dashboard");

  // Assert
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

  async getErrorMessage() {
    return await this.page.locator(".error").textContent();
  }
}

// tests/login.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test("user can login", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("user@example.com", "password123");

  await expect(page).toHaveURL("/dashboard");
});
```

#### **Testing User Interactions**

```ts
test("dropdown navigation", async ({ page }) => {
  await page.goto("/");

  // Hover to show dropdown
  await page.hover(".nav-item");

  // Click dropdown item
  await page.click('.dropdown-item:text("Settings")');

  // Wait for element
  await page.waitForSelector(".settings-page");

  // Screenshot
  await page.screenshot({ path: "screenshot.png" });
});
```

#### **API Mocking**

```ts
test("mock API response", async ({ page }) => {
  // Intercept API call
  await page.route("**/api/users", (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ]),
    })
  );

  await page.goto("/users");

  // Verify mocked data rendered
  await expect(page.locator(".user-name").first()).toContainText("Alice");
});
```

---

### 4.4. Test Coverage

**Câu trả lời chuẩn Senior:**

#### **Enable Coverage**

```ts
// vite.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: "v8", // or 'istanbul'
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "tests/"],
    },
  },
});
```

```bash
# Run tests with coverage
npm run test -- --coverage
```

#### **Coverage Metrics**

```
- **Statements**: % of code statements executed
- **Branches**: % of if/else branches executed
- **Functions**: % of functions called
- **Lines**: % of lines executed
```

#### **Coverage Thresholds**

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

### 4.5. TDD/BDD Approach

**TDD (Test-Driven Development):**

1. Write failing test
2. Write minimal code to pass test
3. Refactor
4. Repeat

```ts
// 1. Write test first (fails)
it("should calculate total price", () => {
  const cart = new Cart();
  cart.addItem({ price: 10, quantity: 2 });
  expect(cart.getTotal()).toBe(20);
});

// 2. Implement minimum code
class Cart {
  items = [];
  addItem(item) {
    this.items.push(item);
  }
  getTotal() {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }
}

// 3. Test passes, refactor if needed
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


---

[← Back to Overview](../README.md)
