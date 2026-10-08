# CSS Layout

Phỏng vấn CSS senior không phải cheat sheet Flexbox. Họ xem bạn giải thích được vì sao modal vẽ dưới sticky header, vì sao flex child không chịu shrink, vì sao page nhảy 40px khi ảnh load, và bạn có thật sự dùng Grid cho **page** còn Flex cho **toolbar** không. Layout là production: stacking context, intrinsic sizing, CLS, `100vh` trên mobile, và token sống sót dark theme.

Trả lời bằng quyết định (Grid vs Flex vs flow), constraint (content min-size, containing block, user zoom), failure mode (overflow, clip focus, layout shift), và cách đo (CLS trong CrUX, overlay DevTools, reduced test case).

---

## Table of Contents

1. [Flexbox](#31-flexbox)

2. [CSS Grid](#32-css-grid)

3. [Flexbox vs Grid](#33-when-to-use-flexbox-vs-grid)

4. [Responsive Design Strategy](#34-responsive-design-strategy)

5. [Stacking Context và z-index](#35-stacking-context-và-z-index)

6. [Intrinsic Sizing và Overflow](#36-intrinsic-sizing-và-overflow)

7. [Layout hiện đại: subgrid, :has, Cascade Layers](#37-layout-hiện-đại-subgrid-has-cascade-layers)

---

## 3. CSS Layout

### 3.1. Flexbox

**Họ thực sự hỏi gì**

Toolbar: logo trái, nav giữa, action phải. Màn nhỏ nav overflow thay vì shrink. Hoặc: hàng card mà một SKU dài không ngắt kéo cả hàng. Họ probing **`min-width: auto`**, `gap` vs margin, và wrapping — không trivia `justify-content`.

**Cách senior trả lời**

Flex cho **một trục** phân phối: nav, form row, cụm button, space-between header chrome. Quyết định: `display: flex; gap: …; min-width: 0` trên child phải shrink (text, search input, nav giữa). Constraint: default `min-width: auto` của flex item là minimum của content — không shrink dưới đó, nên `flex: 1` trên child chữ dài **không** chặn overflow. Failure mode: hack `margin-left: auto` cộng margin `:last-child` gãy khi Vue thêm badge; `gap` tồn tại vì việc này. Đo: overflow DevTools (scrollWidth vs clientWidth), và pass bàn phím — wrap không được đảo focus order.

**Tradeoff**

- Đừng Flex cả page thành cột “header / main / footer” nếu Grid `template-areas` đặt tên được các vai. Flex ổn cho app-shell đơn; mong manh khi thêm cột thứ hai.
- `justify-content: space-between` với hai item nhìn đều đến khi Vue `v-if` thứ ba xuất hiện. Prefer `margin-inline-start: auto` trên nhóm action, hoặc Grid.
- `flex-wrap: wrap` là cửa thoát, không phải default, nếu design là một toolbar. Wrap toolbar có thể chôn CTA chính.
- `gap` vs margin: `gap` không collapse, không cần last-child reset, nhưng WebView cũ và vài combo nested flex + `overflow` vẫn bất ngờ. Đó là default tôi viết năm 2026.

**Gotcha production**

- `min-width: auto` / `min-height: auto` trên flex item là bug overflow #1. Fix `min-width: 0` (hoặc `overflow: hidden` nếu cũng cần clip), và `min-height: 0` trên nested column flex trong grid cell.
- `flex: 1` là `1 1 0%` theo shorthand người ta nghĩ mình biết — browser coi `flex: 1` là `1 1 0%`. `flex: auto` là `1 1 auto`. Trộn trong Vue list là cách một child ăn cả hàng.
- `align-items: stretch` + ảnh không height → stretch rồi CLS khi ảnh tới. Cho ảnh dimension hoặc box aspect-ratio.
- `gap` trên flex không tính chỗ collapsed cho child `display: none` (tốt). Hack margin thì có (xấu) khi `v-if` toggle.
- a11y: visual order vs DOM order. `order: -1` kéo button sang trái là bẫy bàn phím. Reorder trong Vue template, không bằng `order`.
- `overflow: auto` trên flex child không `min-height: 0` trong column layout: child lớn theo content và page scroll thay vì panel. Bug dashboard classic.

```css
.toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.toolbar__nav {
  flex: 1 1 auto;
  min-width: 0; /* cho shrink dưới content min */
  overflow: auto;
}
.toolbar__actions {
  margin-inline-start: auto;
  flex: 0 0 auto;
}
```

**Câu hỏi nối**

1. Vì sao `flex: 1` không chặn filename dài overflow? Property nào thật sự làm?
2. `gap` vs `margin` trên list Vue filter — cái nào để lại trailing gap?
3. Khi nào `flex-wrap` là bug product (toolbar CTA wrap dưới fold)?
4. Vì sao CSS `order` là mùi a11y trong Vue `v-for`?
5. Nested flex trong Grid cell: `min-height: 0` là việc của ai?
6. `flex-basis: 0` vs `auto` — cái nào cho card equal-width, và vì sao padding/border phá “equal”?

---

### 3.2. CSS Grid

**Họ thực sự hỏi gì**

Dashboard: sidebar, top bar, main, inspector optional. Hoặc card grid lấp hàng mà không media-query mỗi breakpoint. Họ muốn `minmax`, `fr`, **named areas**, và câu chuyện overflow — không `grid-template-columns: 1fr 1fr 1fr`.

**Cách senior trả lời**

Grid cho **hai trục cùng lúc**: page chrome, form label/field alignment, gallery card nơi hàng và cột đều quan trọng. Quyết định: named `grid-template-areas` cho app shell (đọc được lúc review, dễ đổi template một cột mobile); `repeat(auto-fit, minmax(min(100%, 16rem), 1fr))` cho gallery không cần breakpoint theo số card. Constraint: `1fr` là `minmax(auto, 1fr)` — cùng bẫy min-content như Flex. Đặt `minmax(0, 1fr)` trên track phải shrink. Failure mode: implicit row từ Vue list item không được place, kéo footer. Đo: Grid overlay DevTools, và CLS nếu track resize khi font/ảnh load.

**Tradeoff**

- Đừng Grid nhóm button. Đó là Flex.
- Đừng 12-cột-mọi-thứ kiểu Bootstrap 2014. Layout sidebar + main thì hai track rõ hơn `span 3`.
- `auto-fit` vs `auto-fill`: `fit` collapse track trống (tốt cho 1–n card); `fill` giữ cột trống (tốt nếu muốn nhịp ổn định có lỗ). Biết product bạn đang dựng.
- Subgrid (xem 3.7) là cách nested card share cột parent. Không có thì nested Grid không align label xuyên card — lý do promote grid lên một level, không pixel-push margin.

**Gotcha production**

- `minmax(200px, 1fr)` + padding có thể overflow viewport trên máy 320px. Bọc `min(100%, 200px)` trong `minmax`.
- Grid item cũng `min-width: auto`. `minmax(0, 1fr)` trên track **và** `min-width: 0` trên item nếu nó giữ table hoặc code block.
- `grid-auto-flow: dense` lấp lỗ và **reorder visual**. Screen reader / tab order theo DOM. Đừng dense-pack Vue product grid nếu thứ tự là rank.
- Stretch replaced element (ảnh, video) trong grid area không `object-fit` và `aspect-ratio` là bug CLS + crop.
- `position: sticky` trong grid/flex item: sticky containing block là grid area, nhưng overflow trên bất kỳ ancestor nào giết nó. Vì thế “sticky thead” chết trong panel `overflow: auto`.

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

**Câu hỏi nối**

1. Vì sao cột `1fr` overflow trên table `white-space: nowrap`?
2. `auto-fit` vs `auto-fill` — chọn cái nào cho “widget library” admin product?
3. Ẩn cột inspector trong Vue mà không để track trống thế nào?
4. Vì sao `position: sticky` fail trong grid main? Nêu overflow ancestor.
5. Named areas vs numbered lines vs `subgrid` — cái nào cho design-system `FormGrid`?
6. `min(100%, 16rem)` trong `minmax` cứu bạn khỏi gì ở 320px?

---

### 3.3. When to Use Flexbox vs Grid?

**Họ thực sự hỏi gì**

“Flex 1D, Grid 2D” là câu mid. Senior bị hỏi **cái nào sở hữu page**, chúng **compose** thế nào, và bug nào unique từng cái (shrink overflow, stacking, gap).

**Cách senior trả lời**

Tôi Grid **page** (hàng *và* cột, named areas, track tường minh). Tôi Flex **component** (nav, cụm button, input+addon, empty-state icon+copy). Constraint: component bắt đầu là hàng rồi sau cần interior 2D (label/field/help align xuyên hàng) nên promote lên Grid — đừng nest năm Flex. Failure mode: app shell all-Flex nơi `min-height: 0` copy lên mọi child, hoặc button bar all-Grid cần bốn dòng `grid-column` để làm `margin-left: auto`. Đo: new hire dời inspector bằng một edit template-area được không? Không thì abstraction sai.

**Tradeoff**

- Bạn có thể Grid hàng 1D. Không nên, trừ khi cần track alignment với hàng sibling (form group). Đó là exception thật của “Flex cho 1D.”
- Bạn có thể Flex gallery 2D với wrap. Bạn được cột răng cưa và không row alignment của item thứ hai. Vì thế gallery card là Grid.
- `gap` chạy trên cả hai. Đừng chọn Grid “vì gap.”
- Trong Vue, layout parent thường là layout SFC (`AppLayout.vue`) + page chỉ Flex content. Giữ page-level Grid khỏi leaf widget để widget portable (container query, xem 3.4).

**Gotcha production**

- Mix: Grid cell `display: flex; flex-direction: column; min-height: 0` là pattern dashboard chuẩn. Quên `min-height: 0` trên **một trong hai** grid track hoặc flex child là bug scroll.
- `align-items: center` trên full-page Flex column căn page ngắn và phá “footer đáy” vs “footer sau content.” Grid `1fr` main là sticky-footer thật thà hơn.
- Stacking: `transform`/`opacity` trên Flex/Grid child tạo stacking context và có thể nhốt `z-index` (modal, dropdown). Teleport trong Vue tồn tại một phần vì việc này. Xem 3.5.
- SSR/hydration: Grid `auto-fit` + font swap có thể reflow sau paint. Reserve min-height gallery hoặc chấp nhận ngân sách CLS.

**Câu hỏi nối**

1. Cho layout 1D bạn vẫn Grid (và vì sao Flex fail alignment).
2. Cho layout 2D bạn vẫn Flex (và vì sao).
3. `min-height: 0` thuộc đâu trong Grid-of-Flex?
4. Vì sao sticky footer dễ hơn trên Grid so với Flex?
5. Vue `<Teleport>` tương tác lựa chọn này thế nào với dropdown vs page layout?
6. Khi nào bỏ cả hai dùng flow layout + `float`? (Không — trừ ảnh wrap-around trong article.)

---

### 3.4. Responsive Design Strategy

**Họ thực sự hỏi gì**

Không phải “mobile-first media query.” Họ muốn: **viewport vs container query**, fluid type vẫn tôn trọng user zoom, **CLS từ ảnh**, `100vh` vs `dvh` trên iOS, và spacing đến từ token hay magic pixel.

**Cách senior trả lời**

Mobile-first `@media (min-width: …)` là default cho chrome **page** (nav → sidebar). Component ngồi sidebar *hoặc* cột main nên đáp **container query**, không phải viewport — widget 400px trong cửa sổ 1440px là “mobile.” Fluid type: `clamp(min, preferred, max)` bằng **rem**, để OS/browser zoom vẫn chạy; hạng giữa là mix `vw`/`cqi` bạn thật sự graph để không overshoot. Ảnh: `width`/`height` hoặc `aspect-ratio` **trước** load, cộng `sizes` nếu `srcset`. Viewport height: `100dvh` (hoặc `svh` + `lvh` khi bạn quan tâm chrome iOS hiện/ẩn); `100vh` là overflow mobile classic. Token: color/space/radius/z-index trong CSS variable hoặc design-system layer, không `13px` rải. Đo: CLS field (CrUX), pass 320 / 768 / 1280 / 1440, và zoom 200%.

**Tradeoff**

- Desktop-first không vô đạo đức; đắt hơn khi product nặng phone. Đừng rewrite admin desktop-first đang chạy chỉ để nói mobile-first.
- Container query cần ancestor `container-type`. Không CQ chính viewport; giữ `@media` cho nav/off-canvas là concern của page.
- `clamp` không rem min có thể vi phạm WCAG nếu hạng `vw` preferred co dưới readable ở 320px. Check computed size.
- Token system cần JS theme runtime cho first paint sẽ flash. Prefer CSS variable trên `:root` / `[data-theme]` mà SSR emit được.

**Gotcha production**

- CLS: ảnh không dimension, ads, web font (`size-adjust` / metric-matched fallback), Vue `v-if` banner chèn above the fold, `autofill` trong form. Skeleton phải **khớp** box cuối.
- `100vh` trên iOS gồm vùng chrome browser che → bottom nav nằm dưới home indicator, hoặc page scroll 50px vô cớ. `dvh` theo dynamic viewport.
- `vw` trong `clamp` gồm scrollbar, nên 100vw overflow ngang. Prefer `%` của container hoặc `cqi`.
- Breakpoint copy pixel artboard designer (`768, 1024, 1440`) không đặt tên (`--bp-md`) drift xuyên file Vue.
- `prefers-reduced-motion` là một phần responsive. Đừng container-query layout rồi animate 400px first paint.
- Hydration: markup khác cho “mobile” qua JS (`window.innerWidth` trong `setup`) desync SSR. CSS phải là source of layout; JS chỉ feature CSS không làm được (`matchMedia` cho map lib).

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

**Câu hỏi nối**

1. Khi nào container query sai (bạn thật sự cần viewport, ví dụ off-canvas nav)?
2. Vì sao `rem` trong `clamp` min/max, không `px`? Zoom 200% thì sao?
3. Liệt kê ba nguồn CLS trên Vue product page ngoài ảnh.
4. `100vh` vs `100dvh` vs `100svh` — cái nào cho full-screen mobile web app, và vì sao vẫn cần safe-area inset?
5. Giữ design token không gây flash dark-mode first paint trong Nuxt thế nào?
6. Vì sao nhánh JS `innerWidth` trong `setup()` là bug hydration?

---

### 3.5. Stacking Context và z-index

**Họ thực sự hỏi gì**

Dropdown bị clip hoặc vẽ dưới sticky header. Vue modal trong card có `transform` không thoát được. Ai đó set `z-index: 9999` vẫn thua. Đây là câu CSS senior.

**Cách senior trả lời**

`z-index` chỉ so **trong một stacking context**. Context mới được tạo bởi `position` + `z-index` khác auto, `opacity < 1`, `transform`, `filter`, `isolation: isolate`, `will-change`, một số `display: flex/grid` với `z-index`, và vài cái nữa. Quyết định: đừng “thắng” bằng số lớn hơn; **flatten** context hoặc **Teleport** overlay ra `body` (Vue `<Teleport to="body">`). Constraint: `transform` trên parent vì animation rẻ nhốt mọi overlay con. Failure mode: scale z-index global (`--z-modal: 1000`) vẫn thua `transform` local. Đo: DevTools 3D layers / inspector “stacking context”, và test modal là tab stop cuối trong document, không trong card.

**Tradeoff**

- Teleport giải paint order và containing block `position: fixed`. Nó phức tạp hóa Vue `provide/inject` nếu bạn expect parent cũ (bạn vẫn được logical parent cho inject; DOM parent đổi). Biết điều đó.
- `isolation: isolate` trên widget là hàng rào tốt để z-index nội bộ không thoát. Đừng isolate thứ *là* modal.
- Token scale có document (`dropdown 20, sticky 30, modal 40, toast 50`) thắng 9999, nhưng token không thắng stacking context.
- React `createPortal` cùng câu trả lời interview. CSS giống hệt.

**Gotcha production**

- `position: fixed` trong ancestor `transform`/`filter`/`will-change` định vị theo ancestor đó, không viewport. Vì thế loader “full-screen” trong card đã transform không full-screen.
- `opacity: 0.99` trên fade wrapper tạo context. Header `z-index: 2` bên trong không phủ tooltip sibling từ cây khác.
- Sticky header tạo context; page content `z-index: 1` trượt trên hoặc dưới tùy ai là context.
- CSS `isolation` + canvas/WebGL: layer thêm tốn GPU memory. Đừng `will-change: transform` mãi.
- a11y: stacking không phải focus order. Modal visual trên cùng mà DOM trong card là bug bàn phím/SR dù z-index “đúng.” Teleport + focus trap.

**Câu hỏi nối**

1. Nêu năm property tạo stacking context. Bug modal gần nhất đụng cái nào?
2. Vì sao `z-index: 9999` thua `z-index: 1`?
3. `position: fixed` không phủ viewport — tìm ancestor nào?
4. Vue `<Teleport>` vs CSS `isolation` — khi nào dùng cả hai?
5. Thiết kế z-index token scale sống sót chat widget third-party thế nào?
6. Vì sao dropdown `overflow: hidden` trên card vừa là stacking *vừa* clipping?

---

### 3.6. Intrinsic Sizing và Overflow

**Họ thực sự hỏi gì**

Grid card, một cái có URL hoặc table. Hàng phình ngang và page có scrollbar cửa sổ. Hoặc flex/grid child `flex: 1` không bao giờ shrink. Đây là `min-width: auto`, `min-content`, và `overflow`.

**Cách senior trả lời**

Mọi flex/grid item có **min-content size** mặc định (`min-width: auto`). Chữ dài, `nowrap`, table, `<pre>`, và replaced element đặt sàn. Quyết định: trên child shrink, `min-width: 0` (hoặc `minmax(0, 1fr)` trên track) **và** overflow policy (`auto` | `hidden` + ellipsis | wrap). Constraint: `overflow: hidden` clip focus ring và sticky child; `min-width: 0` không overflow vẫn cho content vẽ ra ngoài trừ khi wrap được. Failure mode: fix overflow bằng `overflow-x: hidden` trên `body`, cũng clip `position: sticky` và off-canvas nav. Đo: story SKU 200 ký tự không ngắt, trang table, và code block.

**Tradeoff**

- `overflow: hidden` để “cho shrink chạy” là hack layout thành bug clipping. Prefer `min-width: 0` + wrapping (`overflow-wrap: anywhere` cho URL).
- Truncation (`text-overflow: ellipsis`) cần `overflow: hidden; min-width: 0` và thường `white-space: nowrap`. Đó là quyết định product — bạn giấu data.
- `word-break: break-all` phá CJK và English. `overflow-wrap: anywhere` / `break-word` trước.
- Unit `ch`/`ex` cho “khoảng N ký tự” là gợi ý, không bảo đảm a11y.

**Gotcha production**

- Table: `table` trong grid cell phình theo min-content mọi cột. Bọc `overflow: auto; min-width: 0`.
- SVG/canvas có intrinsic width: cùng sàn. Set `max-width: 100%; height: auto`.
- `white-space: nowrap` trên flex item là overflow cố ý. Pair ellipsis hoặc tooltip, và accessible name không bị cắt.
- Vue `v-for` tag: container phải wrap (`flex-wrap`) hoặc scroll; chip không magically shrink.
- `scrollbar-gutter: stable` tránh CLS khi overflow xuất hiện; `overflow: auto` vs `scroll` đổi việc gutter luôn được reserve hay không.

**Câu hỏi nối**

1. Computed `min-width` của flex item chữ dài là gì, và đổi thế nào?
2. Vì sao `overflow-x: hidden` trên `body` là last resort?
3. Cho `<table>` ngồi cột `1fr` mà không nổ grid thế nào?
4. Ellipsis vs wrap vs scroll ngang — chọn một cho data-grid cell và bảo vệ a11y.
5. `minmax(0, 1fr)` đổi gì so với `1fr`?
6. Container query đổi bài này thế nào nếu container “nhỏ” là sidebar, không phải viewport?

---

### 3.7. Layout hiện đại: subgrid, :has, Cascade Layers

**Họ thực sự hỏi gì**

Awareness kèm judgment: **subgrid** cho alignment lồng, **`:has()`** như parent selector, **cascade layers** vs chiến tranh `!important` với utility (Tailwind). Họ không muốn demo mọi selector mới. Họ muốn khi nào bạn ship, và cost.

**Cách senior trả lời**

**Subgrid:** nested grid tái dùng track của parent — form row hoặc card header mà cột phải thẳng hàng xuyên sibling. Tôi ship nơi alignment là product (bảng giá, definition list trong card). Constraint: browser support giờ mainstream, nhưng design-system vẫn cần Flex fallback nếu support WebView đời trước.

**`:has()`:** style card nếu chứa error, form nếu checkbox checked, list item nếu giữ unread badge — không soup class Vue. Constraint: `:has` không miễn phí trên DOM khổng lồ, bẩn (invalidate nhiều hơn). Tôi dùng widget local, không `body:has(.modal)`.

**Cascade layers** (`@layer reset, tokens, components, utilities`): để utility cuối để class kiểu Tailwind thắng không cần `!important`. Token sống trong layer mà component override được. Failure mode: mix layer với Vue scoped CSS và widget third-party không layer — bạn vẫn cần ranh giới (`:where`, wrapper class), không `!important` mới.

Đo: một reduced test label nested card thẳng hàng (subgrid), form error state không cần prop `hasError` nếu CSS làm được, và layer `utilities` thắng `components`.

**Tradeoff**

- Đừng rewrite card Grid+gap đang chạy sang subgrid vì mốt. Dùng khi **hai level lồng phải share track**.
- Đừng thay Vue state bằng `:has` nếu cùng điều kiện chạy JS (disable submit, announce error). CSS có thể mirror; không nên là source duy nhất nếu a11y cần `aria-invalid` anyway.
- Cascade layers không thay BEM hay Vue `scoped`. Chúng thay cuộc đua specificity. Câu chuyện layer Tailwind v4 là lý do đây thành talking point interview.
- `:has` + mental model `querySelector` lúc interview ổn; production pair `:focus-within` cho bàn phím, không chỉ mouse `:hover`.

**Gotcha production**

- Subgrid `grid-template-columns: subgrid` đòi child **span** cùng số track parent. Vue slot inject thêm wrapper phá nó — giữ DOM nông.
- `:has(*:nth-child)` trên list lớn là cuộc nói chuyện performance; profile trước khi dùng thay zebra table-row.
- `@layer` + Vue SFC `<style scoped>`: attribute selector scoped vẫn cộng specificity. Layer sắp **origin**, không phải phép màu.
- Polyfill `:has` / subgrid không đáng; `@supports` hoặc layout đơn giản hơn là fallback.
- Design token trong layer vs `:root`: prefer biến `:root` (chúng inherit) và layer cho **rule**, không cho value.

**Câu hỏi nối**

1. Khi nào subgrid thắng padding-hack hai nested grid?
2. Vì sao Vue wrapper `div` trong slot giết alignment subgrid?
3. Cho rule `:has` bạn **không** viết (performance hoặc a11y), và class Vue dùng thay.
4. Cascade layers tương tác Tailwind và scoped SFC thế nào?
5. `@supports (grid-template-columns: subgrid)` — Flex fallback cho hàng label/field là gì?
6. Vì sao `body:has(.modal-open)` là mùi stacking/scroll-lock so với class trên `html` từ Vue?

---

[← Back to Overview](../../README.md)
