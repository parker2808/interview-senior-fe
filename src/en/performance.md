# Performance & Optimization

Best practices and advanced techniques to optimize performance for Vue applications.

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

- **Lifetime:** permanent until deleted.
- **Size:** ~5–10MB.
- **Cross-tab:** yes.
- **Use for:** theme, settings, light cache, token (if not httpOnly).

#### **sessionStorage**

- **Lifetime:** per tab (lost when tab closes).
- **Size:** ~5MB.
- **Cross-tab:** no.
- **Use for:** temporary form state, wizard steps, per-tab filters.

#### **cookie**

- **Size:** ~4KB.
- **Auto-sent in HTTP requests** (JS can access if not `httpOnly`).
- **Use for:** auth session, refresh token, tracking.

#### **When to use what? (Senior answer)**

- **localStorage** → long-term, cross-tab storage.
- **sessionStorage** → temporary per-tab data.
- **cookie (httpOnly)** → most secure for auth (XSS-proof).

---

#### 9.1.2. Performance Optimization

#### **1. Avoid unnecessary re-renders**

- Use `shallowRef` / `shallowReactive` when deep reactivity not needed.
- Avoid large objects in global reactive state.
- Use stable `key` in lists for Vue diff accuracy.

#### **2. Optimize computed & watch**

- `computed` for derived state → cached → avoid recalculation.
- `watch` for side-effects, not data transformation.
- Avoid overusing `watchEffect` (auto-collects deps → runs often).

#### **3. Memoize components**

- Use `<keep-alive>` for components switching back and forth.
- Heavy components → use `defineAsyncComponent()` for lazy-load.

#### **4. SSR optimization (Nuxt)**

- Use `defineNuxtPlugin()` with correct environment (client/server).
- Don't SSR heavy components (e.g. charts) → wrap with `<client-only>`.
- API routes should be light, limit payload, use proper indexes.

#### **5. Smart lazy-loading**

- Pages auto code-split (Nuxt) → leverage this.
- Rarely-used components → dynamic import.
- Images → use Nuxt Image: WebP, breakpoints, lazy-loading.

#### **6. Cache data**

- `useAsyncData` with `staleTime` or `serverCacheKeys`.
- Nitro storage (Redis/memory) for backend caching.
- FE caching: TanStack Query → reduce redundant requests.

---

#### 9.1.3. Code Review Checklist

#### **1. Understand context**

- Read PR description / ticket / commit.
- Understand goal: fix bug, feature, refactor.
- Run the code to understand user flow.

#### **2. Code readability & consistency**

- Clear variable names, proper semantics.
- Avoid deep nesting → extract functions.
- No hard-coding → use constants / config.
- Follow ESLint + Prettier.

#### **3. Architecture & Component structure**

- Component does **one thing** (Single Responsibility).
- Complex logic → extract to **composables/helpers**.
- Avoid deep prop drilling → use provide/inject when appropriate.
- Avoid duplicate logic → reuse composables.

#### **4. HTML/CSS/Tailwind**

- Use semantic HTML (`<header>`, `<nav>`, `<main>`, `<article>`).
- Prefer utility classes → avoid inline CSS.
- Check responsive, breakpoints.
- Accessibility: alt text, ARIA labels, keyboard navigation.

#### **5. Performance optimization**

- Avoid unnecessary re-renders.
- Use `computed` instead of `watch` for derived state.
- Lazy-load heavy components with `defineAsyncComponent`.
- Use stable `key` for large lists.

#### **6. Git hygiene**

- Small, clear commits.
- Commit names follow convention (Conventional Commits).
- Folder structure follows project standards.

---

#### 9.1.4. Performance Case Studies

_Format: Problem → Root Cause → Solution → Result_

#### **Case 1 — Slow UI rendering with large list**

**Problem:** UI lags when displaying 5,000+ items.

**Root Cause:** Rendering entire DOM at once; no virtualization.

**Solution:**

- Use **virtual scroll** (Vue Virtual Scroller / custom render window).
- Only render items in viewport (~20-50 items).

**Result:**

- FPS increased from ~20 → **60 FPS**.
- Render time reduced from seconds → **< 100ms**.

---

#### **Case 2 — Slow API & redundant requests**

**Problem:** Each tab switch → same API called again → slow UI.

**Root Cause:** No API cache; each action causes re-fetch.

**Solution:**

- Use **TanStack Query** with `staleTime`, `cacheTime`.
- Apply **debounce** for search input (300-500ms).
- Implement request deduplication.

**Result:**

- Reduced **60–80% redundant requests**.
- Much smoother UX, nearly instant tab loads.

---

#### **Case 3 — Large bundle size → slow load time**

**Problem:** JS bundle 3MB → high time-to-interactive (~4s).

**Root Cause:** Import all libs into main bundle; no code-splitting.

**Solution:**

- Use **dynamic import** for heavy pages.
- Replace lodash full → lodash-es modular.
- Optimize images: WebP, lazy loading, responsive images.
- Enable Vite build analyzer (`rollup-plugin-visualizer`) to reduce deps.
- Tree-shaking: remove dead code.

**Result:**

- Bundle reduced 3MB → **900KB** (~70% reduction).
- First load reduced 4s → **1.2s**.

---

#### **Case 4 — Vue reactivity causing unnecessary re-renders**

**Problem:** Entire component tree re-renders when one small state changes.

**Root Cause:** State in global store when only one component uses it.

**Solution:**

- Move state to **local component**.
- Split components; use `computed` instead of unnecessary `watch`.
- Apply `shallowRef` for large objects without deep reactivity.

**Result:**

- Re-renders reduced **~70%**.
- Much smoother interactions.

---

#### **Case 5 — Hydration mismatch in SSR**

**Problem:** Console warning "Hydration node mismatch", UI flash/jump on load.

**Root Cause:** Server HTML different from client render (timestamp, random ID, client-only content).

**Solution:**

- Wrap client-only content in `<ClientOnly>` component.
- Use stable IDs (don't use `Math.random()` or `Date.now()` in render).
- Ensure data fetching consistency between server & client.

**Result:**

- Eliminated hydration warnings.
- Improved FCP, no more UI jump.

---

### 9.2. Advanced Optimization

#### 9.2.1. Code Splitting Strategies

**Senior-level Answer:**

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

---

#### 9.2.2. Tree Shaking

**Senior-level Answer:**

Tree shaking removes unused code from bundle.

#### **Best Practices**

```ts
// ❌ BAD: Imports everything
import _ from "lodash";
_.debounce(fn, 300);

// ✅ GOOD: Import only what you need
import debounce from "lodash-es/debounce";
debounce(fn, 300);
```

---

#### 9.2.3. Debounce vs Throttle

**Senior-level Answer:**

#### **Debounce** - Wait for user to stop action

```ts
// Debounce: Call after user STOPS typing for 300ms
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
```

#### **Throttle** - Limit frequency

```ts
// Throttle: Call at most once per 300ms
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
```

#### **When to Use What?**

| Use Case               | Debounce | Throttle |
| ---------------------- | -------- | -------- |
| Search input           | ✅       | ❌       |
| Window resize          | ✅       | ❌       |
| Form validation        | ✅       | ❌       |
| Scroll events          | ❌       | ✅       |
| Mouse move/drag        | ❌       | ✅       |

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
```

---

[← Back to Overview](../../README-en.md)

