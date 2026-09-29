# Day 9 — State ownership


**Ngày:** 11/10/2026 · **Timebox:** 90–120 phút  
**Mục tiêu ngày:** Map state filter page — ai là source of truth.  
**Capstone link:** Deliverable 05 → [`capstone/05-state-ownership.md`](./capstone/05-state-ownership.md)

---

## Hướng dẫn (làm gì trong 90–120′)

1. **Đọc** (≈20′) — state-management Vue; đối chiếu React Query/SWR / Context / URL state.
2. **Classify** từng loại state trên filter page.
3. **Chọn owner** (source of truth) — tránh duplicate.
4. **Copy** sang `capstone/05-state-ownership.md`.

---

## Đọc (đã verify trong repo)

| Nguồn | Path | Ghi chú |
|---|---|---|
| State (Vue) | [`documents/vi/state-management.md`](../../../../documents/vi/state-management.md) | global vs local, Pinia/Vuex |
| React practice | [`documents/vi/react.md`](../../../../documents/vi/react.md) / [`documents/vi/nextjs.md`](../../../../documents/vi/nextjs.md) | local vs URL vs server cache vs Context |

Plan Day 9: [30-day-study-plan.md — Day 9](../30-day-study-plan.md#day-9--11102026--state-ownership)

---

## 1. State inventory

| State | Owner (URL / local / form / server cache / shared store) | Vì sao | Sync / invalidate? |
|---|---|---|---|
| query string / filters | | | |
| selected row | | | |
| modal open | | | |
| API list cache | | | |
| form draft (edit) | | | |
| permission / role | | | |
| *(thêm)* | | | |

---

## 2. Duplicate SoT risks

Chỗ nào dễ có 2 source of truth?

> *(điền)*

---

## 3. Filter page — quyết định chính

Filters sống ở URL? Store? Cả hai?

> *(điền — ADR đầy đủ có thể Day 21)*

---

## 4. Vue vs React mapping

| Pattern | Vue note | React practice |
|---|---|---|
| Server cache | | React Query / SWR mindset |
| Global client | Pinia | Context / Zustand mindset |
| Form draft | | |

> *(điền)*

---

## 5. Copy Capstone

→ [`capstone/05-state-ownership.md`](./capstone/05-state-ownership.md)

---

## Checklist trước khi dừng

- [ ] State inventory đã classify
- [ ] Duplicate SoT risks ghi rõ
- [ ] Đã copy capstone/05

Copy → [`capstone/05-state-ownership.md`](./capstone/05-state-ownership.md)

Quay lại: [Day 9 starter](../day-09-starter.md) · [Plan](../30-day-study-plan.md) · [Project context](../project-context.md)



<!-- PLAN_TRACKS_START -->
## Thực hành — log nhanh

### Capstone / FE craft
Bảng state: data · owner · who writes · who reads · sync server? → capstone/05.

### React / Next (chi tiết Lab tab)
Lab: lift filter state lên page; thử Context cho theme/auth mock; viết note khi nào cần Zustand.

### Algo
**[Two Sum II (sorted)](../artifacts/algo/problems/day-09.md)** · Two pointers · Medium

| Mục | Ghi |
|---|---|
| Pattern | |
| Time / Space | |
| Edge cases | |
| Link commit lab | |

### Checkpoint
- [ ] State map không còn “mọi thứ trong page”; Context demo chạy; two pointers đúng.

<!-- PLAN_TRACKS_END -->
