# Security

Senior nói **threat model** và **defense in depth**, không phải list helper `escapeHTML`. Security frontend là: attacker chạy JS trong origin làm được gì, site độc hại khác làm được gì với cookie của user, thứ bạn vô tình ship trong client bundle, và thứ bạn tin từ npm.

Vue 3 escape mặc định; đó không phải chương trình bảo mật. Interview dừng ở “chúng tôi dùng HTTPS” mà không XSS × token storage × CSRF × supply chain thì junior.

---

## Table of Contents

1. [Phòng chống XSS](#101-phòng-chống-xss)

2. [Bảo vệ CSRF](#102-bảo-vệ-csrf)

3. [Best Practices về Authentication](#103-best-practices-về-authentication)

4. [Validation và Sanitization Input](#104-validation-và-sanitization-input)

5. [HTTPS & CORS](#105-https--cors)

6. [Bảo mật supply chain](#106-bảo-mật-supply-chain)

7. [Secrets trong Vite và Nuxt](#107-secrets-trong-vite-và-nuxt)

---

## 10. Security

### 10.1. Phòng chống XSS

**Họ thực sự hỏi gì**

- Các loại XSS; Vue có an toàn không; `v-html` khi nào OK; CSP; URL `javascript:`.
- Họ muốn bạn nối XSS với **cắp token** (10.3), không dừng ở `alert(1)`.

**Cách senior trả lời**

- **Quyết định:** Coi XSS là browser threat số một. Vue **text interpolation và hầu hết binding đều escape**. Lỗ là **`v-html`**, markdown → HTML, `innerHTML` trong widget bạn viết, `href`/`src` với URL user, inject `style`, và `eval`. Sanitize bằng HTML policy thật (DOMPurify) **ở boundary**, không bằng regex. CSP là **mitigation và containment**, không viên đạn bạc — nhất là với `'unsafe-inline'` và widget CDN.
- **Ràng buộc:** Product muốn rich text, preview, và embed code. Bạn không “cấm HTML” trong CMS. Bạn cấm `v-html` chuỗi **chưa sanitize** lúc review (9.1.3).
- **Failure mode:** “Vue an toàn nên JWT để `localStorage`.” Một field CMS `v-html` sau đó, session đi. DOM XSS trong datepicker/`innerHTML` highlight tự chế. Library markdown cho phép raw HTML. CSP dạng `<meta>` sau script (muộn) hoặc `unsafe-inline` làm nó bất lực.
- **Đo:** XSS bounty user đã auth trên rich text. Noise CSP report-uri trending xuống. Không `v-html` thiếu sanitizer trên CI (ESLint `vue/no-v-html` + allowlist).

**Default Vue 3**

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

**DOM XSS trong widget**

Editor tự chế, syntax highlighter, UI “copy snippet” thường gán `innerHTML` có chủ đích. Compiler Vue không cứu bạn trong `onMounted(() => el.innerHTML = props.code)`. Prefer `textContent`, `document.createElement`, hoặc sanitize. React `dangerouslySetInnerHTML` cùng sink.

**CSP như defense in depth**

- `default-src 'self'`; script qua nonce hoặc hash; không `'unsafe-eval'`.
- Mitigate **một phần** XSS (inline handler, origin bất ngờ). Không tự fix navigate `javascript:`, sanitizer bypass, hay `v-html` của `<img onerror>` nếu bạn cho phép.
- Report-Only trước. Meta CSP yếu hơn header (không frame-ancestors, dễ ship muộn).

**Các loại (nói chính xác)**

- **Stored:** payload trong DB (comment, name). Đánh mọi viewer.
- **Reflected:** payload trong URL/request, nảy vào HTML. Page search SSR vẫn làm điều này.
- **DOM-based:** client đọc `location` / `postMessage` / `dataset` vào sink. App Vue sống ở đây.

**Tradeoff**

- Markdown + sanitizer vs editor subset khóa (TipTap schema). Schema > sanitize-sau.
- CSP chặt vs script third-party (analytics, payment). Payment được allowlist hẹp, không `*`.

**Gotcha production**

- `target="_blank"` thiếu `rel="noopener"` là chuyện tab-nabbing; vẫn nhắc, không phải XSS.
- `v-html` + i18n interpolate tên user vào bản dịch HTML.
- Nuxt render server: XSS trong `useHead` / raw `<script>` JSON. Serialize bằng helper `json`, không concat string.
- `innerHTML` của JSON-LD: vẫn parse/serialize, đừng dán text user.

**Câu hỏi nối**

- CSP thay được sanitization? (Không.)
- Mutation XSS sau DOMPurify nếu bạn mangle HTML về sau — sanitize cuối cùng.
- React/Next: cùng model; href `next/link` vẫn cần check protocol cho URL user.

---

### 10.2. Bảo vệ CSRF

**Họ thực sự hỏi gì**

- CSRF là gì; token vs SameSite; SPA có cần CSRF nếu dùng Bearer header?

**Cách senior trả lời**

- **Quyết định:** CSRF quan trọng khi **browser tự gắn credential** (cookie) vào request đổi state mà attacker trigger được. **Bearer token trong `Authorization` từ memory không tự gắn**, nên CSRF cổ điển thường không phải vấn đề. SPA auth bằng cookie: **SameSite=Lax + HTTPS + POST cho mutation** thường đủ. Thêm **custom header** (`X-Requested-With` / CSRF token) khi còn browser cũ, `SameSite=None` (embed), hoặc GET-có-side-effect chưa giết được. Double-submit cookie là pattern SPA thực dụng khi server muốn token mà không session storage phía server.
- **Ràng buộc:** Bạn không kiểm soát mọi WebView hay product embed tiếp theo. Lax không gửi cookie trên **subresource POST** cross-site từ origin khác, nhưng **top-level GET** vẫn gửi cookie Lax (class cũ “logout CSRF qua `<img>`” / “đổi state trên GET”).
- **Failure mode:** Cookie session + CORS `Access-Control-Allow-Origin: *` + `credentials`. JSON API nhận `text/plain` để skip preflight. Cho rằng “ta là SPA nên CSRF biến mất.” Synchronizer token copy từ form app 2012 lên Bearer API.
- **Đo:** Page độc hại có gây **đổi state** bằng cookie user mà không extra header? Có thì bạn vẫn còn CSRF. Test bằng form POST cross-origin trong fixture.

**Khi CSRF vẫn quan trọng**

- Session trong cookie (kể cả httpOnly refresh **cũng** POST `/logout` hoặc `/transfer` như cookie-only call).
- Mutation trên GET (unsubscribe, approve).
- `SameSite=None` cho admin embed.
- Cookie auth tới API subdomain (`api.example.com`) từ site attacker vận hành trong thế related-site — biết eTLD+1 của bạn.

**Khi thường không**

- Access token trong memory, gửi `Authorization: Bearer`, không cookie cho API đó.
- Session cookie SameSite Strict và không embed cross-site.

```ts
// Cookie-auth API: custom header is a CSRF control (not a secret)
await api.post("/orders", body, {
  headers: { "X-Requested-With": "XMLHttpRequest" },
  withCredentials: true,
});
```

Server đòi header không-simple thì buộc **preflight**; HTML form cross-origin không set được.

**Double-submit**

Server set cookie `XSRF-TOKEN` đọc được (không httpOnly) **và** đòi echo trong header. Site attacker không đọc được (same-origin). Axios/ky copy được. XSS vẫn đọc được — CSRF token không sống sót XSS; đó là threat khác.

**SameSite**

- `Strict`: mạnh nhất, gãy một số inbound GET (user click link email vào app đã auth — cookie bị giữ ở navigation đầu).
- `Lax`: default SPA thường cho session cookie.
- `None; Secure`: chỉ third-party / embed.

**Tradeoff**

- Cookie UX (không flash refresh) vs chương trình CSRF.
- Bearer trong memory vs hết CSRF nhưng nhạy XSS nếu bạn từng để Web Storage.

**Gotcha production**

- Same-site vs same-origin: `www` vs `app` vs `api` trên một eTLD+1 là **same-site** với cookie SameSite. CSRF qua sibling subdomain là câu hỏi thiết kế thật.
- Fetch `credentials: 'include'` mà CORS origin allowlist không chặt.
- Logout dạng GET.

**Câu hỏi nối**

- Login CSRF (attacker login bạn vào account chúng) — riêng, thường anti-automation + `SameSite` + nhận ra account switch.
- App mobile/native: CSRF là khái niệm browser; chúng vẫn cần authz.

---

### 10.3. Best Practices về Authentication

**Họ thực sự hỏi gì**

- Access token để đâu? Refresh rotation? Bão 401? Logout across tab?

**Cách senior trả lời**

- **Quyết định:** **Access token trong memory** (hoặc cookie httpOnly ngắn). **Refresh token trong cookie httpOnly + Secure + SameSite**, rotate lúc dùng. Axios/fetch **401 interceptor với single-flight refresh** để burst 401 không stampede `/refresh`. **Logout mọi tab** qua `BroadcastChannel` (hoặc `storage` event nếu bắt buộc). Coi **XSS là game over cho mọi secret không-httpOnly**.
- **Ràng buộc:** Hard refresh làm mất memory token — cần refresh call lúc boot (silent). Cookie refresh cần posture CSRF (10.2). Reverse proxy không được log `Authorization`.
- **Failure mode:** `localStorage.setItem('token')`. 401 song song cùng đụng refresh, rotate refresh token, **tất cả trừ một fail**, user bị đá. Refresh không rotate → refresh bị cắp sống mãi. Logout chỉ xóa memory tab này. Nhét access token vào Pinia persist (ghi `localStorage`).
- **Đo:** Test session fixation, phát hiện reuse refresh (server), time-to-revoke lúc logout, XSS tabletop: “attacker cắp được gì?”

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

Server phát refresh mới, invalidate cái cũ. Reuse refresh cũ = trộm → revoke cả family. Frontend: single-flight là thứ khiến rotation sống sót được.

**OAuth / OIDC**

Authorization Code + PKCE cho SPA. Đừng implement implicit flow. Next.js: session cookie httpOnly qua Auth.js / BFF tương tự. Vue SPA nói chuyện với BFF cùng ý.

**Tradeoff**

| Pattern | XSS | CSRF | UX |
| --- | --- | --- | --- |
| Access memory + httpOnly refresh | Access khó cắp | Refresh cookie cần SameSite/header | Refresh lúc reload |
| Chỉ session cookie httpOnly | Tốt nhất chống XSS | CSRF trên mutation | Đơn giản nhất |
| Token trong `localStorage` | Tệ nhất | CSRF thường N/A | Đơn giản nhất và **không phải câu senior** |

**Gotcha production**

- Pinia `persist: true` trên user store. Bạn vừa phát minh token `localStorage`.
- 401 trên `/refresh` **không** được recurse interceptor.
- Clock skew JWT `exp` — refresh sớm một phút; đừng tin client như authz.
- “Silent refresh” trong iframe ẩn chết vì third-party-cookie; dùng BFF first-party.

**Câu hỏi nối**

- Step-up auth cho lệnh tiền (nhập lại password / WebAuthn).
- Expire mọi session thế nào? (List session phía server; endpoint logout-all; bump token version.)

---

### 10.4. Validation và Sanitization Input

**Họ thực sự hỏi gì**

- Validation client vs server; Zod; sanitization vs validation.

**Cách senior trả lời**

- **Quyết định:** **Validation client là UX** (lỗi tức thì, disable Pay, constrain keyboard). **Validation server là security boundary.** Share **schema Zod (hoặc tương tự)** hai phía khi bạn own cả hai (Nuxt server route, monorepo). **Sanitize HTML không phải validation** và validation không phải sanitization: chuỗi markdown “valid” vẫn có thể XSS; chuỗi đã sanitize vẫn có thể email không hợp lệ.
- **Ràng buộc:** Attacker không chạy form Vue của bạn. Native app, Postman, client cũ đụng API. SSR vẫn cần cùng parser.
- **Failure mode:** Email chỉ regex trên client, API tin `role: 'admin'` từ body. `sanitize()` strip `<script>` rồi bạn `v-html` thiếu DOMPurify (markdown XSS). Dùng Zod `.parse` trên client rồi skip trong Nitro handler vì “TypeScript.”
- **Đo:** Contract test với payload bất hợp pháp (8.6). Test authz: user không set `isAdmin`. Fuzz rich-text xuyên sanitizer.

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

Không bao giờ lấy `priceCents` từ client làm sự thật.

**Sanitize vs validate**

| | Validation (Zod) | Sanitization (DOMPurify / schema) |
| --- | --- | --- |
| Câu hỏi | Đây có phải order? | HTML này render có an toàn? |
| Failure | 400, hiện lỗi field | Strip/reject; đừng “sửa” thành business data |
| SQL/NoSQL | Parameterized query / ORM | Không liên quan HTML |

Frontend không “chặn SQL injection” — nó tránh dựng SQL. Nếu họ hỏi: parameterized query/ORM trên server; không concat string. GraphQL cũng vậy với parameterized variable.

**Tradeoff**

- Một schema share: DRY, buộc versioning. Schema tách: drift.
- Allowlist (enum, max qty) thắng blocklist.

**Gotcha production**

- `z.string().email()` không RFC-complete và vẫn ổn; đừng bikeshed.
- Parse số từ form `<input>` (string) — coerce một lần ở edge.
- File upload: validate **type/size trên server** bằng magic byte, không `file.type`.
- Log payload: redact PAN/PII.

**Câu hỏi nối**

- Prototype pollution qua `JSON.parse` vào `Object.assign` — freeze option, không merge `__proto__`.
- i18n lỗi Zod mà không leak internals schema.

---

### 10.5. HTTPS & CORS

**Họ thực sự hỏi gì**

- Header CORS; cookie; CORS có phải lớp bảo mật cho API?

**Cách senior trả lời**

- **Quyết định:** **HTTPS everywhere** (HSTS, cookie Secure, không mixed content). **CORS là browser policy**, không phải ACL. Postman, curl, mobile app, và server của bạn ignore nó. Authz thật là **session + check permission**. Khi SPA cần cookie: `Access-Control-Allow-Credentials: true` và **origin cụ thể**, không bao giờ `*`. Biết request **simple vs preflight** để không “fix CORS” bằng cách làm yếu API.
- **Ràng buộc:** Localhost vs preview URL vs prod — allowlist phải tường minh. Reverse proxy strip hoặc nhân đôi header CORS.
- **Failure mode:** `origin: true` reflect-mọi-origin **kèm credentials**. Giải missing header bằng cho `*` rồi nhét token vào query string. Tin “CORS blocked” nghĩa API an toàn khỏi CSRF/SSRF. Cookie thiếu `Secure` / `HttpOnly` / `Path`.
- **Đo:** Review header trên auth API. Report mixed content. Cookie flag trên staging (`Secure`, `HttpOnly`, `SameSite`).

**CORS đúng nghĩa**

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

Preflight (`OPTIONS`) phải trả cùng allowlist. `Max-Age` cache preflight — ngắn lúc debug, dài hơn trên prod.

**Cookie**

- `Secure`: chỉ HTTPS.
- `HttpOnly`: JS không đọc được (refresh/session).
- `SameSite=Lax` default cho SPA first-party.
- `Path=/` trừ khi bạn cố ý scope.
- Prefix `__Host-` khi muốn naming cookie chặt nhất.

**HTTPS**

- HSTS `max-age` với `includeSubDomains` khi đã chắc.
- Redirect ở edge, không trong Vue Router.
- Mixed content: một ảnh `http://` trên app HTTPS là report và leak tin cậy.

**Tradeoff**

- Allowlist chặt vs preview URL của developer (allowlist theo pattern `*.preview.example.com`, không `*`).
- BFF same-origin (Nuxt `/api`) **xóa CORS** với browser — thường là kiến trúc senior.

**Gotcha production**

- Hai CORS middleware chồng `*`.
- Origin `null` (iframe sandbox, file://) — không bao giờ allow `null`.
- Header `Authorization` buộc preflight; POST simple chỉ-cookie có thể **không** — thêm một lý do CSRF để đòi custom header.
- Rewrite Next/Nuxt: origin browser là page, không phải upstream.

**Câu hỏi nối**

- CORS vs CSP vs COOP/COEP (isolation cho SharedArrayBuffer — bài khác).
- Private Network Access / local network permission — đừng coi trivia CORS.

---

### 10.6. Bảo mật supply chain

**Họ thực sự hỏi gì**

- lockfile, `npm audit`, bạn làm gì khi maintainer bị compromise.

**Cách senior trả lời**

- **Quyết định:** **Commit lockfile** và install bằng `npm ci` / `pnpm install --frozen-lockfile` trên CI. Review dependency **mới** như production code (9.1.3): size, maintainer, provenance. `npm audit` là **tín hiệu**, không gate fail mù — nó ồn, CVSS ≠ reachable, team tắt nó. Prefer phân tích **reachable**, `pnpm overrides` / `npm overrides` để pin phẫu thuật, và process cho **PR chỉ lockfile**.
- **Ràng buộc:** Bạn không tự vet mọi transitive. Bạn vet direct dep, pin, và tránh `postinstall` từ package CSS random.
- **Failure mode:** Xóa `package-lock.json` “cho hết conflict.” `^` float trên minor bị compromise. `npm audit --force` mù upgrade Vue major thứ Sáu. Ignore utility 10 dòng chạy `preinstall: curl | sh`.
- **Đo:** Thời gian pin/override một transitive bị exploit. CI có reproduce được cây không. Provenance/attestation khi registry hỗ trợ.

**`npm audit` không làm được**

- Nói function dễ tổn thương có **được gọi**.
- Phân biệt markdown parser chỉ-dev với checkout runtime.
- Thay review script `install` và đích network mới.

**Control thực dụng**

- Lockfile đóng băng; không `latest` trong Dockerfile.
- Dependabot/Renovate **group** và **auto-merge chỉ known-safe** (dev lint, không vue/vite).
- Disable hoặc ignore script trên CI khi được (`ignore-scripts`) trừ allowlist (ví dụ `esbuild`).
- SBOM lúc release nếu org đòi — đừng giả vờ nó chặn XSS.
- Package design-system / nội bộ: khóa registry, không URL tarball GitHub random.

**Tradeoff**

- Pin mọi thứ vs nhận security patch. Override + test thắng đóng băng cả thế giới.
- Bundle vs để `node_modules` trong image — attack surface runtime nhỏ hơn cho SPA (bạn ship compiled asset; máy install mới là risk).

**Gotcha production**

- `package-lock` vs `pnpm-lock` vs `yarn.lock` lẫn một repo.
- Plugin Nuxt/Vite chạy lúc build — plugin độc là **RCE lúc build**, không chỉ XSS.
- Typosquat (`lodahs`). Check tên lúc add lần đầu.

**Câu hỏi nối**

- Nếu `event-stream` xảy ra lại? (Gỡ, pin, rotate secret từng nằm trong build env — xem 10.7.)
- Signed commit / protected branch là process, không phải npm, nhưng interviewer thích mối nối.

---

### 10.7. Secrets trong Vite và Nuxt

**Họ thực sự hỏi gì**

- “Để API key trong `.env` — ổn chứ?”
- Prefix `VITE_`; Nuxt `runtimeConfig`.

**Cách senior trả lời**

- **Quyết định:** Thứ prefix **`VITE_`** (Vite) hoặc **`NUXT_PUBLIC_`** / `runtimeConfig.public` **không phải secret**. Nó được inline vào client bundle. Secret thật chỉ sống trên **server** (`runtimeConfig` private, `NUXT_` không public, server env, CI secret). Frontend nói với **BFF của bạn**; BFF giữ Stripe secret, DB, và key third-party. Key Mapbox/Stripe **publishable** được thiết kế cho client — vẫn restrict theo domain, đừng nhầm với secret key.
- **Ràng buộc:** SSR làm mờ ranh: key trong `useRuntimeConfig().apiSecret` ổn trong Nitro handler và thảm họa nếu bạn `return` nó từ `useAsyncData`.
- **Failure mode:** `VITE_STRIPE_SECRET`, `VITE_DATABASE_URL`, private npm token trong `NUXT_PUBLIC_*`. Secret trong client source map. Đổ `runtimeConfig` vào `window.__NUXT__` bằng cách return từ composable. Slack-webhook trong app Vue “chỉ để báo lỗi.”
- **Đo:** `rg` `dist` đã build tìm secret. Grep được là đã ship. Coi là incident: rotate.

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

**Tradeoff**

- BFF thêm một hop vs leak secret. Không có tranh luận senior ở đây cho secret key.
- Public analytics ID trên client: chấp nhận được; vẫn không PII trong ID.

**Gotcha production**

- Preview deploy với production secret.
- `console.log(config)` trong plugin.
- Git history: rotate không optional nếu đã commit, kể cả nhầm `.env.example`.
- Next.js: `NEXT_PUBLIC_` cùng bẫy với `VITE_`. Server-only env trong Client Component sẽ serialize nó.

**Câu hỏi nối**

- Inject secret trên CI cho `nuxt build` thế nào? (Không vào client define; vào hosting runtime cho Nitro.)
- Key SaaS feature flag — thường publishable; vẫn origin-restrict.

---

[← Back to Overview](../../README.md)
