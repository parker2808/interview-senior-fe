#!/usr/bin/env node
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { spawn } from 'node:child_process'

const packagePath = process.env.PLAYWRIGHT_PACKAGE
if (!packagePath) throw new Error('Set PLAYWRIGHT_PACKAGE to the installed Playwright package directory')
const { chromium } = await import(pathToFileURL(path.join(packagePath, 'index.mjs')).href)
const root = mkdtempSync(path.join(tmpdir(), 'jd-viewport-'))
const fallbackOnly = process.env.JD_VIEWPORT_NO_MODULES === '1'
const dataDir = path.join(root, 'content')
const localized = (en, vi) => ({ en, vi })
const sample = {
  version: 2, slug: 'fictional-frontend', fixture: true, organizationAlias: 'Example (fictional)',
  role: localized('Frontend', 'Giao diện'), level: localized('Sample', 'Mẫu'), date: '2026-11-15',
  tags: ['fixture'], status: 'active', title: localized('Fictional frontend', 'Frontend giả định'),
  summary: localized('Test-only module.', 'Module chỉ để thử nghiệm.'),
  requirements: [{ id: 'sample', title: localized('Keyboard focus', 'Điểm focus bàn phím') }],
  entries: [{ id: 'answer', section: 'concepts', jdRequirement: 'sample', tags: ['fixture'], title: localized('Keyboard focus', 'Điểm focus bàn phím'), shortAnswer: localized('Keep focus visible.', 'Luôn hiển thị điểm focus.'), detail: localized('Use Tab to move across controls.', 'Dùng phím Tab để di chuyển qua các nút.'), keyPoints: [localized('Test the order.', 'Kiểm tra thứ tự.')], kbRefs: [{ slug: 'keyboard-focus', sectionId: 'focus', state: 'pending' }] }],
}
const fde = { version: 1, requirements: sample.requirements, entries: sample.entries.map(({ kbRefs: _kbRefs, ...entry }) => entry) }
const index = { version: 2, modules: [
  { slug: 'fde', source: 'fde/fde-prep.json', ...Object.fromEntries(['organizationAlias', 'role', 'level', 'date', 'tags', 'status', 'title', 'summary'].map((key) => [key, sample[key]])) },
  { slug: sample.slug, source: `modules/${sample.slug}.json`, ...Object.fromEntries(['organizationAlias', 'role', 'level', 'date', 'tags', 'status', 'title', 'summary'].map((key) => [key, sample[key]])) },
  { slug: 'archived', source: 'modules/archived.json', ...Object.fromEntries(['organizationAlias', 'role', 'level', 'date', 'tags', 'title', 'summary'].map((key) => [key, sample[key]])), status: 'archived', archivedAt: '2026-11-15T00:00:00.000Z', purgeAfter: '2026-11-22T00:00:00.000Z' },
] }
for (const dir of ['knowledge-base', 'plan', 'qna', 'fde', 'modules']) mkdirSync(path.join(dataDir, dir), { recursive: true })
writeFileSync(path.join(dataDir, 'fde/fde-prep.json'), JSON.stringify(fde))
if (!fallbackOnly) {
  writeFileSync(path.join(dataDir, 'modules/index.json'), JSON.stringify(index))
  writeFileSync(path.join(dataDir, 'modules/fictional-frontend.json'), JSON.stringify(sample))
  writeFileSync(path.join(dataDir, 'modules/archived.json'), JSON.stringify({ ...sample, slug: 'archived', status: 'archived', archivedAt: '2026-11-15T00:00:00.000Z', purgeAfter: '2026-11-22T00:00:00.000Z' }))
}

