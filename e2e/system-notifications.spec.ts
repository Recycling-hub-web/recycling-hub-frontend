import { loadEnvConfig } from '@next/env';
import { expect, test } from '@playwright/test';
import { SignJWT } from 'jose';

import { notificationLink } from '../src/components/features/notifications/utils/notificationLinks';
import { ROLE_HOME } from '../src/types/auth';

loadEnvConfig(process.cwd());

test('notification links preserve permitted pages and reject unsafe or stale role links', () => {
  const item = {
    id: 'item',
    title: 'Changed',
    body: '',
    is_read: false,
    created_at: '2026-11-12T01:00:00Z',
    link: '/admin/users/user',
  };
  expect(notificationLink(item, 'super_admin')).toBe('/admin/users/user');
  expect(
    notificationLink({ ...item, link: '/admin/banks' }, 'super_admin'),
  ).toBe('/super-admin/banks');
  expect(
    notificationLink({ ...item, link: '/driver/pickups/order' }, 'accounting'),
  ).toBe('/accounting/notifications');
  expect(
    notificationLink({ ...item, link: 'https://example.com' }, 'admin'),
  ).toBe('');
  expect(notificationLink({ ...item, link: '//example.com' }, 'admin')).toBe(
    '',
  );
  expect(notificationLink({ ...item, link: '/profile' }, 'driver')).toBe(
    '/profile',
  );
});

for (const role of [
  'admin',
  'super_admin',
  'staff',
  'driver',
  'receiving_officer',
  'accounting',
] as const) {
  test(`${role} can filter their inbox by module and unread state`, async ({
    page,
    context,
  }) => {
    const token = await new SignJWT({ role, token_type: 'access' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('10m')
      .sign(
        new TextEncoder().encode(process.env.JWT_VERIFY_SECRET || 'test-only'),
      );
    await context.addCookies([
      { name: 'rh_access', value: token, url: 'http://127.0.0.1:3101' },
    ]);
    const queries: URLSearchParams[] = [];
    const records = [
      {
        id: 'account',
        title: 'Bank directory updated',
        body: 'Review the current details.',
        module: 'accounts',
        action: 'updated',
        is_read: false,
        created_at: '2026-11-12T01:00:00Z',
        link: '/profile',
      },
      {
        id: 'pickup',
        title: 'Pickup time confirmed',
        body: 'Check the pickup time.',
        module: 'pickups',
        action: 'schedule_confirmed',
        is_read: false,
        created_at: '2026-11-12T01:00:00Z',
        link: '',
      },
    ];
    await page.route('**/api/v1/**', (route) => {
      const url = new URL(route.request().url());
      if (url.pathname.includes('/accounts/me/'))
        return route.fulfill({
          json: {
            id: role,
            role,
            full_name: 'Test User',
            email: 'user@example.com',
            profile_photo: null,
          },
        });
      if (url.pathname.includes('/unread-count/'))
        return route.fulfill({ json: { count: 2 } });
      if (url.pathname.includes('/audit/notifications/')) {
        queries.push(url.searchParams);
        const filtered = records.filter(
          (record) =>
            !url.searchParams.get('module') ||
            record.module === url.searchParams.get('module'),
        );
        return route.fulfill({
          json: {
            count: filtered.length,
            results: filtered,
            next: null,
            previous: null,
          },
        });
      }
      return route.fulfill({ json: { count: 0, results: [] } });
    });
    const base = ROLE_HOME[role];
    await page.goto(`${base}/notifications`);
    await expect(
      page.getByRole('heading', { name: 'Notifications', exact: true }),
    ).toBeVisible();
    await page
      .getByRole('combobox', { name: 'Notification module' })
      .selectOption('accounts');
    await expect(
      page
        .getByRole('main')
        .getByRole('button')
        .filter({ hasText: 'Bank directory updated' }),
    ).toBeVisible();
    await expect(
      page
        .getByRole('main')
        .getByRole('button')
        .filter({ hasText: 'Pickup time confirmed' }),
    ).toHaveCount(0);
    await page.getByRole('button', { name: /^Unread/ }).click();
    await expect
      .poll(() =>
        queries.some(
          (query) =>
            query.get('module') === 'accounts' &&
            query.get('is_read') === 'false',
        ),
      )
      .toBe(true);
  });
}
