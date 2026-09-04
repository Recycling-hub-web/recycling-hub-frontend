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
  test('submit is only disabled while in flight, not pre-emptively on validity', async ({
    page,
  }) => {
    await page.goto('/contact');
    const submit = page.getByRole('button', { name: 'Send a Message' });

    // Per the post-submit navigation rule: never disable pre-emptively
    // based on form validity — an entirely empty form still gets a
    // clickable submit button.
    await expect(submit).toBeEnabled();

    await submit.click();

    // Validation error: stay on the page, keep entered values (there
    // are none yet), show inline field errors — never navigate away.
    await expect(page.getByText(/please enter your first name/i)).toBeVisible();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(submit).toBeEnabled();
  });

  test('submits, resets the form in place, and shows a confirmation toast', async ({
    page,
  }) => {
    const subject = uniqueSubject();
    await page.goto('/contact');

    // InputField/TextareaField (the reusable form components this form
    // uses) set `data-field` on their wrapper div, not an `id` on the
    // input itself — so field access goes through that, not `#id`.
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

    // Create action, likely submitted more than once in a row — stays
    // on the same page (no navigation) and the form resets in place,
    // paired with an explicit toast as the actual confirmation.
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByText(/received/i)).toBeVisible();
    await expect(page.locator('[data-field="firstName"] input')).toHaveValue(
      '',
    );
    await expect(page.locator('[data-field="subject"] input')).toHaveValue('');
    await expect(
      page.getByRole('button', { name: 'Send a Message' }),
    ).toBeEnabled();

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

    // Deleted from the list row's own delete action — unrelated to the
    // details page's Actions dropdown (see the edit test below for that).
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

  test('can edit the submitted content, not just status', async ({ page }) => {
    const subject = uniqueSubject();
    const seeded = await page.request.post('/api/v1/contact/', {
      data: {
        full_name: 'Before Edit',
        email: 'before-edit@example.com',
        phone_number: '+60123456789',
        subject,
        message: 'Original message body.',
      },
    });
    expect(seeded.ok()).toBe(true);
    const { id: messageId } = await seeded.json();

    await loginAs(page, 'admin');
    await page.goto(`/admin/contact/${messageId}`);

    // Reply/Edit/Delete are one Actions dropdown on the details page,
    // not three separate header buttons.
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Edit' }).click();
    await expect(page).toHaveURL(`/admin/contact/${messageId}/edit`);

    const nameField = page.locator('[data-field="full_name"] input');
    await expect(nameField).toHaveValue('Before Edit');
    await nameField.fill('After Edit');
    await page.getByRole('button', { name: 'Save changes' }).click();

    // Update/edit action: navigates to the record's details page, with
    // the confirmation shown on arrival there — not a stay-and-reset
    // pattern (that's for create actions only).
    await expect(page).toHaveURL(`/admin/contact/${messageId}`);
    await expect(page.getByText(/message updated/i)).toBeVisible();
    await expect(page.getByText('From After Edit')).toBeVisible();

    await page.request.delete(`/api/v1/contact/${messageId}/`);
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

    // The Actions dropdown only ever contains Reply by email for staff
    // — Edit/Delete menu items don't exist at all, not just hidden.
    await page.getByRole('button', { name: 'Actions' }).click();
    await expect(
      page.getByRole('menuitem', { name: 'Reply by email' }),
    ).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Edit' })).toHaveCount(0);
    await expect(page.getByRole('menuitem', { name: 'Delete' })).toHaveCount(0);
    await page.keyboard.press('Escape');

    // Status is a dropdown, not a button row.
    await page.getByRole('combobox').selectOption('follow_up');
    await expect(page.getByText(/status updated/i)).toBeVisible();

    // The real gate is the backend permission, not the hidden button —
    // confirm a direct API delete attempt as staff is genuinely denied.
    const deleteResponse = await page.request.delete(
      `/api/v1/contact/${messageId}/`,
    );
    expect(deleteResponse.status()).toBe(403);

    // A staff PATCH with content fields is accepted (200) but silently
    // ignored — ContactMessageViewSet.get_serializer_class only hands
    // an admin requester the serializer that recognizes them. Confirm
    // the name genuinely didn't change, not just that no error came
    // back.
    const patchResponse = await page.request.patch(
      `/api/v1/contact/${messageId}/`,
      { data: { full_name: 'Hacked By Staff' } },
    );
    expect(patchResponse.ok()).toBe(true);
    const patched = await patchResponse.json();
    expect(patched.full_name).toBeUndefined();

    // Clean up via admin so this test doesn't leave data behind.
    await loginAs(page, 'admin');
    await page.request.delete(`/api/v1/contact/${messageId}/`);
  });
});
