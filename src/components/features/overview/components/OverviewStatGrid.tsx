import { Children, type ReactNode } from 'react';

/** Responsive wrapper around a row of stat cards — one column on phones, 2 from sm,
 * one per card on wide screens. With five cards it's three columns:
 * the solid lead card spans two rows, the other four sit beside it. Spacing to whatever comes next
 * is the caller's job. */
const OverviewStatGrid = ({ children }: { children: ReactNode }) => {
  const count = Children.count(children);
  let columns = 'lg:grid-cols-4';
  if (count <= 1) columns = 'lg:grid-cols-1';
  else if (count === 2) columns = 'lg:grid-cols-2';
  else if (count === 3 || count >= 5) columns = 'lg:grid-cols-3';
  return (
    <div
      className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${columns}`}
      data-testid="overview-stat-grid"
    >
      {children}
    </div>
  );
};

export { OverviewStatGrid };
