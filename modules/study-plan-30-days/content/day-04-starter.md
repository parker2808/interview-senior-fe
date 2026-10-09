# Day 4 — Interview drill (06/10/2026)

**Theme:** Responsive data-heavy UI / Responsive cho UI nhiều dữ liệu  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Decide how a table-heavy admin flow should behave on smaller screens without making it unusable.
- **VI:** Quyết định cách một flow admin nhiều bảng nên hoạt động trên màn hình nhỏ mà không làm nó vô dụng.

## What they actually ask

- **EN:** How would you render a table with 50,000 rows? Flexbox or Grid for this layout? What stays visible on mobile, and what moves to overflow?
- **VI:** Render table 50.000 dòng thế nào? Flexbox hay Grid cho layout này? Trên mobile cái gì phải thấy, cái gì vào overflow?

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `css-layout` — CSS layout notes (opens in a new tab in the app / mở tab mới trong app)
- `performance` — Performance notes (opens in a new tab in the app / mở tab mới trong app)
- `architecture` — Architecture notes (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `table-50k-rows` — Table with 50,000 rows
- `css-flexbox-vs-grid` — Flexbox vs Grid

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** For one table screen, compare horizontal scroll, condensed columns, and card-on-mobile. Pick one default and explain why.
  - **VI:** Với một màn bảng dữ liệu, so sánh scroll ngang, ẩn bớt cột và card-on-mobile. Chọn một mặc định và giải thích vì sao.
- **EN:** List the actions that must stay visible on mobile and the ones that can move into an overflow menu.
  - **VI:** Liệt kê action nào bắt buộc phải thấy trên mobile và action nào có thể đưa vào overflow menu.

## Algorithm

- **Problem:** Group Anagrams · Hash map + sorted key
- Full prompt: [`artifacts/algo/problems/day-04.md`](./artifacts/algo/problems/day-04.md)
- Code + test in the lab repo: `algorithms/day-04/`

## Checkpoint

- Đã có 1 chiến lược mobile được chọn kèm trade-off rõ ràng.
  - EN: There is one chosen mobile strategy with trade-offs written down.
- Action quan trọng vẫn tới được trên màn hình nhỏ.
  - EN: Critical actions remain reachable on smaller screens.
- Bài algo chạy đúng và nhớ được pattern gom nhóm.
  - EN: Algo passes and you remember the grouping pattern.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-04-lab.md`](./lab/day-04-lab.md)
