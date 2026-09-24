# Module: 30-day study plan

Senior FE interview prep calendar (03/10 → 01/11/2026): markdown plan, starters, Capstone worksheets, and a Vite + Vue follow/check UI.

## Layout

```text
modules/study-plan-30-days/
  content/     # plan, daily starters, artifacts, Capstone stubs
  src/         # Vite + Vue 3 progress UI
  README.md
```

Shared interview topics stay in repo [`documents/en`](../../documents/en) and [`documents/vi`](../../documents/vi) — referenced as `documents/vi/...` from content (not owned by this module).

## Quick start (UI)

```bash
cd modules/study-plan-30-days/src
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/ (Netlify publish)
```

The app loads markdown from sibling `../content` at build time (Vite alias `@plan`).

## Deploy (Netlify)

Root [`netlify.toml`](../../netlify.toml) currently points at this module:

| Setting | Value |
|---|---|
| Base directory | `modules/study-plan-30-days/src` |
| Build command | `npm run build` |
| Publish directory | `dist` |

## Key content

| Doc | Path |
|---|---|
| Full plan | [content/30-day-study-plan.md](./content/30-day-study-plan.md) |
| Daily index | [content/daily-index.md](./content/daily-index.md) |
| Capstone | [content/capstone-brief.md](./content/capstone-brief.md) |
| Project context | [content/project-context.md](./content/project-context.md) |
| Day 1 starter | [content/day-01-starter.md](./content/day-01-starter.md) |
