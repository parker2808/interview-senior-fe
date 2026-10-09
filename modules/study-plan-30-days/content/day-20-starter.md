# Day 20 — Interview drill (22/10/2026)

**Theme:** Server Actions, middleware, SEO, and assets / Server Actions, middleware, SEO và tối ưu asset  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Round out the practical Next.js topics that often show up in senior frontend interviews.
- **VI:** Bổ sung những chủ đề Next.js thực dụng thường xuất hiện trong phỏng vấn senior frontend.

## What they actually ask

- **EN:** When do Server Actions help and when are they the wrong tool? What can middleware actually do? How do you handle metadata, images, fonts, and a first deploy?
- **VI:** Khi nào Server Actions giúp và khi nào chúng là sai tool? Middleware làm được gì thật? Metadata, image, font và deploy lần đầu bạn xử lý ra sao?

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `nextjs` — Next.js notes (opens in a new tab in the app / mở tab mới trong app)
- `security` — Security notes (opens in a new tab in the app / mở tab mới trong app)
- `build-tools` — Build tools notes (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `next-server-actions` — Server Actions
- `next-middleware-use-cases` — Next middleware use cases and limits
- `next-metadata-image-font-deployment` — Metadata, SEO, image/font optimization, and deployment basics

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** List which parts of a small admin flow belong in Server Actions, Route Handlers, or plain client mutations.
  - **VI:** Liệt kê phần nào của một flow admin nhỏ nên nằm ở Server Actions, Route Handlers hay mutation phía client.
- **EN:** Write a deployment checklist: env vars, caching assumptions, image/font usage, and what to verify after deploy.
  - **VI:** Viết một deployment checklist: env vars, giả định về cache, dùng image/font thế nào và cần verify gì sau deploy.

## Algorithm

- **Problem:** Coin Change · DP
- Full prompt: [`artifacts/algo/problems/day-20.md`](./artifacts/algo/problems/day-20.md)
- Code + test in the lab repo: `algorithms/day-20/`

## Checkpoint

- Giải thích được khi nào Server Actions làm flow đơn giản hơn và khi nào thì không.
  - EN: You can explain when Server Actions simplify a flow and when they do not.
- Middleware, SEO và tối ưu asset đã gắn với use case cụ thể.
  - EN: Middleware, SEO, and asset optimization are tied to concrete use cases.
- Bài algo xong và giải thích được cách chọn state cho DP.
  - EN: Algo is done and the DP state choice is explainable.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-20-lab.md`](./lab/day-20-lab.md)
