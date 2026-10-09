# Day 27 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

How do you review code? What is your quality bar? How do you handle ambiguity? Which of those answers are still weak — concept, story, or articulation?

## What you will produce

- List the 5 questions you still answer weakly and group them by root cause: concept gap, story gap, or articulation gap.
- Pick the top 2 weak spots and do one repair pass each today.

## How a senior works this

- **Decision:** Triage before more study. Concept gap → reread + one example. Story gap → STAR from a shipped system. Articulation gap → record and cut.
- **Constraint:** A weak-spot list plus two repair passes. Not a Vue spike and not a new Next feature.
- **Failure mode:** A list of 20 topics. Repairing the topic you like instead of the one that would fail the loop. No spoken pass.
- **Measure:** A real weak-spot list with priorities, and two spots that got a concrete repair pass.
- **Tradeoff:** Breadth review feels safe and changes nothing. Two deep repairs raise the floor of the mock tomorrow.
- **Production gotcha:** Ambiguity answers that skip the clarifying question. Code-review answers that only mention style. Quality bars with no example of something you rejected.

## Done when

- A real weak-spot list exists with priorities.
- Two weak spots got a concrete repair pass.
- Big-O flashcards are complete.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Write the clarifying questions you ask in the first 2 minutes of a vague design prompt.

## Algorithm

- **Problem:** Big-O flashcards
- **Constraints:**
- 10 minutes
- **Hint:** Write a 6-row table.

```text
algorithms/day-27/solution.ts
algorithms/day-27/solution.test.ts
```

Run: `pnpm test:algo -- day-27`

Open the full prompt: [day-27.md](../artifacts/algo/problems/day-27.md)

## Suggested commit

```text
day-27: weak-spot triage and two repair passes
```
