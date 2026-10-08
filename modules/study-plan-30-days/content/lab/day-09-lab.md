# Day 9 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Chốt state ownership cho filter, selection và detail trong Vue app.
- **EN:** Lock down state ownership for filter, selection, and detail in the Vue app.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng lại component tree Day 8.
- **EN:** Reuse the Day 8 component tree.

## Folder(s) nên chạm / Folders to touch

- `apps/vue-nuxt/composables/`
- `apps/vue-nuxt/components/customers/`
- `notes/day-09.md`
- `algorithms/day-09/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm test:algo -- day-09
```

## Từng bước / Step-by-step

1. Quyết định state nào ở page, state nào ở URL, state nào ở composable.
   - EN: Decide what belongs in page state, URL state, and composables.
2. Đưa filter/search lên URL nếu hợp lý.
   - EN: Move filter/search into the URL where it makes sense.
3. Viết state map owner/reader/writer/reset rule.
   - EN: Write a state map with owner/reader/writer/reset rules.

## Done when / Tiêu chí xong

- Filter state có source of truth rõ.
  - EN: Filter state has a clear source of truth.
- Selection/reset behavior giải thích được.
  - EN: Selection and reset behavior are explainable.
- State map xong.
  - EN: The state map is done.

## Stretch goal

- Thêm note vì sao chưa cần Pinia.
  - EN: Add a note on why Pinia is not needed yet.

## Hints

- URL state chỉ giữ cái hữu ích khi share/refresh.
  - EN: Only keep URL state that helps sharing or refresh.

## Algorithm task

- **Problem:** Two Sum II (sorted)
- **Constraints:**
- 2 ≤ numbers.length ≤ 3·10^4
- Đã sort non-decreasing
- **Hint:** Hai con trỏ đầu-cuối: tổng nhỏ → tăng left; lớn → giảm right.

```text
algorithms/day-09/solution.ts
algorithms/day-09/solution.test.ts
```

Run: `pnpm test:algo -- day-09`

Open the full prompt: [day-09.md](../artifacts/algo/problems/day-09.md)

## Suggested commit

```text
day-09: clarify vue state ownership
```
