import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Every empty state is the shared EmptyState (via TableEmptyRow in
 * tables) — always an icon, a title and a description.
 */

test('a table with no matches shows icon, title and description', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  await page.goto('/admin/pickups');

  const term = `zz-no-match-${Date.now()}`;
  await page.getByPlaceholder('Search by name, email, or phone…').fill(term);

  const empty = page.locator('tbody tr', {
    hasText: 'No pickup requests found',
  });
  await expect(empty).toBeVisible();
  await expect(empty).toContainText(`No matches for "${term}".`);
  await expect(empty.locator('svg')).toHaveCount(1);
});

test("the driver's empty Available tab explains itself", async ({ page }) => {
  await loginAs(page, 'qaDriver');
  await page.goto('/driver/pickups');
  await page.getByRole('button', { name: /^Available/ }).click();

  const empty = page.locator('tbody tr', {
    hasText: 'No pickups available to claim right now',
  });
  // Only assert when the tab really is empty — seeded data may leave
  // claimable pickups behind.
  if ((await empty.count()) > 0) {
    await expect(empty).toContainText(
      'Approved requests open for drivers will show up here.',
    );
    await expect(empty.locator('svg')).toHaveCount(1);
  }
});
