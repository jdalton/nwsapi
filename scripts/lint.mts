import { execFileSync } from 'node:child_process'
import { globSync } from 'node:fs'
import { REPO_ROOT } from './lib/paths.mts'

execFileSync(
  process.execPath,
  [
    'node_modules/oxlint/bin/oxlint',
    '--config',
    '.config/oxlint.json',
    '--tsconfig',
    '.config/tsconfig.check.json',
    ...globSync(
      [
        'src/**/*.mts',
        'scripts/**/*.mts',
        'test/*.test.mts',
        'test/jsdom-adapter-package.mts',
        'test/upstream/*.mts',
        '.config/*.mts',
        '.config/*.d.ts',
      ],
      { cwd: REPO_ROOT },
    ),
    ...process.argv.slice(2),
  ],
  { cwd: REPO_ROOT, stdio: 'inherit' },
)
