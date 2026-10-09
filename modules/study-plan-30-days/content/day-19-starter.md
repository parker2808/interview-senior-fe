# Day 19 — Interview drill (21/10/2026)

**Theme:** Next data fetching, cache, and rendering modes / Data fetching, cache và rendering mode của Next  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Cover the Next.js topics that usually reveal whether someone only skimmed the framework or really understands it.
- **VI:** Ôn các chủ đề Next.js thường bộc lộ ngay việc một người chỉ lướt qua hay đã hiểu framework thật sự.

## What they actually ask

- **EN:** How does Next fetch, cache, and revalidate? SSR vs SSG vs ISR vs streaming — pick for marketing, admin list, and personalized detail. Map that to Nuxt `useAsyncData` / `useFetch`.
- **VI:** Next fetch, cache và revalidate thế nào? SSR vs SSG vs ISR vs streaming — chọn cho marketing, admin list và detail cá nhân hoá. Map sang `useAsyncData` / `useFetch` của Nuxt.

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `nextjs` — Next.js notes (opens in a new tab in the app / mở tab mới trong app)
- `networking` — Networking notes (opens in a new tab in the app / mở tab mới trong app)
- `nuxt` — Nuxt notes (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `next-data-fetching-cache-revalidation` — Next data fetching, cache, and revalidation
- `next-rendering-modes-streaming` — SSR, SSG, ISR, and streaming in Next
- `nuxt-data-fetching` — Nuxt data fetching as a comparison point

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** Write a comparison table: useAsyncData/useFetch in Nuxt vs server fetch / no-store / revalidate in Next.
  - **VI:** Viết bảng so sánh: useAsyncData/useFetch của Nuxt với server fetch / no-store / revalidate của Next.
- **EN:** For three page types (marketing, admin list, personalized detail), choose SSR/SSG/ISR/streaming and explain why.
  - **VI:** Với ba loại trang (marketing, admin list, personalized detail), chọn SSR/SSG/ISR/streaming và giải thích vì sao.

## Algorithm

- **Problem:** Climbing Stairs · DP
- Full prompt: [`artifacts/algo/problems/day-19.md`](./artifacts/algo/problems/day-19.md)
- Code + test in the lab repo: `algorithms/day-19/`

## Checkpoint

- Quyết định cache vs fresh data đã được ghi theo từng loại trang.
  - EN: Cache vs fresh data decisions are written by page type.
- Streaming và ISR không còn chỉ là buzzword.
  - EN: Streaming and ISR no longer sound like buzzwords only.
- Bài algo xong và recurrence của DP đã rõ.
  - EN: Algo is done and the DP recurrence is clear.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-19-lab.md`](./lab/day-19-lab.md)
