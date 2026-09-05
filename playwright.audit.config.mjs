import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './test/node',
  testMatch: '*.spec.mjs',
  reporter: 'list',
  workers: 1,
});
