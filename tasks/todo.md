# Replace PIN auth with GitHub OAuth (allowlist)

## Plan

- [x] Branch `cursor/github-oauth-auth-72dd`
- [x] Add `nuxt-auth-utils` + Vitest
- [x] Pure auth helpers (allowlist, public API, search query, redirect, rate limit) + unit tests
- [x] OAuth routes: `/auth/github`, `/api/auth/logout`, `/api/auth/session`
- [x] Server middleware: default-deny `/api/**`, security headers
- [x] Nuxt middleware + `/login` + `/auth/not-allowed`
- [x] Remove PIN gates, PIN APIs, token helpers, passcode env
- [x] Plan view public / edit only when logged in; AuthMenu in chrome
- [x] Harden public reads (CDN cache, validate/cap search, in-memory rate limit)
- [x] i18n vi/en + README.md / README-vi.md
- [x] Build + unit tests
- [ ] Browser/API verify + draft PR screenshots

## Review

(filled after implementation)
