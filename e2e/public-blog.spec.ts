import { expect, test } from '@playwright/test';

import { apiLoginAs, loginAs } from './helpers/auth';

/**
 * Public blog (/resources/blog) — the read-only, unauthenticated
 * counterpart to the admin/staff Blog Posts feature
 * (components/features/blogs/). Reuses the same hooks/service the admin
 * panel uses (useBlogPosts/useBlogPost) since GET /blogs/ and
 * GET /blogs/<slug>/ already only ever return published posts for an
 * anonymous request (BlogPostViewSet.get_queryset) — the backend is the
 * real gate, not anything client-side.
 */

const uniqueTitle = (label: string) => `E2E Public Blog ${label} ${Date.now()}`;

test.describe('Public blog', () => {
  test('the Resources page links to the blog', async ({ page }) => {
    await page.goto('/resources');
    const link = page.getByRole('link', { name: /visit the blog/i });
    await link.scrollIntoViewIfNeeded();
    await expect(link).toHaveAttribute('href', '/resources/blog');
  });

  test('lists published posts and renders one by its slug', async ({
    page,
  }) => {
    await page.goto('/resources/blog');

    const card = page
      .getByRole('link', { name: /5 tips for sorting your recyclables/i })
      .first();
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute(
      'href',
      '/resources/blog/5-tips-for-sorting-your-recyclables',
    );

    await card.click();
    await expect(page).toHaveURL(
      '/resources/blog/5-tips-for-sorting-your-recyclables',
    );
    await expect(
      page.getByRole('heading', {
        name: '5 Tips for Sorting Your Recyclables',
      }),
    ).toBeVisible();
    await expect(
      page.getByText(/sorting materials correctly before pickup/i),
    ).toBeVisible();
  });

  test('never exposes a draft post — not in the list, not by its slug', async ({
    page,
  }) => {
    const title = uniqueTitle('Draft');

    await loginAs(page, 'admin');
    const created = await page.request.post('/api/v1/blogs/', {
      data: { title, content: 'Draft body, should never be public.' },
    });
    expect(created.ok()).toBe(true);
    const { id, slug } = await created.json();

    // Log out — the public pages must not lean on an authenticated
    // session leaking staff-only visibility. apiFetch always sends
    // credentials, so without this the draft would still be visible to
    // this same browser context simply because it's still logged in.
    await page.context().clearCookies();

    await page.goto('/resources/blog');
    await expect(page.getByText(title)).not.toBeVisible();

    await page.goto(`/resources/blog/${slug}`);
    await expect(
      page.getByText(/doesn't exist or isn't published/i),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: title })).toHaveCount(0);

    await apiLoginAs(page.request, 'admin');
    await page.request.delete(`/api/v1/blogs/${id}/`);
  });
});
