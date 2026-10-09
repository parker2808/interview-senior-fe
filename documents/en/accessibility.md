# Accessibility (A11y)

Seniors **ship accessible components** and can **walk a modal**: open, trap focus, Escape, restore focus, announce the title, not drop the user into the void. Interviewers are not scoring ARIA trivia flashcards. They are scoring whether you reach for **native HTML first**, whether you can test beyond “axe was green,” and whether a design-system PR would pass your review.

**First rule of ARIA:** do not use ARIA if a native element already does the job. A tutorial that shows `<div role="button">` as the basic example is teaching an **anti-pattern**. Vue 3 + TS first; the same rules apply to React Testing Library / Next.

---

## Table of Contents

1. [ARIA Attributes](#111-aria-attributes)

2. [Keyboard Navigation](#112-keyboard-navigation)

3. [Semantic HTML](#113-semantic-html)

4. [WCAG Guidelines](#114-wcag-guidelines)

5. [Testing A11y in CI and Design-System PRs](#115-testing-a11y-in-ci-and-design-system-prs)

---

## 11. Accessibility (A11y)

### 11.1. ARIA Attributes

**What they actually ask**

- What is ARIA for? `aria-label` vs `aria-labelledby`? When do you set `role`?
- They may show a `<div role="button">` and wait for you to reject it.

**How a senior answers**

- **Decision:** **Native HTML first** (`button`, `a`, `input`, `dialog`, `select`). ARIA supplies **name, role, and value** when you build a widget HTML does not have (tabs, combobox, tree). Every ARIA widget is a **keyboard contract you now own**. Prefer Headless UI / Radix / Reka / Vuestic primitives over hand-rolled `role="listbox"`.
- **Constraint:** ARIA does not create behavior. `role="button"` without Enter/Space, focus styles, and disabled semantics is a fake button that fails WCAG 2.1.1.
- **Failure mode:** `<div role="button">` as the default. `aria-label` that **overrides** visible text and lies. `aria-hidden="true"` on a live focusable control. Duplicating native semantics (`<button role="button">`). Using ARIA to “fix” a broken heading structure.
- **Measure:** Accname computation in DevTools. axe + keyboard + one screen-reader pass (11.4 / 11.5). Name/role/value for every custom widget.

**Anti-pattern (call this out)**

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

Icon-only is a valid ARIA use — the **name** is missing on a native button:

```vue
<button type="button" aria-label="Close dialog" @click="close">
  <svg aria-hidden="true"><!-- X --></svg>
</button>
```

**Name / role / value**

- **Name:** what AT speaks — contents, `aria-labelledby` (preferred when the text is on screen), `aria-label` (when there is no visible name).
- **Role:** what it is. Native beats `role=`.
- **Value/state:** `aria-expanded`, `aria-selected`, `aria-checked`, `aria-invalid`, `aria-current`, `aria-disabled` (prefer real `disabled` on native controls).

**When ARIA is justified**

- Tabs, combobox, grid, menu button — follow the **ARIA Authoring Practices** pattern, do not invent.
- **Live regions** for toasts and async status (`aria-live="polite"`), errors that must interrupt (`role="alert"`).
- `aria-describedby` for field errors and password hints (wire the **id**, not a nearby `<p>` you hope the SR notices).

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

**Vue notes**

- Bind states: `:aria-expanded="open"` (boolean is serialized correctly). Do not `aria-expanded="isOpen"` as a static string.
- `aria-hidden` on decorative SVG; never on the modal currently focused.

**Tradeoffs**

- `aria-label` vs visible text: visible text wins for users who do not run AT; keep them in sync.
- Custom widget vs native `<select>`: native is ugly and accessible; custom is branded and expensive.

**Production gotchas**

- Vue Router `<RouterLink>` is an `<a>` when it has `to` — keep it that way; `@click.prevent` to a `div` loses it.
- `placeholder` is not a name.
- `aria-invalid="false"` is still announced by some SRs — omit the attribute until invalid.

**Follow-ups**

- Difference `aria-labelledby` vs `aria-describedby` (name vs extra).
- React: same first rule; `eslint-plugin-jsx-a11y` vs `eslint-plugin-vuejs-accessibility`.

---

### 11.2. Keyboard Navigation

**What they actually ask**

- “Walk me through a modal.”
- Focus trap, restore, roving tabindex, skip links.
- This is the section that separates seniors.

**How a senior answers**

- **Decision:** Keyboard users must reach **every pointer action**. Tab order is **DOM order** (`tabindex="0"` rare, `tabindex > 0` never). Modals: **move focus in, trap it, Escape closes, restore to the opener**. Composite widgets (tabs, listbox, menus): **roving tabindex** (one `tabindex="0"`, siblings `-1`, arrows move). Skip links as the first focusable in the document.
- **Constraint:** jsdom tests will not prove focus trap. Prove it in Playwright + a real browser (and a manual pass).
- **Failure mode:** Focus left on a `display: none` button. Trap implemented with `keydown` on Tab that misses Shadow DOM / Vue Teleport. Opening a modal without storing `document.activeElement`. `tabindex="1"` “to help.” Dropdown that only works on hover.
- **Measure:** Full keyboard pass of checkout. Modal: Tab never hits the page behind. Screen reader: focus is not lost on close.

**Walk a modal (say this as a script)**

1. User activates **Open** (a real `<button>`). Store that element.
2. Render via **Teleport to `body`**. Use native `<dialog>` `showModal()` when you can — it gives focus trap, `::backdrop`, and Esc in supported browsers. If you polyfill: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the visible title.
3. `nextTick` then focus the **first meaningful control** (close, or the primary field — product choice; do not always dump focus on the heading unless that heading is `tabindex="-1"`).
4. **Trap:** Tab / Shift+Tab cycle inside. Click on backdrop may close if that is the design; focus stays inside until close.
5. **Escape** closes (and does not close the page’s other listeners first — `stopPropagation` with care).
6. Destroy/unmount, then **`opener.focus()`**. If the opener is gone (list re-render), focus a sensible fallback.

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

If you cannot use `<dialog>`, VueUse `useFocusTrap` / a DS primitive is the production decision — do not ship a 20-line Tab handler that skips `[tabindex="-1"]` incorrectly.

**Roving tabindex**

For a listbox or tabs, only the active item is in the tab sequence. Arrow keys move `tabindex` and call `.focus()`. Home/End. Typeahead if it is a long list. Do not put every row in the tab order (50 tabs to leave the table).

**Skip links**

```vue
<a href="#main" class="skip-link">Skip to main content</a>
<!-- visually hidden until focus -->
<main id="main" tabindex="-1">
```

`tabindex="-1"` on `main` so hash focus works. Pair with **one `<h1>`**.

**Tradeoffs**

- Native `<dialog>` vs custom: native wins a11y; styling `::backdrop` and top-layer stacking are the cost.
- Focus trap vs tooltips: tooltips should **not** trap; they use `Escape` and focus stays on the trigger.

**Production gotchas**

- Vue `v-if` on the dialog **destroys** the opener reference if the opener was inside — store the element, not a ref that unmounts.
- Inert background: `aria-modal` is not enough on old SRs; `inert` on `#app` siblings or native top layer.
- Dropdown in a modal: inner widget arrows vs trap — stop the inner widget from `preventDefault` on Tab.
- SPA route change: move focus to a wrapper (`tabindex="-1"`) so SR users are not stuck in the old footer.

**Follow-ups**

- How do you test this in CI? (Playwright real Tab keys — 11.5.)
- `focus-visible` vs `:focus` outlines removed by design — restoring `:focus-visible` is a senior review comment.

---

### 11.3. Semantic HTML

**What they actually ask**

- Landmarks, heading outline, lists vs divs. “Why not just ARIA roles on divs?”

**How a senior answers**

- **Decision:** The accessibility tree should look like a **document**: `header` / `nav` / `main` / `aside` / `footer`, one `main`, a **logical heading outline**, lists for lists, tables for tables, buttons for actions, links for navigation. Semantics give you keyboard and SR behavior **for free**. ARIA landmarks (`role="navigation"`) are backups when you cannot change the tag — not the design system default.
- **Constraint:** Marketing layouts and CSS grids push people into div soup. You can still wrap the soup in landmarks.
- **Failure mode:** Four `<h1>`s. Headings skipped because “the style is `text-xl`.” `<div @click>` menus. Tables made of divs that cannot be navigated by cell. Multiple `main`s after Vue layouts nest pages.
- **Measure:** Accessibility tree in Chrome. Headings map in axe / headings extension. Landmark list in VoiceOver rotor / NVDA elements list.

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

- One `<h1>` per view (the page title after a route change).
- Do not skip levels for look. Style with CSS (`text-sm` on an `h2` is legal; an `h4` because it is small is not).
- Cards in a grid: `h2`/`h3` consistent, not every card an `h1`.

**Lists**

If it is a list of invoices, it is a `<ul>`/`<ol>` (or a `<table>` with headers). SR users jump by list. Divs force linear read.

**Tradeoffs**

- `<section>` without a heading is a weak landmark — prefer labelled sections or skip the tag.
- `<article>` for syndicated items, not every card.

**Production gotchas**

- Nuxt layouts: `main` in the layout **or** the page, not both.
- `RouterLink` lists without `<ul>/<li>` — add them; CSS `flex` still works.
- SVG-only nav with no accessible name on the `<nav>`.

**Follow-ups**

- How do you handle a dashboard of widgets? (Each widget a `section` with its heading; do not nest `article` for fashion.)
- PDF/export views still need a heading tree if they are HTML.

---

### 11.4. WCAG Guidelines

**What they actually ask**

- A vs AA vs AAA; contrast; how you actually test.

**How a senior answers**

- **Decision:** **WCAG 2.2 AA is the usual contractual bar** (EU EAA, many US lawsuits, most enterprise RFPs). AAA is not a blanket target (contrast on large decorative type, etc.). The POUR model (Perceivable, Operable, Understandable, Robust) is how you talk, not a checklist you recite. **Name, role, value** (4.1.2) plus **keyboard** (2.1.1) plus **contrast** (1.4.3) catch most frontend failures. Test with **axe + full keyboard + one screen-reader pass** — axe finds maybe half.
- **Constraint:** Design tokens often ship 3:1 gray-on-white for “hint” text that is actually the only label. That is a product fight you take to design, not a `aria-label` hack.
- **Failure mode:** “We run axe in CI so we are AA.” Contrast exceptions on placeholder text. Color-only error states. 24px click targets missing on mobile (2.5.8 in 2.2). Autoplaying video with no pause.
- **Measure:** AA audit on the money paths. Contrast in the DS tokens. Bug count by WCAG SC. Legal/QA sign-off on a screen-reader script, not a Lighthouse a11y score.

**Contrast (AA)**

- Normal text: **4.5:1**. Large text (≥18pt / 14pt bold): **3:1**. UI components and graphics: **3:1** against adjacent colors (1.4.11).
- Do not quote hex folklore; measure the actual computed pair (overlays, opacity, glassmorphism fail this).
- Focus rings are a contrast problem too — `outline: none` without a `:focus-visible` replacement fails 2.4.7.

**Forms (AA patterns)**

- Visible `<label for>` (or wrap). Required indicated in text, not only color / `*`.
- Errors: `aria-invalid`, `aria-describedby` the error, `role="alert"` on submit if you need interrupt.
- `<fieldset>`/`<legend>` for radios.
- Do not use `input` without `type` that matches the data (email, etc. — also mobile UX).

**Images**

- Informative: real `alt`. Decorative: `alt=""`. Never omit `alt` (AT reads the filename).
- Icon button: name on the **button**, `aria-hidden` on the SVG.
- Charts: text summary or a data table; `alt="chart"` is not AA for a complex image (1.1.1).

**Vue-specific product behavior**

- **Route changes:** announce (live region or focus the `h1`). Vue Router afterEach + a visually hidden polite live region is a production pattern; Nuxt has community helpers, Next should announce App Router navigations too.
- **Toasts:** `aria-live="polite"`; do not steal focus for a “saved” toast. Errors that block a task may be `assertive` / `role="alert"`.
- **Dialog vs modal:** a dialog is a dialog; `aria-modal="true"` only when the rest of the page is inert. Non-modal dialogs (e.g. persistent help) must **not** trap.

**Tradeoffs**

- Lighthouse a11y 100 vs a VoiceOver pass that fails the date picker — buy the latter.
- Reduced motion (`prefers-reduced-motion`) vs marketing animations — honor the media query.

**Production gotchas**

- `prefers-contrast` / forced-colors (Windows High Contrast): CSS `background-image` icons vanish.
- 1.4.10 Reflow: 400% zoom, no two-dimensional scrolling for text. `overflow-x: hidden` on `body` is a bug factory.
- Captions vs auto-generated YouTube captions as “we have captions.”

**Follow-ups**

- WCAG 2.2 additions you actually hit: 2.4.11 focus not obscured, 2.5.8 target size.
- AAA contrast 7:1 — when a brand asks, it is a token project, not a Vue directive.

---

### 11.5. Testing A11y in CI and Design-System PRs

**What they actually ask**

- “How do you keep this from rotting?”
- What belongs in CI vs what you still do by hand.

**How a senior answers**

- **Decision:** **CI catches regressions machines can see**; humans catch the rest. Pipeline: (1) `eslint-plugin-vuejs-accessibility` (or `jsx-a11y` on Next) on PRs. (2) **axe-core** in Vitest for DS components and in Playwright for critical pages (`@axe-core/playwright`). (3) Playwright **real keyboard** on modal/combobox. (4) Visual contrast via DS tokens / screenshot, not by hoping authors eyeball hex. (5) Design-system PR: Storybook stories for **keyboard, inverted contrast, reduced motion**, plus the axe + RTL Testing Library queries by role. A **manual SR pass** (VoiceOver or NVDA) on the DS modal/listbox **once per release**, not every commit.
- **Constraint:** axe coverage is incomplete by design. CI cannot run VoiceOver in every company GitHub runner (some use paid cloud SR; most do not). Do not block merge on a known third-party widget you do not own — isolate and ticket, do not `--disable-rule` globally.
- **Failure mode:** axe green, Pay button is a `div`. Snapshotting axe JSON nobody reads. “We test a11y” meaning Lighthouse in a README. DS PR that adds a new `Drawer` with no focus story.
- **Measure:** Number of axe violations in Playwright on `/checkout`. Keyboard journey duration in a recorded script. DS PRs missing an a11y section get bounced (process metric).

**CI shape**

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

Component-level (Vitest + Testing Library + `jest-axe` / `vitest-axe`): assert `getByRole('button', { name: 'Close dialog' })` exists. If you cannot query it by role, neither can AT.

**Design-system PR bar**

- New widget: APG pattern named in the description (or “native element, no APG”).
- Stories: default, disabled, error, RTL, reduced motion, keyboard-only.
- Axe on the story (addon-a11y) **and** a Playwright/Testing Library keyboard spec for anything with arrows or a trap.
- Contrast of the actual tokens, not the Figma screenshot.
- No `<div role="button">` unless there is a written exception (broken native in a host).
- Visual regression (8.6) does not replace this — a pixel-perfect inaccessible button still ships.

**Tradeoffs**

- Strict `expect(violations).toEqual([])` vs allowlisting `color-contrast` on a branded page you cannot fix this sprint. Allowlist **per route + rule + expiry**, never a global skip.
- Paid SR automation vs a quarterly human pass. For most Vue teams the human pass on DS + checkout is the senior plan.

**Production gotchas**

- axe in jsdom misses contrast (needs computed style) — run contrast in Playwright or on Storybook.
- False positives on Vue Teleport/overlays if you scan before the dialog is open.
- i18n: tests that query English names break in FR CI — use `lang` fixtures or role + i18n keys via `name` regex from the message catalog.
- Third-party chat widgets fail axe forever; exclude their iframe, do not disable axe.

**Follow-ups**

- Who owns a11y bugs — DS team or product? (DS for primitives; product for composition and copy.)
- How would you introduce this to a legacy Vue app? (Playwright + axe on login/checkout first, same as 8.6; eslint as warn→error.)

---

[← Back to Overview](../../README-en.md)
