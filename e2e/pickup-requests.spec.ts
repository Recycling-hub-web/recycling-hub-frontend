import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Pickup Requests — the customer's ask (PickupRequest), new in the
 * Request/Order restructure: a public submission is just contact info,
 * address, and a chosen pickup date/time (no items, no photo); staff
 * then create one or more Orders under it (materials/photos, the full
 * evaluate->assign-driver->collect->drop-off->close lifecycle, covered
 * in detail by e2e/pickups.spec.ts). This file covers what's new here:
 * the public form's own fields, the admin/staff Pickup Requests list/
 * detail, creating an Order from a request's details page,
 * cancel-cascades-to-every-Order, the driver's confirm-schedule step,
 * and a full lifecycle walk ending in the request showing `fulfilled`.
 */

const E_WASTE_CATEGORY_ID = '89067cc7-38ef-4752-9cd4-3ea29975abcb';

const uniqueName = (label: string) => `E2E Request ${label} ${Date.now()}`;

const futureIso = (hoursFromNow = 24) =>
  new Date(Date.now() + hoursFromNow * 60 * 60 * 1000).toISOString();

/** datetime-local inputs want "YYYY-MM-DDTHH:mm", in local time — not
 * a full ISO string with seconds/timezone. */
const toDateTimeLocalValue = (iso: string): string => iso.slice(0, 16);

const createPickupRequestViaApi = async (
  request: APIRequestContext,
  fullName: string,
  overrides: Record<string, unknown> = {},
): Promise<string> => {
  const res = await request.post('/api/v1/pickup-requests/', {
    data: {
      full_name: fullName,
      email: 'e2e-request@example.com',
      phone_number: '+60123456789',
      pickup_address: '1 Jalan Test, 50000 Kuala Lumpur',
      requested_at: futureIso(),
      ...overrides,
    },
  });
  expect(res.ok()).toBe(true);
  return (await res.json()).id as string;
};

const createOrderViaApi = async (
  request: APIRequestContext,
  pickupRequestId: string,
  items: { category: string; estimated_quantity?: string }[] = [],
): Promise<{ id: string; code: string }> => {
  const res = await request.post(
    `/api/v1/pickup-requests/${pickupRequestId}/orders/`,
    { data: { items } },
  );
  expect(res.ok()).toBe(true);
  return res.json();
};

test.describe('Public pickup request form', () => {
  test('submits with only contact info, address, and a pickup date/time — no items, no photo', async ({
    page,
  }) => {
    const fullName = uniqueName('PublicIndividual');
    await page.goto('/request-pickup');
    await page.getByText('Individual / Household').click();

    // The items repeater and photo uploader are both gone from this form.
    await expect(page.locator('[data-field="category"]')).toHaveCount(0);
    await expect(page.getByText(/add another item/i)).toHaveCount(0);
    await expect(page.locator('#pickup-photo-input')).toHaveCount(0);
    await expect(page.locator('[data-field="photos"]')).toHaveCount(0);

    await page.locator('[data-field="full_name"] input').fill(fullName);
    await page.locator('[data-field="phone_local"] input').fill('123456789');
    const addressField = page.locator('[data-field="pickup_address"] input');
    await expect(addressField).toHaveCount(1);
    await addressField.fill('1 Jalan Test, 50000 Kuala Lumpur');

    await page.getByRole('button', { name: 'Submit Request' }).click();
    await expect(
      page.getByText(/choose a pickup date and time/i),
    ).toBeVisible();

    await page
      .locator('[data-field="requested_at"] input')
      .fill(toDateTimeLocalValue(futureIso(48)));
    await page.getByRole('button', { name: 'Submit Request' }).click();
    await expect(page.getByText(/request received/i)).toBeVisible();

    await loginAs(page, 'admin');
    await page.goto('/admin/pickup-requests');
    await page.getByPlaceholder(/search/i).fill(fullName);
    await expect(page.getByText(fullName, { exact: true })).toBeVisible();
  });

  test('business request requires email', async ({ page }) => {
    const fullName = uniqueName('PublicBusiness');
    await page.goto('/request-pickup');
    await page.getByText('Business / Bulk').click();

    await page.locator('[data-field="full_name"] input').fill(fullName);
    await page.locator('[data-field="phone_local"] input').fill('123456789');
    await page
      .locator('[data-field="pickup_address"] input')
      .fill('1 Jalan Test, 50000 Kuala Lumpur');
    await page
      .locator('[data-field="requested_at"] input')
      .fill(toDateTimeLocalValue(futureIso(48)));

    await page.getByRole('button', { name: 'Submit Request' }).click();
    await expect(
      page.getByText(/enter a valid email|email is required/i),
    ).toBeVisible();

    await page
      .locator('[data-field="email"] input')
      .fill('business@example.com');
    await page.getByRole('button', { name: 'Submit Request' }).click();
    await expect(page.getByText(/request received/i)).toBeVisible();
  });
});

