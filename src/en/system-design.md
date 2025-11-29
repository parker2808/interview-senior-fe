# System Design

Frontend system design principles and decision-making.

---

## 16. System Design

## Table of Contents

1. [Frontend Architecture Decisions](#161-frontend-architecture-decisions)

2. [Caching Strategy](#162-caching-strategy)

3. [Component Library Design](#163-component-library-design)

---

### 16.1. Frontend Architecture Decisions

**Question:** How do you design architecture for large-scale Vue app?

**Senior-level Answer:**

#### **Folder Structure:**

```
src/
├── assets/           # Static files
├── components/       # Shared components
│   ├── base/        # Base components (Button, Input)
│   ├── layout/      # Layout components (Header, Footer)
│   └── common/      # Common business components
├── composables/      # Composition API logic
├── modules/          # Feature modules
│   ├── auth/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── stores/
│   │   ├── types/
│   │   └── routes.ts
│   └── products/
├── router/
├── stores/
├── types/
├── utils/
└── main.ts
```

#### **Architecture Patterns:**

| Pattern              | When to use                         |
| -------------------- | ----------------------------------- |
| **Layered**          | Traditional apps, clear separation  |
| **Feature-based**    | Large teams, domain-driven          |
| **Micro-frontends**  | Multiple teams, independent deploy  |
| **Component-driven** | Design systems, reusable components |

#### **Decision Framework:**

**1. Team Size:**

- **< 5 devs**: Simple, flat structure
- **5-20 devs**: Feature-based modules
- **20+ devs**: Micro-frontends

**2. Complexity:**

- **Simple**: SPA, client-side routing
- **Medium**: SSR with Nuxt
- **Complex**: Micro-frontends, multi-tenant

**3. Performance:**

- **High traffic**: SSR, CDN, aggressive caching
- **Interactive**: SPA, optimistic updates
- **Data-heavy**: Virtualization, pagination

---

### 16.2. Caching Strategy

**Senior-level Answer:**

#### **Levels of Caching:**

```
Browser Cache
    ↓
CDN Cache
    ↓
API Cache (Redis)
    ↓
Database
```

#### **Frontend Caching Strategies:**

| Strategy           | Use Case             | TTL              |
| ------------------ | -------------------- | ---------------- |
| **Memory Cache**   | Current session data | Session lifetime |
| **localStorage**   | User preferences     | Unlimited        |
| **sessionStorage** | Temporary data       | Tab close        |
| **IndexedDB**      | Large data, offline  | Unlimited        |
| **Service Worker** | Static assets        | Until update     |

#### **HTTP Caching Headers:**

```js
// Cache static assets aggressively
Cache-Control: public, max-age=31536000, immutable

// Cache API with revalidation
Cache-Control: private, max-age=3600, must-revalidate

// No cache for sensitive data
Cache-Control: no-store, no-cache, must-revalidate
```

#### **Implementation:**

**1. In-Memory Cache:**

```js
// composables/useCache.js
const cache = new Map();

export function useCache(key, fetcher, ttl = 60000) {
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }

  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });

  return data;
}

// Usage
const users = await useCache("users", () => fetchUsers(), 60000);
```

**2. Service Worker Cache:**

```js
// sw.js
const CACHE_NAME = "v1";

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(e.request).then((response) => {
        // Stale-While-Revalidate
        const fetchPromise = fetch(e.request).then((networkResponse) => {
          cache.put(e.request, networkResponse.clone());
          return networkResponse;
        });

        return response || fetchPromise;
      });
    })
  );
});
```

#### **Best Practices:**

✅ **Cache invalidation**: Clear when data changes
✅ **Cache keys**: Unique, predictable
✅ **TTL appropriate**: Static > API > User-specific
✅ **Versioning**: Bust cache on deploy

---

### 16.3. Component Library Design

**Question:** How do you design a component library?

**Senior-level Answer:**

#### **Design Principles:**

| Principle        | Explanation                    |
| ---------------- | ------------------------------ |
| **Composable**   | Small components, combinable   |
| **Accessible**   | ARIA, keyboard navigation      |
| **Customizable** | Props, slots, CSS variables    |
| **Performant**   | Lazy load, tree-shakeable      |
| **Type-safe**    | TypeScript definitions         |

#### **Structure:**

```
my-ui-library/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.vue
│   │   │   ├── Button.test.ts
│   │   │   ├── Button.stories.ts
│   │   │   └── index.ts
│   │   └── Input/
│   ├── composables/
│   ├── types/
│   ├── utils/
│   └── index.ts
├── docs/              # Documentation site
├── package.json
└── vite.config.ts
```

#### **Base Button Example:**

```vue
<!-- Button.vue -->
<script setup lang="ts">
interface Props {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <button
    :class="['btn', `btn--${variant}`, `btn--${size}`]"
    :disabled="disabled || loading"
    @click="emit('click', $event)"
  >
    <span v-if="loading" class="spinner" />
    <slot />
  </button>
</template>

<style scoped>
.btn {
  background: var(--btn-bg, #007bff);
  color: var(--btn-color, white);
  padding: var(--btn-padding, 0.5rem 1rem);
}
</style>
```

#### **Publishing:**

```json
{
  "name": "@company/ui",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    }
  }
}
```

#### **Documentation:**

**Tools:**

- **Storybook**: Interactive component demos
- **VitePress**: Documentation site
- **TSDoc**: API documentation

#### **Versioning:**

```
MAJOR.MINOR.PATCH

1.0.0 → 1.0.1  (Bug fix, backward compatible)
1.0.0 → 1.1.0  (New feature, backward compatible)
1.0.0 → 2.0.0  (Breaking changes)
```

#### **Best Practices:**

✅ **Tree-shakeable**: Export individual components
✅ **TypeScript**: Full type definitions
✅ **Testing**: Unit + Visual regression
✅ **Accessibility**: WCAG compliance
✅ **Versioning**: Semantic versioning
✅ **Peer dependencies**: Don't bundle Vue

---

[← Back to Overview](../../README-en.md)

