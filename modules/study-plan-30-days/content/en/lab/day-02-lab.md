# Day 2 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## What you will build

- Turn the tokens into primitives: Button, Badge, and SectionTitle.

## What this day reuses

- Reuse the Day 1 tokens.

## Folders to touch

- `packages/ui/src/components/button/`
- `packages/ui/src/components/status-badge/`
- `notes/day-02.md`
- `algorithms/day-02/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm storybook:ui
pnpm test:ui
pnpm test:algo -- day-02
```

## Step-by-step

1. Create a Button with 3 basic variants.
2. Create a StatusBadge for pending / verified / blocked.
3. Write a short note about title-action-badge hierarchy.

## Done when

- The primitives render.
- Variants use tokens instead of hard-coded colors.
- There is a hierarchy note.

## Stretch goal

- Add a loading state to Button.

## Hints

- Favor a clean API over fancy styling.

## Algorithm task

- **Problem:** Valid Anagram
- **Constraints:**
- 1 ≤ s.length, t.length ≤ 5·10^4
- s, t chỉ gồm chữ thường a-z
- **Hint:** start from the **Frequency map** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-02/solution.ts
algorithms/day-02/solution.test.ts
```

Run: `pnpm test:algo -- day-02`

Open the full prompt: [day-02.md](../artifacts/algo/problems/day-02.md)

## Suggested commit

```text
day-02: add button and badge primitives
```
