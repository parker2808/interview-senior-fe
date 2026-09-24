# Day 17 — FE security

**Ngày:** 19/10/2026 · **Timebox:** 60–90 phút  
**Mục tiêu ngày:** Security checklist Capstone (XSS, authz, storage).  
**Capstone link:** Deliverable 10 → [`capstone/10-security-checklist.md`](./capstone/10-security-checklist.md)

---

## Hướng dẫn (làm gì trong 60–90′)

1. **Đọc** (≈20′) — XSS/CSRF/auth/CORS; storage notes trong performance.
2. **Threat model** Capstone: HTML render, roles, “permission chỉ check UI?”.
3. **Checklist** + copy `capstone/10-security-checklist.md`.

---

## Đọc (đã verify trong repo)

| Nguồn | Path | Ghi chú |
|---|---|---|
| Security | [`documents/vi/security.md`](../../../../documents/vi/security.md) | XSS, CSRF, auth, validation, CORS |
| Storage | [`documents/vi/performance.md`](../../../../documents/vi/performance.md) | localStorage vs session vs cookie |

Plan Day 17: [30-day-study-plan.md — Day 17](../30-day-study-plan.md#day-17--19102026--fe-security)

---

## 1. Threat model (ngắn)

| Asset / action | Threat | Mitigation FE | Mitigation phải ở BE? |
|---|---|---|---|
| Render customer fields | XSS | | |
| Edit Field Config | Authz bypass UI | | |
| Token / session | Theft / XSS | | |
| CORS | Misconfig | | |
| *(thêm)* | | | |

---

## 2. Roles

| Action | Viewer | Editor | Admin |
|---|---|---|---|
| View list | | | |
| Edit customer | | | |
| Field Config write | | | |

UI hide ≠ security:

> *(điền 1–2 câu)*

---

## 3. Storage decisions

| Data | localStorage | sessionStorage | cookie | memory |
|---|---|---|---|---|
| access token | | | | |
| draft form | | | | |
| prefs | | | | |

---

## 4. Checklist (tick khi đã nghĩ xong)

- [ ] Không `v-html` / `dangerouslySetInnerHTML` raw user content (hoặc sanitize)
- [ ] Validate input FE + BE
- [ ] Authz enforced server-side
- [ ] Sensitive data không nhét durable storage lung tung
- [ ] CSRF strategy (nếu cookie session)

> *(note)*

---

## 5. Copy Capstone

→ [`capstone/10-security-checklist.md`](./capstone/10-security-checklist.md)

---

## Checklist trước khi dừng

- [ ] Threat model + roles
- [ ] Storage decisions
- [ ] Đã copy capstone/10

Copy → [`capstone/10-security-checklist.md`](./capstone/10-security-checklist.md)

Quay lại: [Day 17 starter](../day-17-starter.md) · [Plan](../30-day-study-plan.md) · [Project context](../project-context.md)
