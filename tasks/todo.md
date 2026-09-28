# UX: header overlap, dark mode, scroll-top, links, lang scroll

## Plan
- [x] Fix sticky header covering content after reload/nav (scroll restoration)
- [x] Dark mode (CSS vars + toggle + persist)
- [x] Scroll-to-top FAB
- [x] Fix/enhance markdown hyperlink handling (autolink bare `.md` paths)
- [x] Keep scroll position when switching language
- [x] Verify + PR

## Review
- Playwright: dark toggle OK; day1 checkbox below sticky; md link → `/plan/doc/...`; FAB works; VI→EN keeps mid-page scroll
- PR: https://github.com/parker2808/interview-senior-fe/pull/13
