# Day 19 — Performance

**Ngày:** 21/10/2026 · **Timebox:** 60–90 phút  
**Mục tiêu ngày:** Phân loại bottleneck + proposal cho list lớn / live search.  
**Capstone link:** Deliverable 11 → [`capstone/11-performance-review.md`](./capstone/11-performance-review.md)

---

## Hướng dẫn (làm gì trong 60–90′)

1. **Đọc** (≈20′) — performance + Intersection Observer / Workers.
2. **Phân loại** bottleneck: render vs network vs bundle.
3. **Proposal** list lớn / live search (virtualize? debounce? cancel?).
4. **Copy** `capstone/11-performance-review.md`.

---

## Đọc (đã verify trong repo)

| Nguồn | Path | Ghi chú |
|---|---|---|
| Performance | [`documents/vi/performance.md`](../../../../documents/vi/performance.md) | optimization, splitting |
| Web APIs | [`documents/vi/web-apis.md`](../../../../documents/vi/web-apis.md) | Intersection Observer, Workers |

Plan Day 19: [30-day-study-plan.md — Day 19](../30-day-study-plan.md#day-19--21102026--performance)

---

## 1. Bottleneck classification (Capstone List)

| Area | Symptom | Likely cause | Measure bằng gì |
|---|---|---|---|
| Render | | | |
| Network | | | |
| Bundle | | | |

---

## 2. Large list proposals

| Technique | Dùng khi | Không dùng khi | Capstone? |
|---|---|---|---|
| Server pagination | | | |
| Virtualization | | | |
| Memo / pure rows | | | |
| Web Worker | | | |

---

## 3. Live search

Debounce ms? Cancel in-flight? Min chars?

> *(điền)*

---

## 4. IO / Observer opportunities

Lazy images? Infinite sentinel? 

> *(điền)*

---

## 5. Copy Capstone

→ [`capstone/11-performance-review.md`](./capstone/11-performance-review.md)

---

## Checklist trước khi dừng

- [ ] Bottleneck classified
- [ ] List + live search proposals
- [ ] Đã copy capstone/11

Copy → [`capstone/11-performance-review.md`](./capstone/11-performance-review.md)

Quay lại: [Day 19 starter](../day-19-starter.md) · [Plan](../30-day-study-plan.md) · [Project context](../project-context.md)
