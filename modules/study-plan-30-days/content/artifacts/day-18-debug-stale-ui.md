# Day 18 — Debug stale UI + race

> Plan v2 tracks: React/Next lab + Algo drill + Checkpoint nằm ở cuối file.

**Ngày:** 20/10/2026 · **Timebox:** 90–120 phút  
**Mục tiêu ngày:** Có investigation log cho “Save OK nhưng UI stale” + mitigation race.  
**Capstone link:** Investigation log phục vụ spike + interview storytelling.

---

## Hướng dẫn (làm gì trong 90–120′)

1. **Đọc** (≈20′) — Vue debug; event loop; debounce/throttle; đối chiếu React stale closure / AbortController / query invalidation.
2. **Investigation log** “Save OK nhưng UI stale”.
3. **Case search race** — request cũ ghi đè mới; mitigation.

---

## Đọc (đã verify trong repo)

| Nguồn | Path | Ghi chú |
|---|---|---|
| Vue debug | [`documents/vi/vue3.md`](../../../../documents/vi/vue3.md) | Debug component bugs |
| JS | [`documents/vi/javascript.md`](../../../../documents/vi/javascript.md) | Event loop |
| Perf | [`documents/vi/performance.md`](../../../../documents/vi/performance.md) | debounce/throttle |
| React practice | [`documents/vi/react.md`](../../../../documents/vi/react.md) / [`documents/vi/nextjs.md`](../../../../documents/vi/nextjs.md) | stale closure / abort / query keys |

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

<!-- PLAN_V2_TRACKS_START -->
## Plan v2 — React / Next Lab

**Timebox:** 25–35′ · Chi tiết track: [react-next-track.md](../react-next-track.md)

Lab: search-as-you-type với AbortController; verify request cũ bị abort khi gõ tiếp.

### Lab log

- Repo / path:
- Commands chạy được:
- So sánh với Vue (3–5 dòng):

> 

---

## Plan v2 — Algo Drill

**Timebox:** 15–25′ · [algorithms-track.md](../algorithms-track.md)

**Bài:** Number of Islands — Graph BFS/DFS trên grid.

| Mục | Ghi |
|---|---|
| Pattern | |
| Time / Space | |
| Edge cases đã test | |
| Lỗi hay gặp / học được | |

Code (dán hoặc link `artifacts/algo/day-18.ts`):

```ts
// ...
```

---

## Plan v2 — Checkpoint

**Mục tiêu ngày:** Biết stale response; cleanup useEffect đúng.

- [ ] Có fix pattern ghi trong Capstone notes; lab abort hoạt động; Islands OK.
- [ ] FE Craft / Capstone phần chính đã ghi vào worksheet
- [ ] React/Next lab chạy được (hoặc ghi blocker rõ)
- [ ] Algo có lời giải + Big-O

<!-- PLAN_V2_TRACKS_END -->
