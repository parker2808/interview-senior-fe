# Day 23 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

A table with 50,000 rows — what do you do first? Is the bottleneck data volume, render cost, or bundle cost? Which optimization would you actually ship?

## What you will produce

- Review a large-screen flow from your past work and list its 3 likely bottlenecks: data volume, render cost, or bundle cost.
- Choose one optimization you would actually ship first and explain why it beats the alternatives.

## How a senior works this

- **Decision:** Prioritize bottlenecks, then ship one fix. Pagination or query limits before virtualization; route-level split before micro-optimizing computed.
- **Constraint:** A prioritized note from a system you shipped. No new virtualized table implementation today.
- **Failure mode:** Listing ten techniques with no priority. Virtualizing before the API returns 50k. Code-splitting a 3 KB helper while the vendor chart library is 400 KB.
- **Measure:** Bottlenecks are ranked. One optimization is tied to user impact and risk.
- **Tradeoff:** Virtualization saves DOM and breaks find-in-page, a11y, and measurement. Splitting a route saves JS and costs a loading gap. Pick with the user task in mind.
- **Production gotcha:** INP dies on a cheap-looking table because every keyup filters 10k rows on the main thread. Bundle analyzers that ignore async chunks you always preload.

## Done when

- The bottlenecks are prioritized, not just listed.
- One optimization choice is tied to user impact and risk.
- Warm-up algo session is complete.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Name the Core Web Vital that would move if your first fix worked.

## Algorithm

- **Problem:** Warm-up easy set
- **Constraints:**
- ≤10 minutes
- **Hint:** Prefer a problem you failed before.

```text
algorithms/day-23/solution.ts
algorithms/day-23/solution.test.ts
```

Run: `pnpm test:algo -- day-23`

Open the full prompt: [day-23.md](../artifacts/algo/problems/day-23.md)

## Suggested commit

```text
day-23: prioritize three bottlenecks and one ship-first fix
```
