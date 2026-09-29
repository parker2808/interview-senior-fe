# Day 2 — Algo: Valid Anagram

| | |
|---|---|
| Difficulty | Easy |
| Pattern | Frequency map |
| LeetCode | 242 |
| Target complexity | O(n) time, O(1) space (26 buckets) |

## Đề bài

Cho hai chuỗi `s` và `t`, trả về `true` nếu `t` là anagram của `s` (cùng ký tự, cùng số lần xuất hiện).

## Function signature

```ts
function isAnagram(s: string, t: string): boolean
```

## Ví dụ

**Example 1**
- Input: `s = "anagram", t = "nagaram"`
- Output: `true`

**Example 2**
- Input: `s = "rat", t = "car"`
- Output: `false`

## Constraints

- 1 ≤ s.length, t.length ≤ 5·10^4
- s, t chỉ gồm chữ thường a-z

## Hint (chỉ mở khi kẹt >12′)

Đếm tần suất 26 chữ cái (mảng 26) hoặc Map.

## Nộp bài ở đâu?

Trong companion lab repo:

```text
algo/day-02/solution.ts
algo/day-02/solution.test.ts
```

Chạy: `npm run algo:test:day -- 2` (trong lab repo)

Xem flow tổng: [algorithms-track.md](../../algorithms-track.md) · [lab-repo.md](../../lab-repo.md)
