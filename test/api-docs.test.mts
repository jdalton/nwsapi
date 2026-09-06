import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { expect, test } from 'vitest'
import { renderApiMarkdown, writeApiMarkdown } from '../scripts/gen/api-md.mts'
import {
  ADAPTER_SOURCE_PATH,
  API_DOC_PATH,
  ENGINE_SOURCE_PATH,
} from '../scripts/lib/paths.mts'

const engine = readFileSync(ENGINE_SOURCE_PATH, 'utf8')
const adapter = readFileSync(ADAPTER_SOURCE_PATH, 'utf8')

for (const [name, markdown] of [
  ['API', renderApiMarkdown(engine, adapter)],
  ['README', readFileSync(new URL('../README.md', import.meta.url), 'utf8')],
]) {
  test(`${name} keeps GitHub alerts outside collapsed sections`, () => {
    let depth = 0
    let alerts = 0
    for (const line of markdown.split('\n')) {
      if (line === '<details>') {
        depth++
      }
      if (line === '</details>') {
        depth--
      }
      if (line === '> [!IMPORTANT]') {
        expect(depth).toBe(0)
        alerts++
      }
    }
    expect(depth).toBe(0)
    expect(alerts).toBe(1)
    expect(markdown).toMatch(/\n\n> \[!IMPORTANT\]\n> Set `LEGACY`/)
  })
}

test('the API reference matches the source exports without running the factory', () => {
  const output = renderApiMarkdown(engine, adapter)
  expect(output).toBe(readFileSync(API_DOC_PATH, 'utf8'))
  expect(output).toContain('`closest(selectors, element, callback)`')
  expect(output).toContain('`match(selectors, element, callback)`')
  expect(output).toContain('`select(selectors, context, callback)`')
  expect(output).toContain('`up(element, expr)`')
  expect(output).not.toContain('`ancestor(')
  expect(output).toContain('`USR_EVENT` | `true`')
  expect(output).toContain('require("nwsapi").DOMSelector')
  expect(output.indexOf('`byClass(')).toBeLessThan(output.indexOf('`byId('))
  expect(
    renderApiMarkdown('throw new Error("do not execute");\n' + engine, adapter),
  ).toContain('# API')
})

test('new exports need a description instead of silently disappearing', () => {
  expect(() =>
    renderApiMarkdown(
      engine.replace('Dom = {', 'Dom = { undocumented: select,'),
      adapter,
    ),
  ).toThrow('undocumented')
  expect(() =>
    renderApiMarkdown(
      engine,
      adapter.replace(
        'class DOMSelector {',
        'class DOMSelector { undocumented() {}',
      ),
    ),
  ).toThrow('undocumented')
})

test('check mode detects missing or stale docs without writing', t => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'nwsapi-api-'))
  t.onTestFinished(() => rmSync(dir, { recursive: true, force: true }))
  const file = path.join(dir, 'api.md')
  expect(() => writeApiMarkdown('new', file, true)).toThrow('stale')
  writeFileSync(file, 'old')
  expect(() => writeApiMarkdown('new', file, true)).toThrow('stale')
  expect(readFileSync(file, 'utf8')).toBe('old')
  writeApiMarkdown('new', file)
  expect(() => writeApiMarkdown('new', file, true)).not.toThrow()
})
