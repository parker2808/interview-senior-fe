# Keyword search for rewritten KB / Q&A content

## Plan
- [x] Inventory every search feature and how each indexes/matches
- [x] Shared keyword matcher: split query, case + Vietnamese-diacritic fold, AND all keywords
- [x] KB search-all API + catalog fallback: index real block text (incl. new senior-answer / extra fields), rank title > heading > body
- [x] Q&A search: diacritics, keywords, example + follow-ups, sensible rank
- [x] Tests: multi-keyword, diacritics, vi/en, new block types
- [x] Run tests + build (B31 ref locally if token available)
- [x] Draft PR (do not merge)

## Inventory

| Surface | Before | After |
|---|---|---|
| KB DocSearch → `GET /api/knowledge-base/search` | Phrase/substring on folded query; known block switch | Keyword AND, diacritics, generic localized-text walk (senior-answer, example, follow-ups, nested extra fields, lists/tables/takeaways). Title > heading > body. Cache headers + `q.length < 2` empty hits unchanged. |
| `searchCatalogTitles` fallback | Titles/slug/category phrase match | Keywords + summary + catalog headings |
| Interview Q&A filter | `toLowerCase().includes` on question/answer/tags | Keyword AND, diacritics, example + follow-ups, rank question > tags > answer > example > follow-ups. Category filter + empty-query order unchanged. |
| Doc sidebar / TOC | Browse/nav only | Unchanged (no keyword search) |
| Plan week filter | Week dropdown | Unchanged (no keyword search) |

## Review
- Tests: `npm test` — 16 passed (search-text, kb-search, qa-search)
- Build: `CONTENT_LOCAL_PATH=/tmp/interview-fe-data-stub npm run build` succeeded (Vercel preset)
- Live API (stub content): `hieu nang` → heading “Hiệu năng build trên CI”; `cache splitchunks` AND body hit; `eventloopmicrotask` example-block hit; `cache bananas` empty
- Browser: DocSearch modal, skeletons, debounce, Escape, VI/EN lang-scoped search
- B31: `CONTENT_REPO_TOKEN` is not in this VM, so `interview-fe-data@cursor/kb-rewrite-b31-final-pass-08d0` could not be pulled. Production default `CONTENT_REPO_REF=main` was not changed.
- Content-repo: no required change. Optional: use `example` / `follow-ups` block types or nested `example`/`followUps` on `senior-answer` (app schema allows both). Generic walk still indexes other Localized fields for search.
