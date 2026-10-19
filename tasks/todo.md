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
- Content: unzipped attached B31 snapshot (102 files) to gitignored `.data/content` via `CONTENT_LOCAL_PATH=/tmp/fe-data-b31`. **Not committed.**
- Validate: `CONTENT_DIR=.data/content npm run data:validate` → Content OK (22 KB docs, 142 Q&A, 30 plan days).
- Tests: `npm test` — **19 passed**, including optional real-content suite (distinctive text per KB block type; `hieu nang`/`hiệu năng` parity; `event loop` → javascript; Q&A `internal admin product` example and `chieu sau production vue` follow-ups).
- Live SSR: all 22 KB docs × vi/en return 200 and include `senior-answer` / `callout` / `key-takeaways` / `<table>` / `<pre>` / `<hr>` plus rewritten titles. B31 `senior-answer` is `label`+`text` only (no nested example/followUps in KB JSON); those fields live on Q&A and render in `QuestionCard`.
- Live search API: `hieu nang` ≡ `hiệu năng` (top hit title **Hiệu năng**); `event loop` heading on javascript; body hits for ARIA / AbortController / Core Web Vitals.
- Q&A API: PIN 123456 → 142 questions, every item has `example` + `followUps`.
- Production default `CONTENT_REPO_REF` remains `main`.
