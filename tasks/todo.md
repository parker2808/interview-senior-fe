# Hub + Knowledge Base Nuxt Migration

## Plan
- [x] Scaffold Nuxt + TS + Tailwind + i18n
- [x] Restructure to `src/modules/` per STRUCTURE.md
- [x] Hub page `/` (responsive)
- [x] Docs reader `/docs` (sidebar/TOC/Cmd+K/i18n, responsive)
- [x] Migrate study-plan to `/plan`
- [x] Nitro API + vercel.json
- [x] Cleanup Vite SPA + README
- [ ] Verify desktop/tablet/mobile

## Review
- Folder layout mirrors product-details: thin `pages/` + `src/modules/{hub,knowledge-base,study-plan,core}/`
- `npm run build` succeeds with Nitro vercel preset
