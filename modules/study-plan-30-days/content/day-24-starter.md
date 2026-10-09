# Day 24 — Interview drill (26/10/2026)

**Theme:** Security, release, and resilience / Security, release và resilience  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Refresh the frontend concerns that make a senior answer feel production-aware, not purely UI-focused.
- **VI:** Ôn lại các concern khiến câu trả lời của senior nghe đúng mùi production chứ không chỉ xoay quanh UI.

## What they actually ask

- **EN:** CSRF vs XSS — what changes in the UI? How do you evaluate a third-party script? How do you roll out a frontend feature with flags and a rollback?
- **VI:** CSRF vs XSS — UI đổi gì? Đánh giá third-party script thế nào? Rollout feature frontend với flag và rollback ra sao?

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `security` — Security notes (opens in a new tab in the app / mở tab mới trong app)
- `devops` — DevOps notes (opens in a new tab in the app / mở tab mới trong app)
- `build-tools` — Build tools notes (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `csrf-vs-xss` — CSRF vs XSS
- `third-party-script-risk` — Evaluating third-party scripts
- `feature-flags-rollout` — Using feature flags safely

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** Write a short release checklist for one frontend feature: flags, monitoring, rollback, third-party risk, and post-release watch points.
  - **VI:** Viết một release checklist ngắn cho một feature frontend: flag, monitoring, rollback, risk từ third-party và điểm cần quan sát sau release.
- **EN:** Add one paragraph on how cookie auth, XSS, and CSRF change your UI decisions.
  - **VI:** Thêm một đoạn ngắn về cách cookie auth, XSS và CSRF ảnh hưởng tới quyết định ở UI.

## Algorithm

- **Problem:** Live coding simulation
- Full prompt: [`artifacts/algo/problems/day-24.md`](./artifacts/algo/problems/day-24.md)
- Code + test in the lab repo: `algorithms/day-24/`

## Checkpoint

- Release checklist đủ thực tế để dùng ngay tuần sau.
  - EN: The release checklist is practical enough to use next week.
- Ghi chú security đã gắn với lựa chọn frontend cụ thể.
  - EN: Security notes are tied to concrete frontend choices.
- Đã xong buổi mô phỏng live-coding algo.
  - EN: Live-coding algo session is complete.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-24-lab.md`](./lab/day-24-lab.md)
