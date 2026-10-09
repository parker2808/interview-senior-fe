# Day 20 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

Khi nào Server Actions giúp và khi nào chúng là sai tool? Middleware làm được gì thật? Metadata, image, font và deploy lần đầu bạn xử lý ra sao?

## Bạn sẽ produce gì

- Liệt kê phần nào của một flow admin nhỏ nên nằm ở Server Actions, Route Handlers hay mutation phía client.
- Viết một deployment checklist: env vars, giả định về cache, dùng image/font thế nào và cần verify gì sau deploy.

## Senior làm thế nào

- **Quyết định:** Mutation sống cạnh form → Server Action. Webhook / HTTP không phải form → Route Handler. Optimistic UI / chỉ client → mutation client. Middleware cho auth redirect và header, không phải business logic.
- **Constraint:** List và checklist. Hôm nay không deploy app Next mới.
- **Failure mode:** Nhét workflow 200 dòng vào middleware. Server Actions không check auth vì ‘chạy trên server’. Quên allowlist host của `next/image` sau deploy.
- **Cách đo:** Giải thích được khi nào Server Actions làm flow đơn giản hơn và khi nào thì không. Middleware, SEO và asset đã gắn với use case cụ thể.
- **Trade-off:** Server Actions bớt boilerplate và giấu HTTP contract — tuyệt đến khi mobile client hoặc caller không phải Next cần cùng mutation.
- **Gotcha production:** Middleware chạy trên Edge: không Node API, có giới hạn size, matcher dễ sai. Metadata tĩnh khi title theo từng record. Font làm lệch CLS.

## Tiêu chí xong

- Giải thích được khi nào Server Actions làm flow đơn giản hơn và khi nào thì không.
- Middleware, SEO và tối ưu asset đã gắn với use case cụ thể.
- Bài algo xong và giải thích được cách chọn state cho DP.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Thêm một dòng về CSRF / check origin cho Server Actions và vì sao ‘same-origin’ chưa phải câu đủ.

## Thuật toán

- **Bài:** Coin Change · DP
- **Ràng buộc:**
- 1 ≤ coins.length ≤ 12
- 0 ≤ amount ≤ 10^4
- **Hint:** dp[x] = min số xu tạo x; khởi dp[0]=0, còn lại Infinity.

```text
algorithms/day-20/solution.ts
algorithms/day-20/solution.test.ts
```

Chạy: `pnpm test:algo -- day-20`

Mở đề đầy đủ: [day-20.md](../artifacts/algo/problems/day-20.md)

## Commit gợi ý

```text
day-20: Server Actions vs Route Handlers plus deploy checklist
```
