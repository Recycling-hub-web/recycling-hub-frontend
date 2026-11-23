import { loadEnvConfig } from '@next/env';
import type { BrowserContext, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { SignJWT } from 'jose';

loadEnvConfig(process.cwd());
const png = {
  name: 'proof.png',
  mimeType: 'image/png',
  buffer: Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=',
    'base64',
  ),
};
async function setup(page: Page, context: BrowserContext) {
  const token = await new SignJWT({ role: 'admin', token_type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(
      new TextEncoder().encode(process.env.JWT_VERIFY_SECRET || 'test-only'),
    );
  await context.addCookies([
    { name: 'rh_access', value: token, url: 'http://127.0.0.1:3101' },
  ]);
  await page.route('**/api/v1/**', (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/accounts/me/'))
      return route.fulfill({
        json: {
          id: 'admin',
          role: 'admin',
          full_name: 'Test User',
          email: 'test@example.test',
          phone_number: '+60123456789',
          profile_photo: null,
          whatsapp_enabled: true,
          profile: null,
        },
      });
    if (url.pathname.endsWith('/pickup-requests/request-1/'))
      return route.fulfill({
        json: {
          id: 'request-1',
          code: 'R1001',
          full_name: 'Test Customer',
          email: 'test@example.test',
          phone_number: '+60123456789',
          pickup_address: '1 Jalan Test',
          requested_at: '2026-11-23T02:00:00Z',
          request_type: 'individual',
          status: 'open',
          orders: [],
          photos: [],
        },
      });
    if (url.pathname.endsWith('/categories/'))
      return route.fulfill({
        json: {
          count: 1,
          results: [
            {
              id: 'material-1',
              name: 'Laptop',
              allowed_quantity_units: ['kg'],
            },
          ],
        },
      });
    return route.fulfill({
      json: { count: 0, results: [], next: null, previous: null },
    });
  });
}

test('step validation reports all missing fields and material retry preserves the draft', async ({
  page,
  context,
}) => {
  await setup(page, context);
  await page.setViewportSize({ width: 390, height: 844 });
  let failing = true;
  await page.route('**/api/v1/categories/?*', (route) =>
    route.fulfill(
      failing
        ? { status: 503, json: { detail: 'Unavailable' } }
        : {
            json: {
              count: 1,
              results: [
                {
                  id: 'material-1',
                  name: 'Laptop',
                  allowed_quantity_units: ['kg'],
                },
              ],
            },
          },
    ),
  );
  await page.goto('/admin/pickup-requests/create');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(
    page.getByText('Full name is required.', { exact: true }).first(),
  ).toBeVisible();
  await expect(page.locator('input[name="phone_local"]')).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  const name = page.locator('input[name="full_name"]');
  await expect(name).toBeFocused();
  expect(
    await name.evaluate((el) => (el as HTMLInputElement).validity.customError),
  ).toBe(false);
  await page.screenshot({
    path: 'audit-evidence/re-audit-2026-11-23/batch2-step-validation.png',
  });
  await name.fill('Customer draft');
  await page.locator('input[name="phone_local"]').fill('123456789');
  await page.locator('input[name="email"]').fill('invalid');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(
    page.getByText('Enter a valid email address.', { exact: true }).first(),
  ).toBeVisible();
  await page.locator('input[name="email"]').fill('customer@example.test');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.locator('input[name="pickup_address"]').fill('1 Jalan Draft');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Retry materials', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Add order', exact: true }).click();
  await page
    .getByRole('button', { name: 'Add another item', exact: true })
    .click();
  const quantity = page.locator('input[name="estimated_quantity"]');
  await quantity.fill('2.50');
  failing = false;
  await page
    .getByRole('button', { name: 'Retry materials', exact: true })
    .click();
  await page.locator('select[name="category"]').selectOption('material-1');
  await expect(quantity).toHaveValue('2.50');
  await expect(
    page.getByText('Could not load materials. Please try again.', {
      exact: true,
    }),
  ).toHaveCount(0);
});

test('profile picker exposes focus, links upload errors and retries the same file', async ({
  page,
  context,
}) => {
  await setup(page, context);
  let attempts = 0;
  await page.route('**/api/v1/storage/presigned-upload-urls', (route) => {
    attempts += 1;
    return route.fulfill({
      status: 503,
      json: { detail: 'Upload temporarily unavailable' },
    });
  });
  await page.goto('/profile/edit');
  const input = page.getByLabel('Profile photo', { exact: true });
  await input.focus();
  await expect(input.locator('..')).toHaveCSS('outline-style', 'solid');
  await input.setInputFiles(png);
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  const errorId = await input.getAttribute('aria-describedby');
  await expect(page.locator(`[id="${errorId}"]`)).toHaveText(
    'Upload temporarily unavailable',
  );
  await input.setInputFiles(png);
  await expect.poll(() => attempts).toBe(2);
  await expect(page.locator('input[name="full_name"]')).toHaveValue(
    'Test User',
  );
});

test('order photo requirement is announced beside a keyboard-visible picker', async ({
  page,
  context,
}) => {
  await setup(page, context);
  await page.goto('/admin/pickup-requests/request-1/orders/create');
  await page.getByRole('button', { name: 'Create order', exact: true }).click();
  const input = page.getByLabel('Photos', { exact: true });
  await expect(input).toHaveAttribute('aria-required', 'true');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  const id = await input.getAttribute('aria-describedby');
  await expect(page.locator(`[id="${id}"]`)).toContainText(
    'Add at least one photo',
  );
  await input.focus();
  await expect(input.locator('..')).toHaveCSS('outline-style', 'solid');
});

test('requested time is visible in Malaysia time even for a UTC viewer', async ({
  page,
  context,
}) => {
  await setup(page, context);
  await page.goto('/admin/pickup-requests/request-1');
  const time = page.locator('time[datetime="2026-11-23T02:00:00.000Z"]');
  await expect(time).toContainText('10:00');
  await expect(
    page.getByText('Customer requested time (Malaysia)', { exact: true }),
  ).toBeVisible();
});

test('external validation retains optional-text and email guardrails', async () => {
  const { INITIAL_STATE, validateStepFields } = await import(
    '../src/components/features/pickups/models/pickupRequestCreateModel'
  );
  const draft = {
    ...INITIAL_STATE,
    full_name: 'Nur Aisyah',
    phone_local: '123456789',
    pickup_address: '1 Jalan Test',
  };
  expect(
    validateStepFields('pickup', {
      ...draft,
      note: 'Use the side entrance.\nCall on arrival.',
    }),
  ).toEqual({});
  expect(
    validateStepFields('pickup', {
      ...draft,
      note: `Invalid${String.fromCharCode(1)}note`,
    }).note,
  ).toBe('Remove unsupported control characters.');
  expect(
    validateStepFields('customer', { ...draft, email: 'invalid' }).email,
  ).toBe('Enter a valid email address.');
});
