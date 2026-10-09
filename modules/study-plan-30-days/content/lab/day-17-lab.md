# Day 17 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** What is a good `useEffect` vs a bad one? How do you cancel stale work? Why don’t Error Boundaries catch API failures or event-handler errors?
- **VI:** `useEffect` tốt khác `useEffect` tệ thế nào? Huỷ việc stale ra sao? Vì sao Error Boundary không bắt lỗi API hay lỗi trong event handler?

## What you will produce / Bạn sẽ produce gì

- **EN:** Review one effect and ask: what triggers it, how is stale work cancelled, and what happens on rapid input or unmount?
  - **VI:** Review một effect và hỏi: cái gì kích hoạt nó, stale work bị huỷ thế nào và chuyện gì xảy ra khi input nhanh hoặc unmount?
- **EN:** Write one short explanation for why Error Boundaries do not replace API error handling.
  - **VI:** Viết một câu ngắn giải thích vì sao Error Boundary không thay thế cho xử lý lỗi API.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: For one effect: trigger, cleanup, stale, unmount. Then one sentence: Error Boundaries catch render-time React errors, not `fetch` or click handlers.
  - VI: Với một effect: trigger, cleanup, stale, unmount. Rồi một câu: Error Boundary bắt lỗi React lúc render, không bắt `fetch` hay click handler.
- **Constraint / Ràng buộc:**
  - EN: Review / snippet. Do not add an Error Boundary tree to a product app today.
  - VI: Review / snippet. Hôm nay không gắn cây Error Boundary vào app product.
- **Failure mode:**
  - EN: Fetching in an effect without cleanup (Strict Mode double-fetch + setState on unmount). Using Error Boundaries as the only error UX.
  - VI: Fetch trong effect không cleanup (Strict Mode fetch hai lần + setState lúc unmount). Lấy Error Boundary làm UX lỗi duy nhất.
- **Measure / Cách đo:**
  - EN: One good and one bad `useEffect` pattern, and Error Boundaries tied to real limits, not a vague definition.
  - VI: Một pattern `useEffect` tốt và một pattern tệ, và Error Boundary gắn với giới hạn thật chứ không phải định nghĩa mơ hồ.
- **Tradeoff / Trade-off:**
  - EN: Effects are the escape hatch. Prefer derived render and event handlers. If you need an effect to sync props → state, ask whether the state should exist.
  - VI: Effect là lối thoát. Ưu tiên render derived và event handler. Nếu cần effect để sync props → state, hỏi xem state đó có nên tồn tại không.
- **Production gotcha / Gotcha production:**
  - EN: React 18 Strict Mode remounts. AbortController in the cleanup. Error Boundaries do not catch async. `getDerivedStateFromError` vs `componentDidCatch` is extra credit, not required.
  - VI: React 18 Strict Mode remount. AbortController trong cleanup. Error Boundary không bắt async. `getDerivedStateFromError` vs `componentDidCatch` là điểm cộng, không bắt buộc.

## Done when / Tiêu chí xong

- Nói được một pattern useEffect tốt và một pattern useEffect tệ.
  - EN: You can describe one good and one bad useEffect pattern.
- Error Boundary giờ gắn với giới hạn thật chứ không còn là định nghĩa mơ hồ.
  - EN: Error Boundaries are now tied to real limitations, not a vague definition.
- Bài algo xong và dùng đúng tính chất của BST.
  - EN: Algo is done and BST properties are used correctly.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Write the dependency-array trap you would mention (`[]` on a callback that closes over stale props).
- **VI:** Viết bẫy dependency array bạn sẽ nhắc (`[]` trên callback đóng over props stale).

## Algorithm / Thuật toán

- **Problem / Bài:** Lowest Common Ancestor of a BST / Lowest Common Ancestor of a BST
- **Constraints / Ràng buộc:**
  - EN:
- Use BST properties, not a full tree walk if you can avoid it
  - VI:
- Dùng tính chất BST, đừng duyệt hết cây nếu tránh được
- **Hint:** Both < root → left; both > root → right; else root is LCA.
  - VI: Nếu cả hai < root → trái; cả hai > root → phải; else root là LCA.

```text
algorithms/day-17/solution.ts
algorithms/day-17/solution.test.ts
```

Run: `pnpm test:algo -- day-17`

Open the full prompt: [day-17.md](../artifacts/algo/problems/day-17.md)

## Suggested commit

```text
day-17: review one effect cleanup and error-boundary limits
```
