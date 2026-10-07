# Deepen priority interview questions

## Plan
- [x] Identify the highest-priority 20-30 interview questions for a senior Vue/Nuxt/TypeScript frontend candidate
- [x] Deepen the selected answers with a more consistent structure: direct answer, why, trade-offs, concise example, and follow-ups
- [x] Add any missing foundational frontend questions that are still absent from the interview bank
- [x] Rebuild the site, verify the content change does not break the locked interview flow, and update the existing branch/PR

## Notes
- Canonical source for the locked interview bank: `server/data/interview-questions.ts`
- Client types mirror the server schema in `src/modules/interview-qa/types/interview.type.ts`
- Answers/examples support markdown via `marked`; follow-ups are plain localized strings
- Existing categories are `soft`, `technical`, and `situational`; keep that structure unless a change is clearly necessary
- Search indexes question text, tags, and answers in both languages
- Priority second-pass targets include self-intro/project/seniority, JS async + fundamentals, TypeScript design questions, Vue/Nuxt depth, React-for-Vue-dev basics, performance, testing, accessibility, and security

## Review
- Deepened 29 high-priority questions with a more interview-ready structure across vi/en: short direct answer, why, trade-offs, concise example, and likely follow-ups
- Added 20 missing fundamentals across JavaScript, DOM events, CSS, HTTP/CORS, Vue basics, and React basics
- Increased the bank from 107 to 127 total questions while keeping the same server-driven schema and locked interview UI flow
- Verified `npm run build` still passes after the second-pass content update
