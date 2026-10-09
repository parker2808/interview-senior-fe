# Day 3 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** How do you make a form usable with keyboard and a screen reader? When do you validate — on blur, on submit, or live? Semantic HTML vs ARIA: which do you reach for first?
- **VI:** Làm form dùng được với keyboard và screen reader thế nào? Validate khi nào — blur, submit, hay live? Semantic HTML hay ARIA: cái nào dùng trước?

## What you will produce / Bạn sẽ produce gì

- **EN:** Choose one form flow and document: field, validation rule, error message, trigger timing, and disabled state.
  - **VI:** Chọn một flow form và ghi lại: field, rule validate, error message, thời điểm kích hoạt và disabled state.
- **EN:** Check whether keyboard-only and screen-reader users can understand the same flow.
  - **VI:** Kiểm tra xem người dùng chỉ dùng keyboard hoặc screen reader có hiểu được flow tương tự không.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: Every field gets a visible label, one error rule, and an intentional trigger. Prefer native semantics; add ARIA only for what HTML cannot express.
  - VI: Mỗi field có label nhìn thấy, một rule lỗi, và thời điểm kích hoạt có chủ đích. Ưu tiên semantic native; ARIA chỉ khi HTML không diễn tả được.
- **Constraint / Ràng buộc:**
  - EN: One real form (login, filter, or edit). Document it; do not rebuild a form library.
  - VI: Một form thật (login, filter, hoặc edit). Ghi lại; không dựng form library.
- **Failure mode:**
  - EN: Placeholder-as-label. Validate-on-keystroke that fights IME. Disabled submit with no reason. Errors announced only by color.
  - VI: Placeholder đóng vai label. Validate từng phím đánh IME. Submit disabled mà không nói lý do. Error chỉ báo bằng màu.
- **Measure / Cách đo:**
  - EN: You can speak the field → rule → message → timing → disabled story in under 2 minutes, including how a screen reader hears the error.
  - VI: Nói được field → rule → message → timing → disabled dưới 2 phút, kể cả screen reader nghe error ra sao.
- **Tradeoff / Trade-off:**
  - EN: Validate on blur (faster feedback, more noise) vs on submit (calmer, later recovery). Mixed timing is fine if you can defend it per field.
  - VI: Validate lúc blur (feedback nhanh, ồn hơn) hay lúc submit (êm, muộn hơn). Mixed cũng được nếu biện hộ được theo từng field.
- **Production gotcha / Gotcha production:**
  - EN: `aria-live` on every keystroke is a production gotcha. So is a disabled button that never explains why the form is incomplete.
  - VI: `aria-live` mỗi phím là gotcha production. Nút disabled không giải thích form thiếu gì cũng vậy.

## Done when / Tiêu chí xong

- Mỗi field đều có label và rule lỗi rõ ràng.
  - EN: Each field has a clear label and error rule.
- Thời điểm validate là có chủ đích, không phải ngẫu nhiên.
  - EN: Validation timing is intentional, not accidental.
- Bài algo xong và giải thích được vì sao Set là đủ.
  - EN: Algo is done and you can explain why Set is enough here.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Add the focus order and where focus lands after a failed submit.
- **VI:** Thêm thứ tự focus và focus đáp xuống đâu sau submit lỗi.

## Algorithm / Thuật toán

- **Problem / Bài:** Contains Duplicate · Set / Contains Duplicate · Set
- **Constraints / Ràng buộc:**
  - EN:
- 1 ≤ nums.length ≤ 10^5
  - VI:
- 1 ≤ nums.length ≤ 10^5
- **Hint:** Set: if add() already had the value, it is a duplicate. Set is enough here.
  - VI: Set: nếu add mà đã có → duplicate. Set là đủ ở đây.

```text
algorithms/day-03/solution.ts
algorithms/day-03/solution.test.ts
```

Run: `pnpm test:algo -- day-03`

Open the full prompt: [day-03.md](../artifacts/algo/problems/day-03.md)

## Suggested commit

```text
day-03: document one form field rules timing and a11y feedback
```
