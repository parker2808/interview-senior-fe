# Day 3 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Xây FormField và TextField cho flow validation cơ bản.

## Reuse từ ngày trước

- Dùng lại token và Button từ Day 1-2.

## Folder nên sửa

- `packages/ui/src/components/form-field/`
- `packages/ui/src/components/text-field/`
- `notes/day-03.md`
- `algorithms/day-03/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm storybook:ui
pnpm test:ui
pnpm test:algo -- day-03
```

## Từng bước

1. Tạo FormField gồm label, hint, error, required.
2. Tạo TextField controlled-friendly với invalid/disabled state.
3. Ghi state machine cho một form nhỏ.

## Tiêu chí xong

- Label/hint/error rõ ràng.
- Input có invalid/disabled state.
- State machine note xong.

## Mục tiêu thêm

- Thêm textarea cùng API.

## Gợi ý

- Giữ form nhỏ, đừng lao vào form library.

## Bài thuật toán

- **Bài:** Contains Duplicate
- **Ràng buộc:**
- 1 ≤ nums.length ≤ 10^5
- -10^9 ≤ nums[i] ≤ 10^9
- **Hint:** xem pattern **Set** và mở đề đầy đủ nếu cần.

```text
algorithms/day-03/solution.ts
algorithms/day-03/solution.test.ts
```

Chạy: `pnpm test:algo -- day-03`

Mở đề đầy đủ: [day-03.md](../artifacts/algo/problems/day-03.md)

## Commit gợi ý

```text
day-03: add shared form primitives
```
