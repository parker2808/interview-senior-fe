# Shared documents

Interview **knowledge base** used by every study / practice module and the Nuxt Knowledge Base UI (`/docs`).

These notes are written for **senior frontend interview prep**, not as a tutorial or university curriculum. Interviewers at this level assume the API is already known. Each section is shaped for a live round:

1. **What they actually ask** — a production scenario, not “what is X”
2. **How a senior answers** — decision → constraint → failure mode → how you measure
3. **Tradeoffs** — when you would *not* use the thing
4. **Production gotchas** — races, hydration, leaks, auth, cache, a11y
5. **Follow-ups** — drills that separate mid-level from senior

**English (`en/`) is the source of truth.** Vietnamese (`vi/`) matches the same structure and judgment.

| Path | Language |
|---|---|
| [`en/`](./en/) | English topic notes |
| [`vi/`](./vi/) | Vietnamese topic notes |

These files are **not** owned by the 30-day plan (or any other content track). Link with repo-root paths such as `documents/vi/vue3.md`.

## Layout

```text
repo/
  documents/                 # single source of truth for interview topics
  modules/<track>/content/   # track-only markdown
  src/modules/               # Nuxt UI features (see STRUCTURE.md)
  server/api/                # Nitro progress / edit auth
```

**Rules**

1. **One KB** — never copy `en/` / `vi/` into a module.
2. **In-app** — Nuxt Knowledge Base at `/docs/:lang/:slug`. Study-plan day links open this in a **new tab** so the day page stays put.
3. Bundle via Vite aliases `@kb` → `documents/`, `@plan` → plan content.

See root [README.md](../README.md) for the topic index and [STRUCTURE.md](../STRUCTURE.md) for UI module layout.
