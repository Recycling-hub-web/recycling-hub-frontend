import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Public pickup request form (features/pickups/components/public/
 * PublicPickupRequestForm) and its admin/staff counterpart
 * (PickupRequestCreateView) — field-level validation not already
 * covered by e2e/pickup-requests.spec.ts's broader Pickup Requests
 * coverage: phone always required, pickup_address as a single-line
 * input (not a textarea), and business requires email on both forms.
 * Since the Request/Order restructure neither form has items or a
 * photo field any more — those moved to Order creation (see
 * e2e/pickup-requests.spec.ts).
 */

const toDateTimeLocalValue = (iso: string): string => iso.slice(0, 16);
const futureIso = (hoursFromNow = 48) =>
  new Date(Date.now() + hoursFromNow * 60 * 60 * 1000).toISOString();

test.describe('Public pickup request form', () => {
  test('phone number is required', async ({ page }) => {
    await page.goto('/request-pickup');
    await page.getByText('Individual / Household').click();

    await page.locator('[data-field="full_name"] input').fill('No Phone');
    const addressField = page.locator('[data-field="pickup_address"] input');
    await expect(addressField).toHaveCount(1);
    await expect(
      page.locator('[data-field="pickup_address"] textarea'),
    ).toHaveCount(0);
    await addressField.fill('1 Jalan Test, 50000 Kuala Lumpur');
    await page
      .locator('[data-field="requested_at"] input')
      .fill(toDateTimeLocalValue(futureIso()));

    await page.getByRole('button', { name: 'Submit Request' }).click();
    await expect(
      page.getByText(/please enter your contact number/i),
    ).toBeVisible();
  });
});

test.describe('Admin/staff New pickup request', () => {
  test('pickup address is a single-line input, email required only for business', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin/pickup-requests/create');

    const addressField = page.locator('[data-field="pickup_address"] input');
    await expect(addressField).toHaveCount(1);
    await expect(
      page.locator('[data-field="pickup_address"] textarea'),
    ).toHaveCount(0);

    const fullName = `E2E Public Admin ${Date.now()}`;
    await page.locator('[data-field="full_name"] input').fill(fullName);
    await page.locator('[data-field="phone_local"] input').fill('123456789');
    await addressField.fill('1 Jalan Test, 50000 Kuala Lumpur');
    await page
      .locator('[data-field="requested_at"] input')
      .fill(toDateTimeLocalValue(futureIso()));

    // Default request type is individual — no email needed.
    await page.getByRole('button', { name: 'Create request' }).click();
    await expect(page).toHaveURL(/\/admin\/pickup-requests\/(?!create)[^/]+$/);
  });

  test('business request type requires email on the admin form too', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin/pickup-requests/create');

    const fullName = `E2E Public AdminBusiness ${Date.now()}`;
    await page.locator('[data-field="full_name"] input').fill(fullName);
    await page.locator('[data-field="phone_local"] input').fill('123456789');
    await page
      .locator('[data-field="pickup_address"] input')
      .fill('1 Jalan Test, 50000 Kuala Lumpur');
    await page
      .locator('[data-field="requested_at"] input')
      .fill(toDateTimeLocalValue(futureIso()));
    await page
      .locator('[data-field="request_type"] select')
      .selectOption('business');

    await page.getByRole('button', { name: 'Create request' }).click();
    await expect(
      page.getByText(/email is required for business/i),
    ).toBeVisible();

    await page.locator('[data-field="email"] input').fill('biz@example.com');
    await page.getByRole('button', { name: 'Create request' }).click();
    await expect(page).toHaveURL(/\/admin\/pickup-requests\/(?!create)[^/]+$/);
  });
});
