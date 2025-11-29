# Testing

Chiến lược testing toàn diện cho Vue applications.

---

## Table of Contents

1. [Unit Testing với Vitest](#81-unit-testing-với-vitest)

2. [Component Testing với Vue Test Utils](#82-component-testing-với-vue-test-utils)

3. [E2E Testing với Playwright](#83-e2e-testing-với-playwright)

4. [Test Coverage](#84-test-coverage)

5. [Phương pháp TDD/BDD](#85-phương-pháp-tddbdd)

---

## III. Development Practices

## 8. Testing

### 8.1. Unit Testing với Vitest

**Câu trả lời chuẩn Senior:**

#### **Cài đặt Vitest**

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

#### **Cấu trúc Test Cơ bản**

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

### 8.2. Component Testing với Vue Test Utils

**Câu trả lời chuẩn Senior:**

#### **Cài đặt**

```bash
npm install -D @vue/test-utils
```

#### **mount vs shallowMount**

```ts
import { mount, shallowMount } from "@vue/test-utils";
import MyComponent from "./MyComponent.vue";

// mount: renders child components
const wrapper = mount(MyComponent);

// shallowMount: stubs child components (nhanh hơn, isolated hơn)
const wrapper = shallowMount(MyComponent);
```

#### **Test Component Cơ bản**

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

#### **Testing với Pinia**

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

### 8.3. E2E Testing với Playwright

**Câu trả lời chuẩn Senior:**

#### **Cài đặt**

```bash
npm init playwright@latest
```

#### **Test Cơ bản**

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

### 8.4. Test Coverage

**Câu trả lời chuẩn Senior:**

#### **Bật Coverage**

```ts
// vite.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: "v8", // hoặc 'istanbul'
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "tests/"],
    },
  },
});
```

```bash
# Chạy tests với coverage
npm run test -- --coverage
```

#### **Các Chỉ số Coverage**

```
- **Statements**: % các câu lệnh được thực thi
- **Branches**: % các nhánh if/else được thực thi
- **Functions**: % các functions được gọi
- **Lines**: % các dòng code được thực thi
```

#### **Thiết lập Ngưỡng Coverage**

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

### 8.5. Phương pháp TDD/BDD

**TDD (Test-Driven Development):**

1. Viết test trước (fail)
2. Viết code tối thiểu để pass test
3. Refactor
4. Lặp lại

```ts
// 1. Viết test trước (fails)
it("should calculate total price", () => {
  const cart = new Cart();
  cart.addItem({ price: 10, quantity: 2 });
  expect(cart.getTotal()).toBe(20);
});

// 2. Implement code tối thiểu
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

// 3. Test passes, refactor nếu cần
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

[← Quay lại Tổng quan](../README.md)
