# Vue 3

Kiến thức Vue 3 toàn diện từ cơ bản đến nâng cao cho Senior Frontend Developer.

---

## Table of Contents

### Core Concepts
1. [Virtual DOM](#1-virtual-dom)
2. [Options API vs Composition API](#2-options-api-vs-composition-api)
3. [Auto-import Components](#3-auto-import-components)
4. [v-bind vs v-model](#4-v-bind-vs-v-model)
5. [Props: Parent → Child](#5-props-parent--child)
6. [Computed vs Method](#6-computed-vs-method)
7. [Computed vs Watch](#7-computed-vs-watch)
8. [nextTick Use Cases](#8-nexttick-use-cases)
9. [Debug & Fix Component Bugs](#9-debug--fix-component-bugs)
10. [Reactivity System](#10-reactivity-system)
11. [Lifecycle Hooks](#11-lifecycle-hooks)

### Advanced Features
12. [Teleport](#12-teleport)
13. [Suspense](#13-suspense)
14. [Custom Directives](#14-custom-directives)
15. [Plugins](#15-plugins)
16. [Render Functions & JSX](#16-render-functions--jsx)
17. [Provide / Inject](#17-provide--inject)

---
## 3. Vue 3

### 3.1. Virtual DOM

**Câu trả lời chuẩn Senior:**

Virtual DOM là một **JavaScript object representation** của DOM thật. Thay vì thao tác trực tiếp với DOM (rất chậm), framework tạo một "bản sao ảo" trong memory.

#### **Cách hoạt động:**

1. **Render lần đầu**: tạo Virtual DOM tree → render ra Real DOM.
2. **Khi state thay đổi**: tạo Virtual DOM mới.
3. **Diffing algorithm**: so sánh Virtual DOM cũ vs mới (tree diff).
4. **Patching**: chỉ update những node thay đổi vào Real DOM.

#### **Ưu điểm:**

- **Performance**: batch updates, chỉ update những gì cần thiết.
- **Cross-platform**: có thể render ra nhiều target (DOM, mobile, canvas).
- **Developer Experience**: code declarative, framework lo phần tối ưu.

#### **Vue 3 improvements:**

- Compiler-informed Virtual DOM → skip static nodes.
- Fragment support (nhiều root nodes).
- Teleport, Suspense built on top of Virtual DOM.

**Tóm gọn:** Virtual DOM là layer trung gian giúp tối ưu việc update UI bằng cách giảm thiểu thao tác DOM thật.

---

### 3.2. Options API vs Composition API

#### **Options API**

- Tổ chức code theo `data`, `methods`, `computed` → logic bị phân tán.
- Tái sử dụng bằng mixins → dễ conflict tên, khó trace.
- Phù hợp component đơn giản, người mới học Vue.

#### **Composition API**

- Gom code theo **logic**, không theo option.
- Tái sử dụng logic qua composables → rõ ràng & an toàn hơn mixins.
- Tree-shaking tốt, linh hoạt, phù hợp hệ thống lớn.
- TypeScript support tốt hơn.

**Kết luận:** Composition API là tiêu chuẩn hiện đại → dễ maintain + mạnh mẽ hơn.

---

### 3.3. Auto-import Components

**Câu hỏi:** Muốn tạo 1 component mà mỗi khi dùng không cần khai báo (import) thì làm như thế nào?

**Câu trả lời chuẩn Senior:**

#### **1. Nuxt 3 (Auto-import mặc định)**

Đặt component trong thư mục `components/`, Nuxt tự động import.

```
components/
├── Button.vue        → <Button />
├── form/
│   └── Input.vue     → <FormInput />
```

Không cần import, dùng trực tiếp trong template.

#### **2. Vue 3 + Vite (unplugin-vue-components)**

Install plugin:

```bash
npm i -D unplugin-vue-components
```

Config `vite.config.ts`:

```ts
import Components from "unplugin-vue-components/vite";

export default {
  plugins: [
    Components({
      dirs: ["src/components"],
      extensions: ["vue"],
      deep: true,
      dts: true, // auto generate types
    }),
  ],
};
```

#### **3. Global Registration (không khuyến khích cho app lớn)**

```ts
// main.ts
import MyComponent from "./components/MyComponent.vue";
app.component("MyComponent", MyComponent);
```

**Trade-offs:**

- **Auto-import**: DX tốt, tree-shaking vẫn hoạt động.
- **Global registration**: mọi component đều bundle vào, kém tối ưu.

**Khuyến nghị Senior:** Dùng auto-import với Nuxt hoặc unplugin-vue-components cho Vue 3.

---

### 3.4. v-bind vs v-model

**Câu trả lời chuẩn Senior:**

#### **v-bind (one-way binding)**

Truyền dữ liệu **một chiều** từ parent → child.

```vue
<!-- Parent -->
<Input :value="username" />

<!-- Child nhận prop, không thể sửa trực tiếp -->
<script setup>
const props = defineProps(["value"]);
</script>
```

#### **v-model (two-way binding)**

Syntactic sugar cho **two-way binding** = `:value` + `@update:modelValue`.

```vue
<!-- Parent -->
<Input v-model="username" />

<!-- Tương đương với -->
<Input :modelValue="username" @update:modelValue="username = $event" />

<!-- Child -->
<script setup>
const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

function updateValue(e) {
  emit("update:modelValue", e.target.value);
}
</script>
```

#### **v-model với custom name (Vue 3)**

```vue
<!-- Multiple v-model -->
<UserForm v-model:firstName="first" v-model:lastName="last" />
```

**Khi nào dùng gì:**

- **v-bind**: dữ liệu chỉ đọc, không cần sync ngược.
- **v-model**: form inputs, component cần sync data 2 chiều.

---

### 3.5. Props: Truyền dữ liệu từ Parent → Child

**Câu trả lời chuẩn Senior:**

#### **Basic Props**

```vue
<!-- Parent.vue -->
<template>
  <ChildComponent :title="pageTitle" :count="42" :user="userObj" />
</template>

<!-- Child.vue (Composition API) -->
<script setup>
const props = defineProps({
  title: String,
  count: Number,
  user: Object,
});
</script>
```

#### **Props với TypeScript**

```vue
<script setup lang="ts">
interface Props {
  title: string;
  count?: number; // optional
  user: { id: number; name: string };
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
});
</script>
```

#### **Props validation (Options API)**

```ts
props: {
  status: {
    type: String,
    required: true,
    validator: (value) => ['active', 'inactive'].includes(value)
  }
}
```

#### **Best Practices:**

- Props là **one-way down binding** → không mutate props trực tiếp.
- Nếu cần modify → dùng local copy hoặc emit event lên parent.
- Dùng TypeScript interface cho props phức tạp.

```vue
<!-- ❌ Bad: mutate props -->
<script setup>
const props = defineProps(["count"]);
props.count++; // ERROR!
</script>

<!-- ✅ Good: local copy -->
<script setup>
const props = defineProps(["count"]);
const localCount = ref(props.count);
</script>
```

---

### 3.6. Computed vs Method

**Câu trả lời chuẩn Senior:**

#### **Computed**

- **Cached** based on reactive dependencies.
- Chỉ tính lại khi dependency thay đổi.
- Dùng cho **derived state**.

```ts
const fullName = computed(() => `${firstName.value} ${lastName.value}`);

// Gọi nhiều lần trong 1 render → chỉ tính 1 lần
<div>{{ fullName }}</div>
<div>{{ fullName }}</div>
```

#### **Method**

- **Không cache**, chạy lại mỗi lần gọi.
- Dùng cho **actions** hoặc logic có side-effects.

```ts
function getFullName() {
  return `${firstName.value} ${lastName.value}`;
}

// Gọi 2 lần → chạy 2 lần
<div>{{ getFullName() }}</div>
<div>{{ getFullName() }}</div>
```

#### **Khi nào dùng gì?**

| Use case                     | Dùng computed | Dùng method |
| ---------------------------- | ------------- | ----------- |
| Filter/transform data        | ✅            | ❌          |
| Expensive calculation        | ✅            | ❌          |
| Format display value         | ✅            | ❌          |
| Event handler                | ❌            | ✅          |
| Side effects (API call, log) | ❌            | ✅          |
| Cần arguments                | ❌            | ✅          |

**Rule of thumb:** Nếu return value phụ thuộc reactive state → dùng **computed**. Nếu là action → dùng **method**.

---

### 3.7. Computed vs Watch

**Câu trả lời chuẩn Senior:**

#### **Computed**

- Dùng cho **derived state** (dữ liệu được tính từ state khác).
- Có cache, declarative.
- **Không** được có side effects.

```ts
const filteredUsers = computed(() => {
  return users.value.filter((u) => u.age >= 18);
});
```

#### **Watch**

- Dùng cho **side effects** khi data thay đổi.
- Gọi API, log, update localStorage, etc.
- Có access vào giá trị cũ và mới.

```ts
watch(
  () => user.id,
  async (newId, oldId) => {
    console.log(`User changed: ${oldId} → ${newId}`);
    await fetchUserData(newId); // side effect
  }
);
```

#### **So sánh:**

| Tiêu chí     | Computed                  | Watch                        |
| ------------ | ------------------------- | ---------------------------- |
| Mục đích     | Transform/derive data     | Side effects                 |
| Return value | Phải return               | Không return                 |
| Cache        | Có                        | Không                        |
| Side effects | ❌ Tránh                  | ✅ Được khuyến khích         |
| Use case     | Filter, format, calculate | API call, logging, analytics |

**Ví dụ thực tế:**

```ts
// ✅ Computed: derive state
const discountedPrice = computed(() => {
  return originalPrice.value * (1 - discount.value);
});

// ✅ Watch: side effect khi price thay đổi
watch(discountedPrice, (newPrice) => {
  analytics.track("Price Changed", { price: newPrice });
  localStorage.setItem("lastPrice", newPrice);
});
```

---

### 3.8. nextTick Use Cases

**Câu hỏi:** Bạn đã dùng nextTick trong những trường hợp nào?

**Câu trả lời chuẩn Senior:**

`nextTick` đợi Vue update DOM sau khi state thay đổi, rồi mới chạy callback.

#### **Use Case 1: Access DOM sau khi update**

```ts
const message = ref("Hello");

function changeMessage() {
  message.value = "World";
  console.log(document.querySelector(".message").textContent); // vẫn là "Hello"

  nextTick(() => {
    console.log(document.querySelector(".message").textContent); // "World"
  });
}
```

#### **Use Case 2: Focus input sau khi render**

```vue
<script setup>
const showInput = ref(false);
const inputRef = ref(null);

async function openInput() {
  showInput.value = true;

  // DOM chưa update, inputRef.value vẫn null
  await nextTick();

  // Giờ input đã được render
  inputRef.value.focus();
}
</script>

<template>
  <input v-if="showInput" ref="inputRef" />
</template>
```

#### **Use Case 3: Scroll to element mới thêm vào list**

```ts
const items = ref([1, 2, 3]);

async function addItem() {
  items.value.push(items.value.length + 1);

  await nextTick();

  // Scroll to bottom sau khi item mới được render
  const container = document.querySelector(".list");
  container.scrollTop = container.scrollHeight;
}
```

#### **Use Case 4: Get computed dimensions sau render**

```ts
const show = ref(false);

async function toggle() {
  show.value = true;

  await nextTick();

  const el = document.querySelector(".box");
  console.log(el.offsetHeight); // giờ mới có height chính xác
}
```

**Tóm gọn:** Dùng `nextTick` khi cần đợi Vue render xong DOM để:

- Thao tác DOM (focus, scroll, measure)
- Integrate thư viện third-party (charts, editor)
- Debug (check DOM state)

---

### 3.9. Debug & Fix Component Bugs

**Câu hỏi:** Khi bạn phát hiện ra 1 component gây ra bug thì bạn sẽ fix như thế nào?

**Câu trả lời chuẩn Senior:**

#### **Bước 1: Reproduce & Isolate**

- Xác định **exact steps** để tái tạo bug.
- Kiểm tra bug xảy ra ở **môi trường nào** (dev/staging/prod, browser nào).
- Isolate: bug ở component này hay từ parent/child?

#### **Bước 2: Gather Information**

```ts
// 1. Check console errors
console.error(); // any errors?

// 2. Vue DevTools
// - Inspect component state/props
// - Check reactive dependencies
// - Timeline tab (events, lifecycle)

// 3. Network tab
// - API responses có đúng không?
// - Status codes, timing

// 4. Add logging
console.log("Props:", props);
console.log("State:", { count, user });

// 5. Check lifecycle
onMounted(() => console.log("mounted"));
onUpdated(() => console.log("updated"));
```

#### **Bước 3: Common Bug Patterns**

**Pattern 1: Reactivity lost**

```ts
// ❌ Bad: destructure reactive object
const { name } = reactive({ name: "John" });
// name không còn reactive

// ✅ Good: dùng toRefs
const state = reactive({ name: "John" });
const { name } = toRefs(state);
```

**Pattern 2: Async timing**

```ts
// ❌ Race condition
async function loadUser() {
  const data = await api.getUser();
  user.value = data; // có thể bị override bởi call khác
}

// ✅ Better: track latest request
let latestRequestId = 0;
async function loadUser() {
  const requestId = ++latestRequestId;
  const data = await api.getUser();
  if (requestId === latestRequestId) {
    user.value = data;
  }
}
```

**Pattern 3: Props mutation**

```ts
// ❌ Mutate props
const props = defineProps(["items"]);
props.items.push(newItem); // ERROR!

// ✅ Emit to parent
const emit = defineEmits(["update:items"]);
emit("update:items", [...props.items, newItem]);
```

#### **Bước 4: Fix & Verify**

1. **Write test** (nếu chưa có) để reproduce bug.
2. Fix code.
3. Test trên nhiều scenarios.
4. Code review với team.
5. Deploy staging → QA verify → production.

#### **Bước 5: Document & Prevent**

- Update comment/docs nếu logic phức tạp.
- Add ESLint rule nếu phát hiện pattern lỗi phổ biến.
- Share knowledge với team.

**Pro tips:**

- Dùng `onErrorCaptured` để catch errors trong component tree.
- TypeScript giúp catch nhiều bugs compile-time.
- Unit test cho logic phức tạp.

---

### 3.10. Reactivity: setup(), computed, watch

**Câu trả lời chuẩn Senior:**

Vue 3 sử dụng **Proxy-based reactivity** thay vì Object.defineProperty (Vue 2).

#### **setup()**

- Entry point của Composition API.
- Chạy trước tất cả lifecycle hooks (thay thế beforeCreate + created).
- Return giá trị để expose ra template.

#### **ref vs reactive**

- **ref**: wrap giá trị primitive hoặc object, truy cập qua `.value`.
- **reactive**: chỉ cho object/array, không cần `.value`.
- **shallowRef / shallowReactive**: tối ưu khi chỉ cần reactive ở level đầu tiên.

#### **computed**

- Dùng cho **derived state**, có cache tự động.
- Chỉ tính lại khi dependency thay đổi.
- Không nên có side effects trong computed.

```ts
const fullName = computed(() => `${firstName.value} ${lastName.value}`);
```

#### **watch vs watchEffect**

- **watch**: theo dõi source cụ thể, có giá trị cũ/mới.
- **watchEffect**: auto-track dependencies, chạy ngay lập tức.

```ts
// watch
watch(
  () => user.id,
  (newId, oldId) => {
    fetchUserData(newId);
  }
);

// watchEffect
watchEffect(() => {
  console.log(user.id); // auto-tracked
});
```

---

### 3.11. Lifecycle: Vue 2 vs Vue 3

#### **Vue 2 Lifecycle (Options API)**

```
beforeCreate → created → beforeMount → mounted
→ beforeUpdate → updated
→ beforeDestroy → destroyed
```

#### **Vue 3 Lifecycle (Composition API)**

```
setup()
→ onBeforeMount → onMounted
→ onBeforeUpdate → onUpdated
→ onBeforeUnmount → onUnmounted
```

**Thêm hooks mới trong Vue 3:**

- `onRenderTracked` → debug reactive tracking
- `onRenderTriggered` → debug khi nào component re-render

**Key differences:**

- `setup()` thay thế beforeCreate + created
- Tên hooks thêm prefix `on`
- `beforeDestroy/destroyed` → `onBeforeUnmount/onUnmounted`

---

## 3. Vue 3 Advanced

### 3.1. Teleport

**Câu trả lời chuẩn Senior:**

Teleport cho phép render component con ở **vị trí DOM khác** ngoài component cha, nhưng vẫn giữ logic trong component tree.

#### **Use Case: Modals, Tooltips, Notifications**

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <h1>My App</h1>
    <UserProfile />

    <!-- Modal portal target -->
    <div id="modal-container"></div>
  </div>
</template>

<!-- UserProfile.vue -->
<template>
  <div>
    <button @click="showModal = true">Open Modal</button>

    <!-- Teleport modal to #modal-container -->
    <Teleport to="#modal-container">
      <div v-if="showModal" class="modal-backdrop" @click="showModal = false">
        <div class="modal" @click.stop>
          <h2>Modal Content</h2>
          <p>This is rendered outside component tree!</p>
          <button @click="showModal = false">Close</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from "vue";
const showModal = ref(false);
</script>
```

#### **Teleport to body**

```vue
<template>
  <Teleport to="body">
    <!-- Rendered as direct child of <body> -->
    <div class="toast">{{ message }}</div>
  </Teleport>
</template>
```

#### **Conditional Teleport**

```vue
<template>
  <Teleport
    :to="isMobile ? '#mobile-menu' : '#desktop-menu'"
    :disabled="!shouldTeleport"
  >
    <NavMenu />
  </Teleport>
</template>
```

#### **Multiple Teleports**

```vue
<!-- Both will render to same target -->
<Teleport to="#target">
  <div>Content A</div>
</Teleport>

<Teleport to="#target">
  <div>Content B</div>
</Teleport>

<!-- Result: Both inside #target, in order -->
```

---

### 3.2. Suspense

**Câu trả lời chuẩn Senior:**

Suspense cho phép orchestrate async dependencies và hiển thị fallback UI trong khi chờ.

#### **Basic Usage**

```vue
<template>
  <Suspense>
    <!-- Component with async setup() -->
    <template #default>
      <AsyncComponent />
    </template>

    <!-- Loading fallback -->
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
```

#### **Async Component**

```vue
<!-- AsyncComponent.vue -->
<script setup>
// Top-level await in setup
const data = await fetch("/api/data").then((r) => r.json());
const user = await fetch("/api/user").then((r) => r.json());
</script>

<template>
  <div>
    <h2>{{ user.name }}</h2>
    <p>{{ data.content }}</p>
  </div>
</template>
```

#### **Combining with Error Handling**

```vue
<template>
  <ErrorBoundary>
    <Suspense>
      <template #default>
        <AsyncComponent />
      </template>
      <template #fallback>
        <LoadingSpinner />
      </template>
    </Suspense>
  </ErrorBoundary>
</template>

<script setup>
import { onErrorCaptured } from "vue";

const error = ref(null);

onErrorCaptured((err) => {
  error.value = err;
  return false; // Prevent propagation
});
</script>
```

#### **Events**

```vue
<template>
  <Suspense @pending="onPending" @resolve="onResolve" @fallback="onFallback">
    <AsyncComponent />
  </Suspense>
</template>

<script setup>
const onPending = () => console.log("Loading started");
const onResolve = () => console.log("Loading complete");
const onFallback = () => console.log("Showing fallback");
</script>
```

#### **Nuxt 3 Auto-Suspense**

```vue
<!-- Nuxt auto-wraps pages in Suspense -->
<template>
  <div>
    <!-- This works out of the box -->
    <script setup>
      const { data } = await useFetch("/api/data");
    </script>
  </div>
</template>
```

---

### 3.3. Custom Directives

**Câu trả lời chuẩn Senior:**

Custom directives cho phép tái sử dụng DOM manipulation logic.

#### **Directive Lifecycle Hooks**

```ts
const myDirective = {
  // Called before element's attributes/event listeners are applied
  created(el, binding, vnode, prevVnode) {},

  // Called right before element is inserted into DOM
  beforeMount(el, binding, vnode, prevVnode) {},

  // Called when parent component is mounted
  mounted(el, binding, vnode, prevVnode) {},

  // Called before parent component updates
  beforeUpdate(el, binding, vnode, prevVnode) {},

  // Called after parent component updates
  updated(el, binding, vnode, prevVnode) {},

  // Called before parent component unmounts
  beforeUnmount(el, binding, vnode, prevVnode) {},

  // Called when parent component is unmounted
  unmounted(el, binding, vnode, prevVnode) {},
};
```

#### **Example: v-focus**

```ts
// directives/focus.ts
export const vFocus = {
  mounted(el: HTMLElement) {
    el.focus();
  },
};

// Usage
<template>
  <input v-focus />
</template>

<script setup>
import { vFocus } from '@/directives/focus'
</script>
```

#### **Example: v-click-outside**

```ts
// directives/clickOutside.ts
export const vClickOutside = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    el.clickOutsideEvent = function (event: Event) {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};

// Usage
<template>
  <div v-click-outside="closeDropdown" class="dropdown">
    <!-- dropdown content -->
  </div>
</template>

<script setup>
import { vClickOutside } from '@/directives/clickOutside'

const closeDropdown = () => {
  isOpen.value = false
}
</script>
```

#### **Example: v-lazy-load (Images)**

```ts
// directives/lazyLoad.ts
export const vLazyLoad = {
  mounted(el: HTMLImageElement, binding: DirectiveBinding) {
    const loadImage = () => {
      el.src = binding.value;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
  },
};

// Usage
<img v-lazy-load="imageUrl" alt="Lazy loaded" />;
```

#### **Directive Arguments & Modifiers**

```vue
<template>
  <!-- v-directive:argument.modifier="value" -->
  <div v-tooltip:top.instant="'Hello World'">Hover me</div>
</template>

<script setup>
const vTooltip = {
  mounted(el, binding) {
    console.log(binding.arg); // "top"
    console.log(binding.modifiers); // { instant: true }
    console.log(binding.value); // "Hello World"
  },
};
</script>
```

#### **Global Directives**

```ts
// main.ts
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

// Register globally
app.directive("focus", {
  mounted(el) {
    el.focus();
  },
});

app.mount("#app");
```

---

### 3.4. Plugins

**Câu trả lời chuẩn Senior:**

Plugins add global-level functionality to Vue app.

#### **Creating a Plugin**

```ts
// plugins/i18n.ts
export default {
  install(app, options) {
    // Add global property
    app.config.globalProperties.$translate = (key) => {
      return key.split(".").reduce((o, i) => o[i], options.messages);
    };

    // Add global component
    app.component("Translate", {
      // component definition
    });

    // Add directive
    app.directive("translate", {
      // directive definition
    });

    // Provide/inject
    app.provide("i18n", options);
  },
};
```

#### **Using Plugin**

```ts
// main.ts
import { createApp } from "vue";
import i18nPlugin from "./plugins/i18n";

const app = createApp(App);

app.use(i18nPlugin, {
  messages: {
    hello: "Hello World",
    user: { name: "Alice" },
  },
});

app.mount("#app");
```

#### **Example: Toast Plugin**

```ts
// plugins/toast.ts
import Toast from "@/components/Toast.vue";

export default {
  install(app, options = {}) {
    const toast = {
      show(message, type = "info") {
        // Implementation
        console.log(`[${type}] ${message}`);
      },
      success(message) {
        this.show(message, "success");
      },
      error(message) {
        this.show(message, "error");
      },
    };

    // Make available globally
    app.config.globalProperties.$toast = toast;

    // For Composition API
    app.provide("toast", toast);
  },
};

// Usage in Options API
export default {
  methods: {
    save() {
      this.$toast.success("Saved!");
    },
  },
};

// Usage in Composition API
import { inject } from "vue";
const toast = inject("toast");
toast.success("Saved!");
```

---

### 3.5. Render Functions & JSX

**Câu trả lời chuẩn Senior:**

Render functions cho phép tạo VNodes programmatically thay vì dùng template.

#### **h() Function**

```ts
import { h } from "vue";

// h(type, props, children)
const vnode = h("div", { class: "container", id: "app" }, [
  h("h1", "Hello"),
  h("p", "World"),
]);
```

#### **Component with Render Function**

```ts
import { h, ref } from "vue";

export default {
  setup() {
    const count = ref(0);

    return () =>
      h("div", [
        h("p", `Count: ${count.value}`),
        h("button", { onClick: () => count.value++ }, "Increment"),
      ]);
  },
};
```

#### **JSX in Vue**

```tsx
// Enable JSX in vite.config.ts
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

export default {
  plugins: [vue(), vueJsx()],
};

// Component.tsx
import { ref } from "vue";

export default defineComponent({
  setup() {
    const count = ref(0);

    return () => (
      <div>
        <p>Count: {count.value}</p>
        <button onClick={() => count.value++}>Increment</button>
      </div>
    );
  },
});
```

#### **When to Use Render Functions**

**✅ Use render functions when:**

- Dynamic component creation
- Highly dynamic/complex rendering logic
- Wrapping libraries that return VNodes
- Performance-critical rendering (skip template compilation)

**❌ Avoid render functions when:**

- Simple, static templates
- Team không familiar với JSX/VNodes
- Template syntax đủ đáp ứng needs

---

### 3.6. Provide / Inject

**Câu trả lời chuẩn Senior:**

Provide/Inject implement dependency injection pattern, tránh prop drilling.

#### **Basic Usage**

```vue
<!-- Parent -->
<script setup>
import { provide, ref } from "vue";

const theme = ref("dark");
const updateTheme = (newTheme) => {
  theme.value = newTheme;
};

provide("theme", theme);
provide("updateTheme", updateTheme);
</script>

<!-- Child (any level deep) -->
<script setup>
import { inject } from "vue";

const theme = inject("theme");
const updateTheme = inject("updateTheme");
</script>

<template>
  <div :class="`theme-${theme}`">
    <button @click="updateTheme('light')">Light Mode</button>
  </div>
</template>
```

#### **With Default Values**

```ts
// Inject with default
const theme = inject("theme", "light"); // default: 'light'

// Inject with factory function
const config = inject("config", () => ({ api: "/api" }));
```

#### **TypeScript Support**

```ts
// types.ts
export interface ThemeConfig {
  primary: string;
  secondary: string;
}

export const ThemeKey: InjectionKey<Ref<ThemeConfig>> = Symbol("theme");

// Parent
import { provide, ref } from "vue";
import { ThemeKey, ThemeConfig } from "./types";

const theme = ref<ThemeConfig>({
  primary: "#007bff",
  secondary: "#6c757d",
});

provide(ThemeKey, theme);

// Child
import { inject } from "vue";
import { ThemeKey } from "./types";

const theme = inject(ThemeKey); // Fully typed!
```

#### **App-level Provide**

```ts
// main.ts
import { createApp } from "vue";

const app = createApp(App);

app.provide("globalConfig", {
  apiUrl: import.meta.env.VITE_API_URL,
});

app.mount("#app");
```

#### **Composable Pattern**

```ts
// composables/useTheme.ts
import { inject, provide, ref, InjectionKey, Ref } from "vue";

interface Theme {
  mode: "light" | "dark";
  toggle: () => void;
}

const ThemeKey: InjectionKey<Theme> = Symbol("theme");

export function provideTheme() {
  const mode = ref<"light" | "dark">("light");

  const toggle = () => {
    mode.value = mode.value === "light" ? "dark" : "light";
  };

  const theme: Theme = { mode, toggle };

  provide(ThemeKey, theme);

  return theme;
}

export function useTheme(): Theme {
  const theme = inject(ThemeKey);
  if (!theme) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return theme;
}

// Usage
// Parent: provideTheme()
// Child: const { mode, toggle } = useTheme()
```

---


---

[← Back to Overview](../README.md)
