# Day 16 — Algo: Maximum Depth of Binary Tree

| | |
|---|---|
| Difficulty | Easy |
| Pattern | DFS recursion |
| LeetCode | 104 |
| Target complexity | O(n) |

## Đề bài

Trả về độ sâu lớn nhất của binary tree (số node trên path dài nhất root→leaf).

## Function signature

```ts
function maxDepth(root: TreeNode | null): number
```

## Ví dụ

**Example 1**
- Input: `[3,9,20,null,null,15,7]`
- Output: `3`

## Constraints

- 0 ≤ nodes ≤ 10^4

## Hint (chỉ mở khi kẹt >12′)

1 + max(left, right); null → 0.

## Nộp bài ở đâu?

Trong companion lab repo:

```text
algo/day-16/solution.ts
algo/day-16/solution.test.ts
```

Chạy: `npm run algo:test:day -- 16` (trong lab repo)

Xem flow tổng: [algorithms-track.md](../../algorithms-track.md) · [lab-repo.md](../../lab-repo.md)
