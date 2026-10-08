# Day 17 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Thêm cleanup và error handling cho flow Next.

## Reuse từ ngày trước

- Dùng list/filter Day 15-16.

## Folder nên sửa

- `apps/react-next/app/customers/`
- `apps/react-next/components/`
- `notes/day-17.md`
- `algorithms/day-17/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-17
```

## Từng bước

1. Tạo một flow có thể bị stale nếu không cleanup.
2. Thêm AbortController hoặc stale guard.
3. Wrap 1 phần bằng error boundary và ghi limit của nó.

## Tiêu chí xong

- Có ví dụ cleanup/stale guard thật.
- Error boundary fallback hiện được.
- Limitations note xong.

## Mục tiêu thêm

- Log mock error event vào note observability.

## Gợi ý

- Một ví dụ sắc nét đủ hơn ba ví dụ nửa vời.

## Bài thuật toán

- **Bài:** Lowest Common Ancestor of a BST
- **Ràng buộc:**
- Cả p,q đều tồn tại trong cây
- **Hint:** xem pattern **BST property** và mở đề đầy đủ nếu cần.

```text
algorithms/day-17/solution.ts
algorithms/day-17/solution.test.ts
```

Chạy: `pnpm test:algo -- day-17`

Mở đề đầy đủ: [day-17.md](../artifacts/algo/problems/day-17.md)

## Commit gợi ý

```text
day-17: add next cleanup and error states
```
