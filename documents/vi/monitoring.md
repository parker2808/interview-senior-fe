# Monitoring & Error Handling

Đây là tài liệu ôn phỏng vấn senior frontend về **những gì bạn biết về production sau khi đã ship**. Họ không hỏi bạn dán `Sentry.init`. Họ muốn **sampling, PII, release, signal vs noise, Vue thực sự bắt gì, INP không phải FID, và bạn có page người không**.

Decision → constraint → failure mode → measure. Vue 3 / Nuxt-first; ý tưởng telemetry không phụ thuộc framework.

---

## Table of Contents

1. [Theo dõi lỗi với Sentry](#191-theo-dõi-lỗi-với-sentry)

2. [Error Boundaries trong Vue](#192-error-boundaries-trong-vue)

3. [Theo dõi Performance](#193-theo-dõi-performance)

4. [Chiến lược Logging](#194-chiến-lược-logging)

5. [Alerting](#195-alerting)

6. [Playbook feature flag + error spike](#196-playbook-feature-flag--error-spike)

---

## 19. Monitoring & Error Handling

### 19.1. Theo dõi lỗi với Sentry

**Họ thực sự hỏi gì**

- “Dùng Sentry trên production thế nào?”
- “Issue này 50k event mà không ai quan tâm — vì sao?”
- “Prod không có stack đọc được — vì sao?”

**Cách senior trả lời**

- **Quyết định:** Sentry (hoặc tương đương) là một **product**: **biết release**, **được sample**, **đã scrub PII**, **có owner**. Bạn upload **hidden source map** cho git SHA đó (12.1), set `release` + `environment` + `dist`, tag **feature flag**, và route issue tới **codeowners** — không phải vòi nước `#frontend`.
- **Ràng buộc:** Browser sinh junk vô hạn (extension, network blip, ad blocker). Event không giới hạn tốn tiền **và attention**. Trace sample 100% sẽ chảy quota lúc campaign (16.5).
- **Failure mode:** DSN trong repo không có `beforeSend`; email trong `setUser`; map trên CDN công khai; `release: 'prod'` mãi nên map không bao giờ khớp; gom 20 bug thành một; capture 401 đã handle như fatal; Replay 100% với PII trong DOM.
- **Đo:** % lỗi prod **có mapped stack**, **tuổi issue đến owner**, **actionable** vs ignored, cháy quota, tương quan release với spike.

**Sampling**

- **Error:** thường 100% *event* ổn ở traffic vừa; khi scale, sample **client lặp**, giữ **hết** N issue mới đầu. Đừng sample mất tính unique Sev-1 — sample **volume**.
- **Trace / `tracesSampleRate`:** 0.1–0.2 điển hình; tăng trên release xấu. Transaction không phải “debug nhiều hơn,” chúng là **budget**.
- **Session Replay:** thấp cho session khỏe (`replaysSessionSampleRate: 0.01`), **1.0 lúc error** có thể — **mask hết text/media** trừ khi có câu chuyện legal. Replay là cách bạn leak địa chỉ.

**Scrub PII**

Giả định SDK sẽ thấy. `beforeSend`: lột `email`, `Authorization`, token trong URL, form body, `user.name`. Ưu tiên **opaque user id**. Đừng nhét access token vào breadcrumb. Nuxt server: đừng `captureException` cả header `event.node.req`.

Legal: DPA, data sống ở đâu, Replay = có thể là data **special category** nếu health/finance hiện trên màn.

**Release và source map**

- `Sentry.init({ release: SHA })` **bằng** GitOps digest bạn deploy (14.1).
- Build `sourcemap: 'hidden'`, CI upload, map **không** trên nginx.
- `dist` / build id khi ship nhiều artifact mỗi SHA (SSR server vs client).
- Nếu stack nói `chunk-7a2.js:1:20483`, câu trả lời phỏng vấn là **map + release lệch**, không phải “Vue minify quá mạnh.”

**Noise vs signal**

- Inbox: **regression trên release này**, issue mới, spike — không phải vòng `ResizeObserver` 3 năm tuổi từ extension.
- `denyUrls` cho chrome-extension, `ignoreErrors` cho chuỗi bot/network đã biết — **cẩn thận**, review list.
- Đừng `captureException` mọi `console.error` hoặc mọi `$fetch` 404 bị reject.
- **Grouping:** fingerprint theo **message ổn định + route + feature**, không theo user id. Custom fingerprint khi minification gom bug unrelated.

**Ownership**

- `CODEOWNERS` → Sentry ownership / team routing (tag `checkout` vs `marketing`).
- Issue không owner là **bug process**. Alerting (19.5) page **service owner**, không Slack-at-everyone.

```ts
Sentry.init({
  app,
  dsn: dsnFromRuntimeConfig, // not a hardcoded secret in a public gist
  release: import.meta.env.VITE_COMMIT_SHA,
  environment: "production",
  tracesSampleRate: 0.15,
  replaysOnErrorSampleRate: 1,
  beforeSend(event) {
    // Decision: drop network 401s; scrub email; keep stack.
    if (event.tags?.http_status === "401") return null;
    return scrubPii(event);
  },
});
```

**Tradeoff**

- Breadcrumb dài vs PII.
- Một project vs tách marketing/app (quota và ownership vs DSN duplicate).

**Gotcha production**

- Ad blocker giết DSN — bạn cần **first-party proxy** (`/ingest`) nếu quan tâm những user đó.
- SSR double-init, hoặc capture Node error bằng browser SDK.
- `sampleRate` trên error giấu crash IE/WebView hiếm bạn vẫn support.

**Câu hỏi nối**

- Gắn Sentry issue với PR thế nào? (release → git SHA → PR)
- Vì sao grouping merge hai bug? (fingerprint)

---

### 19.2. Error Boundaries trong Vue

**Họ thực sự hỏi gì**

“Bạn có error boundary không?” Nếu dừng ở `onErrorCaptured`, họ sẽ hỏi nó **bỏ sót gì**.

**Cách senior trả lời**

- **Quyết định:** Vue **không** có error boundary kiểu React bọc mọi thứ. `onErrorCaptured` / `app.config.errorHandler` bắt **lỗi render/lifecycle/setup sync trong cây con**. Bạn vẫn cần **`window.onunhandledrejection`**, **`errorHandler`**, và **try/catch local quanh async** (event handler, `watch`, `$fetch`). Cô lập **widget** để một chart không white-screen shell.
- **Ràng buộc:** Hầu hết bug FE production là **async** (API, click handler, `router.beforeEach`). Chúng **đi vòng** `onErrorCaptured`.
- **Failure mode:** Một `ErrorBoundary` ở `App.vue` return `false` nuốt hết không Sentry; “try again” remount vào cùng poison route; tin `onErrorCaptured` bắt `submitOrder()`.
- **Đo:** số unhandledrejection, RUM white-screen (`pageshow` + root rỗng), tỷ lệ recovery cấp widget.

**`onErrorCaptured` / errorHandler bắt gì**

- Render function throw, `computed` throw, hook trong setup throw **đồng bộ**.
- Custom `errorHandler` trong `main.ts` / Nuxt `vue:error` — **luôn** gửi Sentry, rồi hiện fallback.

**Chúng không bắt**

| Bỏ sót | Bạn pair với |
| --- | --- |
| `async` setup / `await $fetch` không handle | `try/catch`, error `useAsyncData`, TanStack Query `isError` |
| `@click` / native listener | `try/catch` trong handler hoặc wrapper |
| `setTimeout` / `requestAnimationFrame` | tương tự |
| Promise không `await` | `unhandledrejection` |
| Lỗi trong Vue app **khác** / MF remote | mỗi runtime cần handler riêng |
| Plugin / native code | window event `error` |

```ts
// Decision: three layers. None of them is optional in prod.
app.config.errorHandler = (err, _instance, info) => {
  Sentry.captureException(err, { extra: { info } });
};

window.addEventListener("unhandledrejection", (e) => {
  Sentry.captureException(e.reason);
});

window.addEventListener("error", (e) => {
  Sentry.captureException(e.error ?? e.message);
});
```

Widget boundary: `onErrorCaptured` → log → `return false` để **chặn** white-screen, hiện fallback widget (13.3). **Đừng** return false ở root rồi giấu bug khỏi handler Nuxt trừ khi bạn đã capture.

Nuxt: `app.config.errorHandler` + `showError` / `error.vue` cho fatal **cấp route**; giữ widget boundary cho dashboard (16.4).

**Tradeoff**

- Boundary mịn (UI sống nhiều hơn) vs user tiếp tục trong state **hỏng** (checkout với widget totals chết — đôi khi bạn **nên** chặn).
- React error boundary vs Vue: đừng claim chúng giống nhau trong phỏng vấn mixed-stack; giải thích lỗ hổng async ở **cả hai** (React boundary cũng miss event handler).

**Gotcha production**

- `return false` + không Sentry = fail thầm, tệ nhất mọi thế giới.
- Recursion: fallback component throw.
- Dialog teleport ra ngoài cây boundary.

**Câu hỏi nối**

- Test boundary thế nào? (child throw lúc render; assert fallback **và** mock capture)
- Lỗi Suspense? (async setup — handle như data error, không chỉ render error)

---

### 19.3. Theo dõi Performance

**Họ thực sự hỏi gì**

“Track Core Web Vitals thế nào?” Nếu bạn dẫn **FID**, bạn đã cũ.

**Cách senior trả lời**

- **Quyết định:** Track **LCP, INP, CLS** (và TTFB/FCP như diagnostic) với **RUM** là source of truth, **lab** (Lighthouse/WebPageTest CI) như gate **budget/regression**. Đặt numeric budget trên template (`/` vs `/app`), không phải vanity score 100.
- **Ràng buộc:** Lab là laptop median với throttle giả. RUM là device thật, cache thật, third-party thật. Chúng **sẽ lệch**. Bạn cần cả hai.
- **Failure mode:** Tối ưu FID mãi; ăn mừng Lighthouse 98 trong khi INP mobile 400ms; không attribution (element, route, country); inject ba tag analytics **gây** vấn đề INP; gate PR trên score nhiễu.
- **Đo:** **p75 INP / LCP / CLS theo route** (CrUX + RUM của bạn), lab budget trên byte JS và LCP, attribution long-task.

**FID đã lỗi thời — dùng INP**

- **FID** (First Input Delay) chỉ đo **tương tác đầu**, thường là cái may. **Deprecated.**
- **INP** (Interaction to Next Paint) nhìn **responsiveness suốt đời page** — gần “UI cảm giác jank.” Fix: giảm việc main-thread, bẻ long task, đừng làm việc nặng lúc input (filter 50k hàng mỗi phím — debounce + worker/virtualize, 16.4).
- **LCP:** paint lớn nhất — image, hero text, hoặc SSR HTML. Hybrid marketing (16.5) sống chết ở đây.
- **CLS:** font, image không dimension, banner inject, ads. Skeleton phải **giữ chỗ** (13.3).

**RUM vs lab**

| | Lab (Lighthouse CI) | RUM (web-vitals → backend / Sentry / Datadog) |
| --- | --- | --- |
| Tốt cho | Budget PR, reproducible | Thực tế, segment, regression sau ads |
| Nói dối khi | Cache, CPU, extension, địa lý | Sampling, ad blocker, SPA cần listener **route** |

SPA/Nuxt: report vital **theo route**, không chỉ first load. Soft navigation quan trọng với INP/LCP (nơi được support).

```ts
import { onINP, onLCP, onCLS } from "web-vitals";

function report(m: { name: string; value: number; id: string }) {
  sendToRum({ ...m, route: route.name, release: SHA });
}

onINP(report);
onLCP(report);
onCLS(report);
```

**Budget**

- CI: **bytes** (gzip entry, tổng JS trên `/`) + có thể lab screenshot LCP — xem 12.2.
- Prod: ngưỡng p75 (INP tốt < 200ms, LCP < 2.5s, CLS < 0.1) **cắt** theo route. Alert trên **regression vs tuần trước**, không phải một session xấu.

**Tradeoff**

- Third-party tag (GTM, chat) vs INP. Senior load chúng **sau** interaction hoặc lúc idle, và **giết** được bằng flag (19.6).
- Độ trễ field data (CrUX lagged) vs first-party RUM.

**Gotcha production**

- Đo LCP trên logged-in shell không phải LCP element của user.
- `web-vitals` không `attribution` khi bạn cần element.
- Hydration lúc 3s phá INP click đầu.

**Câu hỏi nối**

- Debug INP thế nào? (Profiler, long task, INP attribution, interaction)
- TBT vs INP? (TBT thiên lab; INP là field metric)

---

### 19.4. Chiến lược Logging

**Họ thực sự hỏi gì**

“Bạn log gì trên client?”

**Cách senior trả lời**

- **Quyết định:** **Không `console.log` trên prod.** Client gửi **structured event** tới collector (hoặc Sentry breadcrumb có budget). **PII tối thiểu**. **Correlation id** đến từ **BFF** (`x-request-id`) và gắn vào `$fetch` fail để FE + API + trace khâu lại. Verbosity debug **không** bật mặc định.
- **Ràng buộc:** Browser thù địch (quota, adblock, PII, untrusted). Log server (Nitro) mới là chỗ đúng cho context sát secret.
- **Failure mode:** log access token; `JSON.stringify(user)` gồm email; 200 log mỗi scroll handler; `console.log` sót trong Pinia store; không correlate gì nên một 500 thành ba ticket.
- **Đo:** % 5xx có `request_id` khớp trong Sentry extra, log volume $, phát hiện audit PII.

**Level**

- DEBUG: local / `?debug=` gated, mặc định không sample trên prod.
- INFO: hiếm trên client (nav tới checkout, **attempt id** payment không phải thẻ).
- WARN: vấn đề đã recovery (retry thành công).
- ERROR: đường captured exception — **một lần**, kèm context, không trong loop.

**Structured event**

```ts
logger.error("checkout.pay_failed", {
  requestId: lastRequestId, // from BFF header
  code: err.code,           // QUOTE_EXPIRED, not the raw Axios object
  flag: flags.checkoutV2,
  release: SHA,
});
```

Đừng log payload order nếu chứa PII. Có log **id**.

**Correlation**

- BFF generate `x-request-id` (hoặc W3C `traceparent`). FE giữ N id cuối mỗi tab, gắn lúc error.
- Sentry `trace` integration + OpenTelemetry nếu org đã có — đừng invent id thứ hai.
- Session id ≠ user id.

**Tradeoff**

- First-party log pipeline vs “Sentry là đủ.” Sentry cho **exception + trace**; product analytics là sink khác. Đừng dual-write mọi thứ vào cả hai.

**Gotcha production**

- Nguồn `console` từ Vue warning trên prod — `app.config.warnHandler`.
- Log full GraphQL query kèm variable (password, token).
- SSR in user record ra **pod stdout**.

**Câu hỏi nối**

- Nhìn Sentry hay log trước? (Sentry cho throw chưa biết; log/trace cho business failure đã biết)
- Tránh leak PII khi Replay + log cùng lúc thế nào?

---

### 19.5. Alerting

**Họ thực sự hỏi gì**

“Bạn có page người vì cái này không?”

**Cách senior trả lời**

- **Quyết định:** **Page** (đánh thức người) chỉ vì đau **user nhìn thấy, đang xảy ra, actionable** trên **critical path**, kèm **runbook**. Còn lại là issue **ticket / Slack / ngày làm việc sau**. FE page trên **triệu chứng** (vách conversion checkout, error rate trên `/pay`, spike chunk 404 sau deploy), không phải một `TypeError`.
- **Ràng buộc:** Alert fatigue là cách bạn miss Sev-1 thật. Quota và sample rate nghĩa là **số event thô** là pager tồi.
- **Failure mode:** `#alerts` 400 message/ngày; page vì `window is not defined` từ crawler; không owner; page 3 giờ sáng vì CLS 0.12 trên blog.
- **Đo:** page mỗi tuần, **% là thật**, time-to-ack, time-to-mitigate, page ngoài giờ (phải hiếm với FE).

| Page (on-call) | Ticket / Slack |
| --- | --- |
| Spike **JS error checkout/pay/login** vs baseline, cùng release | Issue Sentry mới không critical |
| **Chunk 404** / RUM white screen trên `/` sau deploy | INP chậm trên admin route hiếm |
| Error rate × flag **checkout_v2** (19.6) | Bug một user |
| SSR **5xx** / pod crash loop Nitro | Lighthouse score tụt 4 điểm |
| Auth **refresh storm** / logout loop (18.1) | Nhiễu từ browser version mới — điều tra ngày mai |

**Cách bạn nối dây**

- Dựa **rate + baseline** (z-score / cùng weekday), không tuyệt đối “> 50 event.”
- Gắn **release**, **route**, **flag**.
- Page tới **owner checkout** lúc 2 giờ sáng, không intern vừa đụng CSS.
- Mọi alert pageable có **link runbook**: rollback, tắt flag, purge CDN.

**Tradeoff**

- Độ nhạy vs giấc ngủ. Bắt đầu **quá yên**, rồi siết — không ngược lại.
- Synthetic canary (login + pay trên prod mỗi 5 phút) thường tốt hơn page theo error-count.

**Gotcha production**

- Deploy gây **blip** error ngắn (HTML cũ + client mới) — chờ 2–3 phút hoặc page trên spike **kéo dài**.
- Đổi sampling trông như error giảm (sức khỏe giả).

**Câu hỏi nối**

- SLO cho FE? (availability critical journey, INP budget như SLO **mềm**)
- Ai on-call cho static SPA? (vẫn phải có người — CDN/GitOps)

---

### 19.6. Playbook feature flag + error spike

**Họ thực sự hỏi gì**

“Bạn rollout flag 10% rồi Sentry nổ. Kể từng bước.”

**Cách senior trả lời**

- **Quyết định:** **Giết flag trước** nếu spike trên critical path và bám flag. Confirm bằng telemetry **đã cắt** (error rate **theo flag variant**, release, route). Đừng debug 20 phút ở rollout 30%. Sau mitigate: giữ flag tắt, **đừng xóa evidence**, rồi RCA (map, replay **nếu** PII-an toàn, HAR).
- **Ràng buộc:** Correlation không phải causation — deploy, flag, và traffic thường dịch cùng lúc. Bạn cần **dimension**. Fail-safe: nếu chính flag service down, app phải **default closed** cho payment (14.4).
- **Failure mode:** Tăng flag lên 50% “để có thêm signal”; tắt **hết** flag; fix forward trên `main` mà không disable; đổ một Sentry issue ngẫu nhiên tháng trước đã có; hydrate hai variant (SSR/client lệch) **chính là** bug.
- **Đo:** time-to-disable, % user flagged trong error set vs control, incident lặp mỗi flag, flag sót ở 100%.

**Playbook**

1. **Graph:** error / INP / conversion **tách theo flag key**. Nếu treatment >> control, bạn đã có.
2. **Mitigate:** set flag 0% (hoặc implementation trước). Announce (17.7).
3. **Stabilize:** confirm control khỏe; để ý **HTML cache** vẫn hiện UI mới (16.2).
4. **Preserve:** link Sentry issue, release SHA, payload đánh giá flag, Replay **không** PII nếu được.
5. **RCA:** root cause thật (null trong composable, thêm 3MB trên `/`, loop 401). Thêm **test** và **gate** (budget, unit trên composable).
6. **Re-roll:** 1% staff → 5% → 25%, cùng dashboard. Đừng nhảy 100% vì “đã fix.”
7. **Cleanup:** ticket gỡ flag khi tốt nghiệp (14.4).

**Thêm SSR / Nuxt**

Bucket **một lần**, gửi variant trong payload, dùng trên client. Spike “Hydration node mismatch” sau flag thường là **cái này**, không phải logic feature.

**Tradeoff**

- Giết nhanh vs gom thêm 10 phút Replay — giết trước trên pay/login.
- Experiment vs kill switch: experiment **phải** có đường giết không phải “chờ scientist.”

**Gotcha production**

- Flag evaluate trong GTM, không phải BFF — bạn không slice Sentry được.
- Sticky bucketing theo `anonymousId` reset, nên “10%” là máy xay.
- Tắt flag không unload chunk độc **đã tải** đến khi refresh — bảo user / force reload lúc fatal.

**Câu hỏi nối**

- Test cả hai variant trên CI thế nào? (14.4)
- Nếu spike là CLS không phải error? (vẫn giết flag nếu là campaign hero)

---

[← Back to Overview](../../README.md)
