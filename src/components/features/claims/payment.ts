import type { ClaimListItem } from './types';

/** Sum integer cents so the confirmation matches the server's Decimal sum. */
const claimPaymentTotal = (claims: ClaimListItem[]): string =>
  (
    claims.reduce(
      (cents, claim) =>
        cents +
        Math.round(Number(claim.amount_approved ?? claim.amount_claimed) * 100),
      0,
    ) / 100
  ).toFixed(2);

export { claimPaymentTotal };
