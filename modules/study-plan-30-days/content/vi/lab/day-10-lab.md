# Day 10 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Thêm model TypeScript và mock API typed cho flow Vue.

## Reuse từ ngày trước

- Dùng component tree + state map Day 8-9.

## Folder nên sửa

- `apps/vue-nuxt/types/`
- `apps/vue-nuxt/server-mocks/`
- `apps/vue-nuxt/composables/`
- `algorithms/day-10/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm typecheck
pnpm test:algo -- day-10
```

## Từng bước

1. Định nghĩa Customer, CustomerStatus, FieldConfig, ApiError.
2. Tạo composable mock trả list + detail typed.
3. Nối typed data vào page shell.

## Tiêu chí xong

- Typecheck sạch.
- Mock data render được.
- Không còn any ở đường chính.

## Mục tiêu thêm

- Thêm discriminated union cho fetch state.

## Gợi ý

- Mock API nhỏ là đủ.

## Bài thuật toán

- **Bài:** Longest Substring Without Repeating Characters
- **Ràng buộc:**
- 0 ≤ s.length ≤ 5·10^4
- **Hint:** xem pattern **Sliding window** và mở đề đầy đủ nếu cần.

```text
algorithms/day-10/solution.ts
algorithms/day-10/solution.test.ts
```

Chạy: `pnpm test:algo -- day-10`

Mở đề đầy đủ: [day-10.md](../artifacts/algo/problems/day-10.md)

## Commit gợi ý

```text
day-10: add typed vue mock data
```
