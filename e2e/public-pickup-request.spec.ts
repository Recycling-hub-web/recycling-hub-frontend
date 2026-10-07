import { expect, test } from '@playwright/test';
import path from 'path';

import { loginAs } from './helpers/auth';

/**
 * Public pickup request form (features/pickups/components/
 * PublicPickupRequestForm) and its admin/staff counterpart
 * (CreatePickupRequestView) — covers the real current rules: phone
 * number always required, email required only for business requests,
 * pickup_address as a single-line input (not a textarea),
 * requested_date auto-set server-side and not shown in either form,
 * and the optional photo upload.
 */

const uniqueName = (label: string) => `E2E Public ${label} ${Date.now()}`;

test.describe('Public pickup request form', () => {
  test('individual request does not require email, auto-sets requested_date', async ({
    page,
  }) => {
    const fullName = uniqueName('Individual');
    await page.goto('/request-pickup');
    await page.getByText('Individual / Household').click();

    await page.locator('[data-field="full_name"] input').fill(fullName);
    await page.locator('[data-field="phone_local"] input').fill('123456789');
    // pickup_address must be a single-line input, not a textarea.
    const addressField = page.locator('[data-field="pickup_address"] input');
    await expect(addressField).toHaveCount(1);
    await expect(
      page.locator('[data-field="pickup_address"] textarea'),
    ).toHaveCount(0);
    await addressField.fill('1 Jalan Test, 50000 Kuala Lumpur');

    // No requested-date field anywhere in the form.
    await expect(page.getByText(/requested date|preferred date/i)).toHaveCount(
      0,
    );

    await page.locator('[data-field="category"] select').selectOption({
      index: 1,
    });

    await page.getByRole('button', { name: 'Submit Request' }).click();
    await expect(page.getByText(/request received/i)).toBeVisible();

    await loginAs(page, 'admin');
    await page.goto('/admin/pickups');
    await page.getByPlaceholder(/search/i).fill(fullName);
    await page.getByText(fullName, { exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/pickups\/[^/]+$/);

    const id = page.url().split('/').pop() as string;
    const detail = await page.request.get(`/api/v1/pickups/${id}/`);
    const { requested_date: requestedDate } = await detail.json();
    expect(requestedDate).toBe(new Date().toISOString().slice(0, 10));

    await page.request.delete(`/api/v1/pickups/${id}/`);
  });

  test('phone number is required', async ({ page }) => {
    await page.goto('/request-pickup');
    await page.getByText('Individual / Household').click();

    await page.locator('[data-field="full_name"] input').fill('No Phone');
    await page
      .locator('[data-field="pickup_address"] input')
      .fill('1 Jalan Test, 50000 Kuala Lumpur');
    await page.locator('[data-field="category"] select').selectOption({
      index: 1,
    });

    await page.getByRole('button', { name: 'Submit Request' }).click();
    await expect(
      page.getByText(/please enter your contact number/i),
    ).toBeVisible();
  });

  test('business request requires email', async ({ page }) => {
    const fullName = uniqueName('Business');
    await page.goto('/request-pickup');
    await page.getByText('Business / Bulk').click();

    await page.locator('[data-field="full_name"] input').fill(fullName);
    await page.locator('[data-field="phone_local"] input').fill('123456789');
    await page
      .locator('[data-field="pickup_address"] input')
      .fill('1 Jalan Test, 50000 Kuala Lumpur');
    await page.locator('[data-field="category"] select').selectOption({
      index: 1,
    });

    await page.getByRole('button', { name: 'Submit Request' }).click();
    await expect(
      page.getByText(/enter a valid email|email is required/i),
    ).toBeVisible();

    await page
      .locator('[data-field="email"] input')
      .fill('business@example.com');
    await page.getByRole('button', { name: 'Submit Request' }).click();
    await expect(page.getByText(/request received/i)).toBeVisible();

    await loginAs(page, 'admin');
    await page.goto('/admin/pickups');
    await page.getByPlaceholder(/search/i).fill(fullName);
    await page.getByText(fullName, { exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/pickups\/[^/]+$/);

    const id = page.url().split('/').pop() as string;
    await page.request.delete(`/api/v1/pickups/${id}/`);
  });

  test('optional photo upload fails gracefully (no real storage configured here)', async ({
    page,
  }) => {
    await page.goto('/request-pickup');
    await page.getByText('Individual / Household').click();

    // Must be a real image — the pickup-photo upload endpoint is
    // AllowAny (unlike every other upload in this project) and
    // deliberately validates content_type against a small image-only
    // allowlist before ever reaching storage, so the generic
    // sample-upload.txt fixture other upload-field specs reuse would
    // be rejected here at validation, not storage configuration.
    await page
      .locator('#pickup-photo-input')
      .setInputFiles(path.join(__dirname, 'fixtures/sample-photo.png'));
    await expect(
      page.getByText(/failed to generate upload urls|storage configuration/i),
    ).toBeVisible();
  });

  test('rejects a non-image file at validation, before reaching storage', async ({
    page,
  }) => {
    await page.goto('/request-pickup');
    await page.getByText('Individual / Household').click();

    await page
      .locator('#pickup-photo-input')
      .setInputFiles(path.join(__dirname, 'fixtures/sample-upload.txt'));
    await expect(page.getByText(/not a valid choice/i)).toBeVisible();
  });
});

test.describe('Admin/staff New pickup request', () => {
  test('pickup address is a single-line input, no requested-date field, email required only for business', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin/pickups/create');

    const addressField = page.locator('[data-field="pickup_address"] input');
    await expect(addressField).toHaveCount(1);
    await expect(
      page.locator('[data-field="pickup_address"] textarea'),
    ).toHaveCount(0);

    await expect(page.getByText(/requested date/i)).toHaveCount(0);

    const fullName = uniqueName('Admin');
    await page.locator('[data-field="full_name"] input').fill(fullName);
    await page.locator('[data-field="phone_local"] input').fill('123456789');
    await addressField.fill('1 Jalan Test, 50000 Kuala Lumpur');
    await page.locator('[data-field="category"] select').selectOption({
      index: 1,
    });

    // Default request type is individual — no email needed.
    await page.getByRole('button', { name: 'Create request' }).click();
    await expect(page).toHaveURL(/\/admin\/pickups\/(?!create)[^/]+$/);

    const id = page.url().split('/').pop() as string;
    await page.request.delete(`/api/v1/pickups/${id}/`);
  });

  test('business request type requires email on the admin form too', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin/pickups/create');

    const fullName = uniqueName('AdminBusiness');
    await page.locator('[data-field="full_name"] input').fill(fullName);
    await page.locator('[data-field="phone_local"] input').fill('123456789');
    await page
      .locator('[data-field="pickup_address"] input')
      .fill('1 Jalan Test, 50000 Kuala Lumpur');
    await page.locator('[data-field="category"] select').selectOption({
      index: 1,
    });
    await page
      .locator('[data-field="request_type"] select')
      .selectOption('business');

    await page.getByRole('button', { name: 'Create request' }).click();
    await expect(
      page.getByText(/email is required for business/i),
    ).toBeVisible();

    await page.locator('[data-field="email"] input').fill('biz@example.com');
    await page.getByRole('button', { name: 'Create request' }).click();
    await expect(page).toHaveURL(/\/admin\/pickups\/(?!create)[^/]+$/);

    const id = page.url().split('/').pop() as string;
    await page.request.delete(`/api/v1/pickups/${id}/`);
  });
});
