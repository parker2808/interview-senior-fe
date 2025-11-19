# System Design

Frontend system design principles và decision-making.

---

## Table of Contents

1. [Frontend Architecture Decisions](#1-frontend-architecture-decisions)
2. [Caching Strategies](#2-caching-strategies)
3. [Component Library Design](#3-component-library-design)

---
## 11. System Design

### 11.1. Frontend Architecture Decisions

**Câu trả lời chuẩn Senior:**

#### **Monolith vs Micro-frontends**

| Aspect          | Monolith               | Micro-frontends         |
| --------------- | ---------------------- | ----------------------- |
| **Complexity**  | Simple                 | Complex                 |
| **Team**        | Single team            | Multiple teams          |
| **Deploy**      | All at once            | Independent             |
| **Performance** | Faster (single bundle) | Slower (multiple loads) |
| **Tech stack**  | Unified                | Mixed possible          |
| **When to use** | Small-medium apps      | Large, multi-team apps  |

#### **CSR vs SSR vs SSG Decision Tree**

```
Does content change frequently?
├─ Yes → SSR (Nuxt with server rendering)
└─ No → SSG (Nuxt generate)

Need SEO?
├─ Yes → SSR or SSG
└─ No → CSR OK (SPA)

Is it a private dashboard?
└─ CSR with authentication

Is it a public landing page?
└─ SSG for best performance

Is it an e-commerce site?
└─ SSR for dynamic prices + SEO
```

---

### 11.2. Caching Strategies

**Câu trả lời chuẩn Senior:**

#### **Multi-layer Caching**

```
1. Browser Cache (Cache-Control headers)
2. CDN Cache (CloudFlare, Cloudinary)
3. API Gateway Cache (Redis)
4. Database Query Cache
5. Client-side Cache (TanStack Query, SWR)
```

#### **TanStack Query Caching**

```ts
import { useQuery } from "@tanstack/vue-query";

const { data, isLoading } = useQuery({
  queryKey: ["user", userId],
  queryFn: () => fetchUser(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
});
```

#### **Cache Invalidation**

```ts
import { useQueryClient } from "@tanstack/vue-query";

const queryClient = useQueryClient();

// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ["user", userId] });

// Invalidate all user queries
queryClient.invalidateQueries({ queryKey: ["user"] });

// Update cache optimistically
queryClient.setQueryData(["user", userId], newUserData);
```

---

### 11.3. Component Library Design

**Câu trả lời chuẩn Senior:**

#### **Design Tokens**

```ts
// tokens/colors.ts
export const colors = {
  primary: {
    50: "#e3f2fd",
    100: "#bbdefb",
    500: "#2196f3",
    900: "#0d47a1",
  },
  // ...
};

// tokens/spacing.ts
export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
};
```

#### **Composable Components**

```vue
<!-- Base Button -->
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
  disabled: false,
  loading: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <button
    :class="[`btn-${variant}`, `btn-${size}`]"
    :disabled="disabled || loading"
    @click="emit('click', $event)"
  >
    <span v-if="loading" class="spinner" />
    <slot />
  </button>
</template>
```

#### **Documentation (Storybook)**

```ts
// Button.stories.ts
import type { Meta, StoryObj } from "@storybook/vue3";
import Button from "./Button.vue";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    size: "md",
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Click me</Button>',
  }),
};
```

---


---

[← Back to Overview](../README.md)
