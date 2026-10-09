# Day 21 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

Show một slice App Router nhỏ bạn đã chạy thật. Fetch server ở đâu, client island ở đâu, và so với cùng slice trong Nuxt 3 thế nào?

## Bạn sẽ produce gì

- Dựng một route `/customers` nhỏ trong lab Next: root layout, dashboard layout, list page fetch ở server, một bộ lọc nhỏ phía client, loading.tsx, error.tsx và metadata cho page.
- Sau khi chạy được, viết 5 dòng so sánh cùng slice đó nếu làm bằng Nuxt 3.

## Senior làm thế nào

- **Quyết định:** Giữ spike nhỏ. List server + một filter client là đủ để chứng minh boundary. So với Nuxt từ thứ vừa làm, không phải từ docs.
- **Constraint:** Chỉ slice lab nhỏ. Không product module khách hàng, không tutorial npm-install trong bài viết. Nếu đã có lab app thì dùng lại; đừng viết hướng dẫn `create-next-app`.
- **Failure mode:** CRUD admin đầy đủ. `'use client'` trên page vì filter cần state. Bảng so sánh chép từ trang marketing của Next.
- **Cách đo:** Slice chạy được, dù nhỏ. Note Nuxt ↔ Next viết từ spike này. Algo review tính giờ đã xong.
- **Trade-off:** Filter client trên list fetch ở server thì đơn giản và lọc data stale. Đẩy filter lên server thì đúng và tốn một navigation hoặc action.
- **Gotcha production:** Truyền Date fetch ở server xuống client child mà không serialize. Quên metadata. `error.tsx` không recover được. Mục tiêu là chuyển nguyên lý và tự tin, không phải sản phẩm.

## Tiêu chí xong

- Slice Next.js chạy được thật, dù scope nhỏ.
- Phần so sánh Nuxt ↔ Next được viết từ trải nghiệm, không phải chép docs.
- Đã xong phần algo review tính giờ.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Thêm một dòng việc bạn sẽ làm tiếp nếu đây là production (auth, pagination, empty state) — rồi dừng.

## Thuật toán

- **Bài:** Review tính giờ của tuần 3
- **Ràng buộc:**
- Self-score
- **Hint:** Islands: đừng quên mark visited.

```text
algorithms/day-21/solution.ts
algorithms/day-21/solution.test.ts
```

Chạy: `pnpm test:algo -- day-21`

Mở đề đầy đủ: [day-21.md](../artifacts/algo/problems/day-21.md)

## Commit gợi ý

```text
day-21: tiny Next customers slice plus five-line Nuxt compare
```
