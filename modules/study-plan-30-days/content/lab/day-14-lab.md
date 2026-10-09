# Day 14 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** Tell a performance story from production. Which Vue pattern actually moved the metric? Which Core Web Vital maps to the symptom users filed?
- **VI:** Kể một story performance từ production. Pattern Vue nào thật sự nhúc nhích metric? Core Web Vital nào map với symptom user báo?

## What you will produce / Bạn sẽ produce gì

- **EN:** Take one production issue you remember and retell it using symptom → measurement → root cause → fix → regression guard.
  - **VI:** Lấy một production issue bạn từng gặp và kể lại theo symptom → measurement → root cause → fix → regression guard.
- **EN:** Write down which metric or signal you would watch first next time.
  - **VI:** Viết lại metric hoặc tín hiệu nào bạn sẽ nhìn đầu tiên nếu gặp lại lần sau.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: One real incident, retold in the five-step shape. Pick the first signal you would open next time (LCP, INP, CLS, TTFB, Vue perf flamegraph, network waterfall).
  - VI: Một incident thật, kể lại theo 5 bước. Chọn tín hiệu bạn sẽ mở trước lần sau (LCP, INP, CLS, TTFB, flamegraph Vue, network waterfall).
- **Constraint / Ràng buộc:**
  - EN: A spoken story, not a perf refactor. Week 2 ends as interview drills, not a Vue build sequence.
  - VI: Một câu chuyện nói, không phải refactor perf. Tuần 2 kết bằng interview drill, không phải chuỗi dựng Vue.
- **Failure mode:**
  - EN: ‘We added keep-alive and it got faster’ with no number. Blaming Vue when the waterfall is 12 sequential APIs. No regression guard.
  - VI: ‘Thêm keep-alive là nhanh hơn’ mà không có số. Đổ Vue trong khi waterfall là 12 API nối tiếp. Không có regression guard.
- **Measure / Cách đo:**
  - EN: The story is interview-ready: a metric tied to a user-facing symptom, a fix, and a guard (test, budget, or dashboard).
  - VI: Story đã interview-ready: metric gắn symptom user-facing, một fix, và một guard (test, budget, hoặc dashboard).
- **Tradeoff / Trade-off:**
  - EN: Measure first vs ship a plausible fix. Seniors measure; mid-levels memo everything. Say what you would not optimize.
  - VI: Đo trước hay ship một fix nghe hợp lý. Senior đo; mid memo hết. Nói thứ bạn sẽ không tối ưu.
- **Production gotcha / Gotcha production:**
  - EN: Devtools numbers lie on throttled CPU. A Vue `v-once` win that broke freshness. Web Vitals that look fine because the spinner is fast and the table is not.
  - VI: Số Devtools nói dối trên CPU throttle. `v-once` thắng mà làm mất freshness. Web Vitals đẹp vì spinner nhanh còn table thì không.

## Done when / Tiêu chí xong

- Một câu chuyện performance đã ở trạng thái interview-ready.
  - EN: One performance story is now interview-ready.
- Nối được một metric với triệu chứng user-facing.
  - EN: You can connect a metric to a user-facing symptom.
- Đã xong phần algo review tính giờ.
  - EN: Timed algo review is complete.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Add the sentence you would say if you never owned the perf dashboard: how you still investigated.
- **VI:** Thêm câu bạn sẽ nói nếu chưa từng own dashboard perf: bạn điều tra thế nào.

## Algorithm / Thuật toán

- **Problem / Bài:** Week 2 timed review / Review tính giờ của tuần 2
- **Constraints / Ràng buộc:**
  - EN:
- Self-score: pass / partial / fail
  - VI:
- Self-score: pass / partial / fail
- **Hint:** Write the skeleton before details.
  - VI: Viết skeleton trước.

```text
algorithms/day-14/solution.ts
algorithms/day-14/solution.test.ts
```

Run: `pnpm test:algo -- day-14`

Open the full prompt: [day-14.md](../artifacts/algo/problems/day-14.md)

## Suggested commit

```text
day-14: performance story in symptom-measure-cause-fix-guard form
```
