# Day 2 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

A dashboard calls 15 APIs. What does the user see first, what can arrive late, and what fails independently? How do you keep hierarchy obvious in 10 seconds?

## What you will produce

- Take one screen from Parker’s experience and redraw loading, empty, error, and permission-denied states.
- Rewrite the heading, primary action, and helper copy so the hierarchy is obvious in under 10 seconds.

## How a senior works this

- **Decision:** Cover the four states before polishing the happy path. Rewrite heading / primary action / helper so a stranger knows what to do.
- **Constraint:** Notes or a wire sketch only. Do not rebuild the screen. One real flow from a system you shipped.
- **Failure mode:** A spinner that blocks the whole page while 14 of 15 widgets could render. Empty states with no next action. Errors that only say ‘Something went wrong’.
- **Measure:** You can point at each state and say the user impact in one sentence. Time-to-understand the rewritten hierarchy is under 10 seconds.
- **Tradeoff:** Progressive widgets vs one consistent skeleton. Progressive is faster to first paint; a full skeleton is calmer but hides useful data.
- **Production gotcha:** Permission-denied is not an error. Mixing 403 into the generic error toast trains users to retry a request they will never be allowed to make.

## Done when

- The screen has explicit state coverage, not just the happy path.
- You can explain one UX trade-off with product impact, not taste only.
- Algo passes with O(n) reasoning.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Add a one-line rule for when lazy-loading a widget helps vs when it just delays the empty state.

## Algorithm

- **Problem:** Valid Anagram · Frequency map
- **Constraints:**
- 1 ≤ s.length, t.length ≤ 5·10^4
- **Hint:** Count 26 letters (array of 26) or a Map. O(n) time.

```text
algorithms/day-02/solution.ts
algorithms/day-02/solution.test.ts
```

Run: `pnpm test:algo -- day-02`

Open the full prompt: [day-02.md](../artifacts/algo/problems/day-02.md)

## Suggested commit

```text
day-02: redraw loading empty error and permission-denied states
```
