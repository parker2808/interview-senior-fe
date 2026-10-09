# Day 13 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

Cái gì vào Pinia, cái gì vào URL, cái gì vào cache Nuxt/server? Role/permission trên UI thế nào mà store không thành lớp bảo mật?

## Bạn sẽ produce gì

- Vẽ state map cho một flow: ai sở hữu, ai đọc và dữ liệu stale được làm mới ra sao.
- Đánh dấu một state nên đưa ra khỏi store và một state nên đưa vào layer dùng chung.

## Senior làm thế nào

- **Quyết định:** Vẽ map trước: source of truth từng field. URL cho filter share được, component cho UI thoáng qua, Pinia cho session client xuyên cây, server cache cho data remote.
- **Constraint:** State map trên giấy hoặc trong note. Hôm nay không refactor Pinia store trên product.
- **Failure mode:** Nhét current page, hàng table và auth user vào cùng store. Giấu permission chỉ bằng CSS. Cache không invalidate sau mutation.
- **Cách đo:** Map có một source of truth cho từng mảnh state, và store vs cache vs URL đã được ghi.
- **Trade-off:** Pinia store béo thì dễ tìm và khó test. Server cache đặt cạnh chỗ dùng thì tươi và khó share sang cây xa.
- **Gotcha production:** Lệch hydration Pinia lúc SSR. Check permission chỉ tồn tại trên UI. Filter trong Pinia đáng ra là query param — refresh là mất.

## Tiêu chí xong

- State map có source of truth rõ ràng.
- Đã ghi rõ quyết định store vs cache vs URL.
- Bài algo xong và pattern Floyd đã thấy hợp lý.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Thêm mũi tên invalidate: mutation nào xoá cache key nào.

## Thuật toán

- **Bài:** Linked List Cycle · Floyd pointers
- **Ràng buộc:**
- Floyd cycle detection
- **Hint:** slow/fast: nếu gặp nhau → cycle.

```text
algorithms/day-13/solution.ts
algorithms/day-13/solution.test.ts
```

Chạy: `pnpm test:algo -- day-13`

Mở đề đầy đủ: [day-13.md](../artifacts/algo/problems/day-13.md)

## Commit gợi ý

```text
day-13: state map with store vs cache vs URL ownership
```
