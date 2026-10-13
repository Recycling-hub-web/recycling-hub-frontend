import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Admin/staff "New pickup request" form's optional "Evaluate now"
 * section (CreatePickupRequestView) — lets staff approve/reject a
 * request in the same submit instead of a separate Evaluate step
 * afterward. Covers all three choices: left at its default, approved
 * with a price, rejected with a reason.
 */

const E_WASTE_CATEGORY_ID = '89067cc7-38ef-4752-9cd4-3ea29975abcb';
const GLASS_CATEGORY_ID = '7a1216d1-4f9a-4e29-8da8-9e897e7e43f8';

// A request's details page — not /admin/pickups/create itself, which a
// plain [^/]+ would also match while the form is still submitting.
const DETAILS_URL = /\/admin\/pickups\/(?!create$)[^/]+$/;

const uniqueName = (label: string) => `E2E CreateEval ${label} ${Date.now()}`;

const fillBaseFields = async (page: Page, fullName: string) => {
  await page.locator('[data-field="full_name"] input').fill(fullName);
  await page.locator('[data-field="phone_local"] input').fill('123456789');
  await page
    .locator('[data-field="category"] select')
    .selectOption(E_WASTE_CATEGORY_ID);
  await page
    .locator('[data-field="pickup_address"] input')
    .fill('1 Jalan Test, 50000 Kuala Lumpur');
};

// The decision is a segmented control (Not yet / Approve / Reject).
const decision = (page: Page, name: string) =>
  page
    .getByRole('group', { name: 'Evaluation decision' })
    .getByRole('button', { name })
    .click();

