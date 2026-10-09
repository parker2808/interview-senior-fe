# Day 9 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** When does one failed request block the whole UI? `Promise.all` vs `allSettled` vs `race`? How do you cancel a stale search? Event delegation vs 200 row listeners?
- **VI:** Khi nào một request lỗi chặn cả UI? `Promise.all` vs `allSettled` vs `race`? Huỷ search stale thế nào? Event delegation hay 200 listener từng hàng?

## What you will produce / Bạn sẽ produce gì

- **EN:** Compare Promise.all vs allSettled vs race on one realistic frontend case such as dashboard widgets or parallel lookups.
  - **VI:** So sánh Promise.all, allSettled và race trên một case frontend thực tế như dashboard widget hoặc lookup song song.
- **EN:** Sketch how you would cancel or ignore stale responses in a search flow.
  - **VI:** Phác thảo cách huỷ hoặc bỏ qua response stale trong một flow search.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: Pick one combinator per case: all (auth + permissions must all succeed), allSettled (dashboard widgets), race (timeout vs request). Sketch AbortController for search.
  - VI: Chọn một combinator cho từng case: all (auth + permission phải cùng thành công), allSettled (widget dashboard), race (timeout vs request). Phác AbortController cho search.
- **Constraint / Ràng buộc:**
  - EN: A comparison note plus a 10-line AbortController / generation-token sketch. No new Vue customer search feature.
  - VI: Note so sánh cộng sketch AbortController / generation-token khoảng 10 dòng. Không viết feature search khách hàng mới.
- **Failure mode:**
  - EN: `Promise.all` on widgets so one 500 blanks the page. Ignoring out-of-order fetch so an old query overwrites a new one. `stopPropagation` as a design tool.
  - VI: `Promise.all` cho widget nên một 500 xoá trắng trang. Bỏ qua fetch lệch thứ tự nên query cũ đè query mới. Lấy `stopPropagation` làm công cụ thiết kế.
- **Measure / Cách đo:**
  - EN: You can say when one failure should block the UI and when it should not, and walk capture → target → bubble with one DOM example.
  - VI: Nói được khi nào một lỗi chặn UI và khi nào không, và đi capture → target → bubble bằng một ví dụ DOM.
- **Tradeoff / Trade-off:**
  - EN: AbortController (real cancel, more plumbing) vs ignore-stale-by-sequence (simple, still burns the network). Prefer abort for typeahead.
  - VI: AbortController (huỷ thật, nhiều plumbing) hay ignore-stale theo sequence (đơn giản, vẫn tốn mạng). Typeahead nên abort.
- **Production gotcha / Gotcha production:**
  - EN: Aborting a fetch does not abort the server. Delegation on `tbody` dies when the table body is replaced. `once` listeners and Vue `onUnmounted` are easy to forget.
  - VI: Abort fetch không abort server. Delegation trên `tbody` chết khi body bảng bị thay. Listener `once` và Vue `onUnmounted` dễ quên.

## Done when / Tiêu chí xong

- Biết khi nào lỗi của một request nên chặn toàn bộ UI và khi nào thì không.
  - EN: You know when failure of one request should block the whole UI and when it should not.
- Giải thích được event propagation và delegation bằng một ví dụ DOM.
  - EN: Event propagation and delegation are explainable with one DOM example.
- Bài algo xong và pattern two pointers đã rõ.
  - EN: Algo is done and the two-pointer pattern is clear.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Write the one-liner for why `race` is the wrong tool for ‘first widget wins’ dashboards.
- **VI:** Viết một câu vì sao `race` sai cho dashboard ‘widget nào xong trước thì thắng’.

## Algorithm / Thuật toán

- **Problem / Bài:** Two Sum II · Two pointers / Two Sum II · Two pointers
- **Constraints / Ràng buộc:**
  - EN:
- 2 ≤ numbers.length ≤ 3·10^4
  - VI:
- 2 ≤ numbers.length ≤ 3·10^4
- **Hint:** Two pointers at ends: too small → left++; too big → right--.
  - VI: Hai con trỏ đầu-cuối: tổng nhỏ → tăng left; lớn → giảm right.

```text
algorithms/day-09/solution.ts
algorithms/day-09/solution.test.ts
```

Run: `pnpm test:algo -- day-09`

Open the full prompt: [day-09.md](../artifacts/algo/problems/day-09.md)

## Suggested commit

```text
day-09: promise combinators and stale-search abort sketch
```
