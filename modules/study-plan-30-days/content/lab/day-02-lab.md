# Day 2 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** A dashboard calls 15 APIs. What does the user see first, what can arrive late, and what fails independently? How do you keep hierarchy obvious in 10 seconds?
- **VI:** Dashboard gọi 15 API. User thấy gì trước, phần nào được tới muộn, phần nào fail độc lập? Làm sao hierarchy rõ trong 10 giây?

## What you will produce / Bạn sẽ produce gì

- **EN:** Take one screen from Parker’s experience and redraw loading, empty, error, and permission-denied states.
  - **VI:** Lấy một màn hình từ kinh nghiệm của Parker và vẽ lại loading, empty, error và permission-denied state.
- **EN:** Rewrite the heading, primary action, and helper copy so the hierarchy is obvious in under 10 seconds.
  - **VI:** Viết lại heading, primary action và helper copy sao cho nhìn dưới 10 giây là hiểu thứ tự ưu tiên.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: Cover the four states before polishing the happy path. Rewrite heading / primary action / helper so a stranger knows what to do.
  - VI: Phủ 4 state trước khi polish happy path. Viết lại heading / primary action / helper để người lạ biết phải làm gì.
- **Constraint / Ràng buộc:**
  - EN: Notes or a wire sketch only. Do not rebuild the screen. One real flow from a system you shipped.
  - VI: Chỉ note hoặc wire sketch. Không dựng lại màn. Một flow thật từ hệ thống bạn đã ship.
- **Failure mode:**
  - EN: A spinner that blocks the whole page while 14 of 15 widgets could render. Empty states with no next action. Errors that only say ‘Something went wrong’.
  - VI: Spinner chặn cả trang trong khi 14/15 widget vẫn render được. Empty state không có next action. Error chỉ nói ‘Something went wrong’.
- **Measure / Cách đo:**
  - EN: You can point at each state and say the user impact in one sentence. Time-to-understand the rewritten hierarchy is under 10 seconds.
  - VI: Chỉ vào từng state và nói user impact trong một câu. Thời gian hiểu hierarchy mới dưới 10 giây.
- **Tradeoff / Trade-off:**
  - EN: Progressive widgets vs one consistent skeleton. Progressive is faster to first paint; a full skeleton is calmer but hides useful data.
  - VI: Widget hiện dần hay một skeleton đồng bộ. Progressive tới first paint nhanh hơn; skeleton đầy đủ dễ chịu hơn nhưng giấu data hữu ích.
- **Production gotcha / Gotcha production:**
  - EN: Permission-denied is not an error. Mixing 403 into the generic error toast trains users to retry a request they will never be allowed to make.
  - VI: Permission-denied không phải error. Nhét 403 vào toast lỗi generic khiến user retry một request họ không bao giờ được phép.

## Done when / Tiêu chí xong

- Màn hình đã có đủ state rõ ràng, không chỉ happy path.
  - EN: The screen has explicit state coverage, not just the happy path.
- Giải thích được ít nhất 1 UX trade-off bằng product impact chứ không chỉ là gu.
  - EN: You can explain one UX trade-off with product impact, not taste only.
- Bài algo chạy đúng với reasoning O(n).
  - EN: Algo passes with O(n) reasoning.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Add a one-line rule for when lazy-loading a widget helps vs when it just delays the empty state.
- **VI:** Thêm một rule một dòng: khi nào lazy-load widget giúp, khi nào chỉ làm chậm empty state.

## Algorithm / Thuật toán

- **Problem / Bài:** Valid Anagram · Frequency map / Valid Anagram · Frequency map
- **Constraints / Ràng buộc:**
  - EN:
- 1 ≤ s.length, t.length ≤ 5·10^4
  - VI:
- 1 ≤ s.length, t.length ≤ 5·10^4
- **Hint:** Count 26 letters (array of 26) or a Map. O(n) time.
  - VI: Đếm tần suất 26 chữ cái (mảng 26) hoặc Map. O(n).

```text
algorithms/day-02/solution.ts
algorithms/day-02/solution.test.ts
```

Run: `pnpm test:algo -- day-02`

Open the full prompt: [day-02.md](../artifacts/algo/problems/day-02.md)

## Suggested commit

```text
day-02: redraw loading empty error and permission-denied states
```
