# Day 11 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

How does Vue 3 reactivity actually work? `ref` vs `reactive`? What makes a composable good — and when is it a hidden God object?

## What you will produce

- Explain one real feature you built using ref/reactive/computed/watch, then rewrite the explanation as if an interviewer asked “why this design?”.
- Review one composable you wrote before and identify whether it owns state, side effects, or both.

## How a senior works this

- **Decision:** Pick one shipped feature. Answer ‘why this design?’ with ownership: which refs are source of truth, which computed is derived, which watch is a smell.
- **Constraint:** Spoken-answer rewrite + composable review. Do not extract a new composable into a customer module today.
- **Failure mode:** ‘Proxy tracks dependencies’ with no example. A composable that fetches, caches, toasts, and owns form state. `watch` used where `computed` would do.
- **Measure:** You can explain reactivity without hand-waving, and the reviewed composable has a clearer boundary (state xor effect, or both named).
- **Tradeoff:** `ref` is explicit and composes; `reactive` is ergonomic and unwraps badly across function boundaries. Prefer `ref` in composable APIs.
- **Production gotcha:** Destructuring `reactive` drops tracking. `watch` on a getter vs a ref. Composables called outside `setup` lose the instance context.

## Done when

- You can explain Vue reactivity without hand-waving.
- One composable review is done with clearer boundaries.
- Algo is done and the “supporting stack” pattern is clear.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Name one thing you would move out of the composable tomorrow and where it would live instead (component, Pinia, server cache).

## Algorithm

- **Problem:** Min Stack · Stack design
- **Constraints:**
- Every operation O(1)
- **Hint:** Auxiliary stack of current min, or store (value, minSoFar) pairs.

```text
algorithms/day-11/solution.ts
algorithms/day-11/solution.test.ts
```

Run: `pnpm test:algo -- day-11`

Open the full prompt: [day-11.md](../artifacts/algo/problems/day-11.md)

## Suggested commit

```text
day-11: rewrite one Vue feature answer and review one composable
```
