import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Phone numbers are validated (constants/dialCodes.ts
 * validatePhoneNumber) and stored as clean E.164, and the public pickup
 * form uses the same Geoapify AddressInput as the admin forms. Geoapify is
 * mocked so the spec doesn't depend on a live third-party API.
 */

const futureLocal = () =>
  new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().slice(0, 16);

const mockGeoapify = (page: Page) =>
  page.route('https://api.geoapify.com/v1/geocode/autocomplete**', (route) =>
    route.fulfill({
      json: {
        results: [
          {
            place_id: 'e2e-place-1',
            formatted: 'Pavilion Kuala Lumpur, 55100 Kuala Lumpur, Malaysia',
            lat: 3.14899,
            lon: 101.71323,
            country_code: 'my',
          },
        ],
      },
    }),
  );

test.describe('Public pickup request form', () => {
  test('rejects an invalid phone number', async ({ page }) => {
    await page.goto('/request-pickup');
    await page.getByText('Individual / Household').click();
    await page.locator('[data-field="full_name"] input').fill('Bad Phone');
    await page.locator('[data-field="phone_local"] input').fill('123');
    await page
      .locator('[data-field="pickup_address"] input')
      .fill('1 Jalan Test, 50000 Kuala Lumpur');
    await page.locator('[data-field="requested_at"] input').fill(futureLocal());

    await page.getByRole('button', { name: 'Submit Request' }).click();
    await expect(
      page.getByText(/please enter a valid phone number/i),
    ).toBeVisible();
  });

  test('uses the address autocomplete like the admin forms', async ({
    page,
  }) => {
    await mockGeoapify(page);
    await page.goto('/request-pickup');
    await page.getByText('Individual / Household').click();

    const address = page.locator('[data-field="pickup_address"] input');
    await expect(address).toHaveAttribute('role', 'combobox');
    await address.fill('Pavilion');
    await page.getByRole('option', { name: /Pavilion Kuala Lumpur/ }).click();

    await expect(address).toHaveValue(/Pavilion Kuala Lumpur, 55100/);
    await expect(
      page.getByText(/Verified at 3\.14899, 101\.71323/),
    ).toBeVisible();
  });
});

test.describe('Admin new pickup request', () => {
  test('rejects a short Malaysian number and stores a valid one as E.164', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin/pickup-requests/create');

    const fullName = `E2E Phone ${Date.now()}`;
    await page.locator('[data-field="full_name"] input').fill(fullName);
    await page.locator('[data-field="phone_local"] input').fill('12345');
    await page
      .locator('[data-field="pickup_address"] input')
      .fill('1 Jalan Test, 50000 Kuala Lumpur');
    await page.locator('[data-field="requested_at"] input').fill(futureLocal());

    await page.getByRole('button', { name: 'Create request' }).click();
    await expect(
      page.getByText('Enter a valid Malaysian number, e.g. 12-345 6789.'),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/create$/);

    // A leading 0, spaces and dashes are accepted and cleaned up.
    await page.locator('[data-field="phone_local"] input').fill('012-345 6789');
    await page.getByRole('button', { name: 'Create request' }).click();
    await expect(page).toHaveURL(/\/admin\/pickup-requests\/(?!create)[^/]+$/);

    const id = page.url().split('/').pop();
    const detail = await page.request.get(`/api/v1/pickup-requests/${id}/`);
    expect((await detail.json()).phone_number).toBe('+60123456789');

    await page.request.delete(`/api/v1/pickup-requests/${id}/`);
  });
});
