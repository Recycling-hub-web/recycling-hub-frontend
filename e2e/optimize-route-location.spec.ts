import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Optimize route needs the driver's location as the starting point. When
 * the phone refuses it, the driver is told exactly what to change
 * (browser and iPhone settings), not a vague "permission is required".
 * Uses a stop already on the QA driver's My Pickups list.
 */

test('a refused location tells the driver how to allow it', async ({
  page,
  context,
}) => {
  // No geolocation permission granted: the browser refuses, like a phone
  // whose browser has Location turned off.
  await context.clearPermissions();
  await loginAs(page, 'qaDriver');
  await page.goto('/driver/pickups');
  await page.getByRole('button', { name: 'My Pickups' }).click();

  const firstStop = page.getByRole('checkbox', { name: /^Select / }).first();
  test.skip(
    !(await firstStop.count()),
    'the QA driver has no stops on My Pickups',
  );
  await firstStop.check();
  await page.getByRole('button', { name: /Optimize Route/i }).click();
  const dialog = page.getByRole('dialog', { name: 'Optimize route' });
  const select = dialog.locator('[data-field="collection_point"] select');
  if ((await select.inputValue()) === '') {
    await select.selectOption({ index: 1 });
  }
  await dialog.getByRole('button', { name: 'Get optimized route' }).click();

  await expect(dialog.getByText(/Location is blocked/)).toBeVisible();
  await expect(dialog.getByText(/While Using the App/)).toBeVisible();
});
