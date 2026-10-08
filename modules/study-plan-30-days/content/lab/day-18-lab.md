# Day 18 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Dùng App Router đúng chất cho route Customers.
- **EN:** Use the App Router properly for the Customers route.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng route Next Day 15-17.
- **EN:** Reuse the Next route from Days 15-17.

## Folder(s) nên chạm / Folders to touch

- `apps/react-next/app/(admin)/customers/`
- `apps/react-next/app/(admin)/layout.tsx`
- `notes/day-18.md`
- `algorithms/day-18/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-18
```

## Từng bước / Step-by-step

1. Chuyển route vào admin layout/segment rõ ràng.
   - EN: Move the route into a clear admin layout/segment.
2. Thêm loading.tsx và error.tsx tối thiểu.
   - EN: Add minimal loading.tsx and error.tsx files.
3. Ghi mapping Nuxt layout/loading/error sang Next.
   - EN: Write the Nuxt-to-Next mapping for layout/loading/error.

## Done when / Tiêu chí xong

- Layout/segment rõ.
  - EN: The layout/segment is clear.
- Loading + error render được.
  - EN: Loading and error states render.
- Có note Nuxt ↔ Next.
  - EN: There is a Nuxt ↔ Next note.

## Stretch goal

- Thêm nested layout cho detail route.
  - EN: Add a nested layout for a detail route.

## Hints

- Một route đủ để chứng minh concept.
  - EN: One route is enough to prove the concept.

## Algorithm task

- **Problem:** Number of Islands
- **Constraints:**
- 1 ≤ m,n ≤ 300
- **Hint:** Gặp "1" → tăng đếm → flood-fill thành "0".

```text
algorithms/day-18/solution.ts
algorithms/day-18/solution.test.ts
```

Run: `pnpm test:algo -- day-18`

Open the full prompt: [day-18.md](../artifacts/algo/problems/day-18.md)

## Suggested commit

```text
day-18: add app router segment states
```
