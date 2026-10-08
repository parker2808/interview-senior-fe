# Day 22 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Build a small dashboard inside the Next app.

## What this day reuses

- Reuse the customer data, shared UI, and the Week 3 cache/observability notes.

## Folders to touch

- `apps/react-next/app/(admin)/dashboard/`
- `notes/day-22.md`
- `algorithms/day-22/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-22
```

## Step-by-step

1. Create a dashboard route with 3 mocked widgets.
2. Give each widget clear loading/error/empty states.
3. Write when a BFF would become necessary or why it still is not.

## Done when

- The dashboard route runs.
- The widgets have clear states.
- There is an architecture note.

## Stretch goal

- Add partial failure for one widget.

## Hints

- Prioritize orchestration over fancy charts.

## Algorithm task

- **Problem:** House Robber
- **Constraints:**
- 1 ≤ nums.length ≤ 100
- **Hint:** start from the **DP 1D** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-22/solution.ts
algorithms/day-22/solution.test.ts
```

Run: `pnpm test:algo -- day-22`

Open the full prompt: [day-22.md](../artifacts/algo/problems/day-22.md)

## Suggested commit

```text
day-22: add next dashboard route
```
