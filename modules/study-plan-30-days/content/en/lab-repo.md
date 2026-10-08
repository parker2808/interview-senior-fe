# Day 0 — Set up the shared lab repo once

> Use **one** practice repo for all 30 days instead of creating a new sandbox every day.

## Goal

- create one lightweight monorepo so the design-system work, the Vue/Nuxt flow, the React/Next flow, the algorithm work, and the interview notes all live in one place.

## Recommended structure

```text
senior-fe-lab/
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── apps/
│   ├── vue-nuxt/
│   └── react-next/
├── packages/
│   └── ui/
├── algorithms/
│   ├── day-01/
│   └── ...
└── notes/
    ├── interview/
    └── day-01.md
```

## Tooling

- `pnpm` workspace, TypeScript, ESLint, Prettier, Vitest, and optionally Storybook (or a small playground route) for `packages/ui`.

## Minimal bootstrap commands

```bash
mkdir senior-fe-lab && cd senior-fe-lab
pnpm init

# workspace file
printf "packages:\n  - apps/*\n  - packages/*\n" > pnpm-workspace.yaml

# shared tooling
pnpm add -D typescript eslint prettier vitest @types/node

# Vue / Nuxt app
pnpm dlx nuxi@latest init apps/vue-nuxt

# React / Next app
pnpm create next-app@latest apps/react-next --ts --eslint --app --src-dir=false --import-alias "@/*"

# shared UI package + support folders
mkdir -p packages/ui/src algorithms notes/interview
```

## Suggested root scripts

```json
{
  "scripts": {
    "dev:vue": "pnpm --dir apps/vue-nuxt dev",
    "dev:next": "pnpm --dir apps/react-next dev",
    "storybook:ui": "pnpm --dir packages/ui storybook",
    "test:ui": "pnpm --dir packages/ui vitest",
    "test:algo": "node scripts/run-algo-test.mjs",
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck"
  }
}
```

> If Storybook feels too heavy, replace it with one small playground route in each app.

## Commit convention

- use the `day-XX: ...` format so the commit history reads like the 30-day progression.

Examples:

```text
day-01: bootstrap repo and token seed
day-12: make vue list responsive
day-21: finish next customer mini demo
day-30: finalize demoable interview repo
```

## Optional StackBlitz / CodeSandbox path

- if you do not want local setup immediately, import the **whole repo** into StackBlitz or CodeSandbox once, then keep using that same workspace throughout the 30 days.

## Important rule

- from Day 2 onward, **do not repeat setup**. Each day should only say which folders to touch, what to build, what it reuses from earlier days, and the suggested commit message.
