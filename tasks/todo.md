# Layout, Q&A two-pane, auth bugs, bilingual design spec

## Plan
- [x] Restructure EN design spec + add VI version (data files local; GitHub App cannot open interview-fe-data)
- [x] App Spec tab picks vi/en by locale; pull-data copies `.vi.md`
- [x] Full-width KB-like layout for detail pages
- [x] Q&A two-pane + `?q=` deep links (grouped/searchable, mobile list then detail)
- [x] Fix post-redeploy infinite skeleton (chunk reload + boot timeout + pending flag)
- [x] Fix cross-tab session + `?q=` after auth/retry (Bearer localStorage, client fetch)
- [x] Tests, typecheck, fixture validate, build
- [x] Screenshots (Q&A, detail, VI spec; light/dark; desktop + 390px)
- [x] Draft app PR; data repo PR blocked (no GitHub access)

## Review
- Tests: 55 passed / 3 skipped. Typecheck: only pre-existing `scrollTop` on `use-hide-on-scroll-bar.composable.ts`. `CONTENT_LOCAL_PATH=.data/fixture-content` build OK.
- Data spec EN/VI live under `/tmp/interview-fe-data-work/plans/` and `/opt/cursor/artifacts/interview-fe-data-pr/`. `check-practice OK`.
