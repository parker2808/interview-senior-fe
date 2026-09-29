# Day 3 — Algo: Contains Duplicate

| | |
|---|---|
| Difficulty | Easy |
| Pattern | Set |
| LeetCode | 217 |
| Target complexity | O(n) time, O(n) space |

## Đề bài

Cho mảng số nguyên `nums`, trả về `true` nếu có bất kỳ giá trị nào xuất hiện **ít nhất hai lần**.

## Function signature

```ts
function containsDuplicate(nums: number[]): boolean
```

## Ví dụ

**Example 1**
- Input: `nums = [1,2,3,1]`
- Output: `true`

**Example 2**
- Input: `nums = [1,2,3,4]`
- Output: `false`

## Constraints

- 1 ≤ nums.length ≤ 10^5
- -10^9 ≤ nums[i] ≤ 10^9

## Hint (chỉ mở khi kẹt >12′)

Set: nếu add mà đã có → duplicate.

## Nộp bài ở đâu?

Trong companion lab repo:

```text
algo/day-03/solution.ts
algo/day-03/solution.test.ts
```

Chạy: `npm run algo:test:day -- 3` (trong lab repo)

Xem flow tổng: [algorithms-track.md](../../algorithms-track.md) · [lab-repo.md](../../lab-repo.md)
