# Day 6 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

How do you type props so the next engineer cannot misuse the component? When do you want a union vs a generic? Show Button, TextField, EmptyState.

## What you will produce

- Spec 3 core component APIs (for example Button, TextField, EmptyState) with props, variants, and misuse guardrails.
- Mark which props must stay simple and which ones should be extensible.

## How a senior works this

- **Decision:** Design the public type first. Variants as unions. Forbid impossible states (`loading` + `href` on a link button) in the type, not in a runtime warning.
- **Constraint:** Type specs / short TS snippets only. No component library scaffold, no npm install.
- **Failure mode:** `props: Record<string, any>`. A boolean forest (`primary`, `danger`, `ghost`) that allows `primary && danger`. Generics added for decoration.
- **Measure:** Three typed APIs plus one intentional union or generic. You can explain one misuse the type prevents.
- **Tradeoff:** Simple props vs extensible slots/render props. Simple wins consistency; extensible wins one-off product needs and costs support.
- **Production gotcha:** Vue 3 `defineProps` + generic components still have inference edges. If you promise ‘the type makes it impossible’, know the escape hatch (`as any` in a template).

## Done when

- Three component APIs are typed and documented.
- At least one union or generic is used intentionally.
- Algo is done and the stack pattern feels natural.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Write the discriminated union for Button-as-button vs Button-as-link.

## Algorithm

- **Problem:** Valid Parentheses · Stack
- **Constraints:**
- 1 ≤ s.length ≤ 10^4
- **Hint:** Stack: push openers; on close, pop and match the pair.

```text
algorithms/day-06/solution.ts
algorithms/day-06/solution.test.ts
```

Run: `pnpm test:algo -- day-06`

Open the full prompt: [day-06.md](../artifacts/algo/problems/day-06.md)

## Suggested commit

```text
day-06: spec three typed component APIs with misuse guardrails
```
