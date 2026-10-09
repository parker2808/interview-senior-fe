import { l, q } from './interview-questions-shared'
import type { InterviewQuestion } from './interview-questions-shared'

export const INTERVIEW_TECHNICAL_QUESTIONS: InterviewQuestion[] = [
  q({
    id: 'scale-codebase-100-features',
    category: 'technical',
    tags: ['architecture', 'scale'],
    question: l(
      'How would you structure a frontend codebase, and how would you scale it past 100 features?',
      'Dựng một codebase frontend như nào, làm thế nào để scale nếu có hơn 100 features?',
    ),
    answer: l(
      `**Short answer:** Start with a **modular monolith** with strong feature boundaries, then scale through domain ownership, state policy, and architecture enforcement rather than jumping straight to micro-frontends.

**Why:**

- \`app/\` or shell should own routing, layout, and providers.
- \`modules/<feature>/\` should own feature pages, components, hooks/composables, API client, and tests.
- \`shared/ui\` and \`shared/lib\` should stay small and intentional.

At scale, the big wins are:

1. clear domain ownership,
2. route/feature-level lazy loading,
3. typed API contracts,
4. a written state policy,
5. import boundaries enforced by tooling and review.

**Trade-offs:**

- too much “shared” code creates coupling,
- too much fragmentation creates navigation overhead,
- micro-frontends solve real org problems but add runtime and UX complexity.

The main failure mode is not file count. It is **unclear ownership and accidental coupling**.`,
      `**Trả lời ngắn:** Bắt đầu bằng **modular monolith** với feature boundary rõ, rồi scale bằng domain ownership, state policy và enforcement kiến trúc thay vì nhảy ngay sang micro-frontend.

**Vì sao:**

- \`app/\` hoặc shell nên ownership routing, layout và provider.
- \`modules/<feature>/\` nên ownership page, component, hook/composable, API client và test của feature đó.
- \`shared/ui\` và \`shared/lib\` nên giữ nhỏ và có chủ đích.

Khi scale, giá trị lớn nhất nằm ở:

1. domain ownership rõ,
2. lazy loading ở mức route/feature,
3. API contract có type,
4. state policy được viết rõ,
5. boundary import được enforce bằng tooling và code review.

**Trade-off:**

- quá nhiều code “shared” sẽ tăng coupling,
- tách quá vụn sẽ tăng chi phí điều hướng,
- micro-frontend giải quyết bài toán tổ chức thật nhưng thêm complexity về runtime và UX.

Failure mode chính không phải số lượng file, mà là **ownership mơ hồ và coupling vô tình**.`,
    ),
    example: l(
      `A good pattern is \`modules/customers/{pages,components,api,model,tests}\` with a public entry file. Other modules import the public API, not deep internals.`,
      `Pattern tốt là \`modules/customers/{pages,components,api,model,tests}\` kèm một public entry file. Module khác chỉ import public API, không chui sâu vào internals.`,
    ),
    followUps: [
      l('What belongs in URL state vs global store?', 'Cái gì nên nằm ở URL state và cái gì nên vào global store?'),
      l('At what point would you seriously consider package splitting or micro-frontends?', 'Tới ngưỡng nào bạn mới cân nhắc tách package hoặc micro-frontend?'),
    ],
  }),
  q({
    id: 'modal-nested',
    category: 'technical',
    tags: ['ui', 'modal', 'a11y'],
    question: l(
      'What do you need to build a modal component? How do you support nested modals?',
      'Dựng một modal component cần những gì, làm thế nào để dựng nhiều modal lồng nhau?',
    ),
    answer: l(
      `A production-ready modal needs more than an overlay and a box.

Core requirements:

- render via portal/teleport to avoid clipping and stacking issues,
- focus management: initial focus, trap focus, restore focus on close,
- keyboard support: Escape only closes the topmost modal,
- \`role="dialog"\`, \`aria-modal="true"\`, label/description wiring,
- body scroll lock,
- click-outside policy and close callbacks,
- predictable controlled API.

For nested modals, manage a stack:

1. only the top layer handles Escape,
2. only the top layer traps focus,
3. scroll lock uses reference counting,
4. z-index is systematic, not ad hoc.

Also say that deep nesting is usually a UX smell.`,
      `Một modal dùng được ở production cần nhiều hơn overlay với cái hộp.

Yêu cầu chính:

- render qua portal/teleport để tránh clipping và rối stacking,
- quản lý focus: focus ban đầu, trap focus, restore focus khi đóng,
- keyboard support: Escape chỉ đóng modal trên cùng,
- \`role="dialog"\`, \`aria-modal="true"\`, label/description đầy đủ,
- khóa body scroll,
- policy click-outside và callback close rõ ràng,
- API controlled dễ đoán.

Với modal lồng nhau, nên quản lý theo stack:

1. chỉ layer trên cùng xử lý Escape,
2. chỉ layer trên cùng trap focus,
3. scroll lock dùng reference counting,
4. z-index có hệ thống, không tăng tay linh tinh.

Và nên nói luôn: modal stack quá sâu thường là UX smell.`,
    ),
  }),
  q({
    id: 'a11y-modal-focus-trap',
    category: 'technical',
    tags: ['a11y', 'modal', 'focus'],
    question: l(
      'Have you worked on accessibility? How do you open a modal so Tab focus does not escape outside?',
      'Đã có kinh nghiệm accessibility chưa? Làm sao mở modal mà Tab không nhảy focus ra ngoài?',
    ),
    answer: l(
      `Yes. A11y should be part of acceptance criteria, not a last-minute polish item.

Focus trap algorithm:

1. save the previously focused element,
2. focus the first meaningful element inside the dialog or the dialog container itself,
3. compute the list of focusable elements inside the dialog,
4. on Tab / Shift+Tab, cycle between first and last,
5. on close, restore focus and remove listeners.

Important details:

- hidden or disabled elements should not receive focus,
- screen reader labeling must be correct,
- test with keyboard only, not just visually.

Using a library is fine if you understand the mechanics.`,
      `Có. A11y nên là một phần của acceptance criteria, không phải đồ trang trí cuối sprint.

Thuật toán focus trap:

1. lưu phần tử đang được focus trước đó,
2. đưa focus vào phần tử có ý nghĩa đầu tiên trong dialog hoặc chính container,
3. lấy danh sách focusable element bên trong dialog,
4. khi Tab / Shift+Tab thì vòng giữa phần tử đầu và cuối,
5. khi đóng thì restore focus và gỡ listener.

Chi tiết quan trọng:

- phần tử hidden hoặc disabled không được nhận focus,
- label cho screen reader phải đúng,
- test bằng keyboard thật chứ không chỉ nhìn bằng mắt.

Dùng library thì ổn, miễn là giải thích được cơ chế.`,
    ),
    followUps: [
      l('How would you test keyboard and screen-reader behavior?', 'Bạn test keyboard và screen-reader behavior thế nào?'),
    ],
  }),
  q({
    id: 'debug-production-fe-be',
    category: 'technical',
    tags: ['debug', 'production'],
    question: l(
      'When you get a production issue, how do you debug it? How do you know if it’s FE or BE?',
      'Khi nhận production issue, debug như nào? Làm sao biết lỗi FE hay BE?',
    ),
    answer: l(
      `My loop is: reproduce, observe, isolate, verify.

1. reproduce with exact account, browser, and timing if possible,
2. check monitoring, logs, console, and network,
3. inspect payloads, status codes, timing, and cache behavior,
4. decide whether the source of truth is wrong or the UI is misrepresenting it.

Usually:

- wrong API data or 5xx points toward BE,
- correct API data but wrong UI state points toward FE,
- inconsistent results can indicate race conditions or caching layers.

The key is not to guess from intuition first. Start from evidence.`,
      `Vòng lặp của em là: reproduce, observe, isolate, verify.

1. reproduce với đúng account, browser và timing nếu có thể,
2. xem monitoring, log, console và network,
3. kiểm tra payload, status code, timing và cache behavior,
4. quyết định xem source of truth đang sai hay UI đang hiển thị sai.

Thường thì:

- data API sai hoặc 5xx nghiêng về BE,
- data API đúng nhưng UI/state sai nghiêng về FE,
- kết quả lúc đúng lúc sai thường gợi ý race condition hoặc caching layer.

Điểm quan trọng là đừng đoán bằng trực giác trước. Hãy bắt đầu bằng evidence.`,
    ),
  }),
  q({
    id: 'debug-performance-fe-be',
    category: 'technical',
    tags: ['performance', 'debug'],
    question: l(
      'When you get a performance issue, how do you debug and fix it? FE or BE?',
      'Khi nhận performance issue, debug và xử lý như nào? Biết FE hay BE ra sao?',
    ),
    answer: l(
      `**Short answer:** Measure first, then split the problem into **network/TTFB**, **payload/bundle**, **main-thread scripting**, and **rendering** to see whether the bottleneck is FE, BE, or both.

**Why:**

- Field data tells you user pain.
- Lab tools show where time is actually spent.
- Waterfalls reveal serialization, payload size, and cache misses.

My mental split:

- high **TTFB** -> BE, network, cold start, or cache policy
- large download / parse / compile -> FE bundle problem
- long scripting or re-render time -> FE state/render problem
- many sequential calls -> FE orchestration or BE API shape problem

**Trade-offs:**

- do not guess from “the page feels slow”,
- do not optimize render if TTFB is the real bottleneck,
- do not hide architecture problems with spinners alone.

Fixes should target the dominant bottleneck, not “optimize everything.”`,
      `**Trả lời ngắn:** Hãy đo trước, rồi tách bài toán thành **network/TTFB**, **payload/bundle**, **main-thread scripting** và **rendering** để biết bottleneck nằm ở FE, BE hay cả hai.

**Vì sao:**

- Field data cho biết user đang đau ở đâu.
- Lab tool cho biết thời gian thực sự bị tiêu ở bước nào.
- Waterfall lộ ra vấn đề serialize request, payload lớn hay cache miss.

Mental split của em:

- **TTFB** cao -> BE, network, cold start hoặc cache policy
- download / parse / compile lớn -> vấn đề bundle phía FE
- scripting hoặc re-render lâu -> vấn đề state/render phía FE
- nhiều call nối tiếp -> orchestration FE hoặc API shape từ BE

**Trade-off:**

- đừng đoán chỉ vì “trang thấy chậm”,
- đừng tối ưu render nếu TTFB mới là bottleneck thật,
- đừng che bài toán kiến trúc bằng spinner.

Fix phải đánh vào bottleneck chính, không phải “tối ưu tất cả mọi thứ”.`,
    ),
    example: l(
      `A concise example: “If the API is fast but typing into a big table still causes long scripting blocks, I profile the main thread and look for repeated sort/filter work, unstable props, or over-rendering. If the wait is mostly before the first byte, I pivot toward BE, caching, or network analysis.”`,
      `Một ví dụ ngắn: “Nếu API nhanh nhưng gõ vào một table lớn vẫn tạo scripting block dài, em sẽ profile main thread để tìm repeated sort/filter work, props không ổn định hoặc over-rendering. Nếu thời gian chủ yếu mất trước first byte thì em chuyển sang phân tích BE, caching hoặc network.”`,
    ),
    followUps: [
      l('What tools would you use first in production vs local?', 'Bạn sẽ dùng tool gì đầu tiên ở production so với local?'),
      l('Can you give an example where the issue looked like FE but was actually BE?', 'Bạn có ví dụ nào trông như lỗi FE nhưng thực ra là BE không?'),
    ],
  }),
  q({
    id: 'usememo-usecallback',
    category: 'technical',
    tags: ['react', 'hooks', 'performance'],
    question: l('What is the difference between useMemo and useCallback?', 'Sự khác biệt giữa useMemo và useCallback?'),
    answer: l(
      `\`useMemo\` memoizes a **value**. \`useCallback\` memoizes a **function reference**.

Typical uses:

- \`useMemo\` for expensive derived values or stable object props,
- \`useCallback\` when callback identity matters for child memoization or hook dependencies.

But the bigger point is trade-off: memoization has overhead and mental cost. If a component only becomes fast because everything is wrapped in memo hooks, the design may be off. Prefer fixing state locality and unnecessary parent re-renders first.`,
      `\`useMemo\` ghi nhớ một **giá trị**. \`useCallback\` ghi nhớ một **tham chiếu hàm**.

Use phổ biến:

- \`useMemo\` cho derived value tốn chi phí hoặc object prop cần ổn định,
- \`useCallback\` khi identity của callback ảnh hưởng tới child memoization hoặc dependency của hook khác.

Nhưng điểm quan trọng hơn là trade-off: memoization có overhead và tăng độ nặng về mental model. Nếu component chỉ nhanh khi mọi thứ đều bị bọc memo hook thì có thể design đang có vấn đề. Nên ưu tiên sửa state locality và parent re-render không cần thiết trước.`,
    ),
    example: l(
      `\`const sorted = useMemo(() => [...rows].sort(sorter), [rows, sorter])\`\n\`const onSelect = useCallback((id) => setSelected(id), [])\``,
      `\`const sorted = useMemo(() => [...rows].sort(sorter), [rows, sorter])\`\n\`const onSelect = useCallback((id) => setSelected(id), [])\``,
    ),
  }),
  q({
    id: 'useeffect',
    category: 'technical',
    tags: ['react', 'hooks', 'effects'],
    question: l('What is useEffect?', 'useEffect là gì?'),
    answer: l(
      `**Short answer:** \`useEffect\` is for synchronizing React with **external systems after render**, not for computing normal UI values.

**Why:**

- render should stay pure,
- effects run after commit,
- cleanup runs before re-run and on unmount.

Good use cases:

- subscriptions,
- DOM APIs,
- timers,
- analytics,
- network side effects when not handled by a better data layer.

**Trade-offs / common mistakes:**

- using effects for derived values,
- missing dependencies and creating stale closures,
- fetching without cancellation or caching strategy,
- stuffing too much unrelated logic into one effect.

For a Vue developer, a useful mental model is: effect is closer to “sync with the outside world after render,” not a replacement for \`computed\`.`,
      `**Trả lời ngắn:** \`useEffect\` dùng để đồng bộ React với **hệ thống bên ngoài sau render**, không phải để tính các giá trị UI thông thường.

**Vì sao:**

- render phải giữ được purity,
- effect chạy sau commit,
- cleanup chạy trước lần re-run và khi unmount.

Case dùng hợp lý:

- subscription,
- DOM API,
- timer,
- analytics,
- network side effect khi chưa có data layer tốt hơn.

**Trade-off / lỗi hay gặp:**

- dùng effect để tính derived value,
- thiếu dependency tạo stale closure,
- fetch mà không có cancel hoặc cache strategy,
- nhét quá nhiều logic không liên quan vào một effect.

Với người đi từ Vue sang, mental model hữu ích là: effect gần với “đồng bộ với thế giới bên ngoài sau render”, chứ không phải bản thay thế của \`computed\`.`,
    ),
    example: l(
      `\`\`\`tsx
useEffect(() => {
  const controller = new AbortController()

  fetch(\`/api/search?q=\${query}\`, { signal: controller.signal })
    .then((r) => r.json())
    .then(setResults)

  return () => controller.abort()
}, [query])
\`\`\``,
      `\`\`\`tsx
useEffect(() => {
  const controller = new AbortController()

  fetch(\`/api/search?q=\${query}\`, { signal: controller.signal })
    .then((r) => r.json())
    .then(setResults)

  return () => controller.abort()
}, [query])
\`\`\``,
    ),
    followUps: [
      l('When would you avoid fetching in useEffect entirely?', 'Khi nào bạn tránh fetch trong useEffect hoàn toàn?'),
      l('Why do stale closures happen in effects?', 'Vì sao stale closure hay xảy ra trong effect?'),
    ],
  }),
  q({
    id: 'jwt-login-flow',
    category: 'technical',
    tags: ['auth', 'jwt', 'security'],
    question: l('Describe the login flow from FE -> BE using JWT.', 'Mô tả luồng đăng nhập từ FE -> BE dùng JWT.'),
    answer: l(
      `**What they actually ask:** Where does the access token live, how does refresh rotate, and what happens when ten requests 401 at once?

**How a senior answers:** HTTPS POST credentials → BE sets **httpOnly + Secure + SameSite refresh**, returns a **short-lived access** (memory or short cookie). FE loads \`/me\`. Axios/ofetch **401 interceptor, single-flight refresh**, retry once. Logout hits BE (revoke family) + \`BroadcastChannel\` other tabs. Constraint: Vue route guards are **UX**; authz is the API.

**Failure mode:** \`localStorage.token\`. Parallel 401s all rotate refresh → all but one fail → logout storm. Refresh interceptor recursing on \`/refresh\` 401. Pinia \`persist: true\` on the user store.

**Measure:** Session-fixation / refresh-reuse test on the server. Time-to-revoke after logout. XSS tabletop: “what can they steal?” Duplicate login after hard refresh (silent refresh).

**Tradeoffs:** Memory access + cookie refresh: XSS-harder, needs boot refresh. Session cookie only: simplest, CSRF on mutations. SPA talking to a BFF (Nuxt/Nitro) beats raw JWT in the browser.

**Production gotchas:** Clock skew — refresh a minute early. 401 on \`/refresh\` must not recurse. OAuth/OIDC: Authorization Code + PKCE, not implicit. FE never trusts JWT \`exp\` for authz.`,
      `**Họ thực sự hỏi:** Access token sống ở đâu, refresh xoay thế nào, và mười request 401 cùng lúc thì sao?

**Cách senior trả lời:** HTTPS POST credential → BE set **refresh httpOnly + Secure + SameSite**, trả **access ngắn** (memory hoặc cookie ngắn). FE load \`/me\`. Interceptor 401 Axios/ofetch, **refresh single-flight**, retry một lần. Logout gọi BE (revoke family) + \`BroadcastChannel\` tab khác. Constraint: Vue route guard là **UX**; authz là API.

**Failure mode:** \`localStorage.token\`. Nhiều 401 cùng xoay refresh → chỉ một thành công → bão logout. Interceptor đệ quy khi \`/refresh\` 401. Pinia \`persist: true\` trên user store.

**Measure:** Test session-fixation / reuse refresh phía server. Thời gian revoke sau logout. Bàn XSS: “cướp được gì?” Login trùng sau hard refresh (silent refresh).

**Tradeoffs:** Access memory + refresh cookie: khó XSS hơn, cần refresh lúc boot. Chỉ session cookie: đơn giản, CSRF trên mutation. SPA nói chuyện BFF (Nuxt/Nitro) hơn JWT trần trên browser.

**Production gotchas:** Lệch đồng hồ — refresh sớm một phút. 401 \`/refresh\` không được đệ quy. OAuth/OIDC: Authorization Code + PKCE, không implicit. FE không tin \`exp\` JWT để authz.`,
    ),
    followUps: [
      l('Walk through a single-flight refresh when five GETs 401 together.', 'Kể single-flight refresh khi năm GET cùng 401.'),
      l('How do you logout every tab without leaving a usable refresh cookie?', 'Bạn logout mọi tab mà không để lại refresh cookie dùng được thế nào?'),
    ],
  }),
  q({
    id: 'error-boundary-limits',
    category: 'technical',
    tags: ['react', 'error-handling'],
    question: l('What do React Error Boundaries catch and not catch?', 'Error Boundary của React bắt được / không bắt được gì?'),
    answer: l(
      `**What they actually ask:** Why did the checkout still white-screen when the error was in a click handler, and where do you put the boundary?

**How a senior answers:** React error boundaries catch **render/lifecycle/constructor** errors in descendants. Decision: isolate **widgets** (chart, third-party, one dashboard card), not one giant app boundary. Constraint: they miss event handlers, async/promises, SSR, and errors thrown inside the boundary itself. Vue analog: \`onErrorCaptured\` + \`errorHandler\` — same “render vs event” split.

**Failure mode:** One top-level boundary blanks the product. Swallowing the error without reporting. Expecting a boundary to catch \`await api()\` in \`onMounted\` / \`useEffect\`.

**Measure:** Sentry/OTel: recovered vs fatal. A test that a chart throw leaves the page chrome intact. Synthetic click-handler throw still needs your own \`try/catch\`.

**Tradeoffs:** Fine-grained boundaries add recovery UI and hide shared-cause outages. Too coarse and one widget kills the shell.

**Production gotchas:** Next \`error.tsx\` is per **segment**, not a substitute for client async. Vue \`<Suspense>\` error vs async setup. Logging must happen in the boundary, not only \`console.error\`.`,
      `**Họ thực sự hỏi:** Vì sao checkout vẫn trắng màn khi lỗi nằm ở click handler, và boundary đặt ở đâu?

**Cách senior trả lời:** Error boundary React bắt lỗi **render/lifecycle/constructor** ở descendant. Decision: cô lập **widget** (chart, third-party, một card dashboard), không một boundary khổng lồ cho cả app. Constraint: bỏ lỡ event handler, async/promise, SSR, và lỗi ném trong chính boundary. Tương đương Vue: \`onErrorCaptured\` + \`errorHandler\` — cùng tách “render vs event.”

**Failure mode:** Một boundary top-level làm trắng product. Nuốt lỗi không report. Trông boundary bắt \`await api()\` trong \`onMounted\` / \`useEffect\`.

**Measure:** Sentry/OTel: recovered vs fatal. Test chart throw mà chrome page còn. Throw synthetic ở click vẫn cần \`try/catch\` của bạn.

**Tradeoffs:** Boundary mịn thêm UI recovery và giấu outage cùng gốc. Quá thô thì một widget giết shell.

**Production gotchas:** Next \`error.tsx\` theo **segment**, không thay async phía client. Vue \`<Suspense>\` lỗi vs async setup. Log phải nằm trong boundary, không chỉ \`console.error\`.`,
    ),
    followUps: [
      l('How do you catch an async error that an error boundary will miss?', 'Bạn bắt lỗi async mà error boundary bỏ sót thế nào?'),
      l('Where would you place boundaries on a Vue/Nuxt dashboard vs one App.vue handler?', 'Bạn đặt boundary trên dashboard Vue/Nuxt thế nào so với một handler App.vue?'),
    ],
  }),
  q({
    id: 'js-event-loop',
    category: 'technical',
    tags: ['javascript', 'event-loop', 'async'],
    question: l('Explain the JavaScript event loop.', 'Giải thích JavaScript event loop.'),
    answer: l(
      `**What they actually ask:** Why did this Vue update not paint, and is \`nextTick\` a microtask or a “wait a bit”?

**How a senior answers:** Stack runs to empty. Then **all** microtasks (Promise jobs, \`queueMicrotask\`, MutationObserver, Vue’s scheduler flush) run before paint or the next macrotask (\`setTimeout\`, I/O, input). Decision: \`nextTick\` waits for Vue’s flush — the API for “read layout after my refs commit.” \`setTimeout(0)\` yields to paint/input; it is not a DOM-measure tool.

**Failure mode:** Microtask starvation — a chain of \`await\` on already-resolved promises never returns to the renderer. Treating \`Promise.resolve().then\` as a substitute for \`nextTick\` (order vs Vue’s job is not guaranteed the way you think).

**Measure:** Performance panel: long tasks >50ms, INP, total blocking time — not the puzzle output of A/D/C/B.

**Tradeoffs:** Flushing Vue as a microtask keeps DOM consistent before paint; a tight microtask loop janks harder than a macrotask split.

**Production gotchas:** \`await nextTick()\` then measure then write layout → forced reflow. Worker/off-main-thread is the escape hatch when the loop is the bottleneck.`,
      `**Họ thực sự hỏi:** Vì sao update Vue chưa paint, và \`nextTick\` là microtask hay “đợi một lúc”?

**Cách senior trả lời:** Stack chạy đến hết. Rồi **mọi** microtask (Promise, \`queueMicrotask\`, MutationObserver, flush scheduler Vue) chạy trước paint hoặc macrotask sau (\`setTimeout\`, I/O, input). Decision: \`nextTick\` chờ flush Vue — API cho “đọc layout sau khi ref commit.” \`setTimeout(0)\` nhường paint/input; không phải tool đo DOM.

**Failure mode:** Đói microtask — chuỗi \`await\` trên promise đã resolve không trả lại renderer. Coi \`Promise.resolve().then\` là thay \`nextTick\` (thứ tự vs job Vue không như bạn nghĩ).

**Measure:** Panel Performance: long task >50ms, INP, total blocking time — không phải output đố A/D/C/B.

**Tradeoffs:** Flush Vue bằng microtask giữ DOM khớp trước paint; vòng microtask chặt giật hơn việc tách macrotask.

**Production gotchas:** \`await nextTick()\` rồi đo rồi ghi layout → forced reflow. Worker/off-main-thread là lối thoát khi loop là nút thắt.`,
    ),
    example: l(
      `\`\`\`js
console.log('A')
setTimeout(() => console.log('B'), 0)
Promise.resolve().then(() => console.log('C'))
console.log('D')
// A, D, C, B
\`\`\``,
      `\`\`\`js
console.log('A')
setTimeout(() => console.log('B'), 0)
Promise.resolve().then(() => console.log('C'))
console.log('D')
// A, D, C, B
\`\`\``,
    ),
    followUps: [
      l('What is the difference between a task and a microtask?', 'Khác nhau giữa task và microtask là gì?'),
      l('How does the event loop relate to input lag or INP?', 'Event loop liên quan thế nào tới input lag hoặc INP?'),
    ],
  }),
  q({
    id: 'js-closures',
    category: 'technical',
    tags: ['javascript', 'closures'],
    question: l('What is a closure and why does it matter?', 'Closure là gì và vì sao nó quan trọng?'),
    answer: l(
      `**What they actually ask:** A search box still fetches the previous query. A debounce sends stale args. A module Map holds the last user’s 20MB export.

**How a senior answers:** A closure keeps **bindings**, not a snapshot — unless you copied a \`const\` at schedule time. Decision: in Vue, read latest refs **inside** the async callback (\`page.value\`). In React, \`useRef\` for latest or include the dep and abort. Constraint: whatever the closure retains is ineligible for GC until the function is released.

**Failure mode:** Debounce closing over first-call args. \`window\` listener in \`onMounted\` capturing \`props.user\` once. Module singleton retaining per-user blobs across logout.

**Measure:** Memory retainers. A test that a second query resolves first and the first result is dropped.

**Tradeoffs:** “Always latest ref” is simpler than aborting but still wastes network. Prefer abort **and** ignore stale.

**Production gotchas:** Pinia \`$subscribe\` / \`watch\` without \`onCleanup\`. VueUse event composables that you never stop. React \`useCallback([],)\` is the same bug with different syntax.`,
      `**Họ thực sự hỏi:** Ô search vẫn fetch query cũ. Debounce gửi args stale. Map ở module giữ export 20MB của user trước.

**Cách senior trả lời:** Closure giữ **binding**, không phải snapshot — trừ khi bạn copy \`const\` lúc schedule. Decision: trong Vue, đọc ref **trong** callback async (\`page.value\`). Trong React, \`useRef\` cho giá trị mới hoặc đưa vào dep và abort. Constraint: thứ closure giữ thì GC không thu đến khi function được thả.

**Failure mode:** Debounce close over args lần gọi đầu. Listener \`window\` trong \`onMounted\` chụp \`props.user\` một lần. Singleton module giữ blob theo user qua logout.

**Measure:** Memory retainer. Test query thứ hai xong trước và kết quả thứ nhất bị bỏ.

**Tradeoffs:** “Luôn đọc ref mới” đơn giản hơn abort nhưng vẫn tốn network. Nên abort **và** bỏ stale.

**Production gotchas:** Pinia \`$subscribe\` / \`watch\` không \`onCleanup\`. Composable VueUse event không stop. React \`useCallback([],)\` cùng bug khác cú pháp.`,
    ),
    followUps: [
      l('How do you abort the previous search and ignore its result?', 'Bạn abort search trước và bỏ kết quả của nó thế nào?'),
      l('When is a module-level closure a security bug after logout?', 'Khi nào closure ở module là bug bảo mật sau logout?'),
    ],
  }),
  q({
    id: 'js-this-call-bind',
    category: 'technical',
    tags: ['javascript', 'this'],
    question: l('How does `this` work in JavaScript? What about call/apply/bind?', '`this` trong JavaScript hoạt động thế nào? call/apply/bind để làm gì?'),
    answer: l(
      `**What they actually ask:** Why did \`this.$emit\` die after you extracted a helper, and can you remove the listener you bound?

**How a senior answers:** \`function\` binds \`this\` at the **call site**; arrows close over lexical \`this\`. Decision: Vue **Options** methods are bound to the instance — write \`onClick() { this.save() }\`. An arrow in \`methods\` captures module \`this\` (\`undefined\` in ESM). Composition API almost never uses \`this\`. \`call\`/\`apply\` invoke now; \`bind\` returns a bound function. Constraint: \`addEventListener('click', obj.method)\` detaches the receiver.

**Failure mode:** Binding a **new** wrapper every render so \`removeEventListener\` never matches. Class fields \`onClick = () => this.save()\` duplicate per instance (fine) vs forgetting \`bind\` on a prototype method (broken).

**Measure:** A test that the listener can be removed. Options-API \`this.$emit\` still fires after extracting a helper.

**Tradeoffs:** Arrows in callbacks are the default. Explicit \`bind\` is clearer for removable listeners (\`{ signal }\` is even better).

**Production gotchas:** \`this\` in a Vue template is the instance; in \`<script setup>\` there is no \`this\`. React class components vs hooks. Third-party widgets calling your method as a bare function.`,
      `**Họ thực sự hỏi:** Vì sao \`this.$emit\` chết sau khi tách helper, và bạn gỡ được listener đã bind không?

**Cách senior trả lời:** \`function\` bind \`this\` ở **call site**; arrow đóng lexical \`this\`. Decision: method Vue **Options** đã bind instance — viết \`onClick() { this.save() }\`. Arrow trong \`methods\` bắt \`this\` module (\`undefined\` trong ESM). Composition API gần như không dùng \`this\`. \`call\`/\`apply\` gọi ngay; \`bind\` trả hàm đã gắn. Constraint: \`addEventListener('click', obj.method)\` làm mất receiver.

**Failure mode:** Bind wrapper **mới** mỗi render nên \`removeEventListener\` không khớp. Class field \`onClick = () => this.save()\` nhân đôi mỗi instance (ổn) vs quên \`bind\` method prototype (gãy).

**Measure:** Test gỡ được listener. Options-API \`this.$emit\` vẫn chạy sau khi tách helper.

**Tradeoffs:** Arrow trong callback là default. \`bind\` tường minh rõ hơn cho listener gỡ được (\`{ signal }\` còn hơn).

**Production gotchas:** \`this\` trong template Vue là instance; \`<script setup>\` không có \`this\`. React class vs hooks. Widget gọi method của bạn như hàm trần.`,
    ),
    followUps: [
      l('Why is an arrow function in Options API methods usually a bug?', 'Vì sao arrow trong methods Options API thường là bug?'),
      l('How do you register and remove the same bound listener?', 'Bạn đăng ký và gỡ cùng một listener đã bind thế nào?'),
    ],
  }),
  q({
    id: 'js-prototype-chain',
    category: 'technical',
    tags: ['javascript', 'prototypes'],
    question: l('Explain the prototype chain.', 'Giải thích prototype chain.'),
    answer: l(
      `**What they actually ask:** Why is \`el instanceof HTMLElement\` false from an iframe, and what does \`markRaw\` fix for a Map/chart instance in Vue?

**How a senior answers:** Lookup walks own props then \`[[Prototype]]\` to \`null\`. Decision: \`class\` for identity + shared methods (\`Error\` subclasses, \`instanceof\` in \`catch\`). Do **not** build app UI on prototype inheritance — Vue components/composables are functions + data. Constraint: prototype methods are shared; class **fields** are per instance.

**Failure mode:** \`data instanceof Array\` across realms (iframe, jsdom vs window). Vue \`reactive()\` on a class wrapping Mapbox — \`this\` and \`instanceof\` go weird; \`markRaw\` the instance.

**Measure:** Fix with \`Array.isArray\`, \`node.nodeType\`, or \`Object.prototype.toString\`. A test in a second window if you embed iframes.

**Tradeoffs:** Prototypes save memory for many instances. Composition (objects + functions) is what Vue/React codebases actually maintain.

**Production gotchas:** Extending built-ins (Array) is still sharp. \`Object.create(null)\` has no \`toString\` — bad as a dictionary if you use \`in\`/\`hasOwn\` carelessly. Pinia stores are not classes.`,
      `**Họ thực sự hỏi:** Vì sao \`el instanceof HTMLElement\` false từ iframe, và \`markRaw\` sửa gì cho instance Map/chart trong Vue?

**Cách senior trả lời:** Tra cứu đi own props rồi \`[[Prototype]]\` tới \`null\`. Decision: \`class\` khi cần identity + method share (\`Error\` subclass, \`instanceof\` trong \`catch\`). **Không** dựng UI app trên prototype inheritance — component/composable Vue là function + data. Constraint: method prototype được share; **field** class là per instance.

**Failure mode:** \`data instanceof Array\` qua realm (iframe, jsdom vs window). Vue \`reactive()\` lên class bọc Mapbox — \`this\` và \`instanceof\` loạn; \`markRaw\` instance đó.

**Measure:** Sửa bằng \`Array.isArray\`, \`node.nodeType\`, hoặc \`Object.prototype.toString\`. Test ở window thứ hai nếu có iframe.

**Tradeoffs:** Prototype tiết kiệm nhớ khi nhiều instance. Composition (object + function) mới là thứ Vue/React maintain.

**Production gotchas:** Extend built-in (Array) vẫn sắc. \`Object.create(null)\` không có \`toString\` — dictionary xấu nếu dùng \`in\`/\`hasOwn\` ẩu. Store Pinia không phải class.`,
    ),
    followUps: [
      l('What does markRaw fix for a Google Map or Monaco instance in Vue?', 'markRaw sửa gì cho instance Google Map hoặc Monaco trong Vue?'),
      l('Why can instanceof fail for a node from another iframe?', 'Vì sao instanceof fail với node từ iframe khác?'),
    ],
  }),
  q({
    id: 'js-hoisting-tdz',
    category: 'technical',
    tags: ['javascript', 'hoisting'],
    question: l('What are hoisting and the temporal dead zone?', 'Hoisting và temporal dead zone là gì?'),
    answer: l(
      `**What they actually ask:** A circular \`store\` ↔ composable import dies in the app and works in a unit test. Can you name TDZ instead of “hoisting is moving declarations up”?

**How a senior answers:** Treat hoisting as a **load-order** problem. Function declarations are initialized. \`var\` is \`undefined\`. \`let\`/\`const\` exist in TDZ until the line runs — access throws. Decision: break cycles with a function (\`getStore()\`), a third module, or \`import()\` after init. Do not “use \`var\` to avoid TDZ.”

**Failure mode:** \`a.ts\` imports \`b.ts\` imports \`a.ts\`; the second file reads a \`const\` export still in TDZ. Works in Vitest (different graph), dies in the Vite app chunk.

**Measure:** The exact \`ReferenceError\` at startup, then the import graph (Madge / Vite circular warning).

**Tradeoffs:** Lazy getters hide cycles and hide design smell. A third module is louder and usually right.

**Production gotchas:** Vue auto-import + Pinia can recreate the cycle. \`typeof\` on a TDZ binding still throws for \`let\`/\`const\`. SSR boot order ≠ client boot order.`,
      `**Họ thực sự hỏi:** Import vòng \`store\` ↔ composable chết ở app, sống trong unit test. Bạn gọi tên TDZ thay vì “hoisting là kéo declaration lên”?

**Cách senior trả lời:** Coi hoisting là bài **thứ tự load**. Function declaration được khởi tạo. \`var\` là \`undefined\`. \`let\`/\`const\` nằm TDZ đến khi tới dòng — truy cập thì throw. Decision: cắt vòng bằng function (\`getStore()\`), module thứ ba, hoặc \`import()\` sau init. Không “dùng \`var\` để tránh TDZ.”

**Failure mode:** \`a.ts\` import \`b.ts\` import \`a.ts\`; file sau đọc export \`const\` còn TDZ. Vitest (graph khác) ổn, chunk Vite thì chết.

**Measure:** Đúng \`ReferenceError\` lúc start, rồi graph import (Madge / cảnh báo circular Vite).

**Tradeoffs:** Getter lazy giấu vòng và giấu mùi thiết kế. Module thứ ba ồn hơn và thường đúng.

**Production gotchas:** Auto-import Vue + Pinia tạo lại vòng. \`typeof\` trên binding TDZ vẫn throw với \`let\`/\`const\`. Thứ tự boot SSR ≠ client.`,
    ),
    followUps: [
      l('How do you break a Pinia ↔ composable import cycle?', 'Bạn cắt vòng import Pinia ↔ composable thế nào?'),
      l('Does typeof x throw when x is in the TDZ?', 'typeof x có throw khi x đang trong TDZ không?'),
    ],
  }),
  q({
    id: 'js-copy-immutability',
    category: 'technical',
    tags: ['javascript', 'immutability'],
    question: l('What is the difference between shallow copy, deep copy, and immutability?', 'Khác nhau giữa shallow copy, deep copy và immutability là gì?'),
    answer: l(
      `**What they actually ask:** Did this Pinia/Vue update mutate a shared nested object, and did you \`structuredClone\` a 50k-row page for no reason?

**How a senior answers:** Shallow copy = new container, same nested refs (\`{ ...obj }\`, \`arr.slice()\`). Deep copy = recursive new graph. Immutability is a **discipline** (new values, structural sharing), not a clone API. Decision: copy the **layer you write**; use \`structuredClone\` when you must detach (postMessage, persist, leave Vue proxies). Constraint: \`JSON.parse(JSON.stringify)\` drops \`undefined\`, Dates, Maps, functions, and explodes on cycles.

**Failure mode:** Mutating \`props.user.role\` or a Pinia nested field so three screens “mystery sync.” Deep-cloning every keystroke. \`structuredClone(vueProxy)\` throwing.

**Measure:** A test that editing a draft does not change the list row. Profiler on clone cost. Heap after persist/hydrate.

**Tradeoffs:** Structural sharing (Immer, reducers, Vue reactive writes) is cheaper than full clones. Deep clone is honest isolation and O(n).

**Production gotchas:** Vue proxies vs raw (\`toRaw\` before clone). \`const\` is not immutable. React state must replace identity; Vue can mutate in place — do not mix the two mental models in one PR.`,
      `**Họ thực sự hỏi:** Update Pinia/Vue này có mutate object lồng đang share không, và bạn có \`structuredClone\` cả trang 50k hàng vô cớ không?

**Cách senior trả lời:** Shallow = container mới, ref lồng cũ (\`{ ...obj }\`, \`arr.slice()\`). Deep = graph mới đệ quy. Immutability là **kỷ luật** (giá trị mới, structural sharing), không phải API clone. Decision: copy **tầng bạn ghi**; \`structuredClone\` khi phải tách (postMessage, persist, rời Vue proxy). Constraint: \`JSON.parse(JSON.stringify)\` mất \`undefined\`, Date, Map, function, và nổ với cycle.

**Failure mode:** Mutate \`props.user.role\` hoặc field lồng Pinia khiến ba màn “tự đồng bộ.” Deep-clone mỗi phím. \`structuredClone(vueProxy)\` throw.

**Measure:** Test sửa draft không đổi hàng list. Profiler chi phí clone. Heap sau persist/hydrate.

**Tradeoffs:** Structural sharing (Immer, reducer, ghi reactive Vue) rẻ hơn clone full. Deep clone cô lập thật và O(n).

**Production gotchas:** Vue proxy vs raw (\`toRaw\` trước khi clone). \`const\` không phải immutable. State React phải đổi identity; Vue có thể mutate tại chỗ — đừng trộn hai mental model trong một PR.`,
    ),
    followUps: [
      l('When is structuredClone the wrong tool next to a Vue proxy?', 'Khi nào structuredClone là tool sai cạnh Vue proxy?'),
      l('How do you update one nested field without cloning the whole tree?', 'Bạn update một field lồng mà không clone cả cây thế nào?'),
    ],
  }),
  q({
    id: 'js-async-await-under-hood',
    category: 'technical',
    tags: ['javascript', 'async', 'promises'],
    question: l('How do async/await work under the hood?', 'async/await hoạt động như thế nào bên dưới?'),
    answer: l(
      `**What they actually ask:** Which combinator, which abort signal, and did you waterfall three independent \`await\`s?

**How a senior answers:** \`async/await\` is control-flow over promises. Decision: independent calls → \`Promise.all\` (fail-fast if the page cannot render without all). Partials → \`allSettled\` or split critical vs optional. Waterfall only on true data dependence. Constraint: \`await\` yields to the **microtask** queue — it does not block the event loop, but a chain of already-resolved awaits can starve paint.

**Failure mode:** Empty \`catch { console.error }\` returning \`undefined\` (empty UI). Naive retry that duplicates POST. \`await\` in \`for\` when \`Promise.all\` was the intent.

**Measure:** Network initiator chain (waterfall). TTFB vs compute. A test that rejects one branch and asserts the user-visible error.

**Tradeoffs:** Sequential \`await\` is readable and slow. \`all\` is fast and blanks the screen on one 500.

**Production gotchas:** Nuxt \`$fetch\` throws; \`fetch\` does not. Cancel with \`AbortSignal\` in \`watch\` \`onCleanup\` / \`onUnmounted\`. Don’t toast \`AbortError\` on every keystroke.`,
      `**Họ thực sự hỏi:** Combinator nào, abort signal nào, và bạn có waterfall ba \`await\` độc lập không?

**Cách senior trả lời:** \`async/await\` là control-flow trên promise. Decision: gọi độc lập → \`Promise.all\` (fail-fast nếu page không render thiếu một phần). Partial → \`allSettled\` hoặc tách critical vs optional. Waterfall chỉ khi data thật sự phụ thuộc. Constraint: \`await\` nhường **microtask** — không block event loop, nhưng chuỗi await đã resolve có thể đói paint.

**Failure mode:** \`catch { console.error }\` trả \`undefined\` (UI rỗng). Retry ngây thơ nhân đôi POST. \`await\` trong \`for\` khi đáng lẽ \`Promise.all\`.

**Measure:** Initiator chain trên Network (waterfall). TTFB vs compute. Test reject một nhánh và assert lỗi user thấy.

**Tradeoffs:** \`await\` tuần tự dễ đọc và chậm. \`all\` nhanh và trắng màn khi một nhánh 500.

**Production gotchas:** Nuxt \`$fetch\` throw; \`fetch\` thì không. Cancel bằng \`AbortSignal\` trong \`watch\` \`onCleanup\` / \`onUnmounted\`. Đừng toast \`AbortError\` mỗi lần gõ.`,
    ),
    followUps: [
      l('How do you share one AbortSignal across fetch, watch, and a Vue listener?', 'Bạn share một AbortSignal cho fetch, watch và listener Vue thế nào?'),
      l('When is awaiting in a loop correct rather than a bug?', 'Khi nào await trong loop là đúng chứ không phải bug?'),
    ],
  }),
  q({
    id: 'js-promise-combinators',
    category: 'technical',
    tags: ['javascript', 'promises'],
    question: l('When would you use Promise.all, allSettled, race, and any?', 'Khi nào dùng Promise.all, allSettled, race và any?'),
    answer: l(
      `- **Promise.all** when all results are required and one failure should fail the whole operation.
- **Promise.allSettled** when you need the outcome of every promise regardless of failures.
- **Promise.race** when the first settled promise should decide the result, often for timeout wrappers.
- **Promise.any** when you want the first successful result and can tolerate individual failures.

The right combinator expresses intent. Senior code chooses the combinator that matches the failure semantics of the feature.`,
      `- **Promise.all** khi cần đủ tất cả kết quả và chỉ một failure cũng nên fail cả operation.
- **Promise.allSettled** khi cần biết outcome của mọi promise bất kể có lỗi hay không.
- **Promise.race** khi promise settle đầu tiên phải quyết định kết quả, thường dùng cho timeout wrapper.
- **Promise.any** khi chỉ cần kết quả thành công đầu tiên và chấp nhận vài promise fail.

Combinator đúng sẽ diễn đạt đúng ý đồ. Code mức senior chọn combinator khớp với failure semantics của feature.`,
    ),
  }),
  q({
    id: 'js-memory-leaks-gc',
    category: 'technical',
    tags: ['javascript', 'memory', 'performance'],
    question: l('What causes memory leaks in frontend apps?', 'Điều gì gây memory leak trong frontend app?'),
    answer: l(
      `Garbage collection frees memory that is no longer reachable. A leak happens when something stays reachable unintentionally.

Common FE causes:

- event listeners not removed,
- timers or intervals left running,
- subscriptions not cleaned up,
- caches that grow without eviction,
- closures retaining large objects longer than needed,
- detached DOM references.

A senior answer should mention both **code cleanup** and **design-level lifetime management**.`,
      `Garbage collector sẽ giải phóng memory không còn reachable. Leak xảy ra khi thứ gì đó vẫn reachable ngoài ý muốn.

Các nguyên nhân FE hay gặp:

- event listener không được gỡ,
- timer hoặc interval chạy mãi,
- subscription không cleanup,
- cache lớn dần mà không có eviction,
- closure giữ object lớn quá lâu,
- detached DOM reference.

Câu trả lời mức senior nên chạm tới cả **cleanup trong code** lẫn **quản lý vòng đời ở mức thiết kế**.`,
    ),
  }),
  q({
    id: 'ts-generics',
    category: 'technical',
    tags: ['typescript', 'generics'],
    question: l('What are generics and why are they useful?', 'Generics là gì và vì sao hữu ích?'),
    answer: l(
      `**Short answer:** Generics let you write reusable code while preserving **relationships between types**, not just accepting “anything”.

**Why:**

They are valuable for:

- API helpers,
- reusable components,
- transformation utilities,
- hooks/composables that should infer caller types.

Instead of “this takes anything”, generics let you say “this works for many types, and the input/output stay related”.

**Trade-offs:**

- over-generic APIs become unreadable,
- sometimes a named domain type is clearer than a clever generic,
- good inference matters more than type gymnastics.

The goal is expressive and maintainable typing, not showing off.`,
      `**Trả lời ngắn:** Generics cho phép viết code dùng lại nhưng vẫn giữ được **quan hệ giữa các type**, chứ không chỉ là chấp nhận “bất cứ thứ gì”.

**Vì sao:**

Nó rất hữu ích cho:

- API helper,
- component tái sử dụng,
- utility transform data,
- hook/composable cần infer type từ caller.

Thay vì “hàm này nhận gì cũng được”, generic giúp nói rằng “hàm này làm việc với nhiều type, và input/output vẫn giữ quan hệ với nhau”.

**Trade-off:**

- API quá generic sẽ khó đọc,
- đôi khi một domain type có tên rõ ràng còn tốt hơn generic quá thông minh,
- inference tốt quan trọng hơn type gymnastics.

Mục tiêu là typing diễn đạt được ý và maintainable, không phải để khoe kỹ xảo.`,
    ),
    example: l(
      `\`\`\`ts
function first<T>(items: T[]): T | undefined {
  return items[0]
}

const n = first([1, 2, 3])       // number | undefined
const s = first(['a', 'b'])      // string | undefined
\`\`\``,
      `\`\`\`ts
function first<T>(items: T[]): T | undefined {
  return items[0]
}
\nconst n = first([1, 2, 3])        // number | undefined
const s = first(['a', 'b'])       // string | undefined
\`\`\``,
    ),
    followUps: [
      l('When is a generic overkill?', 'Khi nào generic là overkill?'),
      l('How do you balance inference vs explicit type parameters?', 'Bạn cân bằng inference với explicit type parameter như thế nào?'),
    ],
  }),
  q({
    id: 'ts-utility-types',
    category: 'technical',
    tags: ['typescript', 'utility-types'],
    question: l('Which TypeScript utility types do you use most and why?', 'Bạn hay dùng utility type nào của TypeScript và vì sao?'),
    answer: l(
      `The most practical ones are often:

- \`Partial<T>\` for patch-like updates,
- \`Pick<T, K>\` / \`Omit<T, K>\` for shaping public data,
- \`Record<K, V>\` for typed maps,
- \`Readonly<T>\` to protect invariants,
- \`ReturnType<T>\` and \`Parameters<T>\` when reusing function contracts.

Use them to model intent more clearly, not to avoid naming meaningful domain types when those would be clearer.`,
      `Các utility type thực tế nhất thường là:

- \`Partial<T>\` cho update kiểu patch,
- \`Pick<T, K>\` / \`Omit<T, K>\` để tạo shape dữ liệu public,
- \`Record<K, V>\` cho map có type,
- \`Readonly<T>\` để bảo vệ invariant,
- \`ReturnType<T>\` và \`Parameters<T>\` khi muốn tái sử dụng contract của function.

Hãy dùng chúng để mô hình hóa intent rõ hơn, chứ không phải để né việc đặt tên cho domain type có ý nghĩa khi điều đó sẽ dễ hiểu hơn.`,
    ),
  }),
  q({
    id: 'ts-conditional-mapped-types',
    category: 'technical',
    tags: ['typescript', 'advanced-types'],
    question: l('What are conditional types and mapped types useful for?', 'Conditional type và mapped type hữu ích trong trường hợp nào?'),
    answer: l(
      `Mapped types transform the shape of existing types. Conditional types choose one type or another based on a rule.

They are useful for:

- deriving variant forms of domain data,
- building library helpers,
- expressing relationships between config and result types,
- removing repetitive type duplication.

But be careful: advanced types can become unreadable quickly. Senior TypeScript design optimizes for maintainability of the type layer, not type cleverness alone.`,
      `Mapped type dùng để biến đổi shape của type đang có. Conditional type dùng để chọn type này hay type kia dựa trên một rule.

Nó hữu ích khi:

- tạo ra các biến thể của domain data,
- viết helper cho library,
- diễn đạt quan hệ giữa config và result type,
- giảm lặp lại ở tầng type.

Nhưng phải cẩn thận: advanced type rất dễ trở nên khó đọc. Thiết kế TypeScript kiểu senior là tối ưu cho maintainability của tầng type, không chỉ để khoe type cleverness.`,
    ),
  }),
  q({
    id: 'ts-narrowing-typeguards',
    category: 'technical',
    tags: ['typescript', 'narrowing'],
    question: l('How do narrowing and custom type guards work?', 'Narrowing và custom type guard hoạt động thế nào?'),
    answer: l(
      `TypeScript narrows a union when control flow proves something about the value: \`typeof\`, \`in\`, equality checks, discriminants, or custom predicates.

Custom type guards return a predicate like \`value is User\`. They are useful at boundaries:

- parsing API data,
- handling unknown errors,
- filtering union collections.

The important part is honesty. A bad type guard lies to the compiler and makes the program less safe than \`unknown\`.`,
      `TypeScript sẽ narrow một union khi control flow chứng minh được điều gì đó về giá trị: \`typeof\`, \`in\`, equality check, discriminant hoặc custom predicate.

Custom type guard trả về dạng \`value is User\`. Nó hữu ích ở boundary:

- parse API data,
- xử lý unknown error,
- filter collection có union type.

Điểm quan trọng là sự trung thực. Type guard viết sai sẽ nói dối compiler và làm chương trình kém an toàn hơn cả \`unknown\`.`,
    ),
  }),
  q({
    id: 'ts-any-unknown-never',
    category: 'technical',
    tags: ['typescript', 'types'],
    question: l('What is the difference between any, unknown, and never?', 'Khác nhau giữa any, unknown và never là gì?'),
    answer: l(
      `**What they actually ask:** What do you type at the **fetch/JSON boundary**, and will an exhaustive switch fail CI when a union grows?

**How a senior answers:** \`any\` turns the checker off — it is a defect unless you are migrating. \`unknown\` is “not proven yet”; you must narrow (Zod, \`typeof\`, predicates). \`never\` is “this cannot happen” — leftover of an exhaustive switch, or a function that always throws. Decision: \`unknown\` + runtime parse at the edge; domain types inside.

**Failure mode:** \`JSON.parse\` as \`User\`. \`catch (e: any)\`. A type guard that always returns true. \`as never\` to silence a switch.

**Measure:** \`no-explicit-any\` with a shrinking allowlist. A test that an extra union member makes \`const _x: never = x\` fail. Contract tests on illegal payloads.

**Tradeoffs:** \`unknown\` is noisier and honest. \`any\` is faster in a spike and infects callers. \`never\` in return position documents “does not return”; overusing it hides real unions.

**Production gotchas:** Vue \`defineProps\` without types becomes loose. Axios \`data: any\`. \`unknown\` in Pinia persist still needs a parse on rehydrate — TS will not run at runtime.`,
      `**Họ thực sự hỏi:** Bạn type **biên fetch/JSON** thế nào, và switch exhaustive có fail CI khi union lớn thêm không?

**Cách senior trả lời:** \`any\` tắt checker — là defect trừ khi đang migrate. \`unknown\` là “chưa chứng minh”; phải narrow (Zod, \`typeof\`, predicate). \`never\` là “không thể xảy ra” — phần còn lại của switch exhaustive, hoặc hàm luôn throw. Decision: \`unknown\` + parse runtime ở biên; domain type bên trong.

**Failure mode:** \`JSON.parse\` thành \`User\`. \`catch (e: any)\`. Type guard luôn return true. \`as never\` để bịt switch.

**Measure:** \`no-explicit-any\` với allowlist nhỏ dần. Test thêm member union làm \`const _x: never = x\` fail. Contract test payload bất hợp pháp.

**Tradeoffs:** \`unknown\` ồn hơn và thật. \`any\` nhanh lúc spike và lây caller. \`never\` ở return nói “không return”; lạm dụng sẽ giấu union thật.

**Production gotchas:** Vue \`defineProps\` không type sẽ lỏng. Axios \`data: any\`. \`unknown\` trong Pinia persist vẫn cần parse lúc rehydrate — TS không chạy runtime.`,
    ),
    followUps: [
      l('How do you parse unknown API JSON without asserting User?', 'Bạn parse JSON unknown thành User mà không assert thế nào?'),
      l('When is never the wrong type for an empty array or a default branch?', 'Khi nào never là type sai cho mảng rỗng hoặc nhánh default?'),
    ],
  }),
  q({
    id: 'ts-designing-api-props',
    category: 'technical',
    tags: ['typescript', 'design'],
    question: l('How do you design good TypeScript types for APIs or component props?', 'Bạn thiết kế type TypeScript tốt cho API hoặc component props thế nào?'),
    answer: l(
      `**Short answer:** Good TypeScript design optimizes for **correctness at boundaries**, **readability at the callsite**, and **flexibility without ambiguity**.

**Why:**

Practical rules I use:

- model domain concepts, not just raw JSON,
- use discriminated unions for mutually exclusive states,
- avoid giant “do everything” prop types,
- encode invariants where the compiler can help,
- validate untrusted data at runtime because TS is compile-time only.

**Trade-offs:**

- overly clever type systems can make components harder to use,
- sometimes duplication is cheaper than abstracting too early,
- runtime validation is still needed for real external data.

Good types should guide correct usage instead of requiring a decoder ring.`,
      `**Trả lời ngắn:** Thiết kế TypeScript tốt tối ưu cho **correctness ở boundary**, **readability ở callsite** và **flexibility nhưng không mơ hồ**.

**Vì sao:**

Các rule thực tế em hay dùng:

- model domain concept chứ không chỉ model raw JSON,
- dùng discriminated union cho state loại trừ nhau,
- tránh prop type khổng lồ “làm mọi thứ”,
- encode invariant ở nơi compiler giúp được,
- validate dữ liệu bên ngoài ở runtime vì TS chỉ hoạt động lúc compile.

**Trade-off:**

- type system quá khôn có thể làm component khó dùng hơn,
- đôi khi duplication rẻ hơn abstract quá sớm,
- dữ liệu ngoài đời vẫn cần runtime validation.

Type tốt nên hướng người dùng tới cách dùng đúng thay vì bắt họ giải mật mã.`,
    ),
    example: l(
      `\`\`\`ts
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string }
\`\`\`

This is clearer than many booleans like \`isLoading\`, \`hasError\`, and nullable \`data\` drifting out of sync.`,
      `\`\`\`ts
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string }
\`\`\`

Kiểu này rõ hơn nhiều so với nhiều boolean như \`isLoading\`, \`hasError\` và \`data\` nullable dễ bị lệch nhau.`,
    ),
    followUps: [
      l('How do you validate API responses at runtime?', 'Bạn validate API response ở runtime như thế nào?'),
      l('When would you choose a union over optional props?', 'Khi nào bạn chọn union thay vì prop optional?'),
    ],
  }),
  q({
    id: 'vue-reactivity-internals',
    category: 'technical',
    tags: ['vue', 'reactivity'],
    question: l('How does Vue 3 reactivity work internally?', 'Vue 3 reactivity hoạt động bên dưới như thế nào?'),
    answer: l(
      `**Short answer:** Vue 3 reactivity is built around **Proxy-based tracking**: reads are tracked, writes trigger dependent effects.

**Why:**

- when a reactive property is read inside an effect/computed, Vue **tracks** that dependency,
- when the property changes, Vue **triggers** only the effects that depend on it,
- that gives Vue more fine-grained updates than React's default “rerun the whole component function” model.

**Trade-offs / common mistakes:**

- destructuring reactive objects carelessly can break reactivity,
- deep reactive graphs can still create hidden complexity,
- “fine-grained” does not mean “free”; bad state design still hurts.

The interview goal is not to recite all internals. It is to explain why property access matters and how that affects app design.`,
      `**Trả lời ngắn:** Vue 3 reactivity dựa trên **Proxy + dependency tracking**: lần đọc được track, lần ghi sẽ trigger effect phụ thuộc.

**Vì sao:**

- khi một reactive property được đọc trong effect/computed, Vue sẽ **track** dependency đó,
- khi property đổi, Vue **trigger** đúng các effect liên quan,
- nhờ vậy Vue có update mịn hơn model mặc định của React là chạy lại function component.

**Trade-off / lỗi hay gặp:**

- destructure reactive object bất cẩn có thể làm mất reactivity,
- graph reactive sâu vẫn có thể tạo hidden complexity,
- “fine-grained” không có nghĩa là “không tốn gì”; state design tệ vẫn đau như thường.

Mục tiêu trong phỏng vấn không phải đọc thuộc toàn bộ internals, mà là giải thích vì sao property access quan trọng và nó ảnh hưởng gì tới cách thiết kế app.`,
    ),
    followUps: [
      l('Why can destructuring break reactivity?', 'Vì sao destructuring có thể làm mất reactivity?'),
      l('How is this different from React’s rendering model?', 'Điều này khác gì so với rendering model của React?'),
    ],
  }),
  q({
    id: 'vue-ref-vs-reactive',
    category: 'technical',
    tags: ['vue', 'reactivity'],
    question: l('When do you use ref vs reactive?', 'Khi nào dùng ref và khi nào dùng reactive?'),
    answer: l(
      `**Short answer:** Use **ref** by default for single values and explicit ownership; use **reactive** when several fields truly belong together as one object.

**Why:**

- \`ref\` is simple, explicit, and easy to type,
- \`reactive\` is ergonomic for grouped state,
- \`toRefs\` / \`storeToRefs\` help when you need to expose fields separately.

**Trade-offs:**

- \`reactive\` is convenient but easier to misuse with destructuring,
- mixing both styles randomly across a codebase hurts consistency,
- some teams prefer \`ref\` more often because composables stay clearer.

The important part is not the rule itself; it is keeping state ownership obvious.`,
      `**Trả lời ngắn:** Mặc định dùng **ref** cho giá trị đơn lẻ và ownership rõ ràng; dùng **reactive** khi nhiều field thực sự thuộc về cùng một object state.

**Vì sao:**

- \`ref\` đơn giản, explicit và dễ type,
- \`reactive\` tiện cho grouped state,
- \`toRefs\` / \`storeToRefs\` hữu ích khi cần expose từng field riêng.

**Trade-off:**

- \`reactive\` tiện nhưng dễ bị dùng sai khi destructure,
- trộn hai style lung tung trong codebase sẽ làm giảm consistency,
- nhiều team dùng \`ref\` thường xuyên hơn vì composable rõ ràng hơn.

Điều quan trọng không phải là học thuộc rule, mà là giữ cho ownership của state luôn dễ nhìn.`,
    ),
    followUps: [
      l('Why do many teams default to ref more often?', 'Vì sao nhiều team lại default về ref nhiều hơn?'),
      l('When would a reactive object be cleaner than many refs?', 'Khi nào một reactive object sạch hơn nhiều ref rời nhau?'),
    ],
  }),
  q({
    id: 'vue-computed-watch-watcheffect',
    category: 'technical',
    tags: ['vue', 'composition-api'],
    question: l('When should you use computed, watch, and watchEffect?', 'Khi nào dùng computed, watch và watchEffect?'),
    answer: l(
      `**Short answer:** Use **computed** for derived values, **watch** for explicit source-driven side effects, and **watchEffect** when automatic dependency collection is the simplest fit.

**Why:**

- \`computed\` is cached and declarative,
- \`watch\` is precise when you care about a particular source or transition,
- \`watchEffect\` is convenient when dependencies are naturally discovered from synchronous reads.

**Trade-offs:**

- plain methods are fine for uncached computations during render, but they rerun every render,
- using \`watch\` for things that should be \`computed\` makes state flow harder to reason about,
- \`watchEffect\` is convenient but less explicit,
- too many watchers can create orchestration spaghetti.

Good rule: derive with \`computed\`; synchronize side effects with \`watch\` or \`watchEffect\`.`,
      `**Trả lời ngắn:** Dùng **computed** cho giá trị suy ra, **watch** cho side effect gắn với source rõ ràng, và **watchEffect** khi auto-collect dependency là cách gọn nhất.

**Vì sao:**

- \`computed\` có cache và mang tính declarative,
- \`watch\` chính xác khi bạn quan tâm tới một source hoặc một transition cụ thể,
- \`watchEffect\` tiện khi dependency tự lộ ra qua các lần đọc đồng bộ.

**Trade-off:**

- method thường cho tính toán không cần cache trong lúc render, nhưng nó sẽ chạy lại ở mỗi render,
- dùng \`watch\` cho thứ đáng lẽ là \`computed\` sẽ làm state flow khó reasoning hơn,
- \`watchEffect\` tiện nhưng ít explicit hơn,
- watcher quá nhiều dễ biến thành orchestration spaghetti.

Rule thực tế: derive bằng \`computed\`; đồng bộ side effect bằng \`watch\` hoặc \`watchEffect\`.`,
    ),
    example: l(
      `\`\`\`ts
const fullName = computed(() => \`\${first.value} \${last.value}\`)

watch(query, () => {
  // fetch or sync external system
})
\`\`\``,
      `\`\`\`ts
const fullName = computed(() => \`\${first.value} \${last.value}\`)

watch(query, () => {
  // fetch hoặc đồng bộ hệ thống ngoài
})
\`\`\``,
    ),
    followUps: [
      l('When is watchEffect too implicit?', 'Khi nào watchEffect trở nên quá implicit?'),
      l('What bugs happen when people use watch for derived state?', 'Những bug nào hay xảy ra khi dùng watch cho derived state?'),
    ],
  }),
  q({
    id: 'vue-composition-api-benefits',
    category: 'technical',
    tags: ['vue', 'composition-api'],
    question: l('Why is the Composition API useful?', 'Composition API hữu ích ở điểm nào?'),
    answer: l(
      `**What they actually ask:** Not “Options is dead.” They want **extraction, TS, and SSR-safe reuse** — and whether you still know when Options is fine.

**How a senior answers:** Organize by **concern** (search, permissions, chart) instead of \`data\`/\`methods\`/\`computed\` buckets. Decision: Composition + composables when the file is an orchestration layer; Options is still OK for small presentational SFCs. Constraint: composables must be called **sync and unconditionally** in \`setup\` so the effect scope is correct.

**Failure mode:** Mixins + composables in one component (\`this.foo\` collisions, doubled lifecycle). Rewrite everything to \`<script setup>\` without tests and silently change \`beforeDestroy\` vs \`onBeforeUnmount\` + keep-alive. \`if (flag) useFoo()\`.

**Measure:** Time to extract a concern into a tested composable. TS inference at the callsite. Duplicate watchers after a keep-alive tab switch.

**Tradeoffs:** Composition is more explicit and easier to type; Options is faster to scan for juniors on tiny forms. A 20-line Options SFC does not need a rewrite.

**Production gotchas:** Auto-import name clashes. Circular composable ↔ Pinia only explodes in the production chunk. \`this\` in Options methods vs arrows (module \`this\` is \`undefined\` in ESM).`,
      `**Họ thực sự hỏi:** Không phải “Options đã chết.” Họ muốn **tách logic, TS, reuse an toàn SSR** — và bạn còn biết khi nào Options đủ.

**Cách senior trả lời:** Tổ chức theo **concern** (search, permission, chart) thay vì thùng \`data\`/\`methods\`/\`computed\`. Decision: Composition + composable khi file là orchestration; Options vẫn ổn cho SFC presentational nhỏ. Constraint: composable phải gọi **sync và không điều kiện** trong \`setup\` để effect scope đúng.

**Failure mode:** Mixin + composable cùng component (\`this.foo\` đụng, lifecycle nhân đôi). Rewrite hết sang \`<script setup>\` không test, đổi thầm \`beforeDestroy\` vs \`onBeforeUnmount\` + keep-alive. \`if (flag) useFoo()\`.

**Measure:** Thời gian tách một concern thành composable có test. Inference TS ở callsite. Watcher nhân đôi sau khi đổi tab keep-alive.

**Tradeoffs:** Composition explicit và dễ type hơn; Options dễ scan với junior trên form nhỏ. SFC Options 20 dòng không cần rewrite.

**Production gotchas:** Auto-import trùng tên. Composable ↔ Pinia circular chỉ nổ ở production chunk. \`this\` trong Options method vs arrow (\`this\` module là \`undefined\` trong ESM).`,
    ),
    followUps: [
      l('What would make you keep Options API for a new component?', 'Điều gì khiến bạn giữ Options API cho component mới?'),
      l('How do you test a composable that uses lifecycle without mounting the app?', 'Bạn test composable dùng lifecycle mà không mount cả app thế nào?'),
    ],
  }),
  q({
    id: 'vue-composables',
    category: 'technical',
    tags: ['vue', 'composables', 'architecture'],
    question: l('What makes a good composable in Vue?', 'Composable tốt trong Vue cần những gì?'),
    answer: l(
      `**Short answer:** A good composable has **one clear responsibility**, a predictable API, and very few hidden side effects.

**Why:**

I usually want:

- one main concern,
- explicit inputs and outputs,
- cleanup for listeners, timers, or async work,
- testability without mounting a whole app when possible.

**Trade-offs:**

- over-abstracting too early creates vague “utility composables”,
- composables that fetch, mutate, navigate, and toast all at once become mini-frameworks,
- convenience today can become hidden coupling tomorrow.

Good composables make logic reusable **and** easier to reason about.`,
      `**Trả lời ngắn:** Composable tốt phải có **một responsibility rõ ràng**, API dễ đoán và rất ít hidden side effect.

**Vì sao:**

Em thường muốn có:

- một concern chính,
- input và output rõ ràng,
- cleanup cho listener, timer hoặc async work,
- khả năng test mà không cần mount cả app nếu có thể.

**Trade-off:**

- abstract quá sớm sẽ tạo ra những “utility composable” mơ hồ,
- composable vừa fetch, vừa mutate, vừa navigate, vừa toast sẽ thành mini-framework,
- tiện hôm nay có thể thành hidden coupling ngày mai.

Composable tốt phải làm logic vừa reusable **vừa** dễ reasoning hơn.`,
    ),
    followUps: [
      l('What would make you split a composable into two?', 'Dấu hiệu nào khiến bạn tách một composable thành hai?'),
      l('How do you test composables that use lifecycle or async work?', 'Bạn test composable có lifecycle hoặc async work như thế nào?'),
    ],
  }),
  q({
    id: 'pinia-design',
    category: 'technical',
    tags: ['vue', 'pinia', 'state-management'],
    question: l('How would you decide what belongs in Pinia?', 'Bạn quyết định cái gì nên nằm trong Pinia như thế nào?'),
    answer: l(
      `**Short answer:** Put state in Pinia only when it is truly **shared, long-lived, and client-owned**. Do not use it as the default home for everything.

**Why:**

I usually ask:

- is this shared across distant parts of the app?
- does it outlive one page/component?
- should URL be the source of truth instead?
- is this really server state and better handled by a fetch/cache layer?

Good Pinia candidates:

- auth/session UI state,
- feature flags,
- cross-step workflow state,
- shared client preferences.

**Trade-offs:**

- too much store state makes data flow harder to trace,
- putting server data in Pinia can duplicate caching concerns,
- local state moved global too early hurts maintainability.`,
      `**Trả lời ngắn:** Chỉ đưa state vào Pinia khi nó thực sự **được chia sẻ, sống lâu và do client sở hữu**. Đừng coi Pinia là chỗ mặc định cho mọi thứ.

**Vì sao:**

Em thường hỏi:

- state này có được chia sẻ ở nhiều chỗ xa nhau không?
- nó có sống lâu hơn một page/component không?
- URL có nên là source of truth tốt hơn không?
- hay đây thực ra là server state và nên để fetch/cache layer quản lý?

Những thứ hợp với Pinia:

- auth/session UI state,
- feature flag,
- workflow state qua nhiều bước,
- shared client preference.

**Trade-off:**

- quá nhiều state trong store sẽ làm data flow khó trace,
- nhét server data vào Pinia dễ bị trùng concern với caching,
- state local bị đẩy global quá sớm sẽ hại maintainability.`,
    ),
    followUps: [
      l('What belongs in URL state instead of Pinia?', 'Những gì nên nằm ở URL state thay vì Pinia?'),
      l('How do you avoid turning Pinia into a dumping ground?', 'Bạn tránh biến Pinia thành dumping ground bằng cách nào?'),
    ],
  }),
  q({
    id: 'vue-ssr-hydration',
    category: 'technical',
    tags: ['vue', 'nuxt', 'ssr', 'hydration'],
    question: l('What are SSR and hydration, and what commonly goes wrong?', 'SSR và hydration là gì, lỗi hay gặp là gì?'),
    answer: l(
      `**Short answer:** SSR renders the initial HTML on the server; hydration is the client attaching interactivity to that HTML and expecting the first client render to match it.

**Why:**

This is valuable for:

- faster first content,
- better SEO where needed,
- easier sharing of route-level data work.

Common mismatch sources:

- non-deterministic values like \`Date.now()\` or random IDs,
- browser-only APIs during SSR,
- client-only branches changing the rendered tree,
- data arriving differently between server and client.

**Trade-offs:**

- SSR adds complexity around environment boundaries,
- hydration bugs are often subtle,
- not every internal tool needs SSR.

Safe mental model: the first client render must logically match the server output.`,
      `**Trả lời ngắn:** SSR là render HTML ban đầu ở server; hydration là lúc client gắn interactivity vào HTML đó và đòi hỏi lần render đầu ở client phải khớp logic với HTML từ server.

**Vì sao:**

Điều này hữu ích cho:

- first content nhanh hơn,
- SEO tốt hơn ở nơi cần,
- phối hợp data ở mức route dễ hơn.

Nguồn mismatch hay gặp:

- giá trị không deterministic như \`Date.now()\` hoặc random ID,
- dùng browser-only API khi đang SSR,
- branch chỉ chạy ở client làm đổi cây render,
- dữ liệu tới khác nhau giữa server và client.

**Trade-off:**

- SSR tăng độ phức tạp ở boundary môi trường,
- bug hydration thường khá khó nhìn,
- không phải internal tool nào cũng cần SSR.

Mental model an toàn là: lần render đầu ở client phải khớp logic với output từ server.`,
    ),
    followUps: [
      l('What is the first thing you check when you see a hydration mismatch warning?', 'Điều đầu tiên bạn kiểm tra khi thấy hydration mismatch warning là gì?'),
      l('When would you choose CSR over SSR in Nuxt?', 'Khi nào bạn chọn CSR thay vì SSR trong Nuxt?'),
    ],
  }),
  q({
    id: 'nuxt-rendering-modes',
    category: 'technical',
    tags: ['nuxt', 'ssr', 'rendering'],
    question: l('What rendering modes does Nuxt 3 support and how would you choose?', 'Nuxt 3 hỗ trợ các rendering mode nào và bạn chọn ra sao?'),
    answer: l(
      `**Short answer:** Nuxt 3 supports SSR, SSG/prerender, CSR-heavy routes, and hybrid strategies. The right choice depends on **SEO, first-load UX, personalization, and cacheability**.

**Why:**

- **SSR** helps when first render and SEO matter.
- **SSG/prerender** fits mostly static marketing or docs content.
- **CSR-heavy** is often enough for internal tools.
- **Hybrid** is ideal when different routes need different behavior.

**Trade-offs:**

- SSR adds server complexity,
- SSG is simple but can become stale,
- CSR reduces server cost but can hurt first-load UX,
- hybrid adds flexibility but needs discipline.

Good answers tie rendering mode to product constraints, not framework preference.`,
      `**Trả lời ngắn:** Nuxt 3 hỗ trợ SSR, SSG/prerender, route thiên về CSR và cả chiến lược hybrid. Cách chọn đúng phụ thuộc vào **SEO, first-load UX, personalization và khả năng cache**.

**Vì sao:**

- **SSR** hợp khi first render và SEO quan trọng.
- **SSG/prerender** hợp cho marketing/docs ít đổi.
- **CSR-heavy** thường đủ cho internal tool.
- **Hybrid** rất hợp khi từng route có nhu cầu khác nhau.

**Trade-off:**

- SSR tăng server complexity,
- SSG đơn giản nhưng có thể stale,
- CSR giảm chi phí server nhưng có thể làm first-load UX kém,
- hybrid linh hoạt nhưng cần kỷ luật.

Câu trả lời tốt là gắn rendering mode với constraint của product, không phải với sở thích framework.`,
    ),
    followUps: [
      l('Can one Nuxt app use different rendering strategies per route?', 'Một app Nuxt có thể dùng rendering strategy khác nhau theo route không?'),
      l('When is SSR not worth the complexity?', 'Khi nào SSR không đáng với độ phức tạp nó mang lại?'),
    ],
  }),
  q({
    id: 'nuxt-nitro',
    category: 'technical',
    tags: ['nuxt', 'nitro', 'server'],
    question: l('What is Nitro in Nuxt 3?', 'Nitro trong Nuxt 3 là gì?'),
    answer: l(
      `**What they actually ask:** Is Nitro “just SSR,” or do you treat it as a **BFF + deploy adapter** with secrets and cache rules?

**How a senior answers:** Nitro is the server engine: \`server/api\`, SSR, storage, and **preset adapters** (Node, Vercel, Cloudflare, etc.). Decision: put **BFF aggregation, cookie auth, and secrets** here so the browser talks to one origin. Constraint: handlers must be **stateless per request** — no module-level user state.

**Failure mode:** Importing a Pinia store or \`window\` in a Nitro route. Caching a personalized \`/api/me\` at the edge. Shipping \`NUXT_PUBLIC_\` secrets that belong only on the server.

**Measure:** One origin in the browser Network panel. Cold-start / TTFB per preset. A test that request A cannot read request B’s cookie/store.

**Tradeoffs:** Colocated BFF is fast to ship and easy to leak domain logic. A separate API stays cleaner when many clients exist. Adapter portability is real until you use Node-only APIs on an edge preset.

**Production gotchas:** Route rules vs handler cache disagree. \`event.context\` vs a global. Server routes are not a replacement for authorization in the real backend.`,
      `**Họ thực sự hỏi:** Nitro chỉ là “SSR,” hay bạn coi nó là **BFF + adapter deploy** với secret và rule cache?

**Cách senior trả lời:** Nitro là server engine: \`server/api\`, SSR, storage, và **preset adapter** (Node, Vercel, Cloudflare, v.v.). Decision: để **gom BFF, cookie auth, secret** ở đây để browser nói một origin. Constraint: handler phải **stateless theo request** — không user state ở module.

**Failure mode:** Import Pinia hoặc \`window\` trong Nitro route. Cache \`/api/me\` cá nhân ở edge. Ship secret qua \`NUXT_PUBLIC_\` đáng lẽ chỉ ở server.

**Measure:** Một origin trên Network. Cold-start / TTFB theo preset. Test request A không đọc được cookie/store của request B.

**Tradeoffs:** BFF colocated ship nhanh, dễ lộ domain logic. API tách sạch hơn khi có nhiều client. Portable adapter là thật đến khi bạn dùng API chỉ có Node trên preset edge.

**Production gotchas:** Route rule vs cache của handler lệch. \`event.context\` vs global. Server route không thay authorization ở backend thật.`,
    ),
    followUps: [
      l('What must never live in a NUXT_PUBLIC_ env var?', 'Thứ gì không bao giờ được nằm trong env NUXT_PUBLIC_?'),
      l('How do you keep a Nitro handler from leaking state across requests?', 'Bạn giữ handler Nitro khỏi leak state giữa các request thế nào?'),
    ],
  }),
  q({
    id: 'nuxt-data-fetching',
    category: 'technical',
    tags: ['nuxt', 'data-fetching'],
    question: l('How do useFetch and useAsyncData fit into Nuxt 3 data fetching?', 'useFetch và useAsyncData nằm ở đâu trong data fetching của Nuxt 3?'),
    answer: l(
      `**Short answer:** \`useAsyncData\` is the general Nuxt primitive for SSR-aware async data; \`useFetch\` is the convenient HTTP-flavored version built for common API calls.

**Why:**

They matter because Nuxt coordinates:

- server rendering,
- payload transfer,
- client hydration,
- caching/deduplication.

The questions I care about are:

- is the key stable?
- will this fetch duplicate on client and server?
- should this data block the initial render?
- is this route personalized or cacheable?

**Trade-offs:**

- blocking too much data hurts TTFB,
- delaying too much data hurts perceived completeness,
- unstable keys make caching behavior confusing.

The senior point is not memorizing options. It is reasoning about **timing, cache behavior, and UX**.`,
      `**Trả lời ngắn:** \`useAsyncData\` là primitive tổng quát của Nuxt cho async data có awareness về SSR; \`useFetch\` là phiên bản tiện lợi hơn cho các API call HTTP phổ biến.

**Vì sao:**

Chúng quan trọng vì Nuxt đang phối hợp:

- server rendering,
- payload transfer,
- client hydration,
- caching/deduplication.

Những câu hỏi em quan tâm là:

- key có ổn định không?
- fetch này có bị lặp ở server và client không?
- dữ liệu này có nên chặn initial render không?
- route này có personalized hay cache được không?

**Trade-off:**

- chặn quá nhiều data sẽ làm TTFB xấu đi,
- trì hoãn quá nhiều data sẽ làm trang thiếu completeness,
- key không ổn định sẽ làm caching khó hiểu.

Điểm senior không phải là nhớ option, mà là reasoning về **timing, cache behavior và UX**.`,
    ),
    followUps: [
      l('When would you fetch on interaction instead of during initial render?', 'Khi nào bạn fetch theo interaction thay vì ngay lúc initial render?'),
      l('How do you avoid duplicate fetching between server and client?', 'Bạn tránh duplicate fetch giữa server và client như thế nào?'),
    ],
  }),
  q({
    id: 'nuxt-route-rules-caching',
    category: 'technical',
    tags: ['nuxt', 'caching', 'performance'],
    question: l('How would you think about Nuxt route rules and caching?', 'Bạn nghĩ về Nuxt route rules và caching như thế nào?'),
    answer: l(
      `Think in terms of product behavior per route:

- should it be prerendered?
- should it be cached at the edge?
- is it personalized?
- how stale can it be?

Route rules are powerful because they let rendering and caching vary by surface, instead of treating the entire app the same. The risk is over-caching dynamic or user-specific content, so always connect caching policy to data ownership and invalidation.`,
      `Hãy nghĩ theo behavior của từng route trong product:

- route này có nên prerender không?
- có nên cache ở edge không?
- nó có cá nhân hóa không?
- dữ liệu được phép stale bao lâu?

Route rule mạnh vì nó cho phép rendering và caching thay đổi theo từng surface, thay vì đối xử cả app như nhau. Risk lớn nhất là cache quá đà với nội dung động hoặc riêng theo user, nên policy cache luôn phải gắn với ownership dữ liệu và invalidation.`,
    ),
  }),
  q({
    id: 'vue-performance-patterns',
    category: 'technical',
    tags: ['vue', 'performance'],
    question: l('What are your go-to Vue performance patterns?', 'Các pattern tối ưu performance trong Vue bạn hay dùng là gì?'),
    answer: l(
      `I start with measurement, then usually look at:

- reducing unnecessary reactive work,
- avoiding expensive watchers,
- keeping props stable,
- splitting large lists and virtualizing when needed,
- lazy loading coarse feature boundaries,
- memoizing expensive derived data with computed,
- minimizing over-shared global state.

Vue is fast by default for many cases, so the most important performance skill is knowing when the problem is actually architecture or data shape rather than “Vue being slow.”`,
      `Em bắt đầu từ đo đạc, sau đó thường nhìn vào:

- giảm reactive work không cần thiết,
- tránh watcher tốn kém,
- giữ props ổn định,
- tách list lớn và virtualize khi cần,
- lazy load ở biên route/feature,
- dùng computed cho derived data tốn kém,
- giảm global state dùng quá rộng.

Vue mặc định đã khá nhanh ở nhiều case, nên kỹ năng performance quan trọng nhất là biết lúc nào vấn đề nằm ở architecture hoặc data shape chứ không phải “Vue chậm”.`,
    ),
  }),
  q({
    id: 'react-rerender-model-vs-vue',
    category: 'technical',
    tags: ['react', 'vue', 'comparison'],
    question: l(
      'How does React’s re-render model differ from Vue’s reactivity model?',
      'React re-render model khác gì so với reactivity model của Vue?',
    ),
    answer: l(
      `**Short answer:** Vue tracks **fine-grained reactive dependencies**; React usually **re-runs the whole component function** when props or state change, then reconciles the result.

**Why that matters:**

- in Vue, you think more about reactive reads and dependency tracking,
- in React, you think more about component boundaries, render frequency, and stable identities.

That changes how you optimize:

- Vue often feels more automatic at the property level,
- React makes reruns normal and pushes you to reason about state locality and memoization only when needed.

**Trade-offs:**

- Vue magic can hide dependency complexity,
- React re-execution can surprise Vue developers at first,
- neither model removes the need for good state design.

For a Vue engineer learning React, this mental shift is more important than memorizing APIs.`,
      `**Trả lời ngắn:** Vue track **dependency reactive rất mịn**; còn React thường **chạy lại toàn bộ function component** khi props hoặc state đổi, rồi reconcile cây kết quả.

**Vì sao chuyện này quan trọng:**

- ở Vue, bạn nghĩ nhiều hơn về reactive read và dependency tracking,
- ở React, bạn nghĩ nhiều hơn về boundary của component, tần suất render và sự ổn định của identity.

Vì vậy cách tối ưu cũng khác:

- Vue thường cho cảm giác tự động hơn ở mức property,
- React xem việc rerun là bình thường và buộc mình reasoning về state locality, memoization khi thật sự cần.

**Trade-off:**

- “magic” của Vue có thể che complexity về dependency,
- việc re-execution trong React ban đầu dễ làm người từ Vue sang thấy lạ,
- không có model nào thay thế được state design tốt.

Với người đi từ Vue sang React, mental shift này quan trọng hơn nhiều so với học thuộc API.`,
    ),
    followUps: [
      l('Why do React developers care so much about stable object and function identities?', 'Vì sao React developer lại quan tâm nhiều tới stable object và function identity?'),
      l('What mental habit from Vue hurts people most when moving to React?', 'Thói quen nào từ Vue dễ làm người ta vấp nhất khi sang React?'),
    ],
  }),
  q({
    id: 'react-hooks-rules',
    category: 'technical',
    tags: ['react', 'hooks'],
    question: l('Why do hooks need rules like “call at the top level”?', 'Vì sao hook có rule kiểu “gọi ở top level”?'),
    answer: l(
      `**Short answer:** Hooks must be called in the same order on every render because React matches hook state by **call order**, not by variable name.

**Why:**

- React stores hook state in ordered slots,
- conditional or looped hook calls shift that order,
- once the order shifts, state gets attached to the wrong hook.

**Trade-offs / mistakes:**

- this feels restrictive at first,
- but the predictability makes the hook runtime simple and fast,
- if you need conditional behavior, put the condition **inside** the hook or effect body, not around the hook call.

This is a runtime constraint, not just a style convention.`,
      `**Trả lời ngắn:** Hook phải được gọi theo cùng một thứ tự ở mọi lần render vì React gắn state của hook theo **thứ tự gọi**, không phải theo tên biến.

**Vì sao:**

- React lưu state của hook theo các slot có thứ tự,
- gọi hook có điều kiện hoặc trong loop sẽ làm lệch thứ tự đó,
- khi thứ tự lệch, state sẽ bị gắn nhầm sang hook khác.

**Trade-off / lỗi hay gặp:**

- ban đầu rule này có thể thấy hơi gò bó,
- nhưng chính sự cố định đó giúp runtime của hook đơn giản và nhanh,
- nếu cần behavior có điều kiện, hãy đặt điều kiện **bên trong** hook hoặc effect body, không đặt quanh lệnh gọi hook.

Đây là ràng buộc của runtime, không chỉ là style rule.`,
    ),
    followUps: [
      l('How do you express conditional behavior without conditionally calling hooks?', 'Bạn biểu diễn behavior có điều kiện mà không gọi hook có điều kiện như thế nào?'),
    ],
  }),
  q({
    id: 'react-controlled-vs-uncontrolled',
    category: 'technical',
    tags: ['react', 'forms'],
    question: l('Controlled vs uncontrolled components: when would you choose each?', 'Controlled và uncontrolled component: khi nào chọn mỗi loại?'),
    answer: l(
      `**Short answer:** Controlled inputs keep the current value in React state; uncontrolled inputs let the DOM own the live value and you read it via refs or form submission when needed.

**Why:**

Choose **controlled** when:

- validation or UI logic depends on the current value,
- multiple fields interact,
- you need explicit state ownership.

Choose **uncontrolled** when:

- the form is simple,
- you want less rerender overhead,
- you only need the value at submit time.

**Trade-offs:**

- controlled gives visibility and flexibility but increases React work,
- uncontrolled can be simpler and faster but is less transparent to React logic.

A senior answer is pragmatic, not ideological.`,
      `**Trả lời ngắn:** Input controlled giữ value hiện tại trong React state; input uncontrolled để DOM ownership value sống và chỉ đọc ra qua ref hoặc khi submit nếu cần.

**Vì sao:**

Chọn **controlled** khi:

- validation hoặc UI logic phụ thuộc vào value hiện tại,
- nhiều field ảnh hưởng lẫn nhau,
- bạn muốn ownership state rõ ràng.

Chọn **uncontrolled** khi:

- form khá đơn giản,
- muốn ít rerender hơn,
- chỉ cần lấy value lúc submit.

**Trade-off:**

- controlled cho nhiều visibility và flexibility hơn nhưng tăng công việc cho React,
- uncontrolled có thể đơn giản và nhanh hơn nhưng ít minh bạch hơn với logic của React.

Câu trả lời kiểu senior nên thực dụng, không giáo điều.`,
    ),
    followUps: [
      l('Why do form libraries often mix both models?', 'Vì sao nhiều form library lại trộn cả hai mô hình?'),
      l('How would you optimize a very large controlled form?', 'Bạn tối ưu một form controlled rất lớn như thế nào?'),
    ],
  }),
  q({
    id: 'react-context-limits',
    category: 'technical',
    tags: ['react', 'context', 'state-management'],
    question: l('What is React Context good for, and where does it break down?', 'React Context hợp với gì, và giới hạn ở đâu?'),
    answer: l(
      `**What they actually ask:** Did you put the whole cart / search query / every keystroke into Context and rerender the app?

**How a senior answers:** Context is **dependency injection**: theme, locale, auth *identity*, feature flags, a form controller. Decision: low-frequency, wide-tree values. Constraint: any \`value={{...}}\` new object rerenders **all** consumers. High-frequency or server state → Zustand/Pinia-like store or TanStack Query, not Context.

**Failure mode:** One \`AppStateProvider\` that updates on hover. Split components still subscribe to a fat context. Memoizing children but not splitting the context.

**Measure:** React profiler: who rerenders on a keystroke. Number of context providers on the critical path. A test that a presentational leaf does not render when auth display-name changes.

**Tradeoffs:** Context needs no extra lib and is awkward to optimize. External stores have selector granularity and another mental model. Vue provide/inject has the same “don’t make it a global store” rule.

**Production gotchas:** SSR: module-level default context leaks across requests if you put user data there. Next: keep context below the client boundary. Persist + Context = accidental \`localStorage\` tokens.`,
      `**Họ thực sự hỏi:** Bạn nhét cả cart / query search / mọi phím vào Context rồi rerender app?

**Cách senior trả lời:** Context là **dependency injection**: theme, locale, *identity* auth, feature flag, form controller. Decision: giá trị tần suất thấp, cây rộng. Constraint: \`value={{...}}\` object mới rerender **mọi** consumer. State tần suất cao hoặc server state → store kiểu Zustand/Pinia hoặc TanStack Query, không phải Context.

**Failure mode:** Một \`AppStateProvider\` update lúc hover. Component đã tách vẫn subscribe context béo. Memo child nhưng không tách context.

**Measure:** Profiler React: ai rerender khi gõ. Số provider trên critical path. Test leaf presentational không render khi đổi display-name auth.

**Tradeoffs:** Context không thêm lib và khó tối ưu. Store ngoài có selector mịn và thêm mental model. Vue provide/inject cùng rule “đừng biến thành global store.”

**Production gotchas:** SSR: default context ở module leak user giữa request. Next: giữ context dưới client boundary. Persist + Context = token \`localStorage\` tình cờ.`,
    ),
    followUps: [
      l('How do you split context so a theme toggle does not rerender a table?', 'Bạn tách context thế nào để toggle theme không rerender table?'),
      l('When is Pinia/Zustand a better fit than Context for the same data?', 'Khi nào Pinia/Zustand hợp hơn Context cho cùng loại data?'),
    ],
  }),
  q({
    id: 'next-app-router-rsc',
    category: 'technical',
    tags: ['react', 'nextjs', 'rsc'],
    question: l('What are React Server Components and the Next.js App Router trying to solve?', 'React Server Components và Next.js App Router đang cố giải bài toán gì?'),
    answer: l(
      `They try to reduce client-side JavaScript and improve the default data-fetching story by letting some component work happen on the server.

Benefits:

- smaller client bundles for server-only logic,
- server-side data access without shipping that code to the browser,
- clearer split between server and interactive client concerns.

Trade-offs:

- sharper mental model around boundaries,
- serialization limits,
- more complexity when mixing server and client concerns.

As a Vue/Nuxt engineer, you can compare it loosely to taking SSR and data ownership more seriously at the component model level.`,
      `Nó đang cố giảm JavaScript phía client và cải thiện data-fetching mặc định bằng cách cho một phần công việc của component chạy ở server.

Lợi ích:

- bundle phía client nhỏ hơn cho logic chỉ cần ở server,
- truy cập dữ liệu ở server mà không ship code đó xuống browser,
- ranh giới rõ hơn giữa concern phía server và concern interactive ở client.

Trade-off:

- mental model về boundary sắc hơn,
- giới hạn serialization,
- phức tạp hơn khi trộn concern server và client.

Nếu đi từ Vue/Nuxt sang, có thể so sánh gần đúng là đây là cách đưa SSR và ownership dữ liệu lên mức component model một cách nghiêm túc hơn.`,
    ),
  }),
  q({
    id: 'next-app-router-layouts-loading-error',
    category: 'technical',
    tags: ['react', 'nextjs', 'app-router'],
    question: l(
      'How do layouts, routing, loading states, and error states work in the Next.js App Router?',
      'Layout, routing, loading state và error state hoạt động thế nào trong Next.js App Router?',
    ),
    answer: l(
      `Think in **route segments** rather than one giant page tree.

- "layout.tsx" wraps a segment and can nest, similar to nested layouts in Nuxt.
- "page.tsx" is the leaf route content for that segment.
- "loading.tsx" gives a segment-level loading UI while server work is in flight.
- "error.tsx" is a segment-level recovery boundary for rendering failures.

The senior angle is not just memorizing file names. It is understanding that App Router lets you scope chrome, loading, and failure handling **per route segment** instead of treating the whole app as one spinner or one crash surface.

For a Nuxt comparison: nested "layout.tsx" maps loosely to Nuxt layouts, while "loading.tsx" and "error.tsx" feel like first-class segment conventions for UX states that many Vue teams otherwise assemble more manually.`,
      `Hãy nghĩ theo **route segment** chứ không phải một page tree khổng lồ.

- "layout.tsx" bọc một segment và có thể lồng nhau, khá giống nested layout trong Nuxt.
- "page.tsx" là nội dung route lá của segment đó.
- "loading.tsx" cho loading UI theo từng segment khi phần server đang xử lý.
- "error.tsx" là boundary khôi phục lỗi render ở mức segment.

Điểm senior không phải chỉ là nhớ tên file. Mà là hiểu App Router cho phép scope phần chrome, loading và xử lý failure **theo từng route segment**, thay vì biến cả app thành một spinner lớn hoặc một crash surface duy nhất.

So với Nuxt: nested "layout.tsx" gần với layout lồng nhau trong Nuxt, còn "loading.tsx" và "error.tsx" giống những convention hạng nhất cho UX state mà nhiều team Vue nếu không có framework support sẽ phải ráp thủ công hơn.`,
    ),
  }),
  q({
    id: 'next-server-client-components',
    category: 'technical',
    tags: ['react', 'nextjs', 'rsc'],
    question: l(
      'How do you decide between Server Components and Client Components in Next.js?',
      'Bạn quyết định giữa Server Component và Client Component trong Next.js như thế nào?',
    ),
    answer: l(
      `Default to **Server Components** unless you need browser-only behavior.

Use a **Server Component** when:

- the UI can be rendered from server-fetched data,
- the code should not ship to the browser,
- the component mainly composes data and markup.

Use a **Client Component** when you need:

- hooks like "useState" or "useEffect",
- browser APIs,
- event handlers and rich interaction.

The senior rule is: keep the "use client" boundary as low as possible. Push interactivity down to small leaves so pages and layouts can stay server-first.

If you come from Nuxt, the rough mental bridge is the same kind of ".client" / ".server" concerns plus SSR-aware data ownership, but App Router makes that boundary much more explicit.`,
      `Mặc định hãy dùng **Server Component** trừ khi thật sự cần hành vi chỉ có ở browser.

Dùng **Server Component** khi:

- UI render được từ data fetch ở server,
- code đó không nên ship xuống browser,
- component chủ yếu làm việc compose data và markup.

Dùng **Client Component** khi cần:

- hooks như "useState" hoặc "useEffect",
- browser API,
- event handler và tương tác phong phú.

Quy tắc kiểu senior là: giữ boundary "use client" xuống thấp nhất có thể. Đẩy tương tác xuống các leaf nhỏ để page và layout còn giữ được tính server-first.

Nếu đi từ Nuxt sang, cầu nối mental model gần đúng là concern kiểu ".client" / ".server" cộng với ownership dữ liệu kiểu SSR, nhưng App Router làm boundary đó tường minh hơn nhiều.`,
    ),
  }),
  q({
    id: 'next-data-fetching-cache-revalidation',
    category: 'technical',
    tags: ['react', 'nextjs', 'cache'],
    question: l(
      'How do data fetching, caching, and revalidation work in the Next.js App Router?',
      'Data fetching, caching và revalidation hoạt động thế nào trong Next.js App Router?',
    ),
    answer: l(
      `Start by deciding the **freshness requirement** of the page, not by copying a random fetch snippet.

Common options:

- "fetch(..., { cache: 'no-store' })" or dynamic rendering for always-fresh personalized data,
- "next: { revalidate: N }" for content that can be a little stale,
- tag/path revalidation when mutations should selectively refresh cached results.

The senior nuance is that Next caching is not “free performance.” It changes data freshness, invalidation, and operational complexity. You should be able to say what can be stale, for how long, and what event refreshes it.

For Nuxt engineers, compare it to choosing between server fetch, cached SSR content, and explicit refresh flows such as "refreshNuxtData" or route-rule behavior, but with stronger built-in cache semantics around fetch itself.`,
      `Hãy bắt đầu bằng việc chốt **mức độ tươi mới cần có** của trang, chứ đừng copy bừa một snippet fetch.

Các lựa chọn hay gặp:

- "fetch(..., { cache: 'no-store' })" hoặc dynamic rendering cho dữ liệu cá nhân hóa luôn phải mới,
- "next: { revalidate: N }" cho nội dung có thể stale một chút,
- revalidate theo tag/path khi mutation cần làm mới có chọn lọc các kết quả đã cache.

Nuance kiểu senior là cache trong Next không phải “free performance”. Nó làm thay đổi freshness, invalidation và độ phức tạp vận hành. Bạn phải nói rõ cái gì có thể stale, stale bao lâu và event nào sẽ refresh nó.

Với người quen Nuxt, có thể so gần đúng với việc chọn giữa server fetch, SSR content có cache, và các flow refresh chủ động như "refreshNuxtData" hoặc route rules, nhưng Next đẩy cache semantics xuống tận lớp fetch một cách rõ ràng hơn.`,
    ),
  }),
  q({
    id: 'next-rendering-modes-streaming',
    category: 'technical',
    tags: ['react', 'nextjs', 'ssr'],
    question: l(
      'How would you choose between SSR, SSG, ISR, and streaming in Next.js?',
      'Bạn sẽ chọn giữa SSR, SSG, ISR và streaming trong Next.js như thế nào?',
    ),
    answer: l(
      `Choose based on **SEO, personalization, update frequency, and time-to-useful-content**.

- **SSR** fits dynamic pages where fresh server HTML matters.
- **SSG** fits static marketing/docs content.
- **ISR** fits pages that are mostly static but should refresh periodically.
- **streaming** helps when parts of the page can appear early while slower server work continues.

Senior answers usually mention trade-offs, not just definitions:

- SSR gives freshness but adds request-time cost,
- SSG is cheap and fast but can go stale,
- ISR reduces rebuild pressure but adds cache semantics,
- streaming helps perceived speed but requires good loading-state design.

For a Nuxt comparison, think about the same rendering spectrum, but explain how App Router and Suspense make streamed segment-level UX a first-class part of the design.`,
      `Hãy chọn dựa trên **SEO, mức độ cá nhân hóa, tần suất cập nhật và time-to-useful-content**.

- **SSR** hợp với trang động nơi HTML mới ở server thật sự quan trọng.
- **SSG** hợp với marketing/docs ít đổi.
- **ISR** hợp với trang gần như tĩnh nhưng vẫn cần cập nhật định kỳ.
- **streaming** hợp khi một phần trang có thể hiện sớm trong lúc phần server chậm hơn vẫn đang chạy.

Câu trả lời kiểu senior thường nói tới trade-off chứ không chỉ là định nghĩa:

- SSR cho freshness nhưng tốn chi phí lúc request,
- SSG rẻ và nhanh nhưng có thể stale,
- ISR giảm áp lực rebuild nhưng thêm cache semantics,
- streaming tăng tốc độ cảm nhận nhưng đòi hỏi thiết kế loading state tốt.

Nếu so với Nuxt, hãy nghĩ tới cùng một phổ lựa chọn render, nhưng nhấn mạnh việc App Router và Suspense biến trải nghiệm streamed theo từng segment thành một phần hạng nhất của thiết kế.`,
    ),
  }),
  q({
    id: 'next-server-actions',
    category: 'technical',
    tags: ['react', 'nextjs', 'server-actions'],
    question: l(
      'When are Next.js Server Actions useful, and what should you watch out for?',
      'Khi nào Server Actions của Next.js hữu ích, và cần để ý điều gì?',
    ),
    answer: l(
      `Server Actions are useful when you want a form or button-driven mutation to call server logic **without hand-writing a separate API endpoint for every small action**.

Good fits:

- form submissions,
- small admin mutations,
- cases where validation, auth checks, and revalidation live close to the UI flow.

Things to watch:

- they do not remove the need for authorization or validation,
- you still need to think about revalidation and stale UI,
- not every mutation becomes simpler just because it can be an action.

The senior framing is: Server Actions are a delivery tool, not magic. Use them when they reduce ceremony while keeping server ownership, and avoid them when a clear HTTP API contract is still the better boundary.`,
      `Server Actions hữu ích khi bạn muốn một mutation đi từ form hoặc button gọi logic phía server **mà không phải viết riêng một API endpoint cho mọi action nhỏ**.

Case hợp:

- form submit,
- mutation nhỏ ở admin,
- tình huống validation, auth check và revalidation nên nằm gần UI flow.

Điểm cần để ý:

- nó không xoá nhu cầu authorization hay validation,
- bạn vẫn phải nghĩ tới revalidation và UI stale,
- không phải mutation nào cũng tự nhiên đơn giản hơn chỉ vì “làm được bằng action”.

Frame kiểu senior là: Server Actions là công cụ tăng tốc delivery, không phải phép màu. Dùng khi nó giảm ceremony mà vẫn giữ ownership ở server, và tránh dùng khi một HTTP API contract rõ ràng vẫn là boundary tốt hơn.`,
    ),
  }),
  q({
    id: 'next-middleware-use-cases',
    category: 'technical',
    tags: ['react', 'nextjs', 'middleware'],
    question: l(
      'What is Next.js middleware good for, and what should not go into it?',
      'Middleware của Next.js hợp cho việc gì, và không nên nhét gì vào đó?',
    ),
    answer: l(
      `Middleware is good for **early request-time decisions** such as lightweight auth gates, redirects, rewrites, locale handling, and simple header/cookie shaping.

It is a bad place for:

- heavy database work,
- anything that must rely on Node-only APIs,
- business logic that actually belongs in your backend authorization layer.

The senior point is that middleware runs on a hot path. Keep it thin, predictable, and easy to reason about. Use it to improve routing and request flow, not to turn Edge middleware into a hidden application server.

Nuxt comparison: it is closer to a mix of route middleware and edge/server request shaping than to a client-side router guard.`,
      `Middleware hợp cho các **quyết định sớm ở thời điểm request** như auth gate nhẹ, redirect, rewrite, xử lý locale, và chỉnh header/cookie đơn giản.

Nó là chỗ không hợp để đặt:

- truy vấn database nặng,
- logic phụ thuộc Node-only API,
- business logic vốn phải nằm ở tầng authorization của backend.

Điểm kiểu senior là middleware chạy trên đường đi nóng của request. Hãy giữ nó mỏng, dễ đoán và dễ reasoning. Dùng để cải thiện routing và request flow, chứ đừng biến Edge middleware thành một application server ngầm.

So với Nuxt, nó gần với sự pha trộn giữa route middleware và edge/server request shaping hơn là một client-side router guard đơn thuần.`,
    ),
  }),
  q({
    id: 'next-metadata-image-font-deployment',
    category: 'technical',
    tags: ['react', 'nextjs', 'seo', 'deployment'],
    question: l(
      'What production features should you remember in Next.js around metadata, SEO, image/font optimization, and deployment?',
      'Khi nói về production trong Next.js, bạn nên nhớ gì về metadata, SEO, tối ưu image/font và deployment?',
    ),
    answer: l(
      `A good answer ties these together as **delivery concerns**, not isolated trivia.

- **metadata / SEO**: define titles, descriptions, canonical signals, and social-preview data intentionally.
- **images**: use Next image optimization when it fits, but know the remote-domain and sizing implications.
- **fonts**: load them deliberately to reduce layout shift and avoid accidental performance regressions.
- **deployment**: understand what runtime you are targeting, where env vars live, and how caching/revalidation assumptions behave after deploy.

Senior nuance: “I know the feature exists” is not enough. You should be able to explain what problem it solves, what default it changes, and what can go wrong if the team configures it carelessly.

For a Nuxt comparison, think of the same outcome space: SEO metadata, optimized assets, and runtime/deploy choices - just expressed through Next conventions and Vercel-friendly workflows.`,
      `Một câu trả lời tốt phải nối các thứ này lại như **concern khi delivery**, chứ không phải trivia rời rạc.

- **metadata / SEO**: chủ động định nghĩa title, description, canonical signal và dữ liệu cho social preview.
- **images**: dùng tối ưu ảnh của Next khi phù hợp, nhưng phải biết hệ quả về remote domain và kích thước.
- **fonts**: load có chủ đích để giảm layout shift và tránh regression performance.
- **deployment**: hiểu mình đang target runtime nào, env vars nằm ở đâu, và giả định cache/revalidation sẽ vận hành ra sao sau deploy.

Nuance kiểu senior là: “em biết có tính năng đó” là chưa đủ. Bạn phải giải thích được nó giải bài toán gì, đổi default nào và nếu cấu hình ẩu thì có thể gây ra rắc rối gì.

Nếu so với Nuxt, hãy nghĩ tới cùng không gian outcome: metadata cho SEO, asset được tối ưu và lựa chọn runtime/deploy, chỉ là thể hiện qua convention của Next và workflow thân thiện với Vercel hơn.`,
    ),
  }),
  q({
    id: 'rendering-pipeline',
    category: 'technical',
    tags: ['browser', 'performance'],
    question: l('Explain the browser rendering pipeline.', 'Giải thích browser rendering pipeline.'),
    answer: l(
      `A simplified rendering pipeline is:

1. parse HTML/CSS,
2. build DOM and CSSOM,
3. build render tree,
4. layout,
5. paint,
6. composite.

Performance implications:

- layout-affecting changes can trigger reflow,
- visual changes may trigger repaint,
- transform/opacity often stay in the compositor and are cheaper.

This matters because frontend performance is often about not forcing expensive work on every frame.`,
      `Pipeline render của browser có thể đơn giản hóa thành:

1. parse HTML/CSS,
2. build DOM và CSSOM,
3. build render tree,
4. layout,
5. paint,
6. composite.

Hệ quả về performance:

- thay đổi ảnh hưởng layout có thể gây reflow,
- thay đổi hình ảnh có thể gây repaint,
- transform/opacity thường ở compositor nên rẻ hơn.

Hiểu pipeline này quan trọng vì performance frontend thường là bài toán tránh ép browser làm việc đắt đỏ ở mỗi frame.`,
    ),
  }),
  q({
    id: 'core-web-vitals',
    category: 'technical',
    tags: ['performance', 'web-vitals'],
    question: l('What are Core Web Vitals and how do you improve them?', 'Core Web Vitals là gì và tối ưu ra sao?'),
    answer: l(
      `**Short answer:** The three Core Web Vitals to know are **LCP** for loading, **INP** for interactivity, and **CLS** for visual stability.

**Why they matter:**

- **LCP** reflects how quickly the main content feels available,
- **INP** reflects how responsive the UI feels to real interactions,
- **CLS** reflects whether the page feels stable or “jumpy”.

**Typical improvement levers:**

- LCP -> reduce TTFB, optimize hero image, preload critical assets, cut blocking JS
- INP -> reduce main-thread blocking, split heavy work, avoid long sync renders
- CLS -> reserve layout space, stabilize fonts, avoid late-inserted UI shifts

**Trade-offs:**

- optimizing lab scores without field data can be misleading,
- improving one metric can hurt another if done carelessly,
- perceived UX matters more than a vanity score.

Senior answers connect metrics to the actual user experience, not just Lighthouse numbers.`,
      `**Trả lời ngắn:** Ba Core Web Vitals cần nắm là **LCP** cho loading, **INP** cho interactivity và **CLS** cho độ ổn định của layout.

**Vì sao chúng quan trọng:**

- **LCP** phản ánh việc nội dung chính xuất hiện nhanh tới mức nào,
- **INP** phản ánh UI phản hồi thao tác có mượt không,
- **CLS** phản ánh trang có bị “nhảy” gây khó chịu không.

**Các đòn bẩy tối ưu phổ biến:**

- LCP -> giảm TTFB, tối ưu ảnh hero, preload asset critical, cắt JS chặn render
- INP -> giảm main-thread blocking, tách heavy work, tránh sync render quá dài
- CLS -> chừa sẵn layout space, ổn định font, tránh UI tới muộn làm xô layout

**Trade-off:**

- tối ưu lab score mà không nhìn field data có thể gây lệch hướng,
- cải thiện một metric có thể làm metric khác xấu đi nếu làm ẩu,
- UX cảm nhận thật quan trọng hơn vanity score.

Câu trả lời senior luôn nối metric với trải nghiệm thực của user, không chỉ là điểm Lighthouse.`,
    ),
    followUps: [
      l('How do you decide whether to trust field data or lab data first?', 'Bạn quyết định tin field data hay lab data trước bằng cách nào?'),
      l('Can you give one example of a change that helps LCP but might hurt something else?', 'Bạn có ví dụ nào về thay đổi giúp LCP nhưng có thể làm xấu một thứ khác không?'),
    ],
  }),
  q({
    id: 'bundling-code-splitting',
    category: 'technical',
    tags: ['performance', 'bundling'],
    question: l('How do bundling, code splitting, and tree shaking affect frontend performance?', 'Bundling, code splitting và tree shaking ảnh hưởng performance frontend thế nào?'),
    answer: l(
      `Bundling impacts what the browser has to download, parse, and execute.

- **code splitting** helps avoid sending all code up front,
- **tree shaking** removes unused exports when the build can prove they are unused,
- but too many tiny chunks can create request overhead and waterfalls.

The right goal is not “smallest bundle at any cost.” It is getting the right code to the right user at the right time.`,
      `Bundling ảnh hưởng trực tiếp tới lượng code browser phải tải, parse và execute.

- **code splitting** giúp tránh gửi toàn bộ code ngay từ đầu,
- **tree shaking** loại bỏ export không dùng khi build chứng minh được chúng không cần thiết,
- nhưng chunk quá nhỏ và quá nhiều cũng có thể tạo overhead request và waterfall.

Mục tiêu đúng không phải là “bundle nhỏ nhất bằng mọi giá”. Mà là đưa đúng lượng code tới đúng user vào đúng thời điểm.`,
    ),
  }),
  q({
    id: 'css-layout-specificity',
    category: 'technical',
    tags: ['css', 'layout', 'architecture'],
    question: l('What CSS topics still matter for a senior frontend engineer?', 'Những chủ đề CSS nào vẫn rất quan trọng với senior frontend engineer?'),
    answer: l(
      `At senior level, CSS is less about memorizing syntax and more about predictable systems.

Important topics:

- layout primitives: flex, grid, intrinsic sizing, overflow,
- responsive strategy: container queries, fluid type/spacing, breakpoints,
- specificity management and avoiding style conflicts,
- design tokens and theming,
- performance and paint considerations,
- accessibility concerns like focus visibility and contrast.

Strong frontend engineers treat CSS as a system design problem, not an afterthought.`,
      `Ở mức senior, CSS bớt là chuyện nhớ syntax và trở thành chuyện xây hệ thống dễ đoán.

Các chủ đề quan trọng:

- layout primitive: flex, grid, intrinsic sizing, overflow,
- chiến lược responsive: container query, fluid type/spacing, breakpoint,
- quản lý specificity để tránh style conflict,
- design token và theming,
- performance/pain cost,
- concern về accessibility như focus visibility và contrast.

Frontend engineer mạnh xem CSS là một bài toán thiết kế hệ thống, không phải phần làm cho đẹp sau cùng.`,
    ),
  }),
  q({
    id: 'accessibility-forms-keyboard',
    category: 'technical',
    tags: ['a11y', 'forms', 'keyboard'],
    question: l('What accessibility basics do you always check in forms and interactive UI?', 'Những điểm accessibility cơ bản nào bạn luôn kiểm tra ở form và interactive UI?'),
    answer: l(
      `**Short answer:** My baseline is that the UI must be understandable and operable with **keyboard, semantics, labels, focus, and feedback**, not just visually attractive.

**Checklist:**

- every input has an accessible label,
- validation errors are associated with the right field,
- keyboard navigation works end to end,
- focus styles are visible,
- native elements are preferred over divs pretending to be controls,
- color is not the only signal,
- loading/disabled states are communicated clearly.

**Trade-offs:**

- custom components can give design freedom but raise a11y risk,
- last-minute fixes are harder than building semantics in from the start.

Senior FE work treats accessibility as interaction quality, not just compliance.`,
      `**Trả lời ngắn:** Baseline của em là UI phải hiểu được và thao tác được bằng **keyboard, semantics, label, focus và feedback**, chứ không chỉ đẹp về mặt thị giác.

**Checklist:**

- mọi input có accessible label,
- lỗi validation được gắn đúng field,
- keyboard navigation đi hết được flow,
- focus style nhìn thấy rõ,
- ưu tiên native element thay vì div giả làm control,
- màu không phải tín hiệu duy nhất,
- loading/disabled state được truyền đạt rõ.

**Trade-off:**

- custom component cho nhiều tự do về design nhưng tăng risk a11y,
- sửa a11y vào phút cuối luôn khó hơn việc đưa semantics vào ngay từ đầu.

Làm FE kiểu senior xem accessibility là chất lượng của interaction, không chỉ là compliance.`,
    ),
    followUps: [
      l('What a11y issues do you see most often in custom component libraries?', 'Bạn thấy lỗi a11y nào xuất hiện nhiều nhất trong custom component library?'),
      l('How would you test keyboard-only usability quickly?', 'Bạn sẽ test keyboard-only usability nhanh như thế nào?'),
    ],
  }),
  q({
    id: 'security-xss-csrf-csp',
    category: 'technical',
    tags: ['security', 'xss', 'csrf', 'csp'],
    question: l('How do you explain XSS, CSRF, and CSP in frontend terms?', 'Bạn giải thích XSS, CSRF và CSP theo góc nhìn frontend thế nào?'),
    answer: l(
      `**Short answer:** **XSS** is attacker script running on your origin, **CSRF** is a foreign site making the browser send authenticated requests to yours, and **CSP** is a browser policy that reduces what scripts/resources are allowed to run.

**Why this matters on the frontend:**

- XSS turns any JS-readable secret into a liability,
- CSRF matters especially when auth uses cookies,
- CSP reduces XSS blast radius but does not replace safe coding.

Frontend responsibilities:

- avoid unsafe HTML injection,
- sanitize untrusted rich content,
- store tokens safely,
- use anti-CSRF patterns with cookie auth,
- keep CSP practical and strong where possible.

**Trade-offs:**

- very strict CSP can complicate integrations,
- unsafe convenience APIs can speed development but expand risk.

Security answers are stronger when they explain attack mechanics, not just definitions.`,
      `**Trả lời ngắn:** **XSS** là script của attacker chạy được trên origin của bạn, **CSRF** là site khác khiến browser gửi request đã xác thực tới site của bạn, còn **CSP** là policy của browser giúp giới hạn script/resource nào được phép chạy.

**Vì sao chuyện này quan trọng với frontend:**

- XSS biến mọi secret JS đọc được thành liability,
- CSRF đặc biệt quan trọng khi auth bằng cookie,
- CSP giúp giảm blast radius của XSS nhưng không thay thế việc viết code an toàn.

Trách nhiệm phía frontend:

- tránh chèn HTML không an toàn,
- sanitize rich content không tin cậy,
- lưu token an toàn,
- dùng anti-CSRF pattern với cookie auth,
- giữ CSP đủ mạnh nhưng vẫn thực tế.

**Trade-off:**

- CSP quá chặt có thể làm tích hợp khó hơn,
- API tiện nhưng không an toàn có thể tăng tốc ngắn hạn nhưng mở rộng risk.

Câu trả lời về security sẽ mạnh hơn khi giải thích được cơ chế tấn công, không chỉ định nghĩa.`,
    ),
    followUps: [
      l('Why doesn’t HttpOnly cookie solve CSRF by itself?', 'Vì sao HttpOnly cookie tự nó không giải quyết được CSRF?'),
      l('When do you actually need HTML sanitization on the frontend?', 'Khi nào bạn thực sự cần sanitize HTML ở frontend?'),
    ],
  }),
  q({
    id: 'auth-token-storage',
    category: 'technical',
    tags: ['security', 'auth'],
    question: l('Where should auth tokens live on the frontend?', 'Auth token nên được lưu ở đâu phía frontend?'),
    answer: l(
      `**Short answer:** For web apps, I usually prefer **HttpOnly Secure SameSite cookies** for refresh/session and either cookie-based or short-lived in-memory access depending on the architecture.

**Why:**

- tokens readable by JS are exposed to XSS,
- long-lived bearer tokens increase blast radius,
- cookies can reduce token exposure to JS when configured correctly.

**Trade-offs:**

- cookie auth needs CSRF defenses,
- in-memory access tokens avoid storage persistence but disappear on reload,
- architecture and infra constraints still matter.

There is no universal answer, but “put JWT in LocalStorage by default” is usually not the safest choice.`,
      `**Trả lời ngắn:** Với web app, em thường ưu tiên **HttpOnly Secure SameSite cookie** cho refresh/session, còn access token thì hoặc cũng đi theo cookie, hoặc sống ngắn trong memory tùy kiến trúc.

**Vì sao:**

- token JS đọc được sẽ lộ cho XSS,
- bearer token sống lâu làm blast radius lớn hơn,
- cookie cấu hình đúng sẽ giảm bề mặt lộ token cho JS.

**Trade-off:**

- auth bằng cookie cần chống CSRF,
- access token trong memory tránh lưu bền nhưng mất khi reload,
- constraint của kiến trúc và hạ tầng vẫn ảnh hưởng tới lựa chọn.

Không có một đáp án đúng cho mọi nơi, nhưng “mặc định nhét JWT vào LocalStorage” thường không phải lựa chọn an toàn nhất.`,
    ),
    followUps: [
      l('What changes if the app is mobile instead of web?', 'Điều gì thay đổi nếu app là mobile thay vì web?'),
      l('How would you explain cookie auth + CSRF to a junior engineer?', 'Bạn giải thích cookie auth + CSRF cho junior như thế nào?'),
    ],
  }),
  q({
    id: 'testing-pyramid',
    category: 'technical',
    tags: ['testing', 'quality'],
    question: l('What is a good frontend testing strategy?', 'Chiến lược testing frontend tốt là gì?'),
    answer: l(
      `**Short answer:** A good frontend strategy is a **risk-based mix** of unit, component/integration, and a small number of E2E tests.

**Why:**

- unit tests are cheap for pure logic,
- component/integration tests give strong confidence in real user behavior,
- E2E tests protect critical journeys across boundaries.

What matters most:

- test behavior, not implementation details,
- place tests where regressions are expensive,
- keep feedback loops fast enough that the team actually runs them.

**Trade-offs:**

- too many E2E tests become slow and flaky,
- too many low-value unit tests create noise,
- not every path needs the same confidence level.

Senior testing is about confidence per cost, not test count for its own sake.`,
      `**Trả lời ngắn:** Chiến lược frontend tốt là một **risk-based mix** giữa unit, component/integration và một lượng nhỏ E2E cho các flow critical.

**Vì sao:**

- unit test rẻ cho pure logic,
- component/integration test cho độ tin cậy cao ở mức user behavior,
- E2E bảo vệ critical journey xuyên nhiều boundary.

Điều quan trọng nhất:

- test behavior, không test implementation detail,
- đặt test vào chỗ regressions đắt tiền,
- giữ feedback loop đủ nhanh để cả team thực sự chạy test.

**Trade-off:**

- quá nhiều E2E sẽ chậm và flaky,
- quá nhiều unit test giá trị thấp sẽ thành noise,
- không phải path nào cũng cần cùng mức độ confidence.

Testing kiểu senior là tối ưu confidence theo chi phí, không phải tối đa số lượng test.`,
    ),
    followUps: [
      l('What frontend behaviors are usually worth an E2E test?', 'Những behavior nào ở frontend thường đáng có E2E test?'),
      l('How do you keep test suites from becoming noisy and slow?', 'Bạn giữ test suite khỏi bị noisy và chậm như thế nào?'),
    ],
  }),
  q({
    id: 'js-var-let-const',
    category: 'technical',
    tags: ['javascript', 'basics'],
    question: l('What is the difference between var, let, and const?', 'Khác nhau giữa var, let và const là gì?'),
    answer: l(
      `**What they actually ask:** Can you pick a default, and do you know \`const\` is a **binding** rule — not deep freeze — plus TDZ in modules?

**How a senior answers:** Default \`const\`. Use \`let\` only when the binding must move (index, retry). Never \`var\` in new code. Constraint: \`const user = { role: 'admin' }; user.role = 'guest'\` is legal.

**Failure mode:** Treating \`const\` as \`Object.freeze\`, or \`var\` in a loop with \`await\` so every iteration fires the last id.

**Measure:** \`no-var\` / \`prefer-const\` in lint, plus a review of objects that actually need \`readonly\` / \`structuredClone\` / Vue \`readonly()\`.

**Tradeoffs:** \`Object.freeze\` is shallow and can break Vue 3 proxies. Rebinding \`let result\` in a 40-line function is often worse than early returns with \`const\`.

**Production gotchas:** Circular-import TDZ (\`store\` ↔ composable) throws at load, not a mysterious \`undefined\`. \`const { items } = props\` drops Vue reactivity unless \`toRefs\` / \`storeToRefs\`.`,
      `**Họ thực sự hỏi:** Bạn chọn default thế nào, và bạn có biết \`const\` là rule về **binding** — không phải freeze sâu — cộng TDZ trong module?

**Cách senior trả lời:** Default \`const\`. Dùng \`let\` khi binding phải đổi (index, retry). Không \`var\` trong code mới. Constraint: \`const user = { role: 'admin' }; user.role = 'guest'\` vẫn hợp lệ.

**Failure mode:** Coi \`const\` như \`Object.freeze\`, hoặc \`var\` trong loop có \`await\` khiến mọi iteration bắn cùng id cuối.

**Measure:** Lint \`no-var\` / \`prefer-const\`, rồi review object nào thật sự cần \`readonly\` / \`structuredClone\` / Vue \`readonly()\`.

**Tradeoffs:** \`Object.freeze\` nông và có thể gãy Vue 3 proxy. \`let result\` trong hàm 40 dòng thường tệ hơn early return với \`const\`.

**Production gotchas:** TDZ circular import (\`store\` ↔ composable) nổ lúc load, không phải \`undefined\` bí ẩn. \`const { items } = props\` mất reactivity trừ khi \`toRefs\` / \`storeToRefs\`.`,
    ),
    followUps: [
      l('Does const prevent array.push? Why would a reviewer still flag it?', 'const có chặn array.push không? Vì sao reviewer vẫn flag?'),
      l('Show a circular-import TDZ crash and how you would break the cycle.', 'Chỉ một crash TDZ do circular import và cách bạn cắt vòng.'),
    ],
  }),
  q({
    id: 'js-loose-vs-strict-equality',
    category: 'technical',
    tags: ['javascript', 'basics'],
    question: l('What is the difference between == and ===?', 'Khác nhau giữa == và === là gì?'),
    answer: l(
      `**What they actually ask:** Will you ship \`==\` in a Vue/TS codebase, and can you name the two loose cases that are still intentional?

**How a senior answers:** Default \`===\` / \`!==\`. Constraint: \`==\` is a coercion table, not “almost equal.” The only loose checks I still use on purpose are \`== null\` (covers \`null\` and \`undefined\`) and rare API-boundary shims.

**Failure mode:** \`if (count == false)\` treating \`0\` as missing; \`status == 200\` hiding a string \`"200"\` from a proxy; ESLint off for a whole file.

**Measure:** \`eqeqeq\` lint with an allowlist for \`== null\`. A table of flags/prices that includes \`0\`, \`''\`, \`false\`.

**Tradeoffs:** \`== null\` is shorter than \`value === null || value === undefined\`. Everywhere else, the saved keystroke is not worth the bug.

**Production gotchas:** Vue template \`v-if="value == 0"\` vs \`??\` / \`||\` mixups. TS \`===\` does not save you if you typed the API as \`number\` but the JSON is a string.`,
      `**Họ thực sự hỏi:** Bạn có ship \`==\` trong codebase Vue/TS không, và bạn nêu được hai case loose còn cố ý không?

**Cách senior trả lời:** Default \`===\` / \`!==\`. Constraint: \`==\` là bảng coercion, không phải “gần bằng.” Chỉ còn dùng cố ý \`== null\` (gộp \`null\`/\`undefined\`) và vài shim ở API boundary.

**Failure mode:** \`if (count == false)\` biến \`0\` thành missing; \`status == 200\` giấu string \`"200"\` từ proxy; tắt ESLint cả file.

**Measure:** Lint \`eqeqeq\` với allowlist \`== null\`. Bảng flag/giá có \`0\`, \`''\`, \`false\`.

**Tradeoffs:** \`== null\` ngắn hơn \`value === null || value === undefined\`. Chỗ khác, tiết kiệm phím không đáng với bug.

**Production gotchas:** Template Vue \`v-if="value == 0"\` lẫn với \`??\` / \`||\`. TS \`===\` không cứu nếu bạn type API là \`number\` nhưng JSON là string.`,
    ),
    followUps: [
      l('When is == null a better check than === undefined?', 'Khi nào == null tốt hơn === undefined?'),
      l('How do you keep API string/number IDs from leaking into === checks?', 'Bạn giữ ID string/number từ API khỏi lọt vào === như thế nào?'),
    ],
  }),
  q({
    id: 'js-data-types-typeof',
    category: 'technical',
    tags: ['javascript', 'basics'],
    question: l('What basic JavaScript data type and typeof quirks should you know?', 'Những data type và typeof quirk cơ bản nào của JavaScript cần nhớ?'),
    answer: l(
      `**What they actually ask:** Can you type an API boundary without \`typeof\` lying to you — especially \`null\`, arrays, and iframe values?

**How a senior answers:** Primitives: string, number, bigint, boolean, undefined, symbol, null. Everything else is object-ish. Decision: never use \`typeof\` alone at a trust boundary. Constraint: \`typeof null === 'object'\` is a leftover; \`typeof [] === 'object'\`; functions are \`'function'\`; \`NaN\` is a number.

**Failure mode:** \`if (typeof data === 'object')\` treating \`null\` as a payload, then crashing in a Vue template. \`data instanceof Array\` false across an iframe/jsdom realm.

**Measure:** A Zod/\`unknown\` parse at the fetch boundary. Tests with \`null\`, \`[]\`, \`NaN\`, and a second-window array if you embed iframes.

**Tradeoffs:** \`Array.isArray\` / \`Number.isNaN\` / \`Object.prototype.toString\` beat clever \`typeof\` tables. Hand-rolled type maps drift.

**Production gotchas:** Vue proxies still pass \`typeof === 'object'\`. Pinia persist of \`undefined\` vs omitted keys. TS \`typeof\` operator is compile-time — it does not fix runtime JSON.`,
      `**Họ thực sự hỏi:** Bạn type được API boundary mà không để \`typeof\` nói dối — nhất là \`null\`, array, và giá trị từ iframe?

**Cách senior trả lời:** Primitive: string, number, bigint, boolean, undefined, symbol, null. Còn lại là object-ish. Decision: đừng dùng \`typeof\` một mình ở trust boundary. Constraint: \`typeof null === 'object'\` là di sản; \`typeof [] === 'object'\`; function là \`'function'\`; \`NaN\` là number.

**Failure mode:** \`if (typeof data === 'object')\` coi \`null\` là payload rồi gãy template Vue. \`data instanceof Array\` false qua iframe/jsdom.

**Measure:** Parse Zod/\`unknown\` ở fetch boundary. Test với \`null\`, \`[]\`, \`NaN\`, và array từ window thứ hai nếu có iframe.

**Tradeoffs:** \`Array.isArray\` / \`Number.isNaN\` / \`Object.prototype.toString\` hơn bảng \`typeof\` khôn. Map type viết tay sẽ lệch.

**Production gotchas:** Vue proxy vẫn \`typeof === 'object'\`. Pinia persist \`undefined\` vs key bị bỏ. Toán tử \`typeof\` của TS là compile-time — không sửa JSON runtime.`,
    ),
    followUps: [
      l('How do you distinguish null, a missing field, and an empty object from an API?', 'Bạn phân biệt null, field thiếu, và object rỗng từ API thế nào?'),
      l('Why can instanceof Array fail for a value that looks like an array?', 'Vì sao instanceof Array có thể fail với giá trị trông như array?'),
    ],
  }),
  q({
    id: 'js-scope',
    category: 'technical',
    tags: ['javascript', 'basics'],
    question: l('What is scope in JavaScript?', 'Scope trong JavaScript là gì?'),
    answer: l(
      `**What they actually ask:** Can you predict what a callback, a Vue composable, or an ES module actually closes over — and when that becomes a leak?

**How a senior answers:** Scope is **lexical**: a function sees the bindings where it was written, not where it is called. Decision: keep module/global scope for true singletons; keep UI state in component/effect scope. Constraint: a closure keeps the **binding**, not a snapshot, until that function is released.

**Failure mode:** A module-level cache holding the last user’s 20MB export after logout. \`var\` leaking out of a \`for\`/\`if\`. A composable called inside \`if (flag)\` so the effect scope is wrong.

**Measure:** Memory retainers on a known object; a test that the second query drops the first result; eslint \`no-var\` plus “no module mutable user data.”

**Tradeoffs:** Module singletons are fast until they retain per-user data. Passing explicit args is noisier than closing over a ref — and usually safer.

**Production gotchas:** Vue \`<script setup>\` top-level \`let\` is **not** reactive. Pinia store imported by a composable that imports the store → TDZ. SSR: module scope is shared across requests.`,
      `**Họ thực sự hỏi:** Bạn đoán được callback, composable Vue, hay ES module đang close over cái gì — và khi nào thành leak?

**Cách senior trả lời:** Scope là **lexical**: function thấy binding nơi nó được viết, không phải nơi được gọi. Decision: module/global chỉ cho singleton thật; UI state nằm ở component/effect scope. Constraint: closure giữ **binding**, không phải snapshot, cho tới khi function được thả.

**Failure mode:** Cache module-level giữ export 20MB của user cũ sau logout. \`var\` chảy ra khỏi \`for\`/\`if\`. Composable gọi trong \`if (flag)\` nên effect scope sai.

**Measure:** Memory retainer trên object biết trước; test query thứ hai drop kết quả thứ nhất; eslint \`no-var\` + “không mutable user data ở module.”

**Tradeoffs:** Singleton module nhanh đến khi nó giữ data theo user. Truyền arg rõ ràng ồn hơn close over ref — và thường an toàn hơn.

**Production gotchas:** \`let\` top-level trong Vue \`<script setup>\` **không** reactive. Pinia store import composable import ngược store → TDZ. SSR: module scope dùng chung giữa request.`,
    ),
    followUps: [
      l('What is the difference between lexical scope and the this binding?', 'Lexical scope khác this binding ở điểm nào?'),
      l('When is a module-level cache a leak instead of a performance win?', 'Khi nào cache module-level là leak thay vì thắng performance?'),
    ],
  }),
  q({
    id: 'dom-event-propagation-delegation',
    category: 'technical',
    tags: ['dom', 'events', 'basics'],
    question: l('Explain event bubbling, capturing, delegation, preventDefault, and stopPropagation.', 'Giải thích event bubbling, capturing, delegation, preventDefault và stopPropagation.'),
    answer: l(
      `**What they actually ask:** Can you wire a 10k-row table and a modal without leaking listeners or killing analytics click-outside?

**How a senior answers:** Capture → target → bubble. Decision: **delegate** on a stable parent for dynamic lists (\`e.target.closest('[data-id]')\`). \`preventDefault\` stops the **browser** action (submit, link). \`stopPropagation\` stops **other listeners**. Constraint: Vue \`@click\` is bubble; \`@click.capture\` / \`.stop\` / \`.prevent\` are explicit.

**Failure mode:** \`stopPropagation\` on a row click so the document click-outside never sees it — modal/dropdown stuck open. Delegation on a node that Vue replaces (\`v-if\`) so the listener dies. Forgetting \`{ signal }\` / \`onUnmounted\` remove.

**Measure:** One listener on the table, not N per row. A keyboard + click-outside test. Heap: no detached nodes retained by handlers.

**Tradeoffs:** Delegation is cheaper and survives row recycle. Per-item listeners are simpler until virtualization. \`.stop\` is a last resort, not a default.

**Production gotchas:** Teleport/portal: the listener’s tree is not the visual tree. Shadow DOM / third-party widgets swallow events. React 17+ roots changed delegation; Vue did not.`,
      `**Họ thực sự hỏi:** Bạn gắn table 10k hàng và modal mà không leak listener hay giết click-outside của analytics?

**Cách senior trả lời:** Capture → target → bubble. Decision: **delegate** trên parent ổn định cho list động (\`e.target.closest('[data-id]')\`). \`preventDefault\` chặn hành vi **browser** (submit, link). \`stopPropagation\` chặn **listener khác**. Constraint: Vue \`@click\` là bubble; \`@click.capture\` / \`.stop\` / \`.prevent\` phải ghi rõ.

**Failure mode:** \`.stop\` trên click hàng khiến document không thấy click-outside — modal/dropdown kẹt. Delegate trên node bị \`v-if\` thay thế nên listener chết. Quên \`{ signal }\` / \`onUnmounted\` gỡ.

**Measure:** Một listener trên table, không phải N mỗi hàng. Test keyboard + click-outside. Heap: không còn node detached bị handler giữ.

**Tradeoffs:** Delegation rẻ và sống qua recycle hàng. Listener từng item đơn giản đến khi virtualize. \`.stop\` là cuối cùng, không phải default.

**Production gotchas:** Teleport/portal: cây listener ≠ cây nhìn thấy. Shadow DOM / widget nuốt event. React 17+ đổi delegation; Vue thì không.`,
    ),
    followUps: [
      l('When is stopPropagation the wrong fix for a click-outside bug?', 'Khi nào stopPropagation là fix sai cho bug click-outside?'),
      l('How do you delegate clicks in a virtualized Vue list?', 'Bạn delegate click trong list Vue virtualize thế nào?'),
    ],
  }),
  q({
    id: 'promise-basics',
    category: 'technical',
    tags: ['javascript', 'promises', 'basics'],
    question: l('What is a Promise and what problem does it solve?', 'Promise là gì và nó giải quyết bài toán nào?'),
    answer: l(
      `**What they actually ask:** Can you compose async work **and** talk failure, abort, and “empty catch that looks like no data”?

**How a senior answers:** A Promise is a single-settlement value: pending → fulfilled or rejected. Decision: use it as the **contract** (\`async\` functions always return one). Constraint: it does **not** cancel; you pass \`AbortSignal\`. Combinators express failure policy: \`all\` fail-fast, \`allSettled\` for partials.

**Failure mode:** \`catch { console.error }\` returning \`undefined\` so Vue paints “no rows.” An empty \`catch\` that retries a non-idempotent POST. Unhandled rejection in a fire-and-forget toast.

**Measure:** Network: aborted vs failed. An integration test that rejects one branch and asserts the **user-visible** error. Count of empty catches in review.

**Tradeoffs:** Promises compose; they do not model streams or retries. \`async/await\` reads sequentially — easy to accidentally waterfall.

**Production gotchas:** Nuxt/\`$fetch\` throws on HTTP error by default; \`fetch\` does not. Vue \`onMounted\` promises need abort on unmount. A rejected promise in \`Promise.all\` for a dashboard blanks the whole screen.`,
      `**Họ thực sự hỏi:** Bạn compose được việc async **và** nói được failure, abort, và “empty catch trông như không có data”?

**Cách senior trả lời:** Promise là giá trị settle một lần: pending → fulfilled hoặc rejected. Decision: dùng nó làm **contract** (\`async\` luôn trả về một promise). Constraint: **không** cancel; phải truyền \`AbortSignal\`. Combinator diễn tả policy lỗi: \`all\` fail-fast, \`allSettled\` cho partial.

**Failure mode:** \`catch { console.error }\` trả \`undefined\` nên Vue vẽ “không có hàng.” \`catch\` rỗng retry POST không idempotent. Unhandled rejection trong toast fire-and-forget.

**Measure:** Network: aborted vs failed. Test integration reject một nhánh và assert lỗi **user thấy**. Đếm empty catch khi review.

**Tradeoffs:** Promise compose được; không model stream hay retry. \`async/await\` đọc tuần tự — dễ waterfall nhầm.

**Production gotchas:** Nuxt/\`$fetch\` mặc định throw khi HTTP lỗi; \`fetch\` thì không. Promise trong Vue \`onMounted\` cần abort lúc unmount. Một reject trong \`Promise.all\` của dashboard làm trắng cả màn.`,
    ),
    followUps: [
      l('Why is cancellation not a Promise feature, and what do you use instead?', 'Vì sao cancel không phải feature của Promise, và bạn dùng gì?'),
      l('When is Promise.all the wrong combinator for a page?', 'Khi nào Promise.all là combinator sai cho một page?'),
    ],
  }),
  q({
    id: 'array-methods-map-filter-reduce',
    category: 'technical',
    tags: ['javascript', 'arrays', 'basics'],
    question: l('When do you use map, filter, reduce, and forEach?', 'Khi nào dùng map, filter, reduce và forEach?'),
    answer: l(
      `**What they actually ask:** Will you \`filter+map\` 50k rows in a Vue computed on every keystroke, or do you pick the method that matches intent **and** cost?

**How a senior answers:** \`map\` → new array, same length. \`filter\` → subset. \`reduce\` → one value/index when a single pass is the point. \`forEach\` → side effects only. Decision: express intent first; if the list is large, **index once** (Map/Set) instead of O(n) per row.

**Failure mode:** \`items.filter(...).map(...)\` in a template on every render. \`reduce\` golf that no one can review. \`forEach\` + \`push\` reinventing \`map\` and mutating shared Pinia state.

**Measure:** Profiler: computed eval vs keystroke. For 10k+ rows, time to first paint and whether you virtualize (\`content-visibility\`, TanStack Virtual, \`vue-virtual-scroller\`).

**Tradeoffs:** Chained methods are readable and allocate intermediates. A single \`for\`/\`reduce\` is faster and uglier. Prefer readable until a profile says otherwise.

**Production gotchas:** \`computed(() => props.items.sort())\` mutates the prop. \`map\` that returns a new object every time busts child memo/\`watch\`. Empty \`filter\` vs error payload — do not treat them the same.`,
      `**Họ thực sự hỏi:** Bạn có \`filter+map\` 50k hàng trong computed Vue mỗi lần gõ không, hay chọn method khớp ý **và** chi phí?

**Cách senior trả lời:** \`map\` → mảng mới, cùng độ dài. \`filter\` → tập con. \`reduce\` → một giá trị/index khi một pass là điểm. \`forEach\` → chỉ side effect. Decision: diễn đạt ý trước; list lớn thì **index một lần** (Map/Set) thay vì O(n) mỗi hàng.

**Failure mode:** \`items.filter(...).map(...)\` trong template mỗi render. \`reduce\` golf không ai review được. \`forEach\` + \`push\` giả \`map\` và mutate Pinia shared.

**Measure:** Profiler: computed eval vs phím gõ. Với 10k+ hàng, time to first paint và có virtualize không.

**Tradeoffs:** Chain dễ đọc, allocate trung gian. Một \`for\`/\`reduce\` nhanh và xấu. Ưu tiên dễ đọc đến khi profile nói ngược.

**Production gotchas:** \`computed(() => props.items.sort())\` mutate prop. \`map\` trả object mới mỗi lần phá memo/\`watch\` của child. \`filter\` rỗng vs payload lỗi — đừng coi như nhau.`,
    ),
    followUps: [
      l('When do you virtualize instead of making array methods faster?', 'Khi nào bạn virtualize thay vì tối ưu array method?'),
      l('Why is reduce often the wrong default in a PR review?', 'Vì sao reduce thường là default sai khi review PR?'),
    ],
  }),
  q({
    id: 'css-box-model',
    category: 'technical',
    tags: ['css', 'basics'],
    question: l('What is the CSS box model?', 'CSS box model là gì?'),
    answer: l(
      `**What they actually ask:** Why is this 320px card overflowing a 320px grid cell, and did you pick \`border-box\` on purpose?

**How a senior answers:** Content + padding + border + margin. Decision: \`box-sizing: border-box\` globally so \`width\` includes padding/border. Constraint: **margin collapses** vertically in normal flow; it does not on flex/grid items the same way. Overflow is a box-model + \`min-width: auto\` problem more often than a “CSS is broken” problem.

**Failure mode:** Mixing content-box third-party CSS with a border-box app. \`width: 100%\` + padding without border-box. Ignoring \`min-width: auto\` on flex children (the classic overflow).

**Measure:** DevTools box model overlay. A visual test for the card at 320 / 768 / 1280. Layout shift when borders/focus rings appear.

**Tradeoffs:** Global border-box is the senior default. Content-box is only useful when you truly want “content is exactly N px.”

**Production gotchas:** \`box-shadow\` and outlines do not add width — until a design system uses fat borders on focus. Percentage padding is relative to **width**, not height. Vue scoped CSS does not change the box model.`,
      `**Họ thực sự hỏi:** Vì sao card 320px tràn ô grid 320px, và bạn có chọn \`border-box\` có chủ đích không?

**Cách senior trả lời:** Content + padding + border + margin. Decision: \`box-sizing: border-box\` global để \`width\` gồm padding/border. Constraint: **margin collapse** theo chiều dọc ở normal flow; flex/grid khác. Overflow thường là box-model + \`min-width: auto\`, không phải “CSS hỏng.”

**Failure mode:** Trộn CSS content-box của third-party với app border-box. \`width: 100%\` + padding không border-box. Bỏ quên \`min-width: auto\` trên flex child (overflow kinh điển).

**Measure:** Overlay box model trong DevTools. Visual test card ở 320 / 768 / 1280. Layout shift khi hiện border/focus ring.

**Tradeoffs:** Border-box global là default senior. Content-box chỉ khi bạn thật sự muốn “content đúng N px.”

**Production gotchas:** \`box-shadow\` và outline không cộng width — đến khi design system dùng border focus dày. Padding % theo **width**, không phải height. Vue scoped CSS không đổi box model.`,
    ),
    followUps: [
      l('Why does a flex child overflow its parent even at width 100%?', 'Vì sao flex child vẫn overflow parent dù width 100%?'),
      l('What does margin collapse do inside a grid vs normal flow?', 'Margin collapse khác gì trong grid so với normal flow?'),
    ],
  }),
  q({
    id: 'css-position',
    category: 'technical',
    tags: ['css', 'basics', 'layout'],
    question: l('What do static, relative, absolute, fixed, and sticky mean in CSS positioning?', 'static, relative, absolute, fixed và sticky trong CSS positioning nghĩa là gì?'),
    answer: l(
      `**What they actually ask:** Why is this dropdown clipped, why did \`position: fixed\` attach to a transformed parent, and why is sticky not sticking?

**How a senior answers:** \`static\` = flow. \`relative\` = in flow, offset, and a containing block. \`absolute\` = out of flow, nearest positioned ancestor. \`fixed\` = viewport **unless** a transform/filter/perspective ancestor creates a containing block. \`sticky\` = relative until a threshold, then sticks **inside its scrollport**.

**Failure mode:** \`overflow: hidden\` on a parent killing sticky and clipping popovers. \`fixed\` inside a Vue modal with \`transform\` — it scrolls away. z-index wars without a stacking-context map.

**Measure:** A scroll repro for sticky headers. Keyboard focus still visible for absolute menus. Visual regression when opening a Teleport overlay.

**Tradeoffs:** Absolute in-place is simple until clipping. Teleport-to-body + fixed is the production popover pattern. Sticky is cheaper than JS scroll spies until nested scrollers appear.

**Production gotchas:** Vue Teleport exists because containing blocks lie. \`will-change\` / \`transform\` on a layout wrapper silently retargets \`fixed\`. Sticky needs a defined height on the scroll ancestor.`,
      `**Họ thực sự hỏi:** Vì sao dropdown bị cắt, vì sao \`position: fixed\` dính parent có transform, và vì sao sticky không dính?

**Cách senior trả lời:** \`static\` = flow. \`relative\` = còn trong flow, offset, và là containing block. \`absolute\` = ra khỏi flow, ancestor positioned gần nhất. \`fixed\` = viewport **trừ khi** ancestor có transform/filter/perspective tạo containing block. \`sticky\` = relative tới ngưỡng, rồi dính **trong scrollport của nó**.

**Failure mode:** \`overflow: hidden\` trên parent giết sticky và cắt popover. \`fixed\` trong modal Vue có \`transform\` — bị cuốn theo scroll. Đánh nhau z-index không có map stacking context.

**Measure:** Repro scroll cho sticky header. Focus bàn phím vẫn thấy trên menu absolute. Visual regression khi mở overlay Teleport.

**Tradeoffs:** Absolute tại chỗ đơn giản đến khi bị clip. Teleport ra body + fixed là pattern popover production. Sticky rẻ hơn JS scroll spy đến khi có scroller lồng.

**Production gotchas:** Vue Teleport tồn tại vì containing block hay nói dối. \`will-change\` / \`transform\` trên wrapper layout âm thầm đổi \`fixed\`. Sticky cần chiều cao rõ trên scroll ancestor.`,
    ),
    followUps: [
      l('Why can position fixed be relative to a transformed parent?', 'Vì sao position fixed có thể tính theo parent có transform?'),
      l('When do you Teleport a popover instead of position absolute?', 'Khi nào bạn Teleport popover thay vì position absolute?'),
    ],
  }),
  q({
    id: 'css-flexbox-vs-grid',
    category: 'technical',
    tags: ['css', 'layout', 'basics'],
    question: l('When should you use Flexbox vs Grid?', 'Khi nào dùng Flexbox và khi nào dùng Grid?'),
    answer: l(
      `**What they actually ask:** Can you pick a layout primitive for a dashboard without nesting 4 flex wrappers, and do you know when \`minmax\` beats magic numbers?

**How a senior answers:** Flex = **one axis** (nav, button row, “this cluster”). Grid = **two axes** (page skeleton, card gallery, form aligned on columns). Decision: Grid for the page, flex inside components. Constraint: flex children default \`min-width: auto\` and overflow; grid \`minmax(0, 1fr)\` is the usual fix.

**Failure mode:** Fake grid with nested flex + negative margins. \`repeat(auto-fit, minmax(200px, 1fr))\` without a min that fits the content (unreadable cards). Using JS to measure columns that Grid already solves.

**Measure:** Resize from 320→1440 without a horizontal scroll. Fewer wrapper divs than the last iteration. Keyboard tab order still matches visual order.

**Tradeoffs:** Flex wrapping is great until you need row **and** column alignment. Grid is verbose for a simple cluster. Subgrid is the right hammer when nested alignment matters and support is OK.

**Production gotchas:** Vue lists: \`display: contents\` on a wrapper can help grid placement and break a11y/event targeting. Gap vs margin-collapse surprises when mixing systems. Container queries often beat extra breakpoints.`,
      `**Họ thực sự hỏi:** Bạn chọn primitive layout cho dashboard mà không lồng 4 flex wrapper, và biết khi nào \`minmax\` hơn magic number?

**Cách senior trả lời:** Flex = **một trục** (nav, hàng nút, “cụm này”). Grid = **hai trục** (khung page, gallery card, form thẳng cột). Decision: Grid cho page, flex trong component. Constraint: flex child mặc định \`min-width: auto\` và overflow; grid \`minmax(0, 1fr)\` thường là fix.

**Failure mode:** Fake grid bằng flex lồng + margin âm. \`repeat(auto-fit, minmax(200px, 1fr))\` mà min không vừa content (card không đọc được). Dùng JS đo cột mà Grid đã làm được.

**Measure:** Resize 320→1440 không scroll ngang. Ít wrapper hơn iteration trước. Tab order khớp thứ tự nhìn.

**Tradeoffs:** Flex wrap tốt đến khi cần thẳng **cả hàng lẫn cột**. Grid dài dòng cho một cụm đơn. Subgrid đúng khi alignment lồng quan trọng và support đủ.

**Production gotchas:** List Vue: \`display: contents\` trên wrapper giúp grid nhưng gãy a11y/event. Gap vs margin-collapse khi trộn hệ. Container query thường hơn thêm breakpoint.`,
    ),
    followUps: [
      l('Why do people write minmax(0, 1fr) instead of 1fr?', 'Vì sao người ta viết minmax(0, 1fr) thay vì 1fr?'),
      l('When would you still measure layout in JS?', 'Khi nào bạn vẫn đo layout bằng JS?'),
    ],
  }),
  q({
    id: 'semantic-html-vs-aria-bem',
    category: 'technical',
    tags: ['html', 'css', 'a11y', 'basics'],
    question: l('How do semantic HTML, ARIA, and BEM fit together?', 'Semantic HTML, ARIA và BEM liên quan với nhau như thế nào?'),
    answer: l(
      `**What they actually ask:** Will you ship a \`div\` button with three ARIA attributes, and is BEM still the naming story in a Vue SFC shop?

**How a senior answers:** Semantics first — \`<button>\`, \`<a href>\`, \`<label>\`, headings, lists. ARIA **fills gaps** (dialog, tabs, live regions), it does not replace a native control. BEM (or CSS modules / scoped + utility) is a **naming/collision** tool, not accessibility. Constraint: first rule of ARIA is don’t use ARIA if a native element exists.

**Failure mode:** \`role="button"\` on a div without Enter/Space, focus, or disabled. \`aria-label\` that overrides visible text and lies. BEM as a religion while the markup is a soup of divs.

**Measure:** Keyboard-only pass. Accessibility tree in DevTools matches the visual hierarchy. Lint: \`vuejs-accessibility\` / axe on the critical flow.

**Tradeoffs:** BEM scales in multi-team CSS; Vue scoped + design tokens often replace it inside one app. ARIA widgets cost more than native and drift.

**Production gotchas:** Vue \`<component :is>\` swapping \`a\`/\`button\` without href vs type. Scoped CSS + BEM double-prefix. \`aria-hidden\` on a focusable control inside a modal.`,
      `**Họ thực sự hỏi:** Bạn có ship nút \`div\` kèm ba ARIA, và BEM còn là câu chuyện đặt tên trong shop Vue SFC không?

**Cách senior trả lời:** Semantic trước — \`<button>\`, \`<a href>\`, \`<label>\`, heading, list. ARIA **lấp chỗ trống** (dialog, tabs, live region), không thay native control. BEM (hoặc CSS modules / scoped + utility) là tool **đặt tên/tránh đụng**, không phải a11y. Constraint: rule đầu của ARIA là đừng dùng ARIA nếu đã có element native.

**Failure mode:** \`role="button"\` trên div thiếu Enter/Space, focus, disabled. \`aria-label\` đè text thật và nói dối. BEM thành tôn giáo trong khi markup toàn div.

**Measure:** Đi hết flow bằng bàn phím. Accessibility tree khớp hierarchy nhìn thấy. Lint \`vuejs-accessibility\` / axe trên flow critical.

**Tradeoffs:** BEM scale khi nhiều team CSS; Vue scoped + design token thường thay trong một app. Widget ARIA đắt hơn native và dễ lệch.

**Production gotchas:** Vue \`<component :is>\` đổi \`a\`/\`button\` thiếu href vs type. Scoped CSS + BEM double-prefix. \`aria-hidden\` trên control còn focus trong modal.`,
    ),
    followUps: [
      l('When is a custom ARIA tablist justified over native elements?', 'Khi nào ARIA tablist custom đáng hơn element native?'),
      l('How do you name styles in Vue 3 if the team is not on BEM?', 'Bạn đặt tên style trong Vue 3 thế nào nếu team không dùng BEM?'),
    ],
  }),
  q({
    id: 'http-basics-status-codes',
    category: 'technical',
    tags: ['http', 'basics'],
    question: l('What HTTP basics and status codes should frontend engineers know?', 'Frontend engineer nên nắm những HTTP basics và status code nào?'),
    answer: l(
      `**What they actually ask:** What does the **UI** do on 401 vs 403 vs 422 vs 429 — and will a retry create a second order?

**How a senior answers:** Methods carry intent: GET safe/idempotent, PUT/DELETE idempotent, POST usually not, PATCH maybe. Decision: map status to **product states**, not toast-everything. 401 → refresh/login. 403 → “no permission.” 404 → gone vs never existed. 409/412 → conflict UX. 422 → field errors. 429 → backoff. 5xx → retry only if idempotent.

**Failure mode:** Treating every non-2xx as “network error.” Retrying POST on 500. Hiding 403 as 404 without a product decision. Assuming \`fetch\` throws on 404 (it does not; \`$fetch\` often does).

**Measure:** Error-code analytics (not only HTTP 500). Duplicate-create rate. Contract tests on the error envelope \`{ code, message, fields }\`.

**Tradeoffs:** A rich error envelope costs BE work and saves FE guesswork. Collapsing codes to one banner is faster to ship and impossible to i18n well.

**Production gotchas:** 204 with a body. 301/308 vs 302/307 and lost POST. CDN 404 HTML parsed as JSON. Axios vs \`$fetch\` vs \`fetch\` disagree on what “error” means.`,
      `**Họ thực sự hỏi:** UI làm gì với 401 vs 403 vs 422 vs 429 — và retry có tạo đơn thứ hai không?

**Cách senior trả lời:** Method mang intent: GET an toàn/idempotent, PUT/DELETE idempotent, POST thường không, PATCH tùy. Decision: map status sang **product state**, không toast hết. 401 → refresh/login. 403 → không quyền. 404 → mất vs chưa từng có. 409/412 → UX conflict. 422 → lỗi field. 429 → backoff. 5xx → chỉ retry nếu idempotent.

**Failure mode:** Mọi non-2xx thành “lỗi mạng.” Retry POST khi 500. Giấu 403 thành 404 không có quyết định product. Tưởng \`fetch\` throw khi 404 (không; \`$fetch\` thường có).

**Measure:** Analytics theo error code (không chỉ HTTP 500). Tỷ lệ tạo trùng. Contract test envelope \`{ code, message, fields }\`.

**Tradeoffs:** Envelope lỗi giàu tốn BE và cứu FE khỏi đoán. Gộp mọi mã thành một banner ship nhanh, i18n kém.

**Production gotchas:** 204 vẫn có body. 301/308 vs 302/307 làm mất POST. CDN 404 HTML bị parse như JSON. Axios vs \`$fetch\` vs \`fetch\` không cùng định nghĩa “error.”`,
    ),
    followUps: [
      l('How do you distinguish 401 from 403 in a Vue route guard vs an API client?', 'Bạn phân biệt 401 với 403 ở Vue route guard và API client thế nào?'),
      l('Which status codes are safe to retry automatically?', 'Status code nào retry tự động là an toàn?'),
    ],
  }),
  q({
    id: 'cors-basics',
    category: 'technical',
    tags: ['http', 'security', 'basics'],
    question: l('What is CORS at a practical level?', 'CORS là gì ở mức thực tế?'),
    answer: l(
      `**What they actually ask:** Why does this request “work in Postman” and fail in Chrome — and did you just set \`Access-Control-Allow-Origin: *\` with cookies?

**How a senior answers:** CORS is a **browser** rule: JS on origin A may read a response from origin B only if B opts in. Decision: prefer a **same-origin BFF** (Nuxt/Nitro) so the browser never sees cross-origin cookies. Constraint: simple GET/POST without custom headers skip preflight; \`Authorization\`, \`Content-Type: application/json\`, or \`credentials: 'include'\` trigger OPTIONS.

**Failure mode:** \`*\` + \`Allow-Credentials: true\` (illegal / ignored). Reflecting any \`Origin\`. Treating CORS as authz. Caching a preflight too short so every click pays OPTIONS.

**Measure:** Network panel: is there a preflight, and does it fail? Can a foreign page read the JSON? Cookie still first-party after the BFF move?

**Tradeoffs:** BFF kills CORS complexity and adds a hop. Wide ACAO is easy for a public API and fatal with cookies.

**Production gotchas:** \`localhost\` vs \`127.0.0.1\` are different origins. Vite proxy hides CORS in dev and surprises in preview. Expo/WebView is not Chrome’s CORS. Server-to-server is unaffected.`,
      `**Họ thực sự hỏi:** Vì sao request “chạy ở Postman” mà gãy trên Chrome — và bạn vừa set \`Access-Control-Allow-Origin: *\` kèm cookie?

**Cách senior trả lời:** CORS là rule của **browser**: JS origin A chỉ đọc response origin B khi B opt-in. Decision: ưu tiên **BFF same-origin** (Nuxt/Nitro) để browser khỏi cookie cross-origin. Constraint: GET/POST simple không custom header bỏ preflight; \`Authorization\`, \`Content-Type: application/json\`, hoặc \`credentials: 'include'\` bật OPTIONS.

**Failure mode:** \`*\` + \`Allow-Credentials: true\` (sai / bị bỏ). Reflect mọi \`Origin\`. Coi CORS là authz. Cache preflight quá ngắn nên mỗi click trả OPTIONS.

**Measure:** Network: có preflight không, fail ở đâu? Trang lạ đọc được JSON không? Cookie còn first-party sau khi đưa BFF?

**Tradeoffs:** BFF hết rắc rối CORS, thêm một hop. ACAO rộng dễ cho public API, chết với cookie.

**Production gotchas:** \`localhost\` vs \`127.0.0.1\` khác origin. Vite proxy giấu CORS lúc dev, bất ngờ lúc preview. Expo/WebView không phải CORS của Chrome. Server-to-server không dính.`,
    ),
    followUps: [
      l('Which headers force a CORS preflight, and why does that matter for CSRF?', 'Header nào buộc preflight CORS, và vì sao chuyện đó liên quan CSRF?'),
      l('When would you keep a cross-origin API instead of a BFF?', 'Khi nào bạn giữ API cross-origin thay vì BFF?'),
    ],
  }),
  q({
    id: 'vue-lifecycle-nexttick-template-refs',
    category: 'technical',
    tags: ['vue', 'basics'],
    question: l('When do you use onMounted, onUnmounted, nextTick, and template refs in Vue 3?', 'Khi nào dùng onMounted, onUnmounted, nextTick và template ref trong Vue 3?'),
    answer: l(
      `**What they actually ask:** \`onMounted\` does **not** run on the server. Can you focus a \`v-if\` input, measure a list, and dispose a chart without a \`nextTick\` chain?

**How a senior answers:** State and pure subscriptions in \`setup\`. DOM / \`window\` / third-party widgets in \`onMounted\`. Stop them in \`onBeforeUnmount\` or \`onScopeDispose\` (composables). \`nextTick\` waits for the **already scheduled** Vue flush — focus, measure, hand a node to Mapbox. Template refs are the imperative handle; they are \`null\` until mounted.

**Failure mode:** \`addEventListener\` in \`setup\` (SSR crash or double register). \`await nextTick(); await nextTick()\` to hide a child that never mounted. Reading \`el.value.getBoundingClientRect()\` in setup.

**Measure:** “Does this run in \`nuxi build\` SSR?” Playwright first HTML vs hydrated UI. Chart \`dispose\` on unmount (heap).

**Tradeoffs:** \`onServerPrefetch\` / \`useAsyncData\` for HTML completeness; mounted fetch is client-only and flashes. Refs beat \`document.querySelector\` inside the component.

**Production gotchas:** \`onMounted\` on a \`v-if\` child runs when **that** child is created. Teleport does not change ownership. Async setup needs \`<Suspense>\` or the component never appears.`,
      `**Họ thực sự hỏi:** \`onMounted\` **không** chạy trên server. Bạn focus được input \`v-if\`, đo list, dispose chart mà không chuỗi \`nextTick\`?

**Cách senior trả lời:** State và subscription thuần trong \`setup\`. DOM / \`window\` / widget trong \`onMounted\`. Gỡ ở \`onBeforeUnmount\` hoặc \`onScopeDispose\` (composable). \`nextTick\` chờ flush Vue **đã schedule** — focus, đo, đưa node cho Mapbox. Template ref là handle imperative; \`null\` đến khi mounted.

**Failure mode:** \`addEventListener\` trong \`setup\` (SSR crash hoặc đăng ký đôi). \`await nextTick()\` hai lần để giấu child chưa mount. Đọc \`el.value.getBoundingClientRect()\` trong setup.

**Measure:** “Chạy trong \`nuxi build\` SSR không?” Playwright HTML đầu vs UI hydrate. Chart \`dispose\` lúc unmount (heap).

**Tradeoffs:** \`onServerPrefetch\` / \`useAsyncData\` cho HTML đủ; fetch ở mounted là client-only và flash. Ref hơn \`document.querySelector\` trong component.

**Production gotchas:** \`onMounted\` của child \`v-if\` chạy khi **child đó** được tạo. Teleport không đổi owner. Async setup cần \`<Suspense>\` nếu không component không hiện.`,
    ),
    followUps: [
      l('What is the first-paint difference between useAsyncData and an onMounted fetch in Nuxt?', 'First paint khác gì giữa useAsyncData và fetch trong onMounted ở Nuxt?'),
      l('When is onScopeDispose the right cleanup instead of onUnmounted?', 'Khi nào onScopeDispose đúng hơn onUnmounted để cleanup?'),
    ],
  }),
  q({
    id: 'vue-vif-vshow',
    category: 'technical',
    tags: ['vue', 'basics'],
    question: l('When should you use v-if vs v-show?', 'Khi nào dùng v-if và khi nào dùng v-show?'),
    answer: l(
      `**What they actually ask:** Do you want the subtree **gone** (no listeners, no SSR HTML, hooks re-run) or just \`display: none\`?

**How a senior answers:** \`v-if\` mount/unmount — use for tabs, auth gates, expensive widgets, anything with \`onMounted\` side effects. \`v-show\` keeps the instance — use for frequent toggles (tooltips, local filters) where setup cost dominates. Constraint: \`v-show\` still runs setup and still exists for a11y/SSR.

**Failure mode:** \`v-show\` on a Mapbox/chart that keeps ticking in the background. \`v-if\` on a form that wipes in-progress input every toggle. \`v-if\` + \`v-for\` on the same node (Vue 3 allows it; order is \`v-if\` first — usually split).

**Measure:** Toggle cost in profiler. Does the hidden panel still fire network/WebSocket? Screen reader: is hidden content still reachable?

**Tradeoffs:** \`v-if\` is cheaper initially and safer for secrets (do not leave PII in hidden DOM). \`v-show\` is cheaper to flip and keeps state.

**Production gotchas:** \`v-if="isMobile"\` defaulting false on SSR then true on client → hydration mismatch. \`keep-alive\` around \`v-if\` changes the story (\`onActivated\`). Tests: \`exists()\` vs \`isVisible()\`.`,
      `**Họ thực sự hỏi:** Bạn muốn subtree **biến mất** (hết listener, hết HTML SSR, hook chạy lại) hay chỉ \`display: none\`?

**Cách senior trả lời:** \`v-if\` mount/unmount — tab, auth gate, widget đắt, thứ có side effect \`onMounted\`. \`v-show\` giữ instance — toggle thường (tooltip, filter local) khi setup đắt hơn. Constraint: \`v-show\` vẫn chạy setup và vẫn tồn tại với a11y/SSR.

**Failure mode:** \`v-show\` trên Mapbox/chart vẫn tick nền. \`v-if\` trên form xóa input đang gõ mỗi lần bật. \`v-if\` + \`v-for\` cùng node (Vue 3 cho phép; \`v-if\` trước — thường tách).

**Measure:** Chi phí toggle trên profiler. Panel ẩn còn bắn network/WebSocket? Screen reader còn đọc được nội dung ẩn?

**Tradeoffs:** \`v-if\` rẻ lúc đầu và an toàn hơn với secret (đừng để PII trong DOM ẩn). \`v-show\` rẻ khi lật và giữ state.

**Production gotchas:** \`v-if="isMobile"\` mặc định false lúc SSR rồi true lúc client → hydration mismatch. \`keep-alive\` quanh \`v-if\` đổi câu chuyện (\`onActivated\`). Test: \`exists()\` vs \`isVisible()\`.`,
    ),
    followUps: [
      l('How does v-if vs v-show change what you assert in Vue Test Utils?', 'v-if vs v-show đổi điều bạn assert trong Vue Test Utils thế nào?'),
      l('When does keep-alive change the v-if decision?', 'Khi nào keep-alive làm đổi quyết định v-if?'),
    ],
  }),
  q({
    id: 'vue-computed-vs-methods-watch',
    category: 'technical',
    tags: ['vue', 'basics', 'reactivity'],
    question: l('How do computed, methods, and watch differ in Vue?', 'computed, methods và watch khác nhau thế nào trong Vue?'),
    answer: l(
      `**What they actually ask:** Purity and caching — not “computed is for display.” Will you filter 20k rows in a template method, or fetch inside a computed?

**How a senior answers:** Derived, sync, **pure** → \`computed\`. Handlers and parameterized work → methods. Anything **outside the graph** (fetch, analytics, URL, third-party widget) → \`watch\` / \`watchEffect\`. Prefer explicit \`watch\` sources. Constraint: computed cache keys on reactive identity; a new array every time never hits. No async computed.

**Failure mode:** \`{{ format(user) }}\` on 500 rows. Computed that writes \`localStorage\`. Fetch in \`watchEffect\` without abort. \`watch(..., { deep: true })\` on a whole form.

**Measure:** Computed eval count vs render count. Duplicate GETs in the waterfall. Watcher count in DevTools.

**Tradeoffs:** Computed cannot take arguments — pre-index a Map. \`watchEffect\` is short and over-collects. Methods are honest about running every call.

**Production gotchas:** \`computed(() => props.items.sort())\` mutates the prop. A computed returning a fresh object always fires child watchers. \`console.log\` inside computed lies about prod frequency.`,
      `**Họ thực sự hỏi:** Tính thuần và cache — không phải “computed để display.” Bạn filter 20k hàng trong method template, hay fetch trong computed?

**Cách senior trả lời:** Derived, sync, **thuần** → \`computed\`. Handler và việc có tham số → method. Thứ **ngoài graph** (fetch, analytics, URL, widget) → \`watch\` / \`watchEffect\`. Ưu tiên source \`watch\` rõ. Constraint: cache computed theo identity reactive; array mới mỗi lần không bao giờ hit. Không có async computed.

**Failure mode:** \`{{ format(user) }}\` trên 500 hàng. Computed ghi \`localStorage\`. Fetch trong \`watchEffect\` không abort. \`watch(..., { deep: true })\` cả form.

**Measure:** Số lần computed chạy vs render. GET trùng trên waterfall. Số watcher trong DevTools.

**Tradeoffs:** Computed không nhận argument — index sẵn Map. \`watchEffect\` ngắn và dễ over-collect. Method thành thật là chạy mỗi lần gọi.

**Production gotchas:** \`computed(() => props.items.sort())\` mutate prop. Computed trả object mới luôn kích watcher con. \`console.log\` trong computed nói dối tần suất prod.`,
    ),
    followUps: [
      l('Why is computed the wrong place to fetch?', 'Vì sao computed là chỗ sai để fetch?'),
      l('When is watchEffect too implicit in a large component?', 'Khi nào watchEffect quá implicit trong component lớn?'),
    ],
  }),
  q({
    id: 'vue-props-emits-vmodel',
    category: 'technical',
    tags: ['vue', 'basics', 'components'],
    question: l('How do props, emits, and v-model work together in Vue 3?', 'props, emits và v-model phối hợp với nhau như thế nào trong Vue 3?'),
    answer: l(
      `**What they actually ask:** One-way data flow is the junior bar. They want **do not mutate props**, multiple \`v-model\`, \`defineModel\`, and who owns the form.

**How a senior answers:** Props down, emits up. \`v-model\` / \`v-model:foo\` is parent-owned state (\`:modelValue\` + \`update:modelValue\`). In the child, emit or \`defineModel()\` — never assign the prop. Constraint: objects are by **reference**; nested mutation often skips the warning and still fights the parent refetch.

**Failure mode:** \`v-model="props.user"\` or \`props.filters.page++\`. Parent \`:filters="{ ...filters, page }"\` new identity every render → child deep watch thrashes. Two-way \`watch\` loops on currency fields.

**Measure:** “Mutation of prop” as CI fail. Lost-keystroke tickets. Count of \`watch(() => props.x, { deep: true })\`.

**Tradeoffs:** Parent-owned \`v-model\` is simple; every keystroke re-renders the parent unless you debounce. Local draft + emit on blur is heavier and avoids broadcast. Form libraries still must not mutate props.

**Production gotchas:** Destructure \`const { user } = defineProps()\` can drop reactivity in plain TS. Binding \`v-model\` straight to Pinia broadcasts every keystroke. \`.number\` on empty input → \`0\`.`,
      `**Họ thực sự hỏi:** One-way là sàn junior. Họ muốn **đừng mutate prop**, nhiều \`v-model\`, \`defineModel\`, và ai sở hữu form.

**Cách senior trả lời:** Props xuống, emit lên. \`v-model\` / \`v-model:foo\` là state parent sở hữu (\`:modelValue\` + \`update:modelValue\`). Trong child, emit hoặc \`defineModel()\` — không gán prop. Constraint: object truyền **theo reference**; mutate lồng thường không warning và vẫn đánh nhau với refetch của parent.

**Failure mode:** \`v-model="props.user"\` hoặc \`props.filters.page++\`. Parent \`:filters="{ ...filters, page }"\` identity mới mỗi render → deep watch của child đập. Vòng \`watch\` two-way trên field tiền.

**Measure:** Warning “mutation of prop” fail CI. Ticket mất phím gõ. Đếm \`watch(() => props.x, { deep: true })\`.

**Tradeoffs:** \`v-model\` parent đơn giản; mỗi phím render parent trừ khi debounce. Draft local + emit lúc blur nặng hơn, tránh broadcast. Form library vẫn không được mutate prop.

**Production gotchas:** Destructure \`const { user } = defineProps()\` có thể mất reactivity trong TS thuần. \`v-model\` thẳng vào Pinia broadcast mỗi phím. \`.number\` trên input rỗng → \`0\`.`,
    ),
    followUps: [
      l('When do you use defineModel vs explicit props and emits in a published component?', 'Khi nào dùng defineModel vs props/emits tường minh ở component publish?'),
      l('How do you keep a child form from losing keystrokes when the parent refetches?', 'Bạn giữ form con khỏi mất phím khi parent refetch thế nào?'),
    ],
  }),
  q({
    id: 'vue-key-in-v-for',
    category: 'technical',
    tags: ['vue', 'basics', 'lists'],
    question: l('Why does key matter in v-for?', 'Vì sao key quan trọng trong v-for?'),
    answer: l(
      `**What they actually ask:** Why did the checkbox stay checked after sort, and when is an index key actually OK?

**How a senior answers:** \`key\` is **identity** for reuse vs remount. Decision: stable unique id from the domain. Constraint: keys are among **siblings** — two \`v-for\`s in the same parent still share that space. Index keys are OK for **append-only, static, no local state** lists.

**Failure mode:** Index keys on a todo list: reorder preserves the wrong input. Using \`Math.random()\` or \`Date.now()\` remounts every render (lost focus, replayed \`onMounted\`, extra fetches). Same id reused after delete/create.

**Measure:** Reorder + typed input still bound to the right row. Vue warning about duplicate keys treated as fail. Profiler: unnecessary child remounts.

**Tradeoffs:** Remount-on-key-change is a feature (reset a wizard: \`:key="stepId"\`). Over-keying a huge static table adds vnode cost for no state win.

**Production gotchas:** \`<template v-for>\` needs the key on the \`<template>\`. Virtualizers invent their own identity. SSR + client key mismatch hydrates wrong. Don’t key on an object (stringifies to \`[object Object]\`).`,
      `**Họ thực sự hỏi:** Vì sao checkbox vẫn tick sau khi sort, và khi nào index key thực sự ổn?

**Cách senior trả lời:** \`key\` là **identity** để reuse vs remount. Decision: id ổn định, unique từ domain. Constraint: key trong nhóm **sibling** — hai \`v-for\` cùng parent vẫn chung không gian. Index key ổn cho list **chỉ append, tĩnh, không local state**.

**Failure mode:** Index key trên todo: reorder giữ nhầm input. \`Math.random()\` / \`Date.now()\` remount mỗi render (mất focus, \`onMounted\` chạy lại, fetch thêm). Cùng id sau delete/create.

**Measure:** Reorder + input đã gõ vẫn đúng hàng. Warning duplicate key coi là fail. Profiler: child remount không cần.

**Tradeoffs:** Đổi key để remount là feature (reset wizard: \`:key="stepId"\`). Key quá tay trên bảng tĩnh khổng lồ chỉ thêm cost vnode.

**Production gotchas:** \`<template v-for>\` để key trên \`<template>\`. Virtualizer có identity riêng. SSR + key client lệch hydrate sai. Đừng key bằng object (thành \`[object Object]\`).`,
    ),
    followUps: [
      l('When is changing a key on purpose the right way to reset state?', 'Khi nào cố ý đổi key là cách đúng để reset state?'),
      l('Why can two v-for lists in one parent collide on keys?', 'Vì sao hai list v-for trong một parent có thể đụng key?'),
    ],
  }),
  q({
    id: 'react-props-state-lifecycle-hooks',
    category: 'technical',
    tags: ['react', 'basics'],
    question: l('What are props, state, and “lifecycle with hooks” in React?', 'props, state và “lifecycle với hooks” trong React là gì?'),
    answer: l(
      `**What they actually ask:** Coming from Vue, do you still think in “created/mounted,” or do you split **render vs synchronize**?

**How a senior answers:** Props are the parent’s contract (read-only). State is values that, when set, **schedule a re-run of the function**. Lifecycle is not \`componentDidMount\` trivia — it is: render is a pure description; \`useEffect\` / \`useLayoutEffect\` sync the outside world after commit. Constraint: hook order is the identity of state.

**Failure mode:** Fetch in render. Derived values stored in state that drift from props. Effects that should be Vue-style \`computed\`. Missing cleanup → two subscriptions after Strict Mode double-mount.

**Measure:** React DevTools “why did this render.” Network: abort on unmount / dep change. A test that props update replaces stale local state when that is the product rule.

**Tradeoffs:** Local state is fast and hidden. Lifting state makes data flow obvious and rerenders a wider tree. Server Components / Nuxt \`useAsyncData\` move “first fetch” out of effects.

**Production gotchas:** Vue watchers feel precise; React effects run after paint and see stale closures unless deps/refs are honest. \`key\` on a child remounts its state — same as Vue.`,
      `**Họ thực sự hỏi:** Từ Vue sang, bạn còn nghĩ “created/mounted,” hay tách **render vs đồng bộ**?

**Cách senior trả lời:** Props là contract của parent (read-only). State là giá trị khi set sẽ **schedule chạy lại function**. Lifecycle không phải trivia \`componentDidMount\` — mà là: render mô tả thuần; \`useEffect\` / \`useLayoutEffect\` đồng bộ thế giới ngoài sau commit. Constraint: thứ tự hook là identity của state.

**Failure mode:** Fetch trong render. Derived nhét vào state rồi lệch props. Effect đáng lẽ là \`computed\` kiểu Vue. Thiếu cleanup → hai subscription sau Strict Mode mount đôi.

**Measure:** React DevTools “why did this render.” Network: abort lúc unmount / đổi dep. Test props update thay local state cũ khi đó là rule product.

**Tradeoffs:** State local nhanh và kín. Lift state làm data flow rõ, rerender cây rộng hơn. Server Components / Nuxt \`useAsyncData\` đưa “fetch đầu” ra khỏi effect.

**Production gotchas:** Watcher Vue thấy chính xác; effect React chạy sau paint và dính stale closure nếu dep/ref không thật. \`key\` trên child remount state — giống Vue.`,
    ),
    followUps: [
      l('What Vue habit hurts most when you start writing useEffect?', 'Thói quen Vue nào hại nhất khi bắt đầu viết useEffect?'),
      l('When should derived data stay out of useState?', 'Khi nào derived data không nên nằm trong useState?'),
    ],
  }),
  q({
    id: 'react-usestate-useref',
    category: 'technical',
    tags: ['react', 'basics', 'hooks'],
    question: l('What is the difference between useState and useRef?', 'Khác nhau giữa useState và useRef là gì?'),
    answer: l(
      `**What they actually ask:** Will you put a WebSocket, a previous id, or a debounce timer in state and rerender the tree 60 times a second?

**How a senior answers:** \`useState\` is UI state — set it and React re-renders. \`useRef\` is a mutable box that **survives renders and does not notify**. Decision: DOM nodes, latest callback, abort controller, “previous props,” timers → ref. Anything the user must see → state. Constraint: writing \`ref.current\` in render is a side effect; keep it in events/effects.

**Failure mode:** \`setState\` on every mousemove. Reading \`ref.current\` in render to “avoid rerenders” and showing a stale screen. Using state for an interval id.

**Measure:** Render count while dragging/typing. A test that a second request ignores the first via a generation ref + abort.

**Tradeoffs:** Refs are the React version of “latest Vue ref.value inside the async callback.” They skip render — so they can desync the UI if you hide display data in them.

**Production gotchas:** Vue \`ref\` is reactive; React \`useRef\` is not. \`useState\` updater must be stable/pure. Putting the access token in state + persist = \`localStorage\`.`,
      `**Họ thực sự hỏi:** Bạn có nhét WebSocket, id cũ, hay timer debounce vào state rồi rerender cây 60 lần/giây không?

**Cách senior trả lời:** \`useState\` là UI state — set là React render lại. \`useRef\` là hộp mutable **sống qua render và không báo**. Decision: DOM node, callback mới nhất, abort controller, “props trước,” timer → ref. Thứ user phải thấy → state. Constraint: ghi \`ref.current\` trong render là side effect; để trong event/effect.

**Failure mode:** \`setState\` mỗi mousemove. Đọc \`ref.current\` lúc render để “tránh rerender” rồi hiện màn hình stale. Dùng state cho interval id.

**Measure:** Số render khi kéo/gõ. Test request thứ hai bỏ request thứ nhất nhờ generation ref + abort.

**Tradeoffs:** Ref là bản React của “đọc \`ref.value\` Vue mới nhất trong callback async.” Chúng bỏ render — nên giấu data hiển thị trong đó sẽ lệch UI.

**Production gotchas:** Vue \`ref\` reactive; React \`useRef\` thì không. Updater \`useState\` phải thuần/ổn. Nhét access token vào state + persist = \`localStorage\`.`,
    ),
    followUps: [
      l('How do you keep an async callback from seeing a stale setState value?', 'Bạn giữ callback async khỏi thấy setState stale thế nào?'),
      l('When is useRef the wrong tool because the UI must update?', 'Khi nào useRef là tool sai vì UI phải cập nhật?'),
    ],
  }),
  q({
    id: 'live-coding-debounce',
    category: 'technical',
    tags: ['coding', 'javascript', 'debounce'],
    question: l('Implement debounce and explain trade-offs.', 'Hãy implement debounce và giải thích trade-off.'),
    answer: l(
      `**What they actually ask:** Typeahead that still shows yesterday’s query — did you debounce the **function** and abort the **request**?

**How a senior answers:** Debounce waits for quiet, then runs (usually trailing). Decision: search, resize, save-draft. Constraint: debounce is a timer; it does not cancel in-flight fetch. Pair with \`AbortController\` + ignore stale. Leading vs trailing is a product choice (instant first hint vs only last value).

**Failure mode:** Closing over the first \`args\`. No cancel → race. Forgetting \`flush\`/\`cancel\` on unmount so a setState runs on a dead component. Debouncing the Vue watcher source instead of the effect.

**Measure:** Network: one request after typing stops; previous is red/cancelled. Test: second query wins.

**Tradeoffs:** Delay vs server load. Lodash debounce is fine if you own cancel/flush. Too-long wait feels broken; too-short still storms.

**Production gotchas:** VueUse \`useDebounceFn\` still needs abort. SSR: don’t start timers in \`setup\`. IME composition events can fire extra calls.`,
      `**Họ thực sự hỏi:** Typeahead vẫn hiện query hôm qua — bạn debounce **hàm** và abort **request** chưa?

**Cách senior trả lời:** Debounce chờ yên rồi chạy (thường trailing). Decision: search, resize, save-draft. Constraint: debounce là timer; không cancel fetch đang bay. Đi kèm \`AbortController\` + bỏ stale. Leading vs trailing là chọn product (gợi ý ngay vs chỉ giá trị cuối).

**Failure mode:** Close over \`args\` lần đầu. Không cancel → race. Quên \`flush\`/\`cancel\` lúc unmount nên setState trên component chết. Debounce source watcher Vue thay vì effect.

**Measure:** Network: một request sau khi ngừng gõ; cái trước đỏ/cancelled. Test: query thứ hai thắng.

**Tradeoffs:** Trễ vs tải server. Lodash debounce ổn nếu bạn nắm cancel/flush. Wait quá dài như gãy; quá ngắn vẫn bão.

**Production gotchas:** VueUse \`useDebounceFn\` vẫn cần abort. SSR: đừng start timer trong \`setup\`. Sự kiện IME composition có thể bắn thêm.`,
    ),
    example: l(
      `\`\`\`ts
function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let timer: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, wait)
  }
}
\`\`\``,
      `\`\`\`ts
function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let timer: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, wait)
  }
}
\`\`\``,
    ),
    followUps: [
      l('How do you cancel both the timer and the in-flight request on unmount?', 'Bạn cancel cả timer lẫn request đang bay lúc unmount thế nào?'),
      l('Leading vs trailing: which one for search, which one for a save button?', 'Leading vs trailing: cái nào cho search, cái nào cho nút save?'),
    ],
  }),
  q({
    id: 'live-coding-throttle',
    category: 'technical',
    tags: ['coding', 'javascript', 'throttle'],
    question: l('Implement throttle and explain when it is better than debounce.', 'Hãy implement throttle và giải thích khi nào nó tốt hơn debounce.'),
    answer: l(
      `**What they actually ask:** Scroll/drag still janks — do you throttle the **handler** or virtualize the **list**, and will the last event run?

**How a senior answers:** Throttle = at most once per interval while events keep coming. Decision: scroll position, drag, resize-driven layout, analytics beacons. Constraint: leading-only drops the **final** value (scroll never lands on the true bottom). Trailing-only feels laggy at the start.

**Failure mode:** Throttling a Vue \`watch\` that already batches. Using throttle where debounce (search) was right. Timer leak on unmount. Passing a new throttled function every render so it never actually throttles.

**Measure:** Handler calls / second vs frame time. INP. A test that the last scroll event still updates.

**Tradeoffs:** Throttle keeps live feedback; debounce waits for quiet. \`requestAnimationFrame\` is often the better “once per frame” throttle for visual work.

**Production gotchas:** Passive scroll listeners + don’t read layout in the handler (forced reflow). Vue \`useScroll\` already rAF-throttles — don’t wrap twice.`,
      `**Họ thực sự hỏi:** Scroll/drag vẫn giật — bạn throttle **handler** hay virtualize **list**, và event cuối còn chạy không?

**Cách senior trả lời:** Throttle = tối đa một lần mỗi khoảng trong lúc event còn tới. Decision: vị trí scroll, drag, layout theo resize, beacon analytics. Constraint: chỉ leading mất **giá trị cuối** (scroll không bao giờ tới đáy thật). Chỉ trailing chậm lúc đầu.

**Failure mode:** Throttle \`watch\` Vue vốn đã batch. Dùng throttle chỗ đáng debounce (search). Leak timer lúc unmount. Tạo hàm throttle mới mỗi render nên không bao giờ throttle thật.

**Measure:** Số lần gọi handler / giây vs thời gian frame. INP. Test event scroll cuối vẫn update.

**Tradeoffs:** Throttle giữ phản hồi sống; debounce chờ yên. \`requestAnimationFrame\` thường là throttle “một lần/frame” tốt hơn cho việc vẽ.

**Production gotchas:** Listener scroll passive + đừng đọc layout trong handler (forced reflow). Vue \`useScroll\` đã rAF-throttle — đừng bọc hai lần.`,
    ),
    example: l(
      `\`\`\`ts
function throttle<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let lastRun = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastRun >= wait) {
      lastRun = now
      fn(...args)
    }
  }
}
\`\`\``,
      `\`\`\`ts
function throttle<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let lastRun = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastRun >= wait) {
      lastRun = now
      fn(...args)
    }
  }
}
\`\`\``,
    ),
    followUps: [
      l('How would you add a trailing call so the last scroll position is not dropped?', 'Bạn thêm trailing call thế nào để vị trí scroll cuối không bị mất?'),
      l('When is requestAnimationFrame a better throttle than setTimeout?', 'Khi nào requestAnimationFrame là throttle tốt hơn setTimeout?'),
    ],
  }),
  q({
    id: 'live-coding-promise-all',
    category: 'technical',
    tags: ['coding', 'javascript', 'promises'],
    question: l('How would you polyfill Promise.all?', 'Bạn sẽ polyfill Promise.all như thế nào?'),
    answer: l(
      `**What they actually ask:** Behavior first — order, fail-fast, empty input, then whether \`all\` will blank a dashboard.

**How a senior answers:** Collect results **by index**, not push order. \`Promise.resolve\` every item. Reject on first rejection. \`[]\` resolves to \`[]\`. Decision: use \`all\` when missing one result makes the screen useless; otherwise \`allSettled\` or split optional calls.

**Failure mode:** Pushing in completion order (wrong permutation). Forgetting empty-array. Using \`all\` for 15 widgets so one 500 whitescreens. No abort of siblings after the first reject (they still hit the network).

**Measure:** A test: mix values + promises, assert order. A test: first reject, later resolve must not win. Dashboard: partial UI vs fail-fast.

**Tradeoffs:** Fail-fast is honest for required data. \`allSettled\` is noisier and product-correct for optional cards.

**Production gotchas:** Vue dashboard in \`onMounted\` with \`Promise.all\` + no error boundary. Cancellation is extra — \`all\` does not abort the rest.`,
      `**Họ thực sự hỏi:** Hành vi trước — thứ tự, fail-fast, input rỗng, rồi \`all\` có làm trắng dashboard không.

**Cách senior trả lời:** Gom kết quả **theo index**, không phải thứ tự xong. \`Promise.resolve\` mọi item. Reject ngay reject đầu. \`[]\` resolve \`[]\`. Decision: \`all\` khi thiếu một kết quả thì màn hình vô dụng; không thì \`allSettled\` hoặc tách gọi optional.

**Failure mode:** Push theo thứ tự hoàn thành (hoán vị sai). Quên mảng rỗng. \`all\` cho 15 widget nên một 500 trắng màn. Không abort anh em sau reject đầu (vẫn tốn network).

**Measure:** Test: trộn value + promise, assert thứ tự. Test: reject trước, resolve sau không được thắng. Dashboard: UI partial vs fail-fast.

**Tradeoffs:** Fail-fast thật với data bắt buộc. \`allSettled\` ồn hơn và đúng product với card optional.

**Production gotchas:** Dashboard Vue trong \`onMounted\` dùng \`Promise.all\` + không error boundary. Cancel là thêm — \`all\` không abort phần còn lại.`,
    ),
    example: l(
      `\`\`\`ts
function promiseAll<T>(items: Array<T | Promise<T>>): Promise<T[]> {
  return new Promise((resolve, reject) => {
    if (items.length === 0) {
      resolve([])
      return
    }

    const results: T[] = new Array(items.length)
    let completed = 0

    items.forEach((item, index) => {
      Promise.resolve(item)
        .then((value) => {
          results[index] = value
          completed += 1
          if (completed === items.length) resolve(results)
        })
        .catch(reject)
    })
  })
}
\`\`\``,
      `\`\`\`ts
function promiseAll<T>(items: Array<T | Promise<T>>): Promise<T[]> {
  return new Promise((resolve, reject) => {
    if (items.length === 0) {
      resolve([])
      return
    }

    const results: T[] = new Array(items.length)
    let completed = 0

    items.forEach((item, index) => {
      Promise.resolve(item)
        .then((value) => {
          results[index] = value
          completed += 1
          if (completed === items.length) resolve(results)
        })
        .catch(reject)
    })
  })
}
\`\`\``,
    ),
    followUps: [
      l('How would you abort the remaining fetches after the first reject?', 'Bạn abort các fetch còn lại sau reject đầu thế nào?'),
      l('When do you choose allSettled over this fail-fast behavior in a Vue dashboard?', 'Khi nào chọn allSettled hơn fail-fast này trên dashboard Vue?'),
    ],
  }),
  q({
    id: 'live-coding-deep-clone',
    category: 'technical',
    tags: ['coding', 'javascript', 'deep-clone'],
    question: l('How would you approach deep clone in JavaScript?', 'Bạn tiếp cận bài deep clone trong JavaScript thế nào?'),
    answer: l(
      `**What they actually ask:** Define correctness before code — cycles, Date/Map, Vue proxies, functions — then pick \`structuredClone\` unless you cannot.

**How a senior answers:** Narrow the supported shapes. Prefer \`structuredClone\` (keeps Date, Map, Set, ArrayBuffer). \`JSON.parse(JSON.stringify)\` is a **lossy serializer**. Custom recursion only for a documented subset. Constraint: \`structuredClone\` throws on functions, DOM nodes, and some Vue proxies — \`toRaw\` first.

**Failure mode:** Silent drop of \`undefined\`/Dates via JSON. Infinite loop on cycles. Cloning a 50k-row page on every keystroke. Treating \`const\` as a clone.

**Measure:** A table of fixtures (Date, Map, cycle, proxy). Clone cost in profiler. After clone, mutate the copy and assert the source is untouched.

**Tradeoffs:** Structural sharing (write one path) is cheaper than deep clone. Clone is honest isolation for persist/postMessage.

**Production gotchas:** Pinia persist + proxies. Web Workers need structured clone anyway. Class instances lose methods unless you rehydrate.`,
      `**Họ thực sự hỏi:** Định nghĩa correctness trước code — cycle, Date/Map, Vue proxy, function — rồi chọn \`structuredClone\` trừ khi không được.

**Cách senior trả lời:** Thu hẹp shape hỗ trợ. Ưu tiên \`structuredClone\` (giữ Date, Map, Set, ArrayBuffer). \`JSON.parse(JSON.stringify)\` là **serializer mất mát**. Recursion thủ công chỉ cho subset đã ghi. Constraint: \`structuredClone\` throw với function, DOM node, và một số Vue proxy — \`toRaw\` trước.

**Failure mode:** JSON âm thầm mất \`undefined\`/Date. Vòng vô hạn với cycle. Clone trang 50k hàng mỗi phím. Coi \`const\` là clone.

**Measure:** Bảng fixture (Date, Map, cycle, proxy). Chi phí clone trên profiler. Sau clone, mutate bản sao và assert nguồn không đổi.

**Tradeoffs:** Structural sharing (ghi một path) rẻ hơn deep clone. Clone cô lập thật cho persist/postMessage.

**Production gotchas:** Pinia persist + proxy. Web Worker vốn cần structured clone. Class instance mất method trừ khi rehydrate.`,
    ),
    example: l(
      `\`\`\`ts
function deepClone<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }

  if (value === null || typeof value !== 'object') return value

  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item)) as T
  }

  const result: Record<string, unknown> = {}
  for (const key in value as Record<string, unknown>) {
    result[key] = deepClone((value as Record<string, unknown>)[key])
  }
  return result as T
}
\`\`\`

For production, clarify unsupported cases like cycles or special object types unless you implement them.`,
      `\`\`\`ts
function deepClone<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }

  if (value === null || typeof value !== 'object') return value

  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item)) as T
  }

  const result: Record<string, unknown> = {}
  for (const key in value as Record<string, unknown>) {
    result[key] = deepClone((value as Record<string, unknown>)[key])
  }
  return result as T
}
\`\`\`

Khi lên production phải nói rõ case nào chưa hỗ trợ, ví dụ cycle hoặc special object type, nếu chưa implement.`,
    ),
    followUps: [
      l('What happens if you structuredClone a Vue reactive proxy?', 'structuredClone một Vue reactive proxy thì chuyện gì xảy ra?'),
      l('How would you handle cycles without blowing the stack?', 'Bạn xử lý cycle mà không nổ stack thế nào?'),
    ],
  }),
  q({
    id: 'live-coding-event-emitter',
    category: 'technical',
    tags: ['coding', 'javascript', 'event-emitter'],
    question: l('Implement a simple EventEmitter.', 'Hãy implement một EventEmitter đơn giản.'),
    answer: l(
      `**What they actually ask:** Can you unsubscribe, survive a listener that unsubscribes mid-emit, and not leak a Vue component?

**How a senior answers:** \`on\` / \`off\` / \`emit\`. Decision: return an unsubscribe function; snapshot listeners (\`[...set]\`) before emit so mutation is safe. Constraint: this is a **retainer** — every \`on\` needs a lifetime (\`onScopeDispose\`, \`onUnmounted\`).

**Failure mode:** Iterating the live Set while a listener unsubscribes (skipped neighbor). Global bus holding the last page’s closures. \`once\` that does not remove on throw.

**Measure:** A test: listener B unsubscribes during emit; C still runs. Heap after route change: no detached emitters. Pair subscribe/unsubscribe in a Vue composable test.

**Tradeoffs:** A tiny emitter is clear. A global event bus recreates the mixin spaghetti Composition API was meant to kill — prefer Pinia or props/emits.

**Production gotchas:** Vue 3 removed \`$on\`/\`$off\` on the app for this reason. Memory: payload objects closed over by long-lived listeners. Don’t emit during SSR unless you meant to.`,
      `**Họ thực sự hỏi:** Bạn unsubscribe được, sống sót listener gỡ giữa emit, và không leak component Vue?

**Cách senior trả lời:** \`on\` / \`off\` / \`emit\`. Decision: trả hàm unsubscribe; snapshot listener (\`[...set]\`) trước emit để mutation an toàn. Constraint: đây là **retainer** — mỗi \`on\` cần vòng đời (\`onScopeDispose\`, \`onUnmounted\`).

**Failure mode:** Duyệt Set sống trong lúc listener unsubscribe (bỏ sót hàng xóm). Bus global giữ closure của page cũ. \`once\` không gỡ khi throw.

**Measure:** Test: listener B gỡ lúc emit; C vẫn chạy. Heap sau đổi route: không emitter treo. Test composable Vue pair subscribe/unsubscribe.

**Tradeoffs:** Emitter nhỏ thì rõ. Event bus global dựng lại spaghetti mixin mà Composition API muốn giết — nên Pinia hoặc props/emits.

**Production gotchas:** Vue 3 bỏ \`$on\`/\`$off\` trên app vì lý do này. Memory: payload bị listener sống lâu close over. Đừng emit lúc SSR trừ khi cố ý.`,
    ),
    example: l(
      `\`\`\`ts
class EventEmitter<T = unknown> {
  private events = new Map<string, Set<(payload: T) => void>>()

  on(event: string, listener: (payload: T) => void) {
    const listeners = this.events.get(event) ?? new Set()
    listeners.add(listener)
    this.events.set(event, listeners)

    return () => {
      listeners.delete(listener)
      if (listeners.size === 0) this.events.delete(event)
    }
  }

  emit(event: string, payload: T) {
    const listeners = this.events.get(event)
    if (!listeners) return
    ;[...listeners].forEach((listener) => listener(payload))
  }
}
\`\`\``,
      `\`\`\`ts
class EventEmitter<T = unknown> {
  private events = new Map<string, Set<(payload: T) => void>>()

  on(event: string, listener: (payload: T) => void) {
    const listeners = this.events.get(event) ?? new Set()
    listeners.add(listener)
    this.events.set(event, listeners)

    return () => {
      listeners.delete(listener)
      if (listeners.size === 0) this.events.delete(event)
    }
  }

  emit(event: string, payload: T) {
    const listeners = this.events.get(event)
    if (!listeners) return
    ;[...listeners].forEach((listener) => listener(payload))
  }
}
\`\`\``,
    ),
    followUps: [
      l('Why snapshot the listener set before emit?', 'Vì sao snapshot set listener trước khi emit?'),
      l('When is a global EventEmitter a worse idea than Pinia or props/emits?', 'Khi nào EventEmitter global tệ hơn Pinia hoặc props/emits?'),
    ],
  }),
  q({
    id: 'auth-401-refresh-queue',
    category: 'technical',
    tags: ['auth', 'jwt', 'http'],
    question: l(
      'How do you handle a burst of 401s: interceptor, single-flight refresh, queue, and logout storm?',
      'Bạn xử lý bão 401 thế nào: interceptor, refresh single-flight, queue, và logout storm?',
    ),
    answer: l(
      `**What they actually ask:** Ten parallel GETs 401 after access expiry — do you stampede \`/refresh\` and kick the user out?

**How a senior answers:** One interceptor. If status is 401 and the request is not \`/refresh\` and not already retried: wait on a **single in-flight refresh promise**, then replay with the new access. Queue is that shared promise (callers await it). On refresh 401: logout once, \`BroadcastChannel\` other tabs, do **not** recurse.

**Failure mode:** Each 401 rotates the refresh; rotation invalidates all but one → logout storm. Pinia persist of the access token. Retrying a non-idempotent POST blindly.

**Measure:** One \`/refresh\` in the Network panel for a burst. Refresh-reuse detection on the server. Time-to-revoke after logout.

**Tradeoffs:** Memory access + httpOnly refresh needs this machinery. A session cookie + BFF often deletes the problem. Queueing POSTs needs idempotency keys.

**Production gotchas:** 401 on \`/refresh\` must bypass the interceptor. Clock skew — refresh a minute early. Vue route guard racing the same refresh. Axios \`error.config\` mutation vs ofetch retry.`,
      `**Họ thực sự hỏi:** Mười GET song song 401 sau khi access hết hạn — bạn stampede \`/refresh\` rồi đá user ra?

**Cách senior trả lời:** Một interceptor. Nếu 401, không phải \`/refresh\`, chưa retry: chờ **một promise refresh đang bay**, rồi phát lại với access mới. Queue chính là promise đó (caller await). Khi refresh 401: logout một lần, \`BroadcastChannel\` tab khác, **không** đệ quy.

**Failure mode:** Mỗi 401 xoay refresh; rotation hủy hết trừ một → bão logout. Pinia persist access token. Retry POST không idempotent.

**Measure:** Một \`/refresh\` trên Network cho cả burst. Server phát hiện reuse refresh. Thời gian revoke sau logout.

**Tradeoffs:** Access memory + refresh httpOnly cần máy này. Session cookie + BFF thường xóa bài toán. Queue POST cần idempotency key.

**Production gotchas:** 401 trên \`/refresh\` phải bypass interceptor. Lệch đồng hồ — refresh sớm một phút. Vue route guard đua cùng refresh. Axios mutate \`error.config\` vs ofetch retry.`,
    ),
    example: l(
      `\`\`\`ts
let refreshInFlight: Promise<string> | null = null

async function refreshAccess() {
  if (!refreshInFlight) {
    refreshInFlight = api.post('/auth/refresh')
      .then((r) => { tokenMemory.set(r.accessToken); return r.accessToken })
      .finally(() => { refreshInFlight = null })
  }
  return refreshInFlight
}
\`\`\``,
      `\`\`\`ts
let refreshInFlight: Promise<string> | null = null

async function refreshAccess() {
  if (!refreshInFlight) {
    refreshInFlight = api.post('/auth/refresh')
      .then((r) => { tokenMemory.set(r.accessToken); return r.accessToken })
      .finally(() => { refreshInFlight = null })
  }
  return refreshInFlight
}
\`\`\``,
    ),
    followUps: [
      l('How do you avoid retrying a POST that already created an order?', 'Bạn tránh retry POST đã tạo đơn thế nào?'),
      l('How do all tabs learn about logout without a second refresh storm?', 'Mọi tab biết logout thế nào mà không bão refresh lần hai?'),
    ],
  }),
  q({
    id: 'tanstack-query-vs-global-store',
    category: 'technical',
    tags: ['state', 'tanstack-query', 'pinia'],
    question: l(
      'When is server state TanStack Query / useAsyncData, and when is it Pinia or Zustand?',
      'Khi nào server state thuộc TanStack Query / useAsyncData, khi nào thuộc Pinia hoặc Zustand?',
    ),
    answer: l(
      `**What they actually ask:** Did you copy the product list into Pinia and forget to invalidate after an admin edit?

**How a senior answers:** **Server cache** (TanStack Query, Nuxt \`useAsyncData\`/\`useFetch\`) owns data a server would recognize — keyed, stale, invalidated after POST. **Client store** owns client-only meaning: session UX, drafts, selection not yet in the URL, overlay flags. Decision: after a mutation, **invalidate the cache**; do not dual-write the entity graph.

**Failure mode:** \`useProductListStore\` that is a hand-rolled query. Query **and** Pinia both listing the cart. Optimistic Pinia + failed POST + cache unused = a third state.

**Measure:** Time until every surface shows the new value (one invalidate). Count of stores named \`useXListStore\`. Payload size if you also serialize the same blob for SSR.

**Tradeoffs:** Query-only: freshness + loading UI + key discipline. Store-only: simple and stale. Both with a rule scales; both without a rule diverges.

**Production gotchas:** SSR payload already is a server cache — don’t hydrate it into Pinia too. Colliding \`useFetch\` keys. Persist plugin on a list store. Vue: \`refreshNuxtData('product:id')\` after PATCH.`,
      `**Họ thực sự hỏi:** Bạn copy list sản phẩm vào Pinia rồi quên invalidate sau khi admin sửa?

**Cách senior trả lời:** **Server cache** (TanStack Query, Nuxt \`useAsyncData\`/\`useFetch\`) sở hữu data server nhận ra — có key, stale, invalidate sau POST. **Client store** sở hữu nghĩa chỉ có ở client: UX session, draft, selection chưa lên URL, cờ overlay. Decision: sau mutation, **invalidate cache**; đừng dual-write graph entity.

**Failure mode:** \`useProductListStore\` là query viết tay. Query **và** Pinia cùng list cart. Optimistic Pinia + POST fail + cache không dùng = state thứ ba.

**Measure:** Thời gian mọi surface hiện giá trị mới (một lần invalidate). Đếm store tên \`useXListStore\`. Payload nếu bạn còn serialize cùng blob cho SSR.

**Tradeoffs:** Chỉ query: tươi + UI loading + kỷ luật key. Chỉ store: đơn giản và stale. Cả hai có rule thì scale; không rule thì lệch.

**Production gotchas:** Payload SSR đã là server cache — đừng hydrate thêm vào Pinia. Key \`useFetch\` đụng nhau. Persist plugin trên list store. Vue: \`refreshNuxtData('product:id')\` sau PATCH.`,
    ),
    followUps: [
      l('Which cart fields still belong in Pinia on an SSR commerce site?', 'Field cart nào vẫn thuộc Pinia trên site thương mại SSR?'),
      l('Who wins on first paint in Nuxt: payload or the TanStack client cache?', 'First paint ở Nuxt: payload thắng hay TanStack client cache?'),
    ],
  }),
  q({
    id: 'vite-vs-webpack-tradeoffs',
    category: 'technical',
    tags: ['build', 'vite', 'webpack'],
    question: l(
      'Vite vs Webpack: CI shipped a 3MB chunk — when do you stay on Vite?',
      'Vite vs Webpack: CI ra chunk 3MB — khi nào bạn ở lại Vite?',
    ),
    answer: l(
      `**What they actually ask:** Is Vite “faster” in prod, and did route splitting never happen?

**How a senior answers:** Greenfield Vue 3 / Nuxt → **Vite**. Stay on Vite unless you need **first-class Module Federation today** or a Webpack-only loader maze. Constraint: dev is an ESM server + esbuild dep prebundle; **prod is still Rollup** (Rolldown later). A 3MB entry is a **graph** problem (no split, fat barrel, two Vues), not a reason to flee Vite.

**Failure mode:** Treating Vite as universally faster in prod. MF via a Vite plugin, then two Vue copies. Leaking secrets through \`VITE_*\`. Blaming Vite for a Pinia store that fans out HMR.

**Measure:** Analyzer (parsed vs gzip/brotli of **entry + async chunks**). Cold start, leaf-SFC HMR, CI \`vite build\` minutes, LCP on a mid-tier phone, duplicate Vue.

**Tradeoffs:** Webpack/Rspack own MF and exotic loaders. Vite wins DX and ESM libraries. Rspack if you must keep a Webpack graph and want Rust speed.

**Production gotchas:** Nuxt “slow HMR” is often Nitro restart. Hidden source maps uploaded to Sentry, not the CDN. Workspace packages prebundled wrong. Don’t switch bundlers to hide a missing \`import()\` on a route.`,
      `**Họ thực sự hỏi:** Vite có “nhanh hơn” lúc prod không, và route splitting đã làm chưa?

**Cách senior trả lời:** Vue 3 / Nuxt greenfield → **Vite**. Ở lại Vite trừ khi cần **Module Federation hạng nhất hôm nay** hoặc mê cung loader chỉ Webpack. Constraint: dev là ESM server + esbuild prebundle; **prod vẫn là Rollup**. Entry 3MB là bài **graph** (không split, barrel béo, hai Vue), không phải lý do bỏ Vite.

**Failure mode:** Coi Vite luôn nhanh hơn lúc prod. MF qua plugin Vite rồi hai bản Vue. Lộ secret qua \`VITE_*\`. Đổ lỗi Vite cho store Pinia làm HMR tỏa.

**Measure:** Analyzer (parsed vs gzip/brotli của **entry + async chunk**). Cold start, HMR SFC lá, phút CI \`vite build\`, LCP máy tầm trung, Vue nhân đôi.

**Tradeoffs:** Webpack/Rspack nắm MF và loader lạ. Vite thắng DX và lib ESM. Rspack nếu phải giữ graph Webpack và muốn tốc độ Rust.

**Production gotchas:** “HMR chậm” Nuxt thường là restart Nitro. Source map hidden upload Sentry, không lên CDN. Workspace package prebundle sai. Đừng đổi bundler để giấu thiếu \`import()\` trên route.`,
    ),
    followUps: [
      l('How do you read a 3MB report: entry vs async vs duplicated vue?', 'Bạn đọc báo cáo 3MB thế nào: entry vs async vs vue nhân đôi?'),
      l('When is Module Federation a reason to leave Vite?', 'Khi nào Module Federation là lý do rời Vite?'),
    ],
  }),
  q({
    id: 'vue-markraw-shallow-performance',
    category: 'technical',
    tags: ['vue', 'performance', 'reactivity'],
    question: l(
      'When do you use markRaw, shallowRef, and shallowReactive on large lists?',
      'Khi nào dùng markRaw, shallowRef và shallowReactive trên list lớn?',
    ),
    answer: l(
      `**What they actually ask:** A 50k-row table or a Mapbox instance — did you deep-proxy the world?

**How a senior answers:** \`ref\` for values you replace. \`reactive\` for a small bag you mutate. \`shallowRef\` for **large immutable pages** you swap in one assignment (\`rows.value = next\`). \`markRaw\` for **third-party identity** (Map, Chart, Monaco, class instances). Constraint: Vue cannot see mutations **inside** shallow/raw targets — use \`triggerRef\` if you must patch in place.

**Failure mode:** Deep \`reactive()\` on 50k rows. Wrapping a WebSocket/map and breaking \`instanceof\`. \`rows.value[i] = row\` on a shallowRef and wondering why the UI is stale.

**Measure:** Time-to-interact on the grid before/after \`shallowRef\`. Heap: leaked reactive objects / watchers after unmount.

**Tradeoffs:** Deep reactivity is convenient and expensive. Shallow is cheap and easy to misuse. Virtualize the list either way if you paint 50k DOM nodes.

**Production gotchas:** \`reactive\` unwraps nested refs. Module-scope \`reactive({})\` in Nuxt leaks across requests. \`toRaw\` before \`structuredClone\` or third-party Maps. Don’t \`markRaw\` data you still need Vue to track.`,
      `**Họ thực sự hỏi:** Table 50k hàng hoặc instance Mapbox — bạn deep-proxy cả thế giới?

**Cách senior trả lời:** \`ref\` cho giá trị bạn thay cả cục. \`reactive\` cho túi nhỏ mutate tại chỗ. \`shallowRef\` cho **trang immutable lớn** swap một assignment (\`rows.value = next\`). \`markRaw\` cho **identity third-party** (Map, Chart, Monaco, class). Constraint: Vue không thấy mutation **trong** shallow/raw — \`triggerRef\` nếu phải patch tại chỗ.

**Failure mode:** \`reactive()\` sâu 50k hàng. Bọc WebSocket/map rồi gãy \`instanceof\`. \`rows.value[i] = row\` trên shallowRef rồi lạ UI stale.

**Measure:** Time-to-interact của grid trước/sau \`shallowRef\`. Heap: object reactive / watcher leak sau unmount.

**Tradeoffs:** Deep reactivity tiện và đắt. Shallow rẻ và dễ dùng sai. Virtualize list dù sao nếu bạn vẽ 50k DOM node.

**Production gotchas:** \`reactive\` unwrap ref lồng. \`reactive({})\` ở module Nuxt leak giữa request. \`toRaw\` trước \`structuredClone\` hoặc Map third-party. Đừng \`markRaw\` data Vue vẫn phải track.`,
    ),
    example: l(
      `\`\`\`ts
const rows = shallowRef<Row[]>([])
function setPage(next: Row[]) { rows.value = next }
const map = markRaw(new MapboxMap(el))
\`\`\``,
      `\`\`\`ts
const rows = shallowRef<Row[]>([])
function setPage(next: Row[]) { rows.value = next }
const map = markRaw(new MapboxMap(el))
\`\`\``,
    ),
    followUps: [
      l('When must you call triggerRef after mutating a shallowRef array in place?', 'Khi nào phải gọi triggerRef sau khi mutate tại chỗ mảng shallowRef?'),
      l('Why does reactive() on a chart instance break the library?', 'Vì sao reactive() trên instance chart làm gãy thư viện?'),
    ],
  }),
  q({
    id: 'fe-ci-preview-deploys',
    category: 'technical',
    tags: ['ci', 'devops', 'preview'],
    question: l(
      'How do you think about preview deploys, env, and rollback on a frontend team?',
      'Bạn nghĩ về preview deploy, env và rollback trên team frontend thế nào?',
    ),
    answer: l(
      `**What they actually ask:** Can PM open \`pr-123.preview\` without seeing prod PII, and can you undo a bad SHA in minutes?

**How a senior answers:** Every PR gets a **unique URL** of **that SHA**. Env: staging/test APIs, fake data, **separate** OAuth clients and cookies. Kill preview on merge/close. Rollback = redeploy last good artifact (same digest, different runtime env) — do not “hotfix on the preview.” Constraint: preview origins explode CORS/cookies; BFF same-origin or a wildcard CORS **only** on staging.

**Failure mode:** Preview on prod DB. \`VITE_*\` / \`NUXT_PUBLIC_*\` copied from prod. Cookie \`Domain=.example.com\` leaking preview ↔ prod. Long-lived preview that became unofficial staging.

**Measure:** Time-to-preview in the first CI pass. Incidents from preview→prod mixups. Rollback time. \`X-Robots-Tag: noindex\` on previews.

**Tradeoffs:** Full namespace per PR is realistic and expensive. Vercel/Pages is cheap and may not match GitOps. Prefer **runtime** env so one digest promotes.

**Production gotchas:** Secrets in \`VITE_*\` (always client). CSP \`connect-src\` missing staging. Mixed content. e2e should target the preview \`baseURL\`. SSR + WS previews need a real Node host, not only static.`,
      `**Họ thực sự hỏi:** PM mở \`pr-123.preview\` mà không thấy PII prod, và bạn undo SHA xấu trong vài phút được không?

**Cách senior trả lời:** Mỗi PR một **URL riêng** của **đúng SHA**. Env: API staging/test, data giả, OAuth client và cookie **tách**. Giết preview lúc merge/đóng. Rollback = deploy lại artifact tốt cuối (cùng digest, env runtime khác) — đừng “hotfix trên preview.” Constraint: origin preview nổ CORS/cookie; BFF same-origin hoặc CORS wildcard **chỉ** trên staging.

**Failure mode:** Preview trỏ DB prod. \`VITE_*\` / \`NUXT_PUBLIC_*\` copy từ prod. Cookie \`Domain=.example.com\` rò preview ↔ prod. Preview sống lâu thành staging chui.

**Measure:** Time-to-preview ở CI pass đầu. Incident do lẫn preview→prod. Thời gian rollback. \`X-Robots-Tag: noindex\` trên preview.

**Tradeoffs:** Namespace k8s mỗi PR thật và đắt. Vercel/Pages rẻ, có thể lệch GitOps. Ưu tiên env **runtime** để một digest promote được.

**Production gotchas:** Secret trong \`VITE_*\` (luôn là client). CSP \`connect-src\` thiếu staging. Mixed content. e2e nên nhắm \`baseURL\` preview. Preview SSR + WS cần host Node thật, không chỉ static.`,
    ),
    followUps: [
      l('What must never be a NUXT_PUBLIC_ or VITE_ value on a preview?', 'Thứ gì không bao giờ được là NUXT_PUBLIC_ hoặc VITE_ trên preview?'),
      l('How do you roll back without rebuilding, and what does that require of env?', 'Bạn rollback không rebuild thế nào, và env phải đáp ứng gì?'),
    ],
  }),
]
