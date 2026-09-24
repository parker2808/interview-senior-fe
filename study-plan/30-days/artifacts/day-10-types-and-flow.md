# Day 10 — Data flow + TypeScript

**Ngày:** 12/10/2026 · **Timebox:** 60–90 phút  
**Mục tiêu ngày:** Model type Field Config + diagram Save flow.  
**Capstone link:** Types dùng lại khi spike Vue/React tuần 4.

---

## Hướng dẫn (làm gì trong 60–90′)

1. **Đọc** (≈20′) — TS interface/generics/narrowing + JS Promise/event loop.
2. **Model** Field Config types: DTO vs UI model; `VerificationStatus` union; tránh `any`.
3. **Vẽ** Save flow: UI event → state → request → response → cache → render.
4. **Ghi** chỗ narrowing / type guard cần thiết.

---

## Đọc (đã verify trong repo)

| Nguồn | Path | Ghi chú |
|---|---|---|
| TypeScript | `/workspace/src/vi/typescript.md` | interface/type, generics, narrowing, utilities |
| JavaScript | `/workspace/src/vi/javascript.md` | Promise/async, event loop |

Plan Day 10: [30-day-study-plan.md — Day 10](../30-day-study-plan.md#day-10--12102026--data-flow-typescript)

---

## 1. Types — Field Config

Viết pseudo-TS (điền thật vào khối):

```ts
// DTO (API)
type FieldConfigDto = {
  // *(điền)*
};

// UI model
type FieldConfigUi = {
  // *(điền)*
};

type VerificationStatus = /* union — điền */;

// Mapper
function toUi(dto: FieldConfigDto): FieldConfigUi {
  // *(điền)*
}
```

Chỗ nào cấm `any`? Dùng utility nào (`Pick`/`Omit`/…)?

> *(điền)*

---

## 2. Save flow diagram

```text
UI event → state → request → response → cache → render
(vẽ chi tiết + error branch)
```

---

## 3. Async / event loop gotchas

Race? Unmount khi pending? Double-submit?

> *(điền — Day 18 sâu hơn)*

---

## 4. Questions for interview

2–3 câu bạn muốn trả lời được về types/flow:

1.  
2.  
3.  

---

## Checklist trước khi dừng

- [ ] DTO vs UI model + VerificationStatus
- [ ] Save flow diagram đủ nhánh
- [ ] Ghi chỗ tránh any


Quay lại: [Day 10 starter](../day-10-starter.md) · [Plan](../30-day-study-plan.md) · [Project context](../project-context.md)
