import { loadEnvConfig } from '@next/env';
import { expect, test } from '@playwright/test';
import { SignJWT } from 'jose';

import {
  fieldLimit,
  validatePhoneText,
  validateText,
} from '../src/components/form/validation';

loadEnvConfig(process.cwd());

test('text rules preserve Unicode and reject empty or unsafe input', () => {
  expect(validateText('علي O’Connor 陈', true, 150)).toBe('');
  expect(validateText('  \n ', true)).toBeTruthy();
  expect(validateText('', false)).toBe('');
  expect(validatePhoneText('letters')).toBeTruthy();
  expect(validatePhoneText('+60 12-345 6789')).toBe('');
  expect(validateText('note\nsecond line', true)).toBe('');
  expect(validateText('bad\u0001text', true)).toBeTruthy();
  expect(
    validateText('a'.repeat(151), true, fieldLimit('full_name')),
  ).toBeTruthy();
});

test('invalid email is blocked before a login request', async ({ page }) => {
  let submissions = 0;
  await page.route('**/api/v1/**', (route) => {
    if (
      route.request().method() === 'POST' &&
      route.request().url().includes('/auth/login/')
    )
      submissions += 1;
    return route.fulfill({
      status: 401,
      json: { detail: 'Not authenticated' },
    });
  });
  await page.goto('/login');
  await page.locator('input[name="email"]').fill('invalid-email');
  await page.locator('input[name="password"]').fill('ValidPassword123!');
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('input[name="email"]')).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  await expect(page.locator('form [role="alert"]')).toBeVisible();
  expect(submissions).toBe(0);
});

