import { expect, test } from '@playwright/test';

import { ACCOUNTS, loginAs } from './helpers/auth';

/**
 * /profile/edit — a user changes their own details (PATCH /accounts/me/)
 * and starts an email change (POST /accounts/me/email/). The whole email
 * flow — the code, the switch, the notice to the old address — is
 * covered by the backend tests (TestMyEmailChange); here we check the
 * screens. Uses the demo admin account and puts back what it changes.
 */

test('edits own name and WhatsApp setting, and they show on /profile', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const before = await (await page.request.get('/api/v1/accounts/me/')).json();

  try {
    await page.goto('/profile/edit');
    const name = `${before.full_name} E2E`;
    await page.locator('[data-field="full_name"] input').fill(name);
    const whatsapp = page.getByRole('switch', {
      name: 'Contact me on WhatsApp',
    });
    await whatsapp.click();
    await page.getByRole('button', { name: 'Save changes' }).click();

    await expect(page).toHaveURL(/\/profile$/);
    await expect(page.getByText(name).first()).toBeVisible();
    await expect(page.getByText('Contact on WhatsApp')).toBeVisible();
    const after = await (await page.request.get('/api/v1/accounts/me/')).json();
    expect(after.full_name).toBe(name);
    expect(after.whatsapp_enabled).toBe(!before.whatsapp_enabled);
  } finally {
    await page.request.patch('/api/v1/accounts/me/', {
      data: {
        full_name: before.full_name,
        whatsapp_enabled: before.whatsapp_enabled,
      },
    });
  }
});

test('the profile Actions menu offers Change email', async ({ page }) => {
  await loginAs(page, 'admin');
  await page.goto('/profile');
  await page.getByRole('button', { name: 'Actions', exact: true }).click();
  await expect(
    page.getByRole('menuitem', { name: 'Change email' }),
  ).toBeVisible();
});

test('changing email asks for the password, then a code, and rejects a wrong one', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  await page.goto('/profile/edit');
  await page.getByRole('button', { name: 'Change email' }).click();
  const dialog = page.getByRole('dialog');

  // Wrong password: stays on step 1 with the error under the field.
  await dialog
    .locator('[data-field="new_email"] input')
    .fill(`e2e-new-${Date.now()}@example.com`);
  await dialog
    .locator('[data-field="current_password"] input')
    .fill('not-my-password');
  await dialog.getByRole('button', { name: 'Send code' }).click();
  await expect(dialog.getByText('Your password is incorrect.')).toBeVisible();

  // Right password: on to the code step.
  await dialog
    .locator('[data-field="current_password"] input')
    .fill(ACCOUNTS.admin.password);
  await dialog.getByRole('button', { name: 'Send code' }).click();
  await expect(
    dialog.getByText(/Enter the 6-digit code we sent/),
  ).toBeVisible();

  // A wrong code is refused and the email stays the same.
  await dialog.locator('[data-field="code"] input').first().click();
  await page.keyboard.type('000000');
  await dialog.getByRole('button', { name: 'Change email' }).click();
  await expect(dialog.getByText(/Invalid code|expired/i)).toBeVisible();
  const me = await (await page.request.get('/api/v1/accounts/me/')).json();
  expect(me.email).toBe(ACCOUNTS.admin.email);
});
