# Day 14 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

Kể một story performance từ production. Pattern Vue nào thật sự nhúc nhích metric? Core Web Vital nào map với symptom user báo?

## Bạn sẽ produce gì

- Lấy một production issue bạn từng gặp và kể lại theo symptom → measurement → root cause → fix → regression guard.
- Viết lại metric hoặc tín hiệu nào bạn sẽ nhìn đầu tiên nếu gặp lại lần sau.

## Senior làm thế nào

- **Quyết định:** Một incident thật, kể lại theo 5 bước. Chọn tín hiệu bạn sẽ mở trước lần sau (LCP, INP, CLS, TTFB, flamegraph Vue, network waterfall).
- **Constraint:** Một câu chuyện nói, không phải refactor perf. Tuần 2 kết bằng interview drill, không phải chuỗi dựng Vue.
- **Failure mode:** ‘Thêm keep-alive là nhanh hơn’ mà không có số. Đổ Vue trong khi waterfall là 12 API nối tiếp. Không có regression guard.
- **Cách đo:** Story đã interview-ready: metric gắn symptom user-facing, một fix, và một guard (test, budget, hoặc dashboard).
- **Trade-off:** Đo trước hay ship một fix nghe hợp lý. Senior đo; mid memo hết. Nói thứ bạn sẽ không tối ưu.
- **Gotcha production:** Số Devtools nói dối trên CPU throttle. `v-once` thắng mà làm mất freshness. Web Vitals đẹp vì spinner nhanh còn table thì không.

## Tiêu chí xong

- Một câu chuyện performance đã ở trạng thái interview-ready.
- Nối được một metric với triệu chứng user-facing.
- Đã xong phần algo review tính giờ.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Thêm câu bạn sẽ nói nếu chưa từng own dashboard perf: bạn điều tra thế nào.

## Thuật toán

- **Bài:** Review tính giờ của tuần 2
- **Ràng buộc:**
- Self-score: pass / partial / fail
- **Hint:** Viết skeleton trước.

```text
algorithms/day-14/solution.ts
algorithms/day-14/solution.test.ts
```

Chạy: `pnpm test:algo -- day-14`

Mở đề đầy đủ: [day-14.md](../artifacts/algo/problems/day-14.md)

## Commit gợi ý

```text
day-14: performance story in symptom-measure-cause-fix-guard form
```
