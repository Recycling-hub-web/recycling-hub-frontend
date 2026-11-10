import type { APIRequestContext, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';
import { attachPhoto, mockStorageUploads } from './helpers/storage';

/**
 * - Pickup request details: more than one action → one "Actions"
 *   dropdown (Edit, Create order, Cancel request); a lone action stays a
 *   plain button.
 * - Pickup request edit: admin/staff can add new orders there too.
 * - An Admin can view another Admin but gets no edit/delete/resend
 *   actions (the backend refuses them anyway).
 */

const futureIso = () =>
  new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

const createRequest = async (request: APIRequestContext, name: string) => {
  const res = await request.post('/api/v1/pickup-requests/', {
    data: {
      full_name: name,
      phone_number: '+60123456789',
      pickup_address: '1 Jalan Test, 50000 Kuala Lumpur',
      requested_at: futureIso(),
    },
  });
  expect(res.ok()).toBeTruthy();
  return (await res.json()).id as string;
};

const actions = (page: Page) =>
  page.getByRole('button', { name: 'Actions', exact: true });

test.describe('Pickup request actions', () => {
  test('an open request has one Actions dropdown with all three actions', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    const id = await createRequest(page.request, `E2E Actions ${Date.now()}`);
    await page.goto(`/admin/pickup-requests/${id}`);

    // No loose action buttons in the header any more.
    await expect(page.getByRole('link', { name: 'Edit' })).toHaveCount(0);
    await actions(page).click();
    await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeVisible();
    await expect(
      page.getByRole('menuitem', { name: 'Create order' }),
    ).toBeVisible();
    await expect(
      page.getByRole('menuitem', { name: 'Cancel request' }),
    ).toBeVisible();

    await page.getByRole('menuitem', { name: 'Edit' }).click();
    await expect(page).toHaveURL(`/admin/pickup-requests/${id}/edit`);
  });

  test('a cancelled request keeps just a plain Edit button', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    const id = await createRequest(page.request, `E2E Cancelled ${Date.now()}`);
    const res = await page.request.post(
      `/api/v1/pickup-requests/${id}/cancel/`,
      { data: { note: 'e2e' } },
    );
    expect(res.ok()).toBeTruthy();

    await page.goto(`/admin/pickup-requests/${id}`);
    await expect(page.getByRole('link', { name: 'Edit' })).toBeVisible();
    await expect(actions(page)).toHaveCount(0);
  });

  test('orders can be added from the edit page', async ({ page }) => {
    test.setTimeout(90_000);
    // No real storage locally — same stand-in as the other order specs.
    await mockStorageUploads(page);
    await loginAs(page, 'admin');
    const name = `E2E Edit Orders ${Date.now()}`;
    const id = await createRequest(page.request, name);

    await page.goto(`/admin/pickup-requests/${id}/edit`);
    await expect(page.getByText(/This request has 0 orders/)).toBeVisible();
    await page.getByRole('button', { name: 'Add order' }).click();
    const order = page.getByTestId('new-order');
    await order.getByRole('button', { name: 'Add another item' }).click();
    await order
      .locator('[data-field="category"] select')
      .selectOption({ label: 'E-waste' });
    await order
      .locator('[data-field="quantity_unit"] select')
      .selectOption('kg');
    await attachPhoto(order);
    await expect(
      order.getByRole('button', { name: /Remove photo 1/ }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page).toHaveURL(`/admin/pickup-requests/${id}`, {
      timeout: 30_000,
    });
    await expect(page.getByText('1 order', { exact: true })).toBeVisible();

    const detail = await (
      await page.request.get(`/api/v1/pickup-requests/${id}/`)
    ).json();
    expect(detail.orders).toHaveLength(1);
  });
});

test.describe('An Admin and other Admins', () => {
  test('another Admin is view-only; your own account keeps its actions', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    const list = await (
      await page.request.get('/api/v1/accounts/users/?role=admin')
    ).json();
    const me = await (await page.request.get('/api/v1/accounts/me/')).json();
    const other = list.results.find((u: { id: string }) => u.id !== me.id) as {
      id: string;
      full_name: string;
    };
    expect(other).toBeTruthy();

    // Details page: no Actions for another Admin.
    await page.goto(`/admin/users/${other.id}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(actions(page)).toHaveCount(0);

    // List: that row can be viewed but not edited or deleted.
    await page.goto('/admin/users?role=admin');
    await expect(
      page.getByRole('link', { name: `View ${other.full_name}` }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: `Edit ${other.full_name}` }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: `Delete ${other.full_name}` }),
    ).toHaveCount(0);

    // And the backend refuses it regardless.
    const del = await page.request.delete(
      `/api/v1/accounts/users/${other.id}/`,
    );
    expect(del.status()).toBe(403);
  });
});
