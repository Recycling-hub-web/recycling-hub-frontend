/* eslint-disable no-await-in-loop, no-restricted-syntax */
import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Staff/admin screens on phones (mobile responsive pass, area 2): no
 * horizontal page scroll, form fields that fit their card, and 44px tap
 * targets for the header bell, the filter toggle and back links.
 */

const WIDTHS = [
  { width: 320, height: 640 },
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

const noSideScroll = async (page: Page) => {
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
};

/** Every form field ends inside the viewport (it used to run 4px past
 * it at 375 because the one-column grid sized to its widest field). */
const fieldsFit = async (page: Page) => {
  const worst = await page.evaluate(() =>
    Math.max(
      0,
      ...Array.from(document.querySelectorAll('[data-field]')).map(
        (el) => el.getBoundingClientRect().right - window.innerWidth,
      ),
    ),
  );
  expect(worst).toBeLessThanOrEqual(0);
};

const tapSize = async (page: Page, name: string) => {
  const box = await page
    .getByRole('button', { name, exact: true })
    .first()
    .boundingBox();
  expect(Math.round(box!.width)).toBeGreaterThanOrEqual(44);
  expect(Math.round(box!.height)).toBeGreaterThanOrEqual(44);
};

test('admin pages never scroll sideways, 320px to 1440px', async ({ page }) => {
  test.setTimeout(300_000);
  await loginAs(page, 'admin');
  for (const url of [
    '/admin/pickup-requests',
    '/admin/pickup-requests/create',
    '/admin/users',
    '/profile/edit',
  ]) {
    for (const size of WIDTHS) {
      await page.setViewportSize(size);
      await page.goto(url);
      await page.waitForLoadState('networkidle').catch(() => {});
      await noSideScroll(page);
      await fieldsFit(page);
    }
  }
});

test('staff pages never scroll sideways, 320px to 1440px', async ({ page }) => {
  test.setTimeout(300_000);
  await loginAs(page, 'qaStaff');
  for (const url of ['/staff', '/staff/pickup-requests', '/staff/claims']) {
    for (const size of WIDTHS) {
      await page.setViewportSize(size);
      await page.goto(url);
      await page.waitForLoadState('networkidle').catch(() => {});
      await noSideScroll(page);
    }
  }
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('the bell and filter toggle are 44px tap targets', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin/pickup-requests');
    await tapSize(page, 'Notifications');
    await tapSize(page, 'Show filters');
  });

  test('back links are 44px tall', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/profile/edit');
    const box = await page
      .getByRole('link', { name: 'Back to profile' })
      .boundingBox();
    expect(Math.round(box!.height)).toBeGreaterThanOrEqual(44);
  });

  test('page titles wrap instead of being cut off', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/profile/edit');
    const subtitle = page.locator('h1 + p').first();
    await expect(subtitle).toHaveCSS('white-space', 'normal');
  });
});
