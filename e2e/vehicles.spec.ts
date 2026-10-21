import type { APIRequestContext, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Vehicles — admin/staff-only fleet management, part of the Driver
 * Expense Claims feature (components/features/vehicles/). A driver's
 * petrol claim auto-resolves to whatever vehicle is assigned to them;
 * this module is the UI gap-fill for that assignment, which previously
 * only existed via Django admin/raw API calls.
 *
 * Shaped like categories.spec.ts (one shared-access model —
 * VehicleViewSet.get_permissions gives admin/staff identical CRUD), but
 * delete here is a REAL hard delete (perform_destroy calls
 * instance.delete(), no soft-delete override) — so cleanup is an actual
 * DELETE, not a deactivate, and the duplicate-assignment case proves the
 * one-vehicle-per-driver OneToOneField constraint is enforced
 * server-side, not re-implemented as a client-side "only show
 * unassigned drivers" filter (the feature was explicitly asked to stay
 * simple and skip that).
 */

// plate_number is max_length=20 on the backend — a single-letter label
// plus a 10-digit timestamp suffix keeps every generated plate well
// under that (and `-U` for the post-edit plate still fits).
const uniquePlate = (label: string) =>
  `E2E${label}${Date.now().toString().slice(-10)}`;

/** qaDriver's DriverProfile id — looked up live rather than hardcoded,
 * since Vehicle.assigned_driver is a DriverProfile id, not a User id
 * (same shape GET /accounts/drivers/ returns for Pickups' own
 * assign-driver picker). */
const getQaDriverProfileId = async (request: APIRequestContext) => {
  const res = await request.get('/api/v1/accounts/drivers/?page_size=200');
  expect(res.ok()).toBe(true);
  const data = await res.json();
  const driver = data.results.find(
    (d: { user: { email: string } }) =>
      d.user.email === 'driver@recyclinghub.example',
  );
  expect(driver).toBeTruthy();
  return driver.id as string;
};

/** qaDriver must start each test unassigned, since the one-vehicle-per-
 * driver constraint is exactly what's under test — removes whatever
 * vehicle (if any) is currently assigned to them first. */
const clearDriverVehicle = async (
  request: APIRequestContext,
  driverId: string,
) => {
  const res = await request.get('/api/v1/claims/vehicles/?page_size=200');
  const data = await res.json();
  const existing = data.results.find(
    (v: { assigned_driver: string | null }) => v.assigned_driver === driverId,
  );
  if (existing) {
    await request.delete(`/api/v1/claims/vehicles/${existing.id}/`);
  }
};

const fillCreateForm = async (
  page: Page,
  plate: string,
  vehicleType: string,
  ownership: string,
) => {
  await page.locator('[data-field="plate_number"] input').fill(plate);
  await page
    .locator('[data-field="vehicle_type"] select')
    .selectOption(vehicleType);
  await page.locator('[data-field="ownership"] select').selectOption(ownership);
};

