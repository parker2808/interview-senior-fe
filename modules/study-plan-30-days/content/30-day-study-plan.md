# Kế hoạch ôn 30 ngày — Senior Front-End

**Lịch:** Day 1 = **03/10/2026** → Day 30 = **01/11/2026**  
**Timebox:** **90–120 phút/ngày**  
**Mục tiêu:** Vững FE senior (product→ship) · bổ sung **React/Next** (nền Vue) · đủ **coding round Easy→Medium**.

### Tài liệu

| | |
|---|---|
| Capstone | [capstone-brief.md](./capstone-brief.md) |
| React/Next track | [react-next-track.md](./react-next-track.md) |
| Algorithms (flow + bank đề) | [algorithms-track.md](./algorithms-track.md) |
| Companion lab repo | [lab-repo.md](./lab-repo.md) |
| Feature / DoD / Self-check | [feature-template.md](./feature-template.md) · [definition-of-done.md](./definition-of-done.md) · [self-check-questions.md](./self-check-questions.md) |

---

## Cách dùng 3 tab mỗi ngày

| Tab | Nội dung |
|---|---|
| **Hướng dẫn** | Lý thuyết cần học + Thực hành cần làm + Checkpoint |
| **Worksheet** | Artifact Capstone / điền tay (docs) |
| **Lab setup** | Setup môi trường, path trong lab repo, lệnh dev/test, chỗ push code |

**Code không lưu trong hub plan** — push vào companion repo (xem [lab-repo.md](./lab-repo.md)).

### Phân bổ thời gian gợi ý

| Khối | Phút | Thuộc |
|---|---:|---|
| Lý thuyết (đọc KB) | 20–25 | Theory |
| Thực hành Capstone / FE craft | 25–35 | Practice |
| Thực hành React/Next lab | 25–35 | Practice |
| Thực hành Algo | 15–25 | Practice |
| Checkpoint | 5 | — |

**Escape hatch (chỉ còn ~75′):** Craft → React lab → Algo. Không skip React 2 ngày liên tiếp.

---

## Calendar

| Day | Ngày | Chủ đề |
|---:|---|---|
| 1 | 03/10/2026 | JS core + User flow |
| 2 | 04/10/2026 | this/event loop + UI critique |
| 3 | 05/10/2026 | Promises + Forms |
| 4 | 06/10/2026 | TS + Data-heavy table |
| 5 | 07/10/2026 | Product AC + custom hooks |
| 6 | 08/10/2026 | Work management + React lab setup |
| 7 | 09/10/2026 | Capstone kickoff + composition |
| 8 | 10/10/2026 | Component architecture |
| 9 | 11/10/2026 | State ownership |
| 10 | 12/10/2026 | Data flow + TypeScript |
| 11 | 13/10/2026 | Design system primitives |
| 12 | 14/10/2026 | Responsive trade-offs |
| 13 | 15/10/2026 | A11y modal |
| 14 | 16/10/2026 | Keyboard review + week pack |
| 15 | 17/10/2026 | API contract + React Query |
| 16 | 18/10/2026 | Error matrix + Error Boundary |
| 17 | 19/10/2026 | FE security |
| 18 | 20/10/2026 | Race conditions + AbortController |
| 19 | 21/10/2026 | Performance + React memo |
| 20 | 22/10/2026 | Observability + Next App Router |
| 21 | 23/10/2026 | CI + Next data caching |
| 22 | 24/10/2026 | Test pyramid + RTL |
| 23 | 25/10/2026 | Form/API tests Vue+React |
| 24 | 26/10/2026 | E2E + coding interview sim |
| 25 | 27/10/2026 | AI-assisted + Server Actions |
| 26 | 28/10/2026 | Code review + Next Capstone page |
| 27 | 29/10/2026 | Capstone Vue spike |
| 28 | 30/10/2026 | Capstone React/Next spike |
| 29 | 31/10/2026 | DoD + delivery notes |
| 30 | 01/11/2026 | Full mock interview |

---

# Tuần 1 · Foundations + Product (03/10/2026 – 09/10/2026)

### Day 1 — 03/10/2026 · JS core + User flow

**Mục tiêu ngày:** Nắm closures/scope đủ giải thích phỏng vấn + có user flow Capstone rõ.

#### Lý thuyết (học gì)

