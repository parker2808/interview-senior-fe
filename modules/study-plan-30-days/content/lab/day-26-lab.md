# Day 26 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Thêm tests và checklist review cho repo.
- **EN:** Add tests and a review checklist to the repo.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng flow Vue hoặc Next đại diện nhất.
- **EN:** Reuse whichever Vue or Next flow is the most representative.

## Folder(s) nên chạm / Folders to touch

- `packages/ui/src/**/__tests__/`
- `apps/react-next/**/__tests__/`
- `notes/day-26.md`
- `algorithms/day-26/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm test:ui
pnpm test:next  # or vitest/rtl
pnpm test:algo -- day-26
```

## Từng bước / Step-by-step

1. Viết 1 test cho shared primitive và 1 test cho page flow.
   - EN: Write 1 test for a shared primitive and 1 test for a page flow.
2. Tạo checklist review correctness/a11y/perf/security/tests.
   - EN: Create a review checklist for correctness/accessibility/performance/security/tests.
3. Chạy test và ghi kết quả ngắn.
   - EN: Run the tests and note the short result.

## Done when / Tiêu chí xong

- Ít nhất 2 test xanh.
  - EN: At least 2 tests are green.
- Có checklist review.
  - EN: There is a review checklist.
- Biết phần nào còn thiếu coverage.
  - EN: You know what still lacks coverage.

## Stretch goal

- Thêm sample CI workflow.
  - EN: Add a sample CI workflow.

## Hints

- Test behavior quan trọng, không test implementation detail.
  - EN: Test important behavior, not implementation detail.

## Algorithm task

- **Problem:** Weak-topic drill #2
- **Constraints:**
- 20′ + reflection
- **Hint:** So trigger với ngày trước.

```text
algorithms/day-26/solution.ts
algorithms/day-26/solution.test.ts
```

Run: `pnpm test:algo -- day-26`

Open the full prompt: [day-26.md](../artifacts/algo/problems/day-26.md)

## Suggested commit

```text
day-26: add tests and review checklist
```
