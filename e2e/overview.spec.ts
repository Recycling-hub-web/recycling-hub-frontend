import type { APIRequestContext, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Overview dashboards for all six roles, built from the reusable
 * components in components/features/overview/ and the shared charts
 * in ui/charts/{LineChart,BarChart,DonutChart}. Every role's numbers
 * now come from a real server-side aggregate (apps/dashboard on the
 * backend — one endpoint per role) instead of client-side
 * paginated-list `count` reuse: Admin/Staff share one endpoint (Staff
 * just never gets `total_users` back), Driver/Receiving/Accounting/
 * Super Admin each have their own. Staff, Receiving, and Super Admin
 * all gained charts/tiles they didn't have before this; Accounting's
 * "amount pending" is a real Sum now, not a client-side sum capped at
 * 200 fetched rows. Staff/Driver/Receiving Officer also get a short
 * preview table (uncontacted leads / assigned pickups / awaiting-close
 * deliveries), still built from the same list fetch as their stat tile
 * — no second request for that part.
 *
 * Login already lands on the role's home route (ROLE_HOME in
 * types/auth.ts) — /admin, /staff, /driver, /receiving, /accounting,
 * /super-admin.
 */

const E_WASTE_CATEGORY_ID = '89067cc7-38ef-4752-9cd4-3ea29975abcb';

const uniqueName = (label: string) => `E2E Overview ${label} ${Date.now()}`;
const uniquePhone = () => `+6019${Date.now().toString().slice(-7)}`;

// evaluate -> assign-driver -> collect, same real API chain
// route-drop-off.spec.ts/finance.spec.ts already use, as an
// authenticated admin request context — lands the request on
// qaDriver's open Route in `collected` status.
const seedCollectedOnRoute = async (
  request: APIRequestContext,
  fullName: string,
  price = '15.00',
) => {
  const createRes = await request.post('/api/v1/pickups/', {
    data: {
      full_name: fullName,
      email: 'e2e-overview@example.com',
      phone_number: '+60123456789',
      items: [{ category: E_WASTE_CATEGORY_ID }],
      pickup_address: '1 Jalan Test, 50000 Kuala Lumpur',
    },
  });
  expect(createRes.ok()).toBe(true);
  const { id } = await createRes.json();

  const evalRes = await request.post(`/api/v1/pickups/${id}/evaluate/`, {
    data: { decision: 'approved', price },
  });
  expect(evalRes.ok()).toBe(true);

  const driversRes = await request.get('/api/v1/accounts/drivers/');
  const driver = (await driversRes.json()).results.find(
    (d: { user: { email: string } }) =>
      d.user.email === 'driver@recyclinghub.example',
  );
  const assignRes = await request.post(`/api/v1/pickups/${id}/assign-driver/`, {
    data: { driver: driver.id },
  });
  expect(assignRes.ok()).toBe(true);

  const collectRes = await request.post(`/api/v1/pickups/${id}/collect/`, {
    data: { actual_amount: price, payment_method: 'cash' },
  });
  expect(collectRes.ok()).toBe(true);

  return id as string;
};

test.describe('Admin overview', () => {
  test('shows real stats, quick links, and the three dashboard charts', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    await expect(page).toHaveURL(/\/admin$/);

    await expect(page.getByText('Total users')).toBeVisible();
    await expect(page.getByText('Pending pickups')).toBeVisible();
    await expect(page.getByText('Pending messages')).toBeVisible();
    await expect(page.getByText('Published posts')).toBeVisible();

    // The three shared charts — this is the one page in the app any of
    // them render on.
    await expect(
      page.getByRole('heading', { name: 'Pickup volume' }),
    ).toBeVisible();
    await expect(page.getByText('Pickup requests by status')).toBeVisible();
    await expect(page.getByText('Finance records by status')).toBeVisible();

    const quickLinks = page.getByTestId('overview-quick-links');
    await expect(quickLinks).toBeVisible();
    await quickLinks.getByRole('link', { name: 'Pickup Requests' }).click();
    await expect(page).toHaveURL(/\/admin\/pickups$/);
  });
});

