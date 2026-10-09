# Day 7 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** If you had two days on this screen, what would you ship now vs later? Tell one technical trade-off with product impact, not taste.
- **VI:** Nếu có hai ngày trên màn này, cái gì ship ngay, cái gì để sau? Kể một technical trade-off có product impact, không phải gu.

## What you will produce / Bạn sẽ produce gì

- **EN:** Pick one screen from days 1-6 and produce a single-page redesign note: structure, state coverage, accessibility, and responsive behavior.
  - **VI:** Chọn một màn từ ngày 1-6 và viết một note redesign 1 trang: cấu trúc, state coverage, accessibility và responsive behavior.
- **EN:** End by saying what you would ship now vs later if time is tight.
  - **VI:** Kết thúc bằng việc nói rõ cái gì ship ngay và cái gì để sau nếu thời gian gấp.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: One page, one screen, ranked changes. Redesign is a priority list, not a wishlist or a new Vue app.
  - VI: Một trang, một màn, thay đổi đã xếp hạng. Redesign là list ưu tiên, không phải wishlist hay app Vue mới.
- **Constraint / Ràng buộc:**
  - EN: Single-page note. Reuse days 1–6. No Capstone build, no customer-module scaffold.
  - VI: Note một trang. Tái sử dụng ngày 1–6. Không dựng Capstone, không scaffold module khách hàng.
- **Failure mode:**
  - EN: A moodboard. ‘Make it modern.’ Shipping visual polish before state coverage or keyboard fixes.
  - VI: Moodboard. ‘Làm hiện đại hơn.’ Ship polish visual trước state coverage hoặc fix keyboard.
- **Measure / Cách đo:**
  - EN: You can speak one trade-off in under 2 minutes: decision, constraint, failure mode, how you would measure it.
  - VI: Nói được một trade-off dưới 2 phút: quyết định, constraint, failure mode, cách đo.
- **Tradeoff / Trade-off:**
  - EN: Ship state + keyboard fixes now; visual token cleanup later. Or the reverse if the interview company is a design-system team — say so.
  - VI: Ship state + keyboard ngay; dọn token sau. Hoặc ngược lại nếu công ty là team design system — nói thẳng.
- **Production gotcha / Gotcha production:**
  - EN: Mini redesigns die in review when they ignore the permission model or the real API shape. Keep one production constraint visible on the page.
  - VI: Mini redesign chết trong review khi bỏ qua permission hoặc shape API thật. Để một constraint production ngay trên trang.

## Done when / Tiêu chí xong

- Note redesign thể hiện thứ tự ưu tiên, không chỉ là wishlist.
  - EN: Your redesign note shows priorities, not just a wishlist.
- Giải thích được ít nhất 1 trade-off trong dưới 2 phút.
  - EN: You can explain one trade-off out loud in under 2 minutes.
- Đã xong phần algo review tính giờ.
  - EN: Timed algo review is complete.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Record yourself explaining the now-vs-later cut in 90 seconds.
- **VI:** Tự ghi âm cắt now-vs-later trong 90 giây.

## Algorithm / Thuật toán

- **Problem / Bài:** Week 1 timed review / Review tính giờ của tuần 1
- **Constraints / Ràng buộc:**
  - EN:
- Self-score: pass / partial / fail
  - VI:
- Tự chấm: pass / partial / fail
- **Hint:** Name the pattern out loud before you type.
  - VI: Nhẩm pattern trước khi code.

```text
algorithms/day-07/solution.ts
algorithms/day-07/solution.test.ts
```

Run: `pnpm test:algo -- day-07`

Open the full prompt: [day-07.md](../artifacts/algo/problems/day-07.md)

## Suggested commit

```text
day-07: one-page redesign note with now-vs-later cut
```
