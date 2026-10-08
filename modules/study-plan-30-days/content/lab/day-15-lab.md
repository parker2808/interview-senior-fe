# Day 15 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Khởi động route Customers tương đương trong Next app.
- **EN:** Start the equivalent Customers route in the Next app.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng schema, mock data và packages/ui từ Vue track.
- **EN:** Reuse the schema, mock data, and packages/ui from the Vue track.

## Folder(s) nên chạm / Folders to touch

- `apps/react-next/app/customers/`
- `apps/react-next/lib/`
- `notes/day-15.md`
- `algorithms/day-15/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-15
```

## Từng bước / Step-by-step

1. Tạo route /customers.
   - EN: Create the /customers route.
2. Render list mock bằng shared UI package.
   - EN: Render the mock list through the shared UI package.
3. Viết note cách data vào Vue vs Next khác nhau ra sao.
   - EN: Write how the data flow differs in Vue vs Next.

## Done when / Tiêu chí xong

- Next route render được.
  - EN: The Next route renders.
- Mock list reuse model cũ.
  - EN: The mock list reuses the old model.
- Có note so sánh Vue vs Next.
  - EN: There is a Vue vs Next comparison note.

## Stretch goal

- Tạo lib fixtures dùng chung cho cả 2 app.
  - EN: Create a shared fixtures lib for both apps.

## Hints

- Mục tiêu là domain parity, không phải pixel parity.
  - EN: The goal is domain parity, not pixel parity.

## Algorithm task

- **Problem:** Binary Tree Level Order Traversal
- **Constraints:**
- 0 ≤ nodes ≤ 2000
- **Hint:** Queue: mỗi vòng lấy size = queue.length = số node level hiện tại.

```text
algorithms/day-15/solution.ts
algorithms/day-15/solution.test.ts
```

Run: `pnpm test:algo -- day-15`

Open the full prompt: [day-15.md](../artifacts/algo/problems/day-15.md)

## Suggested commit

```text
day-15: start next customers route
```
