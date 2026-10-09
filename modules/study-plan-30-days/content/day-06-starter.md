# Day 6 — Interview drill (08/10/2026)

**Theme:** Component APIs with TypeScript / Thiết kế API component với TypeScript  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Design component props like a senior: predictable, typed, and hard to misuse.
- **VI:** Thiết kế props của component theo kiểu senior: dễ đoán, có type và khó dùng sai.

## What they actually ask

- **EN:** How do you type props so the next engineer cannot misuse the component? When do you want a union vs a generic? Show Button, TextField, EmptyState.
- **VI:** Type props thế nào để engineer sau không dùng sai component? Khi nào dùng union, khi nào generic? Show Button, TextField, EmptyState.

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `typescript` — TypeScript notes (opens in a new tab in the app / mở tab mới trong app)
- `architecture` — Architecture notes (opens in a new tab in the app / mở tab mới trong app)
- `css-layout` — CSS layout notes (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `ts-designing-api-props` — Designing TS types for props and APIs
- `ts-generics` — TypeScript generics

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** Spec 3 core component APIs (for example Button, TextField, EmptyState) with props, variants, and misuse guardrails.
  - **VI:** Spec 3 API component cốt lõi (ví dụ Button, TextField, EmptyState) gồm props, variant và guardrail chống dùng sai.
- **EN:** Mark which props must stay simple and which ones should be extensible.
  - **VI:** Đánh dấu prop nào phải giữ thật đơn giản và prop nào nên cho phép mở rộng.

## Algorithm

- **Problem:** Valid Parentheses · Stack
- Full prompt: [`artifacts/algo/problems/day-06.md`](./artifacts/algo/problems/day-06.md)
- Code + test in the lab repo: `algorithms/day-06/`

## Checkpoint

- Ba API component đã được type và ghi chú rõ.
  - EN: Three component APIs are typed and documented.
- Có ít nhất một union hoặc generic được dùng có chủ đích.
  - EN: At least one union or generic is used intentionally.
- Bài algo xong và pattern stack đã thấy quen tay.
  - EN: Algo is done and the stack pattern feels natural.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-06-lab.md`](./lab/day-06-lab.md)
