# Browser & Web APIs

Các Web APIs hiện đại cho tính năng trình duyệt nâng cao.

---

## 4. Browser & Web APIs

## Table of Contents

1. [IndexedDB](#41-indexeddb)

2. [Web Workers](#42-web-workers)

3. [Service Workers & PWA](#43-service-workers--pwa)

4. [Intersection Observer](#44-intersection-observer)

5. [Các API hiện đại khác](#45-các-api-hiện-đại-khác)

---

### 4.1. IndexedDB

**Câu trả lời chuẩn Senior:**

IndexedDB là database trình duyệt để lưu trữ dữ liệu lớn offline.

#### **Khi nào dùng IndexedDB?**

| Use Case       | localStorage | IndexedDB |
| -------------- | ------------ | --------- |
| Lưu < 5MB      | ✅           | ❌        |
| Lưu > 5MB      | ❌           | ✅        |
| Query phức tạp | ❌           | ✅        |
| Offline app    | ❌           | ✅        |
| Binary data    | ❌           | ✅        |

#### **Ví dụ cơ bản:**

```js
// Mở database
const request = indexedDB.open("MyDB", 1);

request.onupgradeneeded = (e) => {
  const db = e.target.result;
  db.createObjectStore("users", { keyPath: "id" });
};

// Thêm dữ liệu
request.onsuccess = (e) => {
  const db = e.target.result;
  const tx = db.transaction("users", "readwrite");
  const store = tx.objectStore("users");

  store.add({ id: 1, name: "Alice" });
};
```

#### **Best Practices:**

- Dùng wrapper library: Dexie.js, localForage
- Sync với backend khi online
- Handle version upgrades cẩn thận

---

### 4.2. Web Workers

**Câu trả lời chuẩn Senior:**

Web Workers chạy JavaScript trên background thread riêng → không block UI.

#### **Khi nào dùng Web Workers?**

✅ **Dùng khi:**

- Heavy computation (parse JSON lớn, xử lý hình ảnh)
- Xử lý data lớn
- Encryption/decryption
- Background sync

❌ **Không dùng khi:**

- Cần thao tác DOM
- Task nhỏ, nhanh
- Cần access `window`, `document`

#### **Ví dụ:**

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

#### **Giới hạn:**

- Không truy cập DOM
- Không dùng `window`, `document`
- Communication qua `postMessage` (có overhead)

---

### 4.3. Service Workers & PWA

**Câu trả lời chuẩn Senior:**

Service Worker là proxy giữa app và network → cache, offline, push notifications.

#### **Lifecycle:**

```
Install → Waiting → Activate → Idle → Fetch → Terminated
```

#### **Strategies:**

| Strategy                   | Use Case                        |
| -------------------------- | ------------------------------- |
| **Cache First**            | Static assets (CSS, JS, images) |
| **Network First**          | API data mới nhất               |
| **Cache Only**             | App shell                       |
| **Network Only**           | Analytics, logs                 |
| **Stale While Revalidate** | Balance speed + freshness       |

#### **PWA Checklist:**

✅ HTTPS
✅ Service Worker đăng ký
✅ `manifest.json` với icons
✅ Responsive design
✅ Offline fallback
✅ Fast load (< 3s)

#### **Ví dụ ngắn:**

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

**Câu trả lời chuẩn Senior:**

API để detect khi element vào/ra viewport → lazy loading, infinite scroll.

#### **Use Cases:**

- ✅ Lazy load images
- ✅ Infinite scroll
- ✅ Analytics (track visibility)
- ✅ Animations khi scroll vào view

#### **Ví dụ Lazy Loading:**

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

### 4.5. Các API hiện đại khác

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

[← Quay lại Tổng quan](../README.md)
