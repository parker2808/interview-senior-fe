# Day 23 — Form/API tests (Vue+React)


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



<!-- PLAN_TRACKS_START -->
## Thực hành — log nhanh

### Capstone / FE craft
Viết pseudo + real snippet: 1 test Vue + 1 test React cùng behavior “save success toast”.

### React / Next (chi tiết Lab tab)
Lab: MSW (hoặc mock fetch) cho PATCH success/401; assert UI.

### Algo
**[Warm-up Easy (tự chọn)](../artifacts/algo/problems/day-23.md)** · Warm-up · Easy

| Mục | Ghi |
|---|---|
| Pattern | |
| Time / Space | |
| Edge cases | |
| Link commit lab | |

### Checkpoint
- [ ] Bảng so sánh VTU/RTL; React test 401 path; warm-up xong.

<!-- PLAN_TRACKS_END -->
