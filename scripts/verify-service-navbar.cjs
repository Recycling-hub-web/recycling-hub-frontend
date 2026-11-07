const assert = require('node:assert/strict');
const { chromium, expect } = require('@playwright/test');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.route('**/api/**', (r) =>
    r.fulfill({ status: 503, contentType: 'application/json', body: '{}' }),
  );
  for (const lang of ['en', 'bm'])
    for (const width of [1440, 390]) {
      const prefix = lang === 'bm' ? '/bm' : '';
      await p.setViewportSize({ width, height: 844 });
      await p.goto('http://127.0.0.1:3000' + prefix + '/services');
      await p.locator('h1').waitFor();
      if (width === 390)
        await p.getByRole('button', { name: 'Open menu' }).click();
      const trigger = p.getByRole('button', {
        name: lang === 'en' ? 'Services' : 'Perkhidmatan',
        exact: true,
      });
      await trigger.focus();
      if (width === 1440) await trigger.press('ArrowDown');
      else await trigger.click();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      const id = await trigger.getAttribute('aria-controls');
      const panel = p.locator(`[id="${id}"]`);
      await expect(panel.locator('a')).toHaveCount(6);
      await expect(panel).toContainText(
        lang === 'en' ? 'Collection & recycling' : 'Kutipan & kitar semula',
      );
      await expect(
        panel.getByRole('link', {
          name: lang === 'en' ? 'Who we help' : 'Siapa yang kami bantu',
        }),
      ).toHaveAttribute('href', prefix + '/solutions');
      await expect(
        p.getByRole('button', {
          name: lang === 'en' ? 'Solutions' : 'Penyelesaian',
          exact: true,
        }),
      ).toHaveCount(0);
      if (lang === 'bm')
        assert(!(await panel.innerText()).includes('Household e-waste pickup'));
      if (width === 1440) {
        await expect(panel.locator('a').first()).toBeFocused();
        await panel.locator('a').first().press('Escape');
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await expect(trigger).toBeFocused();
        await trigger.press('ArrowDown');
      }
      const link = panel.locator('a[href$="/services/material-recovery"]');
      await link.click();
      await p.waitForURL('**' + prefix + '/services/material-recovery');
      await expect(p.locator('h1')).toHaveText(
        lang === 'en' ? 'Electronics recycling' : 'Kitar semula elektronik',
      );
      assert(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      if (width === 390)
        await expect(
          p.getByRole('button', { name: 'Open menu' }),
        ).toBeVisible();
      console.log(
        'PASS',
        lang,
        width,
        'grouping, labels, service link, mobile closure/keyboard',
      );
    }
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
