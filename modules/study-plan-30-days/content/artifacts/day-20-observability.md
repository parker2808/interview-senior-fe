# Day 20 — Bundle + observability

> Plan v2 tracks: React/Next lab + Algo drill + Checkpoint nằm ở cuối file.

**Ngày:** 22/10/2026 · **Timebox:** 90–120 phút  
**Mục tiêu ngày:** Observability plan + lazy-load candidates.  
**Capstone link:** Observability + lazy-load — bổ trợ perf/security stories.

---

## Hướng dẫn (làm gì trong 90–120′)

1. **Đọc** (≈20′) — Vite vs Webpack; monitoring perf; caching.
2. **Observability plan:** error log, request ID, breadcrumb, Core Web Vitals.
3. **List** route/component lazy-load cho Capstone.

---

## Đọc (đã verify trong repo)

| Nguồn | Path | Ghi chú |
|---|---|---|
| Build tools | [`documents/vi/build-tools.md`](../../../../documents/vi/build-tools.md) | Vite vs Webpack |
| Monitoring | [`documents/vi/monitoring.md`](../../../../documents/vi/monitoring.md) | Performance monitoring |
| System design | [`documents/vi/system-design.md`](../../../../documents/vi/system-design.md) | Caching |

Plan Day 20: [30-day-study-plan.md — Day 20](../30-day-study-plan.md#day-20--22102026--bundle-observability)

---

## 1. Observability plan

| Signal | Tool / nơi gửi | Khi nào emit | PII note |
|---|---|---|---|
| Error log | | | |
| requestId correlation | | | |
| Breadcrumb (user actions) | | | |
| CWV (LCP/INP/CLS) | | | |

---

## 2. Lazy-load candidates

| Route / component | Lý do lazy | Risk (FOUC / waterfall) |
|---|---|---|
| Field Config page | | |
| Heavy modal / editor | | |
| *(thêm)* | | |

---

## 3. Bundle notes

Admin shell vs feature chunks? Shared vendor?

> *(điền)*

---

## 4. Caching (FE)

HTTP cache / SWR / memory — gì áp dụng Capstone?

> *(điền)*

---

## Checklist trước khi dừng

- [ ] Observability plan 4 signals
- [ ] Lazy-load candidates list
- [ ] Bundle/caching note


Quay lại: [Day 20 starter](../day-20-starter.md) · [Plan](../30-day-study-plan.md) · [Project context](../project-context.md)

<!-- PLAN_V2_TRACKS_START -->
## Plan v2 — React / Next Lab

**Timebox:** 25–35′ · Chi tiết track: [react-next-track.md](../react-next-track.md)

Lab Next: app/ layout + page customers (RSC mặc định) + 1 Client Component interactive filter.

### Lab log

- Repo / path:
- Commands chạy được:
- So sánh với Vue (3–5 dòng):

> 

---

## Plan v2 — Algo Drill

**Timebox:** 15–25′ · [algorithms-track.md](../algorithms-track.md)

**Bài:** Coin Change (unbounded) — DP lite (hoặc BFS nếu DP kẹt).

| Mục | Ghi |
|---|---|
| Pattern | |
| Time / Space | |
| Edge cases đã test | |
| Lỗi hay gặp / học được | |

Code (dán hoặc link `artifacts/algo/day-20.ts`):

```ts
// ...
```

---

## Plan v2 — Checkpoint

**Mục tiêu ngày:** Logging/CWV plan; tạo Next app router đầu tiên.

- [ ] Obs notes; Next /customers render; phân biệt Server vs Client component được.
- [ ] FE Craft / Capstone phần chính đã ghi vào worksheet
- [ ] React/Next lab chạy được (hoặc ghi blocker rõ)
- [ ] Algo có lời giải + Big-O

<!-- PLAN_V2_TRACKS_END -->
