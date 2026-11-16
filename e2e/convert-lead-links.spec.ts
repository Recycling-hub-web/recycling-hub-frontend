import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/** Follow up on lead: Back and Cancel return to the Quick Leads tab
 * (there's no separate orders list page to go back to). */

test('Cancel on Follow up on lead returns to Quick Leads', async ({ page }) => {
  await loginAs(page, 'admin');
  const created = await page.request.post('/api/v1/pickups/quick/', {
    data: { phone_number: `+6011${String(Date.now()).slice(-8)}` },
  });
  expect(created.ok(), await created.text()).toBe(true);
  const lead = await created.json();

  await page.goto(`/admin/pickups/create?leadId=${lead.id}`);
  await expect(
    page.getByRole('link', { name: 'Back to quick leads' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Cancel' }).click();
  await expect(page).toHaveURL(/\/admin\/pickup-requests\?tab=quick$/);
});
