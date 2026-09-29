#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CURRICULUM, WEEK_LABELS } from './curriculum.mjs'
import { ALGO_PROBLEMS } from './algo-problems.mjs'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const LAB_TEMPLATE = path.join(ROOT, '../lab-template')

function esc(s) {
  return String(s || '').trim()
}

function dayPad(n) {
  return String(n).padStart(2, '0')
}

function renderAlgoProblemMd(day, p) {
  const lines = []
  lines.push(`# Day ${day} — Algo: ${p.title}`)
  lines.push('')
  lines.push(`| | |`)
  lines.push(`|---|---|`)
  lines.push(`| Difficulty | ${p.difficulty} |`)
  lines.push(`| Pattern | ${p.pattern} |`)
  lines.push(`| LeetCode | ${p.leetcode ?? '— (custom / review)'} |`)
  lines.push(`| Target complexity | ${p.goalComplexity} |`)
  lines.push('')
  lines.push(`## Đề bài`)
  lines.push('')
  lines.push(p.statement)
  lines.push('')
  lines.push(`## Function signature`)
  lines.push('')
  lines.push('```ts')
  lines.push(p.functionSig)
  lines.push('```')
  lines.push('')
  if (p.examples?.length) {
    lines.push(`## Ví dụ`)
    lines.push('')
    for (const [i, ex] of p.examples.entries()) {
      lines.push(`**Example ${i + 1}**`)
      lines.push(`- Input: \`${ex.input}\``)
      lines.push(`- Output: \`${ex.output}\``)
      if (ex.why) lines.push(`- Giải thích: ${ex.why}`)
      lines.push('')
    }
  }
  if (p.constraints?.length) {
    lines.push(`## Constraints`)
    lines.push('')
    for (const c of p.constraints) lines.push(`- ${c}`)
    lines.push('')
  }
  lines.push(`## Hint (chỉ mở khi kẹt >12′)`)
  lines.push('')
  lines.push(p.hint)
  lines.push('')
  lines.push(`## Nộp bài ở đâu?`)
  lines.push('')
  lines.push(`Trong companion lab repo:`)
  lines.push('')
  lines.push('```text')
  lines.push(`algo/day-${dayPad(day)}/solution.ts`)
  lines.push(`algo/day-${dayPad(day)}/solution.test.ts`)
  lines.push('```')
  lines.push('')
  lines.push(`Chạy: \`npm run algo:test:day -- ${day}\` (trong lab repo)`)
  lines.push('')
  lines.push(`Xem flow tổng: [algorithms-track.md](../../algorithms-track.md) · [lab-repo.md](../../lab-repo.md)`)
  lines.push('')
  return lines.join('\n')
}

