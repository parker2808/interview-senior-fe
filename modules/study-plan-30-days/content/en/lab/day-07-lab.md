# Day 7 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

If you had two days on this screen, what would you ship now vs later? Tell one technical trade-off with product impact, not taste.

## What you will produce

- Pick one screen from days 1-6 and produce a single-page redesign note: structure, state coverage, accessibility, and responsive behavior.
- End by saying what you would ship now vs later if time is tight.

## How a senior works this

- **Decision:** One page, one screen, ranked changes. Redesign is a priority list, not a wishlist or a new Vue app.
- **Constraint:** Single-page note. Reuse days 1–6. No Capstone build, no customer-module scaffold.
- **Failure mode:** A moodboard. ‘Make it modern.’ Shipping visual polish before state coverage or keyboard fixes.
- **Measure:** You can speak one trade-off in under 2 minutes: decision, constraint, failure mode, how you would measure it.
- **Tradeoff:** Ship state + keyboard fixes now; visual token cleanup later. Or the reverse if the interview company is a design-system team — say so.
- **Production gotcha:** Mini redesigns die in review when they ignore the permission model or the real API shape. Keep one production constraint visible on the page.

## Done when

- Your redesign note shows priorities, not just a wishlist.
- You can explain one trade-off out loud in under 2 minutes.
- Timed algo review is complete.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Record yourself explaining the now-vs-later cut in 90 seconds.

## Algorithm

- **Problem:** Week 1 timed review
- **Constraints:**
- Self-score: pass / partial / fail
- **Hint:** Name the pattern out loud before you type.

```text
algorithms/day-07/solution.ts
algorithms/day-07/solution.test.ts
```

Run: `pnpm test:algo -- day-07`

Open the full prompt: [day-07.md](../artifacts/algo/problems/day-07.md)

## Suggested commit

```text
day-07: one-page redesign note with now-vs-later cut
```
