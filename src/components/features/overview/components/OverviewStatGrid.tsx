import type { ReactNode } from 'react';

/** Responsive wrapper around a row of OverviewStatCards — 2 columns on
 * mobile, one per card up to 4 wide on desktop. Plain layout only, no
 * assumption about how many cards are passed; spacing to whatever
 * comes next is the caller's job (RoleOverviewLayout's space-y-6, or
 * AdministratorsPanel's own explicit margin on the element after
 * it). */
const OverviewStatGrid = ({ children }: { children: ReactNode }) => (
  <div
    className="grid grid-cols-2 gap-3 lg:grid-cols-4"
    data-testid="overview-stat-grid"
  >
    {children}
  </div>
);

export { OverviewStatGrid };