function buildAlgorithmsTrack() {
  return `# Algorithms track — flow chi tiết

## Algo vận hành thế nào trong plan?

Mỗi ngày có **đúng 1 bài** (hoặc 1 session review/mock). Không phải “tự tìm đề trên LeetCode”.

| Bước | Ở đâu | Bạn làm gì |
|---:|---|---|
| 1 | Tab **Hướng dẫn** / plan ngày | Biết tên bài + pattern |
| 2 | File đề \`artifacts/algo/problems/day-NN.md\` | Đọc đề, example, constraints |
| 3 | Companion repo \`senior-fe-lab/algo/day-NN/\` | Viết \`solution.ts\` + test |
| 4 | Worksheet section Algo (tuỳ chọn) | Ghi pattern / Big-O / lỗi hay gặp |
| 5 | Checkpoint | Tick khi test xanh hoặc self-score mock |

\`\`\`text
Plan hub (đọc)          Lab repo (code + push)
─────────────────       ─────────────────────────
day-NN đề bài.md   →    algo/day-NN/solution.ts
algorithms-track   →    npm run algo:test:day -- N
worksheet log      →    git commit "day-N: algo ..."
\`\`\`

## Flow 15–25 phút (làm đúng thứ tự)

1. **Đọc đề 1 lần** (2′) — nói lại constraint bằng lời của mình  
2. **Brute force bằng lời** (1′) — dù O(n²) cũng được  
3. **Chọn pattern** (1′) — HashMap? Two pointers? DP?  
4. **Code TypeScript** trong lab (8–15′)  
5. **Chạy test** + thêm 1 edge (empty / 1 phần tử / duplicate)  
6. **Ghi 3 dòng** vào worksheet: pattern · time/space · bài học  

**Luật:** kẹt >12′ → mở **Hint** trong file đề (không mở full solution online trước).

## Bank đề theo ngày

| Day | Bài | Pattern | File đề |
|---:|---|---|---|
${CURRICULUM.map((d) => {
  const p = ALGO_PROBLEMS[d.day]
  return `| ${d.day} | ${p.title} | ${p.pattern} | [day-${dayPad(d.day)}.md](./artifacts/algo/problems/day-${dayPad(d.day)}.md) |`
}).join('\n')}

## Pattern theo tuần

| Tuần | Pattern |
|---|---|
| 1 | HashMap / Set / Frequency / Stack |
| 2 | Binary search · Two pointers · Sliding window · Linked list |
| 3 | Tree BFS/DFS · Grid · DP lite |
| 4–5 | Review · weak drill · live mock |

## Big-O cheat sheet

| Thao tác | Average |
|---|---|
| Map/Set get/add | O(1) |
| Array push/pop | O(1) |
| Array shift / splice giữa | O(n) |
| Sort | O(n log n) |
| Binary search (sorted) | O(log n) |
| Tree/graph visit mỗi node 1 lần | O(n) |
`
}

function buildLabRepoAlreadyExists() {
  // lab-repo.md written separately; ensure resource link only
}

