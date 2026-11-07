const assert = require('node:assert/strict'),
  fs = require('fs');
const { chromium } = require('@playwright/test');
const slugs = [
  'collection-pickup',
  'bulk-industrial-collection',
  'certified-data-destruction',
  'esg-reporting',
  'material-recovery',
  'compliance-documentation',
];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.route('**/api/**', (r) =>
    r.fulfill({ status: 503, contentType: 'application/json', body: '{}' }),
  );
  const results = [];
  for (const lang of ['en', 'bm']) {
    const prefix = lang === 'bm' ? '/bm' : '';
    await p.goto('http://127.0.0.1:3000' + prefix + '/services');
    await p.locator('main h3').first().waitFor();
    assert.equal(await p.locator('main h3').count(), 6);
    for (const slug of slugs) {
      const path = prefix + '/services/' + slug;
      const r = await p.goto('http://127.0.0.1:3000' + path);
      assert.equal(r.status(), 200);
      await p.locator('h1').waitFor();
      const d = await p.evaluate(() => ({
        title: document.title,
        description: document.querySelector('meta[name="description"]').content,
        h1: [...document.querySelectorAll('h1')].map((e) =>
          e.textContent.trim(),
        ),
        canonical: document.querySelector('link[rel="canonical"]').href,
        graphs: [
          ...document.querySelectorAll('script[type="application/ld+json"]'),
        ].flatMap((e) => JSON.parse(e.textContent)['@graph']),
        text: document.querySelector('main').innerText,
      }));
      assert.equal(d.h1.length, 1);
      assert(d.title.length <= 60);
      assert(
        d.description.length >= 140 && d.description.length <= 155,
        `${lang} ${slug} ${d.description.length}`,
      );
      assert.equal(d.canonical, 'https://recyclinghub.eco' + path);
      const service = d.graphs.find((g) => g['@type'] === 'Service');
      assert.equal(service.name, d.h1[0]);
      const crumb = d.graphs.find((g) => g['@type'] === 'BreadcrumbList');
      assert.equal(crumb.itemListElement.length, 3);
      assert.equal(crumb.itemListElement[2].item, d.canonical);
      assert(
        !/DOE|licensed|zero.landfill|carbon savings|berlesen|berdaftar/i.test(
          d.text,
        ),
      );
      assert((await p.locator('main a[href*="request-quote"]').count()) > 0);
      if (slug === 'collection-pickup')
        assert(/3 (devices|peranti)/.test(d.text));
      results.push({
        lang,
        slug,
        title: d.title,
        description: d.description,
        h1: d.h1[0],
        canonical: d.canonical,
        schemas: d.graphs.map((g) => g['@type']),
      });
      console.log('PASS', lang, slug);
    }
    await p.goto('http://127.0.0.1:3000' + prefix + '/request-quote');
    await p.locator('#service').waitFor();
    assert.equal(await p.locator('#service option').count(), 6);
    assert.equal(
      await p.locator('#service').inputValue(),
      'bulk-industrial-collection',
    );
  }
  for (const width of [390, 768, 1440]) {
    await p.setViewportSize({ width, height: 900 });
    await p.goto('http://127.0.0.1:3000/services');
    assert(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
  }
  fs.writeFileSync(
    '/tmp/service-checks.json',
    JSON.stringify(results, null, 2),
  );
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
