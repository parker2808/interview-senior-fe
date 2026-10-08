# Day 6 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Scaffold Vue/Nuxt và React/Next app trong cùng workspace.
- **EN:** Scaffold the Vue/Nuxt and React/Next apps in the same workspace.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng lại toàn bộ packages/ui của Day 1-5.
- **EN:** Reuse the full packages/ui work from Days 1-5.

## Folder(s) nên chạm / Folders to touch

- `apps/vue-nuxt/`
- `apps/react-next/`
- `packages/ui/`
- `notes/day-06.md`
- `algorithms/day-06/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm dev:next
pnpm test:algo -- day-06
```

## Từng bước / Step-by-step

1. Scaffold apps/vue-nuxt và apps/react-next.
   - EN: Scaffold apps/vue-nuxt and apps/react-next.
2. Import Button/FormField vào cả hai app để test workspace link.
   - EN: Import Button/FormField into both apps to test the workspace link.
3. Ghi root scripts và path mapping vào note.
   - EN: Write the root scripts and path mapping into the note.

## Done when / Tiêu chí xong

- Cả 2 app boot được.
  - EN: Both apps boot.
- Shared UI import chạy ở cả 2 app.
  - EN: The shared UI package imports in both apps.
- Có root script dev/lint/test tối thiểu.
  - EN: There are basic root dev/lint/test scripts.

## Stretch goal

- Thêm Storybook cho packages/ui.
  - EN: Add Storybook for packages/ui.

## Hints

- Focus vào plumbing của workspace, không phải UI mới.
  - EN: Focus on workspace plumbing, not new UI.

## Algorithm task

- **Problem:** Valid Parentheses
- **Constraints:**
- 1 ≤ s.length ≤ 10^4
- **Hint:** Stack: gặp mở thì push; gặp đóng thì pop và khớp cặp.

```text
algorithms/day-06/solution.ts
algorithms/day-06/solution.test.ts
```

Run: `pnpm test:algo -- day-06`

Open the full prompt: [day-06.md](../artifacts/algo/problems/day-06.md)

## Suggested commit

```text
day-06: scaffold vue and next apps
```
