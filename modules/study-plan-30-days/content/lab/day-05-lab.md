# Day 5 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Hoàn thiện EmptyState và ErrorState, rồi gắn vào acceptance criteria.
- **EN:** Finish EmptyState and ErrorState, then tie them back to acceptance criteria.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng lại table/card shell Day 4.
- **EN:** Reuse the Day 4 table/card shell.

## Folder(s) nên chạm / Folders to touch

- `packages/ui/src/components/empty-state/`
- `packages/ui/src/components/error-state/`
- `notes/day-05.md`
- `algorithms/day-05/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm storybook:ui
pnpm test:ui
pnpm test:algo -- day-05
```

## Từng bước / Step-by-step

1. Tạo EmptyState và ErrorState dùng lại được.
   - EN: Create reusable EmptyState and ErrorState components.
2. Gắn chúng vào demo state của table/card.
   - EN: Wire them into the table/card demo states.
3. Viết 5 acceptance criteria cho list + detail.
   - EN: Write 5 acceptance criteria for list + detail.

## Done when / Tiêu chí xong

- Có 2 state component dùng lại được.
  - EN: There are 2 reusable state components.
- Demo có empty/error flow.
  - EN: The demo includes empty and error flows.
- Acceptance criteria đủ rõ.
  - EN: The acceptance criteria are clear.

## Stretch goal

- Thêm retry callback.
  - EN: Add a retry callback.

## Hints

- Copy sản phẩm quan trọng hơn animation.
  - EN: Good product copy matters more than animation today.

## Algorithm task

- **Problem:** Top K Frequent Elements
- **Constraints:**
- 1 ≤ nums.length ≤ 10^5
- k nằm trong range số phần tử distinct
- **Hint:** Đếm frequency → sort entries hoặc bucket sort theo freq.

```text
algorithms/day-05/solution.ts
algorithms/day-05/solution.test.ts
```

Run: `pnpm test:algo -- day-05`

Open the full prompt: [day-05.md](../artifacts/algo/problems/day-05.md)

## Suggested commit

```text
day-05: add empty and error states
```