- documents/vi/javascript.md — scope, closures, hoisting
- capstone-brief.md
- react-next-track.md (overview)
- algorithms-track.md (overview)

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Vẽ Capstone flow List→Filter→Select→View→Edit→Save; liệt kê persona, happy path, 5 edge cases, AC draft.
2. **React / Next lab:** Đọc mental model React vs Vue (component = function). Tạo app Vite React+TS skeleton (hoặc note Day 6 setup nếu chưa kịp). Viết 1 component Hello + props.
3. **Algo:** [Two Sum](./artifacts/algo/problems/day-01.md) — pattern **HashMap**

#### Checkpoint

- Giải thích closure bằng 1 ví dụ; show flow Capstone; code Two Sum chạy đúng 2 test.

**Files:** [Hướng dẫn](./day-01-starter.md) · [Worksheet](./artifacts/day-01-user-flow.md) · [Lab setup](./lab/day-01-lab.md) · [Đề algo](./artifacts/algo/problems/day-01.md)

---

### Day 2 — 04/10/2026 · this/event loop + UI critique

**Mục tiêu ngày:** Giải thích this + micro/macrotask; critique UI admin có hierarchy rõ.

#### Lý thuyết (học gì)

- documents/vi/javascript.md — this, event loop
- documents/vi/architecture.md — presentational vs container
- documents/vi/react.md — rendering mental model

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Critique 1 admin page: primary action, empty/loading/error, 8–10 UX issues + sketch redesign.
2. **React / Next lab:** Lab: useState counter + conditional render. So sánh với ref Vue. Giải thích re-render khi setState.
3. **Algo:** [Valid Anagram](./artifacts/algo/problems/day-02.md) — pattern **Frequency map**

#### Checkpoint

- Nói được thứ tự log của 1 snippet Promise/setTimeout; có UI critique; Anagram pass.

**Files:** [Hướng dẫn](./day-02-starter.md) · [Worksheet](./artifacts/day-02-ui-critique.md) · [Lab setup](./lab/day-02-lab.md) · [Đề algo](./artifacts/algo/problems/day-02.md)

---

### Day 3 — 05/10/2026 · Promises + Forms

**Mục tiêu ngày:** Spec form state machine + viết controlled form React.

#### Lý thuyết (học gì)

- documents/vi/javascript.md — Promise/async
- documents/vi/accessibility.md — forms
- documents/vi/vue3.md — v-model
- documents/vi/react.md — controlled inputs

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Map field→rule→error UI→disable Save. State machine pristine→dirty→validating→invalid→submitting→success|error.
2. **React / Next lab:** Lab: form Profile (name, email) controlled, validate on blur + submit, disable button khi invalid. So với v-model.
3. **Algo:** [Contains Duplicate](./artifacts/algo/problems/day-03.md) — pattern **Set**

#### Checkpoint

- Form React chạy được validation; state machine ghi đủ transitions; Set solution O(n).

**Files:** [Hướng dẫn](./day-03-starter.md) · [Worksheet](./artifacts/day-03-form-states.md) · [Lab setup](./lab/day-03-lab.md) · [Đề algo](./artifacts/algo/problems/day-03.md)

---

### Day 4 — 06/10/2026 · TS + Data-heavy table

**Mục tiêu ngày:** Type được row model; chiến lược table 500+ rows; list React có key đúng.

#### Lý thuyết (học gì)

- documents/vi/typescript.md — interfaces, unions, generics cơ bản
- documents/vi/performance.md — list virtualization skim
- documents/vi/react.md — lists & keys

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Spec table Capstone: columns, filter, sort, pagination vs virtualize — chọn 1 approach + lý do.
2. **React / Next lab:** Lab: render table 50 rows từ mock data typed bằng TS interface; filter client-side; giải thích key ổn định.
3. **Algo:** [Group Anagrams](./artifacts/algo/problems/day-04.md) — pattern **HashMap + sorted key**

#### Checkpoint

- Có TS type cho CustomerRow; table React filter được; Group Anagrams đúng.

**Files:** [Hướng dẫn](./day-04-starter.md) · [Worksheet](./artifacts/day-04-data-heavy.md) · [Lab setup](./lab/day-04-lab.md) · [Đề algo](./artifacts/algo/problems/day-04.md)

---

### Day 5 — 07/10/2026 · Product AC + custom hooks

**Mục tiêu ngày:** AC v1 Capstone testable; viết custom hook React đầu tiên.

#### Lý thuyết (học gì)

