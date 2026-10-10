import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Overview dashboards for all five roles, built from the reusable
 * components in components/features/overview/ and the shared charts
 * in ui/charts/{LineChart,BarChart,DonutChart}. Admin and Driver both
 * get Bar/DonutChart status breakdowns — Admin's own pickup/finance
 * breakdown and Driver's own pickup/money breakdown use the identical
 * pattern, just against each role's already-scoped list endpoints, so
 * neither needed new backend work; only Admin's daily-volume
 * LineChart is backed by a genuinely new endpoint
 * (CollectionRequestViewSet.daily_volume), since that's a real
 * cross-driver aggregate no single role's own data could produce.
 * Staff/Driver/Receiving Officer also get a short preview table
 * (uncontacted leads / assigned pickups / awaiting-close deliveries).
 * Accounting stays stat-only (no natural list to preview, and no
 * chart — "my money" is already on Driver's dashboard, not repeated
 * here). Every number comes from an existing, already-scoped
 * hook/endpoint.
 *
 * Login already lands on the role's home route (ROLE_HOME in
 * types/auth.ts) — /admin, /staff, /driver, /receiving, /accounting.
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
      category: E_WASTE_CATEGORY_ID,
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
      page.getByText('Daily pickup volume — last 30 days'),
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
    // driver's own pickups/finance records — no new backend endpoint
    // (see useDriverOverviewStats).
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
        category: E_WASTE_CATEGORY_ID,
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

    await page.getByRole('link', { name: /unverified records/i }).click();
    await expect(page).toHaveURL(/\/accounting\/finance$/);
    await expect(page.locator('tr', { hasText: fullName })).toContainText(
      'Claimed',
    );

    await loginAs(page, 'admin');
    await page.request.delete(`/api/v1/pickups/${id}/`);
  });
});
