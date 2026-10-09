# Day 16 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

`useState` vs `useRef`? Controlled vs uncontrolled — when do you pick each? When does Context become a problem?

## What you will produce

- Build or review a small form and identify what should be state, ref, derived value, and lifted state.
- Write one rule of thumb for when you would stop using Context and move to another tool.

## How a senior works this

- **Decision:** Label every value: state (drives render), ref (imperative / does not need render), derived (compute, do not store), lifted (shared by siblings).
- **Constraint:** A tiny form snippet or a review of a form you already have. Not a design-system TextField rewrite.
- **Failure mode:** Storing derived values in state and watching them drift. Uncontrolled input plus a `value` prop. Context for every keystroke in a large tree.
- **Measure:** You can explain state vs ref with a concrete case, and the form shows controlled-input reasoning, not memorized API usage.
- **Tradeoff:** Controlled forms are testable and constrainable; they re-render per keystroke. Uncontrolled + ref is fine for ‘submit the file and walk away’.
- **Production gotcha:** Lifting state too high re-renders a dashboard. Context without splitting (state vs dispatch) becomes a perf story you did not mean to tell.

## Done when

- You can explain state vs ref with a concrete case.
- The form example shows controlled-input reasoning, not memorized API usage.
- Algo is done and DFS recursion still feels comfortable.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Write the rule: leave Context when updates are frequent, consumers are wide, or the value is a server cache.

## Algorithm

- **Problem:** Maximum Depth of Binary Tree · DFS
- **Constraints:**
- 0 ≤ nodes ≤ 10^4
- **Hint:** 1 + max(left, right); null → 0.

```text
algorithms/day-16/solution.ts
algorithms/day-16/solution.test.ts
```

Run: `pnpm test:algo -- day-16`

Open the full prompt: [day-16.md](../artifacts/algo/problems/day-16.md)

## Suggested commit

```text
day-16: label form values as state ref derived or lifted
```
