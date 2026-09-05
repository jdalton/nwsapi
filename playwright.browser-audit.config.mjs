import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './test/upstream',
  testMatch: 'browser-agreement.spec.mjs',
  reporter: 'list',
  workers: 1,
  use: { browserName: 'chromium' },
});
