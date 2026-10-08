# Day 23 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Run a small performance pass on the list or dashboard.

## What this day reuses

- Reuse the current dashboard/list flow.

## Folders to touch

- `apps/react-next/app/(admin)/customers/`
- `apps/react-next/app/(admin)/dashboard/`
- `notes/day-23.md`
- `algorithms/day-23/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-23
```

## Step-by-step

1. Pick one realistic simulated bottleneck.
2. Apply one deliberate optimization.
3. Record the before/after in the note.

## Done when

- There is at least one small perf fix.
- There is a before/after note.
- The code is still readable.

## Stretch goal

- Measure again with Profiler if available.

## Hints

- Fix the biggest issue, not the flashiest one.

## Algorithm task

- **Problem:** Warm-up Easy (tự chọn)
- **Constraints:**
- ≤10′
- **Hint:** start from the **Warm-up** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-23/solution.ts
algorithms/day-23/solution.test.ts
```

Run: `pnpm test:algo -- day-23`

Open the full prompt: [day-23.md](../artifacts/algo/problems/day-23.md)

## Suggested commit

```text
day-23: apply focused perf improvements
```
