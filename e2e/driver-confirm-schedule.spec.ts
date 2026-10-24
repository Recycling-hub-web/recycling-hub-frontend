import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * The assigned driver confirms the pickup day and time straight from the
 * Pickup Requests table (calendar-check icon → ConfirmScheduleModal), and
 * the confirmed day and time then shows in the table and on the order's
 * details page.
 */

const seedApprovedOrder = async (
  request: APIRequestContext,
  fullName: string,
) => {
  const categories = await request.get(
    '/api/v1/categories/?module=materials&is_active=true&page_size=1',
  );
  const [category] = (await categories.json()).results;
  const requestRes = await request.post('/api/v1/pickup-requests/', {
    data: {
      full_name: fullName,
      phone_number: '+60123456789',
      pickup_address: '42 Jalan Ampang, 50450 Kuala Lumpur',
      requested_at: new Date(Date.now() + 86_400_000).toISOString(),
    },
  });
  const pickupRequestId = (await requestRes.json()).id as string;
  const orderRes = await request.post(
    `/api/v1/pickup-requests/${pickupRequestId}/orders/`,
    { data: { items: [{ category: category.id }] } },
  );
  const orderId = (await orderRes.json()).id as string;
  await request.post(`/api/v1/pickups/${orderId}/evaluate/`, {
    data: { decision: 'approved', price: '10.00' },
  });
  return orderId;
};

test('a time set by admin while assigning is already confirmed for the driver', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const fullName = `E2E Admin Time ${Date.now()}`;
  const orderId = await seedApprovedOrder(page.request, fullName);
  const drivers = await (
    await page.request.get('/api/v1/accounts/drivers/')
  ).json();
  const driver = drivers.results.find(
    (d: { user: { email: string } }) =>
      d.user.email === 'driver@recyclinghub.example',
  );

  await page.goto(`/admin/pickups/${orderId}`);
  await page.getByRole('button', { name: 'Schedule pickup' }).click();
  await page.locator('[data-field="driver"] select').selectOption(driver.id);
  const year = new Date().getFullYear() + 1;
  await page
    .locator('[data-field="scheduled_at"] input')
    .fill(`${year}-11-20T09:15`);
  await page.getByRole('button', { name: 'Schedule', exact: true }).click();
  await expect(page.getByText('Pickup time confirmed')).toBeVisible();

  await loginAs(page, 'qaDriver');
  await page.goto('/driver/pickups');
  const row = page.locator('tr', { hasText: fullName });
  await expect(row).toContainText(`20 Nov ${year}`);
  await expect(row).not.toContainText('Not confirmed');
  await expect(
    row.getByRole('button', {
      name: `Confirm pickup date and time for ${fullName}`,
    }),
  ).toHaveCount(0);

  await loginAs(page, 'admin');
  await page.request.delete(`/api/v1/pickups/${orderId}/`);
});

test('driver confirms the pickup date and time from the table', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const fullName = `E2E Confirm ${Date.now()}`;

  const categories = await page.request.get(
    '/api/v1/categories/?module=materials&is_active=true&page_size=1',
  );
  const [category] = (await categories.json()).results;

  const requestRes = await page.request.post('/api/v1/pickup-requests/', {
    data: {
      full_name: fullName,
      phone_number: '+60123456789',
      pickup_address: '42 Jalan Ampang, 50450 Kuala Lumpur',
      requested_at: new Date(Date.now() + 86_400_000).toISOString(),
    },
  });
  expect(requestRes.ok()).toBe(true);
  const pickupRequestId = (await requestRes.json()).id as string;

  const orderRes = await page.request.post(
    `/api/v1/pickup-requests/${pickupRequestId}/orders/`,
    { data: { items: [{ category: category.id }] } },
  );
  expect(orderRes.ok()).toBe(true);
  const orderId = (await orderRes.json()).id as string;

  await page.request.post(`/api/v1/pickups/${orderId}/evaluate/`, {
    data: { decision: 'approved', price: '10.00' },
  });
  const drivers = await (
    await page.request.get('/api/v1/accounts/drivers/')
  ).json();
  const driver = drivers.results.find(
    (d: { user: { email: string } }) =>
      d.user.email === 'driver@recyclinghub.example',
  );
  const assign = await page.request.post(
    `/api/v1/pickups/${orderId}/assign-driver/`,
    { data: { driver: driver.id } },
  );
  expect(assign.ok()).toBe(true);

  await loginAs(page, 'qaDriver');
  await page.goto('/driver/pickups');

  const row = page.locator('tr', { hasText: fullName });
  await expect(row).toContainText('Not confirmed');

  // The customer's number is a WhatsApp link.
  const whatsApp = row.getByRole('link', {
    name: 'Message +60123456789 on WhatsApp',
  });
  await expect(whatsApp).toHaveAttribute('href', 'https://wa.me/60123456789');
  await expect(whatsApp).toHaveAttribute('target', '_blank');

  await row
    .getByRole('button', {
      name: `Confirm pickup date and time for ${fullName}`,
    })
    .click();
  // 25 Dec, 10:30 next year — far enough ahead to always be in the future.
  const year = new Date().getFullYear() + 1;
  await page
    .locator('[data-field="scheduled_at"] input')
    .fill(`${year}-12-25T10:30`);
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();

  await expect(page.getByText('Pickup time confirmed')).toBeVisible();
  await expect(row).not.toContainText('Not confirmed');
  await expect(row).toContainText(`25 Dec ${year}`);
  await expect(row).toContainText('10:30');
  // Once confirmed, the confirm icon is gone.
  await expect(
    row.getByRole('button', {
      name: `Confirm pickup date and time for ${fullName}`,
    }),
  ).toHaveCount(0);

  await row.click();
  await expect(page.getByText('Confirmed pickup')).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Message +60123456789 on WhatsApp' }),
  ).toHaveAttribute('href', 'https://wa.me/60123456789');
  await expect(page.getByText(`25 Dec ${year}`)).toBeVisible();

  await loginAs(page, 'admin');
  await page.request.delete(`/api/v1/pickups/${orderId}/`);
});
