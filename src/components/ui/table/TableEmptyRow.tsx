import type { ReactNode } from 'react';

import { EmptyState } from '../empty/EmptyState';

/** A table's empty state — EmptyState inside a full-width row, so it
 * needs the same icon + title + subtitle. */
type TableEmptyRowProps = {
  colSpan: number;
  icon: ReactNode;
  title: string;
  subtitle: string;
  action?: ReactNode;
};

const TableEmptyRow = ({
  colSpan,
  icon,
  title,
  subtitle,
  action,
}: TableEmptyRowProps) => (
  <tr>
    <td colSpan={colSpan} className="px-6 py-4 text-center">
      <EmptyState icon={icon} title={title} description={subtitle} />
      {action && <div className="mb-6 flex justify-center">{action}</div>}
    </td>
  </tr>
);

export { TableEmptyRow };
export type { TableEmptyRowProps };
