# Day 12 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Làm responsive behavior thật cho list Vue.

## Reuse từ ngày trước

- Dùng table/card và flow Vue hiện có.

## Folder nên sửa

- `apps/vue-nuxt/components/customers/`
- `notes/day-12.md`
- `algorithms/day-12/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm test:algo -- day-12
```

## Từng bước

1. Cho list đổi giữa table và card theo breakpoint.
2. Giữ primary action dễ thấy trên mobile.
3. Ghi trade-off và anti-pattern đã tránh vào note.

## Tiêu chí xong

- Responsive mode chuyển được.
- Không có horizontal scroll vô dụng.
- Trade-off note xong.

## Mục tiêu thêm

- Thêm screenshot 2 breakpoint vào README.

## Gợi ý

- Đừng nhét action quan trọng vào menu nếu không cần.

## Bài thuật toán

- **Bài:** Reverse Linked List
- **Ràng buộc:**
- 0 ≤ n ≤ 5000
- **Hint:** xem pattern **Linked list** và mở đề đầy đủ nếu cần.

```text
algorithms/day-12/solution.ts
algorithms/day-12/solution.test.ts
```

Chạy: `pnpm test:algo -- day-12`

Mở đề đầy đủ: [day-12.md](../artifacts/algo/problems/day-12.md)

## Commit gợi ý

```text
day-12: make vue list responsive
```
