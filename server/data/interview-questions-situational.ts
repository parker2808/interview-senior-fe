import { l, q } from './interview-questions-shared'
import type { InterviewQuestion } from './interview-questions-shared'

export const INTERVIEW_SITUATIONAL_QUESTIONS: InterviewQuestion[] = [
  q({
    id: 'jwt-pros-cons',
    category: 'situational',
    tags: ['jwt', 'security'],
    question: l('What are the advantages and disadvantages of JWT?', 'Ưu và nhược điểm của JWT?'),
    answer: l(
      `JWT is useful because it is portable, self-contained, and easy to verify statelessly. That works well for distributed systems and APIs.

But the downsides matter:

- revocation is harder than with server sessions,
- payloads can become bloated if abused,
- storing readable bearer tokens on the client increases XSS risk,
- some teams misuse JWT and ignore broader session design concerns.

Senior answer: JWT is just one piece of auth design. TTL, rotation, storage, revocation, and authorization rules matter as much as token format.`,
      `JWT hữu ích vì nó portable, self-contained và dễ verify theo kiểu stateless. Điều đó khá hợp với hệ phân tán và API.

Nhưng nhược điểm cũng rất thật:

- revoke khó hơn session phía server,
- payload dễ phình nếu lạm dụng,
- lưu bearer token ở nơi JS đọc được làm tăng risk XSS,
- nhiều team dùng JWT rồi quên mất bài toán session tổng thể.

Câu trả lời senior là: JWT chỉ là một mảnh của auth design. TTL, rotation, storage, revocation và authorization rule quan trọng không kém chính format token.`,
    ),
  }),
  q({
    id: 'jwt-backend-store',
    category: 'situational',
    tags: ['jwt', 'auth'],
    question: l(
      'In a JWT system, does the backend need to store token information? Why or why not?',
      'Hệ thống dùng JWT thì backend có cần lưu thông tin token không? Vì sao?',
    ),
    answer: l(
      `For access tokens, pure stateless verification may be enough. But real production systems often still store session-related metadata:

- refresh token hashes or families,
- revocation lists or session version counters,
- device/session tracking,
- risk signals for theft detection.

So the right answer is: **the backend may not store every access token, but production auth often stores enough metadata to regain control over sessions**.`,
      `Với access token, verify stateless có thể là đủ. Nhưng hệ production thật thường vẫn lưu metadata liên quan tới session:

- hash hoặc family của refresh token,
- revocation list hoặc session version counter,
- tracking theo device/session,
- tín hiệu risk để phát hiện token bị lộ.

Vì vậy câu trả lời đúng là: **backend có thể không lưu từng access token, nhưng auth production thường vẫn lưu đủ metadata để lấy lại quyền kiểm soát session**.`,
    ),
  }),
  q({
    id: 'jwt-not-localstorage',
    category: 'situational',
    tags: ['jwt', 'xss'],
    question: l(
      'Why is it generally not recommended to store JWTs in LocalStorage?',
      'Vì sao thường không nên lưu JWT trong LocalStorage?',
    ),
    answer: l(
      `Because any XSS on your origin can read LocalStorage and exfiltrate the token.

A stolen bearer token may be enough to act as the user until it expires. That is why many teams prefer HttpOnly cookies or in-memory access tokens with refresh handled through safer channels.

It is not that LocalStorage is evil for everything. It is that readable long-lived auth tokens increase the blast radius of XSS.`,
      `Vì bất kỳ XSS nào chạy được trên origin của bạn cũng có thể đọc LocalStorage và lấy token đi.

Một bearer token bị lộ có thể đủ để giả mạo người dùng cho tới khi hết hạn. Vì vậy nhiều team ưu tiên HttpOnly cookie hoặc access token ở memory còn refresh xử lý qua kênh an toàn hơn.

Không phải LocalStorage xấu với mọi thứ. Vấn đề là auth token sống lâu và JS đọc được sẽ làm blast radius của XSS lớn hơn rất nhiều.`,
    ),
  }),
  q({
    id: 'cookies-local-session-storage',
    category: 'situational',
    tags: ['browser', 'storage'],
    question: l('Differences between Cookies, LocalStorage, and SessionStorage?', 'Khác biệt giữa Cookies, LocalStorage và SessionStorage?'),
    answer: l(
      `At a high level:

- **Cookies** can be sent automatically with requests and can be HttpOnly, so they are useful for auth/session mechanics.
- **LocalStorage** is persistent and JS-readable, good for non-secret preferences.
- **SessionStorage** is also JS-readable but scoped to a browser tab/session.

The correct choice depends on the data's sensitivity, lifetime, and whether the server must receive it automatically.`,
      `Nhìn ở mức cao:

- **Cookies** có thể tự gửi kèm request và có thể là HttpOnly, nên hợp cho cơ chế auth/session.
- **LocalStorage** lưu bền hơn và JS đọc được, hợp cho preference không nhạy cảm.
- **SessionStorage** cũng bị JS đọc được nhưng gắn với một tab/session trình duyệt.

Chọn gì phụ thuộc vào độ nhạy cảm của dữ liệu, vòng đời của nó, và việc server có cần tự nhận nó theo request hay không.`,
    ),
  }),
  q({
    id: 'perf-issue-story',
    category: 'situational',
    tags: ['performance', 'story'],
    question: l(
      'Have you encountered performance issues? How did you investigate and resolve them? How do you tell FE vs BE bottleneck?',
      'Đã gặp performance issue chưa? Điều tra & xử lý thế nào? Phân biệt bottleneck FE/BE ra sao?',
    ),
    answer: l(
      `Tell this as a story with a method:

1. symptom,
2. measurement,
3. isolation,
4. root cause,
5. fix,
6. regression guard.

The FE/BE split usually comes from looking at where time is spent:

- waiting on network or high TTFB -> BE/network,
- long scripting or re-render cost -> FE,
- too many waterfalls -> FE orchestration or BE API shape.

Interviewers like answers that sound operational, not theoretical.`,
      `Nên kể câu này như một story có method:

1. triệu chứng,
2. đo đạc,
3. cô lập vấn đề,
4. root cause,
5. fix,
6. regression guard.

Việc tách FE/BE thường tới từ việc nhìn thời gian bị tiêu ở đâu:

- chờ network hoặc TTFB cao -> BE/network,
- scripting hoặc re-render lâu -> FE,
- waterfall quá nhiều -> orchestration FE hoặc API shape từ BE.

Interviewer thường thích câu trả lời mang tính vận hành thực tế hơn là lý thuyết suông.`,
    ),
    example: l(
      `“A large admin table felt sluggish. The API was fine, but profiling showed expensive client-side sorting and filtering on every keystroke. We fixed it by debouncing the input, memoizing derived rows, and moving heavy sort/filter to the server for larger datasets.”`,
      `“Một bảng admin lớn chạy rất ì. API ổn, nhưng profiling cho thấy phía client đang sort và filter rất nặng ở mỗi lần gõ. Team em fix bằng debounce input, memo derived rows và chuyển sort/filter nặng sang server với dataset lớn.”`,
    ),
  }),
  q({
    id: 'n-plus-one',
    category: 'situational',
    tags: ['api', 'backend', 'n+1'],
    question: l('Have you encountered the N+1 query problem? How did you identify and fix it?', 'Đã gặp N+1 query chưa? Nhận diện và fix thế nào?'),
    answer: l(
      `Yes. From FE, N+1 often appears as either many similar API calls or a “single” endpoint that feels slow because the backend is doing per-item work internally.

I would identify it through:

- network waterfalls,
- server timing / APM traces,
- repeated data-access patterns in logs.

The durable fix is usually on the backend: joins, eager loading, batching, or better endpoint design. On the frontend, the right move is often to request a more aggregate-friendly contract instead of looping requests.`,
      `Có. Nhìn từ FE, N+1 thường lộ ra thành rất nhiều API call giống nhau, hoặc một endpoint tưởng là “một call” nhưng rất chậm vì backend đang làm việc theo từng item ở bên trong.

Em sẽ nhận diện qua:

- network waterfall,
- server timing / APM trace,
- log thể hiện pattern truy cập dữ liệu lặp lại.

Fix bền vững thường nằm ở backend: join, eager loading, batching hoặc thiết kế endpoint tốt hơn. Ở frontend, nước đi đúng thường là xin contract aggregate-friendly hơn thay vì loop request.`,
    ),
  }),
  q({
    id: 'api-caching',
    category: 'situational',
    tags: ['cache', 'api', 'performance'],
    question: l('Have you implemented API caching? What problem and trade-offs?', 'Đã implement API caching chưa? Giải quyết vấn đề gì và trade-off?'),
    answer: l(
      `Caching helps reduce redundant work and improve perceived speed, but only if freshness semantics are clear.

Useful layers:

- HTTP cache,
- CDN or edge cache,
- server-state cache in the app,
- service worker for specific offline/resilience cases.

Trade-offs:

- stale data risk,
- invalidation complexity,
- personalized content limits,
- memory usage.

Good answers mention cache keys, TTL, and invalidation strategy explicitly.`,
      `Caching giúp giảm công việc lặp lại và tăng tốc độ cảm nhận, nhưng chỉ hiệu quả nếu freshness semantics rõ ràng.

Các tầng hữu ích:

- HTTP cache,
- CDN hoặc edge cache,
- server-state cache trong app,
- service worker cho các case offline/resilience cụ thể.

Trade-off:

- risk dữ liệu stale,
- độ phức tạp của invalidation,
- giới hạn với nội dung cá nhân hóa,
- chi phí bộ nhớ.

Câu trả lời tốt nên nhắc rõ cache key, TTL và chiến lược invalidation.`,
    ),
  }),
  q({
    id: 'ai-1500-line-component',
    category: 'situational',
    tags: ['ai', 'code-review'],
    question: l(
      'An AI tool generates a 1,500-line React component that works. Would you merge it? What criteria?',
      'AI generate component React 1.500 dòng chạy đúng. Có merge không? Tiêu chí đánh giá?',
    ),
    answer: l(
      `Default answer: **not as-is**.

I would evaluate:

1. responsibility boundaries,
2. readability and naming,
3. testing quality,
4. accessibility and security,
5. render performance,
6. consistency with codebase conventions,
7. whether the team can maintain it without the AI conversation.

If the code is only “working” but impossible to reason about, that is debt disguised as velocity.`,
      `Câu trả lời mặc định: **không merge nguyên xi**.

Em sẽ đánh giá:

1. boundary của responsibility,
2. readability và naming,
3. chất lượng test,
4. accessibility và security,
5. render performance,
6. consistency với convention của codebase,
7. team có maintain được khi không còn chat AI hay không.

Nếu code chỉ “chạy được” nhưng không thể reasoning nổi thì đó là debt được hóa trang thành tốc độ.`,
    ),
  }),
  q({
    id: 'table-50k-rows',
    category: 'situational',
    tags: ['performance', 'table', 'system-design'],
    question: l('A table must show 50,000 records. How do you design UI and rendering?', 'Table cần hiển thị 50.000 records. Thiết kế UI và rendering thế nào?'),
    answer: l(
      `**Short answer:** Do **not** render 50,000 DOM rows eagerly. Default to server pagination or cursor pagination, then add virtualization only if the UX truly requires long scrolling.

**Why:**

1. first ask whether users need all rows at once,
2. keep data fetching paginated or cursor-based,
3. virtualize if continuous scrolling is required,
4. move sort/filter/search to the server when data volume is large,
5. keep row rendering cheap and model selection by stable IDs.

**Trade-offs:**

- client-side flexibility feels nice but becomes expensive fast,
- virtualization helps performance but complicates measurement, keyboard nav, and sticky UI,
- bulk actions and export often need a separate backend strategy.

Senior answers also cover search UX, loading/error states, bulk actions, and export behavior.`,
      `**Trả lời ngắn:** **Đừng** render eager 50.000 DOM row. Mặc định nên dùng server pagination hoặc cursor pagination, rồi chỉ thêm virtualization nếu UX thật sự cần scroll dài.

**Vì sao:**

1. trước hết phải hỏi user có thật sự cần thấy tất cả cùng lúc không,
2. giữ data fetching theo pagination hoặc cursor,
3. virtualize nếu bắt buộc phải scroll liên tục,
4. sort/filter/search nên đưa về server khi dữ liệu lớn,
5. giữ row render rẻ và model selection bằng ID ổn định.

**Trade-off:**

- độ linh hoạt phía client nghe hấp dẫn nhưng sẽ rất đắt ở dataset lớn,
- virtualization giúp performance nhưng làm phức tạp việc đo chiều cao, keyboard nav và sticky UI,
- bulk action và export thường cần chiến lược backend riêng.

Câu trả lời kiểu senior còn phải chạm tới search UX, loading/error state, bulk action và cách export.`,
    ),
    followUps: [
      l('When is virtualization worth the added complexity?', 'Khi nào virtualization đáng với độ phức tạp nó thêm vào?'),
      l('How would you handle “select all” across server-paginated data?', 'Bạn xử lý “select all” trên dữ liệu phân trang ở server như thế nào?'),
    ],
  }),
  q({
    id: 'lazy-loading-tradeoffs',
    category: 'situational',
    tags: ['performance', 'ux'],
    question: l('When does lazy loading help, and when does it hurt UX?', 'Khi nào lazy loading giúp perf, khi nào làm UX tệ hơn?'),
    answer: l(
      `Lazy loading helps when it keeps rarely needed code or media off the critical path.

It hurts when:

- you lazy-load something on the first screen,
- chunks become too fragmented,
- every user action waits for a network round-trip,
- you create skeletons everywhere but reduce overall responsiveness.

The real skill is choosing the right boundaries and preloading likely next steps when intent is clear.`,
      `Lazy loading giúp khi nó giữ code hoặc media ít dùng ra khỏi critical path.

Nó làm UX tệ đi khi:

- bạn lazy-load thứ nằm ngay màn đầu,
- chunk bị chia quá vụn,
- mỗi thao tác của user đều phải chờ round-trip mạng,
- bạn tạo skeleton ở khắp nơi nhưng tổng thể lại kém responsive hơn.

Kỹ năng thật nằm ở việc chọn đúng boundary và preload các bước tiếp theo có xác suất cao khi ý định user đã rõ.`,
    ),
  }),
  q({
    id: 'dashboard-15-apis',
    category: 'situational',
    tags: ['dashboard', 'api', 'performance'],
    question: l('A dashboard loads data from 15 APIs. How do you optimize the loading experience?', 'Dashboard load từ 15 APIs. Tối ưu trải nghiệm loading thế nào?'),
    answer: l(
      `**Short answer:** Optimize both the **request architecture** and the **loading UX** so “15 APIs” does not become “one giant spinner”.

**Architecture:**

- parallelize independent calls,
- aggregate or add a BFF where waterfalls dominate,
- cache where freshness rules allow,
- isolate failures per widget instead of failing the entire page.

**UX:**

- prioritize above-the-fold content,
- use per-widget skeletons or placeholders,
- show partial content as it becomes ready,
- clearly separate loading, empty, stale, and error states.

**Trade-offs:**

- aggregating too much can create one massive slow endpoint,
- per-widget independence helps resilience but can create visual jitter,
- caching improves speed but can complicate freshness.

The key is orchestrating data so the dashboard feels progressively useful, not all-or-nothing.`,
      `**Trả lời ngắn:** Hãy tối ưu cả **kiến trúc request** lẫn **loading UX** để “15 API” không biến thành “một spinner khổng lồ”.

**Kiến trúc:**

- chạy song song các call độc lập,
- aggregate hoặc thêm BFF ở nơi waterfall quá nặng,
- cache ở những nơi freshness rule cho phép,
- cô lập lỗi theo từng widget thay vì fail cả trang.

**UX:**

- ưu tiên content ở vùng nhìn thấy đầu tiên,
- dùng skeleton hoặc placeholder theo từng widget,
- cho partial content hiện dần khi sẵn sàng,
- tách rõ loading, empty, stale và error state.

**Trade-off:**

- aggregate quá nhiều có thể tạo một endpoint lớn và chậm,
- widget độc lập giúp resilience nhưng có thể gây visual jitter,
- cache tăng tốc nhưng làm freshness phức tạp hơn.

Điểm mấu chốt là orchestration sao cho dashboard hữu ích dần lên, không phải kiểu được ăn cả ngã về không.`,
    ),
    followUps: [
      l('When would you introduce a BFF for the dashboard?', 'Khi nào bạn sẽ thêm BFF cho dashboard?'),
      l('How do you stop one flaky API from ruining the whole screen?', 'Bạn ngăn một API flaky làm hỏng cả màn hình như thế nào?'),
    ],
  }),
  q({
    id: 'csrf-vs-xss',
    category: 'situational',
    tags: ['security', 'csrf', 'xss'],
    question: l('How do CSRF and XSS differ, and how do they relate to cookie auth?', 'CSRF và XSS khác nhau thế nào, liên quan cookie auth ra sao?'),
    answer: l(
      `XSS is about malicious script running on your origin. CSRF is about a different origin causing the browser to send an authenticated request to yours.

Relation to cookie auth:

- cookie auth is more exposed to CSRF if not defended,
- JS-readable tokens are more exposed to XSS.

In reality you care about both:

- HttpOnly cookies help with XSS exposure,
- SameSite and CSRF tokens help with CSRF,
- sanitization and CSP help reduce XSS risk.`,
      `XSS là bài toán script độc hại chạy được trên origin của bạn. CSRF là bài toán một origin khác ép browser gửi request đã được xác thực tới origin của bạn.

Liên quan tới cookie auth:

- cookie auth dễ dính CSRF hơn nếu không có phòng vệ,
- token mà JS đọc được lại dễ bị XSS hơn.

Thực tế là phải quan tâm cả hai:

- HttpOnly cookie giúp giảm exposure với XSS,
- SameSite và CSRF token giúp chống CSRF,
- sanitize và CSP giúp giảm risk XSS.`,
    ),
  }),
  q({
    id: 'design-news-feed',
    category: 'situational',
    tags: ['system-design', 'news-feed'],
    question: l('How would you design a frontend for a news feed?', 'Bạn sẽ thiết kế frontend cho news feed như thế nào?'),
    answer: l(
      `I would break it into:

1. feed retrieval model: cursor pagination and stable ordering,
2. item rendering strategy: virtualization or incremental rendering if the list is large,
3. optimistic actions: like/save/follow with rollback strategy,
4. media loading and placeholders,
5. refresh strategy for new content,
6. caching and deduplication of items across views.

Senior considerations include scroll restoration, partial failures, accessibility for dynamic content, and analytics without harming performance.`,
      `Em sẽ tách bài toán thành:

1. mô hình lấy feed: cursor pagination và thứ tự ổn định,
2. chiến lược render item: virtualization hoặc incremental rendering nếu list lớn,
3. optimistic action: like/save/follow kèm rollback strategy,
4. media loading và placeholder,
5. chiến lược refresh nội dung mới,
6. cache và dedupe item giữa các view.

Consideration mức senior còn có scroll restoration, partial failure, accessibility cho nội dung động và analytics mà không làm hại performance.`,
    ),
  }),
  q({
    id: 'design-autocomplete',
    category: 'situational',
    tags: ['system-design', 'autocomplete'],
    question: l('How would you design an autocomplete search box?', 'Bạn sẽ thiết kế autocomplete search box như thế nào?'),
    answer: l(
      `Important pieces:

- debounce input,
- cancel stale requests,
- show loading, empty, error, and keyboard-navigation states,
- highlight matches accessibly,
- cache recent queries carefully,
- handle race conditions and out-of-order responses.

If the backend supports it, prefer an API designed for autocomplete rather than a generic search endpoint.`,
      `Các mảnh quan trọng:

- debounce input,
- cancel request cũ,
- có loading, empty, error và keyboard-navigation state,
- highlight match theo cách accessible,
- cache query gần đây một cách cẩn thận,
- xử lý race condition và out-of-order response.

Nếu backend hỗ trợ, nên ưu tiên một API thiết kế riêng cho autocomplete thay vì tận dụng bừa endpoint search tổng quát.`,
    ),
  }),
  q({
    id: 'design-realtime-chat',
    category: 'situational',
    tags: ['system-design', 'realtime', 'chat'],
    question: l('How would you approach a realtime chat UI?', 'Bạn tiếp cận UI realtime chat như thế nào?'),
    answer: l(
      `I would think about:

- message ordering and deduplication,
- optimistic send state and retry,
- unread/read markers,
- reconnection behavior,
- pagination for history,
- typing indicators and presence as secondary signals,
- accessibility and keyboard workflows.

A robust chat UI is less about WebSocket trivia and more about handling imperfect network conditions gracefully.`,
      `Em sẽ nghĩ tới:

- ordering và dedupe của message,
- optimistic send state và retry,
- unread/read marker,
- behavior khi reconnect,
- pagination cho history,
- typing indicator và presence như tín hiệu phụ,
- accessibility và keyboard workflow.

Một chat UI vững không nằm ở trivia về WebSocket, mà nằm ở việc xử lý mạng không hoàn hảo một cách graceful.`,
    ),
  }),
  q({
    id: 'design-system-strategy',
    category: 'situational',
    tags: ['system-design', 'design-system'],
    question: l('How would you grow a frontend design system?', 'Bạn sẽ phát triển một frontend design system như thế nào?'),
    answer: l(
      `Start with real product needs, not a giant abstract component library.

Good sequence:

1. establish tokens and primitives,
2. extract repeated patterns from real screens,
3. define API conventions and accessibility expectations,
4. document usage, dos/don'ts, and ownership,
5. version and migrate carefully.

A design system succeeds when it improves consistency and delivery speed without becoming a bottleneck team.`,
      `Hãy bắt đầu từ nhu cầu thật của product, không phải dựng một thư viện component trừu tượng khổng lồ ngay từ đầu.

Thứ tự tốt thường là:

1. chốt token và primitive,
2. tách pattern lặp lại từ màn hình thật,
3. định nghĩa API convention và kỳ vọng accessibility,
4. tài liệu hóa usage, dos/don'ts và ownership,
5. version và migrate cẩn thận.

Design system thành công khi nó tăng consistency và tốc độ delivery mà không biến thành team bottleneck.`,
    ),
  }),
  q({
    id: 'micro-frontends-when',
    category: 'situational',
    tags: ['architecture', 'micro-frontends'],
    question: l('When would you consider micro-frontends, and when would you avoid them?', 'Khi nào cân nhắc micro-frontend, và khi nào nên tránh?'),
    answer: l(
      `Consider micro-frontends when organizational boundaries, release independence, or platform scale truly demand them.

Avoid them when:

- a modular monolith still works,
- team coordination is manageable,
- you would mainly be adding complexity for prestige.

Trade-offs:

- independent delivery vs duplicated runtime and tooling complexity,
- team autonomy vs fragmented UX and standards,
- local speed vs global consistency.

Senior answer: micro-frontends are an org and product decision as much as a technical one.`,
      `Cân nhắc micro-frontend khi boundary tổ chức, nhu cầu release độc lập hoặc scale platform thực sự đòi hỏi.

Nên tránh khi:

- modular monolith vẫn hoạt động tốt,
- coordination giữa team vẫn còn quản được,
- bạn chỉ đang thêm complexity vì “nghe có vẻ enterprise”.

Trade-off:

- delivery độc lập vs runtime và tooling complexity bị nhân lên,
- autonomy của team vs UX/standard dễ bị phân mảnh,
- tốc độ cục bộ vs consistency toàn cục.

Câu trả lời senior là: micro-frontend là quyết định về tổ chức và product không kém gì quyết định kỹ thuật.`,
    ),
  }),
  q({
    id: 'monorepo-strategy',
    category: 'situational',
    tags: ['architecture', 'monorepo'],
    question: l('When does a monorepo help frontend teams?', 'Khi nào monorepo giúp ích cho frontend team?'),
    answer: l(
      `A monorepo helps when teams need to share packages, types, tooling, design-system code, or coordinated changes across apps.

Benefits:

- shared standards and tooling,
- easier cross-package refactors,
- clearer source of truth.

Costs:

- build graph complexity,
- CI performance concerns,
- ownership and versioning discipline still required.

A monorepo is a force multiplier if engineering practices are good; otherwise it centralizes chaos.`,
      `Monorepo giúp khi các team cần chia sẻ package, type, tooling, design-system code hoặc phải làm coordinated change qua nhiều app.

Lợi ích:

- standard và tooling dùng chung,
- refactor cross-package dễ hơn,
- source of truth rõ hơn.

Chi phí:

- build graph phức tạp hơn,
- CI dễ nặng,
- vẫn cần kỷ luật ownership và versioning.

Monorepo là force multiplier nếu practice kỹ thuật tốt; nếu không thì nó chỉ gom chaos về một chỗ.`,
    ),
  }),
  q({
    id: 'role-permission-ui',
    category: 'situational',
    tags: ['auth', 'authorization', 'ui'],
    question: l('How do you design role/permission handling in the UI?', 'Bạn thiết kế role/permission handling trong UI như thế nào?'),
    answer: l(
      `Separate three concerns:

1. backend is the source of truth for authorization,
2. frontend uses permissions to shape UX,
3. UI logic should be centralized enough to avoid copy-paste checks everywhere.

I like modeling capabilities explicitly rather than scattering raw role-name checks across components.

Good UX also distinguishes:

- hidden because unavailable,
- disabled because lacking permission,
- not loaded yet because auth state is unknown.`,
      `Hãy tách ba concern:

1. backend là source of truth cho authorization,
2. frontend dùng permission để định hình UX,
3. UI logic nên đủ tập trung để tránh copy-paste check role khắp nơi.

Em thích model capability tường minh hơn là rải raw role-name check khắp component.

UX tốt cũng phải phân biệt:

- ẩn vì không có feature,
- disable vì thiếu quyền,
- chưa load xong vì auth state còn chưa biết.`,
    ),
  }),
  q({
    id: 'bff-when',
    category: 'situational',
    tags: ['architecture', 'bff', 'api'],
    question: l('When would you introduce a BFF (Backend for Frontend)?', 'Khi nào bạn giới thiệu một BFF?'),
    answer: l(
      `A BFF makes sense when frontend needs composition, shaping, or policy that the downstream APIs do not provide cleanly.

Typical reasons:

- multiple backend calls need aggregation,
- frontend-specific payload shaping is repeated,
- auth/session or edge caching logic belongs close to the UI,
- you want to isolate the frontend from backend churn.

Do not introduce a BFF just because it sounds elegant. It adds another operational surface.`,
      `BFF hợp lý khi frontend cần composition, shaping hoặc policy mà các API phía dưới chưa cung cấp sạch sẽ.

Lý do thường gặp:

- nhiều backend call cần được aggregate,
- frontend lặp lại việc reshape payload,
- auth/session hoặc edge caching logic nên nằm gần UI,
- muốn tách frontend khỏi sự thay đổi liên tục của backend.

Đừng đưa BFF vào chỉ vì nó nghe “đẹp”. Nó thêm một bề mặt vận hành mới phải gánh.`,
    ),
  }),
  q({
    id: 'feature-flags-rollout',
    category: 'situational',
    tags: ['release', 'feature-flags'],
    question: l('How do you use feature flags safely?', 'Bạn dùng feature flag an toàn như thế nào?'),
    answer: l(
      `Feature flags are useful for gradual rollout, experimentation, and fast kill switches.

Safety practices:

- keep flag ownership clear,
- define expiration / cleanup plans,
- test both flag states where important,
- avoid deeply nesting flags in rendering logic,
- distinguish release flags from permanent permission/config flags.

Without cleanup discipline, flags become long-term complexity.`,
      `Feature flag hữu ích cho gradual rollout, experimentation và kill switch nhanh.

Thực hành an toàn:

- ownership của flag phải rõ,
- có kế hoạch hết hạn / cleanup,
- test cả hai trạng thái khi quan trọng,
- tránh lồng flag quá sâu trong render logic,
- phân biệt release flag với permission/config flag sống lâu.

Nếu không có kỷ luật cleanup thì feature flag sẽ trở thành complexity sống dai.`,
    ),
  }),
  q({
    id: 'observability-frontend',
    category: 'situational',
    tags: ['observability', 'debugging'],
    question: l('What does good frontend observability look like?', 'Frontend observability tốt trông như thế nào?'),
    answer: l(
      `Good frontend observability gives you enough signal to debug real user issues without drowning in noise.

Useful pieces:

- client error monitoring with stack traces and release info,
- Web Vitals / RUM,
- correlation IDs to connect FE and BE events,
- important user-flow analytics,
- breadcrumbs for key interactions.

The senior nuance is balancing visibility with privacy, cost, and signal quality.`,
      `Frontend observability tốt cho bạn đủ tín hiệu để debug issue thật của user mà không bị chìm trong noise.

Các mảnh hữu ích:

- client error monitoring có stack trace và release info,
- Web Vitals / RUM,
- correlation ID để nối sự kiện FE và BE,
- analytics cho các flow quan trọng,
- breadcrumb cho tương tác chính.

Nuance mức senior là cân bằng giữa độ nhìn thấy, quyền riêng tư, chi phí và chất lượng tín hiệu.`,
    ),
  }),
  q({
    id: 'third-party-script-risk',
    category: 'situational',
    tags: ['security', 'performance', 'third-party'],
    question: l('How do you evaluate third-party scripts or SDKs?', 'Bạn đánh giá third-party script hoặc SDK như thế nào?'),
    answer: l(
      `I evaluate them on four axes:

1. business value,
2. security/privacy risk,
3. performance cost,
4. operational ownership.

Questions I ask:

- does it need full page access?
- can it load lazily?
- what happens if it fails?
- does it collect user data?
- who owns upgrades and incidents?

The default should not be “yes, just paste the script.”`,
      `Em đánh giá trên bốn trục:

1. business value,
2. risk về security/privacy,
3. chi phí performance,
4. ownership khi vận hành.

Những câu hỏi em thường hỏi:

- nó có cần full page access không?
- có thể lazy-load không?
- nếu nó fail thì chuyện gì xảy ra?
- nó có thu thập user data không?
- ai ownership việc upgrade và incident?

Mặc định không nên là “ừ, dán script vào là xong”.`,
    ),
  }),
  q({
    id: 'refactor-under-deadline',
    category: 'situational',
    tags: ['refactor', 'delivery', 'tradeoff'],
    question: l('How do you refactor safely when product pressure is high?', 'Bạn refactor an toàn như thế nào khi áp lực product đang cao?'),
    answer: l(
      `Under pressure, I avoid broad rewrites and look for seam-based refactors.

Good pattern:

1. isolate the painful area,
2. add safety nets where cheap and valuable,
3. refactor behind stable interfaces,
4. move in slices while still delivering product value,
5. prove that risk is going down, not up.

Senior judgment is knowing when to improve the foundation incrementally instead of trying to “fix everything properly” in one shot.`,
      `Khi đang áp lực, em tránh rewrite diện rộng và đi tìm seam để refactor.

Pattern tốt:

1. cô lập vùng đau nhất,
2. thêm safety net ở chỗ rẻ mà đáng giá,
3. refactor sau interface ổn định,
4. đi theo từng lát nhỏ mà vẫn giao được giá trị product,
5. chứng minh rằng risk đang giảm chứ không tăng.

Judgment kiểu senior là biết lúc nào nên cải thiện nền tảng dần dần thay vì cố “sửa cho đúng toàn bộ” trong một phát.`,
    ),
  }),
]
