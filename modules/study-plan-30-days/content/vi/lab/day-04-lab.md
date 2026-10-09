# Day 4 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

Render table 50.000 dòng thế nào? Flexbox hay Grid cho layout này? Trên mobile cái gì phải thấy, cái gì vào overflow?

## Bạn sẽ produce gì

- Với một màn bảng dữ liệu, so sánh scroll ngang, ẩn bớt cột và card-on-mobile. Chọn một mặc định và giải thích vì sao.
- Liệt kê action nào bắt buộc phải thấy trên mobile và action nào có thể đưa vào overflow menu.

## Senior làm thế nào

- **Quyết định:** Chọn một mặc định mobile cho một bảng thật và biện hộ. Tách ‘trông thế nào trên phone’ khỏi ‘50k dòng vẫn nhanh’.
- **Constraint:** Note quyết định, không dựng lại table. Hôm nay không viết code virtualization trừ khi sketch 5 dòng giúp câu nói.
- **Failure mode:** Card-on-mobile cắt mất cột ops hay sort. Scroll ngang giấu primary action. Render 50k dòng DOM.
- **Cách đo:** Một chiến lược đã chọn, trade-off đã viết, và list action bắt buộc trên mobile. Nói được vì sao hai chiến lược kia thua.
- **Trade-off:** Scroll ngang giữ nghĩa cột (khó trên ngón cái). Card dễ đọc (mất mật độ và so hàng). Ẩn cột giữ metaphor bảng nếu chọn đúng cột.
- **Gotcha production:** Virtualize quá sớm thì filter/sort/selection mới là bug. Trên mobile, overflow chứa đúng action destructive thì fail kích thước target WCAG.

## Tiêu chí xong

- Đã có 1 chiến lược mobile được chọn kèm trade-off rõ ràng.
- Action quan trọng vẫn tới được trên màn hình nhỏ.
- Bài algo chạy đúng và nhớ được pattern gom nhóm.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Nói xem table này có nên tồn tại trên phone không, hay product nên đưa task khác trên màn nhỏ.

## Thuật toán

- **Bài:** Group Anagrams · HashMap + sorted key
- **Ràng buộc:**
- 1 ≤ strs.length ≤ 10^4
- 0 ≤ strs[i].length ≤ 100
- **Hint:** Key = sort ký tự (‘eat’→‘aet’) hoặc count signature ‘a1e1t1’.

```text
algorithms/day-04/solution.ts
algorithms/day-04/solution.test.ts
```

Chạy: `pnpm test:algo -- day-04`

Mở đề đầy đủ: [day-04.md](../artifacts/algo/problems/day-04.md)

## Commit gợi ý

```text
day-04: choose one mobile strategy for a data-heavy table
```