- self-check-questions.md — Product
- documents/vi/react.md — custom hooks
- capstone 03-acceptance-criteria.md

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Viết AC Given/When/Then cho List filter + Edit save (ít nhất 6 AC). Copy sang capstone/03.
2. **React / Next lab:** Lab: extract useLocalStorage(key, initial) hoặc useToggle — dùng trong form Day 3.
3. **Algo:** [Top K Frequent Elements](./artifacts/algo/problems/day-05.md) — pattern **HashMap + bucket/sort**

#### Checkpoint

- AC đo được (pass/fail); hook tái sử dụng được; Top K chạy sample.

**Files:** [Hướng dẫn](./day-05-starter.md) · [Worksheet](./artifacts/day-05-product-review.md) · [Lab setup](./lab/day-05-lab.md) · [Đề algo](./artifacts/algo/problems/day-05.md)

---

### Day 6 — 08/10/2026 · Work management + React lab setup

**Mục tiêu ngày:** Break Capstone thành ~12 tasks; lab React/Next sẵn sàng xuyên tháng.

#### Lý thuyết (học gì)

- documents/vi/leadership.md — estimate / prioritization skim
- react-next-track.md — setup

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Work plan: task id, estimate (S/M/L), dependency, risk. Highlight 3 task critical path.
2. **React / Next lab:** Chốt setup: fe-react-lab (Vite) + (optional) fe-next-lab. README lab: scripts, folder day-NN convention.
3. **Algo:** [Valid Parentheses](./artifacts/algo/problems/day-06.md) — pattern **Stack**

#### Checkpoint

- Work plan ≥10 tasks; repo lab chạy `npm run dev`; Parentheses pass.

**Files:** [Hướng dẫn](./day-06-starter.md) · [Worksheet](./artifacts/day-06-work-plan.md) · [Lab setup](./lab/day-06-lab.md) · [Đề algo](./artifacts/algo/problems/day-06.md)

---

### Day 7 — 09/10/2026 · Capstone kickoff + composition

**Mục tiêu ngày:** Feature Template + wireframes; hiểu composition React (children).

#### Lý thuyết (học gì)

- feature-template.md
- capstone/00 + 02
- documents/vi/react.md — composition / children

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Điền Feature Template Capstone; wireframe text 3 màn List/Detail/Config.
2. **React / Next lab:** Lab: Card/Layout components dùng children; so với slots Vue. Không prop-drill title+body nếu dùng composition.
3. **Algo:** [Week 1 timed review](./artifacts/algo/problems/day-07.md) — pattern **Review**

#### Checkpoint

- Template + wireframes xong; composition lab PR/commit; timed algo OK.

**Files:** [Hướng dẫn](./day-07-starter.md) · [Worksheet](./artifacts/capstone/00-feature-template.md) · [Lab setup](./lab/day-07-lab.md) · [Đề algo](./artifacts/algo/problems/day-07.md)

---

# Tuần 2 · Architecture + React (10/10/2026 – 16/10/2026)

### Day 8 — 10/10/2026 · Component architecture

**Mục tiêu ngày:** Component tree Capstone + trách nhiệm rõ; mirror tree bên React.

#### Lý thuyết (học gì)

- documents/vi/architecture.md
- documents/vi/vue3.md — component design
- documents/vi/react.md — presentational vs container

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Vẽ component tree List page (smart vs dumb). Ghi props/events từng node → capstone/04.
2. **React / Next lab:** Lab: tách CustomerTable (dumb) + CustomersPage (smart fetch mock). Không fetch trong dumb.
3. **Algo:** [Binary Search](./artifacts/algo/problems/day-08.md) — pattern **Binary search**

#### Checkpoint

- Tree 2 phía Vue-thinking + React lab khớp trách nhiệm; binary search O(log n).

**Files:** [Hướng dẫn](./day-08-starter.md) · [Worksheet](./artifacts/day-08-component-tree.md) · [Lab setup](./lab/day-08-lab.md) · [Đề algo](./artifacts/algo/problems/day-08.md)

---

### Day 9 — 11/10/2026 · State ownership

**Mục tiêu ngày:** Map source of truth Capstone; Context vs Zustand quyết định có lý do.

#### Lý thuyết (học gì)

- documents/vi/state-management.md
- documents/vi/state-management-react.md

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Bảng state: data · owner · who writes · who reads · sync server? → capstone/05.
2. **React / Next lab:** Lab: lift filter state lên page; thử Context cho theme/auth mock; viết note khi nào cần Zustand.
3. **Algo:** [Two Sum II (sorted)](./artifacts/algo/problems/day-09.md) — pattern **Two pointers**

