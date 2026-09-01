import type { ReactNode } from 'react';

import { AdminLayout } from '../../../layouts/AdminLayout';

export default function AdminSegmentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
