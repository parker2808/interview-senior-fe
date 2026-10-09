# Day 1 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** How would you grow a design system from a real product, not a Figma kit? Which CSS/layout decisions are actually senior-level? Walk one shipped admin screen: tokens, primitives, repeated states.
- **VI:** Bạn sẽ phát triển design system từ sản phẩm thật chứ không phải bộ Figma thế nào? Quyết định CSS/layout nào mới thật sự là mức senior? Đi một màn admin đã ship: token, primitive, state lặp lại.

## What you will produce / Bạn sẽ produce gì

- **EN:** Pick one admin screen and list colors, spacing, typography, feedback states, and repeated component patterns.
  - **VI:** Chọn một màn admin và liệt kê màu, spacing, typography, feedback state và pattern component lặp lại.
- **EN:** Write a short note: which 3 primitives would you extract first and why?
  - **VI:** Viết một note ngắn: 3 primitive nào nên tách ra trước và vì sao?

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: Inventory one real screen before extracting anything. Name tokens first, then the 3 primitives that would remove the most copy-paste.
  - VI: Kiểm kê một màn thật trước khi tách bất cứ thứ gì. Gọi tên token trước, rồi 3 primitive nào cắt được nhiều copy-paste nhất.
- **Constraint / Ràng buộc:**
  - EN: One screen, 45–60 minutes, Vue 3 + TypeScript thinking. No new package, no Storybook bootstrap, no design-system rewrite.
  - VI: Một màn, 45–60 phút, nghĩ theo Vue 3 + TypeScript. Không cài package mới, không bootstrap Storybook, không viết lại cả design system.
- **Failure mode:**
  - EN: A token list with no states, or primitives that wrap one-off page layout. Interviewers hear ‘we should have a Button’ and nothing about loading/empty/error.
  - VI: Danh sách token mà không có state, hoặc primitive chỉ bọc layout một lần. Interviewer nghe ‘nên có Button’ mà không nghe loading/empty/error.
- **Measure / Cách đo:**
  - EN: In under 2 minutes you can name the tokens, 3 primitives, and at least 2 reusable states from that screen.
  - VI: Dưới 2 phút bạn gọi được token, 3 primitive và ít nhất 2 state dùng lại từ màn đó.
- **Tradeoff / Trade-off:**
  - EN: Token-first vs component-first. Tokens scale theming; extracting the wrong primitive freezes a bad API.
  - VI: Token-first hay component-first. Token giúp theme scale; tách sai primitive thì đóng đinh một API xấu.
- **Production gotcha / Gotcha production:**
  - EN: Production CSS variables, dark aliases, and one-off hex values in Vue SFCs will disagree. Say how you would reconcile them without a migration week.
  - VI: CSS variable production, alias dark và hex one-off trong SFC Vue sẽ lệch nhau. Nói cách hòa chúng mà không cần một tuần migration.

## Done when / Tiêu chí xong

- Đã mổ xẻ xong 1 màn hình thành token và primitive.
  - EN: One screen audited into tokens and primitives.
- Đã ghi được ít nhất 2 state dùng lại: loading / empty / error / success.
  - EN: At least 2 reusable states noted: loading / empty / error / success.
- Bài algo chạy đúng và giải thích được vì sao HashMap thắng brute force.
  - EN: Algo passes and you can explain why HashMap wins over brute force.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Mark which tokens are semantic (`color-danger`) vs raw (`red-600`) and why that matters in an interview.
- **VI:** Đánh dấu token nào là semantic (`color-danger`) và token nào là raw (`red-600`), và vì sao điều đó quan trọng khi phỏng vấn.

## Algorithm / Thuật toán

- **Problem / Bài:** Two Sum · Hash map warm-up / Two Sum · Khởi động với HashMap
- **Constraints / Ràng buộc:**
  - EN:
- 2 ≤ nums.length ≤ 10^4
- -10^9 ≤ nums[i], target ≤ 10^9
- Exactly one valid answer
  - VI:
- 2 ≤ nums.length ≤ 10^4
- -10^9 ≤ nums[i], target ≤ 10^9
- Đúng một lời giải
- **Hint:** One pass: for each x, look up target-x in a Map(value→index).
  - VI: Duyệt một lần: với mỗi x, tìm target-x đã thấy trong Map(value→index).

```text
algorithms/day-01/solution.ts
algorithms/day-01/solution.test.ts
```

Run: `pnpm test:algo -- day-01`

Open the full prompt: [day-01.md](../artifacts/algo/problems/day-01.md)

## Suggested commit

```text
day-01: inventory one admin screen into tokens and primitives
```
