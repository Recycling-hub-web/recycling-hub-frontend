/* eslint-disable no-await-in-loop, no-restricted-syntax */
import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Driver screens on phones (mobile responsive pass, area 1): no
 * horizontal page scroll at any width, list rows as titled cards, the
 * drop-off checklist usable by tap with its action pinned in reach, and
 * the tab bar lighting the right tab.
 */

const WIDTHS = [
  { width: 320, height: 640 },
  { width: 375, height: 812 },
  { width: 414, height: 896 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 812, height: 375 }, // 375 landscape
];

const noSideScroll = async (page: Page) => {
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
};

test('driver pages never scroll sideways, 320px to 1920px', async ({
  page,
}) => {
  test.setTimeout(300_000);
  await loginAs(page, 'qaDriver');
  for (const url of ['/driver', '/driver/pickups', '/driver/drop-off']) {
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

  test('pickup rows are cards headed by the order code', async ({ page }) => {
    await loginAs(page, 'qaDriver');
    await page.goto('/driver/pickups');
    const title = page.locator('td[data-card-role="title"]').first();
    await expect(title).toBeVisible();
    await expect(title).toHaveText(/^(ORD-|C)\S+/);
  });

  test('drop-off: tapping a card selects it and the action stays in reach', async ({
    page,
  }) => {
    await loginAs(page, 'qaDriver');
    await page.goto('/driver/drop-off');
    const action = page.getByRole('button', { name: /Drop off to store/ });
    await expect(action).toBeInViewport();

    const select = page.locator('td[data-card-role="select"]').first();
    if ((await select.count()) === 0) test.skip(true, 'nothing to drop off');
    const box = await select.boundingBox();
    expect(Math.round(box!.width)).toBeGreaterThanOrEqual(44);
    expect(Math.round(box!.height)).toBeGreaterThanOrEqual(44);
    await select.click({ position: { x: 4, y: 4 } }); // the cell, not the box
    await expect(action).toHaveText(/\(1\)/);
    await expect(action).toBeInViewport();
  });

  test('the tab bar lights Home only at home, and Menu for menu pages', async ({
    page,
  }) => {
    await loginAs(page, 'qaDriver');
    const tabs = page.getByRole('navigation', { name: 'Primary navigation' });

    await page.goto('/driver');
    await expect(tabs.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    await page.goto('/driver/drop-off');
    await expect(tabs.getByRole('link', { name: 'Home' })).not.toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(tabs.getByRole('button', { name: 'Menu' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    // The Menu sheet opens, lists the pages, and closes.
    await tabs.getByRole('button', { name: 'Menu' }).click();
    const sheet = page.getByRole('dialog', { name: 'Your workspace' });
    await expect(sheet).toBeVisible();
    await sheet.getByRole('button', { name: 'Close menu' }).click();
    await expect(sheet).toBeHidden();
  });
});
