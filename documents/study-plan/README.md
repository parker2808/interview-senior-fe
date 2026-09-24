# Study plan (30 days)

Materials and a small follow/check UI for the Senior FE interview prep calendar (03/10 → 01/11/2026).

## Layout

```
documents/
  study-plan/
    30-days/          # markdown plan, starters, worksheets, capstone stubs
src/                  # Vite + Vue 3 progress UI
```

## Deploy (Netlify)

Configured in repo-root [`netlify.toml`](../../netlify.toml):

- **Base directory:** `src`
- **Build command:** `npm run build`
- **Publish directory:** `dist` (relative to base → `src/dist`)

## Quick start (UI)

```bash
cd src
npm install
npm run dev
```

## Key docs

| Doc | Path |
|---|---|
| Full plan | [30-days/30-day-study-plan.md](./30-days/30-day-study-plan.md) |
| Daily index | [30-days/daily-index.md](./30-days/daily-index.md) |
| Capstone | [30-days/capstone-brief.md](./30-days/capstone-brief.md) |
| Day 1 starter | [30-days/day-01-starter.md](./30-days/day-01-starter.md) |
