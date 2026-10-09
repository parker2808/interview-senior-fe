# Day 10 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

How do you type a real admin flow end to end? Where do you narrow? Which utility types are load-bearing? When is `unknown` better than `any`?

## What you will produce

- Model one admin flow with DTO, UI model, mutation payload, and error state types.
- Write down where you want strictness and where flexibility is acceptable.

## How a senior works this

- **Decision:** Four types for one flow: DTO (wire), UI model (view), mutation payload (write), error union (recoverable vs fatal). Map DTO→UI in one function.
- **Constraint:** Type-only note or a `.ts` snippet. Do not rebuild the Vue module that would consume the types.
- **Failure mode:** One `Customer` type used as response, table row, and PUT body. `any` on errors. Optional fields that are actually required after the mapper.
- **Measure:** One concrete model plus one guard or utility type used on purpose (`Pick`, `Omit`, `Extract`, type predicate).
- **Tradeoff:** Strict DTOs catch backend drift and slow iteration. A looser boundary type at the edge plus a strict UI model is often the production compromise.
- **Production gotcha:** Date strings vs `Date`. Nullable IDs from list endpoints. Error envelopes that change shape between 400 and 500. Zod/io-ts only if you have used them — do not bluff.

## Done when

- You have one concrete type model for a real flow.
- At least one guard or utility type is used on purpose.
- Algo is complete and the sliding-window pattern is understandable.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Write a type guard for the error union and show the narrow in an `if`.

## Algorithm

- **Problem:** Longest Substring Without Repeating Characters
- **Constraints:**
- 0 ≤ s.length ≤ 5·10^4
- **Hint:** Window [l,r] + Set/Map of last index; on duplicate, shrink l.

```text
algorithms/day-10/solution.ts
algorithms/day-10/solution.test.ts
```

Run: `pnpm test:algo -- day-10`

Open the full prompt: [day-10.md](../artifacts/algo/problems/day-10.md)

## Suggested commit

```text
day-10: model DTO UI mutation and error types for one flow
```
