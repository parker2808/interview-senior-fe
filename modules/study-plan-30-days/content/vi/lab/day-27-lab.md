# Day 27 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

Bạn review code thế nào? Quality bar của bạn là gì? Xử lý requirement mơ hồ ra sao? Câu nào vẫn yếu — khái niệm, story, hay diễn đạt?

## Bạn sẽ produce gì

- Liệt kê 5 câu bạn vẫn trả lời yếu và gom nhóm theo root cause: thiếu khái niệm, thiếu story hay diễn đạt chưa rõ.
- Chọn 2 điểm yếu lớn nhất và sửa một lượt tập trung cho từng điểm trong hôm nay.

## Senior làm thế nào

- **Quyết định:** Phân loại trước khi học thêm. Thiếu khái niệm → đọc lại + một ví dụ. Thiếu story → STAR từ hệ thống đã ship. Diễn đạt yếu → ghi âm và cắt.
- **Constraint:** Danh sách điểm yếu cộng hai lượt sửa. Không phải spike Vue và không phải feature Next mới.
- **Failure mode:** List 20 chủ đề. Sửa topic bạn thích thay vì topic sẽ trượt vòng. Không có lượt nói.
- **Cách đo:** Danh sách điểm yếu thật kèm ưu tiên, và hai điểm đã được sửa một lượt cụ thể.
- **Trade-off:** Ôn rộng thì thấy an toàn và không đổi gì. Hai lượt sửa sâu nâng sàn buổi mock ngày mai.
- **Gotcha production:** Câu ambiguity bỏ qua câu hỏi làm rõ. Câu code-review chỉ nói style. Quality bar không có ví dụ thứ bạn đã từ chối.

## Tiêu chí xong

- Đã có danh sách điểm yếu thật kèm thứ tự ưu tiên.
- Hai điểm yếu đã được sửa bằng một lượt ôn tập cụ thể.
- Đã xong phần flashcard Big-O.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Viết các câu hỏi làm rõ bạn hỏi trong 2 phút đầu của đề design mơ hồ.

## Thuật toán

- **Bài:** Flashcard Big-O
- **Ràng buộc:**
- 10′
- **Hint:** Viết bảng 6 dòng.

```text
algorithms/day-27/solution.ts
algorithms/day-27/solution.test.ts
```

Chạy: `pnpm test:algo -- day-27`

Mở đề đầy đủ: [day-27.md](../artifacts/algo/problems/day-27.md)

## Commit gợi ý

```text
day-27: weak-spot triage and two repair passes
```
