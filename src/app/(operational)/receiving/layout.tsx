import type { ReactNode } from 'react';

import { OperationalLayout } from '../../../layouts/OperationalLayout';

export default function ReceivingSegmentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <OperationalLayout role="receiving_officer">{children}</OperationalLayout>
  );
}
