import { Children, type ReactNode } from 'react';

/** Responsive wrapper around a row of stat cards — one column on phones, 2 from sm,
 * one per card on wide screens. With five cards it's three columns:
 * the solid lead card spans two rows, the other four sit beside it. Spacing to whatever comes next
 * is the caller's job. */
const OverviewStatGrid = ({ children }: { children: ReactNode }) => {
  const count = Children.count(children);
  return (
    <div
      className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${count >= 5 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}
      data-testid="overview-stat-grid"
    >
      {children}
    </div>
  );
};

export { OverviewStatGrid };
