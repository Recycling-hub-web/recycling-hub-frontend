import { loadEnvConfig } from '@next/env';
import type { BrowserContext, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { SignJWT } from 'jose';

loadEnvConfig(process.cwd());

for (const mobile of [true, false]) {
  test(`BM seven-stop selection and ${mobile ? 'mobile inline' : 'desktop modal'} route preview`, async ({
    page,
    context,
  }) => {
    await page.setViewportSize(
      mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 },
    );
    const token = await new SignJWT({ role: 'driver', token_type: 'access' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('10m')
      .sign(
        new TextEncoder().encode(process.env.JWT_VERIFY_SECRET || 'test-only'),
      );
    await context.addCookies([
      { name: 'rh_access', value: token, url: 'http://127.0.0.1:3101' },
      { name: 'NEXT_LOCALE', value: 'bm', url: 'http://127.0.0.1:3101' },
    ]);
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 3.14, longitude: 101.68 });
    const point = {
      id: 'point',
      name: 'Local Store',
      address: '1 Jalan Store',
    };
    const orders = Array.from({ length: 14 }, (_, index) => ({
      id: `order-${index + 1}`,
      code: `C${1001 + index}`,
      items: [],
      price: '10.00',
      status: 'scheduled',
      evaluation_status: 'approved',
      pickup_request: {
        id: `request-${index}`,
        full_name: 'Customer',
        phone_number: '+60123456789',
        pickup_address: `${index + 1} Jalan Pickup`,
        requested_at: null,
      },
      route: { id: 'route', status: 'open', collection_point: point },
      scheduled_at: null,
      pickup_confirmed_at: null,
    }));
    let selected: string[] = [];
    await page.route('**/api/v1/**', (route) => {
      const url = new URL(route.request().url());
      if (url.pathname.includes('/accounts/me/'))
        return route.fulfill({
          json: {
            id: 'driver',
            full_name: 'Driver',
            role: 'driver',
            email: 'driver@example.com',
            profile_photo: null,
          },
        });
      if (url.pathname.includes('/optimize-route/')) {
        selected = route.request().postDataJSON().request_ids;
        return route.fulfill({
          json: {
            collection_point: point,
            destination: { lat: 3.2, lng: 101.7 },
            stops: selected.map((requestId) => ({
              request_id: requestId,
              lat: 3.15,
              lng: 101.69,
            })),
          },
        });
      }
      if (url.pathname.endsWith('/pickups/')) {
        const scheduled = url.searchParams.get('status') === 'scheduled';
        const size = Number(url.searchParams.get('page_size') || 12);
        const current = Number(url.searchParams.get('page') || 1);
        const results = scheduled
          ? orders.slice((current - 1) * size, current * size)
          : [];
        return route.fulfill({
          json: {
            count: scheduled ? orders.length : 0,
            results,
            next: scheduled && current * size < orders.length ? 'next' : null,
            previous: null,
          },
        });
      }
      if (url.pathname.includes('/collection-points/'))
        return route.fulfill({
          json: { count: 1, results: [point], next: null },
        });
      return route.fulfill({ json: { count: 0, results: [], total: '0.00' } });
    });
    await page.goto('/driver/pickups');
    await expect(page.locator('tbody tr')).toHaveCount(7);
    await page.getByRole('button', { name: 'Seterusnya', exact: true }).click();
    await expect(page.getByText('C1008', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Seterusnya', exact: true }),
    ).toBeDisabled();
    await page
      .getByRole('button', {
        name: 'Tandakan kutipan untuk Customer sebagai dikutip',
      })
      .first()
      .click();
    const collectDialog = page.getByRole('dialog');
    const note = collectDialog.locator('[data-field="note"]');
    await expect(note.locator('textarea')).toBeHidden();
    await expect(note.locator('textarea')).toBeDisabled();
    await note.getByRole('switch').click();
    await expect(note.locator('textarea')).toBeVisible();
    await expect(note.locator('.note-field-panel')).toHaveCSS(
      'transition-duration',
      '0.22s, 0.18s, 0s',
    );
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(note.locator('.note-field-panel')).toHaveCSS(
      'transition-duration',
      '0s',
    );
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await note.locator('textarea').fill('Keep this note');
    await note.getByRole('switch').click();
    await expect(note.locator('textarea')).toBeHidden();
    await expect(note.locator('textarea')).toBeDisabled();
    await note.getByRole('switch').click();
    await expect(note.locator('textarea')).toHaveValue('Keep this note');
    await collectDialog.getByRole('button', { name: 'Tutup dialog' }).click();
    await page
      .getByRole('button', { name: 'Pilih semua (sehingga 7)' })
      .click();
    await expect(page.getByText('7/7 dipilih', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Google Maps', exact: true }),
    ).toHaveCount(0);
    await page
      .getByRole('button', { name: 'Optimumkan Laluan', exact: true })
      .click();
    const dialog = page.getByRole('dialog', { name: 'Optimumkan laluan' });
    await dialog
      .getByRole('button', { name: 'Dapatkan laluan optimum' })
      .click();
    if (mobile) await expect(dialog).toHaveCount(0);
    else await expect(dialog).toBeVisible();
    const preview = page.getByRole('region', { name: 'Laluan optimum' });
    await expect(preview).toBeVisible();
    await preview.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `audit-evidence/batch7-route-bm-${mobile ? 'mobile' : 'desktop'}.png`,
      fullPage: true,
      animations: 'disabled',
    });
    expect(selected).toHaveLength(7);
    await expect(preview.getByText('C1001', { exact: true })).toBeVisible();
    await expect(preview.getByText('C1007', { exact: true })).toBeVisible();
    const mapsLink = preview.getByRole('link', {
      name: 'Google Maps',
      exact: true,
    });
    await expect(mapsLink).toHaveAttribute(
      'href',
      /https:\/\/www\.google\.com\/maps\/dir\//,
    );
    await expect(mapsLink).toHaveAttribute('target', '_blank');
    await expect(
      preview.getByRole('link', { name: 'Waze', exact: true }),
    ).toHaveAttribute('href', /https:\/\/waze\.com\/ul/);
    if (!mobile) {
      await expect(
        dialog.getByRole('region', { name: 'Laluan optimum' }),
      ).toBeVisible();
      await expect(dialog.locator('iframe')).toHaveCount(0);
      await dialog.getByRole('button', { name: 'Tutup dialog' }).click();
    }
    await page.getByRole('button', { name: 'Kosongkan pilihan' }).click();
    await expect(preview).toHaveCount(0);
  });
}

