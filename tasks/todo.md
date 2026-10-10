# Fix KB renderer, skeletons, plan dates, lang-switch scroll

## Plan
- [x] Audit block renderer, fetch composables, plan dates, locale scroll
- [x] Pull or reconstruct `interview-fe-data` (private; fall back to export from pre-#25 sources)
- [x] Nested lists + lossy block renderer cases (TOC hide, headings/links, tables, code in lists)
- [x] Skeletons / empty-only-after-settle / error+retry; keep useAsyncData SSR
- [x] Strip calendar dates from plan UI and API payloads
- [x] KB lang toggle: keep position (heading index + ratio); no remount/scroll-to-top
- [x] Commit, push, draft PR
- [x] `NUXT_IGNORE_LOCK=1 npm run build` + browser verify (desktop/mobile, light/dark)
- [x] Before/after screenshots on the PR
- [x] i18n for BlockRenderer chrome labels (`key-takeaways` → Nhớ nhanh)
- [x] KB search-all: server index + GET /api/knowledge-base/search (diacritics, body/code)
- [x] DocSearch: debounce, skeleton, empty, keyboard, heading anchors
- [x] DocToc: all heading levels as nested tree; chevron on every parent
- [x] TOC expand-all / collapse-all; auto-expand active branch; stable while scrolling
- [x] README.md is English; Vietnamese moved to README-vi.md; drop README-en.md
- [x] Rewrite README as a project doc (stack, APIs, mermaid, local/deploy); slim STRUCTURE.md

## Review
- Draft PR: https://github.com/parker2808/interview-senior-fe/pull/26
- Content: private `interview-fe-data` was 404; reconstructed via `data:export` from pre-#25 sources into `CONTENT_LOCAL_PATH`.
- Build: `CONTENT_LOCAL_PATH=/tmp/interview-fe-data NUXT_IGNORE_LOCK=1 npm run build` succeeded (Vercel preset) on the search/TOC revision.
- Search API: `hieu nang` → heading “Hiệu năng build trên CI”; `toi uu` → body “tối ưu”; `phong van` → titles “Phỏng vấn”; EN `hoisting` / `rows.sort` hit heading + body and open the hash.
- TOC: JS doc has 11 H4s with ids; desktop tree + expand/collapse all; mobile “On this page” same tree.
- README.md is English; Vietnamese is README-vi.md; README-en.md removed.

## Notes
- Data repo is private; a parallel agent is fixing JSON there. This PR makes the **renderer** robust to both flat list strings and nested `children`.
- Plan `date` fields (and the i18n eyebrow range) are display-only leftovers from the 03/10–01/11/2026 calendar. Strip in the app so the data repo can drop them.
