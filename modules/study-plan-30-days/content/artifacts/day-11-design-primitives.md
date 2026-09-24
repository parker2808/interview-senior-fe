# Day 11 — Empty/error + design system

**Ngày:** 13/10/2026 · **Timebox:** 60–90 phút  
**Mục tiêu ngày:** Chuẩn hóa 4 primitives dùng lại cho Capstone.  
**Capstone link:** Primitives dùng xuyên Capstone UI states.

---

## Hướng dẫn (làm gì trong 60–90′)

1. **Đọc** (≈15′) — component library + error boundaries / monitoring.
2. **Spec props API** cho 4 primitives: Button, FormField, EmptyState, ErrorState.
3. **Note refactor** 1 “god component” (từ Day 8 tree hoặc giả định).
4. **Map** primitives → Capstone states (loading/empty/error/…).

---

## Đọc (đã verify trong repo)

| Nguồn | Path | Ghi chú |
|---|---|---|
| System design | [`documents/vi/system-design.md`](../../../../documents/vi/system-design.md) | Component library |
| Monitoring | [`documents/vi/monitoring.md`](../../../../documents/vi/monitoring.md) | Error boundaries |

Plan Day 11: [30-day-study-plan.md — Day 11](../30-day-study-plan.md#day-11--13102026--emptyerror-ui-design-system)

---

## 1. Button

| Prop | Type (ý) | Default | Notes |
|---|---|---|---|
| variant | | | |
| size | | | |
| disabled | | | |
| loading | | | |
| *(thêm)* | | | |

A11y:  

> *(điền)*

---

## 2. FormField

| Prop | Type (ý) | Notes |
|---|---|---|
| label | | |
| error | | |
| required | | |
| hint | | |
| *(thêm)* | | |

---

## 3. EmptyState

| Prop | Notes |
|---|---|
| title | |
| description | |
| action | |
| illustration? | |

Dùng khi nào trên List / Field Config?

> *(điền)*

---

## 4. ErrorState

| Prop | Notes |
|---|---|
| title | |
| message | |
| retry | |
| errorId / requestId | |

Boundary vs inline vs full-page?

> *(điền)*

---

## 5. God component refactor

Component nào đang ôm quá nhiều? Tách thành?

> *(điền)*

---

## Checklist trước khi dừng

- [ ] 4 primitives có props API
- [ ] God component refactor note
- [ ] Map vào Capstone states


Quay lại: [Day 11 starter](../day-11-starter.md) · [Plan](../30-day-study-plan.md) · [Project context](../project-context.md)
