# Module: 30-day study plan

Senior FE interview prep calendar (03/10 → 01/11/2026): markdown plan, starters, Capstone worksheets, and a Vite + Vue follow/check UI.

**Live / Demo:** https://parker-interview-senior-fe.vercel.app/ — deploy on Vercel (Parker connects the project).

## Layout

```text
modules/study-plan-30-days/
  content/     # plan, daily starters, artifacts, Capstone stubs
  src/         # Vite + Vue 3 progress UI + module serverless handlers
  README.md

# Deploy adapters (repo root — not inside this module)
vercel.json    # Root Directory = repo root; build/output paths below
api/           # thin /api/* re-exports → src/api/*
documents/     # shared interview KB (canonical; bundled via Vite @kb)
```

Shared interview topics stay in repo [`documents/en`](../../documents/en) and [`documents/vi`](../../documents/vi) — linked from content with relative paths (not owned by this module). The Vite build **bundles** `documents/{en,vi}/**/*.md` so the live UI can open them in-app.

## Markdown links (GitHub + in-app)

| Target | In `.md` files | In the Vue follow UI |
|---|---|---|
| Module `content/` | Relative links between files | In-app navigation (`#day/N`, `#doc/…`) |
| Shared `documents/**` | Relative paths (e.g. `../../../documents/vi/…`) | **In-app** (bundled via `@kb` at build time) |
| Root `README.md` / `jd1.md` (not bundled) | Relative paths from the file | Opens [GitHub blob on `main`](https://github.com/parker2808/interview-senior-fe/blob/main/) |

**Back navigation:** opening a plan or KB doc from a day (or another doc) uses `history.pushState`. The header / doc **← Quay lại Day N** control and the browser back button return to the prior screen. Deep links with no stack fall back to the day list.

Do not use Agent Store paths (`/cursor/stores/…`) or absolute `/workspace/…` paths in repo files. Layout rationale: [`documents/README.md`](../../documents/README.md).

Link audit (from `src/`): `npm run audit:links`.

## Quick start (UI)

```bash
cd modules/study-plan-30-days/src
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
```

The app loads markdown from sibling `../content` (`@plan`) and repo-root `documents/` (`@kb`) at build time.

## Progress sources

| Source | Who | Notes |
|---|---|---|
| **Local** | Owner after unlock | `localStorage` — editable only in **Edit** mode |
| **Share link** | Anyone with the URL | Compact day bitmask (`?share=…`) — **view-only**, does not overwrite local |
| **Public file** | Anyone | Optional [`src/public/progress.json`](./src/public/progress.json) → `/progress.json` after deploy (commit + redeploy to update) |
| **Cloud (Blob)** | Anyone can read via API; Parker publishes | Live sync via Vercel Functions + **private** Blob (`progress.json`) — no always-on backend |
| **Export / Import** | Owner after unlock | JSON backup from the UI |

### Edit mode gate (passcode)

On first visit (per browser tab), a modal asks for a **6-digit passcode**. The client sends it to `POST /api/auth/edit` — the secret is **never** compared (or stored) in the frontend bundle.

| Result | Mode |
|---|---|
| Passcode OK | **Edit** — toggle days, import, publish to cloud |
| Cancel / wrong / skip | **View** — read-only checkboxes; Load cloud / share / export still OK |

Unlock is remembered for the tab via `sessionStorage` (flag + short-lived `editToken` from the API). Closing the tab clears it. The raw passcode is never written to `localStorage`.

### Cloud sync (Vercel Serverless + Blob)

API (after deploy):

| Method | Path | Auth |
|---|---|---|
| `POST` | `/api/auth/edit` | Body `{ "passcode": "******" }` — must match env `EDIT_PASSCODE` (exactly 6 digits) → `{ ok, token, expiresAt }` |
| `GET` | `/api/progress` | Unauthenticated HTTP — Function loads **private** Blob; visitors use **Load cloud** |
| `PUT` / `POST` | `/api/progress` | `x-edit-token` (session token from unlock) **or** `x-progress-token` === `PROGRESS_WRITE_TOKEN` |

**Parker setup (once / after this change):**

1. Vercel project → Settings → General → **Root Directory** = **`.`** (repo root / empty — **not** `modules/study-plan-30-days/src`).
2. Build & Output are already in root [`vercel.json`](../../vercel.json):
   - Install: `npm ci --prefix modules/study-plan-30-days/src`
   - Build: `npm run build --prefix modules/study-plan-30-days/src`
   - Output: `modules/study-plan-30-days/src/dist`
3. Storage → create a **private** Blob store → connect it to the project (sets `BLOB_READ_WRITE_TOKEN`; on Vercel, OIDC + `BLOB_STORE_ID` also work).
4. Project → Settings → Environment Variables:
   - `EDIT_PASSCODE` = your 6-digit code — **never commit it**
   - `PROGRESS_WRITE_TOKEN` = long random secret (optional fallback for publish without passcode session)
   - Optional: `EDIT_TOKEN_SECRET` = HMAC key for edit tokens (derived automatically if unset)
5. Redeploy so Functions pick up the env vars + new Root Directory.
6. On the live UI, enter the passcode → **Edit** mode → check off days → **Publish to cloud** (uses the session `editToken`; no need to paste `PROGRESS_WRITE_TOKEN` unless you prefer that path).

**Visitors:** open the site → **Chỉ xem** (or wrong code) → **Load cloud** / share links. No passcode needed to follow progress.

**Free-plan caveat:** Vercel Functions + Blob have Free-tier limits. Fine for light personal study sync — see [Vercel pricing](https://vercel.com/pricing).

Function sources (implementation): [`src/api/auth/edit.js`](./src/api/auth/edit.js), [`src/api/progress.js`](./src/api/progress.js). Deploy entrypoints (routes): [`api/auth/edit.js`](../../api/auth/edit.js), [`api/progress.js`](../../api/progress.js). Blob helper: [`src/server/progressStore.js`](./src/server/progressStore.js) — **private** store (`access: 'private'`), reads via authenticated `get()`, pathname `progress.json`. Full write tests need a Vercel deploy; locally run `npm run smoke` in `src/`.

## Deploy (Vercel)

Root [`vercel.json`](../../vercel.json) + Vercel project settings:

| Setting | Value |
|---|---|
| **Root Directory** | **`.`** (repository root) — **required** so the build can see `documents/` |
| Install command | `npm ci --prefix modules/study-plan-30-days/src` (in `vercel.json`) |
| Build command | `npm run build --prefix modules/study-plan-30-days/src` (in `vercel.json`) |
| Output directory | `modules/study-plan-30-days/src/dist` (in `vercel.json`) |
| Framework preset | Other (`framework: null`) |
| Env | `EDIT_PASSCODE`, `BLOB_READ_WRITE_TOKEN` (via **private** Blob store; OIDC OK on Vercel), optional `PROGRESS_WRITE_TOKEN`, optional `EDIT_TOKEN_SECRET` |

SPA rewrite + `/api/*` routes stay intact (rewrite excludes `api/`).

## Key content

| Doc | Path |
|---|---|
| Full plan | [content/30-day-study-plan.md](./content/30-day-study-plan.md) |
| Daily index | [content/daily-index.md](./content/daily-index.md) |
| Capstone | [content/capstone-brief.md](./content/capstone-brief.md) |
| Project context | [content/project-context.md](./content/project-context.md) |
| Day 1 starter | [content/day-01-starter.md](./content/day-01-starter.md) |
