import type { ReactNode } from 'react';

import { EmptyState } from '../empty/EmptyState';

type TableEmptyRowProps = {
  colSpan: number;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
};

const TableEmptyRow = ({
  colSpan,
  title,
  subtitle,
  action,
}: TableEmptyRowProps) => (
  <tr>
    <td colSpan={colSpan} className="px-6 py-10 text-center">
      <EmptyState title={title} description={subtitle} />
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </td>
  </tr>
);

export { TableEmptyRow };
export type { TableEmptyRowProps };
