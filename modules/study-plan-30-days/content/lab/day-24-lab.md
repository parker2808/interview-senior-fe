# Day 24 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Bổ sung guard/flag và checklist release cho repo.
- **EN:** Add a guard/flag and a release checklist to the repo.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng dashboard hoặc customers route hiện có.
- **EN:** Reuse the current dashboard or customers route.

## Folder(s) nên chạm / Folders to touch

- `apps/react-next/app/(admin)/`
- `notes/day-24.md`
- `algorithms/day-24/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm dev:next
pnpm test:algo -- day-24
```

## Từng bước / Step-by-step

1. Chọn auth gate nhẹ hoặc feature flag wrapper.
   - EN: Pick either a light auth gate or a feature-flag wrapper.
2. Viết security/release checklist đi kèm.
   - EN: Write the companion security/release checklist.
3. Đảm bảo UI giải thích rõ khi feature bị khóa.
   - EN: Make sure the UI explains clearly when a feature is locked.

## Done when / Tiêu chí xong

- Có 1 guard/flag thật.
  - EN: There is one real guard/flag.
- Checklist release/security đã có.
  - EN: The release/security checklist exists.
- Blocked state dễ hiểu.
  - EN: The blocked state is understandable.

## Stretch goal

- Thêm rollback note.
  - EN: Add a rollback note.

## Hints

- Mục tiêu là decision-making, không phải auth system hoàn chỉnh.
  - EN: The goal is decision-making, not a full auth system.

## Algorithm task

- **Problem:** Live coding simulation
- **Constraints:**
- Đúng 45′, có timer
- **Hint:** Nói pattern trước khi gõ.

```text
algorithms/day-24/solution.ts
algorithms/day-24/solution.test.ts
```

Run: `pnpm test:algo -- day-24`

Open the full prompt: [day-24.md](../artifacts/algo/problems/day-24.md)

## Suggested commit

```text
day-24: add release guard and checklist
```
