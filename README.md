# Senior FE Interview Prep

> 🌍 **Language / Ngôn ngữ:** [🇬🇧 English](./README.md) | [🇻🇳 Tiếng Việt](./README-vi.md)

Nuxt app for **Senior Frontend interview prep**: a bilingual knowledge base, a 30-day plan with labs, and a GitHub-protected Q&A bank.

**Live:** [parker-interview-senior-fe.vercel.app](https://parker-interview-senior-fe.vercel.app)

## Features

- **Knowledge base** — 22 vi/en topics, sidebar, full-text search, nested heading TOC
- **30-day plan** — daily checkpoints, lab links, view vs edit progress
- **Interview Q&A** — model answers behind GitHub OAuth (allowlisted owner)
- **i18n** — `vi` / `en`, no URL prefix; locale cookie
- **Light / dark** theme

![Hub](./docs/readme/hub.png)
![Knowledge base](./docs/readme/knowledge-base.png)
![30-day plan](./docs/readme/plan.png)

## Stack

Nuxt 3 + Nitro · Vue 3 · TypeScript · Tailwind CSS · `@nuxtjs/i18n` (vi/en, `no_prefix`) · Vercel (Nitro `vercel` preset) · private Vercel Blob for plan progress

## Architecture

```text
pages/                         # thin routes → module views
src/modules/
  hub/  knowledge-base/  study-plan/  interview-qa/
  content/                     # Localized blocks + BlockRenderer
  core/                        # chrome, theme, locale, session
server/api/                    # Nitro endpoints
server/utils/                  # content store, auth, search, progress
scripts/                       # pull-data, export, validate
schema/                        # JSON Schema for Localized content
i18n/locales/                  # en.json / vi.json
.data/content/                 # gitignored build-time pull
```

UI module conventions (naming, new-module scaffold): [STRUCTURE.md](./STRUCTURE.md).

### Content model

KB / plan / Q&A live in private [`parker2808/interview-fe-data`](https://github.com/parker2808/interview-fe-data). Every user-facing string is `Localized`:

```ts
type Localized<T = string> = { en: T; vi: T }
```

Docs are `{ sections: { id, title, blocks }[] }`. Block types: `heading`, `paragraph`, `list`, `callout`, `code`, `table`, `senior-answer`, `key-takeaways`, `markdown`, `thematic-break`.

Build (`predev` / `prebuild`) runs `scripts/pull-data.mjs` → `.data/content`, then Nitro copies that tree into server assets. The client never imports the JSON files.

### APIs

| Method | Path | Auth |
|---|---|---|
| `GET` | `/api/knowledge-base/docs` | public (CDN cache) |
| `GET` | `/api/knowledge-base/docs/:slug` | public (CDN cache) |
| `GET` | `/api/knowledge-base/search?q=&lang=vi\|en&limit=` | public (CDN cache + input caps + best-effort rate limit) |
| `GET` | `/api/plan/days` | public (CDN cache) |
| `GET` | `/api/plan/days/:n` | public (CDN cache) |
| `GET` | `/api/plan/resources/:id` | public (CDN cache) |
| `GET` | `/api/interview/questions` | GitHub session |
| `GET` | `/auth/github` | GitHub OAuth start + callback |
| `POST` | `/api/auth/logout` | clears sealed session |
| `GET` | `/api/auth/session` | `{ ok, authenticated, user }` |
| `GET` | `/api/progress` | GitHub session |
| `PUT` / `POST` | `/api/progress` | GitHub session |

Every other `/api/**` route is **default-deny** (`401` JSON) unless it is added to the public allowlist in `src/modules/core/utils/public-api.util.ts`.

Public reads send `Cache-Control: public, s-maxage=86400, stale-while-revalidate=604800`. Session, Q&A, and progress responses send `private, no-store` and must not be CDN-cached.

Search rejects oversized/`lang`/`limit` abuse (`q` max 100, `limit` cap 50). The in-process search rate limit is best-effort only (one Vercel isolate). **Enable Vercel Firewall** for real protection: Project → Firewall → add a rate-limit rule on `/api/knowledge-base/search` (for example 30 requests / minute / IP) and optionally on `/api/**`.

### Auth

GitHub OAuth via [`nuxt-auth-utils`](https://github.com/atinux/nuxt-auth-utils). Sealed HttpOnly cookie (`nuxt-session`), 7 days, `Secure` in production, `SameSite=Lax`. Library uses OAuth `state` (and PKCE when the provider supports it).

**Public (no login):** knowledge base + plan pages (read-only) and their content APIs.

**Login required:** `/interview`, `/api/interview/*`, plan edit / progress mutations, and every non-allowlisted API.

Only GitHub user `parker2808` is allowed (override with `AUTH_ALLOWED_GITHUB_LOGINS`). If `AUTH_ALLOWED_GITHUB_IDS` is set, **both** login and numeric id must match. Anyone else who completes GitHub login lands on `/auth/not-allowed` with **no session**.

#### GitHub OAuth setup (Parker)

1. GitHub → Settings → Developer settings → **OAuth Apps** → New OAuth App.
2. **Homepage URL:** `https://parker-interview-senior-fe.vercel.app`
3. **Authorization callback URL:** `https://parker-interview-senior-fe.vercel.app/auth/github`  
   GitHub OAuth Apps accept **one** callback URL. Preview deployments (`*.vercel.app`) cannot sign in unless you create a second OAuth App whose callback is that preview origin, or skip login on previews.
4. For local dev, create a **second** OAuth App: homepage `http://localhost:3000`, callback `http://localhost:3000/auth/github`. Put those client id/secret only in local `.env`.
5. Generate a session password (32+ characters): `openssl rand -base64 32`
6. In Vercel → Project → Settings → Environment Variables, set:

   | Variable | Production |
   |---|---|
   | `NUXT_SESSION_PASSWORD` | the 32+ char secret |
   | `NUXT_OAUTH_GITHUB_CLIENT_ID` | production OAuth App client id |
   | `NUXT_OAUTH_GITHUB_CLIENT_SECRET` | production client secret |
   | `AUTH_ALLOWED_GITHUB_LOGINS` | `parker2808` |
   | `AUTH_ALLOWED_GITHUB_IDS` | optional numeric id from `https://api.github.com/users/parker2808` |

7. Redeploy. Then **remove** `INTERVIEW_PASSCODE`, `EDIT_PASSCODE`, `INTERVIEW_TOKEN_SECRET`, `EDIT_TOKEN_SECRET`, and `PROGRESS_WRITE_TOKEN` from Vercel (they are unused).

### i18n

`@nuxtjs/i18n`, default `vi`, strategy `no_prefix`, cookie `sf_locale`. KB routes are `/docs/:lang/:slug`. UI chrome uses locale files; document bodies come from Localized JSON.

## Data flow

```mermaid
flowchart LR
  editor[Editor] --> dataRepo["private interview-fe-data"]
  dataRepo --> ci[CI validate Localized JSON]
  ci --> main[merge to main]
  main --> hook[GitHub Action deploy hook]
  hook --> vercel[Vercel build]
  vercel --> pull["pull-data + CONTENT_REPO_TOKEN"]
  pull --> nitro[Nitro server assets]
  nitro --> apis[Content APIs]
  apis --> pages[Nuxt pages]
```

## Page request flow

```mermaid
sequenceDiagram
  participant Browser
  participant Page as Nuxt page
  participant API as Nitro API
  participant Store as content store
  Browser->>Page: GET /docs/vi/javascript
  Page->>API: useAsyncData GET /api/knowledge-base/docs/javascript
  API->>Store: readKnowledgeDoc
  Store-->>API: Localized JSON
  API-->>Page: document
  Page-->>Browser: SSR HTML
  Note over Browser,Page: Client navigation keeps the same fetch and shows skeletons while pending
```

## GitHub OAuth

```mermaid
sequenceDiagram
  participant Browser
  participant App
  participant GitHub
  Browser->>App: GET /login?redirect=/interview
  Browser->>App: GET /auth/github?redirect=/interview
  App->>GitHub: authorize + state
  GitHub-->>Browser: consent
  Browser->>App: GET /auth/github?code&state
  App->>GitHub: exchange code
  GitHub-->>App: user profile
  alt login (and id) on allowlist
    App->>Browser: Set-Cookie sealed HttpOnly session
    App->>Browser: redirect /interview
    Browser->>App: GET /api/interview/questions
    App-->>Browser: questions
  else anyone else
    App->>Browser: redirect /auth/not-allowed (no session)
  end
```

Plan view stays public. Edit controls and `/api/progress` appear only with a valid session.

## Local development

**Needs:** Node 22+, npm, and either a local checkout of `interview-fe-data` or a GitHub PAT that can read that private repo.

```bash
cp .env.example .env          # fill OAuth + session password; never commit secrets
# Option A — local data repo
CONTENT_LOCAL_PATH=/path/to/interview-fe-data npm run dev
# Option B — token pull
CONTENT_REPO_TOKEN=… npm run dev
```

| Script | What it does |
|---|---|
| `npm run dev` | `data:pull` then `nuxt dev` |
| `npm run build` | `data:pull` then `nuxt build` (Vercel preset) |
| `npm run data:pull` | Copy `CONTENT_LOCAL_PATH` or download the data repo → `.data/content` |
| `npm run data:export` | Rebuild JSON from markdown sources (maintainer / seed) |
| `npm run data:validate` | Schema-check Localized JSON |
| `npm run preview` | Not used for the Vercel preset locally |

### Environment

No secret values belong in git. Copy `.env.example` and fill locally / on Vercel.

| Variable | Where | Purpose |
|---|---|---|
| `CONTENT_REPO_TOKEN` | Vercel + optional local | Fine-grained PAT, **Contents: Read** on `interview-fe-data` |
| `CONTENT_REPO_REF` | optional | Git ref to pull (default `main`) |
| `CONTENT_REPO_OWNER` / `CONTENT_REPO_NAME` | optional | Override data-repo coordinates |
| `CONTENT_LOCAL_PATH` | local | Checkout or export of the data repo; skips GitHub |
| `NUXT_SESSION_PASSWORD` | Vercel + local | 32+ chars; seals the HttpOnly session cookie |
| `NUXT_OAUTH_GITHUB_CLIENT_ID` | Vercel + local | GitHub OAuth App client id |
| `NUXT_OAUTH_GITHUB_CLIENT_SECRET` | Vercel + local | GitHub OAuth App client secret |
| `AUTH_ALLOWED_GITHUB_LOGINS` | Vercel + local | Comma-separated logins (default `parker2808`) |
| `AUTH_ALLOWED_GITHUB_IDS` | optional | Comma-separated numeric GitHub ids; AND-matched with login |
| `BLOB_READ_WRITE_TOKEN` | Vercel | Private Blob store for `/api/progress` |
| `VERCEL_DEPLOY_HOOK_URL` | **data repo** secret | Action on `main` triggers a site rebuild |

## Deploy and content updates

1. Edit JSON in **`parker2808/interview-fe-data`**.
2. PR CI validates Localized JSON.
3. Merge to `main` → Action `POST`s the Vercel deploy hook.
4. Vercel build runs `data:pull` with `CONTENT_REPO_TOKEN`, copies content into Nitro, deploys.

App repo pushes also rebuild on Vercel. Content is **not** in this repo.

**Backup / integrity:** source of truth is git on the private data repo. Vercel only serves the last successful build. If a build fails, the previous deployment keeps serving. Progress JSON lives in private Blob, separate from content.

## License

Free for personal interview prep. Credit the source if you share it.
