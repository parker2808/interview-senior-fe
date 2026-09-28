# Modules

## Two layers

| Path | Owns |
|---|---|
| [`documents/`](../documents/) | Shared interview KB (`en/`, `vi/`) |
| `modules/<track>/content/` | Track markdown only (plan, worksheets, Capstone) |
| [`src/modules/`](../src/modules/) | **UI feature modules** (Nuxt) — see [STRUCTURE.md](../STRUCTURE.md) |

## Content tracks

```text
modules/
  README.md
  <kebab-track-name>/
    README.md
    content/          # markdown owned by this track
```

Name tracks in **kebab-case**. Do **not** nest copies of `documents/en|vi` inside a track.

## UI modules (`src/modules/`)

Feature UI follows [STRUCTURE.md](../STRUCTURE.md) (same convention as product-details):

- `src/modules/hub/` — hub landing
- `src/modules/knowledge-base/` — docs reader
- `src/modules/study-plan/` — 30-day plan UI
- `src/modules/core/` — shared components

Thin Nuxt routes live in `pages/` and import views from `@/modules/.../views/`.

## Current content tracks

| Track | Path | Notes |
|---|---|---|
| 30-day study plan | [`study-plan-30-days/`](./study-plan-30-days/) | Markdown plan + Capstone artifacts |