#### Checkpoint

- State map không còn “mọi thứ trong page”; Context demo chạy; two pointers đúng.

**Files:** [Hướng dẫn](./day-09-starter.md) · [Worksheet](./artifacts/day-09-state-map.md) · [Lab setup](./lab/day-09-lab.md) · [Đề algo](./artifacts/algo/problems/day-09.md)

---

### Day 10 — 12/10/2026 · Data flow + TypeScript

**Mục tiêu ngày:** DTO + Save flow typed; useReducer form phức tạp.

#### Lý thuyết (học gì)

- documents/vi/typescript.md — discriminated unions
- documents/vi/react.md — useReducer

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Định nghĩa types Customer, FieldConfig, ApiError. Sequence Save (optimistic vs pessimistic).
2. **React / Next lab:** Lab: form FieldConfig dùng useReducer (update_field | validate | submit_*).
3. **Algo:** [Longest Substring Without Repeating Characters](./artifacts/algo/problems/day-10.md) — pattern **Sliding window**

#### Checkpoint

- Types compile; reducer transitions rõ; sliding window O(n).

**Files:** [Hướng dẫn](./day-10-starter.md) · [Worksheet](./artifacts/day-10-types-and-flow.md) · [Lab setup](./lab/day-10-lab.md) · [Đề algo](./artifacts/algo/problems/day-10.md)

---

### Day 11 — 13/10/2026 · Design system primitives

**Mục tiêu ngày:** Spec Button/FormField/Empty/Error; compound component pattern React.

#### Lý thuyết (học gì)

- documents/vi/css-layout.md — skim tokens
- documents/vi/react.md — compound components

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Spec 4 primitives: API props, variants, a11y notes, empty/error copy.
2. **React / Next lab:** Lab: <Tabs> compound (Tabs, TabsList, TabsTrigger, TabsContent) bằng Context nội bộ.
3. **Algo:** [Min Stack](./artifacts/algo/problems/day-11.md) — pattern **Stack design**

#### Checkpoint

- Spec đủ để handoff; Tabs lab keyboard-ish; Min Stack đúng.

**Files:** [Hướng dẫn](./day-11-starter.md) · [Worksheet](./artifacts/day-11-design-primitives.md) · [Lab setup](./lab/day-11-lab.md) · [Đề algo](./artifacts/algo/problems/day-11.md)

---

### Day 12 — 14/10/2026 · Responsive trade-offs

**Mục tiêu ngày:** Chọn strategy table mobile; CSS layout React lab.

#### Lý thuyết (học gì)

- documents/vi/css-layout.md
- capstone/08-responsive-strategy.md

#### Thực hành (làm gì)

1. **Capstone / FE craft:** So sánh scroll-x vs hide cols vs card stack — chọn 1 + anti-patterns → capstone/08.
2. **React / Next lab:** Lab: cùng data, breakpoint chuyển table→cards (CSS hoặc matchMedia hook).
3. **Algo:** [Reverse Linked List](./artifacts/algo/problems/day-12.md) — pattern **Linked list**

#### Checkpoint

- Có quyết định responsive ghi rõ trade-off; lab đổi layout; reverse list OK.

**Files:** [Hướng dẫn](./day-12-starter.md) · [Worksheet](./artifacts/day-12-responsive-tradeoffs.md) · [Lab setup](./lab/day-12-lab.md) · [Đề algo](./artifacts/algo/problems/day-12.md)

---

### Day 13 — 15/10/2026 · A11y modal

**Mục tiêu ngày:** Modal a11y checklist + implement dialog React (focus trap tối thiểu).

#### Lý thuyết (học gì)

- documents/vi/accessibility.md
- documents/vi/react.md — portals

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Checklist: focus trap, Esc, return focus, aria-modal, labelledby → bắt đầu capstone/09.
2. **React / Next lab:** Lab: Modal bằng createPortal; Esc đóng; focus nút đầu; restore focus khi unmount.
3. **Algo:** [Linked List Cycle](./artifacts/algo/problems/day-13.md) — pattern **Floyd two pointers**

#### Checkpoint

- Modal lab đạt 4/5 a11y checks; checklist Capstone update; Floyd OK.

**Files:** [Hướng dẫn](./day-13-starter.md) · [Worksheet](./artifacts/day-13-modal-a11y.md) · [Lab setup](./lab/day-13-lab.md) · [Đề algo](./artifacts/algo/problems/day-13.md)

---

