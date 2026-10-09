# DevOps

Đây là tài liệu ôn phỏng vấn **frontend** senior. Bạn không phải platform engineer. Bạn vẫn phải nói trôi chảy về **immutable artifact, preview environment, feature flag vs env deploy, rollback, và CI FE nên gate gì** — vì đó là cách app Vue/Nuxt thực sự tới user.

GitOps + ArgoCD là backdrop phổ biến ở phỏng vấn enterprise. Dịch nó thành **thứ bạn sở hữu** (image, đường ingress, env contract) và **thứ bạn không** (cluster).

---

## Table of Contents

1. [GitOps + ArgoCD Pipeline](#141-gitops--argocd-pipeline)

2. [Pipeline CI/CD Frontend bạn sẽ thiết kế](#142-pipeline-cicd-frontend-bạn-sẽ-thiết-kế)

3. [Preview deployment và biến môi trường](#143-preview-deployment-và-biến-môi-trường)

4. [Feature Flags](#144-feature-flags)

5. [Vai trò Frontend trong Kubernetes và GitOps](#145-vai-trò-frontend-trong-kubernetes-và-gitops)

---

## 14. DevOps

### 14.1. GitOps + ArgoCD Pipeline

**Họ thực sự hỏi gì**

- “Frontend lên production thế nào?”
- “Team dùng ArgoCD. Phần của bạn là gì?”
- “Rollback Vue release tồi thế nào?”
- “Sao `:latest` xấu?”

**Cách senior trả lời**

- **Quyết định:** **Build một lần, promote cùng digest.** CI tạo **immutable** image hoặc static artifact tagged bằng **git SHA** (digest, không phải `latest`). Repo GitOps (Helm/Kustomize) được update tới tag đó. ArgoCD reconcile cluster → Git. Rollback = **revert commit GitOps** (hoặc trỏ tag lại) rồi để Argo sync — không phải “ssh rồi kubectl edit.”
- **Ràng buộc:** Senior FE không vận hành etcd. Bạn **phải** giải thích được desired state vs live state, vì sao Git là audit log, và vì sao “chạy được trên preview của tôi” không phải prod artifact trừ khi digest khớp.
- **Failure mode:** CI build image khác nhau cho staging vs prod; `:latest` + `imagePullPolicy: Always` (bạn không biết mình đang chạy gì); Argo auto-sync main gãy vào Friday; config (API URL, feature default) **không** nằm trong Git; rollback app Git trong khi repo GitOps vẫn trỏ tag xấu.
- **Đo:** lead time SHA → serving, tần suất deploy, **thời gian recovery deploy fail**, drift Argo detect, liệu mọi prod image **reproducible từ một SHA**.

**GitOps trong một đoạn (rồi ngừng nghe như phỏng vấn platform)**

Git là source of truth cho trạng thái cluster **mong muốn**. ArgoCD watch repo đó, diff live vs desired, sync (auto hoặc manual). CI của app repo **không** kubectl apply. Nó (1) test, (2) build image `ghcr.io/acme/web:abc123`, (3) mở/commit thay đổi trong GitOps repo `image: abc123`. Merge + Argo = prod. Preview env là **namespace hoặc app cluster riêng** từ SHA của PR, không phải laptop snowflake.

**Tính bất biến của artifact và tag**

- Tag bằng **git SHA** và thêm pointer dịch chuyển (`staging`, `prod`) **chỉ** như field GitOps vẫn reference digest. Ưu tiên pin digest (`image@sha256:...`) trên prod.
- **Không bao giờ `:latest`.** Bạn không rollback được, không diff được, cache nói dối.
- Static Nuxt/Vite: **prefix object storage / CDN** là artifact (`/releases/abc123/`). Cùng rule: đừng overwrite `current/` tại chỗ mà không giữ prefix trước.
- Config: `NUXT_PUBLIC_*` lúc build bị **nướng**. Runtime env Nitro đổi được không cần image mới — document cái nào là cái nào nếu không bạn sẽ “rollback image” mà vẫn giữ URL xấu.

**Feature flag vs env deploy**

- **Env deploy** (deploy `feat-x` lên staging cluster): tốt cho integration, tệ nếu là cách duy nhất test với data giống prod, chậm, nhân chi phí env.
- **Preview env mỗi PR:** tốt nhất cho UI review (14.3).
- **Flag trên prod:** tốt nhất cho **gradual rollout / kill switch** (14.4). Không thay CI.
- Senior dùng **cả ba** ở các tầng khác nhau, không phải “chúng tôi chỉ có staging.”

**Rollback**

- Tức thì: **tắt flag** (đường checkout gãy).
- Nhanh: Argo rollback / Git revert về digest đã biết (CDN vẫn còn asset cũ nếu chúng immutable).
- Chậm/sai: “hotfix forward” không SHA, hoặc `kubectl rollout undo` rồi GitOps lập tức **apply lại** Git xấu. Nếu GitOps là sự thật, undo **Git**.

**CI FE nên gate gì (nói list này)**

| Gate | Vì sao | Trên PR? |
| --- | --- | --- |
| `eslint` + format | Consistency, một ít lint a11y/security | Có |
| `vue-tsc --noEmit` | Bộ bắt bug production rẻ nhất | Có |
| Unit / component (Vitest) | Composable, toán tiền, flag | Có |
| Production `vite` / `nuxt build` | Bug chỉ lúc dev, tree-shake vỡ | Có |
| **Bundle budget** | 12.3 dạng CI | Có |
| E2E **smoke** (Playwright, prod build) | Login, buy/search critical | PR: nhỏ; main: nhiều hơn |
| Lighthouse / CWV **budget** trên URL then chốt | Lab, không phải RUM | Main hoặc nightly; PR nếu rẻ |
| Image scan / license | Yêu cầu org | Release |
| Upload source map | Sentry vô dụng nếu thiếu | Release, không public CDN |

**Đừng** gate merge trên coverage 100% hay Lighthouse score 100. Gate trên **budget và smoke**.

**Tradeoff**

- Auto-sync (tốc độ) vs manual sync trên prod (change control). Nhiều team auto-sync staging, **manual/PR** cho GitOps prod.
- Một repo vs app repo + GitOps repo (cái sau phổ biến; FE phải biết PR nào thực sự ship).
- Helm values theo env vs Kustomize overlay — chọn thứ platform team đã chạy; đừng invent cái thứ ba.

**Gotcha production**

- Argo healthy, user vẫn JS cũ: **CDN cache** của `index.html`. Cache HTML ngắn, hashed asset dài (`immutable`).
- Pod SSR + HTML cũ trỏ file hash đã xóa sau CDN purge quá hung hăng.
- Clock skew trên tag `latest`.
- Secret trong GitOps (dùng Sealed Secrets / External Secrets — bạn nên biết chúng tồn tại, không implement chúng trong phỏng vấn).

**Câu hỏi nối**

- Blue/green static SPA thế nào? (hai prefix + chuyển ingress / CDN alias)
- Drift là gì? (ai đó kubectl-edit; Argo sẽ đánh nhau với họ — tốt)
- Khác nhau liveness vs readiness cho process Node Nuxt? (14.5)

---

### 14.2. Pipeline CI/CD Frontend bạn sẽ thiết kế

**Họ thực sự hỏi gì**

“Vẽ pipeline cho app Nuxt trong monorepo.”

**Cách senior trả lời**

- **Quyết định:** Hai track. **PR:** feedback nhanh (lint, typecheck, unit, build, budget, preview tùy chọn). **Main:** cùng vậy cộng e2e smoke, publish **một** artifact, GitOps bump / CDN deploy, map + Sentry release, notify Slack. Không “rebuild trên prod cluster.”
- **Ràng buộc:** Minutes-to-green và **flake rate** quan trọng không kém coverage. Playwright trên `nuxt dev` là nói dối.
- **Failure mode:** Job tuần tự 20 phút; secret lộ cho fork PR; preview dùng prod credential; deploy bỏ test “chỉ lần này”; frontend Docker `npm run build` bên trong k8s thay vì CI.
- **Đo:** p50/p95 duration pipeline, cache hit %, % incident prod có pipeline xanh (bug process), mean time SHA → prod.

Phác thảo:

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

Monorepo: build package **bị ảnh hưởng** (Turbo/Nx). Đổi design-system rebuild app; đổi markdown docs thì không.

**Tradeoff**

- Self-hosted runner (nhanh hơn, đĩa cache) vs GitHub-hosted (sạch hơn).
- Deploy lúc merge vs nightly release train. App Vue product: **merge main = đủ điều kiện prod**, flag cho việc chưa xong — không phải GitFlow release branch (xem 18.4).

**Gotcha production**

- `NUXT_PUBLIC_API_BASE` nướng lúc build vs runtime — image staging promote lên prod vẫn trỏ staging.
- OOM trong `nuxt build` chỉ trên CI (RAM ít hơn laptop).
- `npm publish` private design system không có provenance.

**Câu hỏi nối**

- Secret-scan thế nào? (chặn key `VITE_` trong client bundle)
- Ai approve GitOps prod? (CODEOWNERS, không phải mọi FE)

---

### 14.3. Preview deployment và biến môi trường

**Họ thực sự hỏi gì**

“Designer/PM xem PR thế nào?” / “Làm sao không leak prod data vào preview?”

**Cách senior trả lời**

- **Quyết định:** Mỗi PR có **URL unique** (`pr-123.preview.example.com`) chạy **đúng SHA đó**. Env: **API staging/test**, data giả hoặc anonymize, OAuth client và cookie **tách**. Giết preview lúc merge/close.
- **Ràng buộc:** Preview origin làm nổ CORS và cookie domain (13.4). Hoặc proxy API same-origin trên preview, hoặc wildcard CORS allowlist **chỉ** cho staging API, không bao giờ prod.
- **Failure mode:** Preview với prod DB (PII, charge, phá order thật); `VITE_*` copy từ prod; preview sống lâu thành “staging” của ai đó; auth cookie set trên `.example.com` leak giữa preview và prod.
- **Đo:** time-to-preview, % PR có URL ngay lần CI đầu, incident do mix config preview→prod.

**Env var (Nuxt-first)**

- `runtimeConfig.public` / `NUXT_PUBLIC_*`: được phép expose, vẫn không phải secret.
- Server `runtimeConfig` / `NUXT_*`: secret, chỉ Nitro.
- Vite `VITE_*`: luôn client. Coi như public.
- Ưu tiên env **runtime** trên Node image để **cùng digest** chạy preview/staging/prod với URL khác. Nếu nướng public API URL lúc build, bạn **không** promote artifact được.

Cookie `Domain=` và OAuth `redirect_uri` phải gồm preview host hoặc dùng BFF trên host đó.

**Tradeoff**

- Full k8s namespace mỗi PR (đắt, thực tế) vs preview Vercel/Netlify/Cloudflare Pages (rẻ, có thể không khớp GitOps).
- Shared staging DB vs backend ephemeral mỗi PR (tốt nhất, hiếm). Tối thiểu: test tenant **feature-flag**.

**Gotcha production**

- Preview `indexable` lọt Google — `X-Robots-Tag: noindex`, basic auth hoặc SSO trước preview.
- CSP `connect-src` thiếu staging API.
- Mixed content (`https` preview gọi `http` API).

**Câu hỏi nối**

- E2E nhắm preview thế nào? (Playwright `baseURL` từ CI)
- Preview SSR + WS được không? (cần Node host thật, không chỉ static)

---

### 14.4. Feature Flags

**Họ thực sự hỏi gì**

“Ship dark? Kill switch? Sao không cứ deploy?”

**Cách senior trả lời**

- **Quyết định:** Flag là **runtime control** rủi ro: kill switch, percentage rollout, entitlement, experiment. Chúng **không** thay version control hay nghĩa địa if/else vĩnh viễn. Default trong app Vue: evaluate flag **trong BFF** cho mọi thứ liên quan security/pricing; client flag chỉ cho UX chrome.
- **Ràng buộc:** Flag service sẽ sập. Bạn cần **fail-closed** (payment) vs **fail-open** (sidebar mới). Cache với TTL. Đừng block first paint vì LaunchDarkly nếu marketing page không cần.
- **Failure mode:** Flag để 1% mãi; targeting “internal user” vẫn đụng prod data; client-side flag giấu nút nhưng không giấu API; flag trong `localStorage` lệch giữa tab; đổi flag rồi đổ lỗi “GitOps chưa deploy.”
- **Đo:** thời gian tắt feature xấu (phải là phút), % flag già hơn N ngày, error rate **cắt theo flag** (19.6), exposure vs conversion cho experiment.

Loại:

| Kind | Ví dụ | Evaluate ở đâu |
| --- | --- | --- |
| Kill switch | Tắt checkout mới | BFF + FE, fail-safe |
| Gradual | 10% session | Consistent hash theo user id, không `Math.random()` mỗi request |
| Entitlement | Plan có “exports” | Server; FE chỉ phản ánh |
| Experiment | Copy/layout | Client OK; để ý CLS/CWV |

Cleanup là một phần câu chuyện: ticket gỡ flag khi nó 100% / bị bỏ. ADR nếu flag đổi architecture.

**Tradeoff**

- LaunchDarkly/Unleash vs `config.json` tự nấu. Tự nấu ổn cho 5 kill switch; bạn sẽ hối với experiment.
- Env-based deploy (`STAGING_FEATURE=1`) vs flag. Env không slice được 10% user prod.

**Gotcha production**

- SSR: flag lúc request vs hydrate mismatch (user 10% trên server, 0% trên client). **Pin bucketing key** trong payload.
- SEO: đừng flag-gate content Google phải thấy, nếu không bạn A/B ranking.
- Cache HTML đã nướng flag A cho mọi user.

**Câu hỏi nối**

- Test cả hai phía trên CI thế nào? (cả hai giá trị trong unit test; e2e trên default path + một flagged path)
- Flag vs branch vs bỏ feature? (18.5 / 17.5)

---

### 14.5. Vai trò Frontend trong Kubernetes và GitOps

**Họ thực sự hỏi gì**

“Bạn có viết Helm chart không?” Họ đang test bạn có **overclaim** không.

**Cách senior trả lời**

- **Quyết định:** Bạn **sở hữu image và đường ingress**. Dockerfile (hoặc static bucket + CloudFront), port, **health endpoint**, resource request cho **SSR**, path app sống (`/`, `/app`), header bạn cần (CSP, cache). Bạn **không** sở hữu cluster, CNI, cert-manager, node autoscaler, hay mesh — bạn collaborate, không thiết kế chúng trong vòng FE trừ khi bạn thực sự đã làm.
- **Ràng buộc:** SPA vs SSR đổi shape k8s. Static Vite: nginx/unprivileged distroless serve hashed file, gần như không CPU. Nuxt SSR: **process Node**, HPA, readiness, memory leak, sticky session nếu bạn đủ dại giữ session trong server memory.
- **Failure mode:** `latest`; không readiness probe nên pod nhận traffic trước khi Nitro listen; liveness hit page nặng rồi giết pod khỏe; FE “fix” outage bằng restart job unrelated; claim “làm Kubernetes” vì sửa image tag trong values.yaml.
- **Đo:** số lần pod restart, RSS của Nitro, p95 TTFB từ trong cluster, 5xx từ ingress vs app.

**Thứ bạn phải nói được**

- **Image:** multi-stage build, non-root, chỉ dist, không `npm` trong image SPA cuối. SSR: `node .output/server/index.mjs`, `HOST=0.0.0.0`.
- **Probe:** liveness = process còn sống (`/healthz` rẻ). Readiness = sẵn sàng nhận traffic (Nitro lên, có thể chưa “với được downstream”). Startup probe cho boot chậm. Đừng SSR full `/` làm liveness.
- **Ingress:** TLS ở edge, `index.html` / HTML **cache ngắn**, `/_nuxt/*` hashed **cache dài**. Trailing slash, SPA fallback **chỉ** cho client route, không cho `/api`.
- **GitOps:** PR repo app chưa live cho đến khi tag GitOps dịch. Bạn đọc diff Argo khi “deploy không.”
- **Header:** CSP, HSTS, `Referrer-Policy` — thường set ở đây hoặc CDN. Bạn sở hữu **nội dung** CSP vì bạn biết origin FE.

**Tradeoff**

- Static trên object storage (rẻ, rollback prefix đơn giản) vs SSR trong k8s (SEO, auth, BFF). Hybrid Nuxt: marketing static ở CDN, SSR cho app — hai ingress, vẫn một repo.
- Sidecar nginx vs Node serve static — SPA thường nginx; đừng chạy Express `sendFile` không lý do.

**Gotcha production**

- Timeout Websocket/SSE ở ingress (13.1).
- Scale ngang SSR không shared cache → thundering herd lên API (cần Redis/Nitro cache).
- Resource `limits` quá thấp → INP bị throttle, trông như bug “frontend performance.”

**Câu hỏi nối**

- Canary 10% thế nào? (Argo rollout / flag / weighted ingress — chọn một và nêu failure mode)
- Log gì từ pod vs từ browser? (19.4)

---

[← Back to Overview](../../README.md)
