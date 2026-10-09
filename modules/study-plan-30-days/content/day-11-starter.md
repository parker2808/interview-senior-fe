# Day 11 — Interview drill (13/10/2026)

**Theme:** Vue reactivity and composables / Vue reactivity và composable  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Turn everyday Vue knowledge into crisp interview explanations with trade-offs and boundaries.
- **VI:** Biến kiến thức Vue hằng ngày thành các câu trả lời phỏng vấn gọn, rõ và có trade-off.

## What they actually ask

- **EN:** How does Vue 3 reactivity actually work? `ref` vs `reactive`? What makes a composable good — and when is it a hidden God object?
- **VI:** Reactivity Vue 3 chạy thật sự thế nào? `ref` hay `reactive`? Composable tốt là gì — và khi nào nó thành God object giấu mặt?

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `vue3` — Vue 3 notes (opens in a new tab in the app / mở tab mới trong app)
- `state-management` — State management notes (opens in a new tab in the app / mở tab mới trong app)
- `performance` — Performance notes (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `vue-reactivity-internals` — Vue 3 reactivity internals
- `vue-ref-vs-reactive` — ref vs reactive
- `vue-composables` — What makes a good composable?

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** Explain one real feature you built using ref/reactive/computed/watch, then rewrite the explanation as if an interviewer asked “why this design?”.
  - **VI:** Giải thích một feature thật bạn đã làm với ref/reactive/computed/watch, rồi viết lại câu trả lời theo kiểu interviewer hỏi “vì sao thiết kế như vậy?”.
- **EN:** Review one composable you wrote before and identify whether it owns state, side effects, or both.
  - **VI:** Review một composable bạn từng viết và xác định nó đang sở hữu state, side effect hay cả hai.

## Algorithm

- **Problem:** Min Stack · Stack design
- Full prompt: [`artifacts/algo/problems/day-11.md`](./artifacts/algo/problems/day-11.md)
- Code + test in the lab repo: `algorithms/day-11/`

## Checkpoint

- Giải thích được Vue reactivity mà không nói chung chung.
  - EN: You can explain Vue reactivity without hand-waving.
- Đã review xong một composable với boundary rõ hơn.
  - EN: One composable review is done with clearer boundaries.
- Bài algo xong và pattern dùng stack phụ đã rõ.
  - EN: Algo is done and the “supporting stack” pattern is clear.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-11-lab.md`](./lab/day-11-lab.md)
