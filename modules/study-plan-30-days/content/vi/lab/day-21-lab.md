# Day 21 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Chốt mini slice Next.js có thể demo và note Nuxt ↔ Next.

## Reuse từ ngày trước

- Dùng mọi thứ từ Day 15-20.

## Folder nên sửa

- `apps/react-next/app/(admin)/customers/`
- `notes/day-21.md`
- `README.md`
- `algorithms/day-21/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-21
```

## Từng bước

1. Làm route Customers đủ demo: list, filter, loading/error, một action nhỏ.
2. Viết 5-7 bullet so sánh Nuxt 3 vs Next App Router trên slice này.
3. Thêm section ngắn vào README để chạy app Next demo.

## Tiêu chí xong

- Có route Next demo được.
- Có note so sánh Nuxt ↔ Next.
- README có hướng dẫn chạy.

## Mục tiêu thêm

- Thêm screenshot vào README.

## Gợi ý

- Đừng mở route mới nếu route Customers chưa tròn.

## Bài thuật toán

- **Bài:** Week 3 timed review
- **Ràng buộc:**
- Self-score
- **Hint:** xem pattern **Review** và mở đề đầy đủ nếu cần.

```text
algorithms/day-21/solution.ts
algorithms/day-21/solution.test.ts
```

Chạy: `pnpm test:algo -- day-21`

Mở đề đầy đủ: [day-21.md](../artifacts/algo/problems/day-21.md)

## Commit gợi ý

```text
day-21: finish next customer mini demo
```
