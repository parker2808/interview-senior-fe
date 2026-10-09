# Day 20 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** When do Server Actions help and when are they the wrong tool? What can middleware actually do? How do you handle metadata, images, fonts, and a first deploy?
- **VI:** Khi nào Server Actions giúp và khi nào chúng là sai tool? Middleware làm được gì thật? Metadata, image, font và deploy lần đầu bạn xử lý ra sao?

## What you will produce / Bạn sẽ produce gì

- **EN:** List which parts of a small admin flow belong in Server Actions, Route Handlers, or plain client mutations.
  - **VI:** Liệt kê phần nào của một flow admin nhỏ nên nằm ở Server Actions, Route Handlers hay mutation phía client.
- **EN:** Write a deployment checklist: env vars, caching assumptions, image/font usage, and what to verify after deploy.
  - **VI:** Viết một deployment checklist: env vars, giả định về cache, dùng image/font thế nào và cần verify gì sau deploy.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: Mutations that can live next to a form → Server Action. Webhooks / non-form HTTP → Route Handler. Optimistic UI / client-only → client mutation. Middleware for auth redirects and headers, not business logic.
  - VI: Mutation sống cạnh form → Server Action. Webhook / HTTP không phải form → Route Handler. Optimistic UI / chỉ client → mutation client. Middleware cho auth redirect và header, không phải business logic.
- **Constraint / Ràng buộc:**
  - EN: Lists and a checklist. No deploy of a new Next app today.
  - VI: List và checklist. Hôm nay không deploy app Next mới.
- **Failure mode:**
  - EN: Putting a 200-line workflow in middleware. Server Actions without auth checks because ‘they run on the server’. Forgetting `next/image` host allowlists after deploy.
  - VI: Nhét workflow 200 dòng vào middleware. Server Actions không check auth vì ‘chạy trên server’. Quên allowlist host của `next/image` sau deploy.
- **Measure / Cách đo:**
  - EN: You can explain when Server Actions simplify a flow and when they do not. Middleware, SEO, and assets are tied to concrete use cases.
  - VI: Giải thích được khi nào Server Actions làm flow đơn giản hơn và khi nào thì không. Middleware, SEO và asset đã gắn với use case cụ thể.
- **Tradeoff / Trade-off:**
  - EN: Server Actions reduce boilerplate and hide the HTTP contract — which is great until a mobile client or a non-Next caller needs the same mutation.
  - VI: Server Actions bớt boilerplate và giấu HTTP contract — tuyệt đến khi mobile client hoặc caller không phải Next cần cùng mutation.
- **Production gotcha / Gotcha production:**
  - EN: Middleware runs on the Edge: no Node APIs, size limits, and easy-to-get-wrong matcher config. Metadata that is static when the title is per-record. Fonts that shift CLS.
  - VI: Middleware chạy trên Edge: không Node API, có giới hạn size, matcher dễ sai. Metadata tĩnh khi title theo từng record. Font làm lệch CLS.

## Done when / Tiêu chí xong

- Giải thích được khi nào Server Actions làm flow đơn giản hơn và khi nào thì không.
  - EN: You can explain when Server Actions simplify a flow and when they do not.
- Middleware, SEO và tối ưu asset đã gắn với use case cụ thể.
  - EN: Middleware, SEO, and asset optimization are tied to concrete use cases.
- Bài algo xong và giải thích được cách chọn state cho DP.
  - EN: Algo is done and the DP state choice is explainable.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Add one line on CSRF / origin checks for Server Actions and why ‘it is same-origin’ is not a complete answer.
- **VI:** Thêm một dòng về CSRF / check origin cho Server Actions và vì sao ‘same-origin’ chưa phải câu đủ.

## Algorithm / Thuật toán

- **Problem / Bài:** Coin Change · DP / Coin Change · DP
- **Constraints / Ràng buộc:**
  - EN:
- 1 ≤ coins.length ≤ 12
- 0 ≤ amount ≤ 10^4
  - VI:
- 1 ≤ coins.length ≤ 12
- 0 ≤ amount ≤ 10^4
- **Hint:** dp[x] = min coins to make x; dp[0]=0, else Infinity.
  - VI: dp[x] = min số xu tạo x; khởi dp[0]=0, còn lại Infinity.

```text
algorithms/day-20/solution.ts
algorithms/day-20/solution.test.ts
```

Run: `pnpm test:algo -- day-20`

Open the full prompt: [day-20.md](../artifacts/algo/problems/day-20.md)

## Suggested commit

```text
day-20: Server Actions vs Route Handlers plus deploy checklist
```
