# Day 23 — Interview drill (25/10/2026)

**Theme:** Data-heavy surfaces and performance trade-offs / Bề mặt nhiều dữ liệu và trade-off performance  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Practice senior reasoning on rendering cost, bundle size, and interaction speed for large UIs.
- **VI:** Luyện tư duy senior về chi phí render, kích thước bundle và tốc độ tương tác của UI lớn.

## What they actually ask

- **EN:** A table with 50,000 rows — what do you do first? Is the bottleneck data volume, render cost, or bundle cost? Which optimization would you actually ship?
- **VI:** Table 50.000 dòng — bạn làm gì trước? Bottleneck là lượng data, chi phí render hay bundle? Tối ưu nào bạn sẽ ship thật?

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `system-design` — System design notes (opens in a new tab in the app / mở tab mới trong app)
- `performance` — Performance notes (opens in a new tab in the app / mở tab mới trong app)
- `build-tools` — Build tools notes (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `table-50k-rows` — Table with 50,000 rows
- `bundling-code-splitting` — Bundling and code splitting
- `core-web-vitals` — Core Web Vitals

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** Review a large-screen flow from your past work and list its 3 likely bottlenecks: data volume, render cost, or bundle cost.
  - **VI:** Review một flow màn hình lớn từ kinh nghiệm cũ và liệt kê 3 bottleneck có khả năng nhất: lượng data, chi phí render hay chi phí bundle.
- **EN:** Choose one optimization you would actually ship first and explain why it beats the alternatives.
  - **VI:** Chọn một tối ưu bạn sẽ ship trước thật sự và giải thích vì sao nó đáng hơn các lựa chọn khác.

## Algorithm

- **Problem:** Warm-up easy set
- Full prompt: [`artifacts/algo/problems/day-23.md`](./artifacts/algo/problems/day-23.md)
- Code + test in the lab repo: `algorithms/day-23/`

## Checkpoint

- Các bottleneck đã được ưu tiên rõ chứ không chỉ liệt kê.
  - EN: The bottlenecks are prioritized, not just listed.
- Một lựa chọn tối ưu đã gắn với user impact và risk.
  - EN: One optimization choice is tied to user impact and risk.
- Đã xong buổi warm-up algo.
  - EN: Warm-up algo session is complete.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-23-lab.md`](./lab/day-23-lab.md)
