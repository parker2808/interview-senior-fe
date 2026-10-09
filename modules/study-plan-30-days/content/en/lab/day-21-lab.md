# Day 21 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

Show me a tiny App Router slice you actually ran. Where is the server fetch, where is the client island, and how does this compare to the same slice in Nuxt 3?

## What you will produce

- Build a tiny `/customers` route in a Next lab: root layout, dashboard layout, server-fetched list page, one small client filter, loading.tsx, error.tsx, and page metadata.
- After it works, write 5 lines comparing the same slice in Nuxt 3.

## How a senior works this

- **Decision:** Keep the spike tiny. Server list + one client filter is enough to prove the boundary. Compare to Nuxt from what you just did, not from docs.
- **Constraint:** Tiny lab slice only. No customer-module product, no npm-install tutorial in the write-up. If a lab app already exists, reuse it; do not start from `create-next-app` instructions.
- **Failure mode:** A full CRUD admin. `'use client'` on the page because the filter needs state. A comparison copied from the Next marketing site.
- **Measure:** The slice runs, even if tiny. The Nuxt ↔ Next note is written from this spike. Timed algo review is done.
- **Tradeoff:** Client filter over a server-fetched list is simple and re-filters stale data. Pushing the filter to the server is correct and costs a navigation or action.
- **Production gotcha:** Passing a server-fetched Date into a client child without serializing. Forgetting metadata. An `error.tsx` that cannot recover. The goal is concept transfer and confidence, not a product.

## Done when

- The Next.js slice actually runs, even if tiny.
- The Nuxt ↔ Next comparison is written from experience, not copied from docs.
- Timed algo review is complete.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Add a one-line note on what you would do next if this were production (auth, pagination, empty state) — and stop there.

## Algorithm

- **Problem:** Week 3 timed review
- **Constraints:**
- Self-score
- **Hint:** Islands: do not forget to mark visited.

```text
algorithms/day-21/solution.ts
algorithms/day-21/solution.test.ts
```

Run: `pnpm test:algo -- day-21`

Open the full prompt: [day-21.md](../artifacts/algo/problems/day-21.md)

## Suggested commit

```text
day-21: tiny Next customers slice plus five-line Nuxt compare
```
