# Changelog archive — interview-senior-fe

Full changelog moved verbatim from `PROJECT_CONTEXT.md` on 2026-11-01. New entries go to `PROJECT_CONTEXT.md`.

- 2026-10-31 — Made `AGENTS.md` canonical, added lessons, blocked commits on protected branches, and added local/CI gitleaks scans.
- 2026-10-31: Added Graphify code map (`graphify-out/GRAPH_REPORT.md` committed, rest of `graphify-out/` gitignored; built with `--code-only`, no model calls) and shortened `AGENT_RULES.md` to ~30 lines pointing to the shared common rules and TOKEN_FLOW in `<private-memory-repo>`. Pending Parker's review.
- 2026-10-31 — Added front-end CI (`ci.yml`: vitest + token-gated Nuxt build, npm cache, concurrency, timeouts, log artifacts) per the shared CI/CD lessons.
- 2026-10-31 — Added `AGENT_RULES.md` with shared and project rules and linked it from `AGENTS.md`.
- 2026-10-30 — Added PROJECT_CONTEXT.md, AGENTS.md and context-check CI (T3 Code multi-agent setup, mirrors lil.j).
- 2026-10-30 — Fixed PR #34 review findings: reject missing/deleted context at HEAD, clarify file-level CI enforcement, redact the private source name, and correct auth/local-dev documentation.
