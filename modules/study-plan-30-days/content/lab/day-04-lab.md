# Day 4 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Tạo DataTable shell và card fallback cho mobile.
- **EN:** Create a DataTable shell and a mobile card fallback.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng lại badge, button và form primitive.
- **EN:** Reuse the badge, button, and form primitives.

## Folder(s) nên chạm / Folders to touch

- `packages/ui/src/components/data-table/`
- `packages/ui/src/components/customer-card/`
- `notes/day-04.md`
- `algorithms/day-04/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm storybook:ui
pnpm test:ui
pnpm test:algo -- day-04
```

## Từng bước / Step-by-step

1. Dựng DataTable shell với header, row, empty state.
   - EN: Build a DataTable shell with header, row, and empty state.
2. Tạo CustomerCard cho mobile với 2-3 field chính.
   - EN: Create a CustomerCard for mobile with 2-3 key fields.
3. Viết note khi nào table nên xuống card.
   - EN: Write down when the table should collapse into cards.

## Done when / Tiêu chí xong

- Có cả table và card fallback.
  - EN: Both the table and card fallback exist.
- Empty state render được.
  - EN: The empty state renders.
- Trade-off note đã có.
  - EN: The trade-off note exists.

## Stretch goal

- Thêm sticky header.
  - EN: Add a sticky header.

## Hints

- Đừng virtualize sớm ở ngày này.
  - EN: Do not virtualize this early.

## Algorithm task

- **Problem:** Group Anagrams
- **Constraints:**
- 1 ≤ strs.length ≤ 10^4
- 0 ≤ strs[i].length ≤ 100
- strs[i] chữ thường
- **Hint:** Key = sort ký tự ("eat"→"aet") hoặc count signature "a1e1t1".

```text
algorithms/day-04/solution.ts
algorithms/day-04/solution.test.ts
```

Run: `pnpm test:algo -- day-04`

Open the full prompt: [day-04.md](../artifacts/algo/problems/day-04.md)

## Suggested commit

```text
day-04: add table shell and mobile cards
```
