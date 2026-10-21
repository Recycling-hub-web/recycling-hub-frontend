import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Editing an Order (EditOrderView, /staff/pickups/{id}/edit) — since
 * the Request/Order restructure, contact/address fields moved up to
 * the parent PickupRequest (edited from its own details page instead
 * — see e2e/pickup-requests.spec.ts's "editing a request" test). What's
 * left editable here is the Order's own requested_date/note/items,
 * items only while evaluation is still pending.
 */

const seedOrder = async (request: APIRequestContext): Promise<string> => {
  const categories = await request.get(
    '/api/v1/categories/?module=materials&is_active=true&page_size=1',
  );
  expect(categories.ok()).toBe(true);
  const [category] = (await categories.json()).results;

  const requestRes = await request.post('/api/v1/pickup-requests/', {
    data: {
      full_name: `E2E Edit ${Date.now()}`,
      email: 'e2e-edit@example.com',
      phone_number: '+60123456789',
      pickup_address: 'pv5',
      requested_at: new Date(Date.now() + 86_400_000).toISOString(),
    },
  });
  expect(requestRes.ok()).toBe(true);
  const pickupRequestId = (await requestRes.json()).id as string;

  const orderRes = await request.post(
    `/api/v1/pickup-requests/${pickupRequestId}/orders/`,
    { data: { items: [{ category: category.id, estimated_quantity: '2' }] } },
  );
  expect(orderRes.ok()).toBe(true);
  return (await orderRes.json()).id as string;
};

test("staff edit an order's note and materials from its details page", async ({
  page,
}) => {
  const orderId = await seedOrder(page.request);

  await loginAs(page, 'qaStaff');
  await page.goto(`/staff/pickups/${orderId}`);
  await page.getByRole('link', { name: 'Edit', exact: true }).click();
  await expect(page).toHaveURL(`/staff/pickups/${orderId}/edit`);

  // No contact/address fields here any more — those live on the parent
  // pickup request now.
  await expect(page.locator('[data-field="full_name"]')).toHaveCount(0);
  await expect(page.locator('[data-field="pickup_address"]')).toHaveCount(0);

  const save = page.getByRole('button', { name: 'Save changes' });
  await expect(save).toBeDisabled();

  await page
    .locator('[data-field="note"] textarea')
    .fill('Customer asked for a morning slot.');
  await expect(save).toBeEnabled();
  await save.click();

  await expect(page).toHaveURL(`/staff/pickups/${orderId}`);
  await expect(
    page.getByText('Customer asked for a morning slot.'),
  ).toBeVisible();

  // Cleanup — staff may delete orders via the API.
  const del = await page.request.delete(`/api/v1/pickups/${orderId}/`);
  expect(del.ok()).toBe(true);
});
