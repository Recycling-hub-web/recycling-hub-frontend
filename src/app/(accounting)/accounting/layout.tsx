import type { ReactNode } from 'react';

import { OperationalLayout } from '../../../layouts/OperationalLayout';

export default function AccountingSegmentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <OperationalLayout role="accounting">{children}</OperationalLayout>;
}
