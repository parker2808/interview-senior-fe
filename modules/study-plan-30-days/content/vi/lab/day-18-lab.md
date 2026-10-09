# Day 18 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

App Router và RSC giải bài toán gì? Nested layout và `loading.tsx` / `error.tsx` theo segment hoạt động ra sao? Khi nào bắt buộc Client Component?

## Bạn sẽ produce gì

- Vẽ cây thư mục cho một app Next nhỏ với root layout, dashboard layout, một page, loading.tsx và error.tsx.
- Với mỗi file, ghi lại khái niệm Nuxt 3 gần nhất mà nó map tới.

## Senior làm thế nào

- **Quyết định:** Vẽ cây, rồi map từng file sang Nuxt (`app.vue`, layouts, `pages/`, `<NuxtPage>`, error.vue, loading theo route). Mặc định Server; `'use client'` ở leaf cần state hoặc browser API.
- **Constraint:** Sketch thư mục trong note. Hôm nay không `create-next-app`. Slice chạy được là Day 21.
- **Failure mode:** ‘Interactive = client’ là cả rule. Dán `'use client'` lên root layout. Nhầm `error.tsx` với handler 500 của API.
- **Cách đo:** Giải thích nested layout và loading theo segment không cần docs, và Server vs Client sắc hơn mức ‘interactive thì client’.
- **Trade-off:** Nested layout giữ state shell khi navigate (tốt cho dashboard, lạ nếu bạn chờ remount hết). `error.tsx` theo segment cô lập lỗi — đến khi quên fallback ở root.
- **Gotcha production:** Client ở trên Server Component là bất hợp pháp. `loading.tsx` bọc segment trong Suspense — navigate nhanh có thể flash shell rỗng nếu fallback quá lớn.

## Tiêu chí xong

- Giải thích được nested layout và loading theo segment mà không cần mở docs.
- Ranh giới Server vs Client rõ hơn mức “interactive thì client”.
- Bài algo xong và thao tác duyệt grid vẫn ổn.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Thêm `not-found.tsx` và `template.tsx` vào map và nói bạn có dùng `template` không.

## Thuật toán

- **Bài:** Number of Islands · Grid BFS/DFS
- **Ràng buộc:**
- 1 ≤ m,n ≤ 300
- **Hint:** Gặp ‘1’ → tăng đếm → flood-fill thành ‘0’.

```text
algorithms/day-18/solution.ts
algorithms/day-18/solution.test.ts
```

Chạy: `pnpm test:algo -- day-18`

Mở đề đầy đủ: [day-18.md](../artifacts/algo/problems/day-18.md)

## Commit gợi ý

```text
day-18: sketch App Router tree and Nuxt file map
```
