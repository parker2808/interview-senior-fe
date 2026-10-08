# Day 7 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Build a static customer-flow shell inside the Vue app.

## What this day reuses

- Reuse packages/ui and the AC notes from Days 1-6.

## Folders to touch

- `apps/vue-nuxt/pages/customers.vue`
- `apps/vue-nuxt/components/`
- `notes/day-07.md`
- `algorithms/day-07/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm test:algo -- day-07
```

## Step-by-step

1. Create a page shell with a title, filter bar, table area, and detail placeholder.
2. Use the shared UI package instead of fresh custom UI.
3. Note which boundaries should split into separate components later.

## Done when

- The Vue shell feels like a real flow.
- There is a boundary note.
- The repo structure is still clear.

## Stretch goal

- Split the filter bar into its own component.

## Hints

- This is not the data day yet.

## Algorithm task

- **Problem:** Week 1 timed review
- **Constraints:**
- Tự chấm: pass / partial / fail
- **Hint:** start from the **Review** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-07/solution.ts
algorithms/day-07/solution.test.ts
```

Run: `pnpm test:algo -- day-07`

Open the full prompt: [day-07.md](../artifacts/algo/problems/day-07.md)

## Suggested commit

```text
day-07: create vue customer shell
```
