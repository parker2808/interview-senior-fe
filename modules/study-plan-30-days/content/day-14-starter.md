# Day 14 — Interview drill (16/10/2026)

**Theme:** Performance and debugging review / Review performance và debugging  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Finish the fundamentals review by linking performance signals to actual debugging and user impact.
- **VI:** Khép phần fundamentals bằng cách nối tín hiệu performance với debug thực tế và impact tới user.

## What they actually ask

- **EN:** Tell a performance story from production. Which Vue pattern actually moved the metric? Which Core Web Vital maps to the symptom users filed?
- **VI:** Kể một story performance từ production. Pattern Vue nào thật sự nhúc nhích metric? Core Web Vital nào map với symptom user báo?

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `performance` — Performance notes (opens in a new tab in the app / mở tab mới trong app)
- `monitoring` — Monitoring notes (opens in a new tab in the app / mở tab mới trong app)
- `practical-questions` — Practical debugging notes (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `vue-performance-patterns` — Vue performance patterns
- `core-web-vitals` — Core Web Vitals
- `perf-issue-story` — Performance issue investigation story

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** Take one production issue you remember and retell it using symptom → measurement → root cause → fix → regression guard.
  - **VI:** Lấy một production issue bạn từng gặp và kể lại theo symptom → measurement → root cause → fix → regression guard.
- **EN:** Write down which metric or signal you would watch first next time.
  - **VI:** Viết lại metric hoặc tín hiệu nào bạn sẽ nhìn đầu tiên nếu gặp lại lần sau.

## Algorithm

- **Problem:** Week 2 timed review
- Full prompt: [`artifacts/algo/problems/day-14.md`](./artifacts/algo/problems/day-14.md)
- Code + test in the lab repo: `algorithms/day-14/`

## Checkpoint

- Một câu chuyện performance đã ở trạng thái interview-ready.
  - EN: One performance story is now interview-ready.
- Nối được một metric với triệu chứng user-facing.
  - EN: You can connect a metric to a user-facing symptom.
- Đã xong phần algo review tính giờ.
  - EN: Timed algo review is complete.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-14-lab.md`](./lab/day-14-lab.md)
