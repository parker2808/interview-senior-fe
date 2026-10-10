#!/usr/bin/env node
/**
 * One-off / repeatable dump of current repo content into the interview-fe-data layout.
 * Reads markdown + TS sources while they still exist in this app repo.
 */
import { readFileSync, existsSync, readdirSync, cpSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createJiti } from 'jiti'
import {
  markdownToDocBody,
  firstParagraph,
  fillMissingLocale,
} from './lib/md-to-blocks.mjs'
import { writeJson, emptyDir, padDay } from './lib/fs-utils.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.resolve(
  process.env.CONTENT_EXPORT_DIR || path.join(root, '.data/export'),
)

const DOC_GROUPS = [
  {
    id: 'core',
    order: 1,
    slugs: ['javascript', 'typescript', 'css-layout', 'web-apis'],
  },
  { id: 'vue', order: 2, slugs: ['vue3', 'nuxt', 'state-management'] },
  {
    id: 'react',
    order: 3,
    slugs: ['react', 'nextjs', 'state-management-react'],
  },
  {
    id: 'practices',
    order: 4,
    slugs: ['testing', 'performance', 'security', 'accessibility'],
  },
  { id: 'infra', order: 5, slugs: ['build-tools', 'networking', 'devops'] },
  {
    id: 'pro',
    order: 6,
    slugs: [
      'architecture',
      'system-design',
      'leadership',
      'practical-questions',
      'monitoring',
    ],
  },
]

const DOC_TITLES = {
  javascript: { en: 'JavaScript', vi: 'JavaScript' },
  typescript: { en: 'TypeScript', vi: 'TypeScript' },
  'css-layout': { en: 'CSS Layout', vi: 'CSS Layout' },
  'web-apis': { en: 'Browser & Web APIs', vi: 'Browser & Web APIs' },
  vue3: { en: 'Vue 3', vi: 'Vue 3' },
  nuxt: { en: 'Nuxt.js', vi: 'Nuxt.js' },
  'state-management': { en: 'State Management', vi: 'State Management' },
  react: { en: 'React', vi: 'React' },
  nextjs: { en: 'Next.js', vi: 'Next.js' },
  'state-management-react': {
    en: 'State Management (React)',
    vi: 'State Management (React)',
  },
  testing: { en: 'Testing', vi: 'Testing' },
  performance: { en: 'Performance', vi: 'Performance' },
  security: { en: 'Security', vi: 'Security' },
  accessibility: { en: 'Accessibility', vi: 'Accessibility' },
  'build-tools': { en: 'Build Tools', vi: 'Build Tools' },
  networking: { en: 'Networking', vi: 'Networking' },
  devops: { en: 'DevOps', vi: 'DevOps' },
  architecture: { en: 'Architecture', vi: 'Architecture' },
  'system-design': { en: 'System Design', vi: 'System Design' },
  leadership: { en: 'Leadership', vi: 'Leadership' },
  'practical-questions': { en: 'Practical Questions', vi: 'Practical Questions' },
  monitoring: { en: 'Monitoring', vi: 'Monitoring' },
}

const RESOURCE_DEFS = [
  {
    id: 'plan',
    title: { en: '30-day overview', vi: 'Tổng quan 30 ngày' },
    paths: ['30-day-study-plan.md'],
  },
  {
    id: 'index',
    title: { en: 'Daily index', vi: 'Daily index' },
    paths: ['daily-index.md'],
  },
  {
    id: 'lab',
    title: { en: 'Companion lab repo', vi: 'Companion lab repo' },
    paths: ['lab-repo.md'],
  },
  {
    id: 'react',
    title: { en: 'React / Next track', vi: 'React / Next track' },
    paths: ['react-next-track.md'],
  },
  {
    id: 'algo',
    title: { en: 'Algorithms track', vi: 'Algorithms track' },
    paths: ['algorithms-track.md'],
  },
  {
    id: 'context',
    title: { en: 'Project context', vi: 'Bối cảnh dự án' },
    paths: ['project-context.md'],
  },
  {
    id: 'feature',
    title: { en: 'Feature template', vi: 'Feature template' },
    paths: ['feature-template.md'],
  },
  {
    id: 'dod',
    title: { en: 'Definition of Done', vi: 'Definition of Done' },
    paths: ['definition-of-done.md'],
  },
  {
    id: 'selfcheck',
    title: { en: 'Self-check questions', vi: 'Self-check questions' },
    paths: ['self-check-questions.md'],
  },
]

function read(file) {
  return existsSync(file) ? readFileSync(file, 'utf8') : ''
}

