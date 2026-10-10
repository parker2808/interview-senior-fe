# Fix PIN error text and persist unlock across tabs

## Plan
- [x] Shared API error parser: prefer `data.data.error`, then `statusMessage`, then `message`; never treat boolean `error: true` as the message
- [x] Map known PIN failures to i18n (`auth.*` vi/en): wrong code, 6 digits, not configured (503), session expired, network
- [x] Move hard-coded Vietnamese in `use-edit-mode.composable.ts` and `EditGateModal.vue` into locale files
- [x] Set HttpOnly / Secure-on-HTTPS / SameSite=Lax cookies (12h) from `/api/auth/interview` and `/api/auth/edit`
- [x] Protected APIs accept the cookie; keep Bearer / `x-edit-token` headers
- [x] Add `GET /api/auth/session` and `DELETE /api/auth/session` (logout/lock)
- [x] Client boot asks the server (`useState` + `useRequestFetch`); no module-level unlock refs
- [x] Plan modal stays closed when an edit session is already valid (reload, SPA nav, new tab)
- [x] Build (`NUXT_IGNORE_LOCK=1 npm run build`) and browser-verify PIN + persistence
- [x] Draft PR with short description, env-var note, and screenshots

## Notes
- Q&A uses `INTERVIEW_PASSCODE` (fallback `EDIT_PASSCODE`); Plan edit uses `EDIT_PASSCODE` only. Do not change that fallback.
- Do not touch `server/data/*`, `documents/*`, or `modules/study-plan-30-days/content/*`.

## Review
- `NUXT_IGNORE_LOCK=1 npm run build` succeeded.
- Wrong PIN now shows localized text (`Mã không đúng. Bạn vẫn có thể xem.` / `Incorrect code. You can still view.`), never `true`.
- Correct PIN sets `sf_interview_session` / `sf_edit_session` (HttpOnly, SameSite=Lax, 12h). Reload and a new tab stay unlocked; plan modal does not reopen.
- Bearer / `x-edit-token` still work. `GET /api/auth/session` reports scopes; `DELETE` clears the matching cookie.
- Draft PR: https://github.com/parker2808/interview-senior-fe/pull/24
