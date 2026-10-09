# Day 8 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

What prints, and why? Walk the event loop: call stack, microtasks, macrotasks. Explain a closure bug and TDZ without slogans.

## What you will produce

- Write 3 interview snippets involving setTimeout, Promise, and closure capture. Predict the output before running them.
- For each snippet, explain the output in plain language, not jargon only.

## How a senior works this

- **Decision:** Three small snippets, predicted output first. One event-loop, one Promise-then vs setTimeout, one loop-closure (`var` vs `let` or captured index).
- **Constraint:** Snippets in a note or any existing playground. This is not a Vue feature day and not a customer-module split.
- **Failure mode:** Reciting ‘microtasks before macrotasks’ and then mis-ordering `Promise.then` vs `queueMicrotask` vs `setTimeout(0)`. Saying ‘closure remembers the value’ when it remembers the binding.
- **Measure:** You can walk one snippet tick by tick and the prediction matches the run.
- **Tradeoff:** Interviewers want the model, not Node vs browser trivia. Mention `requestAnimationFrame` only if you can place it relative to style/layout.
- **Production gotcha:** Vue watchers and `nextTick` are microtasks. A ‘DOM already updated’ answer that ignores `nextTick` is a production miss.

## Done when

- You can explain one event-loop snippet step by step.
- Closures and TDZ feel concrete again, not fuzzy.
- Algo is done with O(log n) reasoning.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Add a fourth snippet that mixes `async/await` with `setTimeout` and predict the await boundary.

## Algorithm

- **Problem:** Binary Search · Search on sorted data
- **Constraints:**
- 1 ≤ nums.length ≤ 10^4
- All elements unique
- Must be O(log n)
- **Hint:** while lo<=hi; mid; compare; shrink left or right half.

```text
algorithms/day-08/solution.ts
algorithms/day-08/solution.test.ts
```

Run: `pnpm test:algo -- day-08`

Open the full prompt: [day-08.md](../artifacts/algo/problems/day-08.md)

## Suggested commit

```text
day-08: three event-loop snippets with predicted output
```
