# Performance & Optimization

Best practices và advanced techniques để tối ưu performance cho Vue applications.

---

## Table of Contents

1. **Core Performance**
   
   1.1. [Storage: localStorage vs sessionStorage vs Cookie](#911-storage-localstorage-vs-sessionstorage-vs-cookie)
   
   1.2. [Performance Optimization](#912-performance-optimization)
   
   1.3. [Code Review Checklist](#913-code-review-checklist)
   
   1.4. [Performance Case Studies](#914-performance-case-studies)

2. **Advanced Optimization**
   
   2.1. [Code Splitting Strategies](#921-code-splitting-strategies)
   
   2.2. [Tree Shaking](#922-tree-shaking)
   
   2.3. [Debounce vs Throttle](#923-debounce-vs-throttle)
   
   2.4. [Image & Font Optimization](#924-image--font-optimization)

---

## 9. Performance & Optimization

### 9.1. Core Performance

#### 9.1.1. Storage: localStorage vs sessionStorage vs Cookie

#### **localStorage**

- **Thời gian sống:** vĩnh viễn đến khi xoá.
- **Dung lượng:** ~5–10MB.
- **Chia sẻ tab:** có.
- **Dùng cho:** theme, settings, cache nhẹ, token (nếu không cần httpOnly).

#### **sessionStorage**

- **Thời gian sống:** theo tab (đóng tab là mất).
- **Dung lượng:** ~5MB.
- **Chia sẻ tab:** không.
- **Dùng cho:** form state tạm, step wizard, filter tạm theo tab.

#### **cookie**

- **Dung lượng:** ~4KB.
- **Tự động gửi trong HTTP request** (nếu không `httpOnly` thì JS truy cập được).
- **Dùng cho:** auth session, refresh token, tracking.

#### **Khi nào dùng gì? (tóm gọn chuẩn Senior)**

- **localStorage** → lưu lâu dài, cross-tab.
- **sessionStorage** → dữ liệu tạm theo tab.
- **cookie (httpOnly)** → auth an toàn nhất (XSS-proof).

---

#### 9.1.2. Performance Optimization

#### **1. Tránh re-render không cần thiết**

- Dùng `shallowRef` / `shallowReactive` khi không cần deep reactive.
- Tránh đặt object lớn vào reactive toàn cục.
- Sử dụng `key` ổn định trong danh sách để Vue update diff chính xác.

#### **2. Tối ưu computed & watch**

- `computed` dùng cho derived state → có cache → tránh tính lại thừa.
- `watch` dùng cho side-effect, không dùng để biến đổi dữ liệu.
- Tránh lạm dụng `watchEffect` vì auto-collect deps → dễ gây chạy lại nhiều.

#### **3. Memo hoá component**

- Dùng `<keep-alive>` cho component chuyển tab qua lại.
- Component nặng → dùng `defineAsyncComponent()` để lazy-load.

#### **4. Tối ưu trong SSR (Nuxt)**

- Dùng `defineNuxtPlugin()` đúng môi trường (client/server).
- Không SSR component phụ (e.g. charts) → bọc bằng `<client-only>`.
- API routes nên nhẹ, limit payload, dùng index đúng.

#### **5. Lazy-loading thông minh**

- Pages tự được code-split (Nuxt) → tận dụng tối đa.
- Component hiếm dùng → dynamic import.
- Hình ảnh → dùng Nuxt Image: WebP, breakpoints, lazy-loading.

#### **6. Cache dữ liệu**

- `useAsyncData` với `staleTime` hoặc `serverCacheKeys`.
- Nitro storage (Redis/memory) cho backend caching.
- FE caching: TanStack Query → giảm request thừa.

---

#### 9.1.3. Code Review Checklist

#### **1. Hiểu bối cảnh**

- Đọc mô tả PR / ticket / commit.
- Nắm rõ mục tiêu: fix bug, feature, refactor.
- Chạy thử để hiểu luồng người dùng.

#### **2. Code readability & consistency**

- Tên biến rõ ràng, đúng ngữ nghĩa.
- Tránh nesting quá sâu → tách hàm.
- Không hard-code → dùng constant / config.
- Tuân thủ ESLint + Prettier.

#### **3. Kiến trúc & Component structure**

- Component chỉ làm **1 nhiệm vụ** (Single Responsibility).
- Logic phức tạp → tách sang **composables/helpers**.
- Hạn chế truyền props sâu → dùng provide/inject khi phù hợp.
- Tránh duplicate logic → tái sử dụng composables.

#### **4. HTML/CSS/Tailwind**

- Dùng semantic HTML (`<header>`, `<nav>`, `<main>`, `<article>`).
- Ưu tiên utility class → tránh CSS inline.
- Check responsive, breakpoint.
- Accessibility: alt text, ARIA labels, keyboard navigation.

#### **5. Tối ưu hiệu năng**

- Tránh re-render không cần thiết.
- Dùng `computed` thay vì `watch` nếu giá trị là derived state.
- Lazy-load component nặng bằng `defineAsyncComponent`.
- Dùng `key` ổn định cho list lớn.

#### **6. Git hygiene**

- Commit nhỏ, rõ ràng.
- Tên commit theo convention (Conventional Commits).
- Cấu trúc thư mục đúng chuẩn dự án.

---

#### 9.1.4. Performance Case Studies

_Format: Problem → Root Cause → Solution → Result_

#### **Case 1 — UI Render quá chậm khi load danh sách lớn**

**Problem:** UI lag khi hiển thị list 5,000+ items.

**Root Cause:** Render toàn bộ DOM cùng lúc; không có virtualization.

**Solution:**

- Dùng **virtual scroll** (Vue Virtual Scroller / custom render window).
- Chỉ render items trong viewport (~20-50 items).

**Result:**

- FPS tăng từ ~20 → **60 FPS**.
- Thời gian render giảm từ vài giây → **< 100ms**.

---

#### **Case 2 — API slow & nhiều request thừa**

**Problem:** Mỗi lần user chuyển tab → gọi lại API giống nhau → UI chậm.

**Root Cause:** Không cache API; mỗi action gây API re-fetch.

**Solution:**

- Dùng **TanStack Query** với `staleTime`, `cacheTime`.
- Áp dụng **debounce** cho input search (300-500ms).
- Implement request deduplication.

**Result:**

- Giảm **60–80% request dư thừa**.
- UX mượt hơn rõ rệt, load tab gần như instant.

---

#### **Case 3 — Bundle size quá lớn → slow load time**

**Problem:** JS bundle 3MB → time-to-interactive cao (~4s).

**Root Cause:** Import tất cả libs vào bundle chính; không code-splitting.

**Solution:**

- Dùng **dynamic import** cho pages nặng.
- Thay lodash full → lodash-es modular.
- Tối ưu images: WebP, lazy loading, responsive images.
- Bật Vite build analyzer (`rollup-plugin-visualizer`) để giảm deps.
- Tree-shaking: loại bỏ dead code.

**Result:**

- Bundle giảm 3MB → **900KB** (~70% reduction).
- First load giảm từ 4s → **1.2s**.

---

#### **Case 4 — Vue reactivity gây re-render không cần thiết**

**Problem:** Toàn bộ component tree render lại khi 1 state nhỏ thay đổi.

**Root Cause:** State đặt ở global store trong khi chỉ một component dùng.

**Solution:**

- Chuyển state về **local component**.
- Tách nhỏ component; dùng `computed` thay vì `watch` không cần thiết.
- Áp dụng `shallowRef` cho object lớn không cần deep reactivity.

**Result:**

- Re-render giảm **~70%**.
- Interaction mượt hơn rõ rệt.

---

#### **Case 5 — Hydration mismatch trong SSR**

**Problem:** Console warning "Hydration node mismatch", UI flash/jump khi load.

**Root Cause:** Server render HTML khác với client render (timestamp, random ID, client-only content).

**Solution:**

- Wrap client-only content trong `<ClientOnly>` component.
- Sử dụng stable IDs (không dùng `Math.random()` hoặc `Date.now()` trong render).
- Đảm bảo data fetching consistency giữa server & client.

**Result:**

- Loại bỏ hydration warnings.
- FCP cải thiện, không còn UI jump.

---

### 9.2. Advanced Optimization

#### 9.2.1. Code Splitting Strategies

**Câu trả lời chuẩn Senior:**

#### **Route-based Splitting**

```ts
// router/index.ts
const routes = [
  {
    path: "/",
    component: () => import("@/pages/Home.vue"), // Lazy load
  },
  {
    path: "/dashboard",
    component: () => import("@/pages/Dashboard.vue"),
  },
];
```

#### **Component-based Splitting**

```vue
<script setup>
import { defineAsyncComponent } from "vue";

// Lazy load heavy component
const HeavyChart = defineAsyncComponent(() =>
  import("@/components/HeavyChart.vue")
);
</script>

<template>
  <Suspense>
    <template #default>
      <HeavyChart />
    </template>
    <template #fallback>
      <div>Loading chart...</div>
    </template>
  </Suspense>
</template>
```

#### **Dynamic Imports with Conditions**

```ts
// Load different component based on condition
const loadEditor = async (type: string) => {
  if (type === "rich") {
    return await import("@/components/RichTextEditor.vue");
  } else {
    return await import("@/components/MarkdownEditor.vue");
  }
};
```

---

#### 9.2.2. Tree Shaking

**Câu trả lời chuẩn Senior:**

Tree shaking removes unused code từ bundle.

#### **Best Practices**

```ts
// ❌ BAD: Imports everything
import _ from "lodash";
_.debounce(fn, 300);

// ✅ GOOD: Import only what you need
import debounce from "lodash-es/debounce";
debounce(fn, 300);

// ✅ GOOD: Named imports (if library supports)
import { debounce } from "lodash-es";
```

#### **Side Effect-free Modules**

```json
// package.json
{
  "sideEffects": false
}

// Or specify files with side effects
{
  "sideEffects": ["*.css", "*.scss"]
}
```

---

#### 9.2.3. Debounce vs Throttle

**Câu trả lời chuẩn Senior:**

#### **Debounce** - Chờ user ngừng action

```ts
// Debounce: Call sau khi user NGỪNG gõ 300ms
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Usage: Search input
const search = debounce((query: string) => {
  fetchResults(query);
}, 300);

// User types "hello"
// h -> wait 300ms
// e -> reset timer, wait 300ms
// l -> reset timer, wait 300ms
// l -> reset timer, wait 300ms
// o -> reset timer, wait 300ms
// ... 300ms passes -> fetchResults("hello") ONCE
```

#### **Throttle** - Giới hạn tần suất

```ts
// Throttle: Call tối đa 1 lần mỗi 300ms
function throttle<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let lastCall = 0;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

// Usage: Scroll handler
const handleScroll = throttle(() => {
  console.log("Scroll position:", window.scrollY);
}, 300);

window.addEventListener("scroll", handleScroll);

// User scrolls continuously
// Call at 0ms -> logged
// Call at 100ms -> ignored
// Call at 200ms -> ignored
// Call at 300ms -> logged
// Call at 400ms -> ignored
// Call at 600ms -> logged
```

#### **When to Use What?**

| Use Case               | Debounce | Throttle |
| ---------------------- | -------- | -------- |
| Search input           | ✅       | ❌       |
| Window resize          | ✅       | ❌       |
| Form validation        | ✅       | ❌       |
| Scroll events          | ❌       | ✅       |
| Mouse move/drag        | ❌       | ✅       |
| Button click (prevent) | ✅       | ✅       |
| Auto-save              | ✅       | ❌       |

---

#### 9.2.4. Image & Font Optimization

#### **Image Optimization**

```vue
<template>
  <!-- Modern formats with fallback -->
  <picture>
    <source srcset="image.avif" type="image/avif" />
    <source srcset="image.webp" type="image/webp" />
    <img src="image.jpg" alt="Description" loading="lazy" />
  </picture>

  <!-- Responsive images -->
  <img
    srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
    sizes="(max-width: 600px) 480px, (max-width: 900px) 800px, 1200px"
    src="medium.jpg"
    alt="Responsive image"
  />

  <!-- Nuxt Image (auto-optimization) -->
  <NuxtImg
    src="/image.jpg"
    width="400"
    height="300"
    format="webp"
    loading="lazy"
    placeholder
  />
</template>
```

#### **Font Optimization**

```css
/* Preload critical fonts */
<link
  rel="preload"
  href="/fonts/Inter.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>

/* Font face with font-display */
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter.woff2") format("woff2");
  font-weight: 400;
  font-display: swap; /* or 'optional', 'fallback' */
}

/* Variable fonts (single file for all weights) */
@font-face {
  font-family: "Inter Variable";
  src: url("/fonts/Inter-Variable.woff2") format("woff2");
  font-weight: 100 900;
}
```

---


---

[← Back to Overview](../README.md)
