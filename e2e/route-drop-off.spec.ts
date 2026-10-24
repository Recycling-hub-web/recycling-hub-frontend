import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Store drop-off + Receiving Officer verification — the real, chosen
 * translation of "Collection & Store Drop-Off Flow": a real Route model
 * (apps/pickups/models.py), created implicitly when a request is first
 * assigned to a driver, closed out by the driver's batch drop-off
 * (status collected -> delivered), then verified/closed by a Receiving
 * Officer (delivered -> closed). Driver-collected path only — a staff
 * collector's pickups stay terminal at `collected`, same as before this
 * feature existed.
 *
 * Every drop-off records its store (Route.collection_point): the route's
 * planned end point by default, or one the driver picks — and Receiving
 * sees and filters deliveries by it.
 */

const E_WASTE_CATEGORY_ID = '89067cc7-38ef-4752-9cd4-3ea29975abcb';

const uniqueName = (label: string) => `E2E Route ${label} ${Date.now()}`;

// Takes a pickup through evaluate -> assign-driver -> collect via the
// real API chain as an authenticated admin request context, landing it
// on the qaDriver's open Route in `collected` status, ready to drop off.
const seedCollectedOnRoute = async (
  request: APIRequestContext,
  fullName: string,
) => {
  const createRes = await request.post('/api/v1/pickups/', {
    data: {
      full_name: fullName,
      email: 'e2e-route@example.com',
      phone_number: '+60123456789',
      items: [{ category: E_WASTE_CATEGORY_ID }],
      pickup_address: '1 Jalan Test, 50000 Kuala Lumpur',
    },
  });
  expect(createRes.ok()).toBe(true);
  const { id } = await createRes.json();

  const evalRes = await request.post(`/api/v1/pickups/${id}/evaluate/`, {
    data: { decision: 'approved', price: '15.00' },
  });
  expect(evalRes.ok()).toBe(true);

  const driversRes = await request.get('/api/v1/accounts/drivers/');
  const driver = (await driversRes.json()).results.find(
    (d: { user: { email: string } }) =>
      d.user.email === 'driver@recyclinghub.example',
  );
  const assignRes = await request.post(`/api/v1/pickups/${id}/assign-driver/`, {
    data: { driver: driver.id },
  });
  expect(assignRes.ok()).toBe(true);

  const collectRes = await request.post(`/api/v1/pickups/${id}/collect/`, {
    data: { actual_amount: '15.00', payment_method: 'cash' },
  });
  expect(collectRes.ok()).toBe(true);

  return id as string;
};

test('driver drops off a route, receiving officer verifies and closes it', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const fullName = uniqueName('Full');
  await seedCollectedOnRoute(page.request, fullName);
  const pointsRes = await page.request.get(
    '/api/v1/collection-points/?page_size=200',
  );
  const points: { id: string; name: string }[] = (await pointsRes.json())
    .results;
  const [store, otherStore] = points;

  await loginAs(page, 'qaDriver');
  await page.goto('/driver/drop-off');

  const row = page.locator('tr', { hasText: fullName });
  await expect(row).toBeVisible();
  await row.getByRole('checkbox').check();

  // The drop-off store card: pick the store explicitly — recorded as-is.
  const storeCard = page.getByRole('region', { name: 'Drop-off store' });
  await storeCard
    .locator('[data-field="collection_point"] select')
    .selectOption(store!.id);
  await expect(storeCard).toContainText(store!.name);
  await expect(
    storeCard.getByRole('link', { name: 'Google Maps' }),
  ).toBeVisible();

  await page.getByRole('button', { name: /drop off to store \(1\)/i }).click();
  await expect(page.getByText(/dropped off to store/i)).toBeVisible();
  await expect(page.locator('tr', { hasText: fullName })).toHaveCount(0);

  await loginAs(page, 'qaReceivingOfficer');
  await page.goto('/receiving/deliveries');
  const deliveredRow = page.locator('tr', { hasText: fullName });
  await expect(deliveredRow).toContainText('Delivered');
  // Shows which store it went to, and filters by it.
  await expect(deliveredRow).toContainText(store!.name);
  const storeFilter = page.getByRole('combobox', { name: 'Store' });
  await storeFilter.selectOption(otherStore!.id);
  await expect(page.locator('tr', { hasText: fullName })).toHaveCount(0);
  await storeFilter.selectOption(store!.id);
  await expect(deliveredRow).toBeVisible();
  // Icon-only row action — matched by its aria-label, not visible text.
  await deliveredRow.getByRole('button', { name: /verify and close/i }).click();
  await expect(page.getByText(/verified and closed/i)).toBeVisible();

  // Default filter is "delivered" — once closed, it drops off this view.
  await expect(page.locator('tr', { hasText: fullName })).toHaveCount(0);
});

test('receiving officer never sees requests earlier in the lifecycle', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const fullName = uniqueName('Pending');
  const createRes = await page.request.post('/api/v1/pickups/', {
    data: {
      full_name: fullName,
      email: 'e2e-route@example.com',
      phone_number: '+60123456789',
      items: [{ category: E_WASTE_CATEGORY_ID }],
      pickup_address: '1 Jalan Test, 50000 Kuala Lumpur',
    },
  });
  const { id } = await createRes.json();

  await loginAs(page, 'qaReceivingOfficer');
  await page.goto('/receiving/deliveries');
  await expect(page.locator('tr', { hasText: fullName })).toHaveCount(0);

  await loginAs(page, 'admin');
  await page.request.delete(`/api/v1/pickups/${id}/`);
});
