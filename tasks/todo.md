# Practice module

## Plan
- [x] Types, readers, optional `practice/` in pull + validators
- [x] Fixtures matching data-repo shape (p01–p33, exact p06)
- [x] API `/api/practice`, `/api/practice/step/:id`, `/api/practice/steps`, `/api/practice/progress`
- [x] Search util (AND, fold diacritics, title > tags/concepts > body, both langs)
- [x] Progress: `practice-progress.json` Blob + localStorage, mirror plan tools
- [x] Pages `/practice` and `/practice/step/[id]` + components, skeletons, empty/error
- [x] Hub card + nav link, hidden when `practice/` missing
- [x] i18n en/vi
- [x] Tests for search and readers
- [x] typecheck, tests, fixture build, SSR routes
- [x] Draft PR (never merge)

## Review
- New standalone `src/modules/practice/` mirrors study-plan: list grouped by milestone with progress bars, Continue to next unfinished step, search box; step page with why, estimate, prereq links, concepts, tasks+code, done-when, pitfalls, KB/Q&A links, suggested commit, prev/next, mark done.
- Readers `readPracticeIndex()` / `readPracticeStep(id)` (`^p\d{2}$` else 404). `practice/` is optional in pull + validators; hub card and Plan top-bar nav link hide when the folder is missing.
- Progress is a separate Blob key / public file `practice-progress.json` with localStorage fallback; edit gate reused from the plan.
- Search reuses `search-text.util` (AND, fold diacritics, both locales; title > tags/concept terms > body).
- Verify: `nuxi typecheck` — our files clean; pre-existing `scrollTop` error in `use-hide-on-scroll-bar.composable.ts`. `npm test` 35 passed / 3 skipped. Fixture `data:validate` OK. `CONTENT_LOCAL_PATH=.data/fixture-content npm run build` OK. Live SSR: `/practice` and `/practice/step/p06` 200 with content (not empty/loading); `/api/practice/step/p6` and `/foo` 404; hub card + plan nav present. Browser: search prisma/hieu nang, p06 detail, prereq nav, EN locale.
