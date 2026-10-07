# Expand Interview Q&A bank

## Plan
- [x] Inspect how interview Q&A content is stored, localized, served, and rendered
- [x] Confirm the canonical data source and schema for question content
- [ ] Improve the existing interview questions with fuller, more accurate senior-level answers
- [ ] Add a large new set of detailed questions across JS, TypeScript, Vue/Nuxt, React, browser/perf, CSS/a11y, security, testing, system design, behavioral, and live-coding topics
- [ ] Keep the current bilingual `vi` / `en` structure, markdown format, and category/tag conventions intact
- [ ] Run the Nuxt build and fix any issues caused by the content expansion
- [ ] Commit, push, and open/update the PR

## Notes
- Canonical source for the locked interview bank: `server/data/interview-questions.ts`
- Client types mirror the server schema in `src/modules/interview-qa/types/interview.type.ts`
- Answers/examples support markdown via `marked`; follow-ups are plain localized strings
- Existing categories are `soft`, `technical`, and `situational`; keep that structure unless a change is clearly necessary
- Search indexes question text, tags, and answers in both languages

## Review
- Pending implementation
