# Day 20 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

When do Server Actions help and when are they the wrong tool? What can middleware actually do? How do you handle metadata, images, fonts, and a first deploy?

## What you will produce

- List which parts of a small admin flow belong in Server Actions, Route Handlers, or plain client mutations.
- Write a deployment checklist: env vars, caching assumptions, image/font usage, and what to verify after deploy.

## How a senior works this

- **Decision:** Mutations that can live next to a form → Server Action. Webhooks / non-form HTTP → Route Handler. Optimistic UI / client-only → client mutation. Middleware for auth redirects and headers, not business logic.
- **Constraint:** Lists and a checklist. No deploy of a new Next app today.
- **Failure mode:** Putting a 200-line workflow in middleware. Server Actions without auth checks because ‘they run on the server’. Forgetting `next/image` host allowlists after deploy.
- **Measure:** You can explain when Server Actions simplify a flow and when they do not. Middleware, SEO, and assets are tied to concrete use cases.
- **Tradeoff:** Server Actions reduce boilerplate and hide the HTTP contract — which is great until a mobile client or a non-Next caller needs the same mutation.
- **Production gotcha:** Middleware runs on the Edge: no Node APIs, size limits, and easy-to-get-wrong matcher config. Metadata that is static when the title is per-record. Fonts that shift CLS.

## Done when

- You can explain when Server Actions simplify a flow and when they do not.
- Middleware, SEO, and asset optimization are tied to concrete use cases.
- Algo is done and the DP state choice is explainable.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Add one line on CSRF / origin checks for Server Actions and why ‘it is same-origin’ is not a complete answer.

## Algorithm

- **Problem:** Coin Change · DP
- **Constraints:**
- 1 ≤ coins.length ≤ 12
- 0 ≤ amount ≤ 10^4
- **Hint:** dp[x] = min coins to make x; dp[0]=0, else Infinity.

```text
algorithms/day-20/solution.ts
algorithms/day-20/solution.test.ts
```

Run: `pnpm test:algo -- day-20`

Open the full prompt: [day-20.md](../artifacts/algo/problems/day-20.md)

## Suggested commit

```text
day-20: Server Actions vs Route Handlers plus deploy checklist
```
