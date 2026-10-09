import { l, q } from './interview-questions-shared'
import type { InterviewQuestion } from './interview-questions-shared'

export const INTERVIEW_SITUATIONAL_QUESTIONS: InterviewQuestion[] = [
  q({
    id: 'jwt-pros-cons',
    category: 'situational',
    tags: ['jwt', 'security'],
    question: l('What are the advantages and disadvantages of JWT?', 'Ưu và nhược điểm của JWT?'),
    answer: l(
      `**What they actually ask:** Is JWT the session, or just a signed envelope — and can you revoke it at 2 a.m.?

**How a senior answers:** Use JWT when **independent services** must verify a short-lived access token without a central lookup on every hop. Constraint: a self-contained token is **hard to revoke**; you need short TTL, refresh rotation, and often a session version / denylist for logout-all.

**Failure mode:** Fat claims (PII, permissions that go stale). Bearer in \`localStorage\`. “Stateless” as an excuse to skip a refresh-token store. Trusting \`exp\` on the client for authz.

**Measure:** Time-to-revoke. Refresh-reuse detection. Token byte size on the wire. XSS tabletop: readable vs httpOnly.

**Tradeoffs:** Stateless verify scales horizontally; opaque server sessions revoke instantly and stay small. BFF session cookies often beat raw JWT in the SPA.

**Production gotchas:** Algorithm confusion / \`none\`. Clock skew. Putting roles in the JWT and never re-checking after a role change. Vue route guards reading claims is UX only.`,
      `**Họ thực sự hỏi:** JWT có phải là session, hay chỉ là phong bì đã ký — và 2 giờ sáng bạn revoke được không?

**Cách senior trả lời:** Dùng JWT khi **nhiều service** phải verify access ngắn mà không lookup trung tâm mỗi hop. Constraint: token self-contained **khó revoke**; cần TTL ngắn, xoay refresh, và thường version session / denylist cho logout-all.

**Failure mode:** Claim béo (PII, quyền cũ). Bearer trong \`localStorage\`. “Stateless” để khỏi lưu refresh. Tin \`exp\` trên client để authz.

**Measure:** Thời gian revoke. Phát hiện reuse refresh. Byte token trên wire. Bàn XSS: JS đọc được vs httpOnly.

**Tradeoffs:** Verify stateless scale ngang; session opaque phía server revoke tức thì và nhỏ. Cookie session qua BFF thường hơn JWT trần trên SPA.

**Production gotchas:** Nhầm algorithm / \`none\`. Lệch đồng hồ. Nhét role vào JWT rồi không check lại sau khi đổi quyền. Vue route guard đọc claim chỉ là UX.`,
    ),
    followUps: [
      l('What do you still store on the server if access tokens are JWTs?', 'Nếu access là JWT, bạn vẫn lưu gì trên server?'),
      l('When would you pick an opaque session cookie over JWT?', 'Khi nào bạn chọn session cookie opaque hơn JWT?'),
    ],
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
      `**What they actually ask:** Where does the **refresh token** go, and did Pinia persist just invent \`localStorage\` auth?

**How a senior answers:** Cookies: auto-sent, can be \`HttpOnly; Secure; SameSite\` — session/refresh. \`localStorage\`: origin-wide, JS-readable, survives tabs — **non-secrets** (theme, dismissed banners). \`sessionStorage\`: per-tab, JS-readable — drafts, wizard step. Decision: sensitivity × lifetime × “must the server see it?” Constraint: XSS reads any JS storage; CSRF cares about cookies.

**Failure mode:** JWT in \`localStorage\`. Cookie without SameSite on a mutation API. Storing PII or cart-with-auth in \`localStorage\` “because it’s easy.”

**Measure:** XSS tabletop. A cross-site form POST fixture if cookies auth mutations. Logout clears the right store and other tabs.

**Tradeoffs:** Cookies need a CSRF story. Memory + httpOnly refresh needs a boot refresh. \`sessionStorage\` dies with the tab (good for isolation, bad for “continue later”).

**Production gotchas:** Pinia/Zustand \`persist\`. Safari ITP. 4KB cookie budget. \`localhost\` vs preview origin. Vue SSR: don’t read \`localStorage\` in \`setup\`.`,
      `**Họ thực sự hỏi:** **Refresh token** để đâu, và Pinia persist có vừa biến thành auth \`localStorage\` không?

**Cách senior trả lời:** Cookie: tự gửi, có thể \`HttpOnly; Secure; SameSite\` — session/refresh. \`localStorage\`: theo origin, JS đọc được, sống qua tab — **không secret** (theme, banner đã tắt). \`sessionStorage\`: theo tab, JS đọc được — draft, bước wizard. Decision: độ nhạy × vòng đời × “server có phải tự thấy?” Constraint: XSS đọc mọi JS storage; CSRF quan tâm cookie.

**Failure mode:** JWT trong \`localStorage\`. Cookie không SameSite trên API mutation. Nhét PII hoặc cart kèm auth vào \`localStorage\` “vì tiện.”

**Measure:** Bàn XSS. Fixture form POST cross-site nếu cookie auth mutation. Logout xóa đúng store và các tab khác.

**Tradeoffs:** Cookie cần chuyện CSRF. Memory + refresh httpOnly cần refresh lúc boot. \`sessionStorage\` chết theo tab (tốt để cô lập, tệ nếu “làm tiếp sau”).

**Production gotchas:** Pinia/Zustand \`persist\`. Safari ITP. Ngân sách cookie 4KB. \`localhost\` vs origin preview. Vue SSR: đừng đọc \`localStorage\` trong \`setup\`.`,
    ),
    followUps: [
      l('What belongs in a cookie that must never go in localStorage?', 'Thứ gì thuộc cookie và không bao giờ được vào localStorage?'),
      l('How do you sync logout across tabs with each storage type?', 'Bạn đồng bộ logout giữa các tab với từng loại storage thế nào?'),
    ],
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
      `**What they actually ask:** If the SPA uses Bearer in memory, do you still need CSRF? And does “Vue escapes by default” let you store JWTs in \`localStorage\`?

**How a senior answers:** XSS = attacker JS on **your** origin (token theft, fake UI). CSRF = other origin triggers a **credentialed** request (cookies auto-attach). Decision: cookie sessions → SameSite=Lax + custom header / double-submit; Bearer-from-memory → classic CSRF usually gone. XSS is still game over for any JS-readable secret. Vue text interpolation escapes; \`v-html\` / markdown / \`href\` do not.

**Failure mode:** “We are an SPA so CSRF vanished” while refresh cookies POST \`/transfer\`. \`Access-Control-Allow-Origin: *\` + credentials. Mutations on GET.

**Measure:** Can a malicious page change state with the user’s cookie and no extra header? Authed XSS on a CMS field. CSP reports trending down.

**Tradeoffs:** Cookie UX vs CSRF program. Memory bearer vs CSRF-free but XSS-sensitive if it ever hits Web Storage.

**Production gotchas:** \`www\` vs \`api\` are same-site. CSRF tokens do not survive XSS. \`v-html\` of CMS + token in Pinia persist is the combo incident.`,
      `**Họ thực sự hỏi:** SPA dùng Bearer trong memory thì còn CSRF không? Và “Vue escape mặc định” có cho phép nhét JWT vào \`localStorage\`?

**Cách senior trả lời:** XSS = JS attacker trên origin **của bạn** (cướp token, UI giả). CSRF = origin khác kích request **có credential** (cookie tự gắn). Decision: session cookie → SameSite=Lax + header custom / double-submit; Bearer-từ-memory → CSRF cổ điển thường hết. XSS vẫn game over với mọi secret JS đọc được. Vue interpolate escape; \`v-html\` / markdown / \`href\` thì không.

**Failure mode:** “SPA nên CSRF biến mất” trong khi cookie refresh POST \`/transfer\`. \`Access-Control-Allow-Origin: *\` + credentials. Mutation trên GET.

**Measure:** Trang độc có đổi state bằng cookie user mà không thêm header? XSS user đã login trên field CMS. Báo cáo CSP giảm.

**Tradeoffs:** UX cookie vs chương trình CSRF. Bearer memory hết CSRF nhưng nhạy XSS nếu rơi vào Web Storage.

**Production gotchas:** \`www\` vs \`api\` là same-site. CSRF token không sống sót XSS. \`v-html\` CMS + token trong Pinia persist là combo incident.`,
    ),
    followUps: [
      l('Why does HttpOnly not solve CSRF by itself?', 'Vì sao HttpOnly một mình không giải quyết CSRF?'),
      l('When does a Bearer SPA still have a CSRF surface?', 'Khi nào SPA Bearer vẫn còn bề mặt CSRF?'),
    ],
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
      `**What they actually ask:** Will a design-system change land in three apps this week, and will CI still finish before standup?

**How a senior answers:** Choose a monorepo when you **coordinate types, UI kit, and tooling** across apps more often than you release them independently. Constraint: you still need **ownership, affected-package CI, and a publish story** (changesets). A folder of apps without task graph is not a strategy.

**Failure mode:** One pipeline that installs/builds everything. Circular packages. “Just import from \`../../other-app\`.” No CODEOWNERS so every package is everyone’s leftover.

**Measure:** CI minutes vs affected graph. Time to land a type change in app + BFF. Cache hit rate (Nx/Turborepo). Broken publish of the design system.

**Tradeoffs:** Polyrepo isolates blast radius and duplicates tooling. Monorepo makes atomic refactors cheap and review/CI policy harder. Vue + React in one repo is fine if packages do not share a runtime.

**Production gotchas:** Vite prebundling across workspace packages. TS project references stale. Nuxt/Nitro bundling a server-only package into the client. Version drift of “internal” packages that were never versioned.`,
      `**Họ thực sự hỏi:** Thay đổi design system có vào ba app tuần này không, và CI còn xong trước standup?

**Cách senior trả lời:** Chọn monorepo khi bạn **phối hợp type, UI kit, tooling** giữa các app thường hơn là release độc lập. Constraint: vẫn cần **ownership, CI theo package bị ảnh hưởng, và chuyện publish** (changeset). Một folder app không có task graph chưa phải strategy.

**Failure mode:** Một pipeline install/build tất cả. Package vòng. “Import \`../../other-app\`.” Không CODEOWNERS nên mọi package là đồ thừa của mọi người.

**Measure:** Phút CI vs graph affected. Thời gian đưa type change vào app + BFF. Cache hit (Nx/Turborepo). Publish design system gãy.

**Tradeoffs:** Polyrepo cô lập blast radius, nhân đôi tooling. Monorepo refactor atomic rẻ, policy review/CI khó hơn. Vue + React chung repo ổn nếu package không share runtime.

**Production gotchas:** Vite prebundle qua workspace package. TS project references stale. Nuxt/Nitro nhét package chỉ server vào client. Version lệch của package “internal” chưa từng được version.`,
    ),
    followUps: [
      l('How do you keep CI from building every package on a docs typo?', 'Bạn giữ CI khỏi build mọi package vì một typo docs thế nào?'),
      l('When would you split an app back out of the monorepo?', 'Khi nào bạn tách một app ra khỏi monorepo?'),
    ],
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
  q({
    id: 'adr-when-you-write-one',
    category: 'situational',
    tags: ['architecture', 'adr', 'leadership'],
    question: l('When does a senior write an ADR?', 'Khi nào một senior viết ADR?'),
    answer: l(
      `**What they actually ask:** Pinia vs Vuex — would you write an ADR, or only talk in Slack?

**How a senior answers:** Write one when the choice is **expensive to reverse** or will look random in six months: rendering model, state library, BFF vs FE aggregation, MF vs monorepo, cookie vs token, “why not GraphQL.” One to two pages: context, decision, alternatives, consequences. Status: proposed → accepted → superseded. Constraint: nobody reads novels; link it from the README and the PR.

**Failure mode:** An ADR for every rename. Beautiful docs nobody links. Using an ADR to **win after shipping**. Never superseding, so the repo lies.

**Measure:** Can a new hire find *why* Pinia / *why* \`routeRules\` / *why* no MF? Time spent re-litigating settled choices should drop.

**Tradeoffs:** Too many ADRs are noise; none is tribal knowledge in one head. Markdown in repo beats Confluence (it sits next to the code). A weekend prototype can stay a Slack thread until it graduates.

**Production gotchas:** Org announces MF while the ADR says no — update status. Decision without **owner** and review date. Disagree-and-commit: spike, named owner, then implement the chosen path.`,
      `**Họ thực sự hỏi:** Pinia vs Vuex — bạn viết ADR, hay chỉ nói trên Slack?

**Cách senior trả lời:** Viết khi lựa chọn **đắt để đảo** hoặc sáu tháng sau trông như ngẫu nhiên: model render, thư viện state, BFF vs gom ở FE, MF vs monorepo, cookie vs token, “vì sao không GraphQL.” Một đến hai trang: context, quyết định, phương án, hệ quả. Status: proposed → accepted → superseded. Constraint: không ai đọc tiểu thuyết; link từ README và PR.

**Failure mode:** ADR cho mỗi lần đổi tên. Doc đẹp không ai link. Dùng ADR để **thắng sau khi ship**. Không bao giờ superseded, repo nói dối.

**Measure:** Newbie tìm được *vì sao* Pinia / \`routeRules\` / không MF? Thời gian tranh cãi lại quyết định đã chốt phải giảm.

**Tradeoffs:** Quá nhiều ADR là nhiễu; không có là kiến thức trong đầu một người. Markdown trong repo hơn Confluence (nằm cạnh code). Prototype cuối tuần có thể ở Slack đến khi tốt nghiệp.

**Production gotchas:** Org tuyên bố MF trong khi ADR nói không — cập nhật status. Quyết định không **owner** và ngày review. Disagree-and-commit: spike, owner có tên, rồi làm đúng hướng đã chọn.`,
    ),
    followUps: [
      l('Show me an ADR you regret, and what you would write now.', 'Cho xem một ADR bạn hối, và giờ bạn sẽ viết gì.'),
      l('How do ADRs interact with RFCs and Jira on your team?', 'ADR tương tác với RFC và Jira trên team bạn thế nào?'),
    ],
  }),
  q({
    id: 'oauth-pkce-spa',
    category: 'situational',
    tags: ['auth', 'oauth', 'oidc', 'spa'],
    question: l(
      'How should a Vue/Nuxt SPA do OAuth/OIDC, and why PKCE?',
      'SPA Vue/Nuxt nên làm OAuth/OIDC thế nào, và vì sao PKCE?',
    ),
    answer: l(
      `**What they actually ask:** Implicit flow is dead — can you keep tokens off \`localStorage\` and still talk to an IdP?

**How a senior answers:** **Authorization Code + PKCE** for public clients (no client secret in the SPA). Decision: prefer a **BFF** (Nuxt/Nitro or Auth.js) that runs the code exchange and sets **httpOnly** session/refresh cookies; the browser never holds the IdP secret. Constraint: PKCE stops a stolen \`?code=\` from being exchanged without the code_verifier; it does **not** replace XSS hardening.

**Failure mode:** Implicit flow / tokens in the URL hash. Client secret in \`VITE_*\`. Access token in Pinia persist. Hidden-iframe silent refresh (third-party cookies are dead).

**Measure:** Auth code never logged. Refresh reuse detection. XSS tabletop: what is readable? Redirect URI allowlist includes only preview/prod hosts.

**Tradeoffs:** Pure SPA + PKCE + memory access is possible and CSRF-light; BFF is more moving parts and the senior default for cookie UX. Mobile/native uses the same PKCE idea with a different redirect.

**Production gotchas:** Preview \`redirect_uri\` mismatch. Clock skew on \`id_token\`. Mixing Google/Auth0 SDKs that still default to implicit. Step-up (WebAuthn) for money moves is separate from login.`,
      `**Họ thực sự hỏi:** Implicit đã chết — bạn giữ token khỏi \`localStorage\` và vẫn nói chuyện IdP được không?

**Cách senior trả lời:** **Authorization Code + PKCE** cho public client (không client secret trong SPA). Decision: ưu tiên **BFF** (Nuxt/Nitro hoặc Auth.js) đổi code và set cookie session/refresh **httpOnly**; browser không giữ secret IdP. Constraint: PKCE chặn \`?code=\` bị cướp đổi được nếu không có code_verifier; **không** thay hardening XSS.

**Failure mode:** Implicit / token trên URL hash. Client secret trong \`VITE_*\`. Access trong Pinia persist. Silent refresh iframe ẩn (cookie third-party đã chết).

**Measure:** Auth code không bao giờ bị log. Phát hiện reuse refresh. Bàn XSS: đọc được gì? Allowlist redirect URI chỉ host preview/prod.

**Tradeoffs:** SPA thuần + PKCE + access memory làm được và nhẹ CSRF; BFF nhiều bộ phận hơn và là default senior cho UX cookie. Mobile/native cùng ý PKCE, redirect khác.

**Production gotchas:** \`redirect_uri\` preview lệch. Lệch đồng hồ \`id_token\`. SDK Google/Auth0 vẫn default implicit. Step-up (WebAuthn) cho lệnh tiền tách khỏi login.`,
    ),
    followUps: [
      l('What does PKCE not protect you against?', 'PKCE không bảo vệ bạn khỏi điều gì?'),
      l('Why is a hidden iframe silent refresh a bad plan in 2026?', 'Vì sao silent refresh iframe ẩn là kế hoạch tệ năm 2026?'),
    ],
  }),
  q({
    id: 'service-worker-when-not',
    category: 'situational',
    tags: ['pwa', 'service-worker', 'caching'],
    question: l('When should you NOT add a service worker?', 'Khi nào bạn KHÔNG nên thêm service worker?'),
    answer: l(
      `**What they actually ask:** Offline is a product decision — not a Workbox checkbox. When does an SW make the app worse?

**How a senior answers:** Skip the SW when you have **no update UX**, **no kill switch**, personalized/auth HTML you might cache, A/B marketing HTML, or a team that will fight Vite HMR in dev. Decision: hashed statics can live on HTTP/CDN cache. Add an SW when offline/installability is a **named product** and you can precache revisioned assets + Network First for balances + never cache mutating APIs.

**Failure mode:** \`skipWaiting()\` + \`clients.claim()\` mid-form so two tabs run two bundles. Caching \`GET /api/me\` by URL. Caching \`index.html\` forever so users never get a new hashed bundle. Registering in Vite dev.

**Measure:** Canary that logged-in \`/api/me\` is **not** in Cache Storage. A header/kill-switch to unregister. “Refresh to update” actually used.

**Tradeoffs:** App-shell PWA vs “just installable.” Immediate activate is snappy and dangerous; a Vue banner is the senior default. Offline-first needs a write queue — if PM didn’t ask, don’t fake it.

**Production gotchas:** An SW is a persistent MITM on your origin — XSS that registers a hostile worker is a nightmare. iOS eviction. Captive-portal HTML 200 poisoning the API cache.`,
      `**Họ thực sự hỏi:** Offline là quyết định product — không phải checkbox Workbox. Khi nào SW làm app tệ hơn?

**Cách senior trả lời:** Bỏ SW khi **không có UX update**, **không có kill switch**, HTML cá nhân/auth có thể bị cache, HTML marketing A/B, hoặc team sẽ đánh nhau với Vite HMR lúc dev. Decision: static hash sống ổn trên HTTP/CDN. Thêm SW khi offline/cài được là **product có tên** và bạn precache asset có revision + Network First cho số dư + không cache API mutation.

**Failure mode:** \`skipWaiting()\` + \`clients.claim()\` giữa form nên hai tab chạy hai bundle. Cache \`GET /api/me\` theo URL. Cache \`index.html\` mãi nên user không nhận bundle hash mới. Đăng ký trong Vite dev.

**Measure:** Canary \`/api/me\` đã login **không** nằm Cache Storage. Header/kill-switch để unregister. Banner “Refresh to update” thật sự được dùng.

**Tradeoffs:** PWA app-shell vs “chỉ cài được.” Activate ngay thì nhanh và nguy hiểm; banner Vue là default senior. Offline-first cần hàng đợi ghi — PM không hỏi thì đừng giả.

**Production gotchas:** SW là MITM bền trên origin — XSS đăng ký worker địch là ác mộng. iOS eviction. HTML 200 captive portal đầu độc cache API.`,
    ),
    followUps: [
      l('Which Workbox strategy for hashed JS vs /api/account vs checkout POST?', 'Workbox strategy nào cho JS đã hash vs /api/account vs checkout POST?'),
      l('How do you ship a kill switch that unregisters a bad service worker?', 'Bạn ship kill switch unregister service worker xấu thế nào?'),
    ],
  }),
]
