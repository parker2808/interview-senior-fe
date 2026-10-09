# Day 10 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

Type một admin flow thật từ đầu tới cuối thế nào? Narrow ở đâu? Utility type nào mới chịu lực? Khi nào `unknown` hơn `any`?

## Bạn sẽ produce gì

- Model một admin flow với DTO, UI model, mutation payload và error state type.
- Ghi rõ chỗ nào cần strict và chỗ nào có thể cho phép linh hoạt hơn.

## Senior làm thế nào

- **Quyết định:** Bốn type cho một flow: DTO (wire), UI model (view), mutation payload (ghi), error union (recoverable vs fatal). Map DTO→UI trong một hàm.
- **Constraint:** Note type hoặc snippet `.ts`. Không dựng lại module Vue sẽ dùng các type đó.
- **Failure mode:** Một type `Customer` dùng cho response, hàng table và body PUT. `any` cho error. Field optional nhưng sau mapper lại required.
- **Cách đo:** Một model cụ thể cộng một guard hoặc utility type dùng có chủ đích (`Pick`, `Omit`, `Extract`, type predicate).
- **Trade-off:** DTO strict bắt lệch backend và làm chậm iteration. Type lỏng ở biên cộng UI model chặt thường là thỏa hiệp production.
- **Gotcha production:** Date string vs `Date`. ID nullable từ list endpoint. Error envelope đổi shape giữa 400 và 500. Zod/io-ts chỉ khi đã dùng — đừng bluff.

## Tiêu chí xong

- Đã có một type model cụ thể cho một flow thật.
- Ít nhất một guard hoặc utility type được dùng có chủ đích.
- Bài algo hoàn tất và pattern sliding window đã hiểu được.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Viết type guard cho error union và show chỗ narrow trong `if`.

## Thuật toán

- **Bài:** Longest Substring Without Repeating Characters
- **Ràng buộc:**
- 0 ≤ s.length ≤ 5·10^4
- **Hint:** Window [l,r] + Set/Map last index; khi trùng thì co l.

```text
algorithms/day-10/solution.ts
algorithms/day-10/solution.test.ts
```

Chạy: `pnpm test:algo -- day-10`

Mở đề đầy đủ: [day-10.md](../artifacts/algo/problems/day-10.md)

## Commit gợi ý

```text
day-10: model DTO UI mutation and error types for one flow
```
