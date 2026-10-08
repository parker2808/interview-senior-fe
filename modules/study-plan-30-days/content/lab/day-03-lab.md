# Day 3 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Hôm nay build gì / What you will build

- **VI:** Xây FormField và TextField cho flow validation cơ bản.
- **EN:** Build FormField and TextField for a basic validation flow.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Dùng lại token và Button từ Day 1-2.
- **EN:** Reuse the tokens and Button from Days 1-2.

## Folder(s) nên chạm / Folders to touch

- `packages/ui/src/components/form-field/`
- `packages/ui/src/components/text-field/`
- `notes/day-03.md`
- `algorithms/day-03/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm storybook:ui
pnpm test:ui
pnpm test:algo -- day-03
```

## Từng bước / Step-by-step

1. Tạo FormField gồm label, hint, error, required.
   - EN: Create a FormField with label, hint, error, and required states.
2. Tạo TextField controlled-friendly với invalid/disabled state.
   - EN: Create a controlled-friendly TextField with invalid and disabled states.
3. Ghi state machine cho một form nhỏ.
   - EN: Write the state machine for one small form.

## Done when / Tiêu chí xong

- Label/hint/error rõ ràng.
  - EN: Label, hint, and error are clear.
- Input có invalid/disabled state.
  - EN: The input supports invalid and disabled states.
- State machine note xong.
  - EN: The state-machine note is done.

## Stretch goal

- Thêm textarea cùng API.
  - EN: Add a textarea with the same API style.

## Hints

- Giữ form nhỏ, đừng lao vào form library.
  - EN: Keep the form small; do not jump into a form library.

## Algorithm task

- **Problem:** Contains Duplicate
- **Constraints:**
- 1 ≤ nums.length ≤ 10^5
- -10^9 ≤ nums[i] ≤ 10^9
- **Hint:** Set: nếu add mà đã có → duplicate.

```text
algorithms/day-03/solution.ts
algorithms/day-03/solution.test.ts
```

Run: `pnpm test:algo -- day-03`

Open the full prompt: [day-03.md](../artifacts/algo/problems/day-03.md)

## Suggested commit

```text
day-03: add shared form primitives
```
