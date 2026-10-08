# Day 8 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Split the Vue shell into a component tree with clear ownership.

## What this day reuses

- Reuse the Day 7 page shell.

## Folders to touch

- `apps/vue-nuxt/components/customers/`
- `notes/day-08.md`
- `algorithms/day-08/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm test:algo -- day-08
```

## Step-by-step

1. Split the page into page, filters, table, and detail-panel pieces.
2. Document props, emits, and owners for each component.
3. Rewrite the component tree in the note.

## Done when

- The giant god component is gone.
- State and component ownership are clear.
- The flow still renders correctly.

## Stretch goal

- Add barrel exports for the customers module.

## Hints

- If unsure whether something is local or shared, keep it local first.

## Algorithm task

- **Problem:** Binary Search
- **Constraints:**
- 1 ≤ nums.length ≤ 10^4
- Mọi phần tử unique
- Phải O(log n)
- **Hint:** start from the **Binary search** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-08/solution.ts
algorithms/day-08/solution.test.ts
```

Run: `pnpm test:algo -- day-08`

Open the full prompt: [day-08.md](../artifacts/algo/problems/day-08.md)

## Suggested commit

```text
day-08: split vue customer modules
```
