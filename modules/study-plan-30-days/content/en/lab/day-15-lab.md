# Day 15 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

You are a Vue specialist learning React. How does re-render differ from Vue reactivity? Map props, state, and lifecycle to hooks without apologizing.

## What you will produce

- Write a Vue → React comparison note for state, derived state, side effects, and composition.
- Explain where React feels more manual than Vue and where that manual control is useful.

## How a senior works this

- **Decision:** Transfer concepts, do not translate APIs line by line. State / derived / effects / composition on one page. Honesty about the gap is the senior move.
- **Constraint:** Comparison note. No Next customers route, no ‘start the React app’ install steps.
- **Failure mode:** ‘React is just Vue with different names.’ Sounding apologetic. Claiming production React depth you do not have.
- **Measure:** The React story sounds honest and confident. You can compare one real concept across Vue and React in under 2 minutes.
- **Tradeoff:** Vue tracks mutations; React re-renders a subtree and you opt out. Manual control is useful for explicit data flow and painful for derived state you forget to update.
- **Production gotcha:** Putting a `ref` in `useState` and wondering why the screen does not update. Treating `useMemo` as Vue `computed`.

## Done when

- Your React story sounds honest and confident, not apologetic.
- You can compare one real concept across Vue and React.
- Algo is done and BFS queue usage is solid.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Add the one sentence you will use if they ask ‘are you ready to write React in week one?’

## Algorithm

- **Problem:** Binary Tree Level Order Traversal · BFS
- **Constraints:**
- 0 ≤ nodes ≤ 2000
- **Hint:** Queue: each loop take size = queue.length = nodes on this level.

```text
algorithms/day-15/solution.ts
algorithms/day-15/solution.test.ts
```

Run: `pnpm test:algo -- day-15`

Open the full prompt: [day-15.md](../artifacts/algo/problems/day-15.md)

## Suggested commit

```text
day-15: Vue-to-React comparison note for state effects composition
```
