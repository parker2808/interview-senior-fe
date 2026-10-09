# Day 18 — Interview drill (20/10/2026)

**Theme:** App Router, layouts, loading, and errors / App Router, layout, loading và error  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Understand the App Router as a system: routing, nested layouts, segment-level loading, and error boundaries.
- **VI:** Hiểu App Router như một hệ thống: routing, nested layout, loading theo segment và error boundary.

## What they actually ask

- **EN:** What problem do App Router and RSC actually solve? How do nested layouts and `loading.tsx` / `error.tsx` work per segment? When is a Client Component required?
- **VI:** App Router và RSC giải bài toán gì? Nested layout và `loading.tsx` / `error.tsx` theo segment hoạt động ra sao? Khi nào bắt buộc Client Component?

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `nextjs` — Next.js notes (opens in a new tab in the app / mở tab mới trong app)
- `nuxt` — Nuxt notes (opens in a new tab in the app / mở tab mới trong app)
- `react` — React notes (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `next-app-router-rsc` — What App Router and RSC solve
- `next-app-router-layouts-loading-error` — App Router layouts, routing, loading, and error states
- `next-server-client-components` — Server vs Client Components

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** Sketch a tiny Next app tree with root layout, dashboard layout, one page, loading.tsx, and error.tsx.
  - **VI:** Vẽ cây thư mục cho một app Next nhỏ với root layout, dashboard layout, một page, loading.tsx và error.tsx.
- **EN:** For each file, write the Nuxt 3 idea it most closely matches.
  - **VI:** Với mỗi file, ghi lại khái niệm Nuxt 3 gần nhất mà nó map tới.

## Algorithm

- **Problem:** Number of Islands · Grid BFS/DFS
- Full prompt: [`artifacts/algo/problems/day-18.md`](./artifacts/algo/problems/day-18.md)
- Code + test in the lab repo: `algorithms/day-18/`

## Checkpoint

- Giải thích được nested layout và loading theo segment mà không cần mở docs.
  - EN: You can explain nested layouts and segment-level loading without looking up the docs.
- Ranh giới Server vs Client rõ hơn mức “interactive thì client”.
  - EN: The Server vs Client boundary is clearer than “interactive = client”.
- Bài algo xong và thao tác duyệt grid vẫn ổn.
  - EN: Algo is done and grid traversal still feels okay.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-18-lab.md`](./lab/day-18-lab.md)
