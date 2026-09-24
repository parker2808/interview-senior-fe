# Tài Liệu Chuẩn Bị Phỏng Vấn Senior Frontend

> 🌍 **Language / Ngôn ngữ:** [🇻🇳 Tiếng Việt](./README.md) | [🇬🇧 English](./README-en.md)

Tài liệu tổng hợp kiến thức chuẩn **Senior Frontend Developer**, tập trung vào **Vue 3**, **TypeScript**, và hệ sinh thái hiện đại.

---

## 🗓️ Kế hoạch ôn 30 ngày

- **Plan & artifacts:** [`documents/study-plan/30-days/`](./documents/study-plan/30-days/) — bắt đầu từ [daily-index.md](./documents/study-plan/30-days/daily-index.md) hoặc [30-day-study-plan.md](./documents/study-plan/30-days/30-day-study-plan.md)
- **UI theo dõi / đánh dấu tiến độ:** Vite + Vue 3 app trong [`src/`](./src/)
- **Deploy:** [Netlify](https://www.netlify.com/) — cấu hình trong [`netlify.toml`](./netlify.toml) (`base = src`, `npm run build`, publish `dist`)

```bash
cd src
npm install
npm run dev      # local: http://localhost:5173
npm run build    # output: src/dist (Netlify publish dir)
```

Tiến độ lưu trong `localStorage`. UI import markdown từ `documents/study-plan/30-days/` lúc build (Vite alias `@plan`).

---

## 📁 Cấu trúc repo

```
documents/           # toàn bộ tài liệu
  en/ · vi/          # knowledge base phỏng vấn
  study-plan/30-days # plan, starters, artifacts, capstone
src/                 # Vite + Vue follow UI (package.json + vite ở đây)
netlify.toml
```

---

## 📚 Cấu Trúc Tài Liệu

Tài liệu được tổ chức thành 5 nhóm chính với 19 chủ đề, từ cơ bản đến nâng cao:

### I. Core Web Technologies

1. **[JavaScript](./documents/vi/javascript.md)**

   1.1. [Core Concepts](./documents/vi/javascript.md#11-core-concepts): [High-order Array Functions](./documents/vi/javascript.md#111-high-order-array-functions), [Promise/Async-Await](./documents/vi/javascript.md#112-promise-vs-asyncawait), [Event Loop](./documents/vi/javascript.md#113-event-loop-microtask-macrotask), [var vs let vs const](./documents/vi/javascript.md#114-var-vs-let-vs-const)

   1.2. [Advanced](./documents/vi/javascript.md#12-advanced-concepts): [Closure & Scope](./documents/vi/javascript.md#121-closure--scope), [Prototypes](./documents/vi/javascript.md#122-prototypes--inheritance), [`this`](./documents/vi/javascript.md#123-this-keyword), [ES6+](./documents/vi/javascript.md#124-es6-modern-features), [Memory Management](./documents/vi/javascript.md#125-memory-management--garbage-collection), [Hoisting](./documents/vi/javascript.md#126-hoisting--temporal-dead-zone)

2. **[TypeScript](./documents/vi/typescript.md)**

   2.1. [Core Concepts](./documents/vi/typescript.md#21-core-concepts): [Interface vs Type](./documents/vi/typescript.md#211-interface-vs-type), [Generics](./documents/vi/typescript.md#212-generics), [Type Narrowing](./documents/vi/typescript.md#213-type-narrowing)

   2.2. [Advanced Types](./documents/vi/typescript.md#22-advanced-types): [Utility Types](./documents/vi/typescript.md#221-utility-types), [Type Guards](./documents/vi/typescript.md#222-type-guards--predicates), [Mapped Types](./documents/vi/typescript.md#223-mapped-types), [Conditional Types](./documents/vi/typescript.md#224-conditional-types), [Template Literals](./documents/vi/typescript.md#225-template-literal-types)

3. **[CSS Layout](./documents/vi/css-layout.md)**

   3.1. [Flexbox](./documents/vi/css-layout.md#31-flexbox) vs [CSS Grid](./documents/vi/css-layout.md#32-css-grid)

   3.2. [Responsive Design Strategy](./documents/vi/css-layout.md#34-responsive-design-strategy)

4. **[Browser & Web APIs](./documents/vi/web-apis.md)**

   4.1. [IndexedDB](./documents/vi/web-apis.md#41-indexeddb), [Web Workers](./documents/vi/web-apis.md#42-web-workers), [Service Workers](./documents/vi/web-apis.md#43-service-workers--pwa)

   4.2. [Intersection Observer](./documents/vi/web-apis.md#44-intersection-observer), [Modern APIs](./documents/vi/web-apis.md#45-các-api-hiện-đại-khác)

---

### II. Vue Ecosystem

5. **[Vue 3](./documents/vi/vue3.md)**

   5.1. [Core Concepts](./documents/vi/vue3.md#51-core-concepts): [Virtual DOM](./documents/vi/vue3.md#511-virtual-dom), [Composition API](./documents/vi/vue3.md#512-options-api-vs-composition-api), [Reactivity](./documents/vi/vue3.md#5110-reactivity-setup-computed-watch), [Lifecycle](./documents/vi/vue3.md#5111-lifecycle-vue-2-vs-vue-3), [Props](./documents/vi/vue3.md#515-props-truyền-dữ-liệu-từ-parent--child), [Computed](./documents/vi/vue3.md#516-computed-vs-method), [Watch](./documents/vi/vue3.md#517-computed-vs-watch)

   5.2. [Advanced Features](./documents/vi/vue3.md#52-advanced-features): [Teleport](./documents/vi/vue3.md#521-teleport), [Suspense](./documents/vi/vue3.md#522-suspense), [Custom Directives](./documents/vi/vue3.md#523-custom-directives), [Plugins](./documents/vi/vue3.md#524-plugins), [Render Functions](./documents/vi/vue3.md#525-render-functions--jsx), [Provide/Inject](./documents/vi/vue3.md#526-provide--inject)

6. **[Nuxt.js](./documents/vi/nuxt.md)**

   6.1. [Nuxt vs Vue](./documents/vi/nuxt.md#62-nuxt-vs-vue)

   6.2. [CSR vs SSR vs SSG vs SPA](./documents/vi/nuxt.md#63-csr-vs-ssr-vs-ssg-vs-spa)

7. **[State Management](./documents/vi/state-management.md)**

   7.1. [Vuex vs Pinia](./documents/vi/state-management.md#71-vuex-vs-pinia)

   7.2. [State Flow](./documents/vi/state-management.md#72-state-flow), [commit vs dispatch](./documents/vi/state-management.md#74-vuex-commit-vs-dispatch)

   7.3. [Global vs Local State](./documents/vi/state-management.md#73-when-to-use-global-vs-local-state)

---

### III. Development Practices

8. **[Testing](./documents/vi/testing.md)** ⭐

   8.1. [Unit Testing (Vitest)](./documents/vi/testing.md#81-unit-testing-với-vitest)

   8.2. [Component Testing (Vue Test Utils)](./documents/vi/testing.md#82-component-testing-với-vue-test-utils)

   8.3. [E2E Testing (Playwright)](./documents/vi/testing.md#83-e2e-testing-với-playwright)

   8.4. [Test Coverage](./documents/vi/testing.md#84-test-coverage), [TDD/BDD](./documents/vi/testing.md#85-phương-pháp-tddbdd)

9. **[Performance & Optimization](./documents/vi/performance.md)** ⚡

   9.1. [Core Performance](./documents/vi/performance.md#91-core-performance): [Storage](./documents/vi/performance.md#911-storage-localstorage-vs-sessionstorage-vs-cookie), [Optimization](./documents/vi/performance.md#912-performance-optimization), [Code Review](./documents/vi/performance.md#913-code-review-checklist)

   9.2. [Advanced](./documents/vi/performance.md#92-advanced-optimization): [Code Splitting](./documents/vi/performance.md#921-code-splitting-strategies), [Tree Shaking](./documents/vi/performance.md#922-tree-shaking), [Debounce/Throttle](./documents/vi/performance.md#923-debounce-vs-throttle), [Image/Font](./documents/vi/performance.md#924-image--font-optimization)

10. **[Security](./documents/vi/security.md)** 🔒

    10.1. [Phòng chống XSS](./documents/vi/security.md#101-phòng-chống-xss)

    10.2. [Bảo vệ CSRF](./documents/vi/security.md#102-bảo-vệ-csrf)

    10.3. [Authentication Best Practices](./documents/vi/security.md#103-best-practices-về-authentication)

    10.4. [Validation Input](./documents/vi/security.md#104-validation-và-sanitization-input), [HTTPS & CORS](./documents/vi/security.md#105-https--cors)

11. **[Accessibility (A11y)](./documents/vi/accessibility.md)** ♿

    11.1. [Thuộc tính ARIA](./documents/vi/accessibility.md#111-thuộc-tính-aria)

    11.2. [Điều hướng Bàn phím](./documents/vi/accessibility.md#112-điều-hướng-bằng-bàn-phím)

    11.3. [HTML Ngữ nghĩa](./documents/vi/accessibility.md#113-html-ngữ-nghĩa)

    11.4. [Hướng dẫn WCAG](./documents/vi/accessibility.md#114-hướng-dẫn-wcag)

---

### IV. Infrastructure & Tools

12. **[Build Tools](./documents/vi/build-tools.md)**

    12.1. [Vite vs Webpack](./documents/vi/build-tools.md#121-vite-vs-webpack)

13. **[Networking](./documents/vi/networking.md)**

    13.1. [REST vs WebSocket](./documents/vi/networking.md#131-websocket-vs-rest)

14. **[DevOps](./documents/vi/devops.md)**

    14.1. [GitOps & ArgoCD Pipeline](./documents/vi/devops.md#141-gitops--argocd-pipeline)

---

### V. Professional Skills

15. **[Architecture & Design Patterns](./documents/vi/architecture.md)** 🏗️

    15.1. [Các mẫu Component](./documents/vi/architecture.md#151-các-mẫu-component)

    15.2. [Design Patterns](./documents/vi/architecture.md#152-các-mẫu-thiết-kế)

    15.3. [Nguyên tắc SOLID](./documents/vi/architecture.md#153-nguyên-tắc-solid-trong-frontend)

    15.4. [Module Federation & Micro-frontends](./documents/vi/architecture.md#154-module-federation--micro-frontends)

16. **[System Design](./documents/vi/system-design.md)**

    16.1. [Quyết định Kiến trúc Frontend](./documents/vi/system-design.md#161-quyết-định-kiến-trúc-frontend)

    16.2. [Chiến lược Caching](./documents/vi/system-design.md#162-chiến-lược-caching)

    16.3. [Thiết kế Component Library](./documents/vi/system-design.md#163-thiết-kế-component-library)

17. **[Leadership & Soft Skills](./documents/vi/leadership.md)** 👥

    17.1. [Mentorship Kỹ thuật](./documents/vi/leadership.md#171-mentorship-kỹ-thuật)

    17.2. [Ghi chép Quyết định Kiến trúc (ADR)](./documents/vi/leadership.md#172-ghi-chép-quyết-định-kiến-trúc-adr)

    17.3. [Ước lượng Độ phức tạp](./documents/vi/leadership.md#173-ước-lượng-độ-phức-tạp)

    17.4. [Giải quyết Xung đột](./documents/vi/leadership.md#174-giải-quyết-xung-đột)

18. **[Practical Interview Questions](./documents/vi/practical-questions.md)** 💼

    18.1. [Xử lý 401 Error & Authentication](./documents/vi/practical-questions.md#181-xử-lý-401-error--redirect-to-login)

    18.2. [Quy trình Quản lý Dự án](./documents/vi/practical-questions.md#182-công-cụ-quản-lý-dự-án--quy-trình)

    18.3. [Đánh giá Issue: Bug vs Feature](./documents/vi/practical-questions.md#183-đánh-giá-issue-bug-hay-yêu-cầu-tính-năng)

    18.4. [Quy trình Git](./documents/vi/practical-questions.md#184-quy-trình-git)

    18.5. [Giải quyết Xung đột Git](./documents/vi/practical-questions.md#185-giải-quyết-xung-đột-git)

    18.6. [Gộp Commits](./documents/vi/practical-questions.md#186-gộp-commits)

19. **[Monitoring & Error Handling](./documents/vi/monitoring.md)** 📊

    19.1. [Theo dõi Lỗi (Sentry)](./documents/vi/monitoring.md#191-theo-dõi-lỗi-với-sentry)

    19.2. [Error Boundaries](./documents/vi/monitoring.md#192-error-boundaries-trong-vue)

    19.3. [Performance Monitoring](./documents/vi/monitoring.md#193-theo-dõi-performance)

    19.4. [Chiến lược Logging](./documents/vi/monitoring.md#194-chiến-lược-logging)

---

## 📊 Thống Kê Coverage

- **Nhóm Chính**: 5 nhóm (Core Web, Vue Ecosystem, Dev Practices, Infrastructure, Professional Skills)
- **Tổng số Topics**: 19 chủ đề chính
- **Tổng số Sections**: 100+ chủ đề con
- **Code Examples**: 200+ ví dụ thực tế
- **Bảng So sánh**: 20+ ma trận ra quyết định
- **Cấp độ**: Senior Frontend Developer

---

## 🚀 Các Công Nghệ Được Đề Cập

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

_Cập nhật lần cuối: Tháng 11/2025_
_Phiên bản: 3.0 (Cấu trúc mới - 5 nhóm chính, 19 chủ đề)_
