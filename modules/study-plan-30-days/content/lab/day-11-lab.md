# Day 11 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** How does Vue 3 reactivity actually work? `ref` vs `reactive`? What makes a composable good — and when is it a hidden God object?
- **VI:** Reactivity Vue 3 chạy thật sự thế nào? `ref` hay `reactive`? Composable tốt là gì — và khi nào nó thành God object giấu mặt?

## What you will produce / Bạn sẽ produce gì

- **EN:** Explain one real feature you built using ref/reactive/computed/watch, then rewrite the explanation as if an interviewer asked “why this design?”.
  - **VI:** Giải thích một feature thật bạn đã làm với ref/reactive/computed/watch, rồi viết lại câu trả lời theo kiểu interviewer hỏi “vì sao thiết kế như vậy?”.
- **EN:** Review one composable you wrote before and identify whether it owns state, side effects, or both.
  - **VI:** Review một composable bạn từng viết và xác định nó đang sở hữu state, side effect hay cả hai.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: Pick one shipped feature. Answer ‘why this design?’ with ownership: which refs are source of truth, which computed is derived, which watch is a smell.
  - VI: Chọn một feature đã ship. Trả lời ‘vì sao thiết kế vậy?’ bằng ownership: ref nào là source of truth, computed nào là derived, watch nào là mùi.
- **Constraint / Ràng buộc:**
  - EN: Spoken-answer rewrite + composable review. Do not extract a new composable into a customer module today.
  - VI: Viết lại câu nói + review composable. Hôm nay không tách composable mới vào module khách hàng.
- **Failure mode:**
  - EN: ‘Proxy tracks dependencies’ with no example. A composable that fetches, caches, toasts, and owns form state. `watch` used where `computed` would do.
  - VI: ‘Proxy track dependency’ mà không có ví dụ. Composable vừa fetch, cache, toast, vừa ôm form state. `watch` chỗ đáng dùng `computed`.
- **Measure / Cách đo:**
  - EN: You can explain reactivity without hand-waving, and the reviewed composable has a clearer boundary (state xor effect, or both named).
  - VI: Giải thích reactivity không chung chung, và composable đã review có boundary rõ hơn (state xor effect, hoặc cả hai được gọi tên).
- **Tradeoff / Trade-off:**
  - EN: `ref` is explicit and composes; `reactive` is ergonomic and unwraps badly across function boundaries. Prefer `ref` in composable APIs.
  - VI: `ref` rõ và dễ compose; `reactive` tiện nhưng unwrap tệ qua boundary hàm. API composable nên `ref`.
- **Production gotcha / Gotcha production:**
  - EN: Destructuring `reactive` drops tracking. `watch` on a getter vs a ref. Composables called outside `setup` lose the instance context.
  - VI: Destructure `reactive` mất tracking. `watch` lên getter vs ref. Gọi composable ngoài `setup` mất instance context.

## Done when / Tiêu chí xong

- Giải thích được Vue reactivity mà không nói chung chung.
  - EN: You can explain Vue reactivity without hand-waving.
- Đã review xong một composable với boundary rõ hơn.
  - EN: One composable review is done with clearer boundaries.
- Bài algo xong và pattern dùng stack phụ đã rõ.
  - EN: Algo is done and the “supporting stack” pattern is clear.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Name one thing you would move out of the composable tomorrow and where it would live instead (component, Pinia, server cache).
- **VI:** Nêu một thứ bạn sẽ chuyển ra khỏi composable ngày mai và nó sống ở đâu (component, Pinia, server cache).

## Algorithm / Thuật toán

- **Problem / Bài:** Min Stack · Stack design / Min Stack · Thiết kế stack
- **Constraints / Ràng buộc:**
  - EN:
- Every operation O(1)
  - VI:
- Mọi thao tác O(1)
- **Hint:** Auxiliary stack of current min, or store (value, minSoFar) pairs.
  - VI: Stack phụ lưu min hiện tại, hoặc lưu cặp (value, minSoFar).

```text
algorithms/day-11/solution.ts
algorithms/day-11/solution.test.ts
```

Run: `pnpm test:algo -- day-11`

Open the full prompt: [day-11.md](../artifacts/algo/problems/day-11.md)

## Suggested commit

```text
day-11: rewrite one Vue feature answer and review one composable
```
