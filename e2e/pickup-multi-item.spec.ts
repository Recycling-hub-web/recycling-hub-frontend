import type { APIRequestContext, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Multi-item Orders — an Order can hold several materials in one
 * visit ("10 computers, 3 phones, 3 AirPods"), and the evaluator can
 * price the whole thing as one lump total or per item. Covers the
 * lump-vs-itemized EvaluateModal toggle and CollectModal's per-item
 * quantity inputs. The public form's own item repeater is gone since
 * the Request/Order restructure (items now belong to an Order, created
 * by staff — see e2e/pickup-requests.spec.ts for that flow and
 * e2e/pickups.spec.ts's table-row "+N more" assertion coverage).
 */

const E_WASTE_CATEGORY_ID = '89067cc7-38ef-4752-9cd4-3ea29975abcb';
const GLASS_CATEGORY_ID = '7a1216d1-4f9a-4e29-8da8-9e897e7e43f8';

const uniqueName = (label: string) => `E2E MultiItem ${label} ${Date.now()}`;

const seedMultiItemOrder = async (
  request: APIRequestContext,
  fullName: string,
): Promise<string> => {
  const requestRes = await request.post('/api/v1/pickup-requests/', {
    data: {
      full_name: fullName,
      email: 'e2e-multiitem@example.com',
      phone_number: '+60123456789',
      request_type: 'business',
      pickup_address: '1 Jalan Test, 50000 Kuala Lumpur',
      requested_at: new Date(Date.now() + 86_400_000).toISOString(),
    },
  });
  expect(requestRes.ok()).toBe(true);
  const pickupRequestId = (await requestRes.json()).id as string;

  const orderRes = await request.post(
    `/api/v1/pickup-requests/${pickupRequestId}/orders/`,
    {
      data: {
        items: [
          { category: E_WASTE_CATEGORY_ID, estimated_quantity: '10' },
          { category: GLASS_CATEGORY_ID, estimated_quantity: '3' },
        ],
      },
    },
  );
  expect(orderRes.ok()).toBe(true);
  return (await orderRes.json()).id as string;
};

const getDriverId = async (request: APIRequestContext): Promise<string> => {
  const res = await request.get('/api/v1/accounts/drivers/');
  const driver = (await res.json()).results.find(
    (d: { user: { email: string } }) =>
      d.user.email === 'driver@recyclinghub.example',
  );
  return driver.id;
};

const deleteOrder = (page: Page, id: string) =>
  page.request.delete(`/api/v1/pickups/${id}/`);

test('evaluator can price a multi-item order as one lump total', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const fullName = uniqueName('Lump');
  const orderId = await seedMultiItemOrder(page.request, fullName);

  await page.goto(`/admin/pickups/${orderId}`);
  await page.getByRole('button', { name: 'Evaluate' }).click();
  const dialog = page.getByRole('dialog');

  // The lump/itemized toggle only renders because this Order has more
  // than one item.
  await expect(
    dialog.getByRole('switch', { name: 'Price each item' }),
  ).toHaveAttribute('aria-checked', 'false');
  await page.locator('[data-field="price"] input').fill('345.00');
  await dialog.getByRole('button', { name: 'Approve' }).click();

  await expect(page.getByText('Approved', { exact: true })).toBeVisible();
  await expect(page.getByText('345.00')).toBeVisible();

  await deleteOrder(page, orderId);
});

test('evaluator can price a multi-item order per item, live-summed into the total', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const fullName = uniqueName('Itemized');
  const orderId = await seedMultiItemOrder(page.request, fullName);

  await page.goto(`/admin/pickups/${orderId}`);
  await page.getByRole('button', { name: 'Evaluate' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('switch', { name: 'Price each item' }).click();

  // One price input per material.
  await page.locator('[data-field="item-price-E-waste"] input').fill('300');
  await page.locator('[data-field="item-price-Glass"] input').fill('45');

  await expect(page.getByText('RM 345.00')).toBeVisible();
  await dialog.getByRole('button', { name: 'Approve' }).click();

  await expect(page.getByText('Approved', { exact: true })).toBeVisible();
  await expect(page.getByText('345.00')).toBeVisible();

  // The itemized breakdown carries through to the Finance record — no
  // search filter on this endpoint, so find it by collection_request id
  // (newest-first ordering puts it on the first page).
  const financeRes = await page.request.get('/api/v1/finance/');
  const { results } = await financeRes.json();
  const record = results.find(
    (r: { collection_request: { id: string } }) =>
      r.collection_request.id === orderId,
  );
  expect(record.price).toBe('345.00');
  expect(record.items).toHaveLength(2);
  expect(record.items.map((i: { price: string }) => i.price).sort()).toEqual(
    ['300.00', '45.00'].sort(),
  );

  await deleteOrder(page, orderId);
});

test('driver collecting a multi-item order confirms a quantity per item, and can correct a category', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const fullName = uniqueName('Collect');
  const orderId = await seedMultiItemOrder(page.request, fullName);
  await page.request.post(`/api/v1/pickups/${orderId}/evaluate/`, {
    data: { decision: 'approved', price: '100.00' },
  });
  const driverId = await getDriverId(page.request);
  await page.request.post(`/api/v1/pickups/${orderId}/assign-driver/`, {
    data: { driver: driverId },
  });

  await loginAs(page, 'qaDriver');
  await page.goto('/driver/pickups');
  await page.getByRole('button', { name: 'My Pickups' }).click();
  await page
    .locator('tr', { hasText: 'E-waste' })
    .getByRole('button', { name: `Mark pickup for ${fullName} as collected` })
    .click();

  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText('Collected quantity per item')).toBeVisible();
  // Pre-filled from each item's estimated_quantity (10 and 3), and each
  // row also offers a category select to correct a miscategorized line.
  const ewasteQuantity = page.locator(
    '[data-field="item-quantity-E-waste"] input',
  );
  const glassQuantity = page.locator(
    '[data-field="item-quantity-Glass"] input',
  );
  await expect(ewasteQuantity).toHaveValue('10.00');
  await expect(glassQuantity).toHaveValue('3.00');
  await expect(
    page.locator('[data-field="item-category-E-waste"] select'),
  ).toBeVisible();
  // One E-waste computer was already sold before the driver arrived.
  await ewasteQuantity.fill('9');
  await page
    .locator('[data-field="payment_method"] select')
    .selectOption('cash');
  await dialog.getByRole('button', { name: 'Mark collected' }).click();

  await expect(page.getByText('Marked as collected')).toBeVisible();

  await loginAs(page, 'admin');
  await page.goto(`/admin/pickups/${orderId}`);
  // E-waste's collected quantity (9) differs from its estimate (10), so
  // it's unambiguous; Glass's collected and estimated quantities are
  // both 3, so it legitimately appears in both lists on the page.
  await expect(page.getByText('E-waste — 9.00 kg')).toBeVisible();
  await expect(page.getByText('Glass — 3.00 kg').first()).toBeVisible();

  await deleteOrder(page, orderId);
});
