import type { Locator, Page } from '@playwright/test';

/**
 * Local dev has no storage configured, so specs that upload fake the two
 * storage steps: the API's presigned-URL calls (signed-in and the public
 * form's anonymous one) and the browser's PUT to the Space. Everything
 * after the upload — saving the key on the record — stays real.
 */

/** A storage key specs can send straight to the API. */
export const E2E_PHOTO = 'images/pickups/e2e-photo.png';

const SPACE = 'https://recyclinghub-e2e.sgp1.digitaloceanspaces.com';

// 1×1 transparent PNG.
export const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64',
);

let counter = 0;

const fakeUpload = () => {
  counter += 1;
  const key = `images/pickups/e2e-${Date.now()}-${counter}.png`;
  return {
    upload_url: `${SPACE}/${key}?X-Amz-Signature=fake`,
    method: 'PUT',
    headers: { 'Content-Type': 'image/png' },
    file_key: key,
    public_url: `${SPACE}/${key}`,
    expires_in: 300,
  };
};

export const mockStorageUploads = async (page: Page) => {
  const presign = (route: Parameters<Parameters<Page['route']>[1]>[0]) =>
    route.fulfill({ json: { uploads: [fakeUpload()] } });
  await page.route('**/api/v1/storage/presigned-upload-urls**', presign);
  await page.route('**/api/v1/pickups/photo-upload-url/**', presign);
  await page.route(`${SPACE}/**`, (route) =>
    route.request().method() === 'PUT'
      ? route.fulfill({ status: 200 })
      : route.fulfill({ status: 200, contentType: 'image/png', body: PNG }),
  );
};

/** Picks one photo in the file input inside `scope`. */
export const attachPhoto = async (scope: Locator | Page, name = 'photo.png') =>
  scope
    .locator('input[type="file"]')
    .first()
    .setInputFiles({ name, mimeType: 'image/png', buffer: PNG });
