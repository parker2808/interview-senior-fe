# Day 8 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** What prints, and why? Walk the event loop: call stack, microtasks, macrotasks. Explain a closure bug and TDZ without slogans.
- **VI:** In ra gì, vì sao? Đi event loop: call stack, microtask, macrotask. Giải thích bug closure và TDZ không bằng khẩu hiệu.

## What you will produce / Bạn sẽ produce gì

- **EN:** Write 3 interview snippets involving setTimeout, Promise, and closure capture. Predict the output before running them.
  - **VI:** Viết 3 snippet phỏng vấn có setTimeout, Promise và closure capture. Đoán output trước khi chạy.
- **EN:** For each snippet, explain the output in plain language, not jargon only.
  - **VI:** Với mỗi snippet, giải thích output bằng ngôn ngữ dễ hiểu chứ không chỉ jargon.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: Three small snippets, predicted output first. One event-loop, one Promise-then vs setTimeout, one loop-closure (`var` vs `let` or captured index).
  - VI: Ba snippet nhỏ, đoán output trước. Một event-loop, một Promise-then vs setTimeout, một loop-closure (`var` vs `let` hoặc index bị capture).
- **Constraint / Ràng buộc:**
  - EN: Snippets in a note or any existing playground. This is not a Vue feature day and not a customer-module split.
  - VI: Snippet trong note hoặc playground có sẵn. Đây không phải ngày feature Vue và không phải tách module khách hàng.
- **Failure mode:**
  - EN: Reciting ‘microtasks before macrotasks’ and then mis-ordering `Promise.then` vs `queueMicrotask` vs `setTimeout(0)`. Saying ‘closure remembers the value’ when it remembers the binding.
  - VI: Thuộc ‘microtask trước macrotask’ rồi vẫn xếp sai `Promise.then` / `queueMicrotask` / `setTimeout(0)`. Nói ‘closure nhớ value’ trong khi nó nhớ binding.
- **Measure / Cách đo:**
  - EN: You can walk one snippet tick by tick and the prediction matches the run.
  - VI: Đi được một snippet từng tick và dự đoán khớp lúc chạy.
- **Tradeoff / Trade-off:**
  - EN: Interviewers want the model, not Node vs browser trivia. Mention `requestAnimationFrame` only if you can place it relative to style/layout.
  - VI: Interviewer muốn model, không phải trivia Node vs browser. Chỉ nhắc `requestAnimationFrame` nếu đặt được nó so với style/layout.
- **Production gotcha / Gotcha production:**
  - EN: Vue watchers and `nextTick` are microtasks. A ‘DOM already updated’ answer that ignores `nextTick` is a production miss.
  - VI: Watcher Vue và `nextTick` là microtask. Câu ‘DOM đã update’ mà bỏ `nextTick` là miss production.

## Done when / Tiêu chí xong

- Giải thích được từng bước của một snippet event loop.
  - EN: You can explain one event-loop snippet step by step.
- Closure và TDZ đã trở nên cụ thể lại, không còn mơ hồ.
  - EN: Closures and TDZ feel concrete again, not fuzzy.
- Bài algo xong với reasoning O(log n).
  - EN: Algo is done with O(log n) reasoning.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Add a fourth snippet that mixes `async/await` with `setTimeout` and predict the await boundary.
- **VI:** Thêm snippet thứ tư trộn `async/await` với `setTimeout` và đoán ranh giới await.

## Algorithm / Thuật toán

- **Problem / Bài:** Binary Search · Search on sorted data / Binary Search · Tìm trên dữ liệu đã sort
- **Constraints / Ràng buộc:**
  - EN:
- 1 ≤ nums.length ≤ 10^4
- All elements unique
- Must be O(log n)
  - VI:
- 1 ≤ nums.length ≤ 10^4
- Mọi phần tử unique
- Phải O(log n)
- **Hint:** while lo<=hi; mid; compare; shrink left or right half.
  - VI: while lo<=hi; mid; so sánh rồi hẹp nửa trái/phải.

```text
algorithms/day-08/solution.ts
algorithms/day-08/solution.test.ts
```

Run: `pnpm test:algo -- day-08`

Open the full prompt: [day-08.md](../artifacts/algo/problems/day-08.md)

## Suggested commit

```text
day-08: three event-loop snippets with predicted output
```
