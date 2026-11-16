import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/** New staff get the registration day as their joining date: the create
 * form doesn't ask for it, and the details page shows it. */

const today = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

test('a new staff member joins on the day they are registered', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  await page.goto('/admin/staff/create');
  await expect(page.locator('[data-field="joining_date"]')).toHaveCount(0);

  const email = `e2e-joining-${Date.now()}@example.com`;
  await page.locator('[data-field="full_name"] input').fill('E2E Joining Day');
  await page.locator('[data-field="email"] input').fill(email);
  await page.getByRole('button', { name: /^Create/ }).click();
  await expect(page).toHaveURL(/\/admin\/staff\/(?!create)[^/]+$/);

  const id = page.url().split('/').pop();
  const profile = await (
    await page.request.get(`/api/v1/accounts/staff/${id}/`)
  ).json();
  expect(profile.joining_date).toBe(today());
  await expect(page.getByText('Joining date')).toBeVisible();

  // The admin's User details page shows it too.
  await page.goto(`/admin/users/${profile.user.id}`);
  await expect(page.getByText('Joining date')).toBeVisible();
});
