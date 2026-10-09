# Day 5 — Interview drill (07/10/2026)

**Theme:** Keyboard-first interaction review / Review tương tác theo hướng keyboard-first  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Review interaction quality from the perspective of someone who cannot rely on a mouse.
- **VI:** Review chất lượng tương tác theo góc nhìn của người không thể dựa vào chuột.

## What they actually ask

- **EN:** Can you finish this admin flow with only a keyboard? Where does focus go after a modal closes? When is lazy-loading a keyboard trap?
- **VI:** Hoàn thành flow admin này chỉ bằng keyboard được không? Focus đi đâu sau khi đóng modal? Khi nào lazy-load thành bẫy keyboard?

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `accessibility` — Accessibility basics (opens in a new tab in the app / mở tab mới trong app)
- `web-apis` — Web APIs notes (opens in a new tab in the app / mở tab mới trong app)
- `architecture` — Architecture notes (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `accessibility-forms-keyboard` — Forms and keyboard accessibility
- `lazy-loading-tradeoffs` — Lazy loading trade-offs

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** Run a keyboard-only pass on one real flow: Tab, Shift+Tab, Enter, Escape, and focus return.
  - **VI:** Chạy một lượt keyboard-only trên một flow thật: Tab, Shift+Tab, Enter, Escape và focus return.
- **EN:** Write down the top 3 keyboard or focus issues you would fix first.
  - **VI:** Ghi lại 3 lỗi keyboard hoặc focus nên sửa trước.

## Algorithm

- **Problem:** Top K Frequent Elements · Hash map + bucket
- Full prompt: [`artifacts/algo/problems/day-05.md`](./artifacts/algo/problems/day-05.md)
- Code + test in the lab repo: `algorithms/day-05/`

## Checkpoint

- Đã ghi được thứ tự keyboard cho 1 flow thật.
  - EN: Keyboard order is documented for one real flow.
- Đã chỉ ra ít nhất 1 bug focus kèm hướng sửa cụ thể.
  - EN: At least 1 focus bug is identified with a concrete fix.
- Bài algo xanh và trade-off độ phức tạp đã rõ.
  - EN: Algo is green and the complexity trade-off is clear.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-05-lab.md`](./lab/day-05-lab.md)
