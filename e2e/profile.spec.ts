import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { ACCOUNTS, loginAs } from './helpers/auth';

/**
 * /profile — one page for every role (ProfileView, features/profile),
 * built from GET/PATCH /accounts/me/ and POST /auth/password-change/.
 * Always the signed-in user's own account: the endpoint has no user id
 * in it (UserProfileView.get_object returns request.user).
 *
 * Tests that change real data put it back afterwards through the same
 * API, since these are the standing QA accounts.
 */

type AccountKey = keyof typeof ACCOUNTS;

const ROLES: { account: AccountKey; roleLabel: string; work: boolean }[] = [
  { account: 'admin', roleLabel: 'Admin', work: false },
  { account: 'qaSuperAdmin', roleLabel: 'Super Admin', work: false },
  { account: 'qaStaff', roleLabel: 'Staff', work: true },
  { account: 'qaDriver', roleLabel: 'Driver', work: true },
  {
    account: 'qaReceivingOfficer',
    roleLabel: 'Receiving Officer',
    work: true,
  },
  { account: 'qaAccounting', roleLabel: 'Accounting', work: true },
];

const sidebar = (page: Page) => page.locator('nav').filter({ hasText: 'Menu' });

const getMe = async (page: Page) => {
  const res = await page.request.get('/api/v1/accounts/me/');
  expect(res.ok()).toBe(true);
  return res.json() as Promise<{
    email: string;
    full_name: string;
    phone_number: string | null;
  }>;
};

test.describe('every role sees its own profile', () => {
  for (const { account, roleLabel, work } of ROLES) {
    test(`${roleLabel}`, async ({ page }) => {
      await loginAs(page, account);
      await page.goto('/profile');

      await expect(
        page.getByRole('heading', { name: 'My Profile' }),
      ).toBeVisible();
      // Own email only — never anyone else's.
      await expect(
        page.getByText(ACCOUNTS[account].email).first(),
      ).toBeVisible();
      await expect(page.getByText('Role', { exact: true })).toBeVisible();
      await expect(page.getByText('Work details', { exact: true })).toHaveCount(
        work ? 1 : 0,
      );
      // The view page is read-only — no form fields at all.
      await expect(page.getByRole('textbox')).toHaveCount(0);
      // Actions menu holds Edit profile + Change password.
      await page.getByRole('button', { name: 'Actions' }).click();
      await expect(
        page.getByRole('menuitem', { name: 'Edit profile' }),
      ).toBeVisible();
      await expect(
        page.getByRole('menuitem', { name: 'Change password' }),
      ).toBeVisible();
    });
  }
});

test('opens from the navbar account menu', async ({ page }) => {
  await loginAs(page, 'qaStaff');
  await page.goto('/staff');
  await page.getByRole('button', { name: 'Account menu' }).click();
  await page.getByRole('link', { name: 'My Profile' }).first().click();
  await expect(page).toHaveURL(/\/profile$/);
});

test('opens from the avatar in the sidebar, keeping the role menu', async ({
  page,
}) => {
  await loginAs(page, 'qaDriver');
  await page.goto('/driver');
  await sidebar(page)
    .getByRole('link', { name: /view profile/ })
    .click();

  await expect(page).toHaveURL(/\/profile$/);
  await expect(
    sidebar(page).getByRole('link', { name: /view profile/ }),
  ).toHaveAttribute('aria-current', 'page');
  // Still the driver's own menu.
  await expect(
    sidebar(page).getByRole('link', { name: 'Drop Off to Store' }),
  ).toBeVisible();
});

test('Edit profile opens the edit page; Cancel goes back', async ({ page }) => {
  await loginAs(page, 'qaAccounting');
  await page.goto('/profile');
  await page.getByRole('button', { name: 'Actions' }).click();
  await page.getByRole('menuitem', { name: 'Edit profile' }).click();

  await expect(page).toHaveURL(/\/profile\/edit$/);
  await expect(
    page.getByRole('heading', { name: 'Edit profile' }),
  ).toBeVisible();
  // Email and role are not editable — only name and phone inputs.
  await expect(page.getByRole('textbox')).toHaveCount(2);
  // The sidebar still marks the profile as the current page.
  await expect(
    sidebar(page).getByRole('link', { name: /view profile/ }),
  ).toHaveAttribute('aria-current', 'page');

  await page.getByRole('link', { name: 'Cancel' }).click();
  await expect(page).toHaveURL(/\/profile$/);
});

