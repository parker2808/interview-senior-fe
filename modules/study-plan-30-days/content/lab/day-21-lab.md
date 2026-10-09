# Day 21 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** Show me a tiny App Router slice you actually ran. Where is the server fetch, where is the client island, and how does this compare to the same slice in Nuxt 3?
- **VI:** Show một slice App Router nhỏ bạn đã chạy thật. Fetch server ở đâu, client island ở đâu, và so với cùng slice trong Nuxt 3 thế nào?

## What you will produce / Bạn sẽ produce gì

- **EN:** Build a tiny `/customers` route in a Next lab: root layout, dashboard layout, server-fetched list page, one small client filter, loading.tsx, error.tsx, and page metadata.
  - **VI:** Dựng một route `/customers` nhỏ trong lab Next: root layout, dashboard layout, list page fetch ở server, một bộ lọc nhỏ phía client, loading.tsx, error.tsx và metadata cho page.
- **EN:** After it works, write 5 lines comparing the same slice in Nuxt 3.
  - **VI:** Sau khi chạy được, viết 5 dòng so sánh cùng slice đó nếu làm bằng Nuxt 3.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: Keep the spike tiny. Server list + one client filter is enough to prove the boundary. Compare to Nuxt from what you just did, not from docs.
  - VI: Giữ spike nhỏ. List server + một filter client là đủ để chứng minh boundary. So với Nuxt từ thứ vừa làm, không phải từ docs.
- **Constraint / Ràng buộc:**
  - EN: Tiny lab slice only. No customer-module product, no npm-install tutorial in the write-up. If a lab app already exists, reuse it; do not start from `create-next-app` instructions.
  - VI: Chỉ slice lab nhỏ. Không product module khách hàng, không tutorial npm-install trong bài viết. Nếu đã có lab app thì dùng lại; đừng viết hướng dẫn `create-next-app`.
- **Failure mode:**
  - EN: A full CRUD admin. `'use client'` on the page because the filter needs state. A comparison copied from the Next marketing site.
  - VI: CRUD admin đầy đủ. `'use client'` trên page vì filter cần state. Bảng so sánh chép từ trang marketing của Next.
- **Measure / Cách đo:**
  - EN: The slice runs, even if tiny. The Nuxt ↔ Next note is written from this spike. Timed algo review is done.
  - VI: Slice chạy được, dù nhỏ. Note Nuxt ↔ Next viết từ spike này. Algo review tính giờ đã xong.
- **Tradeoff / Trade-off:**
  - EN: Client filter over a server-fetched list is simple and re-filters stale data. Pushing the filter to the server is correct and costs a navigation or action.
  - VI: Filter client trên list fetch ở server thì đơn giản và lọc data stale. Đẩy filter lên server thì đúng và tốn một navigation hoặc action.
- **Production gotcha / Gotcha production:**
  - EN: Passing a server-fetched Date into a client child without serializing. Forgetting metadata. An `error.tsx` that cannot recover. The goal is concept transfer and confidence, not a product.
  - VI: Truyền Date fetch ở server xuống client child mà không serialize. Quên metadata. `error.tsx` không recover được. Mục tiêu là chuyển nguyên lý và tự tin, không phải sản phẩm.

## Done when / Tiêu chí xong

- Slice Next.js chạy được thật, dù scope nhỏ.
  - EN: The Next.js slice actually runs, even if tiny.
- Phần so sánh Nuxt ↔ Next được viết từ trải nghiệm, không phải chép docs.
  - EN: The Nuxt ↔ Next comparison is written from experience, not copied from docs.
- Đã xong phần algo review tính giờ.
  - EN: Timed algo review is complete.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Add a one-line note on what you would do next if this were production (auth, pagination, empty state) — and stop there.
- **VI:** Thêm một dòng việc bạn sẽ làm tiếp nếu đây là production (auth, pagination, empty state) — rồi dừng.

## Algorithm / Thuật toán

- **Problem / Bài:** Week 3 timed review / Review tính giờ của tuần 3
- **Constraints / Ràng buộc:**
  - EN:
- Self-score
  - VI:
- Self-score
- **Hint:** Islands: do not forget to mark visited.
  - VI: Islands: đừng quên mark visited.

```text
algorithms/day-21/solution.ts
algorithms/day-21/solution.test.ts
```

Run: `pnpm test:algo -- day-21`

Open the full prompt: [day-21.md](../artifacts/algo/problems/day-21.md)

## Suggested commit

```text
day-21: tiny Next customers slice plus five-line Nuxt compare
```
