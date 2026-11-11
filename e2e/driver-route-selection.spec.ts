import { loadEnvConfig } from '@next/env';
import { expect, test } from '@playwright/test';
import { SignJWT } from 'jose';

loadEnvConfig(process.cwd());

for (const mobile of [true, false]) {
  test(`seven-stop selection and ${mobile ? 'mobile inline' : 'desktop modal'} route preview`, async ({
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
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByText('C1008', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Next', exact: true }),
    ).toBeDisabled();
    await page
      .getByRole('button', { name: 'Mark pickup for Customer as collected' })
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
    await collectDialog.getByRole('button', { name: 'Close dialog' }).click();
    await page.getByRole('button', { name: 'Select all (up to 7)' }).click();
    await expect(page.getByText('7/7 selected', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Google Maps', exact: true }),
    ).toHaveCount(0);
    await page
      .getByRole('button', { name: 'Optimize Route', exact: true })
      .click();
    const dialog = page.getByRole('dialog', { name: 'Optimize route' });
    await dialog.getByRole('button', { name: 'Get optimized route' }).click();
    if (mobile) await expect(dialog).toHaveCount(0);
    else await expect(dialog).toBeVisible();
    const preview = page.getByRole('region', { name: 'Optimized route' });
    await expect(preview).toBeVisible();
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
        dialog.getByRole('region', { name: 'Optimized route' }),
      ).toBeVisible();
      await expect(dialog.locator('iframe')).toHaveCount(0);
      await dialog.getByRole('button', { name: 'Close dialog' }).click();
    }
    await page.getByRole('button', { name: 'Clear selection' }).click();
    await expect(preview).toHaveCount(0);
  });
}