test.use({ timezoneId: 'Asia/Kuala_Lumpur' });
const baseOrder = {
  id: 'pickup-1',
  code: 'C1001',
  status: 'scheduled',
  evaluation_status: 'approved',
  price: '10.00',
  items: [],
  photos: [],
  photo: null,
  request_photos: [
    {
      id: 'photo',
      file_key: {
        file_key: 'mock/customer.pdf',
        public_url: 'https://example.test/customer.pdf',
      },
    },
  ],
  pickup_request: {
    id: 'parent',
    code: 'R1001',
    request_type: 'individual',
    full_name: 'Scheduled',
    email: 'test@example.com',
    phone_number: '+60123456789',
    pickup_address: '1 Jalan Test',
    requested_at: null,
    note: 'Keep original note',
    collection_point: null,
  },
  route: {
    id: 'route',
    status: 'open',
    dropped_off_at: null,
    collection_point: {
      id: 'point',
      name: 'Local Store',
      address: '1 Jalan Store',
    },
  },
  scheduled_at: '2026-11-23T02:00:00Z',
  pickup_confirmed_at: null,
  collected_at: null,
  delivered_quantity: null,
  created_at: '2026-11-23T00:00:00Z',
  updated_at: '2026-11-23T00:00:00Z',
  finance_record: null,
};
async function mockDriver(
  page: Page,
  context: BrowserContext,
  options: {
    collected?: boolean;
    pointsFail?: boolean;
    gate?: Promise<void>;
  } = {},
) {
  const token = await new SignJWT({ role: 'driver', token_type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(
      new TextEncoder().encode(process.env.JWT_VERIFY_SECRET || 'test-only'),
    );
  await context.addCookies([
    { name: 'rh_access', value: token, url: 'http://127.0.0.1:3101' },
    { name: 'NEXT_LOCALE', value: 'bm', url: 'http://127.0.0.1:3101' },
  ]);
  let order = {
    ...baseOrder,
    status: options.collected ? 'collected' : 'scheduled',
  };
  let pointAttempts = 0;
  const writes: { path: string; body: Record<string, unknown> }[] = [];
  await page.route('https://mock-storage.example/**', async (route) => {
    await options.gate;
    return route.fulfill({ status: 200 });
  });
  await page.route('**/api/v1/**', (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname;
    if (path.endsWith('/accounts/me/'))
      return route.fulfill({
        json: {
          id: 'driver',
          full_name: 'Driver',
          role: 'driver',
          email: 'test@example.com',
          profile_photo: null,
        },
      });
    if (path.includes('/collection-points/')) {
      pointAttempts += 1;
      if (options.pointsFail && pointAttempts === 1)
        return route.fulfill({
          status: 503,
          json: { detail: 'Could not load collection points.' },
        });
      return route.fulfill({
        json: {
          count: 1,
          results: [baseOrder.route.collection_point],
          next: null,
        },
      });
    }
    if (path.endsWith('/categories/'))
      return route.fulfill({ json: { count: 0, results: [], next: null } });
    if (path.endsWith('/storage/presigned-upload-urls'))
      return route.fulfill({
        json: {
          uploads: [
            {
              file_key: 'mock/proof.png',
              upload_url: 'https://mock-storage.example/proof',
              method: 'PUT',
              headers: { 'Content-Type': 'image/png' },
            },
          ],
        },
      });
    if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON();
      writes.push({ path, body });
      if (path.endsWith('/confirm-schedule/'))
        order = { ...order, scheduled_at: String(body.scheduled_at) };
      return route.fulfill({ json: order });
    }
    if (path.endsWith('/pickups/pickup-1/'))
      return route.fulfill({ json: order });
    if (path.endsWith('/pickups/')) {
      const status = url.searchParams.get('status');
      return route.fulfill({
        json: {
          count: status === order.status ? 1 : 0,
          results: status === order.status ? [order] : [],
          next: null,
        },
      });
    }
    return route.fulfill({
      json: { count: 0, results: [], next: null, total: '0.00' },
    });
  });
  return writes;
}

test('BM schedule confirmation preserves the Malaysia local time represented by the API timestamp', async ({
  page,
  context,
}) => {
  const writes = await mockDriver(page, context);
  await page.goto('/driver/pickups');
  await page
    .getByRole('button', {
      name: 'Sahkan tarikh dan masa kutipan untuk Scheduled',
      exact: true,
    })
    .click();
  await expect(
    page.getByRole('dialog').getByLabel('Tarikh & masa kutipan'),
  ).toHaveValue('2026-11-23T10:00');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Tutup dialog' })
    .click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await page.goto('/driver/pickups/pickup-1');
  await expect(page.getByText('Scheduled', { exact: true })).toBeVisible();
  await page
    .getByRole('button', { name: 'Sahkan masa kutipan', exact: true })
    .click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByLabel('Tarikh & masa kutipan')).toHaveValue(
    '2026-11-23T10:00',
  );
  await expect(dialog).toHaveAttribute('data-shown', 'true');
  await page.screenshot({
    path: 'audit-evidence/batch7-schedule-bm.png',
    fullPage: true,
    animations: 'disabled',
  });
  await dialog.getByRole('button', { name: 'Sahkan', exact: true }).click();
  await expect(dialog).toBeHidden();
  expect(writes[0]?.body).toEqual({ scheduled_at: '2026-11-23T02:00:00.000Z' });
  await page.getByRole('button', { name: 'Dokumen (1)', exact: true }).click();
  await expect(
    page.getByRole('link', { name: 'Buka Lampiran pelanggan 1', exact: true }),
  ).toHaveAttribute('href', 'https://example.test/customer.pdf');
});

