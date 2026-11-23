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
const stats = {
  unverified_records: 1234,
  amount_pending: '12345.67',
  amount_reimbursed_this_month: '8901.23',
  finance_status_counts: {
    pending: 1,
    claimed: 1234,
    verified: 2,
    reimbursed: 3,
  },
};
async function setup(
  page: Page,
  context: BrowserContext,
  options: { gate?: Promise<void>; fail?: boolean; emptyVolume?: boolean } = {},
) {
  const token = await new SignJWT({ role: 'accounting', token_type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(
      new TextEncoder().encode(process.env.JWT_VERIFY_SECRET || 'test-only'),
    );
  await context.addCookies([
    { name: 'rh_access', value: token, url: 'http://127.0.0.1:3101' },
    { name: 'NEXT_LOCALE', value: 'bm', url: 'http://127.0.0.1:3101' },
  ]);
  const requests: URL[] = [];
  let statsAttempts = 0;
  let volumeAttempts = 0;
  await page.route('**/api/v1/**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/accounts/me/'))
      return route.fulfill({
        json: {
          id: 'accountant',
          role: 'accounting',
          full_name: 'Paid Accountant',
          email: 'test@example.com',
          phone_number: '0123456789',
          profile_photo: null,
          profile: {
            employee_id: '000123',
            department: 'Accounting',
            position: 'Driver',
            joining_date: '2026-08-01',
          },
        },
      });
    if (url.pathname.endsWith('/dashboard/accounting/')) {
      statsAttempts += 1;
      await options.gate;
      if (options.fail && statsAttempts === 1)
        return route.fulfill({
          status: 503,
          json: { detail: 'Synthetic failure' },
        });
      return route.fulfill({ json: stats });
    }
    if (url.pathname.endsWith('/dashboard/accounting/volume/')) {
      requests.push(url);
      volumeAttempts += 1;
      await options.gate;
      if (options.fail && volumeAttempts === 1)
        return route.fulfill({
          status: 503,
          json: { detail: 'Synthetic failure' },
        });
      return route.fulfill({
        json: {
          range: url.searchParams.get('range') || 'custom',
          from: url.searchParams.get('from') || '2026-08-01',
          to: url.searchParams.get('to') || '2026-08-31',
          interval: 'day',
          total: options.emptyVolume ? 0 : 1234,
          points: options.emptyVolume
            ? []
            : [{ date: '2026-08-01', count: 1234 }],
        },
      });
    }
    return route.fulfill({ json: empty });
  });
  return requests;
}

test('accounting dashboard translates controls and dates while keeping data and range through language changes', async ({
  page,
  context,
}) => {
  const requests = await setup(page, context);
  await page.goto('/accounting');
  await expect(
    page.getByRole('heading', { name: 'Selamat datang, Paid', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Jumlah menunggu bayaran balik', { exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/RM\s*12,345\.67/)).toBeVisible();
  await expect(
    page.getByText('Menunggu semakan', { exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Accounting', { exact: true })).toBeVisible();
  await expect(page.getByText('Driver', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Tersuai', exact: true }).click();
  await page.getByLabel('Daripada', { exact: false }).fill('2026-08-01');
  await page.getByLabel('Kepada', { exact: false }).fill('2026-08-31');
  await expect
    .poll(() => requests.at(-1)?.searchParams.get('from'))
    .toBe('2026-08-01');
  await expect(page.getByText(/1 Ogo 2026.*31 Ogo 2026.*harian/)).toBeVisible();
  const before = requests.length;
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Welcome, Paid', exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel('From', { exact: false })).toHaveValue(
    '2026-08-01',
  );
  await expect(page.getByLabel('To', { exact: false })).toHaveValue(
    '2026-08-31',
  );
  expect(requests).toHaveLength(before);
  await page.getByRole('button', { name: 'BM', exact: true }).click();
  const grid = page.getByTestId('overview-stat-grid');
  await expect(grid.locator(':scope > a')).toHaveCount(3);
  expect(
    await grid.evaluate(
      (el) => getComputedStyle(el).gridTemplateColumns.split(' ').length,
    ),
  ).toBe(3);
  expect(
    await page
      .getByText(/RM\s*12,345\.67/)
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
  await page.screenshot({
    path: 'audit-evidence/batch5-accounting-bm-desktop.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole('combobox', { name: 'Julat tarikh' }),
  ).toHaveValue('custom');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: 'audit-evidence/batch5-accounting-bm-mobile.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page.reload();
  await expect(
    page.getByRole('combobox', { name: 'Julat tarikh' }),
  ).toHaveValue('custom');
});

test('BM accounting loading shows chart status and skeletons before authoritative totals', async ({
  page,
  context,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await setup(page, context, { gate });
  try {
    await page.goto('/accounting');
    await expect(
      page.getByRole('status', { name: 'Sedang memuatkan carta' }),
    ).toHaveCount(2);
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(3);
    await expect(page.getByText(/RM\s*0\.00/)).toHaveCount(0);
  } finally {
    release();
  }
  await expect(page.getByText(/RM\s*12,345\.67/)).toBeVisible();
});

test('BM accounting totals and chart failures retry independently and empty chart copy stays translated', async ({
  page,
  context,
}) => {
  await setup(page, context, { fail: true, emptyVolume: true });
  await page.goto('/accounting');
  await expect(
    page.getByText('Tidak dapat memuatkan jumlah perakaunan.', { exact: true }),
  ).toHaveCount(4);
  await expect(
    page.getByText('Tidak dapat memuatkan data jumlah.', { exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/RM\s*0\.00/)).toHaveCount(0);
  await page
    .getByRole('button', { name: 'Cuba lagi', exact: true })
    .first()
    .click();
  await expect(page.getByText(/RM\s*12,345\.67/)).toBeVisible();
  await page.getByRole('button', { name: 'Cuba lagi', exact: true }).click();
  await expect(
    page.getByText('Tiada bayaran balik dalam julat ini.', { exact: true }),
  ).toBeVisible();
});
