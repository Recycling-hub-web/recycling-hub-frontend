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

test.describe('Create pickup request — evaluate now', () => {
  test('left at its default, the request is created pending/pending', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    const fullName = uniqueName('Default');
    await page.goto('/admin/pickups/create');

    await fillBaseFields(page, fullName);
    await page.getByRole('button', { name: 'Create request' }).click();

    await expect(page).toHaveURL(/\/admin\/pickups\/[^/]+$/);
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
    await page
      .locator('[data-field="evaluation_decision"] select')
      .selectOption('approved');
    await page.locator('[data-field="evaluation_price"] input').fill('25.00');
    await page.getByRole('button', { name: 'Create request' }).click();

    await expect(page).toHaveURL(/\/admin\/pickups\/[^/]+$/);
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
    await page
      .locator('[data-field="evaluation_decision"] select')
      .selectOption('rejected');
    await page
      .locator('[data-field="evaluation_reason"] textarea')
      .fill('Not an accepted material.');
    await page.getByRole('button', { name: 'Create request' }).click();

    await expect(page).toHaveURL(/\/admin\/pickups\/[^/]+$/);
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
    await page
      .locator('[data-field="evaluation_decision"] select')
      .selectOption('approved');
    await page.getByRole('button', { name: 'Create request' }).click();
    await expect(page.getByText('Enter a valid price.')).toBeVisible();
    // Stayed on the create form — no navigation happened.
    await expect(page).toHaveURL(/\/admin\/pickups\/create/);

    await page
      .locator('[data-field="evaluation_decision"] select')
      .selectOption('rejected');
    await page.getByRole('button', { name: 'Create request' }).click();
    await expect(
      page.getByText('A reason is required when rejecting.'),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/pickups\/create/);
  });
});
