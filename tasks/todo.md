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
- [ ] Build, screenshots (mocked owner), push draft

## Review

Access module under `src/modules/access/` with `/admin/access` (Members / Share links / Activity). Owner-only nav + 404/401 for everyone else. Upstash Redis when configured; env owners still work without it.
