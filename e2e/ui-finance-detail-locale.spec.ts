import { loadEnvConfig } from '@next/env';
import type { BrowserContext, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { SignJWT } from 'jose';

import { presentActivity } from '../src/components/features/activity/presentation';
import type { ActivityLogEntry } from '../src/components/features/activity/types';
import { portalBm } from '../src/locales/portal';

loadEnvConfig(process.cwd());
const origin = 'http://127.0.0.1:3101';
const empty = {
  count: 0,
  results: [],
  next: null,
  previous: null,
  unread_count: 0,
};
const entry: ActivityLogEntry = {
  id: 'activity',
  actor_name: 'Approved',
  actor_role: 'accounting',
  module: 'finance',
  action: 'claimed',
  entity_type: 'financerecord',
  object_id: 'record',
  details: { note: 'Paid', changed_fields: ['actual_amount'], is_active: true },
  created_at: '2026-11-22T01:00:00Z',
};
const record = {
  id: 'record',
  collection_request: {
    id: 'pickup',
    full_name: 'Verified',
    items_summary: 'Laptop',
    pickup_address: 'Kuala Lumpur',
  },
  driver: {
    id: 'driver',
    full_name: 'Test Driver',
    payout_method: 'bank_transfer',
    payout_account_details: '',
    bank: 'bank-1',
    bank_name: 'Test Bank',
    account_holder_name: 'Paid',
    bank_account_number: '0012345678',
    bank_branch: '',
    duitnow_id_type: '',
    duitnow_id: '',
    payout_ready: true,
  },
  price: '1250.00',
  actual_amount: '1250.00',
  payment_method: 'bank_transfer',
  proof_of_payment: {
    file_key: 'synthetic-proof',
    public_url: 'https://example.test/proof',
  },
  reimbursement_proof: null,
  status: 'claimed',
  items: [{ id: 'item', category: 'Laptop', price: '1250.00' }],
  claimed_at: '2026-11-22T01:00:00Z',
  verified_at: null,
  verified_by: null,
  reimbursed_at: null,
  reimbursed_by: null,
  created_at: '2026-11-22T01:00:00Z',
};
async function setup(
  page: Page,
  context: BrowserContext,
  role = 'accounting',
  failFirst = false,
) {
  const token = await new SignJWT({ role, token_type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(
      new TextEncoder().encode(process.env.JWT_VERIFY_SECRET || 'test-only'),
    );
  await context.addCookies([
    { name: 'rh_access', value: token, url: origin },
    { name: 'NEXT_LOCALE', value: 'bm', url: origin },
  ]);
  let attempts = 0;
  const writes: unknown[] = [];
  await page.route('**/api/v1/**', (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/accounts/me/'))
      return route.fulfill({
        json: {
          id: 'test-user',
          role,
          full_name: 'Test User',
          email: 'test@example.com',
          profile_photo: null,
        },
      });
    if (path.endsWith('/finance/record/')) {
      attempts += 1;
      if (failFirst && attempts === 1)
        return route.fulfill({
          status: 503,
          json: { detail: 'Could not load this finance record.' },
        });
      return route.fulfill({ json: record });
    }
    if (path.endsWith('/finance/'))
      return route.fulfill({ json: { ...empty, count: 1, results: [record] } });
    if (path.endsWith('/audit/') || path.endsWith('/finance/record/activity/'))
      return route.fulfill({ json: { ...empty, count: 1, results: [entry] } });
    if (path.endsWith('/accounts/banks/'))
      return route.fulfill({
        json: [{ id: 'bank-1', name: 'Test Bank', is_active: true }],
      });
    if (path.endsWith('/payout/history/'))
      return route.fulfill({
        json: {
          ...empty,
          count: 1,
          results: [
            {
              id: 'history',
              created_at: entry.created_at,
              changed_by_name: 'Test Admin',
              before: { bank_account_number: '00001234' },
              after: { bank_account_number: '0012345678' },
              changed_fields: ['bank_account_number'],
            },
          ],
        },
      });
    if (route.request().method() === 'PATCH') {
      writes.push(route.request().postDataJSON());
      return route.fulfill({ json: {} });
    }
    return route.fulfill({ json: empty });
  });
  return writes;
}

test('activity presentation translates known labels while preserving user text', () => {
  const original = JSON.stringify(entry);
  const t = (key: string) => portalBm[key] ?? key;
  const result = presentActivity(entry, t);
  expect(result.title).toBe('Bayaran direkodkan untuk semakan');
  expect(result.details).toContainEqual({ label: 'Nota', value: 'Paid' });
  expect(result.details).toContainEqual({
    label: 'Medan dikemas kini',
    value: 'Jumlah sebenar',
  });
  expect(result.details).toContainEqual({ label: 'Akaun aktif', value: 'Ya' });
  expect(JSON.stringify(entry)).toBe(original);
  expect(presentActivity(entry).title).toBe('Payment recorded for review');
});

for (const role of ['accounting', 'driver'])
  test(`BM ${role} can follow the finance detail workflow with appropriate actions`, async ({
    page,
    context,
  }) => {
    const writes = await setup(page, context, role);
    await page.goto(`/${role}/finance`);
    await page
      .getByRole('link', { name: 'Lihat rekod kewangan untuk Verified' })
      .click();
    await expect(page).toHaveURL(new RegExp(`/${role}/finance/record$`));
    await expect(
      page.getByRole('heading', { name: 'Verified', exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText('Harga dipersetujui', { exact: true }),
    ).toBeVisible();
    await expect(page.getByText(/RM\s*1,250\.00/)).toHaveCount(3);
    await expect(page.getByText('Paid', { exact: true })).toHaveCount(2);
    await expect(
      page.getByText(role === 'driver' ? 'Dibayar' : 'Menunggu semakan', {
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.getByText('Approved', { exact: true })).toBeVisible();
    await expect(
      page.getByText('Bayaran direkodkan untuk semakan', { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Lihat bukti bayaran' }),
    ).toHaveAttribute('href', 'https://example.test/proof');
    await expect(
      page.getByRole('button', { name: 'Edit butiran bayaran', exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: 'Semak & Bayar Balik', exact: true }),
    ).toHaveCount(role === 'driver' ? 0 : 1);
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    if (role === 'accounting')
      await page.screenshot({
        animations: 'disabled',
        path: 'audit-evidence/batch4-finance-details-bm-mobile.png',
        fullPage: true,
      });
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'EN', exact: true })
      .click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Close menu' })
      .click();
    await expect(page.getByText('Agreed price', { exact: true })).toBeVisible();
    await page.getByRole('link', { name: 'Back to finance records' }).click();
    await expect(page).toHaveURL(new RegExp(`/${role}/finance$`));
    expect(writes).toEqual([]);
  });

test('BM administrator payout editing preserves account values and leading zeros', async ({
  page,
  context,
}) => {
  const writes = await setup(page, context, 'super_admin');
  await page.goto('/super-admin/finance/record');
  await page.getByRole('button', { name: 'Sejarah bank', exact: true }).click();
  let dialog = page.getByRole('dialog');
  await expect(dialog.getByText('Nombor akaun', { exact: true })).toBeVisible();
  await expect(
    dialog.getByText('Sebelum: 00001234', { exact: true }),
  ).toBeVisible();
  await dialog.getByRole('button', { name: 'Tutup dialog' }).click();
  await expect(dialog).toBeHidden();
  await page
    .getByRole('button', { name: 'Edit butiran bayaran', exact: true })
    .click();
  dialog = page.getByRole('dialog');
  await dialog.getByLabel('Nombor akaun').fill('0000987654');
  await expect(dialog.getByLabel('Nama pemegang akaun')).toHaveValue('Paid');
  await expect(
    dialog.getByRole('combobox', { name: 'Bank *', exact: true }),
  ).toHaveValue('bank-1');
  await dialog
    .getByRole('button', { name: 'Simpan butiran', exact: true })
    .click();
  await expect(dialog).toBeHidden();
  expect(writes).toHaveLength(1);
  expect(writes[0]).toMatchObject({
    bank: 'bank-1',
    bank_account_number: '0000987654',
    account_holder_name: 'Paid',
    payout_method: 'bank_transfer',
  });
});

test('finance detail errors offer a localized retry and recover', async ({
  page,
  context,
}) => {
  await setup(page, context, 'accounting', true);
  await page.goto('/accounting/finance/record');
  await expect(
    page
      .getByRole('alert')
      .filter({ hasText: 'Tidak dapat memuatkan rekod kewangan ini.' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Cuba lagi', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Verified', exact: true }),
  ).toBeVisible();
});

test('payout bank loading failure has a localized retry without clearing entered values', async ({
  page,
  context,
}) => {
  const writes = await setup(page, context, 'super_admin');
  let attempts = 0;
  await page.route('**/api/v1/accounts/banks/', (route) => {
    attempts += 1;
    return attempts === 1
      ? route.fulfill({ status: 503, json: { detail: 'Synthetic failure' } })
      : route.fulfill({
          json: [{ id: 'bank-1', name: 'Test Bank', is_active: true }],
        });
  });
  await page.goto('/super-admin/finance/record');
  await page
    .getByRole('button', { name: 'Edit butiran bayaran', exact: true })
    .click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('alert')).toContainText(
    'Tidak dapat memuatkan bank. Sila cuba lagi.',
  );
  await dialog.getByLabel('Nombor akaun').fill('0000123456');
  await dialog.getByRole('button', { name: 'Cuba lagi', exact: true }).click();
  await expect(
    dialog.getByRole('combobox', { name: 'Bank *', exact: true }),
  ).toBeEnabled();
  await expect(dialog.getByLabel('Nombor akaun')).toHaveValue('0000123456');
  await dialog.getByLabel('Nama pemegang akaun').fill('');
  await dialog
    .getByRole('button', { name: 'Simpan butiran', exact: true })
    .click();
  await expect(dialog.getByRole('alert')).toContainText(
    'Medan ini diperlukan.',
  );
  expect(writes).toEqual([]);
  await expect(dialog).toHaveAttribute('data-shown', 'true');
  await page.screenshot({
    path: 'audit-evidence/batch4-payout-validation-bm.png',
    fullPage: true,
    animations: 'disabled',
  });
});
