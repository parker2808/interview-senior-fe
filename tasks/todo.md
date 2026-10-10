# Move site content to structured JSON APIs

## Plan
- [x] Audit KB, plan, Q&A, and auth surfaces
- [x] Check access to `parker2808/interview-fe-data`
- [x] Content model, TypeScript types, JSON Schema, validation
- [x] Lossless markdown/TS → JSON migration + `npm run data:export`
- [x] Data repo seed is on `main` (PR #1, 34e8ac58); this agent still cannot read that repo
- [x] Build-time `scripts/pull-data.mjs` + Nitro server assets
- [x] Public/protected content APIs
- [x] Switch KB / plan / search / TOC to APIs + block renderer
- [x] Remove migrated markdown/TS from the app repo
- [x] Rebase main (#24 HttpOnly cookie sessions) and use cookie-or-Bearer on Q&A
- [x] `NUXT_IGNORE_LOCK=1 npm run build` + browser verify
- [x] Draft app PR #25 (data-repo PR blocked: no access)
- [x] Fix Vercel `No Output Directory named "dist"` (Nitro compiled hook override)
- [x] Vercel preview Ready on `9b7d92c`
- [x] Local browser verify of this commit (preview URL is Vercel SSO-gated)

## Notes
- Data repo is private and **not accessible** with this run's GitHub token (404). App work continues with `CONTENT_LOCAL_PATH`.
- Do not rewrite content; format and plumbing only.
- Auth helpers from main: `readInterviewSessionToken` (cookie or Bearer). Do not modify `server/utils/*Auth.ts`, `server/api/auth/*`, PIN gates, or auth services.
- `INTERVIEW_PASSCODE` and `EDIT_PASSCODE` stay separate codes.

## Review
- Root cause: `nitro.hooks.compiled` in `nuxt.config` replaced the Vercel preset hook, so `.vercel/output/config.json` was never written. Vercel fell back to `dist`.
- Fix (commit `9b7d92c`): copy content from `nitro:init` → `nitro.hooks.hook('compiled')`. Pull script is the simple tarball path.
- Preview (Ready): https://parker-interview-senior-fe-git-curs-cac9ed-parker2808s-projects.vercel.app
- Inspect: https://vercel.com/parker2808s-projects/parker-interview-senior-fe/DJt6g85nYSWqyN67ebjpaXxRzXHC
- Live preview is Vercel Authentication SSO. Agent has no Vercel CLI/MCP credentials, so UI was verified locally on this commit (`CONTENT_LOCAL_PATH`). 23/23 DOM checks passed: docs EN/VI/dark/mobile, plan home, day 1 Plan+Lab EN/VI + mobile, resource `/plan/doc/lab` EN/VI, Q&A gate, wrong PIN message, edit PIN rejected, interview PIN unlocks 142 questions and persists across reload + new tab.
- Do not merge.
