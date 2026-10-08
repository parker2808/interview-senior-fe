# Day 10 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Thêm model TypeScript và mock API typed cho flow Vue.
- **EN:** Add TypeScript models and a typed mock API for the Vue flow.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng component tree + state map Day 8-9.
- **EN:** Reuse the component tree and state map from Days 8-9.

## Folder(s) nên chạm / Folders to touch

- `apps/vue-nuxt/types/`
- `apps/vue-nuxt/server-mocks/`
- `apps/vue-nuxt/composables/`
- `algorithms/day-10/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:vue
pnpm typecheck
pnpm test:algo -- day-10
```

## Từng bước / Step-by-step

1. Định nghĩa Customer, CustomerStatus, FieldConfig, ApiError.
   - EN: Define Customer, CustomerStatus, FieldConfig, and ApiError.
2. Tạo composable mock trả list + detail typed.
   - EN: Create a typed mock composable that returns list + detail data.
3. Nối typed data vào page shell.
   - EN: Connect the typed data to the page shell.

## Done when / Tiêu chí xong

- Typecheck sạch.
  - EN: Typecheck is clean.
- Mock data render được.
  - EN: Mock data renders.
- Không còn any ở đường chính.
  - EN: There is no any on the main path.

## Stretch goal

- Thêm discriminated union cho fetch state.
  - EN: Add a discriminated union for fetch state.

## Hints

- Mock API nhỏ là đủ.
  - EN: A small mock API is enough.

## Algorithm task

- **Problem:** Longest Substring Without Repeating Characters
- **Constraints:**
- 0 ≤ s.length ≤ 5·10^4
- **Hint:** Window [l,r] + Set/Map last index; khi trùng thì co l.

```text
algorithms/day-10/solution.ts
algorithms/day-10/solution.test.ts
```

Run: `pnpm test:algo -- day-10`

Open the full prompt: [day-10.md](../artifacts/algo/problems/day-10.md)

## Suggested commit

```text
day-10: add typed vue mock data
```
