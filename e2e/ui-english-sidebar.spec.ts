import { loadEnvConfig } from '@next/env';
import type { BrowserContext, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { SignJWT } from 'jose';

loadEnvConfig(process.cwd());
const paths = {
  admin: '/admin/users',
  staff: '/staff/pickup-requests',
  super_admin: '/super-admin/pickup-requests',
  driver: '/driver/pickups',
  accounting: '/accounting/finance',
  receiving_officer: '/receiving/deliveries',
};
const request = {
  id: 'request-1',
  code: 'R1001',
  full_name: 'Test Customer',
  email: 'test@example.test',
  phone_number: '+60123456789',
  request_type: 'individual',
  status: 'open',
  pickup_address: '1 Jalan Test',
  requested_at: null,
  orders: [],
  photos: [],
};
async function setup(page: Page, context: BrowserContext, role: string) {
  const token = await new SignJWT({ role, token_type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(
      new TextEncoder().encode(process.env.JWT_VERIFY_SECRET || 'test-only'),
    );
  await context.addCookies([
    { name: 'rh_access', value: token, url: 'http://127.0.0.1:3101' },
    { name: 'NEXT_LOCALE', value: 'bm', url: 'http://127.0.0.1:3101' },
  ]);
  await page.route('**/api/v1/**', (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/accounts/me/'))
      return route.fulfill({
        json: {
          id: 'actor',
          full_name: 'Test User',
          role,
          email: 'test@example.test',
          profile_photo: null,
        },
      });
    if (
      url.pathname.includes('/dashboard/') &&
      url.pathname.includes('volume/')
    )
      return route.fulfill({
        json: {
          range: '30d',
          from: '2026-11-01',
          to: '2026-11-23',
          interval: 'day',
          total: 0,
          points: [],
        },
      });
    if (url.pathname.endsWith('/pickup-requests/request-1/'))
      return route.fulfill({ json: request });
    if (url.pathname.endsWith('/pickup-requests/'))
      return route.fulfill({ json: { count: 1, results: [request] } });
    return route.fulfill({
      json: { count: 0, results: [], next: null, previous: null },
    });
  });
}
for (const [role, path] of Object.entries(paths)) {
  test(`${role}: old BM cookie uses English and grouped mobile sidebar`, async ({
    page,
    context,
  }) => {
    await setup(page, context, role);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('group', { name: 'Language' })).toHaveCount(0);
    await expect(
      page.getByText(
        'Other operations modules are currently available in English.',
      ),
    ).toHaveCount(0);
    const trigger = page.getByRole('button', { name: 'Menu', exact: true });
    await trigger.click();
    const sidebar = page.getByRole('dialog', { name: 'Navigation menu' });
    await expect(sidebar).toBeVisible();
    await expect
      .poll(async () => Math.round((await sidebar.boundingBox())?.x ?? -1))
      .toBe(0);
    const bounds = (await sidebar.boundingBox())!;
    expect(bounds.width).toBeLessThan(350);
    expect(Math.round(bounds.height)).toBe(844);
    expect(Math.round(bounds.y)).toBe(0);
    await expect(
      sidebar.getByRole('navigation', { name: 'All sections' }),
    ).toBeVisible();
    await expect(sidebar.getByRole('group', { name: 'Language' })).toHaveCount(
      0,
    );
    await page.keyboard.press('Tab');
    expect(
      await sidebar.evaluate((el) => el.contains(document.activeElement)),
    ).toBe(true);
    if (role === 'admin')
      await page.screenshot({
        path: 'audit-evidence/re-audit-2026-11-23/fix-sidebar-mobile.png',
      });
    await page.keyboard.press('Escape');
    await expect(sidebar).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await page.mouse.click(380, 120);
    await expect(sidebar).not.toBeVisible();
    await trigger.click();
    await page.setViewportSize({ width: 1200, height: 900 });
    await expect(sidebar).not.toBeVisible();
    expect(
      (await context.cookies()).find((c) => c.name === 'NEXT_LOCALE')?.value,
    ).toBe('bm');
  });
}

test('mobile actions stay in view and support arrow navigation and Escape', async ({
  page,
  context,
}) => {
  await setup(page, context, 'admin');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/admin/pickup-requests/request-1');
  const trigger = page.getByRole('button', { name: 'Actions', exact: true });
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  const items = menu.getByRole('menuitem');
  await expect(items.first()).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(items.nth(1)).toBeFocused();
  await page.keyboard.press('End');
  await expect(items.last()).toBeFocused();
  await page.keyboard.press('Home');
  await expect(items.first()).toBeFocused();
  await expect
    .poll(async () => (await menu.boundingBox())?.x ?? -1)
    .toBeGreaterThanOrEqual(16);
  const bounds = (await menu.boundingBox())!;
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(374);
  await page
    .locator('.page-transition-enter')
    .evaluate((el) =>
      Promise.all(
        el
          .getAnimations()
          .map((animation) => animation.finished.catch(() => {})),
      ),
    );
  await page.screenshot({
    path: 'audit-evidence/re-audit-2026-11-23/fix-actions-mobile.png',
  });
  await page.keyboard.press('Escape');
  await expect(menu).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(items.last()).toBeFocused();
});

test('receiving failures show errors instead of zeros and retry both totals and queue', async ({
  page,
  context,
}) => {
  await setup(page, context, 'receiving_officer');
  let queueFailure = true;
  let totalsFailure = true;
  await page.route('**/api/v1/pickups/?*', (route) =>
    route.fulfill(
      queueFailure
        ? { status: 503, json: { detail: 'Delivery queue unavailable' } }
        : { json: { count: 0, results: [] } },
    ),
  );
  await page.route('**/api/v1/dashboard/receiving/', (route) =>
    route.fulfill(
      totalsFailure
        ? { status: 503, json: { detail: 'Unavailable' } }
        : {
            json: {
              closed_this_month: 17,
              pickup_status_counts: { delivered: 0, closed: 17 },
            },
          },
    ),
  );
  await page.goto('/receiving');
  await expect(
    page.getByText('Could not load delivery totals.', { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText('Delivery queue unavailable', { exact: true }).first(),
  ).toBeVisible();
  const awaitingCard = page
    .getByText('Awaiting close', { exact: true })
    .first()
    .locator('..')
    .locator('..');
  await expect(awaitingCard.getByText('0', { exact: true })).toHaveCount(0);
  await page
    .locator('.page-transition-enter')
    .evaluate((el) =>
      Promise.all(
        el
          .getAnimations()
          .map((animation) => animation.finished.catch(() => {})),
      ),
    );
  await page.screenshot({
    path: 'audit-evidence/re-audit-2026-11-23/fix-receiving-error.png',
  });
  queueFailure = false;
  totalsFailure = false;
  await page
    .getByText('Delivery queue unavailable', { exact: true })
    .first()
    .locator('..')
    .getByRole('button', { name: 'Retry', exact: true })
    .click();
  await page
    .getByText('Could not load delivery totals.', { exact: true })
    .first()
    .locator('..')
    .getByRole('button', { name: 'Retry', exact: true })
    .click();
  await expect(page.getByText('17', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Delivery queue unavailable', { exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByText('Could not load delivery totals.', { exact: true }),
  ).toHaveCount(0);
});

test('protected admin status is disabled and list errors hide successful totals', async ({
  page,
  context,
}) => {
  await setup(page, context, 'admin');
  await page.route('**/api/v1/accounts/users/?*', (route) =>
    route.fulfill({
      json: {
        count: 1,
        results: [
          {
            id: 'other',
            full_name: 'Other Admin',
            email: 'other@example.test',
            role: 'admin',
            is_active: true,
            registration_status: 'verified',
          },
        ],
      },
    }),
  );
  await page.goto('/admin/users');
  await expect(
    page.getByRole('button', { name: 'Deactivate Other Admin', exact: true }),
  ).toBeDisabled();
  await page.route('**/api/v1/categories/?*', (route) =>
    route.fulfill({
      status: 503,
      json: { detail: 'Category service unavailable' },
    }),
  );
  await page.goto('/admin/categories');
  await expect(
    page.getByText('Category service unavailable', { exact: true }),
  ).toBeVisible();
  await expect(page.getByText('0 categories', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Page 1 of 1', { exact: true })).toHaveCount(0);
});

test('receiving lines keep units and distinct order actions', async ({
  page,
  context,
}) => {
  await setup(page, context, 'receiving_officer');
  await page.route('**/api/v1/pickups/?*', (route) =>
    route.fulfill({
      json: {
        count: 2,
        results: ['C1001', 'C1002'].map((code) => ({
          id: code,
          code,
          status: 'delivered',
          pickup_request: request,
          items: [
            {
              id: 'kg',
              category: { name: 'Laptop' },
              collected_quantity: '2.50',
              quantity_unit: 'kg',
            },
            {
              id: 'unit',
              category: { name: 'Phone' },
              collected_quantity: '3',
              quantity_unit: 'unit',
            },
          ],
          route: null,
          delivered_quantity: null,
        })),
      },
    }),
  );
  await page.goto('/receiving/deliveries');
  await expect(
    page.getByText('Laptop — collected 2.5 kg', { exact: true }),
  ).toHaveCount(2);
  await expect(
    page.getByText('Phone — collected 3 units', { exact: true }),
  ).toHaveCount(2);
  await expect(
    page.getByRole('button', {
      name: 'Verify and close C1001 from Test Customer',
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', {
      name: 'Verify and close C1002 from Test Customer',
      exact: true,
    }),
  ).toBeVisible();
});
