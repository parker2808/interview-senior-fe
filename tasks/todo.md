# Hub grid, docs scroll, search upgrade

## Plan
- [x] Fix hub tablet grid stretch (`flex-1` / min-heights)
- [x] Docs shell: true `h-dvh` + `min-h-0` inner scroll; ScrollToTop listens to `.docs-main`
- [x] Remove Recent from docs sidebar
- [x] Keyword search over headings (current lang) + jump to hash
- [ ] Verify + PR

## Review
- Hub cards: drop `min-h-screen`/`flex-1`/`justify-between` so tablet grid hugs content
- Docs: `h-dvh` shell + `overflow-y-auto` on `.docs-main` all breakpoints; lock html/body scroll
- ScrollToTop binds window + `.docs-main`
- Sidebar Recent removed
- DocSearch indexes headings via same markdown→HTML pipeline; fuzzy/prefix match; jump to hash
