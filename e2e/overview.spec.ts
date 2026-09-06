import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

/**
 * Overview dashboards — covers the two real ones (Admin/Staff), built
 * from the reusable components in components/features/overview/. Driver,
 * Receiving Officer, and Accounting get the same shell but no real data
 * yet (see the memory/plan for that scoping decision), so they're
 * checked visually rather than with dedicated e2e coverage here — their
 * seeded accounts aren't activated in this environment.
 *
 * Login already lands on the role's home route (ROLE_HOME in
 * types/auth.ts) — /admin for admin, /staff for staff — so /admin no
 * longer being a bare redirect to /admin/users is covered just by
 * asserting the URL stays put after login.
 */

test.describe('Admin overview', () => {
  test('shows real stats and quick links to every admin module', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    await expect(page).toHaveURL(/\/admin$/);

    // Stats — Admin gets all four, Users included.
    await expect(page.getByText('Total users')).toBeVisible();
    await expect(page.getByText('Pending pickups')).toBeVisible();
    await expect(page.getByText('Pending messages')).toBeVisible();
    await expect(page.getByText('Published posts')).toBeVisible();

    // Quick links — built from ADMIN_NAV_ITEMS, same labels as the
    // sidebar itself (which also has a "Pickup Requests" link, hence
    // scoping to the quick-links grid specifically rather than the
    // first match anywhere on the page).
    const quickLinks = page.getByTestId('overview-quick-links');
    await expect(quickLinks).toBeVisible();
    await quickLinks.getByRole('link', { name: 'Pickup Requests' }).click();
    await expect(page).toHaveURL(/\/admin\/pickups$/);
  });
});

test.describe('Staff overview', () => {
  test('shows the same shape of dashboard, minus the Users stat', async ({
    page,
  }) => {
    await loginAs(page, 'qaStaff');
    await expect(page).toHaveURL(/\/staff$/);

    await expect(page.getByText('Total users')).not.toBeVisible();
    await expect(page.getByText('Pending pickups')).toBeVisible();
    await expect(page.getByText('Pending messages')).toBeVisible();
    await expect(page.getByText('Published posts')).toBeVisible();

    const quickLinks = page.getByTestId('overview-quick-links');
    await expect(quickLinks).toBeVisible();
    await quickLinks.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/\/staff\/contact$/);
  });
});
