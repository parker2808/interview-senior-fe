# Day 8 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Tách shell Vue thành cây component rõ trách nhiệm.
- **EN:** Split the Vue shell into a component tree with clear ownership.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng lại page shell Day 7.
- **EN:** Reuse the Day 7 page shell.

## Folder(s) nên chạm / Folders to touch

- `apps/vue-nuxt/components/customers/`
- `notes/day-08.md`
- `algorithms/day-08/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm test:algo -- day-08
```

## Từng bước / Step-by-step

1. Tách page thành page, filters, table, detail panel.
   - EN: Split the page into page, filters, table, and detail-panel pieces.
2. Ghi props, emits và owner của mỗi component.
   - EN: Document props, emits, and owners for each component.
3. Vẽ lại component tree trong note.
   - EN: Rewrite the component tree in the note.

## Done when / Tiêu chí xong

- Không còn god component lớn.
  - EN: The giant god component is gone.
- Owner của state/component rõ.
  - EN: State and component ownership are clear.
- Flow vẫn render đúng.
  - EN: The flow still renders correctly.

## Stretch goal

- Thêm barrel exports cho module customers.
  - EN: Add barrel exports for the customers module.

## Hints

- Nếu phân vân local hay shared, để local trước.
  - EN: If unsure whether something is local or shared, keep it local first.

## Algorithm task

- **Problem:** Binary Search
- **Constraints:**
- 1 ≤ nums.length ≤ 10^4
- Mọi phần tử unique
- Phải O(log n)
- **Hint:** while lo<=hi; mid; so sánh rồi hẹp nửa trái/phải.

```text
algorithms/day-08/solution.ts
algorithms/day-08/solution.test.ts
```

Run: `pnpm test:algo -- day-08`

Open the full prompt: [day-08.md](../artifacts/algo/problems/day-08.md)

## Suggested commit

```text
day-08: split vue customer modules
```
