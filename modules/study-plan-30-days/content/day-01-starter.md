# Day 1 — Interview drill (03/10/2026)

**Theme:** Inventory the UI system / Kiểm kê hệ thống UI  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Start from one real screen and identify the tokens, primitives, and repeated states hidden inside it.
- **VI:** Bắt đầu từ một màn hình thật và chỉ ra token, primitive và các state lặp lại đang ẩn bên trong.

## What they actually ask

- **EN:** How would you grow a design system from a real product, not a Figma kit? Which CSS/layout decisions are actually senior-level? Walk one shipped admin screen: tokens, primitives, repeated states.
- **VI:** Bạn sẽ phát triển design system từ sản phẩm thật chứ không phải bộ Figma thế nào? Quyết định CSS/layout nào mới thật sự là mức senior? Đi một màn admin đã ship: token, primitive, state lặp lại.

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `architecture` — Architecture notes (opens in a new tab in the app / mở tab mới trong app)
- `css-layout` — CSS layout notes (opens in a new tab in the app / mở tab mới trong app)
- `project-context.md` — Project context (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `design-system-strategy` — Design system growth strategy
- `css-layout-specificity` — Senior-level CSS topics

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** Pick one admin screen and list colors, spacing, typography, feedback states, and repeated component patterns.
  - **VI:** Chọn một màn admin và liệt kê màu, spacing, typography, feedback state và pattern component lặp lại.
- **EN:** Write a short note: which 3 primitives would you extract first and why?
  - **VI:** Viết một note ngắn: 3 primitive nào nên tách ra trước và vì sao?

## Algorithm

- **Problem:** Two Sum · Hash map warm-up
- Full prompt: [`artifacts/algo/problems/day-01.md`](./artifacts/algo/problems/day-01.md)
- Code + test in the lab repo: `algorithms/day-01/`

## Checkpoint

- Đã mổ xẻ xong 1 màn hình thành token và primitive.
  - EN: One screen audited into tokens and primitives.
- Đã ghi được ít nhất 2 state dùng lại: loading / empty / error / success.
  - EN: At least 2 reusable states noted: loading / empty / error / success.
- Bài algo chạy đúng và giải thích được vì sao HashMap thắng brute force.
  - EN: Algo passes and you can explain why HashMap wins over brute force.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-01-lab.md`](./lab/day-01-lab.md)