test.describe('Create pickup request — evaluate now', () => {
  test('left at its default, the request is created pending/pending', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    const fullName = uniqueName('Default');
    await page.goto('/admin/pickups/create');

    await fillBaseFields(page, fullName);
    await page.getByRole('button', { name: 'Create request' }).click();

    await expect(page).toHaveURL(DETAILS_URL);
    await expect(page.getByText('Pending', { exact: true })).toHaveCount(2);

    const id = page.url().split('/').pop();
    await page.request.delete(`/api/v1/pickups/${id}/`);
  });

  test('approve with a price evaluates the request immediately', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    const fullName = uniqueName('Approve');
    await page.goto('/admin/pickups/create');

    await fillBaseFields(page, fullName);
    await decision(page, 'Approve');
    await page.locator('[data-field="evaluation_price"] input').fill('25.00');
    await page.getByRole('button', { name: 'Create request' }).click();

    await expect(page).toHaveURL(DETAILS_URL);
    await expect(page.getByText(/added and approved/i)).toBeVisible();
    await expect(page.getByText('Approved', { exact: true })).toBeVisible();
    await expect(page.getByText('25.00')).toBeVisible();

    const id = page.url().split('/').pop();
    await page.request.delete(`/api/v1/pickups/${id}/`);
  });

  test('reject with a reason evaluates the request immediately', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    const fullName = uniqueName('Reject');
    await page.goto('/admin/pickups/create');

    await fillBaseFields(page, fullName);
    await decision(page, 'Reject');
    await page
      .locator('[data-field="evaluation_reason"] textarea')
      .fill('Not an accepted material.');
    await page.getByRole('button', { name: 'Create request' }).click();

    await expect(page).toHaveURL(DETAILS_URL);
    await expect(page.getByText(/added and rejected/i)).toBeVisible();
    await expect(page.getByText('Rejected', { exact: true })).toBeVisible();
    await expect(
      page.getByText('Not an accepted material.', { exact: true }),
    ).toBeVisible();

    const id = page.url().split('/').pop();
    await page.request.delete(`/api/v1/pickups/${id}/`);
  });

  test('rejecting requires a reason, approving requires a valid price', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    const fullName = uniqueName('Validation');
    await page.goto('/admin/pickups/create');

    await fillBaseFields(page, fullName);
    await decision(page, 'Approve');
    await page.getByRole('button', { name: 'Create request' }).click();
    await expect(page.getByText('Enter a valid price.')).toBeVisible();
    // Stayed on the create form — no navigation happened.
    await expect(page).toHaveURL(/\/admin\/pickups\/create/);

    await decision(page, 'Reject');
    await page.getByRole('button', { name: 'Create request' }).click();
    await expect(
      page.getByText('A reason is required when rejecting.'),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/pickups\/create/);
  });

  test('defaults to Not yet; price/reason only show when needed', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin/pickups/create');
    const group = page.getByRole('group', { name: 'Evaluation decision' });
    const price = page.locator('[data-field="evaluation_price"] input');
    const reason = page.locator('[data-field="evaluation_reason"] textarea');

    await expect(
      group.getByRole('button', { name: 'Not yet' }),
    ).toHaveAttribute('aria-pressed', 'true');
    await expect(price).toHaveCount(0);
    await expect(reason).toHaveCount(0);

    await decision(page, 'Approve');
    await expect(price).toBeVisible();
    await expect(page.getByText('RM', { exact: true })).toBeVisible();

    await decision(page, 'Reject');
    await expect(price).toHaveCount(0);
    await expect(reason).toBeVisible();

    await decision(page, 'Not yet');
    await expect(reason).toHaveCount(0);
  });

  test('approve with a price per item, matched to the right materials', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    const fullName = uniqueName('Itemized');
    await page.goto('/admin/pickups/create');

    await fillBaseFields(page, fullName);
    await page
      .locator('[data-field="request_type"] select')
      .selectOption('business');
    await page
      .locator('[data-field="email"] input')
      .fill('e2e-createeval@example.com');
    await page.locator('[data-field="estimated_quantity"] input').fill('10');
    await page.getByRole('button', { name: 'Add another item' }).click();
    await page
      .locator('[data-field="category"] select')
      .nth(1)
      .selectOption(GLASS_CATEGORY_ID);
    await page
      .locator('[data-field="estimated_quantity"] input')
      .nth(1)
      .fill('3');

    await decision(page, 'Approve');
    const perItem = page.getByRole('switch', { name: 'Price each item' });
    await expect(perItem).toHaveAttribute('aria-checked', 'false');
    // Off: materials listed, one total price input.
    await expect(
      page.locator('[data-field="evaluation_price"] input'),
    ).toBeVisible();
    await perItem.click();

    // On: one input per material line, named after it.
    await expect(page.getByLabel('Price for E-waste')).toBeVisible();
    await expect(page.getByLabel('Price for Glass')).toBeVisible();
    await expect(page.getByText('10 kg')).toBeVisible();

    // Every line needs a price.
    await page.locator('[data-field="item-price-0"] input').fill('300');
    await page.getByRole('button', { name: 'Create request' }).click();
    await expect(
      page.getByText('Enter a valid price for every item.'),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/pickups\/create/);

    await page.locator('[data-field="item-price-1"] input').fill('45');
    await expect(page.getByText('RM 345.00')).toBeVisible();
    await page.getByRole('button', { name: 'Create request' }).click();

    await expect(page).toHaveURL(DETAILS_URL);
    await expect(page.getByText(/added and approved/i)).toBeVisible();
    await expect(page.getByText('345.00')).toBeVisible();

    const id = page.url().split('/').pop();
    const financeRes = await page.request.get('/api/v1/finance/');
    const record = (await financeRes.json()).results.find(
      (r: { collection_request: { id: string } }) =>
        r.collection_request.id === id,
    );
    expect(record.price).toBe('345.00');
    const byMaterial = Object.fromEntries(
      record.items.map((item: { category: string; price: string }) => [
        item.category,
        item.price,
      ]),
    );
    expect(byMaterial).toEqual({ 'E-waste': '300.00', Glass: '45.00' });

    await page.request.delete(`/api/v1/pickups/${id}/`);
  });
});
