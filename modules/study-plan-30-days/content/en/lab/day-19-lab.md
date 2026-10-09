# Day 19 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

How does Next fetch, cache, and revalidate? SSR vs SSG vs ISR vs streaming — pick for marketing, admin list, and personalized detail. Map that to Nuxt `useAsyncData` / `useFetch`.

## What you will produce

- Write a comparison table: useAsyncData/useFetch in Nuxt vs server fetch / no-store / revalidate in Next.
- For three page types (marketing, admin list, personalized detail), choose SSR/SSG/ISR/streaming and explain why.

## How a senior works this

- **Decision:** Choose per page type, not per framework loyalty. Marketing → SSG/ISR. Admin list → SSR or no-store. Personalized detail → SSR + streaming the below-the-fold widgets.
- **Constraint:** A comparison table in a note. No cache-experiment app today.
- **Failure mode:** Reciting `revalidate: 60` with no idea who sees stale data. Treating ISR as ‘SSG but magic’. Streaming as a buzzword with no Suspense boundary.
- **Measure:** Cache vs fresh is written by page type. Streaming and ISR sound like decisions, not slogans.
- **Tradeoff:** Fresh admin data costs TTFB and origin load. ISR is cheap and can serve a deleted record for a minute. Say who is allowed to see stale.
- **Production gotcha:** Next cache is not your CDN and not Pinia. `fetch` cache defaults have changed across versions — say which mental model you use (explicit `cache` / `next.revalidate`) and do not bluff a version you have not run.

## Done when

- Cache vs fresh data decisions are written by page type.
- Streaming and ISR no longer sound like buzzwords only.
- Algo is done and the DP recurrence is clear.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Add one row: tag-based revalidation vs time-based, and when you would pick each.

## Algorithm

- **Problem:** Climbing Stairs · DP
- **Constraints:**
- 1 ≤ n ≤ 45
- **Hint:** dp[i] = dp[i-1] + dp[i-2] (Fibonacci).

```text
algorithms/day-19/solution.ts
algorithms/day-19/solution.test.ts
```

Run: `pnpm test:algo -- day-19`

Open the full prompt: [day-19.md](../artifacts/algo/problems/day-19.md)

## Suggested commit

```text
day-19: Next vs Nuxt fetch table and three rendering choices
```
