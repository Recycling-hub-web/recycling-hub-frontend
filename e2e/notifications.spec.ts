import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Notifications — covers the one anonymous-create exception in the
 * dispatch map (apps/audit/notifications.py's `("pickups", "created")`
 * entry): a public "Request a Callback" (quick lead) submission must
 * notify staff/admin, since it's the only public submission in this
 * codebase that sits in a real callback queue.
 */

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
