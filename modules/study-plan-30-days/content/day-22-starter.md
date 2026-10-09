# Day 22 — Interview drill (24/10/2026)

**Theme:** Design an admin dashboard / Thiết kế một admin dashboard  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Move up one level: orchestrate APIs, loading behavior, failure isolation, and observability for a real frontend surface.
- **VI:** Nâng lên một mức: điều phối API, loading behavior, cô lập lỗi và observability cho một bề mặt frontend thật.

## What they actually ask

- **EN:** Design a dashboard that calls 15 APIs. What loads first, what fails independently, and do you need a BFF? What would you watch in production?
- **VI:** Thiết kế dashboard gọi 15 API. Cái gì load trước, cái gì fail độc lập, và có cần BFF không? Bạn sẽ watch gì trên production?

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `system-design` — System design notes (opens in a new tab in the app / mở tab mới trong app)
- `architecture` — Architecture notes (opens in a new tab in the app / mở tab mới trong app)
- `monitoring` — Monitoring notes (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `dashboard-15-apis` — Dashboard with 15 APIs
- `bff-when` — When to introduce a BFF
- `observability-frontend` — Good frontend observability

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** Take one admin/dashboard idea and outline widgets, API dependencies, failure boundaries, and which data can arrive progressively.
  - **VI:** Chọn một ý tưởng admin/dashboard và vẽ ra widget, phụ thuộc API, boundary của lỗi và phần data nào có thể hiện dần.
- **EN:** State whether a BFF is justified or whether better API contracts are enough.
  - **VI:** Kết luận xem có cần BFF thật hay chỉ cần API contract tốt hơn là đủ.

## Algorithm

- **Problem:** House Robber · DP 1D
- Full prompt: [`artifacts/algo/problems/day-22.md`](./artifacts/algo/problems/day-22.md)
- Code + test in the lab repo: `algorithms/day-22/`

## Checkpoint

- Kế hoạch dashboard đã tách rõ kiến trúc với hành vi UX.
  - EN: The dashboard plan separates architecture from UX behavior.
- Đã có quan điểm rõ về BFF so với gọi API trực tiếp.
  - EN: There is a clear opinion on BFF vs direct APIs.
- Bài algo xong và hiểu được ý tưởng DP cuộn.
  - EN: Algo is done and the rolling-DP idea is clear.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-22-lab.md`](./lab/day-22-lab.md)
