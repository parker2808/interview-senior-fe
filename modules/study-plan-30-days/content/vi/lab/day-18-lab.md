# Day 18 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Dùng App Router đúng chất cho route Customers.

## Reuse từ ngày trước

- Dùng route Next Day 15-17.

## Folder nên sửa

- `apps/react-next/app/(admin)/customers/`
- `apps/react-next/app/(admin)/layout.tsx`
- `notes/day-18.md`
- `algorithms/day-18/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-18
```

## Từng bước

1. Chuyển route vào admin layout/segment rõ ràng.
2. Thêm loading.tsx và error.tsx tối thiểu.
3. Ghi mapping Nuxt layout/loading/error sang Next.

## Tiêu chí xong

- Layout/segment rõ.
- Loading + error render được.
- Có note Nuxt ↔ Next.

## Mục tiêu thêm

- Thêm nested layout cho detail route.

## Gợi ý

- Một route đủ để chứng minh concept.

## Bài thuật toán

- **Bài:** Number of Islands
- **Ràng buộc:**
- 1 ≤ m,n ≤ 300
- **Hint:** xem pattern **Grid BFS/DFS** và mở đề đầy đủ nếu cần.

```text
algorithms/day-18/solution.ts
algorithms/day-18/solution.test.ts
```

Chạy: `pnpm test:algo -- day-18`

Mở đề đầy đủ: [day-18.md](../artifacts/algo/problems/day-18.md)

## Commit gợi ý

```text
day-18: add app router segment states
```