test.describe('Admin/staff Pickup Requests', () => {
  test('new request form has no items/photo fields, redirects to the request details page', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin/pickup-requests/create');

    await expect(page.locator('[data-field="category"]')).toHaveCount(0);
    await expect(page.locator('[data-field="photos"]')).toHaveCount(0);

    const fullName = uniqueName('AdminCreate');
    await page.locator('[data-field="full_name"] input').fill(fullName);
    await page.locator('[data-field="phone_local"] input').fill('123456789');
    await page
      .locator('[data-field="pickup_address"] input')
      .fill('1 Jalan Test, 50000 Kuala Lumpur');
    await page
      .locator('[data-field="requested_at"] input')
      .fill(toDateTimeLocalValue(futureIso(48)));

    await page.getByRole('button', { name: 'Create request' }).click();
    await expect(page).toHaveURL(/\/admin\/pickup-requests\/[^/]+$/);
    await expect(page.getByRole('heading', { name: fullName })).toBeVisible();
    await expect(page.getByText('Open', { exact: true })).toBeVisible();
    await expect(page.getByText('0 orders')).toBeVisible();
  });

  test('create order view has optional items, creating with zero items succeeds', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    const fullName = uniqueName('ZeroItemOrder');
    const pickupRequestId = await createPickupRequestViaApi(
      page.request,
      fullName,
    );

    await page.goto(`/admin/pickup-requests/${pickupRequestId}`);
    await page.getByRole('link', { name: 'Create order' }).click();
    await expect(page).toHaveURL(
      `/admin/pickup-requests/${pickupRequestId}/orders/create`,
    );

    // No pre-existing material row, and the multi-photo uploader is
    // present (up to 4).
    await expect(page.locator('[data-field="category"]')).toHaveCount(0);
    await expect(page.getByText(/up to 4/i)).toBeVisible();

    await page.getByRole('button', { name: 'Create order' }).click();
    await expect(page).toHaveURL(/\/admin\/pickups\/[^/]+$/);

    const orderId = page.url().split('/').pop() as string;
    await page.request.delete(`/api/v1/pickups/${orderId}/`);
  });

  test('a request shows its orders, and "Create order" disappears once at the 7-order cap', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    const fullName = uniqueName('SevenOrders');
    const pickupRequestId = await createPickupRequestViaApi(
      page.request,
      fullName,
    );
    // Sequential by design: validate_order_count's check-then-insert isn't
    // guarded against concurrent creates, so firing these in parallel could
    // race past the 7-order cap and make the assertions below flaky.
    const orderIds: string[] = [];
    for (let i = 0; i < 7; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const { id } = await createOrderViaApi(page.request, pickupRequestId);
      orderIds.push(id);
    }

    await page.goto(`/admin/pickup-requests/${pickupRequestId}`);
    await expect(page.getByText('7 orders')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create order' })).toHaveCount(
      0,
    );

    // The 8th is still rejected server-side even via direct API call —
    // validate_order_count's hard block (defense in depth, not just a
    // hidden button here).
    const res = await page.request.post(
      `/api/v1/pickup-requests/${pickupRequestId}/orders/`,
      { data: { items: [] } },
    );
    expect(res.ok()).toBe(false);

    await Promise.all(
      orderIds.map((id) => page.request.delete(`/api/v1/pickups/${id}/`)),
    );
  });

  test('editing a request updates contact/address/date, read back on the details page', async ({
    page,
  }) => {
    await loginAs(page, 'qaStaff');
    const fullName = uniqueName('Edit');
    const pickupRequestId = await createPickupRequestViaApi(
      page.request,
      fullName,
    );
    const newName = `${fullName} Edited`;

    await page.goto(`/staff/pickup-requests/${pickupRequestId}`);
    await page.getByRole('link', { name: 'Edit', exact: true }).click();
    await expect(page).toHaveURL(
      `/staff/pickup-requests/${pickupRequestId}/edit`,
    );

    const save = page.getByRole('button', { name: 'Save changes' });
    await expect(save).toBeDisabled();

    await page.locator('[data-field="full_name"] input').fill(newName);
    await page
      .locator('[data-field="pickup_address"] input')
      .fill('PV5 Platinum Hill Condo, Setapak, 53300 Kuala Lumpur');
    await expect(save).toBeEnabled();
    await save.click();

    await expect(page).toHaveURL(`/staff/pickup-requests/${pickupRequestId}`);
    await expect(page.getByRole('heading', { name: newName })).toBeVisible();
    await expect(page.getByText('PV5 Platinum Hill Condo')).toBeVisible();
  });

  test('cancelling a request requires a reason and cascades to every non-terminal order', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    const fullName = uniqueName('CancelCascade');
    const pickupRequestId = await createPickupRequestViaApi(
      page.request,
      fullName,
    );
    const orderA = await createOrderViaApi(page.request, pickupRequestId, [
      { category: E_WASTE_CATEGORY_ID },
    ]);
    const orderB = await createOrderViaApi(page.request, pickupRequestId, [
      { category: E_WASTE_CATEGORY_ID },
    ]);

    await page.goto(`/admin/pickup-requests/${pickupRequestId}`);
    await page.getByRole('button', { name: 'Cancel request' }).click();

    const confirmCancel = page.getByRole('button', {
      name: 'Cancel pickup request',
      exact: true,
    });
    await confirmCancel.click();
    await expect(
      page.getByText(/cancellation reason is required/i),
    ).toBeVisible();

    await page
      .getByPlaceholder(/why is this pickup request being cancelled/i)
      .fill('Customer backed out.');
    await confirmCancel.click();

    await expect(
      page.getByText('Cancelled', { exact: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Cancel request' }),
    ).toHaveCount(0);

    const orderARes = await page.request.get(`/api/v1/pickups/${orderA.id}/`);
    const orderBRes = await page.request.get(`/api/v1/pickups/${orderB.id}/`);
    expect((await orderARes.json()).status).toBe('cancelled');
    expect((await orderBRes.json()).status).toBe('cancelled');
  });
});

