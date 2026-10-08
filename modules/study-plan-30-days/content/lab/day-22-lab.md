# Day 22 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Dựng một dashboard nhỏ trong Next app.
- **EN:** Build a small dashboard inside the Next app.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng customer data, shared UI và note cache/observability từ tuần 3.
- **EN:** Reuse the customer data, shared UI, and the Week 3 cache/observability notes.

## Folder(s) nên chạm / Folders to touch

- `apps/react-next/app/(admin)/dashboard/`
- `notes/day-22.md`
- `algorithms/day-22/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-22
```

## Từng bước / Step-by-step

1. Tạo dashboard route với 3 widget mock.
   - EN: Create a dashboard route with 3 mocked widgets.
2. Cho mỗi widget loading/error/empty state rõ.
   - EN: Give each widget clear loading/error/empty states.
3. Ghi note khi nào cần BFF hoặc chưa cần.
   - EN: Write when a BFF would become necessary or why it still is not.

## Done when / Tiêu chí xong

- Dashboard route chạy được.
  - EN: The dashboard route runs.
- Widget có state rõ.
  - EN: The widgets have clear states.
- Có architecture note.
  - EN: There is an architecture note.

## Stretch goal

- Thêm partial failure cho 1 widget.
  - EN: Add partial failure for one widget.

## Hints

- Ưu tiên orchestration hơn chart đẹp.
  - EN: Prioritize orchestration over fancy charts.

## Algorithm task

- **Problem:** House Robber
- **Constraints:**
- 1 ≤ nums.length ≤ 100
- **Hint:** dp[i] = max(dp[i-1], dp[i-2] + nums[i]).

```text
algorithms/day-22/solution.ts
algorithms/day-22/solution.test.ts
```

Run: `pnpm test:algo -- day-22`

Open the full prompt: [day-22.md](../artifacts/algo/problems/day-22.md)

## Suggested commit

```text
day-22: add next dashboard route
```
