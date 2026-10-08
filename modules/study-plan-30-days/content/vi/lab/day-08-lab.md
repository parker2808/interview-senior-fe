# Day 8 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Tách shell Vue thành cây component rõ trách nhiệm.

## Reuse từ ngày trước

- Dùng lại page shell Day 7.

## Folder nên sửa

- `apps/vue-nuxt/components/customers/`
- `notes/day-08.md`
- `algorithms/day-08/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm test:algo -- day-08
```

## Từng bước

1. Tách page thành page, filters, table, detail panel.
2. Ghi props, emits và owner của mỗi component.
3. Vẽ lại component tree trong note.

## Tiêu chí xong

- Không còn god component lớn.
- Owner của state/component rõ.
- Flow vẫn render đúng.

## Mục tiêu thêm

- Thêm barrel exports cho module customers.

## Gợi ý

- Nếu phân vân local hay shared, để local trước.

## Bài thuật toán

- **Bài:** Binary Search
- **Ràng buộc:**
- 1 ≤ nums.length ≤ 10^4
- Mọi phần tử unique
- Phải O(log n)
- **Hint:** xem pattern **Binary search** và mở đề đầy đủ nếu cần.

```text
algorithms/day-08/solution.ts
algorithms/day-08/solution.test.ts
```

Chạy: `pnpm test:algo -- day-08`

Mở đề đầy đủ: [day-08.md](../artifacts/algo/problems/day-08.md)

## Commit gợi ý

```text
day-08: split vue customer modules
```
