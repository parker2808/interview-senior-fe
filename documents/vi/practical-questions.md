# Practical Interview Questions

Đây là câu “bạn thực sự làm việc thế nào?” Junior mô tả tool và dán axios interceptor `localStorage.removeItem('token')` rồi `router.push('/login')`. Senior nói **delivery, risk, git như contract team, và auth như distributed system trong browser**.

Vue 3 / Nuxt-first. Cùng mechanics 401 áp cho React/Next.

---

## Table of Contents

1. [Xử lý 401 Error → Redirect to Login](#181-xử-lý-401-error--redirect-to-login)

2. [Công cụ Quản lý Dự án & Quy trình](#182-công-cụ-quản-lý-dự-án--quy-trình)

3. [Đánh giá Issue: Bug hay Yêu cầu Tính năng?](#183-đánh-giá-issue-bug-hay-yêu-cầu-tính-năng)

4. [Quy trình Git](#184-quy-trình-git)

5. [Giải quyết Xung đột Git](#185-giải-quyết-xung-đột-git)

6. [Gộp Commits](#186-gộp-commits)

7. [Xử lý production incident với tư cách Frontend](#187-xử-lý-production-incident-với-tư-cách-frontend)

8. [Onboard codebase Vue lạ trong tuần đầu](#188-onboard-codebase-vue-lạ-trong-tuần-đầu)

---

## 18. Practical Interview Questions

### 18.1. Xử lý 401 Error → Redirect to Login

**Họ thực sự hỏi gì**

“API trả 401 — client làm gì?” Câu junior nằm mọi blog. Họ chờ **refresh, queue, loop, return URL, multi-tab**.

**Cách senior trả lời**

- **Quyết định:** Coi 401 là **“access token fail,” không phải “logout user”** trừ khi refresh cũng fail. **Single-flight refresh**, **replay request gốc**, **không bao giờ intercept login/refresh call**, **giữ return URL**, **broadcast logout/login xuyên tab**. Redirect login là bước **cuối**, và không vào loop.
- **Ràng buộc:** Browser có nhiều tab. Access token sống ngắn. Refresh cookie là HttpOnly (tốt). POST login cũng 401 khi mật khẩu sai — đó **không** phải session hết hạn.
- **Failure mode:** interceptor clear storage và redirect mọi 401 → refresh endpoint 401 → redirect vô hạn; 20 tab stampede refresh; mất return URL (deep link `/orders/88`); cache user A hiện cho user B sau login; nảy `/login` → `/` → `/login`.
- **Đo:** tỷ lệ refresh thành công, số refresh duplicate, thời gian “bị đá login” sai, Sentry issue liên quan auth, ticket session “kẹt.”

**Interceptor junior (và vì sao fail)**

Clear token + `router.push('/login')` trên mọi 401:

- Giết session mà **refresh** đã cứu được.
- Race: 8 gọi `useAsyncData` song song → 8 redirect.
- Đụng **login API** (sai mật khẩu là 401) và đá bạn khỏi form.
- Không restore `fullPath` sau IdP.
- Bỏ qua tab khác vẫn giữ refresh giờ đã invalid.

**Mechanics senior**

1. **Phân loại request.** Bỏ interceptor cho `/api/auth/login`, `/logout`, `/refresh`. Chúng tự handle error.
2. **Single-flight refresh.** 401 đầu trên call được bảo vệ khởi động **một** `refreshPromise`. Mọi người khác **await cùng promise**.
3. **Queue / replay.** Call fail retry **một lần** sau khi refresh thành công, với cookie/token mới. Nếu refresh fail: **đường logout**.
4. **Đường logout:** clear cache **client** (Pinia, TanStack Query — **key theo user**), broadcast sang tab, redirect login **kèm return URL** nếu route hiện tại chưa public.
5. **Return URL:** `?redirect=` chỉ cho **internal relative path**. Open-redirect là bug thật (`?redirect=https://evil`).
6. **Multi-tab:** `BroadcastChannel('auth')` (hoặc event `storage`). Logout tab A logout tab B. Refresh tab A không cần tab B cũng stampede — cookie đã share; vẫn single-flight **mỗi tab** + message tùy chọn “token rotated.”
7. **SSR (Nuxt):** 401 trên server lúc `useAsyncData` không phải `window.location`. Navigate bằng `navigateTo`, tránh loop redirect trên chính **page** login, đừng leak refresh cookie vào client bundle.

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

Sau login: `navigateTo(safeInternalPath(redirect) ?? "/app")`, rồi **invalidate** query (đừng reuse cache ẩn danh).

**Tradeoff**

- Cookie session (BFF) vs Bearer trong memory. Cookie + BFF same-origin đơn giản hơn cho browser (13.4).
- Redirect vs modal “session hết hạn” inline trên form dài (save draft trước).

**Gotcha production**

- Clock skew: token “hết hạn” trên client nhưng chưa trên server, hoặc ngược lại.
- 401 vs 403: 403 là **permission** — đừng logout (đó là cách bạn loop trên một widget bị cấm).
- Service worker cache GET `/api/me` 200 mãi.
- Mobile Safari ITP drop refresh cookie.

**Câu hỏi nối**

- Test cái này thế nào? (fake 401 rồi 200 tuần tự; hai caller song song; login 401)
- CSRF trên POST refresh? (same-site cookie + custom header)

---

### 18.2. Công cụ Quản lý Dự án & Quy trình

**Họ thực sự hỏi gì**

“Jira hay Linear?” Họ **không quan tâm tool nào**. Họ quan tâm **bạn chạy delivery thế nào**.

**Cách senior trả lời**

- **Quyết định:** Tool là **database**. Việc bạn là **cắt slice work**, **làm status thành thật**, **nổi risk sớm**, và **giữ increment user nhìn thấy**. Bạn dùng thứ họ có.
- **Ràng buộc:** Việc FE giấu trong “90% xong, chờ API / design / QA.” Nếu board không hiện điều đó, bạn đang nói dối forecast (17.3).
- **Failure mode:** Ceremony không quyết định; story 40 point; “update ticket” thay vì update **risk**; WIP không giới hạn; thờ tool PM.
- **Đo:** cycle time, WIP, blocker >1 ngày không có tên trên nó, % sprint goal **user nhìn thấy**.

**Cách bạn chạy delivery (nói vậy)**

- **Slice dọc:** một user path kèm loading/error/empty, không phải “hết component rồi hết API.” Flag cho phần chưa xong (14.4).
- **Definition of done** gồm keyboard a11y trên control, analytics, và empty state — không phải “UI giống Figma.”
- **Standup:** blocker và **date đổi**, không phải nhật ký. Nếu không cần standup, bạn vẫn cần kênh blocker.
- **Risk:** viết lên ticket (“VAT API contract TBD — nổ estimate”). Mang vào planning, không phải Friday.
- Ticket **discovery vs delivery** để spike không giả làm feature.

Map tool chỉ như chú thích: Jira/Linear/GitHub Issues, Figma, Slack, Notion. Đổi tool chưa từng fix bài WIP.

**Tradeoff**

- Scrum vs Kanban: team FE product thường **Kanban với overlay planning tuần**. Đừng chết vì tôn giáo.
- Sprint chặt vs production support interrupt-driven — staff interrupt nếu không nó sẽ ăn sprint anyway.

**Gotcha production**

- Ticket xanh, user đỏ (không RUM trong cuộc “done” — 19.3).
- Design Figma vẫn đổi sau “dev done.”

**Câu hỏi nối**

- Làm việc với PM viết solution không phải problem thế nào? (17.5)
- Unplanned prod bug vs sprint thế nào? (18.3, 18.7)

---

### 18.3. Đánh giá Issue: Bug hay Yêu cầu Tính năng?

**Họ thực sự hỏi gì**

“Đây là bug hay feature?” Họ test bạn **cãi nhãn** hay nói **contract, severity, và impact user**.

**Cách senior trả lời**

- **Quyết định:** So hành vi với **product contract** (spec, ADR, copy UI sẵn, API docs, legal). Nếu user kỳ vọng hợp lý và ta phá — **defect**. Nếu ta chưa hứa — **change**. Rồi **severity** quyết hotfix vs sprint sau. Issue type Jira là sổ sách.
- **Ràng buộc:** Support file mọi thứ là bug. Sales file mọi thứ là hotfix. Việc bạn là **impact**: blast radius, workaround, toàn vẹn data, brand/legal.
- **Failure mode:** Cãi nhãn trong khi checkout gãy; gọi requirement v1 thiếu là “feature” để tránh hotfix; ship “bugfix” thực ra là đổi schema không có PM.
- **Đo:** escaped defect, tỷ lệ hotfix, time-to-mitigate Sev-1, thời gian cãi nhãn (phải ~zero).

| | Defect | Change |
| --- | --- | --- |
| Contract | Ta nói X / từng X | X mới |
| Đường điển hình | Hotfix hoặc sprint này theo severity | Prioritize trên roadmap |
| Risk | Regression; thêm test | Scope, design, flag |

**Severity (impact user, không phải cảm xúc)**

- **Sev-1:** payment, auth lockout, mất/leak data, white screen toàn phần trên `/` — **mitigate ngay** (flag/rollback), PR kèm test, incident comms (17.7).
- **Sev-2:** path lớn gãy, workaround đau — trong ngày / deploy kế.
- **Sev-3:** khó chịu, có workaround — scheduled.
- **Cosmetic:** backlog. Đừng trật release train.

Case xám: “Chưa build export nhưng nút hiện” là **defect trong UI contract**. “Xin thêm export” là change. **Accessibility** fail WCAG trên control đã ship là defect, không phải nice-to-have.

**Tradeoff**

- Fix forward vs revert: revert nếu blast radius là cả release; fix forward nếu revert tệ hơn.
- “Won’t fix” cần lý do ghi lại (browser không support, v.v.).

**Gotcha production**

- “Bug” thầm là đổi pricing rule — đó là product + legal.
- Dùng “là feature” để skip RCA.

**Câu hỏi nối**

- Ai quyết severity? (on-call + PM; FE cung cấp blast radius từ RUM)
- Nếu PM muốn nó là feature để bảo vệ dashboard SLA? (đừng fake metric)

---

### 18.4. Quy trình Git

**Họ thực sự hỏi gì**

“Gitflow hay trunk-based?” Nhiều deck vẫn vẽ Gitflow. Team Vue product thường **không nên**.

**Cách senior trả lời**

- **Quyết định:** **Trunk-based** (branch sống ngắn từ `main`, PR, CI gate, flag cho việc chưa xong) cho team FE product ship mỗi ngày. **Gitflow** (`develop` + `release/*` + `hotfix/*`) khi bạn maintain **nhiều version đã ship** (mobile wrapper, on-prem, release train bị regulate). Đừng Gitflow vì blog nói “phổ biến nhất.”
- **Ràng buộc:** `main` **luôn releasable**. Chỉ chạy được với CI gate (14.2) và flag (14.4). `main` protected: review, CI xanh, không force-push.
- **Failure mode:** branch `feature/user-profile` dài tuần; `develop` thối vs `main`; commit thẳng `main` không CI; conventional commit làm sân khấu trong khi `main` không bisect được.
- **Đo:** tuổi thọ branch, thời gian SHA → prod, tỷ lệ revert, phút `main` gãy.

**Branch sống ngắn**

Vài giờ đến vài ngày. Integrate sau flag nếu product slice lớn hơn. Rebase/merge `main` mới thường xuyên (18.5).

**Conventional commit**

`feat:`, `fix:`, `perf:`, `revert:` — hữu ích cho changelog và **grep**. Không thay PR description tốt. Đừng bikeshed `chore` vs `ci` trong review (17.6).

**Protected main**

Required check: typecheck, unit, build, budget. CODEOWNERS trên `/packages/ui` và auth. Không admin force-push trừ disaster recovery đã document.

**Tradeoff**

- PR mỗi change vs stacked PR cho việc lớn.
- Release branch cho hotfix trên tag tuần trước trong khi `main` đã đi — hiếm, tường minh.

**Gotcha production**

- `main` xanh nhưng CDN vẫn HTML cũ (16.2) — git ổn, delivery không.
- Dùng Gitflow *và* flag *và* preview env — ba cách giấu việc chưa xong, không cái nào có owner.

**Câu hỏi nối**

- Ship hotfix thế nào? (branch từ **prod tag**, hoặc revert+forward trên trunk nếu deploy từ main)
- Monorepo: vẫn một `main`.

---

### 18.5. Giải quyết Xung đột Git

**Họ thực sự hỏi gì**

“Rebase hay merge?” và “conflict bạn không cứ pick một phía.”

**Cách senior trả lời**

- **Quyết định:** **Rebase** (hoặc merge từ `main`) trên **branch sống ngắn của bạn** để history tuyến tính nếu team thích. **Merge commit** lên `main` nếu đó là house style — cả hai ổn. **Không bao giờ rewrite shared history** (`push --force` lên `main` hoặc branch người khác đang ở). Sau conflict, chạy **test** vì **semantic conflict** không hiện `<<<<<<`.
- **Ràng buộc:** Git resolve text, không phải behavior. Hai PR cùng thêm field Pinia hoặc tên route có thể “merge sạch” rồi crash runtime.
- **Failure mode:** force-push branch đã rebase reviewer đã checkout mà không báo; resolve bằng cách nhận incoming mù; skip test; rebase public feature branch mười người dùng.
- **Đo:** tỷ lệ conflict (cao quá → branch quá dài), regression sau merge “đã resolve conflict.”

**Rebase vs merge**

| | Rebase branch của bạn | Merge `main` vào branch của bạn |
| --- | --- | --- |
| History | Tuyến tính | Thêm merge commit |
| Risk | Rewrite commit *của bạn* — OK nếu **bạn là người push duy nhất**, hoặc dùng `--force-with-lease` | An toàn hơn cho shared branch |
| `main` | Thường squash-merge hoặc merge PR (18.6) | Cùng vậy |

Đừng rebase commit **đã trên `main`**.

**Semantic conflict mà test bắt**

- Hai phía thêm auto-import `useUser`.
- Route `/orders` register hai lần.
- i18n key bị ghi đè copy khác.
- CSS cả hai đổi cùng token; visual snapshot fail.

Nói bạn sẽ **chạy feature, không chỉ compiler**.

**Tradeoff**

- `rerere` cho monster branch sống lâu vs **không có** branch đó.
- Pair conflict gnarly vs 40 phút đoán.

**Gotcha production**

- Resolve `package-lock` / `pnpm-lock.yaml` tay sai.
- Giữ cả hai Vue import rồi ship hai bản (12.1).

**Câu hỏi nối**

- `--force-with-lease` là gì?
- Binary conflict (image, Figma)? (pick một, đừng merge)

---

### 18.6. Gộp Commits

**Họ thực sự hỏi gì**

“Bạn có squash không?” Có **phạm vi** đúng.

**Cách senior trả lời**

- **Quyết định:** **Squash lúc merge PR** (GitHub “Squash and merge”) cho feature branch ồn (`wip`, “fix typo”) để **`main` bisect được** với một commit ≈ một change review được. **Đừng squash public history** đã trên `main`. Đừng squash PR cố ý **nhiều logical commit** nếu team dùng vậy cho granularity revert — nhưng khi đó mỗi commit phải xanh.
- **Ràng buộc:** `git bisect` và `git revert` là tool production. Merge “WIP” 400 commit thì thù địch. Một squash cả tuần việc unrelated cũng thù địch.
- **Failure mode:** interactive rebase `main`; squash mất một revert; rewrite commit đã có review comment **rồi** force-push không `--force-with-lease`; local `reset --soft` trên shared branch.
- **Đo:** bisect prod bug về một PR được không? Revert checkout mà không revert đổi DS token cùng squash được không? Nếu không, tách PR.

**PR squash vs rebase**

- **Squash merge:** default cho product team. PR title thành commit trên `main`. Link số PR.
- **Rebase merge:** giữ commit (đã dọn). Chỉ nếu author đã curate chúng.
- **Merge commit:** giữ topology; ồn nhưng lần được branch.

**Không bao giờ squash public history**

Một khi trên `main`, fix bằng **commit mới** hoặc `git revert`. History là audit log (GitOps thích cái này — 14.1).

**Tradeoff**

- Một-commit-mỗi-PR vs commit “fixup” lúc review (`git commit --fixup` + rebase cuối, vẫn private).
- Squash khổng lồ giấu mixed refactor — **đừng**; tách PR.

**Gotcha production**

- Squash mất `Co-authored-by` / review trail (GitHub thường giữ PR).
- Changelog generate từ conventional commit sai vì mọi squash là `feat:`.

**Câu hỏi nối**

- Revert squash merge chứa 3 feature thế nào? (không sạch — vì vậy slice quan trọng)
- Signed commit / DCO? (policy org)

---

### 18.7. Xử lý production incident với tư cách Frontend

**Họ thực sự hỏi gì**

“User không login được. Bạn on call. Đi.”

**Cách senior trả lời**

- **Quyết định:** **Mitigate trước**, debug sau. Với FE nghĩa là **rollback digest, giết flag, hoặc purge HTML xấu** — không phải săn 40 phút trong Vue minify. Song song: **impact**, **comms** (17.7), **giữ evidence** (release, flag %, sample Sentry event).
- **Ràng buộc:** Bạn thường không SSH được CDN. Lever của bạn là flag, GitOps revert, CSP, feature freeze, status page qua PM.
- **Failure mode:** Ship fix suy đoán lên `main` lúc cháy; đổ backend không có HAR; “chạy được staging” (SHA khác); restart pod SSR vì **vấn đề `index.html` cache**.
- **Đo:** thời gian mitigate, % user hồi (RUM), liệu **test/budget/alert** có theo sau.

**Playbook bạn nên thuộc**

1. **Có thật không?** Sentry + RUM + một repro. Check **release**, **environment**, **flag**, **locale**, **browser**.
2. **Blast radius.** 100% sau deploy → rollback. 10% → flag. Một region → CDN/origin. Chỉ login → auth (18.1), không phải chart.
3. **Mitigate.** Argo/Git revert digest tốt cuối (14.1). Tắt flag (14.4). Purge HTML nếu chunk 404 (16.2). Disable SW nếu cache kẹt.
4. **Communicate.** Known / impact / thời điểm update tiếp.
5. **Verify.** Canary purchase/login, Sentry về baseline (để ý traffic).
6. **RCA sau.** Map, timeline, fix **hệ thống** (CI budget, map upload, probe).

**Tradeoff**

- Rollback (nhanh, có thể drop commit tốt unrelated cùng digest) vs revert một PR vs flag.
- Degrade một phần (read-only) vs downtime đầy.

**Gotcha production**

- Thiếu source map → bạn đoán (19.1).
- Incident là **API 500** kèm toast FE; comms vẫn của bạn nếu bạn sở hữu UI, nhưng **owner fix** có thể là backend — đừng giữ rollback nếu JS ổn.

**Câu hỏi nối**

- Cái gì page vs ticket? (19.5)
- Practice thế nào? (game day: giết flag service, phá chunk hash)

---

### 18.8. Onboard codebase Vue lạ trong tuần đầu

**Họ thực sự hỏi gì**

“Thứ Hai bạn vào Nuxt monolith. Làm gì?”

**Cách senior trả lời**

- **Quyết định:** Tối ưu **bản đồ trong đầu và một contribution hình production**, không đọc mọi SFC. Ngày 1–2: **chạy được, lần một user path, tìm đường may** (auth, BFF, flag, error). Giữa tuần: **ticket thật nhỏ** kèm test. Cuối tuần: bạn giải thích được **request thành UI thế nào** và **ship thế nào**.
- **Ràng buộc:** Không ai có architecture doc hiện tại. Auto-import giấu dependency. Bạn sẽ bị hỏi estimate Friday (17.3) — output tuần 1 là **list risk**, không phải chắc chắn giả.
- **Failure mode:** Im một tuần “đọc”; rewrite folder structure; lint 200 file tiện tay; merge refactor Pinia vì nhớ Vuex; không setup env **giống prod** (flag, SSR).
- **Đo:** bạn ship gì đó sau flag hoặc bugfix kèm test; vẽ được hộp (16.1) cho app này; biết ai sở hữu DS vs checkout.

**Lịch tuần 1 (nói như plan)**

| Khi | Làm |
| --- | --- |
| Ngày 1 | Clone, **build prod-mode**, test. Ai on-call, Sentry ở đâu, deploy là gì (Argo/Vercel). Đọc README/ADR **lướt** auth và rendering. |
| Ngày 2 | Trace **login + một core path** trong DevTools (network, Vue devtools, Pinia). Note interceptor (18.1), `runtimeConfig`, route rules. |
| Ngày 3 | Map **feature vs `shared`** (15.5). Tìm package DS. Chạy analyzer một lần để main 3MB không bất ngờ (12.3). |
| Ngày 4–5 | **Ticket nhỏ** trên path đó: copy, bug, test composable. Practice quy trình PR. Ghi “thứ có thể hại tôi” (không map, không flag, global bus). |
| 1:1 | Hỏi xác chôn ở đâu: hydration, MF, e2e flake. |

Đừng: mass-reformat; introduce thư viện state mới; “cải thiện” build ngày 2.

**Tradeoff**

- Pair mỗi ngày vs explore một mình — mix; pair **deploy và auth** leverage cao.
- Access staging chậm — dùng preview env và Storybook, nhưng **nhất quyết** thấy prod RUM trước tuần 2.

**Gotcha production**

- Dev trên mock giấu BFF.
- Giả định pattern Nuxt 3 trong app Nuxt 2 + Vuex.

**Câu hỏi nối**

- 30/60/90 đầu? (sở hữu một feature, on-call, một ADR)
- Review code trước khi biết domain thế nào? (invariant kiểu 18.1, a11y, test — hỏi câu domain)

---

[← Back to Overview](../../README.md)
