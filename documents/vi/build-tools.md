# Build Tools

Đây là tài liệu ôn phỏng vấn senior frontend, không phải tutorial bundler. Interviewer đã biết Vite “nhanh.” Họ muốn nghe **vì sao** dev server là một sản phẩm khác với production bundle, khi nào bạn vẫn chọn Webpack/Rspack, và bạn **chứng minh** build khỏe trên CI như thế nào.

Trả lời cùng một khung mỗi lần: **decision → constraint → failure mode → measure.** Vue 3 / Nuxt mặc định Vite; Webpack vẫn là cuộc nói chuyện Module Federation và legacy loader.

---

## Table of Contents

1. [Vite vs Webpack](#121-vite-vs-webpack)

2. [Hiệu năng build trên CI](#122-hiệu-năng-build-trên-ci)

3. [Debug main chunk 3MB như thế nào](#123-debug-main-chunk-3mb-như-thế-nào)

---

## IV. Infrastructure & Tools

## 12. Build Tools

### 12.1. Vite vs Webpack

**Họ thực sự hỏi gì**

- “Vite vs Webpack — chọn cái nào, vì sao?”
- “Vite không bundle lúc dev thì production chạy thế nào?”
- “Cần Module Federation. Có bắt buộc Webpack không?”
- “HMR chậm / prod bundle regress sau khi chuyển Vite. Bạn nhìn gì?”

**Cách senior trả lời** *(decision → constraint → failure mode → measure)*

- **Quyết định:** Greenfield Vue 3 / Nuxt → **Vite**. Kế thừa maze plugin/loader Webpack 5, hoặc cần **Module Federation first-class ngay hôm nay** → **Webpack 5 hoặc Rspack/Rsbuild**, không phải “Vite vì nó mới hơn.”
- **Ràng buộc:** Tốc độ dev server và tối ưu graph production là **hai việc khác nhau**. Vite thắng ở **ESM dev server** (native import cho app source, esbuild pre-bundle `node_modules`). Production vẫn là **bundler**: Vite dùng **Rollup** (Rolldown là đường migrate), Webpack dùng compiler của nó. Nuxt 3 ngồi trên Vite + Nitro; bạn không chọn “không bundler.”
- **Failure mode:** Coi Vite luôn nhanh hơn ở prod; ship entry 3MB vì chưa từng route-split; bật Module Federation trên Vite qua plugin rồi dính version skew / shared-dep bug ngoài production; leak secret qua `VITE_*` define.
- **Đo:** cold `vite` start, thời gian HMR cho một SFC `.vue` lá vs Pinia store, phút `vite build` trên CI, **gzip/brotli của entry + async chunk**, LCP/INP trên máy mid-tier, bản Vue bị duplicate trong analyzer.

#### ESM dev server vs bundle

Webpack (cổ điển): walk graph, emit bundle, serve những file đó. Dù có persistent cache, request đầu sau cold start vẫn chờ bundle. HMR patch **bundle**.

Vite:

1. **App source** được serve dạng ESM. Browser request `/src/pages/orders.vue`, không phải `main.js` chứa cả thế giới.
2. **Dependencies** được pre-bundle bằng esbuild vào cache Vite (`optimizeDeps`). Việc này convert CJS, gộp barrel file, và tránh waterfall 300 import từ `lodash`.
3. Production **bắt buộc** bundle: HTTP/1, browser cũ, wrapping, tree-shaking, và code-splitting vẫn là bài toán bundler. Tree-shaking của Rollup rất tốt với thư viện ESM; `splitChunks` của Webpack vẫn tinh chỉnh được hơn với vendor graph bệnh hoạn.

Nếu interviewer nói “Vite không có production bundler,” sửa họ: **dev = ESM (+ esbuild deps), prod = Rollup.**

#### HMR

- Vite HMR: WebSocket invalidate module vừa đổi và các importer. SFC lá thì rẻ. Sửa **composable bị import rộng, Pinia store, hoặc file CSS token** vẫn fan-out — đó là kỳ vọng, không phải bug Vite.
- Webpack HMR: thay module trong graph đã build. Ổn khi đã ấm; đắt khi graph khổng lồ hoặc cache lạnh.
- Chi phí thêm của Nuxt: server route / Nitro + Vite client. Báo cáo “HMR chậm” thường là **restart Nitro server**, không phải Vue SFC HMR.

Senior đi tiếp: nếu HMR `useAuth.ts` cảm giác như full reload, vấn đề là **fan-in**, không phải tool. Tách module.

#### Production: Rollup vs Webpack (và bạn bè)

| Tool | Chọn khi | Bạn trả giá |
| --- | --- | --- |
| **Vite + Rollup** | Vue 3 / Nuxt, library mode, dep ESM-first | Yếu hơn Webpack ở loader dị; MF là plugin, không phải platform |
| **Webpack 5** | Custom loader, MF chín, kế thừa CRA/Vue CLI | Cold build chậm trừ khi đầu tư cache + thread-loader / persistent cache |
| **Rspack / Rsbuild** | Graph tương thích Webpack, muốn tốc độ Rust, MF vẫn quan trọng | Plugin compatibility là “hầu hết,” không phải “tất cả” |
| **Turbopack** | Team Next.js App Router, incremental bundling trong ecosystem đó | Không phải câu trả lời Vue/Nuxt. Đừng giả vờ nó là prod bundler Vue của bạn |

#### Module Federation vẫn là cuộc nói chuyện Webpack / Rspack

Webpack 5 (và Rspack) **sở hữu** Module Federation: `exposes`, `remotes`, `shared: { vue: { singleton: true } }`, runtime `remoteEntry`. Đó là thứ org lớn nói khi họ nói MF.

Vite làm được MF **qua plugin** (`@originjs/vite-plugin-federation`, plugin `module-federation` chính thức cho Vite). Senior không bán cái đó như tương đương:

- Shared singleton Vue/Pinia giữa host và remote là cả cuộc chơi. Sai là **double Vue** hoặc crash hai hệ reactivity.
- Semantic của dev server khác (Vite ESM vs Webpack runtime). “Chạy được trên `vite dev` của tôi” không phải “chạy trong prod shell của host.”
- Independent deploy + versioning contract là bài toán **org**. Plugin bundler không cứu bạn.

Câu mặc định: **cần MF production với nhiều team → Rspack/Webpack. Vite host + một remote experimental là spike, không phải strategy.** Xem [15.4](./architecture.md#154-module-federation--micro-frontends) trước khi đề xuất microfrontend.

#### Bundle analysis

Đừng đoán. Ra treemap:

- Vite/Rollup: `rollup-plugin-visualizer` (mở HTML trong CI như artifact).
- Webpack: `webpack-bundle-analyzer`.
- Nuxt: cùng visualizer trên client Rollup build; đừng quên **Nitro server bundle** là graph thứ hai.

Đọc **parsed size vs gzip**. Interviewer nói “3MB” mà không nói cái nào. Đồng thời săn **package bị duplicate** (`vue` hai lần, hai major `date-fns`).

#### Source map: hidden vs cheap

Đây là quyết định production thật, không phải checkbox.

| Option | Dùng khi |
| --- | --- |
| `cheap-module-source-map` | Dev. Nhanh, map về dòng gốc, không perfect theo cột. |
| `sourcemap: true` (`source-map`) | Chính xác, nặng, **được link từ JS** (`//# sourceMappingURL=`). Nếu `.map` fetch được công khai, bạn đã publish source. |
| `sourcemap: 'hidden'` | **Prod default cho app nghiêm túc.** Emit file `.map`, **không** reference chúng từ bundle. Upload map lên Sentry (hoặc tương đương) lúc release, rồi **đừng** đặt chúng trên CDN. |
| `nosources` / stripped | Map không có source content. Nhẹ hơn, debug tệ hơn. Hiếm khi đáng nếu bạn đã giữ map private. |
| Inline map trên prod | Không bao giờ. Phình payload; đây là câu trả lời kinh điển cho “sao main 3MB?” |

Đo lường: upload map thành công trên **release** khớp `Sentry.init({ release })`. Map sai commit còn tệ hơn không có map.

#### Env define

- Vite: chỉ `VITE_*` (hoặc `NUXT_PUBLIC_*`) hiện trên client. Còn lại là server. `import.meta.env.VITE_API_URL` bị compile vào.
- `define` / Webpack `DefinePlugin`: hằng compile-time (`__FEATURE_PAYMENTS__: false`) để dead code bị drop.
- **Không bao giờ** nhét secret vào `VITE_*`. Chúng nằm trong browser bundle. Auth, private API key, và signing secret sống trên Nitro / BFF.
- Nuxt: `runtimeConfig` public vs private. Giá trị public vẫn có thể bị “nướng” tùy cách generate; biết thay đổi nào cần rebuild vs runtime env trên process Node.

```ts
// vite.config.ts — decision: hide maps, drop a flag at compile time, don't invent 40 manualChunks
export default defineConfig({
  define: {
    __PAYMENTS_V2__: JSON.stringify(false),
  },
  build: {
    sourcemap: "hidden",
    rollupOptions: {
      plugins: [visualizer({ gzipSize: true, emitFile: true })],
    },
  },
});
```

#### Khi nào bạn vẫn chọn Webpack / Rsbuild / Turbopack

Nói to điều này:

- **Webpack:** app Vue CLI 5 bạn không rewrite quý này; loader không có Vite plugin; MF đã chạy production.
- **Rsbuild/Rspack:** cùng mental model Webpack, CI đang cháy, MF vẫn bắt buộc. Đây là câu trả lời Webpack-speed người lớn năm 2025–2026.
- **Turbopack:** bạn đang **Next.js** và team đã sống trong compiler đó. Với Vue/Nuxt, cược “graph nhanh hơn” tương đương là Vite / Rolldown / (có thể) Rsbuild — không phải Turbopack.
- **Ở lại Vite** nếu nỗi đau là “main chunk quá lớn.” Đó là bài toán architecture/import (12.3), không phải lý do migrate bundler.

**Tradeoff**

- DX của Vite vs vũ trụ plugin và độ chín MF của Webpack.
- esbuild pre-bundle giấu mớ CJS lúc dev và có thể **lệch** so với Rollup prod (bug Vite kinh điển “dev chạy, build vỡ” — chủ động force `optimizeDeps` / `ssr.noExternal`).
- Nhiều `manualChunks` vs để Rollup split theo `import()` động. Over-chunk tạo waterfall.

**Gotcha production**

- Thiếu `sideEffects: false` trên package → tree-shaking để lại CSS/JS chết.
- Barrel file (`components/index.ts` re-export 80 SFC) đánh bại ESM shaking.
- Nhiều bản Vue qua nested lockfile hoặc MF `shared` cấu hình sai.
- Source map trên CDN công khai.
- `NODE_ENV` / `import.meta.env.PROD` không khớp trong library build cho cả hai môi trường.

**Câu hỏi nối**

- Nuxt dùng Vite vs Nitro thế nào? (client Vite, server Nitro/Rollup)
- `optimizeDeps.include` để làm gì?
- Giữ HMR nhanh trong monorepo ra sao? (đừng import cả barrel của package; prebundle workspace lib)
- Vì sao Rollup prod có thể miss CJS default export mà esbuild cho phép lúc dev?

---

### 12.2. Hiệu năng build trên CI

**Họ thực sự hỏi gì**

- “Pipeline Vue 18 phút. Bạn cắt gì?”
- “Typecheck có nên cùng job với `vite build` không?”
- “Cache pnpm + Vite monorepo thế nào?”

**Cách senior trả lời**

- **Quyết định:** Pipeline PR = **lint + typecheck + unit + production build + bundle budget**, song song khi chúng không share workspace bị mutate. Main/release thêm **e2e smoke**, publish image/artifact, upload source map. Lighthouse mỗi PR chỉ khi đó là **budget check**, không phải lab run 4 phút.
- **Ràng buộc:** Phút CI là product metric. Bottleneck thường là **install + Vite/Rollup không cache + job tuần tự + rebuild package không đổi**, không phải `eslint`.
- **Failure mode:** cache `node_modules` sai khi lockfile đổi; upload source map từ commit khác artifact; chạy Playwright trên `vite dev`; coi `:latest` là cache key.
- **Đo:** wall-clock mỗi job, cache hit rate, time-to-green trên PR no-op, **size-limit / bundlewatch** so với main, flake rate e2e.

Lever cụ thể:

1. **Package manager:** cache store `pnpm` keyed theo `pnpm-lock.yaml`. Frozen lockfile. Không bao giờ `npm install` không có lock.
2. **Monorepo:** Turborepo/Nx **remote cache** cho `typecheck` và `build`. PR chỉ sửa docs không được rebuild design system nếu input không đổi.
3. **Parallelism:** `vue-tsc --noEmit` là CPU; `vite build` là CPU+RAM. Tách job để type error không chờ Rollup, nhưng **gate merge cả hai**.
4. **Vite/Rollup:** persist `node_modules/.vite` chỉ khi thực sự hit; đừng cache `dist`. `NODE_OPTIONS=--max-old-space-size=4096` khi app lớn — OOM trông giống “CI flake.”
5. **Map:** generate map `hidden` trong job build, upload Sentry với **release SHA**, bỏ map khỏi artifact mà nginx/CDN sẽ serve.
6. **E2E:** smoke trên **production build** (`playwright preview` / Nuxt preview), không phải HMR. Một browser, critical path trên PR; full matrix trên main/nightly.

**Tradeoff**

- Gate PR chặt vs time-to-merge. Senior **thu nhỏ gate** (smoke, không full matrix) chứ không xóa typecheck.
- Remote build cache vs “reproducible từ runner sạch” — pin version tool; coi cache là tăng tốc, không phải correctness.
- Chạy Lighthouse trên CI (lab, throttle CPU) vs RUM trên prod. CI để **regression / budget**, không phải con số đưa lên slide.

**Gotcha production**

- Cache `~/.npm` nhưng đổi version Node → native binary vỡ kiểu tinh.
- Build với `NODE_ENV=development` vì Docker image copy nhầm command.
- Preview deploy dùng `VITE_*` **prod** và leak production API vào PR.
- Bundle budget chỉ nhìn parsed size, nên library mới gzip-friendly “pass” trong khi TBT nổ.

**Câu hỏi nối**

- Fail PR ở đâu: JS tăng 5%? vượt tuyệt đối 200KB gzip?
- Typecheck Vue SFC trên CI thế nào? (`vue-tsc`, không phải `tsc` một mình)
- Build một lần rồi deploy **cùng artifact** lên staging và prod? (có — xem [14.1](./devops.md#141-gitops--argocd-pipeline))

---

### 12.3. Debug main chunk 3MB như thế nào

**Họ thực sự hỏi gì**

“Production `main` khoảng 3MB. Kể từng bước.” Họ muốn **procedure**, không phải “mình code-split.”

**Cách senior trả lời**

- **Quyết định:** Ngừng đoán. Đo **transferred vs parsed**, ra **treemap**, rồi tấn công theo thứ tự: (1) sync import nhầm page cấp route, (2) vendor nặng đã biết, (3) barrel / CSS framework, (4) inline map, (5) package duplicate. Chỉ sau đó mới nghĩ migrate bundler.
- **Ràng buộc:** Entry chunk phải nhỏ đủ để **first paint + hydration/INP** sống sót trên máy 4G. Async chunk được phép lớn nếu nằm sau route hoặc user gesture (chart, PDF, editor).
- **Failure mode:** Split thành 80 micro-chunk rồi tạo request waterfall trên critical path; dynamic import thứ landing page cần *ngay*; “fix” size bằng cách lột source map mà Sentry cần.
- **Đo:** treemap analyzer, size `Content-Encoding: br` của **entry**, Coverage tab unused JS, LCP, INP/TBT, CI budget fail PR.

**Procedure nên nói to**

1. **Làm rõ con số.** Network panel: 3MB **transferred** là khẩn cấp. 3MB **parsed** / 700KB gzip vẫn tệ cho một entry, nhưng là cuộc nói chuyện khác. Confirm đó là `assets/entry-*.js`, không phải chunk `monaco` lazy bị đọc nhầm thành main.
2. **Reproduce bằng treemap** từ đúng commit CI đã build. Sort theo parsed size. Screenshot top 10 module — *đó* là câu trả lời.
3. **Thủ phạm Vue/Nuxt điển hình**
   - Router/layout **import tĩnh** mọi page hoặc widget dashboard dùng trên `/`.
   - `import { something } from '@/components'` barrel kéo Element Plus / Vuetify / hết icon.
   - `import * as echarts from 'echarts'`, `moment`, `lodash` (không phải `lodash-es` / per-method), `xlsx`, `monaco-editor`, map SDK.
   - Full icon pack (`@iconify-json` đổ vào client).
   - **Inline source map** hoặc build chưa minify (`vite build --mode development`).
   - Hai bản `vue` / `pinia` (check analyzer có folder duplicate).
4. **Fix bằng quyết định, không folklore `manualChunks`.**

```ts
// Only split vendors you know are huge AND not on the first screen.
// Route-level defineAsyncComponent / Nuxt pages should do the rest.
manualChunks(id) {
  if (id.includes("node_modules/echarts")) return "echarts";
  if (id.includes("monaco-editor")) return "monaco";
}
```

5. **Thay hoặc trì hoãn:** `moment` → `date-fns` hoặc `Intl`; `echarts` mặc định → `import()` động khi chart widget mount (`<ClientOnly>` trong Nuxt); icon set → import tường minh.
6. **Đo lại** gzip entry, LCP trên profile throttle, và unused JS. Nếu LCP là image/TTFB, bạn đang tối ưu nhầm budget.

**Tradeoff**

- Thêm một round trip cho chart vs 400KB trên mọi page.
- Ổn định `manualChunks` (cache tốt hơn `echarts-*.js`) vs automatic splitting của Rollup.
- Plugin Element Plus on-demand vs full import hơi lớn hơn nhưng đơn giản hơn trên internal tool 50 user.

**Gotcha production**

- **Layout** Nuxt import widget nặng — layout không bị page-split.
- CSS cả design system nằm trên critical path trong khi JS trông “ổn.”
- Source map đã upload nhưng **tên release** không khớp, nên bạn nghĩ chưa ship map — thực ra đã, hoặc ngược lại.
- Federation remote kéo Vue riêng vào main của host.

**Câu hỏi nối**

- Khác nhau giữa `defineAsyncComponent` và split cấp route?
- Giữ package design-system tree-shakeable thế nào? (`sideEffects`, không barrel, entrypoint per-component)
- Bạn gate Lighthouse performance score hay **byte budget**? (bytes + INP; score nhiễu)

---

[← Back to Overview](../../README.md)
