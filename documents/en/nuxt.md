# Nuxt.js

Nuxt.js framework - Vue meta-framework for SSR, SSG, and more.

---

## Table of Contents

1. [What is Nuxt.js?](#61-what-is-nuxtjs)

2. [Nuxt vs Vue](#62-nuxt-vs-vue)

3. [CSR vs SSR vs SSG vs SPA](#63-csr-vs-ssr-vs-ssg-vs-spa)

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


---

[← Back to Overview](../../README-en.md)

