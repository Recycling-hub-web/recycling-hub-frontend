import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Drives the staff "New pickup request" step form (PickupRequestCreateView):
 * Customer → Pickup → Orders → Review and submit. Each fill* fills its
 * step and clicks Continue unless told not to.
 */

const futureLocal = (hoursFromNow = 48) =>
  new Date(Date.now() + hoursFromNow * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

const stepHeading = (page: Page, name: string) =>
  page.getByRole('heading', { level: 2, name, exact: true });

const clickContinue = (page: Page) =>
  page.getByRole('button', { name: 'Continue' }).click();

type CustomerInput = {
  fullName: string;
  phone?: string;
  requestType?: 'individual' | 'business';
  email?: string;
};

const fillCustomer = async (
  page: Page,
  { fullName, phone = '123456789', requestType, email }: CustomerInput,
  { submit = true } = {},
) => {
  await expect(stepHeading(page, 'Customer')).toBeVisible();
  await page.locator('[data-field="full_name"] input').fill(fullName);
  if (requestType) {
    await page
      .locator('[data-field="request_type"] select')
      .selectOption(requestType);
  }
  if (email) await page.locator('[data-field="email"] input').fill(email);
  await page.locator('[data-field="phone_local"] input').fill(phone);
  if (submit) await clickContinue(page);
};

type PickupInput = {
  when?: string;
  address?: string;
  note?: string;
};

const fillPickup = async (
  page: Page,
  {
    when = futureLocal(),
    address = '1 Jalan Test, 50000 Kuala Lumpur',
    note,
  }: PickupInput = {},
  { submit = true } = {},
) => {
  await expect(stepHeading(page, 'Pickup')).toBeVisible();
  await page.locator('[data-field="requested_at"] input').fill(when);
  await page.locator('[data-field="pickup_address"] input').fill(address);
  if (note) await page.locator('[data-field="note"] textarea').fill(note);
  if (submit) await clickContinue(page);
};

/** From the Orders step to the review (no orders, or the ones added). */
const finishOrders = async (page: Page) => {
  await expect(stepHeading(page, 'Orders')).toBeVisible();
  await clickContinue(page);
  await expect(stepHeading(page, 'Review and submit')).toBeVisible();
};

const createRequest = (page: Page) =>
  page.getByRole('button', { name: 'Create request' }).click();

export {
  clickContinue,
  createRequest,
  fillCustomer,
  fillPickup,
  finishOrders,
  futureLocal,
  stepHeading,
};
