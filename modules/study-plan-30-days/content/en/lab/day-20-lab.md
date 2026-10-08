# Day 20 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Add a Server Action, metadata, and an asset/deploy note in Next.

## What this day reuses

- Reuse the customers route from Days 15-19.

## Folders to touch

- `apps/react-next/app/(admin)/customers/`
- `apps/react-next/app/(admin)/customers/actions.ts`
- `notes/day-20.md`
- `algorithms/day-20/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-20
```

## Step-by-step

1. Create one small save form through a Server Action or mock server mutation.
2. Set route metadata/title.
3. Write an image/font/deploy note.

## Done when

- The mutation demo works.
- The metadata is meaningful.
- There is an asset/deploy note.

## Stretch goal

- Add an optimistic UI note.

## Hints

- One small mutation with a clear boundary is enough.

## Algorithm task

- **Problem:** Coin Change
- **Constraints:**
- 1 ≤ coins.length ≤ 12
- 0 ≤ amount ≤ 10^4
- **Hint:** start from the **DP unbounded knapsack** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-20/solution.ts
algorithms/day-20/solution.test.ts
```

Run: `pnpm test:algo -- day-20`

Open the full prompt: [day-20.md](../artifacts/algo/problems/day-20.md)

## Suggested commit

```text
day-20: add next mutation and metadata
```
