# Day 16 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Add the filter form and controlled inputs in the Next app.

## What this day reuses

- Reuse the Day 15 route and the shared form primitives.

## Folders to touch

- `apps/react-next/app/customers/`
- `apps/react-next/components/`
- `notes/day-16.md`
- `algorithms/day-16/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-16
```

## Step-by-step

1. Add a search/filter form with controlled inputs.
2. Write one small hook for the filter logic.
3. Note where React forces you to be more explicit than Vue.

## Done when

- Filter/search works.
- There is at least 1 small custom hook.
- There is a mental-shift note.

## Stretch goal

- Sync the filter state with the URL.

## Hints

- Keep the hook small and avoid early abstraction.

## Algorithm task

- **Problem:** Maximum Depth of Binary Tree
- **Constraints:**
- 0 ≤ nodes ≤ 10^4
- **Hint:** start from the **DFS recursion** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-16/solution.ts
algorithms/day-16/solution.test.ts
```

Run: `pnpm test:algo -- day-16`

Open the full prompt: [day-16.md](../artifacts/algo/problems/day-16.md)

## Suggested commit

```text
day-16: add next filter form
```
