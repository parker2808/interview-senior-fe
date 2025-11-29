# Vue 3

Comprehensive Vue 3 knowledge from basic to advanced for Senior Frontend Developer.

---

## Table of Contents

1. **Core Concepts**
   
   1.1. [Virtual DOM](#511-virtual-dom)
   
   1.2. [Options API vs Composition API](#512-options-api-vs-composition-api)
   
   1.3. [Auto-import Components](#513-auto-import-components)
   
   1.4. [v-bind vs v-model](#514-v-bind-vs-v-model)
   
   1.5. [Props: Parent → Child](#515-props-parent--child)
   
   1.6. [Computed vs Method](#516-computed-vs-method)
   
   1.7. [Computed vs Watch](#517-computed-vs-watch)
   
   1.8. [nextTick Use Cases](#518-nexttick-use-cases)
   
   1.9. [Debug & Fix Component Bugs](#519-debug--fix-component-bugs)
   
   1.10. [Reactivity System](#5110-reactivity-system)
   
   1.11. [Lifecycle Hooks](#5111-lifecycle-hooks)
   
   1.12. [created vs mounted: When to Call API?](#5112-created-vs-mounted-when-to-call-api)

2. **Advanced Features**
   
   2.1. [Teleport](#521-teleport)
   
   2.2. [Suspense](#522-suspense)
   
   2.3. [Custom Directives](#523-custom-directives)
   
   2.4. [Plugins](#524-plugins)
   
   2.5. [Render Functions & JSX](#525-render-functions--jsx)
   
   2.6. [Provide / Inject](#526-provide--inject)

---

## 3. Vue 3

### 3.1. Virtual DOM

**Senior-level Answer:**

Virtual DOM is a **JavaScript object representation** of the real DOM. Instead of directly manipulating DOM (very slow), framework creates a "virtual copy" in memory.

#### **How it works:**

1. **First render**: create Virtual DOM tree → render to Real DOM
2. **When state changes**: create new Virtual DOM
3. **Diffing algorithm**: compare old vs new Virtual DOM (tree diff)
4. **Patching**: only update changed nodes to Real DOM

#### **Advantages:**

- **Performance**: batch updates, only update what's necessary
- **Cross-platform**: can render to multiple targets (DOM, mobile, canvas)
- **Developer Experience**: declarative code, framework handles optimization

#### **Vue 3 improvements:**

- Compiler-informed Virtual DOM → skip static nodes
- Fragment support (multiple root nodes)
- Teleport, Suspense built on top of Virtual DOM

**Summary:** Virtual DOM is intermediate layer that optimizes UI updates by minimizing real DOM manipulation.

---

#### 5.1.2. Options API vs Composition API

#### **Options API**

- Organizes code by `data`, `methods`, `computed` → logic scattered
- Reuse via mixins → easy name conflicts, hard to trace
- Suitable for simple components, beginners

#### **Composition API**

- Groups code by **logic**, not by option
- Reuse logic via composables → clearer & safer than mixins
- Better tree-shaking, flexible, suitable for large systems
- Better TypeScript support

**Conclusion:** Composition API is modern standard → easier to maintain + more powerful.

---

#### 5.1.3. Auto-import Components

**Question:** How to create a component that doesn't need manual import declaration?

**Senior-level Answer:**

#### **1. Nuxt 3 (Auto-import by default)**

Place component in `components/` folder, Nuxt auto-imports.

```
components/
├── Button.vue        → <Button />
├── form/
│   └── Input.vue     → <FormInput />
```

No import needed, use directly in template.

#### **2. Vue 3 + Vite (unplugin-vue-components)**

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
      dts: true, // auto generate types
    }),
  ],
};
```

#### **3. Global Registration (not recommended for large apps)**

```ts
// main.ts
app.component("MyComponent", MyComponent);
```

**Recommendation:** Use auto-import with Nuxt or unplugin-vue-components for Vue 3.

---

#### 5.1.4. v-bind vs v-model

**Senior-level Answer:**

#### **v-bind (one-way binding)**

Pass data **one way** from parent → child.

```vue
<!-- Parent -->
<Input :value="username" />

<!-- Child receives prop, can't modify directly -->
```

#### **v-model (two-way binding)**

Syntactic sugar for **two-way binding** = `:value` + `@update:modelValue`.

```vue
<!-- Parent -->
<Input v-model="username" />

<!-- Equivalent to -->
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

#### **Multiple v-model (Vue 3)**

```vue
<UserForm v-model:firstName="first" v-model:lastName="last" />
```

**When to use:**

- **v-bind**: read-only data, no need to sync back
- **v-model**: form inputs, components need 2-way data sync

---

#### 5.1.5. Props: Parent → Child

**Senior-level Answer:**

#### **Basic Props**

```vue
<!-- Parent.vue -->
<ChildComponent :title="pageTitle" :count="42" :user="userObj" />

<!-- Child.vue -->
<script setup>
const props = defineProps({
  title: String,
  count: Number,
  user: Object,
});
</script>
```

#### **Props with TypeScript**

```vue
<script setup lang="ts">
interface Props {
  title: string;
  count?: number;
  user: { id: number; name: string };
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
});
</script>
```

#### **Best Practices:**

- Props are **one-way down binding** → don't mutate props directly
- If need to modify → use local copy or emit event to parent

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

#### 5.1.6. Computed vs Method

**Senior-level Answer:**

#### **Computed**

- **Cached** based on reactive dependencies
- Only recalculates when dependencies change
- Use for **derived state**

```ts
const fullName = computed(() => `${firstName.value} ${lastName.value}`);

// Called multiple times in 1 render → only computes once
```

#### **Method**

- **No cache**, runs every time called
- Use for **actions** or logic with side-effects

```ts
function getFullName() {
  return `${firstName.value} ${lastName.value}`;
}

// Called 2 times → runs 2 times
```

#### **When to use:**

| Use case                     | Use computed | Use method |
| ---------------------------- | ------------ | ---------- |
| Filter/transform data        | ✅           | ❌         |
| Expensive calculation        | ✅           | ❌         |
| Format display value         | ✅           | ❌         |
| Event handler                | ❌           | ✅         |
| Side effects (API, log)      | ❌           | ✅         |
| Need arguments               | ❌           | ✅         |

**Rule of thumb:** If return value depends on reactive state → use **computed**. If it's an action → use **method**.

---

#### 5.1.7. Computed vs Watch

**Senior-level Answer:**

#### **Computed**

- For **derived state** (data computed from other state)
- Has cache, declarative
- Should **not** have side effects

```ts
const filteredUsers = computed(() => {
  return users.value.filter((u) => u.age >= 18);
});
```

#### **Watch**

- For **side effects** when data changes
- Call API, log, update localStorage, etc.
- Has access to old and new values

```ts
watch(
  () => user.id,
  async (newId, oldId) => {
    console.log(`User changed: ${oldId} → ${newId}`);
    await fetchUserData(newId); // side effect
  }
);
```

#### **Comparison:**

| Criteria     | Computed                  | Watch                        |
| ------------ | ------------------------- | ---------------------------- |
| Purpose      | Transform/derive data     | Side effects                 |
| Return value | Must return               | No return                    |
| Cache        | Yes                       | No                           |
| Side effects | ❌ Avoid                  | ✅ Encouraged                |
| Use case     | Filter, format, calculate | API call, logging, analytics |

---

#### 5.1.8. nextTick Use Cases

**Question:** When have you used nextTick?

**Senior-level Answer:**

`nextTick` waits for Vue to update DOM after state changes, then runs callback.

#### **Use Case 1: Access DOM after update**

```ts
const message = ref("Hello");

function changeMessage() {
  message.value = "World";
  console.log(document.querySelector(".message").textContent); // still "Hello"

  nextTick(() => {
    console.log(document.querySelector(".message").textContent); // "World"
  });
}
```

#### **Use Case 2: Focus input after render**

```vue
<script setup>
const showInput = ref(false);
const inputRef = ref(null);

async function openInput() {
  showInput.value = true;
  await nextTick();
  inputRef.value.focus();
}
</script>

<template>
  <input v-if="showInput" ref="inputRef" />
</template>
```

#### **Use Case 3: Scroll to newly added item**

```ts
const items = ref([1, 2, 3]);

async function addItem() {
  items.value.push(items.value.length + 1);
  await nextTick();

  const container = document.querySelector(".list");
  container.scrollTop = container.scrollHeight;
}
```

**Summary:** Use `nextTick` when need to wait for Vue to finish rendering DOM to:

- Manipulate DOM (focus, scroll, measure)
- Integrate third-party libraries (charts, editor)
- Debug (check DOM state)

---

#### 5.1.9. Debug & Fix Component Bugs

**Question:** When you find a component causing a bug, how do you fix it?

**Senior-level Answer:**

#### **Step 1: Reproduce & Isolate**

- Identify **exact steps** to reproduce bug
- Check which **environment** bug occurs (dev/staging/prod, which browser)
- Isolate: is bug in this component or from parent/child?

#### **Step 2: Gather Information**

```ts
// 1. Check console errors
// 2. Vue DevTools - inspect component state/props
// 3. Network tab - API responses correct?
// 4. Add logging
console.log("Props:", props);
console.log("State:", { count, user });

// 5. Check lifecycle
onMounted(() => console.log("mounted"));
onUpdated(() => console.log("updated"));
```

#### **Step 3: Common Bug Patterns**

**Pattern 1: Reactivity lost**

```ts
// ❌ Bad: destructure reactive object
const { name } = reactive({ name: "John" });

// ✅ Good: use toRefs
const state = reactive({ name: "John" });
const { name } = toRefs(state);
```

**Pattern 2: Async timing**

```ts
// ❌ Race condition
async function loadUser() {
  const data = await api.getUser();
  user.value = data; // can be overridden by other call
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

#### **Step 4: Fix & Verify**

1. Write test (if not exist) to reproduce bug
2. Fix code
3. Test on multiple scenarios
4. Code review with team
5. Deploy staging → QA verify → production

---

#### 5.1.10. Reactivity System

**Senior-level Answer:**

Vue 3 uses **Proxy-based reactivity** instead of Object.defineProperty (Vue 2).

#### **ref vs reactive**

- **ref**: wrap primitive or object, access via `.value`
- **reactive**: only for object/array, no `.value` needed
- **shallowRef / shallowReactive**: optimize when only need reactive at first level

#### **computed**

- For **derived state**, auto-cached
- Only recalculates when dependencies change

#### **watch vs watchEffect**

- **watch**: track specific source, has old/new values
- **watchEffect**: auto-track dependencies, runs immediately

```ts
// watch
watch(() => user.id, (newId, oldId) => {
  fetchUserData(newId);
});

// watchEffect
watchEffect(() => {
  console.log(user.id); // auto-tracked
});
```

---

#### 5.1.11. Lifecycle Hooks

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

**Key differences:**

- `setup()` replaces beforeCreate + created
- Hook names add `on` prefix
- `beforeDestroy/destroyed` → `onBeforeUnmount/onUnmounted`

---

#### 5.1.12. created vs mounted: When to Call API?

**Question:** Difference between `created` and `mounted`, can we call API in `created`?

**Senior-level Answer:**

#### **Note:** Vue 3 Composition API has **no** `onCreated` → write logic directly in `setup()`.

#### **Comparison:**

| Criteria         | created / setup()          | mounted / onMounted     |
| ---------------- | -------------------------- | ----------------------- |
| **Timing**       | Component instance created | Component in DOM        |
| **DOM available**| ❌ No                      | ✅ Yes                  |
| **Use for**      | Fetch data, init state     | DOM manipulation        |
| **Call API**     | ✅ Recommended             | ✅ OK, but slower       |

#### **Example:**

```vue
<script setup>
import { ref, onMounted } from "vue";

const user = ref(null);

// ✅ Call API in setup() - earliest
user.value = await api.getUser();

// ✅ DOM manipulation in onMounted
onMounted(() => {
  inputRef.value?.focus();
});
</script>
```

#### **Can call API in created/setup()?**

**✅ YES - and RECOMMENDED!**

**Reasons:**

- Fetch data earlier → better UX
- SSR-friendly (mounted doesn't run server-side)
- Data ready when DOM renders

**Easy rule:**

- **Don't need DOM** → `setup()`
- **Need DOM** → `onMounted()`
- **API calls** → `setup()` (earlier the better)

---

### 5.2. Advanced Features

#### 5.2.1. Teleport

**Senior-level Answer:**

Teleport allows rendering child component at **different DOM location** outside parent component, but keeps logic in component tree.

#### **Use Case: Modals, Tooltips, Notifications**

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <h1>My App</h1>
    <UserProfile />
    <div id="modal-container"></div>
  </div>
</template>

<!-- UserProfile.vue -->
<template>
  <div>
    <button @click="showModal = true">Open Modal</button>

    <Teleport to="#modal-container">
      <div v-if="showModal" class="modal-backdrop" @click="showModal = false">
        <div class="modal" @click.stop>
          <h2>Modal Content</h2>
          <button @click="showModal = false">Close</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
```

#### **Teleport to body**

```vue
<Teleport to="body">
  <div class="toast">{{ message }}</div>
</Teleport>
```

---

#### 5.2.2. Suspense

**Senior-level Answer:**

Suspense allows orchestrating async dependencies and showing fallback UI while waiting.

#### **Basic Usage**

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
```

#### **Async Component**

```vue
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

---

#### 5.2.3. Custom Directives

**Senior-level Answer:**

Custom directives allow reusing DOM manipulation logic.

#### **Example: v-focus**

```ts
export const vFocus = {
  mounted(el: HTMLElement) {
    el.focus();
  },
};

// Usage
<input v-focus />
```

#### **Example: v-click-outside**

```ts
export const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};
```

---

#### 5.2.4. Plugins

**Senior-level Answer:**

Plugins add global-level functionality to Vue app.

#### **Creating a Plugin**

```ts
export default {
  install(app, options) {
    // Add global property
    app.config.globalProperties.$translate = (key) => {
      return key.split(".").reduce((o, i) => o[i], options.messages);
    };

    // Provide/inject
    app.provide("i18n", options);
  },
};
```

#### **Using Plugin**

```ts
import i18nPlugin from "./plugins/i18n";

app.use(i18nPlugin, {
  messages: {
    hello: "Hello World",
  },
});
```

---

#### 5.2.5. Render Functions & JSX

**Senior-level Answer:**

Render functions allow creating VNodes programmatically instead of using template.

#### **h() Function**

```ts
import { h } from "vue";

const vnode = h("div", { class: "container" }, [
  h("h1", "Hello"),
  h("p", "World"),
]);
```

#### **JSX in Vue**

```tsx
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

**When to Use:**

✅ Dynamic component creation, highly dynamic rendering, performance-critical
❌ Simple static templates, team not familiar with JSX

---

#### 5.2.6. Provide / Inject

**Senior-level Answer:**

Provide/Inject implements dependency injection pattern, avoids prop drilling.

#### **Basic Usage**

```vue
<!-- Parent -->
<script setup>
import { provide, ref } from "vue";

const theme = ref("dark");
provide("theme", theme);
</script>

<!-- Child (any level deep) -->
<script setup>
import { inject } from "vue";

const theme = inject("theme");
</script>

<template>
  <div :class="`theme-${theme}`">
    Content
  </div>
</template>
```

#### **With Default Values**

```ts
const theme = inject("theme", "light"); // default: 'light'
```

#### **TypeScript Support**

```ts
import { InjectionKey, Ref } from "vue";

export const ThemeKey: InjectionKey<Ref<string>> = Symbol("theme");

// Parent
provide(ThemeKey, theme);

// Child
const theme = inject(ThemeKey); // Fully typed!
```

---

[← Back to Overview](../../README-en.md)

