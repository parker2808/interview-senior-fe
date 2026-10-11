# Modules

## Two layers

| Path | Owns |
|---|---|
| `parker2808/interview-fe-data` | Bilingual JSON (KB, 30-day plan, Q&A) pulled at build |
| [`src/modules/`](../src/modules/) | **UI feature modules** (Nuxt) — see [STRUCTURE.md](../STRUCTURE.md) |

Lab starter code (not site copy) still lives in [`study-plan-30-days/lab-template/`](./study-plan-30-days/lab-template/).

## UI modules (`src/modules/`)

Feature UI follows [STRUCTURE.md](../STRUCTURE.md):

- `src/modules/hub/` — hub landing
- `src/modules/knowledge-base/` — docs reader
- `src/modules/study-plan/` — 30-day plan UI
- `src/modules/interview-qa/` — GitHub-gated Q&A
- `src/modules/content/` — block types + renderer
- `src/modules/core/` — shared components

Thin Nuxt routes live in `pages/` and import views from `@/modules/.../views/`.
