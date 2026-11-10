import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';
import {
  clickContinue,
  createRequest,
  fillCustomer,
  fillPickup,
  finishOrders,
  stepHeading,
} from './helpers/pickupRequestForm';

/**
 * The staff "New pickup request" step form (PickupRequestCreateView):
 * Customer → Pickup → Orders → Review and submit. Covers step navigation,
 * per-step and on-blur validation, review Edit links, submit landing on
 * the first step with a problem, and that the POST body is byte-for-byte
 * the single-page form's.
 */

const steps = (page: Page) =>
  page.getByRole('navigation', { name: 'New pickup request steps' });

const open = async (page: Page) => {
  await loginAs(page, 'admin');
  await page.goto('/admin/pickup-requests/create');
  await expect(stepHeading(page, 'Customer')).toBeVisible();
};

/** Catch the POST and answer it, so nothing is saved; returns its body. */
const captureCreate = async (page: Page) => {
  let body: string | null = null;
  await page.route('**/api/v1/pickup-requests/', async (route) => {
    if (route.request().method() !== 'POST') return route.fallback();
    body = route.request().postData();
    return route.fulfill({ status: 201, json: { id: 'e2e-step-form' } });
  });
  return () => body;
};

test.describe('New pickup request step form', () => {
  test('Continue checks only the current step, then moves on', async ({
    page,
  }) => {
    await open(page);

    await clickContinue(page);
    await expect(page.getByText('Full name is required.')).toBeVisible();
    await expect(page.getByText('Phone number is required.')).toBeVisible();
    await expect(stepHeading(page, 'Customer')).toBeVisible();
    // Later steps' fields aren't checked yet.
    await expect(page.getByText('Pickup address is required.')).toHaveCount(0);

    await fillCustomer(page, { fullName: 'Step Form Customer' });
    await expect(stepHeading(page, 'Pickup')).toBeVisible();
    await expect(page.getByText('Step 2 of 4')).toBeVisible();
    await expect(
      steps(page).getByRole('button', { name: /Customer.*done/ }),
    ).toBeVisible();
  });

  test('a business request needs an email before Continue', async ({
    page,
  }) => {
    await open(page);
    await fillCustomer(
      page,
      { fullName: 'Step Form Business', requestType: 'business' },
      { submit: false },
    );
    await clickContinue(page);
    await expect(
      page.getByText('Email is required for business requests.'),
    ).toBeVisible();
    await expect(stepHeading(page, 'Customer')).toBeVisible();
  });

  test('errors also show when a field loses focus', async ({ page }) => {
    await open(page);
    await page.locator('[data-field="full_name"] input').focus();
    await page.locator('[data-field="phone_local"] input').focus();
    await expect(page.getByText('Full name is required.')).toBeVisible();
  });

  test('Back and the step indicator move between reached steps', async ({
    page,
  }) => {
    await open(page);
    await fillCustomer(page, { fullName: 'Step Form Nav' });
    await page.getByRole('button', { name: 'Back' }).click();
    await expect(stepHeading(page, 'Customer')).toBeVisible();
    await expect(page.locator('[data-field="full_name"] input')).toHaveValue(
      'Step Form Nav',
    );

    // Pickup was reached, so it can be jumped to again.
    await steps(page)
      .getByRole('button', { name: /Pickup/ })
      .click();
    await expect(stepHeading(page, 'Pickup')).toBeVisible();
    // Orders hasn't been reached: it isn't a button.
    await expect(
      steps(page).getByRole('button', { name: /Orders/ }),
    ).toHaveCount(0);
  });

  test('review shows each step with an Edit link back to it', async ({
    page,
  }) => {
    await open(page);
    await fillCustomer(page, { fullName: 'Step Form Review' });
    await fillPickup(page, {
      address: '2 Jalan Review, 50000 Kuala Lumpur',
      note: 'Ring twice',
    });
    await finishOrders(page);

    await expect(page.getByText('Step Form Review')).toBeVisible();
    await expect(
      page.getByText('2 Jalan Review, 50000 Kuala Lumpur'),
    ).toBeVisible();
    await expect(page.getByText('Ring twice')).toBeVisible();
    await expect(page.getByText('No orders.', { exact: false })).toBeVisible();

    await page
      .getByRole('button', { name: 'Edit pickup', exact: true })
      .click();
    await expect(stepHeading(page, 'Pickup')).toBeVisible();
    await steps(page)
      .getByRole('button', { name: /Review and submit/ })
      .click();
    await page
      .getByRole('button', { name: 'Edit customer', exact: true })
      .click();
    await expect(stepHeading(page, 'Customer')).toBeVisible();
    await steps(page)
      .getByRole('button', { name: /Review and submit/ })
      .click();
    await page
      .getByRole('button', { name: 'Edit orders', exact: true })
      .click();
    await expect(stepHeading(page, 'Orders')).toBeVisible();
  });

  test('submit re-checks every step and lands on the first with a problem', async ({
    page,
  }) => {
    const sent = await captureCreate(page);
    await open(page);
    await fillCustomer(page, { fullName: 'Step Form Recheck' });
    await fillPickup(page);
    await finishOrders(page);

    // Break step 1, then go straight back to the review and submit.
    await page
      .getByRole('button', { name: 'Edit customer', exact: true })
      .click();
    await page.locator('[data-field="full_name"] input').fill('');
    await steps(page)
      .getByRole('button', { name: /Review and submit/ })
      .click();
    await createRequest(page);

    await expect(stepHeading(page, 'Customer')).toBeVisible();
    await expect(page.getByText('Full name is required.')).toBeVisible();
    expect(sent()).toBeNull();
  });
});

test.describe('New pickup request payload', () => {
  const when = '2030-01-15T10:00';

  test('a business request sends exactly the single-page form’s body', async ({
    page,
  }) => {
    const sent = await captureCreate(page);
    await open(page);
    await fillCustomer(page, {
      fullName: 'Payload Business',
      requestType: 'business',
      email: 'payload@recyclinghub.example',
      phone: '012-345 6789',
    });
    await fillPickup(page, {
      when,
      address: '3 Jalan Payload, 50000 Kuala Lumpur',
      note: 'Loading bay B',
    });
    await finishOrders(page);
    await createRequest(page);

    await expect(page).toHaveURL(/\/admin\/pickup-requests\/e2e-step-form$/);
    // Key for key, in the original order.
    expect(sent()).toBe(
      JSON.stringify({
        full_name: 'Payload Business',
        email: 'payload@recyclinghub.example',
        phone_number: '+60123456789',
        request_type: 'business',
        pickup_address: '3 Jalan Payload, 50000 Kuala Lumpur',
        requested_at: new Date(when).toISOString(),
        note: 'Loading bay B',
      }),
    );
  });

  test('empty optional fields are left out, as before', async ({ page }) => {
    const sent = await captureCreate(page);
    await open(page);
    await fillCustomer(page, { fullName: 'Payload Minimal' });
    await fillPickup(page, {
      when,
      address: '4 Jalan Payload, 50000 Kuala Lumpur',
    });
    await finishOrders(page);
    await createRequest(page);

    await expect(page).toHaveURL(/\/admin\/pickup-requests\/e2e-step-form$/);
    expect(sent()).toBe(
      JSON.stringify({
        full_name: 'Payload Minimal',
        phone_number: '+60123456789',
        request_type: 'individual',
        pickup_address: '4 Jalan Payload, 50000 Kuala Lumpur',
        requested_at: new Date(when).toISOString(),
      }),
    );
  });
});
