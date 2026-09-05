import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Classifications — covers the admin/staff lifecycle built for this
 * module (components/features/classifications/). Shaped like
 * pickups.spec.ts/categories.spec.ts (one shared-access model), not
 * contact.spec.ts, since admin and staff have identical permissions here
 * (verified against ClassificationView + IsAdminOrStaffUser) — no
 * permission split to prove. Unlike Categories, delete here is a real
 * hard delete (no is_active field on this model at all), so a deleted
 * row is expected to actually disappear, not just flip to "Inactive".
 */

const uniqueName = (label: string) =>
  `E2E Classification ${label} ${Date.now()}`;

test.describe('Admin classifications', () => {
  test('creates, edits, then deletes a classification', async ({ page }) => {
    const name = uniqueName('Main');
    const updatedName = `${name} Updated`;

    await loginAs(page, 'admin');
    await page.goto('/admin/classifications');

    // Create: validation error stays on the page and shows an inline
    // error — never navigates away.
    await page.getByRole('link', { name: /new classification/i }).click();
    await page.getByRole('button', { name: 'Create classification' }).click();
    await expect(page.getByText('Name is required.')).toBeVisible();

    // Duplicate name: the backend's own uniqueness validation
    // (Classification.name is unique=True) surfaces as a real API error,
    // not a client-side guess.
    await page.locator('[data-field="name"] input').fill('Household');
    await page.getByRole('button', { name: 'Create classification' }).click();
    await expect(page.getByText(/already exists/i)).toBeVisible();

    await page.locator('[data-field="name"] input').fill(name);
    await page.getByRole('button', { name: 'Create classification' }).click();

    // Create action navigates to the new record's details page, with the
    // confirmation shown on arrival there. The url regex excludes
    // "create" itself (a literal path segment that would otherwise also
    // satisfy `[^/]+$` and resolve this assertion before the real
    // navigation happens).
    await expect(page).toHaveURL(/\/admin\/classifications\/(?!create)[^/]+$/);
    await expect(page.getByText(/classification created/i)).toBeVisible();
    await expect(page.getByRole('heading', { name })).toBeVisible();

    // Edit: Save has nothing to do until a field actually differs from
    // what was loaded — disabled on arrival, not just while submitting.
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Edit' }).click();
    await expect(page).toHaveURL(/\/edit$/);

    const saveButton = page.getByRole('button', { name: 'Save changes' });
    await expect(saveButton).toBeDisabled();

    await page.locator('[data-field="name"] input').fill(updatedName);
    await page
      .locator('[data-field="description"] textarea')
      .fill('Edited by the e2e suite.');
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    // Update/edit action: navigates to the record's details page, with
    // the confirmation shown on arrival there.
    await expect(page).toHaveURL(/\/admin\/classifications\/(?!create)[^/]+$/);
    await expect(page.getByText(/classification updated/i)).toBeVisible();
    await expect(
      page.getByRole('heading', { name: updatedName }),
    ).toBeVisible();
    await expect(page.getByText('Edited by the e2e suite.')).toBeVisible();

    // Delete is a real hard delete here (no is_active field on this
    // model) — the details page has no list to return to, so it
    // navigates back to the list on success.
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();

    await expect(page).toHaveURL(/\/admin\/classifications$/);
    await expect(page.getByText(/classification deleted/i)).toBeVisible();
    await page.getByPlaceholder(/search by name/i).fill(updatedName);
    // Not a row-based locator — once the list refetches empty, the
    // empty-state's "No matches for ..." text contains the name as a
    // substring and would still match a regex-based row locator (same
    // caveat as contact.spec.ts's delete test).
    await expect(
      page.getByText(updatedName, { exact: true }),
    ).not.toBeVisible();
  });
});

test.describe('Staff classifications', () => {
  test('has the same create/edit/delete access as admin', async ({ page }) => {
    const name = uniqueName('Staff');

    await loginAs(page, 'qaStaff');
    await page.goto('/staff/classifications');

    await page.getByRole('link', { name: /new classification/i }).click();
    await page.locator('[data-field="name"] input').fill(name);
    await page.getByRole('button', { name: 'Create classification' }).click();

    await expect(page).toHaveURL(/\/staff\/classifications\/(?!create)[^/]+$/);
    await expect(page.getByText(/classification created/i)).toBeVisible();

    const classificationId = page.url().split('/').pop() as string;

    // Staff can edit content too — no admin-only restriction on this
    // module, unlike contact messages.
    const patchResponse = await page.request.patch(
      `/api/v1/accounts/classifications/${classificationId}/`,
      { data: { description: 'Edited by staff via API.' } },
    );
    expect(patchResponse.ok()).toBe(true);
    const patched = await patchResponse.json();
    expect(patched.description).toBe('Edited by staff via API.');

    // And can delete it — a real hard delete, same as admin.
    const deleteResponse = await page.request.delete(
      `/api/v1/accounts/classifications/${classificationId}/`,
    );
    expect(deleteResponse.status()).toBe(204);
  });
});
