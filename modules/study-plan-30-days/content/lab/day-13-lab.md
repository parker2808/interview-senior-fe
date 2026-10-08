# Day 13 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Thêm flow edit có keyboard support trong Vue app.
- **EN:** Add an edit flow with keyboard support in the Vue app.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng FormField/TextField Day 3 và flow hiện có.
- **EN:** Reuse the Day 3 form primitives and the current flow.

## Folder(s) nên chạm / Folders to touch

- `apps/vue-nuxt/components/customers/`
- `notes/day-13.md`
- `algorithms/day-13/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm test:algo -- day-13
```

## Từng bước / Step-by-step

1. Mở editor từ row hoặc detail panel.
   - EN: Open the editor from the row or detail panel.
2. Thêm ESC để đóng, return focus và focus visible rõ.
   - EN: Add ESC to close, return focus, and visible focus treatment.
3. Ghi 5 a11y checks đã tự test.
   - EN: Write down 5 accessibility checks you tested manually.

## Done when / Tiêu chí xong

- Flow edit mở/đóng được.
  - EN: The edit flow opens and closes.
- ESC và return focus hoạt động.
  - EN: ESC and return focus work.
- Có checklist a11y đã tick.
  - EN: There is a checked accessibility list.

## Stretch goal

- Thêm initial focus thông minh cho field đầu tiên.
  - EN: Add smarter initial focus on the first field.

## Hints

- Hiểu cơ chế là đủ, chưa cần modal hoàn hảo.
  - EN: Understanding the mechanics is enough; the modal does not need to be perfect.

## Algorithm task

- **Problem:** Linked List Cycle
- **Constraints:**
- Không dùng thêm O(n) Set nếu có thể (Floyd).
- **Hint:** slow/fast: nếu gặp nhau → cycle.

```text
algorithms/day-13/solution.ts
algorithms/day-13/solution.test.ts
```

Run: `pnpm test:algo -- day-13`

Open the full prompt: [day-13.md](../artifacts/algo/problems/day-13.md)

## Suggested commit

```text
day-13: add accessible vue edit flow
```
