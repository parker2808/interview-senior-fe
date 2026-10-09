# Day 14 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

Tell a performance story from production. Which Vue pattern actually moved the metric? Which Core Web Vital maps to the symptom users filed?

## What you will produce

- Take one production issue you remember and retell it using symptom → measurement → root cause → fix → regression guard.
- Write down which metric or signal you would watch first next time.

## How a senior works this

- **Decision:** One real incident, retold in the five-step shape. Pick the first signal you would open next time (LCP, INP, CLS, TTFB, Vue perf flamegraph, network waterfall).
- **Constraint:** A spoken story, not a perf refactor. Week 2 ends as interview drills, not a Vue build sequence.
- **Failure mode:** ‘We added keep-alive and it got faster’ with no number. Blaming Vue when the waterfall is 12 sequential APIs. No regression guard.
- **Measure:** The story is interview-ready: a metric tied to a user-facing symptom, a fix, and a guard (test, budget, or dashboard).
- **Tradeoff:** Measure first vs ship a plausible fix. Seniors measure; mid-levels memo everything. Say what you would not optimize.
- **Production gotcha:** Devtools numbers lie on throttled CPU. A Vue `v-once` win that broke freshness. Web Vitals that look fine because the spinner is fast and the table is not.

## Done when

- One performance story is now interview-ready.
- You can connect a metric to a user-facing symptom.
- Timed algo review is complete.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Add the sentence you would say if you never owned the perf dashboard: how you still investigated.

## Algorithm

- **Problem:** Week 2 timed review
- **Constraints:**
- Self-score: pass / partial / fail
- **Hint:** Write the skeleton before details.

```text
algorithms/day-14/solution.ts
algorithms/day-14/solution.test.ts
```

Run: `pnpm test:algo -- day-14`

Open the full prompt: [day-14.md](../artifacts/algo/problems/day-14.md)

## Suggested commit

```text
day-14: performance story in symptom-measure-cause-fix-guard form
```
