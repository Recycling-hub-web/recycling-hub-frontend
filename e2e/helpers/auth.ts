import { type APIRequestContext, expect, type Page } from '@playwright/test';

/**
 * Seeded, non-OTP test accounts (apps/core/management/commands/
 * seed_accounts.py on the backend). `qaStaff` is
 * operations@recyclinghub.example, deliberately activated for e2e use
 * — seeded staff accounts start inactive until invited/activated, so
 * this one account is kept on as the standing QA fixture. See
 * memory: recycling-hub-playwright-e2e.
 */
const ACCOUNTS = {
  admin: {
    email: 'director@recyclinghub.example',
    password: 'Admin123!@#',
  },
  qaStaff: {
    email: 'operations@recyclinghub.example',
    password: 'Password123!',
  },
} as const;

type AccountKey = keyof typeof ACCOUNTS;

/** Logs in through the real /login form (no OTP for either seeded
 * account) and waits for the post-login redirect to land. */
const loginAs = async (page: Page, account: AccountKey) => {
  const { email, password } = ACCOUNTS[account];
  // Clear any existing session first — /login redirects away immediately
  // for an already-authenticated user (see LoginView), which would
  // otherwise strand this on whichever role logged in previously.
  await page.context().clearCookies();
  await page.goto('/login');
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: /log in|sign in/i }).click();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 10_000 });
};

/** Logs in via the API directly (POST /auth/login/, cookies land on the
 * given request context) — for test cleanup/setup that shouldn't disturb
 * whatever's currently on the page. */
const apiLoginAs = async (request: APIRequestContext, account: AccountKey) => {
  const { email, password } = ACCOUNTS[account];
  await request.post('/api/v1/auth/login/', { data: { email, password } });
};

export { ACCOUNTS, apiLoginAs, loginAs };
