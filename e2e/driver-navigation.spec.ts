import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Driver navigation links — per-stop "Navigate" deep links to Google
 * Maps or Waze (no multi-stop route generation, no in-app map; Waze's
 * URL scheme has no multi-destination support, so this stays per-stop
 * for both apps). See features/pickups/utils/navigationLinks.ts.
 */

const E_WASTE_CATEGORY_ID = '89067cc7-38ef-4752-9cd4-3ea29975abcb';

test('driver can open Google Maps or Waze directions to an assigned pickup', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const fullName = `E2E Nav ${Date.now()}`;
  const address = '42 Jalan Ampang, 50450 Kuala Lumpur';

  const createRes = await page.request.post('/api/v1/pickups/', {
    data: {
      full_name: fullName,
      email: 'e2e-nav@example.com',
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
  await row.getByRole('button', { name: 'Navigate' }).click();

  const [googleMapsPopup] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('menuitem', { name: 'Google Maps' }).click(),
  ]);
  expect(googleMapsPopup.url()).toContain('google.com/maps/dir');
  expect(googleMapsPopup.url()).toContain(encodeURIComponent(address));
  await googleMapsPopup.close();

  await row.getByRole('button', { name: 'Navigate' }).click();
  const [wazePopup] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('menuitem', { name: 'Waze' }).click(),
  ]);
  expect(wazePopup.url()).toContain('waze.com/ul');
  expect(wazePopup.url()).toContain(encodeURIComponent(address));
  await wazePopup.close();

  await loginAs(page, 'admin');
  await page.request.delete(`/api/v1/pickups/${id}/`);
});
