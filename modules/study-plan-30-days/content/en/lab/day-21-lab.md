# Day 21 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Finish a demoable Next.js mini slice and the Nuxt ↔ Next note.

## What this day reuses

- Reuse everything from Days 15-20.

## Folders to touch

- `apps/react-next/app/(admin)/customers/`
- `notes/day-21.md`
- `README.md`
- `algorithms/day-21/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-21
```

## Step-by-step

1. Make the Customers route demoable: list, filter, loading/error, and one action.
2. Write 5-7 bullets comparing Nuxt 3 vs the Next App Router on this slice.
3. Add a short README section for running the Next demo app.

## Done when

- There is a demoable Next route.
- There is a Nuxt ↔ Next comparison note.
- The README includes run instructions.

## Stretch goal

- Add a screenshot to the README.

## Hints

- Do not open a new route if the Customers route is not coherent yet.

## Algorithm task

- **Problem:** Week 3 timed review
- **Constraints:**
- Self-score
- **Hint:** start from the **Review** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-21/solution.ts
algorithms/day-21/solution.test.ts
```

Run: `pnpm test:algo -- day-21`

Open the full prompt: [day-21.md](../artifacts/algo/problems/day-21.md)

## Suggested commit

```text
day-21: finish next customer mini demo
```
