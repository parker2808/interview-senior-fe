# Day 2 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

Dashboard gọi 15 API. User thấy gì trước, phần nào được tới muộn, phần nào fail độc lập? Làm sao hierarchy rõ trong 10 giây?

## Bạn sẽ produce gì

- Lấy một màn hình từ kinh nghiệm của Parker và vẽ lại loading, empty, error và permission-denied state.
- Viết lại heading, primary action và helper copy sao cho nhìn dưới 10 giây là hiểu thứ tự ưu tiên.

## Senior làm thế nào

- **Quyết định:** Phủ 4 state trước khi polish happy path. Viết lại heading / primary action / helper để người lạ biết phải làm gì.
- **Constraint:** Chỉ note hoặc wire sketch. Không dựng lại màn. Một flow thật từ hệ thống bạn đã ship.
- **Failure mode:** Spinner chặn cả trang trong khi 14/15 widget vẫn render được. Empty state không có next action. Error chỉ nói ‘Something went wrong’.
- **Cách đo:** Chỉ vào từng state và nói user impact trong một câu. Thời gian hiểu hierarchy mới dưới 10 giây.
- **Trade-off:** Widget hiện dần hay một skeleton đồng bộ. Progressive tới first paint nhanh hơn; skeleton đầy đủ dễ chịu hơn nhưng giấu data hữu ích.
- **Gotcha production:** Permission-denied không phải error. Nhét 403 vào toast lỗi generic khiến user retry một request họ không bao giờ được phép.

## Tiêu chí xong

- Màn hình đã có đủ state rõ ràng, không chỉ happy path.
- Giải thích được ít nhất 1 UX trade-off bằng product impact chứ không chỉ là gu.
- Bài algo chạy đúng với reasoning O(n).
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Thêm một rule một dòng: khi nào lazy-load widget giúp, khi nào chỉ làm chậm empty state.

## Thuật toán

- **Bài:** Valid Anagram · Frequency map
- **Ràng buộc:**
- 1 ≤ s.length, t.length ≤ 5·10^4
- **Hint:** Đếm tần suất 26 chữ cái (mảng 26) hoặc Map. O(n).

```text
algorithms/day-02/solution.ts
algorithms/day-02/solution.test.ts
```

Chạy: `pnpm test:algo -- day-02`

Mở đề đầy đủ: [day-02.md](../artifacts/algo/problems/day-02.md)

## Commit gợi ý

```text
day-02: redraw loading empty error and permission-denied states
```
