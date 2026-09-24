# Study Plan Follow UI

Vite + Vue 3 app for the **study-plan-30-days** module — browse days and check off progress.

- **Live / Demo:** [https://parker-interview-documents.netlify.app](https://parker-interview-documents.netlify.app)
- App root: `modules/study-plan-30-days/src/`
- Markdown: sibling `../content/` (Vite `@plan` alias)
- Shared interview KB: `documents/en`, `documents/vi` (linked from content; not bundled — UI opens GitHub blob on `main`)

## Run

```bash
cd modules/study-plan-30-days/src
npm install
npm run dev
```

Default local URL: `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```

Output: `dist/` — Netlify publish directory (see repo-root `netlify.toml`).

## Progress sources

| Source | Behavior |
|---|---|
| **Local** | `localStorage` key `senior-fe-30day-progress-v1` — editable only after passcode unlock |
| **Share link** | `?share=<base36-bitmask>` — view-only banner; local data untouched |
| **Public file** | `GET /progress.json` (from `public/progress.json`) — view-only after deploy |
| **Cloud (Blobs)** | `GET /api/progress` public read; **Publish** needs edit session or write token |
| **Export / Import** | Download anytime from local; import requires Edit mode |

Opening a share link never silently overwrites local progress.

### Edit gate

- First visit shows a modal → `POST /api/auth/edit` with `{ "passcode": "******" }`
- Success → Edit mode + short-lived `editToken` in `sessionStorage` (not the raw passcode)
- Skip / wrong → View mode (badge **Chế độ: Xem**)

### Cloud API (Netlify)

- Functions: [`netlify/functions/auth-edit.js`](./netlify/functions/auth-edit.js), [`netlify/functions/progress.js`](./netlify/functions/progress.js)
- Routes (via root `netlify.toml`): `/api/auth/edit`, `/api/progress`
- Env (Netlify UI only — never commit):
  - **`EDIT_PASSCODE`** — 6-digit owner unlock (`YOUR_6_DIGIT_CODE`)
  - **`PROGRESS_WRITE_TOKEN`** — optional long-lived publish fallback
  - **`EDIT_TOKEN_SECRET`** — optional HMAC key for edit tokens
- Progress write accepts `x-edit-token` (from unlock) **or** `x-progress-token` === `PROGRESS_WRITE_TOKEN`
- Visitors: **Load cloud** (GET, no token) after choosing view mode
- Free plan: Functions/Blobs credits apply — light personal use only

```bash
npm run smoke   # codec + edit-auth helpers + payload shape (no Netlify needed)
```
