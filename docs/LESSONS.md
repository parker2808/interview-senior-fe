# Lessons

- 2026-10-31: An agent edited the main checkout on `main` instead of its worktree. Always use a T3 worktree branch; the pre-commit hook now blocks `main` and `master`.
- 2026-10-31: A free model failed silently or hit quota without notice. Run work through `~/ai-tools/t3-run.sh` watchdog, which switches model and reports failures.
- 2026-10-31: A big task skipped its plan/spec step. Write the plan before coding and put a spec in `docs/specs/` for big tasks.
