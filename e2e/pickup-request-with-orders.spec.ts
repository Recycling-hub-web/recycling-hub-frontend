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
 * Admin/staff can add orders (with their materials) while creating a
 * pickup request — one save creates the request and every order.
 */

// No live address suggestions — their dropdown would cover the form.
test.beforeEach(async ({ page }) => {
  await mockStorageUploads(page);
  await page.route(
    'https://api.geoapify.com/v1/geocode/autocomplete**',
    (route) => route.fulfill({ json: { results: [] } }),
  );
});

test('admin creates a pickup request with two orders in one go', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  await page.goto('/admin/pickup-requests/create');

  const fullName = `E2E With Orders ${Date.now()}`;
  await fillCustomer(page, { fullName });
  await fillPickup(page);

  const addOrder = page.getByRole('button', { name: 'Add order' });
  await addOrder.click();
  await addOrder.click();
  const orders = page.getByTestId('new-order');
  await expect(orders).toHaveCount(2);

  // Each order gets one material — filled one after the other, like a
  // person would.
  const addMaterial = async (index: number) => {
    const order = orders.nth(index);
    await order.getByRole('button', { name: 'Add another item' }).click();
    await order
      .locator('[data-field="category"] select')
      .selectOption({ label: 'E-waste' });
    // E-waste is measured by KG or Unit, so the unit has to be picked.
    await order
      .locator('[data-field="quantity_unit"] select')
      .selectOption('kg');
    await attachPhoto(order);
    await expect(
      order.getByRole('button', { name: /Remove photo 1/ }),
    ).toBeVisible();
  };
  await addMaterial(0);
  await addMaterial(1);

  await finishOrders(page);
  await createRequest(page);
  await expect(page).toHaveURL(/\/admin\/pickup-requests\/(?!create)[^/]+$/);

  const id = page.url().split('/').pop();
  const detail = await (
    await page.request.get(`/api/v1/pickup-requests/${id}/`)
  ).json();
  expect(detail.orders).toHaveLength(2);

  await Promise.all(
    detail.orders.map((o: { id: string }) =>
      page.request.delete(`/api/v1/pickups/${o.id}/`),
    ),
  );
});

test('an order with a material but no category is caught before saving', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  await page.goto('/admin/pickup-requests/create');
  await fillCustomer(page, { fullName: 'No Category' });
  await fillPickup(page);
  await page.getByRole('button', { name: 'Add order' }).click();
  await page
    .getByTestId('new-order')
    .getByRole('button', { name: 'Add another item' })
    .click();
  // The Orders step checks its orders on Continue.
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByText('Category is required.')).toBeVisible();
  // Every order needs at least one photo too.
  await expect(
    page.getByText('Add at least one photo of the materials.'),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/create$/);
});
