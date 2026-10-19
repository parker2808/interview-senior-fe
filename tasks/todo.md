# Practice Design page

## Plan
- [x] Extend pull-data: optional `plans/portfolio-design-system.md` + `practice/design/`; copy screens to public
- [x] Fixtures: spec markdown, design index, WebP screens, § specRefs
- [x] Types, readers, §-ref → heading-anchor mapping, validator
- [x] APIs: design index + spec; static/server image serving
- [x] `/practice/design` page: Screens gallery + lightbox; Spec with markdown, sticky TOC, search
- [x] Header/nav links; specRefs clickable on steps + cards; hide if missing
- [x] i18n, skeletons, light/dark, mobile
- [x] Tests, typecheck, fixture build, SSR `/practice/design`
- [x] Browser verify + screenshots; draft PR

## Review
- Route `/practice/design` added to the Practice module. Header grid icon + Steps/Design subnav on `/practice`, step pages, and the Design page. Both hide when `practice/design/index.json` is missing.
- Screens tab: filter by public/admin and light/dark; cards with Localized title/caption, lazy WebP (`width`/`height`), clickable `§X.Y` chips, fullscreen lightbox (zoom, arrows, Esc) above the app header.
- Spec tab: `marked` + existing heading-id enhancer, sticky collapsible `DocToc`, keyword AND search with Vietnamese folding (`hieu nang` → `2.3 Hiệu năng`).
- `§X.Y` maps to the heading whose text starts with that number (`1` does not steal `1.5`). Step `specRefs` (p06 `§5.1`) and gallery chips link to `/practice/design?tab=spec#anchor`.
- pull-data copies optional `plans/portfolio-design-system.md` and `practice/design/`; screens go to `public/assets/practice-design/screens/` (not `public/practice/`, which collided with the Vue routes). API fallback `/api/practice/design/screen/:name`.
- Verify: `npm test` 42 passed / 3 skipped. `nuxi typecheck` — our files clean; pre-existing `scrollTop` on `use-hide-on-scroll-bar.composable.ts`. Fixture `data:validate` OK. `CONTENT_LOCAL_PATH=.data/fixture-content npm run build` OK. Live SSR: `/practice/design` 200, `?tab=spec` 200, `/practice` 200 with Design nav, p06 has `§5.1`, screens 200 `image/webp`.
