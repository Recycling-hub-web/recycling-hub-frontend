/* eslint-disable no-await-in-loop, no-restricted-syntax */
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Overview pages and the phone shell (mobile responsive pass, area 3):
 * stat tiles one per row below 576px, the phone shell switching over at
 * Tailwind's lg (992px) with no in-between state, and no text under 12px.
 */

const tabBar = 'nav[aria-label="Primary navigation"]';

test('stat tiles: one column on phones, side by side from 576px', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  const lefts = async () =>
    page
      .getByTestId('overview-stat-grid')
      .locator(':scope > *')
      .evaluateAll((els) =>
        els.map((el) => Math.round(el.getBoundingClientRect().left)),
      );

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/admin');
  await expect(page.getByTestId('overview-stat-grid')).toBeVisible();
  expect(new Set(await lefts()).size).toBe(1);

  await page.setViewportSize({ width: 768, height: 1024 });
  expect(new Set(await lefts()).size).toBeGreaterThan(1);
});

test('the phone shell switches at exactly 992px', async ({ page }) => {
  await loginAs(page, 'admin');
  for (const [width, phone] of [
    [991, true],
    [992, false],
    [1010, false],
  ] as const) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/admin');
    if (phone) await expect(page.locator(tabBar)).toBeVisible();
    else await expect(page.locator(tabBar)).toBeHidden();
  }
});

test('no text under 12px on the overview at 375', async ({ page }) => {
  await loginAs(page, 'admin');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/admin');
  await page.waitForLoadState('networkidle').catch(() => {});
  const tiny = await page.evaluate(() =>
    Array.from(document.querySelectorAll('p, span, a, button, h2, h3, li'))
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return (
          r.width > 0 &&
          (el.textContent || '').trim() &&
          parseFloat(getComputedStyle(el).fontSize) < 12
        );
      })
      .map((el) => (el.textContent || '').trim().slice(0, 30)),
  );
  expect(tiny).toEqual([]);
});