function buildMasterPlan() {
  const lines = []
  lines.push(`# Kế hoạch ôn 30 ngày — Senior Front-End`)
  lines.push('')
  lines.push(`**Lịch:** Day 1 = **03/10/2026** → Day 30 = **01/11/2026**  `)
  lines.push(`**Timebox:** **90–120 phút/ngày**  `)
  lines.push(`**Mục tiêu:** Vững FE senior (product→ship) · bổ sung **React/Next** (nền Vue) · đủ **coding round Easy→Medium**.`)
  lines.push('')
  lines.push(`### Tài liệu`)
  lines.push('')
  lines.push(`| | |`)
  lines.push(`|---|---|`)
  lines.push(`| Capstone | [capstone-brief.md](./capstone-brief.md) |`)
  lines.push(`| React/Next track | [react-next-track.md](./react-next-track.md) |`)
  lines.push(`| Algorithms (flow + bank đề) | [algorithms-track.md](./algorithms-track.md) |`)
  lines.push(`| Companion lab repo | [lab-repo.md](./lab-repo.md) |`)
  lines.push(`| Feature / DoD / Self-check | [feature-template.md](./feature-template.md) · [definition-of-done.md](./definition-of-done.md) · [self-check-questions.md](./self-check-questions.md) |`)
  lines.push('')
  lines.push(`---`)
  lines.push('')
  lines.push(`## Cách dùng 3 tab mỗi ngày`)
  lines.push('')
  lines.push(`| Tab | Nội dung |`)
  lines.push(`|---|---|`)
  lines.push(`| **Hướng dẫn** | Lý thuyết cần học + Thực hành cần làm + Checkpoint |`)
  lines.push(`| **Worksheet** | Artifact Capstone / điền tay (docs) |`)
  lines.push(`| **Lab setup** | Setup môi trường, path trong lab repo, lệnh dev/test, chỗ push code |`)
  lines.push('')
  lines.push(`**Code không lưu trong hub plan** — push vào companion repo (xem [lab-repo.md](./lab-repo.md)).`)
  lines.push('')
  lines.push(`### Phân bổ thời gian gợi ý`)
  lines.push('')
  lines.push(`| Khối | Phút | Thuộc |`)
  lines.push(`|---|---:|---|`)
  lines.push(`| Lý thuyết (đọc KB) | 20–25 | Theory |`)
  lines.push(`| Thực hành Capstone / FE craft | 25–35 | Practice |`)
  lines.push(`| Thực hành React/Next lab | 25–35 | Practice |`)
  lines.push(`| Thực hành Algo | 15–25 | Practice |`)
  lines.push(`| Checkpoint | 5 | — |`)
  lines.push('')
  lines.push(`**Escape hatch (chỉ còn ~75′):** Craft → React lab → Algo. Không skip React 2 ngày liên tiếp.`)
  lines.push('')
  lines.push(`---`)
  lines.push('')
  lines.push(`## Calendar`)
  lines.push('')
  lines.push(`| Day | Ngày | Chủ đề |`)
  lines.push(`|---:|---|---|`)
  for (const d of CURRICULUM) {
    lines.push(`| ${d.day} | ${d.date} | ${d.theme} |`)
  }
  lines.push('')
  lines.push(`---`)
  lines.push('')

  const byWeek = new Map()
  for (const d of CURRICULUM) {
    if (!byWeek.has(d.week)) byWeek.set(d.week, [])
    byWeek.get(d.week).push(d)
  }

  for (const [week, days] of byWeek) {
    lines.push(`# ${WEEK_LABELS[week]} (${days[0].date} – ${days[days.length - 1].date})`)
    lines.push('')
    for (const d of days) {
      const p = ALGO_PROBLEMS[d.day]
      lines.push(`### Day ${d.day} — ${d.date} · ${d.theme}`)
      lines.push('')
      lines.push(`**Mục tiêu ngày:** ${esc(d.goal)}`)
      lines.push('')
      lines.push(`#### Lý thuyết (học gì)`)
      lines.push('')
      for (const t of d.theory.topics) lines.push(`- ${t}`)
      lines.push('')
      lines.push(`#### Thực hành (làm gì)`)
      lines.push('')
      lines.push(`1. **Capstone / FE craft:** ${esc(d.practice.craft)}`)
      lines.push(`2. **React / Next lab:** ${esc(d.practice.react)}`)
      lines.push(
        `3. **Algo:** [${p.title}](./artifacts/algo/problems/day-${dayPad(d.day)}.md) — pattern **${p.pattern}**`,
      )
      lines.push('')
      lines.push(`#### Checkpoint`)
      lines.push('')
      lines.push(`- ${esc(d.practice.checkpoint)}`)
      lines.push('')
      lines.push(
        `**Files:** [Hướng dẫn](./${d.starter}) · [Worksheet](./${d.worksheet}) · [Lab setup](./${d.lab}) · [Đề algo](./artifacts/algo/problems/day-${dayPad(d.day)}.md)`,
      )
      lines.push('')
      lines.push(`---`)
      lines.push('')
    }
  }

  lines.push(`## Thành công sau Day 30`)
  lines.push('')
  lines.push(`- [ ] Walkthrough Capstone 10–15′ có trade-offs`)
  lines.push(`- [ ] Demo spike Vue + React/Next`)
  lines.push(`- [ ] ≥12 bài algo Easy/Medium có test xanh trong lab repo`)
  lines.push(`- [ ] Trả lời được hooks rules, RSC vs client, controlled inputs, Error Boundary`)
  lines.push(`- [ ] Weak-topic list + kế hoạch 7 ngày tiếp`)
  lines.push('')
  return lines.join('\n')
}