### Day 14 — 16/10/2026 · Keyboard review + week pack

**Mục tiêu ngày:** Keyboard test Capstone screens; đóng gói artifact tuần 2; React a11y pass.

#### Lý thuyết (học gì)

- documents/vi/accessibility.md — keyboard
- self-check Architecture/A11y

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Test Tab/Shift+Tab/Enter/Esc trên flow chính; ghi bug list; pack artifacts 04/05/08/09.
2. **React / Next lab:** Lab: audit Day 13 Modal + form Day 3 bằng keyboard only; sửa 2 issue.
3. **Algo:** [Week 2 timed review](./artifacts/algo/problems/day-14.md) — pattern **Review**

#### Checkpoint

- Có keyboard result sheet; ≥1 bug fixed trong lab; timed algo xong.

**Files:** [Hướng dẫn](./day-14-starter.md) · [Worksheet](./artifacts/day-14-keyboard-result.md) · [Lab setup](./lab/day-14-lab.md) · [Đề algo](./artifacts/algo/problems/day-14.md)

---

# Tuần 3 · Quality + Next.js (17/10/2026 – 23/10/2026)

### Day 15 — 17/10/2026 · API contract + React Query

**Mục tiêu ngày:** Contract GET/PATCH Capstone; fetch với cache/stale policy.

#### Lý thuyết (học gì)

- documents/vi/networking.md
- documents/vi/react.md — data fetching
- documents/vi/nextjs.md — skim fetch

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Viết contract endpoints List/Detail/Patch + error shape → capstone/06.
2. **React / Next lab:** Lab: dùng @tanstack/react-query (hoặc SWR) load customers mock; loading/error/success states.
3. **Algo:** [Binary Tree Level Order Traversal](./artifacts/algo/problems/day-15.md) — pattern **BFS queue**

#### Checkpoint

- Contract review được; query lab không race khi remount nhanh; BFS đúng.

**Files:** [Hướng dẫn](./day-15-starter.md) · [Worksheet](./artifacts/day-15-api-contract.md) · [Lab setup](./lab/day-15-lab.md) · [Đề algo](./artifacts/algo/problems/day-15.md)

---

### Day 16 — 18/10/2026 · Error matrix + Error Boundary

**Mục tiêu ngày:** Map status→UX; Error Boundary + 401 refresh flow notes.

#### Lý thuyết (học gì)

- documents/vi/practical-questions.md — debug
- documents/vi/react.md — error boundaries

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Matrix 400/401/403/404/422/500 → toast/inline/full-page/retry → capstone/07.
2. **React / Next lab:** Lab: ErrorBoundary class (hoặc library) bọc page; fallback UI + retry. Note: boundary không bắt lỗi async event.
3. **Algo:** [Maximum Depth of Binary Tree](./artifacts/algo/problems/day-16.md) — pattern **DFS recursion**

#### Checkpoint

- Matrix đủ 6 status; Boundary demo; DFS depth đúng.

**Files:** [Hướng dẫn](./day-16-starter.md) · [Worksheet](./artifacts/day-16-error-matrix.md) · [Lab setup](./lab/day-16-lab.md) · [Đề algo](./artifacts/algo/problems/day-16.md)

---

### Day 17 — 19/10/2026 · FE security

**Mục tiêu ngày:** XSS/authz/storage checklist Capstone; biết nguy cơ React XSS.

#### Lý thuyết (học gì)

- documents/vi/security.md
- documents/vi/react.md — dangerouslySetInnerHTML

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Checklist security Capstone (token storage, XSS surfaces, CSRF nếu cookie) → capstone/10.
2. **React / Next lab:** Lab: cố ý render HTML string an toàn (escape) vs dangerouslySetInnerHTML — ghi khi nào được phép.
3. **Algo:** [Lowest Common Ancestor of a BST](./artifacts/algo/problems/day-17.md) — pattern **BST property**

#### Checkpoint

- Checklist ≥8 items actionable; XSS note rõ; LCA pass sample.

**Files:** [Hướng dẫn](./day-17-starter.md) · [Worksheet](./artifacts/day-17-security.md) · [Lab setup](./lab/day-17-lab.md) · [Đề algo](./artifacts/algo/problems/day-17.md)

---

### Day 18 — 20/10/2026 · Race conditions + AbortController

**Mục tiêu ngày:** Biết stale response; cleanup useEffect đúng.

#### Lý thuyết (học gì)

