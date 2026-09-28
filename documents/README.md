# Shared documents

Interview **knowledge base** used by every study / practice module.

| Path | Language |
|---|---|
| [`en/`](./en/) | English topic notes |
| [`vi/`](./vi/) | Vietnamese topic notes |

These files are **not** owned by the 30-day plan (or any other module). Modules under [`modules/`](../modules/) should link here with repo-root paths such as `documents/vi/vue3.md`.

## Layout design (KB ↔ modules)

```text
repo/
  documents/                 # single source of truth for interview topics
    en/ · vi/ · README.md
  modules/<track>/
    content/                 # that track only: plan, starters, artifacts, capstone
    src/                     # optional UI (Vite aliases below)
  vercel.json · api/         # deploy root = `.` so the UI can read documents/
```

**Rules**

1. **One KB** — never copy `en/` / `vi/` into a module. Link with `documents/...` (relative from the markdown file is fine).
2. **Module owns the plan** — calendars, worksheets, and Capstone stubs live under `modules/<track>/content/`.
3. **Vite bundles both trees** for the study-plan UI:
   - `@plan` → `modules/study-plan-30-days/content/**/*.md`
   - `@kb` → `documents/**/*.md`
4. **In-app first** — the Vue UI opens bundled paths via `#doc/...`. GitHub blob is only the fallback for non-bundled repo files (`README.md`, `jd1.md`, …).
5. **Back navigation** — opening a KB/doc from a day pushes History so **← Quay lại Day N** (and the browser back button) return to that day.

Deploy requires Vercel **Root Directory = `.` (repo root)** so the build can see this folder (see root [`vercel.json`](../vercel.json)).

See root [README.md](../README.md) / [README-en.md](../README-en.md) for the topic index, and [`modules/README.md`](../modules/README.md) for how modules are structured.
