type LocalizedText = {
  en: string
  vi: string
}

type StudyLink =
  | {
      kind: 'docs'
      slug: string
      label: LocalizedText
    }
  | {
      kind: 'plan'
      path: string
      label: LocalizedText
    }

type QuestionLink = {
  id: string
  label: LocalizedText
}

type AlgoTask = {
  path: string
  label: LocalizedText
}

export type StudyPlanWeek = {
  week: number
  title: LocalizedText
  range: LocalizedText
  goal: LocalizedText
  outcomes: LocalizedText[]
}

export type StudyPlanDayContent = {
  day: number
  week: number
  title: LocalizedText
  goal: LocalizedText
  studyLinks: StudyLink[]
  questionLinks: QuestionLink[]
  handsOn: LocalizedText[]
  algorithm: AlgoTask
  checklist: LocalizedText[]
  note?: LocalizedText
}

function l(en: string, vi: string): LocalizedText {
  return { en, vi }
}

function doc(slug: string, en: string, vi: string): StudyLink {
  return {
    kind: 'docs',
    slug,
    label: l(en, vi),
  }
}

function plan(path: string, en: string, vi: string): StudyLink {
  return {
    kind: 'plan',
    path,
    label: l(en, vi),
  }
}

function qa(id: string, en: string, vi: string): QuestionLink {
  return {
    id,
    label: l(en, vi),
  }
}

function algo(day: number, en: string, vi: string): AlgoTask {
  return {
    path: `artifacts/algo/problems/day-${String(day).padStart(2, '0')}.md`,
    label: l(en, vi),
  }
}

export const PLAN_WEEKS: StudyPlanWeek[] = [
  {
    week: 1,
    title: l('Week 1 · Design systems + UI clarity', 'Tuần 1 · Design system + UI rõ ràng'),
    range: l('Days 01-07', 'Ngày 01-07'),
    goal: l(
      'Rebuild the visual and interaction foundation first: reusable primitives, clear states, responsive trade-offs, and keyboard-safe flows.',
      'Ôn lại nền tảng giao diện và tương tác trước: primitive dùng lại được, state rõ ràng, trade-off responsive hợp lý và flow an toàn cho keyboard.',
    ),
    outcomes: [
      l('Audit one real screen into tokens, primitives, and state patterns.', 'Mổ xẻ một màn hình thật thành token, primitive và pattern state.'),
      l('Practice design-system and UI/UX questions with concrete examples.', 'Luyện câu hỏi design system và UI/UX bằng ví dụ cụ thể.'),
      l('Keep the daily algorithm dose small and consistent.', 'Giữ nhịp thuật toán nhẹ nhưng đều mỗi ngày.'),
    ],
  },
  {
    week: 2,
    title: l('Week 2 · JS/TS + Vue/Nuxt refresh', 'Tuần 2 · Ôn JS/TS + Vue/Nuxt'),
    range: l('Days 08-14', 'Ngày 08-14'),
    goal: l(
      'Tighten the fundamentals Parker already uses in production so the interview answers sound sharp, not vague.',
      'Siết lại những phần Parker đã dùng trong production để câu trả lời phỏng vấn sắc và rõ, không bị chung chung.',
    ),
    outcomes: [
      l('Refresh JavaScript execution, async flows, and TypeScript design.', 'Ôn lại execution model của JavaScript, async flow và thiết kế TypeScript.'),
      l('Review Vue reactivity, composables, Nuxt rendering, and data fetching.', 'Ôn Vue reactivity, composable, rendering của Nuxt và data fetching.'),
      l('Translate real production experience into interview-ready explanations.', 'Biến kinh nghiệm production thành các câu trả lời sẵn sàng cho phỏng vấn.'),
    ],
  },
  {
    week: 3,
    title: l('Week 3 · React + Next.js from a Vue lens', 'Tuần 3 · React + Next.js theo góc nhìn Vue'),
    range: l('Days 15-21', 'Ngày 15-21'),
    goal: l(
      'Learn React and Next.js by mapping concepts from Vue/Nuxt, then prove the knowledge with a small App Router task.',
      'Học React và Next.js bằng cách map nguyên lý từ Vue/Nuxt, rồi chứng minh bằng một task nhỏ với App Router.',
    ),
    outcomes: [
      l('Cover hooks, state, effects, and client/server boundaries without bluffing.', 'Đi qua hooks, state, effects và ranh giới client/server mà không bluff.'),
      l('Give proper Next.js coverage: App Router, RSC, cache/revalidation, streaming, Server Actions, middleware, SEO, and deployment basics.', 'Phủ đủ Next.js: App Router, RSC, cache/revalidation, streaming, Server Actions, middleware, SEO và deployment basics.'),
      l('Build one small Next.js admin slice with layouts, loading/error states, and a client-side interactive island.', 'Dựng một slice admin nhỏ bằng Next.js với layout, loading/error state và một interactive island phía client.'),
    ],
  },
  {
    week: 4,
    title: l('Week 4 · System design + behavioral integration', 'Tuần 4 · Gắn system design với behavioral'),
    range: l('Days 22-28', 'Ngày 22-28'),
    goal: l(
      'Use the refreshed frontend depth to practice higher-level reasoning: architecture, trade-offs, delivery, and interview storytelling.',
      'Dùng nền frontend vừa ôn để luyện tư duy mức cao hơn: kiến trúc, trade-off, delivery và kể chuyện phỏng vấn.',
    ),
    outcomes: [
      l('Practice frontend system design on admin/dashboard-style problems.', 'Luyện frontend system design trên các bài toán kiểu admin/dashboard.'),
      l('Turn real project experience into strong senior-level stories.', 'Biến kinh nghiệm dự án thật thành story thể hiện seniority.'),
      l('Run the first full mock that mixes design, coding, and communication.', 'Chạy buổi mock đầu tiên kết hợp design, coding và communication.'),
    ],
  },
  {
    week: 5,
    title: l('Final days · Review + mock interview', 'Những ngày cuối · Review + mock interview'),
    range: l('Days 29-30', 'Ngày 29-30'),
    goal: l(
      'Close the loop with company-fit prep, final weak-spot review, and a full mock interview.',
      'Khép vòng bằng phần chuẩn bị company-fit, rà lại lỗ hổng cuối và một buổi mock interview hoàn chỉnh.',
    ),
    outcomes: [
      l('Polish the narrative around strengths, growth, and company fit.', 'Chốt cách kể về điểm mạnh, hướng phát triển và company fit.'),
      l('Use mock results to define the next 7-day follow-up list.', 'Dùng kết quả mock để chốt danh sách ôn tiếp 7 ngày sau.'),
    ],
  },
]

export const PLAN_GAPS: LocalizedText[] = [
  l(
    'There is no standalone design-system document under documents/, so Week 1 intentionally combines architecture, CSS layout, accessibility, and design-system Q&A.',
    'Trong documents/ chưa có một tài liệu design system riêng, nên Tuần 1 chủ động ghép architecture, CSS layout, accessibility và Q&A về design system.',
  ),
  l(
    'Algorithms live in the study-plan module, not the shared documents area, so the daily algo links point to plan resources instead of /docs.',
    'Phần thuật toán nằm trong module study-plan chứ không nằm ở khu documents dùng chung, nên link algo hằng ngày sẽ trỏ tới tài nguyên của plan thay vì /docs.',
  ),
  l(
    'The general Next.js document is useful but broad; the new Next.js Q&A links and the day-21 hands-on task fill the App Router and deployment-specific gaps.',
    'Tài liệu Next.js tổng quát là hữu ích nhưng còn khá rộng; phần Q&A Next.js mới và task hands-on ở ngày 21 dùng để lấp khoảng trống về App Router và deployment.',
  ),
]

