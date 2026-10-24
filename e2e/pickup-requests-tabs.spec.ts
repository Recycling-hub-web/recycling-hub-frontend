import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Quick Leads live on the Pickup Requests page (following one up creates
 * a pickup request), next to "All Requests"; the Orders page is a single
 * table again, now with the confirmed pickup time per order.
 */

test('Quick Leads is a tab on the Pickup Requests page', async ({ page }) => {
  // A unique Malaysian mobile so the row is easy to find.
  const phone = `+6011${String(Date.now()).slice(-8)}`;
  const lead = await page.request.post('/api/v1/pickups/quick/', {
    data: { request_type: 'individual', phone_number: phone },
  });
  expect(lead.ok()).toBe(true);
  const leadId = (await lead.json()).id as string;

  await loginAs(page, 'admin');
  await page.goto('/admin/pickup-requests');
  await expect(
    page.getByRole('button', { name: 'All Requests', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Quick Leads', exact: true }).click();

  const row = page.locator('tr', { hasText: phone });
  await expect(row).toBeVisible();
  // Following up opens the convert form, which lives under Orders.
  await expect(
    row.getByRole('link', { name: `Follow up on lead from ${phone}` }),
  ).toHaveAttribute('href', `/admin/pickups/create?leadId=${leadId}`);

  // The Orders page no longer has tabs.
  await page.goto('/admin/pickups');
  await expect(
    page.getByRole('button', { name: 'Quick Leads', exact: true }),
  ).toHaveCount(0);
});

test('the Orders table shows the confirmed pickup time', async ({ page }) => {
  await loginAs(page, 'admin');
  const fullName = `E2E Orders Time ${Date.now()}`;
  const categories = await page.request.get(
    '/api/v1/categories/?module=materials&is_active=true&page_size=1',
  );
  const [category] = (await categories.json()).results;
  const req = await page.request.post('/api/v1/pickup-requests/', {
    data: {
      full_name: fullName,
      phone_number: '+60123456789',
      pickup_address: '1 Jalan Test, 50000 Kuala Lumpur',
      requested_at: new Date(Date.now() + 86_400_000).toISOString(),
    },
  });
  const pickupRequestId = (await req.json()).id as string;
  const order = await page.request.post(
    `/api/v1/pickup-requests/${pickupRequestId}/orders/`,
    { data: { items: [{ category: category.id }] } },
  );
  const orderId = (await order.json()).id as string;
  await page.request.post(`/api/v1/pickups/${orderId}/evaluate/`, {
    data: { decision: 'approved', price: '10.00' },
  });
  const drivers = await (
    await page.request.get('/api/v1/accounts/drivers/')
  ).json();
  const year = new Date().getFullYear() + 1;
  const assign = await page.request.post(
    `/api/v1/pickups/${orderId}/assign-driver/`,
    {
      data: {
        driver: drivers.results[0].id,
        scheduled_at: `${year}-03-14T08:45:00+08:00`,
      },
    },
  );
  expect(assign.ok()).toBe(true);

  await page.goto(`/admin/pickups?search=${encodeURIComponent(fullName)}`);
  await expect(
    page.getByRole('columnheader', { name: 'Confirmed pickup' }),
  ).toBeVisible();
  const row = page.locator('tr', { hasText: fullName });
  await expect(row).toContainText(`14 Mar ${year}`);

  await page.request.delete(`/api/v1/pickups/${orderId}/`);
});
