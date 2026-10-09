# Day 5 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

Hoàn thành flow admin này chỉ bằng keyboard được không? Focus đi đâu sau khi đóng modal? Khi nào lazy-load thành bẫy keyboard?

## Bạn sẽ produce gì

- Chạy một lượt keyboard-only trên một flow thật: Tab, Shift+Tab, Enter, Escape và focus return.
- Ghi lại 3 lỗi keyboard hoặc focus nên sửa trước.

## Senior làm thế nào

- **Quyết định:** Coi thứ tự keyboard là một product path. Ghi Tab order, Escape và focus return cho một flow thật, rồi xếp 3 fix.
- **Constraint:** Một flow bạn đã biết. Keyboard pass + note. Hôm nay không implement focus-trap library.
- **Failure mode:** Mất focus sau khi đóng dialog. Tab order bỏ primary action. Dropdown custom bỏ qua Arrow và Escape.
- **Cách đo:** Thứ tự keyboard đã viết và ít nhất một bug focus kèm hướng sửa. Demo path thành tiếng được.
- **Trade-off:** Dialog/select native hay widget custom. Native được keyboard miễn phí; custom được visual và phải trả focus trap.
- **Gotcha production:** Chunk lazy-load remount rồi reset focus. Portal append vào `body` rồi đẩy user xuống cuối document.

## Tiêu chí xong

- Đã ghi được thứ tự keyboard cho 1 flow thật.
- Đã chỉ ra ít nhất 1 bug focus kèm hướng sửa cụ thể.
- Bài algo xanh và trade-off độ phức tạp đã rõ.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Ghi skip-link / landmark: user keyboard nhảy tới table mà không tab hết nav được không?

## Thuật toán

- **Bài:** Top K Frequent Elements · HashMap + bucket
- **Ràng buộc:**
- 1 ≤ nums.length ≤ 10^5
- **Hint:** Đếm frequency → sort entries hoặc bucket sort theo freq.

```text
algorithms/day-05/solution.ts
algorithms/day-05/solution.test.ts
```

Chạy: `pnpm test:algo -- day-05`

Mở đề đầy đủ: [day-05.md](../artifacts/algo/problems/day-05.md)

## Commit gợi ý

```text
day-05: keyboard-only pass and top three focus fixes
```
