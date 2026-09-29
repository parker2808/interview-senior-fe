# Day 12 — Algo: Reverse Linked List

| | |
|---|---|
| Difficulty | Easy |
| Pattern | Linked list |
| LeetCode | 206 |
| Target complexity | O(n) time, O(1) space |

## Đề bài

Đảo ngược linked list một chiều, trả về head mới.

```ts
class ListNode { val: number; next: ListNode | null }
```

## Function signature

```ts
function reverseList(head: ListNode | null): ListNode | null
```

## Ví dụ

**Example 1**
- Input: `1→2→3→4→5`
- Output: `5→4→3→2→1`

## Constraints

- 0 ≤ n ≤ 5000

## Hint (chỉ mở khi kẹt >12′)

Iterative: prev=null, cur=head; next=cur.next; cur.next=prev; ...

## Nộp bài ở đâu?

Trong companion lab repo:

```text
algo/day-12/solution.ts
algo/day-12/solution.test.ts
```

Chạy: `npm run algo:test:day -- 12` (trong lab repo)

Xem flow tổng: [algorithms-track.md](../../algorithms-track.md) · [lab-repo.md](../../lab-repo.md)
