# Day 20 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Thêm Server Action, metadata và asset/deploy note trong Next.

## Reuse từ ngày trước

- Dùng customers route Day 15-19.

## Folder nên sửa

- `apps/react-next/app/(admin)/customers/`
- `apps/react-next/app/(admin)/customers/actions.ts`
- `notes/day-20.md`
- `algorithms/day-20/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-20
```

## Từng bước

1. Tạo 1 save form nhỏ qua Server Action hoặc mock server mutation.
2. Đặt metadata/title cho route.
3. Ghi note image/font/deploy assumption.

## Tiêu chí xong

- Mutation demo chạy được.
- Metadata có giá trị rõ.
- Có note asset/deploy.

## Mục tiêu thêm

- Thêm optimistic UI note.

## Gợi ý

- Một mutation nhỏ nhưng rõ boundary là đủ.

## Bài thuật toán

- **Bài:** Coin Change
- **Ràng buộc:**
- 1 ≤ coins.length ≤ 12
- 0 ≤ amount ≤ 10^4
- **Hint:** xem pattern **DP unbounded knapsack** và mở đề đầy đủ nếu cần.

```text
algorithms/day-20/solution.ts
algorithms/day-20/solution.test.ts
```

Chạy: `pnpm test:algo -- day-20`

Mở đề đầy đủ: [day-20.md](../artifacts/algo/problems/day-20.md)

## Commit gợi ý

```text
day-20: add next mutation and metadata
```
