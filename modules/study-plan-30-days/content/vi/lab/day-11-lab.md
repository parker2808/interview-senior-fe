# Day 11 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

Reactivity Vue 3 chạy thật sự thế nào? `ref` hay `reactive`? Composable tốt là gì — và khi nào nó thành God object giấu mặt?

## Bạn sẽ produce gì

- Giải thích một feature thật bạn đã làm với ref/reactive/computed/watch, rồi viết lại câu trả lời theo kiểu interviewer hỏi “vì sao thiết kế như vậy?”.
- Review một composable bạn từng viết và xác định nó đang sở hữu state, side effect hay cả hai.

## Senior làm thế nào

- **Quyết định:** Chọn một feature đã ship. Trả lời ‘vì sao thiết kế vậy?’ bằng ownership: ref nào là source of truth, computed nào là derived, watch nào là mùi.
- **Constraint:** Viết lại câu nói + review composable. Hôm nay không tách composable mới vào module khách hàng.
- **Failure mode:** ‘Proxy track dependency’ mà không có ví dụ. Composable vừa fetch, cache, toast, vừa ôm form state. `watch` chỗ đáng dùng `computed`.
- **Cách đo:** Giải thích reactivity không chung chung, và composable đã review có boundary rõ hơn (state xor effect, hoặc cả hai được gọi tên).
- **Trade-off:** `ref` rõ và dễ compose; `reactive` tiện nhưng unwrap tệ qua boundary hàm. API composable nên `ref`.
- **Gotcha production:** Destructure `reactive` mất tracking. `watch` lên getter vs ref. Gọi composable ngoài `setup` mất instance context.

## Tiêu chí xong

- Giải thích được Vue reactivity mà không nói chung chung.
- Đã review xong một composable với boundary rõ hơn.
- Bài algo xong và pattern dùng stack phụ đã rõ.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Nêu một thứ bạn sẽ chuyển ra khỏi composable ngày mai và nó sống ở đâu (component, Pinia, server cache).

## Thuật toán

- **Bài:** Min Stack · Thiết kế stack
- **Ràng buộc:**
- Mọi thao tác O(1)
- **Hint:** Stack phụ lưu min hiện tại, hoặc lưu cặp (value, minSoFar).

```text
algorithms/day-11/solution.ts
algorithms/day-11/solution.test.ts
```

Chạy: `pnpm test:algo -- day-11`

Mở đề đầy đủ: [day-11.md](../artifacts/algo/problems/day-11.md)

## Commit gợi ý

```text
day-11: rewrite one Vue feature answer and review one composable
```
