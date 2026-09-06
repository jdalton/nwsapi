import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

export const REPO_ROOT = fileURLToPath(new URL('../../', import.meta.url))
export const COVERAGE_SCRIPT_PATH = path.join(REPO_ROOT, 'scripts/coverage.mts')
export const COMPILE_CACHE_DIR = path.join(
  os.tmpdir(),
  'nwsapi',
  'compile-cache',
)
export const COVERAGE_SUMMARY_PATH = path.join(
  REPO_ROOT,
  'coverage/coverage-summary.json',
)
