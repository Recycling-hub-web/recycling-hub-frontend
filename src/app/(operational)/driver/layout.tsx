import type { ReactNode } from 'react';

import { OperationalLayout } from '../../../layouts/OperationalLayout';

export default function DriverSegmentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <OperationalLayout role="driver">{children}</OperationalLayout>;
}
