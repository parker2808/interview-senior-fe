# Day 15 — Algo: Binary Tree Level Order Traversal

| | |
|---|---|
| Difficulty | Medium |
| Pattern | BFS queue |
| LeetCode | 102 |
| Target complexity | O(n) |

## Đề bài

Duyệt cây theo level, trả về `number[][]` (mỗi level một mảng).

## Function signature

```ts
function levelOrder(root: TreeNode | null): number[][]
```

## Ví dụ

**Example 1**
- Input: `root = [3,9,20,null,null,15,7]`
- Output: `[[3],[9,20],[15,7]]`

## Constraints

- 0 ≤ nodes ≤ 2000

## Hint (chỉ mở khi kẹt >12′)

Queue: mỗi vòng lấy size = queue.length = số node level hiện tại.

## Nộp bài ở đâu?

Trong companion lab repo:

```text
algo/day-15/solution.ts
algo/day-15/solution.test.ts
```

Chạy: `npm run algo:test:day -- 15` (trong lab repo)

Xem flow tổng: [algorithms-track.md](../../algorithms-track.md) · [lab-repo.md](../../lab-repo.md)
