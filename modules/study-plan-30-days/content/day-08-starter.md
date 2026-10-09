# Day 8 — Interview drill (10/10/2026)

**Theme:** JavaScript execution model / Execution model của JavaScript  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Refresh the JavaScript mental model that sits underneath frontend debugging interviews.
- **VI:** Ôn lại mental model JavaScript nằm bên dưới các câu hỏi debug frontend.

## What they actually ask

- **EN:** What prints, and why? Walk the event loop: call stack, microtasks, macrotasks. Explain a closure bug and TDZ without slogans.
- **VI:** In ra gì, vì sao? Đi event loop: call stack, microtask, macrotask. Giải thích bug closure và TDZ không bằng khẩu hiệu.

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `javascript` — JavaScript notes (opens in a new tab in the app / mở tab mới trong app)
- `web-apis` — Web APIs notes (opens in a new tab in the app / mở tab mới trong app)
- `practical-questions` — Practical debugging notes (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `js-event-loop` — The event loop
- `js-closures` — Closures
- `js-hoisting-tdz` — Hoisting and TDZ

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** Write 3 interview snippets involving setTimeout, Promise, and closure capture. Predict the output before running them.
  - **VI:** Viết 3 snippet phỏng vấn có setTimeout, Promise và closure capture. Đoán output trước khi chạy.
- **EN:** For each snippet, explain the output in plain language, not jargon only.
  - **VI:** Với mỗi snippet, giải thích output bằng ngôn ngữ dễ hiểu chứ không chỉ jargon.

## Algorithm

- **Problem:** Binary Search · Search on sorted data
- Full prompt: [`artifacts/algo/problems/day-08.md`](./artifacts/algo/problems/day-08.md)
- Code + test in the lab repo: `algorithms/day-08/`

## Checkpoint

- Giải thích được từng bước của một snippet event loop.
  - EN: You can explain one event-loop snippet step by step.
- Closure và TDZ đã trở nên cụ thể lại, không còn mơ hồ.
  - EN: Closures and TDZ feel concrete again, not fuzzy.
- Bài algo xong với reasoning O(log n).
  - EN: Algo is done with O(log n) reasoning.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-08-lab.md`](./lab/day-08-lab.md)
