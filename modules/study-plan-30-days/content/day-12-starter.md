# Day 12 — Interview drill (14/10/2026)

**Theme:** Nuxt rendering and data fetching / Rendering và data fetching trong Nuxt  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Review Nuxt as an interview topic, not just as familiar daily tooling.
- **VI:** Ôn Nuxt như một chủ đề phỏng vấn, không chỉ như tool quen tay hằng ngày.

## What they actually ask

- **EN:** SSR, prerender, or client-heavy — why for this screen? `useFetch` vs `useAsyncData` vs a plain client fetch? What hydration bugs have you actually seen?
- **VI:** SSR, prerender, hay thiên client — vì sao cho màn này? `useFetch` vs `useAsyncData` vs fetch client thường? Bug hydration nào bạn đã gặp thật?

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `nuxt` — Nuxt notes (opens in a new tab in the app / mở tab mới trong app)
- `networking` — Networking notes (opens in a new tab in the app / mở tab mới trong app)
- `performance` — Performance notes (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `nuxt-rendering-modes` — Nuxt rendering modes
- `nuxt-data-fetching` — Nuxt 3 data fetching
- `vue-ssr-hydration` — SSR and hydration pitfalls

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** Take one screen and decide whether it should be SSR, prerendered, or client-heavy in Nuxt. Explain why.
  - **VI:** Chọn một màn hình và quyết định nó nên SSR, prerender hay thiên về client trong Nuxt. Giải thích vì sao.
- **EN:** Write one short answer for: “When would you use useFetch, useAsyncData, or plain client fetch?”
  - **VI:** Viết một câu trả lời ngắn cho: “Khi nào dùng useFetch, useAsyncData hoặc plain client fetch?”

## Algorithm

- **Problem:** Reverse Linked List
- Full prompt: [`artifacts/algo/problems/day-12.md`](./artifacts/algo/problems/day-12.md)
- Code + test in the lab repo: `algorithms/day-12/`

## Checkpoint

- Đã viết ra một quyết định về rendering mode kèm trade-off.
  - EN: One rendering-mode decision is written with trade-offs.
- Giải thích được lựa chọn data fetching của Nuxt theo từng context.
  - EN: Nuxt fetching choices are explainable by context.
- Bài algo xong và thao tác pointer trên linked list đã bớt lúng túng.
  - EN: Algo is done and linked-list pointer movement is comfortable.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-12-lab.md`](./lab/day-12-lab.md)
