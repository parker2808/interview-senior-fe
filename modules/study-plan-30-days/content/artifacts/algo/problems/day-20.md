# Day 20 — Algo: Coin Change

| | |
|---|---|
| Difficulty | Medium |
| Pattern | DP unbounded knapsack |
| LeetCode | 322 |
| Target complexity | O(amount · coins.length) |

## Đề bài

Cho `coins` (mệnh giá) và `amount`. Trả về **số xu ít nhất** để tạo đúng amount. Không đủ thì `-1`. Mỗi loại xu dùng không giới hạn.

## Function signature

```ts
function coinChange(coins: number[], amount: number): number
```

## Ví dụ

**Example 1**
- Input: `coins = [1,2,5], amount = 11`
- Output: `3`
- Giải thích: 5+5+1

**Example 2**
- Input: `coins = [2], amount = 3`
- Output: `-1`

## Constraints

- 1 ≤ coins.length ≤ 12
- 0 ≤ amount ≤ 10^4

## Hint (chỉ mở khi kẹt >12′)

dp[x] = min số xu tạo x; khởi dp[0]=0, còn lại Infinity.

## Nộp bài ở đâu?

Trong companion lab repo:

```text
algo/day-20/solution.ts
algo/day-20/solution.test.ts
```

Chạy: `npm run algo:test:day -- 20` (trong lab repo)

Xem flow tổng: [algorithms-track.md](../../algorithms-track.md) · [lab-repo.md](../../lab-repo.md)
