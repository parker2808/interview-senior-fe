# Algorithms track — Senior FE (30 ngày)

**Mục tiêu:** Đủ tự tin coding round FE (Easy→Medium), giải thích trade-off Big-O, viết TypeScript sạch.  
**Không phải:** Competitive programming / Hard DP sâu.

## Cách làm mỗi ngày (15–25′)

1. Đọc đề **1 lần**, tự nói lại constraint (1′)
2. Viết **brute force** bằng lời (1′)
3. Chọn pattern + Big-O mục tiêu (1′)
4. Code TypeScript (8–15′)
5. Test 2–3 case + edge (null, empty, 1 phần tử, duplicate)
6. Ghi 3 dòng vào worksheet: pattern · độ phức tạp · lỗi hay gặp

## Pattern map (học theo tuần)

| Tuần | Pattern | Bài đại diện |
|---|---|---|
| 1 | HashMap / Set / Frequency | Two Sum, Anagram, Contains Duplicate, Group Anagrams |
| 2 | Two pointers · Sliding window · Stack · Binary search | Valid Parentheses, Max subarray window, Binary search |
| 3 | Linked list · Tree BFS/DFS · Graph BFS | Reverse list, Level order, Number of islands |
| 4 | DP lite · Mock set | Climbing stairs, Coin change (unbounded), 2 bài timed |

## Quy ước nộp

- Code để trong `artifacts/algo/day-NN.ts` **hoặc** dán vào worksheet section **Algo drill**
- Ưu tiên **tự code** trước khi xem lời giải
- Nếu kẹt >12′: xem hint pattern, **không** copy full solution

## Cheat sheet Big-O (nhớ)

| Cấu trúc / thao tác | Average |
|---|---|
| Object/Map get/set | O(1) |
| Array push/pop | O(1) |
| Array shift/unshift / splice giữa | O(n) |
| Sort | O(n log n) |
| Nested loop 2 chiều | O(n²) |
| Tree traverse | O(n) |
| Binary search (sorted) | O(log n) |
