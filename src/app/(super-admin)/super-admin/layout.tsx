import type { ReactNode } from 'react';

import { SuperAdminLayout } from '../../../layouts/SuperAdminLayout';

export default function SuperAdminSegmentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SuperAdminLayout>{children}</SuperAdminLayout>;
}
