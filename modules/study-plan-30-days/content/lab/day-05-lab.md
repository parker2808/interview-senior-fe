# Day 5 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** Can you finish this admin flow with only a keyboard? Where does focus go after a modal closes? When is lazy-loading a keyboard trap?
- **VI:** Hoàn thành flow admin này chỉ bằng keyboard được không? Focus đi đâu sau khi đóng modal? Khi nào lazy-load thành bẫy keyboard?

## What you will produce / Bạn sẽ produce gì

- **EN:** Run a keyboard-only pass on one real flow: Tab, Shift+Tab, Enter, Escape, and focus return.
  - **VI:** Chạy một lượt keyboard-only trên một flow thật: Tab, Shift+Tab, Enter, Escape và focus return.
- **EN:** Write down the top 3 keyboard or focus issues you would fix first.
  - **VI:** Ghi lại 3 lỗi keyboard hoặc focus nên sửa trước.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: Treat keyboard order as a product path. Document Tab order, Escape, and focus return for one real flow, then rank 3 fixes.
  - VI: Coi thứ tự keyboard là một product path. Ghi Tab order, Escape và focus return cho một flow thật, rồi xếp 3 fix.
- **Constraint / Ràng buộc:**
  - EN: One flow you already know. Keyboard pass + note. Do not implement a focus-trap library today.
  - VI: Một flow bạn đã biết. Keyboard pass + note. Hôm nay không implement focus-trap library.
- **Failure mode:**
  - EN: Focus lost after dialog close. Tab order that skips the primary action. Custom dropdowns that ignore Arrow keys and Escape.
  - VI: Mất focus sau khi đóng dialog. Tab order bỏ primary action. Dropdown custom bỏ qua Arrow và Escape.
- **Measure / Cách đo:**
  - EN: A written keyboard order and at least one focus bug with a concrete fix. You can demo the path out loud.
  - VI: Thứ tự keyboard đã viết và ít nhất một bug focus kèm hướng sửa. Demo path thành tiếng được.
- **Tradeoff / Trade-off:**
  - EN: Native dialog/select vs custom widgets. Native wins keyboard for free; custom wins visual control and costs a focus trap.
  - VI: Dialog/select native hay widget custom. Native được keyboard miễn phí; custom được visual và phải trả focus trap.
- **Production gotcha / Gotcha production:**
  - EN: Lazy-loaded chunks that remount and reset focus. Portals that append to `body` and dump the user at the document end.
  - VI: Chunk lazy-load remount rồi reset focus. Portal append vào `body` rồi đẩy user xuống cuối document.

## Done when / Tiêu chí xong

- Đã ghi được thứ tự keyboard cho 1 flow thật.
  - EN: Keyboard order is documented for one real flow.
- Đã chỉ ra ít nhất 1 bug focus kèm hướng sửa cụ thể.
  - EN: At least 1 focus bug is identified with a concrete fix.
- Bài algo xanh và trade-off độ phức tạp đã rõ.
  - EN: Algo is green and the complexity trade-off is clear.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Note the skip-link / landmark story: can a keyboard user jump to the table without tabbing the whole nav?
- **VI:** Ghi skip-link / landmark: user keyboard nhảy tới table mà không tab hết nav được không?

## Algorithm / Thuật toán

- **Problem / Bài:** Top K Frequent Elements · Hash map + bucket / Top K Frequent Elements · HashMap + bucket
- **Constraints / Ràng buộc:**
  - EN:
- 1 ≤ nums.length ≤ 10^5
  - VI:
- 1 ≤ nums.length ≤ 10^5
- **Hint:** Count frequency, then sort entries or bucket-sort by freq.
  - VI: Đếm frequency → sort entries hoặc bucket sort theo freq.

```text
algorithms/day-05/solution.ts
algorithms/day-05/solution.test.ts
```

Run: `pnpm test:algo -- day-05`

Open the full prompt: [day-05.md](../artifacts/algo/problems/day-05.md)

## Suggested commit

```text
day-05: keyboard-only pass and top three focus fixes
```
