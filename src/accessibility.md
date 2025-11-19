# Accessibility (A11y)

Making web applications accessible to everyone.

---

## Table of Contents

1. [ARIA Attributes](#1-aria-attributes)
2. [Keyboard Navigation](#2-keyboard-navigation)
3. [Semantic HTML](#3-semantic-html)
4. [WCAG Guidelines](#4-wcag-guidelines)

---
## 6. Accessibility (A11y)

### 6.1. ARIA Attributes

**Câu trả lời chuẩn Senior:**

ARIA (Accessible Rich Internet Applications) giúp screen readers hiểu web apps.

#### **Basic ARIA Attributes**

```vue
<template>
  <!-- role: Định nghĩa element type -->
  <div role="button" tabindex="0" @click="submit" @keypress.enter="submit">
    Submit
  </div>

  <!-- aria-label: Label cho screen readers -->
  <button aria-label="Close dialog">
    <svg><!-- X icon --></svg>
  </button>

  <!-- aria-labelledby: Reference đến label element -->
  <h2 id="dialog-title">Confirm Action</h2>
  <div role="dialog" aria-labelledby="dialog-title">
    <!-- dialog content -->
  </div>

  <!-- aria-describedby: Additional description -->
  <input type="password" aria-describedby="password-hint" />
  <div id="password-hint">Password must be at least 8 characters</div>

  <!-- aria-hidden: Hide from screen readers -->
  <span aria-hidden="true">★</span>
  <span class="sr-only">Rating: 4 out of 5</span>
</template>
```

#### **ARIA States**

```vue
<template>
  <!-- aria-expanded: Expandable elements -->
  <button
    aria-expanded="isOpen"
    aria-controls="dropdown-menu"
    @click="isOpen = !isOpen"
  >
    Menu
  </button>
  <ul id="dropdown-menu" :hidden="!isOpen">
    <li>Item 1</li>
  </ul>

  <!-- aria-selected: Selection state -->
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

  <!-- aria-checked: Checkbox/radio state -->
  <div
    role="checkbox"
    :aria-checked="isChecked"
    @click="isChecked = !isChecked"
  >
    Accept terms
  </div>

  <!-- aria-disabled: Disabled state -->
  <button :aria-disabled="isProcessing" :disabled="isProcessing">Submit</button>

  <!-- aria-invalid: Validation state -->
  <input
    v-model="email"
    :aria-invalid="!isValidEmail"
    aria-describedby="email-error"
  />
  <span v-if="!isValidEmail" id="email-error" role="alert">
    Invalid email format
  </span>
</template>
```

#### **Live Regions**

```vue
<template>
  <!-- aria-live: Announce dynamic content changes -->
  <div aria-live="polite" aria-atomic="true">
    {{ statusMessage }}
  </div>

  <!-- polite: Wait for user to finish -->
  <!-- assertive: Interrupt immediately -->
  <div aria-live="assertive" role="alert">
    {{ errorMessage }}
  </div>

  <!-- aria-atomic: Read entire content vs only changes -->
  <div aria-live="polite" aria-atomic="false">Items: {{ itemCount }}</div>
</template>
```

---

### 6.2. Keyboard Navigation

**Câu trả lời chuẩn Senior:**

#### **Focusable Elements**

```vue
<template>
  <!-- Native focusable: button, a, input, select, textarea -->
  <button>Click me</button>

  <!-- Make div focusable -->
  <div tabindex="0" role="button" @keypress.enter="handleClick">
    Custom button
  </div>

  <!-- tabindex values:
       0: Natural tab order
       -1: Programmatically focusable, not in tab order
       1+: Custom tab order (avoid, breaks natural flow) -->

  <!-- Skip in tab order -->
  <div tabindex="-1">Not tabbable but focusable via JS</div>
</template>
```

#### **Keyboard Event Handling**

```vue
<template>
  <div
    role="button"
    tabindex="0"
    @click="handleAction"
    @keydown.enter="handleAction"
    @keydown.space.prevent="handleAction"
  >
    Activate
  </div>

  <!-- Escape to close -->
  <div v-if="isOpen" role="dialog" @keydown.esc="close">Modal content</div>

  <!-- Arrow key navigation -->
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

#### **Focus Management**

```vue
<script setup>
import { ref, onMounted, watch } from "vue";

const dialogRef = ref(null);
const previousFocus = ref(null);

const openDialog = () => {
  // Save current focus
  previousFocus.value = document.activeElement;

  isOpen.value = true;

  // Focus dialog
  nextTick(() => {
    dialogRef.value?.focus();
  });
};

const closeDialog = () => {
  isOpen.value = false;

  // Restore focus
  previousFocus.value?.focus();
};

// Trap focus inside dialog
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
    <!-- Dialog content -->
  </div>
</template>
```

---

### 6.3. Semantic HTML

**Câu trả lời chuẩn Senior:**

```vue
<template>
  <!-- ❌ BAD: Div soup -->
  <div class="header">
    <div class="nav">
      <div class="nav-item">Home</div>
    </div>
  </div>
  <div class="content">
    <div class="article">
      <div class="title">Article Title</div>
    </div>
  </div>

  <!-- ✅ GOOD: Semantic HTML -->
  <header>
    <nav>
      <a href="/">Home</a>
    </nav>
  </header>

  <main>
    <article>
      <h1>Article Title</h1>
      <section>
        <h2>Section Heading</h2>
        <p>Content</p>
      </section>
    </article>

    <aside>
      <h2>Related</h2>
    </aside>
  </main>

  <footer>
    <p>&copy; 2024</p>
  </footer>
</template>
```

#### **Heading Hierarchy**

```vue
<template>
  <!-- ✅ GOOD: Proper hierarchy -->
  <h1>Page Title</h1>
  <h2>Section</h2>
  <h3>Subsection</h3>
  <h2>Another Section</h2>

  <!-- ❌ BAD: Skipping levels -->
  <h1>Title</h1>
  <h4>Subsection</h4>
  <!-- Skipped h2, h3 -->

  <!-- ❌ BAD: Using headings for styling -->
  <h3 class="small-text">This should be paragraph</h3>

  <!-- ✅ GOOD: Use CSS for styling -->
  <h2 class="text-sm">Proper heading, styled small</h2>
</template>
```

---

### 6.4. WCAG Guidelines

**Câu trả lời chuẩn Senior:**

WCAG (Web Content Accessibility Guidelines) có 3 levels: A, AA (target), AAA.

#### **Color Contrast**

```
Minimum contrast ratios (WCAG AA):
- Normal text: 4.5:1
- Large text (18pt+): 3:1
- UI components: 3:1
```

```vue
<template>
  <!-- ❌ BAD: Low contrast -->
  <div style="color: #999; background: #fff;">Hard to read (2.8:1)</div>

  <!-- ✅ GOOD: Sufficient contrast -->
  <div style="color: #333; background: #fff;">Easy to read (12.6:1)</div>

  <!-- Use tools: Chrome DevTools, WebAIM Contrast Checker -->
</template>
```

#### **Form Accessibility**

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <!-- ✅ Associate labels with inputs -->
    <label for="email">Email:</label>
    <input
      id="email"
      v-model="email"
      type="email"
      required
      aria-describedby="email-hint"
      :aria-invalid="emailError ? 'true' : 'false'"
    />
    <span id="email-hint" class="hint">We'll never share your email</span>
    <span v-if="emailError" role="alert" class="error">
      {{ emailError }}
    </span>

    <!-- ✅ Fieldset for related inputs -->
    <fieldset>
      <legend>Contact Preference</legend>
      <label>
        <input type="radio" name="contact" value="email" />
        Email
      </label>
      <label>
        <input type="radio" name="contact" value="phone" />
        Phone
      </label>
    </fieldset>

    <!-- ✅ Required indication -->
    <label for="name">
      Name <abbr title="required" aria-label="required">*</abbr>
    </label>
    <input id="name" required aria-required="true" />

    <button type="submit">Submit</button>
  </form>
</template>
```

#### **Image Accessibility**

```vue
<template>
  <!-- ✅ Descriptive alt text -->
  <img src="chart.png" alt="Sales chart showing 20% increase in Q4 2024" />

  <!-- ✅ Decorative images -->
  <img src="decoration.png" alt="" role="presentation" />

  <!-- ✅ Complex images -->
  <img
    src="complex-diagram.png"
    alt="System architecture"
    aria-describedby="diagram-desc"
  />
  <div id="diagram-desc">
    <p>Detailed description of the system architecture showing...</p>
  </div>

  <!-- ✅ Icon with text -->
  <button>
    <svg aria-hidden="true"><!-- Icon --></svg>
    <span>Delete</span>
  </button>

  <!-- ✅ Icon only button -->
  <button aria-label="Delete item">
    <svg aria-hidden="true"><!-- Trash icon --></svg>
  </button>
</template>
```

---


---

[← Back to Overview](../README.md)
