# Day 4 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** How would you render a table with 50,000 rows? Flexbox or Grid for this layout? What stays visible on mobile, and what moves to overflow?
- **VI:** Render table 50.000 dòng thế nào? Flexbox hay Grid cho layout này? Trên mobile cái gì phải thấy, cái gì vào overflow?

## What you will produce / Bạn sẽ produce gì

- **EN:** For one table screen, compare horizontal scroll, condensed columns, and card-on-mobile. Pick one default and explain why.
  - **VI:** Với một màn bảng dữ liệu, so sánh scroll ngang, ẩn bớt cột và card-on-mobile. Chọn một mặc định và giải thích vì sao.
- **EN:** List the actions that must stay visible on mobile and the ones that can move into an overflow menu.
  - **VI:** Liệt kê action nào bắt buộc phải thấy trên mobile và action nào có thể đưa vào overflow menu.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: Pick one mobile default for one real table and defend it. Separate ‘how it looks on a phone’ from ‘how 50k rows stay fast’.
  - VI: Chọn một mặc định mobile cho một bảng thật và biện hộ. Tách ‘trông thế nào trên phone’ khỏi ‘50k dòng vẫn nhanh’.
- **Constraint / Ràng buộc:**
  - EN: Decision note, not a rebuilt table. Do not introduce virtualization code today unless a 5-line sketch helps the spoken answer.
  - VI: Note quyết định, không dựng lại table. Hôm nay không viết code virtualization trừ khi sketch 5 dòng giúp câu nói.
- **Failure mode:**
  - EN: Card-on-mobile that drops the columns ops actually sort by. Horizontal scroll that hides the primary action. Rendering 50k DOM rows.
  - VI: Card-on-mobile cắt mất cột ops hay sort. Scroll ngang giấu primary action. Render 50k dòng DOM.
- **Measure / Cách đo:**
  - EN: One chosen strategy, written trade-offs, and a list of mobile-critical actions. You can say why the other two strategies lost.
  - VI: Một chiến lược đã chọn, trade-off đã viết, và list action bắt buộc trên mobile. Nói được vì sao hai chiến lược kia thua.
- **Tradeoff / Trade-off:**
  - EN: Horizontal scroll keeps column meaning (bad on small thumbs). Cards are readable (lose density and compare-across-rows). Condensed columns keep the table metaphor if you pick the right columns.
  - VI: Scroll ngang giữ nghĩa cột (khó trên ngón cái). Card dễ đọc (mất mật độ và so hàng). Ẩn cột giữ metaphor bảng nếu chọn đúng cột.
- **Production gotcha / Gotcha production:**
  - EN: Virtualize too early and filter/sort/selection state becomes the real bug. On mobile, overflow menus that contain the only destructive action fail WCAG target size.
  - VI: Virtualize quá sớm thì filter/sort/selection mới là bug. Trên mobile, overflow chứa đúng action destructive thì fail kích thước target WCAG.

## Done when / Tiêu chí xong

- Đã có 1 chiến lược mobile được chọn kèm trade-off rõ ràng.
  - EN: There is one chosen mobile strategy with trade-offs written down.
- Action quan trọng vẫn tới được trên màn hình nhỏ.
  - EN: Critical actions remain reachable on smaller screens.
- Bài algo chạy đúng và nhớ được pattern gom nhóm.
  - EN: Algo passes and you remember the grouping pattern.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Say whether this table should even exist on a phone, or whether the product should offer a different task on small screens.
- **VI:** Nói xem table này có nên tồn tại trên phone không, hay product nên đưa task khác trên màn nhỏ.

## Algorithm / Thuật toán

- **Problem / Bài:** Group Anagrams · Hash map + sorted key / Group Anagrams · HashMap + sorted key
- **Constraints / Ràng buộc:**
  - EN:
- 1 ≤ strs.length ≤ 10^4
- 0 ≤ strs[i].length ≤ 100
  - VI:
- 1 ≤ strs.length ≤ 10^4
- 0 ≤ strs[i].length ≤ 100
- **Hint:** Key = sorted chars (‘eat’→‘aet’) or a count signature ‘a1e1t1’.
  - VI: Key = sort ký tự (‘eat’→‘aet’) hoặc count signature ‘a1e1t1’.

```text
algorithms/day-04/solution.ts
algorithms/day-04/solution.test.ts
```

Run: `pnpm test:algo -- day-04`

Open the full prompt: [day-04.md](../artifacts/algo/problems/day-04.md)

## Suggested commit

```text
day-04: choose one mobile strategy for a data-heavy table
```
