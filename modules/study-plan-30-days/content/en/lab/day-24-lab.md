# Day 24 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Add a guard/flag and a release checklist to the repo.

## What this day reuses

- Reuse the current dashboard or customers route.

## Folders to touch

- `apps/react-next/app/(admin)/`
- `notes/day-24.md`
- `algorithms/day-24/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-24
```

## Step-by-step

1. Pick either a light auth gate or a feature-flag wrapper.
2. Write the companion security/release checklist.
3. Make sure the UI explains clearly when a feature is locked.

## Done when

- There is one real guard/flag.
- The release/security checklist exists.
- The blocked state is understandable.

## Stretch goal

- Add a rollback note.

## Hints

- The goal is decision-making, not a full auth system.

## Algorithm task

- **Problem:** Live coding simulation
- **Constraints:**
- Đúng 45′, có timer
- **Hint:** start from the **Interview sim** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-24/solution.ts
algorithms/day-24/solution.test.ts
```

Run: `pnpm test:algo -- day-24`

Open the full prompt: [day-24.md](../artifacts/algo/problems/day-24.md)

## Suggested commit

```text
day-24: add release guard and checklist
```
