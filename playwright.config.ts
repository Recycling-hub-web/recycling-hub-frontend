import { defineConfig, devices } from '@playwright/test';

/**
 * E2E suite for the internal admin/staff portal + public site.
 *
 * Both the frontend (`npm run dev`, :3000) and backend
 * (`python manage.py runserver 8001 --noreload`, matching
 * .env.local's API_PROXY_TARGET) must already be running — this
 * config does not spin either up, since the backend lives in a
 * sibling repo with its own venv/DB the frontend project can't own.
 *
 * Run with: npm run test:e2e
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
