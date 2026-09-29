# Day 8 — Algo: Binary Search

| | |
|---|---|
| Difficulty | Easy |
| Pattern | Binary search |
| LeetCode | 704 |
| Target complexity | O(log n) time, O(1) space |

## Đề bài

Cho mảng **đã sort tăng dần** `nums` và `target`, trả về index của `target` hoặc `-1` nếu không có.

## Function signature

```ts
function search(nums: number[], target: number): number
```

## Ví dụ

**Example 1**
- Input: `nums = [-1,0,3,5,9,12], target = 9`
- Output: `4`

**Example 2**
- Input: `nums = [-1,0,3,5,9,12], target = 2`
- Output: `-1`

## Constraints

- 1 ≤ nums.length ≤ 10^4
- Mọi phần tử unique
- Phải O(log n)

## Hint (chỉ mở khi kẹt >12′)

while lo<=hi; mid; so sánh rồi hẹp nửa trái/phải.

## Nộp bài ở đâu?

Trong companion lab repo:

```text
algo/day-08/solution.ts
algo/day-08/solution.test.ts
```

Chạy: `npm run algo:test:day -- 8` (trong lab repo)

Xem flow tổng: [algorithms-track.md](../../algorithms-track.md) · [lab-repo.md](../../lab-repo.md)
