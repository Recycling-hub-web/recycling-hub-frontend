import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Staff Management (features/staff/) — Create/Edit/Details still hit
 * the dedicated apps.accounts.StaffManagementView module (admin-only:
 * create/update/delete are all IsAdminUser). The list at /admin/staff
 * itself, though, shows every account of every role — it's
 * StaffListView reusing the Users feature's own useUsers/UserTable
 * wholesale, per the user's explicit request to see all users there.
 *
 * A real consequence of that: deleting a staff *profile* here is a
 * hard delete of the StaffProfile row only — the linked User account
 * survives (unchanged, longstanding backend behavior) — so the row
 * does NOT disappear from this now-all-users list the way it used to
 * when the list only ever showed StaffProfile rows. It just loses its
 * employment fields (which this list doesn't show anyway) and keeps
 * showing as a plain "Staff" account. Cleaned up via the API afterward
 * so repeated runs don't accumulate profile-less test accounts.
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

    // Delete: a real hard delete of the StaffProfile row, not a status
    // change — but the linked User account survives, so (unlike before
    // this list showed every account) the row itself does NOT leave the
    // list — it's still a real account, just without an employment
    // profile any more.
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/staff$/);
    await expect(page.getByText(/staff profile deleted/i)).toBeVisible();
    await page.getByPlaceholder(/search/i).fill('E2E Staff Member');
    const row = page.getByRole('cell', {
      name: 'E2E Staff Member',
      exact: true,
    });
    await expect(row).toHaveCount(1);

    // Cleanup — the orphaned User account (StaffProfile gone, account
    // itself intact) isn't reachable to delete from this UI flow
    // anymore, so remove it directly via the API it now shows through.
    await row.click();
    await expect(page).toHaveURL(/\/admin\/users\/[^/]+$/);
    const userId = page.url().split('/').pop();
    const deleteResponse = await page.request.delete(
      `/api/v1/accounts/users/${userId}/`,
    );
    expect(deleteResponse.status()).toBe(204);
  });

  test('is not reachable by a staff-role login', async ({ page }) => {
    await loginAs(page, 'qaStaff');
    await page.goto('/admin/staff');
    await expect(page).toHaveURL(/\/unauthorized$/);
  });
});
