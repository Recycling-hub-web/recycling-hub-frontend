import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Driver's own read-only Order "profile" page (DriverPickupDetailsView)
 * — reached by clicking a row in DriverPickupsView. No edit/schedule/
 * evaluate actions (those stay admin/staff-only); just the info a
 * driver needs about one stop, the Google Maps/Waze links the list
 * also has (hidden once collected — nowhere left to navigate to), and
 * the one driver-only action this page does have: confirming the
 * pickup time (covered in full in e2e/pickup-requests.spec.ts's
 * lifecycle walk — this file stays focused on the read-only info and
 * navigation links). See
 * features/pickups/components/driver/DriverPickupDetailsView.tsx.
 */

const E_WASTE_CATEGORY_ID = '89067cc7-38ef-4752-9cd4-3ea29975abcb';

test('driver can open an order from the list and see its read-only details', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const fullName = `E2E Driver Details ${Date.now()}`;
  const address = '42 Jalan Ampang, 50450 Kuala Lumpur';

  const requestRes = await page.request.post('/api/v1/pickup-requests/', {
    data: {
      full_name: fullName,
      email: 'e2e-driver-details@example.com',
      phone_number: '+60123456789',
      pickup_address: address,
      requested_at: new Date(Date.now() + 86_400_000).toISOString(),
    },
  });
  const pickupRequestId = (await requestRes.json()).id as string;
  const orderRes = await page.request.post(
    `/api/v1/pickup-requests/${pickupRequestId}/orders/`,
    { data: { items: [{ category: E_WASTE_CATEGORY_ID }] } },
  );
  const { id, code } = await orderRes.json();
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

  const row = page.locator('tr', { hasText: code });
  await expect(row).toBeVisible();
  await row.click();

  await expect(page).toHaveURL(new RegExp(`/driver/pickups/${id}`));
  await expect(page.getByRole('heading', { name: code })).toBeVisible();
  await expect(page.getByText(fullName)).toBeVisible();
  await expect(page.getByText(address)).toBeVisible();

  // Still scheduled (not yet collected) — navigation links are offered.
  await expect(page.getByRole('link', { name: 'Google Maps' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Waze' })).toBeVisible();
  // External navigation links — open in a new tab.
  await expect(page.getByRole('link', { name: 'Google Maps' })).toHaveAttribute(
    'target',
    '_blank',
  );

  // No edit/schedule/evaluate actions on this page — driver-only, read-only.
  await expect(
    page.getByRole('button', { name: /edit|schedule|evaluate/i }),
  ).toHaveCount(0);

  await page.request.post(`/api/v1/pickups/${id}/collect/`, { data: {} });

  await page.reload();
  await expect(page.getByRole('link', { name: 'Google Maps' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Waze' })).toHaveCount(0);

  await loginAs(page, 'admin');
  await page.request.delete(`/api/v1/pickups/${id}/`);
});
