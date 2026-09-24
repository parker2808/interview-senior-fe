# Monitoring & Error Handling

Error tracking, logging and performance monitoring for production applications.

---

## 19. Monitoring & Error Handling

## Table of Contents

1. [Error Tracking with Sentry](#191-error-tracking-with-sentry)

2. [Error Boundaries in Vue](#192-error-boundaries-in-vue)

3. [Performance Monitoring](#193-performance-monitoring)

4. [Logging Strategy](#194-logging-strategy)

---

### 19.1. Error Tracking with Sentry

**Senior-level Answer:**

Sentry is a real-time error tracking tool that helps debug production issues.

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
✅ Source maps for production

---

### 19.2. Error Boundaries in Vue

**Senior-level Answer:**

Error Boundary catches errors in component tree to prevent entire app crash.

#### **Vue 3 Error Handling:**

```vue
<!-- ErrorBoundary.vue -->
<script setup>
import { ref, onErrorCaptured } from "vue";

const error = ref(null);

onErrorCaptured((err, instance, info) => {
  error.value = err;
  console.error("Error caught:", err, info);
  return false; // Prevent propagation
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

#### **Global Error Handler:**

```js
// main.js
app.config.errorHandler = (err, instance, info) => {
  console.error("Global error:", err);
  Sentry.captureException(err);
};
```

---

### 19.3. Performance Monitoring

**Senior-level Answer:**

#### **Core Web Vitals:**

| Metric                             | Good    | Needs Improvement |
| ---------------------------------- | ------- | ----------------- |
| **LCP** (Largest Contentful Paint) | < 2.5s  | > 4s              |
| **FID** (First Input Delay)        | < 100ms | > 300ms           |
| **CLS** (Cumulative Layout Shift)  | < 0.1   | > 0.25            |

#### **Tracking with Web Vitals:**

```js
import { onCLS, onFID, onLCP } from "web-vitals";

function sendToAnalytics({ name, value, id }) {
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

### 19.4. Logging Strategy

**Senior-level Answer:**

#### **Log Levels:**

```js
const logger = {
  debug: (...args) => {
    if (process.env.NODE_ENV === "development") {
      console.debug("[DEBUG]", ...args);
    }
  },
  info: (...args) => console.info("[INFO]", ...args),
  warn: (...args) => console.warn("[WARN]", ...args),
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

✅ **Don't log sensitive data**: passwords, tokens, credit cards
✅ **Add context**: user ID, request ID, timestamp
✅ **Use appropriate log levels**:

- DEBUG: Development only
- INFO: Normal operations
- WARN: Potential issues
- ERROR: Actual errors

✅ **Structured logs**: JSON format easy to parse
✅ **Log rotation**: Avoid huge log files

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
  });
  return config;
});

axios.interceptors.response.use(
  (response) => {
    logger.info("API Success", {
      url: response.config.url,
      status: response.status,
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

[← Back to Overview](../../README-en.md)

