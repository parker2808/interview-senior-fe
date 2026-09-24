# Day 4 — Data-heavy table strategy

**Ngày:** 06/10/2026 · **Timebox:** 60–90 phút  
**Mục tiêu ngày:** Quyết định chiến lược table 500 rows (cột, filter, pagination).  
**Capstone link:** Nền cho Capstone List; responsive sâu ở Day 12 → `capstone/08`.

---

## Hướng dẫn (làm gì trong 60–90′)

1. **Đọc** (≈15′) — Flex/Grid + responsive strategy.
2. **Giả định** Customer List ~500 rows, nhiều cột.
3. **Quyết định** cột always-visible vs optional; search vs filter; pagination vs infinite scroll.
4. **Ghi trade-off** (perf, UX, implementation).
5. **Liên hệ** Capstone List (sẽ tinh responsive Day 12).

---

## Đọc (đã verify trong repo)

| Nguồn | Path | Ghi chú |
|---|---|---|
| CSS / responsive | [`documents/vi/css-layout.md`](../../../../documents/vi/css-layout.md) | Flex/Grid + responsive strategy |
| Capstone | [capstone-brief.md](../capstone-brief.md) | List: search, filter, sort, pagination |

Plan Day 4: [30-day-study-plan.md — Day 4](../30-day-study-plan.md#day-4--06102026--data-heavy-ui)

---

## 1. Assumptions

Số row? Cột candidate? Device ưu tiên?

> *(điền)*

---

## 2. Column priority

| Cột | Always visible | Optional / overflow | Lý do |
|---|---|---|---|
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |

---

## 3. Search vs filter

| Cơ chế | Dùng khi nào | Không dùng khi |
|---|---|---|
| Search (free text) | | |
| Filter (status / facets) | | |
| Sort | | |

> *(điền quyết định cho Capstone List)*

---

## 4. Pagination vs infinite scroll

Chọn **một** primary strategy cho Capstone desktop:

- [ ] Pagination (page size = ___ )
- [ ] Infinite scroll
- [ ] “Load more”
- [ ] Hybrid: ___

| Tiêu chí | Pagination | Infinite | Winner? |
|---|---|---|---|
| Deep link / share state | | | |
| “Jump to row ~400” | | | |
| Memory / DOM | | | |
| Ops workflow | | | |

**Quyết định + 2–3 câu lý do:**

> *(điền)*

---

## 5. Perf notes (sơ bộ)

500 rows: virtualize ngay? server-side page only? 

> *(điền — Day 19 sẽ sâu hơn)*

---

## 6. Sketch table toolbar

```text
[Search........] [Status ▾] [Sort ▾]          [Cols] [Export?]
---------------------------------------------------------
| ... table ...
---------------------------------------------------------
[« 1 2 3 … »]  hoặc  [Load more]
```

> *(chỉnh sketch)*

---

## Checklist trước khi dừng

- [ ] Column priority table đã điền
- [ ] Search vs filter đã quyết
- [ ] Pagination vs infinite scroll có lý do


Quay lại: [Day 4 starter](../day-04-starter.md) · [Plan](../30-day-study-plan.md) · [Project context](../project-context.md)
