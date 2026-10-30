# AGENT_RULES.md

## Common rules

Source: `ai-memory/rules/COMMON_RULES.md` (copied verbatim below).

# COMMON_RULES — Parker's flow (all agents, all repos)

Source of truth for every agent (T3, Codex, Cursor, OpenCode, Grok Bot) working on `parker2808` repos.
Built only from what the repos, PR history, CI and bot exports actually show (rebuilt 2026-10-31). Project rule files (`AGENT_RULES.md` in each repo) add to these, never relax them.

## 1. Before you start
- Read the repo's `AGENTS.md` and `PROJECT_CONTEXT.md` in full first. They hold confirmed facts, forbidden items and status.
- Read this file. If a project rule and this file disagree, the stricter one wins; ask Parker if unsure.
- Check `git status` and the open PRs first; preserve other people's work.

## 2. Branches, commits, PRs
- One task = one branch (or git worktree) = one PR to `main`. Never push or commit to `main` directly.
- Branch names: `<type>/<short-kebab-topic>` with type `feat|fix|chore|docs|content|plan` (e.g. `fix/desktop-chapter-drawer`, `chore/project-context`). Cloud agents may add a short suffix (`cursor/<topic>-<4hex>`).
- One agent per branch/worktree. Never commit to another agent's branch, never share a working tree.
- Stay in your task's scope. Write anything out of scope into PROJECT_CONTEXT open items instead of doing it.
- PR title: short, plain, says what changed. lil.p uses conventional commits (enforced by commitlint); the other repos use a plain sentence title ("Fix …", "Add …", "Plan: …", "content: …"). PR number is appended on squash merge (`(#57)`).
- PR body: what's in it, constraints respected, checks run (commands + result), and what Parker still needs to decide. Say clearly if it must not be merged yet.
- Stacked PRs are OK. Multi-PR work can go to an integration/preview branch first.
- Monitor CI until every check is green; fix failures yourself and report the check status.

## 3. Merging (absolute)
- **Never merge, deploy, or close a PR without Parker's explicit OK ("merge").** Open the PR and stop. One PR at a time.
- Only exception: `parker2808/ai-memory` may be auto-merged after a secrets/PII scan passes.
- **Never touch PR #27 in `interview-senior-fe`** (GitHub OAuth, in development).

## 4. PROJECT_CONTEXT.md + context-check CI
- Every PR to `main` that changes files outside the exempt paths must update `PROJECT_CONTEXT.md` (status/open items + changelog sections) in the same PR.
- CI `context-check` fails if `PROJECT_CONTEXT.md` is missing at HEAD or not in the diff for non-exempt changes. Exempt: `docs/` (plus content folders in interview-fe-data).
- The `skip-context` label bypasses the check; use only when Parker agrees.
- Record new decisions from Parker (with date) in PROJECT_CONTEXT.md in your PR. Never invent rules.

## 5. Privacy and secrets (absolute)
- Never commit, paste, print or log secrets: `.env` values, tokens, passcodes, API keys, deploy hook URLs, auth codes. Not in code, PRs, logs or chat.
- Never commit Parker's phone number or personal email. Use `<email>` and `<phone>` placeholders.
- Public repos: `lil.p`, `lil.j`, `interview-senior-fe`. Never name or link private repos there (write `<private-content-repo>`).
- Private: `interview-fe-data`, `ai-memory`.

## 6. Facts and content
- Never invent facts, dates, metrics, memories, places, captions or confirmations. Mark unknowns as **(uncertain)** or leave blank and list them as open items.
- No hard-coded content where the project keeps it in data (DB/CMS in lil.p, `site/content.json` in lil.j, JSON data repo for interview-senior-fe).
- Bilingual EN + VI where the project is bilingual. Vietnamese must read naturally, never a literal translation.
- Free services only ($0 hosting: Vercel, Render free, TiDB, Cloudinary); no paid packages/extensions.

## 7. Talking to Parker
- Reply in plain, natural Vietnamese, short and concrete (he is often on his iPhone). No stiff literal translation, no em dashes.
- Give short options when a decision is needed; send results for review first (screenshots for UI work).
- If facts are missing, stop and ask; don't guess.
- Parker tests UI on iPhone 14 Pro Max (430×932) first.

## 8. Checks before opening a PR
- Run the repo's own checks (listed in its project rules) and paste the results in the PR body.
- Run a secrets/PII grep on the diff (tokens, `@` emails, phone numbers) before pushing.
- Package managers: lil.p uses pnpm (workspace, husky + commitlint); interview-senior-fe uses npm (`package-lock.json`); lil.j and interview-fe-data have no package manager (static site / JSON + node scripts).

## Project rules for interview-senior-fe

- **Stack:** Nuxt 3 + Nitro, Vue 3, TypeScript, Tailwind, `@nuxtjs/i18n` (default `vi`, `no_prefix`, cookie `sf_locale`), and private Vercel Blob for progress. The app is bilingual (Vietnamese and English).
- **Package manager:** npm with `package-lock.json`. Install with `npm ci`. `npm run dev` and `npm run build` run `scripts/pull-data.mjs` first through `predev` and `prebuild`.
- **Checks before a PR:** Run `npm test`. Run `npm run build` when the change affects the build or app. Run `npm run data:validate` for content-shape changes. For changes outside `docs/`, run `bash .github/scripts/context-check.sh origin/main HEAD` after committing and update `PROJECT_CONTEXT.md` §8 and §9 in that commit.
- **CI:** `.github/workflows/context-check.yml` runs on PRs to `main` and calls `.github/scripts/context-check.sh`. It requires `PROJECT_CONTEXT.md` to exist at HEAD and be changed for non-`docs/` changes; the `skip-context` label bypasses the job.
- **CI checks:** `.github/workflows/ci.yml` runs on PRs, pushes to `main` and manual dispatch, with shared setup in `.github/actions/setup` (Node 22, npm cache, `npm ci`). Job `checks` runs `vitest run` on fixtures and the Nuxt build only when the `CONTENT_REPO_TOKEN` secret is set (content is pulled at build time). Stale PR runs are cancelled, `main` runs never; every job has `timeout-minutes`; logs upload as artifacts. Any CI change must follow the shared front-end CI/CD lessons in Parker's memory repo.
- **Content and code locations:** Content is pulled at build time by `scripts/pull-data.mjs` into gitignored `.data/content/`, then served through `server/api/`; client code must not import content JSON. Use `pages/` for thin routes, `src/modules/` for feature modules, `server/utils/` for server helpers, `schema/` for content schema, and `i18n/locales/en.json` and `vi.json` for UI strings. Follow `STRUCTURE.md`.
- **Forbidden:** Do not commit personal contact details or secrets, invent facts or metrics, merge without Parker's explicit approval, or touch PR #27. Vietnamese text must read naturally. Mobile tables scroll within the table; pages must not scroll sideways. Split layouts keep the top nav visible and use one scroll area for the left menu.
- **Branches and PR titles:** Use one branch or worktree and one PR to `main` per task. Branch names use `<type>/<short-kebab-topic>`. Recent PRs use short, plain titles such as `Add …` or `Fix …`; this repo does not require conventional-commit PR titles. For this task, use `Add agent rules (common + project)`.
