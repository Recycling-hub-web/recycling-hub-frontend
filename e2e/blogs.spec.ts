import type { APIRequestContext } from '@playwright/test';
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
 *
 * Publishing now requires a category (BlogPostSerializer.validate,
 * added alongside the module-expansion pass) — both tests below seed a
 * `posts`-module category via the API before attempting to publish,
 * same as they'd need to in real use.
 */

const uniqueTitle = (label: string) => `E2E Blog Post ${label} ${Date.now()}`;

const seedPostsCategory = async (request: APIRequestContext, name: string) => {
  const res = await request.post('/api/v1/categories/', {
    data: { name, module: 'posts' },
  });
  expect(res.ok()).toBe(true);
  return (await res.json()).id as string;
};

const seedTag = async (request: APIRequestContext, name: string) => {
  const res = await request.post('/api/v1/blogs/tags/', { data: { name } });
  expect(res.ok()).toBe(true);
  return (await res.json()).id as string;
};

test.describe('Admin blog posts', () => {
  test('creates, edits content/category/status, then archives a post', async ({
    page,
  }) => {
    const title = uniqueTitle('Main');
    const updatedTitle = `${title} Updated`;

    await loginAs(page, 'admin');
    const categoryId = await seedPostsCategory(
      page.request,
      uniqueTitle('Category'),
    );
    const tagName = uniqueTitle('Tag');
    await seedTag(page.request, tagName);
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
    // Publishing requires a category — see BlogPostSerializer.validate.
    await page
      .locator('[data-field="category"] select')
      .selectOption(categoryId);
    await page
      .locator('[data-field="status"] select')
      .selectOption('published');
    // The module-expansion fields: content type, difficulty, visibility,
    // location, featured toggle, and the tags picker (CheckSimpleBoxGroup).
    await page
      .locator('[data-field="content_type"] select')
      .selectOption('guide');
    await page
      .locator('[data-field="difficulty_level"] select')
      .selectOption('beginner');
    await page.locator('[data-field="location"] input').fill('Klang Valley');
    // SettingToggleInput's checkbox is visually hidden (sr-only) behind
    // its own switch UI — click the switch-row label that wraps it
    // instead (not the field's own outer label, hence .last()).
    await page.locator('[data-field="is_featured"] label').last().click();
    // Click the label text rather than the checkbox role directly — same
    // fix as the is_featured toggle above, more reliable against
    // CheckSimpleBoxGroup's own re-renders while typing elsewhere in the
    // form.
    await page
      .locator('[data-field="tags"] label', { hasText: tagName })
      .click();
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
    // The module-expansion fields all round-tripped onto the details page.
    await expect(page.getByText('Guide', { exact: true })).toBeVisible();
    await expect(page.getByText('Beginner', { exact: true })).toBeVisible();
    await expect(page.getByText('Featured', { exact: true })).toBeVisible();
    await expect(page.getByText('Klang Valley')).toBeVisible();
    await expect(page.getByText(tagName)).toBeVisible();

    // The category can't be deleted while a post still references it —
    // CategoryViewSet.perform_destroy's existing collection_requests
    // guard, extended to blog_posts alongside this module expansion.
    const blockedDelete = await page.request.delete(
      `/api/v1/categories/${categoryId}/`,
    );
    expect(blockedDelete.status()).toBe(400);

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

    // Clean up so repeated runs don't pile up. The category itself is
    // left as harmless residue rather than deleted — the post is only
    // archived, not actually removed, so it still references this
    // category and the delete-blocked-while-in-use guard
    // (CategoryViewSet.perform_destroy) would correctly reject it.
    const postId = page.url().split('/').pop() as string;
    await page.request.delete(`/api/v1/blogs/${postId}/`);
  });
});

test.describe('Staff blog posts', () => {
  test('has the same create/edit/archive access as admin', async ({ page }) => {
    const title = uniqueTitle('Staff');

    await loginAs(page, 'qaStaff');
    const categoryId = await seedPostsCategory(
      page.request,
      uniqueTitle('Staff Category'),
    );
    await page.goto('/staff/blogs');

    await page.getByRole('link', { name: /new post/i }).click();
    await page.locator('[data-field="title"] input').fill(title);
    await page.locator('[data-field="content"] textarea').fill('Body text.');
    await page.getByRole('button', { name: 'Create post' }).click();

    await expect(page).toHaveURL(/\/staff\/blogs\/(?!create)[^/]+$/);
    await expect(page.getByText(/post created/i)).toBeVisible();

    const postId = page.url().split('/').pop() as string;

    // Staff can publish content too — no admin-only restriction on this
    // module, unlike contact messages. Publishing requires a category
    // (BlogPostSerializer.validate).
    const patchResponse = await page.request.patch(`/api/v1/blogs/${postId}/`, {
      data: { status: 'published', category: categoryId },
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
