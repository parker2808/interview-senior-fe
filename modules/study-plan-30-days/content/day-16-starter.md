# Day 16 — Interview drill (18/10/2026)

**Theme:** State, refs, and controlled inputs in React / State, ref và controlled input trong React  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Cover the React basics interviewers expect before jumping into Next.js.
- **VI:** Đi qua phần React cơ bản mà interviewer mong đợi trước khi nhảy sang Next.js.

## What they actually ask

- **EN:** `useState` vs `useRef`? Controlled vs uncontrolled — when do you pick each? When does Context become a problem?
- **VI:** `useState` hay `useRef`? Controlled hay uncontrolled — khi nào chọn cái nào? Khi nào Context thành vấn đề?

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `react` — React notes (opens in a new tab in the app / mở tab mới trong app)
- `state-management-react` — React state-management notes (opens in a new tab in the app / mở tab mới trong app)
- `typescript` — TypeScript notes (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `react-usestate-useref` — useState vs useRef
- `react-controlled-vs-uncontrolled` — Controlled vs uncontrolled components
- `react-context-limits` — React Context limits

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** Build or review a small form and identify what should be state, ref, derived value, and lifted state.
  - **VI:** Dựng hoặc review một form nhỏ rồi chỉ ra phần nào nên là state, ref, derived value và lifted state.
- **EN:** Write one rule of thumb for when you would stop using Context and move to another tool.
  - **VI:** Viết một rule of thumb cho thời điểm nên dừng Context và chuyển sang tool khác.

## Algorithm

- **Problem:** Maximum Depth of Binary Tree · DFS
- Full prompt: [`artifacts/algo/problems/day-16.md`](./artifacts/algo/problems/day-16.md)
- Code + test in the lab repo: `algorithms/day-16/`

## Checkpoint

- Giải thích được state và ref bằng một case cụ thể.
  - EN: You can explain state vs ref with a concrete case.
- Ví dụ form thể hiện được reasoning về controlled input, không chỉ là nhớ API.
  - EN: The form example shows controlled-input reasoning, not memorized API usage.
- Bài algo xong và recursion kiểu DFS vẫn còn thoải mái.
  - EN: Algo is done and DFS recursion still feels comfortable.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-16-lab.md`](./lab/day-16-lab.md)