test.describe('Staff overview', () => {
  test('shows the same shape of dashboard, minus the Users stat', async ({
    page,
  }) => {
    await loginAs(page, 'qaStaff');
    await expect(page).toHaveURL(/\/staff$/);

    await expect(page.getByText('Total users')).not.toBeVisible();
    await expect(page.getByText('Pending pickups')).toBeVisible();
    await expect(page.getByText('Pending messages')).toBeVisible();
    await expect(page.getByText('Published posts')).toBeVisible();

    // Same charts Admin's dashboard has — Staff now gets them too (same
    // shared AdminOverviewStatsView endpoint, see useStaffOverviewStats).
    await expect(
      page.getByRole('heading', { name: 'Pickup volume' }),
    ).toBeVisible();
    await expect(page.getByText('Pickup requests by status')).toBeVisible();
    await expect(page.getByText('Finance records by status')).toBeVisible();

    const quickLinks = page.getByTestId('overview-quick-links');
    await expect(quickLinks).toBeVisible();
    await quickLinks.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/\/staff\/contact$/);
  });

  test('uncontacted leads stat and preview table reflect real quick leads', async ({
    page,
  }) => {
    const phone = uniquePhone();
    const createRes = await page.request.post('/api/v1/pickups/quick/', {
      data: { phone_number: phone },
    });
    expect(createRes.ok()).toBe(true);

    await loginAs(page, 'qaStaff');
    await expect(page).toHaveURL(/\/staff$/);

    const statGrid = page.getByTestId('overview-stat-grid');
    await expect(statGrid.getByText('Uncontacted leads')).toBeVisible();
    const row = page.locator('tr', { hasText: phone });
    await expect(row).toBeVisible();
    await expect(row.getByText('New')).toBeVisible();

    // Marking it contacted removes it from this "new only" preview.
    await row.getByRole('button', { name: /mark lead.*as contacted/i }).click();
    await expect(page.locator('tr', { hasText: phone })).toHaveCount(0);
  });
});

test.describe('Driver overview', () => {
  test('shows available/assigned stat tiles linking to Pickup Requests', async ({
    page,
  }) => {
    await loginAs(page, 'qaDriver');
    await expect(page).toHaveURL(/\/driver$/);

    const statGrid = page.getByTestId('overview-stat-grid');
    await expect(statGrid.getByText('Available pickups')).toBeVisible();
    await expect(statGrid.getByText('My assigned pickups')).toBeVisible();
    await expect(statGrid.getByText('Open route')).toBeVisible();

    // Same chart types as Admin's dashboard, but scoped to this
    // driver's own pickups/finance records. "My pickup volume" is the
    // same selectable-range chart Admin/Staff/Super Admin have (see
    // PickupVolumeChart), scoped to this driver's own pickups
    // (useDriverPickupVolume/DriverPickupVolumeView).
    await expect(
      page.getByRole('heading', { name: 'My pickup volume' }),
    ).toBeVisible();
    await expect(page.getByText('My pickups by status')).toBeVisible();
    await expect(page.getByText('My money by status')).toBeVisible();

    await page.getByRole('link', { name: /available pickups/i }).click();
    await expect(page).toHaveURL(/\/driver\/pickups$/);
  });

  test('assigned-pickups preview table reflects a real assignment', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    const fullName = uniqueName('Driver');
    const createRes = await page.request.post('/api/v1/pickups/', {
      data: {
        full_name: fullName,
        email: 'e2e-overview@example.com',
        phone_number: '+60123456789',
        items: [{ category: E_WASTE_CATEGORY_ID }],
        pickup_address: '1 Jalan Test, 50000 Kuala Lumpur',
      },
    });
    const { id } = await createRes.json();
    await page.request.post(`/api/v1/pickups/${id}/evaluate/`, {
      data: { decision: 'approved', price: '15.00' },
    });
    const driversRes = await page.request.get('/api/v1/accounts/drivers/');
    const driver = (await driversRes.json()).results.find(
      (d: { user: { email: string } }) =>
        d.user.email === 'driver@recyclinghub.example',
    );
    await page.request.post(`/api/v1/pickups/${id}/assign-driver/`, {
      data: { driver: driver.id },
    });

    await loginAs(page, 'qaDriver');
    await expect(page).toHaveURL(/\/driver$/);

    const row = page.locator('tr', { hasText: fullName });
    await expect(row).toBeVisible();
    await expect(row.getByText('Scheduled')).toBeVisible();

    await page.getByRole('link', { name: 'View all' }).click();
    await expect(page).toHaveURL(/\/driver\/pickups$/);

    await loginAs(page, 'admin');
    await page.request.delete(`/api/v1/pickups/${id}/`);
  });
});

