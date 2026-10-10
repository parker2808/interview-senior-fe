# Tài Liệu Chuẩn Bị Phỏng Vấn Senior Frontend

> 🌍 **Language / Ngôn ngữ:** [🇬🇧 English](./README.md) | [🇻🇳 Tiếng Việt](./README-vi.md)

Tài liệu ôn **phỏng vấn Senior Frontend Developer** — **Vue 3**, **TypeScript**, và hệ sinh thái hiện đại. Viết cho **vòng live** (tradeoff, failure mode, cách ship production), không phải giáo trình.

---

## 🗓️ Kế hoạch ôn 30 ngày

Module content: [`modules/study-plan-30-days/`](./modules/study-plan-30-days/) · UI: [`src/modules/study-plan/`](./src/modules/study-plan/) · Route: `/plan`

- **Live / Demo:** https://parker-interview-senior-fe.vercel.app/
- **Stack:** Nuxt 3 + TypeScript + Tailwind — xem [STRUCTURE.md](./STRUCTURE.md)
- **Hub:** `/` · **Knowledge Base:** `/docs/:lang/:slug` · **Plan:** `/plan`

Nội dung KB / plan / Q&A nằm ở repo private [`parker2808/interview-fe-data`](https://github.com/parker2808/interview-fe-data) và được kéo **lúc build** (`CONTENT_REPO_TOKEN` hoặc `CONTENT_LOCAL_PATH`). App public không còn bundle markdown/Q&A.

```bash
npm install
CONTENT_LOCAL_PATH=/path/to/interview-fe-data npm run dev
CONTENT_LOCAL_PATH=/path/to/interview-fe-data npm run build
```

Tiến độ: mặc định **chế độ Xem**; mở **chế độ Sửa** bằng mã 6 số qua `POST /api/auth/edit` (env `EDIT_PASSCODE`). Cloud: Nitro + **private** Blob (`GET/PUT /api/progress`).

---

## 📁 Cấu trúc repo

```
STRUCTURE.md                    # UI module conventions (src/modules)
nuxt.config.ts · app.vue
pages/                          # thin routes
src/modules/{hub,knowledge-base,study-plan,core,content}/
scripts/                        # pull-data, export, validate
schema/
server/api/                     # progress + content APIs + auth
i18n/locales/
```

Cách thêm UI module: [STRUCTURE.md](./STRUCTURE.md). Content track: [`modules/README.md`](./modules/README.md).

---

## 📚 Cấu Trúc Tài Liệu

Tài liệu được tổ chức thành 6 nhóm chính với 22 chủ đề. Đọc như coaching phỏng vấn, không phải khóa học: mỗi section là scenario, câu trả lời senior, tradeoff, gotcha production, và câu hỏi nối.

### I. Core Web Technologies

1. **[JavaScript](https://parker-interview-senior-fe.vercel.app/docs/vi/javascript)**

   1.1. [Core Concepts](https://parker-interview-senior-fe.vercel.app/docs/vi/javascript#11-core-concepts): [High-order Array Functions](https://parker-interview-senior-fe.vercel.app/docs/vi/javascript#111-high-order-array-functions), [Promise/Async-Await](https://parker-interview-senior-fe.vercel.app/docs/vi/javascript#112-promise-vs-asyncawait), [Event Loop](https://parker-interview-senior-fe.vercel.app/docs/vi/javascript#113-event-loop-microtask-macrotask), [var vs let vs const](https://parker-interview-senior-fe.vercel.app/docs/vi/javascript#114-var-vs-let-vs-const)

   1.2. [Advanced](https://parker-interview-senior-fe.vercel.app/docs/vi/javascript#12-advanced-concepts): [Closure & Scope](https://parker-interview-senior-fe.vercel.app/docs/vi/javascript#121-closure--scope), [Prototypes](https://parker-interview-senior-fe.vercel.app/docs/vi/javascript#122-prototypes--inheritance), [`this`](https://parker-interview-senior-fe.vercel.app/docs/vi/javascript#123-this-keyword), [ES6+](https://parker-interview-senior-fe.vercel.app/docs/vi/javascript#124-es6-modern-features), [Memory Management](https://parker-interview-senior-fe.vercel.app/docs/vi/javascript#125-memory-management--garbage-collection), [Hoisting](https://parker-interview-senior-fe.vercel.app/docs/vi/javascript#126-hoisting--temporal-dead-zone), [AbortController & cancellation](https://parker-interview-senior-fe.vercel.app/docs/vi/javascript#127-abortcontroller-concurrency-và-cancellation)

2. **[TypeScript](https://parker-interview-senior-fe.vercel.app/docs/vi/typescript)**

   2.1. [Core Concepts](https://parker-interview-senior-fe.vercel.app/docs/vi/typescript#21-core-concepts): [Interface vs Type](https://parker-interview-senior-fe.vercel.app/docs/vi/typescript#211-interface-vs-type), [Generics](https://parker-interview-senior-fe.vercel.app/docs/vi/typescript#212-generics), [Type Narrowing](https://parker-interview-senior-fe.vercel.app/docs/vi/typescript#213-type-narrowing)

   2.2. [Advanced Types](https://parker-interview-senior-fe.vercel.app/docs/vi/typescript#22-advanced-types): [Utility Types](https://parker-interview-senior-fe.vercel.app/docs/vi/typescript#221-utility-types), [Type Guards](https://parker-interview-senior-fe.vercel.app/docs/vi/typescript#222-type-guards--predicates), [Mapped Types](https://parker-interview-senior-fe.vercel.app/docs/vi/typescript#223-mapped-types), [Conditional Types](https://parker-interview-senior-fe.vercel.app/docs/vi/typescript#224-conditional-types), [Template Literals](https://parker-interview-senior-fe.vercel.app/docs/vi/typescript#225-template-literal-types)

3. **[CSS Layout](https://parker-interview-senior-fe.vercel.app/docs/vi/css-layout)**

   3.1. [Flexbox](https://parker-interview-senior-fe.vercel.app/docs/vi/css-layout#31-flexbox) vs [CSS Grid](https://parker-interview-senior-fe.vercel.app/docs/vi/css-layout#32-css-grid)

   3.2. [Responsive Design Strategy](https://parker-interview-senior-fe.vercel.app/docs/vi/css-layout#34-responsive-design-strategy), [stacking / overflow](https://parker-interview-senior-fe.vercel.app/docs/vi/css-layout#35-stacking-context-và-z-index), [layout hiện đại](https://parker-interview-senior-fe.vercel.app/docs/vi/css-layout#37-layout-hiện-đại-subgrid-has-cascade-layers)

4. **[Browser & Web APIs](https://parker-interview-senior-fe.vercel.app/docs/vi/web-apis)**

   4.1. [IndexedDB](https://parker-interview-senior-fe.vercel.app/docs/vi/web-apis#41-indexeddb), [Web Workers](https://parker-interview-senior-fe.vercel.app/docs/vi/web-apis#42-web-workers), [Service Workers](https://parker-interview-senior-fe.vercel.app/docs/vi/web-apis#43-service-workers--pwa)

   4.2. [Intersection Observer](https://parker-interview-senior-fe.vercel.app/docs/vi/web-apis#44-intersection-observer), [Modern APIs](https://parker-interview-senior-fe.vercel.app/docs/vi/web-apis#45-các-api-hiện-đại-khác)

---

### II. Vue Ecosystem

5. **[Vue 3](https://parker-interview-senior-fe.vercel.app/docs/vi/vue3)**

   5.1. [Core Concepts](https://parker-interview-senior-fe.vercel.app/docs/vi/vue3#51-core-concepts): [Virtual DOM](https://parker-interview-senior-fe.vercel.app/docs/vi/vue3#511-virtual-dom), [Composition API](https://parker-interview-senior-fe.vercel.app/docs/vi/vue3#512-options-api-vs-composition-api), [Reactivity](https://parker-interview-senior-fe.vercel.app/docs/vi/vue3#5110-reactivity-setup-computed-watch), [Lifecycle](https://parker-interview-senior-fe.vercel.app/docs/vi/vue3#5111-lifecycle-vue-2-vs-vue-3), [Props](https://parker-interview-senior-fe.vercel.app/docs/vi/vue3#515-props-truyền-dữ-liệu-từ-parent--child), [Computed](https://parker-interview-senior-fe.vercel.app/docs/vi/vue3#516-computed-vs-method), [Watch](https://parker-interview-senior-fe.vercel.app/docs/vi/vue3#517-computed-vs-watch)

   5.2. [Advanced Features](https://parker-interview-senior-fe.vercel.app/docs/vi/vue3#52-advanced-features): [Teleport](https://parker-interview-senior-fe.vercel.app/docs/vi/vue3#521-teleport), [Suspense](https://parker-interview-senior-fe.vercel.app/docs/vi/vue3#522-suspense), [Custom Directives](https://parker-interview-senior-fe.vercel.app/docs/vi/vue3#523-custom-directives), [Plugins](https://parker-interview-senior-fe.vercel.app/docs/vi/vue3#524-plugins), [Render Functions](https://parker-interview-senior-fe.vercel.app/docs/vi/vue3#525-render-functions--jsx), [Provide/Inject](https://parker-interview-senior-fe.vercel.app/docs/vi/vue3#526-provide--inject)

6. **[Nuxt.js](https://parker-interview-senior-fe.vercel.app/docs/vi/nuxt)**

   6.1. [Nuxt vs Vue](https://parker-interview-senior-fe.vercel.app/docs/vi/nuxt#62-nuxt-vs-vue)

   6.2. [CSR vs SSR vs SSG vs SPA](https://parker-interview-senior-fe.vercel.app/docs/vi/nuxt#63-csr-vs-ssr-vs-ssg-vs-spa), [data fetching](https://parker-interview-senior-fe.vercel.app/docs/vi/nuxt#65-useasyncdata-vs-usefetch-vs-fetch), [hydration](https://parker-interview-senior-fe.vercel.app/docs/vi/nuxt#68-hydration-clientonly-lazy-hydration)

7. **[State Management](https://parker-interview-senior-fe.vercel.app/docs/vi/state-management)**

   7.1. [Vuex vs Pinia](https://parker-interview-senior-fe.vercel.app/docs/vi/state-management#71-vuex-vs-pinia)

   7.2. [State Flow](https://parker-interview-senior-fe.vercel.app/docs/vi/state-management#72-state-flow), [commit vs dispatch](https://parker-interview-senior-fe.vercel.app/docs/vi/state-management#74-vuex-commit-vs-dispatch)

   7.3. [Global vs Local State](https://parker-interview-senior-fe.vercel.app/docs/vi/state-management#73-when-to-use-global-vs-local-state)

---

### III. React Ecosystem

8. **[React](https://parker-interview-senior-fe.vercel.app/docs/vi/react)**

   8.1. [Core Concepts](https://parker-interview-senior-fe.vercel.app/docs/vi/react#201-core-concepts): [Virtual DOM](https://parker-interview-senior-fe.vercel.app/docs/vi/react#2011-virtual-dom--reconciliation), [Hooks](https://parker-interview-senior-fe.vercel.app/docs/vi/react#2012-class-vs-function-components--hooks), [JSX](https://parker-interview-senior-fe.vercel.app/docs/vi/react#2013-jsx--mô-hình-render), [Props/State](https://parker-interview-senior-fe.vercel.app/docs/vi/react#2014-props-vs-state), [`useEffect`](https://parker-interview-senior-fe.vercel.app/docs/vi/react#2017-effects-useeffect-vs-watch--lifecycle-vue), [`useMemo`](https://parker-interview-senior-fe.vercel.app/docs/vi/react#2018-giá-trị-suy-diễn-usememo-vs-computed)

   8.2. [Advanced](https://parker-interview-senior-fe.vercel.app/docs/vi/react#202-advanced-features): [Context](https://parker-interview-senior-fe.vercel.app/docs/vi/react#2021-context-vs-provide--inject), [Portals](https://parker-interview-senior-fe.vercel.app/docs/vi/react#2022-portals-vs-teleport), [Suspense](https://parker-interview-senior-fe.vercel.app/docs/vi/react#2023-suspense), [Error Boundaries](https://parker-interview-senior-fe.vercel.app/docs/vi/react#2024-error-boundaries), [Custom Hooks](https://parker-interview-senior-fe.vercel.app/docs/vi/react#2025-custom-hooks-vs-composables)

9. **[Next.js](https://parker-interview-senior-fe.vercel.app/docs/vi/nextjs)**

   9.1. [Next vs React](https://parker-interview-senior-fe.vercel.app/docs/vi/nextjs#212-nextjs-vs-react), [Nuxt ↔ Next](https://parker-interview-senior-fe.vercel.app/docs/vi/nextjs#213-bản-đồ-tư-duy-nuxt--next)

   9.2. [CSR/SSR/SSG/RSC](https://parker-interview-senior-fe.vercel.app/docs/vi/nextjs#214-csr-vs-ssr-vs-ssg-vs-spa-và-rsc), [App Router](https://parker-interview-senior-fe.vercel.app/docs/vi/nextjs#215-nền-tảng-app-router)

10. **[State Management (React)](https://parker-interview-senior-fe.vercel.app/docs/vi/state-management-react)**

    10.1. [Các tầng state](https://parker-interview-senior-fe.vercel.app/docs/vi/state-management-react#221-các-tầng-state), [RTK vs Zustand vs Jotai](https://parker-interview-senior-fe.vercel.app/docs/vi/state-management-react#222-redux-toolkit-vs-zustand-vs-jotai)

    10.2. [Server state (Query/SWR)](https://parker-interview-senior-fe.vercel.app/docs/vi/state-management-react#225-server-state-tanstack-query--swr), [Next patterns](https://parker-interview-senior-fe.vercel.app/docs/vi/state-management-react#226-pattern-state-trên-nextjs)

    10.3. [Vuex/Pinia → React](https://parker-interview-senior-fe.vercel.app/docs/vi/state-management-react#227-bản-đồ-vuex--pinia--react)

---

### IV. Development Practices

11. **[Testing](https://parker-interview-senior-fe.vercel.app/docs/vi/testing)** ⭐

    11.1. [Unit Testing (Vitest)](https://parker-interview-senior-fe.vercel.app/docs/vi/testing#81-unit-testing-với-vitest)

    11.2. [Component Testing (Vue Test Utils)](https://parker-interview-senior-fe.vercel.app/docs/vi/testing#82-component-testing-với-vue-test-utils)

    11.3. [E2E Testing (Playwright)](https://parker-interview-senior-fe.vercel.app/docs/vi/testing#83-e2e-testing-với-playwright)

    11.4. [Test Coverage](https://parker-interview-senior-fe.vercel.app/docs/vi/testing#84-test-coverage), [TDD/BDD](https://parker-interview-senior-fe.vercel.app/docs/vi/testing#85-phương-pháp-tddbdd), [contract / visual / legacy](https://parker-interview-senior-fe.vercel.app/docs/vi/testing#86-contract-test-visual-regression-và-vue-legacy)

12. **[Performance & Optimization](https://parker-interview-senior-fe.vercel.app/docs/vi/performance)** ⚡

    12.1. [Core Performance](https://parker-interview-senior-fe.vercel.app/docs/vi/performance#91-core-performance): [Storage](https://parker-interview-senior-fe.vercel.app/docs/vi/performance#911-storage-localstorage-vs-sessionstorage-vs-cookie), [Optimization](https://parker-interview-senior-fe.vercel.app/docs/vi/performance#912-performance-optimization), [Code Review](https://parker-interview-senior-fe.vercel.app/docs/vi/performance#913-code-review-checklist)

    12.2. [Advanced](https://parker-interview-senior-fe.vercel.app/docs/vi/performance#92-advanced-optimization): [Code Splitting](https://parker-interview-senior-fe.vercel.app/docs/vi/performance#921-code-splitting-strategies), [Tree Shaking](https://parker-interview-senior-fe.vercel.app/docs/vi/performance#922-tree-shaking), [Debounce/Throttle](https://parker-interview-senior-fe.vercel.app/docs/vi/performance#923-debounce-vs-throttle), [Image/Font](https://parker-interview-senior-fe.vercel.app/docs/vi/performance#924-image--font-optimization)

13. **[Security](https://parker-interview-senior-fe.vercel.app/docs/vi/security)** 🔒

    13.1. [Phòng chống XSS](https://parker-interview-senior-fe.vercel.app/docs/vi/security#101-phòng-chống-xss)

    13.2. [Bảo vệ CSRF](https://parker-interview-senior-fe.vercel.app/docs/vi/security#102-bảo-vệ-csrf)

    13.3. [Authentication Best Practices](https://parker-interview-senior-fe.vercel.app/docs/vi/security#103-best-practices-về-authentication)

    13.4. [Validation Input](https://parker-interview-senior-fe.vercel.app/docs/vi/security#104-validation-và-sanitization-input), [HTTPS & CORS](https://parker-interview-senior-fe.vercel.app/docs/vi/security#105-https--cors)

14. **[Accessibility (A11y)](https://parker-interview-senior-fe.vercel.app/docs/vi/accessibility)** ♿

    14.1. [Thuộc tính ARIA](https://parker-interview-senior-fe.vercel.app/docs/vi/accessibility#111-thuộc-tính-aria)

    14.2. [Điều hướng Bàn phím](https://parker-interview-senior-fe.vercel.app/docs/vi/accessibility#112-điều-hướng-bằng-bàn-phím)

    14.3. [HTML Ngữ nghĩa](https://parker-interview-senior-fe.vercel.app/docs/vi/accessibility#113-html-ngữ-nghĩa)

    14.4. [Hướng dẫn WCAG](https://parker-interview-senior-fe.vercel.app/docs/vi/accessibility#114-hướng-dẫn-wcag)

---

### V. Infrastructure & Tools

15. **[Build Tools](https://parker-interview-senior-fe.vercel.app/docs/vi/build-tools)**

    15.1. [Vite vs Webpack](https://parker-interview-senior-fe.vercel.app/docs/vi/build-tools#121-vite-vs-webpack)

16. **[Networking](https://parker-interview-senior-fe.vercel.app/docs/vi/networking)**

    16.1. [REST vs WebSocket](https://parker-interview-senior-fe.vercel.app/docs/vi/networking#131-websocket-vs-rest)

17. **[DevOps](https://parker-interview-senior-fe.vercel.app/docs/vi/devops)**

    17.1. [GitOps & ArgoCD Pipeline](https://parker-interview-senior-fe.vercel.app/docs/vi/devops#141-gitops--argocd-pipeline)

---

### VI. Professional Skills

18. **[Architecture & Design Patterns](https://parker-interview-senior-fe.vercel.app/docs/vi/architecture)** 🏗️

    18.1. [Các mẫu Component](https://parker-interview-senior-fe.vercel.app/docs/vi/architecture#151-các-mẫu-component)

    18.2. [Design Patterns](https://parker-interview-senior-fe.vercel.app/docs/vi/architecture#152-các-mẫu-thiết-kế)

    18.3. [Nguyên tắc SOLID](https://parker-interview-senior-fe.vercel.app/docs/vi/architecture#153-nguyên-tắc-solid-trong-frontend)

    18.4. [Module Federation & Micro-frontends](https://parker-interview-senior-fe.vercel.app/docs/vi/architecture#154-module-federation--micro-frontends)

19. **[System Design](https://parker-interview-senior-fe.vercel.app/docs/vi/system-design)**

    19.1. [Quyết định Kiến trúc Frontend](https://parker-interview-senior-fe.vercel.app/docs/vi/system-design#161-quyết-định-kiến-trúc-frontend)

    19.2. [Chiến lược Caching](https://parker-interview-senior-fe.vercel.app/docs/vi/system-design#162-chiến-lược-caching)

    19.3. [Thiết kế Component Library](https://parker-interview-senior-fe.vercel.app/docs/vi/system-design#163-thiết-kế-component-library)

20. **[Leadership & Soft Skills](https://parker-interview-senior-fe.vercel.app/docs/vi/leadership)** 👥

    20.1. [Mentorship Kỹ thuật](https://parker-interview-senior-fe.vercel.app/docs/vi/leadership#171-mentorship-kỹ-thuật)

    20.2. [Ghi chép Quyết định Kiến trúc (ADR)](https://parker-interview-senior-fe.vercel.app/docs/vi/leadership#172-ghi-chép-quyết-định-kiến-trúc-adr)

    20.3. [Ước lượng Độ phức tạp](https://parker-interview-senior-fe.vercel.app/docs/vi/leadership#173-ước-lượng-độ-phức-tạp)

    20.4. [Giải quyết Xung đột](https://parker-interview-senior-fe.vercel.app/docs/vi/leadership#174-giải-quyết-xung-đột)

21. **[Practical Interview Questions](https://parker-interview-senior-fe.vercel.app/docs/vi/practical-questions)** 💼

    21.1. [Xử lý 401 Error & Authentication](https://parker-interview-senior-fe.vercel.app/docs/vi/practical-questions#181-xử-lý-401-error--redirect-to-login)

    21.2. [Quy trình Quản lý Dự án](https://parker-interview-senior-fe.vercel.app/docs/vi/practical-questions#182-công-cụ-quản-lý-dự-án--quy-trình)

    21.3. [Đánh giá Issue: Bug vs Feature](https://parker-interview-senior-fe.vercel.app/docs/vi/practical-questions#183-đánh-giá-issue-bug-hay-yêu-cầu-tính-năng)

    21.4. [Quy trình Git](https://parker-interview-senior-fe.vercel.app/docs/vi/practical-questions#184-quy-trình-git)

    21.5. [Giải quyết Xung đột Git](https://parker-interview-senior-fe.vercel.app/docs/vi/practical-questions#185-giải-quyết-xung-đột-git)

    21.6. [Gộp Commits](https://parker-interview-senior-fe.vercel.app/docs/vi/practical-questions#186-gộp-commits), [incident](https://parker-interview-senior-fe.vercel.app/docs/vi/practical-questions#187-xử-lý-production-incident-với-tư-cách-frontend), [onboard tuần 1](https://parker-interview-senior-fe.vercel.app/docs/vi/practical-questions#188-onboard-codebase-vue-lạ-trong-tuần-đầu)

22. **[Monitoring & Error Handling](https://parker-interview-senior-fe.vercel.app/docs/vi/monitoring)** 📊

    22.1. [Theo dõi Lỗi (Sentry)](https://parker-interview-senior-fe.vercel.app/docs/vi/monitoring#191-theo-dõi-lỗi-với-sentry)

    22.2. [Error Boundaries](https://parker-interview-senior-fe.vercel.app/docs/vi/monitoring#192-error-boundaries-trong-vue)

    22.3. [Performance Monitoring](https://parker-interview-senior-fe.vercel.app/docs/vi/monitoring#193-theo-dõi-performance)

    22.4. [Chiến lược Logging](https://parker-interview-senior-fe.vercel.app/docs/vi/monitoring#194-chiến-lược-logging)

---

## 📊 Thống Kê Coverage

- **Nhóm Chính**: 6 nhóm (Core Web, Vue Ecosystem, React Ecosystem, Dev Practices, Infrastructure, Professional Skills)
- **Tổng số Topics**: 22 chủ đề chính
- **Tổng số Sections**: 100+ chủ đề con
- **Code Examples**: 200+ ví dụ thực tế
- **Bảng So sánh**: 20+ ma trận ra quyết định
- **Cấp độ**: Senior Frontend Developer (judgment khi phỏng vấn, không phải giáo trình)

---

## 🚀 Các Công Nghệ Được Đề Cập

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

**Khác:**

- Modern CSS (Flexbox, Grid)
- Web APIs
- Tối ưu Performance
- Best Practices về Bảo mật

---

## 🤝 Contributing

Tài liệu này được xây dựng dựa trên kinh nghiệm thực tế và best practices hiện đại. Nếu bạn muốn đóng góp:

1. Tạo issue với suggestions
2. Submit PR với improvements
3. Share real-world case studies
4. Report outdated information

---

## ⚖️ License

Tài liệu này miễn phí sử dụng cho mục đích chuẩn bị phỏng vấn cá nhân. Vui lòng ghi nguồn nếu chia sẻ công khai.

---

## 📞 Feedback

Nếu tài liệu này hữu ích cho bạn, hãy:

- ⭐ Star repo này
- 📢 Share với đồng nghiệp
- 💬 Feedback để cải thiện

---

**Chúc bạn thành công trong phỏng vấn Senior Frontend Developer! 🚀**

_Cập nhật lần cuối: Tháng 10/2026_
_Phiên bản: 3.3 (Viết lại cho phỏng vấn senior — cùng 22 chủ đề, judgment production)_
