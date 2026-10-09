# Day 7 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

Nếu có hai ngày trên màn này, cái gì ship ngay, cái gì để sau? Kể một technical trade-off có product impact, không phải gu.

## Bạn sẽ produce gì

- Chọn một màn từ ngày 1-6 và viết một note redesign 1 trang: cấu trúc, state coverage, accessibility và responsive behavior.
- Kết thúc bằng việc nói rõ cái gì ship ngay và cái gì để sau nếu thời gian gấp.

## Senior làm thế nào

- **Quyết định:** Một trang, một màn, thay đổi đã xếp hạng. Redesign là list ưu tiên, không phải wishlist hay app Vue mới.
- **Constraint:** Note một trang. Tái sử dụng ngày 1–6. Không dựng Capstone, không scaffold module khách hàng.
- **Failure mode:** Moodboard. ‘Làm hiện đại hơn.’ Ship polish visual trước state coverage hoặc fix keyboard.
- **Cách đo:** Nói được một trade-off dưới 2 phút: quyết định, constraint, failure mode, cách đo.
- **Trade-off:** Ship state + keyboard ngay; dọn token sau. Hoặc ngược lại nếu công ty là team design system — nói thẳng.
- **Gotcha production:** Mini redesign chết trong review khi bỏ qua permission hoặc shape API thật. Để một constraint production ngay trên trang.

## Tiêu chí xong

- Note redesign thể hiện thứ tự ưu tiên, không chỉ là wishlist.
- Giải thích được ít nhất 1 trade-off trong dưới 2 phút.
- Đã xong phần algo review tính giờ.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Tự ghi âm cắt now-vs-later trong 90 giây.

## Thuật toán

- **Bài:** Review tính giờ của tuần 1
- **Ràng buộc:**
- Tự chấm: pass / partial / fail
- **Hint:** Nhẩm pattern trước khi code.

```text
algorithms/day-07/solution.ts
algorithms/day-07/solution.test.ts
```

Chạy: `pnpm test:algo -- day-07`

Mở đề đầy đủ: [day-07.md](../artifacts/algo/problems/day-07.md)

## Commit gợi ý

```text
day-07: one-page redesign note with now-vs-later cut
```
