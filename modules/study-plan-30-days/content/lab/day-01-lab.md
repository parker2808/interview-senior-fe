# Day 1 — Lab

> **Timebox:** 45-60 phút / minutes

Companion repo: [lab-repo.md](../lab-repo.md)

## Day 0 / Setup một lần

- **VI:** nếu repo lab dùng chung chưa tồn tại, hoàn thành Day 0 trong [lab-repo.md](../lab-repo.md) trước khi làm Day 1.
- **EN:** if the shared lab repo does not exist yet, finish Day 0 in [lab-repo.md](../lab-repo.md) before doing Day 1.

## Hôm nay build gì / What you will build

- **VI:** Khởi tạo repo lab chung, seed token đầu tiên và README khung.
- **EN:** Bootstrap the shared lab repo, seed the first tokens, and start the README.

## Reuse từ ngày trước / Reuse from earlier days

- **VI:** Không có; đây là Day 0/Day 1.
- **EN:** None yet; this is Day 0/Day 1.

## Folder(s) nên chạm / Folders to touch

- `packages/ui/src/tokens/`
- `notes/day-01.md`
- `algorithms/day-01/`

## Starter / minimal commands

```bash
cd /path/to/senior-fe-lab
pnpm install
pnpm storybook:ui  # or a small UI playground
pnpm test:algo -- day-01
```

## Từng bước / Step-by-step

1. Làm phần Day 0 trong lab-repo nếu repo chưa tồn tại.
   - EN: Finish Day 0 from lab-repo if the repo does not exist yet.
2. Tạo token cơ bản cho màu, spacing, radius và type.
   - EN: Create base tokens for color, spacing, radius, and type.
3. Viết note 3 primitive đầu tiên cần tách từ màn admin thật.
   - EN: Write down the first 3 primitives you want to extract from a real admin screen.

## Done when / Tiêu chí xong

- Repo cài đặt xong.
  - EN: The repo installs cleanly.
- Token file đã commit.
  - EN: The token file is committed.
- README có section repo structure.
  - EN: The README has a repo-structure section.

## Stretch goal

- Thêm dark token alias.
  - EN: Add dark token aliases.

## Hints

- Giữ ngày đầu thật nhẹ, đừng dựng cả app.
  - EN: Keep day one intentionally light; do not build both apps yet.

## Algorithm task

- **Problem:** Two Sum
- **Constraints:**
- 2 ≤ nums.length ≤ 10^4
- -10^9 ≤ nums[i], target ≤ 10^9
- Đúng một lời giải
- **Hint:** Duyệt một lần: với mỗi x, tìm target-x đã thấy trong Map(value→index).

```text
algorithms/day-01/solution.ts
algorithms/day-01/solution.test.ts
```

Run: `pnpm test:algo -- day-01`

Open the full prompt: [day-01.md](../artifacts/algo/problems/day-01.md)

## Suggested commit

```text
day-01: bootstrap repo and token seed
```
