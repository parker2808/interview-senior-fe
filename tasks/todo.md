# Fix Interview Q&A mobile overflow

## Plan
- [x] Harden `.prose-doc` so long inline code/paths wrap (root cause)
- [x] Contain overflow on Interview card / open panel
- [x] Verify on narrow viewport
- [x] Commit + PR

## Notes
Screenshot: `modules/customers/{pages,components,api,model,tests}` teal inline code spills past viewport on mobile.

## Review
- Root cause: `.prose-doc code` had no wrap; long paths blew out card width
- Fix: `overflow-wrap: anywhere` on prose + inline code; `min-w-0` / overflow containment on interview list/card
- Verified at 390px: `scrollWidth === clientWidth`, path wraps (~40px tall), right edge stays inside card
- PR: https://github.com/parker2808/interview-senior-fe/pull/18
