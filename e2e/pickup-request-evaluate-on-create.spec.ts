import type { Locator } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';
import {
  createRequest,
  fillCustomer,
  fillPickup,
  finishOrders,
} from './helpers/pickupRequestForm';
import { attachPhoto, mockStorageUploads } from './helpers/storage';

/**
 * New pickup request → Orders step: each order has an optional
 * Evaluation block (Not yet / Approve / Reject), so an order can be
 * priced or rejected in the same save that creates it.
 */

test.beforeEach(async ({ page }) => {
  await mockStorageUploads(page);
  await page.route(
    'https://api.geoapify.com/v1/geocode/autocomplete**',
    (route) => route.fulfill({ json: { results: [] } }),
  );
});

const addMaterial = async (order: Locator) => {
  await order.getByRole('button', { name: 'Add another item' }).click();
  await order
    .locator('[data-field="category"] select')
    .selectOption({ label: 'E-waste' });
  await order.locator('[data-field="quantity_unit"] select').selectOption('kg');
  await attachPhoto(order);
  await expect(
    order.getByRole('button', { name: /Remove photo 1/ }),
  ).toBeVisible();
};

test('orders are approved and rejected on the create form', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  await page.goto('/admin/pickup-requests/create');
  await fillCustomer(page, {
    fullName: `E2E Evaluate On Create ${Date.now()}`,
  });
  await fillPickup(page);

  const addOrder = page.getByRole('button', { name: 'Add order' });
  await addOrder.click();
  await addOrder.click();
  await addOrder.click();
  const orders = page.getByTestId('new-order');
  for (let i = 0; i < 3; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await addMaterial(orders.nth(i));
  }

  const decide = (index: number, decision: 'Approve' | 'Reject') =>
    orders
      .nth(index)
      .getByTestId('order-evaluation')
      .getByRole('button', { name: decision, exact: true })
      .click();

  // Order 1: approve without a price — caught before moving on.
  await decide(0, 'Approve');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(orders.nth(0).getByText('Enter a valid price.')).toBeVisible();
  await orders.nth(0).getByLabel('Total price').fill('88.40');

  // Order 2: reject with a reason. Order 3: decide later.
  await decide(1, 'Reject');
  await orders.nth(1).locator('[data-field="note"] textarea').fill('Wet');

  await finishOrders(page);
  await expect(page.getByText(/Approved, RM 88\.40/)).toBeVisible();
  await expect(page.getByText(/— Rejected/)).toBeVisible();

  await createRequest(page);
  await expect(page).toHaveURL(/\/admin\/pickup-requests\/(?!create)[^/]+$/);

  const id = page.url().split('/').pop();
  const detail = await (
    await page.request.get(`/api/v1/pickup-requests/${id}/`)
  ).json();
  const statuses = detail.orders
    .map((o: { evaluation_status: string }) => o.evaluation_status)
    .sort();
  expect(statuses).toEqual(['approved', 'pending', 'rejected']);
  const approved = detail.orders.find(
    (o: { evaluation_status: string }) => o.evaluation_status === 'approved',
  );
  expect(Number(approved.price)).toBe(88.4);
});
