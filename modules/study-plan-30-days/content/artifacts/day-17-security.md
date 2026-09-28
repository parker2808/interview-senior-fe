# Day 17 — FE security

> Plan v2 tracks: React/Next lab + Algo drill + Checkpoint nằm ở cuối file.

**Ngày:** 19/10/2026 · **Timebox:** 90–120 phút  
**Mục tiêu ngày:** Security checklist Capstone (XSS, authz, storage).  
**Capstone link:** Deliverable 10 → [`capstone/10-security-checklist.md`](./capstone/10-security-checklist.md)

---

## Hướng dẫn (làm gì trong 90–120′)

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

<!-- PLAN_V2_TRACKS_START -->
## Plan v2 — React / Next Lab

**Timebox:** 25–35′ · Chi tiết track: [react-next-track.md](../react-next-track.md)

Lab: cố ý render HTML string an toàn (escape) vs dangerouslySetInnerHTML — ghi khi nào được phép.

### Lab log

- Repo / path:
- Commands chạy được:
- So sánh với Vue (3–5 dòng):

> 

---

## Plan v2 — Algo Drill

**Timebox:** 15–25′ · [algorithms-track.md](../algorithms-track.md)

**Bài:** Lowest Common Ancestor of BST (hoặc Binary Tree) — chọn 1.

| Mục | Ghi |
|---|---|
| Pattern | |
| Time / Space | |
| Edge cases đã test | |
| Lỗi hay gặp / học được | |

Code (dán hoặc link `artifacts/algo/day-17.ts`):

```ts
// ...
```

---

## Plan v2 — Checkpoint

**Mục tiêu ngày:** XSS/authz/storage checklist Capstone; biết nguy cơ React XSS.

- [ ] Checklist ≥8 items actionable; XSS note rõ; LCA pass sample.
- [ ] FE Craft / Capstone phần chính đã ghi vào worksheet
- [ ] React/Next lab chạy được (hoặc ghi blocker rõ)
- [ ] Algo có lời giải + Big-O

<!-- PLAN_V2_TRACKS_END -->
