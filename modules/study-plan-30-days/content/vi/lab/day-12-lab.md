# Day 12 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

SSR, prerender, hay thiên client — vì sao cho màn này? `useFetch` vs `useAsyncData` vs fetch client thường? Bug hydration nào bạn đã gặp thật?

## Bạn sẽ produce gì

- Chọn một màn hình và quyết định nó nên SSR, prerender hay thiên về client trong Nuxt. Giải thích vì sao.
- Viết một câu trả lời ngắn cho: “Khi nào dùng useFetch, useAsyncData hoặc plain client fetch?”

## Senior làm thế nào

- **Quyết định:** Một màn, một rendering mode, trade-off đã viết. Cách fetch theo mode: `useAsyncData`/`useFetch` trên đường server, fetch client cho refetch do user.
- **Constraint:** Chỉ note quyết định. Hôm nay không đổi route rules Nuxt trong app product.
- **Failure mode:** ‘Dùng SSR vì Nuxt mặc định vậy.’ Format date chỉ trên client phá hydration. `useFetch` trong event handler.
- **Cách đo:** Một quyết định rendering mode kèm trade-off, và câu chọn fetch phụ thuộc context chứ không phải API yêu thích.
- **Trade-off:** SSR thắng first content và SEO; tốn TTFB và hydration. Prerender thắng trang marketing. Thiên client thắng tool admin cá nhân hoá.
- **Gotcha production:** Key `useFetch` lệch, fetch hai lần lúc client navigation, và guard `process.client` che bug hydration thật.

## Tiêu chí xong

- Đã viết ra một quyết định về rendering mode kèm trade-off.
- Giải thích được lựa chọn data fetching của Nuxt theo từng context.
- Bài algo xong và thao tác pointer trên linked list đã bớt lúng túng.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Thêm một câu về payload extraction / `lazy` / `server: false` và khi nào dùng từng cái.

## Thuật toán

- **Bài:** Reverse Linked List
- **Ràng buộc:**
- 0 ≤ n ≤ 5000
- **Hint:** Iterative: prev=null, cur=head; next=cur.next; cur.next=prev; ...

```text
algorithms/day-12/solution.ts
algorithms/day-12/solution.test.ts
```

Chạy: `pnpm test:algo -- day-12`

Mở đề đầy đủ: [day-12.md](../artifacts/algo/problems/day-12.md)

## Commit gợi ý

```text
day-12: pick a Nuxt rendering mode and fetch API for one screen
```
