# Day 16 — Error matrix + 401

**Ngày:** 18/10/2026 · **Timebox:** 60–90 phút  
**Mục tiêu ngày:** Mỗi status code có UX + retry + log rõ.  
**Capstone link:** Deliverable 07 → [`capstone/07-error-matrix.md`](./capstone/07-error-matrix.md)

---

## Hướng dẫn (làm gì trong 60–90′)

1. **Đọc** (≈15′) — handling 401; Sentry/logging.
2. **Matrix** đủ status + timeout/offline.
3. **Phân biệt** field error vs toast vs full-page.
4. **Copy** sang `capstone/07-error-matrix.md`.

---

## Đọc (đã verify trong repo)

| Nguồn | Path | Ghi chú |
|---|---|---|
| Practical | [`documents/vi/practical-questions.md`](../../../../documents/vi/practical-questions.md) | Handling 401 |
| Monitoring | [`documents/vi/monitoring.md`](../../../../documents/vi/monitoring.md) | Sentry / logging |

Plan Day 16: [30-day-study-plan.md — Day 16](../30-day-study-plan.md#day-16--18102026--error-handling-matrix)

---

## 1. Error matrix

| Code / case | User thấy | Retry? | Log / Sentry? | UI pattern (field/toast/page) |
|---|---|---|---|---|
| 400 | | | | |
| 401 | | | | |
| 403 | | | | |
| 404 | | | | |
| 409 | | | | |
| 422 | | | | |
| 429 | | | | |
| 500 | | | | |
| timeout | | | | |
| offline | | | | |

---

## 2. 401 special case

Redirect login? Refresh token? Giữ return URL?

> *(điền)*

---

## 3. Field vs toast vs full-page rules

| Dùng khi | Ví dụ |
|---|---|
| Field error | |
| Toast | |
| Full-page / ErrorState | |

---

## 4. Copy Capstone

→ [`capstone/07-error-matrix.md`](./capstone/07-error-matrix.md)

---

## Checklist trước khi dừng

- [ ] Matrix đủ codes + timeout/offline
- [ ] 401 special case
- [ ] Đã copy capstone/07

Copy → [`capstone/07-error-matrix.md`](./capstone/07-error-matrix.md)

Quay lại: [Day 16 starter](../day-16-starter.md) · [Plan](../30-day-study-plan.md) · [Project context](../project-context.md)
