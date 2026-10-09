# Day 13 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

What belongs in Pinia vs the URL vs Nuxt/server cache? How do you handle role/permission in the UI without making the store the security layer?

## What you will produce

- Draw a state map for one flow: who owns it, who reads it, and how stale data is refreshed.
- Mark one piece of state that should move out of the store and one that should move into a shared layer.

## How a senior works this

- **Decision:** Draw the map first: source of truth per field. URL for shareable filters, component for ephemeral UI, Pinia for cross-tree client session, server cache for remote data.
- **Constraint:** A state map on paper or in a note. Do not refactor a Pinia store in the product today.
- **Failure mode:** Putting current page, table rows, and auth user in the same store. Hiding permission only in CSS. Cache that never invalidates after a mutation.
- **Measure:** The map has one source of truth per piece of state, and store vs cache vs URL is written down.
- **Tradeoff:** A fat Pinia store is easy to find and hard to test. Colocated server cache stays fresh and is awkward to share across distant trees.
- **Production gotcha:** SSR Pinia hydration mismatches. Permission checks that exist only in the UI. Filters in Pinia that should have been query params — refresh loses them.

## Done when

- The state map has a clear source of truth.
- Store vs cache vs URL choices are written down.
- Algo is done and the Floyd pattern makes sense.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Add the invalidation arrow: which mutation clears which cache key.

## Algorithm

- **Problem:** Linked List Cycle · Floyd pointers
- **Constraints:**
- Floyd cycle detection
- **Hint:** slow/fast: if they meet, there is a cycle.

```text
algorithms/day-13/solution.ts
algorithms/day-13/solution.test.ts
```

Run: `pnpm test:algo -- day-13`

Open the full prompt: [day-13.md](../artifacts/algo/problems/day-13.md)

## Suggested commit

```text
day-13: state map with store vs cache vs URL ownership
```
