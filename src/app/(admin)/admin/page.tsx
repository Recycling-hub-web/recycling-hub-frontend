import type { Metadata } from 'next';

import { AdminOverviewView } from '../../../components/features/overview/components';

export const metadata: Metadata = {
  title: 'Overview — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminIndexPage() {
  return <AdminOverviewView />;
}
