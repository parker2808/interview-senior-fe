# Day 18 — Debug stale UI + race

**Ngày:** 20/10/2026 · **Timebox:** 60–90 phút  
**Mục tiêu ngày:** Có investigation log cho “Save OK nhưng UI stale” + mitigation race.  
**Capstone link:** Investigation log phục vụ spike + interview storytelling.

---

## Hướng dẫn (làm gì trong 60–90′)

1. **Đọc** (≈20′) — Vue debug; event loop; debounce/throttle; đối chiếu React stale closure / AbortController / query invalidation.
2. **Investigation log** “Save OK nhưng UI stale”.
3. **Case search race** — request cũ ghi đè mới; mitigation.

---

## Đọc (đã verify trong repo)

| Nguồn | Path | Ghi chú |
|---|---|---|
| Vue debug | `/workspace/src/vi/vue3.md` | Debug component bugs |
| JS | `/workspace/src/vi/javascript.md` | Event loop |
| Perf | `/workspace/src/vi/performance.md` | debounce/throttle |
| React practice | *(không có path repo)* | stale closure / abort / query keys |

Plan Day 18: [30-day-study-plan.md — Day 18](../30-day-study-plan.md#day-18--20102026--debug-stale-ui-search-race)

---

## 1. Bug report (stale UI after Save)

| Field | Note |
|---|---|
| Steps to reproduce | |
| Expected | |
| Actual | |
| Environment | |

---

## 2. Hypotheses

1.  
2.  
3.  

Evidence cần thu (network, Vue/React devtools, logs):

> *(điền)*

---

## 3. Fix options

| Option | Pros | Cons |
|---|---|---|
| Invalidate / refetch | | |
| Optimistic + rollback | | |
| Patch local cache đúng key | | |
| *(khác)* | | |

**Chọn hướng Capstone:**

> *(điền)*

---

## 4. Search race

```text
User types "a" → req1
User types "ab" → req2
req1 returns AFTER req2 → UI hiện kết quả "a" (sai)
```

Mitigations:

- [ ] AbortController / cancel in-flight
- [ ] Monotonic request id / ignore stale
- [ ] Debounce
- [ ] Khác: ___

Pseudo (framework-agnostic):

```text
(điền)
```

---

## 5. Vue vs React debug notes

| Issue | Vue | React |
|---|---|---|
| Stale UI | | |
| Stale closure | | |
| Cancel fetch | | |

---

## Checklist trước khi dừng

- [ ] Stale UI: reproduce→hypothesis→fix options
- [ ] Search race mitigation
- [ ] Vue vs React debug note


Quay lại: [Day 18 starter](../day-18-starter.md) · [Plan](../30-day-study-plan.md) · [Project context](../project-context.md)
