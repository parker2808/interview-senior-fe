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
    'lab',
  ])
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

if (errors.length) {
  console.error(`Content validation failed (${errors.length} issue(s)):`)
  for (const error of errors.slice(0, 80)) console.error(` - ${error}`)
  if (errors.length > 80) console.error(` - …and ${errors.length - 80} more`)
  process.exit(1)
}

console.log(`Content OK (${root})`)
