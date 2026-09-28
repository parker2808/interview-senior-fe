# Day 2 — UI hierarchy critique

> Plan v2 tracks: React/Next lab + Algo drill + Checkpoint nằm ở cuối file.

**Ngày:** 04/10/2026 · **Timebox:** 90–120 phút  
**Mục tiêu ngày:** Chỉ ra được primary action + 10 UX issues trên một admin UI.  
**Capstone link:** Ghi chú áp dụng cho List/Detail/Field Config (optional section cuối).

---

## Hướng dẫn (làm gì trong 90–120′)

1. **Đọc** (≈15′) — Presentational vs Container trong architecture.
2. **Chọn 1 admin page** quen (hoặc màn List Capstone) — screenshot/mental model OK.
3. **Critique** hierarchy, empty/loading/error, wording — nhắm ≥10 issues.
4. **Chỉ primary action** rõ ràng (1 câu).
5. **Sketch redesign** 1 màn (ASCII / wireframe text).

Không cần pixel-perfect — cần lập luận Senior FE.

---

## Đọc (đã verify trong repo)

| Nguồn | Path | Ghi chú |
|---|---|---|
| Architecture | [`documents/vi/architecture.md`](../../../../documents/vi/architecture.md) | Presentational vs Container |
| Capstone scope (optional) | [capstone-brief.md](../capstone-brief.md) | List / Detail / Field Config |

Plan Day 2: [30-day-study-plan.md — Day 2](../30-day-study-plan.md#day-2--04102026--ui-hierarchy)

---

## 1. Màn đang critique

URL / tên màn / role giả định:

> *(điền)*

---

## 2. Primary action

User cần làm gì trước hết trên màn này? CTA chính là gì?

> *(điền)*  
> *Ví dụ format:* Primary = “Verify customer” trên hàng đang chọn — không phải “Export”.

---

## 3. Hierarchy hôm nay (trước redesign)

| Vùng UI | Nội dung hiện có | Có cạnh tranh attention? |
|---|---|---|
| Header / title | | |
| Toolbar / filters | | |
| Primary content | | |
| Secondary / noise | | |

---

## 4. UX issues (≥10)

Mỗi dòng: vấn đề · vì sao đau · mức (P0/P1/P2).

| # | Issue | Vì sao | Mức |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |
| 6 | | | |
| 7 | | | |
| 8 | | | |
| 9 | | | |
| 10 | | | |

Prompts nhanh: empty có next action không? loading có bị “trống trắng”? error recover được không? wording đồng nhất? destructive có confirm?

> *(điền thêm nếu >10)*

---

## 5. Empty / loading / error hôm nay

| State | Hiện tại | Mong muốn |
|---|---|---|
| Loading | | |
| Empty | | |
| Error | | |

---

## 6. Sketch redesign (1 màn)

```text
(vẽ ASCII / wireframe text ở đây)
```

Ghi 3 thay đổi quan trọng nhất:

1.  
2.  
3.  

---

## 7. Liên hệ Capstone (optional)

Issue nào sẽ áp vào List / Detail / Field Config?

> *(điền)*

---

## Checklist trước khi dừng

- [ ] Primary action rõ 1 câu
- [ ] ≥10 UX issues có mức P0/P1/P2
- [ ] Empty/loading/error có nhận xét
- [ ] Có sketch redesign + 3 thay đổi chính


Quay lại: [Day 2 starter](../day-02-starter.md) · [Plan](../30-day-study-plan.md) · [Project context](../project-context.md)

<!-- PLAN_V2_TRACKS_START -->
## Plan v2 — React / Next Lab

**Timebox:** 25–35′ · Chi tiết track: [react-next-track.md](../react-next-track.md)

Lab: useState counter + conditional render. So sánh với ref Vue. Giải thích re-render khi setState.

### Lab log

- Repo / path:
- Commands chạy được:
- So sánh với Vue (3–5 dòng):

> 

---

## Plan v2 — Algo Drill

**Timebox:** 15–25′ · [algorithms-track.md](../algorithms-track.md)

**Bài:** Valid Anagram — frequency map.

| Mục | Ghi |
|---|---|
| Pattern | |
| Time / Space | |
| Edge cases đã test | |
| Lỗi hay gặp / học được | |

Code (dán hoặc link `artifacts/algo/day-02.ts`):

```ts
// ...
```

---

## Plan v2 — Checkpoint

**Mục tiêu ngày:** Giải thích this + micro/macrotask; critique UI admin có hierarchy rõ.

- [ ] Nói được thứ tự log của 1 snippet Promise/setTimeout; có UI critique; Anagram pass.
- [ ] FE Craft / Capstone phần chính đã ghi vào worksheet
- [ ] React/Next lab chạy được (hoặc ghi blocker rõ)
- [ ] Algo có lời giải + Big-O

<!-- PLAN_V2_TRACKS_END -->
