#!/usr/bin/env node
/**
 * Fail the process if any Localized object is missing a non-empty `en` or `vi`.
 * Also checks required document / plan / Q&A shapes.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(
  process.env.CONTENT_DIR ||
    process.argv[2] ||
    path.join(path.dirname(fileURLToPath(import.meta.url)), '../.data/content'),
)

const errors = []

function fail(pathHint, message) {
  errors.push(`${pathHint}: ${message}`)
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch (err) {
    fail(file, `invalid JSON (${err instanceof Error ? err.message : err})`)
    return null
  }
}

function walkLocalized(value, pathHint) {
  if (Array.isArray(value)) {
    value.forEach((item, i) => walkLocalized(item, `${pathHint}[${i}]`))
    return
  }
  if (!value || typeof value !== 'object') return

  const keys = Object.keys(value)
  const hasLocaleKey = keys.includes('en') || keys.includes('vi')
  const extraKeys = keys.filter((key) => key !== 'en' && key !== 'vi')
  const localeValuesAreStrings =
    (!keys.includes('en') || typeof value.en === 'string' || value.en == null) &&
    (!keys.includes('vi') || typeof value.vi === 'string' || value.vi == null)

  if (hasLocaleKey && localeValuesAreStrings) {
    if (typeof value.en !== 'string') fail(pathHint, 'missing `en`')
    if (typeof value.vi !== 'string') fail(pathHint, 'missing `vi`')
    const en = String(value.en ?? '')
    const vi = String(value.vi ?? '')
    // Both empty is allowed (spacer table headers). One-sided empty is not.
    if (en.trim() || vi.trim()) {
      if (!en.trim()) fail(pathHint, 'missing non-empty `en`')
      if (!vi.trim()) fail(pathHint, 'missing non-empty `vi`')
    }
    for (const key of extraKeys) {
      walkLocalized(value[key], `${pathHint}.${key}`)
    }
    return
  }

  for (const [key, child] of Object.entries(value)) {
    walkLocalized(child, `${pathHint}.${key}`)
  }
}

function listJsonFiles(dir) {
  if (!existsSync(dir)) return []
  const out = []
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name)
    const stat = statSync(full)
    if (stat.isDirectory()) out.push(...listJsonFiles(full))
    else if (name.endsWith('.json')) out.push(full)
  }
  return out
}

function requireShape(file, value, fields) {
  if (!value) return
  for (const field of fields) {
    if (value[field] == null) fail(file, `missing required field \`${field}\``)
  }
}

if (!existsSync(root)) {
  console.error(`Content directory not found: ${root}`)
  process.exit(1)
}

const kbDir = path.join(root, 'knowledge-base')
const dayDir = path.join(root, 'plan/days')
const resourceDir = path.join(root, 'plan/resources')
const qnaDir = path.join(root, 'qna')

const kbFiles = listJsonFiles(kbDir).filter(
  (file) => path.basename(file) !== 'index.json',
)
if (kbFiles.length < 1) fail(kbDir, 'no knowledge-base documents')

for (const file of kbFiles) {
  const doc = readJson(file)
  if (!doc) continue
  requireShape(file, doc, [
    'slug',
    'title',
    'summary',
    'category',
    'order',
    'sections',
  ])
  if (!Array.isArray(doc.sections) || !doc.sections.length) {
    fail(file, 'sections must be a non-empty array')
  }
  walkLocalized(doc, path.relative(root, file))
}

const dayFiles = listJsonFiles(dayDir)
if (dayFiles.length !== 30) {
  fail(dayDir, `expected 30 day files, found ${dayFiles.length}`)
}
for (const file of dayFiles) {
  const day = readJson(file)
  if (!day) continue
  requireShape(file, day, [
    'day',
    'title',
    'goal',
    'studyLinks',
    'questionLinks',
    'handsOn',
    'algorithm',
    'checklist',
  ])
  // Lab content is retired: `lab` may be omitted, or kept as a stub with empty sections.
  if (day.lab != null) {
    if (typeof day.lab !== 'object' || Array.isArray(day.lab)) {
      fail(file, '`lab` must be an object when present')
    } else if (!Array.isArray(day.lab.sections)) {
      fail(file, '`lab.sections` must be an array (may be empty)')
    }
  }
  walkLocalized(day, path.relative(root, file))
}

for (const file of listJsonFiles(resourceDir)) {
  const resource = readJson(file)
  if (!resource) continue
  requireShape(file, resource, ['id', 'title', 'sections'])
  walkLocalized(resource, path.relative(root, file))
}

const categories = readJson(path.join(qnaDir, 'categories.json'))
const questions = readJson(path.join(qnaDir, 'questions.json'))
if (categories) {
  if (!Array.isArray(categories.categories) || !categories.categories.length) {
    fail(path.join(qnaDir, 'categories.json'), 'categories[] is empty')
  }
  walkLocalized(categories, 'qna/categories.json')
}
if (questions) {
  if (!Array.isArray(questions.questions) || !questions.questions.length) {
    fail(path.join(qnaDir, 'questions.json'), 'questions[] is empty')
  }
  walkLocalized(questions, 'qna/questions.json')
} else {
  fail(path.join(qnaDir, 'questions.json'), 'missing Q&A bank')
}

const meta = readJson(path.join(root, 'plan/meta.json'))
if (meta) walkLocalized(meta, 'plan/meta.json')

function validatePracticeDesign() {
  const indexFile = path.join(root, 'practice/design/index.json')
  if (!existsSync(indexFile)) return

  const index = readJson(indexFile)
  if (!index) return
  requireShape(indexFile, index, ['version', 'specPath', 'title', 'intro', 'screens'])
  walkLocalized(index, 'practice/design/index.json')
  if (index.version !== 1) fail(indexFile, '`version` must be 1')
  if (typeof index.specPath !== 'string' || !index.specPath.trim()) {
    fail(indexFile, '`specPath` must be a non-empty string')
  }
  if (!Array.isArray(index.screens)) {
    fail(indexFile, '`screens` must be an array')
    return
  }
  if (index.figma != null) {
    const hint = 'practice/design/index.json.figma'
    if (typeof index.figma !== 'object' || Array.isArray(index.figma)) {
      fail(hint, '`figma` must be an object when present')
    } else {
      requireShape(hint, index.figma, ['url', 'label', 'note'])
      const url = String(index.figma.url || '').trim()
      if (!/^https?:\/\//i.test(url)) {
        fail(hint, '`url` must be an http(s) URL')
      }
    }
  }
  const seen = new Set()
  for (const [i, screen] of index.screens.entries()) {
    const hint = `practice/design/index.json.screens[${i}]`
    requireShape(hint, screen, [
      'id',
      'file',
      'title',
      'caption',
      'group',
      'theme',
      'viewport',
      'specRefs',
      'width',
      'height',
    ])
    if (screen?.id) {
      if (seen.has(screen.id)) fail(hint, `duplicate id \`${screen.id}\``)
      seen.add(screen.id)
    }
    if (screen?.group !== 'public' && screen?.group !== 'admin') {
      fail(hint, '`group` must be public|admin')
    }
    if (screen?.theme !== 'light' && screen?.theme !== 'dark') {
      fail(hint, '`theme` must be light|dark')
    }
    if (screen?.viewport !== 'desktop' && screen?.viewport !== 'mobile') {
      fail(hint, '`viewport` must be desktop|mobile')
    }
    if (!Array.isArray(screen?.specRefs)) {
      fail(hint, '`specRefs` must be an array of strings')
    } else {
      for (const [ri, ref] of screen.specRefs.entries()) {
        if (typeof ref !== 'string' || !ref.trim()) {
          fail(hint, `specRefs[${ri}] must be a non-empty string`)
        }
      }
    }
    const width = Number(screen?.width)
    const height = Number(screen?.height)
    if (!Number.isInteger(width) || width < 1) fail(hint, '`width` must be a positive integer')
    if (!Number.isInteger(height) || height < 1) fail(hint, '`height` must be a positive integer')
    const file = String(screen?.file || '')
    if (!file.startsWith('practice/design/screens/') || !file.toLowerCase().endsWith('.webp')) {
      fail(hint, '`file` must be a .webp under practice/design/screens/')
    } else if (!existsSync(path.join(root, file))) {
      fail(hint, `missing screen file ${file}`)
    }
  }

  validateDesignSpecPair(String(index.specPath || '').trim())
}

function specSectionIdsFromMarkdown(markdown) {
  const ids = []
  for (const line of String(markdown || '').split(/\r?\n/)) {
    const match = line.match(/^#{1,6}\s+(\d+(?:\.\d+)*[a-z]?)\b/i)
    if (match) ids.push(match[1].toLowerCase())
  }
  for (const match of String(markdown || '').matchAll(
    /<h[1-6][^>]*>(\d+(?:\.\d+)*[a-z]?)\b/gi,
  )) {
    const id = match[1].toLowerCase()
    if (!ids.includes(id)) ids.push(id)
  }
  return ids
}

function specHtmlAnchorIds(markdown) {
  return [...String(markdown || '').matchAll(/<h[1-6][^>]*\sid=["'](s-[^"']+)["']/gi)].map(
    (match) => match[1].toLowerCase(),
  )
}

function expectedSpecAnchor(sectionId) {
  return `s-${String(sectionId).toLowerCase().replace(/\./g, '-')}`
}

function validateDesignSpecPair(specPath) {
  if (!specPath) return
  const enFile = path.join(root, specPath)
  if (!existsSync(enFile)) return
  const enMarkdown = readFileSync(enFile, 'utf8')
  const enIds = specSectionIdsFromMarkdown(enMarkdown)
  const enAnchors = new Set(specHtmlAnchorIds(enMarkdown))
  for (const id of enIds) {
    const anchor = expectedSpecAnchor(id)
    if (!enAnchors.has(anchor) && !enMarkdown.includes(`id="${anchor}"`)) {
      /* markdown `## N.M` headings get `s-…` ids in the app renderer */
    }
  }
  const viRel = specPath.replace(/\.md$/i, '.vi.md')
  const viFile = path.join(root, viRel)
  if (!existsSync(viFile)) return
  const viMarkdown = readFileSync(viFile, 'utf8')
  const viIds = specSectionIdsFromMarkdown(viMarkdown)
  const viAnchors = new Set(specHtmlAnchorIds(viMarkdown))
  const enSet = new Set(enIds)
  const viSet = new Set(viIds)
  for (const id of enSet) {
    if (!viSet.has(id)) {
      fail(viRel, `missing numbered heading ${id} (must match the English spec)`)
    }
    const anchor = expectedSpecAnchor(id)
    if (
      (enAnchors.has(anchor) || enMarkdown.includes(`id="${anchor}"`)) &&
      !viAnchors.has(anchor) &&
      !viMarkdown.includes(`id="${anchor}"`)
    ) {
      fail(viRel, `missing explicit id="${anchor}" for §${id}`)
    }
  }
  for (const id of viSet) {
    if (!enSet.has(id)) {
      fail(viRel, `extra numbered heading ${id} (must match the English spec)`)
    }
  }
}

