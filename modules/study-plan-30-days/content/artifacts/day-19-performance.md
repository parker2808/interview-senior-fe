# Day 19 — Performance

> Plan v2 tracks: React/Next lab + Algo drill + Checkpoint nằm ở cuối file.

**Ngày:** 21/10/2026 · **Timebox:** 90–120 phút  
**Mục tiêu ngày:** Phân loại bottleneck + proposal cho list lớn / live search.  
**Capstone link:** Deliverable 11 → [`capstone/11-performance-review.md`](./capstone/11-performance-review.md)

---

## Hướng dẫn (làm gì trong 90–120′)

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

<!-- PLAN_V2_TRACKS_START -->
## Plan v2 — React / Next Lab

**Timebox:** 25–35′ · Chi tiết track: [react-next-track.md](../react-next-track.md)

Lab: list chậm giả lập; tối ưu bằng memo hóa row; profile bằng React Profiler (DevTools) — ghi trước/sau.

### Lab log

- Repo / path:
- Commands chạy được:
- So sánh với Vue (3–5 dòng):

> 

---

## Plan v2 — Algo Drill

**Timebox:** 15–25′ · [algorithms-track.md](../algorithms-track.md)

**Bài:** Climbing Stairs — DP intro.

| Mục | Ghi |
|---|---|
| Pattern | |
| Time / Space | |
| Edge cases đã test | |
| Lỗi hay gặp / học được | |

Code (dán hoặc link `artifacts/algo/day-19.ts`):

```ts
// ...
```

---

## Plan v2 — Checkpoint

**Mục tiêu ngày:** Bottleneck list Capstone; biết khi nào memo/useMemo có ích.

- [ ] Perf sheet có số; Profiler screenshot/note; DP stairs O(n).
- [ ] FE Craft / Capstone phần chính đã ghi vào worksheet
- [ ] React/Next lab chạy được (hoặc ghi blocker rõ)
- [ ] Algo có lời giải + Big-O

<!-- PLAN_V2_TRACKS_END -->
