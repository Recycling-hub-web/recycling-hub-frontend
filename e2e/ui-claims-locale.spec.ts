import { loadEnvConfig } from '@next/env';
import type { BrowserContext, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { SignJWT } from 'jose';

loadEnvConfig(process.cwd());
const empty = {
  count: 0,
  results: [],
  next: null,
  previous: null,
  unread_count: 0,
};
const vehicle = {
  id: 'vehicle',
  plate_number: 'ABC 0123',
  vehicle_type: 'van',
  ownership: 'personal',
  has_fleet_card: false,
};
const baseClaim = {
  id: 'claim-1',
  driver: { id: 'driver-1', full_name: 'Paid' },
  category: 'tool',
  vehicle: null,
  date: '2026-08-01',
  amount_claimed: '75.20',
  amount_approved: null,
  receipt: {
    file_key: 'mock/receipt.pdf',
    public_url: 'https://example.test/receipt.pdf',
  },
  payment_proof: null,
  status: 'pending',
  rejection_reason: '',
  reviewed_at: null,
  reviewed_by: null,
  paid_at: null,
  paid_by: null,
  created_at: '2026-08-01T01:00:00Z',
};
const pdf = {
  name: 'receipt.pdf',
  mimeType: 'application/pdf',
  buffer: Buffer.from('%PDF-1.4 synthetic test fixture'),
};
async function setup(
  page: Page,
  context: BrowserContext,
  role = 'accounting',
  options: {
    vehicle?: 'missing' | 'fleet' | 'fail';
    storageGate?: Promise<void>;
    failList?: boolean;
  } = {},
) {
  const token = await new SignJWT({ role, token_type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(
      new TextEncoder().encode(process.env.JWT_VERIFY_SECRET || 'test-only'),
    );
  await context.addCookies([
    { name: 'rh_access', value: token, url: 'http://127.0.0.1:3101' },
    { name: 'NEXT_LOCALE', value: 'bm', url: 'http://127.0.0.1:3101' },
  ]);
  const state = {
    writes: [] as { path: string; body: Record<string, unknown> }[],
    uploads: 0,
    requests: [] as URL[],
  };
  let claims = [
    { ...baseClaim },
    { ...baseClaim, id: 'claim-2', amount_claimed: '24.80' },
    {
      ...baseClaim,
      id: 'claim-3',
      driver: { id: 'driver-2', full_name: 'Other Driver' },
    },
  ];
  let vehicleAttempts = 0;
  let listAttempts = 0;
  await page.route('https://mock-storage.example/**', async (route) => {
    await options.storageGate;
    return route.fulfill({ status: 200 });
  });
  await page.route('**/api/v1/**', (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname;
    if (path.endsWith('/accounts/me/'))
      return route.fulfill({
        json: {
          id: 'test-user',
          role,
          full_name: 'Paid',
          email: 'test@example.com',
          profile_photo: null,
        },
      });
    if (path.endsWith('/storage/presigned-upload-urls')) {
      state.uploads += 1;
      return route.fulfill({
        json: {
          uploads: [
            {
              file_key: 'mock/receipt.pdf',
              upload_url: 'https://mock-storage.example/proof',
              method: 'PUT',
              headers: { 'Content-Type': 'application/pdf' },
              public_url: 'https://example.test/receipt.pdf',
            },
          ],
        },
      });
    }
    if (path.endsWith('/claims/vehicles/mine/')) {
      vehicleAttempts += 1;
      if (options.vehicle === 'missing')
        return route.fulfill({
          status: 404,
          json: { detail: 'No vehicle is assigned to you.' },
        });
      if (options.vehicle === 'fail' && vehicleAttempts === 1)
        return route.fulfill({
          status: 503,
          json: { detail: 'Could not load your assigned vehicle.' },
        });
      return route.fulfill({
        json: {
          ...vehicle,
          ...(options.vehicle === 'fleet'
            ? { ownership: 'company', has_fleet_card: true }
            : {}),
        },
      });
    }
    if (path.endsWith('/claims/') && route.request().method() === 'GET') {
      state.requests.push(url);
      listAttempts += 1;
      if (options.failList && listAttempts === 1)
        return route.fulfill({
          status: 503,
          json: { detail: 'Could not load claims.' },
        });
      return route.fulfill({
        json: {
          ...empty,
          count: options.failList ? 0 : claims.length,
          results: options.failList ? [] : claims,
        },
      });
    }
    if (route.request().method() === 'POST' && path.includes('/claims/')) {
      const body = route.request().postDataJSON();
      state.writes.push({ path, body });
      if (path.endsWith('/reject/'))
        claims = claims.map((c) =>
          c.id === 'claim-1'
            ? {
                ...c,
                status: 'rejected',
                rejection_reason: String(body.rejection_reason),
              }
            : c,
        );
      if (path.endsWith('/approve/'))
        claims = claims.map((c) =>
          c.id === 'claim-1' ? { ...c, status: 'paid' } : c,
        );
      if (path.endsWith('/bulk-pay/'))
        claims = claims.map((c) =>
          (body.claim_ids as string[]).includes(c.id)
            ? { ...c, status: 'paid' }
            : c,
        );
      return route.fulfill({
        json: path.endsWith('/bulk-pay/')
          ? {
              count: 2,
              total_amount: '100.00',
              claim_ids: ['claim-1', 'claim-2'],
              batch_id: 'mock',
            }
          : claims[0],
      });
    }
    if (path.endsWith('/claims/claim-1/'))
      return route.fulfill({ json: claims[0] });
    return route.fulfill({ json: empty });
  });
  return state;
}

for (const role of ['driver', 'staff'])
  test(`BM ${role} claims stay keyboard accessible and read-only`, async ({
    page,
    context,
  }) => {
    const state = await setup(page, context, role);
    await page.goto(`/${role}/claims`);
    await expect(
      page.getByRole('heading', { name: 'Tuntutan Perbelanjaan', exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('checkbox')).toHaveCount(0);
    await expect(
      page.getByRole('link', { name: 'Tuntutan baharu', exact: true }),
    ).toHaveCount(role === 'driver' ? 1 : 0);
    const link = page
      .getByRole('link', { name: 'Lihat tuntutan untuk Paid', exact: true })
      .first();
    await link.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`/${role}/claims/claim-1$`));
    await expect(
      page.getByRole('heading', {
        name: 'Paid — tuntutan Peralatan',
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Tindakan', exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('link', { name: 'Lihat resit', exact: true }),
    ).toHaveAttribute('href', 'https://example.test/receipt.pdf');
    await expect(
      page.locator('img[src="https://example.test/receipt.pdf"]'),
    ).toHaveCount(0);
    expect(state.writes).toEqual([]);
  });

test('driver receipt validation focuses the picker, supports PDFs and blocks submission during upload', async ({
  page,
  context,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const state = await setup(page, context, 'driver', { storageGate: gate });
  await page.goto('/driver/claims/new');
  await page.getByLabel('Kategori').selectOption('tool');
  await page.getByLabel('Jumlah dituntut').fill('75.20');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.getByLabel('Amount claimed')).toHaveValue('75.20');
  await page.getByRole('button', { name: 'BM', exact: true }).click();
  await page
    .getByRole('button', { name: 'Hantar tuntutan', exact: true })
    .click();
  await page
    .getByRole('button', {
      name: 'Muat naik resit untuk tuntutan RM50 atau lebih.',
      exact: true,
    })
    .click();
  const receipt = page.getByLabel('Resit', { exact: true });
  await expect(receipt).toBeFocused();
  await expect(receipt).toHaveAttribute('aria-invalid', 'true');
  await receipt.setInputFiles({
    name: 'bad.exe',
    mimeType: 'application/octet-stream',
    buffer: Buffer.from('test'),
  });
  expect(state.uploads).toBe(0);
  try {
    await receipt.setInputFiles(pdf);
    await expect(
      page.getByRole('button', { name: 'Hantar tuntutan', exact: true }),
    ).toBeDisabled();
    await expect(page.getByLabel('Kategori')).toBeDisabled();
    expect(state.writes).toEqual([]);
  } finally {
    release();
  }
  await expect(
    page.getByRole('button', { name: 'Hantar tuntutan', exact: true }),
  ).toBeEnabled();
  await page
    .getByRole('button', { name: 'Tutup pemberitahuan', exact: true })
    .click();
  await page
    .getByRole('heading', { name: 'Tuntutan perbelanjaan baharu', exact: true })
    .scrollIntoViewIfNeeded();
  await page.screenshot({
    path: 'audit-evidence/batch6-claim-form-bm.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page
    .getByRole('button', { name: 'Hantar tuntutan', exact: true })
    .click();
  await expect(page).toHaveURL(/\/driver\/claims\/claim-1$/);
  expect(state.writes).toHaveLength(1);
  expect(state.writes[0]?.body).toMatchObject({
    category: 'tool',
    amount_claimed: 75.2,
    receipt: 'mock/receipt.pdf',
  });
});

for (const mode of ['missing', 'fleet'] as const)
  test(`petrol ${mode} state explains why the driver cannot submit`, async ({
    page,
    context,
  }) => {
    const state = await setup(page, context, 'driver', { vehicle: mode });
    await page.goto('/driver/claims/new');
    await page.getByLabel('Kategori').selectOption('petrol');
    await expect(
      page.getByText(
        mode === 'missing'
          ? 'Tiada kenderaan ditugaskan kepada anda — hubungi pentadbir sebelum menghantar tuntutan petrol.'
          : 'Bayaran balik kenderaan kad fleet diuruskan terus — tuntutan tidak diperlukan.',
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Hantar tuntutan', exact: true }),
    ).toBeDisabled();
    expect(state.writes).toEqual([]);
  });

test('petrol vehicle lookup retries without clearing the selected category', async ({
  page,
  context,
}) => {
  await setup(page, context, 'driver', { vehicle: 'fail' });
  await page.goto('/driver/claims/new');
  await page.getByLabel('Kategori').selectOption('petrol');
  await expect(
    page.getByText(
      'Tidak dapat memuatkan kenderaan yang ditugaskan kepada anda.',
      { exact: true },
    ),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Cuba lagi', exact: true }).click();
  await expect(
    page.getByText('Kenderaan anda: ABC 0123', { exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel('Kategori')).toHaveValue('petrol');
});

for (const mode of ['approve', 'reject'])
  test(`accounting ${mode} validates required information and sends original values`, async ({
    page,
    context,
  }) => {
    const state = await setup(page, context);
    await page.goto('/accounting/claims/claim-1');
    await page.getByRole('button', { name: 'Tindakan', exact: true }).click();
    await page
      .getByRole('menuitem', {
        name: mode === 'approve' ? 'Luluskan & tandakan dibayar' : 'Tolak',
        exact: true,
      })
      .click();
    const dialog = page.getByRole('dialog');
    const submit = dialog.getByRole('button', {
      name: mode === 'approve' ? 'Luluskan & tandakan dibayar' : 'Tolak',
      exact: true,
    });
    await submit.click();
    expect(state.writes).toEqual([]);
    if (mode === 'approve') {
      await expect(
        dialog.getByText(
          'Muat naik bukti bayaran sebelum meluluskan dan menandakan tuntutan ini sebagai dibayar.',
          { exact: true },
        ),
      ).toBeVisible();
      await dialog
        .getByLabel('Bukti bayaran', { exact: true })
        .setInputFiles(pdf);
      await expect(
        dialog.getByRole('button', { name: 'Buang', exact: true }),
      ).toBeVisible();
    } else {
      await expect(dialog.getByRole('alert')).toBeVisible();
      await dialog.getByLabel('Sebab penolakan').fill('Paid');
    }
    await submit.click();
    await expect(dialog).toBeHidden();
    expect(state.writes).toHaveLength(1);
    expect(state.writes[0]?.body).toMatchObject(
      mode === 'approve'
        ? { payment_proof: 'mock/receipt.pdf' }
        : { rejection_reason: 'Paid' },
    );
  });

test('bulk payment limits selection to one driver and keeps exact totals and proof', async ({
  page,
  context,
}) => {
  const state = await setup(page, context);
  await page.goto('/accounting/claims');
  await page
    .locator('[data-claim-id="claim-1"] input[type="checkbox"]')
    .check();
  await expect(
    page.locator('[data-claim-id="claim-3"] input[type="checkbox"]'),
  ).toBeDisabled();
  await page
    .getByRole('checkbox', {
      name: 'Pilih tuntutan pemandu ini yang menunggu pada halaman ini',
      exact: true,
    })
    .check();
  await page
    .getByRole('button', { name: 'Bayar tuntutan dipilih', exact: true })
    .click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText(/RM\s*100\.00/)).toBeVisible();
  await dialog
    .getByRole('button', { name: 'Sahkan bayaran', exact: true })
    .click();
  expect(state.writes).toEqual([]);
  await expect(
    dialog.getByText('Muat naik bukti bayaran gabungan.', { exact: true }),
  ).toBeVisible();
  await dialog.getByLabel('Bukti bayaran', { exact: true }).setInputFiles(pdf);
  await expect(
    dialog.getByRole('button', { name: 'Buang', exact: true }),
  ).toBeVisible();
  await expect(dialog).toHaveAttribute('data-shown', 'true');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: 'audit-evidence/batch6-bulk-claims-bm-mobile.png',
    fullPage: true,
    animations: 'disabled',
  });
  await dialog
    .getByRole('button', { name: 'Sahkan bayaran', exact: true })
    .click();
  await expect(dialog).toBeHidden();
  expect(state.writes[0]?.body).toEqual({
    claim_ids: ['claim-1', 'claim-2'],
    driver: 'driver-1',
    total_amount: '100.00',
    payment_proof: 'mock/receipt.pdf',
  });
});

test('claims list failures retry into a localized empty state', async ({
  page,
  context,
}) => {
  await setup(page, context, 'accounting', { failList: true });
  await page.goto('/accounting/claims');
  await expect(
    page.getByText('Tidak dapat memuatkan tuntutan.', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Cuba lagi', exact: true }).click();
  await expect(
    page.getByText('Belum ada tuntutan perbelanjaan', { exact: true }),
  ).toBeVisible();
});

test('administrator retains claim review controls without driver-only creation', async ({
  page,
  context,
}) => {
  const state = await setup(page, context, 'super_admin');
  await page.goto('/super-admin/claims');
  await expect(
    page.getByRole('link', { name: 'Tuntutan baharu', exact: true }),
  ).toHaveCount(0);
  await expect(page.getByRole('checkbox')).toHaveCount(4);
  await page
    .getByRole('link', { name: 'Lihat tuntutan untuk Paid', exact: true })
    .first()
    .click();
  await page.getByRole('button', { name: 'Tindakan', exact: true }).click();
  await expect(
    page.getByRole('menuitem', {
      name: 'Luluskan & tandakan dibayar',
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('menuitem', { name: 'Tolak', exact: true }),
  ).toBeVisible();
  expect(state.writes).toEqual([]);
});
