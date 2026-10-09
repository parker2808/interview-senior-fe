# Leadership & Soft Skills

Seniors get **behavioral + tech-lead** questions in the same loop as Vue. They are not scoring charisma. They want **repeatable judgment**: how you grow people, freeze architectural decisions, estimate under uncertainty, disagree without burning the room, and talk during an incident.

Shape answers as **STAR** (Situation, Task, Action, Result) with a **decision → constraint → failure mode → measure** inside the Action. Keep stories FE-shaped: reviews, flags, CWV, incidents, PM scope.

---

## Table of Contents

1. [Technical Mentorship](#171-technical-mentorship)

2. [Architecture Decision Records (ADR)](#172-architecture-decision-records-adr)

3. [Complexity Estimation](#173-complexity-estimation)

4. [Conflict Resolution](#174-conflict-resolution)

5. [Saying No / Pushing Back on PM](#175-saying-no-pushing-back-on-pm)

6. [Code Review as Leadership](#176-code-review-as-leadership)

7. [Incident Communication](#177-incident-communication)

---

## 17. Leadership & Soft Skills

### 17.1. Technical Mentorship

**What they actually ask**

- “How do you mentor juniors?”
- “Tell me about someone who wasn’t making it.”
- “When do you take the keyboard?”

**How a senior answers**

- **Decision:** **Calibrate to the person**, not a program. Goal of a given hour is either **delivery**, **learning**, or **safety** — pick one. Review and pair to **teach the next decision**, not to produce your code with their name on it.
- **Constraint:** You still own the team’s quality and the mentee’s confidence. Hovering prevents growth; abandonment produces production bugs and shame.
- **Failure mode:** Pairing by grabbing the keyboard on every syntax error; reviews that only say “nit”; identical growth plan for everyone; avoiding underperformance until PIPs are a surprise.
- **Measure:** they ship a slice alone; review comments trend down on the same theme; they can explain the *why* in standup; 1:1s have goals that change.

**STAR skeleton**

- **S/T:** New hire in week 2, first Pinia + `useAsyncData` ticket, or a mid who is stuck at “implements tickets.”
- **A:** Diagnose *what* is missing (domain, Vue, communication). Set a **small explicit bar** (“this PR: loading/error/empty, tests on the composable”). Pair on the first seam, then they drive. Review with questions, not patches. If blocked >N hours, you join — you do not let them drown overnight.
- **R:** Ticket landed; they reused the pattern on the next feature; you wrote down the pattern so you are not the bus factor.

**Calibrate**

| Signal | Move |
| --- | --- |
| Lost in the repo | Navigate together; they take notes of *where* truth lives |
| Strong JS, weak Vue | Composable kata + one production PR |
| Fast but sloppy | Review bar on a11y/errors, not speed praise |
| Quiet in reviews | Ask them to review *your* PR first |

**When to take the keyboard vs not**

- **Take it:** production incident, security, they are stuck on environment pain, you are demoing a *move* for 3 minutes (“watch the extract, then you redo it”).
- **Don’t:** their feature branch in week 5, “it’s faster if I finish it,” or rewriting their PR in the GitHub UI. That teaches dependency.

**Growth plans**

Written, 90 days, 2–3 outcomes (“owns checkout errors including Sentry”), not “get better at TypeScript.” Revisit in 1:1s. Stretch tickets with a named backup.

**Underperformance**

Early, specific, private: examples, expected bar, support (pairing schedule), timeline. Document. If it’s a misfit (they want to do backend), help them move. If it’s not improving, escalate with **facts** — delaying is not kindness; the rest of the team is already carrying.

**Tradeoffs**

- Short-term velocity vs a second senior in six months.
- Protecting users (you take the hotfix) vs protecting learning (they take the next one with you on call).

**Production gotchas**

- “Mentoring” that is just assigning grunt CSS.
- Public shaming in review (“as I told you…”).
- Only mentoring people like you.

**Follow-ups**

- How do you mentor a **senior** peer? (RFCs, rotating lead, you ask them to own a slice of DS)
- What if they are a better visual designer than you? (you learn; they don’t skip a11y)

---

### 17.2. Architecture Decision Records (ADR)

**What they actually ask**

“How do you document decisions?” / “Pinia vs Vuex — would you write an ADR?”

**How a senior answers**

- **Decision:** Write an ADR when the choice is **expensive to reverse** or **will look random in six months**: rendering model, state library, BFF vs FE aggregation, MF vs monorepo, auth cookie vs token, “why we don’t use GraphQL.” Keep it **one to two pages**. Status: proposed → accepted → superseded.
- **Constraint:** Nobody reads novels. The value is **context + alternatives + consequences**, not the template.
- **Failure mode:** ADRs for every component rename; beautiful ADRs nobody links from the code; using an ADR to **win an argument after shipping**; never superseding, so the repo lies.
- **Measure:** can a new hire find *why* Pinia, *why* Nuxt `routeRules`, *why* no MF? Time spent re-litigating settled choices (should drop).

**How short**

```markdown
# ADR-012: Filters live in the URL on the ops dashboard

Status: Accepted
Context: Support shares views; back button was broken (Pinia-only).
Decision: Typed query params are the source of truth; Pinia not used for filters.
Consequences: SSR/share work; secrets must not go in the URL.
Rejected: sessionStorage (not shareable), saved views only (too much backend for v1).
```

That is enough. Link it from the dashboard README and the PR.

**Disagree and commit**

You argue in the RFC with **data or a spike** (17.4). A named owner **decides** by date. You **commit** (implement the chosen path, don’t saboteur-comment). If new production evidence appears, you **reopen** with a superseding ADR — you don’t silently fork.

**When not to write**

Bugfixes, local refactors, “use `const`.” If the team is two people for a weekend prototype, a Slack thread + later ADR when it graduates is fine.

**Tradeoffs**

- Too many ADRs (noise) vs tribal knowledge in one architect’s head.
- Lightweight markdown in repo vs Confluence (repo wins; it’s next to the code).

**Production gotchas**

- ADR says “no MF,” org announces MF anyway — update status, don’t pretend.
- Decision recorded without **owner** and **review date**.

**Follow-ups**

- Show me an ADR you regret. (Good seniors have one.)
- How does this interact with RFCs vs Jira?

---

### 17.3. Complexity Estimation

**What they actually ask**

“How do you estimate?” They are sniffing for **false precision** and for blaming “the estimate” later.

**How a senior answers**

- **Decision:** Estimate **uncertainty and size**, communicate **ranges**, split until a slice is teachable. Story points (if the team uses them) compare **relative complexity**, they are **not hours**. Dates for stakeholders are **forecasts with confidence**, not point commitments you invented from “5 points = 2 days.”
- **Constraint:** Frontend estimates die on: unclear design, missing API, a11y, i18n, feature flags, analytics, empty/error states, migrations, **browser matrix**. If those aren’t in the ticket, the number is a lie.
- **Failure mode:** “It’s two hours” on an auth change; padding every ticket in secret (sandbagging) so nobody can plan; refusing to forecast at all; converting the team’s point velocity into a person-hour spreadsheet in the interview.
- **Measure:** forecast vs actual **range** hit rate, how often “unknowns” were listed up front, % of stories split mid-sprint (should fall).

**STAR**

- **S:** PM wants “filters + export + realtime” in one sprint.
- **T:** Give a number they can plan with.
- **A:** Split: URL filters (known), export (needs backend job), realtime (spike). Range the known work; **time-box the spike** (1 day) before estimating the rest. List dependencies. Say **what would make it 3×** (API pagination wrong, 50k rows).
- **R:** Sprint ships filters; export is next; nobody “failed the estimate.”

**Uncertainty**

If you cannot name the API contract, you don’t have an estimate — you have a **discovery** task. Price discovery **explicitly**.

**Story points vs dates**

- Points: planning *inside* the team, velocity as a **lagging** indicator, not a contract.
- Dates: execs need them. You translate with **confidence** (“likely this Thursday, worst case next Tuesday if the VAT API slips”) and **scope levers** (cut export, not tests).
- Don’t recite a “1 point = 2 hours” table. That’s how juniors get trapped.

**Buffers without sandbagging**

- Buffer at the **plan** level (integration, review, QA, “the API will change”) — visible.
- Don’t multiply every story by 2 in hiding. That trains PMs to ignore your numbers.
- Call out **calendar** reality: holidays, on-call, hiring loop.

**Tradeoffs**

- Planning poker vs you estimating alone (use the team for uncertainty; don’t average a 2 and a 13 without talking).
- T-shirt sizes for roadmap, points for sprint.

**Production gotchas**

- Forgetting design-system gaps (“we just use Button”) that become a week.
- Estimating happy path only (13.3 states).
- Velocity used as a performance rating — it will be gamed; say you’d fight that.

**Follow-ups**

- How do you estimate a rewrite? (strangle in slices, not a 6-month blob)
- What if they demand a date today? (range + assumptions list)

---

### 17.4. Conflict Resolution

**What they actually ask**

“Tell me about a disagreement.” They want **adult process**, not “I’m easy to work with.”

**How a senior answers**

- **Decision:** **Technical** conflicts get **data, spikes, and a decision owner**. **Personality / respect** conflicts get a **private conversation** first. Escalate with **options**, not complaints.
- **Constraint:** The product still has to ship. Consensus is not always possible; silent resentment is expensive.
- **Failure mode:** Debating tabs-vs-spaces in Slack for a week; calling someone out in standup; escalating as “they’re difficult” with no options; “disagree and commit” used to shut down evidence.
- **Measure:** time-to-decision, whether the ADR exists, whether the relationship still works in reviews, whether the same fight recurs.

**STAR (technical)**

- **S:** Teammate wants Module Federation; you want a monorepo package (15.4).
- **T:** Don’t split the team.
- **A:** Write both options on one page (cost, team boundaries, LCP). Time-box a spike if needed. Involve the person who **owns** the outcome. Decide. You implement the chosen path.
- **R:** Decision recorded; revisit trigger named (“when we have two deploy clocks”).

**STAR (personality)**

- **S:** Reviews feel personal; they merge despite your blocking comment.
- **A:** 1:1, specific examples, impact on users/on-call. Agree a review SLA. If it continues, involve the manager **with** those examples and a proposed working agreement.
- **R:** Blocking vs nit clarified (17.6); no more surprise merges.

**Escalate with options**

“We can (A) ship URL filters this sprint and defer WS, (B) slip a week for WS, (C) drop export. I recommend A because of the support-team SLA. Need you to pick by Wednesday.”

That is leadership. “Please tell them I’m right” is not.

**Tradeoffs**

- Let a reversible choice go (css naming) vs hold the line (auth, a11y, user data).
- Public technical debate (good, documented) vs public personal debate (bad).

**Production gotchas**

- “Data-driven” but you only gathered data that supports you.
- Manager-only conflict avoidance — the team smells it.

**Follow-ups**

- What if the decision owner is wrong in production? (superseding ADR, no I-told-you-so in Slack)
- Cross-team: FE vs backend ownership of BFF?

---

### 17.5. Saying No / Pushing Back on PM

**What they actually ask**

“PM wants it Friday. QA is thin. You know it’s unsafe. What do you do?”

**How a senior answers**

- **Decision:** Don’t say **no** to the **goal**. Say **no to a plan** that violates a constraint, and offer **levers**: scope, date, risk (flag), quality bar. Be specific about **user impact**, not “engineering excellence.”
- **Constraint:** PMs are graded on outcomes. If you only block, you get routed around. If you never block, you own the incident.
- **Failure mode:** Silent hero-weekend; sarcastic “sure, whatever”; a 12-slide deck to reject a copy change; pushing back in the sprint review in front of execs as a surprise.
- **Measure:** incidents from rushed work (should drop), % of “must have Friday” that actually were, trust in planning (they still bring you in early).

**STAR**

- **S:** Add Apple Pay this week, including a new SDK, no sandbox, legal copy TBD.
- **T:** Protect checkout; still help the campaign if possible.
- **A:** Name the risks (double charge, a11y, 3MB SDK on `/pricing` — 12.3). Offer: (1) **flagged** Stripe-only path behind staff, (2) Apple Pay next sprint with a named owner, (3) campaign landing **without** checkout change. Ask which goal is actually Friday: **conversion experiment** vs **new tender**.
- **R:** They pick (1) or (3); you don’t become the blocker of the company, you become the person who made the choice **visible**.

**Phrases that work**

- “We can ship A by Friday if we cut B, or we keep B and move the date.”
- “I’ll do it with a **kill switch** and a rollback owner. Without those I’m not comfortable putting this on the payment path.”
- “This is a **product contract** change, not a 2-hour UI tweak” (18.3).

Push back **early** (discovery), in the same channel as the request, with written assumptions.

**Tradeoffs**

- Political capital: spend it on safety/ethics/legal, not on your favorite library.
- “Not now” vs “never” — offer a revisit condition.

**Production gotchas**

- Saying yes to two PMs independently.
- Using estimates as a weapon (inflating to force no).

**Follow-ups**

- What if the PM is also your skip-level’s favorite? (still write the risk; copy your manager; don’t go rogue)
- Design wants a video background on `/` during a campaign? (CWV budget — numbers)

---

### 17.6. Code Review as Leadership

**What they actually ask**

“What does a good review look like from a senior?”

**How a senior answers**

- **Decision:** Reviews are how you **scale taste**. Prioritize **user-facing correctness, security, a11y, data loss, performance budgets** over style. Distinguish **blocking** vs **nit**. Teach with *why*. Load-balance so one person isn’t the bottleneck — including **you** not reviewing everything.
- **Constraint:** PR size and SLA. A 40-file PR cannot be reviewed honestly; that’s a process failure, not a reviewer failure.
- **Failure mode:** rubber stamp; rewrite-the-PR comments; blocking on prettier; only seniors may merge; ignoring tests; public pile-on.
- **Measure:** time-to-first-review, escaped defects, whether juniors can merge without you, comment themes repeating (fix with lint/ADR).

**Blocking vs not**

| Block | Don’t block |
| --- | --- |
| Authz, PII, XSS, broken focus, silent catch | Naming, import order (automate) |
| Missing error/empty state on a user flow | Prefers `const` in a script setup |
| Bundle of a new heavy lib on `/` | “I’d have used a different composable split” — suggest, don’t hold |

If you would not revert prod for it, it is probably not blocking. Prefix `nit:`.

**Teaching**

Ask “what happens if the API 409s?” before pasting a patch. Link to the KB/ADR. If you leave the same comment twice, **lint or a fixture**. Approve when the **risk** is addressed, even if it isn’t how you would have written it (disagree and commit).

**As leadership**

- Review **their tests** as seriously as the SFC.
- Pull in an a11y or DS reviewer when the change is in primitives.
- Protect people: move heated threads to a call.
- Your own PRs: small, described, **ask** for the review you need (“focus on the abort logic”).

**Tradeoffs**

- Required two approvals vs speed. High-risk paths (payments, flags) extra; docs not.
- Async review vs pairing on gnarly PRs (faster than 40 comments).

**Production gotchas**

- “LGTM” on generated lockfile + a webpack config change.
- Reviewing after merge because CI was trusted blindly (CI doesn’t catch product contract).

**Follow-ups**

- How do you review a DS change? (visual + a11y + semver)
- What if the author is more senior than you? (same bar; status isn’t correctness)

---

### 17.7. Incident Communication

**What they actually ask**

“Checkout is down. What do you say, to whom, when?”

**How a senior answers**

- **Decision:** Communicate on a **clock**: what we **know**, **impact** (who, what action fails), **what we’re doing**, **when the next update is** — even if the update is “still investigating.” Separate **user/PM status** from **engineering debug**. No blame on the channel.
- **Constraint:** Frontend incidents are often **partial** (one locale, one browser, one flag, one chunk 404). Premature “it’s DNS / it’s backend” wastes time; silence panics people.
- **Failure mode:** Disappearing into DevTools for 40 minutes; arguing root cause in #incidents; tweeting before legal; turning off all flags; “I think we fixed it” without a **watch period**.
- **Measure:** time to **mitigate** (flag/rollback), time to **accurate impact**, customer-facing accuracy, repeat incident rate, blameless postmortem exists.

**STAR**

- **S:** Sentry spike, checkout JS throwing after deploy (19.6).
- **A:**
  1. **Mitigate first:** revert GitOps digest or kill the flag (14.1/14.4). Don’t debug in prod while users burn if rollback is safe.
  2. **Channel:** “Checkout submit failing for ~X% since 14:02 UTC, error `QUOTE_EXPIRED` / chunk 404. Impact: cannot pay. Workaround: none. Next update 14:15. Owner: <you>.”
  3. **Facts only.** “Might be Safari” stays in the engineering thread until confirmed.
  4. After mitigate: **confirm** with RUM/Sentry/canary buy. Then RCA.
- **R:** Users unblocked in minutes; postmortem has action items (budget gate, map upload, flag default).

**Audience**

- Eng: hypotheses, graphs, PRs.
- PM/support: impact + workaround + ETA of **next communication**, not ETA of cosmic root cause.
- Users/status page: only if user-visible and your process says so; FE usually through PM.

**FE-specific tells**

- “Works for me” → ask **release, flag, locale, browser**.
- Chunk 404 → bad HTML cache (16.2).
- Only 10% → flag or canary.

**Tradeoffs**

- Rollback vs forward-fix: rollback unless the rollback is worse (data migration). Flags exist for this.
- Over-communicating (noise) vs the 30-minute radio silence.

**Production gotchas**

- Root-causing in the status message (“intern’s PR”).
- Declaring victory on the first green Sentry minute (traffic dropped).
- No owner, five people editing `main`.

**Follow-ups**

- Walk me through a postmortem you wrote. (timeline, contributing factors, **system** fixes)
- How do you page? (19.5 — not every JS error)

---

[← Back to Overview](../../README-en.md)
