# Day 17 — Algo: Lowest Common Ancestor of a BST

| | |
|---|---|
| Difficulty | Medium |
| Pattern | BST property |
| LeetCode | 235 |
| Target complexity | O(h) |

## Đề bài

Cho BST và hai node `p`, `q`, tìm LCA. Mọi node value unique.

## Function signature

```ts
function lowestCommonAncestor(root: TreeNode, p: TreeNode, q: TreeNode): TreeNode
```

## Ví dụ

**Example 1**
- Input: `root=[6,2,8,0,4,7,9], p=2, q=8`
- Output: `6`

## Constraints

- Cả p,q đều tồn tại trong cây

## Hint (chỉ mở khi kẹt >12′)

Nếu cả hai < root → trái; cả hai > root → phải; else root là LCA.

## Nộp bài ở đâu?

Trong companion lab repo:

```text
algo/day-17/solution.ts
algo/day-17/solution.test.ts
```

Chạy: `npm run algo:test:day -- 17` (trong lab repo)

Xem flow tổng: [algorithms-track.md](../../algorithms-track.md) · [lab-repo.md](../../lab-repo.md)
