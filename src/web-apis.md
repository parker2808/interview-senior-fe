# Browser & Web APIs

Modern web APIs for advanced browser features.

---

## Table of Contents

1. [IndexedDB](#1-indexeddb)
2. [Web Workers](#2-web-workers)
3. [Service Workers & PWA](#3-service-workers--pwa)
4. [Intersection Observer](#4-intersection-observer)
5. [Other Modern APIs](#5-other-modern-apis)

---
## 8. Browser & Web APIs

### 8.1. IndexedDB

**Câu trả lời chuẩn Senior:**

IndexedDB là client-side database cho structured data, lớn hơn localStorage (~50MB+).

#### **Basic Usage**

```ts
// Open database
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MyDatabase", 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object store
      if (!db.objectStoreNames.contains("users")) {
        const objectStore = db.createObjectStore("users", { keyPath: "id" });
        objectStore.createIndex("email", "email", { unique: true });
        objectStore.createIndex("name", "name", { unique: false });
      }
    };
  });
};

// Add data
const addUser = async (user: User) => {
  const db = await openDB();
  const transaction = db.transaction(["users"], "readwrite");
  const objectStore = transaction.objectStore("users");
  objectStore.add(user);

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(user);
    transaction.onerror = () => reject(transaction.error);
  });
};

// Get data
const getUser = async (id: number): Promise<User> => {
  const db = await openDB();
  const transaction = db.transaction(["users"], "readonly");
  const objectStore = transaction.objectStore("users");
  const request = objectStore.get(id);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Query by index
const getUserByEmail = async (email: string): Promise<User> => {
  const db = await openDB();
  const transaction = db.transaction(["users"], "readonly");
  const objectStore = transaction.objectStore("users");
  const index = objectStore.index("email");
  const request = index.get(email);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Get all
const getAllUsers = async (): Promise<User[]> => {
  const db = await openDB();
  const transaction = db.transaction(["users"], "readonly");
  const objectStore = transaction.objectStore("users");
  const request = objectStore.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
```

#### **Using idb Library (Wrapper)**

```bash
npm install idb
```

```ts
import { openDB } from "idb";

const dbPromise = openDB("MyDatabase", 1, {
  upgrade(db) {
    const store = db.createObjectStore("users", { keyPath: "id" });
    store.createIndex("email", "email", { unique: true });
  },
});

// Add
await (
  await dbPromise
).add("users", { id: 1, name: "Alice", email: "alice@example.com" });

// Get
const user = await (await dbPromise).get("users", 1);

// Get all
const users = await (await dbPromise).getAll("users");

// Get by index
const user = await (
  await dbPromise
).getFromIndex("users", "email", "alice@example.com");

// Delete
await (await dbPromise).delete("users", 1);
```

---

### 8.2. Web Workers

**Câu trả lời chuẩn Senior:**

Web Workers cho phép chạy JavaScript trên background thread, không block UI.

#### **Creating a Worker**

```ts
// worker.ts
self.onmessage = (e: MessageEvent) => {
  const { type, data } = e.data;

  if (type === "HEAVY_CALCULATION") {
    // Perform heavy calculation
    const result = performCalculation(data);
    self.postMessage({ type: "RESULT", result });
  }
};

function performCalculation(data: number[]): number {
  // Simulate heavy work
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += data.reduce((a, b) => a + b, 0);
  }
  return sum;
}
```

#### **Using Worker in Component**

```vue
<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const result = ref(null);
const worker = ref(null);

onMounted(() => {
  // Create worker
  worker.value = new Worker(new URL("./worker.ts", import.meta.url), {
    type: "module",
  });

  // Listen for messages
  worker.value.onmessage = (e) => {
    if (e.data.type === "RESULT") {
      result.value = e.data.result;
    }
  };

  worker.value.onerror = (error) => {
    console.error("Worker error:", error);
  };
});

onUnmounted(() => {
  // Terminate worker
  worker.value?.terminate();
});

const startCalculation = () => {
  worker.value?.postMessage({
    type: "HEAVY_CALCULATION",
    data: [1, 2, 3, 4, 5],
  });
};
</script>

<template>
  <div>
    <button @click="startCalculation">Start Calculation</button>
    <p v-if="result">Result: {{ result }}</p>
  </div>
</template>
```

#### **Comlink Library (Easier API)**

```bash
npm install comlink
```

```ts
// worker.ts
import { expose } from "comlink";

const api = {
  async heavyCalculation(data: number[]) {
    // Perform calculation
    return result;
  },
};

expose(api);

// main.ts
import { wrap } from "comlink";

const worker = new Worker(new URL("./worker.ts", import.meta.url), {
  type: "module",
});

const api = wrap(worker);

// Call worker method like normal async function
const result = await api.heavyCalculation([1, 2, 3]);
```

---

### 8.3. Service Workers & PWA

**Câu trả lời chuẩn Senior:**

Service Workers enable offline-first apps và caching strategies.

#### **Register Service Worker**

```ts
// main.ts
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered:", registration);
      })
      .catch((error) => {
        console.log("SW registration failed:", error);
      });
  });
}
```

#### **Service Worker File**

```ts
// sw.js
const CACHE_NAME = "my-app-v1";
const urlsToCache = ["/", "/index.html", "/styles/main.css", "/scripts/app.js"];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // Clone request
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then((response) => {
        // Check if valid response
        if (!response || response.status !== 200) {
          return response;
        }

        // Clone response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Activate event (cleanup old caches)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

#### **Caching Strategies**

**1. Cache First**

```ts
// Good for: Static assets
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

**2. Network First**

```ts
// Good for: Dynamic content
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
```

**3. Stale While Revalidate**

```ts
// Good for: Frequently updated content
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
```

#### **PWA Manifest**

```json
// public/manifest.json
{
  "name": "My Progressive Web App",
  "short_name": "MyPWA",
  "description": "A progressive web application",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#007bff",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

```html
<!-- index.html -->
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#007bff" />
```

#### **Vite PWA Plugin**

```bash
npm install -D vite-plugin-pwa
```

```ts
// vite.config.ts
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "My App",
        short_name: "App",
        theme_color: "#007bff",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
});
```

---

### 8.4. Intersection Observer

**Câu trả lời chuẩn Senior:**

Intersection Observer API detects khi element vào/ra viewport.

#### **Basic Usage**

```vue
<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const target = ref(null);
const isVisible = ref(false);
let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible.value = entry.isIntersecting;
      });
    },
    {
      root: null, // viewport
      rootMargin: "0px",
      threshold: 0.5, // 50% visible
    }
  );

  if (target.value) {
    observer.observe(target.value);
  }
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <div ref="target" :class="{ visible: isVisible }">
    <p>I'm {{ isVisible ? "visible" : "hidden" }}</p>
  </div>
