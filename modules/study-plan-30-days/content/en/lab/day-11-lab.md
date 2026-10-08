# Day 11 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Use the shared primitives for real in the Vue app.

## What this day reuses

- Reuse packages/ui plus the Day 10 mock data.

## Folders to touch

- `apps/vue-nuxt/components/customers/`
- `packages/ui/src/components/`
- `notes/day-11.md`
- `algorithms/day-11/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm storybook:ui
pnpm test:algo -- day-11
```

## Step-by-step

1. Replace placeholders with the real shared Button/FormField/EmptyState/ErrorState components.
2. Make sure the list exposes empty/error flows through shared components.
3. Note which primitive APIs still miss an important prop.

## Done when

- At least 4 primitives are consumed.
- There is a real empty/error state.
- There is a design-system gap note.

## Stretch goal

- Refactor one primitive API after consuming it.

## Hints

- Fix the primitive before hacking around it in the app.

## Algorithm task

- **Problem:** Min Stack
- **Constraints:**
- Mọi thao tác O(1)
- **Hint:** start from the **Stack design** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-11/solution.ts
algorithms/day-11/solution.test.ts
```

Run: `pnpm test:algo -- day-11`

Open the full prompt: [day-11.md](../artifacts/algo/problems/day-11.md)

## Suggested commit

```text
day-11: consume shared ui in vue app
```
