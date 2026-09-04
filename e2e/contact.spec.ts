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
  test('submit button is disabled until every required field is valid', async ({
    page,
  }) => {
    await page.goto('/contact');
    const submit = page.getByRole('button', { name: 'Send a Message' });

    await expect(submit).toBeDisabled();

    // InputField/TextareaField (the reusable form components this form
    // now uses) set `data-field` on their wrapper div, not an `id` on
    // the input itself — so field access goes through that, not `#id`.
    await page.locator('[data-field="firstName"] input').fill('Playwright');
    await expect(submit).toBeDisabled();
    await page.locator('[data-field="lastName"] input').fill('E2E');
    await expect(submit).toBeDisabled();
    await page.locator('[data-field="email"] input').fill('not-an-email');
    await expect(submit).toBeDisabled();
    await page.locator('[data-field="phone"] input').fill('+60123456789');
    await expect(submit).toBeDisabled();
    await page.locator('[data-field="subject"] input').fill(uniqueSubject());
    await expect(submit).toBeDisabled();
    await page
      .locator('[data-field="message"] textarea')
      .fill('Should not submit yet.');
    // Email is still invalid — every other field is filled.
    await expect(submit).toBeDisabled();

    await page.locator('[data-field="email"] input').fill('e2e@example.com');
    await expect(submit).toBeEnabled();
  });

  test('submits and shows a success message', async ({ page }) => {
    const subject = uniqueSubject();
    await page.goto('/contact');

    await page.locator('[data-field="firstName"] input').fill('Playwright');
    await page.locator('[data-field="lastName"] input').fill('E2E');
    await page.locator('[data-field="email"] input').fill('e2e@example.com');
    await page.locator('[data-field="phone"] input').fill('+60123456789');
    await page.locator('[data-field="subject"] input').fill(subject);
    await page
      .locator('[data-field="message"] textarea')
      .fill('Submitted by the Playwright e2e suite.');

    const [response] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes('/api/v1/contact/') &&
          res.request().method() === 'POST',
      ),
      page.getByRole('button', { name: 'Send a Message' }).click(),
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
});

test.describe('Admin contact inbox', () => {
  test('can view, search, and delete a message', async ({ page }) => {
    // Seed a message to act on so this test doesn't depend on
    // whatever happens to already be in the inbox.
    const subject = uniqueSubject();
    const seeded = await page.request.post('/api/v1/contact/', {
      data: {
        full_name: 'Admin Delete Target',
        email: 'delete-target@example.com',
        phone_number: '+60123456789',
        subject,
        message: 'Created by the admin e2e test, expected to be deleted.',
      },
    });
    expect(seeded.ok()).toBe(true);

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
    // Not `row` — once the list re-fetches empty, the "No matches for
    // ...'" empty-state text itself contains the subject as a substring
    // and would still match that regex-based row locator. The subject
    // cell rendered it as an exact link, so an exact-text check is
    // actually specific to "the row still exists".
    await expect(page.getByText(subject, { exact: true })).not.toBeVisible();
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
        phone_number: '+60123456789',
        subject,
        message: 'Created by the staff e2e test.',
      },
    });
    expect(created.ok()).toBe(true);
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
