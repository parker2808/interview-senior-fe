# Day 9 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

When does one failed request block the whole UI? `Promise.all` vs `allSettled` vs `race`? How do you cancel a stale search? Event delegation vs 200 row listeners?

## What you will produce

- Compare Promise.all vs allSettled vs race on one realistic frontend case such as dashboard widgets or parallel lookups.
- Sketch how you would cancel or ignore stale responses in a search flow.

## How a senior works this

- **Decision:** Pick one combinator per case: all (auth + permissions must all succeed), allSettled (dashboard widgets), race (timeout vs request). Sketch AbortController for search.
- **Constraint:** A comparison note plus a 10-line AbortController / generation-token sketch. No new Vue customer search feature.
- **Failure mode:** `Promise.all` on widgets so one 500 blanks the page. Ignoring out-of-order fetch so an old query overwrites a new one. `stopPropagation` as a design tool.
- **Measure:** You can say when one failure should block the UI and when it should not, and walk capture → target → bubble with one DOM example.
- **Tradeoff:** AbortController (real cancel, more plumbing) vs ignore-stale-by-sequence (simple, still burns the network). Prefer abort for typeahead.
- **Production gotcha:** Aborting a fetch does not abort the server. Delegation on `tbody` dies when the table body is replaced. `once` listeners and Vue `onUnmounted` are easy to forget.

## Done when

- You know when failure of one request should block the whole UI and when it should not.
- Event propagation and delegation are explainable with one DOM example.
- Algo is done and the two-pointer pattern is clear.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Write the one-liner for why `race` is the wrong tool for ‘first widget wins’ dashboards.

## Algorithm

- **Problem:** Two Sum II · Two pointers
- **Constraints:**
- 2 ≤ numbers.length ≤ 3·10^4
- **Hint:** Two pointers at ends: too small → left++; too big → right--.

```text
algorithms/day-09/solution.ts
algorithms/day-09/solution.test.ts
```

Run: `pnpm test:algo -- day-09`

Open the full prompt: [day-09.md](../artifacts/algo/problems/day-09.md)

## Suggested commit

```text
day-09: promise combinators and stale-search abort sketch
```
