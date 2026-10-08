# Day 18 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Use the App Router properly for the Customers route.

## What this day reuses

- Reuse the Next route from Days 15-17.

## Folders to touch

- `apps/react-next/app/(admin)/customers/`
- `apps/react-next/app/(admin)/layout.tsx`
- `notes/day-18.md`
- `algorithms/day-18/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-18
```

## Step-by-step

1. Move the route into a clear admin layout/segment.
2. Add minimal loading.tsx and error.tsx files.
3. Write the Nuxt-to-Next mapping for layout/loading/error.

## Done when

- The layout/segment is clear.
- Loading and error states render.
- There is a Nuxt ↔ Next note.

## Stretch goal

- Add a nested layout for a detail route.

## Hints

- One route is enough to prove the concept.

## Algorithm task

- **Problem:** Number of Islands
- **Constraints:**
- 1 ≤ m,n ≤ 300
- **Hint:** start from the **Grid BFS/DFS** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-18/solution.ts
algorithms/day-18/solution.test.ts
```

Run: `pnpm test:algo -- day-18`

Open the full prompt: [day-18.md](../artifacts/algo/problems/day-18.md)

## Suggested commit

```text
day-18: add app router segment states
```
