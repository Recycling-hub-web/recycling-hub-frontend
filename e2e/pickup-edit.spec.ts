import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Editing a pickup request — staff reach Edit from the details page and
 * correct the requester's details and the pickup address (e.g. a bare
 * "pv5" that the route optimizer can't locate).
 */

const seedPickupRequest = async (request: APIRequestContext) => {
  const categories = await request.get(
    '/api/v1/categories/?module=materials&is_active=true&page_size=1',
  );
  expect(categories.ok()).toBe(true);
  const [category] = (await categories.json()).results;

  const res = await request.post('/api/v1/pickups/', {
    data: {
      full_name: `E2E Edit ${Date.now()}`,
      email: 'e2e-edit@example.com',
      phone_number: '+60123456789',
      items: [{ category: category.id, estimated_quantity: '2' }],
      pickup_address: 'pv5',
    },
  });
  expect(res.ok()).toBe(true);
  return (await res.json()).id as string;
};

test('staff edit requester details and address from the details page', async ({
  page,
}) => {
  const id = await seedPickupRequest(page.request);
  const newName = `E2E Edited ${Date.now()}`;

  await loginAs(page, 'qaStaff');
  await page.goto(`/staff/pickups/${id}`);
  await page.getByRole('link', { name: 'Edit', exact: true }).click();
  await expect(page).toHaveURL(`/staff/pickups/${id}/edit`);

  const save = page.getByRole('button', { name: 'Save changes' });
  await expect(save).toBeDisabled();

  // Required fields are validated on submit, not by disabling Save.
  await page.locator('[data-field="full_name"] input').fill('');
  await expect(save).toBeEnabled();
  await save.click();
  await expect(page.getByText('Full name is required.')).toBeVisible();
  await expect(page).toHaveURL(`/staff/pickups/${id}/edit`);

  await page.locator('[data-field="full_name"] input').fill(newName);
  await page.locator('[data-field="phone_local"] input').fill('129998888');
  await page
    .locator('[data-field="pickup_address"] textarea')
    .fill('PV5 Platinum Hill Condo, Setapak, 53300 Kuala Lumpur');
  await save.click();

  await expect(page).toHaveURL(`/staff/pickups/${id}`);
  await expect(page.getByRole('heading', { name: newName })).toBeVisible();
  await expect(page.getByText('PV5 Platinum Hill Condo')).toBeVisible();
  await expect(page.getByText('+60129998888')).toBeVisible();

  // Cleanup — staff may delete pickup requests via the API.
  const del = await page.request.delete(`/api/v1/pickups/${id}/`);
  expect(del.ok()).toBe(true);
});
