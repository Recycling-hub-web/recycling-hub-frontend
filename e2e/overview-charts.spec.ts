import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * The Admin overview's charts: the solid "Requests this week" stat with
 * its mini trend, the weekly bars, the orders-by-outcome gauge and the
 * pickup-time heatmap — all on real data from the backend.
 */

test('admin overview shows the stat, weekly bars, gauge and heatmap', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  await page.goto('/admin');

  const grid = page.getByTestId('overview-stat-grid');
  const lead = grid.getByRole('link', { name: /Requests this week/ });
  await expect(lead).toBeVisible();
  await expect(
    lead.getByRole('img', { name: /Requests, last 9 weeks/ }),
  ).toBeVisible();

  // Weekly bars: seven days, today's tooltip shown by default.
  const week = page.getByRole('group', {
    name: 'Pickup requests submitted each day this week',
  });
  await expect(week.getByRole('button')).toHaveCount(7);
  await expect(page.getByText('This week', { exact: true })).toBeVisible();
  await expect(page.getByText('Last week', { exact: true })).toBeVisible();

  // Gauge: one part per outcome, and the shares add up to 100%.
  const gauge = page.getByRole('img', { name: /^Orders by outcome:/ });
  await expect(gauge).toBeVisible();
  const name = (await gauge.getAttribute('aria-label')) ?? '';
  const shares = (name.match(/\d+%/g) ?? []).map((m) => parseInt(m, 10));
  expect(shares).toHaveLength(3);
  expect(shares.reduce((a, b) => a + b, 0)).toBe(100);

  // Heatmap: Mon–Sun × 8am–6pm, each cell names its count.
  const heatmap = page.getByRole('table', {
    name: /Pickup requests by weekday and hour/,
  });
  await expect(heatmap.getByRole('rowheader')).toHaveCount(7);
  await expect(heatmap.getByRole('columnheader')).toHaveCount(11);
  await heatmap
    .getByRole('button', { name: /^Mon 9am: \d+ requests$/ })
    .hover();
  await expect(heatmap.getByText(/^\d+ requests$/)).toBeVisible();

  // Pictures of each card, for a visual check.
  await lead.screenshot({ path: 'test-results/overview-stat.png' });
  const cards = [
    ['week', 'Requests this week'],
    ['gauge', 'Orders by outcome'],
    ['heatmap', 'When customers want pickups'],
  ] as const;
  await Promise.all(
    cards.map(([file, title]) =>
      page
        .locator('section', { has: page.getByRole('heading', { name: title }) })
        .screenshot({ path: `test-results/overview-${file}.png` }),
    ),
  );
});
