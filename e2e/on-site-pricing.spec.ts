import { expect, test } from '@playwright/test';

import { apiLoginAs } from './helpers/auth';
import { E_WASTE_CATEGORY_ID } from './helpers/categories';
import { orderAction } from './helpers/orderActions';
import { attachPhoto, E2E_PHOTO, mockStorageUploads } from './helpers/storage';

test('a new on-site material has a price and increases the recorded payment', async ({
  page,
}) => {
  await apiLoginAs(page.request, 'admin');
  const created = await page.request.post('/api/v1/pickup-requests/', {
    data: {
      full_name: `QA Onsite ${Date.now()}`,
      phone_number: '+60123456789',
      pickup_address: '1 Jalan QA',
      orders: [
        {
          items: [
            {
              category: E_WASTE_CATEGORY_ID,
              estimated_quantity: '1',
              quantity_unit: 'kg',
            },
          ],
          photos: [E2E_PHOTO],
        },
      ],
      evaluation: { decision: 'approved', price: '20.00' },
    },
  });
  expect(created.status(), await created.text()).toBe(201);
  const pickup = await created.json();
  const orderId = pickup.orders[0].id;
  const createdDriver = await page.request.post('/api/v1/accounts/users/', {
    data: {
      email: `onsite-${Date.now()}@example.com`,
      full_name: 'Onsite Driver',
      role: 'driver',
    },
  });
  expect(createdDriver.status(), await createdDriver.text()).toBe(201);
  const user = await createdDriver.json();
  const activated = await page.request.patch(
    `/api/v1/accounts/users/${user.id}/`,
    { data: { is_active: true } },
  );
  expect(activated.ok(), await activated.text()).toBe(true);
  const drivers = await page.request.get('/api/v1/accounts/drivers/');
  const driver = (await drivers.json()).results.find(
    (row: { user: { id: string } }) => row.user.id === user.id,
  );
  const assigned = await page.request.post(
    `/api/v1/pickups/${orderId}/assign-driver/`,
    { data: { driver: driver.id } },
  );
  expect(assigned.ok(), await assigned.text()).toBe(true);
  await mockStorageUploads(page);
  await page.goto(`/admin/pickup-requests/${pickup.id}`);
  await page.getByRole('button', { name: /^Orders \(/ }).click();
  await orderAction(page, 'Mark as collected');
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Add another material' }).click();
  await dialog
    .locator('[data-field="category"] select')
    .selectOption(E_WASTE_CATEGORY_ID);
  await dialog.getByLabel('Quantity', { exact: true }).fill('2');
  const unit = dialog.getByLabel('Unit', { exact: true });
  if (await unit.isEnabled()) await unit.selectOption('kg');
  const price = dialog.locator('[data-field="new-item-price-0"] input');
  await price.fill('5.25');
  await expect(
    dialog.getByText('RM 25.25', { exact: true }).first(),
  ).toBeVisible();
  await page.screenshot({
    path: test.info().outputPath('collect-desktop.png'),
    animations: 'disabled',
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(dialog).toBeVisible();
  expect(
    await dialog.evaluate(
      (element) => element.scrollWidth <= element.clientWidth,
    ),
  ).toBe(true);
  await expect(
    dialog.getByRole('button', { name: 'Mark collected' }),
  ).toBeInViewport();
  await page.screenshot({ path: test.info().outputPath('collect-mobile.png') });
  const method = dialog.locator('[data-field="payment_method"] select');
  await expect(method.locator('option[value="cash"]')).toHaveCount(0);
  await method.selectOption('bank_transfer');
  await attachPhoto(dialog.locator('[data-field="proof_of_payment"]'));
  await dialog.getByRole('button', { name: 'Mark collected' }).click();
  await expect(dialog).toBeHidden();
  const result = await page.request.get(`/api/v1/pickups/${orderId}/`);
  const data = await result.json();
  expect(data.finance_record.price).toBe('25.25');
  expect(data.finance_record.actual_amount).toBe('25.25');
  expect(
    data.items.some(
      (item: { on_site_price: string | null }) => item.on_site_price === '5.25',
    ),
  ).toBe(true);
});
