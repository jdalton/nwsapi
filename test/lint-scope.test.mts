import { test, expect } from 'vitest'
import { execFileSync } from 'node:child_process'
import { REPO_ROOT } from '../scripts/lib/paths.mts'

test('the lint runner includes source, tests, scripts, and config', () => {
  const files = execFileSync(
    process.execPath,
    ['scripts/lint.mts', '--debug', 'files'],
    {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    },
  )
    .trim()
    .split('\n')
  for (const file of [
    'src/nwsapi.mts',
    'src/dom-selector.mts',
    'src/modules/nwsapi-jquery.mts',
    'scripts/lint.mts',
    'scripts/gen/coverage-badge.mts',
    'test/lint-scope.test.mts',
    'test/jsdom-adapter-package.mts',
    'test/upstream/wpt.spec.mts',
    '.config/vitest.config.mts',
    '.config/runtime.d.ts',
  ])
    expect(files).toContain(file)
  expect(
    files.some(file => file.endsWith('.js') || file.startsWith('upstream/')),
  ).toBe(false)
})
