import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Admin/staff can add orders (with their materials) while creating a
 * pickup request — one save creates the request and every order.
 */

// No live address suggestions — their dropdown would cover the form.
test.beforeEach(async ({ page }) => {
  await page.route(
    'https://api.geoapify.com/v1/geocode/autocomplete**',
    (route) => route.fulfill({ json: { results: [] } }),
  );
});

const futureLocal = () =>
  new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().slice(0, 16);

test('admin creates a pickup request with two orders in one go', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  await page.goto('/admin/pickup-requests/create');

  const fullName = `E2E With Orders ${Date.now()}`;
  await page.locator('[data-field="full_name"] input').fill(fullName);
  await page.locator('[data-field="phone_local"] input').fill('123456789');
  await page
    .locator('[data-field="pickup_address"] input')
    .fill('1 Jalan Test, 50000 Kuala Lumpur');
  await page.locator('[data-field="requested_at"] input').fill(futureLocal());

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
      .selectOption({ index: 1 });
  };
  await addMaterial(0);
  await addMaterial(1);

  await page.getByRole('button', { name: 'Create request' }).click();
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
  await page.getByRole('button', { name: 'Add order' }).click();
  await page
    .getByTestId('new-order')
    .getByRole('button', { name: 'Add another item' })
    .click();

  await page.locator('[data-field="full_name"] input').fill('No Category');
  await page.locator('[data-field="phone_local"] input').fill('123456789');
  await page
    .locator('[data-field="pickup_address"] input')
    .fill('1 Jalan Test, 50000 Kuala Lumpur');
  await page.locator('[data-field="requested_at"] input').fill(futureLocal());
  await page.getByRole('button', { name: 'Create request' }).click();

  await expect(page.getByText('Category is required.')).toBeVisible();
  await expect(page).toHaveURL(/\/create$/);
});
