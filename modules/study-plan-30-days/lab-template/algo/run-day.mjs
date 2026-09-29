import { spawnSync } from 'node:child_process'

const day = String(process.argv[2] || '').padStart(2, '0')
if (!day || Number.isNaN(Number(day))) {
  console.error('Usage: npm run algo:test:day -- <dayNumber>')
  process.exit(1)
}
const r = spawnSync(
  'npx',
  ['vitest', 'run', `day-${day}`],
  { stdio: 'inherit', shell: process.platform === 'win32' },
)
process.exit(r.status ?? 1)
