import { expect, test } from '@playwright/test';

import { apiLoginAs } from './helpers/auth';
import { attachPhoto, E2E_PHOTO, mockStorageUploads } from './helpers/storage';

test('admin records one payment for two claims from the same driver', async ({
  page,
}) => {
  await apiLoginAs(page.request, 'qaDriver');
  const date = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kuala_Lumpur',
  }).format(new Date());
  const first = await page.request.post('/api/v1/claims/', {
    data: { category: 'tool', date, amount_claimed: 100, receipt: E2E_PHOTO },
  });
  expect(first.status(), await first.text()).toBe(201);
  const second = await page.request.post('/api/v1/claims/', {
    data: { category: 'tool', date, amount_claimed: 50, receipt: E2E_PHOTO },
  });
  expect(second.status(), await second.text()).toBe(201);
  const claims = [await first.json(), await second.json()];
  await apiLoginAs(page.request, 'admin');
  await page.goto('/admin/claims');
  const firstRow = page.locator(`tr[data-claim-id="${claims[0].id}"]`);
  const secondRow = page.locator(`tr[data-claim-id="${claims[1].id}"]`);
  await firstRow.getByRole('checkbox').check();
  await secondRow.getByRole('checkbox').check();
  await expect(
    page.getByText('Total RM 150.00', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Pay selected claims' }).click();
  const dialog = page.getByRole('dialog');
  await expect(
    dialog.getByText(claims[0].driver.full_name, { exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByRole('list', { name: 'Selected claims' }).getByRole('listitem'),
  ).toHaveCount(2);
  await expect(dialog.getByText('RM 150.00', { exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: 'Confirm payment' }).click();
  await expect(
    dialog.getByText('Upload proof of the combined payment.'),
  ).toBeVisible();
  await mockStorageUploads(page);
  await attachPhoto(dialog.locator('[data-field="bulk_payment_proof"]'));
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await dialog.evaluate(
      (element) => element.scrollWidth <= element.clientWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: test.info().outputPath('bulk-claim-payment-mobile.png'),
    animations: 'disabled',
  });
  await dialog.getByRole('button', { name: 'Confirm payment' }).click();
  await expect(dialog).toBeHidden();
  await expect(
    page.getByText('Expense claims paid', { exact: true }),
  ).toBeVisible();
  const records = await Promise.all(
    claims.map(async (claim: { id: string }) => {
      const response = await page.request.get(`/api/v1/claims/${claim.id}/`);
      return response.json();
    }),
  );
  expect(records.every((record) => record.status === 'paid')).toBe(true);
  expect(records.map((record) => record.amount_approved).sort()).toEqual([
    '100.00',
    '50.00',
  ]);
  expect(records[0].payment_proof.file_key).toBeTruthy();
  expect(records[0].payment_proof.file_key).toBe(
    records[1].payment_proof.file_key,
  );
  await expect(firstRow.getByRole('checkbox')).toBeDisabled();
  await expect(secondRow.getByRole('checkbox')).toBeDisabled();
});

test('staff can read claims without bulk payment controls', async ({
  page,
}) => {
  await apiLoginAs(page.request, 'qaStaff');
  await page.goto('/staff/claims');
  await expect(
    page.getByRole('heading', { name: 'Expense Claims' }),
  ).toBeVisible();
  await expect(page.locator('table').getByRole('checkbox')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Pay selected claims' }),
  ).toHaveCount(0);
});
