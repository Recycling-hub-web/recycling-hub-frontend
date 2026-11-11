import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';
import { E_WASTE_CATEGORY_ID } from './helpers/categories';
import { requestAction } from './helpers/orderActions';
import { E2E_PHOTO } from './helpers/storage';

/**
 * Evaluation is per pickup request: the request page's Actions menu and
 * the Pickup Requests list's icon open one Evaluate window covering every
 * open order. One total is shared across the orders; rejecting rejects
 * them all. Order pages no longer evaluate on their own.
 */

/** A request with two orders of 1 kg and 3 kg, via the API. */
const seedRequest = async (request: APIRequestContext, fullName: string) => {
  const order = (kg: string) => ({
    items: [
      {
        category: E_WASTE_CATEGORY_ID,
        estimated_quantity: kg,
        quantity_unit: 'kg',
      },
    ],
    photos: [E2E_PHOTO],
  });
  const res = await request.post('/api/v1/pickup-requests/', {
    data: {
      full_name: fullName,
      phone_number: '+60123456789',
      pickup_address: '1 Jalan Evaluate, Kuala Lumpur',
      orders: [order('1'), order('3')],
    },
  });
  expect(res.status()).toBe(201);
  return res.json();
};

const ordersOf = async (request: APIRequestContext, id: string) =>
  (await (await request.get(`/api/v1/pickup-requests/${id}/`)).json())
    .orders as { id: string; evaluation_status: string; price: string }[];

test('the request page evaluates every order with one shared total', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const created = await seedRequest(page.request, `E2E Whole ${Date.now()}`);
  await page.goto(`/admin/pickup-requests/${created.id}`);

  await requestAction(page, 'Evaluate');
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText(/2 orders/)).toBeVisible();
  await dialog.getByLabel('Total price').fill('100');
  await dialog.getByRole('button', { name: 'Approve' }).click();
  await expect(dialog).toBeHidden();

  const orders = await ordersOf(page.request, created.id);
  expect(orders.every((o) => o.evaluation_status === 'approved')).toBe(true);
  // Shared 1:3 by estimated quantity.
  expect(orders.map((o) => Number(o.price)).sort((a, b) => a - b)).toEqual([
    25, 75,
  ]);

  // Orders don't evaluate on their own: an old order link opens the
  // request with that order, whose own menu has no Evaluate.
  await page.goto(`/admin/pickups/${orders[0]!.id}`);
  await expect(page).toHaveURL(
    new RegExp(`/admin/pickup-requests/${created.id}\\?order=`),
  );
  await page
    .getByRole('button', { name: 'Order actions', exact: true })
    .first()
    .click();
  await expect(
    page.getByRole('menuitem', { name: 'Schedule pickup' }),
  ).toBeVisible();
  await expect(page.getByRole('menuitem', { name: /valuate/ })).toHaveCount(0);
});

test('the list icon rejects the whole request with a reason', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const fullName = `E2E List Reject ${Date.now()}`;
  const created = await seedRequest(page.request, fullName);
  await page.goto('/admin/pickup-requests');
  await page
    .getByPlaceholder(/Search/)
    .first()
    .fill(fullName);

  await page.getByRole('button', { name: `Evaluate ${fullName}` }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Reject' }).click();
  await expect(
    dialog.getByText('A reason is required when rejecting.'),
  ).toBeVisible();
  await dialog.locator('[data-field="note"] textarea').fill('Too wet');
  await dialog.getByRole('button', { name: 'Reject' }).click();
  await expect(dialog).toBeHidden();

  const orders = await ordersOf(page.request, created.id);
  expect(orders.map((o) => o.evaluation_status)).toEqual([
    'rejected',
    'rejected',
  ]);
});

test('the list shows the pickup request code, searchable', async ({ page }) => {
  await loginAs(page, 'admin');
  const created = await seedRequest(page.request, `E2E Code ${Date.now()}`);
  expect(created.code).toMatch(/^C\d{4}$/);

  await page.goto('/admin/pickup-requests');
  await page
    .getByPlaceholder(/Search/)
    .first()
    .fill(created.code);
  const row = page.getByRole('row').filter({ hasText: created.code });
  await expect(row).toHaveCount(1);
  // The orders column is a count, not the orders' own codes.
  await expect(row).toContainText('2 orders');
  for (const order of created.orders as { code: string }[]) {
    // eslint-disable-next-line no-await-in-loop
    await expect(row).not.toContainText(order.code);
  }

  await row.click();
  await expect(
    page.getByRole('heading', { level: 1, name: created.code }),
  ).toBeVisible();
});
