# Day 17 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Thêm cleanup và error handling cho flow Next.
- **EN:** Add cleanup and error handling to the Next flow.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng list/filter Day 15-16.
- **EN:** Reuse the list/filter flow from Days 15-16.

## Folder(s) nên chạm / Folders to touch

- `apps/react-next/app/customers/`
- `apps/react-next/components/`
- `notes/day-17.md`
- `algorithms/day-17/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-17
```

## Từng bước / Step-by-step

1. Tạo một flow có thể bị stale nếu không cleanup.
   - EN: Create a flow that can go stale without cleanup.
2. Thêm AbortController hoặc stale guard.
   - EN: Add AbortController or a stale guard.
3. Wrap 1 phần bằng error boundary và ghi limit của nó.
   - EN: Wrap one area with an error boundary and note its limits.

## Done when / Tiêu chí xong

- Có ví dụ cleanup/stale guard thật.
  - EN: There is a real cleanup/stale-guard example.
- Error boundary fallback hiện được.
  - EN: The error boundary fallback renders.
- Limitations note xong.
  - EN: The limitations note is done.

## Stretch goal

- Log mock error event vào note observability.
  - EN: Log a mock error event into observability notes.

## Hints

- Một ví dụ sắc nét đủ hơn ba ví dụ nửa vời.
  - EN: One sharp example is better than three vague ones.

## Algorithm task

- **Problem:** Lowest Common Ancestor of a BST
- **Constraints:**
- Cả p,q đều tồn tại trong cây
- **Hint:** Nếu cả hai < root → trái; cả hai > root → phải; else root là LCA.

```text
algorithms/day-17/solution.ts
algorithms/day-17/solution.test.ts
```

Run: `pnpm test:algo -- day-17`

Open the full prompt: [day-17.md](../artifacts/algo/problems/day-17.md)

## Suggested commit

```text
day-17: add next cleanup and error states
```
