# Day 1 — Algo: Two Sum

| | |
|---|---|
| Difficulty | Easy |
| Pattern | HashMap |
| LeetCode | 1 |
| Target complexity | O(n) time, O(n) space |

## Đề bài

Cho mảng số nguyên `nums` và số nguyên `target`, trả về **index** của hai phần tử cộng lại bằng `target`.

Giả sử mỗi input có **đúng một** đáp án. Không dùng cùng một phần tử hai lần. Có thể trả về theo thứ tự bất kỳ.

## Function signature

```ts
function twoSum(nums: number[], target: number): number[]
```

## Ví dụ

**Example 1**
- Input: `nums = [2,7,11,15], target = 9`
- Output: `[0,1]`
- Giải thích: 2 + 7 = 9

**Example 2**
- Input: `nums = [3,2,4], target = 6`
- Output: `[1,2]`
- Giải thích: 2 + 4 = 6

## Constraints

- 2 ≤ nums.length ≤ 10^4
- -10^9 ≤ nums[i], target ≤ 10^9
- Đúng một lời giải

## Hint (chỉ mở khi kẹt >12′)

Duyệt một lần: với mỗi x, tìm target-x đã thấy trong Map(value→index).

## Nộp bài ở đâu?

Trong companion lab repo:

```text
algo/day-01/solution.ts
algo/day-01/solution.test.ts
```

Chạy: `npm run algo:test:day -- 1` (trong lab repo)

Xem flow tổng: [algorithms-track.md](../../algorithms-track.md) · [lab-repo.md](../../lab-repo.md)
