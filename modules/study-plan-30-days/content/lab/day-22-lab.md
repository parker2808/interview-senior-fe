# Day 22 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** Design a dashboard that calls 15 APIs. What loads first, what fails independently, and do you need a BFF? What would you watch in production?
- **VI:** Thiết kế dashboard gọi 15 API. Cái gì load trước, cái gì fail độc lập, và có cần BFF không? Bạn sẽ watch gì trên production?

## What you will produce / Bạn sẽ produce gì

- **EN:** Take one admin/dashboard idea and outline widgets, API dependencies, failure boundaries, and which data can arrive progressively.
  - **VI:** Chọn một ý tưởng admin/dashboard và vẽ ra widget, phụ thuộc API, boundary của lỗi và phần data nào có thể hiện dần.
- **EN:** State whether a BFF is justified or whether better API contracts are enough.
  - **VI:** Kết luận xem có cần BFF thật hay chỉ cần API contract tốt hơn là đủ.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: Separate architecture from UX behavior. Shell + critical widgets first; non-critical widgets isolate their own errors. BFF only if aggregation, auth, or chattiness is the real constraint.
  - VI: Tách kiến trúc khỏi hành vi UX. Shell + widget tối quan trọng trước; widget phụ cô lập lỗi của chúng. BFF chỉ khi aggregation, auth hoặc độ nói chuyện nhiều mới là constraint thật.
- **Constraint / Ràng buộc:**
  - EN: An outline, not a built dashboard. 45–60 minutes. Vue-first examples are fine.
  - VI: Một outline, không phải dashboard dựng sẵn. 45–60 phút. Ví dụ Vue-first cũng được.
- **Failure mode:**
  - EN: A box diagram with no failure story. ‘We should have a BFF’ with no fan-out or contract pain. Observability as ‘we would add Sentry’.
  - VI: Sơ đồ hộp không có story lỗi. ‘Nên có BFF’ mà không có fan-out hay đau contract. Observability kiểu ‘sẽ thêm Sentry’.
- **Measure / Cách đo:**
  - EN: The plan separates architecture from UX behavior and has a clear BFF vs direct-API opinion.
  - VI: Kế hoạch tách kiến trúc với hành vi UX và có quan điểm rõ BFF vs gọi API trực tiếp.
- **Tradeoff / Trade-off:**
  - EN: Direct APIs keep ownership clear and multiply round-trips. A BFF hides backend seams and becomes another deploy + cache to reason about.
  - VI: Gọi API trực tiếp thì ownership rõ và nhân số round-trip. BFF giấu đường nối backend và thành thêm một deploy + cache phải lý giải.
- **Production gotcha / Gotcha production:**
  - EN: A single loading gate for 15 calls. Correlation IDs that never make it to the browser. Widget retries that DDoS a dying endpoint.
  - VI: Một cổng loading cho 15 call. Correlation ID không bao giờ tới browser. Widget retry DDoS một endpoint đang chết.

## Done when / Tiêu chí xong

- Kế hoạch dashboard đã tách rõ kiến trúc với hành vi UX.
  - EN: The dashboard plan separates architecture from UX behavior.
- Đã có quan điểm rõ về BFF so với gọi API trực tiếp.
  - EN: There is a clear opinion on BFF vs direct APIs.
- Bài algo xong và hiểu được ý tưởng DP cuộn.
  - EN: Algo is done and the rolling-DP idea is clear.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Name the three frontend signals you would alert on (JS errors, empty-widget rate, LCP of the shell).
- **VI:** Gọi tên ba tín hiệu frontend bạn sẽ alert (lỗi JS, tỉ lệ widget rỗng, LCP của shell).

## Algorithm / Thuật toán

- **Problem / Bài:** House Robber · DP 1D / House Robber · DP 1D
- **Constraints / Ràng buộc:**
  - EN:
- 1 ≤ nums.length ≤ 100
  - VI:
- 1 ≤ nums.length ≤ 100
- **Hint:** dp[i] = max(dp[i-1], dp[i-2] + nums[i]).
  - VI: dp[i] = max(dp[i-1], dp[i-2] + nums[i]).

```text
algorithms/day-22/solution.ts
algorithms/day-22/solution.test.ts
```

Run: `pnpm test:algo -- day-22`

Open the full prompt: [day-22.md](../artifacts/algo/problems/day-22.md)

## Suggested commit

```text
day-22: dashboard outline with failure boundaries and BFF call
```
