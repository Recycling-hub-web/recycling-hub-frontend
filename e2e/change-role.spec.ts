import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';
import { orderActionItem, requestAction } from './helpers/orderActions';

/** User details → Actions → Change role: an admin moves a staff member
 * to driver. The role changes, their work details carry over, and the
 * admin's own role can't be changed from here. */

test('an admin changes a staff member to a driver', async ({ page }) => {
  await loginAs(page, 'admin');
  const email = `e2e-role-${Date.now()}@example.com`;
  const created = await page.request.post('/api/v1/accounts/users/', {
    data: {
      full_name: 'E2E Role Change',
      email,
      role: 'staff',
      department: 'Operations',
      branch: 'Shah Alam',
    },
  });
  expect(created.status(), await created.text()).toBe(201);
  const { id } = await created.json();

  await page.goto(`/admin/users/${id}`);
  await requestAction(page, 'Change role');
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText(/is currently Staff/)).toBeVisible();

  // Nothing chosen yet.
  await dialog.getByRole('button', { name: 'Change role' }).click();
  await expect(dialog.getByText('Choose the new role.')).toBeVisible();

  await dialog.locator('[data-field="role"] select').selectOption('driver');
  await expect(
    dialog.getByText(/need payout details before their first reimbursement/),
  ).toBeVisible();
  await dialog.getByRole('button', { name: 'Change role' }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText('Role changed')).toBeVisible();

  const after = await (
    await page.request.get(`/api/v1/accounts/users/${id}/`)
  ).json();
  expect(after.role).toBe('driver');

  const drivers = await (
    await page.request.get(
      `/api/v1/accounts/drivers/?search=${encodeURIComponent(email)}`,
    )
  ).json();
  const profile = (drivers.results ?? []).find(
    (d: { user: { id: string } }) => d.user.id === id,
  );
  expect(profile?.department).toBe('Operations');
  expect(profile?.branch).toBe('Shah Alam');
});

test('nobody can change their own role', async ({ page }) => {
  await loginAs(page, 'admin');
  const me = await (await page.request.get('/api/v1/accounts/me/')).json();
  await page.goto(`/admin/users/${me.id}`);
  const actions = page.getByRole('button', { name: 'Actions', exact: true });
  if (await actions.count()) {
    await actions.click();
    await expect(orderActionItem(page, 'Change role')).toHaveCount(0);
  }
});
