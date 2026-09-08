import { expect, test } from '@playwright/test';
import path from 'path';

import { loginAs } from './helpers/auth';

/**
 * Users (features/users/) — the generic apps.accounts.UserManagementView
 * module, distinct from Staff Management (features/staff/). Admin and
 * staff have identical permissions here (IsAdminOrStaffUser, no
 * get_permissions override), so no admin-only gate like staff.spec.ts.
 *
 * `profile_photo` lives on User itself (see UserCreateSerializer) so
 * every role can have one, but this dev environment has no real storage
 * configured — the Create test proves the upload is attempted and fails
 * gracefully, same limitation every other upload-field spec documents.
 */

const uniqueEmail = (label: string) =>
  `e2e.user.${label}.${Date.now()}@recyclinghub.example`;

test.describe('Admin users', () => {
  test('creates a driver with a profile, edits, then deletes it', async ({
    page,
  }) => {
    const email = uniqueEmail('main');
    const fullName = `E2E User ${Date.now()}`;
    const updatedName = `${fullName} Updated`;

    await loginAs(page, 'admin');
    await page.goto('/admin/users');

    // Create: validation errors stay on the page — never navigate away.
    await page.getByRole('link', { name: /new user/i }).click();
    await page.getByRole('button', { name: 'Create user' }).click();
    await expect(page.getByText('Full name is required.')).toBeVisible();
    await expect(page.getByText('Email is required.')).toBeVisible();

    await page.locator('[data-field="full_name"] input').fill(fullName);
    await page.locator('[data-field="email"] input').fill(email);

    // Role defaults to Staff — switching to a role with an employment
    // profile reveals department/position/branch/joining date, exactly
    // like CreateStaffView's own fields.
    await page.locator('[data-field="role"] select').selectOption('driver');
    await page.locator('[data-field="department"] input').fill('Operations');
    await page.locator('[data-field="job_title"] input').fill('Collector');
    await page.locator('[data-field="branch"] input').fill('Kuala Lumpur HQ');

    // Photo upload — this dev environment has no real storage configured,
    // so the request fails with the backend's own graceful error,
    // surfaced inline here exactly like staff.spec.ts/blogs.spec.ts
    // assert for their own upload flows.
    await page
      .locator('#profile-photo-input')
      .setInputFiles(path.join(__dirname, 'fixtures/sample-upload.txt'));
    await expect(
      page.getByText(/failed to generate upload urls|storage configuration/i),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Create user' }).click();

    await expect(page).toHaveURL(/\/admin\/users\/(?!create)[^/]+$/);
    await expect(page.getByText(/user created/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: fullName })).toBeVisible();

    // Row click: the list row itself navigates to details — clicking the
    // Name cell (not an action icon) is enough.
    await page.goto('/admin/users');
    await page.getByPlaceholder(/search/i).fill(fullName);
    await page.getByText(fullName, { exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/users\/(?!create)[^/]+$/);
    await expect(page.getByRole('heading', { name: fullName })).toBeVisible();

    // Edit: Save has nothing to do until a field actually differs from
    // what was loaded — disabled on arrival, not just while submitting.
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Edit' }).click();
    await expect(page).toHaveURL(/\/edit$/);

    const saveButton = page.getByRole('button', { name: 'Save changes' });
    await expect(saveButton).toBeDisabled();

    await page.locator('[data-field="full_name"] input').fill(updatedName);
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    await expect(page).toHaveURL(/\/admin\/users\/(?!create)[^/]+$/);
    await expect(page.getByText(/user updated/i)).toBeVisible();
    await expect(
      page.getByRole('heading', { name: updatedName }),
    ).toBeVisible();

    // Delete: a real hard delete, not a status change — leaves the list.
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/users$/);
    await expect(page.getByText(/user deleted/i)).toBeVisible();
    await expect(
      page.getByRole('cell', { name: updatedName, exact: true }),
    ).toHaveCount(0);
  });
});

test.describe('Staff users', () => {
  test('has the same create/edit/delete access as admin', async ({ page }) => {
    await loginAs(page, 'qaStaff');

    const email = uniqueEmail('staff');
    const createResponse = await page.request.post('/api/v1/accounts/users/', {
      data: {
        full_name: 'E2E Staff-Created User',
        email,
        role: 'accounting',
      },
    });
    expect(createResponse.ok()).toBe(true);
    const user = await createResponse.json();

    const patchResponse = await page.request.patch(
      `/api/v1/accounts/users/${user.id}/`,
      { data: { phone_number: '+60123456789' } },
    );
    expect(patchResponse.ok()).toBe(true);
    expect((await patchResponse.json()).phone_number).toBe('+60123456789');

    const deleteResponse = await page.request.delete(
      `/api/v1/accounts/users/${user.id}/`,
    );
    expect(deleteResponse.status()).toBe(204);
  });
});
