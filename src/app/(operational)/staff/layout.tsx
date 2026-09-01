import type { ReactNode } from 'react';

import { OperationalLayout } from '../../../layouts/OperationalLayout';

export default function StaffSegmentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <OperationalLayout role="staff">{children}</OperationalLayout>;
}
