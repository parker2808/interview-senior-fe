# Shared documents

Interview **knowledge base** used by every study / practice module and the Nuxt Knowledge Base UI (`/docs`).

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
2. **In-app** — Nuxt Knowledge Base at `/docs/:lang/:slug`; study-plan day links navigate there.
3. Bundle via Vite aliases `@kb` → `documents/`, `@plan` → plan content.

See root [README.md](../README.md) for the topic index and [STRUCTURE.md](../STRUCTURE.md) for UI module layout.