- documents/vi/javascript.md — abort/race
- documents/vi/react.md — useEffect cleanup

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Viết investigation log “search race”: reproduce, root cause, fix (ignore stale / abort / seq id).
2. **React / Next lab:** Lab: search-as-you-type với AbortController; verify request cũ bị abort khi gõ tiếp.
3. **Algo:** [Number of Islands](./artifacts/algo/problems/day-18.md) — pattern **Grid BFS/DFS**

#### Checkpoint

- Có fix pattern ghi trong Capstone notes; lab abort hoạt động; Islands OK.

**Files:** [Hướng dẫn](./day-18-starter.md) · [Worksheet](./artifacts/day-18-debug-stale-ui.md) · [Lab setup](./lab/day-18-lab.md) · [Đề algo](./artifacts/algo/problems/day-18.md)

---

### Day 19 — 21/10/2026 · Performance + React memo

**Mục tiêu ngày:** Bottleneck list Capstone; biết khi nào memo/useMemo có ích.

#### Lý thuyết (học gì)

- documents/vi/performance.md
- documents/vi/react.md — memo, useMemo, useCallback

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Perf review: 3 bottleneck + đo giả định + fix → capstone/11.
2. **React / Next lab:** Lab: list chậm giả lập; tối ưu bằng memo hóa row; profile bằng React Profiler (DevTools) — ghi trước/sau.
3. **Algo:** [Climbing Stairs](./artifacts/algo/problems/day-19.md) — pattern **DP**

#### Checkpoint

- Perf sheet có số; Profiler screenshot/note; DP stairs O(n).

**Files:** [Hướng dẫn](./day-19-starter.md) · [Worksheet](./artifacts/day-19-performance.md) · [Lab setup](./lab/day-19-lab.md) · [Đề algo](./artifacts/algo/problems/day-19.md)

---

### Day 20 — 22/10/2026 · Observability + Next App Router

**Mục tiêu ngày:** Logging/CWV plan; tạo Next app router đầu tiên.

#### Lý thuyết (học gì)

- documents/vi/monitoring.md
- documents/vi/nextjs.md — App Router, layouts
- documents/vi/build-tools.md — skim bundle

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Plan: gì log ở FE, correlation id, error reporting; lazy route list.
2. **React / Next lab:** Lab Next: app/ layout + page customers (RSC mặc định) + 1 Client Component interactive filter.
3. **Algo:** [Coin Change](./artifacts/algo/problems/day-20.md) — pattern **DP unbounded knapsack**

#### Checkpoint

- Obs notes; Next /customers render; phân biệt Server vs Client component được.

**Files:** [Hướng dẫn](./day-20-starter.md) · [Worksheet](./artifacts/day-20-observability.md) · [Lab setup](./lab/day-20-lab.md) · [Đề algo](./artifacts/algo/problems/day-20.md)

---

### Day 21 — 23/10/2026 · CI + Next data caching

**Mục tiêu ngày:** CI gates ngắn; hiểu cache Next fetch.

#### Lý thuyết (học gì)

- documents/vi/devops.md
- documents/vi/nextjs.md — caching, revalidate

#### Thực hành (làm gì)

1. **Capstone / FE craft:** ADR ½ trang: chọn test gate (lint/typecheck/unit) + lý do. Pipeline checklist.
2. **React / Next lab:** Lab Next: fetch mock với `revalidate` / `no-store`; ghi bảng “khi nào cache”.
3. **Algo:** [Week 3 timed review](./artifacts/algo/problems/day-21.md) — pattern **Review**

#### Checkpoint

- ADR + CI list; cache table ≥4 rows; timed algo xong.

**Files:** [Hướng dẫn](./day-21-starter.md) · [Worksheet](./artifacts/day-21-ci-and-adr.md) · [Lab setup](./lab/day-21-lab.md) · [Đề algo](./artifacts/algo/problems/day-21.md)

---

# Tuần 4 · Test + Spikes (24/10/2026 – 30/10/2026)

### Day 22 — 24/10/2026 · Test pyramid + RTL

**Mục tiêu ngày:** Map behaviors→layers; viết test RTL đầu tiên.

#### Lý thuyết (học gì)

- documents/vi/testing.md
- documents/vi/react.md — testing library mindset

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Test plan Capstone: unit/component/E2E cho Save flow → capstone/12.
2. **React / Next lab:** Lab: RTL test form validate (userEvent). Không test implementation detail.
3. **Algo:** [House Robber](./artifacts/algo/problems/day-22.md) — pattern **DP 1D**