function buildStarter(d) {
  const p = ALGO_PROBLEMS[d.day]
  return `# Day ${d.day} — Hướng dẫn (${d.date})

**Chủ đề:** ${d.theme}  
**Timebox:** 90–120 phút  
**Mục tiêu:** ${esc(d.goal)}

## Lý thuyết — học gì hôm nay

${d.theory.topics.map((t) => `- ${t}`).join('\n')}

> Đọc có chọn lọc (20–25′). Không cần đọc cả file KB — chỉ đúng mục liên quan.

## Thực hành — làm gì hôm nay

### 1) Capstone / FE craft
${esc(d.practice.craft)}

→ Làm trên tab **Worksheet**: [\`${d.worksheet}\`](./${d.worksheet})

### 2) React / Next lab
${esc(d.practice.react)}

→ Setup & path: tab **Lab setup** [\`${d.lab}\`](./${d.lab})

### 3) Thuật toán
**${p.title}** (${p.difficulty}) · pattern **${p.pattern}**

→ Đề đầy đủ: [\`artifacts/algo/problems/day-${dayPad(d.day)}.md\`](./artifacts/algo/problems/day-${dayPad(d.day)}.md)  
→ Code + test trong lab repo: \`algo/day-${dayPad(d.day)}/\`

## Checkpoint (tick trước khi mark Day done)

- [ ] ${esc(d.practice.checkpoint)}

## Links nhanh

- [Lab repo guide](./lab-repo.md) · [Algorithms track](./algorithms-track.md) · [React/Next track](./react-next-track.md)
`
}

function buildLabDoc(d) {
  const p = ALGO_PROBLEMS[d.day]
  const nn = dayPad(d.day)
  const isNext = d.day >= 20 && d.day !== 27
  const appPath =
    d.day === 27
      ? 'apps/vue-spike'
      : isNext
        ? 'apps/next'
        : 'apps/react'
  const dayFolder =
    d.day === 27
      ? 'apps/vue-spike (spike Capstone)'
      : isNext
        ? `apps/next/app/day-${nn}/` + ' (hoặc route tương ứng)'
        : `apps/react/src/days/day-${nn}/`

  return `# Day ${d.day} — Lab setup

**Mục đích tab này:** hướng dẫn môi trường / folder / lệnh để **làm và push code** cho đúng yêu cầu ngày hôm nay.

Companion repo: xem [lab-repo.md](../lab-repo.md) (một lần setup cho cả tháng).

## 0) Một lần duy nhất (nếu chưa có lab repo)

\`\`\`bash
# clone repo lab trống của bạn, rồi:
cp -R modules/study-plan-30-days/lab-template/. /path/to/senior-fe-lab/
cd /path/to/senior-fe-lab
npm install
\`\`\`

Ghi URL lab của bạn:

\`\`\`text
LAB_REPO=https://github.com/YOUR_USER/senior-fe-lab
\`\`\`

## 1) Folder làm việc hôm nay

| Phần | Path trong lab repo |
|---|---|
| FE practice | \`${dayFolder}\` |
| App dev | \`${appPath}\` |
| Algo | \`algo/day-${nn}/\` |

## 2) Lệnh dev / test

\`\`\`bash
cd /path/to/senior-fe-lab

# FE lab
npm run ${isNext ? 'dev:next' : d.day === 27 ? 'dev:vue' : 'dev:react'}

# Algo — đọc đề ở plan hub trước
# đề: interview-senior-fe/.../artifacts/algo/problems/day-${nn}.md
npm run algo:test:day -- ${d.day}
\`\`\`

## 3) Việc cần code hôm nay

### React / Next / Vue
${esc(d.practice.react)}

### Algo — ${p.title}
1. Mở đề: [day-${nn}.md](../artifacts/algo/problems/day-${nn}.md)
2. Implement \`algo/day-${nn}/solution.ts\`
3. Bổ sung test nếu cần trong \`solution.test.ts\`
4. \`npm run algo:test:day -- ${d.day}\` → xanh

## 4) Commit & push

\`\`\`bash
git add -A
git commit -m "day-${nn}: ${d.theme.replace(/"/g, '')}"
git push
\`\`\`

## 5) Quay lại Plan hub

- Điền **Worksheet** (Capstone docs)
- Tick **Checkpoint** trên tab Hướng dẫn
- Đánh dấu Day done

## Troubleshooting

| Triệu chứng | Cách xử lý |
|---|---|
| Chưa có Vite/Next app | Day 6 (hoặc hôm nay) scaffold theo [lab-repo.md](../lab-repo.md) |
| \`algo:test:day\` fail vì thiếu file | Tạo folder \`algo/day-${nn}\` + copy stub từ \`algo/day-01\` |
| Không biết đề ở đâu | Luôn ở plan hub \`artifacts/algo/problems/\` — không phải trong lab |
`
}

