# Day 28 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Đạt parity tương tự trên React/Next cho cùng slice.

## Reuse từ ngày trước

- Dùng cùng domain và slice Day 27.

## Folder nên sửa

- `apps/react-next/`
- `notes/day-28.md`
- `algorithms/day-28/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-28
```

## Từng bước

1. Polish cùng slice trong Next app để so sánh trực tiếp với Vue.
2. Đảm bảo loading/error/action path đủ demo.
3. Viết 3 khác biệt DX/architecture giữa Vue và Next.

## Tiêu chí xong

- Slice Next demo được.
- Có note so sánh Vue vs Next.
- Có thể demo 2 app cạnh nhau.

## Mục tiêu thêm

- Thêm smoke test cho slice Next.

## Gợi ý

- Feature parity quan trọng hơn polish pixel.

## Bài thuật toán

- **Bài:** Cooldown Easy
- **Ràng buộc:**
- Optional nếu spike overtime
- **Hint:** xem pattern **Cooldown** và mở đề đầy đủ nếu cần.

```text
algorithms/day-28/solution.ts
algorithms/day-28/solution.test.ts
```

Chạy: `pnpm test:algo -- day-28`

Mở đề đầy đủ: [day-28.md](../artifacts/algo/problems/day-28.md)

## Commit gợi ý

```text
day-28: polish next parity slice
```
