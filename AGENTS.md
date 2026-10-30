# AGENTS.md

**Read [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) in full before doing anything.**

Hard rules (details in PROJECT_CONTEXT.md):
- Never commit Parker's phone or personal email (use `<email>` / `<phone>`), or any secret.
- Never merge to `main`; Parker merges only after he says "merge". Never touch PR #27 in interview-senior-fe.
- Vietnamese must read naturally, not a literal translation.
- One task = one branch/worktree = one PR. Stay in scope; don't edit other agents' branches.
- **Every PR to `main` must update `PROJECT_CONTEXT.md` (§8 status, §9 changelog).** CI (`context-check`) checks that the file changes and exists at HEAD; section updates remain a review requirement. Changes only under `docs/` are exempt. The `skip-context` label bypasses it.
