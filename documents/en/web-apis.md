# Browser & Web APIs

Modern Web APIs for advanced browser features.

---

## 4. Browser & Web APIs

## Table of Contents

1. [IndexedDB](#41-indexeddb)

2. [Web Workers](#42-web-workers)

3. [Service Workers & PWA](#43-service-workers--pwa)

4. [Intersection Observer](#44-intersection-observer)

5. [Modern APIs](#45-modern-apis)

---

### 4.1. IndexedDB

**Senior-level Answer:**

IndexedDB is a browser database for storing large amounts of data offline.

#### **When to use IndexedDB?**

| Use Case       | localStorage | IndexedDB |
| -------------- | ------------ | --------- |
| Store < 5MB    | ✅           | ❌        |
| Store > 5MB    | ❌           | ✅        |
| Complex query  | ❌           | ✅        |
| Offline app    | ❌           | ✅        |
| Binary data    | ❌           | ✅        |

#### **Basic Example:**

```js
// Open database
const request = indexedDB.open("MyDB", 1);

request.onupgradeneeded = (e) => {
  const db = e.target.result;
  db.createObjectStore("users", { keyPath: "id" });
};

// Add data
request.onsuccess = (e) => {
  const db = e.target.result;
  const tx = db.transaction("users", "readwrite");
  const store = tx.objectStore("users");

  store.add({ id: 1, name: "Alice" });
};
```

#### **Best Practices:**

- Use wrapper library: Dexie.js, localForage
- Sync with backend when online
- Handle version upgrades carefully

---

### 4.2. Web Workers

**Senior-level Answer:**

Web Workers run JavaScript on a separate background thread → doesn't block UI.

#### **When to use Web Workers?**

✅ **Use when:**

- Heavy computation (parse large JSON, image processing)
- Processing large data
- Encryption/decryption
- Background sync

❌ **Don't use when:**

- Need to manipulate DOM
- Small, fast tasks
- Need access to `window`, `document`

#### **Example:**

```js
// main.js
const worker = new Worker("worker.js");

worker.postMessage({ numbers: [1, 2, 3, 4, 5] });

worker.onmessage = (e) => {
  console.log("Sum:", e.data); // 15
};

// worker.js
self.onmessage = (e) => {
  const sum = e.data.numbers.reduce((a, b) => a + b, 0);
  self.postMessage(sum);
};
```

#### **Limitations:**

- No DOM access
- No `window`, `document`
- Communication via `postMessage` (has overhead)

---

### 4.3. Service Workers & PWA

**Senior-level Answer:**

Service Worker is a proxy between app and network → cache, offline, push notifications.

#### **Lifecycle:**

```
Install → Waiting → Activate → Idle → Fetch → Terminated
```

#### **Strategies:**

| Strategy                   | Use Case                           |
| -------------------------- | ---------------------------------- |
| **Cache First**            | Static assets (CSS, JS, images)    |
| **Network First**          | Latest API data                    |
| **Cache Only**             | App shell                          |
| **Network Only**           | Analytics, logs                    |
| **Stale While Revalidate** | Balance between speed + freshness  |

#### **PWA Checklist:**

✅ HTTPS
✅ Service Worker registered
✅ `manifest.json` with icons
✅ Responsive design
✅ Offline fallback
✅ Fast load (< 3s)

#### **Quick Example:**

```js
// Register
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}

// sw.js - Cache First
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
```

---

### 4.4. Intersection Observer

**Senior-level Answer:**

API to detect when an element enters/exits viewport → lazy loading, infinite scroll.

#### **Use Cases:**

- ✅ Lazy load images
- ✅ Infinite scroll
- ✅ Analytics (track visibility)
- ✅ Animations when scrolling into view

#### **Lazy Loading Example:**

```js
const images = document.querySelectorAll("img[data-src]");

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      imageObserver.unobserve(img);
    }
  });
});

images.forEach((img) => imageObserver.observe(img));
```

#### **Options:**

```js
const options = {
  root: null, // viewport
  rootMargin: "0px", // margin around root
  threshold: 0.5, // 50% visible
};
```

---

### 4.5. Modern APIs

#### **Clipboard API**

```js
// Copy
await navigator.clipboard.writeText("Hello");

// Paste
const text = await navigator.clipboard.readText();
```

#### **Geolocation API**

```js
navigator.geolocation.getCurrentPosition((position) => {
  console.log(position.coords.latitude, position.coords.longitude);
});
```

#### **Notification API**

```js
if (Notification.permission === "granted") {
  new Notification("Hello!", {
    body: "This is a notification",
    icon: "/icon.png",
  });
}
```

#### **ResizeObserver**

```js
const observer = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    console.log("New size:", entry.contentRect);
  });
});

observer.observe(element);
```

#### **MutationObserver**

```js
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    console.log("DOM changed:", mutation.type);
  });
});

observer.observe(element, {
  childList: true,
  attributes: true,
  subtree: true,
});
```

---

[← Back to Overview](../../README-en.md)

