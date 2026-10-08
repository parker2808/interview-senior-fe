# Day 12 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Implement real responsive behavior for the Vue list.

## What this day reuses

- Reuse the current table/card and Vue flow.

## Folders to touch

- `apps/vue-nuxt/components/customers/`
- `notes/day-12.md`
- `algorithms/day-12/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm test:algo -- day-12
```

## Step-by-step

1. Switch the list between table and cards by breakpoint.
2. Keep the primary action easy to find on mobile.
3. Write the chosen trade-off and avoided anti-patterns into the note.

## Done when

- The responsive mode switches correctly.
- There is no useless horizontal scroll.
- The trade-off note is done.

## Stretch goal

- Add 2 breakpoint screenshots to the README.

## Hints

- Do not hide critical actions in a menu unless you need to.

## Algorithm task

- **Problem:** Reverse Linked List
- **Constraints:**
- 0 ≤ n ≤ 5000
- **Hint:** start from the **Linked list** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-12/solution.ts
algorithms/day-12/solution.test.ts
```

Run: `pnpm test:algo -- day-12`

Open the full prompt: [day-12.md](../artifacts/algo/problems/day-12.md)

## Suggested commit

```text
day-12: make vue list responsive
```