test.describe('Admin vehicles', () => {
  test('creates, assigns a driver, edits, rejects a duplicate assignment, then deletes', async ({
    page,
  }) => {
    const plate = uniquePlate('Main');
    const updatedPlate = `${plate}-U`;

    await loginAs(page, 'admin');
    const driverId = await getQaDriverProfileId(page.request);
    await clearDriverVehicle(page.request, driverId);

    await page.goto('/admin/vehicles');

    // Create: validation error stays on the page and shows an inline
    // error — never navigates away.
    await page.getByRole('link', { name: /new vehicle/i }).click();
    await page.getByRole('button', { name: 'Create vehicle' }).click();
    await expect(page.getByText('Plate number is required.')).toBeVisible();

    await fillCreateForm(page, plate, 'car', 'personal');
    await page
      .locator('[data-field="assigned_driver"] select')
      .selectOption(driverId);
    await page.getByRole('button', { name: 'Create vehicle' }).click();

    // Create navigates to the new record's details page, with the
    // confirmation shown on arrival there.
    await expect(page).toHaveURL(/\/admin\/vehicles\/(?!create)[^/]+$/);
    await expect(page.getByText(/vehicle created/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: plate })).toBeVisible();
    await expect(page.getByText('Active', { exact: true })).toBeVisible();
    await expect(page.getByText('Farid Driver')).toBeVisible();

    const vehicleId = page.url().split('/').pop() as string;

    // Duplicate assignment: a second vehicle assigned to the same
    // already-assigned driver is rejected by the backend's OneToOneField
    // uniqueness check ("Vehicle with this assigned driver already
    // exists.") — surfaced here generically via ApiError's
    // extractErrorMessage, not a client-side "only show unassigned
    // drivers" filter.
    await page.goto('/admin/vehicles/create');
    await fillCreateForm(page, uniquePlate('Dup'), 'car', 'company');
    await page
      .locator('[data-field="assigned_driver"] select')
      .selectOption(driverId);
    await page.getByRole('button', { name: 'Create vehicle' }).click();
    await expect(page.getByText(/already exists/i)).toBeVisible();
    // Stays on the create page — the rejected vehicle was never created.
    await expect(page).toHaveURL(/\/admin\/vehicles\/create$/);

    // Edit: Save has nothing to do until a field actually differs from
    // what was loaded — disabled on arrival, not just while submitting.
    await page.goto(`/admin/vehicles/${vehicleId}/edit`);
    const saveButton = page.getByRole('button', { name: 'Save changes' });
    await expect(saveButton).toBeDisabled();

    await page.locator('[data-field="plate_number"] input').fill(updatedPlate);
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    await expect(page).toHaveURL(/\/admin\/vehicles\/(?!create)[^/]+$/);
    await expect(page.getByText(/vehicle updated/i)).toBeVisible();
    await expect(
      page.getByRole('heading', { name: updatedPlate }),
    ).toBeVisible();

    // Delete is a real hard delete here (unlike Categories' soft
    // deactivate) — the record is gone, so this navigates back to the
    // list rather than staying on a now-nonexistent details page.
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.getByText(/vehicle deleted/i)).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/vehicles$/);
    await expect(page.getByText(updatedPlate)).not.toBeVisible();
  });
});

test.describe('Staff vehicles', () => {
  test('has the same create/edit/delete access as admin', async ({ page }) => {
    await loginAs(page, 'qaStaff');
    await page.goto('/staff/vehicles');
    await expect(page.getByRole('heading', { name: 'Vehicles' })).toBeVisible();

    const plate = uniquePlate('Staff');
    await page.getByRole('link', { name: /new vehicle/i }).click();
    await fillCreateForm(page, plate, 'van', 'company');
    await page.getByRole('button', { name: 'Create vehicle' }).click();

    await expect(page).toHaveURL(/\/staff\/vehicles\/(?!create)[^/]+$/);
    await expect(page.getByText(/vehicle created/i)).toBeVisible();

    const vehicleId = page.url().split('/').pop() as string;

    // Staff can edit content too — no admin-only restriction on this
    // module, same as Categories/Partnerships.
    const patchResponse = await page.request.patch(
      `/api/v1/claims/vehicles/${vehicleId}/`,
      { data: { has_fleet_card: true } },
    );
    expect(patchResponse.ok()).toBe(true);
    const patched = await patchResponse.json();
    expect(patched.has_fleet_card).toBe(true);

    // And can really delete it (hard delete, same as admin).
    const deleteResponse = await page.request.delete(
      `/api/v1/claims/vehicles/${vehicleId}/`,
    );
    expect(deleteResponse.status()).toBe(204);
  });
});

test.describe('Driver cannot reach Vehicles', () => {
  test('has no Vehicles nav entry and is kept off the admin page', async ({
    page,
  }) => {
    await loginAs(page, 'qaDriver');
    await expect(page.getByRole('link', { name: 'Vehicles' })).toHaveCount(0);

    // middleware.ts's ROUTE_ROLES['/admin'] only allows admin/super_admin
    // — a driver hitting this URL directly is redirected away (to
    // /unauthorized or /login) rather than seeing the page.
    await page.goto('/admin/vehicles');
    await expect(page).not.toHaveURL(/\/admin\/vehicles/);
  });
});
