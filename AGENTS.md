# AGENTS.md — interview-senior-fe

Read [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) in full, then [`docs/LESSONS.md`](docs/LESSONS.md), before starting. Append one line per new lesson.

## Full decision authority

When Parker assigns a task with “có toàn quyền quyết định” to a Grok Bot assistant or the Parker Telegram bot, it may assign T3 coding and review, choose next steps, coordinate bots and threads, merge, deploy, and re-test that task without asking again.
At task start, check required permissions and access; ask Parker once, immediately, for exactly what is missing.
Every existing gate and ban remains mandatory: green CI or the required local gate, review with no P0–P2 findings, privacy, PR #50 backups/rollback/startup logs, 08:00–23:00 ICT merges/deploys, pinned T3 threads, interview-senior-fe PR #27, no paid runners, same-PR README/help updates, and quiet hours. See [COMMON_RULES §3](<private-memory-repo>/rules/COMMON_RULES.md#3-merging-absolute).

## Workflow
- Work in a T3 worktree task branch; never edit or commit on `main` or `master`.
- One task = one branch/worktree = one PR. Stay in scope; never edit another agent's branch.
- Name branches `<type>/<topic>` and use plain-sentence PR titles.
- Handle small tasks directly. For big tasks, hand off the plan and diff for paid review.
- For big tasks, write a plan (at most 20 lines) and a spec in `docs/specs/` before coding. Work in small checked steps.
- Run agent work through `~/ai-tools/t3-run.sh` watchdog, which switches models and reports failures.
- Free agents stay within the plan, add no dependencies, and never merge.
- Never merge to `main` until Parker says "merge". Never touch PR #27.
- Every PR to `main` updates `PROJECT_CONTEXT.md` §8 status and §9 changelog. CI checks file change and existence at HEAD; docs-only changes are exempt, and `skip-context` bypasses CI.

## Navigation and checks
- Small tasks: skip Graphify; use `rg` and open needed lines only. Big tasks: read `graphify-out/GRAPH_REPORT.md`, query `graphify explain`/`graphify path`, refresh with `graphify update .` after code changes.
- Token budget: never read `package-lock.json`, `public/assets/**` or generated `.nuxt`/`.output` files; use `rg`/line ranges and `tail -n 80` for long command output. See `.cursorignore`.
- Use `npm ci`; `predev` and `prebuild` pull content. Run `npm test` before a PR, `npm run build` for app/build changes, and `npm run data:validate` for content-shape changes.
- After committing, run `bash .github/scripts/context-check.sh origin/main HEAD`. CI runs vitest and builds when the content token is available.
- Reports to Parker are in natural Vietnamese and include check results.

## Project
- Public Nuxt 3 + Nitro, Vue 3, TypeScript, Tailwind app with `@nuxtjs/i18n` (default `vi`, `no_prefix`) and private Vercel Blob progress.
- Content is pulled at build time into gitignored `.data/content/` and served via `server/api/`; client code never imports content JSON.
- Keep `pages/` thin, features in `src/modules/`, server helpers in `server/utils/`, schema in `schema/`, and UI strings in `i18n/locales/`. Follow `STRUCTURE.md`.
- Vietnamese must read naturally. Mobile tables scroll inside the table; the page never scrolls sideways.

## Safety
- Never commit secrets, Parker's personal email or phone, or private repository names. Use `<email>`, `<phone>`, `<private-content-repo>`, and `<private-memory-repo>`.
- Never invent facts or metrics; mark unknowns **(uncertain)**.
