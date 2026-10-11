import type { Metadata } from 'next';

import { SystemSettingsView } from '../../../../components/features/system/components';

export const metadata: Metadata = {
  title: 'System Settings — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminSystemSettingsPage() {
  return <SystemSettingsView />;
}
