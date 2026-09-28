# Day 23 — Form/API tests (Vue+React)

> Plan v2 tracks: React/Next lab + Algo drill + Checkpoint nằm ở cuối file.

**Ngày:** 25/10/2026 · **Timebox:** 90–120 phút  
**Mục tiêu ngày:** Có pseudo/code tests cho validation + 409 + 403 trên cả hai mindset.  
**Capstone link:** Evidence dual-framework cho Capstone testing story.

---

## Hướng dẫn (làm gì trong 90–120′)

1. **Đọc** (≈15′) — mocking async, VTU; đối chiếu Testing Library.
2. **Viết hoặc pseudo** tests: Save success, conflict 409, permission 403.
3. **Cột so sánh** Vue test vs React test cho cùng behavior.

---

## Đọc (đã verify trong repo)

| Nguồn | Path | Ghi chú |
|---|---|---|
| Testing | [`documents/vi/testing.md`](../../../../documents/vi/testing.md) | Mocking async, Vue Test Utils |
| React | [`documents/vi/react.md`](../../../../documents/vi/react.md) / [`documents/vi/nextjs.md`](../../../../documents/vi/nextjs.md) | Testing Library patterns |

Plan Day 23: [30-day-study-plan.md — Day 23](../30-day-study-plan.md#day-23--25102026--form-api-error-tests-vue-react)

---

## 1. Behavior under test

Form/API nào? (Field Config Save gợi ý)

> *(điền)*

---

## 2. Case — Save success

**Vue (pseudo):**

```ts
// *(điền)*
```

**React (pseudo):**

```ts
// *(điền)*
```

---

## 3. Case — 409 conflict

**Vue:**

```ts
// *(điền)*
```

**React:**

```ts
// *(điền)*
```

---

## 4. Case — 403 permission

**Vue:**

```ts
// *(điền)*
```

**React:**

```ts
// *(điền)*
```

---

## 5. Comparison table

| Aspect | Vue (VTU / Vitest) | React (Testing Library) |
|---|---|---|
| Query UI | | |
| Mock network | | |
| Assert toast/field error | | |
| Async utilities | | |

---

## Checklist trước khi dừng

- [ ] Pseudo success + 409 + 403
- [ ] Bảng so sánh Vue vs React
- [ ] Cùng behavior cả hai cột


Quay lại: [Day 23 starter](../day-23-starter.md) · [Plan](../30-day-study-plan.md) · [Project context](../project-context.md)

<!-- PLAN_V2_TRACKS_START -->
## Plan v2 — React / Next Lab

**Timebox:** 25–35′ · Chi tiết track: [react-next-track.md](../react-next-track.md)

Lab: MSW (hoặc mock fetch) cho PATCH success/401; assert UI.

### Lab log

- Repo / path:
- Commands chạy được:
- So sánh với Vue (3–5 dòng):

> 

---

## Plan v2 — Algo Drill

**Timebox:** 15–25′ · [algorithms-track.md](../algorithms-track.md)

**Bài:** Mock set warm-up: 1 Easy tự chọn (≤10′).

| Mục | Ghi |
|---|---|
| Pattern | |
| Time / Space | |
| Edge cases đã test | |
| Lỗi hay gặp / học được | |

Code (dán hoặc link `artifacts/algo/day-23.ts`):

```ts
// ...
```

---

## Plan v2 — Checkpoint

**Mục tiêu ngày:** So sánh VTU vs RTL; mock API (MSW hoặc vi.mock).

- [ ] Bảng so sánh VTU/RTL; React test 401 path; warm-up xong.
- [ ] FE Craft / Capstone phần chính đã ghi vào worksheet
- [ ] React/Next lab chạy được (hoặc ghi blocker rõ)
- [ ] Algo có lời giải + Big-O

<!-- PLAN_V2_TRACKS_END -->
