# AGENT_RULES: interview-senior-fe
Common rules and token flow live in `<private-memory-repo>`: `rules/COMMON_RULES.md`, `rules/TOKEN_FLOW.md`, templates in `templates/` (ask Parker if you lack access). This file only adds repo facts; keep it about 30 lines.

## Start (token flow)
- Read `PROJECT_CONTEXT.md`, then `graphify-out/GRAPH_REPORT.md`. Query by exact names (`graphify explain "Name"`, `graphify path "A" "B"`); open only needed line ranges, each file once. Refresh: `graphify update .` (no model calls; the report is committed, the rest of `graphify-out/` is ignored).
- Small task (copy, style, one file): do it directly. Big task: plan (≤ 20 lines) → small steps with checks → handoff → paid review of plan + diff only.
- Free agents: no work outside the plan, no new dependencies, no merging.

## Stack
- Public. Nuxt 3 + Nitro, Vue 3, TS, Tailwind, `@nuxtjs/i18n` (default `vi`, `no_prefix`), private Vercel Blob for progress. npm (`npm ci`); `predev`/`prebuild` pull content.

## Checks (run before PR, paste results)
- `npm test`; `npm run build` when the app/build is affected; `npm run data:validate` for content-shape changes.
- `bash .github/scripts/context-check.sh origin/main HEAD` after committing.
- CI `ci.yml` (`checks`: vitest, build only with the content token) uses `.github/actions/setup`.

## Where things live
- Content is pulled at build time into gitignored `.data/content/` and served via `server/api/`; client code never imports content JSON.
- Thin `pages/`, feature code in `src/modules/`, server helpers in `server/utils/`, schema in `schema/`, UI strings in `i18n/locales/`. Follow `STRUCTURE.md`.

## Forbidden
- No secrets, personal contact details, invented facts, or private repo names.
- **Never touch PR #27.** Never merge without Parker's OK.
- Vietnamese must read naturally. Mobile tables scroll inside the table; no sideways page scroll.

## PRs
- `<type>/<topic>` branch, one PR, plain-sentence title. Update `PROJECT_CONTEXT.md` §8 and §9 (context-check).
