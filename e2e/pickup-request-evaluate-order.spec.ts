import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Pickup request details → Orders tab: each pending order has an
 * Evaluate button that opens the same EvaluateModal as the order page,
 * and the price it sets shows in the table straight after.
 */

test('evaluates an order from the pickup request Orders tab', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const list = await (
    await page.request.get('/api/v1/pickups/?status=pending')
  ).json();
  const order = (list.results ?? []).find(
    (o: { status: string }) => o.status === 'pending',
  );
  test.skip(!order, 'no pending order to evaluate');

  const detail = await (
    await page.request.get(`/api/v1/pickups/${order.id}/`)
  ).json();
  await page.goto(`/admin/pickup-requests/${detail.pickup_request.id}`);
  await page.getByRole('button', { name: /^Orders \(\d+\)$/ }).click();

  const row = page.getByRole('row', { name: new RegExp(order.code) });
  await row.getByRole('button', { name: /^(Re-)?[Ee]valuate$/ }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const price = `${100 + Math.floor(Math.random() * 800)}.25`;
  const perItem = dialog.getByRole('switch', { name: 'Price each item' });
  if ((await perItem.count()) && (await perItem.isChecked())) {
    await perItem.click();
  }
  await dialog.getByLabel('Total price').fill(price);
  await dialog.getByRole('button', { name: 'Approve' }).click();

  await expect(dialog).toBeHidden();
  await expect(row).toContainText(price);
});
