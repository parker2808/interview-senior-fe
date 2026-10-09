# Day 12 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

SSR, prerender, or client-heavy — why for this screen? `useFetch` vs `useAsyncData` vs a plain client fetch? What hydration bugs have you actually seen?

## What you will produce

- Take one screen and decide whether it should be SSR, prerendered, or client-heavy in Nuxt. Explain why.
- Write one short answer for: “When would you use useFetch, useAsyncData, or plain client fetch?”

## How a senior works this

- **Decision:** One screen, one rendering mode, written trade-offs. Fetch choice follows the mode: `useAsyncData`/`useFetch` on the server path, client fetch for user-driven refetch.
- **Constraint:** Decision note only. Do not change Nuxt route rules in a product app today.
- **Failure mode:** ‘We use SSR because Nuxt defaults to it.’ Client-only date formatting that breaks hydration. `useFetch` in an event handler.
- **Measure:** A rendering-mode decision with trade-offs, and a fetch-choice answer that depends on context, not a preferred API.
- **Tradeoff:** SSR wins first content and SEO; costs TTFB and hydration. Prerender wins marketing pages. Client-heavy wins highly personalized admin tools.
- **Production gotcha:** Mismatched `useFetch` keys, double fetch on client navigation, and `process.client` guards that hide the real hydration bug.

## Done when

- One rendering-mode decision is written with trade-offs.
- Nuxt fetching choices are explainable by context.
- Algo is done and linked-list pointer movement is comfortable.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Add one sentence on payload extraction / `lazy` / `server: false` and when you would use each.

## Algorithm

- **Problem:** Reverse Linked List
- **Constraints:**
- 0 ≤ n ≤ 5000
- **Hint:** Iterative: prev=null, cur=head; next=cur.next; cur.next=prev; walk.

```text
algorithms/day-12/solution.ts
algorithms/day-12/solution.test.ts
```

Run: `pnpm test:algo -- day-12`

Open the full prompt: [day-12.md](../artifacts/algo/problems/day-12.md)

## Suggested commit

```text
day-12: pick a Nuxt rendering mode and fetch API for one screen
```
