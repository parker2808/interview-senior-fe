# CSS Layout

Senior CSS interviews are not a Flexbox cheat sheet. They watch whether you can explain why a modal painted under a sticky header, why a flex child refused to shrink, why a page jumped 40px when images loaded, and whether you would actually use Grid for the **page** and Flex for the **toolbar**. Layout is production: stacking contexts, intrinsic sizing, CLS, `100vh` on mobile, and tokens that survive a dark theme.

Answer with a decision (Grid vs Flex vs flow), a constraint (content min-size, containing block, user zoom), a failure mode (overflow, clipped focus, layout shift), and how you measure (CLS in CrUX, overlay in DevTools, a reduced test case).

---

## Table of Contents

1. [Flexbox](#31-flexbox)

2. [CSS Grid](#32-css-grid)

3. [Flexbox vs Grid](#33-when-to-use-flexbox-vs-grid)

4. [Responsive Design Strategy](#34-responsive-design-strategy)

5. [Stacking Context and z-index](#35-stacking-context-and-z-index)

6. [Intrinsic Sizing and Overflow](#36-intrinsic-sizing-and-overflow)

7. [Modern Layout: subgrid, :has, Cascade Layers](#37-modern-layout-subgrid-has-cascade-layers)

---

## 3. CSS Layout

### 3.1. Flexbox

**What they actually ask**

A toolbar: logo left, nav in the middle, actions right. On small screens the nav overflows instead of shrinking. Or: a card row where one long unbreakable SKU stretches the whole row. They are probing **`min-width: auto`**, `gap` vs margin, and wrapping — not `justify-content` trivia.

**How a senior answers**

Flex is for **one axis** of distribution: a nav, a form row, a cluster of buttons, space-between header chrome. Decision: `display: flex; gap: …; min-width: 0` on the child that must shrink (text, search input, the middle nav). Constraint: a flex item’s default `min-width: auto` is the minimum of its content — it will not shrink below that, so `flex: 1` on a child with a long word does **not** prevent overflow. Failure mode: using `margin-left: auto` hacks plus `:last-child` margins that break when Vue adds a badge; `gap` exists for this. Measure: overflow in DevTools (scrollWidth vs clientWidth), and a keyboard pass — wrapping must not drop focus order.

**Tradeoffs**

- Don’t Flex a full page into a column of “header / main / footer” if Grid `template-areas` would name those roles. Flex is fine for a simple app-shell; it gets brittle once you add a second column.
- `justify-content: space-between` with two items looks even until a third Vue `v-if` appears. Prefer `margin-inline-start: auto` on the actions group, or Grid.
- `flex-wrap: wrap` is the escape hatch, not the default, if the design is a single toolbar. Wrapping a toolbar can bury the primary CTA.
- `gap` vs margin: `gap` does not collapse, doesn’t require last-child resets, but older WebViews and some nested flex + `overflow` combinations still surprise. It’s the default I write in 2026.

**Production gotchas**

- `min-width: auto` / `min-height: auto` on flex items is the #1 overflow bug. Fix with `min-width: 0` (or `overflow: hidden` if you also need to clip), and `min-height: 0` on nested column flex in a grid cell.
- `flex: 1` is `1 1 0%` in the spec-ish shorthand people think they know — browsers treat `flex: 1` as `1 1 0%`. `flex: auto` is `1 1 auto`. Mixing them in a Vue list is how one child eats the row.
- `align-items: stretch` + an image without height → stretch then CLS when the image arrives. Give the image dimensions or an aspect-ratio box.
- `gap` on flex doesn’t include collapsed space for `display: none` children (good). Margin hacks do (bad) when `v-if` toggles.
- a11y: visual order vs DOM order. `order: -1` to pull a button left is a keyboard trap. Reorder in the Vue template, not with `order`.
- `overflow: auto` on a flex child without `min-height: 0` in a column layout: the child grows with content and the page scrolls instead of the panel. Classic dashboard bug.

```css
.toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.toolbar__nav {
  flex: 1 1 auto;
  min-width: 0; /* allow shrink below content min */
  overflow: auto;
}
.toolbar__actions {
  margin-inline-start: auto;
  flex: 0 0 auto;
}
```

**Follow-ups**

1. Why doesn’t `flex: 1` stop a long filename from overflowing? What property actually does?
2. `gap` vs `margin` on a list that Vue filters — which one leaves a trailing gap?
3. When is `flex-wrap` a product bug (toolbar CTA wrapping below the fold)?
4. Why is CSS `order` an a11y smell in a Vue `v-for`?
5. Nested flex in a Grid cell: whose job is `min-height: 0`?
6. `flex-basis: 0` vs `auto` — which do you use for equal-width cards, and why do padding/borders break “equal”?

---

### 3.2. CSS Grid

**What they actually ask**

A dashboard: sidebar, top bar, main, optional inspector. Or a card grid that should fill the row without a media-query for every breakpoint. They want `minmax`, `fr`, **named areas**, and the overflow story — not `grid-template-columns: 1fr 1fr 1fr`.

**How a senior answers**

Grid is for **two axes at once**: page chrome, form label/field alignment, card galleries where rows and columns matter. Decision: named `grid-template-areas` for the app shell (readable in review, easy to swap for a one-column mobile template); `repeat(auto-fit, minmax(min(100%, 16rem), 1fr))` for a gallery that doesn’t need a breakpoint per card count. Constraint: `1fr` is `minmax(auto, 1fr)` — same min-content trap as Flex. Put `minmax(0, 1fr)` on tracks that must shrink. Failure mode: an implicit row from a Vue list item that wasn’t placed, stretching the footer. Measure: Grid overlay in DevTools, and CLS if tracks resize when fonts/images load.

**Tradeoffs**

- Don’t Grid a button group. That’s Flex.
- Don’t 12-column-everything like Bootstrap 2014. If the layout is a sidebar + main, two tracks are clearer than `span 3`.
- `auto-fit` vs `auto-fill`: `fit` collapses empty tracks (good for 1–n cards); `fill` keeps empty columns (good if you want a stable rhythm with holes). Know which product you are building.
- Subgrid (see 3.7) is how nested cards share the parent’s columns. Without it, nested Grids don’t align labels across cards — that’s a reason to promote the grid one level, not to pixel-push margin.

**Production gotchas**

- `minmax(200px, 1fr)` + padding can overflow the viewport on a 320px device. Wrap with `min(100%, 200px)` inside `minmax`.
- Grid items as `min-width: auto` too. `minmax(0, 1fr)` on the track **and** `min-width: 0` on the item if it holds a table or code block.
- `grid-auto-flow: dense` fills holes and **reorders visually**. Screen reader / tab order follow DOM. Don’t dense-pack a Vue product grid if the order is rank.
- Stretching replaced elements (images, video) in a grid area without `object-fit` and an `aspect-ratio` is a CLS + crop bug.
- `position: sticky` inside a grid/flex item: the sticky containing block is the grid area, but overflow on any ancestor kills it. That’s why a “sticky thead” dies inside `overflow: auto` panels.

```css
.app {
  display: grid;
  grid-template-columns: minmax(0, 16rem) minmax(0, 1fr) minmax(0, 20rem);
  grid-template-rows: auto minmax(0, 1fr);
  grid-template-areas:
    'nav top top'
    'nav main inspector';
  min-height: 100dvh;
}
@media (max-width: 64rem) {
  .app {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      'top'
      'main';
  }
}
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: 1rem;
}
```

**Follow-ups**

1. Why does a `1fr` column overflow on a table with `white-space: nowrap`?
2. `auto-fit` vs `auto-fill` — which would you pick for a product admin’s “widget library”?
3. How do you hide the inspector column in Vue without leaving an empty track?
4. Why did `position: sticky` fail inside your grid main? Name the overflow ancestor.
5. Named areas vs numbered lines vs `subgrid` — which do you want in a design-system `FormGrid`?
6. What does `min(100%, 16rem)` inside `minmax` save you from at 320px?

---

### 3.3. When to Use Flexbox vs Grid?

**What they actually ask**

“Flex is 1D, Grid is 2D” is the mid answer. Seniors are asked **which one owns the page**, how they **compose**, and which bugs are unique to each (shrink overflow, stacking, gap).

**How a senior answers**

I Grid the **page** (rows *and* columns, named areas, explicit tracks). I Flex the **components** (nav, button clusters, input+addon, empty-state icon+copy). Constraint: a component that starts as a row and later needs a 2D interior (label/field/help aligned across rows) should be promoted to Grid — don’t nest five Flexes. Failure mode: all-Flex app shells where `min-height: 0` is copied onto every child, or all-Grid button bars that need four lines of `grid-column` to do `margin-left: auto`. Measure: can a new hire move the inspector in one template-area edit? If not, the abstraction is wrong.

**Tradeoffs**

- You can Grid a 1D row. You shouldn’t, unless you need track alignment with a sibling row (form groups). That’s the actual exception to “Flex for 1D.”
- You can Flex a 2D gallery with wrap. You get ragged columns and no row alignment of the second item. That’s why card galleries are Grid.
- `gap` works on both. Don’t choose Grid “because gap.”
- In Vue, the layout parent is often a layout SFC (`AppLayout.vue`) + a page that only Flexes its content. Keep page-level Grid out of leaf widgets so widgets stay portable (container queries, see 3.4).

**Production gotchas**

- Mixing: a Grid cell that is `display: flex; flex-direction: column; min-height: 0` is the standard dashboard pattern. Forgetting `min-height: 0` on **either** the grid track or the flex child is the scroll bug.
- `align-items: center` on a full-page Flex column centers a short page and breaks “footer at the bottom” vs “footer after content.” Grid `1fr` main is the more honest sticky-footer.
- Stacking: `transform`/`opacity` on a Flex/Grid child creates a stacking context and can trap `z-index` (modals, dropdowns). Teleport in Vue exists partly because of this. See 3.5.
- SSR/hydration: Grid `auto-fit` + font swap can reflow after paint. Reserve min-height on the gallery or accept the CLS budget.

**Follow-ups**

1. Give a 1D layout you would still Grid (and why Flex would fail alignment).
2. Give a 2D layout you would still Flex (and why).
3. Where does the `min-height: 0` belong in Grid-of-Flex?
4. Why is a sticky footer easier in Grid than in Flex?
5. How does Vue `<Teleport>` interact with this choice for dropdowns vs page layout?
6. When would you drop both and use flow layout + `float`? (You wouldn’t — except for wrap-around images in an article.)

---

### 3.4. Responsive Design Strategy

**What they actually ask**

Not “mobile-first media queries.” They want: **viewport vs container queries**, fluid type that still respects user zoom, **CLS from images**, `100vh` vs `dvh` on iOS, and whether spacing comes from tokens or magic pixels.

**How a senior answers**

Mobile-first `@media (min-width: …)` is the default for **page** chrome (nav → sidebar). Components that sit in a sidebar *or* in the main column should respond to **container queries**, not the viewport — a 400px widget in a 1440px window is “mobile.” Fluid type: `clamp(min, preferred, max)` in **rem**, so OS/browser zoom still works; the middle term is a `vw`/`cqi` mix you actually graph so it doesn’t overshoot. Images: `width`/`height` or `aspect-ratio` **before** load, plus `sizes` if `srcset`. Viewport height: `100dvh` (or `svh` + `lvh` when you care about iOS chrome showing/hiding); `100vh` is the classic mobile overflow. Tokens: color/space/radius/z-index in CSS variables or a design-system layer, not scattered `13px`. Measure: CLS in the field (CrUX), a 320 / 768 / 1280 / 1440 pass, and 200% zoom.

**Tradeoffs**

- Desktop-first is not immoral; it’s costlier when the product is phone-heavy. Don’t rewrite a working desktop-first admin just to say mobile-first.
- Container queries need a `container-type` ancestor. You cannot CQ the viewport itself; keep `@media` for nav/off-canvas that is a page concern.
- `clamp` without a rem min can violate WCAG if the preferred `vw` term shrinks below readable at 320px. Check the computed size.
- A token system that requires a JS theme runtime for first paint will flash. Prefer CSS variables on `:root` / `[data-theme]` that SSR can emit.

**Production gotchas**

- CLS: images without dimensions, ads, web fonts (`size-adjust` / metric-matched fallback), Vue `v-if` banners inserting above the fold, `autofill` in forms. Skeletons must **match** the final box.
- `100vh` on iOS includes area covered by the browser chrome → bottom nav sits under the home indicator, or the page scrolls 50px for no reason. `dvh` tracks the dynamic viewport.
- `vw` in `clamp` includes the scrollbar, so 100vw can overflow horizontally. Prefer `%` of a container or `cqi`.
- Breakpoints as pixel copies of a designer’s artboards (`768, 1024, 1440`) without naming (`--bp-md`) drift across Vue files.
- `prefers-reduced-motion` is part of responsive. Don’t container-query a layout that then animates 400px on first paint.
- Hydration: different markup for “mobile” via JS (`window.innerWidth` in `setup`) desyncs SSR. CSS must be the source of layout; JS only for features that cannot be CSS (`matchMedia` for a map lib).

```css
:root {
  --space-2: 0.5rem;
  --space-4: 1rem;
  --text-body: clamp(1rem, 0.85rem + 0.6cqi, 1.125rem);
}
.card-grid {
  container-type: inline-size;
  display: grid;
  gap: var(--space-4);
  grid-template-columns: 1fr;
}
@container (min-width: 36rem) {
  .card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.hero-img {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
}
.shell {
  min-height: 100dvh;
}
```

**Follow-ups**

1. When is a container query wrong (you actually needed the viewport, e.g. off-canvas nav)?
2. Why `rem` in `clamp` min/max, not `px`? What happens at 200% zoom?
3. List three CLS sources in a Vue product page besides images.
4. `100vh` vs `100dvh` vs `100svh` — which for a full-screen mobile web app, and why still a safe-area inset?
5. How do you keep design tokens from causing a dark-mode flash on first paint in Nuxt?
6. Why is JS `innerWidth` branching in `setup()` a hydration bug?

---

### 3.5. Stacking Context and z-index

**What they actually ask**

A dropdown is clipped or paints under a sticky header. A Vue modal inside a card with `transform` cannot escape. Someone sets `z-index: 9999` and it still loses. This is the senior CSS question.

**How a senior answers**

`z-index` only compares **within a stacking context**. A new context is created by `position` + `z-index` other than auto, `opacity < 1`, `transform`, `filter`, `isolation: isolate`, `will-change`, some `display: flex/grid` with `z-index`, and a few others. Decision: don’t “win” with a bigger number; **flatten** the context or **Teleport** the overlay to `body` (Vue `<Teleport to="body">`). Constraint: a `transform` on a parent for a cheap animation traps every child overlay. Failure mode: global z-index scale (`--z-modal: 1000`) that still loses to a local `transform`. Measure: DevTools 3D layers / “stacking context” inspectors, and a test that the modal is the last tab stop in the document, not in the card.

**Tradeoffs**

- Teleport solves paint order and `position: fixed` containing blocks. It complicates Vue `provide/inject` if you expected the old parent (you still get the logical parent for inject; the DOM parent changes). Know that.
- `isolation: isolate` on a widget is a good fence so its internal z-index cannot escape. Don’t isolate the thing that *is* the modal.
- A documented token scale (`dropdown 20, sticky 30, modal 40, toast 50`) beats 9999, but tokens do not beat stacking contexts.
- React `createPortal` is the same interview answer. The CSS is identical.

**Production gotchas**

- `position: fixed` inside a `transform`/`filter`/`will-change` ancestor is positioned against that ancestor, not the viewport. That’s why a “full-screen” loader in a transformed card is not full-screen.
- `opacity: 0.99` on a fade wrapper creates a context. Your `z-index: 2` header inside cannot cover a sibling tooltip from another tree.
- Sticky headers create contexts; page content with `z-index: 1` can slide over or under depending on who is the context.
- CSS `isolation` + canvas/WebGL: extra layers cost GPU memory. Don’t `will-change: transform` forever.
- a11y: stacking is not focus order. A visually top modal with DOM in the card is a keyboard/SR bug even if z-index is “correct.” Teleport + focus trap.

**Follow-ups**

1. Name five properties that create a stacking context. Which one did your last modal bug hit?
2. Why did `z-index: 9999` lose to `z-index: 1`?
3. `position: fixed` not covering the viewport — what ancestor do you look for?
4. Vue `<Teleport>` vs CSS `isolation` — when do you use both?
5. How do you design a z-index token scale that survives a third-party chat widget?
6. Why is a dropdown `overflow: hidden` on the card a stacking *and* a clipping problem?

---

### 3.6. Intrinsic Sizing and Overflow

**What they actually ask**

A grid of cards, one of which has a URL or a table. The row grows horizontally and the page gets a window-level scrollbar. Or a flex/grid child with `flex: 1` never shrinks. This is `min-width: auto`, `min-content`, and `overflow`.

**How a senior answers**

Every flex/grid item has a **min-content size** by default (`min-width: auto`). Long words, `nowrap`, tables, `<pre>`, and replaced elements set a floor. Decision: on the shrinking child, `min-width: 0` (or `minmax(0, 1fr)` on the track) **and** an overflow policy (`auto` | `hidden` + ellipsis | wrap). Constraint: `overflow: hidden` clips focus rings and sticky children; `min-width: 0` without overflow still lets content paint outside unless it can wrap. Failure mode: fixing overflow by `overflow-x: hidden` on `body`, which also clips `position: sticky` and off-canvas nav. Measure: a story with a 200-char unbroken SKU, a table page, and a code block.

**Tradeoffs**

- `overflow: hidden` to “make shrink work” is a layout hack that becomes a clipping bug. Prefer `min-width: 0` + wrapping (`overflow-wrap: anywhere` for URLs).
- Truncation (`text-overflow: ellipsis`) needs `overflow: hidden; min-width: 0` and usually `white-space: nowrap`. That’s a product decision — you hid data.
- `word-break: break-all` wrecks CJK and English. `overflow-wrap: anywhere` / `break-word` first.
- `ch`/`ex` units for “approx N characters” are hints, not a11y guarantees.

**Production gotchas**

- Tables: a `table` in a grid cell will expand to min-content of all columns. Wrap in `overflow: auto; min-width: 0`.
- SVG/canvas with intrinsic width: same floor. Set `max-width: 100%; height: auto`.
- `white-space: nowrap` on a flex item is a deliberate overflow. Pair with ellipsis or a tooltip, and an accessible name that isn’t truncated.
- Vue `v-for` of tags: the container must wrap (`flex-wrap`) or scroll; it will not magically shrink chips.
- `scrollbar-gutter: stable` avoids CLS when overflow appears; `overflow: auto` vs `scroll` changes whether the gutter is always reserved.

**Follow-ups**

1. What is the computed `min-width` of a flex item with a long word, and how do you change it?
2. Why is `overflow-x: hidden` on `body` a last resort?
3. How do you make a `<table>` sit in a `1fr` column without blowing the grid?
4. Ellipsis vs wrap vs horizontal scroll — pick one for a data-grid cell and defend a11y.
5. What does `minmax(0, 1fr)` change compared to `1fr`?
6. How do container queries change this if the “small” container is a sidebar, not the viewport?

---

### 3.7. Modern Layout: subgrid, :has, Cascade Layers

**What they actually ask**

Awareness with judgment: **subgrid** for nested alignment, **`:has()`** as a parent selector, **cascade layers** vs `!important` wars with utilities (Tailwind). They do not want a demo of every new selector. They want when you would ship it, and the cost.

**How a senior answers**

**Subgrid:** a nested grid that reuses the parent’s tracks — form rows or card headers whose columns must line up across siblings. I ship it where alignment is the product (pricing table, definition list in cards). Constraint: browser support is now mainstream, but a design-system still needs a Flex fallback if you support last-gen WebViews.

**`:has()`:** style a card if it contains an error, a form if a checkbox is checked, a list item if it holds an unread badge — without Vue class soup. Constraint: `:has` is not free on huge, dirty DOMs (it can invalidate more often). I use it for local widgets, not `body:has(.modal)`.

**Cascade layers** (`@layer reset, tokens, components, utilities`): put utilities last so Tailwind-style classes win without `!important`. Tokens live in a layer that components can override. Failure mode: mixing layers with Vue scoped CSS and third-party widgets that don’t layer — you still need a boundary (`:where`, a wrapper class), not a new `!important`.

Measure: one reduced test that a nested card’s labels align (subgrid), a form error state without a `hasError` prop if CSS can do it, and a layered `utilities` win over `components`.

**Tradeoffs**

- Don’t rewrite a working Grid+gap card to subgrid for fashion. Use it when **two nested levels must share tracks**.
- Don’t replace Vue state with `:has` if the same condition drives JS (disable submit, announce errors). CSS can mirror; it should not be the only source if a11y needs an `aria-invalid` anyway.
- Cascade layers don’t replace BEM or Vue `scoped`. They replace the specificity arms race. Tailwind v4’s layer story is why this is an interview talking point now.
- `:has` + `querySelector` mental model in interviews is fine; in production, pair with `:focus-within` for keyboard, not only mouse `:hover`.

**Production gotchas**

- Subgrid `grid-template-columns: subgrid` requires the child to **span** the same number of parent tracks. A Vue slot that injects an extra wrapper breaks it — keep the DOM shallow.
- `:has(*:nth-child)` on large lists is a performance conversation; profile before using it as a table-row zebra replacement.
- `@layer` + Vue SFC `<style scoped>`: the scoped attribute selector still adds specificity. Layers order the **origin**, not a miracle.
- Polyfills for `:has` / subgrid are not worth it; `@supports` or a simpler layout is the fallback.
- Design tokens in a layer vs in `:root`: prefer `:root` variables (they inherit) and layers for **rules**, not for the values.

**Follow-ups**

1. When does subgrid beat padding-hacking two nested grids?
2. Why can a Vue wrapper `div` in a slot kill subgrid alignment?
3. Give a `:has` rule you would **not** write (performance or a11y), and the Vue class you’d use instead.
4. How do cascade layers interact with Tailwind and with a scoped SFC?
5. `@supports (grid-template-columns: subgrid)` — what is the Flex fallback for a label/field row?
6. Why is `body:has(.modal-open)` a stacking/scroll-lock smell compared to a class on `html` from Vue?

---

[← Back to Overview](../../README-en.md)
