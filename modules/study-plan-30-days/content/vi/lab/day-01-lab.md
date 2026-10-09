# Day 1 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

Bạn sẽ phát triển design system từ sản phẩm thật chứ không phải bộ Figma thế nào? Quyết định CSS/layout nào mới thật sự là mức senior? Đi một màn admin đã ship: token, primitive, state lặp lại.

## Bạn sẽ produce gì

- Chọn một màn admin và liệt kê màu, spacing, typography, feedback state và pattern component lặp lại.
- Viết một note ngắn: 3 primitive nào nên tách ra trước và vì sao?

## Senior làm thế nào

- **Quyết định:** Kiểm kê một màn thật trước khi tách bất cứ thứ gì. Gọi tên token trước, rồi 3 primitive nào cắt được nhiều copy-paste nhất.
- **Constraint:** Một màn, 45–60 phút, nghĩ theo Vue 3 + TypeScript. Không cài package mới, không bootstrap Storybook, không viết lại cả design system.
- **Failure mode:** Danh sách token mà không có state, hoặc primitive chỉ bọc layout một lần. Interviewer nghe ‘nên có Button’ mà không nghe loading/empty/error.
- **Cách đo:** Dưới 2 phút bạn gọi được token, 3 primitive và ít nhất 2 state dùng lại từ màn đó.
- **Trade-off:** Token-first hay component-first. Token giúp theme scale; tách sai primitive thì đóng đinh một API xấu.
- **Gotcha production:** CSS variable production, alias dark và hex one-off trong SFC Vue sẽ lệch nhau. Nói cách hòa chúng mà không cần một tuần migration.

## Tiêu chí xong

- Đã mổ xẻ xong 1 màn hình thành token và primitive.
- Đã ghi được ít nhất 2 state dùng lại: loading / empty / error / success.
- Bài algo chạy đúng và giải thích được vì sao HashMap thắng brute force.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Đánh dấu token nào là semantic (`color-danger`) và token nào là raw (`red-600`), và vì sao điều đó quan trọng khi phỏng vấn.

## Thuật toán

- **Bài:** Two Sum · Khởi động với HashMap
- **Ràng buộc:**
- 2 ≤ nums.length ≤ 10^4
- -10^9 ≤ nums[i], target ≤ 10^9
- Đúng một lời giải
- **Hint:** Duyệt một lần: với mỗi x, tìm target-x đã thấy trong Map(value→index).

```text
algorithms/day-01/solution.ts
algorithms/day-01/solution.test.ts
```

Chạy: `pnpm test:algo -- day-01`

Mở đề đầy đủ: [day-01.md](../artifacts/algo/problems/day-01.md)

## Commit gợi ý

```text
day-01: inventory one admin screen into tokens and primitives
```
