# Day 16 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Thêm filter form và controlled inputs trong Next app.
- **EN:** Add the filter form and controlled inputs in the Next app.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng route Day 15 và shared form primitives.
- **EN:** Reuse the Day 15 route and the shared form primitives.

## Folder(s) nên chạm / Folders to touch

- `apps/react-next/app/customers/`
- `apps/react-next/components/`
- `notes/day-16.md`
- `algorithms/day-16/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-16
```

## Từng bước / Step-by-step

1. Thêm search/filter form kiểu controlled input.
   - EN: Add a search/filter form with controlled inputs.
2. Viết một hook nhỏ cho filter logic.
   - EN: Write one small hook for the filter logic.
3. Ghi nơi React buộc bạn explicit hơn Vue.
   - EN: Note where React forces you to be more explicit than Vue.

## Done when / Tiêu chí xong

- Filter/search hoạt động.
  - EN: Filter/search works.
- Có ít nhất 1 custom hook nhỏ.
  - EN: There is at least 1 small custom hook.
- Có note mental shift.
  - EN: There is a mental-shift note.

## Stretch goal

- Đồng bộ filter với URL.
  - EN: Sync the filter state with the URL.

## Hints

- Giữ hook nhỏ, đừng abstract quá sớm.
  - EN: Keep the hook small and avoid early abstraction.

## Algorithm task

- **Problem:** Maximum Depth of Binary Tree
- **Constraints:**
- 0 ≤ nodes ≤ 10^4
- **Hint:** 1 + max(left, right); null → 0.

```text
algorithms/day-16/solution.ts
algorithms/day-16/solution.test.ts
```

Run: `pnpm test:algo -- day-16`

Open the full prompt: [day-16.md](../artifacts/algo/problems/day-16.md)

## Suggested commit

```text
day-16: add next filter form
```
