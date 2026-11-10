# Backend learning guide integration revision

## Scope and acceptance

- Keep PR #43 on its existing branch. The existing knowledge-base route, search and nested heading TOC must serve the expanded bilingual guide without changing API scope or auth.
- Its catalog entry stays a single `backend-learning` document, so the EN/VI topic count remains 23. Both READMEs describe the same chapter navigation and dependency on the data PR #65.
- Validate with `CONTENT_LOCAL_PATH` pointed at the PR #65 worktree; run content validation, tests and build. No merge or deploy.
