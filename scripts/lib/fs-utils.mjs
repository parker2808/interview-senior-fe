import { mkdirSync, writeFileSync, cpSync, rmSync, existsSync } from 'node:fs'
import path from 'node:path'

export function writeJson(file, data) {
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

export function emptyDir(dir) {
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })
}

export function copyDir(from, to) {
  mkdirSync(to, { recursive: true })
  cpSync(from, to, { recursive: true, dereference: true })
}

export function padDay(n) {
  return String(n).padStart(2, '0')
}
