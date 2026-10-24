import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';
import path from 'path';

import { loginAs } from './helpers/auth';

/**
 * Driver Expense Claims (apps/claims on the backend) — petrol/fuel and
 * tool reimbursement claims submitted by drivers, reviewed (approve/
 * reject) and paid out by accounting/admin. Staff shares the same list
 * read-only (no Approve/Reject/Mark as Paid anywhere, same split as
 * Finance Records' own accounting/admin-vs-staff-vs-driver shape,
 * except staff has no write access here at all).
 *
 * Every driver now has at most one vehicle, assigned once by an admin
 * — there's no vehicle picker on the create form any more, and petrol
 * and tool claims share the exact same payload shape (amount_claimed +
 * an optional receipt). Vehicle admin CRUD (`/claims/vehicles/{id}/`)
 * is out of scope for this frontend feature — this suite still needs a
 * real vehicle to exercise the petrol branches (unassigned / assigned
 * without a fleet card / assigned with a fleet card), so it seeds and
 * tears vehicles down directly via the documented `/claims/vehicles/`
 * endpoint as an admin request context, the same "seed the backend
 * state the UI doesn't manage" pattern finance.spec.ts uses for its
 * own FinanceRecord chain. `assigned_driver` is unique on Vehicle (one
 * vehicle per driver, enforced server-side) and the seeded dev database
 * already assigns the qaDriver fixture a vehicle via `seed_all` — so
 * every test clears whatever is currently assigned to the driver
 * before seeding the one it actually needs. The driver's id for
 * `assigned_driver` comes from `/api/v1/accounts/drivers/`
 * (DriverProfile.id, not User.id) — the same endpoint/shape
 * finance.spec.ts already uses to resolve the driver for
 * `assign-driver` on a pickup.
 *
 * Both claim amounts are deliberately kept under the backend's
 * documented RM50 receipt threshold so each claim can be completed
 * without a real storage backend configured — this dev environment
 * has no real storage configured (see storage-files.spec.ts/
 * partnerships.spec.ts's own documented limitation), so a receipt
 * upload can't actually complete here. The tool claim's receipt
 * uploader is still exercised (a file is picked and the graceful
 * upload failure is asserted) to prove the UI is wired correctly, just
 * not relied on for a successful submission.
 */

// plate_number is capped at 20 characters on the backend — a short
// prefix plus the low digits of the timestamp stays unique within a
// single test run without tripping that limit.
const uniquePlate = (label: string) =>
  `E2E${label.slice(0, 1).toUpperCase()}${Date.now() % 1_000_000}`;

/** Resolves the seeded qaDriver's DriverProfile id (not User.id) —
 * `assigned_driver` on Vehicle and `driver` on a pickup's
 * assign-driver both take this id, per finance.spec.ts's own helper. */
const getDriverId = async (request: APIRequestContext): Promise<string> => {
  const res = await request.get('/api/v1/accounts/drivers/');
  expect(res.ok()).toBe(true);
  const driver = (await res.json()).results.find(
    (d: { user: { email: string } }) =>
      d.user.email === 'driver@recyclinghub.example',
  );
  expect(driver).toBeTruthy();
  return driver.id;
};

/** Deletes whatever vehicle is currently assigned to this driver, if
 * any — `assigned_driver` is unique, so seeding a fresh vehicle for a
 * test first requires freeing the slot (the seeded dev database starts
 * the qaDriver fixture with one already assigned). */
const clearDriverVehicle = async (
  request: APIRequestContext,
  driverId: string,
) => {
  const res = await request.get('/api/v1/claims/vehicles/?page_size=200');
  expect(res.ok()).toBe(true);
  const existing = (await res.json()).results.find(
    (v: { assigned_driver: string | null }) => v.assigned_driver === driverId,
  );
  if (!existing) return;
  const delRes = await request.delete(
    `/api/v1/claims/vehicles/${existing.id}/`,
  );
  expect(delRes.ok()).toBe(true);
};

const seedVehicle = async (
  request: APIRequestContext,
  ownership: 'personal' | 'company',
  hasFleetCard: boolean,
  assignedDriverId: string,
): Promise<{ id: string; plate: string }> => {
  const plate = uniquePlate(ownership);
  const res = await request.post('/api/v1/claims/vehicles/', {
    data: {
      plate_number: plate,
      vehicle_type: 'car',
      ownership,
      has_fleet_card: hasFleetCard,
      assigned_driver: assignedDriverId,
    },
  });
  expect(res.ok()).toBe(true);
  const { id } = await res.json();
  return { id, plate };
};

/** Deletes a seeded vehicle — used to return the test driver to "no
 * vehicle assigned" between cases, since each driver has at most one
 * vehicle now and the create form branches on that. */
const deleteVehicle = async (request: APIRequestContext, id: string) => {
  const res = await request.delete(`/api/v1/claims/vehicles/${id}/`);
  expect(res.ok()).toBe(true);
};

