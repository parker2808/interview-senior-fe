# Module: 30-day study plan

Senior FE interview prep calendar (03/10 → 01/11/2026): markdown plan, starters, Capstone worksheets, and a Vite + Vue follow/check UI.

**Live / Demo:** [https://parker-interview-documents.netlify.app](https://parker-interview-documents.netlify.app)

## Layout

```text
modules/study-plan-30-days/
  content/     # plan, daily starters, artifacts, Capstone stubs
  src/         # Vite + Vue 3 progress UI
  README.md
```

Shared interview topics stay in repo [`documents/en`](../../documents/en) and [`documents/vi`](../../documents/vi) — linked from content with relative paths (not owned by this module).

## Markdown links (GitHub + in-app)

| Target | In `.md` files | In the Vue follow UI |
|---|---|---|
| Module `content/` | Relative links between files | In-app navigation (`#day/N`, `#doc/…`) |
| Shared `documents/` / root `README.md` / `jd1.md` | Relative paths from the file (e.g. `../../../documents/vi/…`) | Opens [GitHub blob on `main`](https://github.com/parker2808/interview-senior-fe/blob/main/documents/) (KB is not bundled) |

Do not use Agent Store paths (`/cursor/stores/…`) or absolute `/workspace/…` paths in repo files.

## Quick start (UI)

```bash
cd modules/study-plan-30-days/src
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/ (Netlify publish)
```

The app loads markdown from sibling `../content` at build time (Vite alias `@plan`).

## Progress (no backend)

- **Local:** `localStorage` on this device
- **Share link:** copy a URL with a compact day bitmask in the hash (`#share=…`) — opens **view-only** (does not overwrite local)
- **Public file:** optional [`src/public/progress.json`](./src/public/progress.json) → served as `/progress.json` after Netlify deploy
- **Export / Import:** download or upload JSON backup from the UI

## Deploy (Netlify)

Root [`netlify.toml`](../../netlify.toml) currently points at this module:

| Setting | Value |
|---|---|
| Base directory | `modules/study-plan-30-days/src` |
| Build command | `npm run build` |
| Publish directory | `dist` |

Live site: [parker-interview-documents.netlify.app](https://parker-interview-documents.netlify.app)

## Key content

| Doc | Path |
|---|---|
| Full plan | [content/30-day-study-plan.md](./content/30-day-study-plan.md) |
| Daily index | [content/daily-index.md](./content/daily-index.md) |
| Capstone | [content/capstone-brief.md](./content/capstone-brief.md) |
| Project context | [content/project-context.md](./content/project-context.md) |
| Day 1 starter | [content/day-01-starter.md](./content/day-01-starter.md) |