test('whitespace bank names are blocked and valid Unicode names submit', async ({
  page,
  context,
}) => {
  const token = await new SignJWT({ role: 'admin', token_type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(
      new TextEncoder().encode(process.env.JWT_VERIFY_SECRET || 'test-only'),
    );
  await context.addCookies([
    { name: 'rh_access', value: token, url: 'http://127.0.0.1:3101' },
  ]);
  let submissions = 0;
  await page.route('**/api/v1/**', (route) => {
    const url = route.request().url();
    if (url.includes('/accounts/me/'))
      return route.fulfill({
        json: {
          id: 'admin',
          full_name: 'Admin',
          email: 'admin@example.com',
          role: 'admin',
          profile_photo: null,
        },
      });
    if (url.includes('/accounts/banks/')) {
      if (route.request().method() === 'POST') {
        submissions += 1;
        return route.fulfill({
          status: 201,
          json: {
            id: 'bank',
            ...route.request().postDataJSON(),
            is_active: true,
          },
        });
      }
      return route.fulfill({ json: [] });
    }
    return route.fulfill({ json: { count: 0, results: [], unread_count: 0 } });
  });
  await page.goto('/admin/banks');
  const name = page.getByLabel('Bank name');
  await name.fill('   ');
  await page.getByRole('button', { name: 'Add bank', exact: true }).click();
  await expect(page.locator('form [role="alert"]')).toContainText('required');
  expect(submissions).toBe(0);
  await name.fill('Bank 陈');
  await page.getByRole('button', { name: 'Add bank', exact: true }).click();
  await expect.poll(() => submissions).toBe(1);
});

test('short phone is blocked and a formatted Malaysian phone submits', async ({
  page,
}) => {
  let submissions = 0;
  await page.route('**/api/v1/**', (route) => {
    if (route.request().method() === 'POST') submissions += 1;
    return route.fulfill({
      status: route.request().method() === 'POST' ? 201 : 200,
      json: { id: 'lead', count: 0, results: [] },
    });
  });
  await page.goto('/');
  const phone = page.locator('input[name="phone_local"]');
  await phone.fill('123');
  await phone
    .locator('xpath=ancestor::form')
    .locator('button[type="submit"]')
    .click();
  await expect(phone).toHaveAttribute('aria-invalid', 'true');
  expect(submissions).toBe(0);
  await phone.fill('012-345 6789');
  await phone
    .locator('xpath=ancestor::form')
    .locator('button[type="submit"]')
    .click();
  await expect.poll(() => submissions).toBe(1);
});

test('decimal amounts remain valid and negative amounts are blocked', async ({
  page,
  context,
}) => {
  const token = await new SignJWT({ role: 'driver', token_type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(
      new TextEncoder().encode(process.env.JWT_VERIFY_SECRET || 'test-only'),
    );
  await context.addCookies([
    { name: 'rh_access', value: token, url: 'http://127.0.0.1:3101' },
  ]);
  let submissions = 0;
  await page.route('**/api/v1/**', (route) => {
    if (route.request().url().includes('/accounts/me/'))
      return route.fulfill({
        json: {
          id: 'driver',
          full_name: 'Driver',
          email: 'driver@example.com',
          role: 'driver',
          profile_photo: null,
        },
      });
    if (route.request().method() === 'POST') {
      submissions += 1;
      return route.fulfill({ status: 400, json: { detail: 'Mock response' } });
    }
    return route.fulfill({ json: { count: 0, results: [] } });
  });
  await page.goto('/driver/claims/new');
  await page.locator('select[name="category"]').selectOption('tool');
  const amount = page.locator('input[name="amount_claimed"]');
  await amount.fill('-1');
  await page.locator('button[type="submit"]').click();
  await expect(amount).toHaveAttribute('aria-invalid', 'true');
  expect(submissions).toBe(0);
  await amount.fill('12.50');
  await page.locator('button[type="submit"]').click();
  await expect.poll(() => submissions).toBe(1);
});

test('modal footer submissions enforce required fields and preserve account leading zeros', async ({
  page,
  context,
}) => {
  const token = await new SignJWT({ role: 'driver', token_type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(
      new TextEncoder().encode(process.env.JWT_VERIFY_SECRET || 'test-only'),
    );
  await context.addCookies([
    { name: 'rh_access', value: token, url: 'http://127.0.0.1:3101' },
  ]);
  const details = {
    id: 'driver-profile',
    bank: null,
    bank_name: '',
    payout_method: '',
    payout_account_details: '',
    account_holder_name: '',
    bank_account_number: '',
    bank_branch: '',
    duitnow_id_type: '',
    duitnow_id: '',
    payout_ready: false,
  };
  let submitted: Record<string, string> | null = null;
  await page.route('**/api/v1/**', (route) => {
    const url = route.request().url();
    if (url.includes('/accounts/me/'))
      return route.fulfill({
        json: {
          id: 'driver',
          full_name: 'Driver',
          email: 'driver@example.com',
          role: 'driver',
          profile_photo: null,
          profile: {
            id: details.id,
            employee_id: 'DRV-1',
            joining_date: null,
            payout_details: details,
          },
        },
      });
    if (url.includes('/accounts/banks/'))
      return route.fulfill({
        json: [{ id: 'bank', name: 'Local Bank', is_active: true }],
      });
    if (route.request().method() === 'PATCH') {
      submitted = route.request().postDataJSON();
      return route.fulfill({ json: { ...details, ...submitted } });
    }
    return route.fulfill({ json: { count: 0, results: [] } });
  });
  await page.goto('/profile');
  await page.getByRole('button', { name: 'Edit payout details' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Save details' }).click();
  await expect(dialog.locator('form [role="alert"]')).toBeVisible();
  expect(submitted).toBeNull();
  await dialog.getByLabel('Payout method *').selectOption('bank_transfer');
  await dialog.getByLabel(/^Bank \*/).selectOption('bank');
  await dialog.getByLabel('Account holder name *').fill('Driver 陈');
  await dialog.getByLabel('Account number *').fill('0012345');
  await dialog.getByRole('button', { name: 'Save details' }).click();
  await expect
    .poll(() => submitted)
    .toMatchObject({ bank: 'bank', bank_account_number: '0012345' });
});
