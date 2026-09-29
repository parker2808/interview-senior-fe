# Day 24 — E2E + CI gates


**Ngày:** 26/10/2026 · **Timebox:** 90–120 phút  
**Mục tiêu ngày:** 1 E2E scenario critical + gắn CI gates.  
**Capstone link:** Capstone 12 gần final.

---

## Hướng dẫn (làm gì trong 90–120′)

1. **Đọc** Playwright section trong testing.md.
2. **Viết** 1 E2E scenario critical: Editor → edit field → save → list cập nhật.
3. **Cập nhật** pipeline Day 21 (gates).
4. Capstone **12** gần final.

---

## Đọc (đã verify trong repo)

| Nguồn | Path | Ghi chú |
|---|---|---|
| Testing / Playwright | [`documents/vi/testing.md`](../../../../documents/vi/testing.md) | E2E |
| Day 21 CI | [day-21-ci-and-adr.md](./day-21-ci-and-adr.md) | Pipeline cập nhật |
| Test plan | [day-22-test-plan.md](./day-22-test-plan.md) | Pyramid |

Plan Day 24: [30-day-study-plan.md — Day 24](../30-day-study-plan.md#day-24--26102026--critical-e2e-ci)

---

## 1. E2E scenario

**Title:**  

**Preconditions:** role Editor, data seed…  

| Step | Action | Expect |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |
| 5 | | |

Selectors strategy (role/text vs brittle css):

> *(điền)*

---

## 2. Pseudo Playwright

```ts
// *(điền outline)*
```

---

## 3. CI gates update

| Gate | Trước (Day 21) | Sau (hôm nay) |
|---|---|---|
| unit | | |
| e2e critical | | |
| blocking? | | |

Khi nào cho phép skip E2E?

> *(điền)*

---

## 4. Capstone 12

Cập nhật [`capstone/12-test-plan.md`](./capstone/12-test-plan.md) với E2E final.

---

## Checklist trước khi dừng

- [ ] E2E scenario Editor→save→list
- [ ] CI gates cập nhật
- [ ] capstone/12 updated


Quay lại: [Day 24 starter](../day-24-starter.md) · [Plan](../30-day-study-plan.md) · [Project context](../project-context.md)



<!-- PLAN_TRACKS_START -->
## Thực hành — log nhanh

### Capstone / FE craft
Spec Playwright scenario: login(/mock) → filter → open detail → save. Ghi CI gate.

### React / Next (chi tiết Lab tab)
Lab: chạy E2E trên Next/React lab (1 smoke) HOẶC script manual checklist nếu chưa cài PW.

### Algo
**[Live coding simulation](../artifacts/algo/problems/day-24.md)** · Interview sim · Mixed

| Mục | Ghi |
|---|---|
| Pattern | |
| Time / Space | |
| Edge cases | |
| Link commit lab | |

### Checkpoint
- [ ] E2E spec/CI note; có điểm self-score algo (pass/partial/fail).

<!-- PLAN_TRACKS_END -->
