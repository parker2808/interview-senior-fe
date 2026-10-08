# Day 0 — Setup một lần cho toàn bộ lab repo

> Dùng **một** practice repo cho cả 30 ngày thay vì tạo sandbox mới mỗi ngày.

## Mục tiêu

- tạo một monorepo đủ nhẹ để bạn build lại design-system pieces, Vue/Nuxt flow, React/Next flow, thuật toán và note phỏng vấn trong cùng một chỗ.

## Cấu trúc khuyến nghị

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

## Công cụ nên có

- `pnpm` workspace, TypeScript, ESLint, Prettier, Vitest; Storybook (hoặc playground route) cho `packages/ui` nếu hợp tay.

## Lệnh bootstrap tối thiểu

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

## Root scripts gợi ý

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

> Nếu Storybook thấy nặng, thay bằng một route playground nhỏ trong mỗi app.

## Cách đặt commit

- dùng đúng format `day-XX: ...` để nhìn lịch sử commit là thấy tiến độ.

Ví dụ:

```text
day-01: bootstrap repo and token seed
day-12: make vue list responsive
day-21: finish next customer mini demo
day-30: finalize demoable interview repo
```

## Tùy chọn StackBlitz hoặc CodeSandbox

- nếu không muốn setup local ngay, import **cả repo** vào StackBlitz hoặc CodeSandbox một lần, rồi tiếp tục trên cùng workspace suốt 30 ngày.

## Rule quan trọng

- từ Day 2 trở đi, **không lặp lại setup**. Mỗi ngày chỉ nói rõ folder nào sửa, build gì, reuse gì từ ngày trước và commit message là gì.
