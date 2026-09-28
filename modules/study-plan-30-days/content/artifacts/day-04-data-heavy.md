# Day 4 — Data-heavy table strategy

> Plan v2 tracks: React/Next lab + Algo drill + Checkpoint nằm ở cuối file.

**Ngày:** 06/10/2026 · **Timebox:** 90–120 phút  
**Mục tiêu ngày:** Quyết định chiến lược table 500 rows (cột, filter, pagination).  
**Capstone link:** Nền cho Capstone List; responsive sâu ở Day 12 → `capstone/08`.

---

## Hướng dẫn (làm gì trong 90–120′)

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

<!-- PLAN_V2_TRACKS_START -->
## Plan v2 — React / Next Lab

**Timebox:** 25–35′ · Chi tiết track: [react-next-track.md](../react-next-track.md)

Lab: render table 50 rows từ mock data typed bằng TS interface; filter client-side; giải thích key ổn định.

### Lab log

- Repo / path:
- Commands chạy được:
- So sánh với Vue (3–5 dòng):

> 

---

## Plan v2 — Algo Drill

**Timebox:** 15–25′ · [algorithms-track.md](../algorithms-track.md)

**Bài:** Group Anagrams — map sorted key / count key.

| Mục | Ghi |
|---|---|
| Pattern | |
| Time / Space | |
| Edge cases đã test | |
| Lỗi hay gặp / học được | |

Code (dán hoặc link `artifacts/algo/day-04.ts`):

```ts
// ...
```

---

## Plan v2 — Checkpoint

**Mục tiêu ngày:** Type được row model; chiến lược table 500+ rows; list React có key đúng.

- [ ] Có TS type cho CustomerRow; table React filter được; Group Anagrams đúng.
- [ ] FE Craft / Capstone phần chính đã ghi vào worksheet
- [ ] React/Next lab chạy được (hoặc ghi blocker rõ)
- [ ] Algo có lời giải + Big-O

<!-- PLAN_V2_TRACKS_END -->
