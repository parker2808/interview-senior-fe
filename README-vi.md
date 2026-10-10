# Senior FE Interview Prep

> 🌍 **Language / Ngôn ngữ:** [🇬🇧 English](./README.md) | [🇻🇳 Tiếng Việt](./README-vi.md)

App Nuxt để **ôn phỏng vấn Senior Frontend**: knowledge base song ngữ, kế hoạch 30 ngày kèm lab, và ngân hàng Q&A khoá bằng GitHub.

**Live:** [parker-interview-senior-fe.vercel.app](https://parker-interview-senior-fe.vercel.app)

## Tính năng

- **Knowledge base** — 22 chủ đề vi/en, sidebar, tìm full-text, TOC lồng heading
- **Kế hoạch 30 ngày** — checkpoint theo ngày, lab, xem / sửa tiến độ
- **Interview Q&A** — câu trả lời mẫu sau GitHub OAuth (allowlist chủ site)
- **i18n** — `vi` / `en`, không prefix URL; cookie locale
- **Theme** sáng / tối

![Hub](./docs/readme/hub.png)
![Knowledge base](./docs/readme/knowledge-base.png)
![Kế hoạch 30 ngày](./docs/readme/plan.png)

## Stack

Nuxt 3 + Nitro · Vue 3 · TypeScript · Tailwind CSS · `@nuxtjs/i18n` (vi/en, `no_prefix`) · Vercel (preset Nitro `vercel`) · Vercel Blob private cho tiến độ plan

## Kiến trúc

```text
pages/                         # route mỏng → view của module
src/modules/
  hub/  knowledge-base/  study-plan/  interview-qa/
  content/                     # block Localized + BlockRenderer
  core/                        # chrome, theme, locale, session
server/api/                    # endpoint Nitro
server/utils/                  # content store, auth, search, progress
scripts/                       # pull-data, export, validate
schema/                        # JSON Schema cho content Localized
i18n/locales/                  # en.json / vi.json
.data/content/                 # gitignore — kéo lúc build
```

Quy ước UI module (đặt tên, scaffold module mới): [STRUCTURE.md](./STRUCTURE.md).

### Mô hình nội dung

KB / plan / Q&A nằm ở repo private [`parker2808/interview-fe-data`](https://github.com/parker2808/interview-fe-data). Mọi chuỗi user-facing là `Localized`:

```ts
type Localized<T = string> = { en: T; vi: T }
```

Doc: `{ sections: { id, title, blocks }[] }`. Kiểu block: `heading`, `paragraph`, `list`, `callout`, `code`, `table`, `senior-answer`, `key-takeaways`, `markdown`, `thematic-break`.

Build (`predev` / `prebuild`) chạy `scripts/pull-data.mjs` → `.data/content`, rồi Nitro copy vào server assets. Client không import file JSON.

### API

| Method | Path | Auth |
|---|---|---|
| `GET` | `/api/knowledge-base/docs` | public (cache CDN) |
| `GET` | `/api/knowledge-base/docs/:slug` | public (cache CDN) |
| `GET` | `/api/knowledge-base/search?q=&lang=vi\|en&limit=` | public (cache CDN + giới hạn input + rate limit best-effort) |
| `GET` | `/api/plan/days` | public (cache CDN) |
| `GET` | `/api/plan/days/:n` | public (cache CDN) |
| `GET` | `/api/plan/resources/:id` | public (cache CDN) |
| `GET` | `/api/interview/questions` | session GitHub |
| `GET` | `/auth/github` | bắt đầu + callback OAuth |
| `POST` | `/api/auth/logout` | xoá session |
| `GET` | `/api/auth/session` | `{ ok, authenticated, user }` |
| `GET` | `/api/progress` | session GitHub |
| `PUT` / `POST` | `/api/progress` | session GitHub |

Mọi `/api/**` khác là **default-deny** (`401` JSON) trừ khi được thêm vào allowlist trong `src/modules/core/utils/public-api.util.ts`.

API đọc public gửi `Cache-Control: public, s-maxage=86400, stale-while-revalidate=604800`. Session, Q&A, progress gửi `private, no-store` — không cache trên CDN.

Search từ chối `q` quá dài (tối đa 100), `lang`/`limit` sai (`limit` tối đa 50). Rate limit in-process chỉ là best-effort (một isolate Vercel). **Bật Vercel Firewall** để chặn spam thật: Project → Firewall → rule rate-limit cho `/api/knowledge-base/search` (ví dụ 30 request / phút / IP).

### Auth

GitHub OAuth qua [`nuxt-auth-utils`](https://github.com/atinux/nuxt-auth-utils). Cookie HttpOnly đã niêm (`nuxt-session`), 7 ngày, `Secure` trên production, `SameSite=Lax`. Thư viện dùng OAuth `state` (và PKCE nếu provider hỗ trợ).

**Public (không login):** trang knowledge base + plan (chỉ đọc) và API nội dung tương ứng.

**Cần login:** `/interview`, `/api/interview/*`, sửa plan / ghi progress, và mọi API không nằm trong allowlist.

Chỉ GitHub user `parker2808` được phép (đổi bằng `AUTH_ALLOWED_GITHUB_LOGINS`). Nếu có `AUTH_ALLOWED_GITHUB_IDS` thì **cả** login và id số phải khớp. Người khác login xong vào `/auth/not-allowed` và **không** có session.

#### Setup OAuth (Parker)

1. GitHub → Settings → Developer settings → **OAuth Apps** → New OAuth App.
2. **Homepage URL:** `https://parker-interview-senior-fe.vercel.app`
3. **Authorization callback URL:** `https://parker-interview-senior-fe.vercel.app/auth/github`  
   OAuth App của GitHub chỉ nhận **một** callback. Preview (`*.vercel.app`) không login được trừ khi tạo OAuth App thứ hai cho origin đó.
4. Local: OAuth App thứ hai, homepage `http://localhost:3000`, callback `http://localhost:3000/auth/github`.
5. Tạo mật khẩu session (32+ ký tự): `openssl rand -base64 32`
6. Thêm biến trên Vercel: `NUXT_SESSION_PASSWORD`, `NUXT_OAUTH_GITHUB_CLIENT_ID`, `NUXT_OAUTH_GITHUB_CLIENT_SECRET`, `AUTH_ALLOWED_GITHUB_LOGINS=parker2808`, tuỳ chọn `AUTH_ALLOWED_GITHUB_IDS`.
7. Redeploy. Xoá `INTERVIEW_PASSCODE`, `EDIT_PASSCODE`, `INTERVIEW_TOKEN_SECRET`, `EDIT_TOKEN_SECRET`, `PROGRESS_WRITE_TOKEN`.

### i18n

`@nuxtjs/i18n`, mặc định `vi`, `no_prefix`, cookie `sf_locale`. Route KB: `/docs/:lang/:slug`. Chrome UI lấy từ file locale; thân tài liệu lấy từ JSON Localized.

## Luồng dữ liệu

```mermaid
flowchart LR
  editor[Editor] --> dataRepo["private interview-fe-data"]
  dataRepo --> ci[CI validate Localized JSON]
  ci --> main[merge to main]
  main --> hook[GitHub Action deploy hook]
  hook --> vercel[Vercel build]
  vercel --> pull["pull-data + CONTENT_REPO_TOKEN"]
  pull --> nitro[Nitro server assets]
  nitro --> apis[Content APIs]
  apis --> pages[Nuxt pages]
```

## Luồng request của một trang

```mermaid
sequenceDiagram
  participant Browser
  participant Page as Nuxt page
  participant API as Nitro API
  participant Store as content store
  Browser->>Page: GET /docs/vi/javascript
  Page->>API: useAsyncData GET /api/knowledge-base/docs/javascript
  API->>Store: readKnowledgeDoc
  Store-->>API: Localized JSON
  API-->>Page: document
  Page-->>Browser: SSR HTML
  Note over Browser,Page: Client navigation giữ cùng fetch và hiện skeleton khi pending
```

## GitHub OAuth

```mermaid
sequenceDiagram
  participant Browser
  participant App
  participant GitHub
  Browser->>App: GET /login?redirect=/interview
  Browser->>App: GET /auth/github?redirect=/interview
  App->>GitHub: authorize + state
  GitHub-->>Browser: consent
  Browser->>App: GET /auth/github?code&state
  App->>GitHub: exchange code
  GitHub-->>App: user profile
  alt login (và id) trong allowlist
    App->>Browser: Set-Cookie session HttpOnly
    App->>Browser: redirect /interview
    Browser->>App: GET /api/interview/questions
    App-->>Browser: questions
  else người khác
    App->>Browser: redirect /auth/not-allowed (không session)
  end
```

Trang plan vẫn public. Nút sửa và `/api/progress` chỉ hiện khi đã có session.

## Chạy local

**Cần:** Node 22+, npm, và checkout local của `interview-fe-data` hoặc PAT đọc được repo private đó.

```bash
cp .env.example .env          # điền OAuth + session password; không commit secret
# Cách A — data repo local
CONTENT_LOCAL_PATH=/path/to/interview-fe-data npm run dev
# Cách B — kéo bằng token
CONTENT_REPO_TOKEN=… npm run dev
```

| Script | Việc làm |
|---|---|
| `npm run dev` | `data:pull` rồi `nuxt dev` |
| `npm run build` | `data:pull` rồi `nuxt build` (preset Vercel) |
| `npm run data:pull` | Copy `CONTENT_LOCAL_PATH` hoặc tải data repo → `.data/content` |
| `npm run data:export` | Dựng lại JSON từ markdown (maintainer / seed) |
| `npm run data:validate` | Kiểm schema JSON Localized |
| `npm run preview` | Không dùng với preset Vercel khi chạy local |

### Biến môi trường

Không để giá trị secret trong git. Copy `.env.example` rồi điền local / trên Vercel.

| Biến | Ở đâu | Mục đích |
|---|---|---|
| `CONTENT_REPO_TOKEN` | Vercel + tuỳ chọn local | PAT fine-grained, **Contents: Read** trên `interview-fe-data` |
| `CONTENT_REPO_REF` | tuỳ chọn | Git ref để kéo (mặc định `main`) |
| `CONTENT_REPO_OWNER` / `CONTENT_REPO_NAME` | tuỳ chọn | Đổi toạ độ data repo |
| `CONTENT_LOCAL_PATH` | local | Checkout hoặc export data repo; bỏ qua GitHub |
| `NUXT_SESSION_PASSWORD` | Vercel + local | 32+ ký tự; niêm cookie session |
| `NUXT_OAUTH_GITHUB_CLIENT_ID` | Vercel + local | Client id OAuth App |
| `NUXT_OAUTH_GITHUB_CLIENT_SECRET` | Vercel + local | Client secret OAuth App |
| `AUTH_ALLOWED_GITHUB_LOGINS` | Vercel + local | Login cách nhau bằng dấu phẩy (mặc định `parker2808`) |
| `AUTH_ALLOWED_GITHUB_IDS` | tuỳ chọn | Id số GitHub; AND với login |
| `BLOB_READ_WRITE_TOKEN` | Vercel | Blob private cho `/api/progress` |
| `VERCEL_DEPLOY_HOOK_URL` | secret **data repo** | Action trên `main` kích hoạt rebuild site |

## Deploy và cập nhật nội dung

1. Sửa JSON trong **`parker2808/interview-fe-data`**.
2. CI trên PR validate JSON Localized.
3. Merge `main` → Action `POST` deploy hook Vercel.
4. Build Vercel chạy `data:pull` với `CONTENT_REPO_TOKEN`, copy content vào Nitro, deploy.

Push repo app cũng rebuild trên Vercel. Content **không** nằm trong repo này.

**Backup / toàn vẹn:** nguồn sự thật là git trên data repo private. Vercel chỉ serve bản build thành công gần nhất. Build fail thì deployment cũ vẫn chạy. JSON tiến độ nằm ở Blob private, tách khỏi content.

## License

Dùng miễn phí để ôn phỏng vấn cá nhân. Ghi nguồn nếu chia sẻ công khai.
