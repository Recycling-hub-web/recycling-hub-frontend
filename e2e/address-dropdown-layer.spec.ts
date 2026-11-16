import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';
import { fillCustomer, stepHeading } from './helpers/pickupRequestForm';

/** The address suggestions open above the step form's sticky footer
 * (Back / Continue), not underneath it. */

const OUT =
  '/private/tmp/claude-501/-Users-adnanmadi-Documents-git-repos-recycling-hub/40564864-e963-4d24-b3b1-cfe8737b8766/scratchpad';

const SUGGESTIONS = Array.from({ length: 6 }, (_, i) => ({
  place_id: `p${i}`,
  formatted: `${i + 1} Jalan Bukit Bintang, 55100 Kuala Lumpur, Malaysia`,
  address_line1: `Bukit Bintang ${i + 1}`,
  address_line2: 'Bukit Bintang, 55100 Kuala Lumpur, Malaysia',
  lat: 3.14,
  lon: 101.71,
}));

test('address suggestions sit above the sticky step footer', async ({
  page,
}) => {
  await page.route('https://api.geoapify.com/v1/geocode/autocomplete**', (r) =>
    r.fulfill({ json: { results: SUGGESTIONS } }),
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await loginAs(page, 'admin');
  await page.goto('/admin/pickup-requests/create');
  await fillCustomer(page, { fullName: 'Layer Check' });
  await expect(stepHeading(page, 'Pickup')).toBeVisible();

  await page.locator('[data-field="pickup_address"] input').fill('Bukit Bin');
  const list = page.getByRole('listbox');
  await expect(list).toBeVisible();

  // Whatever is on top where the footer's Continue button sits must be
  // part of the suggestions list when the list reaches that far.
  const continueBox = (await page
    .getByRole('button', { name: 'Continue' })
    .boundingBox())!;
  const listBox = (await list.boundingBox())!;
  const x = listBox.x + 40;
  const y = continueBox.y + continueBox.height / 2;
  const onTop = await page.evaluate(
    ({ px, py }) => {
      const el = document.elementFromPoint(px, py);
      return Boolean(el?.closest('[role="listbox"]'));
    },
    { px: x, py: y },
  );
  if (listBox.y + listBox.height > y) expect(onTop).toBe(true);
  await page.screenshot({ path: `${OUT}/address-layer.png` });
});
