# Day 20 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Thêm Server Action, metadata và asset/deploy note trong Next.
- **EN:** Add a Server Action, metadata, and an asset/deploy note in Next.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng customers route Day 15-19.
- **EN:** Reuse the customers route from Days 15-19.

## Folder(s) nên chạm / Folders to touch

- `apps/react-next/app/(admin)/customers/`
- `apps/react-next/app/(admin)/customers/actions.ts`
- `notes/day-20.md`
- `algorithms/day-20/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-20
```

## Từng bước / Step-by-step

1. Tạo 1 save form nhỏ qua Server Action hoặc mock server mutation.
   - EN: Create one small save form through a Server Action or mock server mutation.
2. Đặt metadata/title cho route.
   - EN: Set route metadata/title.
3. Ghi note image/font/deploy assumption.
   - EN: Write an image/font/deploy note.

## Done when / Tiêu chí xong

- Mutation demo chạy được.
  - EN: The mutation demo works.
- Metadata có giá trị rõ.
  - EN: The metadata is meaningful.
- Có note asset/deploy.
  - EN: There is an asset/deploy note.

## Stretch goal

- Thêm optimistic UI note.
  - EN: Add an optimistic UI note.

## Hints

- Một mutation nhỏ nhưng rõ boundary là đủ.
  - EN: One small mutation with a clear boundary is enough.

## Algorithm task

- **Problem:** Coin Change
- **Constraints:**
- 1 ≤ coins.length ≤ 12
- 0 ≤ amount ≤ 10^4
- **Hint:** dp[x] = min số xu tạo x; khởi dp[0]=0, còn lại Infinity.

```text
algorithms/day-20/solution.ts
algorithms/day-20/solution.test.ts
```

Run: `pnpm test:algo -- day-20`

Open the full prompt: [day-20.md](../artifacts/algo/problems/day-20.md)

## Suggested commit

```text
day-20: add next mutation and metadata
```