const port = 33289
const url = `http://127.0.0.1:${port}`
const server = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port)], {
  cwd: path.resolve(import.meta.dirname, '..'),
  env: { ...process.env, CONTENT_LOCAL_PATH: dataDir, EDIT_PASSCODE: '123456', JD_TELEGRAM_BOT_USERNAME: 'Example_bot' }, stdio: ['ignore', 'ignore', 'pipe'], detached: true,
})
let serverError = ''
server.stderr.on('data', (chunk) => { serverError = `${serverError}${chunk}`.slice(-1200) })
let browser
try {
  let ready = false
  for (let attempt = 0; attempt < 120; attempt++) {
    if (server.exitCode !== null) throw new Error(`Nuxt dev server exited before it was ready: ${serverError}`)
    try { ready = (await fetch(`${url}/api/jd`)).ok; if (ready) break } catch { /* server starting */ }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  assert.ok(ready, 'Nuxt dev server must start')
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } })
  const check = async (route) => {
    await page.goto(`${url}${route}`)
    try { await page.locator('main').waitFor({ timeout: 10000 }) } catch { throw new Error(`${route}: page unavailable: ${(await page.locator('body').innerText()).slice(0, 350)}; server: ${serverError}`) }
    const layout = await page.evaluate(() => ({ width: innerWidth, height: innerHeight, pageWidth: document.documentElement.scrollWidth, clipped: [...document.querySelectorAll('main input, main select, main article button, main article a')].some((control) => control.getBoundingClientRect().right > innerWidth + 2) }))
    assert.deepEqual([layout.width, layout.height], [430, 932], `${route}: viewport`)
    assert.ok(layout.pageWidth <= 430 && !layout.clipped, `${route}: horizontal overflow or clipped control: ${JSON.stringify(layout)}`)
  }
  await check('/jd')
  assert.equal(await page.locator('main article').count(), fallbackOnly ? 1 : 2, 'archived module hidden; fallback shows FDE')
  assert.equal(await page.getByRole('link', { name: /Delete in Telegram|Xóa qua Telegram/ }).count(), 0, 'view hides Delete')
  assert.equal(await page.locator('main article button').count(), 0, 'view hides Copy and Restore')
  assert.equal((await page.request.get(`${url}/api/jd?status=archived`)).status(), 200)
  assert.deepEqual(await (await page.request.get(`${url}/api/jd?status=archived`)).json(), [], 'visitor sees no archive')
  await page.waitForTimeout(300)
  await page.keyboard.press('Meta+k')
  await page.waitForURL('**/search')
  await page.locator('#jd-global-search:focus').waitFor()
  await check(fallbackOnly ? '/jd/fde' : '/jd/fictional-frontend')
  assert.equal(await page.locator('main code').count(), 0, 'view hides owner command')
  assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, nofollow')
  for (const button of await page.locator('main nav button').all()) { await button.click(); await checkLayoutOnly(page) }
  await check('/search')
  await page.waitForTimeout(300)
  await page.keyboard.press('/')
  assert.equal(await page.locator('#jd-global-search').evaluate((input) => input === document.activeElement), true)
  await page.locator('#jd-global-search').fill('ban phim')
  await page.waitForTimeout(400)
  assert.ok(await page.locator('main a[href^="/jd/"]').count() > 0, 'accent-insensitive search returns fixture')
  const auth = await page.request.post(`${url}/api/auth/edit`, { data: { passcode: '123456' } })
  assert.equal(auth.status(), 200, 'fixture edit session works')
  await check('/jd')
  if (!fallbackOnly) {
    await page.getByRole('link', { name: /Delete in Telegram|Xóa qua Telegram/ }).waitFor()
    assert.equal(await page.getByRole('link', { name: /Delete in Telegram|Xóa qua Telegram/ }).count(), 1, 'only non-FDE is deletable')
    assert.equal(await page.locator('main article code').innerText(), '/jd_delete fictional-frontend')
    await page.locator('main article button').first().focus()
    assert.equal(await page.locator('main article button').first().evaluate((button) => button === document.activeElement), true, 'Copy is keyboard reachable')
    assert.equal(await page.locator('a[href*="start="]').count(), 0, 'fallback has no start payload')
    await page.getByRole('button', { name: /Archived|Đã lưu trữ/ }).click()
    await page.getByRole('link', { name: /Restore in Telegram|Khôi phục qua Telegram/ }).waitFor()
    await checkLayoutOnly(page)
    assert.equal(await page.locator('main article').count(), 1, 'archived filter shows archived fixture')
    assert.equal(await page.locator('main article code').innerText(), '/jd_restore archived')
    assert.ok((await page.locator('main article').innerText()).includes('2026-11-22'), 'restore deadline visible')
    await check('/jd/fictional-frontend')
    await page.getByRole('link', { name: /Delete in Telegram|Xóa qua Telegram/ }).waitFor()
    await check('/search')
    assert.equal(await page.locator('main article').count(), 0, 'search has no action cards')
    assert.equal((await page.request.get(`${url}/api/jd/archived`)).status(), 404, 'archived detail stays missing')
  }
  console.log(`JD viewport OK: /jd, /jd/${fallbackOnly ? 'fde' : 'fictional-frontend'} (six tabs), archived filter, /search at 430x932 in view and edit`)
} finally {
  await browser?.close()
  if (server.pid) {
    try { process.kill(-server.pid, 'SIGTERM') } catch (error) { if (error.code !== 'ESRCH') throw error }
  }
  server.stderr.destroy()
  rmSync(root, { recursive: true, force: true })
}

async function checkLayoutOnly(page) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= 430), 'tab causes horizontal page overflow')
}
