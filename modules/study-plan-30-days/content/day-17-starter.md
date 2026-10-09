# Day 17 — Interview drill (19/10/2026)

**Theme:** Effects, async cleanup, and error boundaries / Effect, cleanup async và error boundary  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Review the React concepts that most often cause bugs or shallow answers in interviews.
- **VI:** Ôn lại những khái niệm React dễ gây bug hoặc dễ bị trả lời nông trong phỏng vấn.

## What they actually ask

- **EN:** What is a good `useEffect` vs a bad one? How do you cancel stale work? Why don’t Error Boundaries catch API failures or event-handler errors?
- **VI:** `useEffect` tốt khác `useEffect` tệ thế nào? Huỷ việc stale ra sao? Vì sao Error Boundary không bắt lỗi API hay lỗi trong event handler?

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `react` — React notes (opens in a new tab in the app / mở tab mới trong app)
- `javascript` — JavaScript notes (opens in a new tab in the app / mở tab mới trong app)
- `practical-questions` — Practical debugging notes (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `useeffect` — useEffect
- `error-boundary-limits` — Error Boundary limits
- `perf-issue-story` — Performance or bug investigation story

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** Review one effect and ask: what triggers it, how is stale work cancelled, and what happens on rapid input or unmount?
  - **VI:** Review một effect và hỏi: cái gì kích hoạt nó, stale work bị huỷ thế nào và chuyện gì xảy ra khi input nhanh hoặc unmount?
- **EN:** Write one short explanation for why Error Boundaries do not replace API error handling.
  - **VI:** Viết một câu ngắn giải thích vì sao Error Boundary không thay thế cho xử lý lỗi API.

## Algorithm

- **Problem:** Lowest Common Ancestor of a BST
- Full prompt: [`artifacts/algo/problems/day-17.md`](./artifacts/algo/problems/day-17.md)
- Code + test in the lab repo: `algorithms/day-17/`

## Checkpoint

- Nói được một pattern useEffect tốt và một pattern useEffect tệ.
  - EN: You can describe one good and one bad useEffect pattern.
- Error Boundary giờ gắn với giới hạn thật chứ không còn là định nghĩa mơ hồ.
  - EN: Error Boundaries are now tied to real limitations, not a vague definition.
- Bài algo xong và dùng đúng tính chất của BST.
  - EN: Algo is done and BST properties are used correctly.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-17-lab.md`](./lab/day-17-lab.md)