function buildDailyIndex() {
  const lines = []
  lines.push(`# Daily index — 30 ngày`)
  lines.push('')
  lines.push(
    `Plan: [30-day-study-plan.md](./30-day-study-plan.md) · Algo: [algorithms-track.md](./algorithms-track.md) · Lab: [lab-repo.md](./lab-repo.md)`,
  )
  lines.push('')
  lines.push(`| Day | Ngày | Chủ đề | Hướng dẫn | Worksheet | Lab setup | Đề algo |`)
  lines.push(`|---:|---|---|---|---|---|---|`)
  for (const d of CURRICULUM) {
    const nn = dayPad(d.day)
    lines.push(
      `| ${d.day} | ${d.date} | ${d.theme} | [${d.starter}](./${d.starter}) | [${d.worksheet}](./${d.worksheet}) | [${d.lab}](./${d.lab}) | [day-${nn}](./artifacts/algo/problems/day-${nn}.md) |`,
    )
  }
  lines.push('')
  return lines.join('\n')
}

function buildDaysConstant() {
  const rows = CURRICULUM.map((d) => {
    return `  { day: ${d.day}, date: '${d.date}', theme: '${d.theme.replace(/'/g, "\\'").replace(/\n/g, ' ')}', week: ${d.week}, starter: '${d.starter}', worksheet: '${d.worksheet}', lab: '${d.lab}' },`
  }).join('\n')

  return `export type DayMeta = {
  day: number
  date: string
  theme: string
  week: number
  starter: string
  worksheet: string
  lab: string
}

export type PlanResource = {
  id: string
  label: string
  path: string
}

export const DAYS: DayMeta[] = [
${rows}
]

export const PLAN_RESOURCES: PlanResource[] = [
  { id: 'plan', label: 'Kế hoạch 30 ngày', path: '30-day-study-plan.md' },
  { id: 'index', label: 'Daily index', path: 'daily-index.md' },
  { id: 'lab', label: 'Companion lab repo', path: 'lab-repo.md' },
  { id: 'react', label: 'React/Next track', path: 'react-next-track.md' },
  { id: 'algo', label: 'Algorithms track', path: 'algorithms-track.md' },
  { id: 'context', label: 'Bối cảnh dự án', path: 'project-context.md' },
  { id: 'capstone', label: 'Capstone brief', path: 'capstone-brief.md' },
  { id: 'feature', label: 'Feature template', path: 'feature-template.md' },
  { id: 'dod', label: 'Definition of Done', path: 'definition-of-done.md' },
  { id: 'selfcheck', label: 'Self-check questions', path: 'self-check-questions.md' },
]

export const WEEK_LABELS: Record<number, string> = {
  0: 'Tất cả',
  1: 'Tuần 1 · Foundations',
  2: 'Tuần 2 · Architecture',
  3: 'Tuần 3 · Quality + Next',
  4: 'Tuần 4 · Test + Spikes',
  5: 'Tuần 5 · Close',
}

export function getDay(n: number): DayMeta | null {
  return DAYS.find((d) => d.day === n) ?? null
}
`
}

const TRACK_START = '<!-- PLAN_TRACKS_START -->'
const TRACK_END = '<!-- PLAN_TRACKS_END -->'
const OLD_START = '<!-- PLAN_V2_TRACKS_START -->'
const OLD_END = '<!-- PLAN_V2_TRACKS_END -->'

