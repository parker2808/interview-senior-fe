# Day 4 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Tạo DataTable shell và card fallback cho mobile.

## Reuse từ ngày trước

- Dùng lại badge, button và form primitive.

## Folder nên sửa

- `packages/ui/src/components/data-table/`
- `packages/ui/src/components/customer-card/`
- `notes/day-04.md`
- `algorithms/day-04/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm storybook:ui
pnpm test:ui
pnpm test:algo -- day-04
```

## Từng bước

1. Dựng DataTable shell với header, row, empty state.
2. Tạo CustomerCard cho mobile với 2-3 field chính.
3. Viết note khi nào table nên xuống card.

## Tiêu chí xong

- Có cả table và card fallback.
- Empty state render được.
- Trade-off note đã có.

## Mục tiêu thêm

- Thêm sticky header.

## Gợi ý

- Đừng virtualize sớm ở ngày này.

## Bài thuật toán

- **Bài:** Group Anagrams
- **Ràng buộc:**
- 1 ≤ strs.length ≤ 10^4
- 0 ≤ strs[i].length ≤ 100
- strs[i] chữ thường
- **Hint:** xem pattern **HashMap + sorted key** và mở đề đầy đủ nếu cần.

```text
algorithms/day-04/solution.ts
algorithms/day-04/solution.test.ts
```

Chạy: `pnpm test:algo -- day-04`

Mở đề đầy đủ: [day-04.md](../artifacts/algo/problems/day-04.md)

## Commit gợi ý

```text
day-04: add table shell and mobile cards
```
