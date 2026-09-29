# Algorithms track — flow chi tiết

## Algo vận hành thế nào trong plan?

Mỗi ngày có **đúng 1 bài** (hoặc 1 session review/mock). Không phải “tự tìm đề trên LeetCode”.

| Bước | Ở đâu | Bạn làm gì |
|---:|---|---|
| 1 | Tab **Hướng dẫn** / plan ngày | Biết tên bài + pattern |
| 2 | File đề `artifacts/algo/problems/day-NN.md` | Đọc đề, example, constraints |
| 3 | Companion repo `senior-fe-lab/algo/day-NN/` | Viết `solution.ts` + test |
| 4 | Worksheet section Algo (tuỳ chọn) | Ghi pattern / Big-O / lỗi hay gặp |
| 5 | Checkpoint | Tick khi test xanh hoặc self-score mock |

```text
Plan hub (đọc)          Lab repo (code + push)
─────────────────       ─────────────────────────
day-NN đề bài.md   →    algo/day-NN/solution.ts
algorithms-track   →    npm run algo:test:day -- N
worksheet log      →    git commit "day-N: algo ..."
```

## Flow 15–25 phút (làm đúng thứ tự)

1. **Đọc đề 1 lần** (2′) — nói lại constraint bằng lời của mình  
2. **Brute force bằng lời** (1′) — dù O(n²) cũng được  
3. **Chọn pattern** (1′) — HashMap? Two pointers? DP?  
4. **Code TypeScript** trong lab (8–15′)  
5. **Chạy test** + thêm 1 edge (empty / 1 phần tử / duplicate)  
6. **Ghi 3 dòng** vào worksheet: pattern · time/space · bài học  

**Luật:** kẹt >12′ → mở **Hint** trong file đề (không mở full solution online trước).

## Bank đề theo ngày

| Day | Bài | Pattern | File đề |
|---:|---|---|---|
| 1 | Two Sum | HashMap | [day-01.md](./artifacts/algo/problems/day-01.md) |
| 2 | Valid Anagram | Frequency map | [day-02.md](./artifacts/algo/problems/day-02.md) |
| 3 | Contains Duplicate | Set | [day-03.md](./artifacts/algo/problems/day-03.md) |
| 4 | Group Anagrams | HashMap + sorted key | [day-04.md](./artifacts/algo/problems/day-04.md) |
| 5 | Top K Frequent Elements | HashMap + bucket/sort | [day-05.md](./artifacts/algo/problems/day-05.md) |
| 6 | Valid Parentheses | Stack | [day-06.md](./artifacts/algo/problems/day-06.md) |
| 7 | Week 1 timed review | Review | [day-07.md](./artifacts/algo/problems/day-07.md) |
| 8 | Binary Search | Binary search | [day-08.md](./artifacts/algo/problems/day-08.md) |
| 9 | Two Sum II (sorted) | Two pointers | [day-09.md](./artifacts/algo/problems/day-09.md) |
| 10 | Longest Substring Without Repeating Characters | Sliding window | [day-10.md](./artifacts/algo/problems/day-10.md) |
| 11 | Min Stack | Stack design | [day-11.md](./artifacts/algo/problems/day-11.md) |
| 12 | Reverse Linked List | Linked list | [day-12.md](./artifacts/algo/problems/day-12.md) |
| 13 | Linked List Cycle | Floyd two pointers | [day-13.md](./artifacts/algo/problems/day-13.md) |
| 14 | Week 2 timed review | Review | [day-14.md](./artifacts/algo/problems/day-14.md) |
| 15 | Binary Tree Level Order Traversal | BFS queue | [day-15.md](./artifacts/algo/problems/day-15.md) |
| 16 | Maximum Depth of Binary Tree | DFS recursion | [day-16.md](./artifacts/algo/problems/day-16.md) |
| 17 | Lowest Common Ancestor of a BST | BST property | [day-17.md](./artifacts/algo/problems/day-17.md) |
| 18 | Number of Islands | Grid BFS/DFS | [day-18.md](./artifacts/algo/problems/day-18.md) |
| 19 | Climbing Stairs | DP | [day-19.md](./artifacts/algo/problems/day-19.md) |
| 20 | Coin Change | DP unbounded knapsack | [day-20.md](./artifacts/algo/problems/day-20.md) |
| 21 | Week 3 timed review | Review | [day-21.md](./artifacts/algo/problems/day-21.md) |
| 22 | House Robber | DP 1D | [day-22.md](./artifacts/algo/problems/day-22.md) |
| 23 | Warm-up Easy (tự chọn) | Warm-up | [day-23.md](./artifacts/algo/problems/day-23.md) |
| 24 | Live coding simulation | Interview sim | [day-24.md](./artifacts/algo/problems/day-24.md) |
| 25 | Weak-topic drill #1 | Remedial | [day-25.md](./artifacts/algo/problems/day-25.md) |
| 26 | Weak-topic drill #2 | Remedial | [day-26.md](./artifacts/algo/problems/day-26.md) |
| 27 | Big-O flashcards | Theory | [day-27.md](./artifacts/algo/problems/day-27.md) |
| 28 | Cooldown Easy | Cooldown | [day-28.md](./artifacts/algo/problems/day-28.md) |
| 29 | 8 patterns flashcards + 1 random | Review | [day-29.md](./artifacts/algo/problems/day-29.md) |
| 30 | Mock interview live coding | Mock | [day-30.md](./artifacts/algo/problems/day-30.md) |

## Pattern theo tuần

| Tuần | Pattern |
|---|---|
| 1 | HashMap / Set / Frequency / Stack |
| 2 | Binary search · Two pointers · Sliding window · Linked list |
| 3 | Tree BFS/DFS · Grid · DP lite |
| 4–5 | Review · weak drill · live mock |

## Big-O cheat sheet

| Thao tác | Average |
|---|---|
| Map/Set get/add | O(1) |
| Array push/pop | O(1) |
| Array shift / splice giữa | O(n) |
| Sort | O(n log n) |
| Binary search (sorted) | O(log n) |
| Tree/graph visit mỗi node 1 lần | O(n) |
