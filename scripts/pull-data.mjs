#!/usr/bin/env node
/**
 * Download parker2808/interview-fe-data at build time into .data/content
 * (Nitro server assets). Never import this folder from client code.
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

function findContentTree(dir, depth = 0) {
  if (looksLikeContentTree(dir)) return dir
  if (depth >= 3 || !existsSync(dir)) return null
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return null
  }
  for (const ent of entries) {
    if (!ent.isDirectory()) continue
    if (ent.name.startsWith('.')) continue
    const found = findContentTree(path.join(dir, ent.name), depth + 1)
    if (found) return found
  }
  return null
}

function listTopEntries(dir) {
  try {
    return readdirSync(dir).slice(0, 30).join(', ')
  } catch {
    return '(unreadable)'
  }
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
      `CONTENT_LOCAL_PATH is not a content tree (need knowledge-base/, plan/, qna/):\n  ${resolved}\n  entries: ${listTopEntries(resolved)}`,
    )
  }
  resetDest()
  cpSync(from, dest, { recursive: true, dereference: true })
  console.log(`Pulled local content from ${from} → ${dest}`)
}

async function downloadRepo(token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/tarball/${encodeURIComponent(ref)}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json, application/octet-stream',
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
      [
        `Downloaded ${owner}/${repo}@${ref} but did not find knowledge-base/, plan/, qna/.`,
        `Extracted entries: ${listTopEntries(extractDir)}`,
      ].join('\n'),
    )
  }
  resetDest()
  cpSync(tree, dest, { recursive: true, dereference: true })
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
  const token = process.env.CONTENT_REPO_TOKEN
  if (!token) {
    fail(
      [
        'Missing CONTENT_REPO_TOKEN.',
        '',
        'This app loads site content at BUILD time from the private repo',
        'https://github.com/parker2808/interview-fe-data',
        'into a gitignored folder used only as Nitro server assets.',
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
