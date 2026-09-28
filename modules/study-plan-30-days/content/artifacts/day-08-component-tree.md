# Day 8 — Component architecture

> Plan v2 tracks: React/Next lab + Algo drill + Checkpoint nằm ở cuối file.

**Ngày:** 10/10/2026 · **Timebox:** 90–120 phút  
**Mục tiêu ngày:** Component tree Customer List với responsibility rõ từng node.  
**Capstone link:** Deliverable 04 → [`capstone/04-component-architecture.md`](./capstone/04-component-architecture.md)

---

## Hướng dẫn (làm gì trong 90–120′)

1. **Đọc** (≈20′) — architecture patterns + Vue Composition / provide-inject; đối chiếu React hooks / compound components.
2. **Vẽ tree** Customer List: `Search + FilterBar + Table + Pagination + DetailDrawer`.
3. **Bảng** component | trách nhiệm | không làm gì.
4. **Copy** sang `capstone/04-component-architecture.md`.

---

## Đọc (đã verify trong repo)

| Nguồn | Path | Ghi chú |
|---|---|---|
| Architecture | [`documents/vi/architecture.md`](../../../../documents/vi/architecture.md) | Patterns, SOLID, Presentational vs Container |
| Vue drill | [`documents/vi/vue3.md`](../../../../documents/vi/vue3.md) | Composition API, provide/inject |
| React practice | [`documents/vi/react.md`](../../../../documents/vi/react.md) / [`documents/vi/nextjs.md`](../../../../documents/vi/nextjs.md) | hooks / compound / container vs presentational |

Plan Day 8: [30-day-study-plan.md — Day 8](../30-day-study-plan.md#day-8--10102026--component-architecture)

---

## 1. Component tree (ASCII)

```text
CustomerListPage
├── Search
├── FilterBar
├── Table
├── Pagination
└── DetailDrawer
(bổ sung node nếu cần)
```

---

## 2. Responsibility matrix

| Component | Trách nhiệm | Không làm gì |
|---|---|---|
| Search | | |
| FilterBar | | |
| Table | | |
| Pagination | | |
| DetailDrawer | | |
| *(thêm)* | | |

---

## 3. Presentational vs Container

Node nào container? Node nào presentational? Vì sao?

> *(điền)*

---

## 4. Vue vs React note (ngắn)

| Concern | Vue | React |
|---|---|---|
| Cross-tree data | provide/inject | Context |
| Composition | composables | hooks |
| Compound UI | | |

> *(điền)*

---

## 5. Copy Capstone

Paste tree + matrix vào [`capstone/04-component-architecture.md`](./capstone/04-component-architecture.md).

---

## Checklist trước khi dừng

- [ ] Tree + responsibility matrix đủ
- [ ] Presentational vs Container note
- [ ] Đã copy capstone/04

Copy → [`capstone/04-component-architecture.md`](./capstone/04-component-architecture.md)

Quay lại: [Day 8 starter](../day-08-starter.md) · [Plan](../30-day-study-plan.md) · [Project context](../project-context.md)

<!-- PLAN_V2_TRACKS_START -->
## Plan v2 — React / Next Lab

**Timebox:** 25–35′ · Chi tiết track: [react-next-track.md](../react-next-track.md)

Lab: tách CustomerTable (dumb) + CustomersPage (smart fetch mock). Không fetch trong dumb.

### Lab log

- Repo / path:
- Commands chạy được:
- So sánh với Vue (3–5 dòng):

> 

---

## Plan v2 — Algo Drill

**Timebox:** 15–25′ · [algorithms-track.md](../algorithms-track.md)

**Bài:** Binary Search (sorted array) — iterative.

| Mục | Ghi |
|---|---|
| Pattern | |
| Time / Space | |
| Edge cases đã test | |
| Lỗi hay gặp / học được | |

Code (dán hoặc link `artifacts/algo/day-08.ts`):

```ts
// ...
```

---

## Plan v2 — Checkpoint

**Mục tiêu ngày:** Component tree Capstone + trách nhiệm rõ; mirror tree bên React.

- [ ] Tree 2 phía Vue-thinking + React lab khớp trách nhiệm; binary search O(log n).
- [ ] FE Craft / Capstone phần chính đã ghi vào worksheet
- [ ] React/Next lab chạy được (hoặc ghi blocker rõ)
- [ ] Algo có lời giải + Big-O

<!-- PLAN_V2_TRACKS_END -->
