# Monitoring & Error Handling

Theo dõi lỗi, logging và monitoring performance cho production applications.

---

## 19. Monitoring & Error Handling

## Table of Contents

1. [Theo dõi lỗi với Sentry](#191-theo-dõi-lỗi-với-sentry)

2. [Error Boundaries trong Vue](#192-error-boundaries-trong-vue)

3. [Theo dõi Performance](#193-theo-dõi-performance)

4. [Chiến lược Logging](#194-chiến-lược-logging)

---

### 19.1. Theo dõi lỗi với Sentry

**Câu trả lời chuẩn Senior:**

Sentry là tool tracking lỗi real-time, giúp debug production issues.

#### **Setup Sentry:**

```js
// main.js
import * as Sentry from "@sentry/vue";

Sentry.init({
  app,
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    }),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 0.2, // 20% transactions
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

#### **Capture Custom Errors:**

```js
try {
  riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    level: "error",
    tags: {
      section: "payment",
      user_type: "premium",
    },
    extra: {
      orderId: order.id,
      amount: order.total,
    },
  });
}
```

#### **Best Practices:**

✅ Set user context: `Sentry.setUser({ id, email })`
✅ Add breadcrumbs: Track user actions
✅ Filter sensitive data
✅ Set release version
✅ Source maps cho production

---

### 19.2. Error Boundaries trong Vue

**Câu trả lời chuẩn Senior:**

Error Boundary catch errors trong component tree để tránh crash toàn bộ app.

#### **Vue 3 Error Handling:**

```vue
<!-- ErrorBoundary.vue -->
<script setup>
import { ref, onErrorCaptured } from "vue";

const error = ref(null);
const errorInfo = ref(null);

onErrorCaptured((err, instance, info) => {
  error.value = err;
  errorInfo.value = info;

  // Log to Sentry
  console.error("Error caught:", err, info);

  // Prevent propagation
  return false;
});
</script>

<template>
  <div v-if="error" class="error-boundary">
    <h2>Something went wrong</h2>
    <p>{{ error.message }}</p>
    <button @click="error = null">Try Again</button>
  </div>

  <slot v-else />
</template>
```

#### **Usage:**

```vue
<ErrorBoundary>
  <SuspiciousComponent />
</ErrorBoundary>
```

#### **Global Error Handler:**

```js
// main.js
app.config.errorHandler = (err, instance, info) => {
  console.error("Global error:", err);

  // Send to Sentry
  Sentry.captureException(err);
};
```

---

### 19.3. Theo dõi Performance

**Câu trả lời chuẩn Senior:**

#### **Core Web Vitals:**

| Metric                             | Good    | Needs Improvement |
| ---------------------------------- | ------- | ----------------- |
| **LCP** (Largest Contentful Paint) | < 2.5s  | > 4s              |
| **FID** (First Input Delay)        | < 100ms | > 300ms           |
| **CLS** (Cumulative Layout Shift)  | < 0.1   | > 0.25            |

#### **Tracking với Web Vitals:**

```js
import { onCLS, onFID, onLCP } from "web-vitals";

function sendToAnalytics({ name, value, id }) {
  // Send to analytics service
  gtag("event", name, {
    value: Math.round(value),
    event_label: id,
  });
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onLCP(sendToAnalytics);
```

#### **Performance API:**

```js
// Measure specific operations
performance.mark("start-render");
// ... render logic
performance.mark("end-render");

performance.measure("render-time", "start-render", "end-render");

const measure = performance.getEntriesByName("render-time")[0];
console.log("Render took:", measure.duration, "ms");
```

#### **Monitoring Tools:**

- **Sentry Performance**: Transactions, traces
- **Google Analytics**: Page views, events
- **LogRocket**: Session replay
- **Datadog RUM**: Real User Monitoring

---

### 19.4. Chiến lược Logging

**Câu trả lời chuẩn Senior:**

#### **Log Levels:**

```js
const logger = {
  debug: (...args) => {
    if (process.env.NODE_ENV === "development") {
      console.debug("[DEBUG]", ...args);
    }
  },

  info: (...args) => {
    console.info("[INFO]", ...args);
  },

  warn: (...args) => {
    console.warn("[WARN]", ...args);
    // Send to monitoring service
  },

  error: (...args) => {
    console.error("[ERROR]", ...args);
    Sentry.captureException(args[0]);
  },
};
```

#### **Structured Logging:**

```js
logger.info("User logged in", {
  userId: user.id,
  timestamp: Date.now(),
  ip: request.ip,
  userAgent: request.headers["user-agent"],
});
```

#### **Best Practices:**

✅ **Không log sensitive data**: passwords, tokens, credit cards
✅ **Add context**: user ID, request ID, timestamp
✅ **Log levels phù hợp**:

- DEBUG: Development only
- INFO: Normal operations
- WARN: Potential issues
- ERROR: Actual errors

✅ **Structured logs**: JSON format dễ parse
✅ **Log rotation**: Tránh log files quá lớn

#### **Vue Router Logging:**

```js
router.beforeEach((to, from, next) => {
  logger.info("Navigation", {
    from: from.fullPath,
    to: to.fullPath,
    userId: store.state.user?.id,
  });
  next();
});
```

#### **API Call Logging:**

```js
axios.interceptors.request.use((config) => {
  logger.debug("API Request", {
    method: config.method,
    url: config.url,
    params: config.params,
  });
  return config;
});

axios.interceptors.response.use(
  (response) => {
    logger.info("API Success", {
      url: response.config.url,
      status: response.status,
      duration:
        response.config.metadata?.endTime - response.config.metadata?.startTime,
    });
    return response;
  },
  (error) => {
    logger.error("API Error", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });
    return Promise.reject(error);
  }
);
```

---

[← Quay lại Tổng quan](../README.md)