test('edits name and phone, returns to the view page, then restores them', async ({
  page,
}) => {
  await loginAs(page, 'qaAccounting');
  const original = await getMe(page);
  const newName = `E2E Profile ${Date.now()}`;

  try {
    await page.goto('/profile/edit');
    const save = page.getByRole('button', { name: 'Save changes' });
    await expect(save).toBeDisabled();

    await page.getByPlaceholder('e.g. Fatima Ali').fill(newName);
    await page.getByPlaceholder('12-345 6789').fill('123456789');
    await expect(save).toBeEnabled();
    await save.click();

    await expect(page.getByText('Profile updated')).toBeVisible();
    await expect(page).toHaveURL(/\/profile$/);
    await expect(page.getByText('+60123456789')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Account menu' }),
    ).toContainText(newName);

    const saved = await getMe(page);
    expect(saved.full_name).toBe(newName);
    expect(saved.phone_number).toBe('+60123456789');
  } finally {
    const res = await page.request.patch('/api/v1/accounts/me/', {
      data: {
        full_name: original.full_name,
        phone_number: original.phone_number ?? '',
      },
    });
    expect(res.ok()).toBe(true);
  }
});

test('rejects an empty name and an invalid phone', async ({ page }) => {
  await loginAs(page, 'qaAccounting');
  await page.goto('/profile/edit');

  await page.getByPlaceholder('e.g. Fatima Ali').fill('   ');
  await page.getByPlaceholder('12-345 6789').fill('12');
  await page.getByRole('button', { name: 'Save changes' }).click();

  await expect(page.getByText('Full name is required.')).toBeVisible();
  await expect(
    page.getByText('Enter a valid phone number (7–15 digits).'),
  ).toBeVisible();
});

test.describe('change password', () => {
  const openModal = async (page: Page) => {
    await page.goto('/profile');
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Change password' }).click();
    return page.getByRole('dialog');
  };

  test('validates, rejects a wrong current password', async ({ page }) => {
    await loginAs(page, 'qaReceivingOfficer');
    const dialog = await openModal(page);
    const fields = dialog.locator('input[type="password"]');

    await fields.nth(0).fill('not-my-password');
    await fields.nth(1).fill('short');
    await fields.nth(2).fill('different');
    await dialog.getByRole('button', { name: 'Update password' }).click();
    await expect(
      dialog.getByText('Must be at least 8 characters.'),
    ).toBeVisible();
    await expect(dialog.getByText('Passwords do not match.')).toBeVisible();

    await fields.nth(1).fill('NewPassword123!');
    await fields.nth(2).fill('NewPassword123!');
    await dialog.getByRole('button', { name: 'Update password' }).click();
    await expect(
      dialog.getByText('Your current password is incorrect.'),
    ).toBeVisible();
  });

  test('changes the password for real, then changes it back', async ({
    page,
    request,
  }) => {
    const { email, password } = ACCOUNTS.qaReceivingOfficer;
    const temporary = 'TempPassword123!';
    await loginAs(page, 'qaReceivingOfficer');
    const dialog = await openModal(page);
    const fields = dialog.locator('input[type="password"]');

    let changed = false;
    try {
      await fields.nth(0).fill(password);
      await fields.nth(1).fill(temporary);
      await fields.nth(2).fill(temporary);
      await dialog.getByRole('button', { name: 'Update password' }).click();
      await expect(page.getByText('Password changed')).toBeVisible();
      changed = true;

      // The new password really works for signing in.
      const login = await request.post('/api/v1/auth/login/', {
        data: { email, password: temporary },
      });
      expect(login.ok()).toBe(true);
    } finally {
      if (changed) {
        const restore = await page.request.post(
          '/api/v1/auth/password-change/',
          { data: { old_password: temporary, new_password: password } },
        );
        expect(restore.ok()).toBe(true);
      }
    }
  });
});

test('signed-out visitors are sent to login', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('/profile');
  await expect(page).toHaveURL(/\/login/);
  await context.close();
});
