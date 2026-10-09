# Day 12 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** SSR, prerender, or client-heavy — why for this screen? `useFetch` vs `useAsyncData` vs a plain client fetch? What hydration bugs have you actually seen?
- **VI:** SSR, prerender, hay thiên client — vì sao cho màn này? `useFetch` vs `useAsyncData` vs fetch client thường? Bug hydration nào bạn đã gặp thật?

## What you will produce / Bạn sẽ produce gì

- **EN:** Take one screen and decide whether it should be SSR, prerendered, or client-heavy in Nuxt. Explain why.
  - **VI:** Chọn một màn hình và quyết định nó nên SSR, prerender hay thiên về client trong Nuxt. Giải thích vì sao.
- **EN:** Write one short answer for: “When would you use useFetch, useAsyncData, or plain client fetch?”
  - **VI:** Viết một câu trả lời ngắn cho: “Khi nào dùng useFetch, useAsyncData hoặc plain client fetch?”

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: One screen, one rendering mode, written trade-offs. Fetch choice follows the mode: `useAsyncData`/`useFetch` on the server path, client fetch for user-driven refetch.
  - VI: Một màn, một rendering mode, trade-off đã viết. Cách fetch theo mode: `useAsyncData`/`useFetch` trên đường server, fetch client cho refetch do user.
- **Constraint / Ràng buộc:**
  - EN: Decision note only. Do not change Nuxt route rules in a product app today.
  - VI: Chỉ note quyết định. Hôm nay không đổi route rules Nuxt trong app product.
- **Failure mode:**
  - EN: ‘We use SSR because Nuxt defaults to it.’ Client-only date formatting that breaks hydration. `useFetch` in an event handler.
  - VI: ‘Dùng SSR vì Nuxt mặc định vậy.’ Format date chỉ trên client phá hydration. `useFetch` trong event handler.
- **Measure / Cách đo:**
  - EN: A rendering-mode decision with trade-offs, and a fetch-choice answer that depends on context, not a preferred API.
  - VI: Một quyết định rendering mode kèm trade-off, và câu chọn fetch phụ thuộc context chứ không phải API yêu thích.
- **Tradeoff / Trade-off:**
  - EN: SSR wins first content and SEO; costs TTFB and hydration. Prerender wins marketing pages. Client-heavy wins highly personalized admin tools.
  - VI: SSR thắng first content và SEO; tốn TTFB và hydration. Prerender thắng trang marketing. Thiên client thắng tool admin cá nhân hoá.
- **Production gotcha / Gotcha production:**
  - EN: Mismatched `useFetch` keys, double fetch on client navigation, and `process.client` guards that hide the real hydration bug.
  - VI: Key `useFetch` lệch, fetch hai lần lúc client navigation, và guard `process.client` che bug hydration thật.

## Done when / Tiêu chí xong

- Đã viết ra một quyết định về rendering mode kèm trade-off.
  - EN: One rendering-mode decision is written with trade-offs.
- Giải thích được lựa chọn data fetching của Nuxt theo từng context.
  - EN: Nuxt fetching choices are explainable by context.
- Bài algo xong và thao tác pointer trên linked list đã bớt lúng túng.
  - EN: Algo is done and linked-list pointer movement is comfortable.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Add one sentence on payload extraction / `lazy` / `server: false` and when you would use each.
- **VI:** Thêm một câu về payload extraction / `lazy` / `server: false` và khi nào dùng từng cái.

## Algorithm / Thuật toán

- **Problem / Bài:** Reverse Linked List / Reverse Linked List
- **Constraints / Ràng buộc:**
  - EN:
- 0 ≤ n ≤ 5000
  - VI:
- 0 ≤ n ≤ 5000
- **Hint:** Iterative: prev=null, cur=head; next=cur.next; cur.next=prev; walk.
  - VI: Iterative: prev=null, cur=head; next=cur.next; cur.next=prev; ...

```text
algorithms/day-12/solution.ts
algorithms/day-12/solution.test.ts
```

Run: `pnpm test:algo -- day-12`

Open the full prompt: [day-12.md](../artifacts/algo/problems/day-12.md)

## Suggested commit

```text
day-12: pick a Nuxt rendering mode and fetch API for one screen
```
