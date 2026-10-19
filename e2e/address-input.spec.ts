import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * AddressInput (components/form/fields/AddressInput.tsx) — live Geoapify
 * autocomplete, wired into the admin "New pickup request" form's own
 * Pickup address field (pickup_address stays a plain string on this form
 * and the backend; AddressInput's richer structured object is only
 * displayed here via the "Verified at lat, lng" caption, not submitted —
 * see the view's own comment on `selectedLocation`).
 */

test.describe('AddressInput', () => {
  test('search, select a suggestion, and show the verified coordinates', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin/pickups/create');

    const addressInput = page.locator('[data-field="pickup_address"] input');
    await addressInput.fill('KLCC Kuala Lumpur');

    const listbox = page.locator('[role="listbox"]');
    await expect(listbox).toBeVisible({ timeout: 5000 });
    const firstOption = listbox.locator('[role="option"]').first();
    await expect(firstOption).toBeVisible();
    await firstOption.click();

    // The field now holds Geoapify's real formatted address, not what
    // was typed, and the verified caption/checkmark appear.
    await expect(addressInput).not.toHaveValue('KLCC Kuala Lumpur');
    await expect(
      page.getByText(/Verified at -?\d+\.\d+, -?\d+\.\d+/),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Clear address' }),
    ).toBeVisible();
  });

  test('editing the text after a selection drops the verified state', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin/pickups/create');

    const addressInput = page.locator('[data-field="pickup_address"] input');
    await addressInput.fill('KLCC Kuala Lumpur');
    await page.locator('[role="listbox"] [role="option"]').first().click();
    await expect(page.getByText(/Verified at/)).toBeVisible();

    await addressInput.fill(`${await addressInput.inputValue()} extra`);
    await expect(page.getByText(/Verified at/)).toHaveCount(0);
  });

  test('the clear button empties the field and the verified state', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin/pickups/create');

    const addressInput = page.locator('[data-field="pickup_address"] input');
    await addressInput.fill('KLCC Kuala Lumpur');
    await page.locator('[role="listbox"] [role="option"]').first().click();

    await page.getByRole('button', { name: 'Clear address' }).click();
    await expect(addressInput).toHaveValue('');
    await expect(page.getByText(/Verified at/)).toHaveCount(0);
  });

  test('a pre-filled address on the Edit form shows as plain, unverified text', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    const createRes = await page.request.post('/api/v1/pickups/', {
      data: {
        full_name: `E2E AddressInput ${Date.now()}`,
        email: 'e2e-address@example.com',
        phone_number: '+60123456789',
        items: [{ category: '89067cc7-38ef-4752-9cd4-3ea29975abcb' }],
        pickup_address: '1 Jalan Test, 50000 Kuala Lumpur',
      },
    });
    expect(createRes.ok()).toBe(true);
    const { id } = await createRes.json();

    await page.goto(`/admin/pickups/${id}/edit`);
    const addressInput = page.locator('[data-field="pickup_address"] input');
    await expect(addressInput).toHaveValue('1 Jalan Test, 50000 Kuala Lumpur');
    // Existing free text was never run through a selection — no
    // verified caption, no checkmark, just the clear button.
    await expect(page.getByText(/Verified at/)).toHaveCount(0);

    await page.request.delete(`/api/v1/pickups/${id}/`);
  });
});
