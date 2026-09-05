import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: '../test/upstream',
  testMatch: 'state-pseudos.spec.mts',
  reporter: 'list',
  workers: 1,
  use: { browserName: 'chromium' },
})
