import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * A material category can have an optional image, uploaded through the
 * same presigned flow as every other upload. The local dev backend has no
 * storage configured, so the two storage calls are faked here: the API's
 * presigned-URL step and the browser's PUT to the Space. Everything else
 * (saving the key on the category, showing it) is real.
 */

const FILE_KEY = 'images/e2e-category-image.png';
const SPACE = 'https://recyclinghub-e2e.sgp1.digitaloceanspaces.com';
// 1×1 transparent PNG.
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64',
);

test.beforeEach(async ({ page }) => {
  await page.route('**/api/v1/storage/presigned-upload-urls**', (route) =>
    route.fulfill({
      json: {
        uploads: [
          {
            upload_url: `${SPACE}/${FILE_KEY}?X-Amz-Signature=fake`,
            method: 'PUT',
            headers: { 'Content-Type': 'image/png' },
            file_key: FILE_KEY,
            public_url: `${SPACE}/${FILE_KEY}`,
            expires_in: 300,
          },
        ],
      },
    }),
  );
  await page.route(`${SPACE}/**`, (route) =>
    route.request().method() === 'PUT'
      ? route.fulfill({ status: 200 })
      : route.fulfill({ status: 200, contentType: 'image/png', body: PNG }),
  );
});

test('a category image can be added, shown and removed', async ({ page }) => {
  await loginAs(page, 'admin');
  const name = `E2E Image ${Date.now()}`;

  await page.goto('/admin/categories/create');
  await page.locator('[data-field="name"] input').fill(name);
  const image = page.locator('[data-field="image"]');
  await image.locator('input[type="file"]').setInputFiles({
    name: 'material.png',
    mimeType: 'image/png',
    buffer: PNG,
  });
  await expect(image.getByText(FILE_KEY)).toBeVisible();

  await page.getByRole('button', { name: 'Create category' }).click();
  await expect(page).toHaveURL(/\/admin\/categories\/(?!create)[^/]+$/);
  const id = page.url().split('/').pop();

  const saved = await (
    await page.request.get(`/api/v1/categories/${id}/`)
  ).json();
  expect(saved.image.file_key).toBe(FILE_KEY);
  await expect(page.getByRole('img', { name })).toBeVisible();

  // Edit: Save stays off until something changes; removing the image does.
  await page.goto(`/admin/categories/${id}/edit`);
  const save = page.getByRole('button', { name: /save/i });
  await expect(save).toBeDisabled();
  await page.getByRole('button', { name: 'Remove image' }).click();
  await expect(save).toBeEnabled();
  await save.click();
  await expect(page).toHaveURL(new RegExp(`/admin/categories/${id}$`));

  const cleared = await (
    await page.request.get(`/api/v1/categories/${id}/`)
  ).json();
  expect(cleared.image).toBeNull();

  await page.request.delete(`/api/v1/categories/${id}/`);
});
