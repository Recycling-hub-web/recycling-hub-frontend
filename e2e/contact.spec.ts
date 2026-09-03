import { expect, test } from '@playwright/test';

import { apiLoginAs, loginAs } from './helpers/auth';

/**
 * Contact Us module — covers all three surfaces built for it:
 * the public submission form, and the shared admin/staff inbox
 * (parametrized by basePath/canDelete — see
 * components/features/contact/components/).
 */

const uniqueSubject = () => `E2E Contact Test ${Date.now()}`;

test.describe('Public contact form', () => {
  test('submits and shows a success message', async ({ page }) => {
    const subject = uniqueSubject();
    await page.goto('/contact');

    await page.locator('#fullName').fill('Playwright E2E');
    await page.locator('#email').fill('e2e@example.com');
    await page.locator('#subject').fill(subject);
    await page
      .locator('#message')
      .fill('Submitted by the Playwright e2e suite.');

    const [response] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes('/api/v1/contact/') &&
          res.request().method() === 'POST',
      ),
      page.getByRole('button', { name: 'Send Message' }).click(),
    ]);

    await expect(page.getByText(/received/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Message Sent' }),
    ).toBeVisible();

    // Keep the dev DB tidy across repeated runs.
    const { id } = await response.json();
    await apiLoginAs(page.request, 'admin');
    await page.request.delete(`/api/v1/contact/${id}/`);
  });

  test('blocks submission with an invalid email', async ({ page }) => {
    await page.goto('/contact');
    await page.locator('#fullName').fill('Playwright E2E');
    await page.locator('#email').fill('not-an-email');
    await page.locator('#subject').fill(uniqueSubject());
    await page.locator('#message').fill('Should not submit.');

    await page.getByRole('button', { name: 'Send Message' }).click();

    await expect(page.getByText(/valid email/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Message Sent' }),
    ).not.toBeVisible();
  });
});

test.describe('Admin contact inbox', () => {
  test('can view, search, and delete a message', async ({ page }) => {
    // Seed a message to act on so this test doesn't depend on
    // whatever happens to already be in the inbox.
    const subject = uniqueSubject();
    await page.request.post('/api/v1/contact/', {
      data: {
        full_name: 'Admin Delete Target',
        email: 'delete-target@example.com',
        subject,
        message: 'Created by the admin e2e test, expected to be deleted.',
      },
    });

    await loginAs(page, 'admin');
    await page.goto('/admin/contact');

    await page
      .getByPlaceholder(/search by name, email, or subject/i)
      .fill(subject);
    const row = page.getByRole('row', { name: new RegExp(subject) });
    await expect(row).toBeVisible();

    await row.getByRole('button', { name: /delete message from/i }).click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();

    await expect(page.getByText(/message deleted/i)).toBeVisible();
    await expect(row).not.toBeVisible();
  });
});

test.describe('Staff contact inbox', () => {
  test('can view and update status, but has no delete action', async ({
    page,
  }) => {
    const subject = uniqueSubject();
    const created = await page.request.post('/api/v1/contact/', {
      data: {
        full_name: 'Staff View Target',
        email: 'staff-target@example.com',
        subject,
        message: 'Created by the staff e2e test.',
      },
    });
    const { id: messageId } = await created.json();

    await loginAs(page, 'qaStaff');
    await page.goto('/staff/contact');

    await page
      .getByPlaceholder(/search by name, email, or subject/i)
      .fill(subject);
    const row = page.getByRole('row', { name: new RegExp(subject) });
    await expect(row).toBeVisible();
    await expect(
      row.getByRole('button', { name: /delete message from/i }),
    ).toHaveCount(0);

    await row.getByRole('link', { name: /view message from/i }).click();
    await expect(page).toHaveURL(new RegExp(`/staff/contact/${messageId}`));
    await expect(
      page.getByRole('button', { name: 'Delete', exact: true }),
    ).toHaveCount(0);

    await page.getByRole('button', { name: 'Follow-up' }).click();
    await expect(page.getByText(/status updated/i)).toBeVisible();

    // The real gate is the backend permission, not the hidden button —
    // confirm a direct API delete attempt as staff is genuinely denied.
    const deleteResponse = await page.request.delete(
      `/api/v1/contact/${messageId}/`,
    );
    expect(deleteResponse.status()).toBe(403);

    // Clean up via admin so this test doesn't leave data behind.
    await loginAs(page, 'admin');
    await page.request.delete(`/api/v1/contact/${messageId}/`);
  });
});
