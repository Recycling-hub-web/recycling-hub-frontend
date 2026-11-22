import { loadEnvConfig } from '@next/env';
import type { BrowserContext, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { SignJWT } from 'jose';

loadEnvConfig(process.cwd());

const financeRecord = {
  id: 'finance-1',
  collection_request: {
    id: 'pickup-1',
    full_name: 'Audit Customer',
    items_summary: 'Laptop',
    pickup_address: 'Kuala Lumpur',
  },
  driver: {
    id: 'driver-1',
    full_name: 'Audit Driver',
    payout_ready: true,
    payout_method: 'duitnow',
    payout_account_details: 'Test account',
  },
  price: '25.00',
  actual_amount: '25.00',
  payment_method: 'duitnow',
  proof_of_payment: { file_key: 'test-proof', public_url: null },
  reimbursement_proof: null,
  status: 'claimed',
  items: [],
  created_at: '2026-11-22T01:00:00Z',
};

const signedIn = async (context: BrowserContext, role: string) => {
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

// Every API request is intercepted: no login, upload or payment reaches real services.
const mockApi = async (
  page: Page,
  role?: string,
  failingStats?: { value: boolean },
) => {
  await page.route('**/api/v1/**', (route) => {
    const { pathname } = new URL(route.request().url());
    if (!role)
      return route.fulfill({
        status: 401,
        json: { detail: 'Not authenticated' },
      });
    if (pathname.endsWith('/accounts/me/'))
      return route.fulfill({
        json: {
          id: 'audit-user',
          role,
          full_name: 'Audit User',
          email: 'audit@example.com',
          profile_photo: null,
        },
      });
    if (pathname.endsWith('/dashboard/accounting/')) {
      return failingStats?.value
        ? route.fulfill({
            status: 503,
            json: { detail: 'Temporarily unavailable' },
          })
        : route.fulfill({
            json: {
              unverified_records: 3,
              amount_pending: '75.00',
              amount_reimbursed_this_month: '50.00',
              finance_status_counts: {
                pending: 0,
                claimed: 3,
                verified: 0,
                reimbursed: 1,
              },
            },
          });
    }
    if (pathname.endsWith('/dashboard/driver/')) {
      return failingStats?.value
        ? route.fulfill({
            status: 503,
            json: { detail: 'Temporarily unavailable' },
          })
        : route.fulfill({
            json: {
              open_route_stops: 17,
              pickup_status_counts: {
                pending: 0,
                scheduled: 17,
                collected: 0,
                delivered: 0,
                closed: 0,
              },
              finance_status_counts: {
                pending: 0,
                claimed: 1,
                verified: 0,
                reimbursed: 0,
              },
            },
          });
    }
    if (pathname.endsWith('/volume/') || pathname.endsWith('/pickup-volume/'))
      return route.fulfill({
        json: {
          range: '30d',
          from: '2026-10-23',
          to: '2026-11-22',
          interval: 'day',
          total: 0,
          points: [],
        },
      });
    if (pathname.endsWith('/finance/'))
      return route.fulfill({
        json: {
          count: 1,
          results: [financeRecord],
          next: null,
          previous: null,
        },
      });
    if (pathname.endsWith('/collection-points/test-point/'))
      return route.fulfill({
        json: {
          id: 'test-point',
          name: 'Test point',
          address: 'Kuala Lumpur',
          city: 'Kuala Lumpur',
          postcode: '50000',
          is_active: true,
        },
      });
    return route.fulfill({
      json: {
        count: 0,
        results: [],
        next: null,
        unread_count: 0,
        total: '0.00',
      },
    });
  });
};

for (const locale of ['en', 'bm']) {
  test(`certificate request offers an honest editable handoff (${locale})`, async ({
    page,
  }) => {
    await mockApi(page);
    await page.addInitScript(() => {
      window.open = (url) => {
        sessionStorage.setItem('draft-url', String(url));
        return null;
      };
    });
    await page.goto(`${locale === 'bm' ? '/bm' : ''}/track-trace`);
    await page.locator('#fullName').fill('Audit Example');
    await page.locator('#email').fill('example@example.com');
    await page.locator('#reference').fill('REF-123');
    await page.locator('form button[type="submit"]').click();
    await expect(
      page.getByRole('status').filter({
        hasText:
          locale === 'en'
            ? 'Nothing has been submitted'
            : 'Tiada permintaan dihantar',
      }),
    ).toBeVisible();
    await expect(page.locator('#fullName')).toBeEditable();
    expect(
      await page.evaluate(() => sessionStorage.getItem('draft-url')),
    ).toContain('wa.me/');
    const email = page.getByRole('link', {
      name: locale === 'en' ? 'Continue by email' : 'Teruskan melalui e-mel',
    });
    await expect(email).toHaveAttribute('href', /mailto:.*REF-123/);
    await page.locator('#reference').fill('REF-456');
    await expect(email).toHaveAttribute('href', /REF-456/);
    await expect(
      page.getByLabel(
        locale === 'en' ? 'Message to send' : 'Mesej untuk dihantar',
      ),
    ).toHaveValue(/REF-456/);
    await expect(
      page.getByRole('link', { name: 'Chat with us on WhatsApp' }),
    ).toHaveCount(0);
  });
}

test('quote handoff retains fields and has a fallback when a new window cannot open', async ({
  page,
}) => {
  await mockApi(page);
  await page.addInitScript(() => {
    window.open = () => null;
  });
  await page.goto('/request-quote');
  await page.locator('#fullName').fill('Audit Example');
  await page.locator('#email').fill('example@example.com');
  await page.locator('#details').fill('Forty laptops');
  await page.locator('form button[type="submit"]').click();
  await expect(page).toHaveURL(/\/request-quote$/);
  await expect(
    page.getByRole('status').filter({ hasText: 'Nothing has been submitted' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Continue by email' }),
  ).toHaveAttribute('href', /Forty%20laptops/);
  await expect(page.locator('#details')).toHaveValue('Forty laptops');
});

test('mobile pickup choice preserves both drafts and clears floating contact controls', async ({
  page,
}) => {
  await mockApi(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/request-pickup');
  await page.getByRole('button', { name: /Request a Callback Leave/ }).click();
  await page.getByRole('textbox', { name: /^Phone/ }).fill('123456789');
  await page.getByRole('button', { name: 'Change request type' }).click();
  await page.getByRole('button', { name: /Business \/ Bulk Get/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Request a business collection.',
  );
  await expect(
    page.getByText('FREE DOORSTEP COLLECTION', { exact: true }),
  ).toHaveCount(0);
  await page.getByLabel('Full name').fill('Business Draft');
  await page.getByRole('button', { name: 'Change request type' }).click();
  await page.getByRole('button', { name: /Request a Callback Leave/ }).click();
  await expect(page.getByRole('textbox', { name: /^Phone/ })).toHaveValue(
    '123456789',
  );
  await expect(
    page.getByRole('link', { name: 'Chat with us on WhatsApp' }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Change request type' }).click();
  await page.getByRole('button', { name: /Business \/ Bulk Get/ }).click();
  await expect(page.getByLabel('Full name')).toHaveValue('Business Draft');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test('accounting error does not masquerade as zero and recovers on retry', async ({
  page,
  context,
}) => {
  await signedIn(context, 'accounting');
  const failing = { value: true };
  await mockApi(page, 'accounting', failing);
  await page.goto('/accounting');
  await expect(page.getByText('Could not load accounting totals.')).toHaveCount(
    4,
  );
  await expect(page.getByText('RM0.00', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('status', { name: 'Loading chart' })).toHaveCount(
    0,
  );
  failing.value = false;
  await page
    .getByRole('button', { name: 'Retry', exact: true })
    .first()
    .click();
  await expect(page.getByText('RM75.00', { exact: true })).toBeVisible();
  await expect(page.getByText('Could not load accounting totals.')).toHaveCount(
    0,
  );
});

test('driver status error can recover and route count uses the server aggregate', async ({
  page,
  context,
}) => {
  await signedIn(context, 'driver');
  const failing = { value: true };
  await mockApi(page, 'driver', failing);
  await page.goto('/driver');
  await expect(page.getByText('Could not load status totals.')).toHaveCount(3);
  await expect(page.getByRole('status', { name: 'Loading chart' })).toHaveCount(
    0,
  );
  failing.value = false;
  await page
    .getByRole('button', { name: 'Retry', exact: true })
    .first()
    .click();
  // List endpoint returns no rows: the authoritative route aggregate still has 17 stops.
  await expect(page.getByText('17 stops', { exact: true })).toBeVisible();
  await expect(page.getByText('Could not load status totals.')).toHaveCount(0);
});

test('finance details are a keyboard link and proof picker is keyboard accessible', async ({
  page,
  context,
}) => {
  await signedIn(context, 'accounting');
  await mockApi(page, 'accounting');
  await page.goto('/accounting/finance');
  const details = page.getByRole('link', {
    name: 'View finance record for Audit Customer',
  });
  await expect(details).toHaveAttribute(
    'href',
    '/accounting/finance/finance-1',
  );
  await details.focus();
  await expect(details).toBeFocused();
  await page
    .getByRole('button', { name: 'Verify and reimburse Audit Customer' })
    .click();
  const dialog = page.getByRole('dialog');
  const picker = dialog.getByLabel('Reimbursement proof', { exact: true });
  await picker.focus();
  await expect(picker).toBeFocused();
  const chooser = page.waitForEvent('filechooser');
  await picker.press('Space');
  const fileChooser = await chooser;
  // Invalid type exercises local validation without uploading anything.
  await fileChooser.setFiles({
    name: 'invalid.exe',
    mimeType: 'application/x-msdownload',
    buffer: Buffer.from('test'),
  });
  await expect(dialog.getByRole('alert')).toContainText('Invalid file type');
  await expect(picker).toHaveAttribute('aria-invalid', 'true');
});

test('collection point switch supports keyboard and has a stable setting name', async ({
  page,
  context,
}) => {
  await signedIn(context, 'admin');
  await mockApi(page, 'admin');
  await page.goto('/admin/collection-points/test-point/edit');
  const toggle = page.getByRole('switch', { name: 'Active', exact: true });
  await expect(toggle).toBeChecked();
  await toggle.focus();
  await toggle.press('Space');
  await expect(toggle).not.toBeChecked();
  await expect(toggle).toHaveAccessibleName('Active');
});

test('password visibility has a full tap target and keyboard operation', async ({
  page,
}) => {
  await mockApi(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/login');
  const eye = page.getByRole('button', { name: 'Show password' });
  const box = await eye.boundingBox();
  expect(Math.round(box?.width ?? 0)).toBeGreaterThanOrEqual(44);
  expect(Math.round(box?.height ?? 0)).toBeGreaterThanOrEqual(44);
  await eye.focus();
  await eye.press('Space');
  await expect(
    page.getByRole('button', { name: 'Hide password' }),
  ).toBeFocused();
  await expect(page.locator('input[name="password"]')).toHaveAttribute(
    'type',
    'text',
  );
});

test('business field errors announce the specific correction and clear after editing', async ({
  page,
}) => {
  await mockApi(page);
  await page.goto('/request-pickup');
  await page.getByRole('button', { name: /Business \/ Bulk Get/ }).click();
  const email = page.getByRole('textbox', { name: /^Email/ });
  await email.fill('invalid');
  await email.press('Tab');
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  const descriptionId = await email.getAttribute('aria-describedby');
  expect(descriptionId).toBeTruthy();
  expect(
    await email.evaluate(
      (element) =>
        document.getElementById(element.getAttribute('aria-describedby') || '')
          ?.textContent,
    ),
  ).toMatch(/valid email/i);
  await email.fill('valid@example.com');
  await expect(email).toHaveAttribute('aria-invalid', 'false');
  await expect(email).not.toHaveAttribute('aria-describedby');
});
