# Day 7 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Dựng customer flow shell tĩnh trong Vue app.
- **EN:** Build a static customer-flow shell inside the Vue app.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng packages/ui và note AC của Day 1-6.
- **EN:** Reuse packages/ui and the AC notes from Days 1-6.

## Folder(s) nên chạm / Folders to touch

- `apps/vue-nuxt/pages/customers.vue`
- `apps/vue-nuxt/components/`
- `notes/day-07.md`
- `algorithms/day-07/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm test:algo -- day-07
```

## Từng bước / Step-by-step

1. Tạo page shell gồm title, filter bar, table area, detail placeholder.
   - EN: Create a page shell with a title, filter bar, table area, and detail placeholder.
2. Dùng shared UI thay vì viết UI mới.
   - EN: Use the shared UI package instead of fresh custom UI.
3. Ghi note boundary component nào sẽ tách sau.
   - EN: Note which boundaries should split into separate components later.

## Done when / Tiêu chí xong

- Vue shell nhìn như flow thật.
  - EN: The Vue shell feels like a real flow.
- Có note boundary.
  - EN: There is a boundary note.
- Cấu trúc repo vẫn rõ.
  - EN: The repo structure is still clear.

## Stretch goal

- Tách luôn filter bar thành component riêng.
  - EN: Split the filter bar into its own component.

## Hints

- Hôm nay chưa phải data day.
  - EN: This is not the data day yet.

## Algorithm task

- **Problem:** Week 1 timed review
- **Constraints:**
- Tự chấm: pass / partial / fail
- **Hint:** Nhẩm pattern trước khi code.

```text
algorithms/day-07/solution.ts
algorithms/day-07/solution.test.ts
```

Run: `pnpm test:algo -- day-07`

Open the full prompt: [day-07.md](../artifacts/algo/problems/day-07.md)

## Suggested commit

```text
day-07: create vue customer shell
```
