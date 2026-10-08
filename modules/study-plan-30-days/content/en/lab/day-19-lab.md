# Day 19 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Practice server fetch, cache, and rendering trade-offs in Next.

## What this day reuses

- Reuse the Day 18 App Router route.

## Folders to touch

- `apps/react-next/app/(admin)/customers/`
- `notes/day-19.md`
- `algorithms/day-19/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-19
```

## Step-by-step

1. Create 2 small paths: one with revalidate, one with no-store or client fetch.
2. Write a stale-vs-fresh table for the same domain.
3. Add a note about SSR/ISR/streaming choices.

## Done when

- There are at least 2 fetch strategies.
- The stale/fresh table is done.
- The rendering trade-off is explainable.

## Stretch goal

- Add a tag/path revalidation note.

## Hints

- Mock responses are enough for reasoning.

## Algorithm task

- **Problem:** Climbing Stairs
- **Constraints:**
- 1 ≤ n ≤ 45
- **Hint:** start from the **DP** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-19/solution.ts
algorithms/day-19/solution.test.ts
```

Run: `pnpm test:algo -- day-19`

Open the full prompt: [day-19.md](../artifacts/algo/problems/day-19.md)

## Suggested commit

```text
day-19: compare next cache strategies
```
