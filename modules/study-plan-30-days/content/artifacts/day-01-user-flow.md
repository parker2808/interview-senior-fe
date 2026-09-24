# Day 1 — User flow (Customer Verification)

**Ngày:** 03/10/2026 · **Timebox:** 60–90 phút  
**Mục tiêu ngày:** Biến requirement Customer Verification thành user flow + edge cases rõ.  
**Capstone link:** Deliverable 01 → copy kết quả sang [`capstone/01-user-flow.md`](./capstone/01-user-flow.md) khi xong.

---

## Hướng dẫn (làm gì trong 60–90′)

1. **Đọc** (≈15–20′) — mở các path ở mục Đọc bên dưới.
2. **Trả lời trước khi “code”** — điền các section bên dưới; để trống chỗ `>` nếu chưa chắc, không bỏ section.
3. **Vẽ happy path** dạng: List → Filter → Select → View → Edit → Validate → Save → Feedback → Refresh.
4. **Ghi edge / error / permission** — ít nhất vài dòng mỗi nhóm.
5. **Draft AC thô** — 3–7 bullet; Day 5 sẽ tinh lại.
6. **Cuối session** — copy nội dung đã điền sang `capstone/01-user-flow.md`.

Không cần hoàn thiện Capstone hôm nay — chỉ flow + edge + AC draft.

---

## Đọc (đã verify trong repo)

| Nguồn | Path | Ghi chú |
|---|---|---|
| Capstone scope | [docs/capstone-brief.md](../capstone-brief.md) | List / Detail / Field Config / roles |
| Quy trình / bug vs feature | `documents/vi/practical-questions.md` | Mục quy trình & đánh giá issue |
| Map chủ đề repo | `/workspace/README.md` | Index drill |

Plan Day 1: [30-day-study-plan.md — Day 1](../30-day-study-plan.md#day-1--03102026--user-flow)

---

## Capstone framing (đọc rồi mới điền)

Bạn đang spec **Customer Verification Admin Console**:

- **Customer List** — search, filter status, sort, pagination  
- **Customer Detail** — view info, verification status, audit  
- **Field Config** — list, enable/disable, required/optional, display order, edit label  
- **Roles** — `Viewer | Editor | Admin`  
- **UX states bắt buộc** — loading | empty | error | success | disabled | permission denied | unsaved changes  

Chọn **một primary journey** hôm nay (gợi ý: Editor verify/update một customer field hoặc chạy flow List → Detail → Save). Field Config có thể là nhánh phụ trong “alternative flows”.

---

## 1. Persona

Ai dùng màn này? Role nào (Viewer / Editor / Admin)? Context công việc?

> *(điền)*  
> *Ví dụ format:* Editor ở ops — cần xác minh hồ sơ khách trước khi approve.

---

## 2. Goal

User muốn đạt gì khi session kết thúc? (1–2 câu)

> *(điền)*

---

## 3. Happy path

Liệt kê bước theo thứ tự. Bám chuỗi: List → Filter → Select → View → Edit → Validate → Save → Feedback → Refresh.

| # | Bước | Màn / UI | Ghi chú |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |
| 6 | | | |
| 7 | | | |
| 8 | | | |
| 9 | | | |

*(ASCII / bullet flow cũng OK dưới đây)*

```text
(vẽ flow ở đây)
```

---

## 4. Alternative / error flows

Permission? API fail? Conflict? Cancel giữa chừng?

| Trigger | User thấy gì | Hệ thống làm gì |
|---|---|---|
| | | |
| | | |
| | | |

Prompts nhanh:

- Viewer mở Edit → ?
- Save trả 403 / 409 / 500 → ?
- Mất mạng giữa Save → ?
- Unsaved changes + navigate away → ?

> *(điền thêm nếu cần)*

---

## 5. Edge cases

Ngoài happy + error chính — cases dễ quên (empty list, filter không kết quả, field required tắt rồi bật, sort + pagination, concurrent edit…).

- [ ]  
- [ ]  
- [ ]  
- [ ]  

> *(điền)*

---

## 6. Acceptance criteria (draft)

Bullet thô — “Given / When / Then” hoặc “User can…”. Day 5 sẽ refine thành AC v1 (List + Field Config).

1.  
2.  
3.  
4.  
5.  

> *Ví dụ format:* Given Editor trên List, When filter status = Pending, Then chỉ thấy customers Pending.

---

## Checklist trước khi dừng

- [ ] Persona + goal có đủ để người khác hiểu “ai / vì sao”
- [ ] Happy path đủ 8–9 bước hoặc tương đương
- [ ] Có ít nhất 3 alternative/error + 3 edge
- [ ] AC draft ≥ 3 bullet
- [ ] Đã copy sang [`capstone/01-user-flow.md`](./capstone/01-user-flow.md)

Quay lại: [Day 1 starter](../day-01-starter.md) · [Plan](../30-day-study-plan.md) · [Project context](../project-context.md)
