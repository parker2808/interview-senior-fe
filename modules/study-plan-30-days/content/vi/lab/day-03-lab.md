# Day 3 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

Làm form dùng được với keyboard và screen reader thế nào? Validate khi nào — blur, submit, hay live? Semantic HTML hay ARIA: cái nào dùng trước?

## Bạn sẽ produce gì

- Chọn một flow form và ghi lại: field, rule validate, error message, thời điểm kích hoạt và disabled state.
- Kiểm tra xem người dùng chỉ dùng keyboard hoặc screen reader có hiểu được flow tương tự không.

## Senior làm thế nào

- **Quyết định:** Mỗi field có label nhìn thấy, một rule lỗi, và thời điểm kích hoạt có chủ đích. Ưu tiên semantic native; ARIA chỉ khi HTML không diễn tả được.
- **Constraint:** Một form thật (login, filter, hoặc edit). Ghi lại; không dựng form library.
- **Failure mode:** Placeholder đóng vai label. Validate từng phím đánh IME. Submit disabled mà không nói lý do. Error chỉ báo bằng màu.
- **Cách đo:** Nói được field → rule → message → timing → disabled dưới 2 phút, kể cả screen reader nghe error ra sao.
- **Trade-off:** Validate lúc blur (feedback nhanh, ồn hơn) hay lúc submit (êm, muộn hơn). Mixed cũng được nếu biện hộ được theo từng field.
- **Gotcha production:** `aria-live` mỗi phím là gotcha production. Nút disabled không giải thích form thiếu gì cũng vậy.

## Tiêu chí xong

- Mỗi field đều có label và rule lỗi rõ ràng.
- Thời điểm validate là có chủ đích, không phải ngẫu nhiên.
- Bài algo xong và giải thích được vì sao Set là đủ.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Thêm thứ tự focus và focus đáp xuống đâu sau submit lỗi.

## Thuật toán

- **Bài:** Contains Duplicate · Set
- **Ràng buộc:**
- 1 ≤ nums.length ≤ 10^5
- **Hint:** Set: nếu add mà đã có → duplicate. Set là đủ ở đây.

```text
algorithms/day-03/solution.ts
algorithms/day-03/solution.test.ts
```

Chạy: `pnpm test:algo -- day-03`

Mở đề đầy đủ: [day-03.md](../artifacts/algo/problems/day-03.md)

## Commit gợi ý

```text
day-03: document one form field rules timing and a11y feedback
```
