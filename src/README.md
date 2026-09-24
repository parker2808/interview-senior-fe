# Study Plan Follow UI

Vite + Vue 3 app to browse and check off the 30-day Senior FE study plan.

Lives at repo `src/`. Markdown content is loaded from `documents/study-plan/30-days/` at build time via the Vite `@plan` alias.

## Run

```bash
cd src
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

Output: `src/dist` — Netlify publish directory (see root `netlify.toml`).

Progress is stored in `localStorage` under `senior-fe-30day-progress-v1`.
