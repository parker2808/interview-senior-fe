# Day 19 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Luyện server fetch, cache và rendering trade-off trong Next.

## Reuse từ ngày trước

- Dùng route App Router Day 18.

## Folder nên sửa

- `apps/react-next/app/(admin)/customers/`
- `notes/day-19.md`
- `algorithms/day-19/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-19
```

## Từng bước

1. Tạo 2 path nhỏ: một revalidate, một no-store hoặc client fetch.
2. Viết bảng stale vs fresh cho cùng domain.
3. Ghi note SSR/ISR/streaming choice.

## Tiêu chí xong

- Có ít nhất 2 fetch strategy.
- Bảng stale/fresh xong.
- Trade-off render giải thích được.

## Mục tiêu thêm

- Thêm tag/path revalidation note.

## Gợi ý

- Mock response cũng đủ để reason.

## Bài thuật toán

- **Bài:** Climbing Stairs
- **Ràng buộc:**
- 1 ≤ n ≤ 45
- **Hint:** xem pattern **DP** và mở đề đầy đủ nếu cần.

```text
algorithms/day-19/solution.ts
algorithms/day-19/solution.test.ts
```

Chạy: `pnpm test:algo -- day-19`

Mở đề đầy đủ: [day-19.md](../artifacts/algo/problems/day-19.md)

## Commit gợi ý

```text
day-19: compare next cache strategies
```
