import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Notifications — covers the two anonymous-create exceptions in the
 * dispatch map (apps/audit/notifications.py's `("pickups", "created")`
 * entry): a public "Request a Callback" (quick lead) and the full
 * pickup request form both sit in a real staff/admin review queue,
 * unlike every other public submission in this codebase.
 */

// A real materials-module category id from the seeded dev DB — see
// e2e/pickups.spec.ts, which requires the same fixture.
const E_WASTE_CATEGORY_ID = '89067cc7-38ef-4752-9cd4-3ea29975abcb';

const uniquePhone = () => `+6019${Date.now().toString().slice(-7)}`;

test('submitting a quick lead notifies staff', async ({ page, request }) => {
  const phone = uniquePhone();

  const res = await request.post('/api/v1/pickups/quick/', {
    data: { phone_number: phone },
  });
  expect(res.ok()).toBe(true);

  await loginAs(page, 'qaStaff');
  await page.goto('/staff/notifications');

  const row = page.locator('main', { hasText: 'New callback request' }).first();
  await expect(row).toBeVisible();
  await expect(page.locator('main')).toContainText(phone);
});

test('quick lead notification bell badge clears via mark all read', async ({
  page,
  request,
}) => {
  const phone = uniquePhone();
  const res = await request.post('/api/v1/pickups/quick/', {
    data: { phone_number: phone },
  });
  expect(res.ok()).toBe(true);

  await loginAs(page, 'qaStaff');
  await page.goto('/staff/notifications');
  await page
    .locator('main button', { hasText: 'Mark all read' })
    .first()
    .click();

  await page.waitForTimeout(500);
  const bellBadge = page
    .getByRole('button', { name: 'Notifications' })
    .locator('span.bg-red-500');
  await expect(bellBadge).toHaveCount(0);
});

test('submitting the full pickup request form notifies staff', async ({
  page,
  request,
}) => {
  const fullName = `E2E Notif Pickup ${Date.now()}`;

  const res = await request.post('/api/v1/pickups/', {
    data: {
      full_name: fullName,
      email: 'e2e-notif@example.com',
      phone_number: '+60123456789',
      category: E_WASTE_CATEGORY_ID,
      pickup_address: '1 Jalan Test, 50000 Kuala Lumpur',
    },
  });
  expect(res.ok()).toBe(true);
  const { id } = await res.json();

  await loginAs(page, 'qaStaff');
  await page.goto('/staff/notifications');

  const row = page
    .locator('main button', { hasText: 'New pickup request submitted' })
    .first();
  await expect(row).toBeVisible();
  await expect(page.locator('main')).toContainText(fullName);

  await row.click();
  await expect(page).toHaveURL(new RegExp(`/staff/pickups/${id}$`));
});
