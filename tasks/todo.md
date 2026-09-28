# Fix mobile sticky headers (1-row icon-only)

## Plan
- [x] BackLink + LocaleToggle compact / icon-only support
- [x] Docs header: single nowrap row (menu / back / title / search / locale)
- [x] Plan sticky headers: icon-only hub / docs / back
- [x] Sync header height CSS vars + scroll-padding / HEADER_OFFSET
- [x] Verify mobile screenshots; commit + PR

## Review
- Docs + plan sticky = one `h-12` row with icon controls
- ResizeObserver sets `--docs-header-h` / `--app-header-h`
- Screenshots: mobile-docs-header-1row.webp, mobile-plan-header-1row.webp
- PR: https://github.com/parker2808/interview-senior-fe/pull/12
