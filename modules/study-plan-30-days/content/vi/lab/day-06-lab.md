# Day 6 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

Type props thế nào để engineer sau không dùng sai component? Khi nào dùng union, khi nào generic? Show Button, TextField, EmptyState.

## Bạn sẽ produce gì

- Spec 3 API component cốt lõi (ví dụ Button, TextField, EmptyState) gồm props, variant và guardrail chống dùng sai.
- Đánh dấu prop nào phải giữ thật đơn giản và prop nào nên cho phép mở rộng.

## Senior làm thế nào

- **Quyết định:** Thiết kế public type trước. Variant là union. Cấm state bất khả thi (`loading` + `href` trên link button) ngay trong type, không phải warning runtime.
- **Constraint:** Chỉ spec type / snippet TS ngắn. Không scaffold component library, không npm install.
- **Failure mode:** `props: Record<string, any>`. Rừng boolean (`primary`, `danger`, `ghost`) cho phép `primary && danger`. Generic chỉ để trang trí.
- **Cách đo:** Ba API đã type cộng một union hoặc generic có chủ đích. Giải thích được một cách dùng sai mà type chặn.
- **Trade-off:** Props đơn giản hay slot/render prop mở rộng. Đơn giản thắng consistency; mở rộng thắng case product lẻ và tốn support.
- **Gotcha production:** Vue 3 `defineProps` + generic component vẫn có mép inference. Nếu hứa ‘type khiến điều đó bất khả thi’, phải biết lỗ thoát (`as any` trong template).

## Tiêu chí xong

- Ba API component đã được type và ghi chú rõ.
- Có ít nhất một union hoặc generic được dùng có chủ đích.
- Bài algo xong và pattern stack đã thấy quen tay.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Viết discriminated union cho Button-as-button và Button-as-link.

## Thuật toán

- **Bài:** Valid Parentheses · Stack
- **Ràng buộc:**
- 1 ≤ s.length ≤ 10^4
- **Hint:** Stack: gặp mở thì push; gặp đóng thì pop và khớp cặp.

```text
algorithms/day-06/solution.ts
algorithms/day-06/solution.test.ts
```

Chạy: `pnpm test:algo -- day-06`

Mở đề đầy đủ: [day-06.md](../artifacts/algo/problems/day-06.md)

## Commit gợi ý

```text
day-06: spec three typed component APIs with misuse guardrails
```
