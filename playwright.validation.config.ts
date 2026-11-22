import { defineConfig } from '@playwright/test';

/** Uses a locally running frontend; every API response in these tests is mocked. */
export default defineConfig({
  testDir: './e2e',
  testMatch: [
    'input-validation.spec.ts',
    'ui-audit-fixes.spec.ts',
    'ui-audit-followup.spec.ts',
    'ui-locale-contrast.spec.ts',
    'ui-finance-detail-locale.spec.ts',
    'ui-accounting-overview-locale.spec.ts',
    'driver-route-selection.spec.ts',
    'system-notifications.spec.ts',
  ],
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:3101', headless: true },
});
