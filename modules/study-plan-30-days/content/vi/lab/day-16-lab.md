# Day 16 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

`useState` hay `useRef`? Controlled hay uncontrolled — khi nào chọn cái nào? Khi nào Context thành vấn đề?

## Bạn sẽ produce gì

- Dựng hoặc review một form nhỏ rồi chỉ ra phần nào nên là state, ref, derived value và lifted state.
- Viết một rule of thumb cho thời điểm nên dừng Context và chuyển sang tool khác.

## Senior làm thế nào

- **Quyết định:** Gắn nhãn từng value: state (kéo render), ref (imperative / không cần render), derived (tính, đừng lưu), lifted (anh em dùng chung).
- **Constraint:** Snippet form nhỏ hoặc review form đã có. Không viết lại TextField của design system.
- **Failure mode:** Lưu derived vào state rồi để chúng lệch. Input uncontrolled cộng prop `value`. Context cho mọi keystroke trong cây lớn.
- **Cách đo:** Giải thích state vs ref bằng case cụ thể, và form thể hiện reasoning controlled input chứ không phải nhớ API.
- **Trade-off:** Form controlled dễ test và ràng buộc; chúng re-render mỗi phím. Uncontrolled + ref ổn cho ‘submit file rồi thôi’.
- **Gotcha production:** Lift state quá cao làm re-render cả dashboard. Context không tách (state vs dispatch) thành story perf bạn không định kể.

## Tiêu chí xong

- Giải thích được state và ref bằng một case cụ thể.
- Ví dụ form thể hiện được reasoning về controlled input, không chỉ là nhớ API.
- Bài algo xong và recursion kiểu DFS vẫn còn thoải mái.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Viết rule: rời Context khi update dày, consumer rộng, hoặc value là server cache.

## Thuật toán

- **Bài:** Maximum Depth of Binary Tree · DFS
- **Ràng buộc:**
- 0 ≤ nodes ≤ 10^4
- **Hint:** 1 + max(left, right); null → 0.

```text
algorithms/day-16/solution.ts
algorithms/day-16/solution.test.ts
```

Chạy: `pnpm test:algo -- day-16`

Mở đề đầy đủ: [day-16.md](../artifacts/algo/problems/day-16.md)

## Commit gợi ý

```text
day-16: label form values as state ref derived or lifted
```
