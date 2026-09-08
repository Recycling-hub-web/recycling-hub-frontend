import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';
import path from 'path';

import { loginAs } from './helpers/auth';

/**
 * Partnerships — covers the admin/staff lifecycle built for this module
 * (components/features/partnerships/). Shaped like categories.spec.ts
 * (one shared-access model), not contact.spec.ts, since admin and staff
 * have identical permissions here (verified against PartnerViewSet +
 * IsStaffOrReadOnly, both is_staff=True) — no permission split to prove.
 *
 * `logo` is required on the backend (no allow_blank/allow_null, unlike
 * cover_image elsewhere) — but this dev environment has no real storage
 * configured, so a UI upload can't actually complete here (same
 * limitation storage-files.spec.ts/blogs.spec.ts already document). The
 * Create test proves the upload is attempted and fails gracefully;
 * everything past creation (edit/status/list) uses a partner seeded
 * directly via the API, which — confirmed live — accepts a plain logo
 * string without checking the file actually exists in storage.
 */

const uniqueName = (label: string) => `E2E Partner ${label} ${Date.now()}`;

const seedPartner = async (request: APIRequestContext, name: string) => {
  const res = await request.post('/api/v1/partnerships/', {
    data: {
      name,
      logo: 'partners/e2e-seed.png',
      partnership_type: 'sponsor',
      website_url: 'https://example.com',
    },
  });
  expect(res.ok()).toBe(true);
  return (await res.json()).id as string;
};

test.describe('Admin partnerships', () => {
  test('validates the create form, then edits and deactivates a seeded partner', async ({
    page,
  }) => {
    const name = uniqueName('Main');
    const updatedName = `${name} Updated`;

    await loginAs(page, 'admin');
    await page.goto('/admin/partnerships');

    // Create: validation errors stay on the page — never navigate away.
    await page.getByRole('link', { name: /new partner/i }).click();
    await page.getByRole('button', { name: 'Create partner' }).click();
    await expect(page.getByText('Name is required.')).toBeVisible();
    await expect(page.getByText('Partnership type is required.')).toBeVisible();
    await expect(page.getByText('Website URL is required.')).toBeVisible();
    await expect(page.getByText('A logo is required.')).toBeVisible();

    // Logo upload — this dev environment has no real storage configured,
    // so the request fails with the backend's own graceful error,
    // surfaced inline here exactly like storage-files.spec.ts/
    // blogs.spec.ts assert for their own upload flows.
    await page
      .locator('#partner-logo-input')
      .setInputFiles(path.join(__dirname, 'fixtures/sample-upload.txt'));
    await expect(
      page.getByText(/failed to generate upload urls|storage configuration/i),
    ).toBeVisible();

    // Rest of the lifecycle continues against a partner seeded via the
    // API — the create form's own submission can't be completed here
    // without real storage.
    const partnerId = await seedPartner(page.request, name);
    await page.goto(`/admin/partnerships/${partnerId}`);
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
    await page
      .locator('[data-field="partnership_type"] select')
      .selectOption('corporate');
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    await expect(page).toHaveURL(/\/admin\/partnerships\/(?!create)[^/]+$/);
    await expect(page.getByText(/partner updated/i)).toBeVisible();
    await expect(
      page.getByRole('heading', { name: updatedName }),
    ).toBeVisible();
    // Both the header subtitle and the InfoRow show the type — either
    // is proof enough.
    await expect(
      page.getByText('Corporate', { exact: true }).first(),
    ).toBeVisible();

    // Deactivate (soft delete) — a secondary action launched from the
    // details page stays put and refetches, showing the new state in
    // place rather than navigating away.
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Deactivate', exact: true }).click();
    await expect(page.getByText(/partner deactivated/i)).toBeVisible();
    await expect(page.getByText('Inactive', { exact: true })).toBeVisible();

    // The list's status filter is a real backend query (?is_active=),
    // added alongside this feature.
    await page.goto('/admin/partnerships');
    await page.getByPlaceholder(/search by name/i).fill(updatedName);
    const filters = page.getByRole('combobox');
    await filters.nth(1).selectOption('false');
    const row = page.getByRole('row', { name: new RegExp(updatedName) });
    await expect(row).toBeVisible();
    await expect(row.getByText('Inactive', { exact: true })).toBeVisible();

    // The edit form's Status field doubles as the only way to
    // reactivate — there's no separate restore action.
    await row.getByRole('link', { name: /edit partner/i }).click();
    const statusField = page.locator('[data-field="is_active"] select');
    await expect(statusField).toHaveValue('false');
    await expect(saveButton).toBeDisabled();
    await statusField.selectOption('true');
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
    await expect(page.getByText('Active', { exact: true })).toBeVisible();

    // Cleanup — real hard delete isn't available (soft-delete only), so
    // deactivate to keep the real partner list clean for repeated runs.
    const finalPartnerId = page.url().split('/').pop() as string;
    await page.request.delete(`/api/v1/partnerships/${finalPartnerId}/`);
  });
});

test.describe('Staff partnerships', () => {
  test('has the same create/edit/delete access as admin', async ({ page }) => {
    await loginAs(page, 'qaStaff');

    const partnerId = await seedPartner(page.request, uniqueName('Staff'));

    // Staff can edit content too — no admin-only restriction on this
    // module, unlike contact messages.
    const patchResponse = await page.request.patch(
      `/api/v1/partnerships/${partnerId}/`,
      { data: { website_url: 'https://updated.example.com' } },
    );
    expect(patchResponse.ok()).toBe(true);
    const patched = await patchResponse.json();
    expect(patched.website_url).toBe('https://updated.example.com');

    // And can deactivate it — soft delete, same as admin.
    const deleteResponse = await page.request.delete(
      `/api/v1/partnerships/${partnerId}/`,
    );
    expect(deleteResponse.status()).toBe(204);
  });
});
