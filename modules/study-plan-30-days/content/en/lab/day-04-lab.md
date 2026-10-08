# Day 4 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Create a DataTable shell and a mobile card fallback.

## What this day reuses

- Reuse the badge, button, and form primitives.

## Folders to touch

- `packages/ui/src/components/data-table/`
- `packages/ui/src/components/customer-card/`
- `notes/day-04.md`
- `algorithms/day-04/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm storybook:ui
pnpm test:ui
pnpm test:algo -- day-04
```

## Step-by-step

1. Build a DataTable shell with header, row, and empty state.
2. Create a CustomerCard for mobile with 2-3 key fields.
3. Write down when the table should collapse into cards.

## Done when

- Both the table and card fallback exist.
- The empty state renders.
- The trade-off note exists.

## Stretch goal

- Add a sticky header.

## Hints

- Do not virtualize this early.

## Algorithm task

- **Problem:** Group Anagrams
- **Constraints:**
- 1 ≤ strs.length ≤ 10^4
- 0 ≤ strs[i].length ≤ 100
- strs[i] chữ thường
- **Hint:** start from the **HashMap + sorted key** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-04/solution.ts
algorithms/day-04/solution.test.ts
```

Run: `pnpm test:algo -- day-04`

Open the full prompt: [day-04.md](../artifacts/algo/problems/day-04.md)

## Suggested commit

```text
day-04: add table shell and mobile cards
```
