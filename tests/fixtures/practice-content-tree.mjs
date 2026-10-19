#!/usr/bin/env node
/**
 * Practice tree matching interview-fe-data `practice/` shape (D4).
 * p06 follows the spec example exactly on the English side.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const L = (en, vi = en) => ({ en, vi })
const pad = (n) => String(n).padStart(2, '0')

export const PRACTICE_MILESTONES = [
  {
    id: 'm0',
    title: L('Groundwork', 'Nền tảng'),
    goal: L('Repo, tooling, and a running database.', 'Repo, tooling và database chạy được.'),
    outcome: L('You can boot the stack locally.', 'Chạy được stack trên máy.'),
    steps: ['p01', 'p02', 'p03', 'p04'],
  },
  {
    id: 'm1',
    title: L('First API', 'API đầu tiên'),
    goal: L('Schema, migrate, seed, and a first endpoint.', 'Schema, migrate, seed và endpoint đầu.'),
    outcome: L('Prisma is the source of truth for tables.', 'Prisma là nguồn sự thật cho bảng.'),
    steps: ['p05', 'p06', 'p07', 'p08', 'p09'],
  },
  {
    id: 'm2',
    title: L('Content graph', 'Đồ thị nội dung'),
    goal: L('Model documents, links, and search.', 'Model tài liệu, liên kết và tìm kiếm.'),
    outcome: L('Content is queryable as a graph.', 'Nội dung truy vấn được như đồ thị.'),
    steps: ['p10', 'p11', 'p12', 'p13', 'p14'],
  },
  {
    id: 'm3',
    title: L('Write side', 'Phía ghi'),
    goal: L('Create and update without corrupting reads.', 'Tạo/sửa mà không làm hỏng phía đọc.'),
    outcome: L('Writes are explicit and auditable.', 'Ghi rõ ràng, kiểm tra được.'),
    steps: ['p15', 'p16', 'p17'],
  },
  {
    id: 'm4',
    title: L('Auth + admin', 'Auth + admin'),
    goal: L('Sessions, roles, and an admin surface.', 'Session, role và màn admin.'),
    outcome: L('Secrets never leak to the client.', 'Secret không lọt ra client.'),
    steps: ['p18', 'p19', 'p20', 'p21', 'p22'],
  },
  {
    id: 'm5',
    title: L('Realtime, media, publish', 'Realtime, media, publish'),
    goal: L('Live updates, uploads, and a publish switch.', 'Cập nhật live, upload và nút publish.'),
    outcome: L('Drafts stay private until publish.', 'Bản nháp kín đến khi publish.'),
    steps: ['p23', 'p24', 'p25'],
  },
  {
    id: 'm6',
    title: L('Quality', 'Chất lượng'),
    goal: L('Tests, observability, and failure modes.', 'Test, quan sát và failure mode.'),
    outcome: L('You can explain how you would measure it.', 'Giải thích được cách đo.'),
    steps: ['p26', 'p27', 'p28', 'p29'],
  },
  {
    id: 'm7',
    title: L('Ship', 'Ship'),
    goal: L('Deploy, rollback, and a demo path.', 'Deploy, rollback và lối demo.'),
    outcome: L('The app is on a URL you can share.', 'App có URL chia sẻ được.'),
    steps: ['p30', 'p31', 'p32', 'p33'],
  },
]

function milestoneFor(id) {
  return PRACTICE_MILESTONES.find((item) => item.steps.includes(id))?.id ?? 'm0'
}

function orderFor(id) {
  return Number(id.slice(1))
}

function genericConcepts(id) {
  return [
    {
      term: L(`Constraint ${id}`, `Constraint ${id}`),
      explain: L(
        `Name the limit you will not cross in ${id}.`,
        `Nêu giới hạn sẽ không vượt trong ${id}.`,
      ),
    },
    {
      term: L(`Failure mode ${id}`, `Failure mode ${id}`),
      explain: L(
        `Say what breaks first when ${id} is wrong.`,
        `Nói thứ hỏng trước khi ${id} sai.`,
      ),
    },
  ]
}

function genericTasks(id) {
  return [
    {
      title: L(`Sketch the boundary for ${id}`, `Phác boundary cho ${id}`),
      detail: L(
        `Write the input, output, and who owns ${id}.`,
        `Viết input, output và ai sở hữu ${id}.`,
      ),
    },
    {
      title: L(`Implement the thin path for ${id}`, `Làm đường mỏng cho ${id}`),
      detail: L(
        `Ship the smallest change that proves ${id} works.`,
        `Ship thay đổi nhỏ nhất chứng minh ${id} chạy.`,
      ),
    },
    {
      title: L(`Measure ${id}`, `Đo ${id}`),
      detail: L(
        `Pick one metric you would quote in an interview for ${id}.`,
        `Chọn một metric sẽ nêu khi phỏng vấn về ${id}.`,
      ),
    },
  ]
}

/** Spec example step — English fields match practice-shape.md exactly. */
export function fixturePracticeStepP06() {
  return {
    kind: 'practice-step',
    id: 'p06',
    milestone: 'm1',
    order: 6,
    title: L('Prisma schema, migrate, seed', 'Prisma schema, migrate, seed'),
    summary: L(
      'The schema file is the single source of truth for tables, and migrations are its history.',
      'File schema là nguồn sự thật duy nhất cho các bảng, và migration là lịch sử của nó.',
    ),
    estimateMin: 180,
    prereqs: ['p03', 'p05'],
    tags: ['prisma', 'mysql', 'migrations'],
    concepts: [
      {
        term: L('Schema as source of truth', 'Schema là nguồn sự thật'),
        explain: L(
          'Tables live in the Prisma schema, not in ad-hoc SQL you cannot replay.',
          'Bảng sống trong schema Prisma, không phải SQL rời không replay được.',
        ),
      },
      {
        term: L('Migration history', 'Lịch sử migration'),
        explain: L(
          'Each migrate commit is a replayable change, not a silent ALTER on prod.',
          'Mỗi commit migrate là thay đổi replay được, không phải ALTER lặng trên prod.',
        ),
      },
      {
        term: L('Seed data', 'Dữ liệu seed'),
        explain: L(
          'Seeds make the first query demoable without clicking an admin UI.',
          'Seed giúp query đầu demo được mà không cần bấm admin UI.',
        ),
      },
    ],
    kbLinks: [
      { slug: 'system-design', label: L('System design', 'System design') },
    ],
    questionLinks: [
      { id: 'self-intro', label: L('Self intro', 'Giới thiệu') },
    ],
    specRefs: ['§5.1'],
    tasks: [
      {
        title: L('Write the Prisma schema', 'Viết Prisma schema'),
        detail: L(
          'Declare the first tables in schema.prisma so they are the single source of truth.',
          'Khai báo bảng đầu trong schema.prisma để chúng là nguồn sự thật duy nhất.',
        ),
      },
      {
        title: L('Run the first migration', 'Chạy migration đầu'),
        detail: L(
          'Create the history file and apply it locally.',
          'Tạo file lịch sử và apply trên máy.',
        ),
        code: { lang: 'bash', text: 'pnpm prisma migrate dev --name init' },
      },
      {
        title: L('Seed one happy-path row', 'Seed một dòng happy-path'),
        detail: L(
          'Insert enough rows that GET /health-adjacent queries return data.',
          'Insert đủ dòng để query gần GET /health trả data.',
        ),
      },
    ],
    doneWhen: [
      L('schema.prisma describes the tables you query', 'schema.prisma mô tả bảng bạn query'),
      L('migrate history exists and seed runs', 'Có lịch sử migrate và seed chạy được'),
    ],
    pitfalls: [
      L(
        'Editing the live database and forgetting to commit the migration.',
        'Sửa database live rồi quên commit migration.',
      ),
      L(
        'Putting secrets in seed files that get committed.',
        'Nhét secret vào file seed rồi commit.',
      ),
    ],
    commit: 'feat(api): prisma schema + seed',
  }
}

