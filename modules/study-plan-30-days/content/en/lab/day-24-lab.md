# Day 24 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.

## What they will ask

CSRF vs XSS — what changes in the UI? How do you evaluate a third-party script? How do you roll out a frontend feature with flags and a rollback?

## What you will produce

- Write a short release checklist for one frontend feature: flags, monitoring, rollback, third-party risk, and post-release watch points.
- Add one paragraph on how cookie auth, XSS, and CSRF change your UI decisions.

## How a senior works this

- **Decision:** Treat release as part of the design. Flags + one metric + a rollback path before the merge. Security notes must change a concrete UI choice (no `v-html`, cookie flags, CSRF token on mutations).
- **Constraint:** Checklist + one paragraph. Not an E2E suite, not a CI rewrite.
- **Failure mode:** A generic OWASP list. Feature flags that cannot be turned off without a deploy. ‘XSS is a backend problem.’
- **Measure:** The checklist is practical enough to use next week. Security notes are tied to concrete frontend choices.
- **Tradeoff:** Third-party tags buy product analytics and cost XSS surface, perf, and a vendor outage in your critical path. Say no, or isolate.
- **Production gotcha:** HttpOnly cookies still leave you CSRF-exposed on cookie-auth mutations. `innerHTML` in a Vue `v-html` from a ‘trusted CMS’. Flags that default on in production.

## Done when

- The release checklist is practical enough to use next week.
- Security notes are tied to concrete frontend choices.
- Live-coding algo session is complete.
- You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch

Add the rollback sentence: what you revert (flag, CDN, or commit) and how long until users are safe.

## Algorithm

- **Problem:** Live coding simulation
- **Constraints:**
- Narrate the pattern before typing
- **Hint:** Say the pattern out loud before you type.

```text
algorithms/day-24/solution.ts
algorithms/day-24/solution.test.ts
```

Run: `pnpm test:algo -- day-24`

Open the full prompt: [day-24.md](../artifacts/algo/problems/day-24.md)

## Suggested commit

```text
day-24: frontend release checklist and XSS CSRF UI notes
```
