# Split-pane layout: one scrollbar per pane, sticky nav

## Plan
- [x] Reproduce `/practice/step/p02` nested sidebar scrollbars + document-level content scroll
- [x] Check KB, Q&A, plan day/resource, practice design for the same overflow nesting
- [x] Fix shared app shell: viewport height minus nav, `min-h-0`, one `overflow-y-auto` per pane, no body scroll on desktop
- [x] Mobile: stacked/drawer layout, sticky top nav
- [x] Left menu: overflow-x hidden, truncate/ellipsis, min-w-0
- [x] Markdown tables: wrap + stacked cards on narrow screens, no mid-word identifier breaks
- [x] Keep light/dark themes
- [x] Verify in browser (desktop + mobile) with before/after screenshots
- [x] Draft PR against `main` (do not merge, do not touch PR #27)

## Review
- Root cause: `AppDetailShell` aside used `overflow-y-auto` while `PracticeStepNav` / `DocSidebar` also used `h-full overflow-y-auto`. Flex `min-height: auto` plus hide-on-scroll made the top bar leave the viewport.
- Fix: shared `.docs-split` / `.docs-pane` / `.docs-nav-pane` (`min-h-0`, `overflow-x: hidden`, one vertical scroller). Top bar locked visible. Tables wrapped in `.prose-table-wrap`; mobile uses stacked cards.
- Tests: 61 passed / 3 skipped (including new `tests/prose-tables.test.ts`).
- Browser: desktop 1440 and mobile 390 on practice step, design spec (EN/VI, light/dark), KB, plan day.
