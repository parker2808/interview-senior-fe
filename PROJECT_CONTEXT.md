# PROJECT_CONTEXT — interview-senior-fe (Nuxt 3 app)

> **Mandatory reading for every agent** (Cursor, Codex, Claude Code, T3 Code threads, cloud agents) before touching this repo.
> Every PR to `main` must update **§8 Open items / status** and **§9 Changelog** in the same PR (CI checks that the file changes and exists at HEAD, not individual sections; label `skip-context` bypasses the check). Changes only under `docs/` are exempt.

## 1. Project overview
- **What:** Nuxt 3 app for Senior Frontend interview prep: bilingual (vi/en) knowledge base, 30-day plan, practice path, practice design gallery, PIN-protected Q&A bank. Light/dark theme.
- **Repo:** https://github.com/parker2808/interview-senior-fe · **Production:** https://parker-interview-senior-fe.vercel.app (Vercel).
- **Stack:** Nuxt 3 + Nitro, Vue 3, TypeScript, Tailwind, `@nuxtjs/i18n` (default `vi`, `no_prefix`, cookie `sf_locale`), private Vercel Blob for progress.
- **Content:** pulled at build time from the private repo `<private-content-repo>` by `scripts/pull-data.mjs` into `.data/content` (gitignored), then served by Nitro APIs. The client never imports content JSON.
- **Layout:** `pages/` thin routes, `src/modules/*` feature modules (see `STRUCTURE.md`), `server/api`, `server/utils`, `scripts/`, `schema/`, `i18n/locales/`.

## 2. Confirmed facts
| Fact | Value | Status |
|---|---|---|
| Owner / sole decision maker | Parker (GitHub `parker2808`) | confirmed |
| Content source | `<private-content-repo>` (private) | confirmed |
| Auth today | HttpOnly cookies 12h; `INTERVIEW_PASSCODE` and `EDIT_PASSCODE` are different PINs | README |
| GitHub OAuth login restricted to `parker2808` | **In development** (PR #27, do not touch) | confirmed |
| Accent-insensitive Vietnamese search, write authorization in individual API handlers, CDN caching | confirmed features | Parker, 2026-10 |
| Metrics | none; personal tool, don't invent | Parker |

## 3. Forbidden / hard rules
- Never commit Parker's phone number or personal email. Use `<email>` and `<phone>` placeholders.
- Never commit, paste, or log secrets (passcodes, token secrets, `CONTENT_REPO_TOKEN`, Vercel/Blob tokens, deploy hook URLs).
- Never merge to `main` without Parker's explicit approval ("merge"). Open a PR and stop.
- Never touch PR #27 in `interview-senior-fe` (GitHub OAuth work, in development).
- Vietnamese content must read naturally, never a literal translation of the English.
- Never invent facts, metrics, or confirmations. Mark unknowns as **(uncertain)**.

## 4. UI rules
- Mobile: wide tables scroll horizontally **inside the table only**; the page itself never scrolls sideways.
- Split layouts (e.g. KB, plan): the top nav stays visible; the left menu is a single scroll area (no nested scrollbars).
- All UI chrome strings go in `i18n/locales/en.json` and `vi.json`; document text comes from Localized JSON.
- Follow module conventions in `STRUCTURE.md`.

## 5. Workflow
- One task = one branch (or worktree) = one PR to `main`. Never push to `main` directly.
- Install: `npm ci`. Dev: `npm run dev` (runs pull-data; uses either `CONTENT_LOCAL_PATH` pointing to a local content checkout or `CONTENT_REPO_TOKEN` in env, never committed).
- Checks before PR: `npm test`, `npm run build` when relevant, `npm run data:validate` for content-shape changes.
- Reports to Parker are in Vietnamese, plain language.

## 6. Multi-agent coordination
- A coordinating agent splits work with `delegate_task`; each sub-agent is its own thread and gets a self-contained brief (it cannot see the parent's history), so include all needed context and point it at this file.
- Each agent works on its own branch or git worktree (`git worktree add ../interview-senior-fe-<task> -b <type>/<task>`). Never edit another agent's branch.
- Stay in your task's scope; record decisions and open questions here in the same PR.
- App and data are linked: a change in the content shape needs coordinated PRs in both repos, and the data PR merges only when Parker approves.

## 7. Future work
- Finish GitHub OAuth (PR #27) — Parker's call.
- Portfolio case study lives outside this repo (Parker's portfolio).

## 8. Open items / status
- 2026-10-31 — Agent rules added in `.agents/RULES.md` from the shared rules and verified project rules; private repo names are replaced with placeholders.
- PR #34 review fixes: context-file existence check, accurate CI wording, private source placeholder, and corrected auth/local-dev descriptions.
- (uncertain) anything not confirmed by Parker is listed here before acting on it.

## 9. Changelog
- 2026-10-31 — Added `.agents/RULES.md` and linked it from `AGENTS.md`; verified project-specific guidance against the app and CI configuration.
- 2026-10-30 — Added PROJECT_CONTEXT.md, AGENTS.md and context-check CI (T3 Code multi-agent setup, mirrors lil.j).
- 2026-10-30 — Fixed PR #34 review findings: reject missing/deleted context at HEAD, clarify file-level CI enforcement, redact the private source name, and correct auth/local-dev documentation.
