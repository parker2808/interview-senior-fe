# Build Tools

Modern build tools for frontend development.

---

## Table of Contents

1. [Vite vs Webpack](#121-vite-vs-webpack)

---

## IV. Infrastructure & Tools

## 12. Build Tools

### 12.1. Vite vs Webpack

#### **1. Kiến trúc hoạt động**

**Webpack:**

- Bundler truyền thống → phải **bundle toàn bộ** code trước khi chạy.
- Dev server dùng HMR nhưng vẫn dựa trên bundle.
- Build chậm khi dự án lớn.

**Vite:**

- Dựa trên **ES Module (ESM)**.
- Dev server **không cần bundle** → chỉ load file khi được import.
- Build sử dụng **Rollup** tối ưu cho production.

#### **2. Tốc độ**

- **Vite dev cực nhanh**: start server gần như tức thì, HMR mượt.
- **Webpack dev chậm** khi dự án lớn (bundle nặng).
- Build: Vite (Rollup) thường tối ưu hơn cho app FE hiện đại.

#### **3. Khi nào dùng gì?**

**Dùng Vite khi:**

- Vue 3, React, Svelte, TS projects.
- Ưu tiên tốc độ dev, DX tốt.
- Dự án hiện đại dùng ESM.

**Dùng Webpack khi:**

- Project legacy, dùng nhiều custom loader.
- Build pipeline phức tạp phụ thuộc Webpack ecosystem.
- Cần micro-frontend kiểu Module Federation.

---


---

[← Back to Overview](../README.md)
