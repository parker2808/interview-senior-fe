# Day 19 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

Next fetch, cache và revalidate thế nào? SSR vs SSG vs ISR vs streaming — chọn cho marketing, admin list và detail cá nhân hoá. Map sang `useAsyncData` / `useFetch` của Nuxt.

## Bạn sẽ produce gì

- Viết bảng so sánh: useAsyncData/useFetch của Nuxt với server fetch / no-store / revalidate của Next.
- Với ba loại trang (marketing, admin list, personalized detail), chọn SSR/SSG/ISR/streaming và giải thích vì sao.

## Senior làm thế nào

- **Quyết định:** Chọn theo loại trang, không theo trung thành framework. Marketing → SSG/ISR. Admin list → SSR hoặc no-store. Detail cá nhân hoá → SSR + stream widget dưới fold.
- **Constraint:** Bảng so sánh trong note. Hôm nay không dựng app thí nghiệm cache.
- **Failure mode:** Thuộc `revalidate: 60` mà không biết ai thấy data stale. Coi ISR là ‘SSG nhưng có phép’. Streaming như buzzword không có boundary Suspense.
- **Cách đo:** Cache vs fresh đã ghi theo loại trang. Streaming và ISR nghe như quyết định, không phải khẩu hiệu.
- **Trade-off:** Data admin tươi tốn TTFB và origin. ISR rẻ và có thể phục vụ record đã xoá trong một phút. Nói ai được phép thấy stale.
- **Gotcha production:** Cache Next không phải CDN và không phải Pinia. Default cache của `fetch` đã đổi qua các version — nói mental model bạn dùng (`cache` / `next.revalidate` rõ ràng) và đừng bluff version chưa chạy.

## Tiêu chí xong

- Quyết định cache vs fresh data đã được ghi theo từng loại trang.
- Streaming và ISR không còn chỉ là buzzword.
- Bài algo xong và recurrence của DP đã rõ.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Thêm một hàng: revalidate theo tag vs theo thời gian, và khi nào chọn cái nào.

## Thuật toán

- **Bài:** Climbing Stairs · DP
- **Ràng buộc:**
- 1 ≤ n ≤ 45
- **Hint:** dp[i] = dp[i-1] + dp[i-2] (Fibonacci).

```text
algorithms/day-19/solution.ts
algorithms/day-19/solution.test.ts
```

Chạy: `pnpm test:algo -- day-19`

Mở đề đầy đủ: [day-19.md](../artifacts/algo/problems/day-19.md)

## Commit gợi ý

```text
day-19: Next vs Nuxt fetch table and three rendering choices
```
