#!/usr/bin/env node
/**
 * Download parker2808/interview-fe-data at build time into .data/content.
 * Never import this folder from client code.
 */
import {
  existsSync,
  mkdirSync,
  rmSync,
  cpSync,
  createWriteStream,
  mkdtempSync,
  readdirSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pipeline } from 'node:stream/promises'
import { execFileSync } from 'node:child_process'
import { Readable } from 'node:stream'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dest = path.join(root, '.data/content')
const owner = process.env.CONTENT_REPO_OWNER || 'parker2808'
const repo = process.env.CONTENT_REPO_NAME || 'interview-fe-data'
const ref = process.env.CONTENT_REPO_REF || 'main'

function fail(message) {
  console.error(message)
  process.exit(1)
}

function resetDest() {
  rmSync(dest, { recursive: true, force: true })
  mkdirSync(dest, { recursive: true })
}

function looksLikeContentTree(dir) {
  return (
    existsSync(path.join(dir, 'knowledge-base')) &&
    existsSync(path.join(dir, 'plan')) &&
    existsSync(path.join(dir, 'qna'))
  )
}

function noteOptionalPractice(dir) {
  if (!existsSync(path.join(dir, 'practice'))) {
    console.log('Note: practice/ is missing (optional — Practice UI will stay hidden).')
  }
}

function noteOptionalDesign(dir) {
  if (!existsSync(path.join(dir, 'practice/design'))) {
    console.log(
      'Note: practice/design/ is missing (optional — Design gallery will stay hidden).',
    )
  }
  if (!existsSync(path.join(dir, 'plans/portfolio-design-system.md'))) {
    console.log(
      'Note: plans/portfolio-design-system.md is missing (optional — Spec tab will be empty).',
    )
  }
  if (!existsSync(path.join(dir, 'plans/portfolio-design-system.vi.md'))) {
    console.log(
      'Note: plans/portfolio-design-system.vi.md is missing (optional — Spec tab falls back to English).',
    )
  }
}

function copySpecIfPresent(from, to, rel) {
  const specSrc = path.join(from, rel)
  if (!existsSync(specSrc)) return false
  const specDest = path.join(to, rel)
  mkdirSync(path.dirname(specDest), { recursive: true })
  cpSync(specSrc, specDest)
  return true
}

function copyOptionalDesign(from, to) {
  copySpecIfPresent(from, to, 'plans/portfolio-design-system.md')
  copySpecIfPresent(from, to, 'plans/portfolio-design-system.vi.md')
  const designSrc = path.join(from, 'practice/design')
  const designDest = path.join(to, 'practice/design')
  if (existsSync(designSrc)) {
    mkdirSync(path.dirname(designDest), { recursive: true })
    cpSync(designSrc, designDest, { recursive: true, dereference: true })
  }
  noteOptionalDesign(from)
}

function syncDesignPublicAssets(contentRoot) {
  const publicDir = path.join(root, 'public/assets/practice-design')
  rmSync(publicDir, { recursive: true, force: true })
  const src = path.join(contentRoot, 'practice/design/screens')
  if (!existsSync(src)) return
  const dest = path.join(publicDir, 'screens')
  mkdirSync(dest, { recursive: true })
  cpSync(src, dest, { recursive: true, dereference: true })
  console.log(`Copied design screens → ${dest}`)
}

function findContentTree(dir) {
  if (looksLikeContentTree(dir)) return dir
  if (!existsSync(dir)) return null
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue
    const child = path.join(dir, name)
    try {
      if (looksLikeContentTree(child)) return child
    } catch {
      /* skip */
    }
  }
  return null
}

function copyLocal(src) {
  const resolved = path.resolve(src)
  if (!existsSync(resolved)) {
    fail(
      `CONTENT_LOCAL_PATH does not exist: ${resolved}\n` +
        'Point it at a checkout (or export) of interview-fe-data.',
    )
  }
  const from = findContentTree(resolved)
  if (!from) {
    fail(
      `CONTENT_LOCAL_PATH is not a content tree (need knowledge-base/, plan/, qna/):\n  ${resolved}`,
    )
  }
  resetDest()
  cpSync(from, dest, { recursive: true, dereference: true })
  copyOptionalDesign(from, dest)
  syncDesignPublicAssets(dest)
  noteOptionalPractice(from)
  console.log(`Pulled local content from ${from} → ${dest}`)
}

async function downloadRepo(token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/tarball/${encodeURIComponent(ref)}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'interview-senior-fe-pull-data',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    redirect: 'follow',
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    fail(
      [
        `Failed to download ${owner}/${repo}@${ref} (HTTP ${res.status}).`,
        body.slice(0, 400),
        '',
        'Check CONTENT_REPO_TOKEN (fine-grained PAT, Contents: Read on interview-fe-data)',
        'and CONTENT_REPO_REF (default main).',
        'The previous Vercel deployment keeps serving until a new build succeeds.',
      ].join('\n'),
    )
  }
  const tmp = mkdtempSync(path.join(tmpdir(), 'interview-fe-data-'))
  const tarball = path.join(tmp, 'repo.tgz')
  if (!res.body) fail('GitHub tarball response had no body.')
  await pipeline(Readable.fromWeb(res.body), createWriteStream(tarball))
  const extractDir = path.join(tmp, 'extract')
  mkdirSync(extractDir, { recursive: true })
  execFileSync('tar', ['-xzf', tarball, '-C', extractDir], { stdio: 'pipe' })
  const tree = findContentTree(extractDir)
  if (!tree) {
    fail(
      `Downloaded ${owner}/${repo}@${ref} but did not find knowledge-base/, plan/, qna/.`,
    )
  }
  resetDest()
  cpSync(tree, dest, { recursive: true, dereference: true })
  copyOptionalDesign(tree, dest)
  syncDesignPublicAssets(dest)
  noteOptionalPractice(tree)
  rmSync(tmp, { recursive: true, force: true })
  console.log(`Pulled ${owner}/${repo}@${ref} → ${dest}`)
}

async function main() {
  mkdirSync(path.join(root, '.data'), { recursive: true })
  const local = process.env.CONTENT_LOCAL_PATH
  if (local) {
    copyLocal(local)
    return
  }
  const token = String(process.env.CONTENT_REPO_TOKEN || '').trim()
  if (!token) {
    fail(
      [
        'Missing CONTENT_REPO_TOKEN.',
        '',
        'This app loads site content at BUILD time from the private repo',
        'https://github.com/parker2808/interview-fe-data',
        'into a gitignored folder used only on the server.',
        '',
        'For Vercel (Production + Preview):',
        '  1. Create a fine-grained PAT with read-only Contents on interview-fe-data',
        '  2. Add CONTENT_REPO_TOKEN to the project env',
        '  3. Optional CONTENT_REPO_REF (default main)',
        '',
        'For local development you can skip the token and set',
        '  CONTENT_LOCAL_PATH=/path/to/interview-fe-data',
        '',
        'The previous Vercel deployment keeps serving until a new build succeeds.',
      ].join('\n'),
    )
  }
  await downloadRepo(token)
}

main().catch((err) => {
  fail(err instanceof Error ? err.stack || err.message : String(err))
})
