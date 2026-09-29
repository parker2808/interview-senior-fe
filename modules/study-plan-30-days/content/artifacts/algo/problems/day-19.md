# Day 19 — Algo: Climbing Stairs

| | |
|---|---|
| Difficulty | Easy |
| Pattern | DP |
| LeetCode | 70 |
| Target complexity | O(n) time, O(1) space |

## Đề bài

Leo `n` bậc. Mỗi lần lên 1 hoặc 2 bậc. Hỏi có bao nhiêu cách khác nhau?

## Function signature

```ts
function climbStairs(n: number): number
```

## Ví dụ

**Example 1**
- Input: `n = 2`
- Output: `2`
- Giải thích: 1+1 hoặc 2

**Example 2**
- Input: `n = 3`
- Output: `3`

## Constraints

- 1 ≤ n ≤ 45

## Hint (chỉ mở khi kẹt >12′)

dp[i] = dp[i-1] + dp[i-2] (Fibonacci).

## Nộp bài ở đâu?

Trong companion lab repo:

```text
algo/day-19/solution.ts
algo/day-19/solution.test.ts
```

Chạy: `npm run algo:test:day -- 19` (trong lab repo)

Xem flow tổng: [algorithms-track.md](../../algorithms-track.md) · [lab-repo.md](../../lab-repo.md)
