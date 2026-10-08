# Day 21 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Chốt mini slice Next.js có thể demo và note Nuxt ↔ Next.
- **EN:** Finish a demoable Next.js mini slice and the Nuxt ↔ Next note.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng mọi thứ từ Day 15-20.
- **EN:** Reuse everything from Days 15-20.

## Folder(s) nên chạm / Folders to touch

- `apps/react-next/app/(admin)/customers/`
- `notes/day-21.md`
- `README.md`
- `algorithms/day-21/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-21
```

## Từng bước / Step-by-step

1. Làm route Customers đủ demo: list, filter, loading/error, một action nhỏ.
   - EN: Make the Customers route demoable: list, filter, loading/error, and one action.
2. Viết 5-7 bullet so sánh Nuxt 3 vs Next App Router trên slice này.
   - EN: Write 5-7 bullets comparing Nuxt 3 vs the Next App Router on this slice.
3. Thêm section ngắn vào README để chạy app Next demo.
   - EN: Add a short README section for running the Next demo app.

## Done when / Tiêu chí xong

- Có route Next demo được.
  - EN: There is a demoable Next route.
- Có note so sánh Nuxt ↔ Next.
  - EN: There is a Nuxt ↔ Next comparison note.
- README có hướng dẫn chạy.
  - EN: The README includes run instructions.

## Stretch goal

- Thêm screenshot vào README.
  - EN: Add a screenshot to the README.

## Hints

- Đừng mở route mới nếu route Customers chưa tròn.
  - EN: Do not open a new route if the Customers route is not coherent yet.

## Algorithm task

- **Problem:** Week 3 timed review
- **Constraints:**
- Self-score
- **Hint:** Islands: đừng quên mark visited.

```text
algorithms/day-21/solution.ts
algorithms/day-21/solution.test.ts
```

Run: `pnpm test:algo -- day-21`

Open the full prompt: [day-21.md](../artifacts/algo/problems/day-21.md)

## Suggested commit

```text
day-21: finish next customer mini demo
```
