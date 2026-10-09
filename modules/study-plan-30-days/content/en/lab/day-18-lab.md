# Day 18 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

What problem do App Router and RSC actually solve? How do nested layouts and `loading.tsx` / `error.tsx` work per segment? When is a Client Component required?

## What you will produce

- Sketch a tiny Next app tree with root layout, dashboard layout, one page, loading.tsx, and error.tsx.
- For each file, write the Nuxt 3 idea it most closely matches.

## How a senior works this

- **Decision:** Sketch the tree, then map each file to Nuxt (`app.vue`, layouts, `pages/`, `<NuxtPage>`, error.vue, route-level loading). Server by default; `'use client'` at the leaf that needs state or browser APIs.
- **Constraint:** A folder sketch in a note. Do not `create-next-app` today. The small running slice is Day 21.
- **Failure mode:** ‘Interactive = client’ as the whole rule. Putting `'use client'` on the root layout. Confusing `error.tsx` with an API 500 handler.
- **Measure:** You can explain nested layouts and segment-level loading without docs, and Server vs Client is sharper than ‘interactive = client’.
- **Tradeoff:** Nested layouts preserve shell state across navigations (good for dashboards, surprising if you expected a full remount). Segment `error.tsx` isolates failure — until you forget a root fallback.
- **Production gotcha:** Client leaves above a Server Component are illegal. `loading.tsx` wraps the segment in Suspense — instant navigation can flash an empty shell if the fallback is huge.

## Done when

- You can explain nested layouts and segment-level loading without looking up the docs.
- The Server vs Client boundary is clearer than “interactive = client”.
- Algo is done and grid traversal still feels okay.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Add `not-found.tsx` and `template.tsx` to the map and say whether you would use `template`.

## Algorithm

- **Problem:** Number of Islands · Grid BFS/DFS
- **Constraints:**
- 1 ≤ m,n ≤ 300
- **Hint:** See a ‘1’ → increment → flood-fill it to ‘0’.

```text
algorithms/day-18/solution.ts
algorithms/day-18/solution.test.ts
```

Run: `pnpm test:algo -- day-18`

Open the full prompt: [day-18.md](../artifacts/algo/problems/day-18.md)

## Suggested commit

```text
day-18: sketch App Router tree and Nuxt file map
```
