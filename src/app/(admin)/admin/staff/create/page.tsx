import type { Metadata } from 'next';

import { CreateStaffView } from '../../../../../components/features/staff/components';

export const metadata: Metadata = {
  title: 'New Staff Member — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function CreateStaffPage() {
  return <CreateStaffView />;
}
