import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Staff Management (features/staff/) — the dedicated
 * apps.accounts.StaffManagementView module, distinct from the generic
 * Users page. Admin only: create/update/delete are all IsAdminUser on
 * the backend (list is also open to staff, but only for the Pickups
 * collector picker, never a UI screen — see
 * features/pickups/services/collectorService.ts). No status field, no
 * search box (the endpoint has none), and delete is a real hard delete
 * of the StaffProfile row — the linked User account survives.
 */

const uniqueEmail = (label: string) =>
  `e2e.staff.${label}.${Date.now()}@recyclinghub.example`;

test.describe('Admin staff management', () => {
  test('creates, edits, then deletes a staff profile', async ({ page }) => {
    const email = uniqueEmail('main');

    await loginAs(page, 'admin');
    await page.goto('/admin/staff');

    // Create: validation error stays on the page — never navigates away.
    await page.getByRole('link', { name: /new staff/i }).click();
    await page.getByRole('button', { name: 'Create staff member' }).click();
    await expect(page.getByText('Full name is required.')).toBeVisible();
    await expect(page.getByText('Email is required.')).toBeVisible();

    await page
      .locator('[data-field="full_name"] input')
      .fill('E2E Staff Member');
    await page.locator('[data-field="email"] input').fill(email);
    await page.locator('[data-field="department"] input').fill('Operations');
    await page.locator('[data-field="position"] input').fill('Coordinator');
    await page.locator('[data-field="branch"] input').fill('Kuala Lumpur HQ');
    await page.getByRole('button', { name: 'Create staff member' }).click();

    await expect(page).toHaveURL(/\/admin\/staff\/(?!create)[^/]+$/);
    await expect(page.getByText(/staff member created/i)).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'E2E Staff Member' }),
    ).toBeVisible();
    await expect(page.getByText('Operations')).toBeVisible();

    // Edit: Save has nothing to do until a field actually differs from
    // what was loaded — disabled on arrival, not just while submitting.
    // full_name/email are read-only here (they live on User, not
    // StaffProfile — StaffUpdateSerializer doesn't accept them).
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Edit' }).click();
    await expect(page).toHaveURL(/\/edit$/);

    const saveButton = page.getByRole('button', { name: 'Save changes' });
    await expect(saveButton).toBeDisabled();
    // The subtitle ("E2E Staff Member · EMP-...") also contains this
    // text, hence the exact match on the read-only field's own value.
    await expect(
      page.getByText('E2E Staff Member', { exact: true }),
    ).toBeVisible();
    // exact: true — the still-visible "Staff member created" toast from
    // the previous step also contains this email mid-sentence.
    await expect(page.getByText(email, { exact: true })).toBeVisible();

    await page.locator('[data-field="department"] input').fill('Finance');
    await page.locator('[data-field="branch"] input').fill('Penang Branch');
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    await expect(page).toHaveURL(/\/admin\/staff\/(?!create)[^/]+$/);
    await expect(page.getByText(/staff profile updated/i)).toBeVisible();
    await expect(page.getByText('Finance')).toBeVisible();
    await expect(page.getByText('Penang Branch')).toBeVisible();

    // Delete: a real hard delete, not a status change — leaves the list.
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/staff$/);
    await expect(page.getByText(/staff profile deleted/i)).toBeVisible();
    // A heading-role check would prove nothing here (the table isn't a
    // heading either way) — check the row itself is gone.
    await expect(
      page.getByRole('cell', { name: 'E2E Staff Member', exact: true }),
    ).toHaveCount(0);
  });

  test('is not reachable by a staff-role login', async ({ page }) => {
    await loginAs(page, 'qaStaff');
    await page.goto('/admin/staff');
    await expect(page).toHaveURL(/\/unauthorized$/);
  });
});
