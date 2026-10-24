import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import type { ACCOUNTS } from './helpers/auth';
import { loginAs } from './helpers/auth';

/**
 * Every role's sidebar, built in src/layouts/navigation.ts
 * (buildNavSections) and rendered by the shared Sidebar: headed sections,
 * with related pages grouped as expandable sub-links (ui/navigation/
 * SidebarNavGroup) — e.g. Pickups → Pickup Requests / Orders, Finance →
 * Finance Records / Expense Claims. Also checks the active-item rule
 * (longest matching href wins, exposed as aria-current="page").
 */

const sidebar = (page: Page) =>
  page.locator('nav').filter({ has: page.locator('ul[data-nav-section]') });

// Section headings, in order.
const expectSections = async (page: Page, titles: string[]) => {
  const lists = sidebar(page).locator('ul[data-nav-section]');
  await expect(lists).toHaveCount(titles.length);
  const actual = await lists.evaluateAll((uls) =>
    uls.map((ul) => ul.getAttribute('data-nav-section')),
  );
  expect(actual).toEqual(titles);
};

// Top-level entries across every section, in order — a plain item is a
// link, a group is a button; sub-links aren't included.
const expectMenu = async (page: Page, labels: string[]) => {
  await expect(
    sidebar(page).locator(
      'ul[data-nav-section] > li > a, ul[data-nav-section] > li > button',
    ),
  ).toHaveText(labels);
};

const group = (page: Page, name: string) =>
  sidebar(page).getByRole('button', { name, exact: true });

const MENUS: {
  role: string;
  account: keyof typeof ACCOUNTS;
  home: string;
  sections: string[];
  labels: string[];
}[] = [
  {
    role: 'Admin',
    account: 'admin',
    home: '/admin',
    sections: ['Main', 'Operations', 'Finance', 'Content', 'People'],
    labels: [
      'Overview',
      'Notifications',
      'Pickups',
      'Collection Points',
      'Vehicles',
      'Finance',
      'Blog Posts',
      'Categories',
      'Partnerships',
      'Contact',
      'Users',
      'Staff',
    ],
  },
  {
    role: 'Super Admin',
    account: 'qaSuperAdmin',
    home: '/super-admin',
    sections: ['Main', 'Operations', 'Finance', 'Content', 'People', 'System'],
    labels: [
      'Overview',
      'Pickups',
      'Collection Points',
      'Finance',
      'Blog Posts',
      'Categories',
      'Partnerships',
      'Contact',
      'Storage Files',
      'Administrators',
      'Activity Log',
    ],
  },
  {
    role: 'Staff',
    account: 'qaStaff',
    home: '/staff',
    sections: ['Main', 'Operations', 'Finance', 'Content'],
    labels: [
      'Overview',
      'Notifications',
      'Pickups',
      'Collection Points',
      'Vehicles',
      'Finance',
      'Blog Posts',
      'Categories',
      'Partnerships',
      'Contact',
      'Storage Files',
    ],
  },
  {
    role: 'Driver',
    account: 'qaDriver',
    home: '/driver',
    sections: ['Main', 'Work', 'Finance'],
    labels: [
      'Overview',
      'Notifications',
      'Orders',
      'Drop Off to Store',
      'Finance',
    ],
  },
  {
    role: 'Receiving Officer',
    account: 'qaReceivingOfficer',
    home: '/receiving',
    sections: ['Main', 'Work'],
    labels: ['Overview', 'Notifications', 'Deliveries'],
  },
  {
    role: 'Accounting',
    account: 'qaAccounting',
    home: '/accounting',
    sections: ['Main', 'Finance'],
    labels: ['Overview', 'Notifications', 'Finance'],
  },
];

for (const { role, account, home, sections, labels } of MENUS) {
  test(`${role} sidebar shows its own sections and menu, Overview active on home`, async ({
    page,
  }) => {
    await loginAs(page, account);
    await page.goto(home);
    await expectSections(page, sections);
    await expectMenu(page, labels);
    await expect(
      sidebar(page).getByRole('link', { name: 'Overview' }),
    ).toHaveAttribute('aria-current', 'page');
  });
}

test('Blog Posts is a plain link — there is no Tags page any more', async ({
  page,
}) => {
  await loginAs(page, 'admin');
  await page.goto('/admin');
  await expect(
    sidebar(page).getByRole('link', { name: 'Blog Posts' }),
  ).toBeVisible();
  await expect(sidebar(page).getByRole('link', { name: 'Tags' })).toHaveCount(
    0,
  );
});

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
  await loginAs(page, 'admin');
  await page.goto('/admin');
  await sidebar(page).getByRole('link', { name: 'Contact' }).click();

  await expect(page).toHaveURL(/\/admin\/contact$/);
  await expect(
    sidebar(page).getByRole('link', { name: 'Contact' }),
  ).toHaveAttribute('aria-current', 'page');
});

test.describe('Sub-link group (Pickups)', () => {
  test('starts collapsed elsewhere, expands on click, and navigates', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin');

    await expect(group(page, 'Pickups')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await expect(
      sidebar(page).getByRole('link', { name: 'Orders' }),
    ).toHaveCount(0);

    await group(page, 'Pickups').click();
    await expect(group(page, 'Pickups')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await sidebar(page).getByRole('link', { name: 'Orders' }).click();

    await expect(page).toHaveURL(/\/admin\/pickups$/);
    await expect(
      sidebar(page).getByRole('link', { name: 'Orders' }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(
      sidebar(page).getByRole('link', { name: 'Pickup Requests' }),
    ).not.toHaveAttribute('aria-current', 'page');
  });

  test('opens on its own when landing on one of its pages', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin/pickup-requests');

    await expect(group(page, 'Pickups')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(
      sidebar(page).getByRole('link', { name: 'Pickup Requests' }),
    ).toHaveAttribute('aria-current', 'page');
  });

  test('a sub-page highlights its page, and the group collapses on click', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin/pickup-requests/create');

    await expect(
      sidebar(page).getByRole('link', { name: 'Pickup Requests' }),
    ).toHaveAttribute('aria-current', 'page');

    await group(page, 'Pickups').click();
    await expect(group(page, 'Pickups')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await expect(
      sidebar(page).getByRole('link', { name: 'Pickup Requests' }),
    ).toHaveCount(0);
  });

  test('Finance groups Finance Records and Expense Claims', async ({
    page,
  }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin');
    await group(page, 'Finance').click();
    await expect(
      sidebar(page).getByRole('link', { name: 'Finance Records' }),
    ).toBeVisible();
    await expect(
      sidebar(page).getByRole('link', { name: 'Expense Claims' }),
    ).toBeVisible();
  });
});
