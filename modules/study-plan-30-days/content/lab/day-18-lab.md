# Day 18 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** What problem do App Router and RSC actually solve? How do nested layouts and `loading.tsx` / `error.tsx` work per segment? When is a Client Component required?
- **VI:** App Router và RSC giải bài toán gì? Nested layout và `loading.tsx` / `error.tsx` theo segment hoạt động ra sao? Khi nào bắt buộc Client Component?

## What you will produce / Bạn sẽ produce gì

- **EN:** Sketch a tiny Next app tree with root layout, dashboard layout, one page, loading.tsx, and error.tsx.
  - **VI:** Vẽ cây thư mục cho một app Next nhỏ với root layout, dashboard layout, một page, loading.tsx và error.tsx.
- **EN:** For each file, write the Nuxt 3 idea it most closely matches.
  - **VI:** Với mỗi file, ghi lại khái niệm Nuxt 3 gần nhất mà nó map tới.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: Sketch the tree, then map each file to Nuxt (`app.vue`, layouts, `pages/`, `<NuxtPage>`, error.vue, route-level loading). Server by default; `'use client'` at the leaf that needs state or browser APIs.
  - VI: Vẽ cây, rồi map từng file sang Nuxt (`app.vue`, layouts, `pages/`, `<NuxtPage>`, error.vue, loading theo route). Mặc định Server; `'use client'` ở leaf cần state hoặc browser API.
- **Constraint / Ràng buộc:**
  - EN: A folder sketch in a note. Do not `create-next-app` today. The small running slice is Day 21.
  - VI: Sketch thư mục trong note. Hôm nay không `create-next-app`. Slice chạy được là Day 21.
- **Failure mode:**
  - EN: ‘Interactive = client’ as the whole rule. Putting `'use client'` on the root layout. Confusing `error.tsx` with an API 500 handler.
  - VI: ‘Interactive = client’ là cả rule. Dán `'use client'` lên root layout. Nhầm `error.tsx` với handler 500 của API.
- **Measure / Cách đo:**
  - EN: You can explain nested layouts and segment-level loading without docs, and Server vs Client is sharper than ‘interactive = client’.
  - VI: Giải thích nested layout và loading theo segment không cần docs, và Server vs Client sắc hơn mức ‘interactive thì client’.
- **Tradeoff / Trade-off:**
  - EN: Nested layouts preserve shell state across navigations (good for dashboards, surprising if you expected a full remount). Segment `error.tsx` isolates failure — until you forget a root fallback.
  - VI: Nested layout giữ state shell khi navigate (tốt cho dashboard, lạ nếu bạn chờ remount hết). `error.tsx` theo segment cô lập lỗi — đến khi quên fallback ở root.
- **Production gotcha / Gotcha production:**
  - EN: Client leaves above a Server Component are illegal. `loading.tsx` wraps the segment in Suspense — instant navigation can flash an empty shell if the fallback is huge.
  - VI: Client ở trên Server Component là bất hợp pháp. `loading.tsx` bọc segment trong Suspense — navigate nhanh có thể flash shell rỗng nếu fallback quá lớn.

## Done when / Tiêu chí xong

- Giải thích được nested layout và loading theo segment mà không cần mở docs.
  - EN: You can explain nested layouts and segment-level loading without looking up the docs.
- Ranh giới Server vs Client rõ hơn mức “interactive thì client”.
  - EN: The Server vs Client boundary is clearer than “interactive = client”.
- Bài algo xong và thao tác duyệt grid vẫn ổn.
  - EN: Algo is done and grid traversal still feels okay.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Add `not-found.tsx` and `template.tsx` to the map and say whether you would use `template`.
- **VI:** Thêm `not-found.tsx` và `template.tsx` vào map và nói bạn có dùng `template` không.

## Algorithm / Thuật toán

- **Problem / Bài:** Number of Islands · Grid BFS/DFS / Number of Islands · Grid BFS/DFS
- **Constraints / Ràng buộc:**
  - EN:
- 1 ≤ m,n ≤ 300
  - VI:
- 1 ≤ m,n ≤ 300
- **Hint:** See a ‘1’ → increment → flood-fill it to ‘0’.
  - VI: Gặp ‘1’ → tăng đếm → flood-fill thành ‘0’.

```text
algorithms/day-18/solution.ts
algorithms/day-18/solution.test.ts
```

Run: `pnpm test:algo -- day-18`

Open the full prompt: [day-18.md](../artifacts/algo/problems/day-18.md)

## Suggested commit

```text
day-18: sketch App Router tree and Nuxt file map
```
