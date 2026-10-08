# Day 6 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Scaffold the Vue/Nuxt and React/Next apps in the same workspace.

## What this day reuses

- Reuse the full packages/ui work from Days 1-5.

## Folders to touch

- `apps/vue-nuxt/`
- `apps/react-next/`
- `packages/ui/`
- `notes/day-06.md`
- `algorithms/day-06/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm dev:next
pnpm test:algo -- day-06
```

## Step-by-step

1. Scaffold apps/vue-nuxt and apps/react-next.
2. Import Button/FormField into both apps to test the workspace link.
3. Write the root scripts and path mapping into the note.

## Done when

- Both apps boot.
- The shared UI package imports in both apps.
- There are basic root dev/lint/test scripts.

## Stretch goal

- Add Storybook for packages/ui.

## Hints

- Focus on workspace plumbing, not new UI.

## Algorithm task

- **Problem:** Valid Parentheses
- **Constraints:**
- 1 ≤ s.length ≤ 10^4
- **Hint:** start from the **Stack** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-06/solution.ts
algorithms/day-06/solution.test.ts
```

Run: `pnpm test:algo -- day-06`

Open the full prompt: [day-06.md](../artifacts/algo/problems/day-06.md)

## Suggested commit

```text
day-06: scaffold vue and next apps
```
