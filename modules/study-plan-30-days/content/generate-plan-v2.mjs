#!/usr/bin/env node
/**
 * Generate plan v2 artifacts from curriculum-v2.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { CURRICULUM, WEEK_LABELS } from './curriculum-v2.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = __dirname

function esc(s) {
  return String(s || '').trim()
}

function weekSections() {
  const byWeek = new Map()
  for (const d of CURRICULUM) {
    if (!byWeek.has(d.week)) byWeek.set(d.week, [])
    byWeek.get(d.week).push(d)
  }
  return byWeek
}

function buildMasterPlan() {
  const lines = []
  lines.push(`# Plan ôn tập 30 ngày v2 — Senior Front-End (Parker)`)
  lines.push('')
  lines.push(`**Lịch:** Day 1 = **03/10/2026** → Day 30 = **01/11/2026** (DD/MM/YYYY)  `)
  lines.push(`**Timebox:** **90–120 phút/ngày** · ~25% đọc / 35% FE craft · Capstone / 25% React·Next lab / 15% Algo  `)
  lines.push(`**Mục tiêu tháng:** Vững FE senior (product→ship) + **React/Next thực chiến** (bổ sung Vue background) + **coding round Easy→Medium**.`)
  lines.push('')
  lines.push(`> Review plan cũ + redesign: xem mục **Chẩn đoán** bên dưới. Tracks chi tiết: [algorithms-track.md](./algorithms-track.md) · [react-next-track.md](./react-next-track.md)`)
  lines.push('')
  lines.push(`### Tài liệu kèm`)
  lines.push('')
  lines.push(`| Tên | File |`)
  lines.push(`|---|---|`)
  lines.push(`| Feature Template | [feature-template.md](./feature-template.md) |`)
  lines.push(`| Definition of Done | [definition-of-done.md](./definition-of-done.md) |`)
  lines.push(`| Self-check | [self-check-questions.md](./self-check-questions.md) |`)
  lines.push(`| Capstone brief | [capstone-brief.md](./capstone-brief.md) |`)
  lines.push(`| Algorithms track | [algorithms-track.md](./algorithms-track.md) |`)
  lines.push(`| React/Next track | [react-next-track.md](./react-next-track.md) |`)
  lines.push('')
  lines.push(`---`)
  lines.push('')
  lines.push(`## Chẩn đoán plan cũ (v1)`)
  lines.push('')
  lines.push(`| Vấn đề | Hệ quả | Cách v2 xử lý |`)
  lines.push(`|---|---|---|`)
  lines.push(`| Docs-heavy, code spike muộn (Day 27–28) | Yếu live coding / React hands-on | Lab React mỗi ngày từ Day 1; spike sớm hơn về mặt kỹ năng |`)
  lines.push(`| Không có Algorithms | Rớt coding round | 15–25′ Algo/ngày + mock Day 24/30 |`)
  lines.push(`| React/Next mỏng (đối chiếu giấy) | Vue specialist thiếu depth | Track React/Next riêng + KB \`react.md\`/\`nextjs.md\` |`)
  lines.push(`| Thiếu ngày JS/TS/CSS nền | Hổng câu hỏi fundamentals | Tuần 1 nhúng JS/TS; tuần 2 CSS/a11y |`)
  lines.push(`| Timebox 60–90′ | Không đủ 3 track | Nâng 90–120′ (có dual-track skip rule) |`)
  lines.push(`| Copy “không có file React” | Lệch repo thực tế | Trỏ đúng KB React/Next đã có |`)
  lines.push('')
  lines.push(`**Giữ từ v1:** Capstone Customer Verification, worksheets, DoD, Feature Template, vòng Product→Arch→Quality→Ship.`)
  lines.push('')
  lines.push(`---`)
  lines.push('')
  lines.push(`## Cách học mỗi ngày (bắt buộc 4 khối)`)
  lines.push('')
  lines.push(`1. **FE Craft / Capstone** (30–40′) — artifact worksheet`)
  lines.push(`2. **React / Next Lab** (25–35′) — code chạy được trong lab repo`)
  lines.push(`3. **Algo Drill** (15–25′) — TypeScript, ghi pattern + Big-O`)
  lines.push(`4. **Checkpoint** — tự tick trước khi mark Day done`)
  lines.push('')
  lines.push(`**Escape hatch:** nếu chỉ có 75′, ưu tiên thứ tự **Checkpoint-critical**: Craft → React lab → Algo (skip polish). Không skip React 2 ngày liên tiếp.`)
  lines.push('')
  lines.push(`### Setup lab (chốt Day 6)`)
  lines.push('')
  lines.push('```bash')
  lines.push('npm create vite@latest fe-react-lab -- --template react-ts')
  lines.push('npx create-next-app@latest fe-next-lab')
  lines.push('```')
  lines.push('')
  lines.push(`---`)
  lines.push('')
  lines.push(`## Luồng tháng`)
  lines.push('')
  lines.push('```mermaid')
  lines.push('flowchart LR')
  lines.push('  W1["Tuần 1<br/>Foundations + Product<br/>JS/TS + React basics + Hash algo"] --> W2["Tuần 2<br/>Architecture + React<br/>State/A11y + pointers/window"]')
  lines.push('  W2 --> W3["Tuần 3<br/>Quality + Next.js<br/>API/Sec/Perf + tree/graph/DP"]')
  lines.push('  W3 --> W4["Tuần 4<br/>Test + Spikes + Mock algo"]')
  lines.push('  W4 --> W5["Tuần 5<br/>DoD + Full mock"]')
  lines.push('```')
  lines.push('')
  lines.push(`| Tuần | Theme | Capstone | React/Next | Algo |`)
  lines.push(`|---|---|---|---|---|`)
  lines.push(`| **1** | Foundations + Product | Flow, UI, forms, table, AC, work plan, kickoff | Mental model → hooks → forms → lists → lab setup | HashMap / Set / Stack intro |`)
  lines.push(`| **2** | Architecture + A11y | Tree, state, types, DS, responsive, modal, keyboard | Smart/dumb, Context, reducer, compound, portal | Binary search, two pointers, sliding window, LL |`)
  lines.push(`| **3** | Quality + Next | API, errors, security, race, perf, obs, CI | React Query, ErrorBoundary, memo, **App Router**, cache | BFS/DFS, islands, DP lite |`)
  lines.push(`| **4** | Test + Ship | Test plan, E2E, AI, review, **Vue+React spikes** | RTL, MSW, Server Actions, Next Capstone page | DP review + live sim |`)
  lines.push(`| **5** | Close | DoD + mock | Polish + interview Q bank | Flashcards + live in mock |`)
  lines.push('')
  lines.push(`### Calendar`)
  lines.push('')
  lines.push(`| Day | Ngày | Chủ đề |`)
  lines.push(`|---:|---|---|`)
  for (const d of CURRICULUM) {
    lines.push(`| ${d.day} | ${d.date} | ${d.theme} |`)
  }
  lines.push('')
  lines.push(`---`)
  lines.push('')

  const byWeek = weekSections()
  for (const [week, days] of byWeek) {
    const label = WEEK_LABELS[week] || `Tuần ${week}`
    const start = days[0].date
    const end = days[days.length - 1].date
    lines.push(`# ${label} (${start} – ${end})`)
    lines.push('')
    for (const d of days) {
      const anchor = `day-${d.day}`
      lines.push(`### Day ${d.day} — ${d.date} · ${d.theme}`)
      lines.push('')
      lines.push(`**Mục tiêu:** ${esc(d.goal)}`)
      lines.push('')
      lines.push(`**Đọc**`)
      for (const r of d.reads) lines.push(`- ${r}`)
      lines.push('')
      lines.push(`**1) FE Craft / Capstone**`)
      lines.push(`- ${esc(d.craft)}`)
      lines.push('')
      lines.push(`**2) React / Next Lab**`)
      lines.push(`- ${esc(d.react)}`)
      lines.push('')
      lines.push(`**3) Algo Drill**`)
      lines.push(`- ${esc(d.algo)}`)
      lines.push('')
      lines.push(`**Checkpoint (xong Day ${d.day} khi)**`)
      lines.push(`- ${esc(d.checkpoint)}`)
      lines.push('')
      lines.push(`**Artifact:** [\`${d.worksheet}\`](./${d.worksheet}) · Starter: [\`${d.starter}\`](./${d.starter})`)
      lines.push('')
      lines.push(`---`)
      lines.push('')
    }
  }

  lines.push(`## Definition of success sau Day 30`)
  lines.push('')
  lines.push(`- [ ] Kể được Capstone 10–15′ có trade-offs`)
  lines.push(`- [ ] Demo spike Vue + React/Next cùng slice`)
  lines.push(`- [ ] Tự giải ≥12 bài Easy/Medium đúng pattern (hash→DP lite)`)
  lines.push(`- [ ] Trả lời được hooks rules, RSC vs client, controlled inputs, Error Boundary limits`)
  lines.push(`- [ ] Có weak-topic list + kế hoạch 7 ngày tiếp`)
  lines.push('')

  return lines.join('\n')
}

function buildDailyIndex() {
  const lines = []
  lines.push(`# Daily index v2 — 30 ngày (03/10 → 01/11/2026)`)
  lines.push('')
  lines.push(`Plan đầy đủ: [30-day-study-plan.md](./30-day-study-plan.md) · [algorithms-track.md](./algorithms-track.md) · [react-next-track.md](./react-next-track.md) · Capstone: [capstone-brief.md](./capstone-brief.md)`)
  lines.push('')
  lines.push(`| Day | Ngày | Chủ đề | Starter | Worksheet |`)
  lines.push(`|---:|---|---|---|---|`)
  for (const d of CURRICULUM) {
    lines.push(
      `| ${d.day} | ${d.date} | ${d.theme} | [${d.starter}](./${d.starter}) | [${d.worksheet}](./${d.worksheet}) |`,
    )
  }
  lines.push('')
  lines.push(`## Capstone deliverables`)
  lines.push('')
  lines.push(`Xem [capstone-brief.md](./capstone-brief.md); files dưới [\`artifacts/capstone/\`](./artifacts/capstone/).`)
  lines.push('')
  return lines.join('\n')
}

function buildStarter(d) {
  const n = String(d.day).padStart(2, '0')
  return `# Bắt đầu đây — Day ${d.day} (${d.date})

**Timebox:** 90–120 phút · ${d.theme}

## Làm theo thứ tự (4 khối)

1. Mở **worksheet** và làm khối FE Craft:  
   → [\`${d.worksheet}\`](./${d.worksheet})
2. **React / Next Lab** (chi tiết trong worksheet + plan):  
   ${esc(d.react)}
3. **Algo Drill** (xem [algorithms-track.md](./algorithms-track.md)):  
   ${esc(d.algo)}
4. Tự tick **Checkpoint** trong worksheet trước khi mark done.

## Đọc nhanh

${d.reads.map((r) => `- ${r}`).join('\n')}

## Links

- Plan Day ${d.day}: [30-day-study-plan.md](./30-day-study-plan.md)
- React track: [react-next-track.md](./react-next-track.md)
- Algo track: [algorithms-track.md](./algorithms-track.md)

**Xong Day ${d.day} khi:** ${esc(d.checkpoint)}
`
}

const TRACK_MARKER_START = '<!-- PLAN_V2_TRACKS_START -->'
const TRACK_MARKER_END = '<!-- PLAN_V2_TRACKS_END -->'

function trackLinks(worksheetRel) {
  const depth = worksheetRel.split('/').length - 1 // artifacts/x.md -> 1; artifacts/capstone/x.md -> 2
  const prefix = '../'.repeat(depth)
  return {
    react: `${prefix}react-next-track.md`,
    algo: `${prefix}algorithms-track.md`,
  }
}

function tracksBlock(d) {
  const links = trackLinks(d.worksheet)
  return `${TRACK_MARKER_START}
## Plan v2 — React / Next Lab

**Timebox:** 25–35′ · Chi tiết track: [react-next-track.md](${links.react})

${esc(d.react)}

### Lab log

- Repo / path:
- Commands chạy được:
- So sánh với Vue (3–5 dòng):

> 

---

## Plan v2 — Algo Drill

**Timebox:** 15–25′ · [algorithms-track.md](${links.algo})

**Bài:** ${esc(d.algo)}

| Mục | Ghi |
|---|---|
| Pattern | |
| Time / Space | |
| Edge cases đã test | |
| Lỗi hay gặp / học được | |

Code (dán hoặc link \`artifacts/algo/day-${String(d.day).padStart(2, '0')}.ts\`):

\`\`\`ts
// ...
\`\`\`

---

## Plan v2 — Checkpoint

**Mục tiêu ngày:** ${esc(d.goal)}

- [ ] ${esc(d.checkpoint)}
- [ ] FE Craft / Capstone phần chính đã ghi vào worksheet
- [ ] React/Next lab chạy được (hoặc ghi blocker rõ)
- [ ] Algo có lời giải + Big-O

${TRACK_MARKER_END}
`
}

function patchWorksheet(filePath, d) {
  let text = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : ''
  const block = tracksBlock(d)

  if (text.includes(TRACK_MARKER_START)) {
    text = text.replace(
      new RegExp(`${TRACK_MARKER_START}[\\s\\S]*?${TRACK_MARKER_END}`, 'm'),
      block.trim(),
    )
  } else {
    // Upgrade stale "no React file" hints
    text = text.replace(
      /\*\(không có path repo\)\*/g,
      '[`documents/vi/react.md`](../../../../documents/vi/react.md) / [`documents/vi/nextjs.md`](../../../../documents/vi/nextjs.md)',
    )
    text = text.replace(
      /Repo \*\*không có\*\* file React[^\n]*/g,
      'Dùng KB React/Next trong repo (`documents/vi/react.md`, `nextjs.md`, `state-management-react.md`)',
    )
    // Soft-update timebox mentions
    text = text.replace(/60–90 phút/g, '90–120 phút')
    text = text.replace(/60–90′/g, '90–120′')
    if (!text.endsWith('\n')) text += '\n'
    text += '\n' + block
  }

  // Ensure header mentions v2 tracks once
  if (!text.includes('Plan v2 tracks:')) {
    text = text.replace(
      /^(# .+)\n/,
      `$1\n\n> Plan v2 tracks: React/Next lab + Algo drill + Checkpoint nằm ở cuối file.\n`,
    )
  }

  fs.writeFileSync(filePath, text)
}

