import type { ReactNode } from 'react';

/** Responsive wrapper around a row of OverviewStatCards — 2 columns on
 * mobile, one per card up to 4 wide on desktop. Plain layout only, no
 * assumption about how many cards are passed. */
const OverviewStatGrid = ({ children }: { children: ReactNode }) => (
  <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">{children}</div>
);

export { OverviewStatGrid };
