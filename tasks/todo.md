# Expand Interview Q&A bank

## Plan
- [x] Inspect how interview Q&A content is stored, localized, served, and rendered
- [x] Confirm the canonical data source and schema for question content
- [x] Improve the existing interview questions with fuller, more accurate senior-level answers
- [x] Add a large new set of detailed questions across JS, TypeScript, Vue/Nuxt, React, browser/perf, CSS/a11y, security, testing, system design, behavioral, and live-coding topics
- [x] Keep the current bilingual `vi` / `en` structure, markdown format, and category/tag conventions intact
- [x] Run the Nuxt build and fix any issues caused by the content expansion
- [x] Commit, push, and open/update the PR

## Notes
- Canonical source for the locked interview bank: `server/data/interview-questions.ts`
- Client types mirror the server schema in `src/modules/interview-qa/types/interview.type.ts`
- Answers/examples support markdown via `marked`; follow-ups are plain localized strings
- Existing categories are `soft`, `technical`, and `situational`; keep that structure unless a change is clearly necessary
- Search indexes question text, tags, and answers in both languages

## Review
- Expanded the interview bank from 26 questions to 107 questions while preserving the existing locked API shape and bilingual content format
- Improved all 26 existing questions and added 81 new ones across soft, technical, and situational categories
- Split the server-side content into per-category files plus a shared helper so the data stays maintainable without changing how the UI or API consume it
- Verified `npm run build` passes after installing repo dependencies; `npx nuxi typecheck` is not available in this repo because no Vue type-checker package is installed
- Draft PR opened for the branch update
