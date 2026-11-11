import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';
import { attachPhoto, mockStorageUploads } from './helpers/storage';

/**
 * Evaluation wherever an order is made or shown: the Create order page
 * has the optional Evaluation block, and a scheduled order (driver
 * assigned) still offers Re-evaluate on its details page.
 */

test.beforeEach(async ({ page }) => {
  await mockStorageUploads(page);
});

test('Create order: approve with a price in the same save', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const list = await (
    await page.request.get('/api/v1/pickup-requests/?status=open')
  ).json();
  const request = (list.results ?? []).find(
    (r: { orders_count?: number; orders?: unknown[] }) =>
      (r.orders_count ?? r.orders?.length ?? 0) < 7,
  );
  test.skip(!request, 'no open pickup request with room for an order');

  await page.goto(`/admin/pickup-requests/${request.id}/orders/create`);
  await attachPhoto(page.locator('form'));
  await expect(
    page.getByRole('button', { name: /Remove photo 1/ }),
  ).toBeVisible();

  const evaluation = page.getByTestId('order-evaluation');
  await evaluation
    .getByRole('button', { name: 'Approve', exact: true })
    .click();
  await page.getByRole('button', { name: 'Create order' }).click();
  await expect(evaluation.getByText('Enter a valid price.')).toBeVisible();

  await evaluation.getByLabel('Total price').fill('64.50');
  await page.getByRole('button', { name: 'Create order' }).click();
  await expect(page).toHaveURL(/\/admin\/pickups\/[^/]+$/);

  const id = page.url().split('/').pop();
  const order = await (await page.request.get(`/api/v1/pickups/${id}/`)).json();
  expect(order.evaluation_status).toBe('approved');
  expect(Number(order.finance_record?.price ?? order.price)).toBe(64.5);
});

test('a scheduled order still has Re-evaluate, with a driver warning', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const list = await (
    await page.request.get('/api/v1/pickups/?status=scheduled')
  ).json();
  const order = (list.results ?? []).find(
    (o: { status: string }) => o.status === 'scheduled',
  );
  test.skip(!order, 'no scheduled order');

  await page.goto(`/admin/pickups/${order.id}`);
  await page.getByRole('button', { name: /^(Re-)?[Ee]valuate$/ }).click();
  await expect(
    page.getByRole('dialog').getByText(/A driver is already assigned/),
  ).toBeVisible();
});