test('BM collection validates payment proof and sends notes and payment codes unchanged', async ({
  page,
  context,
}) => {
  const writes = await mockDriver(page, context);
  await page.goto('/driver/pickups');
  await page
    .getByRole('button', {
      name: 'Tandakan kutipan untuk Scheduled sebagai dikutip',
      exact: true,
    })
    .click();
  const dialog = page.getByRole('dialog');
  await dialog
    .getByRole('button', { name: 'Tandakan dikutip', exact: true })
    .click();
  await expect(dialog.getByRole('alert')).toContainText(
    'Medan ini diperlukan.',
  );
  await dialog.getByLabel('Kaedah bayaran').selectOption('bank_transfer');
  await dialog
    .getByRole('button', { name: 'Tandakan dikutip', exact: true })
    .click();
  await expect(
    dialog.getByText('Muat naik bukti bayaran.', { exact: true }),
  ).toBeVisible();
  expect(writes).toEqual([]);
  const note = dialog.locator('[data-field="note"]');
  await note.getByRole('switch').click();
  await note.locator('textarea').fill('Paid');
  await dialog.getByLabel('Kaedah bayaran').selectOption('bank_transfer');
  await dialog.getByLabel('Bukti bayaran', { exact: true }).setInputFiles({
    name: 'proof.png',
    mimeType: 'image/png',
    buffer: Buffer.from('synthetic'),
  });
  await expect(
    dialog.getByRole('button', { name: 'Buang', exact: true }),
  ).toBeVisible();
  await dialog
    .getByRole('button', { name: 'Tandakan dikutip', exact: true })
    .click();
  await expect(dialog).toBeHidden();
  expect(writes[0]?.body).toEqual({
    note: 'Paid',
    payment_method: 'bank_transfer',
    proof_of_payment: 'mock/proof.png',
  });
});

