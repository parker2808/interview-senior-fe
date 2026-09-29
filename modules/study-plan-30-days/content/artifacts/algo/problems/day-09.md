# Day 9 — Algo: Two Sum II (sorted)

| | |
|---|---|
| Difficulty | Medium |
| Pattern | Two pointers |
| LeetCode | 167 |
| Target complexity | O(n) time, O(1) space |

## Đề bài

Mảng `numbers` **đã sort tăng**. Tìm 2 index (1-indexed) sao cho tổng = `target`. Đúng một lời giải. Dùng không gian phụ constant.

## Function signature

```ts
function twoSum(numbers: number[], target: number): number[]
```

## Ví dụ

**Example 1**
- Input: `numbers = [2,7,11,15], target = 9`
- Output: `[1,2]`

## Constraints

- 2 ≤ numbers.length ≤ 3·10^4
- Đã sort non-decreasing

## Hint (chỉ mở khi kẹt >12′)

Hai con trỏ đầu-cuối: tổng nhỏ → tăng left; lớn → giảm right.

## Nộp bài ở đâu?

Trong companion lab repo:

```text
algo/day-09/solution.ts
algo/day-09/solution.test.ts
```

Chạy: `npm run algo:test:day -- 9` (trong lab repo)

Xem flow tổng: [algorithms-track.md](../../algorithms-track.md) · [lab-repo.md](../../lab-repo.md)
