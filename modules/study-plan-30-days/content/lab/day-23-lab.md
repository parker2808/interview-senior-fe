# Day 23 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** A table with 50,000 rows — what do you do first? Is the bottleneck data volume, render cost, or bundle cost? Which optimization would you actually ship?
- **VI:** Table 50.000 dòng — bạn làm gì trước? Bottleneck là lượng data, chi phí render hay bundle? Tối ưu nào bạn sẽ ship thật?

## What you will produce / Bạn sẽ produce gì

- **EN:** Review a large-screen flow from your past work and list its 3 likely bottlenecks: data volume, render cost, or bundle cost.
  - **VI:** Review một flow màn hình lớn từ kinh nghiệm cũ và liệt kê 3 bottleneck có khả năng nhất: lượng data, chi phí render hay chi phí bundle.
- **EN:** Choose one optimization you would actually ship first and explain why it beats the alternatives.
  - **VI:** Chọn một tối ưu bạn sẽ ship trước thật sự và giải thích vì sao nó đáng hơn các lựa chọn khác.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: Prioritize bottlenecks, then ship one fix. Pagination or query limits before virtualization; route-level split before micro-optimizing computed.
  - VI: Ưu tiên bottleneck, rồi ship một fix. Pagination hoặc giới hạn query trước virtualization; tách theo route trước khi micro-optimize computed.
- **Constraint / Ràng buộc:**
  - EN: A prioritized note from a system you shipped. No new virtualized table implementation today.
  - VI: Note đã ưu tiên từ hệ thống bạn đã ship. Hôm nay không implement table ảo hoá mới.
- **Failure mode:**
  - EN: Listing ten techniques with no priority. Virtualizing before the API returns 50k. Code-splitting a 3 KB helper while the vendor chart library is 400 KB.
  - VI: Liệt kê mười kỹ thuật không ưu tiên. Ảo hoá trước khi API trả 50k. Tách một helper 3 KB trong khi thư viện chart vendor 400 KB.
- **Measure / Cách đo:**
  - EN: Bottlenecks are ranked. One optimization is tied to user impact and risk.
  - VI: Bottleneck đã được xếp hạng. Một tối ưu gắn với user impact và risk.
- **Tradeoff / Trade-off:**
  - EN: Virtualization saves DOM and breaks find-in-page, a11y, and measurement. Splitting a route saves JS and costs a loading gap. Pick with the user task in mind.
  - VI: Ảo hoá cứu DOM và phá find-in-page, a11y và đo đạc. Tách route cứu JS và tốn khoảng loading. Chọn theo task của user.
- **Production gotcha / Gotcha production:**
  - EN: INP dies on a cheap-looking table because every keyup filters 10k rows on the main thread. Bundle analyzers that ignore async chunks you always preload.
  - VI: INP chết trên table trông rẻ vì mỗi keyup lọc 10k hàng trên main thread. Bundle analyzer bỏ qua async chunk bạn luôn preload.

## Done when / Tiêu chí xong

- Các bottleneck đã được ưu tiên rõ chứ không chỉ liệt kê.
  - EN: The bottlenecks are prioritized, not just listed.
- Một lựa chọn tối ưu đã gắn với user impact và risk.
  - EN: One optimization choice is tied to user impact and risk.
- Đã xong buổi warm-up algo.
  - EN: Warm-up algo session is complete.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Name the Core Web Vital that would move if your first fix worked.
- **VI:** Gọi tên Core Web Vital sẽ nhúc nhích nếu fix đầu tiên có tác dụng.

## Algorithm / Thuật toán

- **Problem / Bài:** Warm-up easy set / Warm-up easy set
- **Constraints / Ràng buộc:**
  - EN:
- ≤10 minutes
  - VI:
- ≤10′
- **Hint:** Prefer a problem you failed before.
  - VI: Ưu tiên bài từng fail.

```text
algorithms/day-23/solution.ts
algorithms/day-23/solution.test.ts
```

Run: `pnpm test:algo -- day-23`

Open the full prompt: [day-23.md](../artifacts/algo/problems/day-23.md)

## Suggested commit

```text
day-23: prioritize three bottlenecks and one ship-first fix
```
