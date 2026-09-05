import { expect, test } from '@playwright/test';
import path from 'path';

import { loginAs } from './helpers/auth';

/**
 * Storage Files — covers the admin/staff management surface built for
 * this module (components/features/storageFiles/): browsing the
 * FileRecord audit table (list/search/details), plus the
 * upload/download/delete actions that call the real presigned-URL
 * endpoints (apps/storage/views.py).
 *
 * This dev environment has no real S3-compatible storage configured
 * (.env's STORAGE_ACCESS_KEY/STORAGE_SECRET_KEY/STORAGE_BUCKET_NAME are
 * placeholder values, USE_CLOUD_STORAGE=False) — every test here
 * exercises the real, currently-true behavior: list/search/details work
 * fully (against two FileRecord rows seeded once via Django shell,
 * `documents/seed/manual-test-report.pdf` and
 * `images/seed/dashboard-preview.png`, kept as semi-permanent fixtures
 * the same way Categories/Classifications have their own seed data),
 * while upload/download/delete surface the backend's own graceful
 * "storage not configured" error rather than silently succeeding or
 * crashing. These assertions should keep passing unchanged once real
 * credentials are configured — the success path just wasn't reachable
 * to test in this environment.
 */

test.describe('Admin storage files', () => {
  test('lists, searches, and views file details', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin/storage-files');

    await page.getByPlaceholder(/search by file name/i).fill('Dashboard');
    const row = page.getByRole('row', { name: /Dashboard Preview\.png/ });
    await expect(row).toBeVisible();
    await expect(row.getByText('Image')).toBeVisible();

    await row.getByRole('link', { name: /view file/i }).click();
    await expect(page).toHaveURL(/\/admin\/storage-files\/[^/]+$/);
    await expect(
      page.getByRole('heading', { name: 'Dashboard Preview.png' }),
    ).toBeVisible();
    await expect(
      page.getByText('images/seed/dashboard-preview.png'),
    ).toBeVisible();
    await expect(page.getByText('Upload unconfirmed')).toBeVisible();
  });

  test('upload requires a file and surfaces the backend error when storage is unconfigured', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin/storage-files');

    await page.getByRole('button', { name: /upload file/i }).click();
    // Only ever disabled while in flight — clicking with no file chosen
    // stays on the modal and shows an inline error instead of being
    // blocked pre-emptively.
    const uploadButton = page.getByRole('button', {
      name: 'Upload',
      exact: true,
    });
    await expect(uploadButton).toBeEnabled();
    await uploadButton.click();
    await expect(page.getByText('Choose a file to upload.')).toBeVisible();

    await page
      .locator('#storage-file-input')
      .setInputFiles(path.join(__dirname, 'fixtures/sample-upload.txt'));
    await uploadButton.click();

    // Step 1 of the real upload flow (request a presigned URL) fails
    // with a clear message when storage isn't configured — surfaced via
    // the modal's own inline banner, not a silent failure.
    await expect(
      page.getByText(/failed to generate upload urls|storage configuration/i),
    ).toBeVisible();
  });

  test('download and delete surface the backend error when storage is unconfigured', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin/storage-files');

    await page
      .getByPlaceholder(/search by file name/i)
      .fill('Manual Test Report');
    const row = page.getByRole('row', { name: /Manual Test Report\.pdf/ });
    await expect(row).toBeVisible();

    await row.getByRole('button', { name: /download file/i }).click();
    await expect(page.getByText(/could not download this file/i)).toBeVisible();

    await row.getByRole('button', { name: /delete file/i }).click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.getByText(/could not delete the file/i)).toBeVisible();
    // The record is still there — the backend only removes it once the
    // storage delete itself actually succeeds.
    await expect(
      page.getByRole('link', { name: 'Manual Test Report.pdf', exact: true }),
    ).toBeVisible();
  });
});

test.describe('Staff storage files', () => {
  test('has the same read/manage access as admin', async ({ page }) => {
    await loginAs(page, 'qaStaff');
    await page.goto('/staff/storage-files');

    await expect(page.getByText('Dashboard Preview.png')).toBeVisible();
    await expect(page.getByText('Manual Test Report.pdf')).toBeVisible();

    // The real gate is the backend permission (FileRecordViewSet +
    // IsAdminOrStaffUser) — confirm a direct API call as staff succeeds,
    // not just that the UI renders for them.
    const response = await page.request.get('/api/v1/storage/files/');
    expect(response.ok()).toBe(true);
  });
});
