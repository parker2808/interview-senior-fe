# Day 1 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Day 0 — Setup một lần

- Nếu repo lab dùng chung chưa tồn tại, hoàn thành Day 0 trong [lab-repo.md](../lab-repo.md) trước khi làm Day 1.

## Hôm nay build gì

- Khởi tạo repo lab chung, seed token đầu tiên và README khung.

## Reuse từ ngày trước

- Không có; đây là Day 0/Day 1.

## Folder nên sửa

- `packages/ui/src/tokens/`
- `notes/day-01.md`
- `algorithms/day-01/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm install
pnpm storybook:ui  # or a small UI playground
pnpm test:algo -- day-01
```

## Từng bước

1. Làm phần Day 0 trong lab-repo nếu repo chưa tồn tại.
2. Tạo token cơ bản cho màu, spacing, radius và type.
3. Viết note 3 primitive đầu tiên cần tách từ màn admin thật.

## Tiêu chí xong

- Repo cài đặt xong.
- Token file đã commit.
- README có section repo structure.

## Mục tiêu thêm

- Thêm dark token alias.

## Gợi ý

- Giữ ngày đầu thật nhẹ, đừng dựng cả app.

## Bài thuật toán

- **Bài:** Two Sum
- **Ràng buộc:**
- 2 ≤ nums.length ≤ 10^4
- -10^9 ≤ nums[i], target ≤ 10^9
- Đúng một lời giải
- **Hint:** xem pattern **HashMap** và mở đề đầy đủ nếu cần.

```text
algorithms/day-01/solution.ts
algorithms/day-01/solution.test.ts
```

Chạy: `pnpm test:algo -- day-01`

Mở đề đầy đủ: [day-01.md](../artifacts/algo/problems/day-01.md)

## Commit gợi ý

```text
day-01: bootstrap repo and token seed
```