</template>
```

#### **Lazy Load Images**

```vue
<script setup>
import { ref, onMounted } from "vue";

const images = ref([]);

onMounted(() => {
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add("loaded");
          imageObserver.unobserve(img);
        }
      });
    },
    { rootMargin: "50px" }
  );

  images.value.forEach((img) => imageObserver.observe(img));
});
</script>

<template>
  <img
    v-for="url in imageUrls"
    :key="url"
    ref="images"
    :data-src="url"
    src="placeholder.jpg"
  />
</template>
```

#### **Infinite Scroll**

```vue
<script setup>
import { ref, onMounted } from "vue";

const items = ref([...Array(20)].map((_, i) => `Item ${i + 1}`));
const loader = ref(null);
const loading = ref(false);

const loadMore = async () => {
  if (loading.value) return;

  loading.value = true;
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const start = items.value.length;
  items.value.push(...[...Array(20)].map((_, i) => `Item ${start + i + 1}`));
  loading.value = false;
};

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    },
    { threshold: 1.0 }
  );

  if (loader.value) {
    observer.observe(loader.value);
  }
});
</script>

<template>
  <div>
    <div v-for="item in items" :key="item">{{ item }}</div>
    <div ref="loader" class="loader">
      <span v-if="loading">Loading...</span>
    </div>
  </div>
</template>
```

---

### 8.5. Other Modern APIs

#### **Geolocation API**

```ts
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log(`Lat: ${latitude}, Lon: ${longitude}`);
    },
    (error) => {
      console.error("Error:", error.message);
    }
  );
}
```

#### **Clipboard API**

```ts
// Copy
await navigator.clipboard.writeText("Hello World");

// Paste
const text = await navigator.clipboard.readText();
```

#### **Notification API**

```ts
if ("Notification" in window) {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    new Notification("Hello!", {
      body: "This is a notification",
      icon: "/icon.png",
    });
  }
}
```

#### **Resize Observer**

```vue
<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const element = ref(null);
const dimensions = ref({ width: 0, height: 0 });
let observer = null;

onMounted(() => {
  observer = new ResizeObserver((entries) => {
    const { width, height } = entries[0].contentRect;
    dimensions.value = { width, height };
  });

  if (element.value) {
    observer.observe(element.value);
  }
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <div ref="element">
    <p>Width: {{ dimensions.width }}px</p>
    <p>Height: {{ dimensions.height }}px</p>
  </div>
</template>
```

---


---

[← Back to Overview](../README.md)
