# Day 28 — Capstone React spike


**Ngày:** 30/10/2026 · **Timebox:** 90–120 phút  
**Mục tiêu ngày:** Cùng slice tương đương bằng React/TS (parallel, không clone full Vue app).  
**Capstone link:** Code dưới [`capstone/spikes/react/`](./capstone/spikes/react/) — sandbox React ngoài app Nuxt; KB concept trong [`documents/vi/react.md`](../../../../documents/vi/react.md).

---

## Hướng dẫn (làm gì trong 90–120′)

1. **Đọc** concept Days 8–10 + 15–16 (agnostic); đối chiếu note Vue spike Day 27 + [`documents/vi/react.md`](../../../../documents/vi/react.md).
2. **Không invent** `src/**/react*.md` — code practice ngoài app Nuxt; dùng KB React/Next.
3. **Cùng slice** React/TS parallel (không clone full Vue app).
4. **Bảng so sánh** state / effects / test approach.
5. Bổ sung evidence responsive/a11y/security còn thiếu → Capstone 08–11 nếu cần.

---

## Đọc (đã verify trong repo)

| Nguồn | Path | Ghi chú |
|---|---|---|
| Vue spike note | [day-27-vue-spike.md](./day-27-vue-spike.md) | Đối chiếu |
| React KB | [`documents/vi/react.md`](../../../../documents/vi/react.md) | Vue ↔ React bridges |
| Next KB (optional) | [`documents/vi/nextjs.md`](../../../../documents/vi/nextjs.md) | Nuxt ↔ Next |
| Agnostic docs | Capstone 04–07, 08–11 | |

Plan Day 28: [30-day-study-plan.md — Day 28](../30-day-study-plan.md#day-28--30102026--capstone-react-spike)

---

## 1. Slice tương đương Day 27

> *(điền — phải cùng behavior)*

Path sandbox React:

> *(điền)* · README: [`capstone/spikes/react/README.md`](./capstone/spikes/react/README.md)

---

## 2. Comparison — Vue vs React

| Topic | Vue spike | React spike |
|---|---|---|
| State (filters / form) | | |
| Effects / lifecycle | | |
| Data fetching | | |
| Test approach | | |
| Pain points | | |

---

## 3. Behavior parity checklist

- [ ] Cùng loading/empty/error
- [ ] Cùng save outcome
- [ ] Cùng permission rule (nếu có)

Diff cố ý:

> *(điền)*

---

## 4. Gaps Capstone 08–11

| # | File | Cần bổ sung? |
|---|---|---|
| 08 | responsive | |
| 09 | a11y | |
| 10 | security | |
| 11 | perf | |

---

## Checklist trước khi dừng

- [ ] Parity với Vue spike
- [ ] Comparison table
- [ ] Gaps 08–11 ghi nhận


Quay lại: [Day 28 starter](../day-28-starter.md) · [Plan](../30-day-study-plan.md) · [Project context](../project-context.md)



<!-- PLAN_TRACKS_START -->
## Thực hành — log nhanh

### Capstone / FE craft
Spike React/Next đạt parity feature Vue spike. README: khác biệt DX, bundling, data fetching.

### React / Next (chi tiết Lab tab)
Đây là ngày React chính: hoàn thiện slice + 1 test RTL smoke + note RSC/client boundary.

### Algo
**[Cooldown Easy](../artifacts/algo/problems/day-28.md)** · Cooldown · Easy

| Mục | Ghi |
|---|---|
| Pattern | |
| Time / Space | |
| Edge cases | |
| Link commit lab | |

### Checkpoint
- [ ] Demo 2 spike cạnh nhau; nói được 3 khác biệt Vue vs React/Next.

<!-- PLAN_TRACKS_END -->
