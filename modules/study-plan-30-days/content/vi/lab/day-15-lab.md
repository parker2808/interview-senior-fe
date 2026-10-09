# Day 15 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

Bạn là Vue specialist đang học React. Re-render khác reactivity Vue thế nào? Map props, state và lifecycle sang hooks mà không xin lỗi.

## Bạn sẽ produce gì

- Viết một note so sánh Vue → React cho state, derived state, side effects và composition.
- Giải thích React “thủ công” hơn Vue ở đâu và khi nào sự thủ công đó lại có ích.

## Senior làm thế nào

- **Quyết định:** Chuyển nguyên lý, đừng dịch API từng dòng. State / derived / effects / composition trên một trang. Thành thật về khoảng trống mới là senior.
- **Constraint:** Note so sánh. Không route customers Next, không bước cài ‘start the React app’.
- **Failure mode:** ‘React chỉ là Vue đổi tên.’ Giọng xin lỗi. Nhận production depth React mà chưa có.
- **Cách đo:** Story React nghe trung thực và tự tin. So sánh được một khái niệm thật giữa Vue và React dưới 2 phút.
- **Trade-off:** Vue track mutation; React re-render một subtree và bạn phải opt out. Kiểm soát thủ công hữu ích cho data flow rõ và đau khi quên update derived state.
- **Gotcha production:** Nhét `ref` vào `useState` rồi hỏi sao màn không update. Coi `useMemo` như `computed` của Vue.

## Tiêu chí xong

- Story về React nghe trung thực và tự tin, không mang giọng xin lỗi.
- So sánh được một khái niệm thật giữa Vue và React.
- Bài algo xong và cách dùng queue cho BFS đã chắc hơn.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Thêm một câu bạn sẽ dùng nếu họ hỏi ‘tuần đầu viết React được chưa?’

## Thuật toán

- **Bài:** Binary Tree Level Order Traversal · BFS
- **Ràng buộc:**
- 0 ≤ nodes ≤ 2000
- **Hint:** Queue: mỗi vòng lấy size = queue.length = số node level hiện tại.

```text
algorithms/day-15/solution.ts
algorithms/day-15/solution.test.ts
```

Chạy: `pnpm test:algo -- day-15`

Mở đề đầy đủ: [day-15.md](../artifacts/algo/problems/day-15.md)

## Commit gợi ý

```text
day-15: Vue-to-React comparison note for state effects composition
```
