# Day 21 — Interview drill (23/10/2026)

**Theme:** Small Next.js hands-on task / Hands-on nhỏ với Next.js  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Prove the theory with one small App Router task that touches both server and client concerns.
- **VI:** Chứng minh phần lý thuyết bằng một task App Router nhỏ chạm vào cả concern phía server và client.

## What they actually ask

- **EN:** Show me a tiny App Router slice you actually ran. Where is the server fetch, where is the client island, and how does this compare to the same slice in Nuxt 3?
- **VI:** Show một slice App Router nhỏ bạn đã chạy thật. Fetch server ở đâu, client island ở đâu, và so với cùng slice trong Nuxt 3 thế nào?

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `nextjs` — Next.js notes (opens in a new tab in the app / mở tab mới trong app)
- `devops` — DevOps notes (opens in a new tab in the app / mở tab mới trong app)
- `monitoring` — Monitoring notes (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `next-app-router-rsc` — What App Router and RSC solve
- `next-data-fetching-cache-revalidation` — Next data fetching, cache, and revalidation
- `next-metadata-image-font-deployment` — SEO, image/font optimization, and deployment basics

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** Build a tiny `/customers` route in a Next lab: root layout, dashboard layout, server-fetched list page, one small client filter, loading.tsx, error.tsx, and page metadata.
  - **VI:** Dựng một route `/customers` nhỏ trong lab Next: root layout, dashboard layout, list page fetch ở server, một bộ lọc nhỏ phía client, loading.tsx, error.tsx và metadata cho page.
- **EN:** After it works, write 5 lines comparing the same slice in Nuxt 3.
  - **VI:** Sau khi chạy được, viết 5 dòng so sánh cùng slice đó nếu làm bằng Nuxt 3.

## Algorithm

- **Problem:** Week 3 timed review
- Full prompt: [`artifacts/algo/problems/day-21.md`](./artifacts/algo/problems/day-21.md)
- Code + test in the lab repo: `algorithms/day-21/`

## Checkpoint

- Slice Next.js chạy được thật, dù scope nhỏ.
  - EN: The Next.js slice actually runs, even if tiny.
- Phần so sánh Nuxt ↔ Next được viết từ trải nghiệm, không phải chép docs.
  - EN: The Nuxt ↔ Next comparison is written from experience, not copied from docs.
- Đã xong phần algo review tính giờ.
  - EN: Timed algo review is complete.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-21-lab.md`](./lab/day-21-lab.md)
