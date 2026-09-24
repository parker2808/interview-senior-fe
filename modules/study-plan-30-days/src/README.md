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
| **Share link** | `#share=<base36-bitmask>` — view-only banner; local data untouched |
| **Public repo** | `GET /progress.json` (from `public/progress.json`) — view-only after deploy |
| **Export / Import** | Download or upload JSON (`version`, `completed` days) |

Opening a share link never silently overwrites local progress.
