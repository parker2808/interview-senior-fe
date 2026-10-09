# Day 22 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

Design a dashboard that calls 15 APIs. What loads first, what fails independently, and do you need a BFF? What would you watch in production?

## What you will produce

- Take one admin/dashboard idea and outline widgets, API dependencies, failure boundaries, and which data can arrive progressively.
- State whether a BFF is justified or whether better API contracts are enough.

## How a senior works this

- **Decision:** Separate architecture from UX behavior. Shell + critical widgets first; non-critical widgets isolate their own errors. BFF only if aggregation, auth, or chattiness is the real constraint.
- **Constraint:** An outline, not a built dashboard. 45–60 minutes. Vue-first examples are fine.
- **Failure mode:** A box diagram with no failure story. ‘We should have a BFF’ with no fan-out or contract pain. Observability as ‘we would add Sentry’.
- **Measure:** The plan separates architecture from UX behavior and has a clear BFF vs direct-API opinion.
- **Tradeoff:** Direct APIs keep ownership clear and multiply round-trips. A BFF hides backend seams and becomes another deploy + cache to reason about.
- **Production gotcha:** A single loading gate for 15 calls. Correlation IDs that never make it to the browser. Widget retries that DDoS a dying endpoint.

## Done when

- The dashboard plan separates architecture from UX behavior.
- There is a clear opinion on BFF vs direct APIs.
- Algo is done and the rolling-DP idea is clear.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Name the three frontend signals you would alert on (JS errors, empty-widget rate, LCP of the shell).

## Algorithm

- **Problem:** House Robber · DP 1D
- **Constraints:**
- 1 ≤ nums.length ≤ 100
- **Hint:** dp[i] = max(dp[i-1], dp[i-2] + nums[i]).

```text
algorithms/day-22/solution.ts
algorithms/day-22/solution.test.ts
```

Run: `pnpm test:algo -- day-22`

Open the full prompt: [day-22.md](../artifacts/algo/problems/day-22.md)

## Suggested commit

```text
day-22: dashboard outline with failure boundaries and BFF call
```
