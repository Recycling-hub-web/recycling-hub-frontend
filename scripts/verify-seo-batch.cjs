const assert = require('node:assert/strict'),
  fs = require('fs');
const { chromium } = require('@playwright/test');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.route('**/api/**', (r) =>
    r.fulfill({ status: 503, contentType: 'application/json', body: '{}' }),
  );
  await p.route('https://fonts.googleapis.com/**', (r) => r.abort());
  const result = [];
  const titles = new Set(),
    descs = new Set();
  for (const lang of ['en', 'bm'])
    for (const route of ['/', '/services', '/faq', '/request-quote']) {
      const url =
        'http://127.0.0.1:3000' +
        (lang === 'bm' ? '/bm' : '') +
        (route === '/' ? (lang === 'bm' ? '' : '/') : route);
      const res = await p.goto(url, { waitUntil: 'domcontentloaded' });
      assert.equal(res.status(), 200);
      await p.locator('h1').waitFor();
      const d = await p.evaluate(() => ({
        title: document.title,
        description: document.querySelector('meta[name="description"]').content,
        h1: [...document.querySelectorAll('h1')].map((e) =>
          e.textContent.trim(),
        ),
        opening:
          document.querySelector('main h1').nextElementSibling.textContent,
        canonical: document.querySelector('link[rel="canonical"]').href,
        alts: [...document.querySelectorAll('link[hreflang]')].map((e) => [
          e.hreflang,
          e.href,
        ]),
        graphs: [
          ...document.querySelectorAll('script[type="application/ld+json"]'),
        ].flatMap((e) => JSON.parse(e.textContent)['@graph'] || []),
        main: document.querySelector('main').innerText,
        body: document.body.textContent,
        faq: [...document.querySelectorAll('details')].map((e) => ({
          q: e.querySelector('summary').textContent,
          a: e.querySelector('p').textContent,
        })),
      }));
      assert(
        !/no minimum|without a minimum|tiada minimum|tanpa minimum|tanpa kuantiti minimum/i.test(
          d.main,
        ),
      );
      assert(
        /3(?:\+)? (devices|peranti)/i.test(d.main),
        'Pickup minimum must be visible',
      );
      assert(d.title.length <= 60);
      assert(
        d.description.length >= 140 && d.description.length <= 155,
        d.description.length,
      );
      assert(!titles.has(d.title));
      assert(!descs.has(d.description));
      titles.add(d.title);
      descs.add(d.description);
      assert.equal(d.h1.length, 1);
      const keywords = {
        en: {
          '/': 'e-waste recycling Malaysia',
          '/services': 'e-waste collection services',
          '/faq': 'e-waste recycling FAQ',
          '/request-quote': 'e-waste pickup quote',
        },
        bm: {
          '/': 'kitar semula sisa elektronik',
          '/services': 'perkhidmatan kutipan e-waste',
          '/faq': 'soalan lazim kitar semula e-waste',
          '/request-quote': 'sebut harga pickup e-waste',
        },
      };
      const keyword = keywords[lang][route].toLowerCase();
      for (const copy of [d.title, d.description, d.h1[0], d.opening])
        assert(
          copy.toLowerCase().includes(keyword),
          `Missing keyword: ${keyword}`,
        );
      const canonical =
        'https://recyclinghub.eco' +
        (lang === 'bm' ? '/bm' : '') +
        (route === '/' ? (lang === 'bm' ? '' : '/') : route);
      assert.equal(d.canonical, canonical);
      assert.deepEqual(
        d.alts.map((a) => a[0]),
        ['en-MY', 'ms-MY', 'x-default'],
      );
      assert(
        !/\bDOE\b|licensed|under one licen[cs]e|berlesen|berdaftar/i.test(
          d.main,
        ),
        url,
      );
      const enUrl = `https://recyclinghub.eco${route}`;
      const bmUrl = `https://recyclinghub.eco/bm${route === '/' ? '' : route}`;
      assert.deepEqual(d.alts, [
        ['en-MY', enUrl],
        ['ms-MY', bmUrl],
        ['x-default', enUrl],
      ]);
      assert(d.body.includes('+60 11-6766 3035'));
      assert(!d.body.includes('+60 11-2850 3845'));
      assert.equal(await p.locator('a[href^="tel:"]').count(), 0);
      assert((await p.locator('a[href*="wa.me/601167663035"]').count()) > 0);
      assert(d.body.includes('info@recyclinghub.eco'));
      const faq = d.graphs.find((g) => g['@type'] === 'FAQPage');
      if (route === '/faq') {
        assert.equal(faq.mainEntity.length, d.faq.length);
        for (let i = 0; i < d.faq.length; i++) {
          assert.equal(faq.mainEntity[i].name, d.faq[i].q);
          assert.equal(faq.mainEntity[i].acceptedAnswer.text, d.faq[i].a);
        }
      } else assert(!faq);
      if (route === '/') {
        const biz = d.graphs.find((g) => g['@type'] === 'LocalBusiness');
        assert.equal(biz.legalName, 'RECYCLING HUB SDN. BHD.');
        assert(!biz.address);
        assert.equal(biz.areaServed.length, 9);
      }
      if (route === '/services') {
        assert.equal(
          d.graphs.find((g) => g['@type'] === 'ItemList').itemListElement
            .length,
          6,
        );
        assert.equal(await p.locator('[role="tablist"]').count(), 0);
      }
      const html = await res.text();
      assert(html.includes(d.title.replace(/&/g, '&amp;')), 'SSR title');
      result.push({
        lang,
        route,
        title: d.title,
        titleLength: d.title.length,
        description: d.description,
        descriptionLength: d.description.length,
        h1: d.h1[0],
        canonical: d.canonical,
        schemas: d.graphs.map((g) => g['@type']),
      });
      console.log('PASS', lang, route);
    }
  for (const width of [390, 768, 1440]) {
    await p.setViewportSize({ width, height: 900 });
    await p.goto('http://127.0.0.1:3000', { waitUntil: 'domcontentloaded' });
    await p.locator('h1').waitFor();
    assert(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow ${width}`,
    );
    console.log('PASS width', width);
  }
  await p.goto('http://127.0.0.1:3000/request-quote');
  await p.getByRole('button', { name: 'Continue on WhatsApp' }).click();
  assert(await p.getByText('Please enter your full name.').isVisible());
  await p.locator('#fullName').fill('SEO test');
  await p.locator('#email').fill('seo-test@example.com');
  await p.locator('#details').fill('Test enquiry: do not send');
  let handoff;
  await p.route('https://wa.me/**', (r) => {
    handoff = r.request().url();
    return r.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<p>Local test: no message sent</p>',
    });
  });
  await p.getByRole('button', { name: 'Continue on WhatsApp' }).click();
  await p.waitForURL('https://wa.me/**');
  assert(handoff.includes('/601167663035?'));
  assert(
    new URL(handoff).searchParams
      .get('text')
      .includes('Test enquiry: do not send'),
  );
  console.log(
    'PASS quote validation and intercepted handoff (no message sent)',
  );
  fs.writeFileSync(
    '/tmp/seo-batch-results.json',
    JSON.stringify(result, null, 2),
  );
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
