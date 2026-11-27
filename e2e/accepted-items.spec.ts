import { expect, test } from '@playwright/test';

/**
 * Public content: the home page's "What can I recycle?" section (device
 * types, ask-first items with a WhatsApp photo link, the pickup rules)
 * and the FAQ's practical questions — in English and Bahasa Melayu.
 */

test('the home page says what we accept, with a WhatsApp photo link', async ({
  page,
}) => {
  await page.goto('/');
  const section = page.locator('#what-we-accept');
  await expect(
    section.getByRole('heading', { name: 'What can I recycle?' }),
  ).toBeVisible();
  for (const title of [
    'Phones & tablets',
    'Laptops & computers',
    'Monitors & screens',
    'Office IT equipment',
  ]) {
    // eslint-disable-next-line no-await-in-loop
    await expect(section.getByRole('heading', { name: title })).toBeVisible();
  }
  await expect(section.getByText('Free pickup with 3+ devices')).toBeVisible();
  await expect(
    section.getByRole('link', { name: /Send a photo on WhatsApp/ }),
  ).toHaveAttribute('href', /^https:\/\/wa\.me\/601167663035\?text=/);
  await expect(
    section.getByRole('link', { name: 'Request a pickup' }),
  ).toHaveAttribute('href', '/request-pickup');
});

test('the Malay home page shows the same section translated', async ({
  page,
}) => {
  await page.goto('/bm');
  await expect(
    page
      .locator('#what-we-accept')
      .getByRole('heading', { name: 'Apa yang boleh saya kitar semula?' }),
  ).toBeVisible();
});

test('the FAQ answers unlisted items and device preparation', async ({
  page,
}) => {
  await page.goto('/faq');
  await expect(
    page.getByText(
      "What if my item isn't listed, is damaged or has a battery?",
    ),
  ).toBeVisible();
  await expect(
    page.getByText('How should I prepare my devices before pickup?'),
  ).toBeVisible();
});
