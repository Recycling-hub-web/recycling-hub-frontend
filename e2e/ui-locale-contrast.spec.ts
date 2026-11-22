import { loadEnvConfig } from '@next/env';
import type { BrowserContext, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { SignJWT } from 'jose';

loadEnvConfig(process.cwd());
const empty = {
  count: 0,
  results: [],
  next: null,
  previous: null,
  unread_count: 0,
};
const record = {
  id: 'locale-fixture',
  collection_request: {
    id: 'pickup',
    full_name: 'Test Customer',
    items_summary: 'Laptop',
    pickup_address: 'Kuala Lumpur',
  },
  driver: { id: 'driver', full_name: 'Test Driver', payout_ready: true },
  price: '1250.00',
  actual_amount: '1250.00',
  payment_method: 'bank_transfer',
  proof_of_payment: { file_key: 'mock-proof', url: '/mock.png' },
  reimbursement_proof: null,
  status: 'claimed',
  items: [],
  created_at: '2026-11-22T01:00:00Z',
};
async function finance(page: Page, context: BrowserContext) {
  const token = await new SignJWT({ role: 'accounting', token_type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(
      new TextEncoder().encode(process.env.JWT_VERIFY_SECRET || 'test-only'),
    );
  await context.addCookies([
    { name: 'rh_access', value: token, url: 'http://127.0.0.1:3101' },
  ]);
  await page.route('**/api/v1/**', (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/accounts/me/'))
      return route.fulfill({
        json: {
          id: 'accountant',
          role: 'accounting',
          full_name: 'Test Accountant',
          email: 'test@example.com',
          profile_photo: null,
        },
      });
    if (path.endsWith('/finance/'))
      return route.fulfill({
        json: { ...empty, count: 40, results: [record], next: 'next' },
      });
    if (path.includes('/dashboard/'))
      return route.fulfill({
        status: 503,
        json: { detail: 'Synthetic unavailable dashboard' },
      });
    return route.fulfill({ json: empty });
  });
}

test('public BM preference carries into auth; language changes preserve entered credentials', async ({
  page,
  context,
}) => {
  await page.route('**/api/v1/**', (r) =>
    r.fulfill({ status: 401, json: { detail: 'Not authenticated' } }),
  );
  await page.goto('/bm/request-pickup');
  await expect
    .poll(
      async () =>
        (await context.cookies()).find((c) => c.name === 'NEXT_LOCALE')?.value,
    )
    .toBe('bm');
  await page.goto('/login?next=%2Faccounting%2Ffinance');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ms');
  await expect(
    page.getByRole('heading', { name: 'Log Masuk', exact: true }),
  ).toBeVisible();
  await page.locator('input[name="email"]').fill('draft@example.com');
  await page.locator('input[name="password"]').fill('synthetic-password');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Sign in', exact: true }),
  ).toBeVisible();
  await expect(page.locator('input[name="email"]')).toHaveValue(
    'draft@example.com',
  );
  await expect(page.locator('input[name="password"]')).toHaveValue(
    'synthetic-password',
  );
  await page.getByRole('button', { name: 'BM', exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Log Masuk', exact: true }),
  ).toBeVisible();
  expect(page.url()).toContain('next=%2Faccounting%2Ffinance');
});

test('finance language switch preserves filters and translates the reimbursement dialog', async ({
  page,
  context,
}) => {
  await finance(page, context);
  await page.goto('/accounting/finance');
  await page
    .getByRole('searchbox', { name: 'Search finance records' })
    .fill('Test');
  await page.getByLabel('Created from (MYT)').fill('2026-11-01');
  await page.getByRole('button', { name: 'BM', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Rekod Kewangan', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('searchbox', { name: 'Cari rekod kewangan' }),
  ).toHaveValue('Test');
  await expect(page.getByLabel('Dicipta dari (MYT)')).toHaveValue('2026-11-01');
  await expect(
    page.getByText('Halaman 1 daripada 4', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', {
      name: 'Lihat rekod kewangan untuk Test Customer',
    }),
  ).toHaveAttribute('href', '/accounting/finance/locale-fixture');
  await expect(
    page.getByRole('table').getByText('Menunggu semakan', { exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', {
      name: 'Semak dan bayar balik Test Customer',
      exact: true,
    })
    .click();
  const dialog = page.getByRole('dialog');
  await expect(
    dialog.getByRole('button', { name: 'Batal', exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByLabel('Bukti bayaran balik', { exact: true }),
  ).toBeAttached();
  await expect(dialog).toHaveAttribute('data-shown', 'true');
  await page.screenshot({
    animations: 'disabled',
    path: 'audit-evidence/batch3-reimbursement-bm.png',
    fullPage: true,
  });
  await dialog.getByRole('button', { name: 'Tutup dialog' }).click();
  await expect(dialog).toBeHidden();
  await page.screenshot({
    path: 'audit-evidence/batch3-finance-bm-desktop.png',
    fullPage: true,
  });
});

test('mobile language control fits the workspace menu and reports partial translation', async ({
  page,
  context,
}) => {
  await finance(page, context);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/accounting/finance');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'BM', exact: true }).click();
  await expect(
    dialog.getByRole('heading', { name: 'Ruang kerja anda' }),
  ).toBeVisible();
  await dialog.getByRole('button', { name: 'Tutup menu' }).click();
  await expect(
    page.getByRole('heading', { name: 'Rekod Kewangan', exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: 'audit-evidence/batch3-finance-bm-mobile.png',
    fullPage: true,
  });
  await page.goto('/accounting/claims');
  await expect(
    page.getByText(
      'Modul operasi lain tersedia dalam Bahasa Inggeris buat masa ini.',
    ),
  ).toBeVisible();
});

test('sign-in primary button and helper text meet normal-text contrast', async ({
  page,
}) => {
  await page.route('**/api/v1/**', (r) =>
    r.fulfill({ status: 401, json: { detail: 'Not authenticated' } }),
  );
  await page.goto('/login');
  const contrasts = await page
    .locator('button[type="submit"], p')
    .evaluateAll((elements) =>
      elements
        .filter((el) => el.textContent?.includes('Sign in'))
        .map((el) => {
          const c = getComputedStyle(el);
          const lum = (color: string) => {
            const values = (color.match(/[\d.]+/g) || [])
              .slice(0, 3)
              .map(Number)
              .map((v) => v / 255)
              .map((v) =>
                v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
              );
            return (
              values[0]! * 0.2126 + values[1]! * 0.7152 + values[2]! * 0.0722
            );
          };
          const fg = lum(c.color);
          let background = el;
          while (
            getComputedStyle(background).backgroundColor ===
              'rgba(0, 0, 0, 0)' &&
            background.parentElement
          )
            background = background.parentElement;
          const bg = lum(getComputedStyle(background).backgroundColor);
          return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
        }),
    );
  expect(contrasts.length).toBeGreaterThanOrEqual(2);
  for (const ratio of contrasts) expect(ratio).toBeGreaterThanOrEqual(4.5);
  await page.screenshot({
    path: 'audit-evidence/batch3-login-contrast.png',
    fullPage: true,
  });
});
