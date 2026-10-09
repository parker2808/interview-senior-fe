# Day 13 — Interview drill (15/10/2026)

**Theme:** State ownership, Pinia, and cache boundaries / State ownership, Pinia và cache boundary  
**Timebox:** 90-120 minutes

## Goal

- **EN:** Clarify what belongs in component state, URL state, server cache, and app-level stores.
- **VI:** Làm rõ thứ gì nên nằm ở component state, URL state, server cache hay app-level store.

## What they actually ask

- **EN:** What belongs in Pinia vs the URL vs Nuxt/server cache? How do you handle role/permission in the UI without making the store the security layer?
- **VI:** Cái gì vào Pinia, cái gì vào URL, cái gì vào cache Nuxt/server? Role/permission trên UI thế nào mà store không thành lớp bảo mật?

Train a spoken answer in this shape: **decision → constraint → failure mode → measure → tradeoff → production gotcha**.

## Read

Docs and plan links open in a **new tab** in the app. Stay on the day page. This is interview prep, not a curriculum to finish.

- `state-management` — State management notes (opens in a new tab in the app / mở tab mới trong app)
- `nuxt` — Nuxt notes (opens in a new tab in the app / mở tab mới trong app)
- `monitoring` — Monitoring notes (opens in a new tab in the app / mở tab mới trong app)

## Practice Q&A

Q&A links also open in a **new tab**. Answer out loud, then check the bank.

- `pinia-design` — What belongs in Pinia?
- `nuxt-route-rules-caching` — Nuxt route rules and caching
- `role-permission-ui` — Role and permission handling in UI

## Hands-on

Interview drill — a note, snippet, or tiny spike. Not a product.

- **EN:** Draw a state map for one flow: who owns it, who reads it, and how stale data is refreshed.
  - **VI:** Vẽ state map cho một flow: ai sở hữu, ai đọc và dữ liệu stale được làm mới ra sao.
- **EN:** Mark one piece of state that should move out of the store and one that should move into a shared layer.
  - **VI:** Đánh dấu một state nên đưa ra khỏi store và một state nên đưa vào layer dùng chung.

## Algorithm

- **Problem:** Linked List Cycle · Floyd pointers
- Full prompt: [`artifacts/algo/problems/day-13.md`](./artifacts/algo/problems/day-13.md)
- Code + test in the lab repo: `algorithms/day-13/`

## Checkpoint

- State map có source of truth rõ ràng.
  - EN: The state map has a clear source of truth.
- Đã ghi rõ quyết định store vs cache vs URL.
  - EN: Store vs cache vs URL choices are written down.
- Bài algo xong và pattern Floyd đã thấy hợp lý.
  - EN: Algo is done and the Floyd pattern makes sense.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

Lab: [`lab/day-13-lab.md`](./lab/day-13-lab.md)
