import { defineConfig } from '@playwright/test';

/** Uses a locally running frontend; every API response in these tests is mocked. */
export default defineConfig({
  testDir: './e2e',
  testMatch: 'input-validation.spec.ts',
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:3101', headless: true },
});
