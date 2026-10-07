import { type APIRequestContext, expect, type Page } from '@playwright/test';

/**
 * Seeded, non-OTP test accounts (apps/core/management/commands/
 * seed_accounts.py on the backend). `qaStaff` is
 * operations@recyclinghub.example, `qaDriver` is
 * driver@recyclinghub.example, and `qaReceivingOfficer` is
 * receiving.officer@recyclinghub.example — all deliberately activated
 * for e2e use, since seeded staff/driver/receiving-officer accounts
 * start inactive until invited/activated, so these are kept on as
 * standing QA fixtures. `qaDriver` also has payout_method/
 * payout_account_details set (see FinanceRecord's Verify & Reimburse,
 * finance.spec.ts). See memory: recycling-hub-playwright-e2e.
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
  qaDriver: {
    email: 'driver@recyclinghub.example',
    password: 'Password123!',
  },
  qaReceivingOfficer: {
    email: 'receiving.officer@recyclinghub.example',
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
