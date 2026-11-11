import type { Page } from '@playwright/test';

/**
 * Orders live on their pickup request's page (old /…/pickups/{id} links
 * redirect there with the order open). The request has an "Actions"
 * menu (Edit, Create order, Evaluate, Cancel request); each order card
 * has an "Order actions" menu (Schedule pickup, Mark as collected,
 * Cancel order).
 */

/** An item in whichever menu is open. */
const orderActionItem = (page: Page, name: string | RegExp) =>
  page.getByRole('menuitem', { name, exact: typeof name === 'string' });

/** Open the (first open) order card's "Order actions" menu. */
const openOrderActions = (page: Page) =>
  page
    .getByRole('button', { name: 'Order actions', exact: true })
    .first()
    .click();

/** Pick one of an order's actions. */
const orderAction = async (page: Page, name: string | RegExp) => {
  await openOrderActions(page);
  await orderActionItem(page, name).click();
};

/** Pick one of the pickup request's own actions. */
const requestAction = async (page: Page, name: string | RegExp) => {
  await page.getByRole('button', { name: 'Actions', exact: true }).click();
  await orderActionItem(page, name).click();
};

export { openOrderActions, orderAction, orderActionItem, requestAction };
