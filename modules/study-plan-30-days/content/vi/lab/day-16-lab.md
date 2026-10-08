# Day 16 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Thêm filter form và controlled inputs trong Next app.

## Reuse từ ngày trước

- Dùng route Day 15 và shared form primitives.

## Folder nên sửa

- `apps/react-next/app/customers/`
- `apps/react-next/components/`
- `notes/day-16.md`
- `algorithms/day-16/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-16
```

## Từng bước

1. Thêm search/filter form kiểu controlled input.
2. Viết một hook nhỏ cho filter logic.
3. Ghi nơi React buộc bạn explicit hơn Vue.

## Tiêu chí xong

- Filter/search hoạt động.
- Có ít nhất 1 custom hook nhỏ.
- Có note mental shift.

## Mục tiêu thêm

- Đồng bộ filter với URL.

## Gợi ý

- Giữ hook nhỏ, đừng abstract quá sớm.

## Bài thuật toán

- **Bài:** Maximum Depth of Binary Tree
- **Ràng buộc:**
- 0 ≤ nodes ≤ 10^4
- **Hint:** xem pattern **DFS recursion** và mở đề đầy đủ nếu cần.

```text
algorithms/day-16/solution.ts
algorithms/day-16/solution.test.ts
```

Chạy: `pnpm test:algo -- day-16`

Mở đề đầy đủ: [day-16.md](../artifacts/algo/problems/day-16.md)

## Commit gợi ý

```text
day-16: add next filter form
```