function readPlanPair(relPath) {
  const contentRoot = path.join(root, 'modules/study-plan-30-days/content')
  const unprefixed = relPath.replace(/^(vi|en)\//, '')
  const en = read(path.join(contentRoot, 'en', unprefixed))
  const vi = read(path.join(contentRoot, 'vi', unprefixed))
  const fallback = read(path.join(contentRoot, unprefixed))
  return {
    en: en || fallback,
    vi: vi || fallback,
    sourcePath: unprefixed,
  }
}

function firstHeading(markdown, fallback) {
  const m = String(markdown || '').match(/^#\s+(.+)$/m)
  return m ? m[1].trim() : fallback
}

async function loadTs(rel) {
  const jiti = createJiti(import.meta.url, { interopDefault: true })
  return jiti(pathToFileURL(path.join(root, rel)).href)
}

function rewritePlanLink(link) {
  if (link.kind === 'docs') return link
  const resourceId = resourceIdFromPath(link.path)
  return {
    kind: 'plan',
    resourceId,
    path: link.path,
    label: link.label,
  }
}

function resourceIdFromPath(filePath) {
  const normalized = String(filePath || '')
    .replace(/^(vi|en)\//, '')
    .replace(/^\.\/+/, '')
  const resource = RESOURCE_DEFS.find((item) =>
    item.paths.includes(normalized),
  )
  if (resource) return resource.id
  const algo = normalized.match(
    /(?:^|\/)artifacts\/algo\/problems\/day-(\d+)\.md$/,
  )
  if (algo) return `algo-day-${algo[1]}`
  const lab = normalized.match(/(?:^|\/)lab\/day-(\d+)-lab\.md$/)
  if (lab) return `lab-day-${lab[1]}`
  return normalized.replace(/\.md$/, '').replace(/[^\w]+/g, '-')
}

function exportKnowledgeBase(stats) {
  const docs = []
  let order = 0
  for (const group of DOC_GROUPS) {
    for (const slug of group.slugs) {
      order += 1
      const en = read(path.join(root, 'documents/en', `${slug}.md`))
      const vi = read(path.join(root, 'documents/vi', `${slug}.md`))
      if (!en && !vi) {
        throw new Error(`Missing knowledge-base pair for ${slug}`)
      }
      const title = DOC_TITLES[slug] || { en: slug, vi: slug }
      const body = markdownToDocBody(en, vi, title)
      const summary = firstParagraph(body.sections.flatMap((s) => s.blocks))
      const doc = {
        kind: 'knowledge-doc',
        slug,
        title,
        summary,
        category: group.id,
        order,
        tags: [group.id, slug],
        sections: body.sections,
      }
      fillMissingLocale(doc)
      writeJson(path.join(outDir, 'knowledge-base', `${slug}.json`), doc)
      docs.push({
        slug,
        title,
        summary,
        category: group.id,
        order,
        tags: doc.tags,
        headings: body.headings,
      })
      stats.docs += 1
      if (body.fallback) stats.docFallbacks.push(slug)
    }
  }

  const groups = DOC_GROUPS.map((group) => ({
    id: group.id,
    order: group.order,
    topics: docs.filter((doc) => doc.category === group.id),
  }))
  writeJson(path.join(outDir, 'knowledge-base', 'index.json'), {
    groups,
    docs,
    defaultSlug: docs[0]?.slug || 'javascript',
  })
  return { groups, docs }
}

function exportResources(stats) {
  const summaries = []
  for (const def of RESOURCE_DEFS) {
    const pair = readPlanPair(def.paths[0])
    if (!pair.en && !pair.vi) {
      console.warn(`skip missing resource ${def.id} (${def.paths[0]})`)
      continue
    }
    const title = {
      en: firstHeading(pair.en, def.title.en),
      vi: firstHeading(pair.vi, def.title.vi),
    }
    const body = markdownToDocBody(pair.en, pair.vi, title)
    const resource = {
      kind: 'plan-resource',
      id: def.id,
      title: def.title,
      aliases: def.paths,
      sections: body.sections,
    }
    fillMissingLocale(resource)
    writeJson(path.join(outDir, 'plan/resources', `${def.id}.json`), resource)
    summaries.push({
      id: def.id,
      title: def.title,
      aliases: def.paths,
    })
    stats.resources += 1
    if (body.fallback) stats.resourceFallbacks.push(def.id)
  }

  for (let day = 1; day <= 30; day++) {
    const id = `algo-day-${padDay(day)}`
    const rel = `artifacts/algo/problems/day-${padDay(day)}.md`
    const pair = readPlanPair(rel)
    if (!pair.en && !pair.vi) continue
    const title = {
      en: firstHeading(pair.en, `Day ${padDay(day)} algorithm`),
      vi: firstHeading(pair.vi, `Thuật toán ngày ${padDay(day)}`),
    }
    const body = markdownToDocBody(pair.en, pair.vi, title)
    const algoResource = fillMissingLocale({
      kind: 'plan-resource',
      id,
      title,
      aliases: [rel],
      sections: body.sections,
    })
    writeJson(path.join(outDir, 'plan/resources', `${id}.json`), algoResource)
    summaries.push({ id, title, aliases: [rel] })
    stats.resources += 1
  }

  return summaries
}

function exportDays(planMod, daysMod, stats) {
  const days = []
  for (const meta of daysMod.DAYS) {
    const content = planMod.getPlanDayContent(meta.day)
    if (!content) throw new Error(`Missing PLAN_DAY_CONTENT for day ${meta.day}`)
    const labRel = meta.lab
    const labPair = readPlanPair(labRel)
    const labTitle = {
      en: firstHeading(labPair.en, `Day ${padDay(meta.day)} lab`),
      vi: firstHeading(labPair.vi, `Lab ngày ${padDay(meta.day)}`),
    }
    const labBody = markdownToDocBody(labPair.en, labPair.vi, labTitle)
    const day = {
      kind: 'plan-day',
      day: meta.day,
      date: meta.date,
      week: meta.week,
      title: content.title,
      goal: content.goal,
      studyLinks: content.studyLinks.map(rewritePlanLink),
      questionLinks: content.questionLinks,
      handsOn: content.handsOn,
      algorithm: {
        resourceId: `algo-day-${padDay(meta.day)}`,
        path: content.algorithm.path,
        label: content.algorithm.label,
      },
      checklist: content.checklist,
      ...(content.note ? { note: content.note } : {}),
      lab: {
        resourceId: `lab-day-${padDay(meta.day)}`,
        title: labTitle,
        sections: labBody.sections,
      },
    }
    fillMissingLocale(day)
    writeJson(
      path.join(outDir, 'plan/days', `day-${padDay(meta.day)}.json`),
      day,
    )
    const { lab, ...summary } = day
    days.push(summary)
    stats.days += 1
    if (labBody.fallback) stats.labFallbacks.push(meta.day)
  }
  return days
}

async function exportQna(stats) {
  const qna = await loadTs('server/data/interview-questions.ts')
  writeJson(path.join(outDir, 'qna', 'categories.json'), {
    categories: fillMissingLocale(qna.INTERVIEW_CATEGORIES),
  })
  writeJson(path.join(outDir, 'qna', 'questions.json'), {
    questions: fillMissingLocale(qna.INTERVIEW_QUESTIONS),
  })
  stats.questions = qna.INTERVIEW_QUESTIONS.length
  stats.categories = qna.INTERVIEW_CATEGORIES.length
}

async function main() {
  if (!existsSync(path.join(root, 'documents/en'))) {
    throw new Error(
      'Source markdown is gone. Re-run from a revision that still has documents/ and server/data/, or copy an existing export.',
    )
  }

  emptyDir(outDir)
  const stats = {
    docs: 0,
    days: 0,
    resources: 0,
    questions: 0,
    categories: 0,
    docFallbacks: [],
    resourceFallbacks: [],
    labFallbacks: [],
  }

  const planMod = await loadTs(
    'src/modules/study-plan/constants/plan-content.constant.ts',
  )
  const daysMod = await loadTs(
    'src/modules/study-plan/constants/days.constant.ts',
  )

  exportKnowledgeBase(stats)
  const resourceSummaries = exportResources(stats)
  const days = exportDays(planMod, daysMod, stats)
  await exportQna(stats)

  writeJson(path.join(outDir, 'plan', 'meta.json'), {
    weeks: planMod.PLAN_WEEKS,
    gaps: planMod.PLAN_GAPS,
    resources: RESOURCE_DEFS.map((def) => ({
      id: def.id,
      title: def.title,
      aliases: def.paths,
    })),
  })
  writeJson(path.join(outDir, 'plan', 'index.json'), {
    weeks: planMod.PLAN_WEEKS,
    gaps: planMod.PLAN_GAPS,
    resources: RESOURCE_DEFS.map((def) => ({
      id: def.id,
      title: def.title,
      aliases: def.paths,
    })),
    days,
  })

  copyStaticSeedFiles(outDir)
  if (existsSync(path.join(root, 'schema'))) {
    cpSync(path.join(root, 'schema'), path.join(outDir, 'schema'), {
      recursive: true,
    })
  }

  writeJson(path.join(outDir, 'manifest.json'), {
    generatedAt: new Date().toISOString(),
    source: 'interview-senior-fe migration',
    stats,
    extraResources: resourceSummaries.filter(
      (item) => !RESOURCE_DEFS.some((def) => def.id === item.id),
    ).length,
  })

  console.log(`Exported content → ${outDir}`)
  console.log(JSON.stringify(stats, null, 2))
}

function copyStaticSeedFiles(dest) {
  const here = path.dirname(fileURLToPath(import.meta.url))
  const seed = path.join(here, 'data-repo-seed')
  if (!existsSync(seed)) return
  for (const name of readdirSync(seed)) {
    cpSync(path.join(seed, name), path.join(dest, name), { recursive: true })
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
