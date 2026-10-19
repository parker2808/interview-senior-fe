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
- Tests: `npm test` — 16 passed + 3 skipped (`tests/real-content.optional.test.ts` runs only when `.data/content` has ≥10 KB docs)
- Build: `CONTENT_LOCAL_PATH=/tmp/interview-fe-data-stub npm run build` succeeded (Vercel preset)
- B31 fetch: **impossible from this agent**. GitHub App installation token can only see `parker2808/interview-senior-fe` (`GET /installation/repositories` total=1). `gh`, GraphQL, git clone, and tarball of `parker2808/interview-fe-data` all 404. No `CONTENT_REPO_TOKEN` in the environment.
- Unblock: install the Cursor GitHub App on `interview-fe-data` (Contents: Read), **or** add `CONTENT_REPO_TOKEN` to this environment, then `CONTENT_REPO_REF=cursor/kb-rewrite-b31-final-pass-08d0 npm run data:pull`.
- Renderer vs B31 FYI: KB `heading`/`paragraph`/`thematic-break`/`callout`/`table`/`list`/`key-takeaways`/`code`/`senior-answer`+`label` already render; Q&A `example` + `followUps` already render on `QuestionCard`.
