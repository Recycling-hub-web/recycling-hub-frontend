import { expect, test } from '@playwright/test';
import path from 'path';

import { loginAs } from './helpers/auth';

/**
 * Blog Posts — covers the admin/staff lifecycle built for this module
 * (components/features/blogs/). Shaped like categories.spec.ts (one
 * shared-access model, not contact.spec.ts), since admin and staff have
 * identical permissions here (verified live — staff could POST/DELETE
 * via curl — against BlogPostViewSet + IsStaffOrReadOnly). Delete is a
 * soft-archive (BlogPostViewSet.perform_destroy sets status=archived,
 * same spirit as Categories' is_active), and the edit form's Status
 * field doubles as the only way to republish — same pattern as
 * Categories' reactivate-via-status.
 */

const uniqueTitle = (label: string) => `E2E Blog Post ${label} ${Date.now()}`;

test.describe('Admin blog posts', () => {
  test('creates, edits content/category/status, then archives a post', async ({
    page,
  }) => {
    const title = uniqueTitle('Main');
    const updatedTitle = `${title} Updated`;

    await loginAs(page, 'admin');
    await page.goto('/admin/blogs');

    // Create: validation error stays on the page and shows inline
    // errors — never navigates away.
    await page.getByRole('link', { name: /new post/i }).click();
    await page.getByRole('button', { name: 'Create post' }).click();
    await expect(page.getByText('Title is required.')).toBeVisible();
    await expect(page.getByText('Content is required.')).toBeVisible();

    await page.locator('[data-field="title"] input').fill(title);
    await page
      .locator('[data-field="content"] textarea')
      .fill('Original body text.');

    // Cover image reuses Storage Files' presigned-upload flow — this
    // dev environment has no real storage configured, so the request
    // fails with the backend's own graceful error, surfaced inline here
    // exactly like storage-files.spec.ts asserts for the standalone
    // upload modal.
    await page
      .locator('#cover-image-input')
      .setInputFiles(path.join(__dirname, 'fixtures/sample-upload.txt'));
    await expect(
      page.getByText(/failed to generate upload urls|storage configuration/i),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Create post' }).click();

    // Create action navigates to the new record's details page, with
    // the confirmation shown on arrival there. New posts are always
    // created as Draft (the model default) — Status only becomes
    // editable on the edit form.
    await expect(page).toHaveURL(/\/admin\/blogs\/(?!create)[^/]+$/);
    await expect(page.getByText(/post created/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    await expect(page.getByText('Draft', { exact: true })).toBeVisible();

    // Edit: Save has nothing to do until a field actually differs from
    // what was loaded — disabled on arrival, not just while submitting.
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Edit' }).click();
    await expect(page).toHaveURL(/\/edit$/);

    const saveButton = page.getByRole('button', { name: 'Save changes' });
    await expect(saveButton).toBeDisabled();

    await page.locator('[data-field="title"] input').fill(updatedTitle);
    await page
      .locator('[data-field="content"] textarea')
      .fill('Updated body text.');
    await page
      .locator('[data-field="status"] select')
      .selectOption('published');
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    // Update/edit action: navigates to the record's details page, with
    // the confirmation shown on arrival there.
    await expect(page).toHaveURL(/\/admin\/blogs\/(?!create)[^/]+$/);
    await expect(page.getByText(/post updated/i)).toBeVisible();
    await expect(
      page.getByRole('heading', { name: updatedTitle }),
    ).toBeVisible();
    await expect(
      page.getByText('Published', { exact: true }).first(),
    ).toBeVisible();
    // Publishing sets published_at server-side — no longer "Not
    // published yet".
    await expect(page.getByText('Not published yet')).not.toBeVisible();

    // Archive (soft-delete): a secondary action launched from the
    // details page stays put and refetches, showing the new state in
    // place rather than navigating away.
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Archive' }).click();
    await page.getByRole('button', { name: 'Archive', exact: true }).click();
    await expect(page.getByText(/post archived/i)).toBeVisible();
    await expect(page.getByText('Archived', { exact: true })).toBeVisible();

    // Reactivating (republishing) is only ever possible through the
    // edit form's Status field — there's no separate restore action.
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Edit' }).click();
    const statusField = page.locator('[data-field="status"] select');
    await expect(statusField).toHaveValue('archived');
    await expect(saveButton).toBeDisabled();
    await statusField.selectOption('published');
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
    await expect(
      page.getByText('Published', { exact: true }).first(),
    ).toBeVisible();

    // Clean up so repeated runs don't pile up.
    const postId = page.url().split('/').pop() as string;
    await page.request.delete(`/api/v1/blogs/${postId}/`);
  });
});

test.describe('Staff blog posts', () => {
  test('has the same create/edit/archive access as admin', async ({ page }) => {
    const title = uniqueTitle('Staff');

    await loginAs(page, 'qaStaff');
    await page.goto('/staff/blogs');

    await page.getByRole('link', { name: /new post/i }).click();
    await page.locator('[data-field="title"] input').fill(title);
    await page.locator('[data-field="content"] textarea').fill('Body text.');
    await page.getByRole('button', { name: 'Create post' }).click();

    await expect(page).toHaveURL(/\/staff\/blogs\/(?!create)[^/]+$/);
    await expect(page.getByText(/post created/i)).toBeVisible();

    const postId = page.url().split('/').pop() as string;

    // Staff can publish content too — no admin-only restriction on this
    // module, unlike contact messages.
    const patchResponse = await page.request.patch(`/api/v1/blogs/${postId}/`, {
      data: { status: 'published' },
    });
    expect(patchResponse.ok()).toBe(true);
    const patched = await patchResponse.json();
    expect(patched.published_at).not.toBeNull();

    // And can archive it — soft delete, same as admin. There's no
    // hard-delete endpoint for posts, so this row stays as harmless
    // archived residue, same spirit as Categories' leftover inactive
    // test rows.
    const deleteResponse = await page.request.delete(
      `/api/v1/blogs/${postId}/`,
    );
    expect(deleteResponse.status()).toBe(204);
  });
});
