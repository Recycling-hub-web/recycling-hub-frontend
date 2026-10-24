import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Material Categories — covers the admin/staff lifecycle built for this
 * module (components/features/categories/). Shaped like pickups.spec.ts
 * (one shared-access model), not contact.spec.ts, since admin and staff
 * have identical permissions here (verified against CategoryViewSet +
 * IsStaffOrReadOnly) — no permission split to prove.
 */

const uniqueName = (label: string) => `E2E Category ${label} ${Date.now()}`;

const seedCategory = async (request: APIRequestContext, name: string) => {
  const res = await request.post('/api/v1/categories/', {
    data: { name, module: 'materials' },
  });
  expect(res.ok()).toBe(true);
  return (await res.json()).id as string;
};

test.describe('Admin material categories', () => {
  test('creates, edits content/parent, deactivates, then reactivates a category', async ({
    page,
  }) => {
    const name = uniqueName('Main');
    const updatedName = `${name} Updated`;

    await loginAs(page, 'admin');
    const parentId = await seedCategory(page.request, uniqueName('Parent'));
    await page.goto('/admin/categories');

    // Create: validation error stays on the page and shows an inline
    // error — never navigates away.
    await page.getByRole('link', { name: /new category/i }).click();
    await page.getByRole('button', { name: 'Create category' }).click();
    await expect(page.getByText('Name is required.')).toBeVisible();

    await page.locator('[data-field="name"] input').fill(name);
    await page.getByRole('button', { name: 'Create category' }).click();

    // Create action navigates to the new record's details page, with the
    // confirmation shown on arrival there.
    await expect(page).toHaveURL(/\/admin\/categories\/(?!create)[^/]+$/);
    await expect(page.getByText(/category created/i)).toBeVisible();
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
    await page.locator('[data-field="parent"] select').selectOption(parentId);

    await saveButton.click();

    // Update/edit action: navigates to the record's details page, with
    // the confirmation shown on arrival there.
    await expect(page).toHaveURL(/\/admin\/categories\/(?!create)[^/]+$/);
    await expect(page.getByText(/category updated/i)).toBeVisible();
    await expect(
      page.getByRole('heading', { name: updatedName }),
    ).toBeVisible();
    // The detail serializer only returns the parent's id, not its name —
    // the details view resolves it with an extra fetch.
    await expect(page.getByText('Parent category')).toBeVisible();

    // Delete is a soft-deactivate here, not a real row removal — a
    // secondary action launched from the details page stays put and
    // refetches, showing the new state in place rather than navigating
    // away (no list to return to from a details page).
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Deactivate', exact: true }).click();
    await expect(page.getByText(/category deactivated/i)).toBeVisible();
    await expect(page.getByText('Inactive', { exact: true })).toBeVisible();

    // The list's Active/Inactive filter is a real backend query
    // (?is_active=), not a client-side filter — added alongside this
    // feature since CategoryViewSet previously only supported ?module=.
    await page.goto('/admin/categories');
    await page.getByPlaceholder(/search by name/i).fill(updatedName);
    await page.getByRole('combobox').selectOption('false');
    const row = page.getByRole('row', { name: new RegExp(updatedName) });
    await expect(row).toBeVisible();
    await expect(row.getByText('Inactive', { exact: true })).toBeVisible();

    // The edit form's Status field doubles as the only way to
    // reactivate — there's no separate restore action.
    await row.getByRole('link', { name: /edit category/i }).click();
    const statusField = page.locator('[data-field="is_active"] select');
    await expect(statusField).toHaveValue('false');
    await expect(saveButton).toBeDisabled();
    await statusField.selectOption('true');
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    await expect(page.getByText('Active', { exact: true })).toBeVisible();

    // Leave both test categories deactivated so repeated runs don't pile
    // up active clutter in the real category list — matches the
    // feature's real lifecycle (there's no hard-delete endpoint).
    const finalUrl = page.url();
    const categoryId = finalUrl.split('/').pop() as string;
    await page.request.delete(`/api/v1/categories/${categoryId}/`);
    await page.request.delete(`/api/v1/categories/${parentId}/`);
  });
});

test.describe('Staff material categories', () => {
  test('has the same create/edit/delete access as admin', async ({ page }) => {
    const name = uniqueName('Staff');

    await loginAs(page, 'qaStaff');
    await page.goto('/staff/categories');

    await page.getByRole('link', { name: /new category/i }).click();
    await page.locator('[data-field="name"] input').fill(name);
    await page.getByRole('button', { name: 'Create category' }).click();

    await expect(page).toHaveURL(/\/staff\/categories\/(?!create)[^/]+$/);
    await expect(page.getByText(/category created/i)).toBeVisible();

    const categoryId = page.url().split('/').pop() as string;

    // Staff can edit content too — no admin-only restriction on this
    // module, unlike contact messages.
    const patchResponse = await page.request.patch(
      `/api/v1/categories/${categoryId}/`,
      { data: { description: 'Edited by staff via API.' } },
    );
    expect(patchResponse.ok()).toBe(true);
    const patched = await patchResponse.json();
    expect(patched.description).toBe('Edited by staff via API.');

    // And can deactivate it — soft delete, same as admin.
    const deleteResponse = await page.request.delete(
      `/api/v1/categories/${categoryId}/`,
    );
    expect(deleteResponse.status()).toBe(204);
  });
});
