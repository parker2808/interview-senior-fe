# Day 13 — A11y modal


**Ngày:** 15/10/2026 · **Timebox:** 90–120 phút  
**Mục tiêu ngày:** Spec Edit Field modal dùng được hoàn toàn bằng keyboard.  
**Capstone link:** Bắt đầu Deliverable 09 → [`capstone/09-a11y-checklist.md`](./capstone/09-a11y-checklist.md)

---

## Hướng dẫn (làm gì trong 90–120′)

1. **Đọc** (≈20′) — ARIA / keyboard / WCAG; Vue Teleport; đối chiếu React portal + focus trap.
2. **Spec** Edit Field modal: focus trap, Esc, return focus, `aria-modal`, labelledby, announce error.
3. **Bắt đầu** `capstone/09-a11y-checklist.md` (Day 14 sẽ test keyboard).

---

## Đọc (đã verify trong repo)

| Nguồn | Path | Ghi chú |
|---|---|---|
| A11y | [`documents/vi/accessibility.md`](../../../../documents/vi/accessibility.md) | ARIA, keyboard, semantic, WCAG |
| Vue Teleport | [`documents/vi/vue3.md`](../../../../documents/vi/vue3.md) | Teleport |
| React practice | [`documents/vi/react.md`](../../../../documents/vi/react.md) / [`documents/vi/nextjs.md`](../../../../documents/vi/nextjs.md) | portal + focus trap |

Plan Day 13: [30-day-study-plan.md — Day 13](../30-day-study-plan.md#day-13--15102026--modal-accessibility)

---

## 1. Modal anatomy

| Piece | Implementation note |
|---|---|
| Trigger | |
| Overlay | |
| Dialog container | |
| Title (`aria-labelledby`) | |
| Body | |
| Actions (Save / Cancel) | |
| Portal / Teleport target | |

---

## 2. Keyboard & focus

| Behavior | Spec |
|---|---|
| Open → focus đâu | |
| Tab cycle (trap) | |
| Shift+Tab | |
| Esc | |
| Close → return focus | |
| Save success → focus? | |
| Validation error → focus? | |

---

## 3. ARIA

| Attribute | Value / note |
|---|---|
| role | |
| aria-modal | |
| aria-labelledby | |
| aria-describedby | |
| aria-live (errors) | |

---

## 4. Permission / disabled

Viewer mở modal? Save disabled announce thế nào?

> *(điền)*

---

## 5. Seed Capstone a11y checklist

Copy các bullet keyboard/modal sang [`capstone/09-a11y-checklist.md`](./capstone/09-a11y-checklist.md) (sẽ bổ sung Day 14).

---

## Checklist trước khi dừng

- [ ] Focus/keyboard/ARIA spec đủ
- [ ] Permission/disabled note
- [ ] Đã seed capstone/09

Seed → [`capstone/09-a11y-checklist.md`](./capstone/09-a11y-checklist.md)

Quay lại: [Day 13 starter](../day-13-starter.md) · [Plan](../30-day-study-plan.md) · [Project context](../project-context.md)



<!-- PLAN_TRACKS_START -->
## Thực hành — log nhanh

### Capstone / FE craft
Checklist: focus trap, Esc, return focus, aria-modal, labelledby → bắt đầu capstone/09.

### React / Next (chi tiết Lab tab)
Lab: Modal bằng createPortal; Esc đóng; focus nút đầu; restore focus khi unmount.

### Algo
**[Linked List Cycle](../artifacts/algo/problems/day-13.md)** · Floyd two pointers · Easy

| Mục | Ghi |
|---|---|
| Pattern | |
| Time / Space | |
| Edge cases | |
| Link commit lab | |

### Checkpoint
- [ ] Modal lab đạt 4/5 a11y checks; checklist Capstone update; Floyd OK.

<!-- PLAN_TRACKS_END -->
