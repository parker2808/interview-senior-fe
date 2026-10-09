# Day 9 — Interview drill (11/10/2026)

**Theme:** Promises, fetch, and browser events / Promise, fetch và event trong browser  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Sharpen async reasoning so network and UI behavior sound production-ready in interviews.
- **VI:** Mài sắc cách nghĩ về async để khi nói về network và UI behavior nghe giống kinh nghiệm production.

## What they actually ask

- **EN:** When does one failed request block the whole UI? `Promise.all` vs `allSettled` vs `race`? How do you cancel a stale search? Event delegation vs 200 row listeners?
- **VI:** Khi nào một request lỗi chặn cả UI? `Promise.all` vs `allSettled` vs `race`? Huỷ search stale thế nào? Event delegation hay 200 listener từng hàng?

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `javascript` — JavaScript notes (opens in a new tab in the app / mở tab mới trong app)
- `networking` — Networking notes (opens in a new tab in the app / mở tab mới trong app)
- `web-apis` — Web APIs notes (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `js-promise-combinators` — Promise combinators
- `promise-basics` — Promise basics
- `dom-event-propagation-delegation` — Event propagation and delegation

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** Compare Promise.all vs allSettled vs race on one realistic frontend case such as dashboard widgets or parallel lookups.
  - **VI:** So sánh Promise.all, allSettled và race trên một case frontend thực tế như dashboard widget hoặc lookup song song.
- **EN:** Sketch how you would cancel or ignore stale responses in a search flow.
  - **VI:** Phác thảo cách huỷ hoặc bỏ qua response stale trong một flow search.

## Algorithm

- **Problem:** Two Sum II · Two pointers
- Full prompt: [`artifacts/algo/problems/day-09.md`](./artifacts/algo/problems/day-09.md)
- Code + test in the lab repo: `algorithms/day-09/`

## Checkpoint

- Biết khi nào lỗi của một request nên chặn toàn bộ UI và khi nào thì không.
  - EN: You know when failure of one request should block the whole UI and when it should not.
- Giải thích được event propagation và delegation bằng một ví dụ DOM.
  - EN: Event propagation and delegation are explainable with one DOM example.
- Bài algo xong và pattern two pointers đã rõ.
  - EN: Algo is done and the two-pointer pattern is clear.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-09-lab.md`](./lab/day-09-lab.md)
