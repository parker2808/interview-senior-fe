# Day 3 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

How do you make a form usable with keyboard and a screen reader? When do you validate — on blur, on submit, or live? Semantic HTML vs ARIA: which do you reach for first?

## What you will produce

- Choose one form flow and document: field, validation rule, error message, trigger timing, and disabled state.
- Check whether keyboard-only and screen-reader users can understand the same flow.

## How a senior works this

- **Decision:** Every field gets a visible label, one error rule, and an intentional trigger. Prefer native semantics; add ARIA only for what HTML cannot express.
- **Constraint:** One real form (login, filter, or edit). Document it; do not rebuild a form library.
- **Failure mode:** Placeholder-as-label. Validate-on-keystroke that fights IME. Disabled submit with no reason. Errors announced only by color.
- **Measure:** You can speak the field → rule → message → timing → disabled story in under 2 minutes, including how a screen reader hears the error.
- **Tradeoff:** Validate on blur (faster feedback, more noise) vs on submit (calmer, later recovery). Mixed timing is fine if you can defend it per field.
- **Production gotcha:** `aria-live` on every keystroke is a production gotcha. So is a disabled button that never explains why the form is incomplete.

## Done when

- Each field has a clear label and error rule.
- Validation timing is intentional, not accidental.
- Algo is done and you can explain why Set is enough here.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Add the focus order and where focus lands after a failed submit.

## Algorithm

- **Problem:** Contains Duplicate · Set
- **Constraints:**
- 1 ≤ nums.length ≤ 10^5
- **Hint:** Set: if add() already had the value, it is a duplicate. Set is enough here.

```text
algorithms/day-03/solution.ts
algorithms/day-03/solution.test.ts
```

Run: `pnpm test:algo -- day-03`

Open the full prompt: [day-03.md](../artifacts/algo/problems/day-03.md)

## Suggested commit

```text
day-03: document one form field rules timing and a11y feedback
```
