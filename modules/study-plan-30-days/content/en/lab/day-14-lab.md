# Day 14 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Run a keyboard pass and cleanup on the Vue flow.

## What this day reuses

- Reuse the full Vue flow from Days 7-13.

## Folders to touch

- `apps/vue-nuxt/`
- `notes/day-14.md`
- `algorithms/day-14/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm lint
pnpm test:algo -- day-14
```

## Step-by-step

1. Test Tab, Shift+Tab, Enter, and ESC on the main flow.
2. Fix at least 2 real issues.
3. Write the bug list plus the fix list into the note.

## Done when

- At least 2 issues are fixed.
- The bug list is written.
- The flow still works after cleanup.

## Stretch goal

- Add a smoke-checklist script.

## Hints

- Do not add new features today.

## Algorithm task

- **Problem:** Week 2 timed review
- **Constraints:**
- Self-score pass/partial/fail
- **Hint:** start from the **Review** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-14/solution.ts
algorithms/day-14/solution.test.ts
```

Run: `pnpm test:algo -- day-14`

Open the full prompt: [day-14.md](../artifacts/algo/problems/day-14.md)

## Suggested commit

```text
day-14: keyboard pass on vue flow
```
