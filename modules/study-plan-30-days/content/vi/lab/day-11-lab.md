# Day 11 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Dùng shared primitives thật trong Vue app.

## Reuse từ ngày trước

- Dùng packages/ui + mock data Day 10.

## Folder nên sửa

- `apps/vue-nuxt/components/customers/`
- `packages/ui/src/components/`
- `notes/day-11.md`
- `algorithms/day-11/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm storybook:ui
pnpm test:algo -- day-11
```

## Từng bước

1. Thay placeholder bằng Button/FormField/EmptyState/ErrorState thật.
2. Đảm bảo list có empty/error flow bằng shared component.
3. Ghi note primitive nào còn thiếu prop.

## Tiêu chí xong

- Ít nhất 4 primitive được consume.
- Có empty/error state thật.
- Có note gap của design system.

## Mục tiêu thêm

- Refactor 1 primitive API sau khi consume.

## Gợi ý

- Sửa primitive trước khi hack ở app.

## Bài thuật toán

- **Bài:** Min Stack
- **Ràng buộc:**
- Mọi thao tác O(1)
- **Hint:** xem pattern **Stack design** và mở đề đầy đủ nếu cần.

```text
algorithms/day-11/solution.ts
algorithms/day-11/solution.test.ts
```

Chạy: `pnpm test:algo -- day-11`

Mở đề đầy đủ: [day-11.md](../artifacts/algo/problems/day-11.md)

## Commit gợi ý

```text
day-11: consume shared ui in vue app
```
