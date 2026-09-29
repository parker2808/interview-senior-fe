# Day 22 — Algo: House Robber

| | |
|---|---|
| Difficulty | Medium |
| Pattern | DP 1D |
| LeetCode | 198 |
| Target complexity | O(n) / O(1) space |

## Đề bài

Mảng `nums[i]` = tiền nhà i. Không được cướp 2 nhà kề nhau. Max tiền?

## Function signature

```ts
function rob(nums: number[]): number
```

## Ví dụ

**Example 1**
- Input: `nums = [1,2,3,1]`
- Output: `4`
- Giải thích: 1 + 3

**Example 2**
- Input: `nums = [2,7,9,3,1]`
- Output: `12`

## Constraints

- 1 ≤ nums.length ≤ 100

## Hint (chỉ mở khi kẹt >12′)

dp[i] = max(dp[i-1], dp[i-2] + nums[i]).

## Nộp bài ở đâu?

Trong companion lab repo:

```text
algo/day-22/solution.ts
algo/day-22/solution.test.ts
```

Chạy: `npm run algo:test:day -- 22` (trong lab repo)

Xem flow tổng: [algorithms-track.md](../../algorithms-track.md) · [lab-repo.md](../../lab-repo.md)
