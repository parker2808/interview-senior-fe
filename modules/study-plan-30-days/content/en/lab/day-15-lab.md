# Day 15 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Start the equivalent Customers route in the Next app.

## What this day reuses

- Reuse the schema, mock data, and packages/ui from the Vue track.

## Folders to touch

- `apps/react-next/app/customers/`
- `apps/react-next/lib/`
- `notes/day-15.md`
- `algorithms/day-15/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-15
```

## Step-by-step

1. Create the /customers route.
2. Render the mock list through the shared UI package.
3. Write how the data flow differs in Vue vs Next.

## Done when

- The Next route renders.
- The mock list reuses the old model.
- There is a Vue vs Next comparison note.

## Stretch goal

- Create a shared fixtures lib for both apps.

## Hints

- The goal is domain parity, not pixel parity.

## Algorithm task

- **Problem:** Binary Tree Level Order Traversal
- **Constraints:**
- 0 ≤ nodes ≤ 2000
- **Hint:** start from the **BFS queue** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-15/solution.ts
algorithms/day-15/solution.test.ts
```

Run: `pnpm test:algo -- day-15`

Open the full prompt: [day-15.md](../artifacts/algo/problems/day-15.md)

## Suggested commit

```text
day-15: start next customers route
```
