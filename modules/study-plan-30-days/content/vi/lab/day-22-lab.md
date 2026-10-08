# Day 22 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Dựng một dashboard nhỏ trong Next app.

## Reuse từ ngày trước

- Dùng customer data, shared UI và note cache/observability từ tuần 3.

## Folder nên sửa

- `apps/react-next/app/(admin)/dashboard/`
- `notes/day-22.md`
- `algorithms/day-22/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-22
```

## Từng bước

1. Tạo dashboard route với 3 widget mock.
2. Cho mỗi widget loading/error/empty state rõ.
3. Ghi note khi nào cần BFF hoặc chưa cần.

## Tiêu chí xong

- Dashboard route chạy được.
- Widget có state rõ.
- Có architecture note.

## Mục tiêu thêm

- Thêm partial failure cho 1 widget.

## Gợi ý

- Ưu tiên orchestration hơn chart đẹp.

## Bài thuật toán

- **Bài:** House Robber
- **Ràng buộc:**
- 1 ≤ nums.length ≤ 100
- **Hint:** xem pattern **DP 1D** và mở đề đầy đủ nếu cần.

```text
algorithms/day-22/solution.ts
algorithms/day-22/solution.test.ts
```

Chạy: `pnpm test:algo -- day-22`

Mở đề đầy đủ: [day-22.md](../artifacts/algo/problems/day-22.md)

## Commit gợi ý

```text
day-22: add next dashboard route
```
