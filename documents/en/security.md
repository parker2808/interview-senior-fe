# Security

Seniors talk **threat model** and **defense in depth**, not a list of `escapeHTML` helpers. Frontend security is: what an attacker who can run JS in the origin can do, what a malicious other-site can do with the user’s cookies, what you accidentally shipped in the client bundle, and what you trusted from npm.

Vue 3 escapes by default; that is not a security program. Interviews that stay on “we use HTTPS” without XSS × token storage × CSRF × supply chain are junior.

---

## Table of Contents

1. [XSS Prevention](#101-xss-prevention)

2. [CSRF Protection](#102-csrf-protection)

3. [Authentication Best Practices](#103-authentication-best-practices)

4. [Input Validation & Sanitization](#104-input-validation--sanitization)

5. [HTTPS & CORS](#105-https--cors)

6. [Supply Chain Security](#106-supply-chain-security)

7. [Secrets in Vite and Nuxt](#107-secrets-in-vite-and-nuxt)

---

## 10. Security

### 10.1. XSS Prevention

**What they actually ask**

- Types of XSS; is Vue safe; when is `v-html` OK; CSP; `javascript:` URLs.
- They want you to connect XSS to **token theft** (10.3), not stop at `alert(1)`.

**How a senior answers**

- **Decision:** Treat XSS as **the** browser threat. Vue **text interpolation and most bindings escape**. The holes are **`v-html`**, markdown → HTML, `innerHTML` in widgets you wrote, `href`/`src` with user URLs, `style` injection, and `eval`. Sanitize with a real HTML policy (DOMPurify) **at the boundary**, not with regex. CSP is **mitigation and containment**, not a silver bullet — especially with `'unsafe-inline'` and widget CDNs.
- **Constraint:** Product wants rich text, previews, and embed codes. You cannot “ban HTML” in a CMS. You can ban `v-html` of **unsanitized** strings in review (9.1.3).
- **Failure mode:** “Vue is safe so we store JWTs in `localStorage`.” One CMS field with `v-html` later, session is gone. DOM XSS in a purpose-built datepicker/`innerHTML` highlight. Markdown libraries that allow raw HTML. CSP as a `<meta>` tag after a script (too late) or with `unsafe-inline` that neuters it.
- **Measure:** Authed-user XSS bounty on rich text. CSP report-uri noise trending down. No `v-html` without a sanitizer in CI (ESLint `vue/no-v-html` + allowlist).

**Vue 3 defaults**

```vue
<template>
  <!-- Escaped: attacker strings stay text -->
  <p>{{ comment.body }}</p>
  <a :title="comment.author">{{ comment.author }}</a>

  <!-- Not escaped: you own the XSS now -->
  <article v-html="sanitizedHtml" />

  <!-- URL sinks: Vue does not make javascript: safe -->
  <a :href="safeHref(comment.website)">Website</a>
</template>
```

```ts
import DOMPurify from "dompurify";

const HTML_POLICY = { USE_PROFILES: { html: true } }; // no SVG/MathML unless you meant to

export function sanitizeCmsHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, HTML_POLICY);
}

export function safeHref(url: string): string {
  const parsed = new URL(url, window.location.origin);
  if (!["http:", "https:", "mailto:"].includes(parsed.protocol)) return "#";
  return parsed.href;
}
```

**DOM XSS in widgets**

Purpose-built editors, syntax highlighters, and “copy this snippet” UIs often assign `innerHTML` on purpose. Vue’s compiler will not save you inside `onMounted(() => el.innerHTML = props.code)`. Prefer `textContent`, `document.createElement`, or sanitize. React `dangerouslySetInnerHTML` is the same sink.

**CSP as defense in depth**

- `default-src 'self'`; scripts via nonce or hash; no `'unsafe-eval'`.
- Mitigates **some** XSS (inline handlers, unexpected origins). Does not fix `javascript:` navigations by itself, nor sanitizer bypasses, nor `v-html` of `<img onerror>` if you allowed it.
- Report-Only first. Meta CSP is weaker than headers (no frame-ancestors, easy to ship late).

**Types (say them accurately)**

- **Stored:** payload in DB (comment, name). Hits every viewer.
- **Reflected:** payload in URL/request, bounced into HTML. SSR search pages still do this.
- **DOM-based:** client reads `location` / `postMessage` / `dataset` into a sink. Vue apps live here.

**Tradeoffs**

- Markdown + sanitizer vs a locked subset editor (TipTap schema). Schema > sanitizer-after-the-fact.
- Strict CSP vs third-party scripts (analytics, payments). Payments get a narrow allowlist, not `*`.

**Production gotchas**

- `target="_blank"` without `rel="noopener"` is a tab-nabbing story; still mention it, it is not XSS.
- `v-html` + i18n interpolating user names into HTML translations.
- Server-rendered Nuxt: XSS in `useHead` / raw `<script>` JSON. Serialize with `json` helpers, not string concat.
- `innerHTML` of JSON-LD: still parse/serialize, do not paste user text.

**Follow-ups**

- Can CSP replace sanitization? (No.)
- Mutation XSS after DOMPurify if you mangle HTML afterwards — sanitize last.
- React/Next: same model; `next/link` href still needs protocol checks for user URLs.

---

### 10.2. CSRF Protection

**What they actually ask**

- What CSRF is; tokens vs SameSite; does an SPA need CSRF if it uses Bearer headers?

**How a senior answers**

- **Decision:** CSRF matters when the **browser automatically attaches credentials** (cookies) to a state-changing request the attacker can trigger. **Bearer tokens in `Authorization` from memory are not auto-attached**, so classic CSRF is usually a non-issue. Cookie-authenticated SPAs: **SameSite=Lax + HTTPS + POST for mutations** is often enough. Add **custom header** (`X-Requested-With` / CSRF token) when you have older browsers, `SameSite=None` (embedded), or GET-with-side-effects you cannot kill yet. Double-submit cookie is the pragmatic SPA pattern when the server wants a token without server-side session storage.
- **Constraint:** You do not control every WebView or the next product embed. Lax does not send cookies on cross-site **subresource POST** from other origins, but **top-level GET** still sends Lax cookies (the old “logout CSRF via `<img>`” / “change state on GET” class).
- **Failure mode:** Cookie session + CORS `Access-Control-Allow-Origin: *` + `credentials`. JSON APIs that accept `text/plain` to skip preflight. Assuming “we are an SPA so CSRF vanished.” Synchronizer tokens copied from a 2012 form app onto a Bearer API.
- **Measure:** Can a malicious page cause a **state change** with the user’s cookie and no extra header? If yes, you still have CSRF. Test with a cross-origin form POST in a fixture.

**When CSRF still matters**

- Session in cookies (including httpOnly refresh that **also** performs POST `/logout` or `/transfer` as a cookie-only call).
- Mutations on GET (unsubscribe, approve).
- `SameSite=None` for an embedded admin.
- Cookie auth to a subdomain API (`api.example.com`) from a site the attacker can operate in a related-site world — know your eTLD+1.

**When it usually does not**

- Access token in memory, sent as `Authorization: Bearer`, no cookie for that API.
- Strict SameSite session cookies and no cross-site embeds.

```ts
// Cookie-auth API: custom header is a CSRF control (not a secret)
await api.post("/orders", body, {
  headers: { "X-Requested-With": "XMLHttpRequest" },
  withCredentials: true,
});
```

Servers that require a non-simple header force a **preflight**; a cross-origin HTML form cannot set it.

**Double-submit**

Server sets a readable `XSRF-TOKEN` cookie (not httpOnly) **and** requires it echoed in a header. Attacker sites cannot read it (same-origin). Axios/ky can copy it. XSS can still read it — CSRF tokens do not survive XSS; that is a different threat.

**SameSite**

- `Strict`: strongest, breaks some inbound GET flows (user clicks a link from email into an authed app — cookie withheld on that first navigation).
- `Lax`: usual SPA default for session cookies.
- `None; Secure`: third-party / embeds only.

**Tradeoffs**

- Cookie UX (no refresh flash) vs CSRF program.
- Bearer in memory vs CSRF-free but XSS-sensitive if you ever put it in Web Storage.

**Production gotchas**

- Same-site vs same-origin: `www` vs `app` vs `api` on one eTLD+1 are **same-site** for SameSite cookies. CSRF via sibling subdomain is a real design question.
- Fetch `credentials: 'include'` without a tight CORS origin allowlist.
- Logout as GET.

**Follow-ups**

- Login CSRF (attacker logs you into their account) — separate, usually anti-automation + `SameSite` + noticing account switch.
- Mobile/native apps: CSRF is a browser concept; they still need authz.

---

### 10.3. Authentication Best Practices

**What they actually ask**

- Where is the access token? Refresh rotation? 401 storms? Logout across tabs?

**How a senior answers**

- **Decision:** **Access token in memory** (or a short httpOnly cookie). **Refresh token in httpOnly + Secure + SameSite cookie**, rotated on use. Axios/fetch **401 interceptor with single-flight refresh** so a burst of 401s does not stampede `/refresh`. **Logout all tabs** via `BroadcastChannel` (or `storage` event if you must). Treat **XSS as game over for any non-httpOnly secret**.
- **Constraint:** Hard refresh drops memory tokens — you need a refresh call on boot (silent). Cookie refresh needs CSRF posture (10.2). Reverse proxies must not log `Authorization`.
- **Failure mode:** `localStorage.setItem('token')`. Parallel 401s all hitting refresh, rotating the refresh token, **all but one fail**, user kicked out. Refresh not rotated → stolen refresh lives forever. Logout only clears this tab’s memory. Putting the access token in Pinia persisted state (that writes `localStorage`).
- **Measure:** Session fixation tests, refresh reuse detection (server), time-to-revoke on logout, XSS tabletop: “what can the attacker steal?”

```ts
let refreshInFlight: Promise<string> | null = null;

async function refreshAccess(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = api
      .post("/auth/refresh")
      .then((r) => {
        tokenMemory.set(r.accessToken);
        return r.accessToken;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

api.interceptors.response.use(undefined, async (error) => {
  const original = error.config;
  if (error.response?.status !== 401 || original._retried) throw error;
  original._retried = true;
  const token = await refreshAccess();
  original.headers.Authorization = `Bearer ${token}`;
  return api.request(original);
});
```

```ts
const authCh = new BroadcastChannel("auth");

export function logoutAllTabs() {
  tokenMemory.set(null);
  authCh.postMessage({ type: "logout" });
  void api.post("/auth/logout"); // invalidate refresh server-side
}

authCh.onmessage = (e) => {
  if (e.data?.type === "logout") tokenMemory.set(null);
};
```

**Rotation**

Server issues a new refresh, invalidates the old. Reuse of an old refresh = theft → revoke the family. Frontend: single-flight is what makes rotation survivable.

**OAuth / OIDC**

Authorization Code + PKCE for SPAs. Do not implement implicit flow. Next.js: httpOnly session cookies via Auth.js / similar BFF. Vue SPA talking to a BFF is the same idea.

**Tradeoffs**

| Pattern | XSS | CSRF | UX |
| --- | --- | --- | --- |
| Memory access + httpOnly refresh | Access hard to steal | Refresh cookie needs SameSite/header | Refresh on reload |
| httpOnly session cookie only | Best against XSS | CSRF on mutations | Simplest |
| Token in `localStorage` | Worst | CSRF usually N/A | Simplest and **not the senior answer** |

**Production gotchas**

- Pinia `persist: true` on the user store. You just invented `localStorage` tokens.
- 401 on `/refresh` must **not** recurse the interceptor.
- Clock skew on JWT `exp` — refresh a minute early; do not trust the client as authz.
- “Silent refresh” in a hidden iframe is third-party-cookie dead; use first-party BFF.

**Follow-ups**

- Step-up auth for money moves (re-entry of password / WebAuthn).
- How do you expire all sessions? (Server-side session list; logout-all endpoint; bump token version.)

---

### 10.4. Input Validation & Sanitization

**What they actually ask**

- Client vs server validation; Zod; sanitization vs validation.

**How a senior answers**

- **Decision:** **Client validation is UX** (instant errors, disable Pay, constrain keyboards). **Server validation is the security boundary.** Share a **Zod (or similar) schema** on both sides when you own both (Nuxt server routes, monorepo). **Sanitizing HTML is not validation** and validation is not sanitization: a “valid” markdown string can still be XSS; a sanitized string can still be an invalid email.
- **Constraint:** Attackers do not run your Vue form. Native apps, Postman, and old clients hit the API. SSR still needs the same parser.
- **Failure mode:** Regex-only email on the client, API trusts `role: 'admin'` from the body. `sanitize()` that strips `<script>` then you `v-html` without DOMPurify (markdown XSS). Using Zod `.parse` on the client and skipping it in the Nitro handler because “TypeScript.”
- **Measure:** Contract tests with illegal payloads (8.6). Authz tests: user cannot set `isAdmin`. Fuzz rich-text through the sanitizer.

```ts
const createOrderSchema = z.object({
  sku: z.string().min(1).max(64),
  qty: z.number().int().positive().max(99),
});

// Client: UX
const parsed = createOrderSchema.safeParse(form);
if (!parsed.success) return parsed.error.flatten();

// Server: same schema, then authz
const body = createOrderSchema.parse(await readBody(event));
```

Never take `priceCents` from the client as truth.

**Sanitize vs validate**

| | Validation (Zod) | Sanitization (DOMPurify / schema) |
| --- | --- | --- |
| Question | Is this an order? | Is this HTML safe to render? |
| Failure | 400, show field errors | Strip/reject; do not try to “repair” into business data |
| SQL/NoSQL | Parameterized queries / ORM | Irrelevant to HTML |

Frontend does not “prevent SQL injection” — it avoids building SQL. If they ask, parameterized queries/ORM on the server; never string concat. GraphQL the same with parameterized variables.

**Tradeoffs**

- One shared schema: DRY, forces versioning. Separate schemas: drift.
- Allowlists (enum, max qty) beat blocklists.

**Production gotchas**

- `z.string().email()` is not RFC-complete and is fine; do not bikeshed.
- Parsing numbers from form `<input>` (strings) — coerce once at the edge.
- File uploads: validate **type/size on server** by magic bytes, not `file.type`.
- Log payloads: redaction for PAN/PII.

**Follow-ups**

- Prototype pollution via `JSON.parse` into `Object.assign` — freeze options, no `__proto__` merge.
- i18n of Zod errors without leaking schema internals.

---

### 10.5. HTTPS & CORS

**What they actually ask**

- CORS headers; cookies; is CORS a security layer for the API?

**How a senior answers**

- **Decision:** **HTTPS everywhere** (HSTS, Secure cookies, no mixed content). **CORS is a browser policy**, not an ACL. Postman, curl, mobile apps, and your own server ignore it. Real authz is **sessions + permission checks**. When the SPA needs cookies: `Access-Control-Allow-Credentials: true` and a **specific origin**, never `*`. Know **simple vs preflighted** requests so you do not “fix CORS” by weakening the API.
- **Constraint:** Localhost vs preview URLs vs prod — allowlists must be explicit. Reverse proxies strip or duplicate CORS headers.
- **Failure mode:** `origin: true` reflect-any-origin **with credentials**. Solving a missing header by allowing `*` and moving tokens to query strings. Believing “CORS blocked” means the API is safe from CSRF/SSRF. Cookies without `Secure` / `HttpOnly` / `Path`.
- **Measure:** Header review on the auth API. Mix content reports. Cookie flags in staging (`Secure`, `HttpOnly`, `SameSite`).

**CORS that is actually correct**

```ts
const allow = new Set(["https://app.example.com", "https://admin.example.com"]);

res.setHeader("Vary", "Origin");
if (origin && allow.has(origin)) {
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
}
```

Preflight (`OPTIONS`) must return the same allowlists. `Max-Age` caches preflight — keep it short while debugging, longer in prod.

**Cookies**

- `Secure`: HTTPS only.
- `HttpOnly`: not JS-readable (refresh/session).
- `SameSite=Lax` default for first-party SPA.
- `Path=/` unless you intentionally scope.
- `__Host-` prefix when you want the strictest cookie naming.

**HTTPS**

- HSTS `max-age` with `includeSubDomains` once you are sure.
- Redirect at the edge, not in Vue Router.
- Mixed content: one `http://` image on an HTTPS app is a report and a trust leak.

**Tradeoffs**

- Tight allowlist vs developer preview URLs (use a patterned allowlist for `*.preview.example.com`, not `*`).
- BFF same-origin (Nuxt `/api`) **eliminates CORS** for the browser — often the senior architecture.

**Production gotchas**

- Two CORS middlewares stacking `*`.
- `null` origin (sandboxed iframe, file://) — never allow `null`.
- `Authorization` header forces preflight; cookie-only simple POSTs may **not** — another CSRF reason to require a custom header.
- Next/Nuxt rewrites: browser origin is the page, not the upstream.

**Follow-ups**

- CORS vs CSP vs COOP/COEP (isolation for SharedArrayBuffer — different problem).
- Private Network Access / local network permissions — do not treat as CORS trivia.

---

### 10.6. Supply Chain Security

**What they actually ask**

- lockfiles, `npm audit`, what you would do about a compromised maintainer.

**How a senior answers**

- **Decision:** **Commit the lockfile** and install with `npm ci` / `pnpm install --frozen-lockfile` in CI. Review **new** dependencies like production code (9.1.3): size, maintainers, provenance. `npm audit` is a **signal**, not a gate you blindly fail — it is noisy, CVSS ≠ reachable, and teams disable it. Prefer **reachable** analysis, `pnpm overrides` / `npm overrides` for surgical pins, and a process for **lockfile-only PRs**.
- **Constraint:** You will not personally vet every transitive. You can vet direct deps, pin, and avoid `postinstall` scripts from random CSS packages.
- **Failure mode:** Deleting `package-lock.json` “to fix conflicts.” `^` floating on a compromised minor. Blind `npm audit --force` that upgrades Vue major on a Friday. Ignoring a 10-line utility that runs `preinstall: curl | sh`.
- **Measure:** Time to pin/override a exploited transitive. Whether CI can reproduce the tree. Provenance/attestations where the registry supports them.

**What `npm audit` cannot do**

- Tell you if the vulnerable function is **called**.
- Distinguish a dev-only markdown parser from runtime checkout.
- Replace reviewing `install` scripts and new network destinations.

**Practical controls**

- Frozen lockfile; no `latest` in Dockerfiles.
- Dependabot/Renovate **grouped** and **auto-merge only for known-safe** (dev lint, not vue/vite).
- Disable or ignore scripts in CI when possible (`ignore-scripts`) except the ones you allowlist (e.g. `esbuild`).
- SBOM on release if the org requires it — do not pretend it blocks XSS.
- Design-system / internal packages: lock the registry, not random GitHub tarball URLs.

**Tradeoffs**

- Pin everything vs receiving security patches. Overrides + tests beat freeze-the-world.
- Bundling vs leaving `node_modules` in the image — smaller attack surface at runtime for SPAs (you ship compiled assets; the install machine is the risk).

**Production gotchas**

- `package-lock` vs `pnpm-lock` vs `yarn.lock` mixed in one repo.
- Nuxt/Vite plugins executing at build time — a malicious plugin is **build-time RCE**, not just XSS.
- Typosquatting (`lodahs`). Check names on first add.

**Follow-ups**

- What if `event-stream` happens again? (Remove, pin, rotate secrets that were in the build env — see 10.7.)
- Signed commits / protected branches are process, not npm, but interviewers like the connection.

---

### 10.7. Secrets in Vite and Nuxt

**What they actually ask**

- “We put the API key in `.env` — is that fine?”
- `VITE_` prefix; Nuxt `runtimeConfig`.

**How a senior answers**

- **Decision:** Anything prefixed **`VITE_`** (Vite) or **`NUXT_PUBLIC_`** / `runtimeConfig.public` **is not a secret**. It is inlined into the client bundle. Real secrets live only on the **server** (`runtimeConfig` private, `NUXT_` without public, server env, CI secrets). Frontend talks to **your** BFF; the BFF holds Stripe secret, DB, and third-party keys. Mapbox/Stripe **publishable** keys are designed for the client — still restrict them by domain, do not confuse them with secret keys.
- **Constraint:** SSR blurs the line: a key in `useRuntimeConfig().apiSecret` is fine in a Nitro handler and a disaster if you `return` it from `useAsyncData`.
- **Failure mode:** `VITE_STRIPE_SECRET`, `VITE_DATABASE_URL`, private npm tokens in `NUXT_PUBLIC_*`. Secrets in client source maps. Dumping `runtimeConfig` into `window.__NUXT__` by returning it from a composable. Slack-webhooks in the Vue app “just for errors.”
- **Measure:** `rg` the built `dist` for the secret. If it greps, it shipped. Treat that as an incident: rotate.

```ts
// nuxt.config.ts — mental model
runtimeConfig: {
  stripeSecret: "",          // server-only; env NUXT_STRIPE_SECRET
  public: {
    stripePk: "",            // client; env NUXT_PUBLIC_STRIPE_PK
  },
}
```

```ts
// Vite: only VITE_* is exposed to client code
const publishable = import.meta.env.VITE_MAPBOX_TOKEN; // OK if it is publishable
// import.meta.env.DATABASE_URL is undefined in the browser — do not “fix” that by prefixing VITE_
```

**Tradeoffs**

- BFF adds a hop vs leaking the secret. There is no senior debate here for secret keys.
- Public analytics IDs in the client: acceptable; still no PII in the ID.

**Production gotchas**

- Preview deploys with production secrets.
- `console.log(config)` in a plugin.
- Git history: rotating is not optional if it was committed, even in `.env.example` mistakes.
- Next.js: `NEXT_PUBLIC_` is the same trap as `VITE_`. Server-only env in a Client Component serializes it.

**Follow-ups**

- How do you inject secrets in CI for `nuxt build`? (Not into the client define; into the hosting runtime for Nitro.)
- Feature flags SaaS keys — usually publishable; still origin-restrict.

---

[← Back to Overview](../../README-en.md)
