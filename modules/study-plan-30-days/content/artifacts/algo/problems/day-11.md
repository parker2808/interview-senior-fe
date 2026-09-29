# Day 11 — Algo: Min Stack

| | |
|---|---|
| Difficulty | Medium |
| Pattern | Stack design |
| LeetCode | 155 |
| Target complexity | O(1) mỗi ops |

## Đề bài

Thiết kế stack hỗ trợ push, pop, top, và `getMin` — **tất cả O(1) amortized**.

## Function signature

```ts
class MinStack { push(x:number):void; pop():void; top():number; getMin():number }
```

## Ví dụ

**Example 1**
- Input: `push(1), push(2), getMin(), pop(), getMin()`
- Output: `1, then 1 (sau pop vẫn 1 nếu còn)`

## Constraints

- Mọi thao tác O(1)

## Hint (chỉ mở khi kẹt >12′)

Stack phụ lưu min hiện tại, hoặc lưu cặp (value, minSoFar).

## Nộp bài ở đâu?

Trong companion lab repo:

```text
algo/day-11/solution.ts
algo/day-11/solution.test.ts
```

Chạy: `npm run algo:test:day -- 11` (trong lab repo)

Xem flow tổng: [algorithms-track.md](../../algorithms-track.md) · [lab-repo.md](../../lab-repo.md)
