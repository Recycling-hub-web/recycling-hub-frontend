import { defineConfig } from '@playwright/test';

/** English-only portal regression profile. Public BM scenarios remain; historical portal BM-switching suites are superseded by the current product requirement. */
export default defineConfig({
  testDir: './e2e',
  testMatch: [
    'ui-english-sidebar.spec.ts',
    'ui-form-recovery.spec.ts',
    'input-validation.spec.ts',
    'ui-audit-fixes.spec.ts',
    'ui-audit-followup.spec.ts',
    'driver-route-selection.spec.ts',
    'system-notifications.spec.ts',
  ],
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:3101', headless: true },
});
