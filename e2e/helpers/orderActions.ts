import type { Page } from '@playwright/test';

/**
 * Details pages keep their actions in one Actions dropdown — the order
 * page (View pickup request, Schedule pickup, Mark as collected,
 * Cancel) and the pickup request page (Edit, Create order, Evaluate,
 * Cancel request). These open it and pick or find an item.
 */

const openOrderActions = (page: Page) =>
  page.getByRole('button', { name: 'Actions', exact: true }).click();

/** An item in the (already open) Actions menu. */
const orderActionItem = (page: Page, name: string | RegExp) =>
  page.getByRole('menuitem', { name, exact: typeof name === 'string' });

/** Open the Actions menu and click one of its items. */
const orderAction = async (page: Page, name: string | RegExp) => {
  await openOrderActions(page);
  await orderActionItem(page, name).click();
};

export { openOrderActions, orderAction, orderActionItem };
