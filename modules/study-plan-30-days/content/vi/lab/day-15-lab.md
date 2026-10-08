# Day 15 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Khởi động route Customers tương đương trong Next app.

## Reuse từ ngày trước

- Dùng schema, mock data và packages/ui từ Vue track.

## Folder nên sửa

- `apps/react-next/app/customers/`
- `apps/react-next/lib/`
- `notes/day-15.md`
- `algorithms/day-15/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-15
```

## Từng bước

1. Tạo route /customers.
2. Render list mock bằng shared UI package.
3. Viết note cách data vào Vue vs Next khác nhau ra sao.

## Tiêu chí xong

- Next route render được.
- Mock list reuse model cũ.
- Có note so sánh Vue vs Next.

## Mục tiêu thêm

- Tạo lib fixtures dùng chung cho cả 2 app.

## Gợi ý

- Mục tiêu là domain parity, không phải pixel parity.

## Bài thuật toán

- **Bài:** Binary Tree Level Order Traversal
- **Ràng buộc:**
- 0 ≤ nodes ≤ 2000
- **Hint:** xem pattern **BFS queue** và mở đề đầy đủ nếu cần.

```text
algorithms/day-15/solution.ts
algorithms/day-15/solution.test.ts
```

Chạy: `pnpm test:algo -- day-15`

Mở đề đầy đủ: [day-15.md](../artifacts/algo/problems/day-15.md)

## Commit gợi ý

```text
day-15: start next customers route
```