test('full lifecycle: public submission through to the request showing fulfilled', async ({
  page,
}) => {
  const fullName = uniqueName('FullLifecycle');

  // 1. Public submission — date/time only, no items/photo.
  await page.goto('/request-pickup');
  await page.getByText('Individual / Household').click();
  await page.locator('[data-field="full_name"] input').fill(fullName);
  await page.locator('[data-field="phone_local"] input').fill('123456789');
  await page
    .locator('[data-field="pickup_address"] input')
    .fill('1 Jalan Test, 50000 Kuala Lumpur');
  await page
    .locator('[data-field="requested_at"] input')
    .fill(toDateTimeLocalValue(futureIso(48)));
  await page.getByRole('button', { name: 'Submit Request' }).click();
  await expect(page.getByText(/request received/i)).toBeVisible();

  // 2. Admin sees it on the Pickup Requests list, `open`.
  await loginAs(page, 'admin');
  await page.goto('/admin/pickup-requests');
  await page.getByPlaceholder(/search/i).fill(fullName);
  await page.getByText(fullName, { exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/pickup-requests\/[^/]+$/);
  const pickupRequestId = page.url().split('/').pop() as string;
  await expect(page.getByText('Open', { exact: true })).toBeVisible();

  // 3. Admin creates an Order under it, with one material.
  await page.getByRole('link', { name: 'Create order' }).click();
  await page.getByRole('button', { name: 'Add another item' }).click();
  await page
    .locator('[data-field="category"] select')
    .selectOption(E_WASTE_CATEGORY_ID);
  await page.locator('[data-field="estimated_quantity"] input').fill('5');
  await page.getByRole('button', { name: 'Create order' }).click();
  await expect(page).toHaveURL(/\/admin\/pickups\/[^/]+$/);
  const orderId = page.url().split('/').pop() as string;
  await expect(page.getByText('E-waste — 5.00 kg')).toBeVisible();

  // 4. Evaluate -> approve with a price. UI-driven (same EvaluateModal
  // e2e/pickups.spec.ts already covers in isolation) — asserted here
  // too since it gates the next step.
  await page.getByRole('button', { name: 'Evaluate' }).click();
  await page.locator('[data-field="price"] input').fill('20.00');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Approve' })
    .click();
  await expect(page.getByText('Approved', { exact: true })).toBeVisible();

  // 5. Assign the specific driver this test logs in as next (qaDriver)
  // — via the API directly rather than the UI's driver picker (which
  // may list several seeded drivers in any order; AssignDriverModal's
  // own picker behavior is already covered by pickups.spec.ts). This
  // step just needs the right driver assigned so steps 6-8 below see
  // this order under *their* own pickups.
  const driversRes = await page.request.get('/api/v1/accounts/drivers/');
  const driver = (await driversRes.json()).results.find(
    (d: { user: { email: string } }) =>
      d.user.email === 'driver@recyclinghub.example',
  );
  const assignRes = await page.request.post(
    `/api/v1/pickups/${orderId}/assign-driver/`,
    { data: { driver: driver.id } },
  );
  expect(assignRes.ok()).toBe(true);
  await page.reload();
  await expect(page.getByText('Scheduled', { exact: true })).toBeVisible();

  // 6. Driver confirms the pickup time.
  await loginAs(page, 'qaDriver');
  await page.goto(`/driver/pickups/${orderId}`);
  await page.getByRole('button', { name: 'Confirm pickup time' }).click();
  await page
    .locator('[data-field="scheduled_at"] input')
    .fill(toDateTimeLocalValue(futureIso(2)));
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.getByText(/pickup time confirmed/i)).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Confirm pickup time' }),
  ).toHaveCount(0);

  // 7. Driver collects, adding one on-site material.
  await page.goto('/driver/pickups');
  await page.getByRole('button', { name: 'My Pickups' }).click();
  await page
    .locator('tr', { hasText: 'E-waste' })
    .getByRole('button', { name: /mark pickup for .+ as collected/i })
    .click();
  const collectDialog = page.getByRole('dialog');
  await collectDialog
    .getByRole('button', { name: 'Add another material' })
    .click();
  // The newly-added row's own category/quantity fields — unlike the
  // existing item's correction row (data-field="item-category-…"/
  // "item-quantity-…"), a freshly added row's fields keep their plain
  // field names.
  await collectDialog
    .locator('[data-field="category"] select')
    .selectOption(E_WASTE_CATEGORY_ID);
  await collectDialog
    .locator('[data-field="collected_quantity"] input')
    .fill('2');
  await collectDialog
    .locator('[data-field="payment_method"] select')
    .selectOption('cash');
  await collectDialog.getByRole('button', { name: 'Mark collected' }).click();
  await expect(page.getByText(/marked as collected/i)).toBeVisible();

  // 8. Driver drops off the route at a store.
  await page.goto('/driver/drop-off');
  const dropOffRow = page.locator('tr', { hasText: 'E-waste' });
  await dropOffRow.locator('input[type="checkbox"]').check();
  await page
    .locator('[data-field="collection_point"] select')
    .selectOption({ index: 1 });
  await page.getByRole('button', { name: /drop off to store/i }).click();
  await expect(page.getByText(/dropped off to store/i)).toBeVisible();

  // 9. Receiving verifies and closes.
  await loginAs(page, 'qaReceivingOfficer');
  await page.goto('/receiving/deliveries');
  await page
    .locator('tr', { hasText: 'E-waste' })
    .getByRole('button', { name: /verify and close delivery/i })
    .click();
  await expect(page.getByText(/verified and closed/i)).toBeVisible();

  // 10. The pickup request itself recomputes to `fulfilled` once its
  // only Order is closed.
  await loginAs(page, 'admin');
  const finalRequest = await page.request.get(
    `/api/v1/pickup-requests/${pickupRequestId}/`,
  );
  expect((await finalRequest.json()).status).toBe('fulfilled');

  await page.goto(`/admin/pickup-requests/${pickupRequestId}`);
  await expect(page.getByText('Fulfilled', { exact: true })).toBeVisible();
});
