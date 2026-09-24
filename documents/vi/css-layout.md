# CSS Layout

Modern CSS layout techniques: Flexbox, Grid, and Responsive Design.

---

## Table of Contents

1. [Flexbox](#31-flexbox)

2. [CSS Grid](#32-css-grid)

3. [Flexbox vs Grid](#33-when-to-use-flexbox-vs-grid)

4. [Responsive Design Strategy](#34-responsive-design-strategy)

---

## 3. CSS Layout

### 3.1. Flexbox

- Thiết kế **1 chiều**: theo **row** hoặc **column**.
- Tối ưu cho layout tuyến tính: navbar, button group, card list.
- Tự động co giãn theo không gian còn lại.

**Ví dụ:**

```css
display: flex;
justify-content: space-between;
align-items: center;
gap: 1rem;
```

**Use cases:**

- Navigation bars
- Button groups
- Card lists
- Centering items

---

### 3.2. CSS Grid

- Thiết kế **2 chiều**: cả **rows + columns**.
- Dùng cho layout phức tạp: dashboard, gallery, page layout.
- Hỗ trợ chia tỉ lệ màn hình dễ dàng: `fr`, `minmax`, `auto-fit`.

**Ví dụ:**

```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 1rem;
```

**Use cases:**

- Dashboard layouts
- Image galleries
- Complex page structures
- Magazine-style layouts

---

### 3.3. When to Use Flexbox vs Grid?

- **Flex**: layout 1 chiều → danh sách, alignment, spacing.
- **Grid**: layout 2 chiều → bố cục trang, lưới hình ảnh.

**Pro tip:** Có thể kết hợp cả hai! Grid cho layout tổng thể, Flex cho từng component con.

---

### 3.4. Responsive Design Strategy

#### **Mobile-First Approach**

Bắt đầu từ màn nhỏ → mở rộng lên (dễ maintain hơn desktop-first).

```css
/* Mobile default */
.container {
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
  }
}
```

#### **Modern Techniques**

- Dùng đơn vị linh hoạt: `rem`, `%`, `vh/vw`, `fr`.
- CSS modern tools: `clamp()`, `min()`, `max()`.
- Container queries (Chrome 105+) cho component-level responsive.

```css
/* Fluid typography */
font-size: clamp(1rem, 2vw + 1rem, 2rem);
```

---


---

[← Back to Overview](../README.md)
