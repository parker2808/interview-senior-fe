# Day 5 — Algo: Top K Frequent Elements

| | |
|---|---|
| Difficulty | Medium |
| Pattern | HashMap + bucket/sort |
| LeetCode | 347 |
| Target complexity | O(n log n) OK; tốt hơn O(n) với bucket |

## Đề bài

Cho mảng số nguyên `nums` và số nguyên `k`, trả về `k` phần tử xuất hiện nhiều nhất. Đáp án là duy nhất.

## Function signature

```ts
function topKFrequent(nums: number[], k: number): number[]
```

## Ví dụ

**Example 1**
- Input: `nums = [1,1,1,2,2,3], k = 2`
- Output: `[1,2]`

**Example 2**
- Input: `nums = [1], k = 1`
- Output: `[1]`

## Constraints

- 1 ≤ nums.length ≤ 10^5
- k nằm trong range số phần tử distinct

## Hint (chỉ mở khi kẹt >12′)

Đếm frequency → sort entries hoặc bucket sort theo freq.

## Nộp bài ở đâu?

Trong companion lab repo:

```text
algo/day-05/solution.ts
algo/day-05/solution.test.ts
```

Chạy: `npm run algo:test:day -- 5` (trong lab repo)

Xem flow tổng: [algorithms-track.md](../../algorithms-track.md) · [lab-repo.md](../../lab-repo.md)
