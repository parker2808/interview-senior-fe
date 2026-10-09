# Day 17 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

What is a good `useEffect` vs a bad one? How do you cancel stale work? Why don’t Error Boundaries catch API failures or event-handler errors?

## What you will produce

- Review one effect and ask: what triggers it, how is stale work cancelled, and what happens on rapid input or unmount?
- Write one short explanation for why Error Boundaries do not replace API error handling.

## How a senior works this

- **Decision:** For one effect: trigger, cleanup, stale, unmount. Then one sentence: Error Boundaries catch render-time React errors, not `fetch` or click handlers.
- **Constraint:** Review / snippet. Do not add an Error Boundary tree to a product app today.
- **Failure mode:** Fetching in an effect without cleanup (Strict Mode double-fetch + setState on unmount). Using Error Boundaries as the only error UX.
- **Measure:** One good and one bad `useEffect` pattern, and Error Boundaries tied to real limits, not a vague definition.
- **Tradeoff:** Effects are the escape hatch. Prefer derived render and event handlers. If you need an effect to sync props → state, ask whether the state should exist.
- **Production gotcha:** React 18 Strict Mode remounts. AbortController in the cleanup. Error Boundaries do not catch async. `getDerivedStateFromError` vs `componentDidCatch` is extra credit, not required.

## Done when

- You can describe one good and one bad useEffect pattern.
- Error Boundaries are now tied to real limitations, not a vague definition.
- Algo is done and BST properties are used correctly.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Write the dependency-array trap you would mention (`[]` on a callback that closes over stale props).

## Algorithm

- **Problem:** Lowest Common Ancestor of a BST
- **Constraints:**
- Use BST properties, not a full tree walk if you can avoid it
- **Hint:** Both < root → left; both > root → right; else root is LCA.

```text
algorithms/day-17/solution.ts
algorithms/day-17/solution.test.ts
```

Run: `pnpm test:algo -- day-17`

Open the full prompt: [day-17.md](../artifacts/algo/problems/day-17.md)

## Suggested commit

```text
day-17: review one effect cleanup and error-boundary limits
```