#### Checkpoint

- Pyramid map; ≥2 RTL tests green; DP OK.

**Files:** [Hướng dẫn](./day-22-starter.md) · [Worksheet](./artifacts/day-22-test-plan.md) · [Lab setup](./lab/day-22-lab.md) · [Đề algo](./artifacts/algo/problems/day-22.md)

---

### Day 23 — 25/10/2026 · Form/API tests Vue+React

**Mục tiêu ngày:** So sánh VTU vs RTL; mock API (MSW hoặc vi.mock).

#### Lý thuyết (học gì)

- documents/vi/testing.md
- documents/vi/vue3.md — testing skim

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Viết pseudo + real snippet: 1 test Vue + 1 test React cùng behavior “save success toast”.
2. **React / Next lab:** Lab: MSW (hoặc mock fetch) cho PATCH success/401; assert UI.
3. **Algo:** [Warm-up Easy (tự chọn)](./artifacts/algo/problems/day-23.md) — pattern **Warm-up**

#### Checkpoint

- Bảng so sánh VTU/RTL; React test 401 path; warm-up xong.

**Files:** [Hướng dẫn](./day-23-starter.md) · [Worksheet](./artifacts/day-23-test-snippets-vue-react.md) · [Lab setup](./lab/day-23-lab.md) · [Đề algo](./artifacts/algo/problems/day-23.md)

---

### Day 24 — 26/10/2026 · E2E + coding interview sim

**Mục tiêu ngày:** 1 E2E critical path; 45′ live coding giả lập.

#### Lý thuyết (học gì)

- documents/vi/testing.md — E2E
- algorithms-track.md

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Spec Playwright scenario: login(/mock) → filter → open detail → save. Ghi CI gate.
2. **React / Next lab:** Lab: chạy E2E trên Next/React lab (1 smoke) HOẶC script manual checklist nếu chưa cài PW.
3. **Algo:** [Live coding simulation](./artifacts/algo/problems/day-24.md) — pattern **Interview sim**

#### Checkpoint

- E2E spec/CI note; có điểm self-score algo (pass/partial/fail).

**Files:** [Hướng dẫn](./day-24-starter.md) · [Worksheet](./artifacts/day-24-e2e-and-ci.md) · [Lab setup](./lab/day-24-lab.md) · [Đề algo](./artifacts/algo/problems/day-24.md)

---

### Day 25 — 27/10/2026 · AI-assisted + Server Actions

**Mục tiêu ngày:** Dùng AI có audit trail; thử Server Action Next.

#### Lý thuyết (học gì)

