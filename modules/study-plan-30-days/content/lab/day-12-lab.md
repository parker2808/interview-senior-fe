# Day 12 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Làm responsive behavior thật cho list Vue.
- **EN:** Implement real responsive behavior for the Vue list.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng table/card và flow Vue hiện có.
- **EN:** Reuse the current table/card and Vue flow.

## Folder(s) nên chạm / Folders to touch

- `apps/vue-nuxt/components/customers/`
- `notes/day-12.md`
- `algorithms/day-12/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm test:algo -- day-12
```

## Từng bước / Step-by-step

1. Cho list đổi giữa table và card theo breakpoint.
   - EN: Switch the list between table and cards by breakpoint.
2. Giữ primary action dễ thấy trên mobile.
   - EN: Keep the primary action easy to find on mobile.
3. Ghi trade-off và anti-pattern đã tránh vào note.
   - EN: Write the chosen trade-off and avoided anti-patterns into the note.

## Done when / Tiêu chí xong

- Responsive mode chuyển được.
  - EN: The responsive mode switches correctly.
- Không có horizontal scroll vô dụng.
  - EN: There is no useless horizontal scroll.
- Trade-off note xong.
  - EN: The trade-off note is done.

## Stretch goal

- Thêm screenshot 2 breakpoint vào README.
  - EN: Add 2 breakpoint screenshots to the README.

## Hints

- Đừng nhét action quan trọng vào menu nếu không cần.
  - EN: Do not hide critical actions in a menu unless you need to.

## Algorithm task

- **Problem:** Reverse Linked List
- **Constraints:**
- 0 ≤ n ≤ 5000
- **Hint:** Iterative: prev=null, cur=head; next=cur.next; cur.next=prev; ...

```text
algorithms/day-12/solution.ts
algorithms/day-12/solution.test.ts
```

Run: `pnpm test:algo -- day-12`

Open the full prompt: [day-12.md](../artifacts/algo/problems/day-12.md)

## Suggested commit

```text
day-12: make vue list responsive
```
