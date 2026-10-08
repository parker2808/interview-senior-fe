# Day 28 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Đạt parity tương tự trên React/Next cho cùng slice.
- **EN:** Reach similar parity on React/Next for the same slice.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng cùng domain và slice Day 27.
- **EN:** Reuse the same domain and slice from Day 27.

## Folder(s) nên chạm / Folders to touch

- `apps/react-next/`
- `notes/day-28.md`
- `algorithms/day-28/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-28
```

## Từng bước / Step-by-step

1. Polish cùng slice trong Next app để so sánh trực tiếp với Vue.
   - EN: Polish the same slice in the Next app so it compares directly with Vue.
2. Đảm bảo loading/error/action path đủ demo.
   - EN: Make sure loading/error/action paths are demoable.
3. Viết 3 khác biệt DX/architecture giữa Vue và Next.
   - EN: Write 3 DX/architecture differences between Vue and Next.

## Done when / Tiêu chí xong

- Slice Next demo được.
  - EN: The Next slice is demoable.
- Có note so sánh Vue vs Next.
  - EN: There is a Vue vs Next note.
- Có thể demo 2 app cạnh nhau.
  - EN: You can demo both apps side by side.

## Stretch goal

- Thêm smoke test cho slice Next.
  - EN: Add a smoke test for the Next slice.

## Hints

- Feature parity quan trọng hơn polish pixel.
  - EN: Feature parity matters more than pixel polish.

## Algorithm task

- **Problem:** Cooldown Easy
- **Constraints:**
- Optional nếu spike overtime
- **Hint:** Có thể skip nếu spike chưa xong.

```text
algorithms/day-28/solution.ts
algorithms/day-28/solution.test.ts
```

Run: `pnpm test:algo -- day-28`

Open the full prompt: [day-28.md](../artifacts/algo/problems/day-28.md)

## Suggested commit

```text
day-28: polish next parity slice
```
