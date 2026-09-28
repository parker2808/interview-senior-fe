# Senior Frontend Developer Interview Preparation

> 🌍 **Language / Ngôn ngữ:** [🇻🇳 Tiếng Việt](./README.md) | [🇬🇧 English](./README-en.md)

Complete knowledge base for **Senior Frontend Developer** interviews, focusing on **Vue 3**, **TypeScript**, and modern ecosystem.

---

## 🗓️ 30-day study plan

Content track: [`modules/study-plan-30-days/`](./modules/study-plan-30-days/) · UI: [`src/modules/study-plan/`](./src/modules/study-plan/) · Route: `/plan`

- **Live / Demo:** https://parker-interview-senior-fe.vercel.app/
- **Stack:** Nuxt 3 + TypeScript + Tailwind — see [STRUCTURE.md](./STRUCTURE.md)
- **Hub:** `/` · **Knowledge Base:** `/docs/:lang/:slug` · **Plan:** `/plan`

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

Progress: default **View** mode; unlock **Edit** with a 6-digit passcode via `POST /api/auth/edit` (env `EDIT_PASSCODE`). Cloud: Nitro + **private** Blob (`GET/PUT /api/progress`).

---

## 📁 Repo layout

```
STRUCTURE.md                    # UI module conventions (src/modules)
nuxt.config.ts · app.vue
pages/                          # thin routes
src/modules/{hub,knowledge-base,study-plan,core}/
documents/                      # shared KB vi|en
modules/study-plan-30-days/content/
server/api/                     # progress + edit auth
i18n/locales/
```

Add a UI module: [STRUCTURE.md](./STRUCTURE.md). Content tracks: [`modules/README.md`](./modules/README.md).

---

## 📚 Document Structure

The documentation is organized into 6 main groups with 22 topics, from basic to advanced:

### I. Core Web Technologies

