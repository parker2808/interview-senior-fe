# Day 7 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Dựng customer flow shell tĩnh trong Vue app.

## Reuse từ ngày trước

- Dùng packages/ui và note AC của Day 1-6.

## Folder nên sửa

- `apps/vue-nuxt/pages/customers.vue`
- `apps/vue-nuxt/components/`
- `notes/day-07.md`
- `algorithms/day-07/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm test:algo -- day-07
```

## Từng bước

1. Tạo page shell gồm title, filter bar, table area, detail placeholder.
2. Dùng shared UI thay vì viết UI mới.
3. Ghi note boundary component nào sẽ tách sau.

## Tiêu chí xong

- Vue shell nhìn như flow thật.
- Có note boundary.
- Cấu trúc repo vẫn rõ.

## Mục tiêu thêm

- Tách luôn filter bar thành component riêng.

## Gợi ý

- Hôm nay chưa phải data day.

## Bài thuật toán

- **Bài:** Week 1 timed review
- **Ràng buộc:**
- Tự chấm: pass / partial / fail
- **Hint:** xem pattern **Review** và mở đề đầy đủ nếu cần.

```text
algorithms/day-07/solution.ts
algorithms/day-07/solution.test.ts
```

Chạy: `pnpm test:algo -- day-07`

Mở đề đầy đủ: [day-07.md](../artifacts/algo/problems/day-07.md)

## Commit gợi ý

```text
day-07: create vue customer shell
```
