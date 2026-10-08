# Day 2 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Biến token thành primitive: Button, Badge và SectionTitle.

## Reuse từ ngày trước

- Dùng lại token Day 1.

## Folder nên sửa

- `packages/ui/src/components/button/`
- `packages/ui/src/components/status-badge/`
- `notes/day-02.md`
- `algorithms/day-02/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm storybook:ui
pnpm test:ui
pnpm test:algo -- day-02
```

## Từng bước

1. Tạo Button với 3 variant cơ bản.
2. Tạo StatusBadge cho pending / verified / blocked.
3. Ghi note hierarchy title-action-badge.

## Tiêu chí xong

- Primitive render được.
- Variant dùng token, không hard-code màu.
- Có note hierarchy.

## Mục tiêu thêm

- Thêm loading state cho Button.

## Gợi ý

- Ưu tiên API sạch hơn style cầu kỳ.

## Bài thuật toán

- **Bài:** Valid Anagram
- **Ràng buộc:**
- 1 ≤ s.length, t.length ≤ 5·10^4
- s, t chỉ gồm chữ thường a-z
- **Hint:** xem pattern **Frequency map** và mở đề đầy đủ nếu cần.

```text
algorithms/day-02/solution.ts
algorithms/day-02/solution.test.ts
```

Chạy: `pnpm test:algo -- day-02`

Mở đề đầy đủ: [day-02.md](../artifacts/algo/problems/day-02.md)

## Commit gợi ý

```text
day-02: add button and badge primitives
```
