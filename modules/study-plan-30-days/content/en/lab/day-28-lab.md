# Day 28 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Reach similar parity on React/Next for the same slice.

## What this day reuses

- Reuse the same domain and slice from Day 27.

## Folders to touch

- `apps/react-next/`
- `notes/day-28.md`
- `algorithms/day-28/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-28
```

## Step-by-step

1. Polish the same slice in the Next app so it compares directly with Vue.
2. Make sure loading/error/action paths are demoable.
3. Write 3 DX/architecture differences between Vue and Next.

## Done when

- The Next slice is demoable.
- There is a Vue vs Next note.
- You can demo both apps side by side.

## Stretch goal

- Add a smoke test for the Next slice.

## Hints

- Feature parity matters more than pixel polish.

## Algorithm task

- **Problem:** Cooldown Easy
- **Constraints:**
- Optional nếu spike overtime
- **Hint:** start from the **Cooldown** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-28/solution.ts
algorithms/day-28/solution.test.ts
```

Run: `pnpm test:algo -- day-28`

Open the full prompt: [day-28.md](../artifacts/algo/problems/day-28.md)

## Suggested commit

```text
day-28: polish next parity slice
```
