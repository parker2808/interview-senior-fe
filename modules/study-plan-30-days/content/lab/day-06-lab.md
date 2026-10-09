# Day 6 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** How do you type props so the next engineer cannot misuse the component? When do you want a union vs a generic? Show Button, TextField, EmptyState.
- **VI:** Type props thế nào để engineer sau không dùng sai component? Khi nào dùng union, khi nào generic? Show Button, TextField, EmptyState.

## What you will produce / Bạn sẽ produce gì

- **EN:** Spec 3 core component APIs (for example Button, TextField, EmptyState) with props, variants, and misuse guardrails.
  - **VI:** Spec 3 API component cốt lõi (ví dụ Button, TextField, EmptyState) gồm props, variant và guardrail chống dùng sai.
- **EN:** Mark which props must stay simple and which ones should be extensible.
  - **VI:** Đánh dấu prop nào phải giữ thật đơn giản và prop nào nên cho phép mở rộng.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: Design the public type first. Variants as unions. Forbid impossible states (`loading` + `href` on a link button) in the type, not in a runtime warning.
  - VI: Thiết kế public type trước. Variant là union. Cấm state bất khả thi (`loading` + `href` trên link button) ngay trong type, không phải warning runtime.
- **Constraint / Ràng buộc:**
  - EN: Type specs / short TS snippets only. No component library scaffold, no npm install.
  - VI: Chỉ spec type / snippet TS ngắn. Không scaffold component library, không npm install.
- **Failure mode:**
  - EN: `props: Record<string, any>`. A boolean forest (`primary`, `danger`, `ghost`) that allows `primary && danger`. Generics added for decoration.
  - VI: `props: Record<string, any>`. Rừng boolean (`primary`, `danger`, `ghost`) cho phép `primary && danger`. Generic chỉ để trang trí.
- **Measure / Cách đo:**
  - EN: Three typed APIs plus one intentional union or generic. You can explain one misuse the type prevents.
  - VI: Ba API đã type cộng một union hoặc generic có chủ đích. Giải thích được một cách dùng sai mà type chặn.
- **Tradeoff / Trade-off:**
  - EN: Simple props vs extensible slots/render props. Simple wins consistency; extensible wins one-off product needs and costs support.
  - VI: Props đơn giản hay slot/render prop mở rộng. Đơn giản thắng consistency; mở rộng thắng case product lẻ và tốn support.
- **Production gotcha / Gotcha production:**
  - EN: Vue 3 `defineProps` + generic components still have inference edges. If you promise ‘the type makes it impossible’, know the escape hatch (`as any` in a template).
  - VI: Vue 3 `defineProps` + generic component vẫn có mép inference. Nếu hứa ‘type khiến điều đó bất khả thi’, phải biết lỗ thoát (`as any` trong template).

## Done when / Tiêu chí xong

- Ba API component đã được type và ghi chú rõ.
  - EN: Three component APIs are typed and documented.
- Có ít nhất một union hoặc generic được dùng có chủ đích.
  - EN: At least one union or generic is used intentionally.
- Bài algo xong và pattern stack đã thấy quen tay.
  - EN: Algo is done and the stack pattern feels natural.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Write the discriminated union for Button-as-button vs Button-as-link.
- **VI:** Viết discriminated union cho Button-as-button và Button-as-link.

## Algorithm / Thuật toán

- **Problem / Bài:** Valid Parentheses · Stack / Valid Parentheses · Stack
- **Constraints / Ràng buộc:**
  - EN:
- 1 ≤ s.length ≤ 10^4
  - VI:
- 1 ≤ s.length ≤ 10^4
- **Hint:** Stack: push openers; on close, pop and match the pair.
  - VI: Stack: gặp mở thì push; gặp đóng thì pop và khớp cặp.

```text
algorithms/day-06/solution.ts
algorithms/day-06/solution.test.ts
```

Run: `pnpm test:algo -- day-06`

Open the full prompt: [day-06.md](../artifacts/algo/problems/day-06.md)

## Suggested commit

```text
day-06: spec three typed component APIs with misuse guardrails
```
