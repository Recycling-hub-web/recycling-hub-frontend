import { loadEnvConfig } from '@next/env';
import { expect, test } from '@playwright/test';
import { SignJWT } from 'jose';

loadEnvConfig(process.cwd());

test('receiving pagination, filter reset and pending close guard in BM', async ({
  page,
  context,
}) => {
  const token = await new SignJWT({
    role: 'receiving_officer',
    token_type: 'access',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(
      new TextEncoder().encode(process.env.JWT_VERIFY_SECRET || 'test-only'),
    );
  await context.addCookies([
    { name: 'rh_access', value: token, url: 'http://127.0.0.1:3101' },
    { name: 'NEXT_LOCALE', value: 'bm', url: 'http://127.0.0.1:3101' },
  ]);
  const queries: URL[] = [];
  let releaseClose: (() => void) | undefined;
  const pendingClose = new Promise<void>((resolve) => {
    releaseClose = resolve;
  });
  let closeCount = 0;
  await page.route('**/api/v1/**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.includes('/accounts/me/'))
      return route.fulfill({
        json: {
          id: 'receiver',
          role: 'receiving_officer',
          full_name: 'Receiver',
          email: 'receiver@example.com',
        },
      });
    if (url.pathname.includes('/collection-points/'))
      return route.fulfill({
        json: {
          count: 1,
          results: [
            { id: 'point', name: 'Local Store', address: 'Jalan Store' },
          ],
          next: null,
          previous: null,
        },
      });
    if (url.pathname.endsWith('/close/')) {
      closeCount += 1;
      await pendingClose;
      return route.fulfill({ json: {} });
    }
    if (url.pathname.endsWith('/pickups/')) {
      queries.push(url);
      const current = Number(url.searchParams.get('page') || '1');
      return route.fulfill({
        json: {
          count: 25,
          next: null,
          previous: null,
          results: Array.from({ length: 12 }, (_, index) => ({
            id: `order-${current}-${index}`,
            code: `C${current}-${index}`,
            status: 'delivered',
            items: [],
            pickup_request: {
              full_name: `Customer ${index}`,
              phone_number: '+60123456789',
            },
            route: { collection_point: { name: 'Local Store' } },
            delivered_quantity: '2.50',
          })),
        },
      });
    }
    return route.fulfill({ json: { count: 0, results: [] } });
  });
  await page.goto('/receiving/deliveries');
  await expect(page.getByText('C1-0', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Seterusnya', exact: true }).click();
  await expect(page.getByText('C2-0', { exact: true })).toBeVisible();
  const closeButtons = page.locator('button[aria-busy]');
  await closeButtons.first().click();
  await expect(closeButtons.first()).toHaveAttribute('aria-busy', 'true');
  await expect(closeButtons.nth(1)).toBeDisabled();
  releaseClose?.();
  await expect(page.getByText('C1-0', { exact: true })).toBeVisible();
  expect(closeCount).toBe(1);
  await page.getByRole('button', { name: 'Seterusnya', exact: true }).click();
  await expect(page.getByText('C2-0', { exact: true })).toBeVisible();
  await page
    .getByRole('combobox', { name: 'Status', exact: true })
    .selectOption('');
  await expect(page.getByText('C1-0', { exact: true })).toBeVisible();
  expect(queries.at(-1)?.searchParams.get('page')).toBe('1');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: 'audit-evidence/batch8-receiving-bm-mobile.png',
    fullPage: true,
  });
});

for (const role of ['staff', 'admin', 'super-admin']) {
  test(`${role} request links support keyboard navigation in BM`, async ({
    page,
    context,
  }) => {
    const token = await new SignJWT({
      role: role.replace('-', '_'),
      token_type: 'access',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('10m')
      .sign(
        new TextEncoder().encode(process.env.JWT_VERIFY_SECRET || 'test-only'),
      );
    await context.addCookies([
      { name: 'rh_access', value: token, url: 'http://127.0.0.1:3101' },
      { name: 'NEXT_LOCALE', value: 'bm', url: 'http://127.0.0.1:3101' },
    ]);
    const request = {
      id: 'request-1',
      code: 'R1001',
      full_name: 'Approved',
      email: 'test@example.com',
      phone_number: '+60123456789',
      request_type: 'individual',
      status: 'open',
      pickup_address: '1 Jalan Test',
      requested_at: null,
      orders: [],
      photos: [],
      note: 'Paid',
    };
    await page.route('**/api/v1/**', (route) => {
      const url = new URL(route.request().url());
      if (url.pathname.includes('/accounts/me/'))
        return route.fulfill({
          json: {
            id: 'user',
            role: role.replace('-', '_'),
            full_name: 'User',
            email: 'test@example.com',
          },
        });
      if (url.pathname.endsWith('/pickup-requests/request-1/'))
        return route.fulfill({ json: request });
      if (url.pathname.endsWith('/pickup-requests/'))
        return route.fulfill({
          json: { count: 1, results: [request], next: null, previous: null },
        });
      return route.fulfill({ json: { count: 0, results: [] } });
    });
    await page.goto(`/${role}/pickup-requests`);
    const link = page.getByRole('link', {
      name: 'Lihat permintaan kutipan R1001',
      exact: true,
    });
    await expect(link).toBeVisible();
    await expect(page.getByText('Approved', { exact: true })).toBeVisible();
    await link.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(
      new RegExp(`/${role}/pickup-requests/request-1$`),
    );
    await expect(page.getByText('1 Jalan Test', { exact: true })).toBeVisible();
  });
}
