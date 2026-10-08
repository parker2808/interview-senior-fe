# Day 23 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Làm một perf pass nhỏ trên list hoặc dashboard.

## Reuse từ ngày trước

- Dùng dashboard/list hiện có.

## Folder nên sửa

- `apps/react-next/app/(admin)/customers/`
- `apps/react-next/app/(admin)/dashboard/`
- `notes/day-23.md`
- `algorithms/day-23/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-23
```

## Từng bước

1. Chọn 1 bottleneck giả lập có thật.
2. Áp một tối ưu nhỏ có chủ đích.
3. Ghi before/after vào note.

## Tiêu chí xong

- Có ít nhất 1 perf fix nhỏ.
- Có before/after note.
- Code vẫn dễ đọc.

## Mục tiêu thêm

- Đo lại bằng Profiler nếu có.

## Gợi ý

- Fix thứ lớn nhất, không phải thứ dễ khoe nhất.

## Bài thuật toán

- **Bài:** Warm-up Easy (tự chọn)
- **Ràng buộc:**
- ≤10′
- **Hint:** xem pattern **Warm-up** và mở đề đầy đủ nếu cần.

```text
algorithms/day-23/solution.ts
algorithms/day-23/solution.test.ts
```

Chạy: `pnpm test:algo -- day-23`

Mở đề đầy đủ: [day-23.md](../artifacts/algo/problems/day-23.md)

## Commit gợi ý

```text
day-23: apply focused perf improvements
```
