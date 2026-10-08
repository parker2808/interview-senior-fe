# Day 26 — Lab

> **Timebox:** 45-60 phút

Repo dùng chung: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì

- Thêm tests và checklist review cho repo.

## Reuse từ ngày trước

- Dùng flow Vue hoặc Next đại diện nhất.

## Folder nên sửa

- `packages/ui/src/**/__tests__/`
- `apps/react-next/**/__tests__/`
- `notes/day-26.md`
- `algorithms/day-26/`

## Lệnh tối thiểu

```bash
cd /path/to/senior-fe-lab
pnpm test:ui
pnpm test:next  # or vitest/rtl
pnpm test:algo -- day-26
```

## Từng bước

1. Viết 1 test cho shared primitive và 1 test cho page flow.
2. Tạo checklist review correctness/a11y/perf/security/tests.
3. Chạy test và ghi kết quả ngắn.

## Tiêu chí xong

- Ít nhất 2 test xanh.
- Có checklist review.
- Biết phần nào còn thiếu coverage.

## Mục tiêu thêm

- Thêm sample CI workflow.

## Gợi ý

- Test behavior quan trọng, không test implementation detail.

## Bài thuật toán

- **Bài:** Weak-topic drill #2
- **Ràng buộc:**
- 20′ + reflection
- **Hint:** xem pattern **Remedial** và mở đề đầy đủ nếu cần.

```text
algorithms/day-26/solution.ts
algorithms/day-26/solution.test.ts
```

Chạy: `pnpm test:algo -- day-26`

Mở đề đầy đủ: [day-26.md](../artifacts/algo/problems/day-26.md)

## Commit gợi ý

```text
day-26: add tests and review checklist
```
