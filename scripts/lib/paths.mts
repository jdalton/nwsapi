import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const REPO_ROOT = fileURLToPath(new URL('../../', import.meta.url))
export const COVERAGE_SUMMARY_PATH = path.join(
  REPO_ROOT,
  'coverage/coverage-summary.json',
)
