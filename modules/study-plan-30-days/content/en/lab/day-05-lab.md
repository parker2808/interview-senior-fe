# Day 5 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Finish EmptyState and ErrorState, then tie them back to acceptance criteria.

## What this day reuses

- Reuse the Day 4 table/card shell.

## Folders to touch

- `packages/ui/src/components/empty-state/`
- `packages/ui/src/components/error-state/`
- `notes/day-05.md`
- `algorithms/day-05/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm storybook:ui
pnpm test:ui
pnpm test:algo -- day-05
```

## Step-by-step

1. Create reusable EmptyState and ErrorState components.
2. Wire them into the table/card demo states.
3. Write 5 acceptance criteria for list + detail.

## Done when

- There are 2 reusable state components.
- The demo includes empty and error flows.
- The acceptance criteria are clear.

## Stretch goal

- Add a retry callback.

## Hints

- Good product copy matters more than animation today.

## Algorithm task

- **Problem:** Top K Frequent Elements
- **Constraints:**
- 1 ≤ nums.length ≤ 10^5
- k nằm trong range số phần tử distinct
- **Hint:** start from the **HashMap + bucket/sort** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-05/solution.ts
algorithms/day-05/solution.test.ts
```

Run: `pnpm test:algo -- day-05`

Open the full prompt: [day-05.md](../artifacts/algo/problems/day-05.md)

## Suggested commit

```text
day-05: add empty and error states
```
