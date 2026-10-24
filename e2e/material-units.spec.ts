import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Materials are measured by KG, Unit, or both (a category's "Measured
 * by"); an order item can only use its category's units, and a count in
 * units must be a whole number.
 */

test.beforeEach(async ({ page }) => {
  // No live address suggestions — their dropdown would cover the form.
  await page.route(
    'https://api.geoapify.com/v1/geocode/autocomplete**',
    (route) => route.fulfill({ json: { results: [] } }),
  );
});

const futureLocal = () =>
  new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().slice(0, 16);

test('a unit-only material only takes whole-number counts', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const name = `E2E Laptops ${Date.now()}`;

  // Category measured by Unit only.
  await page.goto('/admin/categories/create');
  await page.locator('[data-field="name"] input').fill(name);
  const measuredBy = page.locator('[data-field="allowed_quantity_units"]');
  await measuredBy.getByLabel('Unit').check();
  await measuredBy.getByLabel('KG').uncheck();
  await page.getByRole('button', { name: 'Create category' }).click();
  await expect(page.getByText('Measured by')).toBeVisible();
  const categoryId = page.url().split('/').pop();

  // A pickup request with one order for it.
  await page.goto('/admin/pickup-requests/create');
  const fullName = `E2E Units ${Date.now()}`;
  await page.locator('[data-field="full_name"] input').fill(fullName);
  await page.locator('[data-field="phone_local"] input').fill('123456789');
  await page
    .locator('[data-field="pickup_address"] input')
    .fill('1 Jalan Test, 50000 Kuala Lumpur');
  await page.locator('[data-field="requested_at"] input').fill(futureLocal());
  await page.getByRole('button', { name: 'Add order' }).click();
  const order = page.getByTestId('new-order');
  await order.getByRole('button', { name: 'Add another item' }).click();
  await order
    .locator('[data-field="category"] select')
    .selectOption({ label: name });

  // The only unit is picked for you.
  const unit = order.locator('[data-field="quantity_unit"] select');
  await expect(unit).toHaveValue('unit');
  await expect(unit).toBeDisabled();

  await order.locator('[data-field="estimated_quantity"] input').fill('2.5');
  await page.getByRole('button', { name: 'Create request' }).click();
  await expect(
    page.getByText('A count in units must be a whole number.'),
  ).toBeVisible();

  await order.locator('[data-field="estimated_quantity"] input').fill('3');
  await page.getByRole('button', { name: 'Create request' }).click();
  await expect(page).toHaveURL(/\/admin\/pickup-requests\/(?!create)[^/]+$/);

  const id = page.url().split('/').pop();
  const detail = await (
    await page.request.get(`/api/v1/pickup-requests/${id}/`)
  ).json();
  const [item] = detail.orders[0].items;
  expect(item.quantity_unit).toBe('unit');
  expect(Number(item.estimated_quantity)).toBe(3);

  await page.goto(`/admin/pickups/${detail.orders[0].id}`);
  await expect(page.getByText('3 units')).toBeVisible();

  await page.request.delete(`/api/v1/pickups/${detail.orders[0].id}/`);
  await page.request.delete(`/api/v1/categories/${categoryId}/`);
});
