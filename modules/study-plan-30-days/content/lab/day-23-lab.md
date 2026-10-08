# Day 23 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Làm một perf pass nhỏ trên list hoặc dashboard.
- **EN:** Run a small performance pass on the list or dashboard.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng dashboard/list hiện có.
- **EN:** Reuse the current dashboard/list flow.

## Folder(s) nên chạm / Folders to touch

- `apps/react-next/app/(admin)/customers/`
- `apps/react-next/app/(admin)/dashboard/`
- `notes/day-23.md`
- `algorithms/day-23/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-23
```

## Từng bước / Step-by-step

1. Chọn 1 bottleneck giả lập có thật.
   - EN: Pick one realistic simulated bottleneck.
2. Áp một tối ưu nhỏ có chủ đích.
   - EN: Apply one deliberate optimization.
3. Ghi before/after vào note.
   - EN: Record the before/after in the note.

## Done when / Tiêu chí xong

- Có ít nhất 1 perf fix nhỏ.
  - EN: There is at least one small perf fix.
- Có before/after note.
  - EN: There is a before/after note.
- Code vẫn dễ đọc.
  - EN: The code is still readable.

## Stretch goal

- Đo lại bằng Profiler nếu có.
  - EN: Measure again with Profiler if available.

## Hints

- Fix thứ lớn nhất, không phải thứ dễ khoe nhất.
  - EN: Fix the biggest issue, not the flashiest one.

## Algorithm task

- **Problem:** Warm-up Easy (tự chọn)
- **Constraints:**
- ≤10′
- **Hint:** Ưu tiên bài từng fail.

```text
algorithms/day-23/solution.ts
algorithms/day-23/solution.test.ts
```

Run: `pnpm test:algo -- day-23`

Open the full prompt: [day-23.md](../artifacts/algo/problems/day-23.md)

## Suggested commit

```text
day-23: apply focused perf improvements
```
