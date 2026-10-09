# Day 1 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

How would you grow a design system from a real product, not a Figma kit? Which CSS/layout decisions are actually senior-level? Walk one shipped admin screen: tokens, primitives, repeated states.

## What you will produce

- Pick one admin screen and list colors, spacing, typography, feedback states, and repeated component patterns.
- Write a short note: which 3 primitives would you extract first and why?

## How a senior works this

- **Decision:** Inventory one real screen before extracting anything. Name tokens first, then the 3 primitives that would remove the most copy-paste.
- **Constraint:** One screen, 45–60 minutes, Vue 3 + TypeScript thinking. No new package, no Storybook bootstrap, no design-system rewrite.
- **Failure mode:** A token list with no states, or primitives that wrap one-off page layout. Interviewers hear ‘we should have a Button’ and nothing about loading/empty/error.
- **Measure:** In under 2 minutes you can name the tokens, 3 primitives, and at least 2 reusable states from that screen.
- **Tradeoff:** Token-first vs component-first. Tokens scale theming; extracting the wrong primitive freezes a bad API.
- **Production gotcha:** Production CSS variables, dark aliases, and one-off hex values in Vue SFCs will disagree. Say how you would reconcile them without a migration week.

## Done when

- One screen audited into tokens and primitives.
- At least 2 reusable states noted: loading / empty / error / success.
- Algo passes and you can explain why HashMap wins over brute force.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Mark which tokens are semantic (`color-danger`) vs raw (`red-600`) and why that matters in an interview.

## Algorithm

- **Problem:** Two Sum · Hash map warm-up
- **Constraints:**
- 2 ≤ nums.length ≤ 10^4
- -10^9 ≤ nums[i], target ≤ 10^9
- Exactly one valid answer
- **Hint:** One pass: for each x, look up target-x in a Map(value→index).

```text
algorithms/day-01/solution.ts
algorithms/day-01/solution.test.ts
```

Run: `pnpm test:algo -- day-01`

Open the full prompt: [day-01.md](../artifacts/algo/problems/day-01.md)

## Suggested commit

```text
day-01: inventory one admin screen into tokens and primitives
```
