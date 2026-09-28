# Day 16 — Error matrix + 401

> Plan v2 tracks: React/Next lab + Algo drill + Checkpoint nằm ở cuối file.

**Ngày:** 18/10/2026 · **Timebox:** 90–120 phút  
**Mục tiêu ngày:** Mỗi status code có UX + retry + log rõ.  
**Capstone link:** Deliverable 07 → [`capstone/07-error-matrix.md`](./capstone/07-error-matrix.md)

---

## Hướng dẫn (làm gì trong 90–120′)

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

<!-- PLAN_V2_TRACKS_START -->
## Plan v2 — React / Next Lab

**Timebox:** 25–35′ · Chi tiết track: [react-next-track.md](../react-next-track.md)

Lab: ErrorBoundary class (hoặc library) bọc page; fallback UI + retry. Note: boundary không bắt lỗi async event.

### Lab log

- Repo / path:
- Commands chạy được:
- So sánh với Vue (3–5 dòng):

> 

---

## Plan v2 — Algo Drill

**Timebox:** 15–25′ · [algorithms-track.md](../algorithms-track.md)

**Bài:** Maximum Depth of Binary Tree — DFS.

| Mục | Ghi |
|---|---|
| Pattern | |
| Time / Space | |
| Edge cases đã test | |
| Lỗi hay gặp / học được | |

Code (dán hoặc link `artifacts/algo/day-16.ts`):

```ts
// ...
```

---

## Plan v2 — Checkpoint

**Mục tiêu ngày:** Map status→UX; Error Boundary + 401 refresh flow notes.

- [ ] Matrix đủ 6 status; Boundary demo; DFS depth đúng.
- [ ] FE Craft / Capstone phần chính đã ghi vào worksheet
- [ ] React/Next lab chạy được (hoặc ghi blocker rõ)
- [ ] Algo có lời giải + Big-O

<!-- PLAN_V2_TRACKS_END -->