test.describe('Receiving Officer overview', () => {
  test('awaiting-close stat and preview table reflect a real delivery', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    const fullName = uniqueName('Receiving');
    const id = await seedCollectedOnRoute(page.request, fullName);

    await loginAs(page, 'qaDriver');
    const dropOffRes = await page.request.post('/api/v1/pickups/drop-off/', {
      data: { items: [{ id }] },
    });
    expect(dropOffRes.ok()).toBe(true);

    await loginAs(page, 'qaReceivingOfficer');
    await expect(page).toHaveURL(/\/receiving$/);

    const statGrid = page.getByTestId('overview-stat-grid');
    await expect(statGrid.getByText('Awaiting close')).toBeVisible();
    // New: a real aggregate this role didn't have before
    // (ReceivingOverviewStatsView).
    await expect(statGrid.getByText('Closed this month')).toBeVisible();
    // Selectable-range chart, scoped to closed deliveries
    // (useReceivingVolume/ReceivingVolumeView).
    await expect(
      page.getByRole('heading', { name: 'Closed-delivery volume' }),
    ).toBeVisible();
    await expect(page.getByText('Deliveries by status')).toBeVisible();

    const row = page.locator('tr', { hasText: fullName });
    await expect(row).toBeVisible();
    await expect(row.getByText('Delivered')).toBeVisible();

    await page.getByRole('link', { name: 'View all' }).click();
    await expect(page).toHaveURL(/\/receiving\/deliveries$/);
    await expect(page.locator('tr', { hasText: fullName })).toBeVisible();

    await loginAs(page, 'admin');
    await page.request.delete(`/api/v1/pickups/${id}/`);
  });
});

test.describe('Super Admin overview', () => {
  test('shows org-wide stats, users-by-role chart, and existing seat limits', async ({
    page,
  }) => {
    await loginAs(page, 'qaSuperAdmin');
    await expect(page).toHaveURL(/\/super-admin$/);

    // Seat limits, unchanged — still from useRoleLimits, not the new
    // endpoint. Scoped through the stat grid — the sidebar's own
    // profile footer also renders "Super Admin" text.
    const statGrid = page.getByTestId('overview-stat-grid');
    await expect(statGrid.getByText('Admins', { exact: true })).toBeVisible();
    await expect(statGrid.getByText('Super Admins')).toBeVisible();

    // New: organization-wide stats this page didn't have before
    // (SuperAdminOverviewStatsView).
    await expect(statGrid.getByText('Pickups this month')).toBeVisible();
    await expect(statGrid.getByText('Reimbursed this month')).toBeVisible();
    await expect(statGrid.getByText('Active collection points')).toBeVisible();
    await expect(statGrid.getByText('Active service areas')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Pickup volume' }),
    ).toBeVisible();
    await expect(page.getByText('Users by role')).toBeVisible();

    const quickLinks = page.getByTestId('overview-quick-links');
    await expect(quickLinks).toBeVisible();
    await quickLinks.getByRole('link', { name: 'Pickup Requests' }).click();
    await expect(page).toHaveURL(/\/super-admin\/pickups$/);
  });
});

