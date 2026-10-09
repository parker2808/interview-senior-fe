# Day 10 — Interview drill (12/10/2026)

**Theme:** TypeScript for real frontend models / TypeScript cho model frontend thực tế  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Review the TypeScript tools that matter most when shaping API responses, UI state, and component props.
- **VI:** Ôn lại những công cụ TypeScript quan trọng nhất khi model API response, UI state và component props.

## What they actually ask

- **EN:** How do you type a real admin flow end to end? Where do you narrow? Which utility types are load-bearing? When is `unknown` better than `any`?
- **VI:** Type một admin flow thật từ đầu tới cuối thế nào? Narrow ở đâu? Utility type nào mới chịu lực? Khi nào `unknown` hơn `any`?

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `typescript` — TypeScript notes (opens in a new tab in the app / mở tab mới trong app)
- `networking` — Networking notes (opens in a new tab in the app / mở tab mới trong app)
- `architecture` — Architecture notes (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `ts-narrowing-typeguards` — Narrowing and type guards
- `ts-utility-types` — Utility types
- `ts-designing-api-props` — Designing TS types for props and APIs

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** Model one admin flow with DTO, UI model, mutation payload, and error state types.
  - **VI:** Model một admin flow với DTO, UI model, mutation payload và error state type.
- **EN:** Write down where you want strictness and where flexibility is acceptable.
  - **VI:** Ghi rõ chỗ nào cần strict và chỗ nào có thể cho phép linh hoạt hơn.

## Algorithm

- **Problem:** Longest Substring Without Repeating Characters
- Full prompt: [`artifacts/algo/problems/day-10.md`](./artifacts/algo/problems/day-10.md)
- Code + test in the lab repo: `algorithms/day-10/`

## Checkpoint

- Đã có một type model cụ thể cho một flow thật.
  - EN: You have one concrete type model for a real flow.
- Ít nhất một guard hoặc utility type được dùng có chủ đích.
  - EN: At least one guard or utility type is used on purpose.
- Bài algo hoàn tất và pattern sliding window đã hiểu được.
  - EN: Algo is complete and the sliding-window pattern is understandable.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-10-lab.md`](./lab/day-10-lab.md)
