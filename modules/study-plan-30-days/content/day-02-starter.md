# Day 2 — Interview drill (04/10/2026)

**Theme:** Make UI states readable / Làm cho UI state dễ đọc  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Practice the product and UX judgment needed to keep complex screens understandable.
- **VI:** Luyện product sense và UX judgment để giữ màn hình phức tạp vẫn dễ hiểu.

## What they actually ask

- **EN:** A dashboard calls 15 APIs. What does the user see first, what can arrive late, and what fails independently? How do you keep hierarchy obvious in 10 seconds?
- **VI:** Dashboard gọi 15 API. User thấy gì trước, phần nào được tới muộn, phần nào fail độc lập? Làm sao hierarchy rõ trong 10 giây?

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `accessibility` — Accessibility basics (opens in a new tab in the app / mở tab mới trong app)
- `architecture` — Architecture notes (opens in a new tab in the app / mở tab mới trong app)
- `practical-questions` — Practical debugging notes (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `dashboard-15-apis` — Dashboard with 15 APIs
- `lazy-loading-tradeoffs` — Lazy loading trade-offs

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** Take one screen from Parker’s experience and redraw loading, empty, error, and permission-denied states.
  - **VI:** Lấy một màn hình từ kinh nghiệm của Parker và vẽ lại loading, empty, error và permission-denied state.
- **EN:** Rewrite the heading, primary action, and helper copy so the hierarchy is obvious in under 10 seconds.
  - **VI:** Viết lại heading, primary action và helper copy sao cho nhìn dưới 10 giây là hiểu thứ tự ưu tiên.

## Algorithm

- **Problem:** Valid Anagram · Frequency map
- Full prompt: [`artifacts/algo/problems/day-02.md`](./artifacts/algo/problems/day-02.md)
- Code + test in the lab repo: `algorithms/day-02/`

## Checkpoint

- Màn hình đã có đủ state rõ ràng, không chỉ happy path.
  - EN: The screen has explicit state coverage, not just the happy path.
- Giải thích được ít nhất 1 UX trade-off bằng product impact chứ không chỉ là gu.
  - EN: You can explain one UX trade-off with product impact, not taste only.
- Bài algo chạy đúng với reasoning O(n).
  - EN: Algo passes with O(n) reasoning.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-02-lab.md`](./lab/day-02-lab.md)
