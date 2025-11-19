# Monitoring & Error Handling

Error tracking, logging, và performance monitoring cho production applications.

---

## Table of Contents

1. [Error Tracking with Sentry](#1-error-tracking-with-sentry)
2. [Error Boundaries in Vue](#2-error-boundaries-in-vue)
3. [Performance Monitoring](#3-performance-monitoring)
4. [Logging Strategies](#4-logging-strategies)

---
## 7. Monitoring & Error Handling

### 7.1. Error Tracking with Sentry

**Câu trả lời chuẩn Senior:**

#### **Setup Sentry**

```bash
npm install @sentry/vue
```

```ts
// main.ts
import * as Sentry from "@sentry/vue";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

Sentry.init({
  app,
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    }),
    new Sentry.Replay(),
  ],

  // Performance Monitoring
  tracesSampleRate: 1.0, // 100% in dev, lower in prod

  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
});

app.use(router);
app.mount("#app");
```

#### **Capture Errors**

```ts
try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    level: "error",
    tags: {
      section: "checkout",
    },
    extra: {
      userId: user.id,
      cart: cart,
    },
  });
}
```

#### **Breadcrumbs**

```ts
// Automatic breadcrumbs for:
// - Console logs
// - Network requests
// - DOM events
// - Navigation

// Manual breadcrumbs
Sentry.addBreadcrumb({
  category: "auth",
  message: "User logged in",
  level: "info",
});
```

#### **User Context**

```ts
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.username,
});

// Clear user (on logout)
Sentry.setUser(null);
```

---

### 7.2. Error Boundaries in Vue

**Câu trả lời chuẩn Senior:**

```vue
<!-- ErrorBoundary.vue -->
<template>
  <div v-if="error" class="error-boundary">
    <h2>Something went wrong</h2>
    <pre>{{ error.message }}</pre>
    <button @click="resetError">Try Again</button>
  </div>
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from "vue";

const error = ref(null);

onErrorCaptured((err, instance, info) => {
  error.value = err;

  // Log to error tracking service
  console.error("Error captured:", err, info);

  // Return false to prevent error propagation
  return false;
});

const resetError = () => {
  error.value = null;
};
</script>

<!-- Usage -->
<ErrorBoundary>
  <SuspiciousComponent />
</ErrorBoundary>
```

#### **Global Error Handler**

```ts
// main.ts
app.config.errorHandler = (err, instance, info) => {
  // Handle error globally
  console.error("Global error:", err, info);

  // Send to Sentry
  Sentry.captureException(err, {
    extra: { info },
  });
};
```

---

### 7.3. Performance Monitoring

**Câu trả lời chuẩn Senior:**

#### **Core Web Vitals**

```
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
```

#### **Web Vitals Library**

```bash
npm install web-vitals
```

```ts
// utils/vitals.ts
import { onCLS, onFID, onLCP, onFCP, onTTFB } from "web-vitals";

function sendToAnalytics(metric) {
  // Send to analytics endpoint
  console.log(metric);

  // Or send to Google Analytics
  gtag("event", metric.name, {
    event_category: "Web Vitals",
    value: Math.round(metric.value),
    event_label: metric.id,
    non_interaction: true,
  });
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onLCP(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

#### **Performance API**

```ts
// Measure custom timing
performance.mark("api-call-start");
await fetchData();
performance.mark("api-call-end");

performance.measure("api-call-duration", "api-call-start", "api-call-end");

const measure = performance.getEntriesByName("api-call-duration")[0];
console.log(`API call took ${measure.duration}ms`);
```

#### **Vue DevTools Performance**

```ts
// Enable performance tracking in development
if (process.env.NODE_ENV === "development") {
  app.config.performance = true;
}
```

---

### 7.4. Logging Strategies

**Câu trả lời chuẩn Senior:**

#### **Structured Logging**

```ts
// logger.ts
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private level: LogLevel;

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level;
  }

  private log(level: LogLevel, message: string, context?: any) {
    if (level < this.level) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel[level],
      message,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    console.log(JSON.stringify(logEntry));

    // Send to logging service in production
    if (import.meta.env.PROD && level >= LogLevel.WARN) {
      this.sendToService(logEntry);
    }
  }

  debug(message: string, context?: any) {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: any) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: any) {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: any) {
    this.log(LogLevel.ERROR, message, context);
  }

  private async sendToService(logEntry: any) {
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logEntry),
      });
    } catch (error) {
      // Fallback: use console
      console.error("Failed to send log:", error);
    }
  }
}

export const logger = new Logger();
```

#### **Usage Example**

```ts
// In component
import { logger } from "@/utils/logger";

const fetchData = async () => {
  logger.info("Fetching user data", { userId: user.id });

  try {
    const data = await api.getUser(user.id);
    logger.debug("Data fetched successfully", { data });
    return data;
  } catch (error) {
    logger.error("Failed to fetch user", {
      userId: user.id,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};
```

---


---

[← Back to Overview](../README.md)