function tracksBlock(d) {
  const p = ALGO_PROBLEMS[d.day]
  const depth = d.worksheet.split('/').length - 1
  const prefix = '../'.repeat(depth)
  const nn = dayPad(d.day)
  return `${TRACK_START}
## Thực hành — log nhanh

### Capstone / FE craft
${esc(d.practice.craft)}

### React / Next (chi tiết Lab tab)
${esc(d.practice.react)}

### Algo
**[${p.title}](${prefix}artifacts/algo/problems/day-${nn}.md)** · ${p.pattern} · ${p.difficulty}

| Mục | Ghi |
|---|---|
| Pattern | |
| Time / Space | |
| Edge cases | |
| Link commit lab | |

### Checkpoint
- [ ] ${esc(d.practice.checkpoint)}

${TRACK_END}
`
}

function patchWorksheet(filePath, d) {
  let text = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : ''
  // remove old v2 block
  text = text.replace(
    new RegExp(`${OLD_START}[\\s\\S]*?${OLD_END}`, 'm'),
    '',
  )
  text = text.replace(/> Plan v2 tracks:[^\n]*\n?/g, '')
  text = text.replace(/60–90 phút/g, '90–120 phút')
  text = text.replace(/60–90′/g, '90–120′')

  const block = tracksBlock(d)
  if (text.includes(TRACK_START)) {
    text = text.replace(
      new RegExp(`${TRACK_START}[\\s\\S]*?${TRACK_END}`, 'm'),
      block.trim(),
    )
  } else {
    if (!text.endsWith('\n')) text += '\n'
    text += '\n' + block
  }
  fs.writeFileSync(filePath, text)
}

function ensureAlgoStub(day) {
  const p = ALGO_PROBLEMS[day]
  const dir = path.join(LAB_TEMPLATE, 'algo', `day-${dayPad(day)}`)
  fs.mkdirSync(dir, { recursive: true })
  const sol = path.join(dir, 'solution.ts')
  const test = path.join(dir, 'solution.test.ts')
  if (!fs.existsSync(sol)) {
    fs.writeFileSync(
      sol,
      `/** Day ${dayPad(day)} — ${p.title}. Đề: plan hub artifacts/algo/problems/day-${dayPad(day)}.md */\nexport function solve(..._args: unknown[]): unknown {\n  throw new Error('Not implemented')\n}\n`,
    )
  }
  if (!fs.existsSync(test)) {
    fs.writeFileSync(
      test,
      `import { describe, it, expect } from 'vitest'\nimport { solve } from './solution'\n\ndescribe('day-${dayPad(day)} ${p.id}', () => {\n  it('todo: replace with real assertions', () => {\n    expect(() => solve()).toThrow()\n  })\n})\n`,
    )
  }
}

function main() {
  fs.mkdirSync(path.join(ROOT, 'lab'), { recursive: true })
  fs.mkdirSync(path.join(ROOT, 'artifacts/algo/problems'), { recursive: true })

  fs.writeFileSync(path.join(ROOT, '30-day-study-plan.md'), buildMasterPlan())
  fs.writeFileSync(path.join(ROOT, 'algorithms-track.md'), buildAlgorithmsTrack())
  fs.writeFileSync(path.join(ROOT, 'daily-index.md'), buildDailyIndex())

  for (const d of CURRICULUM) {
    fs.writeFileSync(path.join(ROOT, d.starter), buildStarter(d))
    fs.writeFileSync(path.join(ROOT, d.lab), buildLabDoc(d))
    fs.writeFileSync(
      path.join(ROOT, `artifacts/algo/problems/day-${dayPad(d.day)}.md`),
      renderAlgoProblemMd(d.day, ALGO_PROBLEMS[d.day]),
    )
    patchWorksheet(path.join(ROOT, d.worksheet), d)
    ensureAlgoStub(d.day)
  }

  fs.writeFileSync(
    path.resolve(ROOT, '../../../src/modules/study-plan/constants/days.constant.ts'),
    buildDaysConstant(),
  )

  // Clean outdated naming in react track / project context lightly via note
  console.log('Generated plan for', CURRICULUM.length, 'days + lab tabs + algo problems')
}

main()
