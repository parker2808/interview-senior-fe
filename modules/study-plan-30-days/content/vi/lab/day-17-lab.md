# Day 17 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

`useEffect` tốt khác `useEffect` tệ thế nào? Huỷ việc stale ra sao? Vì sao Error Boundary không bắt lỗi API hay lỗi trong event handler?

## Bạn sẽ produce gì

- Review một effect và hỏi: cái gì kích hoạt nó, stale work bị huỷ thế nào và chuyện gì xảy ra khi input nhanh hoặc unmount?
- Viết một câu ngắn giải thích vì sao Error Boundary không thay thế cho xử lý lỗi API.

## Senior làm thế nào

- **Quyết định:** Với một effect: trigger, cleanup, stale, unmount. Rồi một câu: Error Boundary bắt lỗi React lúc render, không bắt `fetch` hay click handler.
- **Constraint:** Review / snippet. Hôm nay không gắn cây Error Boundary vào app product.
- **Failure mode:** Fetch trong effect không cleanup (Strict Mode fetch hai lần + setState lúc unmount). Lấy Error Boundary làm UX lỗi duy nhất.
- **Cách đo:** Một pattern `useEffect` tốt và một pattern tệ, và Error Boundary gắn với giới hạn thật chứ không phải định nghĩa mơ hồ.
- **Trade-off:** Effect là lối thoát. Ưu tiên render derived và event handler. Nếu cần effect để sync props → state, hỏi xem state đó có nên tồn tại không.
- **Gotcha production:** React 18 Strict Mode remount. AbortController trong cleanup. Error Boundary không bắt async. `getDerivedStateFromError` vs `componentDidCatch` là điểm cộng, không bắt buộc.

## Tiêu chí xong

- Nói được một pattern useEffect tốt và một pattern useEffect tệ.
- Error Boundary giờ gắn với giới hạn thật chứ không còn là định nghĩa mơ hồ.
- Bài algo xong và dùng đúng tính chất của BST.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Viết bẫy dependency array bạn sẽ nhắc (`[]` trên callback đóng over props stale).

## Thuật toán

- **Bài:** Lowest Common Ancestor of a BST
- **Ràng buộc:**
- Dùng tính chất BST, đừng duyệt hết cây nếu tránh được
- **Hint:** Nếu cả hai < root → trái; cả hai > root → phải; else root là LCA.

```text
algorithms/day-17/solution.ts
algorithms/day-17/solution.test.ts
```

Chạy: `pnpm test:algo -- day-17`

Mở đề đầy đủ: [day-17.md](../artifacts/algo/problems/day-17.md)

## Commit gợi ý

```text
day-17: review one effect cleanup and error-boundary limits
```
