# Day 0 / Setup một lần cho toàn bộ lab repo

> VI trước, EN ngay bên dưới. Dùng **một** practice repo cho cả 30 ngày thay vì tạo sandbox mới mỗi ngày.

## Mục tiêu / Goal

- **VI:** tạo một monorepo đủ nhẹ để bạn build lại design-system pieces, Vue/Nuxt flow, React/Next flow, thuật toán và note phỏng vấn trong cùng một chỗ.
- **EN:** create one lightweight monorepo so the design-system work, the Vue/Nuxt flow, the React/Next flow, the algorithm work, and the interview notes all live in one place.

## Cấu trúc khuyến nghị / Recommended structure

```text
senior-fe-lab/
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── apps/
│   ├── vue-nuxt/
│   └── react-next/
├── packages/
│   └── ui/
├── algorithms/
│   ├── day-01/
│   └── ...
└── notes/
    ├── interview/
    └── day-01.md
```

## Tooling / Công cụ nên có

- **VI:** `pnpm` workspace, TypeScript, ESLint, Prettier, Vitest; Storybook (hoặc playground route) cho `packages/ui` nếu hợp tay.
- **EN:** `pnpm` workspace, TypeScript, ESLint, Prettier, Vitest; Storybook (or a small playground route) for `packages/ui` if it feels worth the setup.

## Lệnh bootstrap tối thiểu / Minimal bootstrap commands

```bash
mkdir senior-fe-lab && cd senior-fe-lab
pnpm init

# workspace file
printf "packages:\n  - apps/*\n  - packages/*\n" > pnpm-workspace.yaml

# shared tooling
pnpm add -D typescript eslint prettier vitest @types/node

# Vue / Nuxt app
pnpm dlx nuxi@latest init apps/vue-nuxt

# React / Next app
pnpm create next-app@latest apps/react-next --ts --eslint --app --src-dir=false --import-alias "@/*"

# shared UI package + support folders
mkdir -p packages/ui/src algorithms notes/interview
```

## Root scripts gợi ý / Suggested root scripts

```json
{
  "scripts": {
    "dev:vue": "pnpm --dir apps/vue-nuxt dev",
    "dev:next": "pnpm --dir apps/react-next dev",
    "storybook:ui": "pnpm --dir packages/ui storybook",
    "test:ui": "pnpm --dir packages/ui vitest",
    "test:algo": "node scripts/run-algo-test.mjs",
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck"
  }
}
```

> **VI:** nếu Storybook thấy nặng, thay bằng một route playground nhỏ trong mỗi app.
> **EN:** if Storybook feels too heavy, replace it with one small playground route in each app.

## Commit convention / Cách đặt commit

- **VI:** dùng đúng format `day-XX: ...` để nhìn lịch sử commit là thấy tiến độ.
- **EN:** use the `day-XX: ...` convention so the git history reads like the 30-day progression.

Ví dụ / Examples:

```text
day-01: bootstrap repo and token seed
day-12: make vue list responsive
day-21: finish next customer mini demo
day-30: finalize demoable interview repo
```

## Cloud IDE option / Tùy chọn StackBlitz hoặc CodeSandbox

- **VI:** nếu không muốn setup local ngay, import **cả repo** vào StackBlitz hoặc CodeSandbox một lần, rồi tiếp tục trên cùng workspace suốt 30 ngày.
- **EN:** if you do not want local setup immediately, import the **whole repo** into StackBlitz or CodeSandbox once and keep working inside that same workspace for all 30 days.

## Rule quan trọng / Important rule

- **VI:** từ Day 2 trở đi, **không lặp lại setup**. Mỗi ngày chỉ nói rõ folder nào sửa, build gì, reuse gì từ ngày trước và commit message là gì.
- **EN:** from Day 2 onward, **do not repeat setup**. Each day should only say which folders to touch, what to build, what it reuses from earlier days, and the suggested commit message.
