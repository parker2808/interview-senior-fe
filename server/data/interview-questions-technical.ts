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
      `**Short answer:** JavaScript achieves concurrency in the browser through the **event loop**: synchronous code runs on the call stack, async work is queued, and callbacks are scheduled back onto the main thread later.

**Why:**

The main pieces are:

- the **call stack** for running code,
- browser/runtime APIs for timers, network, and DOM events,
- the **task queue**,
- the **microtask queue** for promises and mutation observers.

The rough order is:

1. run synchronous code to completion,
2. drain microtasks,
3. allow rendering,
4. pull the next task and repeat.

**Trade-offs / common mistakes:**

- assuming \`setTimeout(..., 0)\` runs immediately,
- forgetting that promises run before the next task,
- creating long synchronous work that blocks input and paint.

Many UI bugs come from misunderstanding callback timing relative to rendering and state updates.`,
      `**Trả lời ngắn:** JavaScript đạt được concurrency trong browser nhờ **event loop**: code đồng bộ chạy trên call stack, công việc async được đưa vào queue, rồi callback được đưa trở lại main thread ở thời điểm phù hợp.

**Vì sao:**

Các mảnh chính là:

- **call stack** cho code đang chạy,
- browser/runtime API cho timer, network và DOM event,
- **task queue**,
- **microtask queue** cho promise và mutation observer.

Thứ tự gần đúng là:

1. chạy hết code đồng bộ,
2. drain microtask,
3. cho phép render,
4. lấy task tiếp theo và lặp lại.

**Trade-off / lỗi hay gặp:**

- tưởng \`setTimeout(..., 0)\` chạy ngay,
- quên rằng promise chạy trước task tiếp theo,
- tạo synchronous work quá dài làm block input và paint.

Nhiều bug UI sinh ra từ việc hiểu sai timing của callback so với render và state update.`,
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
      `**Short answer:** Prefer **const** by default, use **let** when reassignment is required, and avoid **var** in modern code.

**Why:**

- \`var\` is function-scoped and hoisted to \`undefined\`,
- \`let\` and \`const\` are block-scoped,
- \`const\` prevents reassignment of the binding, though nested object contents can still mutate.

**Trade-offs / gotchas:**

- \`const\` does **not** make an object deeply immutable,
- \`var\` can create confusing bugs because of hoisting and lack of block scope.

Modern style: use \`const\` unless the binding truly changes.`,
      `**Trả lời ngắn:** Hãy ưu tiên **const** mặc định, dùng **let** khi thật sự cần gán lại, và tránh **var** trong code hiện đại.

**Vì sao:**

- \`var\` có function scope và được hoist lên \`undefined\`,
- \`let\` và \`const\` có block scope,
- \`const\` chỉ chặn việc gán lại binding, còn object lồng bên trong vẫn có thể mutate.

**Trade-off / gotcha:**

- \`const\` **không** làm object deep immutable,
- \`var\` dễ tạo bug khó nhìn vì hoisting và thiếu block scope.

Style hiện đại là: dùng \`const\` trừ khi binding đó thật sự phải thay đổi.`,
    ),
  }),
  q({
    id: 'js-loose-vs-strict-equality',
    category: 'technical',
    tags: ['javascript', 'basics'],
    question: l('What is the difference between == and ===?', 'Khác nhau giữa == và === là gì?'),
    answer: l(
      `**Short answer:** \`===\` compares without type coercion; \`==\` allows coercion and can produce surprising results.

Examples:

- \`1 === '1'\` is false
- \`1 == '1'\` is true
- \`null == undefined\` is true

Because coercion rules are non-trivial, most production code should prefer \`===\` and \`!==\` unless you intentionally want loose equality semantics.`,
      `**Trả lời ngắn:** \`===\` so sánh không ép kiểu; \`==\` cho phép coercion nên dễ tạo kết quả bất ngờ.

Ví dụ:

- \`1 === '1'\` là false
- \`1 == '1'\` là true
- \`null == undefined\` là true

Vì rule coercion khá rối, phần lớn production code nên ưu tiên \`===\` và \`!==\` trừ khi bạn cố ý muốn loose equality.`,
    ),
  }),
  q({
    id: 'js-data-types-typeof',
    category: 'technical',
    tags: ['javascript', 'basics'],
    question: l('What basic JavaScript data type and typeof quirks should you know?', 'Những data type và typeof quirk cơ bản nào của JavaScript cần nhớ?'),
    answer: l(
      `Know the primitives: string, number, bigint, boolean, undefined, symbol, null, plus objects/functions.

Common quirks:

- \`typeof null === 'object'\` (legacy bug),
- arrays are objects, so use \`Array.isArray\`,
- functions return \`'function'\`,
- \`NaN\` has type number.

Interviewers ask this to check whether you know the language's sharp edges, not just the happy path.`,
      `Hãy nhớ các primitive: string, number, bigint, boolean, undefined, symbol, null, cùng với object/function.

Quirk hay gặp:

- \`typeof null === 'object'\` (bug lịch sử),
- array cũng là object nên dùng \`Array.isArray\`,
- function trả về \`'function'\`,
- \`NaN\` có type là number.

Người phỏng vấn hỏi câu này để xem bạn có biết góc sắc của ngôn ngữ chứ không chỉ biết happy path.`,
    ),
  }),
  q({
    id: 'js-scope',
    category: 'technical',
    tags: ['javascript', 'basics'],
    question: l('What is scope in JavaScript?', 'Scope trong JavaScript là gì?'),
    answer: l(
      `Scope determines where a variable can be accessed.

Useful categories:

- global scope,
- function scope,
- block scope,
- lexical scope.

Closures rely on lexical scope, and many bugs around \`var\` vs \`let\` come from misunderstanding scope boundaries.`,
      `Scope quyết định nơi nào một biến có thể được truy cập.

Các loại hữu ích cần nhớ:

- global scope,
- function scope,
- block scope,
- lexical scope.

Closure dựa trực tiếp vào lexical scope, và rất nhiều bug quanh \`var\` vs \`let\` đến từ việc hiểu sai boundary của scope.`,
    ),
  }),
  q({
    id: 'dom-event-propagation-delegation',
    category: 'technical',
    tags: ['dom', 'events', 'basics'],
    question: l('Explain event bubbling, capturing, delegation, preventDefault, and stopPropagation.', 'Giải thích event bubbling, capturing, delegation, preventDefault và stopPropagation.'),
    answer: l(
      `Events travel through the DOM in phases:

1. **capturing**: top -> target
2. **target**
3. **bubbling**: target -> top

Useful ideas:

- **event delegation**: attach one listener on a parent and handle child interactions via event target matching
- **preventDefault**: stop the browser's default behavior
- **stopPropagation**: stop the event from continuing through the tree

Delegation is great for dynamic lists, but stopping propagation carelessly can create hard-to-debug behavior.`,
      `Event đi qua DOM theo các phase:

1. **capturing**: từ trên xuống target
2. **target**
3. **bubbling**: từ target đi ngược lên trên

Những ý quan trọng:

- **event delegation**: gắn một listener ở parent rồi xử lý tương tác của child bằng cách kiểm tra event target
- **preventDefault**: chặn hành vi mặc định của browser
- **stopPropagation**: chặn event lan tiếp trong cây

Delegation rất hợp cho list động, nhưng stopPropagation dùng bừa bãi sẽ tạo behavior khó debug.`,
    ),
  }),
  q({
    id: 'promise-basics',
    category: 'technical',
    tags: ['javascript', 'promises', 'basics'],
    question: l('What is a Promise and what problem does it solve?', 'Promise là gì và nó giải quyết bài toán nào?'),
    answer: l(
      `A Promise represents the future result of an async operation.

It helps by:

- making async results composable,
- avoiding deeply nested callback code,
- providing explicit success/failure paths through \`.then\`, \`.catch\`, and \`.finally\`.

The main states are pending, fulfilled, and rejected.`,
      `Promise đại diện cho kết quả trong tương lai của một thao tác bất đồng bộ.

Nó hữu ích vì:

- làm kết quả async có thể compose được,
- tránh callback lồng quá sâu,
- cho đường đi thành công/thất bại rõ ràng qua \`.then\`, \`.catch\` và \`.finally\`.

Ba trạng thái chính là pending, fulfilled và rejected.`,
    ),
  }),
  q({
    id: 'array-methods-map-filter-reduce',
    category: 'technical',
    tags: ['javascript', 'arrays', 'basics'],
    question: l('When do you use map, filter, reduce, and forEach?', 'Khi nào dùng map, filter, reduce và forEach?'),
    answer: l(
      `- **map** transforms each item and returns a new array
- **filter** keeps a subset based on a condition
- **reduce** accumulates into one result or structure
- **forEach** performs side effects and returns nothing useful

Good interviews answers emphasize choosing the method that expresses intent most clearly, not using reduce for everything.`,
      `- **map** biến đổi từng phần tử và trả về mảng mới
- **filter** giữ lại tập con theo điều kiện
- **reduce** gộp thành một kết quả hoặc cấu trúc
- **forEach** làm side effect và không trả về kết quả hữu ích

Câu trả lời tốt nên nhấn mạnh việc chọn method diễn đạt ý đồ rõ nhất, chứ không phải lạm dụng reduce cho mọi thứ.`,
    ),
  }),
  q({
    id: 'css-box-model',
    category: 'technical',
    tags: ['css', 'basics'],
    question: l('What is the CSS box model?', 'CSS box model là gì?'),
    answer: l(
      `The box model consists of:

- content,
- padding,
- border,
- margin.

By default, \`width\` and \`height\` describe the content box. With \`box-sizing: border-box\`, the declared width/height includes padding and border.

This matters because many layout bugs are really box-model misunderstandings.`,
      `Box model gồm:

- content,
- padding,
- border,
- margin.

Mặc định, \`width\` và \`height\` mô tả content box. Với \`box-sizing: border-box\`, width/height khai báo sẽ bao gồm cả padding và border.

Điều này quan trọng vì nhiều bug layout thực ra bắt nguồn từ việc hiểu sai box model.`,
    ),
  }),
  q({
    id: 'css-position',
    category: 'technical',
    tags: ['css', 'basics', 'layout'],
    question: l('What do static, relative, absolute, fixed, and sticky mean in CSS positioning?', 'static, relative, absolute, fixed và sticky trong CSS positioning nghĩa là gì?'),
    answer: l(
      `- **static**: normal document flow
- **relative**: still in flow, but can shift relative to its normal position
- **absolute**: removed from normal flow and positioned relative to the nearest positioned ancestor
- **fixed**: positioned relative to the viewport
- **sticky**: behaves like relative until a scroll threshold, then sticks within its container context

Most positioning bugs come from misunderstanding the containing block or stacking context.`,
      `- **static**: luồng tài liệu bình thường
- **relative**: vẫn ở trong flow nhưng có thể dịch tương đối so với vị trí gốc
- **absolute**: ra khỏi flow và định vị theo positioned ancestor gần nhất
- **fixed**: định vị theo viewport
- **sticky**: ban đầu như relative, tới ngưỡng scroll thì “dính” trong context của container

Phần lớn bug positioning đến từ việc hiểu sai containing block hoặc stacking context.`,
    ),
  }),
  q({
    id: 'css-flexbox-vs-grid',
    category: 'technical',
    tags: ['css', 'layout', 'basics'],
    question: l('When should you use Flexbox vs Grid?', 'Khi nào dùng Flexbox và khi nào dùng Grid?'),
    answer: l(
      `Use **Flexbox** mainly for **one-dimensional** layout and **Grid** mainly for **two-dimensional** layout.

Rule of thumb:

- flex for nav bars, button groups, simple rows/columns
- grid for page sections, card grids, dashboards, and explicit row/column placement

They are complementary, not rivals. A common pattern is Grid for the page skeleton and Flexbox inside smaller components.`,
      `Dùng **Flexbox** chủ yếu cho layout **một chiều** và **Grid** chủ yếu cho layout **hai chiều**.

Rule of thumb:

- flex cho nav bar, button group, hàng/cột đơn giản
- grid cho page section, card grid, dashboard và chỗ cần placement theo hàng/cột rõ ràng

Chúng bổ trợ nhau chứ không đối đầu nhau. Pattern rất phổ biến là dùng Grid cho page skeleton và Flexbox bên trong component nhỏ hơn.`,
    ),
  }),
  q({
    id: 'semantic-html-vs-aria-bem',
    category: 'technical',
    tags: ['html', 'css', 'a11y', 'basics'],
    question: l('How do semantic HTML, ARIA, and BEM fit together?', 'Semantic HTML, ARIA và BEM liên quan với nhau như thế nào?'),
    answer: l(
      `Use **semantic HTML first** because native elements already provide behavior and accessibility meaning.

- use ARIA to fill gaps, not to replace correct HTML,
- use BEM or another naming system to make CSS structure predictable.

Example:

- prefer \`<button>\` over a clickable \`<div>\`,
- add ARIA only when native semantics are insufficient,
- use naming conventions so styling stays maintainable.

Semantics solve meaning; ARIA augments accessibility; BEM solves CSS organization.`,
      `Hãy ưu tiên **semantic HTML trước** vì native element đã có sẵn behavior và meaning cho accessibility.

- dùng ARIA để lấp khoảng trống, không phải để thay thế HTML đúng,
- dùng BEM hoặc naming system khác để CSS có cấu trúc dễ đoán.

Ví dụ:

- ưu tiên \`<button>\` hơn một \`<div>\` có click,
- chỉ thêm ARIA khi native semantic chưa đủ,
- dùng convention đặt tên để styling maintainable hơn.

Semantics giải quyết meaning; ARIA tăng cường accessibility; BEM giải quyết tổ chức CSS.`,
    ),
  }),
  q({
    id: 'http-basics-status-codes',
    category: 'technical',
    tags: ['http', 'basics'],
    question: l('What HTTP basics and status codes should frontend engineers know?', 'Frontend engineer nên nắm những HTTP basics và status code nào?'),
    answer: l(
      `Useful basics:

- HTTP methods and their intent: GET, POST, PUT/PATCH, DELETE
- headers, body, caching, cookies, and auth
- idempotency vs non-idempotency

Status codes worth knowing well:

- 200/201/204 success variants
- 301/302/307/308 redirects at a high level
- 400/401/403/404 client-side outcomes
- 409 conflict
- 422 validation errors
- 429 rate limiting
- 500/502/503 server-side failures

Frontend engineers do not need to memorize the whole spec, but they should know how these affect UI behavior.`,
      `Những basics hữu ích:

- HTTP method và intent của nó: GET, POST, PUT/PATCH, DELETE
- header, body, caching, cookie và auth
- idempotency vs non-idempotency

Status code rất nên nắm:

- 200/201/204 cho các kiểu thành công
- 301/302/307/308 ở mức high-level cho redirect
- 400/401/403/404 cho outcome phía client
- 409 conflict
- 422 validation error
- 429 rate limit
- 500/502/503 cho lỗi phía server

Frontend engineer không cần thuộc cả spec, nhưng cần biết các mã này ảnh hưởng tới hành vi UI thế nào.`,
    ),
  }),
  q({
    id: 'cors-basics',
    category: 'technical',
    tags: ['http', 'security', 'basics'],
    question: l('What is CORS at a practical level?', 'CORS là gì ở mức thực tế?'),
    answer: l(
      `CORS is the browser's cross-origin access policy for frontend requests.

Practical meaning:

- the server decides which origins/methods/headers are allowed,
- the browser enforces that policy,
- some requests trigger a preflight OPTIONS check.

Important nuance: CORS is a browser-enforced policy, not a general backend security boundary by itself.`,
      `CORS là policy truy cập cross-origin mà browser áp lên request từ frontend.

Về thực tế:

- server quyết định origin/method/header nào được phép,
- browser là bên enforce policy đó,
- một số request sẽ kích hoạt preflight OPTIONS.

Nuance quan trọng: CORS là policy do browser enforce, không phải tự nó là security boundary tổng quát của backend.`,
    ),
  }),
  q({
    id: 'vue-lifecycle-nexttick-template-refs',
    category: 'technical',
    tags: ['vue', 'basics'],
    question: l('When do you use onMounted, onUnmounted, nextTick, and template refs in Vue 3?', 'Khi nào dùng onMounted, onUnmounted, nextTick và template ref trong Vue 3?'),
    answer: l(
      `- **onMounted** when you need DOM-dependent work after mount
- **onUnmounted** for cleanup
- **nextTick** when you need to wait for the DOM to reflect a reactive update
- **template refs** when you need imperative access to a DOM node or child instance

The main caution is not to overuse imperative DOM access when declarative rendering is enough.`,
      `- **onMounted** khi cần làm việc phụ thuộc DOM sau khi mount
- **onUnmounted** để cleanup
- **nextTick** khi cần chờ DOM phản ánh xong một reactive update
- **template ref** khi cần truy cập imperative tới DOM node hoặc child instance

Điểm cần cẩn thận là đừng lạm dụng imperative DOM access nếu render declarative đã đủ.`,
    ),
  }),
  q({
    id: 'vue-vif-vshow',
    category: 'technical',
    tags: ['vue', 'basics'],
    question: l('When should you use v-if vs v-show?', 'Khi nào dùng v-if và khi nào dùng v-show?'),
    answer: l(
      `Use **v-if** when the condition changes less often and you want to mount/unmount the subtree. Use **v-show** when the element stays mounted but needs to toggle visibility frequently.

Rule of thumb:

- \`v-if\` has higher toggle cost, lower initial cost
- \`v-show\` has lower toggle cost, higher initial cost

This matters for both performance and lifecycle behavior.`,
      `Dùng **v-if** khi điều kiện đổi không quá thường xuyên và bạn muốn mount/unmount subtree. Dùng **v-show** khi element vẫn nên giữ mounted nhưng cần bật/tắt hiển thị thường xuyên.

Rule of thumb:

- \`v-if\` tốn hơn khi toggle, rẻ hơn lúc ban đầu
- \`v-show\` rẻ hơn khi toggle, nhưng tốn hơn lúc render ban đầu

Điều này quan trọng cả về performance lẫn lifecycle behavior.`,
    ),
  }),
  q({
    id: 'vue-computed-vs-methods-watch',
    category: 'technical',
    tags: ['vue', 'basics', 'reactivity'],
    question: l('How do computed, methods, and watch differ in Vue?', 'computed, methods và watch khác nhau thế nào trong Vue?'),
    answer: l(
      `- **computed** for derived values that benefit from caching
- **methods** for actions or calculations you do not need to cache
- **watch** for side effects when something changes

Easy rule:

- if you are deriving UI state, think computed first
- if you are reacting to a change by doing outside work, think watch
- if you just need callable logic, think method

Many codebases get messy when watch is used for derivation that should be computed.`,
      `- **computed** cho giá trị suy ra và có lợi từ cache
- **methods** cho action hoặc tính toán không cần cache
- **watch** cho side effect khi một giá trị thay đổi

Rule dễ nhớ:

- nếu đang suy ra UI state thì nghĩ tới computed trước
- nếu đang phản ứng với thay đổi để làm việc bên ngoài thì nghĩ tới watch
- nếu chỉ cần logic callable thì nghĩ tới method

Nhiều codebase trở nên rối khi watch bị dùng cho việc suy ra dữ liệu đáng lẽ nên là computed.`,
    ),
  }),
  q({
    id: 'vue-props-emits-vmodel',
    category: 'technical',
    tags: ['vue', 'basics', 'components'],
    question: l('How do props, emits, and v-model work together in Vue 3?', 'props, emits và v-model phối hợp với nhau như thế nào trong Vue 3?'),
    answer: l(
      `The core idea is **one-way data flow**:

- parent passes data down via **props**
- child notifies changes up via **emits**
- \`v-model\` is convenient syntax for a prop + update event pair

The source of truth should stay clear. Child components should not silently own data that the parent believes it owns.`,
      `Ý cốt lõi là **one-way data flow**:

- parent truyền data xuống qua **props**
- child báo thay đổi đi lên qua **emits**
- \`v-model\` là syntax tiện lợi cho một cặp prop + update event

Source of truth phải luôn rõ. Child không nên âm thầm ownership data mà parent tưởng là mình đang ownership.`,
    ),
  }),
  q({
    id: 'vue-key-in-v-for',
    category: 'technical',
    tags: ['vue', 'basics', 'lists'],
    question: l('Why does key matter in v-for?', 'Vì sao key quan trọng trong v-for?'),
    answer: l(
      `Keys help Vue preserve or reset DOM/component identity correctly across list updates.

Good keys:

- are stable,
- unique among siblings,
- come from real item identity when possible.

Index keys can cause wrong state preservation when items are inserted, removed, or reordered.`,
      `Key giúp Vue preserve hoặc reset đúng identity của DOM/component khi list thay đổi.

Key tốt:

- ổn định,
- unique trong nhóm sibling,
- đến từ identity thật của item nếu có thể.

Dùng index làm key dễ gây preserve nhầm state khi item bị chèn, xóa hoặc reorder.`,
    ),
  }),
  q({
    id: 'react-props-state-lifecycle-hooks',
    category: 'technical',
    tags: ['react', 'basics'],
    question: l('What are props, state, and “lifecycle with hooks” in React?', 'props, state và “lifecycle với hooks” trong React là gì?'),
    answer: l(
      `- **props** are inputs from parent to child
- **state** is local mutable data owned by the component
- with hooks, lifecycle concerns are expressed through render + effects rather than class lifecycle methods

A useful mental model is:

- render describes UI from current props/state
- effects synchronize with the outside world after render`,
      `- **props** là input truyền từ parent xuống child
- **state** là dữ liệu thay đổi được mà component tự ownership
- với hooks, concern kiểu lifecycle được diễn đạt qua render + effect thay vì class lifecycle method

Mental model hữu ích là:

- render mô tả UI từ props/state hiện tại
- effect đồng bộ với thế giới bên ngoài sau render`,
    ),
  }),
  q({
    id: 'react-usestate-useref',
    category: 'technical',
    tags: ['react', 'basics', 'hooks'],
    question: l('What is the difference between useState and useRef?', 'Khác nhau giữa useState và useRef là gì?'),
    answer: l(
      `- **useState** stores data that participates in rendering; updating it triggers a rerender
- **useRef** stores a mutable value that persists across renders without causing rerenders

Use \`useRef\` for DOM nodes, previous values, or imperative handles. Use \`useState\` when the UI should update because the value changed.`,
      `- **useState** lưu dữ liệu tham gia vào render; update nó sẽ gây rerender
- **useRef** lưu giá trị mutable sống qua các lần render mà không gây rerender

Dùng \`useRef\` cho DOM node, previous value hoặc imperative handle. Dùng \`useState\` khi UI phải đổi theo giá trị đó.`,
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
