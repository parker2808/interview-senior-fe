# Networking

Đây là tài liệu ôn phỏng vấn senior frontend về **cách browser nói chuyện với backend**, không phải textbook protocol. Họ không thuê bạn vì thuộc lòng “WebSocket là full-duplex.” Họ thuê bạn nếu bạn chọn được **REST vs GraphQL vs SSE vs WS**, đặt **auth đúng transport**, và mô tả **loading / error / empty / optimistic** như product state.

Vue 3 / Nuxt: `$fetch` / `ofetch`, `useAsyncData`, VueUse `useWebSocket`. Cùng ý tưởng áp cho React Query / Next — constraint là HTTP và browser, không phải framework.

---

## Table of Contents

1. [WebSocket vs REST](#131-websocket-vs-rest)

2. [Thiết kế REST từ phía Frontend](#132-thiết-kế-rest-từ-phía-frontend)

3. [Loading, Error, Empty và Optimistic UI](#133-loading-error-empty-và-optimistic-ui)

4. [CORS và Cookie từ phía Frontend](#134-cors-và-cookie-từ-phía-frontend)

5. [AbortController và Timeout](#135-abortcontroller-và-timeout)

---

## 13. Networking

### 13.1. WebSocket vs REST

**Họ thực sự hỏi gì**

- “Khi nào dùng WebSocket thay REST?”
- “Sao không GraphQL cho mọi thứ?”
- “Authenticate WebSocket từ browser thế nào?”
- “Laptop đóng nắp 20 phút thì sao?”

**Cách senior trả lời**

- **Quyết định:** **REST (hoặc RPC-over-HTTP)** cho việc request/response: CRUD, form, search, bất cứ thứ gì bạn muốn cache, retry, load-balance, và debug trong file HAR. **WebSocket** (hoặc SSE) khi **server phải push** và latency của polling sẽ là product failure (cursor collab, tick trading, ops dashboard, chat). Combo mặc định: REST/BFF cho command và initial state, WS cho delta.
- **Ràng buộc:** Browser, radio mobile, corporate proxy, và **idle timeout** của load-balancer ghét socket always-on rẻ tiền. HTTP/2 đã multiplex nhiều REST call trên một connection — “quá nhiều endpoint” không tự động thành lý do dùng WS.
- **Failure mode:** Một WS cho cả app rồi tái phát minh HTTP (request ID, error code, retry) một cách tệ; token trên query string rơi vào CDN log; không heartbeat → chết thầm sau nginx; reconnect storm sau deploy.
- **Đo:** message / giây / user, p95 time-to-first-push, reconnect rate, **event duplicate sau resume**, chi phí battery/radio trên mobile, chi phí fan-out phía server.

#### HTTP/2 multiplexing (vì sao “cứ mở thêm REST call” rẻ hơn)

HTTP/1.1: khoảng 6 connection mỗi origin, head-of-line blocking, gộp endpoint từng là môn thể thao FE thật sự.

HTTP/2: nhiều stream, một TCP connection. Gọi song song `useAsyncData` / TanStack Query thì ổn. Bạn vẫn trả **thời gian server và kích thước payload**. HTTP/2 không sửa overfetch JSON 2MB cho một table widget.

HTTP/2 vẫn bị **TCP HOL blocking** (packet mất stall mọi stream). HTTP/3/QUIC là follow-up nếu họ hỏi. Đây không phải lý do rewrite app; đây là lý do “cần WS vì HTTP chậm” thường sai.

#### GraphQL như một tradeoff (không phải tôn giáo)

| Bạn muốn | GraphQL giúp | Bạn trả giá |
| --- | --- | --- |
| Một round trip cho màn hình 6 REST resource | Có — nếu graph được thiết kế | Độ phức tạp BFF, N+1, authz từng field |
| Dừng overfetch | Có thể | Client vẫn hỏi quá nhiều; persisted query / allowlist trở thành bắt buộc trên prod |
| FE tự iterate schema | Cho đến khi graph thành bãi rác | Versioning *khó hơn* versioning URL REST |
| Caching | Normalized client cache (Apollo/Urql/TanStack) | HTTP CDN cache kém hơn REST GET rất nhiều |

Câu senior: **GraphQL là BFF contract.** Đặt nó ở edge/BFF, không phải bản thay thế thủng cho mọi microservice. Với marketing page public cache trên CDN, REST/JSON hoặc thậm chí HTML từ Nuxt thắng. Với dashboard nếu không sẽ waterfall 12 REST call, GraphQL hoặc **BFF endpoint dựng đúng việc** đều thắng WS.

#### SSE vs WebSocket vs polling

| | Polling | SSE | WebSocket |
| --- | --- | --- | --- |
| Direction | Client pull | Server → client | Bidirectional |
| Transport | HTTP | HTTP (event stream) | Upgrade riêng |
| Auth | Cookie/header bình thường | Cookie/header bình thường | Xem bên dưới — **browser constructor không set custom header** |
| Proxy / HTTP/2 | Trivial | Tốt (vẫn là HTTP) | Sticky session, idle timeout, cấu hình LB đặc biệt |
| Dùng khi | Độ tươi chịu được TTL (30s+), hoặc ETag/304 | Notification, log, tick một chiều | Chat, collab, client→server streaming, protocol bạn kiểm soát |

Ưu tiên **SSE** khi client chủ yếu lắng nghe (chuông notification, “job xong”). Ưu tiên **short polling + `If-None-Match`** khi “live” là 15–60s và bạn muốn cache CDN/BFF. Ưu tiên **WS** khi hai phía nói chuyện thường xuyên.

Long polling là việc bạn làm khi SSE bị chặn và không chạy được WS — nhắc tới, đừng thiết kế nó trước.

#### Auth trên WebSocket: cookie vs token trong message đầu

Browser `new WebSocket(url)` **không set được `Authorization`**. Đó là bẫy.

- **Cookie trên handshake** (`SameSite=None; Secure` nếu cross-site, thường **same-site** với API). Đơn giản, chuyện CSRF phải nói rõ (custom header hoặc SameSite). Chạy được với HttpOnly refresh cookie. **Default tốt nhất** khi FE và API share parent site.
- **Token trên query string** (`?access_token=`): nó sẽ xuất hiện trong **access log, proxy, Referer**. Coi như footgun. Chỉ short-lived nếu không còn lựa chọn khác.
- **Connect, rồi message đầu `{ type: 'auth', token }`:** chạy với access token trong memory. Server phải **reject mọi message khác cho đến khi auth**, timeout socket chưa auth, và **không** log token. Pair với reconnect re-auth.
- Đừng cất access token sống lâu trong `localStorage` chỉ để nuôi WS. Nếu XSS tồn tại, WS cũng bị chiếm — vẫn ưu tiên memory + HttpOnly refresh qua REST.

#### Reconnection, backoff, heartbeat

- Heartbeat / ping-pong: tầng application nếu LB hoặc serverless WS gateway không làm. Detect connection **half-open** (đổi wifi).
- Reconnect: exponential backoff **có jitter**. Cap delay. Reset backoff sau connection ổn định.
- Sau resume: **đừng replay cả thế giới** nếu gửi được `lastEventId` / cursor / version. SSE có `Last-Event-ID` cho việc này; WS thì bạn tự invent.
- Tab freeze (mobile): `visibilitychange` — pause heartbeat dưới nền nếu server sẽ kick bạn; document điều đó.
- Auth hết hạn giữa session: refresh qua REST (single-flight), rồi re-auth socket; đừng mở socket thứ hai mỗi 401.

#### Khi có BFF

Nói sơ đồ hộp: **browser → BFF (Nuxt/Nitro hoặc Node) → services.**

- Browser dùng **một origin** (không rạp CORS), cookie first-party, aggregation GraphQL/REST sống ở đây.
- BFF giữ credential của service; browser không nói chuyện trực tiếp với farm WS inventory.
- Realtime: browser SSE/WS tới **BFF**, BFF subscribe nội bộ (Kafka, service WS, Redis pub/sub).
- Snapshot ban đầu qua REST/`useAsyncData` (thân thiện SSR); stream patch sau hydrate. SSR không “giữ WS” cho user.

**Tradeoff**

- REST: cache được, nhàm chán, policy 401 dễ — màn hình nhiều lời nếu không có BFF.
- WS: push tuyệt, auth/debug/scale khổ nếu dùng như generic API.
- GraphQL: màn hình linh hoạt, dễ tạo incident permission và performance.
- SSE: một chiều đơn giản; auto-reconnect trong `EventSource` dễ chịu; **không POST**, custom header hạn chế (cookie vẫn chạy).

**Gotcha production**

- nginx `proxy_read_timeout` giết SSE/WS ở 60s vì không ai gửi heartbeat.
- Cần sticky session, rồi autoscaling “ngẫu nhiên” rớt user.
- Xử lý event duplicate (reconnect không có offset) — **idempotent consumer** trên client (key theo event id).
- Mở một WS mỗi lần component mount (chat widget + header + page = 3 socket).

**Câu hỏi nối**

- Test WS thế nào? (mock protocol nhỏ, contract test trên shape event, đừng e2e cả broker)
- Frame binary vs JSON?
- HTTP/2 + nhiều REST call vs custom BFF resource thay đổi chuyện này ra sao?

---

### 13.2. Thiết kế REST từ phía Frontend

**Họ thực sự hỏi gì**

“Nếu đổi được API, bạn nhờ backend điều gì?” Họ muốn **frontend contract**, không phải sự thuần khiết REST trong sách.

**Cách senior trả lời**

- **Quyết định:** Thiết kế URL và payload cho **màn hình**: list + filter + sort trong **query param** (share được, SSR đọc được), resource ID ổn định, **error envelope** UI nhánh được, pagination khớp UI (infinite scroll ≠ nút page), **idempotency** trên tiền và nút “create.”
- **Ràng buộc:** Browser sẽ retry, double-click, và mất tab. Mobile sẽ timeout. Bạn không kiểm soát mọi client (iOS, Android WebView cũ).
- **Failure mode:** Offset pagination **duplicate/skip** hàng khi list mutate; 500 kèm HTML nginx; POST `/order` tạo hai order; error chỉ có string nên không i18n hay highlight field được.
- **Đo:** p95 payload size mỗi màn, tỷ lệ create duplicate, tỷ lệ empty vs error vs zero-result, thời gian tới hàng hữu ích đầu tiên.

**Pagination**

- **Offset/limit:** bảng admin, nhảy-tới-trang. Vỡ khi item insert ở đầu (hàng duplicate/thiếu). Ổn với catalog ổn định.
- **Cursor / keyset:** feed, infinite scroll, “load more.” Để cursor **opaque** (`?cursor=`) để còn đổi được. Cất trong URL nếu feed cần share — thường thì không nên; dùng trong memory.
- **Luôn trả** `{ items, nextCursor, total? }`. Đừng giấu total nếu UI có “143,221 rows”; đừng tính `COUNT(*)` nếu UI không cần.
- Ưu tiên **list DTO hình BFF** (đã join name, permission) hơn bắt FE compose 3 API mỗi hàng.

**Error**

Thống nhất một body, không phải vibe:

```json
{
  "error": {
    "code": "QUOTE_EXPIRED",
    "message": "Price changed, refresh the quote",
    "fields": { "coupon": "Not combinable with sale items" }
  }
}
```

Map **status** cho control flow: `401` session, `403` permission (không phải “xin login”), `404` vs empty list, `409` conflict / version, `422` validation, `429` + `Retry-After`, `5xx` retry được với backoff. Không bao giờ parse **message** string trong logic UI.

**Idempotency**

- GET/PUT/DELETE được cho là idempotent; **POST create/pay thì không**.
- FE gửi `Idempotency-Key` (UUID) trên Pay / Submit Order, retry với **cùng** key, disable nút + timeout. Backend phải lưu kết quả đầu.
- Phía client: đừng chỉ `disabled={loading}` — refresh giữa chuyến bay vẫn double-post nếu không có key.

**Yêu cầu contract hình FE khác**

- Partial update (`PATCH`) với optimistic UI và `If-Match` / field version cho 409.
- Whitelist filter/sort (đừng nhận query language kiểu SQL tùy ý từ URL).
- Upload file: presigned URL, không POST JSON 200MB xuyên Nuxt.
- Batch endpoint khi table nếu không sẽ bắn N request.

**Tradeoff**

- REST resource vs BFF “screen DTO” — senior thường muốn **cả hai**: resource để reuse, BFF cho page đắt.
- Cursor vs offset — chọn từ UI, đừng cargo-cult cursor cho bảng settings 20 hàng.

**Gotcha production**

- Cache nhầm GET cá nhân hóa (`Cache-Control: public` trên `/api/me`).
- `204` kèm body, hoặc `200` bọc error — interceptor thành khảo cổ.
- Pagination `total` là ước lượng; UI hiện như số exact.

**Câu hỏi nối**

- Version thế nào? (URL `/v2` vs header vs JSON additive)
- Query vs body cho search phức tạp? (GET nếu cache được và ngắn; POST `/search` nếu query khổng lồ)

---

### 13.3. Loading, Error, Empty và Optimistic UI

**Họ thực sự hỏi gì**

“API chậm / flake. UI xử sự thế nào?” Đây là câu hỏi **product** mặc áo networking.

**Cách senior trả lời**

- **Quyết định:** Mọi view async có bốn state — **loading, error, empty, success** — cộng **stale** (đã có data, đang refresh) và **optimistic** (bạn đoán). Encode tường minh (TanStack Query / status `useAsyncData`), không phải súp `data && !error && !pending`.
- **Ràng buộc:** Perceived performance > RTT thô. Spinner 150ms còn tệ hơn không có gì. Hàng optimistic sai không rollback được còn tệ hơn chờ 300ms.
- **Failure mode:** Spinner mỗi lần gõ filter; empty state trông như error; optimistic create duplicate sau retry; error toast không recovery; SSR success rồi client refetch flash.
- **Đo:** time-to-first-content, bucket thời gian spinner, tỷ lệ recovery lỗi, tỷ lệ rollback, RUM event “blank page.”

**Pattern**

- **Pending vs refreshing:** load lần đầu → skeleton **khớp layout** (CLS). Refetch → giữ hàng cũ, indicator nhẹ. Nuxt `useAsyncData` + `lazy` / `keep-alive` payload trước.
- **Đừng flash:** delay spinner ~200ms; bỏ response thua race (AbortController, 13.5).
- **Empty ≠ error ≠ zero filter result.** “Chưa có order nào” (CTA) vs “Không order nào khớp filter” (clear filter) vs “Không load được order” (retry).
- **Error:** retry với backoff trên 5xx/network; đừng retry 4xx trừ 429. Copy **theo code**, kèm control retry. Error cấp widget, không phải cả shell (xem [19.2](./monitoring.md#192-error-boundaries-trong-vue)).
- **Optimistic:** chỉ khi rollback rẻ và conflict hiếm (toggle, rename, reorder). Với payment / inventory: **pessimistic** hoặc state “pending trên server.”

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

**Tradeoff**

- Skeleton vs spinner vs không gì (đã cache).
- Optimistic vs undo toast vs chờ.
- Global query cache vs “page này sở hữu request” — cache đúng cho list dùng ở hai chỗ; đó cũng là cách bạn dính bug **permission stale** nếu không key theo user/tenant.

**Gotcha production**

- SSR hydrate empty, client refetch rồi list nhảy (Nuxt payload mismatch).
- Optimistic UI vs **multi-tab** (BroadcastChannel / query broadcast).
- Coi `[]` là error vì `if (!data)`.

**Câu hỏi nối**

- Cancel search đang bay thế nào? (13.5)
- Pagination cursor sống ở đâu? (URL vs TanStack Query key)

---

### 13.4. CORS và Cookie từ phía Frontend

**Họ thực sự hỏi gì**

“Sao browser chặn API?” / “Sao cookie không được gửi?” Họ muốn bạn biết đây là **browser**, không phải axios khó tính.

**Cách senior trả lời**

- **Quyết định:** Ưu tiên **same-site** (browser → BFF trên `app.example.com` / `example.com/api`) để CORS và third-party cookie biến mất. Nếu bắt buộc cross-origin: `Access-Control-Allow-Origin: https://app.example.com` tường minh (không bao giờ `*` kèm credential), `Allow-Credentials: true`, FE `credentials: 'include'`.
- **Ràng buộc:** Cross-site cookie đang chết. `SameSite=None; Secure` là hack third-party cũ và sẽ tiếp tục vỡ. Đừng thiết kế SPA mới trên `app.foo.com` nói chuyện `api.bar.com` bằng cookie trừ khi có lý do SSO rất cũ.
- **Failure mode:** `*` + cookie (browser reject); preflight fail trên `Authorization` / `Content-Type: application/json`; CSRF trên POST auth bằng cookie; nghĩ CORS bảo vệ API khỏi non-browser (không phải).
- **Đo:** số preflight (cache OPTIONS qua `Access-Control-Max-Age`), tỷ lệ auth thành công sau login, tỷ lệ CSRF reject, bug Safari ITP trong RUM.

**Từ phía FE**

- Simple request vs **preflight**. `application/json` + custom header ⇒ OPTIONS. Đừng gắn header cho vui trên mọi GET.
- `fetch(url, { credentials: 'include' })` / axios `withCredentials: true`. Quên cái này trông như “401 ngẫu nhiên sau login.”
- Cookie flag bạn phải thuộc: `HttpOnly`, `Secure`, `SameSite=Lax` (default tốt cho first-party), `Path`, prefix `__Host-`. Lax **không** gửi cookie trên POST cross-site — đó là feature (CSRF), và vì sao OAuth callback cần cẩn thận.
- CSRF: cookie session ⇒ same-site **hoặc** double-submit / custom header server check. Bearer token trong memory không bị CSRF cùng cách (XSS mới là vấn đề). Xem note security; đừng mix cả hai một cách tồi.
- Nuxt: proxy `/api` trong Nitro/dev lên upstream để **localhost không cần CORS** lúc dev — và prod dùng cùng origin qua ingress.

**Tradeoff**

- Cookie session (HttpOnly, first-party) vs Bearer trong memory + refresh cookie. Senior chọn **BFF + first-party cookie** cho browser app trừ khi bạn là public API cho JS third-party.
- CORS trên từng microservice vs một origin BFF.

**Gotcha production**

- Staging FE `https://pr-123.preview.com` vs API `https://api.staging.com` — mọi preview origin phải được allowlist hoặc bạn dùng **proxy**.
- `localhost` vs `127.0.0.1` là origin khác nhau.
- CORS handshake WebSocket không giống `fetch`; cookie vẫn theo SameSite.

**Câu hỏi nối**

- CORS có chặn curl hit API không? (Không.)
- Auth cho mobile WebView thế nào?

---

### 13.5. AbortController và Timeout

**Họ thực sự hỏi gì**

“User gõ nhanh / navigate đi. Bạn vẫn để request chạy xong?”

**Cách senior trả lời**

- **Quyết định:** **Abort GET** đã thành thừa (search, đổi route, filter). **Timeout** mọi request (kể cả mutation) để TCP treo không thành spinner vô hạn. **Đừng abort mù mutation** (pay, save) khi unmount — để chúng chạy xong nếu không bạn sẽ retry và double-submit; thay vào đó disable navigation hoặc confirm, và giữ idempotency key.
- **Ràng buộc:** `fetch` mặc định không timeout. Vue unmount không cancel gì trừ khi bạn nối dây. Nuxt `useAsyncData` / VueUse nhận signal được; axios cần `AbortController` (không phải `CancelToken` cũ).
- **Failure mode:** abort POST login khi component re-render; bỏ qua `AbortError` rồi hiện toast đỏ; một global timeout 3s giết upload file; leak listener vì không abort.
- **Đo:** aborted vs failed vs timed-out trong RUM, p95 duration theo endpoint, tỷ lệ request mồ côi sau đổi route.

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

Trong Vue: tạo controller trong `watchEffect` / `watch` trên query, **abort trong cleanup**. Trong Nuxt, truyền `signal` vào `$fetch` gắn với `vue:error` / unmount. Khi rời route, abort fetch **list**, không phải **checkout đang bay**.

**Tradeoff**

- Abort hung hăng (tiết kiệm battery và server) vs analytics không bao giờ thấy search hoàn thành.
- `AbortSignal.timeout` (chuẩn) vs `Promise.race` tự chế (đừng; race mà không abort thì socket vẫn chạy).

**Gotcha production**

- Polyfill `AbortSignal.any` / `timeout` nếu còn support WebView cũ.
- Axios adapter không forward `signal`.
- `$fetch` / ofetch có thể **wrap** `AbortError` — inspect `err.name` / `err.cause`, vẫn đừng toast.
- Service worker bỏ qua abort.
- Coi timeout như 401 rồi logout user.

**Câu hỏi nối**

- Cái này tương tác optimistic UI thế nào? (đừng abort mutation bạn đã phản ánh)
- Timeout WS thế nào? (heartbeat, không phải AbortController)

---

[← Back to Overview](../../README.md)