test.describe('Accounting overview', () => {
  test('unverified-records stat and amount pending reflect a real claimed record', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    const fullName = uniqueName('Accounting');
    const id = await seedCollectedOnRoute(page.request, fullName, '42.00');

    await loginAs(page, 'qaDriver');
    const claimRes = await page.request.post('/api/v1/finance/claim-mine/');
    expect(claimRes.ok()).toBe(true);

    await loginAs(page, 'qaAccounting');
    await expect(page).toHaveURL(/\/accounting$/);

    await expect(page.getByText('Unverified records')).toBeVisible();
    await expect(page.getByText('Amount pending')).toBeVisible();
    // New: a real aggregate this role didn't have before
    // (AccountingOverviewStatsView) — "amount pending" itself is also
    // now a real server-side Sum, no longer capped at 200 fetched rows
    // (see apps/dashboard/tests.py's own test of that specifically).
    await expect(page.getByText('Reimbursed this month')).toBeVisible();
    // Selectable-range chart, scoped to reimbursed records
    // (useAccountingVolume/AccountingVolumeView).
    await expect(
      page.getByRole('heading', { name: 'Reimbursed volume' }),
    ).toBeVisible();
    await expect(page.getByText('Finance records by status')).toBeVisible();

    await page.getByRole('link', { name: /unverified records/i }).click();
    await expect(page).toHaveURL(/\/accounting\/finance$/);
    await expect(page.locator('tr', { hasText: fullName })).toContainText(
      'Claimed',
    );

    await loginAs(page, 'admin');
    await page.request.delete(`/api/v1/pickups/${id}/`);
  });
});

test.describe('Pickup volume chart — range picker', () => {
  const total = (page: Page) => page.getByTestId('pickup-volume-total');
  const rangeButton = (page: Page, name: string) =>
    page
      .getByRole('group', { name: 'Date range' })
      .getByRole('button', { name, exact: true });
  const totalNumber = async (page: Page) =>
    Number((await total(page).innerText()).replace(/,/g, ''));

  test('presets switch grouping, the total matches the API, and the choice is remembered', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin');
    // Start from the default regardless of what an earlier run stored.
    await page.evaluate(() =>
      window.localStorage.removeItem('rh_pickup_volume_range'),
    );
    await page.reload();

    await expect(rangeButton(page, '30D')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.getByText('Last 30 days · daily')).toBeVisible();
    const thirtyDayTotal = await totalNumber(page);

    await rangeButton(page, '6M').click();
    await expect(page.getByText('Last 6 months · weekly')).toBeVisible();
    const sixMonthTotal = await totalNumber(page);
    expect(sixMonthTotal).toBeGreaterThanOrEqual(thirtyDayTotal);

    const api = await page.request.get(
      '/api/v1/dashboard/pickup-volume/?range=6m',
    );
    expect(api.ok()).toBe(true);
    expect((await api.json()).total).toBe(sixMonthTotal);

    await page.reload();
    await expect(rangeButton(page, '6M')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.getByText('Last 6 months · weekly')).toBeVisible();

    await rangeButton(page, 'All').click();
    await expect(page.getByText(/^All time · /)).toBeVisible();
  });

  test('a custom range shows its dates and rejects a start after the end', async ({
    page,
  }) => {
    await loginAs(page, 'qaStaff');
    await page.goto('/staff');
    await rangeButton(page, 'Custom').click();

    const from = page.locator('[data-field="from"] input');
    const to = page.locator('[data-field="to"] input');
    await expect(from).not.toHaveValue('');
    await expect(to).not.toHaveValue('');

    await from.fill('2026-09-20');
    await to.fill('2026-09-10');
    await expect(
      page.getByText('The start date must be on or before the end date.'),
    ).toBeVisible();

    await to.fill('2026-09-30');
    await expect(
      page.getByText(/20 Sept? 2026 – 30 Sept? 2026 · daily/),
    ).toBeVisible();

    const api = await page.request.get(
      '/api/v1/dashboard/pickup-volume/?from=2026-09-20&to=2026-09-30',
    );
    expect((await api.json()).total).toBe(await totalNumber(page));
  });
});
