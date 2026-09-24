# Build Tools

Modern build tools for frontend development.

---

## Table of Contents

1. [Vite vs Webpack](#121-vite-vs-webpack)

---

## IV. Infrastructure & Tools

## 12. Build Tools

### 12.1. Vite vs Webpack

#### **1. How they work**

**Webpack:**

- Traditional bundler → must **bundle everything** before running.
- Dev server uses HMR but still based on bundling.
- Slow build for large projects.

**Vite:**

- Based on **ES Modules (ESM)**.
- Dev server **doesn't need bundling** → only loads files when imported.
- Build uses **Rollup** optimized for production.

#### **2. Speed**

- **Vite dev is super fast**: server starts almost instantly, smooth HMR.
- **Webpack dev is slow** for large projects (heavy bundles).
- Build: Vite (Rollup) usually more optimized for modern frontend apps.

#### **3. When to use what?**

**Use Vite when:**

- Vue 3, React, Svelte, TypeScript projects.
- You want dev speed and good DX.
- Modern project using ESM.

**Use Webpack when:**

- Legacy project with many custom loaders.
- Complex build pipeline depends on Webpack ecosystem.
- Need micro-frontend with Module Federation.

---


---

[← Back to Overview](../../README-en.md)

