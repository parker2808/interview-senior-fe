# Day 1 — Lab

> **Timebox:** 45-60 minutes

Shared repo: [lab-repo.md](../lab-repo.md)

## Day 0 — Setup once

- If the shared lab repo does not exist yet, finish Day 0 in [lab-repo.md](../lab-repo.md) before doing Day 1.

## What you will build

- Bootstrap the shared lab repo, seed the first tokens, and start the README.

## What this day reuses

- None yet; this is Day 0/Day 1.

## Folders to touch

- `packages/ui/src/tokens/`
- `notes/day-01.md`
- `algorithms/day-01/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm install
pnpm storybook:ui  # or a small UI playground
pnpm test:algo -- day-01
```

## Step-by-step

1. Finish Day 0 from lab-repo if the repo does not exist yet.
2. Create base tokens for color, spacing, radius, and type.
3. Write down the first 3 primitives you want to extract from a real admin screen.

## Done when

- The repo installs cleanly.
- The token file is committed.
- The README has a repo-structure section.

## Stretch goal

- Add dark token aliases.

## Hints

- Keep day one intentionally light; do not build both apps yet.

## Algorithm task

- **Problem:** Two Sum
- **Constraints:**
- 2 ≤ nums.length ≤ 10^4
- -10^9 ≤ nums[i], target ≤ 10^9
- Exactly one valid answer
- **Hint:** start from the **HashMap** pattern and open the full prompt if you need a stronger nudge.

```text
algorithms/day-01/solution.ts
algorithms/day-01/solution.test.ts
```

Run: `pnpm test:algo -- day-01`

Open the full prompt: [day-01.md](../artifacts/algo/problems/day-01.md)

## Suggested commit

```text
day-01: bootstrap repo and token seed
```