- documents/vi/practical-questions.md
- documents/vi/nextjs.md — server actions

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Prompt AI implement 1 util; audit bugs/security; ghi evidence → capstone/13.
2. **React / Next lab:** Lab Next: form submit qua Server Action (mock), progressive enhancement note.
3. **Algo:** [Weak-topic drill #1](./artifacts/algo/problems/day-25.md) — pattern **Remedial**

#### Checkpoint

- AI evidence trước/sau; Server Action chạy; weak drill note.

**Files:** [Hướng dẫn](./day-25-starter.md) · [Worksheet](./artifacts/day-25-ai-review.md) · [Lab setup](./lab/day-25-lab.md) · [Đề algo](./artifacts/algo/problems/day-25.md)

---

### Day 26 — 28/10/2026 · Code review + Next Capstone page

**Mục tiêu ngày:** Review checklist; dựng 1 page Capstone trên Next.

#### Lý thuyết (học gì)

- definition-of-done.md
- documents/vi/leadership.md — review

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Checklist review (correctness, a11y, security, perf, tests) → capstone/14. Self-review lab.
2. **React / Next lab:** Lab Next: Customers List page theo AC Day 5 (mock data) — loading/empty/error/table.
3. **Algo:** [Weak-topic drill #2](./artifacts/algo/problems/day-26.md) — pattern **Remedial**

#### Checkpoint

- Checklist dùng được; List page Next demo; drill xong.

**Files:** [Hướng dẫn](./day-26-starter.md) · [Worksheet](./artifacts/day-26-code-review.md) · [Lab setup](./lab/day-26-lab.md) · [Đề algo](./artifacts/algo/problems/day-26.md)

---

### Day 27 — 29/10/2026 · Capstone Vue spike

**Mục tiêu ngày:** Ship 1 vertical slice Vue/TS (List hoặc Field Config).

#### Lý thuyết (học gì)

- documents/vi/vue3.md
- documents/vi/state-management.md
- artifacts/capstone/spikes/vue/README.md

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Code spike Vue: fetch mock + table + filter + empty/error. README ghi trade-offs.
2. **React / Next lab:** Parity note: liệt kê API/composable sẽ map sang hooks ngày mai (bảng Vue→React).
3. **Algo:** [Big-O flashcards](./artifacts/algo/problems/day-27.md) — pattern **Theory**

#### Checkpoint

- Spike Vue chạy được happy path; parity table sẵn cho Day 28.

**Files:** [Hướng dẫn](./day-27-starter.md) · [Worksheet](./artifacts/day-27-vue-spike.md) · [Lab setup](./lab/day-27-lab.md) · [Đề algo](./artifacts/algo/problems/day-27.md)

---

### Day 28 — 30/10/2026 · Capstone React/Next spike

**Mục tiêu ngày:** Cùng slice với Day 27 bằng React + Next (ưu tiên Next nếu đã có lab).

#### Lý thuyết (học gì)

- documents/vi/react.md
- documents/vi/nextjs.md
- documents/vi/state-management-react.md
- artifacts/capstone/spikes/react/README.md

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Spike React/Next đạt parity feature Vue spike. README: khác biệt DX, bundling, data fetching.
2. **React / Next lab:** Đây là ngày React chính: hoàn thiện slice + 1 test RTL smoke + note RSC/client boundary.
3. **Algo:** [Cooldown Easy](./artifacts/algo/problems/day-28.md) — pattern **Cooldown**

#### Checkpoint

- Demo 2 spike cạnh nhau; nói được 3 khác biệt Vue vs React/Next.

**Files:** [Hướng dẫn](./day-28-starter.md) · [Worksheet](./artifacts/day-28-react-spike.md) · [Lab setup](./lab/day-28-lab.md) · [Đề algo](./artifacts/algo/problems/day-28.md)

---

# Tuần 5 · Close + Mock (31/10/2026 – 01/11/2026)

### Day 29 — 31/10/2026 · DoD + delivery notes

**Mục tiêu ngày:** Tick DoD; index deliverables 01–15; polish spike.

#### Lý thuyết (học gì)

- definition-of-done.md
- capstone/15-delivery-notes.md

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Điền delivery notes; đánh dấu thiếu sót; polish README spikes.
2. **React / Next lab:** Polish Next page: empty/error copy, basic a11y, remove console noise.
3. **Algo:** [8 patterns flashcards + 1 random](./artifacts/algo/problems/day-29.md) — pattern **Review**

#### Checkpoint

- DoD ≥80% tick; delivery notes thẳng thắn về gap; flashcards xong.

**Files:** [Hướng dẫn](./day-29-starter.md) · [Worksheet](./artifacts/capstone/15-delivery-notes.md) · [Lab setup](./lab/day-29-lab.md) · [Đề algo](./artifacts/algo/problems/day-29.md)

---

### Day 30 — 01/11/2026 · Full mock interview

**Mục tiêu ngày:** Mock 60–90′: Capstone walkthrough + React Q + live coding.

#### Lý thuyết (học gì)

- self-check-questions.md
- algorithms-track.md

#### Thực hành (làm gì)

1. **Capstone / FE craft:** Outline trả lời 10–15′ Capstone (problem→constraints→architecture→trade-offs→tests). Ghi weak list hậu mock.
2. **React / Next lab:** Chuẩn bị 5 câu: hooks rules, useEffect deps, RSC vs client, key reconciliation, state library choice.
3. **Algo:** [Mock interview live coding](./artifacts/algo/problems/day-30.md) — pattern **Mock**

#### Checkpoint

- Ghi điểm 3 phần (Capstone/React/Algo) + 5 việc ôn tiếp 7 ngày sau.

**Files:** [Hướng dẫn](./day-30-starter.md) · [Worksheet](./artifacts/day-30-mock-outline.md) · [Lab setup](./lab/day-30-lab.md) · [Đề algo](./artifacts/algo/problems/day-30.md)

---

## Thành công sau Day 30

- [ ] Walkthrough Capstone 10–15′ có trade-offs
- [ ] Demo spike Vue + React/Next
- [ ] ≥12 bài algo Easy/Medium có test xanh trong lab repo
- [ ] Trả lời được hooks rules, RSC vs client, controlled inputs, Error Boundary
- [ ] Weak-topic list + kế hoạch 7 ngày tiếp