test('BM route planning shows collection point retry and a location-denied explanation', async ({
  page,
  context,
}) => {
  const writes = await mockDriver(page, context, { pointsFail: true });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: (
          _success: unknown,
          error: (value: { code: number }) => void,
        ) => error({ code: 1 }),
      },
      configurable: true,
    });
  });
  await page.goto('/driver/pickups');
  await page
    .getByRole('checkbox', {
      name: 'Pilih kutipan untuk Scheduled',
      exact: true,
    })
    .check();
  await page
    .getByRole('button', { name: 'Optimumkan Laluan', exact: true })
    .click();
  const dialog = page.getByRole('dialog');
  await expect(
    dialog.getByText('Tidak dapat memuatkan pusat kutipan.', { exact: true }),
  ).toBeVisible();
  await dialog.getByRole('button', { name: 'Cuba lagi', exact: true }).click();
  await expect(
    dialog.getByRole('button', { name: 'Cuba lagi', exact: true }),
  ).toHaveCount(0);
  await dialog
    .getByRole('button', { name: 'Dapatkan laluan optimum', exact: true })
    .click();
  await expect(dialog.getByText(/^Lokasi disekat\./)).toBeVisible();
  expect(writes).toEqual([]);
});

test('BM drop-off rejects invalid quantities and waits for proof upload before sending original IDs', async ({
  page,
  context,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const writes = await mockDriver(page, context, { collected: true, gate });
  await page.goto('/driver/drop-off');
  await page
    .getByRole('checkbox', { name: 'Pilih Scheduled', exact: true })
    .check();
  const quantity = page.getByRole('spinbutton', {
    name: 'Kuantiti diserahkan untuk C1001',
    exact: true,
  });
  await quantity.fill('-1');
  await page
    .getByRole('button', { name: 'Serahkan ke pusat (1)', exact: true })
    .click();
  await expect(
    page.getByText('Kuantiti mesti melebihi 0.', { exact: true }),
  ).toBeVisible();
  expect(writes).toEqual([]);
  await quantity.fill('2.5');
  try {
    await page.getByLabel('Foto serahan', { exact: true }).setInputFiles({
      name: 'proof.png',
      mimeType: 'image/png',
      buffer: Buffer.from('synthetic'),
    });
    await expect(
      page.getByRole('button', { name: 'Serahkan ke pusat (1)', exact: true }),
    ).toBeDisabled();
    expect(writes).toEqual([]);
  } finally {
    release();
  }
  await expect(
    page.getByRole('button', { name: 'Serahkan ke pusat (1)', exact: true }),
  ).toBeEnabled();
  await page
    .getByRole('button', { name: 'Serahkan ke pusat (1)', exact: true })
    .click();
  await expect.poll(() => writes.length).toBe(1);
  expect(writes[0]?.body).toEqual({
    items: [{ id: 'pickup-1', delivered_quantity: '2.5' }],
    proof: 'mock/proof.png',
    collection_point: 'point',
  });
});
