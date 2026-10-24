import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Orders — covers the admin/staff lifecycle built for this module
 * (components/features/pickups/): schedule -> collect, and the cancel
 * path, both exercised through the actual status-driven action buttons
 * on the Order details page (/admin/pickups/{id}, /staff/pickups/{id}),
 * not by calling the service layer directly.
 *
 * Since the Request/Order restructure, public `POST /pickups/` is
 * gone — every Order now needs a parent PickupRequest first (`POST
 * /pickup-requests/`, public) and is itself created under it (`POST
 * /pickup-requests/{id}/orders/`, admin/staff only). See
 * e2e/pickup-requests.spec.ts for the Request-level flow (the public
 * form, the Pickup Requests list/detail, cancel-cascades-to-orders,
 * fulfilled recompute) — this file stays focused on the Order
 * lifecycle itself, same as before the restructure.
 */

// A real materials-module category id from the seeded dev DB
// (apps.categories — Category.Module.MATERIALS). Orders require a
// valid category FK when items are given.
const E_WASTE_CATEGORY_ID = '89067cc7-38ef-4752-9cd4-3ea29975abcb';

const uniqueName = (label: string) => `E2E Pickup ${label} ${Date.now()}`;

/** Creates a PickupRequest, then one Order under it with a single
 * item — the new two-step equivalent of the old flat seedPickupRequest.
 * Must be called with an authenticated request context (the Order
 * creation step is admin/staff only). Returns the Order's id (what the
 * rest of this file actually exercises). */
const seedOrder = async (
  request: APIRequestContext,
  fullName: string,
): Promise<{ orderId: string; pickupRequestId: string }> => {
  const requestRes = await request.post('/api/v1/pickup-requests/', {
    data: {
      full_name: fullName,
      email: 'e2e-pickup@example.com',
      phone_number: '+60123456789',
      pickup_address: '1 Jalan Test, 50000 Kuala Lumpur',
      requested_at: new Date(Date.now() + 86_400_000).toISOString(),
    },
  });
  expect(requestRes.ok()).toBe(true);
  const pickupRequestId = (await requestRes.json()).id as string;

  const orderRes = await request.post(
    `/api/v1/pickup-requests/${pickupRequestId}/orders/`,
    {
      data: {
        items: [{ category: E_WASTE_CATEGORY_ID, estimated_quantity: '5.5' }],
      },
    },
  );
  expect(orderRes.ok()).toBe(true);
  const orderId = (await orderRes.json()).id as string;
  return { orderId, pickupRequestId };
};

// Scheduling/assigning a driver both require evaluation_status=approved
// (see CollectionRequestDecisionService.schedule/assign_driver) —
// OrderDetailsView only even renders "Schedule pickup" once approved.
const approveOrder = async (request: APIRequestContext, orderId: string) => {
  const res = await request.post(`/api/v1/pickups/${orderId}/evaluate/`, {
    data: { decision: 'approved', price: '10.00' },
  });
  expect(res.ok()).toBe(true);
};

