import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Driver route optimization (simple version, v1) — select some of the
 * driver's own scheduled stops and tap "Optimize Route". A real
 * OPENROUTESERVICE_API_KEY is configured in this dev environment (see
 * apps.pickups.routing.OpenRouteServiceClient — free tier, no billing
 * account needed), so this covers the full live path: the selection
 * UI, the modal, a real optimized order, and the two navigation-app
 * choices — plus the geocoding-failure path for an address that can't
 * be located at all.
 */

const E_WASTE_CATEGORY_ID = '89067cc7-38ef-4752-9cd4-3ea29975abcb';

const uniqueName = (label: string) =>
  `E2E OptimizeRoute ${label} ${Date.now()}`;

// Takes a pickup through evaluate -> assign-driver via the real API
// chain as an authenticated admin request context, landing it on the
// qaDriver's open Route in `scheduled` status — ready to appear on the
// driver's "My Pickups" tab.
const seedScheduledForDriver = async (
  request: APIRequestContext,
  fullName: string,
  pickupAddress = '1 Jalan Test, 50000 Kuala Lumpur',
) => {
  const createRes = await request.post('/api/v1/pickups/', {
    data: {
      full_name: fullName,
      email: 'e2e-optimize@example.com',
      phone_number: '+60123456789',
      category: E_WASTE_CATEGORY_ID,
      pickup_address: pickupAddress,
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

  return id as string;
};

test.describe('Driver route optimization', () => {
  test('selecting stops shows the Optimize Route bar, and the modal opens', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    const fullName = uniqueName('Select');
    const id = await seedScheduledForDriver(page.request, fullName);

    await loginAs(page, 'qaDriver');
    await page.goto('/driver/pickups');
    await page.getByRole('button', { name: 'My Pickups' }).click();

    const row = page.locator('tr', { hasText: fullName });
    await expect(row).toBeVisible();
    await expect(page.getByText('Optimize Route')).toHaveCount(0);

    await row.getByRole('checkbox').check();
    await expect(page.getByText('1/10 selected')).toBeVisible();
    await page.getByRole('button', { name: 'Optimize Route' }).click();

    await expect(page.getByText('Find the fastest order for')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Get optimized route' }),
    ).toBeVisible();

    await page.request.delete(`/api/v1/pickups/${id}/`);
  });

  test('optimizing returns a real order and offers both navigation apps', async ({
    page,
    context,
  }) => {
    await loginAs(page, 'admin');
    const a = uniqueName('MidValley');
    const b = uniqueName('Pavilion');
    const idA = await seedScheduledForDriver(
      page.request,
      a,
      'Mid Valley Megamall, Kuala Lumpur',
    );
    const idB = await seedScheduledForDriver(
      page.request,
      b,
      'Pavilion Kuala Lumpur',
    );

    await context.grantPermissions(['geolocation'], {
      origin: 'http://localhost:3000',
    });
    await context.setGeolocation({ latitude: 3.139, longitude: 101.6869 });

    await loginAs(page, 'qaDriver');
    await page.goto('/driver/pickups');
    await page.getByRole('button', { name: 'My Pickups' }).click();

    await page.locator('tr', { hasText: a }).getByRole('checkbox').check();
    await page.locator('tr', { hasText: b }).getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Optimize Route' }).click();

    // Neither of these fresh requests has a collection_point of its own
    // yet, so the picker is required here — confirms that real backend
    // validation live, separately from the optimize call itself.
    await page
      .locator('[data-field="collection_point"] select')
      .selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Get optimized route' }).click();

    await expect(
      page.getByRole('button', { name: 'Open in Google Maps' }),
    ).toBeVisible({ timeout: 15000 });
    await expect(
      page.getByRole('button', { name: 'Open in Waze' }),
    ).toBeVisible();
    // Both seeded stops appear in the optimized order list — scoped to
    // the modal's <li>s, since the table row behind it (still in the
    // DOM) matches the same text.
    await expect(page.locator('li', { hasText: a })).toBeVisible();
    await expect(page.locator('li', { hasText: b })).toBeVisible();

    await page.request.delete(`/api/v1/pickups/${idA}/`);
    await page.request.delete(`/api/v1/pickups/${idB}/`);
  });

  test('surfaces a geocoding failure for an address that cannot be located', async ({
    page,
    context,
  }) => {
    await loginAs(page, 'admin');
    const fullName = uniqueName('Unlocatable');
    const id = await seedScheduledForDriver(
      page.request,
      fullName,
      'zzqxnonexistentplace00000, nowhere',
    );

    await context.grantPermissions(['geolocation'], {
      origin: 'http://localhost:3000',
    });
    await context.setGeolocation({ latitude: 3.139, longitude: 101.6869 });

    await loginAs(page, 'qaDriver');
    await page.goto('/driver/pickups');
    await page.getByRole('button', { name: 'My Pickups' }).click();

    const row = page.locator('tr', { hasText: fullName });
    await row.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Optimize Route' }).click();
    await page
      .locator('[data-field="collection_point"] select')
      .selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Get optimized route' }).click();

    await expect(page.getByText(/could not locate/i)).toBeVisible({
      timeout: 15000,
    });

    await page.request.delete(`/api/v1/pickups/${id}/`);
  });

  test('caps selection at 10 stops, frontend-only', async ({ page }) => {
    await loginAs(page, 'admin');
    const label = uniqueName('Cap');
    const ids: string[] = [];
    for (let i = 0; i < 11; i += 1) {
      // Seeding is inherently sequential here (each is independent, but
      // there's no value parallelizing a one-off test setup loop).
      // eslint-disable-next-line no-await-in-loop
      ids.push(await seedScheduledForDriver(page.request, `${label}${i}`));
    }

    await loginAs(page, 'qaDriver');
    await page.goto('/driver/pickups');
    await page.getByRole('button', { name: 'My Pickups' }).click();

    // "Select all" only ever selects the first 10, even though all 11
    // seeded rows are eligible (same open route).
    await page.getByRole('checkbox', { name: 'Select all' }).check();
    await expect(page.getByText('10/10 selected')).toBeVisible();

    // Newest-first ordering (-created_at) means "select all" picks the
    // 10 most recently created, leaving the very first one seeded (now
    // the oldest, so last in the list) unchecked.
    const uncheckedRow = page.locator('tr', { hasText: `${label}0` });
    await expect(uncheckedRow.getByRole('checkbox')).toBeDisabled();

    await loginAs(page, 'admin');
    for (const id of ids) {
      // eslint-disable-next-line no-await-in-loop
      await page.request.delete(`/api/v1/pickups/${id}/`);
    }
  });
});
