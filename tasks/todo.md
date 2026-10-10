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
- [x] Browser/API verify + draft PR screenshots

## Review

- Draft PR: https://github.com/parker2808/interview-senior-fe/pull/27
- Unit tests: 18 passed (`npm test`)
- Build: `CONTENT_LOCAL_PATH` stub + `NUXT_SESSION_PASSWORD` — Nuxt/Nitro Vercel preset succeeded
- Unauthenticated curl: KB/plan APIs 200 + `public, s-maxage=86400, stale-while-revalidate=604800`; `/api/interview/questions` and `/api/progress` GET/PUT 401 + `private, no-store`; `/interview` 302 → `/login?redirect=/interview`; search rejects long `q` / bad `lang`
- Security headers on pages: nosniff, DENY, strict-origin-when-cross-origin
- Real GitHub OAuth cannot be completed in this environment (no OAuth App). Allowlist covered by unit tests.
