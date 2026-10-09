# Day 23 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

Table 50.000 dòng — bạn làm gì trước? Bottleneck là lượng data, chi phí render hay bundle? Tối ưu nào bạn sẽ ship thật?

## Bạn sẽ produce gì

- Review một flow màn hình lớn từ kinh nghiệm cũ và liệt kê 3 bottleneck có khả năng nhất: lượng data, chi phí render hay chi phí bundle.
- Chọn một tối ưu bạn sẽ ship trước thật sự và giải thích vì sao nó đáng hơn các lựa chọn khác.

## Senior làm thế nào

- **Quyết định:** Ưu tiên bottleneck, rồi ship một fix. Pagination hoặc giới hạn query trước virtualization; tách theo route trước khi micro-optimize computed.
- **Constraint:** Note đã ưu tiên từ hệ thống bạn đã ship. Hôm nay không implement table ảo hoá mới.
- **Failure mode:** Liệt kê mười kỹ thuật không ưu tiên. Ảo hoá trước khi API trả 50k. Tách một helper 3 KB trong khi thư viện chart vendor 400 KB.
- **Cách đo:** Bottleneck đã được xếp hạng. Một tối ưu gắn với user impact và risk.
- **Trade-off:** Ảo hoá cứu DOM và phá find-in-page, a11y và đo đạc. Tách route cứu JS và tốn khoảng loading. Chọn theo task của user.
- **Gotcha production:** INP chết trên table trông rẻ vì mỗi keyup lọc 10k hàng trên main thread. Bundle analyzer bỏ qua async chunk bạn luôn preload.

## Tiêu chí xong

- Các bottleneck đã được ưu tiên rõ chứ không chỉ liệt kê.
- Một lựa chọn tối ưu đã gắn với user impact và risk.
- Đã xong buổi warm-up algo.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Gọi tên Core Web Vital sẽ nhúc nhích nếu fix đầu tiên có tác dụng.

## Thuật toán

- **Bài:** Warm-up easy set
- **Ràng buộc:**
- ≤10′
- **Hint:** Ưu tiên bài từng fail.

```text
algorithms/day-23/solution.ts
algorithms/day-23/solution.test.ts
```

Chạy: `pnpm test:algo -- day-23`

Mở đề đầy đủ: [day-23.md](../artifacts/algo/problems/day-23.md)

## Commit gợi ý

```text
day-23: prioritize three bottlenecks and one ship-first fix
```
