# Accessibility (A11y)

Senior **ship component accessible** và **đi được một modal**: mở, trap focus, Escape, restore focus, announce title, không thả user vào khoảng trống. Interviewer không chấm flashcard trivia ARIA. Họ chấm bạn có với **native HTML trước**, có test vượt “axe xanh,” và PR design-system có qua được review của bạn.

**First rule of ARIA:** đừng dùng ARIA nếu native element đã làm việc đó. Tutorial lấy `<div role="button">` làm ví dụ cơ bản đang dạy **anti-pattern**. Vue 3 + TS trước; cùng rule cho React Testing Library / Next.

---

## Table of Contents

1. [Thuộc tính ARIA](#111-thuộc-tính-aria)

2. [Điều hướng bằng bàn phím](#112-điều-hướng-bằng-bàn-phím)

3. [HTML Ngữ nghĩa](#113-html-ngữ-nghĩa)

4. [Hướng dẫn WCAG](#114-hướng-dẫn-wcag)

5. [Test a11y trong CI và PR design system](#115-test-a11y-trong-ci-và-pr-design-system)

---

## 11. Accessibility (A11y)

### 11.1. Thuộc tính ARIA

**Họ thực sự hỏi gì**

- ARIA để làm gì? `aria-label` vs `aria-labelledby`? Khi nào set `role`?
- Họ có thể đưa `<div role="button">` và đợi bạn reject.

**Cách senior trả lời**

- **Quyết định:** **Native HTML trước** (`button`, `a`, `input`, `dialog`, `select`). ARIA cung **name, role, và value** khi bạn dựng widget HTML không có (tab, combobox, tree). Mọi ARIA widget là **keyboard contract bạn giờ own**. Prefer primitive Headless UI / Radix / Reka / Vuestic hơn `role="listbox"` tự chế.
- **Ràng buộc:** ARIA không tạo hành vi. `role="button"` thiếu Enter/Space, focus style, và semantics disabled là button giả fail WCAG 2.1.1.
- **Failure mode:** `<div role="button">` làm default. `aria-label` **override** text hiện và nói dối. `aria-hidden="true"` trên control đang live focusable. Duplicate native semantics (`<button role="button">`). Dùng ARIA “sửa” heading structure gãy.
- **Đo:** Accname trong DevTools. axe + keyboard + một pass screen-reader (11.4 / 11.5). Name/role/value cho mọi custom widget.

**Anti-pattern (gọi ra)**

```vue
<!-- Do not do this. You inherited click, not keyboard, focus ring, or forms. -->
<div role="button" tabindex="0" @click="submit">Submit</div>
```

```vue
<!-- Native button: role, keyboard, submit, disabled, form implicit all come free. -->
<button type="submit" :disabled="saving">
  {{ saving ? "Saving" : "Submit" }}
</button>
```

Icon-only là chỗ ARIA hợp lệ — **name** thiếu trên native button:

```vue
<button type="button" aria-label="Close dialog" @click="close">
  <svg aria-hidden="true"><!-- X --></svg>
</button>
```

**Name / role / value**

- **Name:** AT đọc — contents, `aria-labelledby` (prefer khi text đã trên màn), `aria-label` (khi không có visible name).
- **Role:** nó là gì. Native thắng `role=`.
- **Value/state:** `aria-expanded`, `aria-selected`, `aria-checked`, `aria-invalid`, `aria-current`, `aria-disabled` (prefer `disabled` thật trên native control).

**Khi ARIA chính đáng**

- Tab, combobox, grid, menu button — theo pattern **ARIA Authoring Practices**, đừng invent.
- **Live region** cho toast và async status (`aria-live="polite"`), lỗi phải ngắt (`role="alert"`).
- `aria-describedby` cho lỗi field và gợi ý password (wire **id**, không `<p>` gần đó mong SR để ý).

```vue
<button
  type="button"
  :aria-expanded="open"
  aria-controls="user-menu"
  @click="open = !open"
>
  Account
</button>
<ul v-show="open" id="user-menu" role="menu">
  <!-- menuitems, roving tabindex — see 11.2 -->
</ul>
```

**Ghi chú Vue**

- Bind state: `:aria-expanded="open"` (boolean serialize đúng). Đừng `aria-expanded="isOpen"` như string tĩnh.
- `aria-hidden` trên SVG trang trí; không bao giờ trên modal đang focused.

**Tradeoff**

- `aria-label` vs visible text: visible text thắng với user không chạy AT; giữ chúng sync.
- Custom widget vs native `<select>`: native xấu và accessible; custom có brand và đắt.

**Gotcha production**

- Vue Router `<RouterLink>` là `<a>` khi có `to` — giữ vậy; `@click.prevent` sang `div` là mất nó.
- `placeholder` không phải name.
- `aria-invalid="false"` vẫn bị một số SR announce — omit attribute đến khi invalid.

**Câu hỏi nối**

- Khác `aria-labelledby` vs `aria-describedby` (name vs extra).
- React: cùng first rule; `eslint-plugin-jsx-a11y` vs `eslint-plugin-vuejs-accessibility`.

---

### 11.2. Điều hướng bằng bàn phím

**Họ thực sự hỏi gì**

- “Đi một modal giúp.”
- Focus trap, restore, roving tabindex, skip link.
- Đây là section tách senior.

**Cách senior trả lời**

- **Quyết định:** User keyboard phải với **mọi pointer action**. Tab order là **DOM order** (`tabindex="0"` hiếm, `tabindex > 0` không bao giờ). Modal: **chuyển focus vào, trap, Escape đóng, restore về opener**. Composite widget (tab, listbox, menu): **roving tabindex** (một `tabindex="0"`, sibling `-1`, mũi tên di chuyển). Skip link là focusable đầu tiên trong document.
- **Ràng buộc:** Test jsdom không chứng minh focus trap. Chứng minh bằng Playwright + browser thật (và một pass tay).
- **Failure mode:** Focus kẹt trên button `display: none`. Trap bằng `keydown` Tab miss Shadow DOM / Vue Teleport. Mở modal không lưu `document.activeElement`. `tabindex="1"` “cho dễ.” Dropdown chỉ chạy lúc hover.
- **Đo:** Full keyboard pass checkout. Modal: Tab không bao giờ đụng page phía sau. Screen reader: focus không mất lúc đóng.

**Đi một modal (nói như script)**

1. User kích hoạt **Open** (`<button>` thật). Lưu element đó.
2. Render qua **Teleport ra `body`**. Dùng native `<dialog>` `showModal()` khi được — nó cho focus trap, `::backdrop`, và Esc trên browser hỗ trợ. Polyfill: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` trỏ title hiện.
3. `nextTick` rồi focus **control có nghĩa đầu tiên** (close, hoặc field chính — lựa chọn product; đừng luôn dump focus lên heading trừ khi heading `tabindex="-1"`).
4. **Trap:** Tab / Shift+Tab vòng bên trong. Click backdrop có thể đóng nếu đó là design; focus ở trong đến khi đóng.
5. **Escape** đóng (và không đóng listener khác của page trước — `stopPropagation` cẩn thận).
6. Destroy/unmount, rồi **`opener.focus()`**. Opener mất (list re-render) thì focus fallback hợp lý.

```vue
<script setup lang="ts">
import { nextTick, ref, watch } from "vue";

const open = ref(false);
const dialog = ref<HTMLDialogElement | null>(null);
const opener = ref<HTMLElement | null>(null);

watch(open, async (v) => {
  if (v) {
    opener.value = document.activeElement as HTMLElement;
    await nextTick();
    dialog.value?.showModal();
  } else {
    dialog.value?.close();
    opener.value?.focus();
  }
});
</script>

<template>
  <button type="button" @click="open = true">Edit billing</button>
  <dialog ref="dialog" aria-labelledby="billing-title" @close="open = false">
    <h2 id="billing-title">Edit billing</h2>
    <!-- fields -->
    <button type="button" @click="open = false">Cancel</button>
  </dialog>
</template>
```

Không dùng `<dialog>` được thì VueUse `useFocusTrap` / primitive DS là quyết định production — đừng ship handler Tab 20 dòng miss `[tabindex="-1"]` sai.

**Roving tabindex**

Listbox hoặc tab: chỉ item active nằm trong tab sequence. Phím mũi tên dời `tabindex` và gọi `.focus()`. Home/End. Typeahead nếu list dài. Đừng nhét mọi hàng vào tab order (50 tab mới ra khỏi table).

**Skip link**

```vue
<a href="#main" class="skip-link">Skip to main content</a>
<!-- visually hidden until focus -->
<main id="main" tabindex="-1">
```

`tabindex="-1"` trên `main` để hash focus chạy. Ghép **một `<h1>`**.

**Tradeoff**

- Native `<dialog>` vs custom: native thắng a11y; style `::backdrop` và top-layer stacking là cost.
- Focus trap vs tooltip: tooltip **không** trap; chúng dùng `Escape` và focus ở lại trigger.

**Gotcha production**

- Vue `v-if` trên dialog **destroy** reference opener nếu opener nằm bên trong — lưu element, không ref unmount.
- Inert background: `aria-modal` không đủ trên SR cũ; `inert` trên sibling `#app` hoặc native top layer.
- Dropdown trong modal: mũi tên widget trong vs trap — chặn widget trong `preventDefault` trên Tab.
- Đổi route SPA: chuyển focus tới wrapper (`tabindex="-1"`) để user SR không kẹt footer cũ.

**Câu hỏi nối**

- Test trên CI thế nào? (Playwright Tab key thật — 11.5.)
- `focus-visible` vs outline `:focus` bị design gỡ — restore `:focus-visible` là comment review senior.

---

### 11.3. HTML Ngữ nghĩa

**Họ thực sự hỏi gì**

- Landmark, heading outline, list vs div. “Sao không ARIA role trên div?”

**Cách senior trả lời**

- **Quyết định:** Accessibility tree phải trông như **document**: `header` / `nav` / `main` / `aside` / `footer`, một `main`, **heading outline logic**, list cho list, table cho table, button cho action, link cho navigation. Semantics cho keyboard và hành vi SR **miễn phí**. Landmark ARIA (`role="navigation"`) là backup khi không đổi được tag — không default design system.
- **Ràng buộc:** Layout marketing và CSS grid đẩy người ta vào div soup. Bạn vẫn wrap soup trong landmark được.
- **Failure mode:** Bốn `<h1>`. Heading skip vì “style là `text-xl`.” Menu `<div @click>`. Table làm từ div không navigate theo cell. Nhiều `main` sau khi Vue layout nest page.
- **Đo:** Accessibility tree trong Chrome. Headings map trong axe / headings extension. Landmark list trong VoiceOver rotor / NVDA elements list.

```vue
<template>
  <a href="#main" class="skip-link">Skip to main content</a>
  <header>
    <nav aria-label="Primary">
      <ul>
        <li><RouterLink to="/">Home</RouterLink></li>
      </ul>
    </nav>
  </header>
  <main id="main">
    <h1>Invoices</h1>
    <section aria-labelledby="overdue-heading">
      <h2 id="overdue-heading">Overdue</h2>
      <ul>
        <li v-for="inv in overdue" :key="inv.id">{{ inv.number }}</li>
      </ul>
    </section>
  </main>
</template>
```

**Heading outline**

- Một `<h1>` mỗi view (page title sau đổi route).
- Đừng skip level vì look. Style bằng CSS (`text-sm` trên `h2` hợp pháp; `h4` vì nó nhỏ thì không).
- Card trong grid: `h2`/`h3` nhất quán, không mỗi card một `h1`.

**List**

Nếu là list invoice, nó là `<ul>`/`<ol>` (hoặc `<table>` có header). User SR nhảy theo list. Div buộc đọc tuyến tính.

**Tradeoff**

- `<section>` không heading là landmark yếu — prefer section có label hoặc bỏ tag.
- `<article>` cho item syndicated, không mọi card.

**Gotcha production**

- Nuxt layout: `main` ở layout **hoặc** page, không cả hai.
- List `RouterLink` thiếu `<ul>/<li>` — thêm; CSS `flex` vẫn chạy.
- Nav chỉ SVG không accessible name trên `<nav>`.

**Câu hỏi nối**

- Dashboard widget thế nào? (Mỗi widget một `section` với heading; đừng nest `article` vì mốt.)
- View PDF/export vẫn cần heading tree nếu chúng là HTML.

---

### 11.4. Hướng dẫn WCAG

**Họ thực sự hỏi gì**

- A vs AA vs AAA; contrast; bạn thực sự test thế nào.

**Cách senior trả lời**

- **Quyết định:** **WCAG 2.2 AA là thanh hợp đồng thường** (EU EAA, nhiều lawsuit US, hầu hết RFP enterprise). AAA không phải target trải (contrast trên type trang trí lớn, v.v.). Model POUR (Perceivable, Operable, Understandable, Robust) là cách nói, không checklist đọc thuộc. **Name, role, value** (4.1.2) cộng **keyboard** (2.1.1) cộng **contrast** (1.4.3) bắt hầu hết failure frontend. Test bằng **axe + full keyboard + một pass screen-reader** — axe bắt được khoảng nửa.
- **Ràng buộc:** Design token thường ship xám-trên-trắng 3:1 cho text “hint” mà thực ra là label duy nhất. Đó là trận product bạn đưa lên design, không hack `aria-label`.
- **Failure mode:** “Chạy axe trên CI nên ta AA.” Exception contrast trên placeholder. Error state chỉ màu. Click target 24px thiếu trên mobile (2.5.8 trong 2.2). Video autoplay không pause.
- **Đo:** Audit AA trên path tiền. Contrast trong token DS. Bug count theo WCAG SC. Sign-off legal/QA trên script screen-reader, không score Lighthouse a11y.

**Contrast (AA)**

- Text thường: **4.5:1**. Text lớn (≥18pt / 14pt bold): **3:1**. UI component và graphic: **3:1** so với màu kề (1.4.11).
- Đừng trích folklore hex; đo cặp computed thật (overlay, opacity, glassmorphism fail cái này).
- Focus ring cũng là bài contrast — `outline: none` không thay `:focus-visible` fail 2.4.7.

**Form (pattern AA)**

- `<label for>` hiện (hoặc wrap). Required chỉ trong text, không chỉ màu / `*`.
- Lỗi: `aria-invalid`, `aria-describedby` cái lỗi, `role="alert"` lúc submit nếu cần ngắt.
- `<fieldset>`/`<legend>` cho radio.
- Đừng `input` thiếu `type` khớp data (email, v.v. — cũng UX mobile).

**Ảnh**

- Informative: `alt` thật. Decorative: `alt=""`. Không bao giờ omit `alt` (AT đọc filename).
- Icon button: name trên **button**, `aria-hidden` trên SVG.
- Chart: tóm tắt text hoặc data table; `alt="chart"` không phải AA cho ảnh phức tạp (1.1.1).

**Hành vi product Vue-specific**

- **Đổi route:** announce (live region hoặc focus `h1`). Vue Router afterEach + live region polite ẩn visual là pattern production; Nuxt có helper cộng đồng, Next cũng nên announce App Router navigation.
- **Toast:** `aria-live="polite"`; đừng cướp focus cho toast “saved.” Lỗi chặn task có thể `assertive` / `role="alert"`.
- **Dialog vs modal:** dialog là dialog; `aria-modal="true"` chỉ khi phần còn lại của page inert. Dialog non-modal (help persistent) **không** trap.

**Tradeoff**

- Lighthouse a11y 100 vs VoiceOver pass fail date picker — mua cái sau.
- Reduced motion (`prefers-reduced-motion`) vs animation marketing — tôn trọng media query.

**Gotcha production**

- `prefers-contrast` / forced-colors (Windows High Contrast): icon CSS `background-image` biến.
- 1.4.10 Reflow: zoom 400%, không scroll hai chiều cho text. `overflow-x: hidden` trên `body` là nhà máy bug.
- Caption vs caption YouTube auto-generate như “chúng tôi có caption.”

**Câu hỏi nối**

- Bổ sung WCAG 2.2 bạn thực sự đụng: 2.4.11 focus không bị che, 2.5.8 target size.
- Contrast AAA 7:1 — khi brand hỏi, đó là project token, không Vue directive.

---

### 11.5. Test a11y trong CI và PR design system

**Họ thực sự hỏi gì**

- “Giữ cái này khỏi thối thế nào?”
- Thứ nào thuộc CI vs thứ bạn vẫn làm tay.

**Cách senior trả lời**

- **Quyết định:** **CI bắt regression máy thấy được**; người bắt phần còn lại. Pipeline: (1) `eslint-plugin-vuejs-accessibility` (hoặc `jsx-a11y` trên Next) trên PR. (2) **axe-core** trong Vitest cho component DS và trong Playwright cho page critical (`@axe-core/playwright`). (3) Playwright **keyboard thật** trên modal/combobox. (4) Contrast visual qua token DS / screenshot, không hy vọng author nhìn hex. (5) PR design-system: Storybook story cho **keyboard, inverted contrast, reduced motion**, cộng axe + query Testing Library theo role. **Pass SR tay** (VoiceOver hoặc NVDA) trên modal/listbox DS **một lần mỗi release**, không mỗi commit.
- **Ràng buộc:** Coverage axe incomplete by design. CI không chạy VoiceOver trên mọi GitHub runner công ty (một số dùng SR cloud trả phí; hầu hết không). Đừng block merge vì widget third-party bạn không own — isolate và ticket, đừng `--disable-rule` global.
- **Failure mode:** axe xanh, nút Pay là `div`. Snapshot JSON axe không ai đọc. “Chúng tôi test a11y” nghĩa Lighthouse trong README. PR DS thêm `Drawer` mới không có focus story.
- **Đo:** Số violation axe trong Playwright trên `/checkout`. Duration keyboard journey trong script ghi. PR DS thiếu section a11y bị bounce (process metric).

**Hình CI**

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("checkout has no serious axe violations", async ({ page }) => {
  await page.goto("/checkout");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("billing dialog traps focus", async ({ page }) => {
  await page.goto("/settings");
  await page.getByRole("button", { name: "Edit billing" }).click();
  const dialog = page.getByRole("dialog", { name: "Edit billing" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Cancel" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Edit billing" })).toBeFocused();
});
```

Cấp component (Vitest + Testing Library + `jest-axe` / `vitest-axe`): assert `getByRole('button', { name: 'Close dialog' })` tồn tại. Query không được theo role thì AT cũng không.

**Thanh PR design-system**

- Widget mới: pattern APG nêu trong description (hoặc “native element, không APG”).
- Story: default, disabled, error, RTL, reduced motion, keyboard-only.
- Axe trên story (addon-a11y) **và** spec keyboard Playwright/Testing Library cho thứ có mũi tên hoặc trap.
- Contrast của token thật, không screenshot Figma.
- Không `<div role="button">` trừ exception viết ra (native gãy trên host).
- Visual regression (8.6) không thay cái này — button pixel-perfect inaccessible vẫn ship.

**Tradeoff**

- `expect(violations).toEqual([])` chặt vs allowlist `color-contrast` trên page branded sprint này chưa fix. Allowlist **theo route + rule + expiry**, không skip global.
- Automation SR trả phí vs pass người theo quý. Hầu hết team Vue, pass người trên DS + checkout là plan senior.

**Gotcha production**

- axe trong jsdom miss contrast (cần computed style) — chạy contrast trong Playwright hoặc Storybook.
- False positive trên Vue Teleport/overlay nếu scan trước khi dialog mở.
- i18n: test query tên English gãy trên CI FR — dùng fixture `lang` hoặc role + i18n key qua `name` regex từ message catalog.
- Widget chat third-party fail axe mãi; exclude iframe của chúng, đừng tắt axe.

**Câu hỏi nối**

- Ai own bug a11y — team DS hay product? (DS cho primitive; product cho composition và copy.)
- Introduce vào app Vue legacy thế nào? (Playwright + axe trên login/checkout trước, như 8.6; eslint warn→error.)

---

[← Back to Overview](../../README.md)
