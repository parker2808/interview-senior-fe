# Day 11 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Dùng shared primitives thật trong Vue app.
- **EN:** Use the shared primitives for real in the Vue app.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng packages/ui + mock data Day 10.
- **EN:** Reuse packages/ui plus the Day 10 mock data.

## Folder(s) nên chạm / Folders to touch

- `apps/vue-nuxt/components/customers/`
- `packages/ui/src/components/`
- `notes/day-11.md`
- `algorithms/day-11/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm storybook:ui
pnpm test:algo -- day-11
```

## Từng bước / Step-by-step

1. Thay placeholder bằng Button/FormField/EmptyState/ErrorState thật.
   - EN: Replace placeholders with the real shared Button/FormField/EmptyState/ErrorState components.
2. Đảm bảo list có empty/error flow bằng shared component.
   - EN: Make sure the list exposes empty/error flows through shared components.
3. Ghi note primitive nào còn thiếu prop.
   - EN: Note which primitive APIs still miss an important prop.

## Done when / Tiêu chí xong

- Ít nhất 4 primitive được consume.
  - EN: At least 4 primitives are consumed.
- Có empty/error state thật.
  - EN: There is a real empty/error state.
- Có note gap của design system.
  - EN: There is a design-system gap note.

## Stretch goal

- Refactor 1 primitive API sau khi consume.
  - EN: Refactor one primitive API after consuming it.

## Hints

- Sửa primitive trước khi hack ở app.
  - EN: Fix the primitive before hacking around it in the app.

## Algorithm task

- **Problem:** Min Stack
- **Constraints:**
- Mọi thao tác O(1)
- **Hint:** Stack phụ lưu min hiện tại, hoặc lưu cặp (value, minSoFar).

```text
algorithms/day-11/solution.ts
algorithms/day-11/solution.test.ts
```

Run: `pnpm test:algo -- day-11`

Open the full prompt: [day-11.md](../artifacts/algo/problems/day-11.md)

## Suggested commit

```text
day-11: consume shared ui in vue app
```
