import { loadEnvConfig } from '@next/env';
import type { BrowserContext, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { SignJWT } from 'jose';

import { formatMYR } from '../src/lib/money';
import {
  loginPathFor,
  returnPathForRole,
  safeReturnPath,
} from '../src/lib/returnPath';

loadEnvConfig(process.cwd());

const user = {
  id: 'test-accounting',
  role: 'accounting',
  full_name: 'Test Accountant',
  email: 'test@example.com',
  profile_photo: null,
};
const financeRecord = {
  id: 'finance-1',
  collection_request: {
    id: 'pickup-1',
    full_name: 'Test Customer',
    items_summary: 'Laptop',
    pickup_address: 'Kuala Lumpur',
  },
  driver: null,
  price: '1250.00',
  actual_amount: null,
  payment_method: '',
  proof_of_payment: null,
  reimbursement_proof: null,
  status: 'pending',
  items: [],
  created_at: '2026-11-22T01:00:00Z',
};
const cookie = async (context: BrowserContext, role = 'accounting') => {
  const token = await new SignJWT({ role, token_type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(
      new TextEncoder().encode(process.env.JWT_VERIFY_SECRET || 'test-only'),
    );
  await context.addCookies([
    { name: 'rh_access', value: token, url: 'http://127.0.0.1:3101' },
  ]);
};
const anonymous = async (page: Page) =>
  page.route('**/api/v1/**', (route) =>
    route.fulfill({ status: 401, json: { detail: 'Not authenticated' } }),
  );
const empty = {
  count: 0,
  results: [],
  next: null,
  previous: null,
  unread_count: 0,
};

test('return destinations stay local and within the signed-in role', () => {
  for (const path of [
    'https://evil.example',
    '//evil.example',
    '/\\evil.example',
    '/%2f%2fevil.example',
    '/driver/%5cevil.example',
    '/driver/../admin/users',
    '/login?next=/driver/pickups',
  ]) {
    expect(returnPathForRole(path, 'driver')).toBe('/driver');
  }
  expect(safeReturnPath('/driver/%invalid')).toBeNull();
  expect(
    returnPathForRole(
      '/accounting/finance/record?tab=proof#receipt',
      'accounting',
    ),
  ).toBe('/accounting/finance/record?tab=proof#receipt');
  expect(returnPathForRole('/admin/users', 'super_admin')).toBe('/admin/users');
  expect(loginPathFor('/accounting/finance?status=claimed')).toBe(
    '/login?next=%2Faccounting%2Ffinance%3Fstatus%3Dclaimed',
  );
  expect(formatMYR(null)).toBe('—');
  expect(formatMYR('not-money')).toBe('—');
  expect(formatMYR('0')).toMatch(/RM\s*0\.00/);
});

for (const otp of [false, true]) {
  test(`password ${otp ? 'and OTP' : 'login'} restores a permitted deep link`, async ({
    page,
    context,
  }) => {
    await cookie(context);
    let authenticated = false;
    await page.route('**/api/v1/**', (route) => {
      const { pathname } = new URL(route.request().url());
      if (pathname.endsWith('/auth/login/')) {
        authenticated = !otp;
        return route.fulfill({
          json: otp
            ? { requires_otp: true, channel: 'email' }
            : { requires_otp: false },
        });
      }
      if (pathname.endsWith('/auth/otp/verify/')) {
        authenticated = true;
        return route.fulfill({ json: {} });
      }
      if (pathname.endsWith('/accounts/me/'))
        return route.fulfill({
          status: authenticated ? 200 : 401,
          json: authenticated ? user : { detail: 'Not authenticated' },
        });
      if (pathname.includes('/auth/'))
        return route.fulfill({
          status: 401,
          json: { detail: 'Not authenticated' },
        });
      return route.fulfill({ json: empty });
    });
    await page.goto('/login?next=%2Faccounting%2Ffinance%3Fstatus%3Dclaimed');
    await page.getByLabel('Email', { exact: false }).fill('test@example.com');
    await page.locator('input[name="password"]').fill('TestPassword123!');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    if (otp) {
      await expect(page).toHaveURL(/\/verify-otp\?next=/);
      const digits = page.locator('input[inputmode="numeric"]');
      await digits.first().fill('1');
      await page.getByRole('button', { name: 'BM', exact: true }).click();
      await expect(page.locator('html')).toHaveAttribute('lang', 'ms');
      await expect(digits.first()).toHaveValue('1');
      await page.getByRole('button', { name: 'EN', exact: true }).click();
      await expect(digits.first()).toHaveValue('1');
      if ((await digits.count()) === 1) await digits.fill('123456');
      else {
        for (let index = 0; index < 6; index += 1)
          // eslint-disable-next-line no-await-in-loop -- OTP input focus advances sequentially.
          await digits.nth(index).fill(String(index + 1));
      }
      await page.getByRole('button', { name: /Verify|Confirm/i }).click();
    }
    await expect(page).toHaveURL(/\/accounting\/finance\?status=claimed$/);
  });
}

test('finance uses server totals, sends filters, formats currency and clears no-match state', async ({
  page,
  context,
}) => {
  await cookie(context);
  const requests: URL[] = [];
  await page.route('**/api/v1/**', (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/accounts/me/'))
      return route.fulfill({ json: user });
    if (url.pathname.endsWith('/finance/')) {
      requests.push(url);
      const noMatches = url.searchParams.get('search') === 'missing';
      return route.fulfill({
        json: {
          count: noMatches ? 0 : 40,
          results: noMatches ? [] : [financeRecord],
          next: 'next',
          previous: null,
        },
      });
    }
    return route.fulfill({ json: empty });
  });
  await page.goto('/accounting/finance');
  await expect(page.getByText('Page 1 of 4', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Next', exact: true }),
  ).toBeEnabled();
  await expect(page.locator('tbody tr').first()).toContainText(
    /RM\s*1,250\.00/,
  );
  await expect(
    page.locator('tbody tr').first().locator('td').nth(4),
  ).toHaveText('—');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect.poll(() => requests.at(-1)?.searchParams.get('page')).toBe('2');
  await page
    .getByRole('searchbox', { name: 'Search finance records' })
    .fill('missing');
  await expect(
    page.getByText('No matching finance records', { exact: true }),
  ).toBeVisible();
  expect(requests.at(-1)?.searchParams.get('page')).toBe('1');
  await page
    .getByRole('button', { name: 'Clear filters', exact: true })
    .click();
  await expect(
    page.getByText('No matching finance records', { exact: true }),
  ).toHaveCount(0);
  await page.getByLabel('Created from (MYT)').fill('2026-11-01');
  await page.getByLabel('Created to (MYT)').fill('2026-11-22');
  await page
    .getByRole('combobox', { name: 'Sort finance records' })
    .selectOption('price');
  await page
    .getByRole('combobox', { name: 'Filter finance records by status' })
    .selectOption('claimed');
  await expect
    .poll(() => {
      const query = requests.at(-1)?.searchParams;
      return {
        from: query?.get('created_from'),
        to: query?.get('created_to'),
        order: query?.get('ordering'),
        status: query?.get('status'),
      };
    })
    .toEqual({
      from: '2026-11-01',
      to: '2026-11-22',
      order: 'price',
      status: 'claimed',
    });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

for (const locale of ['en', 'bm']) {
  test(`accepted callback retains a persistent receipt and localized controls (${locale})`, async ({
    page,
  }) => {
    let submits = 0;
    await page.route('**/api/v1/**', (route) => {
      if (
        route.request().method() === 'POST' &&
        route.request().url().includes('/pickups/quick/')
      ) {
        submits += 1;
        return route.fulfill({
          status: 201,
          json: { id: 'accepted-callback-123' },
        });
      }
      return route.fulfill({
        status: 401,
        json: { detail: 'Not authenticated' },
      });
    });
    await page.goto(`${locale === 'bm' ? '/bm' : ''}/request-pickup`);
    await page
      .getByRole('button', {
        name:
          locale === 'bm'
            ? /Minta Panggilan Balik Tinggalkan/
            : /Request a Callback Leave/,
      })
      .click();
    await expect(
      page.getByRole('combobox', {
        name: locale === 'bm' ? 'Kod panggilan negara' : 'Country calling code',
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', {
        name: locale === 'bm' ? 'Individu' : 'Individual',
        exact: true,
      }),
    ).toBeVisible();
    await page
      .getByRole('textbox', { name: locale === 'bm' ? /^Telefon/ : /^Phone/ })
      .fill('123456789');
    await page.locator('form:visible button[type="submit"]').click();
    await expect(
      page.getByText('accepted-callback-123', { exact: true }),
    ).toBeVisible();
    await expect(page.getByText('•••• 6789', { exact: true })).toBeVisible();
    await expect(page.locator('form:visible')).toHaveCount(0);
    expect(submits).toBe(1);
    await page
      .getByRole('button', {
        name: locale === 'bm' ? 'Buat permintaan lain' : 'Make another request',
      })
      .click();
    await expect(
      page.getByRole('textbox', {
        name: locale === 'bm' ? /^Telefon/ : /^Phone/,
      }),
    ).toHaveValue('');
  });
}

test('step validation uses the same localized error on blur and Continue', async ({
  page,
}) => {
  await anonymous(page);
  await page.goto('/request-pickup');
  await page.getByRole('button', { name: /Business \/ Bulk Get/ }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  const name = page.getByRole('textbox', { name: /^Full name/ });
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(
    page.getByRole('button', {
      name: 'Please enter your full name.',
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText('Full name: This field is required.', { exact: true }),
  ).toHaveCount(0);
  await name.fill('Example');
  const email = page.getByRole('textbox', { name: /^Email/ });
  await email.fill('invalid');
  await email.press('Tab');
  const before = await email.evaluate(
    (element) =>
      document.getElementById(element.getAttribute('aria-describedby') || '')
        ?.textContent,
  );
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  const after = await email.evaluate(
    (element) =>
      document.getElementById(element.getAttribute('aria-describedby') || '')
        ?.textContent,
  );
  expect(before).toBe(after);
});

test('status support is visible in navigation, reduced motion preserves drafts and old prototype is unpublished', async ({
  page,
}) => {
  await anonymous(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/request-pickup');
  await expect(
    page
      .getByRole('navigation')
      .first()
      .getByRole('link', { name: 'Collection status & certificates' }),
  ).toBeVisible();
  await expect(page.locator('h1')).toHaveCSS('opacity', '1');
  await expect(page.locator('.animate-glow-pulse')).toHaveCSS(
    'animation-name',
    'none',
  );
  await expect(page.locator('html')).not.toHaveClass(/lenis-smooth/);
  await page.getByRole('button', { name: /Request a Callback Leave/ }).click();
  const phone = page.getByRole('textbox', { name: /^Phone/ });
  await phone.fill('123456789');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(phone).toHaveValue('123456789');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(phone).toHaveValue('123456789');
  for (const width of [390, 1200, 1440]) {
    // eslint-disable-next-line no-await-in-loop -- Check responsive widths in sequence.
    await page.setViewportSize({ width, height: 900 });
    expect(
      // eslint-disable-next-line no-await-in-loop -- Inspect the viewport just selected.
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  const response = await page.goto('/dashboard-preview');
  expect(response?.status()).toBe(404);
});

test('business submission keeps an accepted reference and requires an explicit new request', async ({
  page,
}) => {
  let submissions = 0;
  await page.route('https://api.geoapify.com/**', (route) =>
    route.fulfill({ json: { features: [] } }),
  );
  await page.route('**/api/v1/**', (route) => {
    const { pathname } = new URL(route.request().url());
    if (pathname.endsWith('/pickups/photo-upload-url/'))
      return route.fulfill({
        json: {
          uploads: [
            {
              file_key: 'test-photo',
              public_url: null,
              upload_url: 'http://127.0.0.1:3101/audit-upload',
              method: 'PUT',
              headers: { 'Content-Type': 'image/png' },
            },
          ],
        },
      });
    if (
      pathname.endsWith('/pickup-requests/') &&
      route.request().method() === 'POST'
    ) {
      submissions += 1;
      return route.fulfill({
        status: 201,
        json: { id: 'accepted-business-456', status: 'open' },
      });
    }
    return route.fulfill({
      status: 401,
      json: { detail: 'Not authenticated' },
    });
  });
  await page.route('**/audit-upload', (route) =>
    route.fulfill({ status: 200, body: '' }),
  );
  await page.goto('/request-pickup');
  await page.getByRole('button', { name: /Business \/ Bulk Get/ }).click();
  await page
    .getByRole('textbox', { name: /^Full name/ })
    .fill('Example Business');
  await page
    .getByRole('textbox', { name: /^Email/ })
    .fill('example@example.com');
  await page.getByRole('textbox', { name: /^Phone/ }).fill('123456789');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page
    .getByRole('combobox', { name: /^Pickup address/ })
    .fill('Kuala Lumpur');
  await page
    .locator(
      'input[type="file"]:visible, [data-field="photos"] input[type="file"]',
    )
    .first()
    .setInputFiles({
      name: 'example.png',
      mimeType: 'image/png',
      buffer: Buffer.from('test fixture'),
    });
  await expect(
    page.getByRole('button', { name: 'Remove photo 1' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page
    .getByRole('button', { name: 'Submit Request', exact: true })
    .click();
  await expect(
    page.getByText('accepted-business-456', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Your pickup is not booked yet.', { exact: false }),
  ).toBeVisible();
  await expect(page.locator('form:visible')).toHaveCount(0);
  expect(submissions).toBe(1);
  await page.getByRole('button', { name: 'Make another request' }).click();
  await expect(page.getByRole('textbox', { name: /^Full name/ })).toHaveValue(
    '',
  );
});

test('finance recovers when the current page disappears after a list change', async ({
  page,
  context,
}) => {
  await cookie(context);
  let removed = false;
  const pages: string[] = [];
  await page.route('**/api/v1/**', (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/accounts/me/'))
      return route.fulfill({ json: user });
    if (url.pathname.endsWith('/finance/')) {
      const currentPage = url.searchParams.get('page') || '1';
      pages.push(currentPage);
      if (currentPage === '2') {
        removed = true;
        return route.fulfill({
          status: 404,
          json: { detail: 'Invalid page.' },
        });
      }
      return route.fulfill({
        json: {
          count: removed ? 12 : 13,
          results: [financeRecord],
          next: removed ? null : 'next',
          previous: null,
        },
      });
    }
    return route.fulfill({ json: empty });
  });
  await page.goto('/accounting/finance');
  await expect(page.getByText('Page 1 of 2', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByText('Page 1 of 1', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'View finance record for Test Customer' }),
  ).toBeVisible();
  await expect(page.getByText('Invalid page.', { exact: true })).toHaveCount(0);
  expect(pages.slice(-2)).toEqual(['2', '1']);
});
