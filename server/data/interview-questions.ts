export type InterviewLang = 'vi' | 'en'
export type InterviewCategory = 'soft' | 'technical' | 'situational'

export type Localized = Record<InterviewLang, string>

export type InterviewQuestion = {
  id: string
  category: InterviewCategory
  tags: string[]
  question: Localized
  /** Markdown-ish answer body */
  answer: Localized
  /** Concrete example / story / code */
  example?: Localized
  /** Likely follow-ups from interviewer */
  followUps?: Localized[]
}

export const INTERVIEW_CATEGORIES: {
  id: InterviewCategory
  title: Localized
  blurb: Localized
}[] = [
  {
    id: 'soft',
    title: { vi: 'Giới thiệu & Soft', en: 'Intro & Soft skills' },
    blurb: {
      vi: 'Self-intro, project, AI, sai lầm, định nghĩa Senior',
      en: 'Self-intro, project, AI usage, mistakes, what “senior” means',
    },
  },
  {
    id: 'technical',
    title: { vi: 'Technical sâu', en: 'Technical deep-dive' },
    blurb: {
      vi: 'Architecture, modal/a11y, debug, React hooks, JWT flow',
      en: 'Architecture, modal/a11y, debug, React hooks, JWT flow',
    },
  },
  {
    id: 'situational',
    title: { vi: 'Tình huống thực tế', en: 'Situational / behavioral-tech' },
    blurb: {
      vi: 'EU/APAC style: JWT storage, perf, N+1, cache, AI code review, scale UI',
      en: 'EU/APAC style: JWT storage, perf, N+1, cache, AI review, scale UI',
    },
  },
]

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // ─── SOFT ─────────────────────────────────────────────
  {
    id: 'self-intro',
    category: 'soft',
    tags: ['intro'],
    question: {
      en: 'Introduce yourself.',
      vi: 'Giới thiệu bản thân.',
    },
    answer: {
      en: `Keep it **60–90 seconds**, structured:

1. **Who** — name, current role, years of FE experience, main stack (e.g. Vue/Nuxt primary, React/Next growing).
2. **What** — domains you’ve shipped (admin, B2B SaaS, e-commerce…).
3. **Strength** — 1–2 senior signals (ownership of architecture, mentoring, cross-team delivery).
4. **Why here** — align with their product/stack briefly.

Avoid life story. End with an open hook: “Happy to go deeper into X project or Y technical area.”`,
      vi: `Giữ **60–90 giây**, cấu trúc:

1. **Ai** — tên, role hiện tại, số năm FE, stack chính (vd Vue/Nuxt mạnh, đang bổ sung React/Next).
2. **Làm gì** — domain đã ship (admin, B2B SaaS…).
3. **Điểm mạnh** — 1–2 tín hiệu senior (ownership kiến trúc, mentor, phối hợp cross-team).
4. **Vì sao apply** — khớp product/stack họ cần.

Tránh kể dài. Kết bằng hook: “Em có thể đi sâu project X hoặc technical Y nếu anh/chị muốn.”`,
    },
    example: {
      en: `“I’m a Senior Frontend engineer with ~N years, mainly Vue 3/Nuxt, currently strengthening React/Next. Recently I owned the Customer Verification admin console—designing state ownership, API contracts, a11y, and delivery. I care about scalable FE architecture and clear trade-offs. Excited about your product because …”`,
      vi: `“Em là Senior FE ~N năm, chủ lực Vue 3/Nuxt, đang bổ sung React/Next. Gần đây em ownership màn Customer Verification admin—state ownership, API contract, a11y và delivery. Em quan tâm kiến trúc FE scale được và trade-off rõ. Em thấy fit với product của bên mình vì …”`,
    },
    followUps: [
      {
        en: 'What is your weakest area right now?',
        vi: 'Điểm yếu hiện tại của bạn là gì?',
      },
    ],
  },
  {
    id: 'recent-project',
    category: 'soft',
    tags: ['project', 'star'],
    question: {
      en: 'Tell me about a recent project.',
      vi: 'Giới thiệu recent project.',
    },
    answer: {
      en: `Use **STAR** but keep tech concrete:

- **Situation** — product goal + constraints (deadline, legacy, SEO, multi-role).
- **Task** — your ownership boundary (not the whole company).
- **Action** — architecture decisions (state map, API contract, testing pyramid, perf).
- **Result** — measurable if possible (fewer bugs, faster load, shipped on time) + what you’d improve.

Interviewers in EU/APAC often dig: *Why that state library? Why SSR? What failed?* Prepare 2 follow-up layers.`,
      vi: `Dùng **STAR** nhưng technical cụ thể:

- **Situation** — mục tiêu product + constraint (deadline, legacy, SEO, multi-role).
- **Task** — phần bạn ownership (không nhận hết công ty).
- **Action** — quyết định kiến trúc (state map, API contract, test pyramid, perf).
- **Result** — số liệu nếu có + điều sẽ cải thiện.

Khách EU/APAC hay đào: *Vì sao chọn store đó? Vì sao SSR? Chỗ nào fail?* Chuẩn bị sẵn 2 tầng follow-up.`,
    },
    example: {
      en: `Capstone-style story: “We needed List → Detail → Field Config with Viewer/Editor/Admin. I defined acceptance criteria, component tree, error matrix, then shipped Vue spike + React parity for one slice. Result: predictable authz UX and a reusable test plan.”`,
      vi: `Story kiểu Capstone: “Cần List → Detail → Field Config với Viewer/Editor/Admin. Em chốt AC, component tree, error matrix, rồi ship Vue spike + React parity một slice. Kết quả: UX authz rõ, có test plan tái sử dụng.”`,
    },
  },
  {
    id: 'ai-daily-work',
    category: 'soft',
    tags: ['ai', 'process'],
    question: {
      en: 'How do you apply AI in your daily work?',
      vi: 'Áp dụng AI vào công việc hàng ngày như nào?',
    },
    answer: {
      en: `Frame AI as an **accelerator with review gates**, not an author of record:

1. **Draft** — boilerplate, tests scaffolds, refactor suggestions, docs.
2. **Explore** — “explain this stack trace”, compare approaches.
3. **Never** — paste secrets; merge large AI diffs without reading; skip a11y/security review.
4. **Process** — small prompts, constrained context, human owns architecture & edge cases.

Senior signal: you can say *when AI helps vs when it creates debt*.`,
      vi: `Đặt AI là **tăng tốc có cổng review**, không phải “tác giả chính”:

1. **Draft** — boilerplate, scaffold test, gợi ý refactor, docs.
2. **Explore** — giải thích stack trace, so approach.
3. **Không** — dán secret; merge diff AI lớn chưa đọc; bỏ qua a11y/security.
4. **Process** — prompt nhỏ, context giới hạn, người giữ architecture & edge cases.

Tín hiệu senior: nói được *khi nào AI giúp / khi nào tạo nợ kỹ thuật*.`,
    },
    example: {
      en: `“I use AI to draft RTL tests and rename refactors, then I run the suite and review for wrong assumptions. For a 1,500-line generated component I would refuse merge—I’d split by responsibility first.”`,
      vi: `“Em dùng AI draft RTL test và rename refactor, rồi chạy suite và review assumption sai. Với component AI 1.500 dòng em sẽ không merge—tách responsibility trước.”`,
    },
  },
  {
    id: 'mistake-hardship',
    category: 'soft',
    tags: ['star', 'failure'],
    question: {
      en: 'Describe a mistake or difficulty in a project and how you resolved it.',
      vi: 'Kể ra 1 sai lầm/khó khăn gặp phải trong dự án và cách giải quyết.',
    },
    answer: {
      en: `Pick a **real** story with learning—not a humblebrag.

Structure:
1. Mistake (specific).
2. Impact (users/team).
3. Detection (how you found it).
4. Fix (technical + process).
5. Prevention (checklist, test, monitoring).

Good FE themes: race conditions on search, missing focus trap, caching stale auth, shipping without error matrix.`,
      vi: `Chọn story **thật** có bài học—không humblebrag.

Cấu trúc:
1. Sai gì (cụ thể).
2. Impact (user/team).
3. Phát hiện thế nào.
4. Fix (kỹ thuật + process).
5. Phòng ngừa (checklist, test, monitoring).

Chủ đề FE hay: race search, thiếu focus trap, cache auth stale, ship thiếu error matrix.`,
    },
    example: {
      en: `“Search race: fast typing showed stale results. Root cause: no abort/sequence id. Fix: AbortController + ignore outdated responses. Prevention: shared fetch helper with cancel + a regression test.”`,
      vi: `“Search race: gõ nhanh hiện kết quả cũ. Root cause: không abort/sequence id. Fix: AbortController + bỏ qua response cũ. Phòng ngừa: fetch helper chung có cancel + regression test.”`,
    },
  },
  {
    id: 'what-is-senior',
    category: 'soft',
    tags: ['senior', 'leadership'],
    question: {
      en: 'In your view, what makes a senior developer?',
      vi: 'Đánh giá một senior developer cần phải là một người như nào?',
    },
    answer: {
      en: `Senior ≠ years alone. Signals:

- **Ownership** — take a feature from ambiguity to production with trade-offs documented.
- **System thinking** — FE ↔ API ↔ UX ↔ a11y ↔ perf ↔ ops.
- **Judgment** — know when to simplify vs invest.
- **Communication** — write ADRs, unblock others, give actionable review.
- **Quality bar** — tests where risk is, monitoring, incident calmness.
- **Multiplication** — raise team level, not only personal output.`,
      vi: `Senior ≠ chỉ số năm. Tín hiệu:

- **Ownership** — từ mơ hồ đến production, trade-off có ghi.
- **Tư duy hệ thống** — FE ↔ API ↔ UX ↔ a11y ↔ perf ↔ ops.
- **Judgment** — biết lúc đơn giản hoá vs đầu tư.
- **Giao tiếp** — ADR, unblock người khác, review actionable.
- **Quality bar** — test đúng chỗ rủi ro, monitoring, xử lý incident điềm tĩnh.
- **Nhân bản** — nâng team, không chỉ output cá nhân.`,
    },
  },

  // ─── TECHNICAL ───────────────────────────────────────
  {
    id: 'scale-codebase-100-features',
    category: 'technical',
    tags: ['architecture', 'scale'],
    question: {
      en: 'How would you structure a frontend codebase, and how would you scale it past 100 features?',
      vi: 'Dựng một codebase frontend như nào, làm thế nào để scale nếu có hơn 100 features?',
    },
    answer: {
      en: `**Structure (modular monolith first):**

- \`app/\` shell (routing, providers, layout)
- \`modules/<feature>/\` — pages, components, hooks/composables, api client, types, tests
- \`shared/ui\` design system primitives
- \`shared/lib\` pure utils
- Clear **import rules**: features don’t deep-import each other’s internals

**Scale >100 features:**

1. **Domain boundaries** — billing, users, catalog… each owns routes + state.
2. **Lazy routes** per feature.
3. **Contract-first API** types generated or shared package.
4. **State policy** — URL for filters; server cache (Query); global client store only for true cross-cutting.
5. **CI gates** — lint boundaries (eslint zones), typecheck, unit on critical paths, visual/a11y smoke.
6. If needed later: **package split** / microfrontends—only with clear ownership & deploy pain.

Avoid a giant \`components/\` junk drawer.`,
      vi: `**Cấu trúc (modular monolith trước):**

- \`app/\` shell (routing, providers, layout)
- \`modules/<feature>/\` — pages, components, hooks/composables, api, types, tests
- \`shared/ui\` primitives
- \`shared/lib\` utils thuần
- **Luật import**: feature không deep-import nội thất feature khác

**Scale >100 features:**

1. **Ranh giới domain** — mỗi domain giữ routes + state.
2. **Lazy route** theo feature.
3. **API contract-first** (types generate / package dùng chung).
4. **State policy** — URL cho filter; server cache (Query); global store chỉ cross-cutting thật.
5. **CI gates** — eslint boundaries, typecheck, unit chỗ critical.
6. Sau này mới **tách package / microfrontend** nếu ownership & deploy đau thật.

Tránh \`components/\` một đống chung.`,
    },
    example: {
      en: `Feature folder: \`modules/customers/{pages,components,api,model,tests}\`. Dashboard imports \`@/modules/customers\` public API only.`,
      vi: `Folder: \`modules/customers/{pages,components,api,model,tests}\`. Dashboard chỉ import public API của module.`,
    },
  },
  {
    id: 'modal-nested',
    category: 'technical',
    tags: ['ui', 'modal', 'a11y'],
    question: {
      en: 'What do you need to build a modal component? How do you support nested modals?',
      vi: 'Dựng một modal component cần những gì, làm thế nào để dựng nhiều modal lồng nhau?',
    },
    answer: {
      en: `**A solid modal needs:**

- Portal/Teleport to \`document.body\` (avoid \`overflow:hidden\` ancestors clipping)
- Overlay + panel; focus trap; initial focus; restore focus on close
- Esc to close (topmost only); click-outside policy
- \`role="dialog"\`, \`aria-modal="true"\`, \`aria-labelledby\`
- Scroll lock on \`body\`
- Controlled API: \`open\` + \`onClose\`; optional unmount when closed

**Nested modals:**

- Keep a **stack** (z-index / open order). Esc closes only the top.
- One body scroll-lock refcount.
- Focus trap scoped to the top dialog.
- Prefer **one modal + confirm as nested** sparingly; stacked dialogs hurt UX—often a drawer/inline confirm is better.`,
      vi: `**Modal vững cần:**

- Portal/Teleport ra \`body\`
- Overlay + panel; focus trap; focus ban đầu; restore focus khi đóng
- Esc đóng (chỉ tầng trên); policy click-outside
- \`role="dialog"\`, \`aria-modal\`, \`aria-labelledby\`
- Khoá scroll \`body\`
- API controlled: \`open\` + \`onClose\`

**Modal lồng:**

- **Stack** theo thứ tự mở. Esc chỉ đóng top.
- Refcount cho scroll-lock.
- Focus trap theo dialog top.
- Hạn chế stack sâu—thường confirm inline/drawer dễ dùng hơn.`,
    },
    example: {
      en: `React: headless pattern with \`createPortal\` + focus-trap-react. Vue: \`<Teleport to="body">\` + \`vue-focus-trap\` or custom Tab cycle.`,
      vi: `React: \`createPortal\` + focus-trap. Vue: \`<Teleport to="body">\` + trap Tab thủ công/thư viện.`,
    },
  },
  {
    id: 'a11y-modal-focus-trap',
    category: 'technical',
    tags: ['a11y', 'modal', 'focus'],
    question: {
      en: 'Have you worked on accessibility? How do you open a modal so Tab focus does not escape outside?',
      vi: 'Đã có kinh nghiệm accessibility chưa? Làm sao mở modal mà Tab không nhảy focus ra ngoài?',
    },
    answer: {
      en: `Yes—treat a11y as acceptance criteria, not polish.

**Focus trap algorithm (interview-grade):**

1. On open: save \`document.activeElement\`; move focus into dialog (first focusable or container \`tabIndex=-1\`).
2. Query focusable: \`a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])\` inside dialog.
3. On \`keydown\` Tab:
   - If focus on **last** and Tab → \`preventDefault\`, focus **first**
   - If focus on **first** and Shift+Tab → focus **last**
4. On close: restore saved element; remove listeners; unlock scroll.
5. Also: Esc closes; \`aria-modal="true"\`; don’t leave focus on elements with \`visibility:hidden\`.

Libraries OK if you can explain the mechanics.`,
      vi: `Có—a11y là AC, không phải “làm đẹp sau”.

**Thuật toán focus trap (mức phỏng vấn):**

1. Khi mở: lưu \`activeElement\`; đưa focus vào dialog (focusable đầu hoặc container \`tabIndex=-1\`).
2. Lấy focusable trong dialog (a, button, input, … \`tabindex\` ≥ 0).
3. \`keydown\` Tab:
   - Đang ở **cuối** + Tab → chặn, focus **đầu**
   - Đang ở **đầu** + Shift+Tab → focus **cuối**
4. Khi đóng: restore focus; gỡ listener; mở scroll.
5. Esc đóng; \`aria-modal\`; tránh focus phần tử ẩn.

Dùng lib OK nếu giải thích được cơ chế.`,
    },
    example: {
      en: `Pseudo: \`onKeydown(e){ if(e.key!=='Tab')return; const list=getFocusable(); if(e.shiftKey && doc.active===list[0]){e.preventDefault();list.at(-1).focus()} else if(!e.shiftKey && doc.active===list.at(-1)){e.preventDefault();list[0].focus()} }\``,
      vi: `Pseudo tương tự: vòng Tab trong danh sách focusable của dialog; Shift+Tab ngược.`,
    },
    followUps: [
      {
        en: 'How do you test this?',
        vi: 'Test focus trap thế nào?',
      },
    ],
  },
  {
    id: 'debug-production-fe-be',
    category: 'technical',
    tags: ['debug', 'production'],
    question: {
      en: 'When you get a production issue, how do you debug it? How do you know if it’s FE or BE?',
      vi: 'Khi nhận production issue, debug như nào? Làm sao biết lỗi FE hay BE?',
    },
    answer: {
      en: `**Triage loop:**

1. Reproduce (user steps, env, account, browser).
2. Check **observability**: error monitoring (Sentry), logs, correlation id.
3. Network tab: status, payload, timing.
4. Bisect: does API return wrong data? → BE. Correct data but wrong UI/state? → FE. Both OK but race/cache? → FE orchestration or CDN/cache.

**FE smells:** console errors, hydration mismatch, wrong client cache, race, broken guard.
**BE smells:** 5xx, wrong schema, 403 inconsistent with UI role, slow TTFB with tiny JS.

Always capture: request id, timestamp, user id (privacy-safe), HAR if needed.`,
      vi: `**Vòng triage:**

1. Reproduce (steps, env, account, browser).
2. Xem **observability**: Sentry, logs, correlation id.
3. Network: status, payload, timing.
4. Bisect: API sai? → BE. API đúng UI/state sai? → FE. Race/cache? → orchestration FE hoặc CDN.

**Mùi FE:** console error, hydration, cache client sai, race, guard hỏng.
**Mùi BE:** 5xx, schema sai, 403 lệch role UI, TTFB chậm dù JS nhỏ.

Thu thập: request id, timestamp, user id (an toàn), HAR nếu cần.`,
    },
  },
  {
    id: 'debug-performance-fe-be',
    category: 'technical',
    tags: ['performance', 'debug'],
    question: {
      en: 'When you get a performance issue, how do you debug and fix it? FE or BE?',
      vi: 'Khi nhận performance issue, debug và xử lý như nào? Biết FE hay BE ra sao?',
    },
    answer: {
      en: `**Measure before opinion:**

- Field: Web Vitals (LCP, INP, CLS), RUM.
- Lab: Performance panel, React/Vue profiler, Lighthouse.
- Network waterfalls + server timings (\`Server-Timing\` header if available).

**Split:**

| Symptom | Likely |
|---|---|
| Long **TTFB** / waiting | BE, network, cold start |
| Download large JS, long **parse/compile** | FE bundle |
| Long **scripting** after data arrived | FE render/re-render |
| Many sequential API calls | FE waterfalls **or** BE missing aggregate endpoint |
| Huge JSON, small UI | BE over-fetch / FE asking too much |

**Fixes:** code-split, virtualize, cache, debounce, consolidate APIs, CDN, images, defer non-critical.`,
      vi: `**Đo trước khi đoán:**

- Field: Web Vitals, RUM.
- Lab: Performance panel, profiler, Lighthouse.
- Network waterfall + \`Server-Timing\`.

**Tách:**

| Triệu chứng | Khả năng |
|---|---|
| **TTFB** dài | BE / mạng / cold start |
| JS lớn, parse lâu | FE bundle |
| Scripting lâu sau khi có data | FE render |
| Nhiều API nối tiếp | FE waterfall hoặc BE thiếu aggregate |
| JSON khổng lồ | BE over-fetch / FE xin thừa |

**Fix:** code-split, virtualize, cache, debounce, gộp API, CDN, ảnh, defer.`,
    },
  },
  {
    id: 'usememo-usecallback',
    category: 'technical',
    tags: ['react', 'hooks'],
    question: {
      en: 'What is the difference between useMemo and useCallback?',
      vi: 'Sự khác biệt giữa useMemo và useCallback?',
    },
    answer: {
      en: `- **\`useMemo(() => value, deps)\`** memoizes a **computed value**.
- **\`useCallback(fn, deps)\`** memoizes a **function reference** (sugar for \`useMemo(() => fn, deps)\`).

Use when: pass stable props to \`memo\` children, expensive derive, or dependency identity matters.

**Don’t** wrap everything—memo has cost. Prefer state locality first.`,
      vi: `- **\`useMemo\`** nhớ **giá trị** tính toán.
- **\`useCallback\`** nhớ **tham chiếu hàm** (tương đương \`useMemo(() => fn, deps)\`).

Dùng khi: prop ổn định cho con \`memo\`, tính toán đắt, hoặc identity deps quan trọng.

**Đừng** bọc hết—memo cũng có chi phí. Ưu tiên thu hẹp state trước.`,
    },
    example: {
      en: `\`const sorted = useMemo(() => [...rows].sort(...), [rows])\`\n\`const onSelect = useCallback(id => setId(id), [])\``,
      vi: `\`const sorted = useMemo(() => [...rows].sort(...), [rows])\`\n\`const onSelect = useCallback(id => setId(id), [])\``,
    },
  },
  {
    id: 'useeffect',
    category: 'technical',
    tags: ['react', 'hooks'],
    question: {
      en: 'What is useEffect?',
      vi: 'useEffect là gì?',
    },
    answer: {
      en: `\`useEffect\` schedules **side effects** after paint: sync with external systems (DOM, network subscriptions, analytics).

- Runs after render; cleanup function runs before re-run/unmount.
- Deps array controls re-execution; \`[]\` ≈ mount/unmount.
- Not for computing UI values (derive in render / \`useMemo\`).
- For data fetching, prefer route loaders / React Query / server components when possible—effects are easy to race.

Vue bridge: similar spirit to \`watch\`/\`onMounted\`, but React re-renders whole function component.`,
      vi: `\`useEffect\` lên lịch **side effect** sau paint: đồng bộ hệ thống ngoài (DOM, subscribe, analytics).

- Chạy sau render; cleanup trước lần chạy lại/unmount.
- Deps điều khiển; \`[]\` ≈ mount/unmount.
- Không dùng để tính UI (derive trong render / \`useMemo\`).
- Fetch: ưu tiên loader / Query / RSC—effect dễ race.

Cầu nối Vue: gần \`watch\`/\`onMounted\`, nhưng React re-render cả function component.`,
    },
  },
  {
    id: 'jwt-login-flow',
    category: 'technical',
    tags: ['jwt', 'auth'],
    question: {
      en: 'Describe the login flow from FE → BE using JWT.',
      vi: 'Mô tả luồng đăng nhập từ FE → BE dùng JWT.',
    },
    answer: {
      en: `1. User submits credentials to \`POST /auth/login\` over HTTPS.
2. BE validates; on success creates **access token** (short TTL) and usually **refresh token** (longer, rotatable).
3. Prefer set tokens in **HttpOnly Secure SameSite cookies** (or access in memory + refresh cookie).
4. FE calls APIs; browser sends cookie automatically, or FE attaches \`Authorization: Bearer <access>\` if header-based.
5. On 401: try refresh once → retry; else logout.
6. Logout: clear cookies server-side / revoke refresh if stored.

FE still enforces route guards for UX; BE enforces authz on every sensitive endpoint.`,
      vi: `1. User gửi credentials \`POST /auth/login\` HTTPS.
2. BE validate; tạo **access** (TTL ngắn) và thường **refresh** (dài hơn, rotate).
3. Ưu tiên **HttpOnly Secure SameSite cookie** (hoặc access memory + refresh cookie).
4. Gọi API: cookie tự gửi, hoặc header \`Authorization: Bearer\`.
5. 401: refresh một lần → retry; fail thì logout.
6. Logout: clear cookie phía server / revoke refresh.

FE guard chỉ UX; BE authz mọi endpoint nhạy cảm.`,
    },
    example: {
      en: `Sequence: Login form → 200 Set-Cookie → \`GET /me\` → store user profile in memory/Query → navigate to /app.`,
      vi: `Login form → 200 Set-Cookie → \`GET /me\` → giữ profile trong memory/Query → vào /app.`,
    },
  },

  // ─── SITUATIONAL ─────────────────────────────────────
  {
    id: 'jwt-pros-cons',
    category: 'situational',
    tags: ['jwt'],
    question: {
      en: 'What are the advantages and disadvantages of JWT?',
      vi: 'Ưu và nhược điểm của JWT?',
    },
    answer: {
      en: `**Pros:** stateless verification (signature + claims); easy to pass between services; carries claims (roles, exp); good for APIs/mobile.

**Cons:** hard to revoke before expiry without denylist/versioning; large if overpacked; XSS risk if stored in JS-readable storage; careless use skips server session controls.

Senior take: JWT is a tool—pair with short access TTL + refresh rotation + secure storage.`,
      vi: `**Ưu:** verify stateless; dễ truyền service; mang claims; hợp API/mobile.

**Nhược:** khó revoke trước hết hạn nếu không denylist/version; payload phình; XSS nếu để chỗ JS đọc được; dễ bỏ qua kiểm soát session server.

Senior: access TTL ngắn + refresh rotate + lưu trữ an toàn.`,
    },
  },
  {
    id: 'jwt-backend-store',
    category: 'situational',
    tags: ['jwt'],
    question: {
      en: 'In a JWT system, does the backend need to store token information? Why or why not?',
      vi: 'Hệ thống dùng JWT thì backend có cần lưu thông tin token không? Vì sao?',
    },
    answer: {
      en: `**Access token:** often **not** stored—verified via signature + \`exp\` (pure stateless).

**Still store something when you need:**
- Refresh token hashes / family ids for rotation & theft detection
- Revocation list / session version per user
- Server-side sessions if you want instant logout

So: “JWT means zero storage” is oversimplified. Production auth usually stores **refresh/revocation metadata**, not the access token itself.`,
      vi: `**Access:** thường **không** lưu—verify chữ ký + \`exp\`.

**Vẫn cần lưu khi:**
- Hash refresh / family id để rotate & phát hiện trộm
- Denylist / session version để revoke
- Session server nếu cần logout tức thì

“JWT = không lưu gì” là nói tắt. Production thường lưu **metadata refresh/revoke**, không phải bản access.`,
    },
  },
  {
    id: 'jwt-not-localstorage',
    category: 'situational',
    tags: ['jwt', 'xss'],
    question: {
      en: 'Why is it generally not recommended to store JWTs in LocalStorage?',
      vi: 'Vì sao thường không nên lưu JWT trong LocalStorage?',
    },
    answer: {
      en: `LocalStorage is reachable by any XSS on your origin. A stolen access token can call APIs as the user until expiry.

Prefer **HttpOnly cookies** (not readable by JS) + CSRF defenses (\`SameSite\`, CSRF token for state-changing requests), or keep access token **in memory** and refresh via HttpOnly cookie.

If you must use bearer in memory, still invest heavily in XSS prevention (CSP, sanitization).`,
      vi: `LocalStorage bị mọi XSS trên origin đọc được → kẻ tấn token gọi API đến khi hết hạn.

Ưu tiên **HttpOnly cookie** + chống CSRF (\`SameSite\`, CSRF token), hoặc access **in memory** + refresh qua HttpOnly cookie.

Nếu bắt buộc bearer memory: siết XSS (CSP, sanitize).`,
    },
  },
  {
    id: 'cookies-local-session-storage',
    category: 'situational',
    tags: ['storage', 'browser'],
    question: {
      en: 'Differences between Cookies, LocalStorage, and SessionStorage?',
      vi: 'Khác biệt giữa Cookies, LocalStorage và SessionStorage?',
    },
    answer: {
      en: `| | Cookies | LocalStorage | SessionStorage |
|---|---|---|---|
| Sent to server | Yes (per rules) | No | No |
| Capacity | ~4KB | ~5MB+ | ~5MB+ |
| Lifetime | \`Expires\`/\`Max-Age\` | Until cleared | Tab session |
| JS access | Unless HttpOnly | Yes | Yes |
| Use | Auth session, prefs small | Non-secret prefs/cache | Per-tab wizard state |

Auth secrets → HttpOnly cookies or memory—not LocalStorage.`,
      vi: `| | Cookies | LocalStorage | SessionStorage |
|---|---|---|---|
| Gửi server | Có | Không | Không |
| Dung lượng | ~4KB | ~5MB+ | ~5MB+ |
| Lifetime | Expires/Max-Age | Đến khi xoá | Theo tab |
| JS đọc | Trừ HttpOnly | Có | Có |
| Dùng | Auth, pref nhỏ | Pref/cache không mật | Wizard theo tab |

Secret auth → HttpOnly/memory—không LocalStorage.`,
    },
  },
  {
    id: 'perf-issue-story',
    category: 'situational',
    tags: ['performance', 'story'],
    question: {
      en: 'Have you encountered performance issues? How did you investigate and resolve them? How do you tell FE vs BE bottleneck?',
      vi: 'Đã gặp performance issue chưa? Điều tra & xử lý thế nào? Phân biệt bottleneck FE/BE ra sao?',
    },
    answer: {
      en: `Answer with a **story + method** (see also technical perf question).

Story template: symptom → metric → waterfall → root cause → fix → regression guard.

FE vs BE: compare TTFB vs download vs scripting vs render. Slow waiting on network with small payload → BE. Long main-thread after JSON arrived → FE.`,
      vi: `Trả lời bằng **story + method**.

Template: triệu chứng → metric → waterfall → root cause → fix → chống regress.

FE vs BE: so TTFB / download / scripting / render. Chờ mạng lâu payload nhỏ → BE. Main-thread lâu sau JSON → FE.`,
    },
    example: {
      en: `“Admin table lagged. Profiler showed 2s scripting re-sorting 20k rows each keystroke. Fix: debounce + memoized filter + pagination. API was 120ms—BE fine.”`,
      vi: `“Table admin giật. Profiler: 2s scripting sort 20k rows mỗi lần gõ. Fix: debounce + memo filter + pagination. API 120ms—BE ổn.”`,
    },
  },
  {
    id: 'n-plus-one',
    category: 'situational',
    tags: ['n+1', 'api', 'backend'],
    question: {
      en: 'Have you encountered the N+1 query problem? How did you identify and fix it?',
      vi: 'Đã gặp N+1 query chưa? Nhận diện và fix thế nào?',
    },
    answer: {
      en: `**N+1:** 1 query for list + N queries per item (classic ORM). On FE you *feel* it as: list endpoint fast, then N detail calls; or one “graph” endpoint hammering DB.

**Identify:** network waterfall (many similar GETs); BE query logs / APM spans; \`Server-Timing\`.

**Fix:** eager load / join / dataloader batching on BE; on FE avoid chatty loops—ask for an aggregated endpoint or include relations via \`?include=\`.

FE-only band-aid: cache, but root fix is usually API/DB shape.`,
      vi: `**N+1:** 1 query list + N query từng item. Phía FE thấy: list nhanh rồi N request detail; hoặc 1 endpoint “graph” đánh DB nhiều.

**Nhận diện:** waterfall nhiều GET giống nhau; query log/APM; \`Server-Timing\`.

**Fix:** eager load/join/dataloader phía BE; FE đừng loop gọi—xin endpoint aggregate / \`include\`.

Cache FE chỉ là giảm đau; gốc thường ở API/DB.`,
    },
  },
  {
    id: 'api-caching',
    category: 'situational',
    tags: ['cache', 'api'],
    question: {
      en: 'Have you implemented API caching? What problem and trade-offs?',
      vi: 'Đã implement API caching chưa? Giải quyết vấn đề gì và trade-off?',
    },
    answer: {
      en: `**Problems solved:** duplicate GETs, back-button refetch, hammering BE on tab focus, perceived speed.

**Layers:** HTTP cache (\`Cache-Control\`), CDN, React Query/SWR, in-memory, service worker.

**Trade-offs:** freshness vs speed; invalidation complexity; personalized data shouldn’t be public-cached; stale-while-revalidate UX; memory cost.

Always define: TTL, key (url+params+user), invalidation on mutation.`,
      vi: `**Giải quyết:** GET trùng, back bị refetch, focus tab đập BE, tốc độ cảm nhận.

**Tầng:** HTTP cache, CDN, Query/SWR, memory, SW.

**Trade-off:** mới vs nhanh; invalidation phức tạp; data cá nhân không public-cache; SWR; tốn memory.

Luôn định nghĩa: TTL, key, invalidate khi mutation.`,
    },
    example: {
      en: `React Query: \`staleTime: 60_000\` for customer list; \`invalidateQueries(['customers'])\` after PATCH.`,
      vi: `React Query: \`staleTime: 60_000\` cho list; \`invalidateQueries\` sau PATCH.`,
    },
  },
  {
    id: 'ai-1500-line-component',
    category: 'situational',
    tags: ['ai', 'code-review'],
    question: {
      en: 'An AI tool generates a 1,500-line React component that works. Would you merge it? What criteria?',
      vi: 'AI generate component React 1.500 dòng chạy đúng. Có merge không? Tiêu chí đánh giá?',
    },
    answer: {
      en: `**Default: No merge as-is.**

Criteria before merge:
1. **Single responsibility** — split container / view / hooks.
2. **Readability** — naming, dead code, magic numbers.
3. **Tests** — behavior covered; not snapshot-only.
4. **A11y & security** — focus, labels, XSS.
5. **Perf** — unnecessary renders, huge lists.
6. **Consistency** — matches design system & folder rules.
7. **Ownership** — can the team maintain it without the AI chat?

Working ≠ production-ready.`,
      vi: `**Mặc định: không merge nguyên xi.**

Tiêu chí:
1. **SRP** — tách container/view/hooks.
2. **Readable** — tên, dead code.
3. **Tests** — hành vi, không chỉ snapshot.
4. **A11y & security**
5. **Perf**
6. **Consistency** với design system
7. **Maintain** được khi hết chat AI

Chạy được ≠ sẵn sàng production.`,
    },
  },
  {
    id: 'table-50k-rows',
    category: 'situational',
    tags: ['performance', 'table'],
    question: {
      en: 'A table must show 50,000 records. How do you design UI and rendering?',
      vi: 'Table cần hiển thị 50.000 records. Thiết kế UI và rendering thế nào?',
    },
    answer: {
      en: `Don’t mount 50k DOM rows.

1. **Server pagination** or cursor pagination (default).
2. If “scroll all”: **window virtualization** (react-virtual / tanstack-virtual).
3. Fetch strategy: page/cursor + optional infinite scroll.
4. Columns: freeze key cols; avoid heavy cells; defer charts.
5. Filters/sort on server when dataset large.
6. Selection state: store ids, not cloned row objects.
7. Export: async job, not client CSV of 50k in one go if heavy.`,
      vi: `Đừng mount 50k DOM rows.

1. **Pagination/cursor server** (mặc định).
2. Cần scroll dài: **virtualize**.
3. Fetch theo page/cursor / infinite scroll.
4. Cột nhẹ; filter/sort server.
5. Selection lưu id.
6. Export: job async.`,
    },
  },
  {
    id: 'lazy-loading-tradeoffs',
    category: 'situational',
    tags: ['performance', 'ux'],
    question: {
      en: 'When does lazy loading help, and when does it hurt UX?',
      vi: 'Khi nào lazy loading giúp perf, khi nào làm UX tệ hơn?',
    },
    answer: {
      en: `**Helps:** large routes rarely visited; heavy editors/charts; below-fold images; admin sections by role.

**Hurts:** critical path above-the-fold delayed (worse LCP); waterfall of tiny chunks; every click waits for download on poor networks; lazy of tiny components adds overhead.

Rule: lazy **coarse** boundaries (routes/features), preload on hover/intent for likely next steps.`,
      vi: `**Giúp:** route ít vào; editor/chart nặng; ảnh under-fold; section theo role.

**Hại:** trì hoãn above-the-fold (LCP); waterfall chunk nhỏ; mỗi click chờ mạng yếu; lazy component quá nhỏ thêm overhead.

Rule: lazy **biên lớn** (route/feature), preload khi hover/intent.`,
    },
  },
  {
    id: 'dashboard-15-apis',
    category: 'situational',
    tags: ['performance', 'ux', 'api'],
    question: {
      en: 'A dashboard loads data from 15 APIs. How do you optimize the loading experience?',
      vi: 'Dashboard load từ 15 APIs. Tối ưu trải nghiệm loading thế nào?',
    },
    answer: {
      en: `1. **Prioritize** above-the-fold widgets; defer secondary.
2. **Parallelize** independent requests; avoid sequential await chains.
3. **Aggregate BFF** endpoint if waterfalls dominate.
4. **Skeleton per widget** — partial UI > one big spinner.
5. **Cache** (Query) + stale-while-revalidate.
6. **Timeout & error isolation** — one failing API shouldn’t blank the page (error boundaries / per-widget error).
7. **HTTP/2 + compression**; watch payload sizes.
8. Optionally **SSE/push** for live tiles.`,
      vi: `1. **Ưu tiên** widget above-the-fold.
2. **Song song** request độc lập.
3. **BFF aggregate** nếu waterfall nặng.
4. **Skeleton từng widget**.
5. **Cache** + SWR.
6. **Cô lập lỗi** — 1 API fail không blank cả trang.
7. Giảm payload.
8. Tuỳ chọn SSE cho tile live.`,
    },
  },

  // extras
  {
    id: 'csrf-vs-xss',
    category: 'situational',
    tags: ['security'],
    question: {
      en: 'How do CSRF and XSS differ, and how do they relate to cookie auth?',
      vi: 'CSRF và XSS khác nhau thế nào, liên quan cookie auth ra sao?',
    },
    answer: {
      en: `**XSS:** attacker runs JS in your origin → can read non-HttpOnly storage / call APIs as user.
**CSRF:** attacker’s site triggers browser to send **your cookies** to your API on state-changing requests.

Cookie auth ⇒ defend CSRF (\`SameSite\`, CSRF tokens, Prefer header). XSS ⇒ CSP, sanitize, HttpOnly tokens. Both matter together.`,
      vi: `**XSS:** chạy JS trên origin bạn → đọc storage không HttpOnly / gọi API hộ user.
**CSRF:** site kẻ gửi request kèm **cookie của bạn** tới API (đổi trạng thái).

Cookie auth ⇒ chống CSRF. XSS ⇒ CSP/sanitize/HttpOnly. Hai thứ đi cùng nhau.`,
    },
  },
  {
    id: 'error-boundary-limits',
    category: 'technical',
    tags: ['react'],
    question: {
      en: 'What do React Error Boundaries catch and not catch?',
      vi: 'Error Boundary của React bắt được / không bắt được gì?',
    },
    answer: {
      en: `**Catch:** render errors in descendants, lifecycle, constructors.

**Don’t catch:** event handlers, async code, SSR errors (unless special handling), errors inside the boundary itself.

Use boundaries per widget on dashboards; pair with logging.`,
      vi: `**Bắt:** lỗi render con, lifecycle, constructor.

**Không:** event handler, async, SSR (trừ handling riêng), lỗi trong chính boundary.

Dashboard: boundary theo widget + logging.`,
    },
  },
]
