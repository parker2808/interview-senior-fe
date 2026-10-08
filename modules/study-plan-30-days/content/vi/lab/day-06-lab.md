# Day 6 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Scaffold Vue/Nuxt và React/Next app trong cùng workspace.

## Reuse từ ngày trước

- Dùng lại toàn bộ packages/ui của Day 1-5.

## Folder nên sửa

- `apps/vue-nuxt/`
- `apps/react-next/`
- `packages/ui/`
- `notes/day-06.md`
- `algorithms/day-06/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm dev:next
pnpm test:algo -- day-06
```

## Từng bước

1. Scaffold apps/vue-nuxt và apps/react-next.
2. Import Button/FormField vào cả hai app để test workspace link.
3. Ghi root scripts và path mapping vào note.

## Tiêu chí xong

- Cả 2 app boot được.
- Shared UI import chạy ở cả 2 app.
- Có root script dev/lint/test tối thiểu.

## Mục tiêu thêm

- Thêm Storybook cho packages/ui.

## Gợi ý

- Focus vào plumbing của workspace, không phải UI mới.

## Bài thuật toán

- **Bài:** Valid Parentheses
- **Ràng buộc:**
- 1 ≤ s.length ≤ 10^4
- **Hint:** xem pattern **Stack** và mở đề đầy đủ nếu cần.

```text
algorithms/day-06/solution.ts
algorithms/day-06/solution.test.ts
```

Chạy: `pnpm test:algo -- day-06`

Mở đề đầy đủ: [day-06.md](../artifacts/algo/problems/day-06.md)

## Commit gợi ý

```text
day-06: scaffold vue and next apps
```
