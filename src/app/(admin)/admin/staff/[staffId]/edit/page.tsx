import type { Metadata } from 'next';

import { EditStaffView } from '../../../../../../components/features/staff/components';

export const metadata: Metadata = {
  title: 'Edit Staff Profile — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function EditStaffPage({
  params,
}: {
  params: { staffId: string };
}) {
  return <EditStaffView staffId={params.staffId} />;
}
