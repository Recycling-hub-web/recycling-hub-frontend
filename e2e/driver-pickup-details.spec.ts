import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Driver's own read-only pickup "profile" page
 * (DriverPickupDetailsView) — reached by clicking a row in
 * DriverPickupsView. No edit/schedule/evaluate actions (those stay
 * admin/staff-only); just the info a driver needs about one stop, plus
 * the same Google Maps/Waze links as the list, hidden once the pickup
 * is collected (nowhere left to navigate to). See
 * features/pickups/components/DriverPickupDetailsView.tsx.
 */

const E_WASTE_CATEGORY_ID = '89067cc7-38ef-4752-9cd4-3ea29975abcb';

test('driver can open a pickup from the list and see its read-only details', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const fullName = `E2E Driver Details ${Date.now()}`;
  const address = '42 Jalan Ampang, 50450 Kuala Lumpur';

  const createRes = await page.request.post('/api/v1/pickups/', {
    data: {
      full_name: fullName,
      email: 'e2e-driver-details@example.com',
      phone_number: '+60123456789',
      category: E_WASTE_CATEGORY_ID,
      pickup_address: address,
    },
  });
  const { id } = await createRes.json();
  await page.request.post(`/api/v1/pickups/${id}/evaluate/`, {
    data: { decision: 'approved', price: '10.00' },
  });
  const driversRes = await page.request.get('/api/v1/accounts/drivers/');
  const driver = (await driversRes.json()).results.find(
    (d: { user: { email: string } }) =>
      d.user.email === 'driver@recyclinghub.example',
  );
  await page.request.post(`/api/v1/pickups/${id}/assign-driver/`, {
    data: { driver: driver.id },
  });

  await loginAs(page, 'qaDriver');
  await page.goto('/driver/pickups');
  await page.getByRole('button', { name: 'My Pickups' }).click();

  const row = page.locator('tr', { hasText: fullName });
  await expect(row).toBeVisible();
  await row.click();

  await expect(page).toHaveURL(new RegExp(`/driver/pickups/${id}`));
  await expect(page.getByRole('heading', { name: fullName })).toBeVisible();
  await expect(page.getByText(address)).toBeVisible();

  // Still scheduled (not yet collected) — navigation links are offered.
  await expect(page.getByRole('button', { name: 'Google Maps' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Waze' })).toBeVisible();

  // No edit/schedule/evaluate actions on this page — driver-only, read-only.
  await expect(
    page.getByRole('button', { name: /edit|schedule|evaluate/i }),
  ).toHaveCount(0);

  await page.request.post(`/api/v1/pickups/${id}/collect/`, {
    data: {},
  });

  await page.reload();
  await expect(page.getByRole('button', { name: 'Google Maps' })).toHaveCount(
    0,
  );
  await expect(page.getByRole('button', { name: 'Waze' })).toHaveCount(0);

  await loginAs(page, 'admin');
  await page.request.delete(`/api/v1/pickups/${id}/`);
});
