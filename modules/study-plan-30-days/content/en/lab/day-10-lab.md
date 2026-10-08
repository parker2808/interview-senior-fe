# Day 10 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Add TypeScript models and a typed mock API for the Vue flow.

## What this day reuses

- Reuse the component tree and state map from Days 8-9.

## Folders to touch

- `apps/vue-nuxt/types/`
- `apps/vue-nuxt/server-mocks/`
- `apps/vue-nuxt/composables/`
- `algorithms/day-10/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm typecheck
pnpm test:algo -- day-10
```

## Step-by-step

1. Define Customer, CustomerStatus, FieldConfig, and ApiError.
2. Create a typed mock composable that returns list + detail data.
3. Connect the typed data to the page shell.

## Done when

- Typecheck is clean.
- Mock data renders.
- There is no any on the main path.

## Stretch goal

- Add a discriminated union for fetch state.

## Hints

- A small mock API is enough.

## Algorithm task

- **Problem:** Longest Substring Without Repeating Characters
- **Constraints:**
- 0 ≤ s.length ≤ 5·10^4
- **Hint:** start from the **Sliding window** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-10/solution.ts
algorithms/day-10/solution.test.ts
```

Run: `pnpm test:algo -- day-10`

Open the full prompt: [day-10.md](../artifacts/algo/problems/day-10.md)

## Suggested commit

```text
day-10: add typed vue mock data
```
