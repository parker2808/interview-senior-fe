# Day 8 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

In ra gì, vì sao? Đi event loop: call stack, microtask, macrotask. Giải thích bug closure và TDZ không bằng khẩu hiệu.

## Bạn sẽ produce gì

- Viết 3 snippet phỏng vấn có setTimeout, Promise và closure capture. Đoán output trước khi chạy.
- Với mỗi snippet, giải thích output bằng ngôn ngữ dễ hiểu chứ không chỉ jargon.

## Senior làm thế nào

- **Quyết định:** Ba snippet nhỏ, đoán output trước. Một event-loop, một Promise-then vs setTimeout, một loop-closure (`var` vs `let` hoặc index bị capture).
- **Constraint:** Snippet trong note hoặc playground có sẵn. Đây không phải ngày feature Vue và không phải tách module khách hàng.
- **Failure mode:** Thuộc ‘microtask trước macrotask’ rồi vẫn xếp sai `Promise.then` / `queueMicrotask` / `setTimeout(0)`. Nói ‘closure nhớ value’ trong khi nó nhớ binding.
- **Cách đo:** Đi được một snippet từng tick và dự đoán khớp lúc chạy.
- **Trade-off:** Interviewer muốn model, không phải trivia Node vs browser. Chỉ nhắc `requestAnimationFrame` nếu đặt được nó so với style/layout.
- **Gotcha production:** Watcher Vue và `nextTick` là microtask. Câu ‘DOM đã update’ mà bỏ `nextTick` là miss production.

## Tiêu chí xong

- Giải thích được từng bước của một snippet event loop.
- Closure và TDZ đã trở nên cụ thể lại, không còn mơ hồ.
- Bài algo xong với reasoning O(log n).
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Thêm snippet thứ tư trộn `async/await` với `setTimeout` và đoán ranh giới await.

## Thuật toán

- **Bài:** Binary Search · Tìm trên dữ liệu đã sort
- **Ràng buộc:**
- 1 ≤ nums.length ≤ 10^4
- Mọi phần tử unique
- Phải O(log n)
- **Hint:** while lo<=hi; mid; so sánh rồi hẹp nửa trái/phải.

```text
algorithms/day-08/solution.ts
algorithms/day-08/solution.test.ts
```

Chạy: `pnpm test:algo -- day-08`

Mở đề đầy đủ: [day-08.md](../artifacts/algo/problems/day-08.md)

## Commit gợi ý

```text
day-08: three event-loop snippets with predicted output
```
