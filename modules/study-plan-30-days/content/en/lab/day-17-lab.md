# Day 17 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Add cleanup and error handling to the Next flow.

## What this day reuses

- Reuse the list/filter flow from Days 15-16.

## Folders to touch

- `apps/react-next/app/customers/`
- `apps/react-next/components/`
- `notes/day-17.md`
- `algorithms/day-17/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-17
```

## Step-by-step

1. Create a flow that can go stale without cleanup.
2. Add AbortController or a stale guard.
3. Wrap one area with an error boundary and note its limits.

## Done when

- There is a real cleanup/stale-guard example.
- The error boundary fallback renders.
- The limitations note is done.

## Stretch goal

- Log a mock error event into observability notes.

## Hints

- One sharp example is better than three vague ones.

## Algorithm task

- **Problem:** Lowest Common Ancestor of a BST
- **Constraints:**
- Cả p,q đều tồn tại trong cây
- **Hint:** start from the **BST property** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-17/solution.ts
algorithms/day-17/solution.test.ts
```

Run: `pnpm test:algo -- day-17`

Open the full prompt: [day-17.md](../artifacts/algo/problems/day-17.md)

## Suggested commit

```text
day-17: add next cleanup and error states
```