test.describe('Admin orders', () => {
  test('schedules a pending order, then marks it collected', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    const fullName = uniqueName('Schedule');
    const { orderId } = await seedOrder(page.request, fullName);
    await approveOrder(page.request, orderId);
    await page.goto(`/admin/pickups/${orderId}`);

    await expect(page.getByText('Pending', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Schedule pickup' }).click();

    // Schedule modal (AssignDriverModal, driver-only): submit is only
    // ever disabled while in flight, not pre-emptively on validity —
    // clicking with nothing filled in stays on the modal and shows
    // inline errors instead.
    const scheduleSubmit = page.getByRole('button', {
      name: 'Schedule',
      exact: true,
    });
    await expect(scheduleSubmit).toBeEnabled();
    await scheduleSubmit.click();
    await expect(page.getByText(/choose a driver/i)).toBeVisible();

    await page.locator('select').selectOption({ index: 1 });
    // Pickup date is optional — filled in here anyway to exercise it,
    // but the earlier "choose a driver" error above already confirms
    // the driver, not the date, is what's actually required.
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await page
      .locator('input[type="date"]')
      .fill(future.toISOString().slice(0, 10));

    await scheduleSubmit.click();
    await expect(page.getByText('Scheduled', { exact: true })).toBeVisible();
    await expect(page.getByText(/pickup scheduled/i)).toBeVisible();

    await page.getByRole('button', { name: 'Mark as collected' }).click();
    // Scheduling now always assigns a driver (see AssignDriverModal), so
    // the collect modal always shows payment fields — a staff collector
    // with no driver, and thus no payment fields, no longer exists.
    await page
      .locator('[data-field="payment_method"] select')
      .selectOption('cash');
    await page
      .getByRole('button', { name: 'Mark collected', exact: true })
      .click();
    await expect(page.getByText('Collected', { exact: true })).toBeVisible();
    await expect(page.getByText(/marked as collected/i)).toBeVisible();

    // Terminal state — no more action buttons.
    await expect(
      page.getByRole('button', { name: 'Schedule pickup' }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: 'Cancel', exact: true }),
    ).toHaveCount(0);

    // There's no delete action in the UI (orders are cancelled, not
    // deleted — a deliberate scope decision, unlike contact messages).
    // Clean up directly via the API so repeated runs don't pile up.
    await page.request.delete(`/api/v1/pickups/${orderId}/`);
  });

  test('cancels a pending order with a required reason', async ({ page }) => {
    await loginAs(page, 'admin');
    const fullName = uniqueName('Cancel');
    const { orderId } = await seedOrder(page.request, fullName);
    await page.goto(`/admin/pickups/${orderId}`);

    // exact: true — the notification bell (always rendered in the
    // topbar) can contain this seeded order's own requester name in an
    // unread "New pickup request submitted" item, whose accessible
    // name would otherwise also match a loose "Cancel" substring
    // search.
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    const confirmCancel = page.getByRole('button', {
      name: 'Cancel pickup',
      exact: true,
    });
    // Only ever disabled while in flight — clicking with an empty
    // reason stays on the modal and shows an inline error instead of
    // being blocked pre-emptively.
    await expect(confirmCancel).toBeEnabled();
    await confirmCancel.click();
    await expect(
      page.getByText(/cancellation reason is required/i),
    ).toBeVisible();

    await page
      .getByPlaceholder(/why is this pickup being cancelled/i)
      .fill('No longer needed.');
    await confirmCancel.click();

    await expect(page.getByText('Cancelled', { exact: true })).toBeVisible();
    await expect(page.getByText(/pickup cancelled/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Schedule pickup' }),
    ).toHaveCount(0);

    await page.request.delete(`/api/v1/pickups/${orderId}/`);
  });

  test('approving from the list table requires a price, same as the detail page', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    const fullName = uniqueName('TableApprove');
    const { orderId } = await seedOrder(page.request, fullName);
    const orderDetail = await page.request.get(`/api/v1/pickups/${orderId}/`);
    const { code } = await orderDetail.json();

    await page.goto('/admin/pickups');
    await page.getByPlaceholder(/search/i).fill(code);

    const row = page.locator('tr', { hasText: code });
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: `Approve order ${code}` }).click();

    // Same EvaluateModal the detail page uses — submitting with no
    // price shows the same inline validation, not a failed API call
    // (this is the bug: the old one-click Approve sent no price at
    // all, and the backend always rejects an approval with none).
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Evaluate pickup request')).toBeVisible();
    await dialog.getByRole('button', { name: 'Approve' }).click();
    await expect(dialog.getByText('Enter a valid price.')).toBeVisible();

    await dialog.locator('[data-field="price"] input').fill('25.00');
    await dialog.getByRole('button', { name: 'Approve' }).click();

    await expect(page.getByText(/evaluation saved/i)).toBeVisible();
    await expect(row.getByText('Approved')).toBeVisible();

    await page.request.delete(`/api/v1/pickups/${orderId}/`);
  });
});

test.describe('Staff orders', () => {
  test('has the same schedule/collect/cancel access as admin', async ({
    page,
  }) => {
    await loginAs(page, 'qaStaff');
    const fullName = uniqueName('Staff');
    const { orderId } = await seedOrder(page.request, fullName);
    await approveOrder(page.request, orderId);
    await page.goto(`/staff/pickups/${orderId}`);

    await expect(
      page.getByRole('button', { name: 'Schedule pickup' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Cancel', exact: true }),
    ).toBeVisible();

    // The driver picker (GET /accounts/drivers/) must work for staff too.
    await page.getByRole('button', { name: 'Schedule pickup' }).click();
    await expect(page.locator('select option')).not.toHaveCount(1);

    // Staff can delete too — no admin-only restriction on this module,
    // unlike contact messages.
    await page.request.delete(`/api/v1/pickups/${orderId}/`);
  });
});
