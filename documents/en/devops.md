# DevOps

This is senior **frontend** interview prep. You are not the platform engineer. You still must talk fluently about **immutable artifacts, preview environments, feature flags vs env deploys, rollback, and what FE CI should gate** — because that is how your Vue/Nuxt app actually reaches users.

GitOps + ArgoCD is a common backdrop in enterprise interviews. Translate it into **what you own** (image, ingress path, env contract) and **what you don’t** (the cluster).

---

## Table of Contents

1. [GitOps + ArgoCD Pipeline](#141-gitops-argocd-pipeline)

2. [Frontend CI/CD Pipeline You'd Design](#142-frontend-cicd-pipeline-youd-design)

3. [Preview Deployments and Env Vars](#143-preview-deployments-and-env-vars)

4. [Feature Flags](#144-feature-flags)

5. [Frontend's Role in Kubernetes and GitOps](#145-frontends-role-in-kubernetes-and-gitops)

---

## 14. DevOps

### 14.1. GitOps + ArgoCD Pipeline

**What they actually ask**

- “How does your frontend get to production?”
- “We use ArgoCD. What’s your part?”
- “How do you roll back a bad Vue release?”
- “Why is `:latest` bad?”

**How a senior answers**

- **Decision:** **Build once, promote the same digest.** CI produces an **immutable** image or static artifact tagged with the **git SHA** (digest, not `latest`). GitOps repo (Helm/Kustomize) is updated to that tag. ArgoCD reconciles cluster → Git. Rollback = **revert the GitOps commit** (or point the tag back) and let Argo sync — not “ssh and kubectl edit.”
- **Constraint:** A senior FE does not operate etcd. You **must** be able to explain desired state vs live state, why Git is the audit log, and why “it works on my preview” is not the prod artifact unless the digest matches.
- **Failure mode:** CI builds a different image for staging vs prod; `:latest` + `imagePullPolicy: Always` (you don’t know what you run); Argo auto-syncing a broken main on Friday; config (API URLs, feature defaults) that **isn’t** in Git; rolling back the app Git while the GitOps repo still points at the bad tag.
- **Measure:** lead time SHA → serving, deploy frequency, **failed deploy recovery time**, drift detected by Argo, whether every prod image is **reproducible from a SHA**.

**GitOps in one paragraph (then stop sounding like a platform interview)**

Git is the source of truth for **desired** cluster state. ArgoCD watches that repo, diffs live vs desired, syncs (auto or manual). Your app repo’s CI does **not** kubectl apply. It (1) tests, (2) builds image `ghcr.io/acme/web:abc123`, (3) opens/commits a change in the GitOps repo `image: abc123`. Merge + Argo = prod. Preview envs are a **namespace or separate cluster app** from a PR SHA, not a snowflake laptop.

**Artifact immutability and tags**

- Tag with **git SHA** and also a moving pointer (`staging`, `prod`) **only** as a GitOps field that still references a digest. Prefer digest pinning (`image@sha256:...`) in prod.
- **Never `:latest`.** You cannot roll back, you cannot diff, caches lie.
- Static Nuxt/Vite: the **object storage / CDN prefix** is the artifact (`/releases/abc123/`). Same rule: don’t overwrite `current/` in place without keeping the previous prefix.
- Config: build-time `NUXT_PUBLIC_*` is **baked**. Runtime Nitro env can change without a new image — document which is which or you will “roll back the image” and keep the bad URL.

**Feature flags vs env deploys**

- **Env deploy** (deploy `feat-x` to staging cluster): good for integration, bad as the only way to test with prod-like data, slow, multiplies env cost.
- **Preview env per PR:** best for UI review (14.3).
- **Flags in prod:** best for **gradual rollout / kill switch** (14.4). Not a substitute for CI.
- Seniors use **all three** at different layers, not “we only have staging.”

**Rollback**

- Instant: **flag off** (broken checkout path).
- Fast: Argo rollback / Git revert to previous known digest (CDN still has the old assets if they were immutable).
- Slow/wrong: “hotfix forward” with no SHA, or `kubectl rollout undo` that GitOps immediately **re-applies** the bad Git. If GitOps is the truth, undo **Git**.

**What FE CI should gate (say this list)**

| Gate | Why | On PR? |
| --- | --- | --- |
| `eslint` + format | Consistency, some a11y/security lint | Yes |
| `vue-tsc --noEmit` | The cheapest production bug catcher | Yes |
| Unit / component (Vitest) | Composables, money math, flags | Yes |
| Production `vite` / `nuxt build` | Dev-only bugs, tree-shake breaks | Yes |
| **Bundle budget** | 12.3 in CI form | Yes |
| E2E **smoke** (Playwright, prod build) | Login, critical buy/search | PR: tiny; main: more |
| Lighthouse / CWV **budgets** on key URLs | Lab, not RUM | Main or nightly; PR if cheap |
| Image scan / license | Org requirement | Release |
| Source maps upload | Sentry is useless without it | Release, not public CDN |

Do **not** gate merge on 100% coverage or a full Lighthouse score of 100. Gate on **budgets and smoke**.

**Tradeoffs**

- Auto-sync (speed) vs manual sync on prod (change control). Many teams auto-sync staging, **manual/PR** for prod GitOps.
- One repo vs app repo + GitOps repo (the latter is common; FE must know which PR actually ships).
- Helm values per env vs Kustomize overlays — pick what the platform team already runs; don’t invent a third.

**Production gotchas**

- Argo healthy, users still on old JS: **CDN cache** of `index.html`. Cache HTML short, hashed assets long (`immutable`).
- SSR pods + old HTML pointing at deleted hashed files after a too-aggressive CDN purge.
- Clock skew on `latest` tags.
- Secrets in GitOps (use Sealed Secrets / External Secrets — you should know they exist, not implement them in the interview).

**Follow-ups**

- How do you blue/green a static SPA? (two prefixes + switch the ingress / CDN alias)
- What is drift? (someone kubectl-edited; Argo will fight them — good)
- Difference between liveness and readiness for a Nuxt Node process? (14.5)

---

### 14.2. Frontend CI/CD Pipeline You'd Design

**What they actually ask**

“Draw the pipeline for a Nuxt app in a monorepo.”

**How a senior answers**

- **Decision:** Two tracks. **PR:** fast feedback (lint, typecheck, unit, build, budget, optional preview). **Main:** the same plus e2e smoke, publish **one** artifact, GitOps bump / CDN deploy, maps + Sentry release, notify Slack. No “rebuild on the prod cluster.”
- **Constraint:** Minutes-to-green and **flake rate** matter as much as coverage. Playwright against `nuxt dev` is a lie.
- **Failure mode:** Sequential 20-minute job; secrets available to fork PRs; preview using prod credentials; deploy skipped tests “just this once”; frontend Docker `npm run build` inside k8s instead of CI.
- **Measure:** p50/p95 pipeline duration, cache hit %, % of prod incidents with a green pipeline (process bug), mean time SHA → prod.

Sketch:

```
PR  → install (pnpm cache)
    → parallel: lint | vue-tsc | vitest
    → nuxt build + bundle budget
    → optional: Playwright smoke on preview URL
    → optional: preview deploy (14.3)

main → same gates
     → docker build FROM dist or standalone Nitro
     → push ghcr.io/app@sha256:…
     → commit image digest to gitops/
     → upload hidden sourcemaps to Sentry release=SHA
     → Argo sync (or wait)
     → synthetic smoke on prod
```

Monorepo: build **affected** packages (Turbo/Nx). Design-system change rebuilds apps; a docs markdown change does not.

**Tradeoffs**

- Self-hosted runners (faster, cache disks) vs GitHub-hosted (cleaner).
- Deploy on merge vs nightly release train. Product Vue apps: **merge to main = prod-eligible**, flags for unfinished work — not GitFlow release branches (see 18.4).

**Production gotchas**

- `NUXT_PUBLIC_API_BASE` baked at build vs runtime — staging image promoted to prod still pointing at staging.
- OOM in `nuxt build` only on CI (less RAM than laptops).
- Using `npm publish` of a private design system without provenance.

**Follow-ups**

- How do you secret-scan? (block `VITE_` keys in the client bundle)
- Who can approve GitOps prod? (CODEOWNERS, not every FE)

---

### 14.3. Preview Deployments and Env Vars

**What they actually ask**

“How do designers/PMs see a PR?” / “How do you not leak prod data into previews?”

**How a senior answers**

- **Decision:** Every PR gets a **unique URL** (`pr-123.preview.example.com`) running **that SHA**. Env: **staging/test APIs**, fake or anonymized data, **separate** OAuth clients and cookies. Kill the preview on merge/close.
- **Constraint:** Preview origins explode CORS and cookie domains (13.4). Either proxy API same-origin on the preview, or a wildcard CORS allowlist **only** for the staging API, never prod.
- **Failure mode:** Preview with prod DB (PII, charges, destroying real orders); `VITE_*` copied from prod; long-lived preview that becomes someone’s “staging”; auth cookies set on `.example.com` leaking between preview and prod.
- **Measure:** time-to-preview, % PRs with a URL in the first CI pass, incidents caused by preview→prod config mixups.

**Env vars (Nuxt-first)**

- `runtimeConfig.public` / `NUXT_PUBLIC_*`: safe to expose, still not secrets.
- Server `runtimeConfig` / `NUXT_*`: secrets, only Nitro.
- Vite `VITE_*`: always client. Treat as public.
- Prefer **runtime** env on the Node image so the **same digest** can run in preview/staging/prod with different URLs. If you bake public API URLs at build time, you **cannot** promote the artifact.

Cookie `Domain=` and OAuth `redirect_uri` must include the preview host or use a BFF on that host.

**Tradeoffs**

- Full k8s namespace per PR (expensive, realistic) vs Vercel/Netlify/Cloudflare Pages preview (cheap, may not match GitOps).
- Shared staging DB vs per-PR ephemeral backend (best, rare). At minimum: **feature-flagged** test tenant.

**Production gotchas**

- `indexable` previews leaking into Google — `X-Robots-Tag: noindex`, basic auth or SSO in front of previews.
- CSP `connect-src` missing the staging API.
- Mixed content (`https` preview calling `http` API).

**Follow-ups**

- How do e2e tests target a preview? (Playwright `baseURL` from CI)
- Can you preview SSR + WS? (need a real Node host, not only static)

---

### 14.4. Feature Flags

**What they actually ask**

“Ship dark? Kill switch? Why not just deploy?”

**How a senior answers**

- **Decision:** Flags are for **runtime control** of risk: kill switch, percentage rollout, entitlement, experiment. They are **not** a substitute for version control or a permanent if/else graveyard. Default in a Vue app: evaluate flags **in the BFF** for anything security/pricing related; client flags only for UX chrome.
- **Constraint:** The flag service will go down. You need **fail-closed** (payments) vs **fail-open** (new sidebar). Cache with TTL. Don’t block first paint on LaunchDarkly if the marketing page doesn’t need it.
- **Failure mode:** Flag left on 1% forever; targeting “internal users” that still hits prod data; client-side flag that hides a button but not the API; flag in `localStorage` that disagrees across tabs; changing a flag and blaming “GitOps didn’t deploy.”
- **Measure:** time to disable a bad feature (should be minutes), % of flags older than N days, error rate **sliced by flag** (19.6), exposure vs conversion for experiments.

Types:

| Kind | Example | Where evaluated |
| --- | --- | --- |
| Kill switch | Disable new checkout | BFF + FE, fail-safe |
| Gradual | 10% of sessions | Consistent hash on user id, not `Math.random()` per request |
| Entitlement | Plan has “exports” | Server; FE only reflects |
| Experiment | Copy/layout | Client OK; watch CLS/CWV |

Cleanup is part of the story: ticket to remove the flag when it hits 100% / is abandoned. ADR if the flag changes architecture.

**Tradeoffs**

- LaunchDarkly/Unleash vs homemade `config.json`. Homemade is fine for 5 kill switches; you will regret it for experiments.
- Env-based deploy (`STAGING_FEATURE=1`) vs flags. Envs cannot slice 10% of prod users.

**Production gotchas**

- SSR: flag at request time vs hydrate mismatch (user in 10% on server, 0% on client). **Pin the bucketing key** in the payload.
- SEO: don’t flag-gate content Google must see, or you A/B your rankings.
- Caching HTML that baked flag A for all users.

**Follow-ups**

- How do you test both sides in CI? (both values in unit tests; e2e on default path + one flagged path)
- Flag vs branch vs skip the feature? (18.5 / 17.5)

---

### 14.5. Frontend's Role in Kubernetes and GitOps

**What they actually ask**

“Do you write Helm charts?” They are testing whether you **overclaim**.

**How a senior answers**

- **Decision:** You **own the image and the ingress path**. Dockerfile (or static bucket + CloudFront), ports, **health endpoints**, resource requests for **SSR**, which path the app lives on (`/`, `/app`), headers you need (CSP, cache). You **do not** own the cluster, CNI, cert-manager, node autoscaler, or mesh — you collaborate, you don’t design them in a FE round unless you actually did.
- **Constraint:** SPA vs SSR changes the k8s shape. Static Vite: nginx/unprivileged distroless serving hashed files, almost no CPU. Nuxt SSR: **Node process**, HPA, readiness, memory leaks, sticky sessions if you were foolish enough to keep server memory sessions.
- **Failure mode:** `latest`; no readiness probe so pods take traffic before Nitro listens; liveness hitting a heavy page and killing healthy pods; FE “fixing” an outage by restarting unrelated jobs; claiming you “do Kubernetes” because you edited a values.yaml image tag.
- **Measure:** pod restart count, RSS of Nitro, p95 TTFB from inside the cluster, 5xx from ingress vs app.

**What you should be able to talk about**

- **Image:** multi-stage build, non-root, dist only, no `npm` in the final SPA image. SSR: `node .output/server/index.mjs`, `HOST=0.0.0.0`.
- **Probes:** liveness = process alive (`/healthz` cheap). Readiness = ready for traffic (Nitro up, maybe not “can reach downstream”). Startup probe for slow boots. Don’t run a full SSR of `/` as liveness.
- **Ingress:** TLS at the edge, `index.html` / HTML **short cache**, `/_nuxt/*` hashed **long cache**. Trailing slash, SPA fallback **only** for client routes, not for `/api`.
- **GitOps:** your PR to the app repo is not live until the GitOps tag moves. You read Argo’s diff when “deploy didn’t.”
- **Headers:** CSP, HSTS, `Referrer-Policy` — often set here or at the CDN. You own the **content** of CSP because you know the FE origins.

**Tradeoffs**

- Static on object storage (cheap, simple rollback of prefixes) vs SSR in k8s (SEO, auth, BFF). Hybrid Nuxt: static marketing at CDN, SSR for app — two ingresses, still one repo.
- Sidecar nginx vs Node serving static — SPA usually nginx; don’t run Express to `sendFile` without a reason.

**Production gotchas**

- Websocket/SSE timeouts at ingress (13.1).
- Horizontal scaling SSR without shared cache → thundering herd to the API (need Redis/Nitro cache).
- Resource `limits` too low → throttled INP, looks like a “frontend performance” bug.

**Follow-ups**

- How would you run a canary 10%? (Argo rollout / flag / weighted ingress — pick one and name the failure mode)
- What do you log from a pod vs the browser? (19.4)

---

[← Back to Overview](../../README-en.md)
