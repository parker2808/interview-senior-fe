# Day 15 — API contract

**Ngày:** 17/10/2026 · **Timebox:** 60–90 phút  
**Mục tiêu ngày:** Draft contract GET/PATCH fields đủ pagination/filter/sort/nullable.  
**Capstone link:** Deliverable 06 → [`capstone/06-api-contract.md`](./capstone/06-api-contract.md)

---

## Hướng dẫn (làm gì trong 60–90′)

1. **Đọc** (≈20′) — REST vs WS; async; Nuxt CSR/SSR/SSG high-level (T-shaped, không bắt buộc Nuxt).
2. **Draft** `GET/PATCH fields` — paths, query, body, response, nullable, 409.
3. **Copy** sang `capstone/06-api-contract.md`.

---

## Đọc (đã verify trong repo)

| Nguồn | Path | Ghi chú |
|---|---|---|
| Networking | [`documents/vi/networking.md`](../../../../documents/vi/networking.md) | REST vs WebSocket |
| JavaScript | [`documents/vi/javascript.md`](../../../../documents/vi/javascript.md) | async |
| Nuxt (T-shaped) | [`documents/vi/nuxt.md`](../../../../documents/vi/nuxt.md) | CSR/SSR/SSG high-level |

Plan Day 15: [30-day-study-plan.md — Day 15](../30-day-study-plan.md#day-15--17102026--api-contract)

---

## 1. Resources & paths

| Method | Path | Mục đích |
|---|---|---|
| GET | | list fields / customer fields |
| GET | | one field |
| PATCH | | update field |
| *(thêm)* | | |

---

## 2. GET list — query

| Param | Type | Required | Notes |
|---|---|---|---|
| page / cursor | | | |
| pageSize | | | |
| sort | | | |
| filter / status | | | |
| q | | | |

Response shape (nullable fields?):

```json
{
  "// điền": true
}
```

---

## 3. PATCH — body & response

```json
{
  "// request body": true
}
```

```json
{
  "// success response": true
}
```

Conflict **409** — body / headers?

> *(điền)*

---

## 4. Error schema (chung)

| Field | Meaning |
|---|---|
| code | |
| message | |
| fields[] | |
| requestId | |

---

## 5. Rendering note (optional T-shaped)

Capstone admin: CSR đủ? Khi nào nghĩ SSR?

> *(điền ngắn)*

---

## 6. Copy Capstone

→ [`capstone/06-api-contract.md`](./capstone/06-api-contract.md)

---

## Checklist trước khi dừng

- [ ] GET/PATCH đủ query/body/response
- [ ] 409 conflict rõ
- [ ] Đã copy capstone/06

Copy → [`capstone/06-api-contract.md`](./capstone/06-api-contract.md)

Quay lại: [Day 15 starter](../day-15-starter.md) · [Plan](../30-day-study-plan.md) · [Project context](../project-context.md)
