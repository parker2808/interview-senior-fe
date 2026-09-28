# Day 24 — E2E + CI gates

> Plan v2 tracks: React/Next lab + Algo drill + Checkpoint nằm ở cuối file.

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

<!-- PLAN_V2_TRACKS_START -->
## Plan v2 — React / Next Lab

**Timebox:** 25–35′ · Chi tiết track: [react-next-track.md](../react-next-track.md)

Lab: chạy E2E trên Next/React lab (1 smoke) HOẶC script manual checklist nếu chưa cài PW.

### Lab log

- Repo / path:
- Commands chạy được:
- So sánh với Vue (3–5 dòng):

> 

---

## Plan v2 — Algo Drill

**Timebox:** 15–25′ · [algorithms-track.md](../algorithms-track.md)

**Bài:** Live sim 45′: làm 2 bài (1 Easy + 1 Medium từ tuần 1–3) không xem lời giải. Chấm sau.

| Mục | Ghi |
|---|---|
| Pattern | |
| Time / Space | |
| Edge cases đã test | |
| Lỗi hay gặp / học được | |

Code (dán hoặc link `artifacts/algo/day-24.ts`):

```ts
// ...
```

---

## Plan v2 — Checkpoint

**Mục tiêu ngày:** 1 E2E critical path; 45′ live coding giả lập.

- [ ] E2E spec/CI note; có điểm self-score algo (pass/partial/fail).
- [ ] FE Craft / Capstone phần chính đã ghi vào worksheet
- [ ] React/Next lab chạy được (hoặc ghi blocker rõ)
- [ ] Algo có lời giải + Big-O

<!-- PLAN_V2_TRACKS_END -->
