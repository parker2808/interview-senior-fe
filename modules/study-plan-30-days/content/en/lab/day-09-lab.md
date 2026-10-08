# Day 9 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Lock down state ownership for filter, selection, and detail in the Vue app.

## What this day reuses

- Reuse the Day 8 component tree.

## Folders to touch

- `apps/vue-nuxt/composables/`
- `apps/vue-nuxt/components/customers/`
- `notes/day-09.md`
- `algorithms/day-09/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm test:algo -- day-09
```

## Step-by-step

1. Decide what belongs in page state, URL state, and composables.
2. Move filter/search into the URL where it makes sense.
3. Write a state map with owner/reader/writer/reset rules.

## Done when

- Filter state has a clear source of truth.
- Selection and reset behavior are explainable.
- The state map is done.

## Stretch goal

- Add a note on why Pinia is not needed yet.

## Hints

- Only keep URL state that helps sharing or refresh.

## Algorithm task

- **Problem:** Two Sum II (sorted)
- **Constraints:**
- 2 ≤ numbers.length ≤ 3·10^4
- Đã sort non-decreasing
- **Hint:** start from the **Two pointers** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-09/solution.ts
algorithms/day-09/solution.test.ts
```

Run: `pnpm test:algo -- day-09`

Open the full prompt: [day-09.md](../artifacts/algo/problems/day-09.md)

## Suggested commit

```text
day-09: clarify vue state ownership
```
