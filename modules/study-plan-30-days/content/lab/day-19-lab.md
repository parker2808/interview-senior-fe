# Day 19 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Luyện server fetch, cache và rendering trade-off trong Next.
- **EN:** Practice server fetch, cache, and rendering trade-offs in Next.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng route App Router Day 18.
- **EN:** Reuse the Day 18 App Router route.

## Folder(s) nên chạm / Folders to touch

- `apps/react-next/app/(admin)/customers/`
- `notes/day-19.md`
- `algorithms/day-19/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-19
```

## Từng bước / Step-by-step

1. Tạo 2 path nhỏ: một revalidate, một no-store hoặc client fetch.
   - EN: Create 2 small paths: one with revalidate, one with no-store or client fetch.
2. Viết bảng stale vs fresh cho cùng domain.
   - EN: Write a stale-vs-fresh table for the same domain.
3. Ghi note SSR/ISR/streaming choice.
   - EN: Add a note about SSR/ISR/streaming choices.

## Done when / Tiêu chí xong

- Có ít nhất 2 fetch strategy.
  - EN: There are at least 2 fetch strategies.
- Bảng stale/fresh xong.
  - EN: The stale/fresh table is done.
- Trade-off render giải thích được.
  - EN: The rendering trade-off is explainable.

## Stretch goal

- Thêm tag/path revalidation note.
  - EN: Add a tag/path revalidation note.

## Hints

- Mock response cũng đủ để reason.
  - EN: Mock responses are enough for reasoning.

## Algorithm task

- **Problem:** Climbing Stairs
- **Constraints:**
- 1 ≤ n ≤ 45
- **Hint:** dp[i] = dp[i-1] + dp[i-2] (Fibonacci).

```text
algorithms/day-19/solution.ts
algorithms/day-19/solution.test.ts
```

Run: `pnpm test:algo -- day-19`

Open the full prompt: [day-19.md](../artifacts/algo/problems/day-19.md)

## Suggested commit

```text
day-19: compare next cache strategies
```
