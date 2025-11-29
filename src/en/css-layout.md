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

- **1-dimensional** layout: along **row** or **column**.
- Best for linear layouts: navbar, button groups, card lists.
- Auto stretch/shrink based on available space.

**Example:**

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

- **2-dimensional** layout: both **rows + columns**.
- Use for complex layouts: dashboards, galleries, page layouts.
- Easy screen division with: `fr`, `minmax`, `auto-fit`.

**Example:**

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

- **Flex**: 1-dimensional layout → lists, alignment, spacing.
- **Grid**: 2-dimensional layout → page layout, image grids.

**Pro tip:** You can combine both! Grid for overall layout, Flex for each child component.

---

### 3.4. Responsive Design Strategy

#### **Mobile-First Approach**

Start from small screen → expand up (easier to maintain than desktop-first).

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

- Use flexible units: `rem`, `%`, `vh/vw`, `fr`.
- CSS modern tools: `clamp()`, `min()`, `max()`.
- Container queries (Chrome 105+) for component-level responsive.

```css
/* Fluid typography */
font-size: clamp(1rem, 2vw + 1rem, 2rem);
```

---


---

[← Back to Overview](../../README-en.md)

