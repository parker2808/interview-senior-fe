# Day 5 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Hoàn thiện EmptyState và ErrorState, rồi gắn vào acceptance criteria.

## Reuse từ ngày trước

- Dùng lại table/card shell Day 4.

## Folder nên sửa

- `packages/ui/src/components/empty-state/`
- `packages/ui/src/components/error-state/`
- `notes/day-05.md`
- `algorithms/day-05/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm storybook:ui
pnpm test:ui
pnpm test:algo -- day-05
```

## Từng bước

1. Tạo EmptyState và ErrorState dùng lại được.
2. Gắn chúng vào demo state của table/card.
3. Viết 5 acceptance criteria cho list + detail.

## Tiêu chí xong

- Có 2 state component dùng lại được.
- Demo có empty/error flow.
- Acceptance criteria đủ rõ.

## Mục tiêu thêm

- Thêm retry callback.

## Gợi ý

- Copy sản phẩm quan trọng hơn animation.

## Bài thuật toán

- **Bài:** Top K Frequent Elements
- **Ràng buộc:**
- 1 ≤ nums.length ≤ 10^5
- k nằm trong range số phần tử distinct
- **Hint:** xem pattern **HashMap + bucket/sort** và mở đề đầy đủ nếu cần.

```text
algorithms/day-05/solution.ts
algorithms/day-05/solution.test.ts
```

Chạy: `pnpm test:algo -- day-05`

Mở đề đầy đủ: [day-05.md](../artifacts/algo/problems/day-05.md)

## Commit gợi ý

```text
day-05: add empty and error states
```
