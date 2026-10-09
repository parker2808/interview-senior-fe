# Day 4 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

How would you render a table with 50,000 rows? Flexbox or Grid for this layout? What stays visible on mobile, and what moves to overflow?

## What you will produce

- For one table screen, compare horizontal scroll, condensed columns, and card-on-mobile. Pick one default and explain why.
- List the actions that must stay visible on mobile and the ones that can move into an overflow menu.

## How a senior works this

- **Decision:** Pick one mobile default for one real table and defend it. Separate ‘how it looks on a phone’ from ‘how 50k rows stay fast’.
- **Constraint:** Decision note, not a rebuilt table. Do not introduce virtualization code today unless a 5-line sketch helps the spoken answer.
- **Failure mode:** Card-on-mobile that drops the columns ops actually sort by. Horizontal scroll that hides the primary action. Rendering 50k DOM rows.
- **Measure:** One chosen strategy, written trade-offs, and a list of mobile-critical actions. You can say why the other two strategies lost.
- **Tradeoff:** Horizontal scroll keeps column meaning (bad on small thumbs). Cards are readable (lose density and compare-across-rows). Condensed columns keep the table metaphor if you pick the right columns.
- **Production gotcha:** Virtualize too early and filter/sort/selection state becomes the real bug. On mobile, overflow menus that contain the only destructive action fail WCAG target size.

## Done when

- There is one chosen mobile strategy with trade-offs written down.
- Critical actions remain reachable on smaller screens.
- Algo passes and you remember the grouping pattern.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Say whether this table should even exist on a phone, or whether the product should offer a different task on small screens.

## Algorithm

- **Problem:** Group Anagrams · Hash map + sorted key
- **Constraints:**
- 1 ≤ strs.length ≤ 10^4
- 0 ≤ strs[i].length ≤ 100
- **Hint:** Key = sorted chars (‘eat’→‘aet’) or a count signature ‘a1e1t1’.

```text
algorithms/day-04/solution.ts
algorithms/day-04/solution.test.ts
```

Run: `pnpm test:algo -- day-04`

Open the full prompt: [day-04.md](../artifacts/algo/problems/day-04.md)

## Suggested commit

```text
day-04: choose one mobile strategy for a data-heavy table
```
