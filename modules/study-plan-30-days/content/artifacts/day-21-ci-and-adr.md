# Day 21 — CI / T-shaped wrap

**Ngày:** 23/10/2026 · **Timebox:** 60–90 phút  
**Mục tiêu ngày:** CI quality gates + 1 ADR ngắn.  
**Capstone link:** Milestone tuần 3: 06, 07, 10, 11.

---

## Hướng dẫn (làm gì trong 60–90′)

1. **Đọc** (≈20′) — devops high-level; Git flow; ADR; architecture decisions.
2. **Pipeline:** install → lint → typecheck → unit → build → deploy → smoke.
3. **ADR ngắn** agnostic: “URL state cho filters” **hoặc** “global store vs local cho Field Config”.

---

## Đọc (đã verify trong repo)

| Nguồn | Path | Ghi chú |
|---|---|---|
| DevOps | `documents/vi/devops.md` | GitOps high-level |
| Practical | `documents/vi/practical-questions.md` | Git flow |
| Leadership | `documents/vi/leadership.md` | ADR template |
| System design | `documents/vi/system-design.md` | Architecture decisions |

Plan Day 21: [30-day-study-plan.md — Day 21](../30-day-study-plan.md#day-21--23102026--ci-t-shaped-wrap)

---

## 1. CI pipeline

| Stage | Tool (ý) | Fail = block merge? |
|---|---|---|
| install | | |
| lint | | |
| typecheck | | |
| unit | | |
| build | | |
| deploy | | |
| smoke | | |

---

## 2. ADR

**Title:**  

**Status:** Proposed  

**Context:**

> *(điền)*

**Decision:**

> *(điền — phải áp dụng được cả Vue và React)*

**Consequences:**

> *(điền)*

**Alternatives considered:**

> *(điền)*

---

## 3. Milestone tuần 3

| Deliverable | Ready? |
|---|---|
| 06 API | |
| 07 Error matrix | |
| 10 Security | |
| 11 Perf | |

---

## Checklist trước khi dừng

- [ ] CI pipeline đủ stages
- [ ] 1 ADR agnostic
- [ ] Milestone tuần 3 status


Quay lại: [Day 21 starter](../day-21-starter.md) · [Plan](../30-day-study-plan.md) · [Project context](../project-context.md)
