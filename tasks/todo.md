# Move site content to structured JSON APIs

## Plan
- [x] Audit KB, plan, Q&A, and auth surfaces
- [x] Check access to `parker2808/interview-fe-data`
- [x] Content model, TypeScript types, JSON Schema, validation
- [x] Lossless markdown/TS → JSON migration + `npm run data:export`
- [ ] Seed private data repo (blocked: token cannot see interview-fe-data)
- [x] Build-time `scripts/pull-data.mjs` + Nitro server assets
- [x] Public/protected content APIs
- [x] Switch KB / plan / search / TOC to APIs + block renderer
- [x] Remove migrated markdown/TS from the app repo
- [x] Rebase main (#24 HttpOnly cookie sessions) and use cookie-or-Bearer on Q&A
- [ ] `NUXT_IGNORE_LOCK=1 npm run build` + browser verify
- [ ] Draft PRs (app + data) with Parker setup steps

## Notes
- Data repo is private and **not accessible** with this run's GitHub token (404). App work continues with `CONTENT_LOCAL_PATH`.
- Do not rewrite content; format and plumbing only.
- Auth helpers from main: `readInterviewSessionToken` (cookie or Bearer). Do not modify `server/utils/*Auth.ts`, `server/api/auth/*`, PIN gates, or auth services.
- `INTERVIEW_PASSCODE` and `EDIT_PASSCODE` stay separate codes.
