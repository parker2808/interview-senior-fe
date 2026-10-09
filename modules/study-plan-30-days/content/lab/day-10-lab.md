# Day 10 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** How do you type a real admin flow end to end? Where do you narrow? Which utility types are load-bearing? When is `unknown` better than `any`?
- **VI:** Type một admin flow thật từ đầu tới cuối thế nào? Narrow ở đâu? Utility type nào mới chịu lực? Khi nào `unknown` hơn `any`?

## What you will produce / Bạn sẽ produce gì

- **EN:** Model one admin flow with DTO, UI model, mutation payload, and error state types.
  - **VI:** Model một admin flow với DTO, UI model, mutation payload và error state type.
- **EN:** Write down where you want strictness and where flexibility is acceptable.
  - **VI:** Ghi rõ chỗ nào cần strict và chỗ nào có thể cho phép linh hoạt hơn.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: Four types for one flow: DTO (wire), UI model (view), mutation payload (write), error union (recoverable vs fatal). Map DTO→UI in one function.
  - VI: Bốn type cho một flow: DTO (wire), UI model (view), mutation payload (ghi), error union (recoverable vs fatal). Map DTO→UI trong một hàm.
- **Constraint / Ràng buộc:**
  - EN: Type-only note or a `.ts` snippet. Do not rebuild the Vue module that would consume the types.
  - VI: Note type hoặc snippet `.ts`. Không dựng lại module Vue sẽ dùng các type đó.
- **Failure mode:**
  - EN: One `Customer` type used as response, table row, and PUT body. `any` on errors. Optional fields that are actually required after the mapper.
  - VI: Một type `Customer` dùng cho response, hàng table và body PUT. `any` cho error. Field optional nhưng sau mapper lại required.
- **Measure / Cách đo:**
  - EN: One concrete model plus one guard or utility type used on purpose (`Pick`, `Omit`, `Extract`, type predicate).
  - VI: Một model cụ thể cộng một guard hoặc utility type dùng có chủ đích (`Pick`, `Omit`, `Extract`, type predicate).
- **Tradeoff / Trade-off:**
  - EN: Strict DTOs catch backend drift and slow iteration. A looser boundary type at the edge plus a strict UI model is often the production compromise.
  - VI: DTO strict bắt lệch backend và làm chậm iteration. Type lỏng ở biên cộng UI model chặt thường là thỏa hiệp production.
- **Production gotcha / Gotcha production:**
  - EN: Date strings vs `Date`. Nullable IDs from list endpoints. Error envelopes that change shape between 400 and 500. Zod/io-ts only if you have used them — do not bluff.
  - VI: Date string vs `Date`. ID nullable từ list endpoint. Error envelope đổi shape giữa 400 và 500. Zod/io-ts chỉ khi đã dùng — đừng bluff.

## Done when / Tiêu chí xong

- Đã có một type model cụ thể cho một flow thật.
  - EN: You have one concrete type model for a real flow.
- Ít nhất một guard hoặc utility type được dùng có chủ đích.
  - EN: At least one guard or utility type is used on purpose.
- Bài algo hoàn tất và pattern sliding window đã hiểu được.
  - EN: Algo is complete and the sliding-window pattern is understandable.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Write a type guard for the error union and show the narrow in an `if`.
- **VI:** Viết type guard cho error union và show chỗ narrow trong `if`.

## Algorithm / Thuật toán

- **Problem / Bài:** Longest Substring Without Repeating Characters / Longest Substring Without Repeating Characters
- **Constraints / Ràng buộc:**
  - EN:
- 0 ≤ s.length ≤ 5·10^4
  - VI:
- 0 ≤ s.length ≤ 5·10^4
- **Hint:** Window [l,r] + Set/Map of last index; on duplicate, shrink l.
  - VI: Window [l,r] + Set/Map last index; khi trùng thì co l.

```text
algorithms/day-10/solution.ts
algorithms/day-10/solution.test.ts
```

Run: `pnpm test:algo -- day-10`

Open the full prompt: [day-10.md](../artifacts/algo/problems/day-10.md)

## Suggested commit

```text
day-10: model DTO UI mutation and error types for one flow
```
