# Day 6 — Algo: Valid Parentheses

| | |
|---|---|
| Difficulty | Easy |
| Pattern | Stack |
| LeetCode | 20 |
| Target complexity | O(n) time, O(n) space |

## Đề bài

Cho chuỗi chỉ gồm `()[]{}`, trả về `true` nếu ngoặc mở/đóng hợp lệ (đúng thứ tự, đúng cặp).

## Function signature

```ts
function isValid(s: string): boolean
```

## Ví dụ

**Example 1**
- Input: `s = "()"`
- Output: `true`

**Example 2**
- Input: `s = "(]"`
- Output: `false`

**Example 3**
- Input: `s = "([])"`
- Output: `true`

## Constraints

- 1 ≤ s.length ≤ 10^4

## Hint (chỉ mở khi kẹt >12′)

Stack: gặp mở thì push; gặp đóng thì pop và khớp cặp.

## Nộp bài ở đâu?

Trong companion lab repo:

```text
algo/day-06/solution.ts
algo/day-06/solution.test.ts
```

Chạy: `npm run algo:test:day -- 6` (trong lab repo)

Xem flow tổng: [algorithms-track.md](../../algorithms-track.md) · [lab-repo.md](../../lab-repo.md)
