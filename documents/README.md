# Shared documents

Interview **knowledge base** used by every study / practice module.

| Path | Language |
|---|---|
| [`en/`](./en/) | English topic notes |
| [`vi/`](./vi/) | Vietnamese topic notes |

These files are **not** owned by the 30-day plan (or any other module). Modules under [`modules/`](../modules/) should link here with repo-root paths such as `documents/vi/vue3.md`.

The study-plan Vite app bundles `documents/{en,vi}/**/*.md` at build time (alias `@kb`) so production can open them in-app. Keep **one** canonical tree here — do not copy `en`/`vi` into a module.

Deploy requires Vercel **Root Directory = `.` (repo root)** so the build can see this folder (see root [`vercel.json`](../vercel.json)).

See root [README.md](../README.md) / [README-en.md](../README-en.md) for the topic index, and [`modules/README.md`](../modules/README.md) for how modules are structured.
