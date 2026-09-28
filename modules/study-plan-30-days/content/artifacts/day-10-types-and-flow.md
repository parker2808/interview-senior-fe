# Day 10 — Data flow + TypeScript

> Plan v2 tracks: React/Next lab + Algo drill + Checkpoint nằm ở cuối file.

**Ngày:** 12/10/2026 · **Timebox:** 90–120 phút  
**Mục tiêu ngày:** Model type Field Config + diagram Save flow.  
**Capstone link:** Types dùng lại khi spike Vue/React tuần 4.

---

## Hướng dẫn (làm gì trong 90–120′)

1. **Đọc** (≈20′) — TS interface/generics/narrowing + JS Promise/event loop.
2. **Model** Field Config types: DTO vs UI model; `VerificationStatus` union; tránh `any`.
3. **Vẽ** Save flow: UI event → state → request → response → cache → render.
4. **Ghi** chỗ narrowing / type guard cần thiết.

---

## Đọc (đã verify trong repo)

| Nguồn | Path | Ghi chú |
|---|---|---|
| TypeScript | [`documents/vi/typescript.md`](../../../../documents/vi/typescript.md) | interface/type, generics, narrowing, utilities |
| JavaScript | [`documents/vi/javascript.md`](../../../../documents/vi/javascript.md) | Promise/async, event loop |

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

<!-- PLAN_V2_TRACKS_START -->
## Plan v2 — React / Next Lab

**Timebox:** 25–35′ · Chi tiết track: [react-next-track.md](../react-next-track.md)

Lab: form FieldConfig dùng useReducer (update_field | validate | submit_*).

### Lab log

- Repo / path:
- Commands chạy được:
- So sánh với Vue (3–5 dòng):

> 

---

## Plan v2 — Algo Drill

**Timebox:** 15–25′ · [algorithms-track.md](../algorithms-track.md)

**Bài:** Longest Substring Without Repeating — Sliding Window.

| Mục | Ghi |
|---|---|
| Pattern | |
| Time / Space | |
| Edge cases đã test | |
| Lỗi hay gặp / học được | |

Code (dán hoặc link `artifacts/algo/day-10.ts`):

```ts
// ...
```

---

## Plan v2 — Checkpoint

**Mục tiêu ngày:** DTO + Save flow typed; useReducer form phức tạp.

- [ ] Types compile; reducer transitions rõ; sliding window O(n).
- [ ] FE Craft / Capstone phần chính đã ghi vào worksheet
- [ ] React/Next lab chạy được (hoặc ghi blocker rõ)
- [ ] Algo có lời giải + Big-O

<!-- PLAN_V2_TRACKS_END -->
