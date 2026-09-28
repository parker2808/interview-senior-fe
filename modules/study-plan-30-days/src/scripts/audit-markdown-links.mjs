#!/usr/bin/env node
/**
 * Audit markdown links under module content/ against disk + classifyMarkdownHref.
 * Run from modules/study-plan-30-days/src: `node ./scripts/audit-markdown-links.mjs`
 */
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  classifyMarkdownHref,
  resolveRelative,
} from '../src/utils/markdownLinks.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../../..')
const contentRoot = path.resolve(__dirname, '../../content')
const documentsRoot = path.resolve(repoRoot, 'documents')

const LINK_RE = /\[[^\]]*]\(([^)]+)\)/g

async function walk(dir) {
  const out = []
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) out.push(...(await walk(full)))
    else if (ent.name.endsWith('.md')) out.push(full)
  }
  return out
}

function planPathFromAbs(abs) {
  return path.relative(contentRoot, abs).split(path.sep).join('/')
}

function diskExists(resolved) {
  if (
    resolved.startsWith('documents/') ||
    resolved === 'README.md' ||
    resolved === 'README-en.md' ||
    resolved === 'jd1.md'
  ) {
    return true // checked via repoRoot below
  }
  return false
}

async function fileExists(resolved) {
  const { access } = await import('node:fs/promises')
  const candidates = []
  if (
    resolved.startsWith('documents/') ||
    resolved === 'README.md' ||
    resolved === 'README-en.md' ||
    resolved === 'jd1.md' ||
    resolved.startsWith('modules/')
  ) {
    candidates.push(path.join(repoRoot, resolved))
  } else {
    candidates.push(path.join(contentRoot, resolved))
    candidates.push(path.join(repoRoot, resolved))
  }
  for (const c of candidates) {
    try {
      await access(c)
      return true
    } catch {
      /* try next */
    }
  }
  return false
}

/** Bundled set approximation for classify */
async function buildBundledSet() {
  const set = new Set()
  for (const f of await walk(contentRoot)) {
    set.add(planPathFromAbs(f))
  }
  for (const f of await walk(documentsRoot)) {
    set.add(path.relative(repoRoot, f).split(path.sep).join('/'))
  }
  return set
}

const bundled = await buildBundledSet()
const isBundled = (p) => bundled.has(p)

const files = await walk(contentRoot)
let ok = 0
const bad = []
const githubFallbacks = []

for (const file of files) {
  const fromPath = planPathFromAbs(file)
  const text = await readFile(file, 'utf8')
  for (const m of text.matchAll(LINK_RE)) {
    const href = m[1].trim()
    if (!href || href.startsWith('mailto:') || href.startsWith('#')) continue
    if (href.startsWith('http://') || href.startsWith('https://')) {
      ok++
      continue
    }
    if (href.includes('/workspace') || href.includes('cursor/stores')) {
      bad.push({ fromPath, href, reason: 'absolute-agent-path' })
      continue
    }
    const pathPart = href.split('#')[0]
    if (!pathPart) continue
    const resolved = resolveRelative(fromPath, pathPart)
    const classified = classifyMarkdownHref(fromPath, href, isBundled)
    if (classified.kind === 'plan') {
      if (!(await fileExists(classified.path))) {
        bad.push({ fromPath, href, reason: 'bundled-miss', resolved: classified.path })
      } else ok++
    } else if (classified.kind === 'github') {
      const repoPath = classified.url.replace(
        'https://github.com/parker2808/interview-senior-fe/blob/main/',
        '',
      ).split('#')[0]
      if (!(await fileExists(repoPath)) && !(await fileExists(resolved))) {
        bad.push({ fromPath, href, reason: 'github-miss', resolved, repoPath })
      } else {
        githubFallbacks.push({ fromPath, href, repoPath })
        ok++
      }
    } else {
      ok++
    }
  }
}

console.log(`markdown-link-audit: ok=${ok} bad=${bad.length} github_fallback=${githubFallbacks.length}`)
if (bad.length) {
  for (const b of bad.slice(0, 50)) {
    console.log('BAD', JSON.stringify(b))
  }
  process.exitCode = 1
} else {
  console.log('All content markdown links resolve (disk + classifier).')
}

// Focus sample: Day 1–3 starters + worksheets + daily-index + plan
const focus = [
  'day-01-starter.md',
  'day-02-starter.md',
  'day-03-starter.md',
  'artifacts/day-01-user-flow.md',
  'artifacts/day-02-ui-critique.md',
  'artifacts/day-03-form-states.md',
  'daily-index.md',
  '30-day-study-plan.md',
]
console.log('Focus Day1–3 / index / plan:')
for (const f of focus) {
  const text = await readFile(path.join(contentRoot, f), 'utf8')
  const docs = [...text.matchAll(LINK_RE)]
    .map((m) => m[1])
    .filter((h) => h.includes('documents/'))
  for (const href of docs) {
    const c = classifyMarkdownHref(f, href, isBundled)
    console.log(`  ${f} → ${href} ⇒ ${c.kind}${c.path ? ' ' + c.path : ''}${c.url ? ' ' + c.url : ''}`)
  }
}

void diskExists
