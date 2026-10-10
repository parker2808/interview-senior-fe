# Fix KB renderer, skeletons, plan dates, lang-switch scroll

## Plan
- [x] Audit block renderer, fetch composables, plan dates, locale scroll
- [x] Pull or reconstruct `interview-fe-data` (private; fall back to export from pre-#25 sources)
- [x] Nested lists + lossy block renderer cases (TOC hide, headings/links, tables, code in lists)
- [x] Skeletons / empty-only-after-settle / error+retry; keep useAsyncData SSR
- [x] Strip calendar dates from plan UI and API payloads
- [x] KB lang toggle: keep position (heading index + ratio); no remount/scroll-to-top
- [ ] Commit, push, draft PR
- [ ] `NUXT_IGNORE_LOCK=1 npm run build` + browser verify (desktop/mobile, light/dark)
- [ ] Before/after screenshots on the PR

## Notes
- Data repo is private; a parallel agent is fixing JSON there. This PR makes the **renderer** robust to both flat list strings and nested `children`.
- Plan `date` fields (and the i18n eyebrow range) are display-only leftovers from the 03/10–01/11/2026 calendar. Strip in the app so the data repo can drop them.
