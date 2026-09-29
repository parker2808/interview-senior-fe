# Day 4 — Algo: Group Anagrams

| | |
|---|---|
| Difficulty | Medium |
| Pattern | HashMap + sorted key |
| LeetCode | 49 |
| Target complexity | O(n·k log k) với sort key, hoặc O(n·k) với count key |

## Đề bài

Cho mảng chuỗi `strs`, nhóm các anagram lại với nhau. Thứ tự nhóm / trong nhóm không quan trọng.

## Function signature

```ts
function groupAnagrams(strs: string[]): string[][]
```

## Ví dụ

**Example 1**
- Input: `strs = ["eat","tea","tan","ate","nat","bat"]`
- Output: `[["bat"],["nat","tan"],["ate","eat","tea"]]`

## Constraints

- 1 ≤ strs.length ≤ 10^4
- 0 ≤ strs[i].length ≤ 100
- strs[i] chữ thường

## Hint (chỉ mở khi kẹt >12′)

Key = sort ký tự ("eat"→"aet") hoặc count signature "a1e1t1".

## Nộp bài ở đâu?

Trong companion lab repo:

```text
algo/day-04/solution.ts
algo/day-04/solution.test.ts
```

Chạy: `npm run algo:test:day -- 4` (trong lab repo)

Xem flow tổng: [algorithms-track.md](../../algorithms-track.md) · [lab-repo.md](../../lab-repo.md)
