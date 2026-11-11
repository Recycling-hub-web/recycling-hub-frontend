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
 * New pickup request → Orders step: one optional Evaluation block for
 * the whole request (Not yet / Approve / Reject, one total or a price per
 * item), saved in the same call that creates it.
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

test('the whole request is evaluated on the create form, per item', async ({
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

  // One Evaluation for the whole request, below the orders.
  const evaluation = page.getByTestId('order-evaluation');
  await expect(evaluation).toHaveCount(1);
  await evaluation
    .getByRole('button', { name: 'Approve', exact: true })
    .click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(evaluation.getByText('Enter a valid price.')).toBeVisible();

  // Per item: one price per material across the three orders.
  await evaluation.getByRole('switch', { name: 'Price each item' }).click();
  const prices = evaluation.getByLabel(/^Price for /);
  await expect(prices).toHaveCount(3);
  await prices.nth(0).fill('10');
  await prices.nth(1).fill('20');
  await prices.nth(2).fill('30.50');

  await finishOrders(page);
  await expect(
    page.getByText('Approved, RM 60.50 (priced per item)'),
  ).toBeVisible();

  await createRequest(page);
  await expect(page).toHaveURL(/\/admin\/pickup-requests\/(?!create)[^/]+$/);

  const id = page.url().split('/').pop();
  const detail = await (
    await page.request.get(`/api/v1/pickup-requests/${id}/`)
  ).json();
  const savedOrders = detail.orders as {
    evaluation_status: string;
    price: string | number;
  }[];
  expect(savedOrders.map((o) => o.evaluation_status)).toEqual([
    'approved',
    'approved',
    'approved',
  ]);
  expect(savedOrders.map((o) => Number(o.price)).sort((a, b) => a - b)).toEqual(
    [10, 20, 30.5],
  );
});
