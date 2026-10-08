# Networking

This is senior frontend interview prep for **how the browser talks to your backends**, not a protocol textbook. They will not hire you for reciting “WebSocket is full-duplex.” They will hire you if you can pick **REST vs GraphQL vs SSE vs WS**, put **auth on the right transport**, and describe **loading / error / empty / optimistic** as product states.

Vue 3 / Nuxt: `$fetch` / `ofetch`, `useAsyncData`, VueUse `useWebSocket`. Same ideas apply to React Query / Next — the constraints are HTTP and the browser, not the framework.

---

## Table of Contents

1. [WebSocket vs REST](#131-websocket-vs-rest)

2. [REST Design from the Frontend](#132-rest-design-from-the-frontend)

3. [Loading, Error, Empty, and Optimistic UI](#133-loading-error-empty-and-optimistic-ui)

4. [CORS and Cookies from the Frontend](#134-cors-and-cookies-from-the-frontend)

5. [AbortController and Timeouts](#135-abortcontroller-and-timeouts)

---

## 13. Networking

### 13.1. WebSocket vs REST

**What they actually ask**

- “When do you use WebSockets instead of REST?”
- “Why not GraphQL for everything?”
- “How do you authenticate a WebSocket from the browser?”
- “What happens when the laptop lid closes for 20 minutes?”

**How a senior answers**

- **Decision:** **REST (or RPC-over-HTTP)** for request/response work: CRUD, forms, searches, anything you want cached, retried, load-balanced, and debuggable in a HAR file. **WebSocket** (or SSE) when the **server must push** and latency of polling would be a product failure (collab cursors, trading ticks, ops dashboards, chat). Default combo: REST/BFF for commands and initial state, WS for deltas.
- **Constraint:** Browsers, mobile radios, corporate proxies, and load-balancer **idle timeouts** hate cheap always-on sockets. HTTP/2 already multiplexes many REST calls on one connection — “too many endpoints” is not an automatic reason for WS.
- **Failure mode:** One WS for the whole app that then reinvents HTTP (request IDs, error codes, retries) badly; token in the query string landing in CDN logs; no heartbeat → silent death behind nginx; reconnect storms after a deploy.
- **Measure:** messages / sec / user, p95 time-to-first-push, reconnect rate, **duplicate events after resume**, battery/radio cost on mobile, cost of fan-out on the server.

#### HTTP/2 multiplexing (why “just open more REST calls” got cheaper)

HTTP/1.1: ~6 connections per origin, head-of-line blocking, combining endpoints was a real FE sport.

HTTP/2: many streams, one TCP connection. Parallel `useAsyncData` / TanStack Query calls are fine. You still pay **server time and payload size**. HTTP/2 does not fix overfetching a 2MB JSON for a table widget.

HTTP/2 still has **TCP HOL blocking** (a lost packet stalls all streams). HTTP/3/QUIC is the follow-up if they ask. This is not a reason to rewrite the app; it is why “we need WS because HTTP is slow” is usually wrong.

#### GraphQL as a tradeoff (not a religion)

| You want | GraphQL helps | You pay |
| --- | --- | --- |
| One round trip for a screen with 6 REST resources | Yes — if the graph is designed | BFF complexity, N+1, authz per field |
| Stop overfetching | Maybe | Clients still ask for too much; persisted queries / allowlists become mandatory in prod |
| FE-owned schema iteration | Until the graph is a dumping ground | Versioning is *harder* than REST URL versioning |
| Caching | Normalized client cache (Apollo/Urql/TanStack) | HTTP CDN caching is much worse than REST GET |

Senior line: **GraphQL is a BFF contract.** Put it at the edge/BFF, not as a leaky replacement for every microservice. For a public CDN-cached marketing page, REST/JSON or even HTML from Nuxt wins. For a dashboard that otherwise waterfalls 12 REST calls, GraphQL or a **purpose-built BFF endpoint** both beat WS.

#### SSE vs WebSocket vs polling

| | Polling | SSE | WebSocket |
| --- | --- | --- | --- |
| Direction | Client pull | Server → client | Bidirectional |
| Transport | HTTP | HTTP (event stream) | Its own upgrade |
| Auth | Normal cookies/headers | Normal cookies/headers | See below — **no custom headers in the browser constructor** |
| Proxies / HTTP/2 | Trivial | Good (it’s HTTP) | Sticky sessions, idle timeouts, special LB config |
| Use | TTL-tolerable freshness (30s+), or ETag/304 | Notifications, logs, one-way ticks | Chat, collab, client→server streaming, protocol you control |

Prefer **SSE** when the client mostly listens (notification bell, “job finished”). Prefer **short polling + `If-None-Match`** when “live” is 15–60s and you want CDN/BFF caching. Prefer **WS** when both sides speak frequently.

Long polling is what you do when SSE is blocked and you cannot run WS — mention it, don’t design for it first.

#### Auth on WebSocket: cookie vs token in the first message

Browser `new WebSocket(url)` **cannot set `Authorization`**. That is the trap.

- **Cookie on the handshake** (`SameSite=None; Secure` if cross-site, usually **same-site** to your API). Simple, CSRF story must be explicit (custom header or SameSite). Works with HttpOnly refresh cookies. **Best default** when FE and API share a parent site.
- **Token in the query string** (`?access_token=`): it will show up in **access logs, proxies, Referer**. Treat as a footgun. Short-lived only if you have no other option.
- **Connect, then first message `{ type: 'auth', token }`:** works with access tokens in memory. Server must **reject all other messages until auth**, timeout unauthenticated sockets, and **not** log the token. Pair with reconnect that re-auths.
- Don’t store long-lived access tokens in `localStorage` just to feed WS. If XSS exists, WS is owned anyway — still prefer memory + HttpOnly refresh via REST.

#### Reconnection, backoff, heartbeat

- Heartbeat / ping-pong: application-level if the LB or serverless WS gateway won’t. Detect **half-open** connections (wifi change).
- Reconnect: exponential backoff **with jitter**. Cap the delay. Reset backoff after a stable connection.
- After resume: **don’t replay the whole world** if you can send `lastEventId` / cursor / version. SSE has `Last-Event-ID` for this; WS you invent it.
- Tab freeze (mobile): `visibilitychange` — pause heartbeats in background if the server will kick you; document that.
- Auth expiry mid-session: refresh via REST (single-flight), then re-auth the socket; don’t open a second socket per 401.

#### When a BFF exists

Say the box diagram: **browser → BFF (Nuxt/Nitro or Node) → services.**

- Browser uses **one origin** (no CORS circus), cookies stay first-party, GraphQL/REST aggregation lives here.
- BFF holds service credentials; the browser never talks to the inventory WS farm directly.
- Realtime: browser SSE/WS to **BFF**, BFF subscribes internally (Kafka, service WS, Redis pub/sub).
- Initial snapshot via REST/`useAsyncData` (SSR-friendly); stream patches after hydrate. SSR cannot “hold a WS” for the user.

**Tradeoffs**

- REST: cacheable, boring, easy 401 policy — chatty screens without a BFF.
- WS: great push, miserable auth/debug/scale if used as a generic API.
- GraphQL: flexible screens, easy to create a permission and performance incident.
- SSE: simple one-way; auto-reconnect in `EventSource` is nice; **cannot POST**, custom headers are limited (cookies still work).

**Production gotchas**

- nginx `proxy_read_timeout` killing SSE/WS at 60s because nobody sent a heartbeat.
- Sticky sessions required, then autoscaling “randomly” drops users.
- Duplicate event processing (reconnect without an offset) — **idempotent consumers** on the client (keyed by event id).
- Opening a WS per component mount (chat widget + header + page = 3 sockets).

**Follow-ups**

- How do you test WS? (mock a small protocol, contract tests on event shapes, don’t e2e the whole broker)
- Binary vs JSON frames?
- How does this change with HTTP/2 + many REST calls vs a custom BFF resource?

---

### 13.2. REST Design from the Frontend

**What they actually ask**

“If you could change the API, what would you ask backend for?” They want a **frontend contract**, not textbook REST purity.

**How a senior answers**

- **Decision:** Design URLs and payloads for **screens**: list + filter + sort in **query params** (shareable, SSR-readable), stable resource IDs, an **error envelope** the UI can branch on, pagination that matches the UI (infinite scroll ≠ page buttons), **idempotency** on money and “create” buttons.
- **Constraint:** The browser will retry, double-click, and lose a tab. Mobile will timeout. You do not control all clients (iOS, old Android WebView).
- **Failure mode:** Offset pagination that **duplicates/skips** rows when the list mutates; 500 with an HTML nginx page; POST `/order` that creates two orders; errors that only have a string so you cannot i18n or field-highlight.
- **Measure:** p95 payload size per screen, duplicate-create rate, empty vs error vs zero-result rates, time to first useful row.

**Pagination**

- **Offset/limit:** admin tables, jump-to-page. Breaks when items insert at the top (duplicate/missing rows). Fine for stable catalogs.
- **Cursor / keyset:** feeds, infinite scroll, “load more.” Put the cursor **opaque** (`?cursor=`) so you can change it. Store it in the URL if the feed should be shareable — often it shouldn’t; use it in memory then.
- **Always return** `{ items, nextCursor, total? }`. Don’t hide total if the UI has “143,221 rows”; don’t compute `COUNT(*)` if the UI doesn’t need it.
- Prefer **BFF-shaped list DTOs** (already joined names, permissions) over making FE compose 3 APIs per row.

**Errors**

Agree a body, not a vibe:

```json
{
  "error": {
    "code": "QUOTE_EXPIRED",
    "message": "Price changed, refresh the quote",
    "fields": { "coupon": "Not combinable with sale items" }
  }
}
```

Map **status** for control flow: `401` session, `403` permission (not “please login”), `404` vs empty list, `409` conflict / version, `422` validation, `429` + `Retry-After`, `5xx` retryable with backoff. Never parse error **message** strings in UI logic.

**Idempotency**

- GET/PUT/DELETE are supposed to be idempotent; **POST create/pay is not**.
- FE sends `Idempotency-Key` (UUID) on Pay / Submit Order, retries with the **same** key, button disabled + timeout. Backend must store the first result.
- Client-side: don’t only `disabled={loading}` — a refresh mid-flight still double-posts without a key.

**Other FE-shaped contract asks**

- Partial updates (`PATCH`) with optimistic UI and `If-Match` / version field for 409.
- Filter/sort whitelist (don’t accept arbitrary SQL-ish query languages from the URL).
- File uploads: presigned URL, not a 200MB JSON POST through Nuxt.
- Batch endpoints when a table would otherwise fire N requests.

**Tradeoffs**

- REST resources vs BFF “screen DTOs” — seniors usually want **both**: resources for reuse, BFF for the expensive page.
- Cursor vs offset — pick from the UI, don’t cargo-cult cursor for a 20-row settings table.

**Production gotchas**

- Accidental caching of personalized GET (`Cache-Control: public` on `/api/me`).
- `204` with a body, or `200` wrapping errors — interceptors become archaeology.
- Pagination `total` that is an estimate; UI shows it as exact.

**Follow-ups**

- How do you version? (URL `/v2` vs headers vs additive JSON)
- What belongs in query vs body for a complex search? (GET if cacheable and short; POST `/search` if the query is huge)

---

### 13.3. Loading, Error, Empty, and Optimistic UI

**What they actually ask**

“The API is slow / flaky. How does the UI behave?” This is a **product** question dressed as networking.

**How a senior answers**

- **Decision:** Every async view has four states — **loading, error, empty, success** — plus **stale** (you have data, you’re refreshing) and **optimistic** (you guessed). Encode them explicitly (TanStack Query / `useAsyncData` status), not `data && !error && !pending` soup.
- **Constraint:** Perceived performance > raw RTT. A 150ms spinner is worse than nothing. A wrong optimistic row that cannot roll back is worse than a 300ms wait.
- **Failure mode:** Spinner on every filter keystroke; empty state that looks like an error; optimistic create that duplicates after retry; error toast with no recovery; SSR success then client refetch flash.
- **Measure:** time-to-first-content, spinner time buckets, error recovery rate, rollback rate, “blank page” RUM events.

**Patterns**

- **Pending vs refreshing:** first load → skeleton that **matches layout** (CLS). Refetch → keep old rows, subtle indicator. Nuxt `useAsyncData` + `lazy` / `keep-alive` of the previous payload.
- **Don’t flash:** delay spinner ~200ms; ignore responses that lost a race (AbortController, 13.5).
- **Empty ≠ error ≠ zero filter results.** “No orders yet” (CTA) vs “No orders match filters” (clear filters) vs “We couldn’t load orders” (retry).
- **Error:** retry with backoff on 5xx/network; don’t retry 4xx except 429. Show **code-driven** copy, plus a retry control. Widget-level error, not the whole shell (see [19.2](./monitoring.md#192-error-boundaries-in-vue)).
- **Optimistic:** only when rollback is cheap and conflict is rare (toggle, rename, reorder). For payments / inventory: **pessimistic** or “pending on server” state.

```ts
// Decision: mutate cache immediately, roll back on 409/5xx, don't invent a second source of truth.
async function onToggle(id: string) {
  const snapshot = queryClient.getQueryData(["orders"]);
  queryClient.setQueryData(["orders"], optimisticToggle(snapshot, id));
  try {
    await $fetch(`/api/orders/${id}`, { method: "PATCH", body: { done: true } });
  } catch {
    queryClient.setQueryData(["orders"], snapshot);
    toast.error("Couldn’t update — still not marked done");
  }
}
```

**Tradeoffs**

- Skeletons vs spinners vs nothing (cached).
- Optimistic vs undo toast vs waiting.
- Global query cache vs “this page owns the request” — cache is right for lists used in two places; it is how you get **stale permission** bugs if you don’t key by user/tenant.

**Production gotchas**

- SSR hydrated empty, client refetches and the list jumps (Nuxt payload mismatch).
- Optimistic UI vs **multi-tab** (BroadcastChannel / query broadcast).
- Treating `[]` as error because `if (!data)`.

**Follow-ups**

- How do you cancel in-flight search? (13.5)
- Where does pagination cursor live? (URL vs TanStack Query key)

---

### 13.4. CORS and Cookies from the Frontend

**What they actually ask**

“Why is the browser blocking my API?” / “Why aren’t cookies sent?” They want you to know this is **the browser**, not axios being rude.

**How a senior answers**

- **Decision:** Prefer **same-site** (browser → BFF on `app.example.com` / `example.com/api`) so CORS and third-party cookies disappear. If you must cross-origin: explicit `Access-Control-Allow-Origin: https://app.example.com` (never `*` with credentials), `Allow-Credentials: true`, FE `credentials: 'include'`.
- **Constraint:** Cross-site cookies are dying. `SameSite=None; Secure` is the old third-party hack and will keep breaking. Don’t design a new SPA on `app.foo.com` talking to `api.bar.com` with cookies unless you have a very old SSO reason.
- **Failure mode:** `*` + cookies (browser rejects); preflight failing on `Authorization` / `Content-Type: application/json`; CSRF on cookie-authenticated POST; thinking CORS protects the API from non-browsers (it doesn’t).
- **Measure:** preflight count (OPTIONS cache via `Access-Control-Max-Age`), auth success rate after login, CSRF reject rate, Safari ITP bugs in RUM.

**From the FE side**

- Simple requests vs **preflight**. `application/json` + custom headers ⇒ OPTIONS. Don’t add vanity headers on every GET.
- `fetch(url, { credentials: 'include' })` / axios `withCredentials: true`. Forgetting this looks like “random 401 after login.”
- Cookie flags you should be able to recite: `HttpOnly`, `Secure`, `SameSite=Lax` (good default for first-party), `Path`, `__Host-` prefix. Lax will **not** send cookies on cross-site POST — that’s a feature (CSRF), and why OAuth callbacks need care.
- CSRF: cookie session ⇒ same-site **or** double-submit / custom header the server checks. Bearer token in memory is not CSRF’d the same way (XSS is your problem instead). See security notes; don’t mix both poorly.
- Nuxt: proxy `/api` in Nitro/dev to the upstream so **localhost doesn’t need CORS** during development — and prod uses the same origin via ingress.

**Tradeoffs**

- Cookie session (HttpOnly, first-party) vs Bearer in memory + refresh cookie. Seniors pick **BFF + first-party cookies** for browser apps unless you are a public API for third-party JS.
- CORS on each microservice vs one BFF origin.

**Production gotchas**

- Staging FE `https://pr-123.preview.com` vs API `https://api.staging.com` — every preview origin must be allowlisted or you use a **proxy**.
- `localhost` vs `127.0.0.1` are different origins.
- WebSocket handshake CORS is not the same as `fetch`; cookies still follow SameSite.

**Follow-ups**

- Does CORS stop curl from hitting the API? (No.)
- How do you do auth for a mobile WebView?

---

### 13.5. AbortController and Timeouts

**What they actually ask**

“User types fast / navigates away. Do you still let those requests finish?”

**How a senior answers**

- **Decision:** **Abort GETs** that became irrelevant (search, route change, filter). **Timeout** all requests (including mutations) so a hung TCP isn’t an infinite spinner. **Do not blindly abort mutations** (pay, save) on unmount — let them finish or you will retry and double-submit; instead disable navigation or confirm, and keep the idempotency key.
- **Constraint:** `fetch` does not timeout by default. Vue unmount does not cancel anything unless you wire it. Nuxt `useAsyncData` / VueUse can take a signal; axios needs `AbortController` (not the old `CancelToken`).
- **Failure mode:** aborting the login POST when the component re-renders; ignoring `AbortError` and showing a red toast; one global timeout of 3s that kills file uploads; leaking listeners because you never aborted.
- **Measure:** aborted vs failed vs timed-out in RUM, p95 duration by endpoint, orphan request rate after route changes.

```ts
// Decision: search is cancelable + 8s timeout; AbortError is not a user-facing failure.
export async function searchOrders(q: string, routeSignal: AbortSignal) {
  const signal = AbortSignal.any([routeSignal, AbortSignal.timeout(8_000)]);
  try {
    return await $fetch("/api/orders", { query: { q }, signal });
  } catch (err) {
    if (err instanceof DOMException && (err.name === "AbortError" || err.name === "TimeoutError")) {
      return null; // superseded or gave up; UI keeps previous results or skeleton
    }
    throw err;
  }
}
```

In Vue: create the controller in `watchEffect` / `watch` on the query, **abort in the cleanup**. In Nuxt, pass `signal` into `$fetch` tied to `vue:error` / unmount. On route leave, abort the **list** fetch, not the **in-flight checkout**.

**Tradeoffs**

- Aggressive abort (saves battery and server) vs analytics that never see completed searches.
- `AbortSignal.timeout` (standard) vs homemade `Promise.race` (don’t; race without abort leaves the socket running).

**Production gotchas**

- Polyfill `AbortSignal.any` / `timeout` if you still support old WebViews.
- Axios adapters that don’t forward `signal`.
- `$fetch` / ofetch may **wrap** `AbortError` — inspect `err.name` / `err.cause`, still don’t toast it.
- Service workers ignoring abort.
- Treating timeout as 401 and logging the user out.

**Follow-ups**

- How does this interact with optimistic UI? (don’t abort the mutation you already reflected)
- How do you timeout a WS? (heartbeat, not AbortController)

---

[← Back to Overview](../../README-en.md)
