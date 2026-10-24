import type { Metadata } from 'next';

import { CreatePartnerView } from '../../../../../components/features/partnerships/components';

export const metadata: Metadata = {
  title: 'New Partner — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminCreatePartnerPage() {
  return <CreatePartnerView basePath="/super-admin/partnerships" />;
}