export function fixturePracticeStep(id) {
  if (id === 'p06') return fixturePracticeStepP06()

  const milestone = milestoneFor(id)
  const order = orderFor(id)
  const diacritic =
    id === 'p02'
      ? {
          title: L('Query performance baseline', 'Hiệu năng truy vấn ban đầu'),
          summary: L(
            'Measure the first slow query before adding indexes.',
            'Đo truy vấn chậm đầu trước khi thêm index.',
          ),
          tags: ['performance', 'mysql'],
        }
      : null
  const prismaBodyOnly =
    id === 'p07'
      ? {
          title: L('First GET endpoint', 'Endpoint GET đầu'),
          summary: L(
            'Expose one read path that returns seeded rows.',
            'Mở một đường đọc trả dòng đã seed.',
          ),
          tags: ['http', 'express'],
          pitfalls: [
            L(
              'Returning the raw prisma client from the route handler.',
              'Trả raw prisma client từ route handler.',
            ),
            L(
              'Skipping pagination on the first list endpoint.',
              'Bỏ pagination ở endpoint list đầu.',
            ),
          ],
        }
      : null

  const extra = diacritic || prismaBodyOnly || {}
  return {
    kind: 'practice-step',
    id,
    milestone,
    order,
    title: extra.title || L(`Practice ${id}`, `Thực hành ${id}`),
    summary:
      extra.summary ||
      L(
        `Complete ${id} with a constraint, a failure mode, and a way to measure it.`,
        `Hoàn thành ${id} với constraint, failure mode và cách đo.`,
      ),
    estimateMin: id === 'p01' ? 60 : 45,
    prereqs: order > 1 ? [`p${pad(order - 1)}`] : [],
    tags: extra.tags || ['practice', id],
    concepts: genericConcepts(id),
    kbLinks: id === 'p01' ? [{ slug: 'javascript', label: L('JavaScript runtime') }] : [],
    questionLinks:
      id === 'p01' ? [{ id: 'self-intro', label: L('Self intro', 'Giới thiệu') }] : [],
    specRefs: id === 'p18' ? ['§5.2'] : [],
    tasks: genericTasks(id),
    doneWhen: [
      L(`You can demo ${id} out loud`, `Demo được ${id} thành tiếng`),
    ],
    pitfalls: extra.pitfalls || [
      L(`Treating ${id} as a tutorial instead of a decision.`, `Coi ${id} như tutorial thay vì quyết định.`),
    ],
    commit: `feat(practice): ${id}`,
  }
}

