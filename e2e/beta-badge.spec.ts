import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/** The dashboard shows a "Beta" badge beside the logo — in the sidebar
 * on desktop and in the top bar on phones. */

const OUT =
  '/private/tmp/claude-501/-Users-adnanmadi-Documents-git-repos-recycling-hub/40564864-e963-4d24-b3b1-cfe8737b8766/scratchpad';

test('desktop: Beta beside the sidebar logo', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await loginAs(page, 'admin');
  await page.goto('/admin');
  const sidebarLogo = page.locator('a[href="/"]').filter({
    has: page.getByRole('img', { name: 'Recycling Hub' }),
  });
  await expect(
    sidebarLogo.getByText('Beta', { exact: true }).first(),
  ).toBeVisible();
  await page.screenshot({ path: `${OUT}/beta-1440.png` });
});

test('phone: Beta beside the top bar logo, with no sideways scroll', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await loginAs(page, 'qaDriver');
  await page.goto('/driver');
  const header = page.getByRole('link', { name: /Recycling Hub dashboard/ });
  await expect(header.getByText('Beta', { exact: true })).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  await page.screenshot({ path: `${OUT}/beta-320.png` });
});
