import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import type { ACCOUNTS } from './helpers/auth';
import { loginAs } from './helpers/auth';

/**
 * Every role's sidebar, now built from the one shared module catalog in
 * src/layouts/navigation.ts (buildNavItems) and rendered by the shared
 * DashboardLayout shell. Checks each role's menu — labels and order —
 * plus the active-item rule (longest matching href wins, exposed as
 * aria-current="page"), and sub-link groups (ui/navigation/
 * SidebarNavGroup) — Blog Posts → All Posts / Tags.
 */

const sidebar = (page: Page) => page.locator('nav').filter({ hasText: 'Menu' });

// Top-level menu entries only — a plain item is a link, an item with
// sub-links is a group button — not the logo link or any sub-link.
const expectMenu = async (page: Page, labels: string[]) => {
  await expect(
    sidebar(page)
      .getByRole('list')
      .first()
      .locator(':scope > li > a, :scope > li > button'),
  ).toHaveText(labels);
};

const blogGroup = (page: Page) =>
  sidebar(page).getByRole('button', { name: 'Blog Posts' });

const MENUS: {
  role: string;
  account: keyof typeof ACCOUNTS;
  home: string;
  labels: string[];
}[] = [
  {
    role: 'Admin',
    account: 'admin',
    home: '/admin',
    labels: [
      'Overview',
      'Users',
      'Staff',
      'Pickup Requests',
      'Contact',
      'Categories',
      'Collection Points',
      'Blog Posts',
      'Partnerships',
      'Finance Records',
      'Notifications',
    ],
  },
  {
    role: 'Super Admin',
    account: 'qaSuperAdmin',
    home: '/super-admin',
    labels: [
      'Overview',
      'Administrators',
      'Pickup Requests',
      'Contact',
      'Categories',
      'Collection Points',
      'Storage Files',
      'Blog Posts',
      'Partnerships',
      'Finance Records',
      'Activity Log',
    ],
  },
  {
    role: 'Staff',
    account: 'qaStaff',
    home: '/staff',
    labels: [
      'Overview',
      'Pickup Requests',
      'Contact',
      'Categories',
      'Collection Points',
      'Storage Files',
      'Blog Posts',
      'Partnerships',
      'Finance Records',
      'Notifications',
    ],
  },
  {
    role: 'Driver',
    account: 'qaDriver',
    home: '/driver',
    labels: [
      'Overview',
      'Pickup Requests',
      'Drop Off to Store',
      'Finance Records',
      'Notifications',
    ],
  },
  {
    role: 'Receiving Officer',
    account: 'qaReceivingOfficer',
    home: '/receiving',
    labels: ['Overview', 'Deliveries', 'Notifications'],
  },
  {
    role: 'Accounting',
    account: 'qaAccounting',
    home: '/accounting',
    labels: ['Overview', 'Finance Records', 'Notifications'],
  },
];

for (const { role, account, home, labels } of MENUS) {
  test(`${role} sidebar shows its own menu, Overview active on home`, async ({
    page,
  }) => {
    await loginAs(page, account);
    await page.goto(home);
    await expectMenu(page, labels);
    await expect(
      sidebar(page).getByRole('link', { name: 'Overview' }),
    ).toHaveAttribute('aria-current', 'page');
  });
}

test('Super Admin sidebar hides System Settings, page still opens by URL', async ({
  page,
}) => {
  await loginAs(page, 'qaSuperAdmin');
  await page.goto('/super-admin');
  await expect(
    sidebar(page).getByRole('link', { name: 'System Settings' }),
  ).toHaveCount(0);

  await page.goto('/super-admin/system');
  await expect(page).toHaveURL(/\/super-admin\/system$/);
});

test('a sub-page highlights its own section, not Overview', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  await page.goto('/admin/categories/create');

  await expect(
    sidebar(page).getByRole('link', { name: 'Categories' }),
  ).toHaveAttribute('aria-current', 'page');
  await expect(
    sidebar(page).getByRole('link', { name: 'Overview' }),
  ).not.toHaveAttribute('aria-current', 'page');
});

test('clicking a sidebar link navigates and moves the highlight', async ({
  page,
}) => {
  await loginAs(page, 'qaStaff');
  await page.goto('/staff');
  await sidebar(page).getByRole('link', { name: 'Contact' }).click();

  await expect(page).toHaveURL(/\/staff\/contact$/);
  await expect(
    sidebar(page).getByRole('link', { name: 'Contact' }),
  ).toHaveAttribute('aria-current', 'page');
});

test.describe('Sub-link group (Blog Posts)', () => {
  test('starts collapsed elsewhere, expands on click, and navigates', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin');

    await expect(blogGroup(page)).toHaveAttribute('aria-expanded', 'false');
    await expect(sidebar(page).getByRole('link', { name: 'Tags' })).toHaveCount(
      0,
    );

    await blogGroup(page).click();
    await expect(blogGroup(page)).toHaveAttribute('aria-expanded', 'true');
    await sidebar(page).getByRole('link', { name: 'Tags' }).click();

    await expect(page).toHaveURL(/\/admin\/blogs\/tags$/);
    await expect(
      sidebar(page).getByRole('link', { name: 'Tags' }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(
      sidebar(page).getByRole('link', { name: 'All Posts' }),
    ).not.toHaveAttribute('aria-current', 'page');
  });

  test('opens on its own when landing on one of its pages', async ({
    page,
  }) => {
    await loginAs(page, 'qaStaff');
    await page.goto('/staff/blogs');

    await expect(blogGroup(page)).toHaveAttribute('aria-expanded', 'true');
    await expect(
      sidebar(page).getByRole('link', { name: 'All Posts' }),
    ).toHaveAttribute('aria-current', 'page');
  });

  test('a post sub-page highlights All Posts, collapses on click', async ({
    page,
  }) => {
    await loginAs(page, 'qaSuperAdmin');
    await page.goto('/super-admin/blogs/create');

    await expect(
      sidebar(page).getByRole('link', { name: 'All Posts' }),
    ).toHaveAttribute('aria-current', 'page');

    await blogGroup(page).click();
    await expect(blogGroup(page)).toHaveAttribute('aria-expanded', 'false');
    await expect(
      sidebar(page).getByRole('link', { name: 'All Posts' }),
    ).toHaveCount(0);
  });
});
