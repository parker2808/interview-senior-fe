# Day 24 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Bổ sung guard/flag và checklist release cho repo.

## Reuse từ ngày trước

- Dùng dashboard hoặc customers route hiện có.

## Folder nên sửa

- `apps/react-next/app/(admin)/`
- `notes/day-24.md`
- `algorithms/day-24/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-24
```

## Từng bước

1. Chọn auth gate nhẹ hoặc feature flag wrapper.
2. Viết security/release checklist đi kèm.
3. Đảm bảo UI giải thích rõ khi feature bị khóa.

## Tiêu chí xong

- Có 1 guard/flag thật.
- Checklist release/security đã có.
- Blocked state dễ hiểu.

## Mục tiêu thêm

- Thêm rollback note.

## Gợi ý

- Mục tiêu là decision-making, không phải auth system hoàn chỉnh.

## Bài thuật toán

- **Bài:** Live coding simulation
- **Ràng buộc:**
- Đúng 45′, có timer
- **Hint:** xem pattern **Interview sim** và mở đề đầy đủ nếu cần.

```text
algorithms/day-24/solution.ts
algorithms/day-24/solution.test.ts
```

Chạy: `pnpm test:algo -- day-24`

Mở đề đầy đủ: [day-24.md](../artifacts/algo/problems/day-24.md)

## Commit gợi ý

```text
day-24: add release guard and checklist
```
