# Day 18 — Algo: Number of Islands

| | |
|---|---|
| Difficulty | Medium |
| Pattern | Grid BFS/DFS |
| LeetCode | 200 |
| Target complexity | O(m·n) |

## Đề bài

Grid `m x n` gồm `'1'` (đất) và `'0'` (nước). Đếm số island (đất nối 4 hướng).

## Function signature

```ts
function numIslands(grid: string[][]): number
```

## Ví dụ

**Example 1**
- Input: `[["1","1","0"],["1","1","0"],["0","0","1"]]`
- Output: `2`

## Constraints

- 1 ≤ m,n ≤ 300

## Hint (chỉ mở khi kẹt >12′)

Gặp "1" → tăng đếm → flood-fill thành "0".

## Nộp bài ở đâu?

Trong companion lab repo:

```text
algo/day-18/solution.ts
algo/day-18/solution.test.ts
```

Chạy: `npm run algo:test:day -- 18` (trong lab repo)

Xem flow tổng: [algorithms-track.md](../../algorithms-track.md) · [lab-repo.md](../../lab-repo.md)
