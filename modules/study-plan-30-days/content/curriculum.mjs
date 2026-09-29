/** Curriculum — single source of truth (Theory / Practice / Lab / Algo). */
export const WEEK_LABELS = {
  "1": "Tuần 1 · Foundations + Product",
  "2": "Tuần 2 · Architecture + React",
  "3": "Tuần 3 · Quality + Next.js",
  "4": "Tuần 4 · Test + Spikes",
  "5": "Tuần 5 · Close + Mock"
}

export const CURRICULUM = [
  {
    "day": 1,
    "date": "03/10/2026",
    "week": 1,
    "theme": "JS core + User flow",
    "goal": "Nắm closures/scope đủ giải thích phỏng vấn + có user flow Capstone rõ.",
    "theory": {
      "summary": "Nắm closures/scope đủ giải thích phỏng vấn + có user flow Capstone rõ.",
      "topics": [
        "documents/vi/javascript.md — scope, closures, hoisting",
        "capstone-brief.md",
        "react-next-track.md (overview)",
        "algorithms-track.md (overview)"
      ],
      "kbFocus": [
        "documents/vi/javascript.md — scope, closures, hoisting"
      ]
    },
    "practice": {
      "craft": "Vẽ Capstone flow List→Filter→Select→View→Edit→Save; liệt kê persona, happy path, 5 edge cases, AC draft.",
      "react": "Đọc mental model React vs Vue (component = function). Tạo app Vite React+TS skeleton (hoặc note Day 6 setup nếu chưa kịp). Viết 1 component Hello + props.",
      "algoTitle": "Two Sum (Easy)",
      "checkpoint": "Giải thích closure bằng 1 ví dụ; show flow Capstone; code Two Sum chạy đúng 2 test."
    },
    "algoId": "two-sum",
    "worksheet": "artifacts/day-01-user-flow.md",
    "starter": "day-01-starter.md",
    "lab": "lab/day-01-lab.md"
  },
  {
    "day": 2,
    "date": "04/10/2026",
    "week": 1,
    "theme": "this/event loop + UI critique",
    "goal": "Giải thích this + micro/macrotask; critique UI admin có hierarchy rõ.",
    "theory": {
      "summary": "Giải thích this + micro/macrotask; critique UI admin có hierarchy rõ.",
      "topics": [
        "documents/vi/javascript.md — this, event loop",
        "documents/vi/architecture.md — presentational vs container",
        "documents/vi/react.md — rendering mental model"
      ],
      "kbFocus": [
        "documents/vi/javascript.md — this, event loop",
        "documents/vi/architecture.md — presentational vs container",
        "documents/vi/react.md — rendering mental model"
      ]
    },
    "practice": {
      "craft": "Critique 1 admin page: primary action, empty/loading/error, 8–10 UX issues + sketch redesign.",
      "react": "Lab: useState counter + conditional render. So sánh với ref Vue. Giải thích re-render khi setState.",
      "algoTitle": "Valid Anagram (Easy)",
      "checkpoint": "Nói được thứ tự log của 1 snippet Promise/setTimeout; có UI critique; Anagram pass."
    },
    "algoId": "valid-anagram",
    "worksheet": "artifacts/day-02-ui-critique.md",
    "starter": "day-02-starter.md",
    "lab": "lab/day-02-lab.md"
  },
  {
    "day": 3,
    "date": "05/10/2026",
    "week": 1,
    "theme": "Promises + Forms",
    "goal": "Spec form state machine + viết controlled form React.",
    "theory": {
      "summary": "Spec form state machine + viết controlled form React.",
      "topics": [
        "documents/vi/javascript.md — Promise/async",
        "documents/vi/accessibility.md — forms",
        "documents/vi/vue3.md — v-model",
        "documents/vi/react.md — controlled inputs"
      ],
      "kbFocus": [
        "documents/vi/javascript.md — Promise/async",
        "documents/vi/accessibility.md — forms",
        "documents/vi/vue3.md — v-model",
        "documents/vi/react.md — controlled inputs"
      ]
    },
    "practice": {
      "craft": "Map field→rule→error UI→disable Save. State machine pristine→dirty→validating→invalid→submitting→success|error.",
      "react": "Lab: form Profile (name, email) controlled, validate on blur + submit, disable button khi invalid. So với v-model.",
      "algoTitle": "Contains Duplicate (Easy)",
      "checkpoint": "Form React chạy được validation; state machine ghi đủ transitions; Set solution O(n)."
    },
    "algoId": "contains-duplicate",
    "worksheet": "artifacts/day-03-form-states.md",
    "starter": "day-03-starter.md",
    "lab": "lab/day-03-lab.md"
  },
  {
    "day": 4,
    "date": "06/10/2026",
    "week": 1,
    "theme": "TS + Data-heavy table",
    "goal": "Type được row model; chiến lược table 500+ rows; list React có key đúng.",
    "theory": {
      "summary": "Type được row model; chiến lược table 500+ rows; list React có key đúng.",
      "topics": [
        "documents/vi/typescript.md — interfaces, unions, generics cơ bản",
        "documents/vi/performance.md — list virtualization skim",
        "documents/vi/react.md — lists & keys"
      ],
      "kbFocus": [
        "documents/vi/typescript.md — interfaces, unions, generics cơ bản",
        "documents/vi/performance.md — list virtualization skim",
        "documents/vi/react.md — lists & keys"
      ]
    },
    "practice": {
      "craft": "Spec table Capstone: columns, filter, sort, pagination vs virtualize — chọn 1 approach + lý do.",
      "react": "Lab: render table 50 rows từ mock data typed bằng TS interface; filter client-side; giải thích key ổn định.",
      "algoTitle": "Group Anagrams (Medium)",
      "checkpoint": "Có TS type cho CustomerRow; table React filter được; Group Anagrams đúng."
    },
    "algoId": "group-anagrams",
    "worksheet": "artifacts/day-04-data-heavy.md",
    "starter": "day-04-starter.md",
    "lab": "lab/day-04-lab.md"
  },
  {
    "day": 5,
    "date": "07/10/2026",
    "week": 1,
    "theme": "Product AC + custom hooks",
    "goal": "AC v1 Capstone testable; viết custom hook React đầu tiên.",
    "theory": {
      "summary": "AC v1 Capstone testable; viết custom hook React đầu tiên.",
      "topics": [
        "self-check-questions.md — Product",
        "documents/vi/react.md — custom hooks",
        "capstone 03-acceptance-criteria.md"
      ],
      "kbFocus": [
        "documents/vi/react.md — custom hooks"
      ]
    },
    "practice": {
      "craft": "Viết AC Given/When/Then cho List filter + Edit save (ít nhất 6 AC). Copy sang capstone/03.",
      "react": "Lab: extract useLocalStorage(key, initial) hoặc useToggle — dùng trong form Day 3.",
      "algoTitle": "Top K Frequent Elements (Medium)",
      "checkpoint": "AC đo được (pass/fail); hook tái sử dụng được; Top K chạy sample."
    },
    "algoId": "top-k-frequent",
    "worksheet": "artifacts/day-05-product-review.md",
    "starter": "day-05-starter.md",
    "lab": "lab/day-05-lab.md"
  },
  {
    "day": 6,
    "date": "08/10/2026",
    "week": 1,
    "theme": "Work management + React lab setup",
    "goal": "Break Capstone thành ~12 tasks; lab React/Next sẵn sàng xuyên tháng.",
    "theory": {
      "summary": "Break Capstone thành ~12 tasks; lab React/Next sẵn sàng xuyên tháng.",
      "topics": [
        "documents/vi/leadership.md — estimate / prioritization skim",
        "react-next-track.md — setup"
      ],
      "kbFocus": [
        "documents/vi/leadership.md — estimate / prioritization skim"
      ]
    },
    "practice": {
      "craft": "Work plan: task id, estimate (S/M/L), dependency, risk. Highlight 3 task critical path.",
      "react": "Chốt setup: fe-react-lab (Vite) + (optional) fe-next-lab. README lab: scripts, folder day-NN convention.",
      "algoTitle": "Valid Parentheses (Easy)",
      "checkpoint": "Work plan ≥10 tasks; repo lab chạy `npm run dev`; Parentheses pass."
    },
    "algoId": "valid-parentheses",
    "worksheet": "artifacts/day-06-work-plan.md",
    "starter": "day-06-starter.md",
    "lab": "lab/day-06-lab.md"
  },
  {
    "day": 7,
    "date": "09/10/2026",
    "week": 1,
    "theme": "Capstone kickoff + composition",
    "goal": "Feature Template + wireframes; hiểu composition React (children).",
    "theory": {
      "summary": "Feature Template + wireframes; hiểu composition React (children).",
      "topics": [
        "feature-template.md",
        "capstone/00 + 02",
        "documents/vi/react.md — composition / children"
      ],
      "kbFocus": [
        "documents/vi/react.md — composition / children"
      ]
    },
    "practice": {
      "craft": "Điền Feature Template Capstone; wireframe text 3 màn List/Detail/Config.",
      "react": "Lab: Card/Layout components dùng children; so với slots Vue. Không prop-drill title+body nếu dùng composition.",
      "algoTitle": "Week 1 timed review (Easy)",
      "checkpoint": "Template + wireframes xong; composition lab PR/commit; timed algo OK."
    },
    "algoId": "week1-review",
    "worksheet": "artifacts/capstone/00-feature-template.md",
    "starter": "day-07-starter.md",
    "lab": "lab/day-07-lab.md"
  },
  {
    "day": 8,
    "date": "10/10/2026",
    "week": 2,
    "theme": "Component architecture",
    "goal": "Component tree Capstone + trách nhiệm rõ; mirror tree bên React.",
    "theory": {
      "summary": "Component tree Capstone + trách nhiệm rõ; mirror tree bên React.",
      "topics": [
        "documents/vi/architecture.md",
        "documents/vi/vue3.md — component design",
        "documents/vi/react.md — presentational vs container"
      ],
      "kbFocus": [
        "documents/vi/architecture.md",
        "documents/vi/vue3.md — component design",
        "documents/vi/react.md — presentational vs container"
      ]
    },
    "practice": {
      "craft": "Vẽ component tree List page (smart vs dumb). Ghi props/events từng node → capstone/04.",
      "react": "Lab: tách CustomerTable (dumb) + CustomersPage (smart fetch mock). Không fetch trong dumb.",
      "algoTitle": "Binary Search (Easy)",
      "checkpoint": "Tree 2 phía Vue-thinking + React lab khớp trách nhiệm; binary search O(log n)."
    },
    "algoId": "binary-search",
    "worksheet": "artifacts/day-08-component-tree.md",
    "starter": "day-08-starter.md",
    "lab": "lab/day-08-lab.md"
  },
  {
    "day": 9,
    "date": "11/10/2026",
    "week": 2,
    "theme": "State ownership",
    "goal": "Map source of truth Capstone; Context vs Zustand quyết định có lý do.",
    "theory": {
      "summary": "Map source of truth Capstone; Context vs Zustand quyết định có lý do.",
      "topics": [
        "documents/vi/state-management.md",
        "documents/vi/state-management-react.md"
      ],
      "kbFocus": [
        "documents/vi/state-management.md",
        "documents/vi/state-management-react.md"
      ]
    },
    "practice": {
      "craft": "Bảng state: data · owner · who writes · who reads · sync server? → capstone/05.",
      "react": "Lab: lift filter state lên page; thử Context cho theme/auth mock; viết note khi nào cần Zustand.",
      "algoTitle": "Two Sum II (sorted) (Medium)",
      "checkpoint": "State map không còn “mọi thứ trong page”; Context demo chạy; two pointers đúng."
    },
    "algoId": "two-sum-ii",
    "worksheet": "artifacts/day-09-state-map.md",
    "starter": "day-09-starter.md",
    "lab": "lab/day-09-lab.md"
  },
  {
    "day": 10,
    "date": "12/10/2026",
    "week": 2,
    "theme": "Data flow + TypeScript",
    "goal": "DTO + Save flow typed; useReducer form phức tạp.",
    "theory": {
      "summary": "DTO + Save flow typed; useReducer form phức tạp.",
      "topics": [
        "documents/vi/typescript.md — discriminated unions",
        "documents/vi/react.md — useReducer"
      ],
      "kbFocus": [
        "documents/vi/typescript.md — discriminated unions",
        "documents/vi/react.md — useReducer"
      ]
    },
    "practice": {
      "craft": "Định nghĩa types Customer, FieldConfig, ApiError. Sequence Save (optimistic vs pessimistic).",
      "react": "Lab: form FieldConfig dùng useReducer (update_field | validate | submit_*).",
      "algoTitle": "Longest Substring Without Repeating Characters (Medium)",
      "checkpoint": "Types compile; reducer transitions rõ; sliding window O(n)."
    },
    "algoId": "longest-substring",
    "worksheet": "artifacts/day-10-types-and-flow.md",
    "starter": "day-10-starter.md",
    "lab": "lab/day-10-lab.md"
  },
  {
    "day": 11,
    "date": "13/10/2026",
    "week": 2,
    "theme": "Design system primitives",
    "goal": "Spec Button/FormField/Empty/Error; compound component pattern React.",
    "theory": {
      "summary": "Spec Button/FormField/Empty/Error; compound component pattern React.",
      "topics": [
        "documents/vi/css-layout.md — skim tokens",
        "documents/vi/react.md — compound components"
      ],
      "kbFocus": [
        "documents/vi/css-layout.md — skim tokens",
        "documents/vi/react.md — compound components"
      ]
    },
    "practice": {
      "craft": "Spec 4 primitives: API props, variants, a11y notes, empty/error copy.",
      "react": "Lab: <Tabs> compound (Tabs, TabsList, TabsTrigger, TabsContent) bằng Context nội bộ.",
      "algoTitle": "Min Stack (Medium)",
      "checkpoint": "Spec đủ để handoff; Tabs lab keyboard-ish; Min Stack đúng."
    },
    "algoId": "min-stack",
    "worksheet": "artifacts/day-11-design-primitives.md",
    "starter": "day-11-starter.md",
    "lab": "lab/day-11-lab.md"
  },
  {
    "day": 12,
    "date": "14/10/2026",
    "week": 2,
    "theme": "Responsive trade-offs",
    "goal": "Chọn strategy table mobile; CSS layout React lab.",
    "theory": {
      "summary": "Chọn strategy table mobile; CSS layout React lab.",
      "topics": [
        "documents/vi/css-layout.md",
        "capstone/08-responsive-strategy.md"
      ],
      "kbFocus": [
        "documents/vi/css-layout.md"
      ]
    },
    "practice": {
      "craft": "So sánh scroll-x vs hide cols vs card stack — chọn 1 + anti-patterns → capstone/08.",
      "react": "Lab: cùng data, breakpoint chuyển table→cards (CSS hoặc matchMedia hook).",
      "algoTitle": "Reverse Linked List (Easy)",
      "checkpoint": "Có quyết định responsive ghi rõ trade-off; lab đổi layout; reverse list OK."
    },
    "algoId": "reverse-linked-list",
    "worksheet": "artifacts/day-12-responsive-tradeoffs.md",
    "starter": "day-12-starter.md",
    "lab": "lab/day-12-lab.md"
  },
  {
    "day": 13,
    "date": "15/10/2026",
    "week": 2,
    "theme": "A11y modal",
    "goal": "Modal a11y checklist + implement dialog React (focus trap tối thiểu).",
    "theory": {
      "summary": "Modal a11y checklist + implement dialog React (focus trap tối thiểu).",
      "topics": [
        "documents/vi/accessibility.md",
        "documents/vi/react.md — portals"
      ],
      "kbFocus": [
        "documents/vi/accessibility.md",
        "documents/vi/react.md — portals"
      ]
    },
    "practice": {
      "craft": "Checklist: focus trap, Esc, return focus, aria-modal, labelledby → bắt đầu capstone/09.",
      "react": "Lab: Modal bằng createPortal; Esc đóng; focus nút đầu; restore focus khi unmount.",
      "algoTitle": "Linked List Cycle (Easy)",
      "checkpoint": "Modal lab đạt 4/5 a11y checks; checklist Capstone update; Floyd OK."
    },
    "algoId": "linked-list-cycle",
    "worksheet": "artifacts/day-13-modal-a11y.md",
    "starter": "day-13-starter.md",
    "lab": "lab/day-13-lab.md"
  },
  {
    "day": 14,
    "date": "16/10/2026",
    "week": 2,
    "theme": "Keyboard review + week pack",
    "goal": "Keyboard test Capstone screens; đóng gói artifact tuần 2; React a11y pass.",
    "theory": {
      "summary": "Keyboard test Capstone screens; đóng gói artifact tuần 2; React a11y pass.",
      "topics": [
        "documents/vi/accessibility.md — keyboard",
        "self-check Architecture/A11y"
      ],
      "kbFocus": [
        "documents/vi/accessibility.md — keyboard"
      ]
    },
    "practice": {
      "craft": "Test Tab/Shift+Tab/Enter/Esc trên flow chính; ghi bug list; pack artifacts 04/05/08/09.",
      "react": "Lab: audit Day 13 Modal + form Day 3 bằng keyboard only; sửa 2 issue.",
      "algoTitle": "Week 2 timed review (Mixed)",
      "checkpoint": "Có keyboard result sheet; ≥1 bug fixed trong lab; timed algo xong."
    },
    "algoId": "week2-review",
    "worksheet": "artifacts/day-14-keyboard-result.md",
    "starter": "day-14-starter.md",
    "lab": "lab/day-14-lab.md"
  },
  {
    "day": 15,
    "date": "17/10/2026",
    "week": 3,
    "theme": "API contract + React Query",
    "goal": "Contract GET/PATCH Capstone; fetch với cache/stale policy.",
    "theory": {
      "summary": "Contract GET/PATCH Capstone; fetch với cache/stale policy.",
      "topics": [
        "documents/vi/networking.md",
        "documents/vi/react.md — data fetching",
        "documents/vi/nextjs.md — skim fetch"
      ],
      "kbFocus": [
        "documents/vi/networking.md",
        "documents/vi/react.md — data fetching",
        "documents/vi/nextjs.md — skim fetch"
      ]
    },
    "practice": {
      "craft": "Viết contract endpoints List/Detail/Patch + error shape → capstone/06.",
      "react": "Lab: dùng @tanstack/react-query (hoặc SWR) load customers mock; loading/error/success states.",
      "algoTitle": "Binary Tree Level Order Traversal (Medium)",
      "checkpoint": "Contract review được; query lab không race khi remount nhanh; BFS đúng."
    },
    "algoId": "level-order",
    "worksheet": "artifacts/day-15-api-contract.md",
    "starter": "day-15-starter.md",
    "lab": "lab/day-15-lab.md"
  },
  {
    "day": 16,
    "date": "18/10/2026",
    "week": 3,
    "theme": "Error matrix + Error Boundary",
    "goal": "Map status→UX; Error Boundary + 401 refresh flow notes.",
    "theory": {
      "summary": "Map status→UX; Error Boundary + 401 refresh flow notes.",
      "topics": [
        "documents/vi/practical-questions.md — debug",
        "documents/vi/react.md — error boundaries"
      ],
      "kbFocus": [
        "documents/vi/practical-questions.md — debug",
        "documents/vi/react.md — error boundaries"
      ]
    },
    "practice": {
      "craft": "Matrix 400/401/403/404/422/500 → toast/inline/full-page/retry → capstone/07.",
      "react": "Lab: ErrorBoundary class (hoặc library) bọc page; fallback UI + retry. Note: boundary không bắt lỗi async event.",
      "algoTitle": "Maximum Depth of Binary Tree (Easy)",
      "checkpoint": "Matrix đủ 6 status; Boundary demo; DFS depth đúng."
    },
    "algoId": "max-depth",
    "worksheet": "artifacts/day-16-error-matrix.md",
    "starter": "day-16-starter.md",
    "lab": "lab/day-16-lab.md"
  },
  {
    "day": 17,
    "date": "19/10/2026",
    "week": 3,
    "theme": "FE security",
    "goal": "XSS/authz/storage checklist Capstone; biết nguy cơ React XSS.",
    "theory": {
      "summary": "XSS/authz/storage checklist Capstone; biết nguy cơ React XSS.",
      "topics": [
        "documents/vi/security.md",
        "documents/vi/react.md — dangerouslySetInnerHTML"
      ],
      "kbFocus": [
        "documents/vi/security.md",
        "documents/vi/react.md — dangerouslySetInnerHTML"
      ]
    },
    "practice": {
      "craft": "Checklist security Capstone (token storage, XSS surfaces, CSRF nếu cookie) → capstone/10.",
      "react": "Lab: cố ý render HTML string an toàn (escape) vs dangerouslySetInnerHTML — ghi khi nào được phép.",
      "algoTitle": "Lowest Common Ancestor of a BST (Medium)",
      "checkpoint": "Checklist ≥8 items actionable; XSS note rõ; LCA pass sample."
    },
    "algoId": "lca-bst",
    "worksheet": "artifacts/day-17-security.md",
    "starter": "day-17-starter.md",
    "lab": "lab/day-17-lab.md"
  },
  {
    "day": 18,
    "date": "20/10/2026",
    "week": 3,
    "theme": "Race conditions + AbortController",
    "goal": "Biết stale response; cleanup useEffect đúng.",
    "theory": {
      "summary": "Biết stale response; cleanup useEffect đúng.",
      "topics": [
        "documents/vi/javascript.md — abort/race",
        "documents/vi/react.md — useEffect cleanup"
      ],
      "kbFocus": [
        "documents/vi/javascript.md — abort/race",
        "documents/vi/react.md — useEffect cleanup"
      ]
    },
    "practice": {
      "craft": "Viết investigation log “search race”: reproduce, root cause, fix (ignore stale / abort / seq id).",
      "react": "Lab: search-as-you-type với AbortController; verify request cũ bị abort khi gõ tiếp.",
      "algoTitle": "Number of Islands (Medium)",
      "checkpoint": "Có fix pattern ghi trong Capstone notes; lab abort hoạt động; Islands OK."
    },
    "algoId": "number-of-islands",
    "worksheet": "artifacts/day-18-debug-stale-ui.md",
    "starter": "day-18-starter.md",
    "lab": "lab/day-18-lab.md"
  },
  {
    "day": 19,
    "date": "21/10/2026",
    "week": 3,
    "theme": "Performance + React memo",
    "goal": "Bottleneck list Capstone; biết khi nào memo/useMemo có ích.",
    "theory": {
      "summary": "Bottleneck list Capstone; biết khi nào memo/useMemo có ích.",
      "topics": [
        "documents/vi/performance.md",
        "documents/vi/react.md — memo, useMemo, useCallback"
      ],
      "kbFocus": [
        "documents/vi/performance.md",
        "documents/vi/react.md — memo, useMemo, useCallback"
      ]
    },
    "practice": {
      "craft": "Perf review: 3 bottleneck + đo giả định + fix → capstone/11.",
      "react": "Lab: list chậm giả lập; tối ưu bằng memo hóa row; profile bằng React Profiler (DevTools) — ghi trước/sau.",
      "algoTitle": "Climbing Stairs (Easy)",
      "checkpoint": "Perf sheet có số; Profiler screenshot/note; DP stairs O(n)."
    },
    "algoId": "climbing-stairs",
    "worksheet": "artifacts/day-19-performance.md",
    "starter": "day-19-starter.md",
    "lab": "lab/day-19-lab.md"
  },
  {
    "day": 20,
    "date": "22/10/2026",
    "week": 3,
    "theme": "Observability + Next App Router",
    "goal": "Logging/CWV plan; tạo Next app router đầu tiên.",
    "theory": {
      "summary": "Logging/CWV plan; tạo Next app router đầu tiên.",
      "topics": [
        "documents/vi/monitoring.md",
        "documents/vi/nextjs.md — App Router, layouts",
        "documents/vi/build-tools.md — skim bundle"
      ],
      "kbFocus": [
        "documents/vi/monitoring.md",
        "documents/vi/nextjs.md — App Router, layouts",
        "documents/vi/build-tools.md — skim bundle"
      ]
    },
    "practice": {
      "craft": "Plan: gì log ở FE, correlation id, error reporting; lazy route list.",
      "react": "Lab Next: app/ layout + page customers (RSC mặc định) + 1 Client Component interactive filter.",
      "algoTitle": "Coin Change (Medium)",
      "checkpoint": "Obs notes; Next /customers render; phân biệt Server vs Client component được."
    },
    "algoId": "coin-change",
    "worksheet": "artifacts/day-20-observability.md",
    "starter": "day-20-starter.md",
    "lab": "lab/day-20-lab.md"
  },
  {
    "day": 21,
    "date": "23/10/2026",
    "week": 3,
    "theme": "CI + Next data caching",
    "goal": "CI gates ngắn; hiểu cache Next fetch.",
    "theory": {
      "summary": "CI gates ngắn; hiểu cache Next fetch.",
      "topics": [
        "documents/vi/devops.md",
        "documents/vi/nextjs.md — caching, revalidate"
      ],
      "kbFocus": [
        "documents/vi/devops.md",
        "documents/vi/nextjs.md — caching, revalidate"
      ]
    },
    "practice": {
      "craft": "ADR ½ trang: chọn test gate (lint/typecheck/unit) + lý do. Pipeline checklist.",
      "react": "Lab Next: fetch mock với `revalidate` / `no-store`; ghi bảng “khi nào cache”.",
      "algoTitle": "Week 3 timed review (Mixed)",
      "checkpoint": "ADR + CI list; cache table ≥4 rows; timed algo xong."
    },
    "algoId": "week3-review",
    "worksheet": "artifacts/day-21-ci-and-adr.md",
    "starter": "day-21-starter.md",
    "lab": "lab/day-21-lab.md"
  },
  {
    "day": 22,
    "date": "24/10/2026",
    "week": 4,
    "theme": "Test pyramid + RTL",
    "goal": "Map behaviors→layers; viết test RTL đầu tiên.",
    "theory": {
      "summary": "Map behaviors→layers; viết test RTL đầu tiên.",
      "topics": [
        "documents/vi/testing.md",
        "documents/vi/react.md — testing library mindset"
      ],
      "kbFocus": [
        "documents/vi/testing.md",
        "documents/vi/react.md — testing library mindset"
      ]
    },
    "practice": {
      "craft": "Test plan Capstone: unit/component/E2E cho Save flow → capstone/12.",
      "react": "Lab: RTL test form validate (userEvent). Không test implementation detail.",
      "algoTitle": "House Robber (Medium)",
      "checkpoint": "Pyramid map; ≥2 RTL tests green; DP OK."
    },
    "algoId": "house-robber",
    "worksheet": "artifacts/day-22-test-plan.md",
    "starter": "day-22-starter.md",
    "lab": "lab/day-22-lab.md"
  },
  {
    "day": 23,
    "date": "25/10/2026",
    "week": 4,
    "theme": "Form/API tests Vue+React",
    "goal": "So sánh VTU vs RTL; mock API (MSW hoặc vi.mock).",
    "theory": {
      "summary": "So sánh VTU vs RTL; mock API (MSW hoặc vi.mock).",
      "topics": [
        "documents/vi/testing.md",
        "documents/vi/vue3.md — testing skim"
      ],
      "kbFocus": [
        "documents/vi/testing.md",
        "documents/vi/vue3.md — testing skim"
      ]
    },
    "practice": {
      "craft": "Viết pseudo + real snippet: 1 test Vue + 1 test React cùng behavior “save success toast”.",
      "react": "Lab: MSW (hoặc mock fetch) cho PATCH success/401; assert UI.",
      "algoTitle": "Warm-up Easy (tự chọn) (Easy)",
      "checkpoint": "Bảng so sánh VTU/RTL; React test 401 path; warm-up xong."
    },
    "algoId": "warmup-easy",
    "worksheet": "artifacts/day-23-test-snippets-vue-react.md",
    "starter": "day-23-starter.md",
    "lab": "lab/day-23-lab.md"
  },
  {
    "day": 24,
    "date": "26/10/2026",
    "week": 4,
    "theme": "E2E + coding interview sim",
    "goal": "1 E2E critical path; 45′ live coding giả lập.",
    "theory": {
      "summary": "1 E2E critical path; 45′ live coding giả lập.",
      "topics": [
        "documents/vi/testing.md — E2E",
        "algorithms-track.md"
      ],
      "kbFocus": [
        "documents/vi/testing.md — E2E"
      ]
    },
    "practice": {
      "craft": "Spec Playwright scenario: login(/mock) → filter → open detail → save. Ghi CI gate.",
      "react": "Lab: chạy E2E trên Next/React lab (1 smoke) HOẶC script manual checklist nếu chưa cài PW.",
      "algoTitle": "Live coding simulation (Mixed)",
      "checkpoint": "E2E spec/CI note; có điểm self-score algo (pass/partial/fail)."
    },
    "algoId": "live-sim",
    "worksheet": "artifacts/day-24-e2e-and-ci.md",
    "starter": "day-24-starter.md",
    "lab": "lab/day-24-lab.md"
  },
  {
    "day": 25,
    "date": "27/10/2026",
    "week": 4,
    "theme": "AI-assisted + Server Actions",
    "goal": "Dùng AI có audit trail; thử Server Action Next.",
    "theory": {
      "summary": "Dùng AI có audit trail; thử Server Action Next.",
      "topics": [
        "documents/vi/practical-questions.md",
        "documents/vi/nextjs.md — server actions"
      ],
      "kbFocus": [
        "documents/vi/practical-questions.md",
        "documents/vi/nextjs.md — server actions"
      ]
    },
    "practice": {
      "craft": "Prompt AI implement 1 util; audit bugs/security; ghi evidence → capstone/13.",
      "react": "Lab Next: form submit qua Server Action (mock), progressive enhancement note.",
      "algoTitle": "Weak-topic drill #1 (Mixed)",
      "checkpoint": "AI evidence trước/sau; Server Action chạy; weak drill note."
    },
    "algoId": "weak-drill-1",
    "worksheet": "artifacts/day-25-ai-review.md",
    "starter": "day-25-starter.md",
    "lab": "lab/day-25-lab.md"
  },
  {
    "day": 26,
    "date": "28/10/2026",
    "week": 4,
    "theme": "Code review + Next Capstone page",
    "goal": "Review checklist; dựng 1 page Capstone trên Next.",
    "theory": {
      "summary": "Review checklist; dựng 1 page Capstone trên Next.",
      "topics": [
        "definition-of-done.md",
        "documents/vi/leadership.md — review"
      ],
      "kbFocus": [
        "documents/vi/leadership.md — review"
      ]
    },
    "practice": {
      "craft": "Checklist review (correctness, a11y, security, perf, tests) → capstone/14. Self-review lab.",
      "react": "Lab Next: Customers List page theo AC Day 5 (mock data) — loading/empty/error/table.",
      "algoTitle": "Weak-topic drill #2 (Mixed)",
      "checkpoint": "Checklist dùng được; List page Next demo; drill xong."
    },
    "algoId": "weak-drill-2",
    "worksheet": "artifacts/day-26-code-review.md",
    "starter": "day-26-starter.md",
    "lab": "lab/day-26-lab.md"
  },
  {
    "day": 27,
    "date": "29/10/2026",
    "week": 4,
    "theme": "Capstone Vue spike",
    "goal": "Ship 1 vertical slice Vue/TS (List hoặc Field Config).",
    "theory": {
      "summary": "Ship 1 vertical slice Vue/TS (List hoặc Field Config).",
      "topics": [
        "documents/vi/vue3.md",
        "documents/vi/state-management.md",
        "artifacts/capstone/spikes/vue/README.md"
      ],
      "kbFocus": [
        "documents/vi/vue3.md",
        "documents/vi/state-management.md"
      ]
    },
    "practice": {
      "craft": "Code spike Vue: fetch mock + table + filter + empty/error. README ghi trade-offs.",
      "react": "Parity note: liệt kê API/composable sẽ map sang hooks ngày mai (bảng Vue→React).",
      "algoTitle": "Big-O flashcards (Easy)",
      "checkpoint": "Spike Vue chạy được happy path; parity table sẵn cho Day 28."
    },
    "algoId": "big-o-flashcards",
    "worksheet": "artifacts/day-27-vue-spike.md",
    "starter": "day-27-starter.md",
    "lab": "lab/day-27-lab.md"
  },
  {
    "day": 28,
    "date": "30/10/2026",
    "week": 4,
    "theme": "Capstone React/Next spike",
    "goal": "Cùng slice với Day 27 bằng React + Next (ưu tiên Next nếu đã có lab).",
    "theory": {
      "summary": "Cùng slice với Day 27 bằng React + Next (ưu tiên Next nếu đã có lab).",
      "topics": [
        "documents/vi/react.md",
        "documents/vi/nextjs.md",
        "documents/vi/state-management-react.md",
        "artifacts/capstone/spikes/react/README.md"
      ],
      "kbFocus": [
        "documents/vi/react.md",
        "documents/vi/nextjs.md",
        "documents/vi/state-management-react.md"
      ]
    },
    "practice": {
      "craft": "Spike React/Next đạt parity feature Vue spike. README: khác biệt DX, bundling, data fetching.",
      "react": "Đây là ngày React chính: hoàn thiện slice + 1 test RTL smoke + note RSC/client boundary.",
      "algoTitle": "Cooldown Easy (Easy)",
      "checkpoint": "Demo 2 spike cạnh nhau; nói được 3 khác biệt Vue vs React/Next."
    },
    "algoId": "cooldown-easy",
    "worksheet": "artifacts/day-28-react-spike.md",
    "starter": "day-28-starter.md",
    "lab": "lab/day-28-lab.md"
  },
  {
    "day": 29,
    "date": "31/10/2026",
    "week": 5,
    "theme": "DoD + delivery notes",
    "goal": "Tick DoD; index deliverables 01–15; polish spike.",
    "theory": {
      "summary": "Tick DoD; index deliverables 01–15; polish spike.",
      "topics": [
        "definition-of-done.md",
        "capstone/15-delivery-notes.md"
      ],
      "kbFocus": []
    },
    "practice": {
      "craft": "Điền delivery notes; đánh dấu thiếu sót; polish README spikes.",
      "react": "Polish Next page: empty/error copy, basic a11y, remove console noise.",
      "algoTitle": "8 patterns flashcards + 1 random (Mixed)",
      "checkpoint": "DoD ≥80% tick; delivery notes thẳng thắn về gap; flashcards xong."
    },
    "algoId": "pattern-flashcards",
    "worksheet": "artifacts/capstone/15-delivery-notes.md",
    "starter": "day-29-starter.md",
    "lab": "lab/day-29-lab.md"
  },
  {
    "day": 30,
    "date": "01/11/2026",
    "week": 5,
    "theme": "Full mock interview",
    "goal": "Mock 60–90′: Capstone walkthrough + React Q + live coding.",
    "theory": {
      "summary": "Mock 60–90′: Capstone walkthrough + React Q + live coding.",
      "topics": [
        "self-check-questions.md",
        "algorithms-track.md"
      ],
      "kbFocus": []
    },
    "practice": {
      "craft": "Outline trả lời 10–15′ Capstone (problem→constraints→architecture→trade-offs→tests). Ghi weak list hậu mock.",
      "react": "Chuẩn bị 5 câu: hooks rules, useEffect deps, RSC vs client, key reconciliation, state library choice.",
      "algoTitle": "Mock interview live coding (Mixed)",
      "checkpoint": "Ghi điểm 3 phần (Capstone/React/Algo) + 5 việc ôn tiếp 7 ngày sau."
    },
    "algoId": "mock-live",
    "worksheet": "artifacts/day-30-mock-outline.md",
    "starter": "day-30-starter.md",
    "lab": "lab/day-30-lab.md"
  }
]
