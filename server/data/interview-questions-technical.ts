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
      `I would start with a **modular monolith**, not micro-frontends.

Useful baseline:

- \`app/\` or shell for routing, layouts, providers
- \`modules/<feature>/\` for feature-owned pages, components, hooks/composables, API client, tests
- \`shared/ui\` for reusable primitives
- \`shared/lib\` for pure utilities
- explicit import boundaries so features do not deep-import each other

To scale past 100 features:

1. define domain ownership clearly,
2. keep route-level lazy loading,
3. standardize API contract typing,
4. choose a state policy: URL for navigation/filter state, server-state cache for remote data, global client state only for real cross-cutting concerns,
5. enforce architecture with linting, code review, and templates.

The main failure mode at scale is not file count. It is **unclear ownership and accidental coupling**.`,
      `Em sẽ bắt đầu bằng **modular monolith**, không nhảy ngay sang micro-frontend.

Baseline hữu ích:

- \`app/\` hoặc shell cho routing, layout, provider
- \`modules/<feature>/\` cho page, component, hook/composable, API client, test do feature đó ownership
- \`shared/ui\` cho primitive dùng lại
- \`shared/lib\` cho utility thuần
- boundary import rõ ràng để các feature không deep-import nội bộ của nhau

Để scale qua 100 feature:

1. chốt domain ownership rõ,
2. giữ lazy loading ở mức route/feature,
3. chuẩn hóa typing của API contract,
4. có state policy: URL cho navigation/filter state, server-state cache cho remote data, global client state chỉ cho concern cross-cutting thật sự,
5. enforce architecture bằng lint, code review và template.

Failure mode chính khi scale không phải là số lượng file. Mà là **ownership mơ hồ và coupling vô tình tăng lên**.`,
    ),
    example: l(
      `A good pattern is \`modules/customers/{pages,components,api,model,tests}\` with a public entry file. Other modules import the public API, not deep internals.`,
      `Pattern tốt là \`modules/customers/{pages,components,api,model,tests}\` kèm một public entry file. Module khác chỉ import public API, không chui sâu vào internals.`,
    ),
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
      `Performance debugging starts with measurement, not opinions.

I would look at:

- field data: Web Vitals or RUM,
- lab data: browser performance profiler, Lighthouse, Vue/React profiler,
- waterfall: TTFB, payload size, parsing, scripting, rendering.

Heuristics:

- high TTFB often means BE/network/cold start,
- large JS and long scripting often mean FE bundle or render cost,
- many sequential requests can mean FE orchestration problems or a missing aggregate endpoint.

Fixes should target the bottleneck, not just “optimize everything.”`,
      `Debug performance phải bắt đầu bằng đo đạc, không phải opinion.

Em sẽ nhìn:

- field data: Web Vitals hoặc RUM,
- lab data: browser performance profiler, Lighthouse, Vue/React profiler,
- waterfall: TTFB, payload, parsing, scripting, rendering.

Heuristic thường là:

- TTFB cao thường nghiêng BE/network/cold start,
- JS lớn và scripting lâu thường nghiêng bundle hoặc render cost phía FE,
- nhiều request nối tiếp có thể là vấn đề orchestration phía FE hoặc thiếu aggregate endpoint ở BE.

Fix phải đánh đúng bottleneck, không phải kiểu “tối ưu tất cả mọi thứ”.`,
    ),
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
      `\`useEffect\` is for synchronizing React with **external systems** after render: subscriptions, DOM APIs, timers, analytics, or network side effects.

Important mental model:

- render should stay pure,
- effects run after commit,
- cleanup runs before re-running and on unmount.

Common mistakes:

- using effects for derived UI data,
- missing dependencies and creating stale closures,
- fetching in effects without cancellation or cache strategy.

As a Vue developer, the useful comparison is that React effects are closer to “sync with the outside world after render,” not a general replacement for computed logic.`,
      `\`useEffect\` dùng để đồng bộ React với **hệ thống bên ngoài** sau khi render: subscription, DOM API, timer, analytics hoặc network side effect.

Mental model quan trọng:

- render phải giữ được purity,
- effect chạy sau khi commit,
- cleanup chạy trước lần chạy tiếp theo và khi unmount.

Lỗi hay gặp:

- dùng effect để tính derived UI data,
- thiếu dependency dẫn tới stale closure,
- fetch trong effect mà không có cancellation hoặc cache strategy.

Với người đi từ Vue sang, cách so sánh hữu ích là effect gần với “đồng bộ với thế giới bên ngoài sau render”, chứ không phải thứ thay thế cho computed logic.`,
    ),
  }),
  q({
    id: 'jwt-login-flow',
    category: 'technical',
    tags: ['auth', 'jwt', 'security'],
    question: l('Describe the login flow from FE -> BE using JWT.', 'Mô tả luồng đăng nhập từ FE -> BE dùng JWT.'),
    answer: l(
      `Typical secure flow:

1. user submits credentials over HTTPS,
2. BE validates and issues short-lived access plus refresh capability,
3. tokens are usually stored as HttpOnly Secure cookies, or access lives in memory while refresh stays in cookie,
4. FE requests user profile / session state after login,
5. on 401, FE may try refresh once, then retry,
6. logout clears server-side session/refresh state and client UI state.

Senior nuance:

- FE route guards are UX only,
- BE must enforce authorization,
- token storage and refresh rotation matter as much as the JWT format itself.`,
      `Flow an toàn thường là:

1. user gửi credentials qua HTTPS,
2. BE validate và phát access ngắn hạn cùng refresh capability,
3. token thường được lưu bằng HttpOnly Secure cookie, hoặc access ở memory còn refresh ở cookie,
4. FE gọi lấy user profile / session state sau khi login,
5. khi 401, FE có thể thử refresh một lần rồi retry,
6. logout xóa session/refresh state ở server và dọn UI state phía client.

Nuance mức senior:

- route guard ở FE chỉ là UX,
- quyền phải được BE enforce,
- cách lưu token và refresh rotation quan trọng không kém chính format JWT.`,
    ),
  }),
  q({
    id: 'error-boundary-limits',
    category: 'technical',
    tags: ['react', 'error-handling'],
    question: l('What do React Error Boundaries catch and not catch?', 'Error Boundary của React bắt được / không bắt được gì?'),
    answer: l(
      `Error boundaries catch render-time errors in descendant trees: rendering, lifecycle, constructors.

They do **not** catch:

- event handler errors,
- async callback errors by default,
- server-side rendering failures directly,
- errors thrown inside the boundary itself.

In practice, they are useful for isolating widgets so one crash does not blank the whole page. Pair them with logging and user-friendly recovery UI.`,
      `Error Boundary bắt lỗi render trong cây con: lúc render, lifecycle và constructor.

Nó **không** bắt:

- lỗi trong event handler,
- lỗi async callback theo mặc định,
- lỗi SSR trực tiếp,
- lỗi ném ra trong chính boundary đó.

Trong thực tế, nó rất hữu ích để cô lập widget để một lỗi không làm trắng cả trang. Nên đi kèm logging và UI recovery phù hợp.`,
    ),
  }),
  q({
    id: 'js-event-loop',
    category: 'technical',
    tags: ['javascript', 'event-loop', 'async'],
    question: l('Explain the JavaScript event loop.', 'Giải thích JavaScript event loop.'),
    answer: l(
      `JavaScript in the browser runs on a single main thread for most UI work, so concurrency is achieved through the **event loop**, not true parallel execution.

Key pieces:

- call stack for currently executing code,
- Web APIs / runtime for timers, network, DOM events,
- task queues,
- microtask queue for promises and mutation observers.

The loop roughly does:

1. run synchronous stack to completion,
2. drain microtasks,
3. allow rendering when possible,
4. take the next task and repeat.

Senior insight: many UI bugs come from misunderstanding when async callbacks run relative to rendering and state updates.`,
      `JavaScript trong browser chủ yếu chạy trên một main thread cho phần UI, nên concurrency đến từ **event loop**, không phải chạy song song thật.

Các mảnh chính:

- call stack cho code đang chạy,
- Web API / runtime cho timer, network, DOM event,
- task queue,
- microtask queue cho promise và mutation observer.

Vòng lặp thường là:

1. chạy hết synchronous stack,
2. drain microtask,
3. cho phép render nếu phù hợp,
4. lấy task tiếp theo và lặp lại.

Insight mức senior: rất nhiều bug UI xuất phát từ việc hiểu sai thời điểm callback async chạy so với render và state update.`,
    ),
  }),
  q({
    id: 'js-closures',
    category: 'technical',
    tags: ['javascript', 'closures'],
    question: l('What is a closure and why does it matter?', 'Closure là gì và vì sao nó quan trọng?'),
    answer: l(
      `A closure is a function retaining access to variables from the lexical scope where it was created, even after that outer function has finished.

Why it matters:

- it enables encapsulation and factory patterns,
- powers hooks, callbacks, and many library internals,
- causes bugs like stale closures when you capture old state unintentionally.

Closures are not “bad for memory” by definition. They become problematic when long-lived callbacks retain large objects or outdated references longer than necessary.`,
      `Closure là khi một function vẫn giữ quyền truy cập vào biến ở lexical scope nơi nó được tạo ra, kể cả khi function ngoài đã chạy xong.

Vì sao nó quan trọng:

- giúp tạo encapsulation và factory pattern,
- là nền cho hooks, callback và nhiều internals của library,
- cũng là nguyên nhân của bug stale closure khi vô tình chụp lại state cũ.

Closure không mặc định “xấu cho memory”. Nó chỉ thành vấn đề khi callback sống lâu giữ lại object lớn hoặc reference cũ lâu hơn cần thiết.`,
    ),
  }),
  q({
    id: 'js-this-call-bind',
    category: 'technical',
    tags: ['javascript', 'this'],
    question: l('How does `this` work in JavaScript? What about call/apply/bind?', '`this` trong JavaScript hoạt động thế nào? call/apply/bind để làm gì?'),
    answer: l(
      `\`this\` is determined by **how a function is called**, not where it is written, except for arrow functions which capture lexical \`this\`.

Common cases:

- method call: \`obj.fn()\` -> \`this === obj\`
- plain function call in strict mode -> \`undefined\`
- constructor with \`new\` -> new instance
- arrow function -> inherits surrounding \`this\`

\`call\` and \`apply\` invoke a function immediately with an explicit \`this\`; \`bind\` returns a new function with \`this\` pre-bound.

In modern FE interviews, the key is usually not trivia. It is understanding when callbacks lose context and why arrow functions behave differently.`,
      `\`this\` được quyết định bởi **cách function được gọi**, không phải nơi nó được viết, ngoại trừ arrow function sẽ lấy lexical \`this\`.

Các case hay gặp:

- gọi như method: \`obj.fn()\` -> \`this === obj\`
- gọi function thường ở strict mode -> \`undefined\`
- gọi với \`new\` -> instance mới
- arrow function -> kế thừa \`this\` từ scope xung quanh

\`call\` và \`apply\` gọi function ngay với \`this\` chỉ định; \`bind\` trả về một function mới đã được gắn sẵn \`this\`.

Trong FE interview hiện đại, điều quan trọng thường không phải trivia mà là hiểu lúc nào callback làm mất context và vì sao arrow function cư xử khác.`,
    ),
  }),
  q({
    id: 'js-prototype-chain',
    category: 'technical',
    tags: ['javascript', 'prototypes'],
    question: l('Explain the prototype chain.', 'Giải thích prototype chain.'),
    answer: l(
      `JavaScript objects can delegate property lookup to another object via their prototype.

When you access \`obj.x\`:

1. engine checks own properties on \`obj\`,
2. if missing, it walks up the prototype chain,
3. it stops at \`null\`.

Classes in JavaScript are mostly syntax sugar over prototypes. Understanding this helps when reasoning about inheritance, methods, memory sharing, and why some methods live on \`Array.prototype\` instead of every array instance.`,
      `Object trong JavaScript có thể ủy quyền việc tìm property cho object khác thông qua prototype.

Khi truy cập \`obj.x\`:

1. engine kiểm tra own properties trên \`obj\`,
2. nếu không có thì đi lên prototype chain,
3. dừng ở \`null\`.

Class trong JavaScript phần lớn là syntax sugar trên prototype. Hiểu chuyện này giúp reasoning về inheritance, chia sẻ method trong bộ nhớ, và vì sao một số method nằm trên \`Array.prototype\` thay vì nằm trên từng array instance.`,
    ),
  }),
  q({
    id: 'js-hoisting-tdz',
    category: 'technical',
    tags: ['javascript', 'hoisting'],
    question: l('What are hoisting and the temporal dead zone?', 'Hoisting và temporal dead zone là gì?'),
    answer: l(
      `Hoisting means declarations are processed before execution, but different declarations behave differently.

- function declarations are fully initialized early,
- \`var\` is hoisted and initialized to \`undefined\`,
- \`let\` / \`const\` are hoisted but uninitialized until their declaration executes.

The period between entering scope and initialization of \`let\` / \`const\` is the **temporal dead zone**. Accessing them there throws a runtime error.

Interviewers often ask this to test mental model, not memorization.`,
      `Hoisting nghĩa là declaration được xử lý trước khi code chạy, nhưng từng loại declaration có hành vi khác nhau.

- function declaration được khởi tạo đầy đủ từ sớm,
- \`var\` được hoist và gán \`undefined\`,
- \`let\` / \`const\` cũng được hoist nhưng chưa được khởi tạo cho tới khi chạy tới dòng khai báo.

Khoảng thời gian từ lúc vào scope tới lúc \`let\` / \`const\` được khởi tạo gọi là **temporal dead zone**. Truy cập vào đó sẽ ném runtime error.

Người phỏng vấn hay hỏi câu này để kiểm tra mental model, không phải để bạn đọc thuộc lòng.`,
    ),
  }),
  q({
    id: 'js-copy-immutability',
    category: 'technical',
    tags: ['javascript', 'immutability'],
    question: l('What is the difference between shallow copy, deep copy, and immutability?', 'Khác nhau giữa shallow copy, deep copy và immutability là gì?'),
    answer: l(
      `A **shallow copy** copies the top-level container but keeps nested references. A **deep copy** recursively copies nested data. **Immutability** is the discipline of treating existing data as read-only and producing new values for changes.

Important nuance:

- you do not always need a full deep clone,
- deep cloning large state trees can be expensive and unnecessary,
- structural sharing is often a better strategy.

In frontend apps, the goal is usually predictable updates, not cloning for its own sake.`,
      `**Shallow copy** sao chép container ở level đầu nhưng vẫn giữ nested reference bên trong. **Deep copy** sao chép đệ quy toàn bộ dữ liệu lồng nhau. **Immutability** là nguyên tắc coi dữ liệu hiện có là read-only và tạo ra giá trị mới khi thay đổi.

Nuance quan trọng:

- không phải lúc nào cũng cần deep clone toàn phần,
- deep clone state tree lớn có thể tốn kém và không cần thiết,
- structural sharing thường là chiến lược tốt hơn.

Trong app frontend, mục tiêu thường là update có thể dự đoán được, chứ không phải clone vì clone.`,
    ),
  }),
  q({
    id: 'js-async-await-under-hood',
    category: 'technical',
    tags: ['javascript', 'async', 'promises'],
    question: l('How do async/await work under the hood?', 'async/await hoạt động như thế nào bên dưới?'),
    answer: l(
      `\`async/await\` is syntax on top of promises.

- an \`async\` function always returns a promise,
- \`await\` pauses execution of that async function until the awaited promise settles,
- continuation is scheduled as a microtask.

This makes async code look sequential, but it is still non-blocking for the surrounding event loop.

Senior nuance:

- awaiting in loops can serialize work accidentally,
- unhandled rejections still need care,
- cancellation is not built into promises, so you often need AbortController or custom coordination.`,
      `\`async/await\` là syntax đặt trên promise.

- một \`async\` function luôn trả về promise,
- \`await\` tạm dừng phần còn lại của async function đó cho tới khi promise settle,
- phần tiếp theo được lên lịch như một microtask.

Nó làm code async trông tuần tự hơn, nhưng không block event loop xung quanh.

Nuance mức senior:

- \`await\` trong loop có thể vô tình serialize công việc,
- unhandled rejection vẫn phải xử lý cẩn thận,
- promise không có cancel built-in, nên thường cần AbortController hoặc coordination khác.`,
    ),
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
      `Generics let you write reusable logic while preserving type relationships.

Instead of saying “this function takes anything,” you say “this function works for many types, but the input and output are related.”

That is powerful for:

- API helpers,
- reusable components,
- data transformation utilities,
- hooks/composables that should infer caller types.

The goal is not maximum cleverness. Good generics keep types expressive without making the callsite unreadable.`,
      `Generics cho phép viết logic dùng lại nhưng vẫn giữ được quan hệ type.

Thay vì nói “function này nhận bất cứ thứ gì”, bạn nói “function này làm việc với nhiều type khác nhau, nhưng input và output có quan hệ với nhau”.

Nó rất hữu ích cho:

- API helper,
- component tái sử dụng,
- utility transform data,
- hook/composable cần infer type từ phía caller.

Mục tiêu không phải làm type càng thông minh càng tốt. Generic tốt là generic diễn đạt được ý mà callsite vẫn dễ đọc.`,
    ),
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
      `- **any** turns off type safety for that value.
- **unknown** says “I truly do not know yet,” so callers must narrow before using it.
- **never** represents an impossible value or code path that should not happen.

In mature codebases, prefer \`unknown\` at boundaries over \`any\`, and use \`never\` to make exhaustive checks explicit.`,
      `- **any** tắt type safety cho giá trị đó.
- **unknown** nghĩa là “tôi thực sự chưa biết”, nên caller phải narrow trước khi dùng.
- **never** biểu diễn giá trị hoặc code path không thể xảy ra.

Trong codebase trưởng thành, nên ưu tiên \`unknown\` ở boundary thay vì \`any\`, và dùng \`never\` để làm exhaustive check rõ ràng.`,
    ),
  }),
  q({
    id: 'ts-designing-api-props',
    category: 'technical',
    tags: ['typescript', 'design'],
    question: l('How do you design good TypeScript types for APIs or component props?', 'Bạn thiết kế type TypeScript tốt cho API hoặc component props thế nào?'),
    answer: l(
      `I optimize for three things:

1. correctness at boundaries,
2. readability at the callsite,
3. flexibility without ambiguity.

Practical rules:

- model domain concepts, not just raw JSON,
- use discriminated unions for mutually exclusive states,
- avoid giant “do everything” prop types,
- encode invariants where the compiler can help,
- validate untrusted data at runtime because TypeScript alone is compile-time only.

Good types should guide usage, not require a decoder ring.`,
      `Em tối ưu cho ba thứ:

1. correctness ở boundary,
2. readability ở callsite,
3. flexibility nhưng không mơ hồ.

Rule thực tế:

- model domain concept, không chỉ model raw JSON,
- dùng discriminated union cho các state loại trừ nhau,
- tránh prop type khổng lồ “làm mọi thứ”,
- encode invariant ở nơi compiler giúp được,
- validate dữ liệu không tin cậy ở runtime vì TypeScript chỉ là compile-time.

Type tốt phải hướng dẫn được cách dùng, chứ không phải bắt người đọc giải mật mã.`,
    ),
  }),
  q({
    id: 'vue-reactivity-internals',
    category: 'technical',
    tags: ['vue', 'reactivity'],
    question: l('How does Vue 3 reactivity work internally?', 'Vue 3 reactivity hoạt động bên dưới như thế nào?'),
    answer: l(
      `At a high level, Vue 3 uses **Proxies** for reactive objects and dependency tracking based on **track** and **trigger**.

When reactive state is read during an effect or computed, Vue tracks that dependency. When the property changes, Vue triggers only the effects that depend on it.

That is why Vue can update at a more fine-grained level than React's default component re-render model.

The important interview takeaway is not every internal detail. It is understanding why Vue can react to property access and why destructuring reactive state carelessly can break that connection.`,
      `Ở mức cao, Vue 3 dùng **Proxy** cho reactive object và dependency tracking dựa trên **track** và **trigger**.

Khi reactive state được đọc trong effect hoặc computed, Vue sẽ track dependency đó. Khi property thay đổi, Vue chỉ trigger các effect phụ thuộc vào property đó.

Đó là lý do Vue có thể update mịn hơn so với model re-render component mặc định của React.

Điểm cần nắm khi phỏng vấn không phải mọi internal detail. Mà là hiểu vì sao Vue có thể phản ứng theo property access và vì sao destructure reactive state bất cẩn có thể làm mất liên kết đó.`,
    ),
  }),
  q({
    id: 'vue-ref-vs-reactive',
    category: 'technical',
    tags: ['vue', 'reactivity'],
    question: l('When do you use ref vs reactive?', 'Khi nào dùng ref và khi nào dùng reactive?'),
    answer: l(
      `Use **ref** for single values and when you want explicit assignment semantics. Use **reactive** for object-like grouped state.

In practice:

- \`ref\` is often simpler and safer as a default,
- \`reactive\` is convenient for cohesive objects,
- avoid destructuring reactive objects carelessly,
- use \`toRefs\` or \`storeToRefs\` when exposing reactive object fields individually.

Many teams default to \`ref\` more often because it is easier to reason about in composables and typing.`,
      `Dùng **ref** cho giá trị đơn lẻ và khi muốn semantics gán giá trị rõ ràng. Dùng **reactive** cho state dạng object có tính kết dính.

Trong thực tế:

- \`ref\` thường đơn giản và an toàn hơn làm mặc định,
- \`reactive\` tiện cho object state gắn kết,
- tránh destructure reactive object bừa bãi,
- dùng \`toRefs\` hoặc \`storeToRefs\` khi cần expose từng field riêng.

Nhiều team dùng \`ref\` thường xuyên hơn vì nó dễ reasoning hơn trong composable và typing.`,
    ),
  }),
  q({
    id: 'vue-computed-watch-watcheffect',
    category: 'technical',
    tags: ['vue', 'composition-api'],
    question: l('When should you use computed, watch, and watchEffect?', 'Khi nào dùng computed, watch và watchEffect?'),
    answer: l(
      `- **computed** for derived state with caching,
- **watch** when you need to react to a specific source and compare transitions,
- **watchEffect** when dependencies can be discovered automatically from synchronous reads.

Good rule:

- derive values with \`computed\`,
- synchronize side effects with \`watch\` / \`watchEffect\`,
- avoid using watchers when simple declarative derivation would work.

Overusing watchers often makes state flow harder to reason about.`,
      `- **computed** dùng cho derived state có cache,
- **watch** khi cần phản ứng với source cụ thể và quan sát sự chuyển trạng thái,
- **watchEffect** khi dependency có thể tự được thu thập từ các lần đọc đồng bộ.

Rule hữu ích:

- tính giá trị bằng \`computed\`,
- đồng bộ side effect bằng \`watch\` / \`watchEffect\`,
- tránh dùng watcher nếu chỉ cần derive declarative là đủ.

Dùng watcher quá nhiều thường làm state flow khó reasoning hơn.`,
    ),
  }),
  q({
    id: 'vue-composition-api-benefits',
    category: 'technical',
    tags: ['vue', 'composition-api'],
    question: l('Why is the Composition API useful?', 'Composition API hữu ích ở điểm nào?'),
    answer: l(
      `The main win is organizing code by **logic concern** instead of option buckets like data/methods/computed scattered across a large file.

Benefits:

- better reuse through composables,
- easier extraction of complex logic,
- clearer ownership of related state/effects,
- better TypeScript ergonomics compared with large Options API components.

Composition API is especially valuable when components become more like orchestration layers than simple templates.`,
      `Lợi ích chính là tổ chức code theo **mối quan tâm logic** thay vì bị tách thành data/methods/computed rải rác như trong file lớn của Options API.

Lợi ích:

- tái sử dụng tốt hơn qua composable,
- dễ tách logic phức tạp,
- ownership rõ hơn giữa state/effect liên quan,
- TypeScript ergonomics tốt hơn với component lớn.

Composition API đặc biệt hữu ích khi component dần giống orchestration layer hơn là một template đơn giản.`,
    ),
  }),
  q({
    id: 'vue-composables',
    category: 'technical',
    tags: ['vue', 'composables', 'architecture'],
    question: l('What makes a good composable in Vue?', 'Composable tốt trong Vue cần những gì?'),
    answer: l(
      `A good composable has a clear responsibility and a predictable API.

I look for:

- one main concern,
- explicit inputs and outputs,
- minimal hidden side effects,
- cleanup when attaching listeners or async work,
- testability without mounting a full app when possible.

Bad composables often become mini-frameworks that fetch, mutate, navigate, and toast all at once.`,
      `Composable tốt có responsibility rõ và API dễ đoán.

Em thường nhìn:

- một concern chính,
- input và output rõ ràng,
- ít hidden side effect,
- có cleanup nếu gắn listener hoặc async work,
- test được mà không cần mount nguyên app nếu có thể.

Composable tệ thường biến thành mini-framework: vừa fetch, vừa mutate, vừa navigate, vừa toast mọi thứ cùng lúc.`,
    ),
  }),
  q({
    id: 'pinia-design',
    category: 'technical',
    tags: ['vue', 'pinia', 'state-management'],
    question: l('How would you decide what belongs in Pinia?', 'Bạn quyết định cái gì nên nằm trong Pinia như thế nào?'),
    answer: l(
      `Not all state belongs in a global store.

I usually ask:

- is this state shared across distant parts of the app?
- does it need to outlive a single page/component?
- is URL a better source of truth?
- is it actually server state and better handled by data-fetching cache?

Pinia is great for cross-cutting client state, auth/session UI state, feature flags, or workflow state. It is a bad dumping ground for every form field or every API response.`,
      `Không phải state nào cũng nên vào global store.

Em thường hỏi:

- state này có được chia sẻ ở nhiều chỗ xa nhau không?
- nó có cần sống lâu hơn một page/component không?
- URL có phải source of truth tốt hơn không?
- hay đây thực ra là server state và nên để data-fetching cache quản lý?

Pinia rất hợp cho cross-cutting client state, auth/session UI state, feature flag hoặc workflow state. Nó là dumping ground rất tệ nếu nhét mọi form field hoặc mọi API response vào đó.`,
    ),
  }),
  q({
    id: 'vue-ssr-hydration',
    category: 'technical',
    tags: ['vue', 'nuxt', 'ssr', 'hydration'],
    question: l('What are SSR and hydration, and what commonly goes wrong?', 'SSR và hydration là gì, lỗi hay gặp là gì?'),
    answer: l(
      `SSR renders HTML on the server for the first response. Hydration is the client attaching interactivity to that HTML and reconciling it with client-side state.

Common problems:

- non-deterministic output such as \`Date.now()\`, random values, locale mismatch,
- reading browser-only APIs during SSR,
- client-only conditions changing the rendered tree,
- async data arriving differently between server and client.

The safest mental model is: the first client render must logically match the server output.`,
      `SSR là render HTML ở server cho response đầu tiên. Hydration là lúc client gắn interactivity vào HTML đó và đối chiếu nó với state phía client.

Lỗi hay gặp:

- output không deterministic như \`Date.now()\`, random, locale lệch,
- đọc browser-only API khi đang SSR,
- điều kiện chỉ có ở client làm đổi cây render,
- async data tới khác nhau giữa server và client.

Mental model an toàn nhất là: lần render đầu ở client phải logic tương đương với output từ server.`,
    ),
  }),
  q({
    id: 'nuxt-rendering-modes',
    category: 'technical',
    tags: ['nuxt', 'ssr', 'rendering'],
    question: l('What rendering modes does Nuxt 3 support and how would you choose?', 'Nuxt 3 hỗ trợ các rendering mode nào và bạn chọn ra sao?'),
    answer: l(
      `Nuxt 3 can support SSR, SSG/prerender, client-heavy SPA behavior, and hybrid strategies with route rules.

How to choose:

- **SSR** when first-load UX, SEO, or authenticated personalization benefit from server rendering,
- **SSG/prerender** for mostly static marketing or docs content,
- **CSR-heavy** for internal tools where SEO is irrelevant and interactivity dominates,
- **hybrid** when different routes need different caching or rendering behavior.

Good answers tie rendering mode to product constraints, not framework preference.`,
      `Nuxt 3 có thể hỗ trợ SSR, SSG/prerender, hành vi thiên về SPA phía client, và hybrid strategy qua route rules.

Cách chọn:

- **SSR** khi first-load UX, SEO hoặc personalization được lợi từ server rendering,
- **SSG/prerender** cho marketing/docs ít thay đổi,
- **CSR-heavy** cho internal tool khi SEO không quan trọng và interactivity chiếm ưu thế,
- **hybrid** khi từng route cần caching hoặc rendering behavior khác nhau.

Câu trả lời tốt là gắn rendering mode với constraint của product, không phải với sở thích framework.`,
    ),
  }),
  q({
    id: 'nuxt-nitro',
    category: 'technical',
    tags: ['nuxt', 'nitro', 'server'],
    question: l('What is Nitro in Nuxt 3?', 'Nitro trong Nuxt 3 là gì?'),
    answer: l(
      `Nitro is Nuxt's server engine. It powers server routes, server rendering, deployment adapters, storage integrations, and hybrid execution across different platforms.

Why it matters:

- FE engineers can colocate backend-for-frontend logic,
- deployment targets can change with less app rewrite,
- route rules and caching become first-class concerns.

For interviews, a useful senior angle is that Nitro lets a frontend team own more of the delivery surface, but it also means they need stronger discipline around server boundaries and caching.`,
      `Nitro là server engine của Nuxt. Nó chạy server route, server rendering, deployment adapter, storage integration và hybrid execution trên nhiều platform.

Vì sao nó quan trọng:

- FE engineer có thể colocate backend-for-frontend logic,
- target deploy có thể đổi với ít rewrite hơn,
- route rule và caching trở thành concern hạng nhất.

Trong phỏng vấn, góc nhìn senior hữu ích là Nitro giúp frontend team ownership nhiều bề mặt hơn, nhưng cũng đòi hỏi kỷ luật tốt hơn ở server boundary và caching.`,
    ),
  }),
  q({
    id: 'nuxt-data-fetching',
    category: 'technical',
    tags: ['nuxt', 'data-fetching'],
    question: l('How do useFetch and useAsyncData fit into Nuxt 3 data fetching?', 'useFetch và useAsyncData nằm ở đâu trong data fetching của Nuxt 3?'),
    answer: l(
      `They help coordinate data fetching with Nuxt's SSR and payload system.

High-level view:

- \`useAsyncData\` is the more general primitive,
- \`useFetch\` is convenient for HTTP-style fetching built on top of that mental model.

Important concerns:

- key stability for caching/deduplication,
- avoiding duplicate fetches,
- handling server/client differences intentionally,
- understanding when data should block initial render vs load later.

The senior point is not memorizing every option. It is reasoning about fetch timing, cache behavior, and UX.`,
      `Chúng giúp phối hợp data fetching với SSR và payload system của Nuxt.

Nhìn ở mức cao:

- \`useAsyncData\` là primitive tổng quát hơn,
- \`useFetch\` tiện cho các case fetch HTTP dựa trên cùng mental model đó.

Concern quan trọng:

- key ổn định để cache/dedupe,
- tránh fetch trùng,
- xử lý khác biệt server/client có chủ đích,
- hiểu dữ liệu nào nên chặn initial render và dữ liệu nào có thể load sau.

Điểm senior không phải nhớ mọi option, mà là reasoning về fetch timing, cache behavior và UX.`,
    ),
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
      `Vue tracks fine-grained dependencies and can update based on reactive reads. React usually re-runs the entire component function when state or props change, then reconciles the resulting tree.

That leads to different instincts:

- in Vue, think about dependency tracking and reactive access,
- in React, think about render frequency, identity stability, and component boundaries.

As a Vue engineer learning React, this is one of the most important mental shifts: React embraces re-execution; optimization is about managing when that matters.`,
      `Vue track dependency rất mịn và có thể update theo các lần đọc reactive. React thường chạy lại toàn bộ function component khi state hoặc props đổi, rồi reconcile cây kết quả.

Điều đó tạo ra thói quen khác nhau:

- ở Vue, nghĩ nhiều về dependency tracking và reactive access,
- ở React, nghĩ nhiều về tần suất re-render, sự ổn định của identity và boundary component.

Với người đi từ Vue sang React, đây là một trong những mental shift quan trọng nhất: React chấp nhận việc re-execution; tối ưu là quản lý lúc nào chuyện đó thực sự thành vấn đề.`,
    ),
  }),
  q({
    id: 'react-hooks-rules',
    category: 'technical',
    tags: ['react', 'hooks'],
    question: l('Why do hooks need rules like “call at the top level”?', 'Vì sao hook có rule kiểu “gọi ở top level”?'),
    answer: l(
      `React relies on hook call order to match hook state across renders. If you call hooks conditionally or inside loops, the order can shift and React will associate state with the wrong hook slot.

That is why hooks must be called:

- at the top level of a component or custom hook,
- in the same order on every render.

This is less about style and more about how the runtime tracks hook state internally.`,
      `React dựa vào thứ tự gọi hook để gắn state của hook giữa các lần render. Nếu gọi hook có điều kiện hoặc trong loop, thứ tự có thể thay đổi và React sẽ gắn nhầm state vào “slot” khác.

Vì vậy hook phải được gọi:

- ở top level của component hoặc custom hook,
- cùng thứ tự ở mọi lần render.

Đây không phải rule về style, mà là hệ quả trực tiếp của cách runtime theo dõi state của hook.`,
    ),
  }),
  q({
    id: 'react-controlled-vs-uncontrolled',
    category: 'technical',
    tags: ['react', 'forms'],
    question: l('Controlled vs uncontrolled components: when would you choose each?', 'Controlled và uncontrolled component: khi nào chọn mỗi loại?'),
    answer: l(
      `A controlled input keeps its value in React state. An uncontrolled input lets the DOM keep the live value and reads it when needed via refs or form submission.

Choose controlled when:

- validation, conditional UI, or derived logic depends on current value,
- you need full state synchronization.

Choose uncontrolled when:

- the form is simple,
- performance matters for many fields,
- you do not need every keystroke in React state.

The senior answer is usually pragmatic, not ideological.`,
      `Input controlled là input giữ value trong React state. Input uncontrolled là để DOM giữ value thực và chỉ đọc ra khi cần qua ref hoặc form submission.

Chọn controlled khi:

- validation, conditional UI hoặc derived logic phụ thuộc vào value hiện tại,
- bạn cần state đồng bộ hoàn toàn.

Chọn uncontrolled khi:

- form đơn giản,
- performance quan trọng với nhiều field,
- bạn không cần từng keystroke nằm trong React state.

Câu trả lời senior thường là thực dụng, không giáo điều.`,
    ),
  }),
  q({
    id: 'react-context-limits',
    category: 'technical',
    tags: ['react', 'context', 'state-management'],
    question: l('What is React Context good for, and where does it break down?', 'React Context hợp với gì, và giới hạn ở đâu?'),
    answer: l(
      `Context is good for dependency injection-like data that many descendants need: theme, locale, auth session metadata, feature flags.

It breaks down when used as a high-frequency global state store because context updates can cause broad re-render propagation and make data flow harder to track.

For heavier state needs, pair context with reducers carefully or reach for dedicated state/server-state solutions.`,
      `Context hợp cho kiểu dependency injection data mà nhiều descendant cần: theme, locale, auth session metadata, feature flag.

Nó yếu đi khi bị dùng như global state store tần suất cao vì update từ context có thể kéo theo re-render rộng và làm data flow khó theo dõi hơn.

Khi state nặng hơn, hãy dùng context với reducer thật cẩn thận hoặc chuyển sang state/server-state solution chuyên biệt.`,
    ),
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
      `The main vitals to discuss are:

- **LCP**: how quickly the main content becomes visible,
- **INP**: how responsive the page feels to interactions,
- **CLS**: how stable the layout is visually.

Improvement examples:

- LCP: reduce TTFB, optimize hero images, preload critical assets, reduce JS on the critical path,
- INP: reduce main-thread blocking, split heavy work, debounce correctly, avoid huge synchronous renders,
- CLS: reserve space for images/ads, avoid late layout shifts, stabilize fonts and async UI.

Senior answers connect metrics to actual user experience, not just Lighthouse scores.`,
      `Các chỉ số chính nên nói là:

- **LCP**: nội dung chính hiện ra nhanh tới mức nào,
- **INP**: trang phản hồi thao tác có nhanh không,
- **CLS**: layout có bị nhảy lung tung không.

Ví dụ cách tối ưu:

- LCP: giảm TTFB, tối ưu ảnh hero, preload critical asset, giảm JS trên critical path,
- INP: giảm main-thread blocking, tách heavy work, debounce đúng chỗ, tránh render đồng bộ quá lớn,
- CLS: chừa sẵn chỗ cho ảnh/ads, tránh layout shift đến muộn, ổn định font và UI async.

Câu trả lời senior luôn nối metric với trải nghiệm người dùng thật, không chỉ nói điểm Lighthouse.`,
    ),
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
      `My default checklist:

- every input has an accessible label,
- errors are associated with fields and announced appropriately,
- keyboard navigation works end to end,
- focus styles are visible,
- semantics use real buttons/inputs instead of divs pretending to be controls,
- color is not the only signal,
- disabled/loading states are communicated clearly.

Senior FE work treats accessibility as interaction design quality, not only compliance.`,
      `Checklist mặc định của em:

- mọi input có accessible label,
- lỗi được gắn với field và được announce phù hợp,
- keyboard navigation chạy trọn flow,
- focus style nhìn thấy được,
- semantic dùng button/input thật thay vì div giả làm control,
- màu không phải tín hiệu duy nhất,
- disabled/loading state được truyền đạt rõ.

Làm FE kiểu senior xem accessibility là chất lượng của interaction design, không chỉ là compliance.`,
    ),
  }),
  q({
    id: 'security-xss-csrf-csp',
    category: 'technical',
    tags: ['security', 'xss', 'csrf', 'csp'],
    question: l('How do you explain XSS, CSRF, and CSP in frontend terms?', 'Bạn giải thích XSS, CSRF và CSP theo góc nhìn frontend thế nào?'),
    answer: l(
      `- **XSS** means attacker-controlled script runs on your origin.
- **CSRF** means another site tricks the browser into sending authenticated requests to your site.
- **CSP** is a browser policy that restricts where scripts and other resources may come from, reducing XSS blast radius.

Frontend responsibility:

- avoid unsafe HTML injection,
- sanitize when rendering untrusted rich content,
- store tokens safely,
- use anti-CSRF patterns when cookie auth is involved,
- keep CSP practical and strong where possible.`,
      `- **XSS** là khi script do attacker kiểm soát chạy được trên origin của bạn.
- **CSRF** là khi site khác lừa browser gửi request đã được xác thực tới site của bạn.
- **CSP** là policy của browser giới hạn script và resource được phép tới từ đâu, giúp giảm blast radius của XSS.

Trách nhiệm phía frontend:

- tránh chèn HTML không an toàn,
- sanitize khi render rich content không tin cậy,
- lưu token an toàn,
- dùng anti-CSRF pattern khi auth bằng cookie,
- giữ CSP đủ mạnh nhưng vẫn thực tế.`,
    ),
  }),
  q({
    id: 'auth-token-storage',
    category: 'technical',
    tags: ['security', 'auth'],
    question: l('Where should auth tokens live on the frontend?', 'Auth token nên được lưu ở đâu phía frontend?'),
    answer: l(
      `There is no one-size-fits-all answer, but for web apps I usually prefer:

- refresh/session in **HttpOnly Secure SameSite cookies**,
- access token either also cookie-based or in short-lived memory depending on architecture.

Why not blindly use LocalStorage?

- anything readable by JS is exposed to XSS,
- long-lived bearer tokens raise blast radius.

You then pair cookie auth with CSRF defenses and good session invalidation strategy.`,
      `Không có một đáp án đúng cho mọi kiến trúc, nhưng với web app em thường ưu tiên:

- refresh/session trong **HttpOnly Secure SameSite cookie**,
- access token hoặc cũng đi theo cookie, hoặc sống ngắn trong memory tùy kiến trúc.

Vì sao không nên nhắm mắt dùng LocalStorage?

- thứ gì JS đọc được thì XSS cũng có thể đọc,
- bearer token sống lâu làm blast radius lớn hơn.

Sau đó phải kết hợp cookie auth với chống CSRF và chiến lược invalid session hợp lý.`,
    ),
  }),
  q({
    id: 'testing-pyramid',
    category: 'technical',
    tags: ['testing', 'quality'],
    question: l('What is a good frontend testing strategy?', 'Chiến lược testing frontend tốt là gì?'),
    answer: l(
      `I prefer a risk-based mix rather than dogmatic percentages.

Typical layers:

- unit tests for pure logic and small utilities,
- component/integration tests for user behavior and state interactions,
- a small number of E2E tests for critical journeys.

What matters most:

- test behavior, not implementation details,
- put tests where regressions are expensive,
- keep feedback loops fast enough that people actually run them.

A senior testing strategy is about confidence per cost.`,
      `Em thích một chiến lược dựa trên risk hơn là bám chặt tỷ lệ cố định.

Các tầng thường là:

- unit test cho pure logic và utility nhỏ,
- component/integration test cho user behavior và tương tác giữa state,
- một số ít E2E cho critical journey.

Điều quan trọng nhất:

- test behavior, không phải implementation detail,
- đặt test vào chỗ regressions đắt tiền,
- giữ feedback loop đủ nhanh để mọi người thực sự chạy test.

Chiến lược test kiểu senior là tối ưu độ tin cậy theo chi phí.`,
    ),
  }),
  q({
    id: 'live-coding-debounce',
    category: 'technical',
    tags: ['coding', 'javascript', 'debounce'],
    question: l('Implement debounce and explain trade-offs.', 'Hãy implement debounce và giải thích trade-off.'),
    answer: l(
      `Debounce delays execution until calls stop for a given wait period. It is useful for search input or resize handlers where only the final burst matters.

Trade-offs:

- improves efficiency,
- adds intentional delay,
- you may want leading/trailing behavior or cancellation depending on UX.

In interviews, also mention that stale async work still needs cancellation if the debounced function performs requests.`,
      `Debounce trì hoãn việc chạy hàm cho tới khi chuỗi gọi dừng lại trong một khoảng thời gian. Nó hợp với search input hoặc resize handler khi chỉ kết quả cuối cùng của một đợt thao tác mới quan trọng.

Trade-off:

- tăng hiệu quả,
- thêm độ trễ có chủ đích,
- có thể cần leading/trailing behavior hoặc cancel tùy UX.

Khi phỏng vấn, cũng nên nói thêm: nếu hàm debounce đi gọi request thì phần async cũ vẫn có thể cần cancel riêng.`,
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
  }),
  q({
    id: 'live-coding-throttle',
    category: 'technical',
    tags: ['coding', 'javascript', 'throttle'],
    question: l('Implement throttle and explain when it is better than debounce.', 'Hãy implement throttle và giải thích khi nào nó tốt hơn debounce.'),
    answer: l(
      `Throttle limits a function to run at most once per interval. It is useful when you want regular updates during continuous activity, such as scroll or drag.

Compared with debounce:

- debounce waits for quiet,
- throttle preserves periodic responsiveness.

The exact leading/trailing semantics matter in real UX.`,
      `Throttle giới hạn một hàm chỉ chạy tối đa một lần trong mỗi khoảng thời gian. Nó hợp khi bạn vẫn muốn cập nhật đều trong lúc người dùng đang thao tác liên tục, ví dụ scroll hoặc drag.

So với debounce:

- debounce chờ yên rồi mới chạy,
- throttle giữ được phản hồi định kỳ.

Leading/trailing semantics cụ thể khá quan trọng trong UX thực tế.`,
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
  }),
  q({
    id: 'live-coding-promise-all',
    category: 'technical',
    tags: ['coding', 'javascript', 'promises'],
    question: l('How would you polyfill Promise.all?', 'Bạn sẽ polyfill Promise.all như thế nào?'),
    answer: l(
      `Core behavior:

- preserve result order,
- resolve when all inputs resolve,
- reject immediately on the first rejection,
- accept non-promise values by wrapping with \`Promise.resolve\`.

In an interview, explain behavior first, then code.`,
      `Hành vi cốt lõi:

- giữ đúng thứ tự kết quả,
- resolve khi tất cả input đều resolve,
- reject ngay khi có lỗi đầu tiên,
- chấp nhận cả giá trị không phải promise bằng cách bọc \`Promise.resolve\`.

Khi phỏng vấn, nên giải thích hành vi trước rồi mới code.`,
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
  }),
  q({
    id: 'live-coding-deep-clone',
    category: 'technical',
    tags: ['coding', 'javascript', 'deep-clone'],
    question: l('How would you approach deep clone in JavaScript?', 'Bạn tiếp cận bài deep clone trong JavaScript thế nào?'),
    answer: l(
      `First, clarify scope. “Deep clone” can mean many things: plain objects and arrays only, or Dates, Maps, Sets, cycles, class instances, functions?

Senior answer:

1. narrow the supported shapes,
2. mention that \`structuredClone\` is preferred when available,
3. explain trade-offs and edge cases before writing custom recursion.

Interviewers often care more about how you define correctness than whether you memorize every edge case.`,
      `Trước tiên cần chốt scope. “Deep clone” có thể nghĩa là chỉ object/array thuần, hoặc còn cả Date, Map, Set, cycle, class instance, function?

Câu trả lời kiểu senior:

1. thu hẹp rõ những shape sẽ hỗ trợ,
2. nhắc rằng \`structuredClone\` là lựa chọn ưu tiên khi có thể dùng,
3. giải thích trade-off và edge case trước khi viết recursion thủ công.

Nhiều interviewer quan tâm cách bạn định nghĩa correctness hơn là việc bạn thuộc hết mọi edge case.`,
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
  }),
  q({
    id: 'live-coding-event-emitter',
    category: 'technical',
    tags: ['coding', 'javascript', 'event-emitter'],
    question: l('Implement a simple EventEmitter.', 'Hãy implement một EventEmitter đơn giản.'),
    answer: l(
      `The key operations are:

- subscribe,
- unsubscribe,
- emit.

Good interview additions:

- return an unsubscribe function,
- avoid breaking iteration if listeners mutate subscriptions,
- mention \`once\` as a possible extension.`,
      `Ba thao tác chính là:

- subscribe,
- unsubscribe,
- emit.

Điểm cộng trong phỏng vấn:

- trả về hàm unsubscribe,
- tránh làm hỏng vòng lặp nếu listener tự thay đổi subscription,
- nhắc tới \`once\` như một extension hợp lý.`,
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
  }),
]
