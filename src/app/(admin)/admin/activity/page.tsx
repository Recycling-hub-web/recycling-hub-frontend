import type { Metadata } from 'next';

import { ActivityLogView } from '../../../../components/features/activity/components';

export const metadata: Metadata = {
  title: 'Activity Log — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminActivityPage() {
  return <ActivityLogView />;
}