export const PLAN_DAY_CONTENT: StudyPlanDayContent[] = [
  {
    day: 1,
    week: 1,
    title: l('Inventory the UI system', 'Kiểm kê hệ thống UI'),
    goal: l(
      'Start from one real screen and identify the tokens, primitives, and repeated states hidden inside it.',
      'Bắt đầu từ một màn hình thật và chỉ ra token, primitive và các state lặp lại đang ẩn bên trong.',
    ),
    studyLinks: [
      doc('architecture', 'Architecture notes', 'Tài liệu architecture'),
      doc('css-layout', 'CSS layout notes', 'Tài liệu CSS layout'),
      plan('capstone-brief.md', 'Capstone brief', 'Capstone brief'),
    ],
    questionLinks: [
      qa('design-system-strategy', 'Design system growth strategy', 'Chiến lược phát triển design system'),
      qa('css-layout-specificity', 'Senior-level CSS topics', 'Các chủ đề CSS quan trọng ở mức senior'),
    ],
    handsOn: [
      l('Pick one admin screen and list colors, spacing, typography, feedback states, and repeated component patterns.', 'Chọn một màn admin và liệt kê màu, spacing, typography, feedback state và pattern component lặp lại.'),
      l('Write a short note: which 3 primitives would you extract first and why?', 'Viết một note ngắn: 3 primitive nào nên tách ra trước và vì sao?'),
    ],
    algorithm: algo(1, 'Two Sum · Hash map warm-up', 'Two Sum · Khởi động với HashMap'),
    checklist: [
      l('One screen audited into tokens and primitives.', 'Đã mổ xẻ xong 1 màn hình thành token và primitive.'),
      l('At least 2 reusable states noted: loading / empty / error / success.', 'Đã ghi được ít nhất 2 state dùng lại: loading / empty / error / success.'),
      l('Algo passes and you can explain why HashMap wins over brute force.', 'Bài algo chạy đúng và giải thích được vì sao HashMap thắng brute force.'),
    ],
  },
  {
    day: 2,
    week: 1,
    title: l('Make UI states readable', 'Làm cho UI state dễ đọc'),
    goal: l(
      'Practice the product and UX judgment needed to keep complex screens understandable.',
      'Luyện product sense và UX judgment để giữ màn hình phức tạp vẫn dễ hiểu.',
    ),
    studyLinks: [
      doc('accessibility', 'Accessibility basics', 'Accessibility cơ bản'),
      doc('architecture', 'Architecture notes', 'Tài liệu architecture'),
      doc('practical-questions', 'Practical debugging notes', 'Tài liệu practical questions'),
    ],
    questionLinks: [
      qa('dashboard-15-apis', 'Dashboard with 15 APIs', 'Dashboard gọi 15 API'),
      qa('lazy-loading-tradeoffs', 'Lazy loading trade-offs', 'Trade-off của lazy loading'),
    ],
    handsOn: [
      l('Take one screen from Parker’s experience and redraw loading, empty, error, and permission-denied states.', 'Lấy một màn hình từ kinh nghiệm của Parker và vẽ lại loading, empty, error và permission-denied state.'),
      l('Rewrite the heading, primary action, and helper copy so the hierarchy is obvious in under 10 seconds.', 'Viết lại heading, primary action và helper copy sao cho nhìn dưới 10 giây là hiểu thứ tự ưu tiên.'),
    ],
    algorithm: algo(2, 'Valid Anagram · Frequency map', 'Valid Anagram · Frequency map'),
    checklist: [
      l('The screen has explicit state coverage, not just the happy path.', 'Màn hình đã có đủ state rõ ràng, không chỉ happy path.'),
      l('You can explain one UX trade-off with product impact, not taste only.', 'Giải thích được ít nhất 1 UX trade-off bằng product impact chứ không chỉ là gu.'),
      l('Algo passes with O(n) reasoning.', 'Bài algo chạy đúng với reasoning O(n).'),
    ],
  },
  {
    day: 3,
    week: 1,
    title: l('Accessible forms and feedback', 'Form dễ dùng và accessible'),
    goal: l(
      'Make form behavior explicit: labels, validation timing, and feedback that is understandable without guesswork.',
      'Làm cho hành vi của form trở nên rõ ràng: label, thời điểm validate và feedback dễ hiểu, không phải đoán.',
    ),
    studyLinks: [
      doc('accessibility', 'Accessibility basics', 'Accessibility cơ bản'),
      doc('javascript', 'JavaScript notes', 'Tài liệu JavaScript'),
      doc('web-apis', 'Web APIs notes', 'Tài liệu Web APIs'),
    ],
    questionLinks: [
      qa('accessibility-forms-keyboard', 'Forms and keyboard accessibility', 'Accessibility cho form và keyboard'),
      qa('semantic-html-vs-aria-bem', 'Semantic HTML vs ARIA', 'Semantic HTML và ARIA'),
    ],
    handsOn: [
      l('Choose one form flow and document: field, validation rule, error message, trigger timing, and disabled state.', 'Chọn một flow form và ghi lại: field, rule validate, error message, thời điểm kích hoạt và disabled state.'),
      l('Check whether keyboard-only and screen-reader users can understand the same flow.', 'Kiểm tra xem người dùng chỉ dùng keyboard hoặc screen reader có hiểu được flow tương tự không.'),
    ],
    algorithm: algo(3, 'Contains Duplicate · Set', 'Contains Duplicate · Set'),
    checklist: [
      l('Each field has a clear label and error rule.', 'Mỗi field đều có label và rule lỗi rõ ràng.'),
      l('Validation timing is intentional, not accidental.', 'Thời điểm validate là có chủ đích, không phải ngẫu nhiên.'),
      l('Algo is done and you can explain why Set is enough here.', 'Bài algo xong và giải thích được vì sao Set là đủ.'),
    ],
  },
  {
    day: 4,
    week: 1,
    title: l('Responsive data-heavy UI', 'Responsive cho UI nhiều dữ liệu'),
    goal: l(
      'Decide how a table-heavy admin flow should behave on smaller screens without making it unusable.',
      'Quyết định cách một flow admin nhiều bảng nên hoạt động trên màn hình nhỏ mà không làm nó vô dụng.',
    ),
    studyLinks: [
      doc('css-layout', 'CSS layout notes', 'Tài liệu CSS layout'),
      doc('performance', 'Performance notes', 'Tài liệu performance'),
      doc('architecture', 'Architecture notes', 'Tài liệu architecture'),
    ],
    questionLinks: [
      qa('table-50k-rows', 'Table with 50,000 rows', 'Table với 50.000 bản ghi'),
      qa('css-flexbox-vs-grid', 'Flexbox vs Grid', 'Flexbox hay Grid'),
    ],
    handsOn: [
      l('For one table screen, compare horizontal scroll, condensed columns, and card-on-mobile. Pick one default and explain why.', 'Với một màn bảng dữ liệu, so sánh scroll ngang, ẩn bớt cột và card-on-mobile. Chọn một mặc định và giải thích vì sao.'),
      l('List the actions that must stay visible on mobile and the ones that can move into an overflow menu.', 'Liệt kê action nào bắt buộc phải thấy trên mobile và action nào có thể đưa vào overflow menu.'),
    ],
    algorithm: algo(4, 'Group Anagrams · Hash map + sorted key', 'Group Anagrams · HashMap + sorted key'),
    checklist: [
      l('There is one chosen mobile strategy with trade-offs written down.', 'Đã có 1 chiến lược mobile được chọn kèm trade-off rõ ràng.'),
      l('Critical actions remain reachable on smaller screens.', 'Action quan trọng vẫn tới được trên màn hình nhỏ.'),
      l('Algo passes and you remember the grouping pattern.', 'Bài algo chạy đúng và nhớ được pattern gom nhóm.'),
    ],
  },
  {
    day: 5,
    week: 1,
    title: l('Keyboard-first interaction review', 'Review tương tác theo hướng keyboard-first'),
    goal: l(
      'Review interaction quality from the perspective of someone who cannot rely on a mouse.',
      'Review chất lượng tương tác theo góc nhìn của người không thể dựa vào chuột.',
    ),
    studyLinks: [
      doc('accessibility', 'Accessibility basics', 'Accessibility cơ bản'),
      doc('web-apis', 'Web APIs notes', 'Tài liệu Web APIs'),
      doc('architecture', 'Architecture notes', 'Tài liệu architecture'),
    ],
    questionLinks: [
      qa('accessibility-forms-keyboard', 'Forms and keyboard accessibility', 'Accessibility cho form và keyboard'),
      qa('lazy-loading-tradeoffs', 'Lazy loading trade-offs', 'Trade-off của lazy loading'),
    ],
    handsOn: [
      l('Run a keyboard-only pass on one real flow: Tab, Shift+Tab, Enter, Escape, and focus return.', 'Chạy một lượt keyboard-only trên một flow thật: Tab, Shift+Tab, Enter, Escape và focus return.'),
      l('Write down the top 3 keyboard or focus issues you would fix first.', 'Ghi lại 3 lỗi keyboard hoặc focus nên sửa trước.'),
    ],
    algorithm: algo(5, 'Top K Frequent Elements · Hash map + bucket', 'Top K Frequent Elements · HashMap + bucket'),
    checklist: [
      l('Keyboard order is documented for one real flow.', 'Đã ghi được thứ tự keyboard cho 1 flow thật.'),
      l('At least 1 focus bug is identified with a concrete fix.', 'Đã chỉ ra ít nhất 1 bug focus kèm hướng sửa cụ thể.'),
      l('Algo is green and the complexity trade-off is clear.', 'Bài algo xanh và trade-off độ phức tạp đã rõ.'),
    ],
  },
  {
    day: 6,
    week: 1,
    title: l('Component APIs with TypeScript', 'Thiết kế API component với TypeScript'),
    goal: l(
      'Design component props like a senior: predictable, typed, and hard to misuse.',
      'Thiết kế props của component theo kiểu senior: dễ đoán, có type và khó dùng sai.',
    ),
    studyLinks: [
      doc('typescript', 'TypeScript notes', 'Tài liệu TypeScript'),
      doc('architecture', 'Architecture notes', 'Tài liệu architecture'),
      doc('css-layout', 'CSS layout notes', 'Tài liệu CSS layout'),
    ],
    questionLinks: [
      qa('ts-designing-api-props', 'Designing TS types for props and APIs', 'Thiết kế type TS cho props và API'),
      qa('ts-generics', 'TypeScript generics', 'TypeScript generics'),
    ],
    handsOn: [
      l('Spec 3 core component APIs (for example Button, TextField, EmptyState) with props, variants, and misuse guardrails.', 'Spec 3 API component cốt lõi (ví dụ Button, TextField, EmptyState) gồm props, variant và guardrail chống dùng sai.'),
      l('Mark which props must stay simple and which ones should be extensible.', 'Đánh dấu prop nào phải giữ thật đơn giản và prop nào nên cho phép mở rộng.'),
    ],
    algorithm: algo(6, 'Valid Parentheses · Stack', 'Valid Parentheses · Stack'),
    checklist: [
      l('Three component APIs are typed and documented.', 'Ba API component đã được type và ghi chú rõ.'),
      l('At least one union or generic is used intentionally.', 'Có ít nhất một union hoặc generic được dùng có chủ đích.'),
      l('Algo is done and the stack pattern feels natural.', 'Bài algo xong và pattern stack đã thấy quen tay.'),
    ],
  },
  {
    day: 7,
    week: 1,
    title: l('Week 1 mini redesign', 'Mini redesign để chốt tuần 1'),
    goal: l(
      'Wrap the first week by turning all the design and UX notes into one coherent mini redesign.',
      'Khép tuần đầu bằng cách gom toàn bộ note về design và UX thành một mini redesign liền mạch.',
    ),
    studyLinks: [
      plan('self-check-questions.md', 'Self-check questions', 'Self-check questions'),
      plan('feature-template.md', 'Feature template', 'Feature template'),
      doc('leadership', 'Leadership notes', 'Tài liệu leadership'),
    ],
    questionLinks: [
      qa('design-system-strategy', 'Design system growth strategy', 'Chiến lược phát triển design system'),
      qa('tradeoff-example', 'A technical trade-off story', 'Một ví dụ technical trade-off'),
    ],
    handsOn: [
      l('Pick one screen from days 1-6 and produce a single-page redesign note: structure, state coverage, accessibility, and responsive behavior.', 'Chọn một màn từ ngày 1-6 và viết một note redesign 1 trang: cấu trúc, state coverage, accessibility và responsive behavior.'),
      l('End by saying what you would ship now vs later if time is tight.', 'Kết thúc bằng việc nói rõ cái gì ship ngay và cái gì để sau nếu thời gian gấp.'),
    ],
    algorithm: algo(7, 'Week 1 timed review', 'Review tính giờ của tuần 1'),
    checklist: [
      l('Your redesign note shows priorities, not just a wishlist.', 'Note redesign thể hiện thứ tự ưu tiên, không chỉ là wishlist.'),
      l('You can explain one trade-off out loud in under 2 minutes.', 'Giải thích được ít nhất 1 trade-off trong dưới 2 phút.'),
      l('Timed algo review is complete.', 'Đã xong phần algo review tính giờ.'),
    ],
  },
  {
    day: 8,
    week: 2,
    title: l('JavaScript execution model', 'Execution model của JavaScript'),
    goal: l(
      'Refresh the JavaScript mental model that sits underneath frontend debugging interviews.',
      'Ôn lại mental model JavaScript nằm bên dưới các câu hỏi debug frontend.',
    ),
    studyLinks: [
      doc('javascript', 'JavaScript notes', 'Tài liệu JavaScript'),
      doc('web-apis', 'Web APIs notes', 'Tài liệu Web APIs'),
      doc('practical-questions', 'Practical debugging notes', 'Tài liệu practical questions'),
    ],
    questionLinks: [
      qa('js-event-loop', 'The event loop', 'Event loop'),
      qa('js-closures', 'Closures', 'Closure'),
      qa('js-hoisting-tdz', 'Hoisting and TDZ', 'Hoisting và TDZ'),
    ],
    handsOn: [
      l('Write 3 interview snippets involving setTimeout, Promise, and closure capture. Predict the output before running them.', 'Viết 3 snippet phỏng vấn có setTimeout, Promise và closure capture. Đoán output trước khi chạy.'),
      l('For each snippet, explain the output in plain language, not jargon only.', 'Với mỗi snippet, giải thích output bằng ngôn ngữ dễ hiểu chứ không chỉ jargon.'),
    ],
    algorithm: algo(8, 'Binary Search · Search on sorted data', 'Binary Search · Tìm trên dữ liệu đã sort'),
    checklist: [
      l('You can explain one event-loop snippet step by step.', 'Giải thích được từng bước của một snippet event loop.'),
      l('Closures and TDZ feel concrete again, not fuzzy.', 'Closure và TDZ đã trở nên cụ thể lại, không còn mơ hồ.'),
      l('Algo is done with O(log n) reasoning.', 'Bài algo xong với reasoning O(log n).'),
    ],
  },
  {
    day: 9,
    week: 2,
    title: l('Promises, fetch, and browser events', 'Promise, fetch và event trong browser'),
    goal: l(
      'Sharpen async reasoning so network and UI behavior sound production-ready in interviews.',
      'Mài sắc cách nghĩ về async để khi nói về network và UI behavior nghe giống kinh nghiệm production.',
    ),
    studyLinks: [
      doc('javascript', 'JavaScript notes', 'Tài liệu JavaScript'),
      doc('networking', 'Networking notes', 'Tài liệu networking'),
      doc('web-apis', 'Web APIs notes', 'Tài liệu Web APIs'),
    ],
    questionLinks: [
      qa('js-promise-combinators', 'Promise combinators', 'Các Promise combinator'),
      qa('promise-basics', 'Promise basics', 'Promise là gì'),
      qa('dom-event-propagation-delegation', 'Event propagation and delegation', 'Event propagation và delegation'),
    ],
    handsOn: [
      l('Compare Promise.all vs allSettled vs race on one realistic frontend case such as dashboard widgets or parallel lookups.', 'So sánh Promise.all, allSettled và race trên một case frontend thực tế như dashboard widget hoặc lookup song song.'),
      l('Sketch how you would cancel or ignore stale responses in a search flow.', 'Phác thảo cách huỷ hoặc bỏ qua response stale trong một flow search.'),
    ],
    algorithm: algo(9, 'Two Sum II · Two pointers', 'Two Sum II · Two pointers'),
    checklist: [
      l('You know when failure of one request should block the whole UI and when it should not.', 'Biết khi nào lỗi của một request nên chặn toàn bộ UI và khi nào thì không.'),
      l('Event propagation and delegation are explainable with one DOM example.', 'Giải thích được event propagation và delegation bằng một ví dụ DOM.'),
      l('Algo is done and the two-pointer pattern is clear.', 'Bài algo xong và pattern two pointers đã rõ.'),
    ],
  },
  {
    day: 10,
    week: 2,
    title: l('TypeScript for real frontend models', 'TypeScript cho model frontend thực tế'),
    goal: l(
      'Review the TypeScript tools that matter most when shaping API responses, UI state, and component props.',
      'Ôn lại những công cụ TypeScript quan trọng nhất khi model API response, UI state và component props.',
    ),
    studyLinks: [
      doc('typescript', 'TypeScript notes', 'Tài liệu TypeScript'),
      doc('networking', 'Networking notes', 'Tài liệu networking'),
      doc('architecture', 'Architecture notes', 'Tài liệu architecture'),
    ],
    questionLinks: [
      qa('ts-narrowing-typeguards', 'Narrowing and type guards', 'Narrowing và type guard'),
      qa('ts-utility-types', 'Utility types', 'Utility types'),
      qa('ts-designing-api-props', 'Designing TS types for props and APIs', 'Thiết kế type TS cho props và API'),
    ],
    handsOn: [
      l('Model one admin flow with DTO, UI model, mutation payload, and error state types.', 'Model một admin flow với DTO, UI model, mutation payload và error state type.'),
      l('Write down where you want strictness and where flexibility is acceptable.', 'Ghi rõ chỗ nào cần strict và chỗ nào có thể cho phép linh hoạt hơn.'),
    ],
    algorithm: algo(10, 'Longest Substring Without Repeating Characters', 'Longest Substring Without Repeating Characters'),
    checklist: [
      l('You have one concrete type model for a real flow.', 'Đã có một type model cụ thể cho một flow thật.'),
      l('At least one guard or utility type is used on purpose.', 'Ít nhất một guard hoặc utility type được dùng có chủ đích.'),
      l('Algo is complete and the sliding-window pattern is understandable.', 'Bài algo hoàn tất và pattern sliding window đã hiểu được.'),
    ],
  },
  {
    day: 11,
    week: 2,
    title: l('Vue reactivity and composables', 'Vue reactivity và composable'),
    goal: l(
      'Turn everyday Vue knowledge into crisp interview explanations with trade-offs and boundaries.',
      'Biến kiến thức Vue hằng ngày thành các câu trả lời phỏng vấn gọn, rõ và có trade-off.',
    ),
    studyLinks: [
      doc('vue3', 'Vue 3 notes', 'Tài liệu Vue 3'),
      doc('state-management', 'State management notes', 'Tài liệu state management'),
      doc('performance', 'Performance notes', 'Tài liệu performance'),
    ],
    questionLinks: [
      qa('vue-reactivity-internals', 'Vue 3 reactivity internals', 'Cơ chế reactivity của Vue 3'),
      qa('vue-ref-vs-reactive', 'ref vs reactive', 'ref hay reactive'),
      qa('vue-composables', 'What makes a good composable?', 'Composable tốt là như thế nào'),
    ],
    handsOn: [
      l('Explain one real feature you built using ref/reactive/computed/watch, then rewrite the explanation as if an interviewer asked “why this design?”.', 'Giải thích một feature thật bạn đã làm với ref/reactive/computed/watch, rồi viết lại câu trả lời theo kiểu interviewer hỏi “vì sao thiết kế như vậy?”.'),
      l('Review one composable you wrote before and identify whether it owns state, side effects, or both.', 'Review một composable bạn từng viết và xác định nó đang sở hữu state, side effect hay cả hai.'),
    ],
    algorithm: algo(11, 'Min Stack · Stack design', 'Min Stack · Thiết kế stack'),
    checklist: [
      l('You can explain Vue reactivity without hand-waving.', 'Giải thích được Vue reactivity mà không nói chung chung.'),
      l('One composable review is done with clearer boundaries.', 'Đã review xong một composable với boundary rõ hơn.'),
      l('Algo is done and the “supporting stack” pattern is clear.', 'Bài algo xong và pattern dùng stack phụ đã rõ.'),
    ],
  },
  {
    day: 12,
    week: 2,
    title: l('Nuxt rendering and data fetching', 'Rendering và data fetching trong Nuxt'),
    goal: l(
      'Review Nuxt as an interview topic, not just as familiar daily tooling.',
      'Ôn Nuxt như một chủ đề phỏng vấn, không chỉ như tool quen tay hằng ngày.',
    ),
    studyLinks: [
      doc('nuxt', 'Nuxt notes', 'Tài liệu Nuxt'),
      doc('networking', 'Networking notes', 'Tài liệu networking'),
      doc('performance', 'Performance notes', 'Tài liệu performance'),
    ],
    questionLinks: [
      qa('nuxt-rendering-modes', 'Nuxt rendering modes', 'Các chế độ render của Nuxt'),
      qa('nuxt-data-fetching', 'Nuxt 3 data fetching', 'Data fetching trong Nuxt 3'),
      qa('vue-ssr-hydration', 'SSR and hydration pitfalls', 'SSR và lỗi hydration'),
    ],
    handsOn: [
      l('Take one screen and decide whether it should be SSR, prerendered, or client-heavy in Nuxt. Explain why.', 'Chọn một màn hình và quyết định nó nên SSR, prerender hay thiên về client trong Nuxt. Giải thích vì sao.'),
      l('Write one short answer for: “When would you use useFetch, useAsyncData, or plain client fetch?”', 'Viết một câu trả lời ngắn cho: “Khi nào dùng useFetch, useAsyncData hoặc plain client fetch?”'),
    ],
    algorithm: algo(12, 'Reverse Linked List', 'Reverse Linked List'),
    checklist: [
      l('One rendering-mode decision is written with trade-offs.', 'Đã viết ra một quyết định về rendering mode kèm trade-off.'),
      l('Nuxt fetching choices are explainable by context.', 'Giải thích được lựa chọn data fetching của Nuxt theo từng context.'),
      l('Algo is done and linked-list pointer movement is comfortable.', 'Bài algo xong và thao tác pointer trên linked list đã bớt lúng túng.'),
    ],
  },
  {
    day: 13,
    week: 2,
    title: l('State ownership, Pinia, and cache boundaries', 'State ownership, Pinia và cache boundary'),
    goal: l(
      'Clarify what belongs in component state, URL state, server cache, and app-level stores.',
      'Làm rõ thứ gì nên nằm ở component state, URL state, server cache hay app-level store.',
    ),
    studyLinks: [
      doc('state-management', 'State management notes', 'Tài liệu state management'),
      doc('nuxt', 'Nuxt notes', 'Tài liệu Nuxt'),
      doc('monitoring', 'Monitoring notes', 'Tài liệu monitoring'),
    ],
    questionLinks: [
      qa('pinia-design', 'What belongs in Pinia?', 'Cái gì nên đưa vào Pinia?'),
      qa('nuxt-route-rules-caching', 'Nuxt route rules and caching', 'Route rules và caching của Nuxt'),
      qa('role-permission-ui', 'Role and permission handling in UI', 'Thiết kế role/permission trong UI'),
    ],
    handsOn: [
      l('Draw a state map for one flow: who owns it, who reads it, and how stale data is refreshed.', 'Vẽ state map cho một flow: ai sở hữu, ai đọc và dữ liệu stale được làm mới ra sao.'),
      l('Mark one piece of state that should move out of the store and one that should move into a shared layer.', 'Đánh dấu một state nên đưa ra khỏi store và một state nên đưa vào layer dùng chung.'),
    ],
    algorithm: algo(13, 'Linked List Cycle · Floyd pointers', 'Linked List Cycle · Floyd pointers'),
    checklist: [
      l('The state map has a clear source of truth.', 'State map có source of truth rõ ràng.'),
      l('Store vs cache vs URL choices are written down.', 'Đã ghi rõ quyết định store vs cache vs URL.'),
      l('Algo is done and the Floyd pattern makes sense.', 'Bài algo xong và pattern Floyd đã thấy hợp lý.'),
    ],
  },
  {
    day: 14,
    week: 2,
    title: l('Performance and debugging review', 'Review performance và debugging'),
    goal: l(
      'Finish the fundamentals review by linking performance signals to actual debugging and user impact.',
      'Khép phần fundamentals bằng cách nối tín hiệu performance với debug thực tế và impact tới user.',
    ),
    studyLinks: [
      doc('performance', 'Performance notes', 'Tài liệu performance'),
      doc('monitoring', 'Monitoring notes', 'Tài liệu monitoring'),
      doc('practical-questions', 'Practical debugging notes', 'Tài liệu practical questions'),
    ],
    questionLinks: [
      qa('vue-performance-patterns', 'Vue performance patterns', 'Pattern performance trong Vue'),
      qa('core-web-vitals', 'Core Web Vitals', 'Core Web Vitals'),
      qa('perf-issue-story', 'Performance issue investigation story', 'Câu chuyện điều tra performance issue'),
    ],
    handsOn: [
      l('Take one production issue you remember and retell it using symptom → measurement → root cause → fix → regression guard.', 'Lấy một production issue bạn từng gặp và kể lại theo symptom → measurement → root cause → fix → regression guard.'),
      l('Write down which metric or signal you would watch first next time.', 'Viết lại metric hoặc tín hiệu nào bạn sẽ nhìn đầu tiên nếu gặp lại lần sau.'),
    ],
    algorithm: algo(14, 'Week 2 timed review', 'Review tính giờ của tuần 2'),
    checklist: [
      l('One performance story is now interview-ready.', 'Một câu chuyện performance đã ở trạng thái interview-ready.'),
      l('You can connect a metric to a user-facing symptom.', 'Nối được một metric với triệu chứng user-facing.'),
      l('Timed algo review is complete.', 'Đã xong phần algo review tính giờ.'),
    ],
  },
  {
    day: 15,
    week: 3,
    title: l('React mental model for a Vue dev', 'Mental model React cho người đi từ Vue'),
    goal: l(
      'Start React the honest way: concept transfer, not pretending the frameworks are the same.',
      'Bắt đầu React theo cách trung thực: chuyển nguyên lý, không giả vờ hai framework là một.',
    ),
    studyLinks: [
      doc('react', 'React notes', 'Tài liệu React'),
      doc('state-management-react', 'React state-management notes', 'Tài liệu state management cho React'),
      plan('react-next-track.md', 'React / Next track', 'React / Next track'),
    ],
    questionLinks: [
      qa('learning-react-as-vue-dev', 'Explaining the React learning journey', 'Giải thích hành trình học React từ Vue'),
      qa('react-rerender-model-vs-vue', 'React re-render model vs Vue', 'React re-render model so với Vue'),
      qa('react-props-state-lifecycle-hooks', 'Props, state, and lifecycle with hooks', 'Props, state và “lifecycle bằng hooks”'),
    ],
    handsOn: [
      l('Write a Vue → React comparison note for state, derived state, side effects, and composition.', 'Viết một note so sánh Vue → React cho state, derived state, side effects và composition.'),
      l('Explain where React feels more manual than Vue and where that manual control is useful.', 'Giải thích React “thủ công” hơn Vue ở đâu và khi nào sự thủ công đó lại có ích.'),
    ],
    algorithm: algo(15, 'Binary Tree Level Order Traversal · BFS', 'Binary Tree Level Order Traversal · BFS'),
    checklist: [
      l('Your React story sounds honest and confident, not apologetic.', 'Story về React nghe trung thực và tự tin, không mang giọng xin lỗi.'),
      l('You can compare one real concept across Vue and React.', 'So sánh được một khái niệm thật giữa Vue và React.'),
      l('Algo is done and BFS queue usage is solid.', 'Bài algo xong và cách dùng queue cho BFS đã chắc hơn.'),
    ],
  },
  {
    day: 16,
    week: 3,
    title: l('State, refs, and controlled inputs in React', 'State, ref và controlled input trong React'),
    goal: l(
      'Cover the React basics interviewers expect before jumping into Next.js.',
      'Đi qua phần React cơ bản mà interviewer mong đợi trước khi nhảy sang Next.js.',
    ),
    studyLinks: [
      doc('react', 'React notes', 'Tài liệu React'),
      doc('state-management-react', 'React state-management notes', 'Tài liệu state management cho React'),
      doc('typescript', 'TypeScript notes', 'Tài liệu TypeScript'),
    ],
    questionLinks: [
      qa('react-usestate-useref', 'useState vs useRef', 'useState hay useRef'),
      qa('react-controlled-vs-uncontrolled', 'Controlled vs uncontrolled components', 'Controlled và uncontrolled component'),
      qa('react-context-limits', 'React Context limits', 'Giới hạn của React Context'),
    ],
    handsOn: [
      l('Build or review a small form and identify what should be state, ref, derived value, and lifted state.', 'Dựng hoặc review một form nhỏ rồi chỉ ra phần nào nên là state, ref, derived value và lifted state.'),
      l('Write one rule of thumb for when you would stop using Context and move to another tool.', 'Viết một rule of thumb cho thời điểm nên dừng Context và chuyển sang tool khác.'),
    ],
    algorithm: algo(16, 'Maximum Depth of Binary Tree · DFS', 'Maximum Depth of Binary Tree · DFS'),
    checklist: [
      l('You can explain state vs ref with a concrete case.', 'Giải thích được state và ref bằng một case cụ thể.'),
      l('The form example shows controlled-input reasoning, not memorized API usage.', 'Ví dụ form thể hiện được reasoning về controlled input, không chỉ là nhớ API.'),
      l('Algo is done and DFS recursion still feels comfortable.', 'Bài algo xong và recursion kiểu DFS vẫn còn thoải mái.'),
    ],
  },
  {
    day: 17,
    week: 3,
    title: l('Effects, async cleanup, and error boundaries', 'Effect, cleanup async và error boundary'),
    goal: l(
      'Review the React concepts that most often cause bugs or shallow answers in interviews.',
      'Ôn lại những khái niệm React dễ gây bug hoặc dễ bị trả lời nông trong phỏng vấn.',
    ),
    studyLinks: [
      doc('react', 'React notes', 'Tài liệu React'),
      doc('javascript', 'JavaScript notes', 'Tài liệu JavaScript'),
      doc('practical-questions', 'Practical debugging notes', 'Tài liệu practical questions'),
    ],
    questionLinks: [
      qa('useeffect', 'useEffect', 'useEffect'),
      qa('error-boundary-limits', 'Error Boundary limits', 'Giới hạn của Error Boundary'),
      qa('perf-issue-story', 'Performance or bug investigation story', 'Story điều tra bug hoặc performance'),
    ],
    handsOn: [
      l('Review one effect and ask: what triggers it, how is stale work cancelled, and what happens on rapid input or unmount?', 'Review một effect và hỏi: cái gì kích hoạt nó, stale work bị huỷ thế nào và chuyện gì xảy ra khi input nhanh hoặc unmount?'),
      l('Write one short explanation for why Error Boundaries do not replace API error handling.', 'Viết một câu ngắn giải thích vì sao Error Boundary không thay thế cho xử lý lỗi API.'),
    ],
    algorithm: algo(17, 'Lowest Common Ancestor of a BST', 'Lowest Common Ancestor of a BST'),
    checklist: [
      l('You can describe one good and one bad useEffect pattern.', 'Nói được một pattern useEffect tốt và một pattern useEffect tệ.'),
      l('Error Boundaries are now tied to real limitations, not a vague definition.', 'Error Boundary giờ gắn với giới hạn thật chứ không còn là định nghĩa mơ hồ.'),
      l('Algo is done and BST properties are used correctly.', 'Bài algo xong và dùng đúng tính chất của BST.'),
    ],
  },
  {
    day: 18,
    week: 3,
    title: l('App Router, layouts, loading, and errors', 'App Router, layout, loading và error'),
    goal: l(
      'Understand the App Router as a system: routing, nested layouts, segment-level loading, and error boundaries.',
      'Hiểu App Router như một hệ thống: routing, nested layout, loading theo segment và error boundary.',
    ),
    studyLinks: [
      doc('nextjs', 'Next.js notes', 'Tài liệu Next.js'),
      doc('nuxt', 'Nuxt notes', 'Tài liệu Nuxt'),
      doc('react', 'React notes', 'Tài liệu React'),
    ],
    questionLinks: [
      qa('next-app-router-rsc', 'What App Router and RSC solve', 'App Router và RSC giải bài toán gì'),
      qa('next-app-router-layouts-loading-error', 'App Router layouts, routing, loading, and error states', 'App Router: layout, routing, loading và error state'),
      qa('next-server-client-components', 'Server vs Client Components', 'Server Component và Client Component'),
    ],
    handsOn: [
      l('Sketch a tiny Next app tree with root layout, dashboard layout, one page, loading.tsx, and error.tsx.', 'Vẽ cây thư mục cho một app Next nhỏ với root layout, dashboard layout, một page, loading.tsx và error.tsx.'),
      l('For each file, write the Nuxt 3 idea it most closely matches.', 'Với mỗi file, ghi lại khái niệm Nuxt 3 gần nhất mà nó map tới.'),
    ],
    algorithm: algo(18, 'Number of Islands · Grid BFS/DFS', 'Number of Islands · Grid BFS/DFS'),
    checklist: [
      l('You can explain nested layouts and segment-level loading without looking up the docs.', 'Giải thích được nested layout và loading theo segment mà không cần mở docs.'),
      l('The Server vs Client boundary is clearer than “interactive = client”.', 'Ranh giới Server vs Client rõ hơn mức “interactive thì client”.'),
      l('Algo is done and grid traversal still feels okay.', 'Bài algo xong và thao tác duyệt grid vẫn ổn.'),
    ],
  },
  {
    day: 19,
    week: 3,
    title: l('Next data fetching, cache, and rendering modes', 'Data fetching, cache và rendering mode của Next'),
    goal: l(
      'Cover the Next.js topics that usually reveal whether someone only skimmed the framework or really understands it.',
      'Ôn các chủ đề Next.js thường bộc lộ ngay việc một người chỉ lướt qua hay đã hiểu framework thật sự.',
    ),
    studyLinks: [
      doc('nextjs', 'Next.js notes', 'Tài liệu Next.js'),
      doc('networking', 'Networking notes', 'Tài liệu networking'),
      doc('nuxt', 'Nuxt notes', 'Tài liệu Nuxt'),
    ],
    questionLinks: [
      qa('next-data-fetching-cache-revalidation', 'Next data fetching, cache, and revalidation', 'Data fetching, cache và revalidation trong Next'),
      qa('next-rendering-modes-streaming', 'SSR, SSG, ISR, and streaming in Next', 'SSR, SSG, ISR và streaming trong Next'),
      qa('nuxt-data-fetching', 'Nuxt data fetching as a comparison point', 'Data fetching của Nuxt để so sánh'),
    ],
    handsOn: [
      l('Write a comparison table: useAsyncData/useFetch in Nuxt vs server fetch / no-store / revalidate in Next.', 'Viết bảng so sánh: useAsyncData/useFetch của Nuxt với server fetch / no-store / revalidate của Next.'),
      l('For three page types (marketing, admin list, personalized detail), choose SSR/SSG/ISR/streaming and explain why.', 'Với ba loại trang (marketing, admin list, personalized detail), chọn SSR/SSG/ISR/streaming và giải thích vì sao.'),
    ],
    algorithm: algo(19, 'Climbing Stairs · DP', 'Climbing Stairs · DP'),
    checklist: [
      l('Cache vs fresh data decisions are written by page type.', 'Quyết định cache vs fresh data đã được ghi theo từng loại trang.'),
      l('Streaming and ISR no longer sound like buzzwords only.', 'Streaming và ISR không còn chỉ là buzzword.'),
      l('Algo is done and the DP recurrence is clear.', 'Bài algo xong và recurrence của DP đã rõ.'),
    ],
  },
  {
    day: 20,
    week: 3,
    title: l('Server Actions, middleware, SEO, and assets', 'Server Actions, middleware, SEO và tối ưu asset'),
    goal: l(
      'Round out the practical Next.js topics that often show up in senior frontend interviews.',
      'Bổ sung những chủ đề Next.js thực dụng thường xuất hiện trong phỏng vấn senior frontend.',
    ),
    studyLinks: [
      doc('nextjs', 'Next.js notes', 'Tài liệu Next.js'),
      doc('security', 'Security notes', 'Tài liệu security'),
      doc('build-tools', 'Build tools notes', 'Tài liệu build tools'),
    ],
    questionLinks: [
      qa('next-server-actions', 'Server Actions', 'Server Actions'),
      qa('next-middleware-use-cases', 'Next middleware use cases and limits', 'Use case và giới hạn của middleware trong Next'),
      qa('next-metadata-image-font-deployment', 'Metadata, SEO, image/font optimization, and deployment basics', 'Metadata, SEO, tối ưu image/font và deployment basics'),
    ],
    handsOn: [
      l('List which parts of a small admin flow belong in Server Actions, Route Handlers, or plain client mutations.', 'Liệt kê phần nào của một flow admin nhỏ nên nằm ở Server Actions, Route Handlers hay mutation phía client.'),
      l('Write a deployment checklist: env vars, caching assumptions, image/font usage, and what to verify after deploy.', 'Viết một deployment checklist: env vars, giả định về cache, dùng image/font thế nào và cần verify gì sau deploy.'),
    ],
    algorithm: algo(20, 'Coin Change · DP', 'Coin Change · DP'),
    checklist: [
      l('You can explain when Server Actions simplify a flow and when they do not.', 'Giải thích được khi nào Server Actions làm flow đơn giản hơn và khi nào thì không.'),
      l('Middleware, SEO, and asset optimization are tied to concrete use cases.', 'Middleware, SEO và tối ưu asset đã gắn với use case cụ thể.'),
      l('Algo is done and the DP state choice is explainable.', 'Bài algo xong và giải thích được cách chọn state cho DP.'),
    ],
  },
  {
    day: 21,
    week: 3,
    title: l('Small Next.js hands-on task', 'Hands-on nhỏ với Next.js'),
    goal: l(
      'Prove the theory with one small App Router task that touches both server and client concerns.',
      'Chứng minh phần lý thuyết bằng một task App Router nhỏ chạm vào cả concern phía server và client.',
    ),
    studyLinks: [
      doc('nextjs', 'Next.js notes', 'Tài liệu Next.js'),
      doc('devops', 'DevOps notes', 'Tài liệu DevOps'),
      doc('monitoring', 'Monitoring notes', 'Tài liệu monitoring'),
    ],
    questionLinks: [
      qa('next-app-router-rsc', 'What App Router and RSC solve', 'App Router và RSC giải bài toán gì'),
      qa('next-data-fetching-cache-revalidation', 'Next data fetching, cache, and revalidation', 'Data fetching, cache và revalidation trong Next'),
      qa('next-metadata-image-font-deployment', 'SEO, image/font optimization, and deployment basics', 'SEO, tối ưu image/font và deployment basics'),
    ],
    handsOn: [
      l('Build a tiny `/customers` route in a Next lab: root layout, dashboard layout, server-fetched list page, one small client filter, loading.tsx, error.tsx, and page metadata.', 'Dựng một route `/customers` nhỏ trong lab Next: root layout, dashboard layout, list page fetch ở server, một bộ lọc nhỏ phía client, loading.tsx, error.tsx và metadata cho page.'),
      l('After it works, write 5 lines comparing the same slice in Nuxt 3.', 'Sau khi chạy được, viết 5 dòng so sánh cùng slice đó nếu làm bằng Nuxt 3.'),
    ],
    algorithm: algo(21, 'Week 3 timed review', 'Review tính giờ của tuần 3'),
    checklist: [
      l('The Next.js slice actually runs, even if tiny.', 'Slice Next.js chạy được thật, dù scope nhỏ.'),
      l('The Nuxt ↔ Next comparison is written from experience, not copied from docs.', 'Phần so sánh Nuxt ↔ Next được viết từ trải nghiệm, không phải chép docs.'),
      l('Timed algo review is complete.', 'Đã xong phần algo review tính giờ.'),
    ],
    note: l(
      'Keep the task small. The goal is concept transfer and confidence, not building a full product.',
      'Giữ task nhỏ. Mục tiêu là chuyển nguyên lý và xây tự tin, không phải dựng cả sản phẩm.',
    ),
  },
  {
    day: 22,
    week: 4,
    title: l('Design an admin dashboard', 'Thiết kế một admin dashboard'),
    goal: l(
      'Move up one level: orchestrate APIs, loading behavior, failure isolation, and observability for a real frontend surface.',
      'Nâng lên một mức: điều phối API, loading behavior, cô lập lỗi và observability cho một bề mặt frontend thật.',
    ),
    studyLinks: [
      doc('system-design', 'System design notes', 'Tài liệu system design'),
      doc('architecture', 'Architecture notes', 'Tài liệu architecture'),
      doc('monitoring', 'Monitoring notes', 'Tài liệu monitoring'),
    ],
    questionLinks: [
      qa('dashboard-15-apis', 'Dashboard with 15 APIs', 'Dashboard gọi 15 API'),
      qa('bff-when', 'When to introduce a BFF', 'Khi nào nên thêm BFF'),
      qa('observability-frontend', 'Good frontend observability', 'Frontend observability tốt trông như thế nào'),
    ],
    handsOn: [
      l('Take one admin/dashboard idea and outline widgets, API dependencies, failure boundaries, and which data can arrive progressively.', 'Chọn một ý tưởng admin/dashboard và vẽ ra widget, phụ thuộc API, boundary của lỗi và phần data nào có thể hiện dần.'),
      l('State whether a BFF is justified or whether better API contracts are enough.', 'Kết luận xem có cần BFF thật hay chỉ cần API contract tốt hơn là đủ.'),
    ],
    algorithm: algo(22, 'House Robber · DP 1D', 'House Robber · DP 1D'),
    checklist: [
      l('The dashboard plan separates architecture from UX behavior.', 'Kế hoạch dashboard đã tách rõ kiến trúc với hành vi UX.'),
      l('There is a clear opinion on BFF vs direct APIs.', 'Đã có quan điểm rõ về BFF so với gọi API trực tiếp.'),
      l('Algo is done and the rolling-DP idea is clear.', 'Bài algo xong và hiểu được ý tưởng DP cuộn.'),
    ],
  },
  {
    day: 23,
    week: 4,
    title: l('Data-heavy surfaces and performance trade-offs', 'Bề mặt nhiều dữ liệu và trade-off performance'),
    goal: l(
      'Practice senior reasoning on rendering cost, bundle size, and interaction speed for large UIs.',
      'Luyện tư duy senior về chi phí render, kích thước bundle và tốc độ tương tác của UI lớn.',
    ),
    studyLinks: [
      doc('system-design', 'System design notes', 'Tài liệu system design'),
      doc('performance', 'Performance notes', 'Tài liệu performance'),
      doc('build-tools', 'Build tools notes', 'Tài liệu build tools'),
    ],
    questionLinks: [
      qa('table-50k-rows', 'Table with 50,000 rows', 'Table với 50.000 bản ghi'),
      qa('bundling-code-splitting', 'Bundling and code splitting', 'Bundling và code splitting'),
      qa('core-web-vitals', 'Core Web Vitals', 'Core Web Vitals'),
    ],
    handsOn: [
      l('Review a large-screen flow from your past work and list its 3 likely bottlenecks: data volume, render cost, or bundle cost.', 'Review một flow màn hình lớn từ kinh nghiệm cũ và liệt kê 3 bottleneck có khả năng nhất: lượng data, chi phí render hay chi phí bundle.'),
      l('Choose one optimization you would actually ship first and explain why it beats the alternatives.', 'Chọn một tối ưu bạn sẽ ship trước thật sự và giải thích vì sao nó đáng hơn các lựa chọn khác.'),
    ],
    algorithm: algo(23, 'Warm-up easy set', 'Warm-up easy set'),
    checklist: [
      l('The bottlenecks are prioritized, not just listed.', 'Các bottleneck đã được ưu tiên rõ chứ không chỉ liệt kê.'),
      l('One optimization choice is tied to user impact and risk.', 'Một lựa chọn tối ưu đã gắn với user impact và risk.'),
      l('Warm-up algo session is complete.', 'Đã xong buổi warm-up algo.'),
    ],
  },
  {
    day: 24,
    week: 4,
    title: l('Security, release, and resilience', 'Security, release và resilience'),
    goal: l(
      'Refresh the frontend concerns that make a senior answer feel production-aware, not purely UI-focused.',
      'Ôn lại các concern khiến câu trả lời của senior nghe đúng mùi production chứ không chỉ xoay quanh UI.',
    ),
    studyLinks: [
      doc('security', 'Security notes', 'Tài liệu security'),
      doc('devops', 'DevOps notes', 'Tài liệu DevOps'),
      doc('build-tools', 'Build tools notes', 'Tài liệu build tools'),
    ],
    questionLinks: [
      qa('csrf-vs-xss', 'CSRF vs XSS', 'CSRF và XSS'),
      qa('third-party-script-risk', 'Evaluating third-party scripts', 'Đánh giá third-party script'),
      qa('feature-flags-rollout', 'Using feature flags safely', 'Dùng feature flag an toàn'),
    ],
    handsOn: [
      l('Write a short release checklist for one frontend feature: flags, monitoring, rollback, third-party risk, and post-release watch points.', 'Viết một release checklist ngắn cho một feature frontend: flag, monitoring, rollback, risk từ third-party và điểm cần quan sát sau release.'),
      l('Add one paragraph on how cookie auth, XSS, and CSRF change your UI decisions.', 'Thêm một đoạn ngắn về cách cookie auth, XSS và CSRF ảnh hưởng tới quyết định ở UI.'),
    ],
    algorithm: algo(24, 'Live coding simulation', 'Mô phỏng live coding'),
    checklist: [
      l('The release checklist is practical enough to use next week.', 'Release checklist đủ thực tế để dùng ngay tuần sau.'),
      l('Security notes are tied to concrete frontend choices.', 'Ghi chú security đã gắn với lựa chọn frontend cụ thể.'),
      l('Live-coding algo session is complete.', 'Đã xong buổi mô phỏng live-coding algo.'),
    ],
  },
  {
    day: 25,
    week: 4,
    title: l('Behavioral stories: intro, impact, seniority', 'Behavioral: giới thiệu, impact, seniority'),
    goal: l(
      'Start the behavioral block with the highest-value stories: who you are, what impact you had, and why that shows seniority.',
      'Bắt đầu phần behavioral bằng những story có giá trị cao nhất: bạn là ai, impact gì và vì sao điều đó cho thấy seniority.',
    ),
    studyLinks: [
      doc('leadership', 'Leadership notes', 'Tài liệu leadership'),
      doc('practical-questions', 'Practical interview notes', 'Tài liệu practical questions'),
      plan('self-check-questions.md', 'Self-check questions', 'Self-check questions'),
    ],
    questionLinks: [
      qa('self-intro', 'Introduce yourself', 'Giới thiệu bản thân'),
      qa('biggest-impact', 'Biggest impact so far', 'Impact lớn nhất tới giờ'),
      qa('what-is-senior', 'What makes a senior developer?', 'Thế nào là một senior developer'),
    ],
    handsOn: [
      l('Write and record a 60-90 second self-intro that frames Vue depth, frontend fundamentals, and active React/Next growth honestly.', 'Viết và ghi âm một self-intro 60-90 giây frame được độ sâu Vue, nền tảng frontend và việc đang tăng tốc React/Next một cách trung thực.'),
      l('Pick one impact story and rewrite it in STAR with measurable results.', 'Chọn một impact story và viết lại theo STAR với kết quả đo được.'),
    ],
    algorithm: algo(25, 'Weak-topic drill #1', 'Drill vào điểm yếu #1'),
    checklist: [
      l('A spoken self-intro now exists, not just bullet notes.', 'Đã có self-intro nói thành tiếng, không chỉ là bullet note.'),
      l('One impact story is in STAR form and measurable.', 'Đã có một impact story theo STAR và có số đo.'),
      l('Weak-topic algo drill #1 is complete.', 'Đã xong weak-topic algo drill #1.'),
    ],
  },
  {
    day: 26,
    week: 4,
    title: l('Behavioral stories: project, trade-offs, and the React gap', 'Behavioral: project, trade-off và khoảng trống React'),
    goal: l(
      'Prepare the harder stories where interviewers push on judgment, ownership, and what Parker is still learning.',
      'Chuẩn bị các story khó hơn, nơi interviewer đào vào judgment, ownership và phần Parker vẫn đang học.',
    ),
    studyLinks: [
      doc('leadership', 'Leadership notes', 'Tài liệu leadership'),
      doc('practical-questions', 'Practical interview notes', 'Tài liệu practical questions'),
      doc('nextjs', 'Next.js notes', 'Tài liệu Next.js'),
    ],
    questionLinks: [
      qa('recent-project', 'Recent project story', 'Story về recent project'),
      qa('tradeoff-example', 'A technical trade-off story', 'Một ví dụ technical trade-off'),
      qa('learning-react-as-vue-dev', 'Explaining the React learning journey', 'Giải thích hành trình học React từ Vue'),
    ],
    handsOn: [
      l('Write one project story with constraint, trade-off, risk, and result, then trim it to 2 minutes.', 'Viết một project story có constraint, trade-off, risk và result, rồi rút còn 2 phút.'),
      l('Write one strong answer for “Why should we trust you on React if your production depth is in Vue?”', 'Viết một câu trả lời chắc tay cho câu “Vì sao chúng tôi nên tin bạn ở React khi production depth của bạn nằm ở Vue?”'),
    ],
    algorithm: algo(26, 'Weak-topic drill #2', 'Drill vào điểm yếu #2'),
    checklist: [
      l('One project story is timed and concise.', 'Đã có một project story gọn và có bấm giờ.'),
      l('The React-gap answer sounds credible, not defensive.', 'Câu trả lời về khoảng trống React nghe đáng tin, không phòng thủ.'),
      l('Weak-topic algo drill #2 is complete.', 'Đã xong weak-topic algo drill #2.'),
    ],
  },
  {
    day: 27,
    week: 4,
    title: l('Cross-stack review and weak spots', 'Review chéo giữa stack và lỗ hổng còn lại'),
    goal: l(
      'Use the final prep days to tighten the weak areas that would most hurt a senior interview.',
      'Dùng những ngày cuối phần prep để vá những điểm yếu dễ làm hỏng một buổi phỏng vấn senior nhất.',
    ),
    studyLinks: [
      plan('react-next-track.md', 'React / Next track', 'React / Next track'),
      doc('system-design', 'System design notes', 'Tài liệu system design'),
      plan('self-check-questions.md', 'Self-check questions', 'Self-check questions'),
    ],
    questionLinks: [
      qa('code-review-approach', 'Code review approach', 'Cách code review'),
      qa('quality-bar-definition', 'A good quality bar', 'Quality bar tốt trông thế nào'),
      qa('handle-ambiguity', 'Handling ambiguity', 'Xử lý requirement mơ hồ'),
    ],
    handsOn: [
      l('List the 5 questions you still answer weakly and group them by root cause: concept gap, story gap, or articulation gap.', 'Liệt kê 5 câu bạn vẫn trả lời yếu và gom nhóm theo root cause: thiếu khái niệm, thiếu story hay diễn đạt chưa rõ.'),
      l('Pick the top 2 weak spots and do one repair pass each today.', 'Chọn 2 điểm yếu lớn nhất và sửa một lượt tập trung cho từng điểm trong hôm nay.'),
    ],
    algorithm: algo(27, 'Big-O flashcards', 'Flashcard Big-O'),
    checklist: [
      l('A real weak-spot list exists with priorities.', 'Đã có danh sách điểm yếu thật kèm thứ tự ưu tiên.'),
      l('Two weak spots got a concrete repair pass.', 'Hai điểm yếu đã được sửa bằng một lượt ôn tập cụ thể.'),
      l('Big-O flashcards are complete.', 'Đã xong phần flashcard Big-O.'),
    ],
  },
  {
    day: 28,
    week: 4,
    title: l('Mock round #1', 'Mock round #1'),
    goal: l(
      'Run an integrated practice round before the final two days so the remaining gaps are visible.',
      'Chạy một vòng luyện tích hợp trước hai ngày cuối để những khoảng trống còn lại hiện ra rõ ràng.',
    ),
    studyLinks: [
      plan('self-check-questions.md', 'Self-check questions', 'Self-check questions'),
      plan('algorithms-track.md', 'Algorithms track', 'Algorithms track'),
      doc('practical-questions', 'Practical interview notes', 'Tài liệu practical questions'),
    ],
    questionLinks: [
      qa('design-autocomplete', 'Design an autocomplete box', 'Thiết kế autocomplete search box'),
      qa('recent-project', 'Recent project story', 'Story về recent project'),
      qa('design-system-strategy', 'Design system growth strategy', 'Chiến lược phát triển design system'),
    ],
    handsOn: [
      l('Simulate 45-60 minutes: 10 minutes intro/project, 20 minutes technical/Q&A, 15-20 minutes coding or system design.', 'Mô phỏng 45-60 phút: 10 phút intro/project, 20 phút technical/Q&A, 15-20 phút coding hoặc system design.'),
      l('Score yourself immediately after: strongest answer, weakest answer, and one timing issue.', 'Tự chấm ngay sau buổi mock: câu mạnh nhất, câu yếu nhất và một vấn đề về timing.'),
    ],
    algorithm: algo(28, 'Cooldown easy problem', 'Một bài cooldown dễ'),
    checklist: [
      l('The mock happened as one uninterrupted block.', 'Buổi mock đã diễn ra như một block liên tục.'),
      l('You captured lessons while the memory was still fresh.', 'Đã ghi lại bài học khi ký ức còn mới.'),
      l('Cooldown algo is complete.', 'Đã xong bài algo cooldown.'),
    ],
  },
  {
    day: 29,
    week: 5,
    title: l('Final review and company fit', 'Review cuối và company fit'),
    goal: l(
      'Polish the final layer: why this company, what growth you want next, and how you measure yourself as a senior.',
      'Chốt lớp cuối cùng: vì sao công ty này, muốn phát triển gì tiếp và tự đo mình ra sao ở mức senior.',
    ),
    studyLinks: [
      doc('leadership', 'Leadership notes', 'Tài liệu leadership'),
      plan('self-check-questions.md', 'Self-check questions', 'Self-check questions'),
      plan('definition-of-done.md', 'Definition of Done', 'Definition of Done'),
    ],
    questionLinks: [
      qa('why-company', 'Why this company?', 'Vì sao công ty này?'),
      qa('career-growth-plan', 'What do you want to grow into next?', 'Bạn muốn phát triển tiếp theo hướng nào?'),
      qa('success-metrics-senior', 'How do you measure success as a senior?', 'Bạn đo thành công của mình như một senior thế nào?'),
    ],
    handsOn: [
      l('Write one tailored “why this company” answer for a company you actually want, using product fit + skill fit + growth fit.', 'Viết một câu “vì sao công ty này” đã được tailor cho một công ty bạn thực sự muốn vào, theo product fit + skill fit + growth fit.'),
      l('Make a 7-day post-plan list: what to keep drilling if the interview is not tomorrow yet.', 'Lập danh sách 7 ngày sau plan: nếu buổi phỏng vấn chưa phải là ngày mai thì còn gì cần drill tiếp.'),
    ],
    algorithm: algo(29, 'Pattern review + one random problem', 'Review pattern + 1 bài ngẫu nhiên'),
    checklist: [
      l('One targeted company-fit answer is written.', 'Đã có một câu trả lời company-fit được tailor rõ ràng.'),
      l('A 7-day follow-up list exists.', 'Đã có danh sách follow-up 7 ngày.'),
      l('The final review algo set is complete.', 'Đã xong set algo review cuối.'),
    ],
  },
  {
    day: 30,
    week: 5,
    title: l('Full mock interview + retrospective', 'Full mock interview + retrospective'),
    goal: l(
      'End the plan with a full run that combines stories, technical depth, and problem solving.',
      'Kết thúc plan bằng một lượt chạy hoàn chỉnh kết hợp story, độ sâu kỹ thuật và giải bài.',
    ),
    studyLinks: [
      plan('self-check-questions.md', 'Self-check questions', 'Self-check questions'),
      plan('algorithms-track.md', 'Algorithms track', 'Algorithms track'),
      plan('react-next-track.md', 'React / Next track', 'React / Next track'),
    ],
    questionLinks: [
      qa('strengths-weaknesses', 'Strengths and weaknesses', 'Điểm mạnh và điểm yếu'),
      qa('mistake-hardship', 'A mistake or difficulty story', 'Story về sai lầm hoặc khó khăn'),
      qa('tradeoff-example', 'A technical trade-off story', 'Một ví dụ technical trade-off'),
    ],
    handsOn: [
      l('Run a 75-90 minute mock: intro, project deep dive, 5-7 technical questions, one design/coding segment, and closing questions.', 'Chạy một buổi mock 75-90 phút: intro, project deep dive, 5-7 câu technical, một đoạn design/coding và phần closing question.'),
      l('Finish with a short retrospective: what sounded strongest, what still sounded vague, and what Parker should not bluff.', 'Kết thúc bằng retrospective ngắn: phần nào nghe mạnh nhất, phần nào vẫn mơ hồ và phần nào Parker tuyệt đối không nên bluff.'),
    ],
    algorithm: algo(30, 'Mock live-coding problem', 'Bài live-coding dạng mock'),
    checklist: [
      l('The full mock was completed end to end.', 'Buổi mock hoàn chỉnh đã chạy xong từ đầu tới cuối.'),
      l('The retrospective names concrete next steps, not generic feelings.', 'Phần retrospective gọi tên bước tiếp theo thật cụ thể, không chỉ là cảm giác chung chung.'),
      l('The final mock algo problem is complete.', 'Đã xong bài algo cuối kiểu mock.'),
    ],
  },
]

export const PLAN_DAY_MAP = new Map(
  PLAN_DAY_CONTENT.map((item) => [item.day, item] as const),
)

export function getPlanDayContent(day: number) {
  return PLAN_DAY_MAP.get(day) ?? null
}
