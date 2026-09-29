# Day 13 — Algo: Linked List Cycle

| | |
|---|---|
| Difficulty | Easy |
| Pattern | Floyd two pointers |
| LeetCode | 141 |
| Target complexity | O(n) time, O(1) space |

## Đề bài

Cho head linked list, trả về `true` nếu có cycle.

## Function signature

```ts
function hasCycle(head: ListNode | null): boolean
```

## Ví dụ

**Example 1**
- Input: `3→2→0→-4→(back to 2)`
- Output: `true`

## Constraints

- Không dùng thêm O(n) Set nếu có thể (Floyd).

## Hint (chỉ mở khi kẹt >12′)

slow/fast: nếu gặp nhau → cycle.

## Nộp bài ở đâu?

Trong companion lab repo:

```text
algo/day-13/solution.ts
algo/day-13/solution.test.ts
```

Chạy: `npm run algo:test:day -- 13` (trong lab repo)

Xem flow tổng: [algorithms-track.md](../../algorithms-track.md) · [lab-repo.md](../../lab-repo.md)
