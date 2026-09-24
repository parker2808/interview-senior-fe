# Study Plan Follow UI

Vite + Vue 3 app to browse and check off the 30-day Senior FE study plan.

## Run

```bash
cd study-plan/app
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

Progress is stored in `localStorage` under `senior-fe-30day-progress-v1`.

Markdown content is loaded from `../30-days/` at build time.
