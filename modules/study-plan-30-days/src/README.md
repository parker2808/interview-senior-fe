# Study Plan Follow UI

Vite + Vue 3 app for the **study-plan-30-days** module — browse days and check off progress.

- App root: `modules/study-plan-30-days/src/`
- Markdown: sibling `../content/` (Vite `@plan` alias)
- Shared interview KB: `documents/en`, `documents/vi` (linked from content; not bundled here)

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

Progress is stored in `localStorage` under `senior-fe-30day-progress-v1`.
