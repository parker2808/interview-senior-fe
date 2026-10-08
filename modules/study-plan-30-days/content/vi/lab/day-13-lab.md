# Day 13 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Thêm flow edit có keyboard support trong Vue app.

## Reuse từ ngày trước

- Dùng FormField/TextField Day 3 và flow hiện có.

## Folder nên sửa

- `apps/vue-nuxt/components/customers/`
- `notes/day-13.md`
- `algorithms/day-13/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm test:algo -- day-13
```

## Từng bước

1. Mở editor từ row hoặc detail panel.
2. Thêm ESC để đóng, return focus và focus visible rõ.
3. Ghi 5 a11y checks đã tự test.

## Tiêu chí xong

- Flow edit mở/đóng được.
- ESC và return focus hoạt động.
- Có checklist a11y đã tick.

## Mục tiêu thêm

- Thêm initial focus thông minh cho field đầu tiên.

## Gợi ý

- Hiểu cơ chế là đủ, chưa cần modal hoàn hảo.

## Bài thuật toán

- **Bài:** Linked List Cycle
- **Ràng buộc:**
- Không dùng thêm O(n) Set nếu có thể (Floyd).
- **Hint:** xem pattern **Floyd two pointers** và mở đề đầy đủ nếu cần.

```text
algorithms/day-13/solution.ts
algorithms/day-13/solution.test.ts
```

Chạy: `pnpm test:algo -- day-13`

Mở đề đầy đủ: [day-13.md](../artifacts/algo/problems/day-13.md)

## Commit gợi ý

```text
day-13: add accessible vue edit flow
```
