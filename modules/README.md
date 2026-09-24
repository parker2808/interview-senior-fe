# Modules

Self-contained study / practice tracks that **build on** the shared interview knowledge base in [`documents/`](../documents/).

## Shared vs module

| Area | Owns | Does not own |
|---|---|---|
| [`documents/`](../documents/) | Interview topics (`en/`, `vi/`) — common across tracks | Day plans, worksheets, module UIs |
| `modules/<name>/` | That track’s markdown + optional app | Copying or forking the shared KB |

Modules **reference** shared docs by repo-root path, e.g. `documents/vi/vue3.md` or `documents/en/testing.md`. Prefer those paths in prose and tables so links stay stable when modules move.

## Layout convention

```text
modules/
  README.md                 # this file
  <kebab-module-name>/
    README.md               # what the module is, how to run it
    content/                # module-owned markdown (plan, starters, artifacts)
    src/                    # optional Vite (or other) app for this module
```

Name modules in **kebab-case** (`study-plan-30-days`, `system-design-drills`, …).

## Adding a module later

1. Create `modules/<name>/` with `README.md` and usually a `content/` folder.
2. Link shared topics with `documents/...` paths (do not nest copies of `en`/`vi` inside the module).
3. If the module has a UI, put it in `modules/<name>/src/` with its own `package.json`.
4. Wire Netlify (or another host) when that module should be the live site — today root [`netlify.toml`](../netlify.toml) builds `modules/study-plan-30-days/src` only.

## Current modules

| Module | Path | Notes |
|---|---|---|
| 30-day study plan | [`study-plan-30-days/`](./study-plan-30-days/) | Plan + Capstone artifacts + Vue follow UI |
