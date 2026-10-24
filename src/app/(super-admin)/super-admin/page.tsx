import type { Metadata } from 'next';

import { SuperAdminOverviewView } from '../../../components/features/overview/components';

export const metadata: Metadata = {
  title: 'Overview — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminIndexPage() {
  return <SuperAdminOverviewView />;
}
