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

Nuxt.js is a **framework built on Vue** that makes **SSR, SSG, CSR, SPA** development easy with standard structure and strong ecosystem.

**Main strengths:**

- **File-based routing** → auto-creates routes from `pages/` folder.
- **SSR/SSG support** → good SEO, fast TTFB.
- **Works well with Pinia/Vuex**.
- **Strong module system** (auth, image, i18n…).
- **Auto code-splitting**, optimized bundles out of the box.
- **Nitro server engine** optimized for backend API + multi-environment deploy.

**In short:** _Nuxt = Vue + Routing + SSR/SSG + Standard Structure + Performance Optimized._

---

### 6.2. Nuxt vs Vue

| Feature           | Vue                                 | Nuxt                                                   |
| ----------------- | ----------------------------------- | ------------------------------------------------------ |
| **Rendering**     | CSR only                            | CSR + SSR + SSG + Hybrid                               |
| **Routing**       | Manual `vue-router` setup           | File-based routing (auto-generated)                    |
| **SEO**           | CSR → weak SEO                      | SSR + meta tags → strong SEO                           |
| **Structure**     | No standard structure               | Ready: `pages/`, `layouts/`, `middleware/`, `server/`  |
| **State Mgmt**    | Manual setup Pinia/Vuex             | Auto inject + good support                             |
| **Data Fetching** | Manual API calls                    | `useFetch`, `useAsyncData`, SSR cache                  |
| **Performance**   | Fully client-side rendering         | Server rendering → good FCP, auto code-splitting       |

**In short:** _Vue: flexible. Nuxt: complete framework, standard structure, good SEO, optimized by default._

---

### 6.3. CSR vs SSR vs SSG vs SPA

#### **1. CSR – Client-Side Rendering**

- Browser loads empty HTML + JS, JS renders all UI.
- **Pros:** smooth experience, good for SPA, easy CDN deploy.
- **Cons:** weak SEO, slow FCP if JS is heavy.

#### **2. SSR – Server-Side Rendering**

- Server renders HTML first, then hydrates on client.
- **Pros:** good SEO, fast TTFB, good FCP.
- **Cons:** uses server resources with high traffic.

#### **3. SSG – Static Site Generation**

- Pre-builds static HTML, deploys to CDN.
- **Pros:** super fast, good SEO, low cost.
- **Cons:** not suitable for frequently changing data.

#### **4. SPA – Single Page Application**

- App loads once, page changes without reload.
- **Pros:** smooth UX, native app-like experience.
- **Cons:** weak SEO + bundle can be large.

**In short:**

- **CSR**: pure client-side web app.
- **SSR**: SEO + speed, dynamic content.
- **SSG**: super fast static sites (blogs, docs, landing pages).
- **SPA**: smooth UX but needs extra optimization.

---

### 6.4. Middleware

**Senior-level Answer:**

Nuxt middleware runs **before a route is rendered** — auth, redirects, A/B, feature flags, headers/context. Same job as Vue Router guards, with file conventions and SSR-aware execution.

#### **Three kinds**

| Kind | Declaration | Scope |
|---|---|---|
| **Global** | `middleware/auth.global.ts` (`.global` suffix) | Every navigation |
| **Named** | `middleware/admin.ts` | Via `definePageMeta({ middleware: 'admin' })` |
| **Inline / route** | inside `definePageMeta({ middleware: [...] })` | That page only |

Order: **global → named/route (array order)** → render page.

#### **Auth + role example**

```ts
// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useAuth() // your composable / auth module

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
  middleware: ['admin'], // named, after globals
  roles: ['admin'],
})
</script>
```

#### **Key helpers**

| Helper | Purpose |
|---|---|
| `navigateTo(path)` | Redirect (can be external) |
| `abortNavigation()` / `abortNavigation(error)` | Cancel navigation (optionally with error) |
| `defineNuxtRouteMiddleware` | Typed middleware declaration |
| `definePageMeta({ middleware })` | Attach middleware to a page |

#### **SSR vs client — common interview points**

1. Middleware may run on the **server** (first SSR request) **and** on the **client** (client navigations).
2. Don’t assume `window` / `localStorage` — prefer cookies/headers or already-hydrated state.
3. Avoid non-idempotent side effects (analytics “page view”) unless you branch on server vs client.
4. Heavy / DB work belongs in **API / Nitro `server/middleware`**, not UI route middleware.
5. Real authorization stays on the **backend**; FE middleware is UX gating + defense in depth.

#### **Route middleware vs Nitro `server/middleware`**

| | Route middleware (`middleware/`) | Nitro server middleware |
|---|---|---|
| Runs on | Navigating to a Nuxt page | Matching HTTP requests |
| Purpose | Auth UI, page redirects | CORS, logging, API auth, rate limit |
| Context | `to` / `from` routes | H3 `event` |

**Interview one-liner:** _Nuxt middleware = SSR-aware navigation gate. Vue Router guards = SPA equivalent. Next `middleware.ts` ≈ edge gate before the response — closest map to Nuxt middleware plus some Nitro concerns._

---

[← Back to Overview](../../README-en.md)

