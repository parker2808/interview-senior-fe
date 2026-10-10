# Fix PIN error text and persist unlock across tabs

## Plan
- [ ] Shared API error parser: prefer `data.data.error`, then `statusMessage`, then `message`; never treat boolean `error: true` as the message
- [ ] Map known PIN failures to i18n (`auth.*` vi/en): wrong code, 6 digits, not configured (503), session expired, network
- [ ] Move hard-coded Vietnamese in `use-edit-mode.composable.ts` and `EditGateModal.vue` into locale files
- [ ] Set HttpOnly / Secure-on-HTTPS / SameSite=Lax cookies (12h) from `/api/auth/interview` and `/api/auth/edit`
- [ ] Protected APIs accept the cookie; keep Bearer / `x-edit-token` headers
- [ ] Add `GET /api/auth/session` and `DELETE /api/auth/session` (logout/lock)
- [ ] Client boot asks the server (`useState` + `useRequestFetch`); no module-level unlock refs
- [ ] Plan modal stays closed when an edit session is already valid (reload, SPA nav, new tab)
- [ ] Build (`NUXT_IGNORE_LOCK=1 npm run build`) and browser-verify PIN + persistence
- [ ] Draft PR with short description, env-var note, and screenshots

## Notes
- Q&A uses `INTERVIEW_PASSCODE` (fallback `EDIT_PASSCODE`); Plan edit uses `EDIT_PASSCODE` only. Do not change that fallback.
- Do not touch `server/data/*`, `documents/*`, or `modules/study-plan-30-days/content/*`.
