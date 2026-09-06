import { test, expect } from 'vitest'
import path from 'node:path'
import { combineCoverage } from '../scripts/lib/coverage.mts'

const root = path.resolve('coverage-fixture')
const engine = path.join(root, 'src/nwsapi.js')
const adapter = path.join(root, 'src/dom-selector.js')
function covered(file, count) {
  return {
    [file]: {
      path: file,
      statementMap: {
        0: { start: { line: 1, column: 0 }, end: { line: 1, column: 1 } },
      },
      s: { 0: count },
      fnMap: {},
      f: {},
      branchMap: {},
      b: {},
    },
  }
}

test('coverage uses WPT for the engine and Node for the adapter', () => {
  const map = combineCoverage(
    covered(engine, 0),
    {
      ...covered(engine, 100),
      ...covered(adapter, 1),
    },
    root,
  )
  expect(map.files().sort()).toEqual([adapter, engine])
  expect(map.fileCoverageFor(engine).toSummary().lines.pct).toBe(0)
  expect(map.fileCoverageFor(adapter).toSummary().lines.pct).toBe(100)
})

test('incomplete coverage cannot silently replace the combined badge', () => {
  expect(() => combineCoverage({}, covered(adapter, 1), root)).toThrow(
    'Missing WPT',
  )
  expect(() => combineCoverage(covered(engine, 1), {}, root)).toThrow(
    'Missing Node',
  )
})
