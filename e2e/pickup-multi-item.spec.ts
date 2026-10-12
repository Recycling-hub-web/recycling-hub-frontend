import type { APIRequestContext, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Multi-item pickups — a request (individual or business alike) can
 * hold several materials in one visit ("10 computers, 3 phones, 3
 * AirPods"), and the evaluator can price the whole thing as one lump
 * total or per item. Covers the public form's repeater, the lump-vs-
 * itemized EvaluateModal toggle (shown for both request types), and
 * CollectModal's per-item quantity inputs. See the pickup→finance
 * system plan for the full design.
 */

const E_WASTE_CATEGORY_ID = '89067cc7-38ef-4752-9cd4-3ea29975abcb';
const GLASS_CATEGORY_ID = '7a1216d1-4f9a-4e29-8da8-9e897e7e43f8';

const uniqueName = (label: string) => `E2E MultiItem ${label} ${Date.now()}`;

const seedMultiItemRequest = async (
  request: APIRequestContext,
  fullName: string,
) => {
  const res = await request.post('/api/v1/pickups/', {
    data: {
      full_name: fullName,
      email: 'e2e-multiitem@example.com',
      phone_number: '+60123456789',
      request_type: 'business',
      items: [
        { category: E_WASTE_CATEGORY_ID, estimated_quantity: '10' },
        { category: GLASS_CATEGORY_ID, estimated_quantity: '3' },
      ],
      pickup_address: '1 Jalan Test, 50000 Kuala Lumpur',
    },
  });
  expect(res.ok()).toBe(true);
  return (await res.json()).id as string;
};

const getDriverId = async (request: APIRequestContext): Promise<string> => {
  const res = await request.get('/api/v1/accounts/drivers/');
  const driver = (await res.json()).results.find(
    (d: { user: { email: string } }) =>
      d.user.email === 'driver@recyclinghub.example',
  );
  return driver.id;
};

const deletePickup = (page: Page, id: string) =>
  page.request.delete(`/api/v1/pickups/${id}/`);

test('public form submits an individual request with several items, add/remove rows both work', async ({
  page,
}) => {
  const fullName = uniqueName('PublicIndividual');
  await page.goto('/request-pickup');
  await page.getByText('Individual / Household').click();

  await page.locator('[data-field="full_name"] input').fill(fullName);
  await page.locator('[data-field="phone_local"] input').fill('123456789');
  await page
    .locator('[data-field="pickup_address"] input')
    .fill('1 Jalan Test, 50000 Kuala Lumpur');

  // Starts with exactly one row.
  await expect(page.locator('[data-field="category"] select')).toHaveCount(1);
  await page
    .locator('[data-field="category"] select')
    .first()
    .selectOption(E_WASTE_CATEGORY_ID);
  await page
    .locator('[data-field="estimated_quantity"] input')
    .first()
    .fill('10');

  await page.getByRole('button', { name: 'Add another item' }).click();
  await expect(page.locator('[data-field="category"] select')).toHaveCount(2);
  await page
    .locator('[data-field="category"] select')
    .nth(1)
    .selectOption(GLASS_CATEGORY_ID);
  await page
    .locator('[data-field="estimated_quantity"] input')
    .nth(1)
    .fill('3');

  // Add a third row, then remove it — the remove control works on a
  // row that isn't the last-remaining one, since it's only hidden when
  // exactly one row is left.
  await page.getByRole('button', { name: 'Add another item' }).click();
  await expect(page.locator('[data-field="category"] select')).toHaveCount(3);
  await page.getByRole('button', { name: 'Remove this item' }).last().click();
  await expect(page.locator('[data-field="category"] select')).toHaveCount(2);

  await page.getByRole('button', { name: 'Submit Request' }).click();
  await expect(page.getByText(/request received/i)).toBeVisible();

  await loginAs(page, 'admin');
  await page.goto('/admin/pickups');
  await page.getByPlaceholder(/search/i).fill(fullName);

  // Table collapses the items list to "first item +N more", not a
  // comma list or bare count.
  const row = page.locator('tr', { hasText: fullName });
  await expect(row).toBeVisible();
  await expect(row.getByText('E-waste +1 more')).toBeVisible();
  await row.click();
  await expect(page).toHaveURL(/\/admin\/pickups\/[^/]+$/);

  await expect(page.getByText('E-waste — 10.00 kg')).toBeVisible();
  await expect(page.getByText('Glass — 3.00 kg')).toBeVisible();

  const id = page.url().split('/').pop() as string;
  await deletePickup(page, id);
});

test('evaluator can price a multi-item request as one lump total', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const fullName = uniqueName('Lump');
  const id = await seedMultiItemRequest(page.request, fullName);

  await page.goto(`/admin/pickups/${id}`);
  await page.getByRole('button', { name: 'Evaluate' }).click();
  const dialog = page.getByRole('dialog');

  // The lump/itemized toggle only renders because this request has
  // more than one item.
  await expect(
    dialog.getByRole('button', { name: 'One total price' }),
  ).toBeVisible();
  await page.locator('[data-field="price"] input').fill('345.00');
  await dialog.getByRole('button', { name: 'Approve' }).click();

  await expect(page.getByText('Approved', { exact: true })).toBeVisible();
  await expect(page.getByText('345.00')).toBeVisible();

  await deletePickup(page, id);
});

test('evaluator can price a multi-item request per item, live-summed into the total', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const fullName = uniqueName('Itemized');
  const id = await seedMultiItemRequest(page.request, fullName);

  await page.goto(`/admin/pickups/${id}`);
  await page.getByRole('button', { name: 'Evaluate' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Price each item' }).click();

  // One price input per material.
  await page.locator('[data-field="item-price-E-waste"] input').fill('300');
  await page.locator('[data-field="item-price-Glass"] input').fill('45');

  await expect(page.getByText('Total: 345.00')).toBeVisible();
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
      r.collection_request.id === id,
  );
  expect(record.price).toBe('345.00');
  expect(record.items).toHaveLength(2);
  expect(record.items.map((i: { price: string }) => i.price).sort()).toEqual(
    ['300.00', '45.00'].sort(),
  );

  await deletePickup(page, id);
});

test('driver collecting a multi-item request confirms a quantity per item', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const fullName = uniqueName('Collect');
  const id = await seedMultiItemRequest(page.request, fullName);
  await page.request.post(`/api/v1/pickups/${id}/evaluate/`, {
    data: { decision: 'approved', price: '100.00' },
  });
  const driverId = await getDriverId(page.request);
  await page.request.post(`/api/v1/pickups/${id}/assign-driver/`, {
    data: { driver: driverId },
  });

  await loginAs(page, 'qaDriver');
  await page.goto('/driver/pickups');
  await page.getByRole('button', { name: 'My Pickups' }).click();
  await page
    .locator('tr', { hasText: fullName })
    .getByRole('button', { name: `Mark pickup for ${fullName} as collected` })
    .click();

  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText('Collected quantity per item')).toBeVisible();
  // Pre-filled from each item's estimated_quantity (10 and 3).
  const ewasteQuantity = page.locator(
    '[data-field="item-quantity-E-waste"] input',
  );
  const glassQuantity = page.locator(
    '[data-field="item-quantity-Glass"] input',
  );
  await expect(ewasteQuantity).toHaveValue('10.00');
  await expect(glassQuantity).toHaveValue('3.00');
  // One E-waste computer was already sold before the driver arrived.
  await ewasteQuantity.fill('9');
  await page
    .locator('[data-field="payment_method"] select')
    .selectOption('cash');
  await dialog.getByRole('button', { name: 'Mark collected' }).click();

  await expect(page.getByText('Marked as collected')).toBeVisible();

  await loginAs(page, 'admin');
  await page.goto(`/admin/pickups/${id}`);
  // E-waste's collected quantity (9) differs from its estimate (10), so
  // it's unambiguous; Glass's collected and estimated quantities are
  // both 3, so it legitimately appears in both lists on the page.
  await expect(page.getByText('E-waste — 9.00 kg')).toBeVisible();
  await expect(page.getByText('Glass — 3.00 kg').first()).toBeVisible();

  await deletePickup(page, id);
});
