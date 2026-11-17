import { expect, test } from '@playwright/test';

import { apiLoginAs } from './helpers/auth';
import { E_WASTE_CATEGORY_ID } from './helpers/categories';
import { requestAction } from './helpers/orderActions';
import { E2E_PHOTO } from './helpers/storage';

test('public posts have server-rendered content and metadata; drafts return 404 even to staff', async ({
  request,
}) => {
  await apiLoginAs(request, 'admin');
  const categories = await request.get('/api/v1/categories/?module=posts');
  const { results } = await categories.json();
  expect(results.length).toBeGreaterThan(0);
  const title = `QA Server Blog ${Date.now()}`;
  const created = await request.post('/api/v1/blogs/', {
    data: {
      title,
      category: results[0].id,
      content: 'QA body present before JavaScript runs.',
      excerpt: 'QA article description',
      meta_title: 'QA custom search title',
      og_title: 'QA custom preview title',
      no_index: true,
      status: 'published',
    },
  });
  expect(created.status(), await created.text()).toBe(201);
  const { id, slug } = await created.json();
  try {
    const response = await request.get(`/resources/blog/${slug}`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('<title>QA custom search title</title>');
    expect(html).toContain('content="QA custom preview title"');
    expect(html).toContain('content="QA article description"');
    expect(html).toMatch(/name="robots" content="[^"]*noindex/);
    expect(html).toContain(`>${title}</h1>`);
    expect(html).toContain('>QA body present before JavaScript runs.</p>');
    const changed = await request.patch(`/api/v1/blogs/${id}/`, {
      data: { status: 'draft' },
    });
    expect(changed.ok()).toBe(true);
    expect((await request.get(`/resources/blog/${slug}`)).status()).toBe(404);
  } finally {
    await request.delete(`/api/v1/blogs/${id}/`);
  }
});

const requestPayload = (fullName: string) => ({
  full_name: fullName,
  phone_number: '+60123456789',
  pickup_address: '1 Jalan QA, Kuala Lumpur',
  orders: [
    {
      items: [
        {
          category: E_WASTE_CATEGORY_ID,
          estimated_quantity: '1',
          quantity_unit: 'kg',
        },
      ],
      photos: [E2E_PHOTO],
    },
  ],
});

test('evaluation traps focus, restores it, and cannot dismiss while saving', async ({
  page,
}) => {
  await apiLoginAs(page.request, 'admin');
  const created = await page.request.post('/api/v1/pickup-requests/', {
    data: requestPayload(`QA Focus ${Date.now()}`),
  });
  expect(created.status(), await created.text()).toBe(201);
  const { id } = await created.json();
  await page.goto(`/admin/pickup-requests/${id}`);
  await requestAction(page, 'Evaluate');
  const dialog = page.getByRole('dialog');
  const close = dialog.getByRole('button', { name: 'Close dialog' });
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(
    dialog.getByRole('button', { name: 'Approve', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole('button', { name: 'Actions', exact: true }),
  ).toBeFocused();
  await requestAction(page, 'Evaluate');
  await dialog.getByLabel('Total price').fill('10');
  let release = () => {};
  let intercepted = false;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(
    `**/api/v1/pickup-requests/${id}/evaluate/`,
    async (route) => {
      intercepted = true;
      await held;
      await route.continue();
    },
  );
  try {
    await dialog.getByRole('button', { name: 'Approve', exact: true }).click();
    await expect.poll(() => intercepted).toBe(true);
    await expect(close).toBeDisabled();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeVisible();
  } finally {
    release();
  }
  await expect(dialog).toBeHidden();
});

test('a delayed old search cannot replace the newest list results', async ({
  page,
}) => {
  await apiLoginAs(page.request, 'admin');
  const suffix = Date.now();
  const slow = `QA Slow ${suffix}`;
  const fast = `QA Fast ${suffix}`;
  // Keep fixture writes sequential so this test also runs on local SQLite.
  const slowCreated = await page.request.post('/api/v1/pickup-requests/', {
    data: requestPayload(slow),
  });
  expect(slowCreated.status(), await slowCreated.text()).toBe(201);
  const fastCreated = await page.request.post('/api/v1/pickup-requests/', {
    data: requestPayload(fast),
  });
  expect(fastCreated.status(), await fastCreated.text()).toBe(201);
  await page.goto('/admin/pickup-requests');
  let release = () => {};
  let intercepted = false;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/api/v1/pickup-requests/?*', async (route) => {
    if (new URL(route.request().url()).searchParams.get('search') === slow) {
      const response = await route.fetch();
      intercepted = true;
      await held;
      await route.fulfill({ response });
    } else await route.continue();
  });
  const search = page.getByPlaceholder(/Search/).first();
  try {
    await search.fill(slow);
    await expect.poll(() => intercepted).toBe(true);
    await search.fill(fast);
    await expect(page.getByText(fast, { exact: true })).toBeVisible();
  } finally {
    release();
  }
  await page.waitForLoadState('networkidle');
  await expect(page.getByText(fast, { exact: true })).toBeVisible();
  await expect(page.getByText(slow, { exact: true })).toHaveCount(0);
});
