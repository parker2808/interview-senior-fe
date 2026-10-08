# Day 13 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Add an edit flow with keyboard support in the Vue app.

## What this day reuses

- Reuse the Day 3 form primitives and the current flow.

## Folders to touch

- `apps/vue-nuxt/components/customers/`
- `notes/day-13.md`
- `algorithms/day-13/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm test:algo -- day-13
```

## Step-by-step

1. Open the editor from the row or detail panel.
2. Add ESC to close, return focus, and visible focus treatment.
3. Write down 5 accessibility checks you tested manually.

## Done when

- The edit flow opens and closes.
- ESC and return focus work.
- There is a checked accessibility list.

## Stretch goal

- Add smarter initial focus on the first field.

## Hints

- Understanding the mechanics is enough; the modal does not need to be perfect.

## Algorithm task

- **Problem:** Linked List Cycle
- **Constraints:**
- Không dùng thêm O(n) Set nếu có thể (Floyd).
- **Hint:** start from the **Floyd two pointers** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-13/solution.ts
algorithms/day-13/solution.test.ts
```

Run: `pnpm test:algo -- day-13`

Open the full prompt: [day-13.md](../artifacts/algo/problems/day-13.md)

## Suggested commit

```text
day-13: add accessible vue edit flow
```
