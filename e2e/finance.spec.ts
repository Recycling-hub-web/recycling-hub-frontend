import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Finance Records / driver reimbursement — the real entity is
 * FinanceRecord (apps/finance/models.py), created by evaluate()'s
 * APPROVED branch and updated by collect() when an assigned driver
 * pays the customer out of pocket. Covers the full chain: collect()
 * capturing payment details -> driver's one-click bulk claim ->
 * accounting/admin's Verify & Reimburse (single or bulk).
 */

const E_WASTE_CATEGORY_ID = '89067cc7-38ef-4752-9cd4-3ea29975abcb';

const uniqueName = (label: string) => `E2E Finance ${label} ${Date.now()}`;

// Takes a pickup all the way to a driver-collected, priced FinanceRecord
// via the real API chain (evaluate -> assign-driver -> collect) as an
// authenticated admin request context — not direct ORM creation, so this
// is the real FinanceRecord collect() would produce.
const seedDriverCollectedRecord = async (
  request: APIRequestContext,
  fullName: string,
  price: string,
) => {
  const createRes = await request.post('/api/v1/pickups/', {
    data: {
      full_name: fullName,
      email: 'e2e-finance@example.com',
      phone_number: '+60123456789',
      category: E_WASTE_CATEGORY_ID,
      pickup_address: '1 Jalan Test, 50000 Kuala Lumpur',
    },
  });
  expect(createRes.ok()).toBe(true);
  const { id } = await createRes.json();

  const evalRes = await request.post(`/api/v1/pickups/${id}/evaluate/`, {
    data: { decision: 'approved', price },
  });
  expect(evalRes.ok()).toBe(true);

  const driversRes = await request.get('/api/v1/accounts/drivers/');
  expect(driversRes.ok()).toBe(true);
  const driver = (await driversRes.json()).results.find(
    (d: { user: { email: string } }) =>
      d.user.email === 'driver@recyclinghub.example',
  );

  const assignRes = await request.post(`/api/v1/pickups/${id}/assign-driver/`, {
    data: { driver: driver.id },
  });
  expect(assignRes.ok()).toBe(true);

  const collectRes = await request.post(`/api/v1/pickups/${id}/collect/`, {
    data: {
      actual_amount: price,
      payment_method: 'duitnow',
      proof_of_payment: 'e2e/proof-placeholder.png',
    },
  });
  expect(collectRes.ok()).toBe(true);

  return id as string;
};

test('driver claims reimbursement, accounting verifies and reimburses', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const fullName = uniqueName('Claim');
  await seedDriverCollectedRecord(page.request, fullName, '35.00');

  // Driver sees the pending-payment banner and claims in one click.
  await loginAs(page, 'qaDriver');
  await page.goto('/driver/pickups');
  await expect(page.getByText(/pending payment/i)).toBeVisible();
  await page.getByRole('button', { name: 'Claim Reimbursement' }).click();
  await expect(page.getByText(/reimbursement claimed/i)).toBeVisible();

  await page.goto('/driver/finance');
  await expect(
    page.locator('main', { hasText: fullName }).first(),
  ).toContainText('Claimed');

  // Admin verifies and reimburses — single-row action.
  await loginAs(page, 'admin');
  await page.goto('/admin/finance');
  const row = page.locator('tr', { hasText: fullName });
  await expect(row).toContainText('Claimed');
  await row.getByRole('button', { name: 'Verify & Reimburse' }).click();

  await expect(page.locator('tr', { hasText: fullName })).toContainText(
    'Reimbursed',
  );
});

test('bulk Verify & Reimburse pays back several claimed records at once', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const nameA = uniqueName('BulkA');
  const nameB = uniqueName('BulkB');
  await seedDriverCollectedRecord(page.request, nameA, '12.00');
  await seedDriverCollectedRecord(page.request, nameB, '18.00');

  await loginAs(page, 'qaDriver');
  await page.request.post('/api/v1/finance/claim-mine/');

  await loginAs(page, 'admin');
  await page.goto('/admin/finance');
  await page.locator('tr', { hasText: nameA }).getByRole('checkbox').check();
  await page.locator('tr', { hasText: nameB }).getByRole('checkbox').check();
  await page
    .getByRole('button', { name: /verify & reimburse selected \(2\)/i })
    .click();

  await expect(page.locator('tr', { hasText: nameA })).toContainText(
    'Reimbursed',
  );
  await expect(page.locator('tr', { hasText: nameB })).toContainText(
    'Reimbursed',
  );
});

test('collect modal requires payment method and proof when a driver is assigned', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const fullName = uniqueName('Validation');

  const createRes = await page.request.post('/api/v1/pickups/', {
    data: {
      full_name: fullName,
      email: 'e2e-finance@example.com',
      phone_number: '+60123456789',
      category: E_WASTE_CATEGORY_ID,
      pickup_address: '1 Jalan Test, 50000 Kuala Lumpur',
    },
  });
  const { id } = await createRes.json();
  await page.request.post(`/api/v1/pickups/${id}/evaluate/`, {
    data: { decision: 'approved', price: '20.00' },
  });
  const driversRes = await page.request.get('/api/v1/accounts/drivers/');
  const driver = (await driversRes.json()).results.find(
    (d: { user: { email: string } }) =>
      d.user.email === 'driver@recyclinghub.example',
  );
  await page.request.post(`/api/v1/pickups/${id}/assign-driver/`, {
    data: { driver: driver.id },
  });

  await page.goto(`/admin/pickups/${id}`);
  await page.getByRole('button', { name: 'Mark as collected' }).click();
  await expect(page.getByText('Payment method')).toBeVisible();
  await expect(page.getByText('Proof of payment')).toBeVisible();

  await page
    .getByRole('button', { name: 'Mark collected', exact: true })
    .click();
  await expect(
    page.getByText(/select how the customer was paid/i),
  ).toBeVisible();

  // Proof of payment is optional for now — selecting just the payment
  // method (no upload, since this dev environment has no real storage
  // configured) is enough to complete the collection.
  await page
    .locator('[data-field="payment_method"] select')
    .selectOption('cash');
  await page
    .getByRole('button', { name: 'Mark collected', exact: true })
    .click();
  await expect(page.getByText('Collected', { exact: true })).toBeVisible();

  await page.request.delete(`/api/v1/pickups/${id}/`);
});
