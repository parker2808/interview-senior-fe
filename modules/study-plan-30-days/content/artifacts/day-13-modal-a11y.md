# Day 13 — A11y modal

> Plan v2 tracks: React/Next lab + Algo drill + Checkpoint nằm ở cuối file.

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

<!-- PLAN_V2_TRACKS_START -->
## Plan v2 — React / Next Lab

**Timebox:** 25–35′ · Chi tiết track: [react-next-track.md](../react-next-track.md)

Lab: Modal bằng createPortal; Esc đóng; focus nút đầu; restore focus khi unmount.

### Lab log

- Repo / path:
- Commands chạy được:
- So sánh với Vue (3–5 dòng):

> 

---

## Plan v2 — Algo Drill

**Timebox:** 15–25′ · [algorithms-track.md](../algorithms-track.md)

**Bài:** Linked List Cycle — Floyd.

| Mục | Ghi |
|---|---|
| Pattern | |
| Time / Space | |
| Edge cases đã test | |
| Lỗi hay gặp / học được | |

Code (dán hoặc link `artifacts/algo/day-13.ts`):

```ts
// ...
```

---

## Plan v2 — Checkpoint

**Mục tiêu ngày:** Modal a11y checklist + implement dialog React (focus trap tối thiểu).

- [ ] Modal lab đạt 4/5 a11y checks; checklist Capstone update; Floyd OK.
- [ ] FE Craft / Capstone phần chính đã ghi vào worksheet
- [ ] React/Next lab chạy được (hoặc ghi blocker rõ)
- [ ] Algo có lời giải + Big-O

<!-- PLAN_V2_TRACKS_END -->
