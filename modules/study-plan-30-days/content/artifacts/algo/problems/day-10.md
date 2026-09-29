# Day 10 — Algo: Longest Substring Without Repeating Characters

| | |
|---|---|
| Difficulty | Medium |
| Pattern | Sliding window |
| LeetCode | 3 |
| Target complexity | O(n) time |

## Đề bài

Cho chuỗi `s`, tìm độ dài substring dài nhất **không chứa ký tự lặp**.

## Function signature

```ts
function lengthOfLongestSubstring(s: string): number
```

## Ví dụ

**Example 1**
- Input: `s = "abcabcbb"`
- Output: `3`
- Giải thích: "abc"

**Example 2**
- Input: `s = "bbbbb"`
- Output: `1`

**Example 3**
- Input: `s = "pwwkew"`
- Output: `3`
- Giải thích: "wke"

## Constraints

- 0 ≤ s.length ≤ 5·10^4

## Hint (chỉ mở khi kẹt >12′)

Window [l,r] + Set/Map last index; khi trùng thì co l.

## Nộp bài ở đâu?

Trong companion lab repo:

```text
algo/day-10/solution.ts
algo/day-10/solution.test.ts
```

Chạy: `npm run algo:test:day -- 10` (trong lab repo)

Xem flow tổng: [algorithms-track.md](../../algorithms-track.md) · [lab-repo.md](../../lab-repo.md)
