# Access / Sharing admin module (PR #27)

## Plan

- [x] Explore OAuth/auth + PR #27
- [x] Role resolution (env owner, stored member, fallback viewer) + session version
- [x] Store interface: memory + Upstash Redis REST
- [x] Share tokens (hash-only), consume route, scoped Q&A
- [x] Owner-only admin APIs + CSRF + default-deny
- [x] Access UI `/admin/access` + share banner + avatar menu
- [x] Hide edit UI for viewers; invalidate removed sessions
- [x] Unit tests
- [x] README vi/en + PR setup steps
- [x] Build, screenshots (mocked owner), push draft

## Review

Access module under `src/modules/access/` with `/admin/access` (Members / Share links / Activity). Owner-only nav + 404/401 for everyone else. Upstash Redis when configured; env owners still work without it.

Verification:
- `npm test` — 38 passed
- `npm run build` — Vercel preset complete
- Mocked `AUTH_DEV_MOCK=owner|viewer|share` (dev only):
  - owner: `/admin/access` 200, members/shares/audit seeded
  - viewer: `/admin/access` 404, `PUT /api/progress` 403, Q&A 200
  - share: admin 404, mutations 403, Q&A filtered to `technical` (1 question)
  - CSRF without Origin: 403
