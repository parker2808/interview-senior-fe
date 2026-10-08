# Day 26 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Add tests and a review checklist to the repo.

## What this day reuses

- Reuse whichever Vue or Next flow is the most representative.

## Folders to touch

- `packages/ui/src/**/__tests__/`
- `apps/react-next/**/__tests__/`
- `notes/day-26.md`
- `algorithms/day-26/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm test:ui
pnpm test:next  # or vitest/rtl
pnpm test:algo -- day-26
```

## Step-by-step

1. Write 1 test for a shared primitive and 1 test for a page flow.
2. Create a review checklist for correctness/accessibility/performance/security/tests.
3. Run the tests and note the short result.

## Done when

- At least 2 tests are green.
- There is a review checklist.
- You know what still lacks coverage.

## Stretch goal

- Add a sample CI workflow.

## Hints

- Test important behavior, not implementation detail.

## Algorithm task

- **Problem:** Weak-topic drill #2
- **Constraints:**
- 20′ + reflection
- **Hint:** start from the **Remedial** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-26/solution.ts
algorithms/day-26/solution.test.ts
```

Run: `pnpm test:algo -- day-26`

Open the full prompt: [day-26.md](../artifacts/algo/problems/day-26.md)

## Suggested commit

```text
day-26: add tests and review checklist
```
