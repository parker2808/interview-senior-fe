# Day 3 — Interview drill (05/10/2026)

**Theme:** Accessible forms and feedback / Form dễ dùng và accessible  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Make form behavior explicit: labels, validation timing, and feedback that is understandable without guesswork.
- **VI:** Làm cho hành vi của form trở nên rõ ràng: label, thời điểm validate và feedback dễ hiểu, không phải đoán.

## What they actually ask

- **EN:** How do you make a form usable with keyboard and a screen reader? When do you validate — on blur, on submit, or live? Semantic HTML vs ARIA: which do you reach for first?
- **VI:** Làm form dùng được với keyboard và screen reader thế nào? Validate khi nào — blur, submit, hay live? Semantic HTML hay ARIA: cái nào dùng trước?

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `accessibility` — Accessibility basics (opens in a new tab in the app / mở tab mới trong app)
- `javascript` — JavaScript notes (opens in a new tab in the app / mở tab mới trong app)
- `web-apis` — Web APIs notes (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `accessibility-forms-keyboard` — Forms and keyboard accessibility
- `semantic-html-vs-aria-bem` — Semantic HTML vs ARIA

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** Choose one form flow and document: field, validation rule, error message, trigger timing, and disabled state.
  - **VI:** Chọn một flow form và ghi lại: field, rule validate, error message, thời điểm kích hoạt và disabled state.
- **EN:** Check whether keyboard-only and screen-reader users can understand the same flow.
  - **VI:** Kiểm tra xem người dùng chỉ dùng keyboard hoặc screen reader có hiểu được flow tương tự không.

## Algorithm

- **Problem:** Contains Duplicate · Set
- Full prompt: [`artifacts/algo/problems/day-03.md`](./artifacts/algo/problems/day-03.md)
- Code + test in the lab repo: `algorithms/day-03/`

## Checkpoint

- Mỗi field đều có label và rule lỗi rõ ràng.
  - EN: Each field has a clear label and error rule.
- Thời điểm validate là có chủ đích, không phải ngẫu nhiên.
  - EN: Validation timing is intentional, not accidental.
- Bài algo xong và giải thích được vì sao Set là đủ.
  - EN: Algo is done and you can explain why Set is enough here.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-03-lab.md`](./lab/day-03-lab.md)
