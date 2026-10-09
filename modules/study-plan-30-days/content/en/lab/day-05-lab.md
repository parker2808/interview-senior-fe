# Day 5 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

Can you finish this admin flow with only a keyboard? Where does focus go after a modal closes? When is lazy-loading a keyboard trap?

## What you will produce

- Run a keyboard-only pass on one real flow: Tab, Shift+Tab, Enter, Escape, and focus return.
- Write down the top 3 keyboard or focus issues you would fix first.

## How a senior works this

- **Decision:** Treat keyboard order as a product path. Document Tab order, Escape, and focus return for one real flow, then rank 3 fixes.
- **Constraint:** One flow you already know. Keyboard pass + note. Do not implement a focus-trap library today.
- **Failure mode:** Focus lost after dialog close. Tab order that skips the primary action. Custom dropdowns that ignore Arrow keys and Escape.
- **Measure:** A written keyboard order and at least one focus bug with a concrete fix. You can demo the path out loud.
- **Tradeoff:** Native dialog/select vs custom widgets. Native wins keyboard for free; custom wins visual control and costs a focus trap.
- **Production gotcha:** Lazy-loaded chunks that remount and reset focus. Portals that append to `body` and dump the user at the document end.

## Done when

- Keyboard order is documented for one real flow.
- At least 1 focus bug is identified with a concrete fix.
- Algo is green and the complexity trade-off is clear.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Note the skip-link / landmark story: can a keyboard user jump to the table without tabbing the whole nav?

## Algorithm

- **Problem:** Top K Frequent Elements · Hash map + bucket
- **Constraints:**
- 1 ≤ nums.length ≤ 10^5
- **Hint:** Count frequency, then sort entries or bucket-sort by freq.

```text
algorithms/day-05/solution.ts
algorithms/day-05/solution.test.ts
```

Run: `pnpm test:algo -- day-05`

Open the full prompt: [day-05.md](../artifacts/algo/problems/day-05.md)

## Suggested commit

```text
day-05: keyboard-only pass and top three focus fixes
```
