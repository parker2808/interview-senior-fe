# Study Plan Follow UI

Vite + Vue 3 app to browse and check off the 30-day Senior FE study plan.

## Live

[https://parker2808.github.io/interview-senior-fe/](https://parker2808.github.io/interview-senior-fe/)

## Run

```bash
cd study-plan/app
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

## Build

```bash
# Local preview at /
npm run build
npm run preview

# Match GitHub Pages project path
GITHUB_PAGES=true npm run build
```


Progress is stored in `localStorage` under `senior-fe-30day-progress-v1`.

Markdown content is loaded from `../30-days/` at build time.
