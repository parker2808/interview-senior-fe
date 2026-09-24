# Day 20 — Bundle + observability

**Ngày:** 22/10/2026 · **Timebox:** 60–90 phút  
**Mục tiêu ngày:** Observability plan + lazy-load candidates.  
**Capstone link:** Observability + lazy-load — bổ trợ perf/security stories.

---

## Hướng dẫn (làm gì trong 60–90′)

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
