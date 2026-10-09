# Day 16 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** `useState` vs `useRef`? Controlled vs uncontrolled — when do you pick each? When does Context become a problem?
- **VI:** `useState` hay `useRef`? Controlled hay uncontrolled — khi nào chọn cái nào? Khi nào Context thành vấn đề?

## What you will produce / Bạn sẽ produce gì

- **EN:** Build or review a small form and identify what should be state, ref, derived value, and lifted state.
  - **VI:** Dựng hoặc review một form nhỏ rồi chỉ ra phần nào nên là state, ref, derived value và lifted state.
- **EN:** Write one rule of thumb for when you would stop using Context and move to another tool.
  - **VI:** Viết một rule of thumb cho thời điểm nên dừng Context và chuyển sang tool khác.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: Label every value: state (drives render), ref (imperative / does not need render), derived (compute, do not store), lifted (shared by siblings).
  - VI: Gắn nhãn từng value: state (kéo render), ref (imperative / không cần render), derived (tính, đừng lưu), lifted (anh em dùng chung).
- **Constraint / Ràng buộc:**
  - EN: A tiny form snippet or a review of a form you already have. Not a design-system TextField rewrite.
  - VI: Snippet form nhỏ hoặc review form đã có. Không viết lại TextField của design system.
- **Failure mode:**
  - EN: Storing derived values in state and watching them drift. Uncontrolled input plus a `value` prop. Context for every keystroke in a large tree.
  - VI: Lưu derived vào state rồi để chúng lệch. Input uncontrolled cộng prop `value`. Context cho mọi keystroke trong cây lớn.
- **Measure / Cách đo:**
  - EN: You can explain state vs ref with a concrete case, and the form shows controlled-input reasoning, not memorized API usage.
  - VI: Giải thích state vs ref bằng case cụ thể, và form thể hiện reasoning controlled input chứ không phải nhớ API.
- **Tradeoff / Trade-off:**
  - EN: Controlled forms are testable and constrainable; they re-render per keystroke. Uncontrolled + ref is fine for ‘submit the file and walk away’.
  - VI: Form controlled dễ test và ràng buộc; chúng re-render mỗi phím. Uncontrolled + ref ổn cho ‘submit file rồi thôi’.
- **Production gotcha / Gotcha production:**
  - EN: Lifting state too high re-renders a dashboard. Context without splitting (state vs dispatch) becomes a perf story you did not mean to tell.
  - VI: Lift state quá cao làm re-render cả dashboard. Context không tách (state vs dispatch) thành story perf bạn không định kể.

## Done when / Tiêu chí xong

- Giải thích được state và ref bằng một case cụ thể.
  - EN: You can explain state vs ref with a concrete case.
- Ví dụ form thể hiện được reasoning về controlled input, không chỉ là nhớ API.
  - EN: The form example shows controlled-input reasoning, not memorized API usage.
- Bài algo xong và recursion kiểu DFS vẫn còn thoải mái.
  - EN: Algo is done and DFS recursion still feels comfortable.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Write the rule: leave Context when updates are frequent, consumers are wide, or the value is a server cache.
- **VI:** Viết rule: rời Context khi update dày, consumer rộng, hoặc value là server cache.

## Algorithm / Thuật toán

- **Problem / Bài:** Maximum Depth of Binary Tree · DFS / Maximum Depth of Binary Tree · DFS
- **Constraints / Ràng buộc:**
  - EN:
- 0 ≤ nodes ≤ 10^4
  - VI:
- 0 ≤ nodes ≤ 10^4
- **Hint:** 1 + max(left, right); null → 0.
  - VI: 1 + max(left, right); null → 0.

```text
algorithms/day-16/solution.ts
algorithms/day-16/solution.test.ts
```

Run: `pnpm test:algo -- day-16`

Open the full prompt: [day-16.md](../artifacts/algo/problems/day-16.md)

## Suggested commit

```text
day-16: label form values as state ref derived or lifted
```