function validatePracticeTree() {
  const practiceDir = path.join(root, 'practice')
  if (!existsSync(practiceDir)) {
    validatePracticeDesign()
    return
  }

  const practiceMeta = existsSync(path.join(practiceDir, 'meta.json'))
    ? readJson(path.join(practiceDir, 'meta.json'))
    : null
  const practiceIndex = existsSync(path.join(practiceDir, 'index.json'))
    ? readJson(path.join(practiceDir, 'index.json'))
    : null
  const stepDir = path.join(practiceDir, 'steps')
  const stepFiles = listJsonFiles(stepDir)
  const hasStepsTree = Boolean(practiceMeta || practiceIndex || stepFiles.length)

  if (!hasStepsTree) {
    validatePracticeDesign()
    return
  }

  if (!practiceMeta) {
    fail(path.join(practiceDir, 'meta.json'), 'missing practice/meta.json')
    validatePracticeDesign()
    return
  }
  requireShape(path.join(practiceDir, 'meta.json'), practiceMeta, [
    'version',
    'title',
    'intro',
    'specPath',
    'milestones',
  ])
  walkLocalized(practiceMeta, 'practice/meta.json')

  if (!Array.isArray(practiceMeta.milestones) || !practiceMeta.milestones.length) {
    fail('practice/meta.json', 'milestones[] is empty')
  }

  const expectedIds = []
  for (const [i, milestone] of (practiceMeta.milestones || []).entries()) {
    const hint = `practice/meta.json.milestones[${i}]`
    requireShape(hint, milestone, ['id', 'title', 'goal', 'outcome', 'steps'])
    if (!Array.isArray(milestone?.steps)) {
      fail(hint, '`steps` must be an array')
      continue
    }
    for (const id of milestone.steps) {
      if (!/^p\d{2}$/.test(id)) fail(hint, `invalid step id \`${id}\``)
      expectedIds.push(id)
    }
  }

  if (practiceIndex) {
    requireShape(path.join(practiceDir, 'index.json'), practiceIndex, [
      'version',
      'title',
      'intro',
      'milestones',
      'steps',
    ])
    walkLocalized(practiceIndex, 'practice/index.json')
  }

  if (!stepFiles.length) fail(stepDir, 'no practice step files')

  const seen = new Set()
  for (const file of stepFiles) {
    const step = readJson(file)
    if (!step) continue
    requireShape(file, step, [
      'kind',
      'id',
      'milestone',
      'order',
      'title',
      'summary',
      'estimateMin',
      'prereqs',
      'tags',
      'concepts',
      'kbLinks',
      'questionLinks',
      'specRefs',
      'tasks',
      'doneWhen',
      'pitfalls',
      'commit',
    ])
    walkLocalized(step, path.relative(root, file))
    if (step.kind !== 'practice-step') {
      fail(file, '`kind` must be `practice-step`')
    }
    if (!/^p\d{2}$/.test(String(step.id || ''))) {
      fail(file, '`id` must match ^p\\d{2}$')
    }
    const basename = path.basename(file, '.json')
    if (step.id && basename !== step.id) {
      fail(file, `filename ${basename}.json does not match id ${step.id}`)
    }
    if (step.id) seen.add(step.id)
    const estimate = Number(step.estimateMin)
    if (!Number.isInteger(estimate) || estimate < 30 || estimate > 300) {
      fail(file, '`estimateMin` must be an integer between 30 and 300')
    }
    const len = (value) => (Array.isArray(value) ? value.length : -1)
    if (len(step.concepts) < 2 || len(step.concepts) > 5) {
      fail(file, '`concepts` must have 2–5 items')
    }
    if (len(step.kbLinks) > 3) fail(file, '`kbLinks` must have 0–3 items')
    if (len(step.questionLinks) > 3) {
      fail(file, '`questionLinks` must have 0–3 items')
    }
    if (len(step.tasks) < 3 || len(step.tasks) > 6) {
      fail(file, '`tasks` must have 3–6 items')
    }
    if (len(step.doneWhen) < 1 || len(step.doneWhen) > 4) {
      fail(file, '`doneWhen` must have 1–4 items')
    }
    if (len(step.pitfalls) < 1 || len(step.pitfalls) > 3) {
      fail(file, '`pitfalls` must have 1–3 items')
    }
    for (const [ti, task] of (step.tasks || []).entries()) {
      if (task?.code != null) {
        if (typeof task.code !== 'object' || Array.isArray(task.code)) {
          fail(file, `tasks[${ti}].code must be { lang, text }`)
        } else {
          if (typeof task.code.lang !== 'string') {
            fail(file, `tasks[${ti}].code.lang must be a string`)
          }
          if (typeof task.code.text !== 'string') {
            fail(file, `tasks[${ti}].code.text must be a string`)
          }
        }
      }
    }
  }

  for (const id of expectedIds) {
    if (!seen.has(id)) fail(stepDir, `missing step file ${id}.json`)
  }

  validatePracticeDesign()
}

validatePracticeTree()

if (errors.length) {
  console.error(`Content validation failed (${errors.length} issue(s)):`)
  for (const error of errors.slice(0, 80)) console.error(` - ${error}`)
  if (errors.length > 80) console.error(` - …and ${errors.length - 80} more`)
  process.exit(1)
}

console.log(`Content OK (${root})`)