test('driver submits petrol and tool claims; accounting reviews, rejects, and pays; staff stays read-only', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const driverId = await getDriverId(page.request);
  await clearDriverVehicle(page.request, driverId);
  const personalVehicle = await seedVehicle(
    page.request,
    'personal',
    false,
    driverId,
  );

  // 1. Driver submits a petrol claim — no vehicle picker any more, the
  // driver's own assigned vehicle is resolved automatically and shown
  // as a read-only info line above the amount + receipt fields.
  await loginAs(page, 'qaDriver');
  await page.goto('/driver/claims/new');
  await page.locator('[data-field="category"] select').selectOption('petrol');
  await expect(
    page.getByText(`Your vehicle: ${personalVehicle.plate}`),
  ).toBeVisible();
  await page.locator('[data-field="amount_claimed"] input').fill('45.00');
  await page.getByRole('button', { name: 'Submit claim' }).click();

  // A plain `[^/]+$` pattern would also match the create page's own
  // `/new` segment and resolve immediately, before the real
  // navigation — so this waits specifically for a UUID.
  await page.waitForURL(/\/driver\/claims\/[0-9a-f-]{36}$/);
  const petrolClaimId = page.url().split('/').pop() as string;
  await expect(page.getByText('Pending', { exact: true })).toBeVisible();

  await page.goto('/driver/claims');
  await expect(
    page.locator('tr', { hasText: personalVehicle.plate }),
  ).toContainText('Pending');

  // 2. Same driver submits a tool claim (amount + an attempted receipt
  // upload — see the module comment above for why the amount stays
  // under RM50). No vehicle is involved for a tool claim at all.
  await page.goto('/driver/claims/new');
  await page.locator('[data-field="category"] select').selectOption('tool');
  await page.locator('[data-field="amount_claimed"] input').fill('25.00');
  await page
    .locator('#claim-receipt-input')
    .setInputFiles(path.join(__dirname, 'fixtures/sample-upload.txt'));
  await expect(
    page.getByText(
      /failed to generate upload urls|storage configuration|storage isn't configured/i,
    ),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Submit claim' }).click();

  await page.waitForURL(/\/driver\/claims\/[0-9a-f-]{36}$/);
  const toolClaimId = page.url().split('/').pop() as string;
  await expect(page.getByText('Pending', { exact: true })).toBeVisible();

  // 3. Accounting sees both claims, approves the petrol claim
  // (overriding the amount), and rejects the tool claim with a reason.
  await loginAs(page, 'qaAccounting');
  await page.goto('/accounting/claims');
  await expect(
    page.locator('tr', { hasText: personalVehicle.plate }),
  ).toBeVisible();

  await page.goto(`/accounting/claims/${petrolClaimId}`);
  await expect(page.getByText('Pending', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Actions' }).click();
  await page.getByRole('menuitem', { name: 'Approve' }).click();
  await page.locator('[data-field="amount_approved"] input').fill('40.00');
  await page.locator('button[form="approve-reject-form"]').click();
  await expect(page.getByText('Approved', { exact: true })).toBeVisible();

  await page.goto(`/accounting/claims/${toolClaimId}`);
  await page.getByRole('button', { name: 'Actions' }).click();
  await page.getByRole('menuitem', { name: 'Reject' }).click();
  await page
    .locator('[data-field="rejection_reason"] textarea')
    .fill('Receipt does not match the claimed tool purchase.');
  await page.locator('button[form="approve-reject-form"]').click();
  await expect(page.getByText('Rejected', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Receipt does not match the claimed tool purchase.'),
  ).toBeVisible();

  // 4. Staff can see the list and both claims, but there is no
  // Approve/Reject/Mark as Paid control visible anywhere — no action
  // column in the list, and the detail page's ActionsDropdown doesn't
  // render at all for a read-only role.
  await loginAs(page, 'qaStaff');
  await page.goto('/staff/claims');
  await expect(
    page.locator('tr', { hasText: personalVehicle.plate }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Actions' })).toHaveCount(0);

  await page.goto(`/staff/claims/${petrolClaimId}`);
  await expect(page.getByText('Approved', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Actions' })).toHaveCount(0);

  await page.goto(`/staff/claims/${toolClaimId}`);
  await expect(page.getByText('Rejected', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Actions' })).toHaveCount(0);

  // 5. Accounting marks the approved petrol claim as paid.
  await loginAs(page, 'qaAccounting');
  await page.goto(`/accounting/claims/${petrolClaimId}`);
  await page.getByRole('button', { name: 'Actions' }).click();
  await page.getByRole('menuitem', { name: 'Mark as paid' }).click();
  await expect(page.getByText('Paid', { exact: true })).toBeVisible();

  // Cleanup: free up the driver's one vehicle slot for other tests/runs.
  await loginAs(page, 'admin');
  await deleteVehicle(page.request, personalVehicle.id);
});

test('a fleet-card vehicle and no vehicle assigned both block a driver petrol claim', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const driverId = await getDriverId(page.request);
  await clearDriverVehicle(page.request, driverId);
  const fleetVehicle = await seedVehicle(
    page.request,
    'company',
    true,
    driverId,
  );

  // Fleet card vehicles are reimbursed directly — the driver's own
  // auto-resolved vehicle is checked, and the amount/receipt fields
  // and Submit are blocked entirely.
  await loginAs(page, 'qaDriver');
  await page.goto('/driver/claims/new');
  await page.locator('[data-field="category"] select').selectOption('petrol');
  await expect(
    page.getByText(
      'Fleet card vehicles are reimbursed directly — no claim needed.',
    ),
  ).toBeVisible();
  await expect(page.locator('[data-field="amount_claimed"] input')).toHaveCount(
    0,
  );
  await expect(
    page.getByRole('button', { name: 'Submit claim' }),
  ).toBeDisabled();

  // Remove the vehicle entirely — the driver now has none assigned,
  // which blocks the petrol option with a different message.
  await loginAs(page, 'admin');
  await deleteVehicle(page.request, fleetVehicle.id);

  await loginAs(page, 'qaDriver');
  await page.goto('/driver/claims/new');
  await page.locator('[data-field="category"] select').selectOption('petrol');
  await expect(
    page.getByText(
      'No vehicle is assigned to you — contact an admin before submitting a petrol claim.',
    ),
  ).toBeVisible();
  await expect(page.locator('[data-field="amount_claimed"] input')).toHaveCount(
    0,
  );
  await expect(
    page.getByRole('button', { name: 'Submit claim' }),
  ).toBeDisabled();
});
