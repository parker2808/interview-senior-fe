# Day 3 — Form states & validation


**Ngày:** 05/10/2026 · **Timebox:** 90–120 phút  
**Mục tiêu ngày:** Spec form Edit Profile với validation + state machine rõ.  
**Capstone link:** Có thể dùng cho Field Config / Detail edit sau này.

---

## Hướng dẫn (làm gì trong 90–120′)

1. **Đọc** (≈20′) — a11y forms + Vue v-model/props; **đối chiếu** controlled inputs React (đọc `documents/vi/react.md`).
2. **Chọn form** — Edit Profile *hoặc* Capstone Field Config edit / Profile fields.
3. **Map** field → rule → chỗ hiện error → khi nào disable Save.
4. **Viết state machine** `pristine → dirty → validating → invalid → submitting → success|error`.
5. **Ghi a11y** labels / error announce ngắn.

---

## Đọc (đã verify trong repo)

| Nguồn | Path | Ghi chú |
|---|---|---|
| A11y forms | [`documents/vi/accessibility.md`](../../../../documents/vi/accessibility.md) | Forms / labels |
| Vue drill | [`documents/vi/vue3.md`](../../../../documents/vi/vue3.md) | v-model, props |
| React practice | [`documents/vi/react.md`](../../../../documents/vi/react.md) / [`documents/vi/nextjs.md`](../../../../documents/vi/nextjs.md) | Đối chiếu controlled inputs / form state |

Plan Day 3: [30-day-study-plan.md — Day 3](../30-day-study-plan.md#day-3--05102026--forms)

---

## Capstone / form framing

Form nào hôm nay?

- [ ] Edit Profile (generic)
- [ ] Capstone: edit field config (label / required / order)
- [ ] Capstone: customer detail edit

> *(ghi chọn)*

---

## 1. Field map

| Field | Type | Rule (required / format / …) | Error hiện ở đâu | Disable Save khi… |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |
| | | | | |

---

## 2. State machine

Điền transition + side-effect UI:

| From | Event | To | UI đổi gì |
|---|---|---|---|
| pristine | user types | dirty | |
| dirty | blur / submit | validating | |
| validating | ok | submitting *hoặc* dirty | |
| validating | fail | invalid | |
| invalid | fix + revalidate | … | |
| submitting | 2xx | success | |
| submitting | 4xx/5xx | error | |

```text
pristine → dirty → validating → invalid → submitting → success|error
(vẽ thêm nhánh cancel / reset nếu cần)
```

---

## 3. Save disable rules

Bullet rõ ràng (boolean logic OK):

1.  
2.  
3.  

---

## 4. Vue vs React (đối chiếu ngắn)

| Concept | Vue (repo) | React (practice) |
|---|---|---|
| Controlled value | v-model / :modelValue | value + onChange |
| Dirty tracking | | |
| Validate timing | | |

> *(điền 3–5 dòng — không invent path React)*

---

## 5. A11y checklist form

- [ ] Mỗi input có label (không placeholder-only)
- [ ] Error gắn `aria-describedby` / live region
- [ ] Focus nhảy hợp lý khi submit invalid
- [ ] Disabled Save vẫn giải thích được (title / helper)

> *(note thêm)*

---

## Checklist trước khi dừng

- [ ] Field map ≥3 fields
- [ ] State machine đủ nhánh success|error
- [ ] Save disable rules rõ
- [ ] Có note Vue vs React ngắn


Quay lại: [Day 3 starter](../day-03-starter.md) · [Plan](../30-day-study-plan.md) · [Project context](../project-context.md)



<!-- PLAN_TRACKS_START -->
## Thực hành — log nhanh

### Capstone / FE craft
Map field→rule→error UI→disable Save. State machine pristine→dirty→validating→invalid→submitting→success|error.

### React / Next (chi tiết Lab tab)
Lab: form Profile (name, email) controlled, validate on blur + submit, disable button khi invalid. So với v-model.

### Algo
**[Contains Duplicate](../artifacts/algo/problems/day-03.md)** · Set · Easy

| Mục | Ghi |
|---|---|
| Pattern | |
| Time / Space | |
| Edge cases | |
| Link commit lab | |

### Checkpoint
- [ ] Form React chạy được validation; state machine ghi đủ transitions; Set solution O(n).

<!-- PLAN_TRACKS_END -->
