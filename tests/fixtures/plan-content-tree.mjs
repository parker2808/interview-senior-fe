#!/usr/bin/env node
/**
 * Minimal interview-fe-data tree for tests and offline builds (the real repo is private).
 * Day 1 keeps the retired `lab` stub (empty sections); day 2 has no `lab` field at all.
 *
 *   node tests/fixtures/plan-content-tree.mjs /tmp/fe-data && CONTENT_LOCAL_PATH=/tmp/fe-data npm run build
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { writePracticeFixture } from './practice-content-tree.mjs'
import { writePracticeDesignFixture } from './practice-design-tree.mjs'

const L = (en, vi = en) => ({ en, vi })
const pad = (n) => String(n).padStart(2, '0')

export const NO_LAB_DAY = 2

export function labStub(n) {
  return {
    resourceId: `lab-day-${pad(n)}`,
    title: L(`Day ${n} — Lab`, `Ngày ${n} — Lab`),
    sections: [],
  }
}

export function fixtureDay(n) {
  const day = {
    kind: 'plan-day',
    day: n,
    week: Math.min(Math.ceil(n / 7), 5),
    title: L(`Day ${n} topic`, `Chủ đề ngày ${n}`),
    goal: L(`Goal for day ${n}`, `Mục tiêu ngày ${n}`),
    studyLinks: [
      { kind: 'docs', slug: 'javascript', label: L('JavaScript runtime') },
    ],
    questionLinks: [{ id: 'self-intro', label: L('Self intro', 'Giới thiệu') }],
    handsOn: [L(`Hands-on ${n}`, `Thực hành ${n}`)],
    algorithm: {
      resourceId: `algo-day-${pad(n)}`,
      label: L(`Algorithm ${n}`, `Thuật toán ${n}`),
    },
    checklist: [L('Explain the trade-off', 'Giải thích trade-off')],
  }
  if (n !== NO_LAB_DAY) day.lab = labStub(n)
  return day
}

const doc = {
  kind: 'knowledge-doc',
  slug: 'javascript',
  title: L('JavaScript runtime'),
  summary: L('Event loop basics.', 'Cơ bản event loop.'),
  category: 'core',
  order: 1,
  tags: ['js'],
  sections: [
    {
      id: L('event-loop'),
      title: L('Event loop'),
      blocks: [
        { type: 'paragraph', text: L('Microtasks run first.', 'Microtask chạy trước.') },
        {
          type: 'table',
          headers: [L('API'), L('Entity'), L('Notes', 'Ghi chú')],
          rows: [
            [
              L('`queueMicrotask`'),
              L('`SiteSettings`'),
              L(
                'Runs before the next macrotask and must not wrap identifiers.',
                'Chạy trước macrotask; không bẻ identifier.',
              ),
            ],
          ],
        },
      ],
    },
  ],
}

const systemDesignDoc = {
  kind: 'knowledge-doc',
  slug: 'system-design',
  title: L('System Design'),
  summary: L('How to talk through a system design interview.', 'Cách nói system design khi phỏng vấn.'),
  category: 'pro',
  order: 2,
  tags: ['design'],
  sections: [
    {
      id: L('overview'),
      title: L('Overview', 'Tổng quan'),
      blocks: [
        {
          type: 'paragraph',
          text: L(
            'Start from constraints, then APIs, then data.',
            'Bắt đầu từ constraint, rồi API, rồi data.',
          ),
        },
      ],
    },
  ],
}

const weeks = [1, 2, 3, 4, 5].map((week) => ({
  week,
  title: L(`Week ${week}`, `Tuần ${week}`),
  range: L(`Days ${week * 7 - 6}–${Math.min(week * 7, 30)}`),
  goal: L(`Week ${week} goal`, `Mục tiêu tuần ${week}`),
  outcomes: [L('Outcome', 'Kết quả')],
}))

const resources = [
  { id: 'plan', title: L('30-day overview', 'Tổng quan 30 ngày'), aliases: [] },
  { id: 'lab', title: L('Companion lab repo'), aliases: ['lab-repo.md'] },
  { id: 'algo', title: L('Algorithms track', 'Lộ trình thuật toán'), aliases: [] },
]

export function writeContentFixture(dir, options = {}) {
  const write = (rel, value) => {
    const file = path.join(dir, rel)
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
  }
  const toSummary = (item) => {
    const { kind: _kind, sections: _sections, ...summary } = item
    return { ...summary, headings: [] }
  }
  const jsSummary = toSummary(doc)
  const sdSummary = toSummary(systemDesignDoc)
  write('knowledge-base/javascript.json', doc)
  write('knowledge-base/system-design.json', systemDesignDoc)
  write('knowledge-base/index.json', {
    groups: [
      { id: 'core', order: 1, topics: [jsSummary] },
      { id: 'pro', order: 6, topics: [sdSummary] },
    ],
    docs: [jsSummary, sdSummary],
    defaultSlug: 'javascript',
  })
  write('qna/categories.json', {
    categories: [{ id: 'soft', title: L('Soft skills', 'Kỹ năng mềm'), blurb: L('About you', 'Về bạn') }],
  })
  write('qna/questions.json', {
    questions: [
      {
        id: 'self-intro',
        category: 'soft',
        tags: ['intro'],
        question: L('Introduce yourself', 'Giới thiệu bản thân'),
        answer: L(
          'Short and specific.\n\n| API | Entity | Notes |\n| --- | --- | --- |\n| `fetch` | `SiteSettings` | Keep identifiers intact. |',
          'Ngắn gọn, cụ thể.\n\n| API | Entity | Ghi chú |\n| --- | --- | --- |\n| `fetch` | `SiteSettings` | Giữ nguyên identifier. |',
        ),
      },
    ],
  })
  const days = Array.from({ length: 30 }, (_, i) => fixtureDay(i + 1))
  const meta = { weeks, gaps: [L('Gap', 'Khoảng trống')], resources }
  write('plan/meta.json', meta)
  write('plan/index.json', {
    ...meta,
    days: days.map(({ lab: _lab, kind: _k, ...rest }) => rest),
  })
  for (const day of days) write(`plan/days/day-${pad(day.day)}.json`, day)
  write('plan/resources/lab.json', {
    kind: 'plan-resource',
    id: 'lab',
    title: L('Lab retired', 'Lab đã ngừng'),
    aliases: ['lab-repo.md'],
    sections: [
      {
        id: L('retired'),
        title: L('Retired', 'Đã ngừng'),
        blocks: [{ type: 'paragraph', text: L('Lab content has been retired.', 'Nội dung Lab đã ngừng.') }],
      },
    ],
  })
  write('plan/resources/algo-day-01.json', {
    kind: 'plan-resource',
    id: 'algo-day-01',
    title: L('Algorithm 1', 'Thuật toán 1'),
    aliases: [],
    sections: [
      {
        id: L('problem'),
        title: L('Problem', 'Bài toán'),
        blocks: [{ type: 'paragraph', text: L('Two sum.', 'Two sum.') }],
      },
    ],
  })
  if (options.practice !== false) writePracticeFixture(dir)
  if (options.design !== false && options.practice !== false) {
    writePracticeDesignFixture(dir, options)
  } else if (options.design === true) {
    writePracticeDesignFixture(dir, options)
  }
  return dir
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = path.resolve(process.argv[2] || '.data/fixture-content')
  writeContentFixture(dir)
  console.log(`Wrote content fixture → ${dir}`)
}
