# Day 13 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** What belongs in Pinia vs the URL vs Nuxt/server cache? How do you handle role/permission in the UI without making the store the security layer?
- **VI:** Cái gì vào Pinia, cái gì vào URL, cái gì vào cache Nuxt/server? Role/permission trên UI thế nào mà store không thành lớp bảo mật?

## What you will produce / Bạn sẽ produce gì

- **EN:** Draw a state map for one flow: who owns it, who reads it, and how stale data is refreshed.
  - **VI:** Vẽ state map cho một flow: ai sở hữu, ai đọc và dữ liệu stale được làm mới ra sao.
- **EN:** Mark one piece of state that should move out of the store and one that should move into a shared layer.
  - **VI:** Đánh dấu một state nên đưa ra khỏi store và một state nên đưa vào layer dùng chung.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: Draw the map first: source of truth per field. URL for shareable filters, component for ephemeral UI, Pinia for cross-tree client session, server cache for remote data.
  - VI: Vẽ map trước: source of truth từng field. URL cho filter share được, component cho UI thoáng qua, Pinia cho session client xuyên cây, server cache cho data remote.
- **Constraint / Ràng buộc:**
  - EN: A state map on paper or in a note. Do not refactor a Pinia store in the product today.
  - VI: State map trên giấy hoặc trong note. Hôm nay không refactor Pinia store trên product.
- **Failure mode:**
  - EN: Putting current page, table rows, and auth user in the same store. Hiding permission only in CSS. Cache that never invalidates after a mutation.
  - VI: Nhét current page, hàng table và auth user vào cùng store. Giấu permission chỉ bằng CSS. Cache không invalidate sau mutation.
- **Measure / Cách đo:**
  - EN: The map has one source of truth per piece of state, and store vs cache vs URL is written down.
  - VI: Map có một source of truth cho từng mảnh state, và store vs cache vs URL đã được ghi.
- **Tradeoff / Trade-off:**
  - EN: A fat Pinia store is easy to find and hard to test. Colocated server cache stays fresh and is awkward to share across distant trees.
  - VI: Pinia store béo thì dễ tìm và khó test. Server cache đặt cạnh chỗ dùng thì tươi và khó share sang cây xa.
- **Production gotcha / Gotcha production:**
  - EN: SSR Pinia hydration mismatches. Permission checks that exist only in the UI. Filters in Pinia that should have been query params — refresh loses them.
  - VI: Lệch hydration Pinia lúc SSR. Check permission chỉ tồn tại trên UI. Filter trong Pinia đáng ra là query param — refresh là mất.

## Done when / Tiêu chí xong

- State map có source of truth rõ ràng.
  - EN: The state map has a clear source of truth.
- Đã ghi rõ quyết định store vs cache vs URL.
  - EN: Store vs cache vs URL choices are written down.
- Bài algo xong và pattern Floyd đã thấy hợp lý.
  - EN: Algo is done and the Floyd pattern makes sense.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Add the invalidation arrow: which mutation clears which cache key.
- **VI:** Thêm mũi tên invalidate: mutation nào xoá cache key nào.

## Algorithm / Thuật toán

- **Problem / Bài:** Linked List Cycle · Floyd pointers / Linked List Cycle · Floyd pointers
- **Constraints / Ràng buộc:**
  - EN:
- Floyd cycle detection
  - VI:
- Floyd cycle detection
- **Hint:** slow/fast: if they meet, there is a cycle.
  - VI: slow/fast: nếu gặp nhau → cycle.

```text
algorithms/day-13/solution.ts
algorithms/day-13/solution.test.ts
```

Run: `pnpm test:algo -- day-13`

Open the full prompt: [day-13.md](../artifacts/algo/problems/day-13.md)

## Suggested commit

```text
day-13: state map with store vs cache vs URL ownership
```
