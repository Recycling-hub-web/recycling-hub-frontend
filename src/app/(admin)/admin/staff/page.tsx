import type { Metadata } from 'next';

import { StaffListView } from '../../../../components/features/staff/components';

export const metadata: Metadata = {
  title: 'Staff Management — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminStaffPage() {
  return <StaffListView />;
}
