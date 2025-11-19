# Accessibility (A11y)

Làm cho ứng dụng web dễ truy cập cho mọi người.

---

## Mục Lục

1. [Thuộc tính ARIA](#1-thuộc-tính-aria)
2. [Điều hướng bằng bàn phím](#2-điều-hướng-bằng-bàn-phím)
3. [HTML Ngữ nghĩa](#3-html-ngữ-nghĩa)
4. [Hướng dẫn WCAG](#4-hướng-dẫn-wcag)

---

## 1. Thuộc tính ARIA

**Câu trả lời chuẩn Senior:**

ARIA (Accessible Rich Internet Applications) giúp screen readers hiểu web apps.

#### **Các thuộc tính ARIA Cơ bản**

```vue
<template>
  <!-- role: Định nghĩa loại element -->
  <div role="button" tabindex="0" @click="submit" @keypress.enter="submit">
    Submit
  </div>

  <!-- aria-label: Label cho screen readers -->
  <button aria-label="Đóng dialog">
    <svg><!-- X icon --></svg>
  </button>

  <!-- aria-labelledby: Reference đến label element -->
  <h2 id="dialog-title">Xác nhận Hành động</h2>
  <div role="dialog" aria-labelledby="dialog-title">
    <!-- nội dung dialog -->
  </div>

  <!-- aria-describedby: Mô tả bổ sung -->
  <input type="password" aria-describedby="password-hint" />
  <div id="password-hint">Mật khẩu phải có ít nhất 8 ký tự</div>

  <!-- aria-hidden: Ẩn khỏi screen readers -->
  <span aria-hidden="true">★</span>
  <span class="sr-only">Đánh giá: 4 trên 5</span>
</template>
```

#### **ARIA States**

```vue
<template>
  <!-- aria-expanded: Các elements có thể mở rộng -->
  <button
    aria-expanded="isOpen"
    aria-controls="dropdown-menu"
    @click="isOpen = !isOpen"
  >
    Menu
  </button>
  <ul id="dropdown-menu" :hidden="!isOpen">
    <li>Mục 1</li>
  </ul>

  <!-- aria-selected: Trạng thái được chọn -->
  <div role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      role="tab"
      :aria-selected="currentTab === tab.id"
      @click="currentTab = tab.id"
    >
      {{ tab.name }}
    </button>
  </div>

  <!-- aria-checked: Trạng thái checkbox/radio -->
  <div
    role="checkbox"
    :aria-checked="isChecked"
    @click="isChecked = !isChecked"
  >
    Chấp nhận điều khoản
  </div>

  <!-- aria-disabled: Trạng thái disabled -->
  <button :aria-disabled="isProcessing" :disabled="isProcessing">Submit</button>

  <!-- aria-invalid: Trạng thái validation -->
  <input
    v-model="email"
    :aria-invalid="!isValidEmail"
    aria-describedby="email-error"
  />
  <span v-if="!isValidEmail" id="email-error" role="alert">
    Định dạng email không hợp lệ
  </span>
</template>
```

#### **Live Regions**

```vue
<template>
  <!-- aria-live: Thông báo thay đổi nội dung động -->
  <div aria-live="polite" aria-atomic="true">
    {{ statusMessage }}
  </div>

  <!-- polite: Đợi user xong việc hiện tại -->
  <!-- assertive: Ngắt ngay lập tức -->
  <div aria-live="assertive" role="alert">
    {{ errorMessage }}
  </div>

  <!-- aria-atomic: Đọc toàn bộ nội dung vs chỉ phần thay đổi -->
  <div aria-live="polite" aria-atomic="false">Số items: {{ itemCount }}</div>
</template>
```

---

## 2. Điều hướng bằng bàn phím

**Câu trả lời chuẩn Senior:**

#### **Các Elements có thể Focus**

```vue
<template>
  <!-- Native focusable: button, a, input, select, textarea -->
  <button>Click me</button>

  <!-- Làm div có thể focus -->
  <div tabindex="0" role="button" @keypress.enter="handleClick">
    Custom button
  </div>

  <!-- Giá trị tabindex:
       0: Thứ tự tab tự nhiên
       -1: Có thể focus bằng JS, không trong tab order
       1+: Thứ tự tab tùy chỉnh (tránh dùng, phá vỡ flow tự nhiên) -->

  <!-- Bỏ qua trong tab order -->
  <div tabindex="-1">Không tabbable nhưng có thể focus qua JS</div>
</template>
```

#### **Xử lý Keyboard Events**

```vue
<template>
  <div
    role="button"
    tabindex="0"
    @click="handleAction"
    @keydown.enter="handleAction"
    @keydown.space.prevent="handleAction"
  >
    Kích hoạt
  </div>

  <!-- Escape để đóng -->
  <div v-if="isOpen" role="dialog" @keydown.esc="close">Nội dung modal</div>

  <!-- Điều hướng bằng phím mũi tên -->
  <ul
    role="listbox"
    @keydown.up.prevent="selectPrevious"
    @keydown.down.prevent="selectNext"
  >
    <li
      v-for="(item, index) in items"
      :key="item.id"
      role="option"
      :aria-selected="selectedIndex === index"
      :tabindex="selectedIndex === index ? 0 : -1"
    >
      {{ item.name }}
    </li>
  </ul>
</template>

<script setup>
import { ref } from "vue";

const selectedIndex = ref(0);

const selectPrevious = () => {
  selectedIndex.value = Math.max(0, selectedIndex.value - 1);
};

const selectNext = () => {
  selectedIndex.value = Math.min(items.length - 1, selectedIndex.value + 1);
};
</script>
```

#### **Quản lý Focus**

```vue
<script setup>
import { ref, onMounted, watch } from "vue";

const dialogRef = ref(null);
const previousFocus = ref(null);

const openDialog = () => {
  // Lưu focus hiện tại
  previousFocus.value = document.activeElement;

  isOpen.value = true;

  // Focus dialog
  nextTick(() => {
    dialogRef.value?.focus();
  });
};

const closeDialog = () => {
  isOpen.value = false;

  // Khôi phục focus
  previousFocus.value?.focus();
};

// Trap focus bên trong dialog
const trapFocus = (e) => {
  if (!dialogRef.value) return;

  const focusableElements = dialogRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.shiftKey && document.activeElement === firstElement) {
    e.preventDefault();
    lastElement.focus();
  } else if (!e.shiftKey && document.activeElement === lastElement) {
    e.preventDefault();
    firstElement.focus();
  }
};
</script>

<template>
  <div
    v-if="isOpen"
    ref="dialogRef"
    role="dialog"
    tabindex="-1"
    @keydown.tab="trapFocus"
    @keydown.esc="closeDialog"
  >
    <!-- Nội dung Dialog -->
  </div>
</template>
```

---

## 3. HTML Ngữ nghĩa

**Câu trả lời chuẩn Senior:**

```vue
<template>
  <!-- ❌ TỆ: Div soup -->
  <div class="header">
    <div class="nav">
      <div class="nav-item">Trang chủ</div>
    </div>
  </div>
  <div class="content">
    <div class="article">
      <div class="title">Tiêu đề Bài viết</div>
    </div>
  </div>

  <!-- ✅ TỐT: HTML Ngữ nghĩa -->
  <header>
    <nav>
      <a href="/">Trang chủ</a>
    </nav>
  </header>

  <main>
    <article>
      <h1>Tiêu đề Bài viết</h1>
      <section>
        <h2>Tiêu đề Phần</h2>
        <p>Nội dung</p>
      </section>
    </article>

    <aside>
      <h2>Liên quan</h2>
    </aside>
  </main>

  <footer>
    <p>&copy; 2024</p>
  </footer>
</template>
```

#### **Thứ bậc Heading**

```vue
<template>
  <!-- ✅ TỐT: Thứ bậc đúng -->
  <h1>Tiêu đề Trang</h1>
  <h2>Phần</h2>
  <h3>Phần phụ</h3>
  <h2>Phần khác</h2>

  <!-- ❌ TỆ: Bỏ qua levels -->
  <h1>Tiêu đề</h1>
  <h4>Phần phụ</h4>
  <!-- Bỏ qua h2, h3 -->

  <!-- ❌ TỆ: Dùng headings cho styling -->
  <h3 class="small-text">Đây nên là paragraph</h3>

  <!-- ✅ TỐT: Dùng CSS cho styling -->
  <h2 class="text-sm">Heading đúng, style nhỏ</h2>
</template>
```

---

## 4. Hướng dẫn WCAG

**Câu trả lời chuẩn Senior:**

WCAG (Web Content Accessibility Guidelines) có 3 levels: A, AA (target), AAA.

#### **Độ tương phản Màu sắc**

```
Tỷ lệ tương phản tối thiểu (WCAG AA):
- Text thường: 4.5:1
- Text lớn (18pt+): 3:1
- UI components: 3:1
```

```vue
<template>
  <!-- ❌ TỆ: Độ tương phản thấp -->
  <div style="color: #999; background: #fff;">Khó đọc (2.8:1)</div>

  <!-- ✅ TỐT: Độ tương phản đủ -->
  <div style="color: #333; background: #fff;">Dễ đọc (12.6:1)</div>

  <!-- Dùng tools: Chrome DevTools, WebAIM Contrast Checker -->
</template>
```

#### **Accessibility trong Forms**

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <!-- ✅ Liên kết labels với inputs -->
    <label for="email">Email:</label>
    <input
      id="email"
      v-model="email"
      type="email"
      required
      aria-describedby="email-hint"
      :aria-invalid="emailError ? 'true' : 'false'"
    />
    <span id="email-hint" class="hint"
      >Chúng tôi sẽ không chia sẻ email của bạn</span
    >
    <span v-if="emailError" role="alert" class="error">
      {{ emailError }}
    </span>

    <!-- ✅ Fieldset cho các inputs liên quan -->
    <fieldset>
      <legend>Cách liên hệ ưa thích</legend>
      <label>
        <input type="radio" name="contact" value="email" />
        Email
      </label>
      <label>
        <input type="radio" name="contact" value="phone" />
        Điện thoại
      </label>
    </fieldset>

    <!-- ✅ Đánh dấu required -->
    <label for="name">
      Tên <abbr title="bắt buộc" aria-label="bắt buộc">*</abbr>
    </label>
    <input id="name" required aria-required="true" />

    <button type="submit">Gửi</button>
  </form>
</template>
```

#### **Accessibility cho Hình ảnh**

```vue
<template>
  <!-- ✅ Alt text mô tả -->
  <img src="chart.png" alt="Biểu đồ doanh số tăng 20% trong Q4 2024" />

  <!-- ✅ Hình ảnh trang trí -->
  <img src="decoration.png" alt="" role="presentation" />

  <!-- ✅ Hình ảnh phức tạp -->
  <img
    src="complex-diagram.png"
    alt="Kiến trúc hệ thống"
    aria-describedby="diagram-desc"
  />
  <div id="diagram-desc">
    <p>Mô tả chi tiết kiến trúc hệ thống...</p>
  </div>

  <!-- ✅ Icon với text -->
  <button>
    <svg aria-hidden="true"><!-- Icon --></svg>
    <span>Xóa</span>
  </button>

  <!-- ✅ Button chỉ có icon -->
  <button aria-label="Xóa item">
    <svg aria-hidden="true"><!-- Trash icon --></svg>
  </button>
</template>
```

---

[← Quay lại Tổng quan](../README.md)
