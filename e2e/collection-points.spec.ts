import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Collection Points — covers the admin/staff CRUD built for this module
 * (components/features/collectionPoints/). Shaped like
 * classifications.spec.ts (one shared-access model, real hard delete —
 * CollectionPointViewSet.perform_destroy is a plain instance.delete(),
 * no soft-delete like Categories), not contact.spec.ts, since admin and
 * staff have identical permissions here (CollectionPointViewSet +
 * IsAdminOrStaffUser on every write action) — no permission split to
 * prove.
 */

const uniqueName = (label: string) =>
  `E2E Collection Point ${label} ${Date.now()}`;

test.describe('Admin collection points', () => {
  test('creates, edits, then deletes a collection point', async ({ page }) => {
    const name = uniqueName('Main');
    const updatedName = `${name} Updated`;

    await loginAs(page, 'admin');
    await page.goto('/admin/collection-points');

    // Create: validation errors stay on the page and show inline —
    // never navigate away. Unlike Classifications, three fields are
    // required here (name, address, city).
    await page.getByRole('link', { name: /new collection point/i }).click();
    await page.getByRole('button', { name: 'Create collection point' }).click();
    await expect(page.getByText('Name is required.')).toBeVisible();
    await expect(page.getByText('Address is required.')).toBeVisible();
    await expect(page.getByText('City is required.')).toBeVisible();

    await page.locator('[data-field="name"] input').fill(name);
    await page.locator('[data-field="address"] input').fill('12 Jalan Test');
    await page.locator('[data-field="city"] input').fill('Alor Setar');
    await page.getByRole('button', { name: 'Create collection point' }).click();

    // Create action navigates to the new record's details page, with
    // the confirmation shown on arrival there. The url regex excludes
    // "create" itself (a literal path segment that would otherwise
    // also satisfy `[^/]+$` and resolve this assertion before the real
    // navigation happens).
    await expect(page).toHaveURL(
      /\/admin\/collection-points\/(?!create)[^/]+$/,
    );
    await expect(page.getByText(/collection point created/i)).toBeVisible();
    await expect(page.getByRole('heading', { name })).toBeVisible();
    await expect(page.getByText('Active', { exact: true })).toBeVisible();

    // Edit: Save has nothing to do until a field actually differs from
    // what was loaded — disabled on arrival, not just while submitting.
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Edit' }).click();
    await expect(page).toHaveURL(/\/edit$/);

    const saveButton = page.getByRole('button', { name: 'Save changes' });
    await expect(saveButton).toBeDisabled();

    await page.locator('[data-field="name"] input').fill(updatedName);
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    // Update/edit action: navigates to the record's details page, with
    // the confirmation shown on arrival there.
    await expect(page).toHaveURL(
      /\/admin\/collection-points\/(?!create)[^/]+$/,
    );
    await expect(page.getByText(/collection point updated/i)).toBeVisible();
    await expect(
      page.getByRole('heading', { name: updatedName }),
    ).toBeVisible();

    // Delete is a real hard delete here (no soft-delete like
    // Categories) — the details page has no list to return to, so it
    // navigates back to the list on success.
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();

    await expect(page).toHaveURL(/\/admin\/collection-points$/);
    await expect(page.getByText(/collection point deleted/i)).toBeVisible();
    await page.getByPlaceholder(/search by name/i).fill(updatedName);
    await expect(
      page.getByText(updatedName, { exact: true }),
    ).not.toBeVisible();
  });

  test('toggling "Active" off is a real, savable change', async ({ page }) => {
    const name = uniqueName('Toggle');

    await loginAs(page, 'admin');
    await page.goto('/admin/collection-points/create');
    await page.locator('[data-field="name"] input').fill(name);
    await page.locator('[data-field="address"] input').fill('1 Jalan Test');
    await page.locator('[data-field="city"] input').fill('Alor Setar');
    await page.getByRole('button', { name: 'Create collection point' }).click();
    await expect(page).toHaveURL(
      /\/admin\/collection-points\/(?!create)[^/]+$/,
    );
    const id = page.url().split('/').pop() as string;

    await page.goto(`/admin/collection-points/${id}/edit`);
    const saveButton = page.getByRole('button', { name: 'Save changes' });
    await expect(saveButton).toBeDisabled();
    await page.getByText('Active', { exact: true }).click();
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    await expect(page).toHaveURL(/\/admin\/collection-points\/[^/]+$/);
    await expect(page.getByText('Inactive', { exact: true })).toBeVisible();

    await page.request.delete(`/api/v1/collection-points/${id}/`);
  });
});

test.describe('Staff collection points', () => {
  test('has the same create/edit/delete access as admin', async ({ page }) => {
    const name = uniqueName('Staff');

    await loginAs(page, 'qaStaff');
    await page.goto('/staff/collection-points');

    await page.getByRole('link', { name: /new collection point/i }).click();
    await page.locator('[data-field="name"] input').fill(name);
    await page.locator('[data-field="address"] input').fill('1 Jalan Test');
    await page.locator('[data-field="city"] input').fill('Alor Setar');
    await page.getByRole('button', { name: 'Create collection point' }).click();

    await expect(page).toHaveURL(
      /\/staff\/collection-points\/(?!create)[^/]+$/,
    );
    await expect(page.getByText(/collection point created/i)).toBeVisible();

    const collectionPointId = page.url().split('/').pop() as string;

    // Staff can edit content too — no admin-only restriction on this
    // module, unlike contact messages.
    const patchResponse = await page.request.patch(
      `/api/v1/collection-points/${collectionPointId}/`,
      { data: { postcode: '99999' } },
    );
    expect(patchResponse.ok()).toBe(true);
    const patched = await patchResponse.json();
    expect(patched.postcode).toBe('99999');

    // And can delete it — a real hard delete, same as admin.
    const deleteResponse = await page.request.delete(
      `/api/v1/collection-points/${collectionPointId}/`,
    );
    expect(deleteResponse.status()).toBe(204);
  });
});
