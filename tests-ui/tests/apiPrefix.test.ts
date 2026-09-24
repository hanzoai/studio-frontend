import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

// Studio serves its API under /v1. A same-origin literal naming /api — "/api",
// '/api/...', `/api/...` — calls a prefix nothing answers.
const FIRST_PARTY = /["'`]\/api(?=["'`/])/
const ROOT = join(__dirname, '..', '..')
const EXTS = ['.ts', '.tsx', '.js', '.vue']

function* sources(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '__tests__') continue
    const path = join(dir, name)
    if (statSync(path).isDirectory()) yield* sources(path)
    else if (EXTS.some((e) => name.endsWith(e)) && !/\.(test|spec)\./.test(name))
      yield path
  }
}

describe('API prefix', () => {
  it('no first-party source calls /api', () => {
    const hits: string[] = []
    for (const path of sources(join(ROOT, 'src'))) {
      readFileSync(path, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          if (FIRST_PARTY.test(line))
            hits.push(`${relative(ROOT, path)}:${i + 1}: ${line.trim()}`)
        })
    }
    expect(hits).toEqual([])
  })
})
