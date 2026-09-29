# Nuxt.js

Nuxt.js framework - Vue meta-framework for SSR, SSG, and more.

---

## Table of Contents

1. [What is Nuxt.js?](#61-what-is-nuxtjs)

2. [Nuxt vs Vue](#62-nuxt-vs-vue)

3. [CSR vs SSR vs SSG vs SPA](#63-csr-vs-ssr-vs-ssg-vs-spa)

4. [Middleware](#64-middleware)

---

## 6. Nuxt.js

### 6.1. What is Nuxt.js?

Nuxt.js là **framework xây dựng trên Vue** giúp phát triển **SSR, SSG, CSR, SPA** dễ dàng với cấu trúc chuẩn và hệ sinh thái mạnh.

**Điểm mạnh chính:**

- **File-based routing** → tự tạo routes theo thư mục `pages/`.
- **Hỗ trợ SSR/SSG** → SEO tốt, TTFB nhanh.
- **Kết hợp tốt với Pinia/Vuex**.
- **Module system** mạnh (auth, image, i18n…).
- **Auto code-splitting**, tối ưu bundle sẵn.
- **Server engine Nitro** tối ưu backend API + deploy đa môi trường.

**Tóm gọn:** _Nuxt = Vue + Routing + SSR/SSG + Structure chuẩn + Tối ưu performance._

---

### 6.2. Nuxt vs Vue

| Tiêu chí          | Vue                               | Nuxt                                                      |
| ----------------- | --------------------------------- | --------------------------------------------------------- |
| **Rendering**     | Chỉ CSR                           | CSR + SSR + SSG + Hybrid                                  |
| **Routing**       | Tự cấu hình `vue-router` thủ công | File-based routing (auto-generated)                       |
| **SEO**           | CSR → SEO kém                     | SSR + meta tags → SEO mạnh                                |
| **Structure**     | Không có cấu trúc chuẩn           | Chuẩn sẵn: `pages/`, `layouts/`, `middleware/`, `server/` |
| **State Mgmt**    | Tự setup Pinia/Vuex               | Auto inject + hỗ trợ tốt                                  |
| **Data Fetching** | Tự gọi API                        | `useFetch`, `useAsyncData`, SSR cache                     |
| **Performance**   | Render hoàn toàn client           | Server rendering → FCP tốt, code-splitting tự động        |

**Tóm gọn:** _Vue: linh hoạt. Nuxt: framework hoàn chỉnh, cấu trúc chuẩn, SEO tốt, tối ưu sẵn._

---

### 6.3. CSR vs SSR vs SSG vs SPA

#### **1. CSR – Client-Side Rendering**

- Trình duyệt tải HTML rỗng + JS, JS render toàn bộ UI.
- **Ưu:** trải nghiệm mượt, phù hợp SPA, dễ deploy CDN.
- **Nhược:** SEO kém, FCP chậm nếu JS nặng.

#### **2. SSR – Server-Side Rendering**

- Server render sẵn HTML rồi hydrate trên client.
- **Ưu:** SEO tốt, TTFB nhanh, FCP tốt.
- **Nhược:** tốn tài nguyên server khi traffic lớn.

#### **3. SSG – Static Site Generation**

- Build trước HTML tĩnh, deploy CDN.
- **Ưu:** cực nhanh, SEO tốt, chi phí thấp.
- **Nhược:** không phù hợp dữ liệu thay đổi liên tục.

#### **4. SPA – Single Page Application**

- App tải 1 lần, chuyển trang không reload.
- **Ưu:** UX mượt, trải nghiệm giống native app.
- **Nhược:** SEO kém + bundle có thể lớn.

**Tóm gọn:**

- **CSR**: web app thuần client.
- **SSR**: SEO + tốc độ, dynamic content.
- **SSG**: web tĩnh siêu nhanh (blog, docs, landing page).
- **SPA**: UX mượt nhưng cần tối ưu thêm.

---

### 6.4. Middleware

**Senior-level Answer:**

Nuxt middleware là hàm chạy **trước khi render một route** — dùng cho auth, redirect, A/B, feature flag, set headers/context. Tương đương Vue Router guards, nhưng có convention file + chạy được trong context SSR.

#### **Ba loại**

| Loại | Cách khai báo | Phạm vi |
|---|---|---|
| **Global** | `middleware/auth.global.ts` (hậu tố `.global`) | Mọi navigation |
| **Named** | `middleware/admin.ts` | Gắn qua `definePageMeta({ middleware: 'admin' })` |
| **Inline / route** | trong `definePageMeta({ middleware: [...] })` | Chỉ page đó |

Thứ tự: **global → named/route (theo mảng)** → render page.

#### **Ví dụ auth + role**

```ts
// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useAuth() // composable của bạn / module auth

  if (to.path.startsWith('/login')) return

  if (!loggedIn.value) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (to.meta.roles) {
    const roles = to.meta.roles as string[]
    if (!roles.some((r) => user.value?.roles?.includes(r))) {
      return abortNavigation(
        createError({ statusCode: 403, statusMessage: 'Forbidden' }),
      )
    }
  }
})
```

```vue
<!-- pages/admin/index.vue -->
<script setup lang="ts">
definePageMeta({
  middleware: ['admin'], // named, sau global
  roles: ['admin'],
})
</script>
```

#### **API quan trọng**

| Helper | Việc |
|---|---|
| `navigateTo(path)` | Redirect (có thể external) |
| `abortNavigation()` / `abortNavigation(error)` | Hủy navigation (kèm lỗi) |
| `defineNuxtRouteMiddleware` | Khai báo typed middleware |
| `definePageMeta({ middleware })` | Gắn middleware cho page |

#### **SSR vs client — điểm hay hỏi phỏng vấn**

1. Middleware có thể chạy trên **server** (SSR request đầu) **và** **client** (client navigation).
2. Đừng assume `window` / `localStorage` luôn có — đọc cookie/header hoặc state đã hydrate.
3. Tránh side-effect không idempotent (ghi analytics “page view”) trong middleware nếu chạy 2 lần (server + client) mà không phân biệt.
4. Logic nặng / DB query → **server API / `server/middleware`** (Nitro), không nhồi vào route middleware UI.
5. Authorization thật vẫn ở **backend**; middleware FE chỉ gate UX + giảm lộ UI.

#### **Route middleware vs Nitro `server/middleware`**

| | Route middleware (`middleware/`) | Nitro server middleware |
|---|---|---|
| Chạy khi | Navigate tới page Nuxt | Mọi (hoặc matcher) HTTP request |
| Mục đích | Auth UI, redirect page | CORS, logging, auth API, rate limit |
| Context | `to` / `from` route | `event` Node/H3 |

**Interview one-liner:** _Nuxt middleware = navigation gate (SSR-aware). Vue Router guards = cùng ý trên SPA. Next `middleware.ts` ≈ edge gate trước response — map gần nhất với Nuxt middleware + một phần Nitro._

---

[← Back to Overview](../README.md)
