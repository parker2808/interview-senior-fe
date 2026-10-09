# Day 9 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

Khi nào một request lỗi chặn cả UI? `Promise.all` vs `allSettled` vs `race`? Huỷ search stale thế nào? Event delegation hay 200 listener từng hàng?

## Bạn sẽ produce gì

- So sánh Promise.all, allSettled và race trên một case frontend thực tế như dashboard widget hoặc lookup song song.
- Phác thảo cách huỷ hoặc bỏ qua response stale trong một flow search.

## Senior làm thế nào

- **Quyết định:** Chọn một combinator cho từng case: all (auth + permission phải cùng thành công), allSettled (widget dashboard), race (timeout vs request). Phác AbortController cho search.
- **Constraint:** Note so sánh cộng sketch AbortController / generation-token khoảng 10 dòng. Không viết feature search khách hàng mới.
- **Failure mode:** `Promise.all` cho widget nên một 500 xoá trắng trang. Bỏ qua fetch lệch thứ tự nên query cũ đè query mới. Lấy `stopPropagation` làm công cụ thiết kế.
- **Cách đo:** Nói được khi nào một lỗi chặn UI và khi nào không, và đi capture → target → bubble bằng một ví dụ DOM.
- **Trade-off:** AbortController (huỷ thật, nhiều plumbing) hay ignore-stale theo sequence (đơn giản, vẫn tốn mạng). Typeahead nên abort.
- **Gotcha production:** Abort fetch không abort server. Delegation trên `tbody` chết khi body bảng bị thay. Listener `once` và Vue `onUnmounted` dễ quên.

## Tiêu chí xong

- Biết khi nào lỗi của một request nên chặn toàn bộ UI và khi nào thì không.
- Giải thích được event propagation và delegation bằng một ví dụ DOM.
- Bài algo xong và pattern two pointers đã rõ.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Viết một câu vì sao `race` sai cho dashboard ‘widget nào xong trước thì thắng’.

## Thuật toán

- **Bài:** Two Sum II · Two pointers
- **Ràng buộc:**
- 2 ≤ numbers.length ≤ 3·10^4
- **Hint:** Hai con trỏ đầu-cuối: tổng nhỏ → tăng left; lớn → giảm right.

```text
algorithms/day-09/solution.ts
algorithms/day-09/solution.test.ts
```

Chạy: `pnpm test:algo -- day-09`

Mở đề đầy đủ: [day-09.md](../artifacts/algo/problems/day-09.md)

## Commit gợi ý

```text
day-09: promise combinators and stale-search abort sketch
```
