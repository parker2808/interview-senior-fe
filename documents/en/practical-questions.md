# Practical Interview Questions

These are the “how do you actually work?” questions. Juniors describe tools and paste an axios interceptor that `localStorage.removeItem('token')` and `router.push('/login')`. Seniors talk **delivery, risk, git as a team contract, and auth as a distributed system in the browser**.

Vue 3 / Nuxt-first. Same 401 mechanics apply to React/Next.

---

## Table of Contents

1. [Handling 401 Error → Redirect to Login](#181-handling-401-error-redirect-to-login)

2. [Project Management Tools & Workflows](#182-project-management-tools-workflows)

3. [Evaluating Issues: Bug vs Feature Request?](#183-evaluating-issues-bug-vs-feature-request)

4. [Git Workflow](#184-git-workflow)

5. [Resolving Git Conflicts](#185-resolving-git-conflicts)

6. [Squashing Commits](#186-squashing-commits)

7. [How You Handle a Production Incident as Frontend](#187-how-you-handle-a-production-incident-as-frontend)

8. [How You Onboard onto an Unknown Vue Codebase in Week 1](#188-how-you-onboard-onto-an-unknown-vue-codebase-in-week-1)

---

## 18. Practical Interview Questions

### 18.1. Handling 401 Error → Redirect to Login

**What they actually ask**

“API returns 401 — what does the client do?” The junior answer is in every blog. They are waiting for **refresh, queues, loops, return URL, multi-tab**.

**How a senior answers**

- **Decision:** Treat 401 as **“access token failed,” not “log the user out”** unless refresh also fails. **Single-flight refresh**, **replay the original requests**, **never intercept the login/refresh calls**, **preserve return URL**, **broadcast logout/login across tabs**. Redirect to login is the **last** step, and not onto a loop.
- **Constraint:** Browsers have many tabs. Access tokens are short-lived. Refresh cookies are HttpOnly (good). Login POST also 401s on bad passwords — that is **not** a session expiry.
- **Failure mode:** interceptor clears storage and redirects on every 401 → refresh endpoint 401s → infinite redirect; 20 tabs stampede refresh; lost return URL (deep link to `/orders/88`); user A’s cache shown to user B after login; bouncing `/login` → `/` → `/login`.
- **Measure:** refresh success rate, duplicate refresh count, time spent in “kicked to login” incorrectly, auth-related Sentry issues, “stuck” session tickets.

**The junior interceptor (and why it fails)**

Clear token + `router.push('/login')` on any 401:

- Kills sessions that a **refresh** would have saved.
- Races: 8 parallel `useAsyncData` calls → 8 redirects.
- Hits the **login API** (wrong password is 401) and boots you off the form.
- Doesn’t restore `fullPath` after IdP.
- Ignores other tabs still holding a now-invalid refresh.

**Senior mechanics**

1. **Classify the request.** Skip interceptor for `/api/auth/login`, `/logout`, `/refresh`. Those handle their own errors.
2. **Single-flight refresh.** First 401 on a protected call starts **one** `refreshPromise`. Everyone else **awaits the same promise**.
3. **Queue / replay.** Failed calls retry **once** after refresh succeeds, with the new cookie/token. If refresh fails: **logout path**.
4. **Logout path:** clear **client** caches (Pinia, TanStack Query — **keyed by user**), broadcast to tabs, redirect to login **with return URL** if the current route is not already public.
5. **Return URL:** `?redirect=` only for **internal relative paths**. Open-redirect is a real bug (`?redirect=https://evil`).
6. **Multi-tab:** `BroadcastChannel('auth')` (or `storage` events). Logout in tab A logs out tab B. Refresh in tab A should not need tab B to also refresh-stampede — cookie is shared; still single-flight **per tab** + optional “token rotated” message.
7. **SSR (Nuxt):** 401 on server during `useAsyncData` is not `window.location`. Navigate with `navigateTo`, avoid redirect loops on the login **page** itself, don’t leak the refresh cookie to the client bundle.

```ts
// Decision: one refresh, replay callers, never intercept auth routes, no open redirect.
let refresh: Promise<boolean> | null = null;
const authChannel = new BroadcastChannel("auth");

function isAuthRoute(url: string) {
  return /\/api\/auth\/(login|logout|refresh)/.test(url);
}

function safeInternalPath(p: string) {
  return p.startsWith("/") && !p.startsWith("//") ? p : "/app";
}

export async function on401(ctx: {
  url: string;
  path: string; // pass router.currentRoute; do not call useRoute() outside setup
  retry: () => Promise<unknown>;
}) {
  if (isAuthRoute(ctx.url)) throw Object.assign(new Error("auth-route-401"), { fatal: false });

  if (!refresh) {
    refresh = $fetch("/api/auth/refresh", { method: "POST" })
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refresh = null;
      });
  }

  const ok = await refresh;
  if (ok) return ctx.retry();

  queryClient.clear();
  authChannel.postMessage({ type: "logout" });
  await navigateTo({
    path: "/login",
    query: { redirect: safeInternalPath(ctx.path) },
  });
}
```

After login: `navigateTo(safeInternalPath(redirect) ?? "/app")`, then **invalidate** queries (don’t reuse the anonymous cache).

**Tradeoffs**

- Cookie session (BFF) vs Bearer in memory. Cookie + same-origin BFF is simpler for browsers (13.4).
- Redirect vs inline “session expired” modal on long forms (save draft first).

**Production gotchas**

- Clock skew: token “expired” on the client but not the server, or the reverse.
- 401 vs 403: 403 is **permission** — don’t logout (that’s how you get loops on one forbidden widget).
- Service worker caching GET `/api/me` 200 forever.
- Mobile Safari ITP dropping the refresh cookie.

**Follow-ups**

- How do you test this? (fake sequential 401 then 200; two parallel callers; login 401)
- CSRF on refresh POST? (same-site cookie + custom header)

---

### 18.2. Project Management Tools & Workflows

**What they actually ask**

“Jira or Linear?” They **do not care which tool**. They care **how you run delivery**.

**How a senior answers**

- **Decision:** The tool is a **database**. Your job is **slice work**, **make status honest**, **surface risk early**, and **keep the increment user-visible**. You’ll use whatever they have.
- **Constraint:** FE work hides in “90% done, waiting on API / design / QA.” If the board doesn’t show that, you are lying to the forecast (17.3).
- **Failure mode:** Ceremonies without decisions; 40-point stories; “updated the ticket” instead of updating the **risk**; WIP unlimited; PM tools worship.
- **Measure:** cycle time, WIP, how often a blocker is >1 day old without a name on it, % of sprint goals that were **user-visible**.

**How you run delivery (say this)**

- **Slice vertically:** one user path with loading/error/empty, not “all components then all APIs.” Flags for unfinished (14.4).
- **Definition of done** includes a11y keyboard on the control, analytics, and the empty state — not “UI looks like Figma.”
- **Standup:** blockers and **changed dates**, not a diary. If you don’t need standup, you still need a blocker channel.
- **Risk:** write it on the ticket (“VAT API contract TBD — explodes estimate”). Bring it to planning, not to Friday.
- **Discovery vs delivery** tickets so spikes don’t pretend to be features.

Map tools only as a footnote: Jira/Linear/GitHub Issues, Figma, Slack, Notion. Switching tools never fixed a WIP problem.

**Tradeoffs**

- Scrum vs Kanban: product FE teams often do **Kanban with a weekly planning overlay**. Don’t die on religion.
- Strict sprints vs interrupt-driven production support — staff the interrupt or it will eat the sprint anyway.

**Production gotchas**

- Green tickets, red users (no RUM in the “done” conversation — 19.3).
- Design in Figma still changing after “dev done.”

**Follow-ups**

- How do you work with a PM who writes solutions not problems? (17.5)
- How do you handle unplanned prod bugs vs the sprint? (18.3, 18.7)

---

### 18.3. Evaluating Issues: Bug vs Feature Request?

**What they actually ask**

“Is this a bug or a feature?” They are testing whether you **bikeshed the label** or talk **contract, severity, and user impact**.

**How a senior answers**

- **Decision:** Compare behavior to the **product contract** (spec, ADR, existing UI copy, API docs, legal). If users reasonably expected it and we broke it — **defect**. If we never promised it — **change**. Then **severity** decides hotfix vs next sprint. The Jira issue type is bookkeeping.
- **Constraint:** Support will file everything as a bug. Sales will file everything as a hotfix. Your job is **impact**: blast radius, workaround, data integrity, brand/legal.
- **Failure mode:** Debating labels while checkout is broken; calling a missing v1 requirement a “feature” to avoid a hotfix; shipping a “bugfix” that is actually a schema change without PM.
- **Measure:** escaped defects, hotfix rate, time-to-mitigate Sev-1, arguments spent on labels (should be ~zero).

| | Defect | Change |
| --- | --- | --- |
| Contract | We said X / it used to X | New X |
| Typical path | Hotfix or this sprint by severity | Prioritize on the roadmap |
| Risk | Regression; add a test | Scope, design, flags |

**Severity (user impact, not feelings)**

- **Sev-1:** payments, auth lockout, data loss/leak, total white screen on `/` — **mitigate now** (flag/rollback), PR with tests, incident comms (17.7).
- **Sev-2:** major path broken, workaround painful — same day / next deploy.
- **Sev-3:** annoying, workaround exists — scheduled.
- **Cosmetic:** backlog. Don’t derail a release train.

Gray cases: “We never built export but the button is visible” is a **defect in the UI contract**. “Please add export” is a change. **Accessibility** that fails WCAG on a shipped control is a defect, not a nice-to-have.

**Tradeoffs**

- Fix forward vs revert: revert if the blast radius is the release; fix forward if the revert is worse.
- “Won’t fix” needs a recorded reason (browser not supported, etc.).

**Production gotchas**

- Silent “bug” that is a pricing rule change — that’s product + legal.
- Using “it’s a feature” to skip RCA.

**Follow-ups**

- Who decides severity? (on-call + PM; FE provides blast radius from RUM)
- What if PM wants it as a feature to protect a SLA dashboard? (don’t fake metrics)

---

### 18.4. Git Workflow

**What they actually ask**

“Gitflow or trunk-based?” Many decks still draw Gitflow. Product Vue teams usually **shouldn’t**.

**How a senior answers**

- **Decision:** **Trunk-based** (short-lived branches off `main`, PR, CI gates, flags for unfinished work) for a product FE team shipping daily. **Gitflow** (`develop` + `release/*` + `hotfix/*`) when you maintain **multiple shipped versions** (mobile wrappers, on-prem, regulated release trains). Don’t run Gitflow because a blog said “most common.”
- **Constraint:** `main` is **always releasable**. That only works with CI gates (14.2) and flags (14.4). Protected `main`: reviews, green CI, no force-push.
- **Failure mode:** week-long `feature/user-profile` branches; `develop` rotting vs `main`; committing straight to `main` without CI; conventional commits as theater while `main` is not bisectable.
- **Measure:** branch lifetime, time SHA → prod, revert rate, broken-main minutes.

**Short-lived branches**

Hours to a couple of days. Integrate behind a flag if the product slice is bigger. Rebase/merge latest `main` often (18.5).

**Conventional commits**

`feat:`, `fix:`, `perf:`, `revert:` — useful for changelog and **grep**. Not a substitute for a good PR description. Don’t bikeshed `chore` vs `ci` in review (17.6).

**Protected main**

Required checks: typecheck, unit, build, budget. CODEOWNERS on `/packages/ui` and auth. No admin force-push except documented disaster recovery.

**Tradeoffs**

- PR per change vs stacked PRs for large work.
- Release branches for a hotfix on last week’s tag while `main` moved — rare, explicit.

**Production gotchas**

- `main` green but CDN still serving old HTML (16.2) — git is fine, delivery isn’t.
- Using Gitflow *and* flags *and* preview envs — three ways to hide unfinished work, none of them owned.

**Follow-ups**

- How do you ship a hotfix? (branch from the **prod tag**, or revert+forward on trunk if you deploy from main)
- Monorepo: one `main` still.

---

### 18.5. Resolving Git Conflicts

**What they actually ask**

“Rebase or merge?” and “a conflict you couldn’t just pick one side.”

**How a senior answers**

- **Decision:** **Rebase** (or merge from `main`) on **your short-lived branch** to keep history linear if the team likes that. **Merge commits** onto `main` if that’s the house style — both are fine. **Never rewrite shared history** (`push --force` to `main` or a branch others are on). After a conflict, run **tests** because **semantic conflicts** don’t show `<<<<<<`.
- **Constraint:** Git resolves text, not behavior. Two PRs both adding a Pinia field or a route name can “merge clean” and crash runtime.
- **Failure mode:** force-pushing a rebased branch a reviewer already checked out without warning; resolving by blindly accepting incoming; skipping tests; rebasing a public feature branch ten people use.
- **Measure:** conflict rate (too high → branches too long), regressions after “resolved conflicts” merges.

**Rebase vs merge**

| | Rebase your branch | Merge `main` into your branch |
| --- | --- | --- |
| History | Linear | Extra merge commit |
| Risk | Rewrites *your* commits — OK if **you’re the only pusher**, or use `--force-with-lease` | Safer for shared branches |
| `main` | Usually squash-merge or merge PR (18.6) | Same |

Don’t rebase commits that are **already on `main`**.

**Semantic conflicts tests catch**

- Both sides add `useUser` auto-import.
- Route `/orders` registered twice.
- i18n key overwritten with different copy.
- CSS both change the same token; visual snapshot fails.

Say you’d **run the feature, not just the compiler**.

**Tradeoffs**

- `rerere` for a long-lived monster branch vs **not having** that branch.
- Pairing on a gnarly conflict vs 40 minutes of guesswork.

**Production gotchas**

- Resolving `package-lock` / `pnpm-lock.yaml` by hand incorrectly.
- Keeping both Vue imports and shipping two copies (12.1).

**Follow-ups**

- What is `--force-with-lease`?
- Binary conflicts (images, Figma)? (pick one, don’t merge)

---

### 18.6. Squashing Commits

**What they actually ask**

“Do you squash?” There is a right **scope**.

**How a senior answers**

- **Decision:** **Squash at PR merge** (GitHub “Squash and merge”) for noisy feature branches (`wip`, “fix typo”) so **`main` is bisectable** with one commit ≈ one reviewable change. **Don’t squash public history** already on `main`. Don’t squash a PR that was intentionally **multiple logical commits** if the team uses that for revert granularity — but then those commits must each be green.
- **Constraint:** `git bisect` and `git revert` are production tools. A 400-commit “WIP” merge is hostile. A single squash of a week of unrelated work is also hostile.
- **Failure mode:** interactive rebase of `main`; squashing away a revert; rewriting commits that already have review comments **and** force-pushing without `--force-with-lease`; local `reset --soft` on a shared branch.
- **Measure:** can you bisect a prod bug to a PR? Can you revert checkout without reverting the DS token change from the same squash? If not, split PRs.

**PR squash vs rebase**

- **Squash merge:** default for product teams. PR title becomes the `main` commit. Link the PR number.
- **Rebase merge:** keeps (cleaned) commits. Only if the author curated them.
- **Merge commit:** preserves topology; noisy but traces the branch.

**Never squash public history**

Once on `main`, fix with a **new commit** or `git revert`. History is an audit log (GitOps loves this — 14.1).

**Tradeoffs**

- One-commit-per-PR vs “fixup” commits during review (`git commit --fixup` + rebase at the end, still private).
- Huge squash hiding mixed refactors — **don’t**; split the PR.

**Production gotchas**

- Squash losing `Co-authored-by` / review trail (GitHub usually keeps the PR).
- Generated changelog from conventional commits wrong because every squash is `feat:`.

**Follow-ups**

- How do you revert a squash merge that contained 3 features? (you can’t cleanly — that’s why slices matter)
- Signed commits / DCO? (org policy)

---

### 18.7. How You Handle a Production Incident as Frontend

**What they actually ask**

“Users can’t log in. You’re on call. Go.”

**How a senior answers**

- **Decision:** **Mitigate first**, debug second. For FE that means **rollback the digest, kill the flag, or purge bad HTML** — not a 40-minute hunt through minified Vue. Parallel: **impact**, **comms** (17.7), **preserve evidence** (release, flag % , sample Sentry event).
- **Constraint:** You often cannot SSH a CDN. Your levers are flags, GitOps revert, CSP, feature freeze, status page via PM.
- **Failure mode:** Shipping a speculative fix to `main` during the fire; blaming backend without HAR; “works in staging” (different SHA); restarting SSR pods for a **cached `index.html` problem**.
- **Measure:** time to mitigate, % of users recovered (RUM), whether a **test/budget/alert** followed.

**Playbook you should recite**

1. **Is it real?** Sentry + RUM + one repro. Check **release**, **environment**, **flag**, **locale**, **browser**.
2. **Blast radius.** 100% after deploy → rollback. 10% → flag. One region → CDN/origin. Login-only → auth (18.1), not charts.
3. **Mitigate.** Argo/Git revert to last good digest (14.1). Flag off (14.4). Purge HTML if chunk 404 (16.2). Disable SW if it’s a stuck cache.
4. **Communicate.** Known / impact / next update time.
5. **Verify.** Canary purchase/login, Sentry returning to baseline (watch traffic).
6. **RCA later.** Maps, timeline, **system** fix (CI budget, map upload, probe).

**Tradeoffs**

- Rollback (fast, may drop unrelated good commits in the same digest) vs revert a single PR vs flag.
- Partial degrade (read-only mode) vs full downtime.

**Production gotchas**

- Source maps missing → you guess (19.1).
- Incident is an **API 500** with a FE toast; still your comms if you own the UI, but the **fix owner** may be backend — don’t hold the rollback if the JS is fine.

**Follow-ups**

- What do you page vs ticket? (19.5)
- How do you practice? (game day: kill the flag service, break the chunk hash)

---

### 18.8. How You Onboard onto an Unknown Vue Codebase in Week 1

**What they actually ask**

“You join a Nuxt monolith on Monday. What do you do?”

**How a senior answers**

- **Decision:** Optimize for **a mental map and one production-shaped contribution**, not for reading every SFC. Day 1–2: **run it, trace one user path, find the seams** (auth, BFF, flags, errors). Mid-week: a **small real ticket** with tests. End of week: you can explain **how a request becomes UI** and **how it ships**.
- **Constraint:** Nobody has a current architecture doc. Auto-imports hide dependencies. You will be asked to estimate on Friday (17.3) — your week-1 output is a **risk list**, not fake certainty.
- **Failure mode:** Silent for a week “reading”; rewriting the folder structure; drive-by lint of 200 files; merging a refactor of Pinia because you miss Vuex; not setting up the **prod-like** env (flags, SSR).
- **Measure:** you shipped something behind a flag or a bugfix with a test; you can draw the boxes (16.1) for this app; you know who owns DS vs checkout.

**Week 1 itinerary (say it as a plan)**

| When | Do |
| --- | --- |
| Day 1 | Clone, **prod-mode build**, tests. Who is on-call, where is Sentry, what’s the deploy (Argo/Vercel). Read README/ADRs **skimming** for auth and rendering. |
| Day 2 | Trace **login + one core path** in DevTools (network, Vue devtools, Pinia). Note interceptors (18.1), `runtimeConfig`, route rules. |
| Day 3 | Map **features vs `shared`** (15.5). Find the DS package. Run the analyzer once so 3MB main isn’t a surprise (12.3). |
| Day 4–5 | **Small ticket** on that path: copy, bug, test on a composable. Practice the PR process. Write down “things that can hurt me” (no maps, no flags, global bus). |
| 1:1s | Ask where the bodies are buried: hydration, MF, the flaky e2e. |

Don’t: mass-reformat; introduce a new state library; “improve” the build on day 2.

**Tradeoffs**

- Pairing every day vs exploring alone — mix; pairing on **deploy and auth** is high leverage.
- Staging access delayed — use preview envs and Storybook, but **insist** on seeing prod RUM by week 2.

**Production gotchas**

- Dev against mocks that hide the BFF.
- Assuming Nuxt 3 patterns in a Nuxt 2 + Vuex app.

**Follow-ups**

- First 30/60/90? (own a feature, on-call, an ADR)
- How do you review code before you know the domain? (18.1-style invariants, a11y, tests — ask domain questions)

---

[← Back to Overview](../../README-en.md)
