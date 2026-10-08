# Day 9 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Chốt state ownership cho filter, selection và detail trong Vue app.

## Reuse từ ngày trước

- Dùng lại component tree Day 8.

## Folder nên sửa

- `apps/vue-nuxt/composables/`
- `apps/vue-nuxt/components/customers/`
- `notes/day-09.md`
- `algorithms/day-09/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm test:algo -- day-09
```

## Từng bước

1. Quyết định state nào ở page, state nào ở URL, state nào ở composable.
2. Đưa filter/search lên URL nếu hợp lý.
3. Viết state map owner/reader/writer/reset rule.

## Tiêu chí xong

- Filter state có source of truth rõ.
- Selection/reset behavior giải thích được.
- State map xong.

## Mục tiêu thêm

- Thêm note vì sao chưa cần Pinia.

## Gợi ý

- URL state chỉ giữ cái hữu ích khi share/refresh.

## Bài thuật toán

- **Bài:** Two Sum II (sorted)
- **Ràng buộc:**
- 2 ≤ numbers.length ≤ 3·10^4
- Đã sort non-decreasing
- **Hint:** xem pattern **Two pointers** và mở đề đầy đủ nếu cần.

```text
algorithms/day-09/solution.ts
algorithms/day-09/solution.test.ts
```

Chạy: `pnpm test:algo -- day-09`

Mở đề đầy đủ: [day-09.md](../artifacts/algo/problems/day-09.md)

## Commit gợi ý

```text
day-09: clarify vue state ownership
```
