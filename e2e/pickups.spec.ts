import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Pickup requests — covers the admin/staff lifecycle built for this
 * module (components/features/pickups/): schedule -> collect, and the
 * cancel path, both exercised through the actual status-driven action
 * buttons on the details page, not by calling the service layer
 * directly.
 */

// A real materials-module category id from the seeded dev DB
// (apps.categories — Category.Module.MATERIALS). Pickup requests
// require a valid category FK, so this can't be a placeholder.
const E_WASTE_CATEGORY_ID = '89067cc7-38ef-4752-9cd4-3ea29975abcb';

const uniqueName = (label: string) => `E2E Pickup ${label} ${Date.now()}`;

const seedPickupRequest = async (
  request: APIRequestContext,
  fullName: string,
) => {
  const res = await request.post('/api/v1/pickups/', {
    data: {
      full_name: fullName,
      email: 'e2e-pickup@example.com',
      phone_number: '+60123456789',
      category: E_WASTE_CATEGORY_ID,
      pickup_address: '1 Jalan Test, 50000 Kuala Lumpur',
      estimated_quantity: '5.5',
      requested_date: '2026-12-01',
    },
  });
  expect(res.ok()).toBe(true);
  const { id } = await res.json();
  return id as string;
};

// Scheduling/assigning a driver both require evaluation_status=approved
// (see CollectionRequestDecisionService.schedule/assign_driver) —
// PickupRequestDetailsView only even renders "Schedule pickup" once
// approved. Called with an authenticated request context (after
// loginAs), since evaluate is admin/staff-only.
const approvePickupRequest = async (request: APIRequestContext, id: string) => {
  const res = await request.post(`/api/v1/pickups/${id}/evaluate/`, {
    data: { decision: 'approved', price: '10.00' },
  });
  expect(res.ok()).toBe(true);
};

test.describe('Admin pickup requests', () => {
  test('schedules a pending request, then marks it collected', async ({
    page,
  }) => {
    const fullName = uniqueName('Schedule');
    const id = await seedPickupRequest(page.request, fullName);

    await loginAs(page, 'admin');
    await approvePickupRequest(page.request, id);
    await page.goto(`/admin/pickups/${id}`);

    await expect(page.getByText('Pending', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Schedule pickup' }).click();

    // Schedule modal: submit is only ever disabled while in flight, not
    // pre-emptively on validity — clicking with nothing filled in stays
    // on the modal and shows inline errors instead.
    const scheduleSubmit = page.getByRole('button', {
      name: 'Schedule',
      exact: true,
    });
    await expect(scheduleSubmit).toBeEnabled();
    await scheduleSubmit.click();
    await expect(page.getByText(/choose a collector/i)).toBeVisible();

    await page.locator('select').selectOption({ index: 1 });
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const localValue = future.toISOString().slice(0, 16);
    await page.locator('input[type="datetime-local"]').fill(localValue);

    await scheduleSubmit.click();
    await expect(page.getByText('Scheduled', { exact: true })).toBeVisible();
    await expect(page.getByText(/pickup scheduled/i)).toBeVisible();

    await page.getByRole('button', { name: 'Mark as collected' }).click();
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

    // There's no delete action in the UI (pickups are cancelled, not
    // deleted — a deliberate scope decision, unlike contact messages).
    // Clean up directly via the API so repeated runs don't pile up.
    await page.request.delete(`/api/v1/pickups/${id}/`);
  });

  test('cancels a pending request with a required reason', async ({ page }) => {
    const fullName = uniqueName('Cancel');
    const id = await seedPickupRequest(page.request, fullName);

    await loginAs(page, 'admin');
    await page.goto(`/admin/pickups/${id}`);

    // exact: true — the notification bell (always rendered in the
    // topbar) can contain this seeded request's own name in an unread
    // "New pickup request submitted" item, whose accessible name would
    // otherwise also match a loose "Cancel" substring search.
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

    await page.request.delete(`/api/v1/pickups/${id}/`);
  });
});

test.describe('Staff pickup requests', () => {
  test('has the same schedule/collect/cancel access as admin', async ({
    page,
  }) => {
    const fullName = uniqueName('Staff');
    const id = await seedPickupRequest(page.request, fullName);

    await loginAs(page, 'qaStaff');
    await approvePickupRequest(page.request, id);
    await page.goto(`/staff/pickups/${id}`);

    await expect(
      page.getByRole('button', { name: 'Schedule pickup' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Cancel', exact: true }),
    ).toBeVisible();

    // The collector picker (GET /accounts/staff/) must work for staff
    // too — this was a real backend gap fixed alongside this feature
    // (StaffManagementView.get_permissions).
    await page.getByRole('button', { name: 'Schedule pickup' }).click();
    await expect(page.locator('select option')).not.toHaveCount(1);

    // Staff can delete too — no admin-only restriction on this module,
    // unlike contact messages.
    await page.request.delete(`/api/v1/pickups/${id}/`);
  });
});