export function fixturePracticeMeta() {
  return {
    version: 1,
    title: L('Practice path', 'Lộ trình thực hành'),
    intro: L(
      'Build a small content API in milestones. Each step is a decision you can say out loud.',
      'Build một content API nhỏ theo milestone. Mỗi bước là quyết định nói được thành tiếng.',
    ),
    specPath: 'practice/SPEC.md',
    milestones: PRACTICE_MILESTONES,
  }
}

export function fixturePracticeIndex(steps = allPracticeSteps()) {
  const meta = fixturePracticeMeta()
  return {
    version: meta.version,
    title: meta.title,
    intro: meta.intro,
    milestones: meta.milestones,
    steps: steps.map(
      ({ id, milestone, order, title, summary, estimateMin, tags, prereqs }) => ({
        id,
        milestone,
        order,
        title,
        summary,
        estimateMin,
        tags,
        prereqs,
      }),
    ),
  }
}

export function allPracticeSteps() {
  return PRACTICE_MILESTONES.flatMap((milestone) =>
    milestone.steps.map((id) => fixturePracticeStep(id)),
  )
}

export function writePracticeFixture(dir) {
  const write = (rel, value) => {
    const file = path.join(dir, rel)
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
  }
  const steps = allPracticeSteps()
  write('practice/meta.json', fixturePracticeMeta())
  write('practice/index.json', fixturePracticeIndex(steps))
  for (const step of steps) write(`practice/steps/${step.id}.json`, step)
  return dir
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = path.resolve(process.argv[2] || '.data/fixture-content')
  writePracticeFixture(dir)
  console.log(`Wrote practice fixture → ${dir}`)
}
