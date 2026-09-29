# Day 8 — Component architecture


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



<!-- PLAN_TRACKS_START -->
## Thực hành — log nhanh

### Capstone / FE craft
Vẽ component tree List page (smart vs dumb). Ghi props/events từng node → capstone/04.

### React / Next (chi tiết Lab tab)
Lab: tách CustomerTable (dumb) + CustomersPage (smart fetch mock). Không fetch trong dumb.

### Algo
**[Binary Search](../artifacts/algo/problems/day-08.md)** · Binary search · Easy

| Mục | Ghi |
|---|---|
| Pattern | |
| Time / Space | |
| Edge cases | |
| Link commit lab | |

### Checkpoint
- [ ] Tree 2 phía Vue-thinking + React lab khớp trách nhiệm; binary search O(log n).

<!-- PLAN_TRACKS_END -->
