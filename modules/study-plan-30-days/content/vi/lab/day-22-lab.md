# Day 22 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

Thiết kế dashboard gọi 15 API. Cái gì load trước, cái gì fail độc lập, và có cần BFF không? Bạn sẽ watch gì trên production?

## Bạn sẽ produce gì

- Chọn một ý tưởng admin/dashboard và vẽ ra widget, phụ thuộc API, boundary của lỗi và phần data nào có thể hiện dần.
- Kết luận xem có cần BFF thật hay chỉ cần API contract tốt hơn là đủ.

## Senior làm thế nào

- **Quyết định:** Tách kiến trúc khỏi hành vi UX. Shell + widget tối quan trọng trước; widget phụ cô lập lỗi của chúng. BFF chỉ khi aggregation, auth hoặc độ nói chuyện nhiều mới là constraint thật.
- **Constraint:** Một outline, không phải dashboard dựng sẵn. 45–60 phút. Ví dụ Vue-first cũng được.
- **Failure mode:** Sơ đồ hộp không có story lỗi. ‘Nên có BFF’ mà không có fan-out hay đau contract. Observability kiểu ‘sẽ thêm Sentry’.
- **Cách đo:** Kế hoạch tách kiến trúc với hành vi UX và có quan điểm rõ BFF vs gọi API trực tiếp.
- **Trade-off:** Gọi API trực tiếp thì ownership rõ và nhân số round-trip. BFF giấu đường nối backend và thành thêm một deploy + cache phải lý giải.
- **Gotcha production:** Một cổng loading cho 15 call. Correlation ID không bao giờ tới browser. Widget retry DDoS một endpoint đang chết.

## Tiêu chí xong

- Kế hoạch dashboard đã tách rõ kiến trúc với hành vi UX.
- Đã có quan điểm rõ về BFF so với gọi API trực tiếp.
- Bài algo xong và hiểu được ý tưởng DP cuộn.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Gọi tên ba tín hiệu frontend bạn sẽ alert (lỗi JS, tỉ lệ widget rỗng, LCP của shell).

## Thuật toán

- **Bài:** House Robber · DP 1D
- **Ràng buộc:**
- 1 ≤ nums.length ≤ 100
- **Hint:** dp[i] = max(dp[i-1], dp[i-2] + nums[i]).

```text
algorithms/day-22/solution.ts
algorithms/day-22/solution.test.ts
```

Chạy: `pnpm test:algo -- day-22`

Mở đề đầy đủ: [day-22.md](../artifacts/algo/problems/day-22.md)

## Commit gợi ý

```text
day-22: dashboard outline with failure boundaries and BFF call
```
