# Day 3 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Build FormField and TextField for a basic validation flow.

## What this day reuses

- Reuse the tokens and Button from Days 1-2.

## Folders to touch

- `packages/ui/src/components/form-field/`
- `packages/ui/src/components/text-field/`
- `notes/day-03.md`
- `algorithms/day-03/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm storybook:ui
pnpm test:ui
pnpm test:algo -- day-03
```

## Step-by-step

1. Create a FormField with label, hint, error, and required states.
2. Create a controlled-friendly TextField with invalid and disabled states.
3. Write the state machine for one small form.

## Done when

- Label, hint, and error are clear.
- The input supports invalid and disabled states.
- The state-machine note is done.

## Stretch goal

- Add a textarea with the same API style.

## Hints

- Keep the form small; do not jump into a form library.

## Algorithm task

- **Problem:** Contains Duplicate
- **Constraints:**
- 1 ≤ nums.length ≤ 10^5
- -10^9 ≤ nums[i] ≤ 10^9
- **Hint:** start from the **Set** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-03/solution.ts
algorithms/day-03/solution.test.ts
```

Run: `pnpm test:algo -- day-03`

Open the full prompt: [day-03.md](../artifacts/algo/problems/day-03.md)

## Suggested commit

```text
day-03: add shared form primitives
```
