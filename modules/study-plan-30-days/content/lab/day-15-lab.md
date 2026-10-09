# Day 15 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** You are a Vue specialist learning React. How does re-render differ from Vue reactivity? Map props, state, and lifecycle to hooks without apologizing.
- **VI:** Bạn là Vue specialist đang học React. Re-render khác reactivity Vue thế nào? Map props, state và lifecycle sang hooks mà không xin lỗi.

## What you will produce / Bạn sẽ produce gì

- **EN:** Write a Vue → React comparison note for state, derived state, side effects, and composition.
  - **VI:** Viết một note so sánh Vue → React cho state, derived state, side effects và composition.
- **EN:** Explain where React feels more manual than Vue and where that manual control is useful.
  - **VI:** Giải thích React “thủ công” hơn Vue ở đâu và khi nào sự thủ công đó lại có ích.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: Transfer concepts, do not translate APIs line by line. State / derived / effects / composition on one page. Honesty about the gap is the senior move.
  - VI: Chuyển nguyên lý, đừng dịch API từng dòng. State / derived / effects / composition trên một trang. Thành thật về khoảng trống mới là senior.
- **Constraint / Ràng buộc:**
  - EN: Comparison note. No Next customers route, no ‘start the React app’ install steps.
  - VI: Note so sánh. Không route customers Next, không bước cài ‘start the React app’.
- **Failure mode:**
  - EN: ‘React is just Vue with different names.’ Sounding apologetic. Claiming production React depth you do not have.
  - VI: ‘React chỉ là Vue đổi tên.’ Giọng xin lỗi. Nhận production depth React mà chưa có.
- **Measure / Cách đo:**
  - EN: The React story sounds honest and confident. You can compare one real concept across Vue and React in under 2 minutes.
  - VI: Story React nghe trung thực và tự tin. So sánh được một khái niệm thật giữa Vue và React dưới 2 phút.
- **Tradeoff / Trade-off:**
  - EN: Vue tracks mutations; React re-renders a subtree and you opt out. Manual control is useful for explicit data flow and painful for derived state you forget to update.
  - VI: Vue track mutation; React re-render một subtree và bạn phải opt out. Kiểm soát thủ công hữu ích cho data flow rõ và đau khi quên update derived state.
- **Production gotcha / Gotcha production:**
  - EN: Putting a `ref` in `useState` and wondering why the screen does not update. Treating `useMemo` as Vue `computed`.
  - VI: Nhét `ref` vào `useState` rồi hỏi sao màn không update. Coi `useMemo` như `computed` của Vue.

## Done when / Tiêu chí xong

- Story về React nghe trung thực và tự tin, không mang giọng xin lỗi.
  - EN: Your React story sounds honest and confident, not apologetic.
- So sánh được một khái niệm thật giữa Vue và React.
  - EN: You can compare one real concept across Vue and React.
- Bài algo xong và cách dùng queue cho BFS đã chắc hơn.
  - EN: Algo is done and BFS queue usage is solid.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Add the one sentence you will use if they ask ‘are you ready to write React in week one?’
- **VI:** Thêm một câu bạn sẽ dùng nếu họ hỏi ‘tuần đầu viết React được chưa?’

## Algorithm / Thuật toán

- **Problem / Bài:** Binary Tree Level Order Traversal · BFS / Binary Tree Level Order Traversal · BFS
- **Constraints / Ràng buộc:**
  - EN:
- 0 ≤ nodes ≤ 2000
  - VI:
- 0 ≤ nodes ≤ 2000
- **Hint:** Queue: each loop take size = queue.length = nodes on this level.
  - VI: Queue: mỗi vòng lấy size = queue.length = số node level hiện tại.

```text
algorithms/day-15/solution.ts
algorithms/day-15/solution.test.ts
```

Run: `pnpm test:algo -- day-15`

Open the full prompt: [day-15.md](../artifacts/algo/problems/day-15.md)

## Suggested commit

```text
day-15: Vue-to-React comparison note for state effects composition
```
