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
| **Local** | `localStorage` key `senior-fe-30day-progress-v1` — editable |
| **Share link** | `?share=<base36-bitmask>` — view-only banner; local data untouched |
| **Public file** | `GET /progress.json` (from `public/progress.json`) — view-only after deploy |
| **Cloud (Blobs)** | `GET /api/progress` public read; **Publish to cloud** writes with `x-progress-token` |
| **Export / Import** | Download or upload JSON (`version`, `completed` days) |

Opening a share link never silently overwrites local progress.

### Cloud API (Netlify)

- Function: [`netlify/functions/progress.js`](./netlify/functions/progress.js)
- Routes (via root `netlify.toml`): `/api/progress` → `/.netlify/functions/progress`
- Env: set **`PROGRESS_WRITE_TOKEN`** in Netlify Site env (not in git). UI prompts once and keeps it in `sessionStorage` only.
- Visitors: **Load cloud** (GET, no token).
- Free plan: Functions/Blobs credits apply — light personal use only.

```bash
npm run smoke   # codec + payload shape (no Netlify needed)
```
