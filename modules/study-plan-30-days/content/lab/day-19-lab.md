# Day 19 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** How does Next fetch, cache, and revalidate? SSR vs SSG vs ISR vs streaming — pick for marketing, admin list, and personalized detail. Map that to Nuxt `useAsyncData` / `useFetch`.
- **VI:** Next fetch, cache và revalidate thế nào? SSR vs SSG vs ISR vs streaming — chọn cho marketing, admin list và detail cá nhân hoá. Map sang `useAsyncData` / `useFetch` của Nuxt.

## What you will produce / Bạn sẽ produce gì

- **EN:** Write a comparison table: useAsyncData/useFetch in Nuxt vs server fetch / no-store / revalidate in Next.
  - **VI:** Viết bảng so sánh: useAsyncData/useFetch của Nuxt với server fetch / no-store / revalidate của Next.
- **EN:** For three page types (marketing, admin list, personalized detail), choose SSR/SSG/ISR/streaming and explain why.
  - **VI:** Với ba loại trang (marketing, admin list, personalized detail), chọn SSR/SSG/ISR/streaming và giải thích vì sao.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: Choose per page type, not per framework loyalty. Marketing → SSG/ISR. Admin list → SSR or no-store. Personalized detail → SSR + streaming the below-the-fold widgets.
  - VI: Chọn theo loại trang, không theo trung thành framework. Marketing → SSG/ISR. Admin list → SSR hoặc no-store. Detail cá nhân hoá → SSR + stream widget dưới fold.
- **Constraint / Ràng buộc:**
  - EN: A comparison table in a note. No cache-experiment app today.
  - VI: Bảng so sánh trong note. Hôm nay không dựng app thí nghiệm cache.
- **Failure mode:**
  - EN: Reciting `revalidate: 60` with no idea who sees stale data. Treating ISR as ‘SSG but magic’. Streaming as a buzzword with no Suspense boundary.
  - VI: Thuộc `revalidate: 60` mà không biết ai thấy data stale. Coi ISR là ‘SSG nhưng có phép’. Streaming như buzzword không có boundary Suspense.
- **Measure / Cách đo:**
  - EN: Cache vs fresh is written by page type. Streaming and ISR sound like decisions, not slogans.
  - VI: Cache vs fresh đã ghi theo loại trang. Streaming và ISR nghe như quyết định, không phải khẩu hiệu.
- **Tradeoff / Trade-off:**
  - EN: Fresh admin data costs TTFB and origin load. ISR is cheap and can serve a deleted record for a minute. Say who is allowed to see stale.
  - VI: Data admin tươi tốn TTFB và origin. ISR rẻ và có thể phục vụ record đã xoá trong một phút. Nói ai được phép thấy stale.
- **Production gotcha / Gotcha production:**
  - EN: Next cache is not your CDN and not Pinia. `fetch` cache defaults have changed across versions — say which mental model you use (explicit `cache` / `next.revalidate`) and do not bluff a version you have not run.
  - VI: Cache Next không phải CDN và không phải Pinia. Default cache của `fetch` đã đổi qua các version — nói mental model bạn dùng (`cache` / `next.revalidate` rõ ràng) và đừng bluff version chưa chạy.

## Done when / Tiêu chí xong

- Quyết định cache vs fresh data đã được ghi theo từng loại trang.
  - EN: Cache vs fresh data decisions are written by page type.
- Streaming và ISR không còn chỉ là buzzword.
  - EN: Streaming and ISR no longer sound like buzzwords only.
- Bài algo xong và recurrence của DP đã rõ.
  - EN: Algo is done and the DP recurrence is clear.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Add one row: tag-based revalidation vs time-based, and when you would pick each.
- **VI:** Thêm một hàng: revalidate theo tag vs theo thời gian, và khi nào chọn cái nào.

## Algorithm / Thuật toán

- **Problem / Bài:** Climbing Stairs · DP / Climbing Stairs · DP
- **Constraints / Ràng buộc:**
  - EN:
- 1 ≤ n ≤ 45
  - VI:
- 1 ≤ n ≤ 45
- **Hint:** dp[i] = dp[i-1] + dp[i-2] (Fibonacci).
  - VI: dp[i] = dp[i-1] + dp[i-2] (Fibonacci).

```text
algorithms/day-19/solution.ts
algorithms/day-19/solution.test.ts
```

Run: `pnpm test:algo -- day-19`

Open the full prompt: [day-19.md](../artifacts/algo/problems/day-19.md)

## Suggested commit

```text
day-19: Next vs Nuxt fetch table and three rendering choices
```