1. **[JavaScript](./documents/en/javascript.md)**

   1.1. [Core Concepts](./documents/en/javascript.md#11-core-concepts): [High-order Array Functions](./documents/en/javascript.md#111-high-order-array-functions), [Promise/Async-Await](./documents/en/javascript.md#112-promise-vs-asyncawait), [Event Loop](./documents/en/javascript.md#113-event-loop-microtask-macrotask), [var vs let vs const](./documents/en/javascript.md#114-var-vs-let-vs-const)

   1.2. [Advanced](./documents/en/javascript.md#12-advanced-concepts): [Closure & Scope](./documents/en/javascript.md#121-closure--scope), [Prototypes](./documents/en/javascript.md#122-prototypes--inheritance), [`this`](./documents/en/javascript.md#123-this-keyword), [ES6+](./documents/en/javascript.md#124-es6-modern-features), [Memory Management](./documents/en/javascript.md#125-memory-management--garbage-collection), [Hoisting](./documents/en/javascript.md#126-hoisting--temporal-dead-zone)

2. **[TypeScript](./documents/en/typescript.md)**

   2.1. [Core Concepts](./documents/en/typescript.md#21-core-concepts): [Interface vs Type](./documents/en/typescript.md#211-interface-vs-type), [Generics](./documents/en/typescript.md#212-generics), [Type Narrowing](./documents/en/typescript.md#213-type-narrowing)

   2.2. [Advanced Types](./documents/en/typescript.md#22-advanced-types): [Utility Types](./documents/en/typescript.md#221-utility-types), [Type Guards](./documents/en/typescript.md#222-type-guards--predicates), [Mapped Types](./documents/en/typescript.md#223-mapped-types), [Conditional Types](./documents/en/typescript.md#224-conditional-types), [Template Literals](./documents/en/typescript.md#225-template-literal-types)

3. **[CSS Layout](./documents/en/css-layout.md)**

   3.1. [Flexbox](./documents/en/css-layout.md#31-flexbox) vs [CSS Grid](./documents/en/css-layout.md#32-css-grid)

   3.2. [Responsive Design Strategy](./documents/en/css-layout.md#34-responsive-design-strategy)

4. **[Browser & Web APIs](./documents/en/web-apis.md)**

   4.1. [IndexedDB](./documents/en/web-apis.md#41-indexeddb), [Web Workers](./documents/en/web-apis.md#42-web-workers), [Service Workers](./documents/en/web-apis.md#43-service-workers--pwa)

   4.2. [Intersection Observer](./documents/en/web-apis.md#44-intersection-observer), [Modern APIs](./documents/en/web-apis.md#45-modern-apis)

---

### II. Vue Ecosystem

5. **[Vue 3](./documents/en/vue3.md)**

   5.1. [Core Concepts](./documents/en/vue3.md#51-core-concepts): [Virtual DOM](./documents/en/vue3.md#511-virtual-dom), [Composition API](./documents/en/vue3.md#512-options-api-vs-composition-api), [Reactivity](./documents/en/vue3.md#5110-reactivity-setup-computed-watch), [Lifecycle](./documents/en/vue3.md#5111-lifecycle-vue-2-vs-vue-3), [Props](./documents/en/vue3.md#515-props-passing-data-from-parent-to-child), [Computed](./documents/en/vue3.md#516-computed-vs-method), [Watch](./documents/en/vue3.md#517-computed-vs-watch)

   5.2. [Advanced Features](./documents/en/vue3.md#52-advanced-features): [Teleport](./documents/en/vue3.md#521-teleport), [Suspense](./documents/en/vue3.md#522-suspense), [Custom Directives](./documents/en/vue3.md#523-custom-directives), [Plugins](./documents/en/vue3.md#524-plugins), [Render Functions](./documents/en/vue3.md#525-render-functions--jsx), [Provide/Inject](./documents/en/vue3.md#526-provide--inject)

6. **[Nuxt.js](./documents/en/nuxt.md)**

   6.1. [Nuxt vs Vue](./documents/en/nuxt.md#62-nuxt-vs-vue)

   6.2. [CSR vs SSR vs SSG vs SPA](./documents/en/nuxt.md#63-csr-vs-ssr-vs-ssg-vs-spa)

7. **[State Management](./documents/en/state-management.md)**

   7.1. [Vuex vs Pinia](./documents/en/state-management.md#71-vuex-vs-pinia)

   7.2. [State Flow](./documents/en/state-management.md#72-state-flow), [commit vs dispatch](./documents/en/state-management.md#74-vuex-commit-vs-dispatch)

   7.3. [Global vs Local State](./documents/en/state-management.md#73-when-to-use-global-vs-local-state)

---

### III. React Ecosystem

8. **[React](./documents/en/react.md)**

   8.1. [Core Concepts](./documents/en/react.md#201-core-concepts): [Virtual DOM](./documents/en/react.md#2011-virtual-dom--reconciliation), [Hooks](./documents/en/react.md#2012-class-components-vs-function-components--hooks), [JSX](./documents/en/react.md#2013-jsx--rendering-model), [Props/State](./documents/en/react.md#2014-props-vs-state), [`useEffect`](./documents/en/react.md#2017-effects-useeffect-vs-vue-watch--lifecycle), [`useMemo`](./documents/en/react.md#2018-derived-values-usememo-vs-vue-computed)

   8.2. [Advanced](./documents/en/react.md#202-advanced-features): [Context](./documents/en/react.md#2021-context-vs-vue-provide--inject), [Portals](./documents/en/react.md#2022-portals-vs-vue-teleport), [Suspense](./documents/en/react.md#2023-suspense), [Error Boundaries](./documents/en/react.md#2024-error-boundaries), [Custom Hooks](./documents/en/react.md#2025-custom-hooks-vs-vue-composables)

9. **[Next.js](./documents/en/nextjs.md)**

   9.1. [Next vs React](./documents/en/nextjs.md#212-nextjs-vs-react), [Nuxt ↔ Next](./documents/en/nextjs.md#213-nuxt--next-mental-map)

   9.2. [CSR/SSR/SSG/RSC](./documents/en/nextjs.md#214-csr-vs-ssr-vs-ssg-vs-spa-and-rsc), [App Router](./documents/en/nextjs.md#215-app-router-fundamentals)

10. **[State Management (React)](./documents/en/state-management-react.md)**

    10.1. [Layers of state](./documents/en/state-management-react.md#221-layers-of-state), [RTK vs Zustand vs Jotai](./documents/en/state-management-react.md#222-redux-toolkit-vs-zustand-vs-jotai)

    10.2. [Server state (Query/SWR)](./documents/en/state-management-react.md#225-server-state-tanstack-query--swr), [Next patterns](./documents/en/state-management-react.md#226-nextjs-state-patterns)

    10.3. [Vuex/Pinia → React](./documents/en/state-management-react.md#227-vuex--pinia--react-map)

---

### IV. Development Practices

11. **[Testing](./documents/en/testing.md)** ⭐

    11.1. [Unit Testing (Vitest)](./documents/en/testing.md#81-unit-testing-with-vitest)

    11.2. [Component Testing (Vue Test Utils)](./documents/en/testing.md#82-component-testing-with-vue-test-utils)

    11.3. [E2E Testing (Playwright)](./documents/en/testing.md#83-e2e-testing-with-playwright)

    11.4. [Test Coverage](./documents/en/testing.md#84-test-coverage), [TDD/BDD](./documents/en/testing.md#85-tddbdd-methodology)

12. **[Performance & Optimization](./documents/en/performance.md)** ⚡

    12.1. [Core Performance](./documents/en/performance.md#91-core-performance): [Storage](./documents/en/performance.md#911-storage-localstorage-vs-sessionstorage-vs-cookie), [Optimization](./documents/en/performance.md#912-performance-optimization), [Code Review](./documents/en/performance.md#913-code-review-checklist)

    12.2. [Advanced](./documents/en/performance.md#92-advanced-optimization): [Code Splitting](./documents/en/performance.md#921-code-splitting-strategies), [Tree Shaking](./documents/en/performance.md#922-tree-shaking), [Debounce/Throttle](./documents/en/performance.md#923-debounce-vs-throttle), [Image/Font](./documents/en/performance.md#924-image--font-optimization)

13. **[Security](./documents/en/security.md)** 🔒

    13.1. [Prevent XSS](./documents/en/security.md#101-preventing-xss)

    13.2. [Protect Against CSRF](./documents/en/security.md#102-protecting-against-csrf)

    13.3. [Authentication Best Practices](./documents/en/security.md#103-authentication-best-practices)

    13.4. [Input Validation](./documents/en/security.md#104-input-validation-and-sanitization), [HTTPS & CORS](./documents/en/security.md#105-https--cors)

14. **[Accessibility (A11y)](./documents/en/accessibility.md)** ♿

    14.1. [ARIA Attributes](./documents/en/accessibility.md#111-aria-attributes)

    14.2. [Keyboard Navigation](./documents/en/accessibility.md#112-keyboard-navigation)

    14.3. [Semantic HTML](./documents/en/accessibility.md#113-semantic-html)

    14.4. [WCAG Guidelines](./documents/en/accessibility.md#114-wcag-guidelines)

---

### V. Infrastructure & Tools

15. **[Build Tools](./documents/en/build-tools.md)**

    15.1. [Vite vs Webpack](./documents/en/build-tools.md#121-vite-vs-webpack)

16. **[Networking](./documents/en/networking.md)**

    16.1. [REST vs WebSocket](./documents/en/networking.md#131-websocket-vs-rest)

17. **[DevOps](./documents/en/devops.md)**

    17.1. [GitOps & ArgoCD Pipeline](./documents/en/devops.md#141-gitops--argocd-pipeline)

---

### VI. Professional Skills

18. **[Architecture & Design Patterns](./documents/en/architecture.md)** 🏗️

    18.1. [Component Patterns](./documents/en/architecture.md#151-component-patterns)

    18.2. [Design Patterns](./documents/en/architecture.md#152-design-patterns)

    18.3. [SOLID Principles](./documents/en/architecture.md#153-solid-principles-in-frontend)

    18.4. [Module Federation & Micro-frontends](./documents/en/architecture.md#154-module-federation--micro-frontends)

19. **[System Design](./documents/en/system-design.md)**

    19.1. [Frontend Architecture Decisions](./documents/en/system-design.md#161-frontend-architecture-decisions)

    19.2. [Caching Strategies](./documents/en/system-design.md#162-caching-strategies)

    19.3. [Component Library Design](./documents/en/system-design.md#163-component-library-design)

20. **[Leadership & Soft Skills](./documents/en/leadership.md)** 👥

    20.1. [Technical Mentorship](./documents/en/leadership.md#171-technical-mentorship)

    20.2. [Architecture Decision Records (ADR)](./documents/en/leadership.md#172-architecture-decision-records-adr)

    20.3. [Complexity Estimation](./documents/en/leadership.md#173-complexity-estimation)

    20.4. [Conflict Resolution](./documents/en/leadership.md#174-conflict-resolution)

21. **[Practical Interview Questions](./documents/en/practical-questions.md)** 💼

    21.1. [401 Error Handling & Authentication](./documents/en/practical-questions.md#181-handling-401-error--redirect-to-login)

    21.2. [Project Management Process](./documents/en/practical-questions.md#182-project-management-tools--process)

    21.3. [Bug vs Feature Assessment](./documents/en/practical-questions.md#183-assessing-issue-bug-or-feature-request)

    21.4. [Git Workflow](./documents/en/practical-questions.md#184-git-workflow)

    21.5. [Resolving Git Conflicts](./documents/en/practical-questions.md#185-resolving-git-conflicts)

    21.6. [Squashing Commits](./documents/en/practical-questions.md#186-squashing-commits)

22. **[Monitoring & Error Handling](./documents/en/monitoring.md)** 📊

    22.1. [Error Tracking (Sentry)](./documents/en/monitoring.md#191-error-tracking-with-sentry)

    22.2. [Error Boundaries](./documents/en/monitoring.md#192-error-boundaries-in-vue)

    22.3. [Performance Monitoring](./documents/en/monitoring.md#193-performance-monitoring)

    22.4. [Logging Strategy](./documents/en/monitoring.md#194-logging-strategy)

---

## 📊 Coverage Statistics

- **Main Groups**: 6 groups (Core Web, Vue Ecosystem, React Ecosystem, Dev Practices, Infrastructure, Professional Skills)
- **Total Topics**: 22 main topics
- **Total Sections**: 100+ sub-topics
- **Code Examples**: 200+ real-world examples
- **Comparison Tables**: 20+ decision matrices
- **Level**: Senior Frontend Developer

---

## 🚀 Technologies Covered

**Core Stack:**

- Vue 3 (Composition API) / React (Hooks)
- TypeScript
- Nuxt 3 / Next.js (App Router)
- Pinia / Vuex · Redux / Zustand / Jotai

**Build Tools:**

- Vite
- Webpack

**Testing:**

- Vitest
- Vue Test Utils
- Playwright

**Others:**

- Modern CSS (Flexbox, Grid)
- Web APIs
- Performance Optimization
- Security Best Practices

---

## 🤝 Contributing

This documentation is built on real-world experience and modern best practices. If you'd like to contribute:

1. Create an issue with suggestions
2. Submit a PR with improvements
3. Share real-world case studies
4. Report outdated information

---

## ⚖️ License

This documentation is free for personal interview preparation. Please credit the source when sharing publicly.

---

## 📞 Feedback

If you find this documentation helpful:

- ⭐ Star this repo
- 📢 Share with colleagues
- 💬 Provide feedback for improvements

---

**Good luck with your Senior Frontend Developer interview! 🚀**

_Last updated: September 2026_
_Version: 3.2 (State Management React — 6 main groups, 22 topics)_

