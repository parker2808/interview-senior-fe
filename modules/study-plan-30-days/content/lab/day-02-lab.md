# Day 2 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Biến token thành primitive: Button, Badge và SectionTitle.
- **EN:** Turn the tokens into primitives: Button, Badge, and SectionTitle.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng lại token Day 1.
- **EN:** Reuse the Day 1 tokens.

## Folder(s) nên chạm / Folders to touch

- `packages/ui/src/components/button/`
- `packages/ui/src/components/status-badge/`
- `notes/day-02.md`
- `algorithms/day-02/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm storybook:ui
pnpm test:ui
pnpm test:algo -- day-02
```

## Từng bước / Step-by-step

1. Tạo Button với 3 variant cơ bản.
   - EN: Create a Button with 3 basic variants.
2. Tạo StatusBadge cho pending / verified / blocked.
   - EN: Create a StatusBadge for pending / verified / blocked.
3. Ghi note hierarchy title-action-badge.
   - EN: Write a short note about title-action-badge hierarchy.

## Done when / Tiêu chí xong

- Primitive render được.
  - EN: The primitives render.
- Variant dùng token, không hard-code màu.
  - EN: Variants use tokens instead of hard-coded colors.
- Có note hierarchy.
  - EN: There is a hierarchy note.

## Stretch goal

- Thêm loading state cho Button.
  - EN: Add a loading state to Button.

## Hints

- Ưu tiên API sạch hơn style cầu kỳ.
  - EN: Favor a clean API over fancy styling.

## Algorithm task

- **Problem:** Valid Anagram
- **Constraints:**
- 1 ≤ s.length, t.length ≤ 5·10^4
- s, t chỉ gồm chữ thường a-z
- **Hint:** Đếm tần suất 26 chữ cái (mảng 26) hoặc Map.

```text
algorithms/day-02/solution.ts
algorithms/day-02/solution.test.ts
```

Run: `pnpm test:algo -- day-02`

Open the full prompt: [day-02.md](../artifacts/algo/problems/day-02.md)

## Suggested commit

```text
day-02: add button and badge primitives
```
