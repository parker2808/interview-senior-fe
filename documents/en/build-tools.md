# Build Tools

This is senior frontend interview prep, not a bundler tutorial. Interviewers already know Vite is “fast.” They want to hear **why** the dev server is a different product from the production bundle, when you would still pick Webpack/Rspack, and how you would **prove** a build is healthy in CI.

Answer in the same shape every time: **decision → constraint → failure mode → measure.** Vue 3 / Nuxt default to Vite; Webpack is still the Module Federation and legacy-loader conversation.

---

## Table of Contents

1. [Vite vs Webpack](#121-vite-vs-webpack)

2. [CI Build Performance](#122-ci-build-performance)

3. [How You'd Debug a 3MB Main Chunk](#123-how-youd-debug-a-3mb-main-chunk)

---

## IV. Infrastructure & Tools

## 12. Build Tools

### 12.1. Vite vs Webpack

**What they actually ask**

- “Vite vs Webpack — which do you choose and why?”
- “If Vite doesn’t bundle in dev, how does production work?”
- “We need Module Federation. Does that force Webpack?”
- “HMR is slow / the prod bundle regressed after we moved to Vite. What do you look at?”

**How a senior answers** *(decision → constraint → failure mode → measure)*

- **Decision:** Greenfield Vue 3 / Nuxt → **Vite**. Inherit a Webpack 5 plugin/loader maze, or you need **first-class Module Federation today** → **Webpack 5 or Rspack/Rsbuild**, not “Vite because it’s newer.”
- **Constraint:** Dev server speed and production graph optimization are **different jobs**. Vite’s win is an **ESM dev server** (native imports for app source, esbuild pre-bundle for `node_modules`). Production is still a **bundler**: Vite uses **Rollup** (Rolldown is the migration path), Webpack uses its own compiler. Nuxt 3 sits on Vite + Nitro; you are not picking “no bundler.”
- **Failure mode:** Treating Vite as universally faster in prod; shipping a 3MB entry because route splitting never happened; enabling Module Federation on Vite via a plugin and discovering version skew / shared-dep bugs in production; leaking secrets through `VITE_*` defines.
- **Measure:** cold `vite` start, HMR time for a leaf `.vue` vs a Pinia store, CI `vite build` minutes, **gzip/brotli of the entry + async chunks**, LCP/INP on a mid-tier phone, duplicate Vue copies in the analyzer.

#### ESM dev server vs bundle

Webpack (classic): walk the graph, emit bundles, serve those. Even with persistent cache, the first request after a cold start waits on a bundle. HMR patches the **bundle**.

Vite:

1. **App source** is served as ESM. The browser requests `/src/pages/orders.vue`, not `main.js` containing the world.
2. **Dependencies** are pre-bundled with esbuild into the Vite cache (`optimizeDeps`). That converts CJS, merges barrel files, and avoids a 300-import waterfall from `lodash`.
3. Production **must** bundle: HTTP/1, older browsers, wrapping, tree-shaking, and code-splitting are still bundler problems. Rollup’s tree-shaking is excellent for ESM libraries; Webpack’s `splitChunks` is still more tunable for pathological vendor graphs.

If an interviewer says “Vite has no production bundler,” correct them: **dev = ESM (+ esbuild deps), prod = Rollup.**

#### HMR

- Vite HMR: WebSocket invalidate of the changed module and its importers. A leaf SFC is cheap. Editing a **widely imported composable, Pinia store, or CSS token file** still fans out — that is expected, not a Vite bug.
- Webpack HMR: replace a module inside an already-built graph. Fine once warm; expensive when the graph is huge or cache is cold.
- Nuxt extra cost: server routes / Nitro + Vite client. A “slow HMR” report is often **restarting the Nitro server**, not Vue SFC HMR.

Senior follow-through: if HMR of `useAuth.ts` feels like a full reload, the problem is **fan-in**, not the tool. Split the module.

#### Production: Rollup vs Webpack (and friends)

| Tool | You pick it when | You pay |
| --- | --- | --- |
| **Vite + Rollup** | Vue 3 / Nuxt, library mode, ESM-first deps | Weaker than Webpack at exotic loaders; MF is a plugin, not the platform |
| **Webpack 5** | Custom loaders, mature MF, CRA/Vue CLI inheritance | Slow cold builds unless you invest in cache + thread-loader / persistent cache |
| **Rspack / Rsbuild** | Webpack-compatible graph, you want Rust speed, MF still matters | Plugin compatibility is “most,” not “all” |
| **Turbopack** | Next.js App Router team, incremental bundling in that ecosystem | Not a Vue/Nuxt answer. Don’t pretend it is your Vue prod bundler |

#### Module Federation is still a Webpack / Rspack conversation

Webpack 5 (and Rspack) **own** Module Federation: `exposes`, `remotes`, `shared: { vue: { singleton: true } }`, runtime `remoteEntry`. That is what large orgs mean when they say MF.

Vite can do MF **via plugins** (`@originjs/vite-plugin-federation`, official `module-federation` Vite plugin). A senior does not sell that as equivalent:

- Shared singleton Vue/Pinia across host and remotes is the whole game. Get it wrong and you **double Vue** or crash on two reactivity systems.
- Dev-server semantics differ (Vite ESM vs Webpack runtime). “Works on my `vite dev`” is not “works in the host’s prod shell.”
- Independent deploy + contract versioning is an **org** problem. The bundler plugin will not save you.

Default line: **need MF in production with multiple teams → Rspack/Webpack. Vite host + one experimental remote is a spike, not a strategy.** See [15.4](./architecture.md#154-module-federation-micro-frontends) before proposing microfrontends at all.

#### Bundle analysis

Do not guess. Produce a treemap:

- Vite/Rollup: `rollup-plugin-visualizer` (open the HTML in CI as an artifact).
- Webpack: `webpack-bundle-analyzer`.
- Nuxt: same visualizer on the client Rollup build; don’t forget the **Nitro server bundle** is a second graph.

Read **parsed size vs gzip**. Interviewers say “3MB” without saying which. Also hunt **duplicated packages** (`vue` twice, two `date-fns` majors).

#### Source maps: hidden vs cheap

This is a real production decision, not a checkbox.

| Option | Use |
| --- | --- |
| `cheap-module-source-map` | Dev. Fast, maps to original lines, not column-perfect. |
| `sourcemap: true` (`source-map`) | Accurate, large, **linked from the JS** (`//# sourceMappingURL=`). If the `.map` is publicly fetchable, you published your source. |
| `sourcemap: 'hidden'` | **Prod default for a serious app.** Emit `.map` files, **do not** reference them from the bundle. Upload maps to Sentry (or equivalent) at release time, then **do not** put them on the CDN. |
| `nosources` / stripped | Maps without source content. Smaller, worse debugging. Rarely worth it if you already keep maps private. |
| Inline maps in prod | Never. Inflates the payload; this is a classic “why is main 3MB?” answer. |

Measure: map upload success on the **release** that matches `Sentry.init({ release })`. A map for the wrong commit is worse than no map.

#### Env defines

- Vite: only `VITE_*` (or `NUXT_PUBLIC_*`) is client-visible. Everything else is server. `import.meta.env.VITE_API_URL` is compiled in.
- `define` / Webpack `DefinePlugin`: compile-time constants (`__FEATURE_PAYMENTS__: false`) so dead code can be dropped.
- **Never** put secrets in `VITE_*`. They are in the browser bundle. Auth, private API keys, and signing secrets live on Nitro / the BFF.
- Nuxt: `runtimeConfig` public vs private. Public values can still be “baked” depending on how you generate; know whether a change requires rebuild vs runtime env on the Node process.

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

#### When you would still choose Webpack / Rsbuild / Turbopack

Say this out loud:

- **Webpack:** Vue CLI 5 app you are not rewriting this quarter; a loader that has no Vite plugin; MF already in production.
- **Rsbuild/Rspack:** same Webpack mental model, CI is on fire, MF still required. This is the adult Webpack-speed answer in 2025–2026.
- **Turbopack:** you are on **Next.js** and the team already lives in that compiler. For Vue/Nuxt, the analogous “faster graph” bet is Vite / Rolldown / (maybe) Rsbuild — not Turbopack.
- **Stay on Vite** if the pain is “main chunk is huge.” That is an architecture/import problem (12.3), not a reason to migrate bundlers.

**Tradeoffs**

- Vite DX vs Webpack’s plugin universe and MF maturity.
- esbuild pre-bundle hides CJS mess in dev and can **diverge** from Rollup prod (the classic “works in dev, breaks in build” Vite bug — force `optimizeDeps` / `ssr.noExternal` deliberately).
- More `manualChunks` vs letting Rollup split on dynamic `import()`. Over-chunking creates waterfalls.

**Production gotchas**

- `sideEffects: false` missing on a package → tree-shaking leaves dead CSS/JS.
- Barrel files (`components/index.ts` re-exports 80 SFCs) defeat ESM shaking.
- Different Vue copies via nested lockfile or MF `shared` misconfig.
- Source maps on the public CDN.
- `NODE_ENV` / `import.meta.env.PROD` disagreeing in a library built for both.

**Follow-ups they will ask**

- How does Nuxt use Vite vs Nitro? (client Vite, server Nitro/Rollup)
- What is `optimizeDeps.include` for?
- How do you keep HMR fast in a monorepo? (don’t import a whole package barrel; prebundle the workspace lib)
- Why might Rollup prod miss a CJS default export that esbuild allowed in dev?

---

### 12.2. CI Build Performance

**What they actually ask**

- “Our Vue pipeline is 18 minutes. What do you cut?”
- “Should typecheck be in the same job as `vite build`?”
- “How do you cache a pnpm + Vite monorepo?”

**How a senior answers**

- **Decision:** PR pipeline = **lint + typecheck + unit + production build + bundle budget**, in parallel where they don’t share a mutated workspace. Main/release adds **e2e smoke**, image/artifact publish, source-map upload. Lighthouse on every PR only if it is a **budget check**, not a 4-minute lab run.
- **Constraint:** CI minutes are a product metric. The bottleneck is usually **install + uncached Vite/Rollup + serial jobs + rebuilding unchanged packages**, not `eslint`.
- **Failure mode:** caching `node_modules` incorrectly across lockfile changes; uploading source maps from a different commit than the artifact; running Playwright against `vite dev`; treating `:latest` as a cache key.
- **Measure:** wall-clock per job, cache hit rate, time-to-green on a no-op PR, **size-limit / bundlewatch** vs main, flake rate of e2e.

Concrete levers:

1. **Package manager:** `pnpm` store cache keyed on `pnpm-lock.yaml`. Frozen lockfile. Never `npm install` without the lock.
2. **Monorepo:** Turborepo/Nx **remote cache** for `typecheck` and `build`. A docs-only PR should not rebuild the design system if inputs didn’t change.
3. **Parallelism:** `vue-tsc --noEmit` is CPU; `vite build` is CPU+RAM. Split jobs so a type error doesn’t wait on Rollup, but **gate merge on both**.
4. **Vite/Rollup:** persist `node_modules/.vite` only when it actually hits; don’t cache `dist`. `NODE_OPTIONS=--max-old-space-size=4096` when the app is large — OOM kills look like “flaky CI.”
5. **Maps:** generate `hidden` maps in the build job, upload to Sentry with the **release SHA**, drop maps from the artifact that nginx/CDN will serve.
6. **E2E:** smoke against the **production build** (`playwright preview` / Nuxt preview), not HMR. One browser, critical paths only on PR; full matrix on main/nightly.

**Tradeoffs**

- Strict PR gates vs time-to-merge. A senior **shrinks the gate** (smoke, not full matrix) rather than deleting typecheck.
- Remote build cache vs “reproducible from a clean runner” — pin tool versions; treat cache as acceleration, not correctness.
- Running Lighthouse in CI (lab, CPU throttled) vs RUM in prod. CI is for **regressions / budgets**, not the number you put on a slide.

**Production gotchas**

- Caching `~/.npm` but changing Node version → subtle native binary breaks.
- Building with `NODE_ENV=development` because the Docker image copied the wrong command.
- Preview deploys using **prod** `VITE_*` and leaking the production API into a PR.
- Bundle budget only on parsed size, so a new gzip-friendly library “passes” while TBT explodes.

**Follow-ups**

- Where do you fail the PR: 5% JS growth? absolute 200KB gzip overage?
- How do you typecheck Vue SFCs in CI? (`vue-tsc`, not `tsc` alone)
- Do you build once and deploy the **same artifact** to staging and prod? (yes — see [14.1](./devops.md#141-gitops-argocd-pipeline))

---

### 12.3. How You'd Debug a 3MB Main Chunk

**What they actually ask**

“Production `main` is ~3MB. Walk me through it.” They want a **procedure**, not “we’d code-split.”

**How a senior answers**

- **Decision:** Stop guessing. Measure **transferred vs parsed**, generate a **treemap**, then attack in this order: (1) accidental sync imports of route-level pages, (2) known heavy vendors, (3) barrels / CSS frameworks, (4) inline maps, (5) duplicate packages. Only then consider a bundler migration.
- **Constraint:** The entry chunk must stay small enough that **first paint + hydration/INP** survive a 4G phone. Async chunks can be large if they are behind a route or a user gesture (chart, PDF, editor).
- **Failure mode:** Splitting into 80 micro-chunks and creating a request waterfall on the critical path; dynamically importing something the landing page needs *now*; “fixing” size by stripping source maps you needed for Sentry.
- **Measure:** analyzer treemap, `Content-Encoding: br` size of the **entry**, Coverage tab unused JS, LCP, INP/TBT, a CI budget that fails the PR.

**Procedure you should say out loud**

1. **Clarify the number.** Network panel: 3MB **transferred** is an emergency. 3MB **parsed** / 700KB gzip is still bad for an entry, but it is a different conversation. Confirm it is `assets/entry-*.js`, not a lazily loaded `monaco` chunk misread as main.
2. **Reproduce with a treemap** from the same commit CI built. Sort by parsed size. Screenshot the top 10 modules — that *is* the answer.
3. **Typical Vue/Nuxt culprits**
   - Router/layout **statically imports** every page or a dashboard widget used on `/`.
   - `import { something } from '@/components'` barrel pulling Element Plus / Vuetify / all icons.
   - `import * as echarts from 'echarts'`, `moment`, `lodash` (not `lodash-es` / per-method), `xlsx`, `monaco-editor`, map SDKs.
   - Full icon packs (`@iconify-json` dumped into the client).
   - **Inline source maps** or unminified build (`vite build --mode development`).
   - Two copies of `vue` / `pinia` (check the analyzer for duplicate folders).
4. **Fix with a decision, not a folklore `manualChunks`.**

```ts
// Only split vendors you know are huge AND not on the first screen.
// Route-level defineAsyncComponent / Nuxt pages should do the rest.
manualChunks(id) {
  if (id.includes("node_modules/echarts")) return "echarts";
  if (id.includes("monaco-editor")) return "monaco";
}
```

5. **Replace or delay:** `moment` → `date-fns` or `Intl`; default `echarts` → dynamic `import()` when the chart widget mounts (`<ClientOnly>` in Nuxt); icon set → explicit imports.
6. **Re-measure** gzip entry, LCP on a throttled profile, and unused JS. If LCP is image/TTFB, you were optimizing the wrong budget.

**Tradeoffs**

- One extra round trip for a chart vs 400KB on every page.
- `manualChunks` stability (better caching of `echarts-*.js`) vs Rollup’s automatic splitting.
- On-demand Element Plus plugins vs a slightly larger but simpler full import on an internal tool with 50 users.

**Production gotchas**

- Nuxt **layouts** importing a heavy widget — layouts are not page-split.
- CSS of the whole design system in the critical path while JS looks “fine.”
- Source maps uploaded but **release name** doesn’t match, so you think you didn’t ship maps — you did, or the inverse.
- Federation remotes pulling their own Vue into the host’s main.

**Follow-ups**

- Difference between `defineAsyncComponent` and route-level splitting?
- How do you keep a design-system package tree-shakeable? (`sideEffects`, no barrels, per-component entrypoints)
- Would you set a Lighthouse performance score gate or a **byte budget**? (bytes + INP; score is noisy)

---

[← Back to Overview](../../README-en.md)