function buildDaysConstant() {
  const rows = CURRICULUM.map((d) => {
    return `  { day: ${d.day}, date: '${d.date}', theme: '${d.theme.replace(/'/g, "\\'")}', week: ${d.week}, starter: '${d.starter}', worksheet: '${d.worksheet}' },`
  }).join('\n')

  return `export type DayMeta = {
  day: number
  date: string
  theme: string
  week: number
  starter: string
  worksheet: string
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

function main() {
  fs.writeFileSync(path.join(ROOT, '30-day-study-plan.md'), buildMasterPlan())
  fs.writeFileSync(path.join(ROOT, 'daily-index.md'), buildDailyIndex())

  for (const d of CURRICULUM) {
    fs.writeFileSync(path.join(ROOT, d.starter), buildStarter(d))
    const ws = path.join(ROOT, d.worksheet)
    if (!fs.existsSync(ws)) {
      console.warn('missing worksheet, creating stub:', d.worksheet)
      fs.mkdirSync(path.dirname(ws), { recursive: true })
      fs.writeFileSync(
        ws,
        `# Day ${d.day} — ${d.theme}\n\n**Ngày:** ${d.date}\n\n## FE Craft\n\n${d.craft}\n`,
      )
    }
    patchWorksheet(ws, d)
  }

  const daysConst = path.join(
    ROOT,
    '../../../src/modules/study-plan/constants/days.constant.ts',
  )
  fs.writeFileSync(path.resolve(ROOT, daysConst), buildDaysConstant())

  fs.mkdirSync(path.join(ROOT, 'artifacts/algo'), { recursive: true })
  fs.writeFileSync(
    path.join(ROOT, 'artifacts/algo/README.md'),
    `# Algo solutions (optional)\n\nĐặt file \`day-NN.ts\` cho từng ngày. Hoặc dán code vào section Algo trong worksheet.\n`,
  )

  console.log('Generated plan v2 for', CURRICULUM.length, 'days')
}

main()
