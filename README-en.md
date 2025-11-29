# Senior Frontend Developer Interview Preparation

> 🌍 **Language / Ngôn ngữ:** [🇻🇳 Tiếng Việt](./README.md) | [🇬🇧 English](./README-en.md)

Complete knowledge base for **Senior Frontend Developer** interviews, focusing on **Vue 3**, **TypeScript**, and modern ecosystem.

---

## 📚 Document Structure

The documentation is organized into 5 main groups with 19 topics, from basic to advanced:

### I. Core Web Technologies

1. **[JavaScript](./src/en/javascript.md)**

   1.1. [Core Concepts](./src/en/javascript.md#11-core-concepts): [High-order Array Functions](./src/en/javascript.md#111-high-order-array-functions), [Promise/Async-Await](./src/en/javascript.md#112-promise-vs-asyncawait), [Event Loop](./src/en/javascript.md#113-event-loop-microtask-macrotask), [var vs let vs const](./src/en/javascript.md#114-var-vs-let-vs-const)

   1.2. [Advanced](./src/en/javascript.md#12-advanced-concepts): [Closure & Scope](./src/en/javascript.md#121-closure--scope), [Prototypes](./src/en/javascript.md#122-prototypes--inheritance), [`this`](./src/en/javascript.md#123-this-keyword), [ES6+](./src/en/javascript.md#124-es6-modern-features), [Memory Management](./src/en/javascript.md#125-memory-management--garbage-collection), [Hoisting](./src/en/javascript.md#126-hoisting--temporal-dead-zone)

2. **[TypeScript](./src/en/typescript.md)**

   2.1. [Core Concepts](./src/en/typescript.md#21-core-concepts): [Interface vs Type](./src/en/typescript.md#211-interface-vs-type), [Generics](./src/en/typescript.md#212-generics), [Type Narrowing](./src/en/typescript.md#213-type-narrowing)

   2.2. [Advanced Types](./src/en/typescript.md#22-advanced-types): [Utility Types](./src/en/typescript.md#221-utility-types), [Type Guards](./src/en/typescript.md#222-type-guards--predicates), [Mapped Types](./src/en/typescript.md#223-mapped-types), [Conditional Types](./src/en/typescript.md#224-conditional-types), [Template Literals](./src/en/typescript.md#225-template-literal-types)

3. **[CSS Layout](./src/en/css-layout.md)**

   3.1. [Flexbox](./src/en/css-layout.md#31-flexbox) vs [CSS Grid](./src/en/css-layout.md#32-css-grid)

   3.2. [Responsive Design Strategy](./src/en/css-layout.md#34-responsive-design-strategy)

4. **[Browser & Web APIs](./src/en/web-apis.md)**

   4.1. [IndexedDB](./src/en/web-apis.md#41-indexeddb), [Web Workers](./src/en/web-apis.md#42-web-workers), [Service Workers](./src/en/web-apis.md#43-service-workers--pwa)

   4.2. [Intersection Observer](./src/en/web-apis.md#44-intersection-observer), [Modern APIs](./src/en/web-apis.md#45-modern-apis)

---

### II. Vue Ecosystem

5. **[Vue 3](./src/en/vue3.md)**

   5.1. [Core Concepts](./src/en/vue3.md#51-core-concepts): [Virtual DOM](./src/en/vue3.md#511-virtual-dom), [Composition API](./src/en/vue3.md#512-options-api-vs-composition-api), [Reactivity](./src/en/vue3.md#5110-reactivity-setup-computed-watch), [Lifecycle](./src/en/vue3.md#5111-lifecycle-vue-2-vs-vue-3), [Props](./src/en/vue3.md#515-props-passing-data-from-parent-to-child), [Computed](./src/en/vue3.md#516-computed-vs-method), [Watch](./src/en/vue3.md#517-computed-vs-watch)

   5.2. [Advanced Features](./src/en/vue3.md#52-advanced-features): [Teleport](./src/en/vue3.md#521-teleport), [Suspense](./src/en/vue3.md#522-suspense), [Custom Directives](./src/en/vue3.md#523-custom-directives), [Plugins](./src/en/vue3.md#524-plugins), [Render Functions](./src/en/vue3.md#525-render-functions--jsx), [Provide/Inject](./src/en/vue3.md#526-provide--inject)

6. **[Nuxt.js](./src/en/nuxt.md)**

   6.1. [Nuxt vs Vue](./src/en/nuxt.md#62-nuxt-vs-vue)

   6.2. [CSR vs SSR vs SSG vs SPA](./src/en/nuxt.md#63-csr-vs-ssr-vs-ssg-vs-spa)

7. **[State Management](./src/en/state-management.md)**

   7.1. [Vuex vs Pinia](./src/en/state-management.md#71-vuex-vs-pinia)

   7.2. [State Flow](./src/en/state-management.md#72-state-flow), [commit vs dispatch](./src/en/state-management.md#74-vuex-commit-vs-dispatch)

   7.3. [Global vs Local State](./src/en/state-management.md#73-when-to-use-global-vs-local-state)

---

### III. Development Practices

8. **[Testing](./src/en/testing.md)** ⭐

   8.1. [Unit Testing (Vitest)](./src/en/testing.md#81-unit-testing-with-vitest)

   8.2. [Component Testing (Vue Test Utils)](./src/en/testing.md#82-component-testing-with-vue-test-utils)

   8.3. [E2E Testing (Playwright)](./src/en/testing.md#83-e2e-testing-with-playwright)

   8.4. [Test Coverage](./src/en/testing.md#84-test-coverage), [TDD/BDD](./src/en/testing.md#85-tddbdd-methodology)

9. **[Performance & Optimization](./src/en/performance.md)** ⚡

   9.1. [Core Performance](./src/en/performance.md#91-core-performance): [Storage](./src/en/performance.md#911-storage-localstorage-vs-sessionstorage-vs-cookie), [Optimization](./src/en/performance.md#912-performance-optimization), [Code Review](./src/en/performance.md#913-code-review-checklist)

   9.2. [Advanced](./src/en/performance.md#92-advanced-optimization): [Code Splitting](./src/en/performance.md#921-code-splitting-strategies), [Tree Shaking](./src/en/performance.md#922-tree-shaking), [Debounce/Throttle](./src/en/performance.md#923-debounce-vs-throttle), [Image/Font](./src/en/performance.md#924-image--font-optimization)

10. **[Security](./src/en/security.md)** 🔒

    10.1. [Prevent XSS](./src/en/security.md#101-preventing-xss)

    10.2. [Protect Against CSRF](./src/en/security.md#102-protecting-against-csrf)

    10.3. [Authentication Best Practices](./src/en/security.md#103-authentication-best-practices)

    10.4. [Input Validation](./src/en/security.md#104-input-validation-and-sanitization), [HTTPS & CORS](./src/en/security.md#105-https--cors)

11. **[Accessibility (A11y)](./src/en/accessibility.md)** ♿

    11.1. [ARIA Attributes](./src/en/accessibility.md#111-aria-attributes)

    11.2. [Keyboard Navigation](./src/en/accessibility.md#112-keyboard-navigation)

    11.3. [Semantic HTML](./src/en/accessibility.md#113-semantic-html)

    11.4. [WCAG Guidelines](./src/en/accessibility.md#114-wcag-guidelines)

---

### IV. Infrastructure & Tools

12. **[Build Tools](./src/en/build-tools.md)**

    12.1. [Vite vs Webpack](./src/en/build-tools.md#121-vite-vs-webpack)

13. **[Networking](./src/en/networking.md)**

    13.1. [REST vs WebSocket](./src/en/networking.md#131-websocket-vs-rest)

14. **[DevOps](./src/en/devops.md)**

    14.1. [GitOps & ArgoCD Pipeline](./src/en/devops.md#141-gitops--argocd-pipeline)

---

### V. Professional Skills

15. **[Architecture & Design Patterns](./src/en/architecture.md)** 🏗️

    15.1. [Component Patterns](./src/en/architecture.md#151-component-patterns)

    15.2. [Design Patterns](./src/en/architecture.md#152-design-patterns)

    15.3. [SOLID Principles](./src/en/architecture.md#153-solid-principles-in-frontend)

    15.4. [Module Federation & Micro-frontends](./src/en/architecture.md#154-module-federation--micro-frontends)

16. **[System Design](./src/en/system-design.md)**

    16.1. [Frontend Architecture Decisions](./src/en/system-design.md#161-frontend-architecture-decisions)

    16.2. [Caching Strategies](./src/en/system-design.md#162-caching-strategies)

    16.3. [Component Library Design](./src/en/system-design.md#163-component-library-design)

17. **[Leadership & Soft Skills](./src/en/leadership.md)** 👥

    17.1. [Technical Mentorship](./src/en/leadership.md#171-technical-mentorship)

    17.2. [Architecture Decision Records (ADR)](./src/en/leadership.md#172-architecture-decision-records-adr)

    17.3. [Complexity Estimation](./src/en/leadership.md#173-complexity-estimation)

    17.4. [Conflict Resolution](./src/en/leadership.md#174-conflict-resolution)

18. **[Practical Interview Questions](./src/en/practical-questions.md)** 💼

    18.1. [401 Error Handling & Authentication](./src/en/practical-questions.md#181-handling-401-error--redirect-to-login)

    18.2. [Project Management Process](./src/en/practical-questions.md#182-project-management-tools--process)

    18.3. [Bug vs Feature Assessment](./src/en/practical-questions.md#183-assessing-issue-bug-or-feature-request)

    18.4. [Git Workflow](./src/en/practical-questions.md#184-git-workflow)

    18.5. [Resolving Git Conflicts](./src/en/practical-questions.md#185-resolving-git-conflicts)

    18.6. [Squashing Commits](./src/en/practical-questions.md#186-squashing-commits)

19. **[Monitoring & Error Handling](./src/en/monitoring.md)** 📊

    19.1. [Error Tracking (Sentry)](./src/en/monitoring.md#191-error-tracking-with-sentry)

    19.2. [Error Boundaries](./src/en/monitoring.md#192-error-boundaries-in-vue)

    19.3. [Performance Monitoring](./src/en/monitoring.md#193-performance-monitoring)

    19.4. [Logging Strategy](./src/en/monitoring.md#194-logging-strategy)

---

## 📊 Coverage Statistics

- **Main Groups**: 5 groups (Core Web, Vue Ecosystem, Dev Practices, Infrastructure, Professional Skills)
- **Total Topics**: 19 main topics
- **Total Sections**: 100+ sub-topics
- **Code Examples**: 200+ real-world examples
- **Comparison Tables**: 20+ decision matrices
- **Level**: Senior Frontend Developer

---

## 🚀 Technologies Covered

**Core Stack:**

- Vue 3 (Composition API)
- TypeScript
- Nuxt 3
- Pinia / Vuex

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

_Last updated: November 2025_
_Version: 3.0 (New structure - 5 main groups, 19 topics)_

